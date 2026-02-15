describe("MOM Reserve Flow", () => {
    const closeNotifIfExists = () => {
        cy.get("body").then(($body) => {
            if ($body.find('button.btn.close[data-bs-dismiss="modal"]').length) {
                cy.get('button.btn.close[data-bs-dismiss="modal"]').click({ force: true });
            }
        });
    };

    const pickRandomOption = (dropdownSelector) => {
        // Get all the options in the dropdown and pick a random one
        cy.get(dropdownSelector).then((dropdown) => {
            const options = dropdown.find('.vs__dropdown-option'); // Find all the options in the dropdown
            const randomIndex = Math.floor(Math.random() * options.length); // Pick a random index
            cy.wrap(options[randomIndex]).click({ force: true }); // Click the random option
        });
    };

    // Function to select doctor by index
    const selectDoctorByIndex = (index = 0) => {
        // Find the doctor dropdown container and click to open it
        cy.contains('.form-group', 'پزشک').within(() => {
            cy.get('.vs__dropdown-toggle').click({ force: true });
        });

        // Randomly select a doctor
        cy.get('.vs__dropdown-menu .vs__dropdown-option').then(($options) => {
            const randomIndex = Math.floor(Math.random() * $options.length); // Pick a random index
            cy.wrap($options[randomIndex]).click({ force: true });
        });
    };

    // Function to attempt date selection with retry logic
    const selectDateWithRetry = (maxRetries = 5, currentDoctorIndex = 0) => {
        if (currentDoctorIndex >= maxRetries) {
            throw new Error("No available appointments found after trying multiple doctors");
        }

        // Try to click on the date dropdown
        cy.contains('.form-group', 'تاریخ').within(() => {
            cy.get('.vs__dropdown-toggle')
                .should('be.visible')  // Ensure the dropdown is visible
                .click({ force: true }); // Force-click the date dropdown
        });

        // Small wait to allow dropdown to load available dates
        cy.wait(500);

        // Check if there is a message indicating no appointments
        cy.get('body').then(($body) => {
            const noAppointmentMsg = "متاسفانه تمامی وقت های دکتر قبلا نوبت دهی شده است، لطفا دکتر دیگری را انتخاب نمایید";
            
            if ($body.text().includes(noAppointmentMsg)) {
                cy.log(`Doctor ${currentDoctorIndex} has no appointments, trying next doctor...`);

                closeNotifIfExists();  // Close any pop-ups if they exist

                // Go back and select the next doctor
                selectDoctorByIndex(currentDoctorIndex + 1);  // Select the next doctor in the list

                closeNotifIfExists();  // Close any potential modal

                // Recursively try again with the new doctor
                selectDateWithRetry(maxRetries, currentDoctorIndex + 1);
            } else {
                // Appointments are available, select the first available date
                cy.get('.vs__dropdown-menu .vs__dropdown-option')
                    .first()
                    .click({ force: true });
            }
        });
    };

    const selectTimeSlot = () => {
        cy.contains('.form-group', 'ساعت').within(() => {
            cy.get('.vs__dropdown-toggle').click({ force: true });
        });
        
        cy.get('.vs__dropdown-menu .vs__dropdown-option')
            .first()
            .click({ force: true });
    };

    beforeEach(() => {
        cy.viewport(1200, 660);
        cy.intercept("POST", "https://sentry.mom.ir/api/", {
            statusCode: 200,
            body: { ok: true },
        }).as("sentry");
    });

    it("should complete the reservation flow with random clinic and doctor", () => {
        cy.visit("https://rc1.mom.ir/");
        cy.get("body").should("be.visible");

        closeNotifIfExists();

        // Step 1: Select a random clinic
        pickRandomOption("input.vs__search[placeholder='انتخاب کلینیک']");
        closeNotifIfExists();

        // Step 2: Select a random doctor
        selectDoctorByIndex(0); // Randomly pick a doctor
        closeNotifIfExists();

        // Step 3: Select date with retry logic (will try different doctors if needed)
        selectDateWithRetry();
        closeNotifIfExists();

        // Step 4: Select time slot
        selectTimeSlot();
        closeNotifIfExists();

        // Step 5: Click reserve button
        cy.get("#reserveBtn").should("be.visible").click({ force: true });

        // Step 6: Enter mobile number
        cy.get(".input-group.onlineReserve.mobile").should("be.visible");
        cy.get("#mobile").should("be.visible").clear().type("9334546384");
        cy.get('button.btn.btn-green.onlineReserve[type="submit"]')
            .should("be.visible")
            .click({ force: true });

        // Step 7: Fill user details
        cy.get("#fullName").should("be.visible").clear().type("test user");
        cy.get("#nationalCode").should("be.visible").clear().type("8630111100");

        // Step 8: Enter OTP
        const otp = "1234";
        cy.get(".form-group.otp input.form-control.text-center")
            .should("have.length", 4)
            .each(($input, idx) => {
                cy.wrap($input).should("be.visible").clear({ force: true }).type(otp[idx], { force: true });
            });

        closeNotifIfExists();

        // Step 9: Complete reservation
        cy.get("#turnClickComp").should("be.visible").click({ force: true });

        // Step 10: Verify reservation details
        cy.get("#reservation").should("be.visible");
        cy.get("#reservation").within(() => {
            const mustHaveValue = (label) => {
                cy.contains("p", label)
                    .should("be.visible")
                    .invoke("text")
                    .then((txt) => {
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
