describe("MOM Reserve Flow", () => {
    const closeNotifIfExists = () => {
        cy.get("body").then(($body) => {
            if ($body.find('button.btn.close[data-bs-dismiss="modal"]').length) {
                cy.get('button.btn.close[data-bs-dismiss="modal"]').click({ force: true });
            }
        });
    };

    const pickFirstOptionByPlaceholder = (placeholderText) => {
        cy.get(`input.vs__search[placeholder="${placeholderText}"]`)
            .should("be.visible")
            .click({ force: true })
            .type("{downarrow}{enter}", { delay: 0 });
    };

    beforeEach(() => {
        cy.viewport(1200, 660);

        // Ignore Sentry so it doesn't fail tests
        cy.intercept("POST", "https://sentry.mom.ir/api/**", {
            statusCode: 200,
            body: { ok: true },
        }).as("sentry");
    });

    it("should complete the reservation flow", () => {
        cy.visit("https://mom.ir/");
        cy.get("body").should("be.visible");

        closeNotifIfExists();

        // 4 dropdowns (choose first option via keyboard)
        pickFirstOptionByPlaceholder("انتخاب کلینیک");
        closeNotifIfExists();

        pickFirstOptionByPlaceholder("انتخاب پزشک");
        closeNotifIfExists();

        pickFirstOptionByPlaceholder("انتخاب تاریخ");
        closeNotifIfExists();

        pickFirstOptionByPlaceholder("انتخاب ساعت");
        closeNotifIfExists();

        // Reserve
        cy.get("#reserveBtn").should("be.visible").click({ force: true });

        // Step 1 modal: wait for actual controls
        cy.get(".input-group.onlineReserve.mobile").should("be.visible");
        cy.get("#mobile").should("be.visible").clear().type("9334546384");

        cy.get('button.btn.btn-green.onlineReserve[type="submit"]')
            .should("be.visible")
            .click({ force: true });

        // Step 2 modal: fill form fields
        cy.get("#fullName").should("be.visible").clear().type("test user");
        cy.get("#nationalCode").should("be.visible").clear().type("8630111100");

        // OTP (static 1234) - using the 4 OTP boxes
        const otp = "1234";
        cy.get(".form-group.otp input.form-control.text-center")
            .should("have.length", 4)
            .each(($input, idx) => {
                cy.wrap($input).should("be.visible").clear({ force: true }).type(otp[idx], { force: true });
            });

        closeNotifIfExists();

        cy.get("#turnClickComp").should("be.visible").click({ force: true });

        // Final page
        cy.get("#reservation").should("be.visible");

        cy.get("#reservation").within(() => {
            const mustHaveValue = (label) => {
                cy.contains("p", label)
                    .should("be.visible")
                    .invoke("text")
                    .then((txt) => {
                        // Expect something after ":" (non-empty value)
                        const parts = txt.split(":");
                        expect(parts.length, `${label} should contain ":"`).to.be.greaterThan(1);

                        const value = parts.slice(1).join(":").trim();
                        expect(value, `${label} should have a value`).to.not.equal("");
                    });
            };

            mustHaveValue("کد رهگیری نوبت");
            mustHaveValue("نام و نام خانوادگی");
            mustHaveValue("کلینیک");
            mustHaveValue("پزشک");
            mustHaveValue("تاریخ");
            mustHaveValue("ساعت");
        });

    });
});
