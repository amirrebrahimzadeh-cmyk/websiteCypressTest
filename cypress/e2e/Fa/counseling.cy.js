describe("Counseling Section Journey", () => {
    beforeEach(() => {
        cy.visit("https://mom.ir/");
        //if user is logged in .profile-username will be visible
        cy.get('body').then($body => {
            if ($body.find('.profile-username').length === 0) { // lenght === 0 -> returns no matching elements
                cy.get(".register").click({force: true});
                cy.get("#mobile").should('be.visible');
                cy.get("#mobile").type("9334546384");
                cy.get(".btn.login-btn.btn-green.w-100").click();
                cy.get("#otpCode").should('be.visible');
                cy.get("#otpCode").type("1234"); //ASK TINA FOR FIXED OTP           IMPORRRRRRRRRRRRRRRRTANT
                cy.get(".btn.login-btn.btn-green.w-100").click();
            }
        });
    });

    it("should send a message in counseling session", () => {
        cy.url().should("include", "mom.ir/counseling");
        cy.get("#message-text").type("Hello, I need assistance with my account.");
        cy.get("#send-message").click();
        cy.contains("Your message has been sent").should("be.visible");
    });

    it("should catch error when using wrong phone number", () => {
        cy.get("#mobile").type("9334546384123456");
        cy.get(".btn.login-btn.btn-green.w-100").click();
        cy.get("#otpCode").should('not.exist');
        cy.contains("کد کشور اشتباه است!").should("be.visible");
    });
});
