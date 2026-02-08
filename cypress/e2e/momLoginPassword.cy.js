describe("mom website login journey", () => {

  beforeEach(() => {
    cy.viewport(1200, 660)
    cy.visit("https://mom.ir/");
    cy.get(".register").click({ force: true });
  });
  it("should log in successfully using true data", () => {
    cy.get(".btn-way").click(); // login with password button

    cy.get("#mobile.form-control").type("9334546384"); // Input phone number (correct)
    cy.get("#password.form-control").type("123456");   // Input password (correct)

    // Click on the login button
    cy.get(".btn.login-btn.btn-green.w-100").click();

    // redirect to mom.ir/
    cy.url().should("include", "mom.ir/");

    // Ensure profile username exists after login
    cy.get("body").then(($body) => {
      if ($body.find(".profile-username").length === 0) {
        throw new Error("profile-username not found after login");
      } else {
        cy.wrap($body)
          .find(".profile-username")
          .should("be.visible");
      }
    });
  });

  it("should catch error when using wrong password", () => {
    cy.get(".btn-way").click({ force: true }); // Input short phone number(incorrect)
    cy.get("#mobile.form-control").type("9334546384"); // Input phone number(incorrect)
    cy.get("#password.form-control").type("1234567"); // Input password(incorrect)
    cy.get(".btn.login-btn.btn-green.w-100").click();
    // check error message
    cy.contains('username or password is incorrect').should('be.visible');
  });
  // other scenarios for wrong password
  it("should catch error when using wrong phone number", () => {
    cy.get(".btn-way").click({ force: true });
    cy.get("#mobile.form-control").type("9334546384123456");
    cy.get("#password.form-control").type("123456");
    cy.get(".btn.login-btn.btn-green.w-100").click();
    cy.contains('username or password is incorrect').should('be.visible');
  });

  it("should catch error when using invalid phone number format", () => {
    cy.get(".btn-way").click({ force: true });
    cy.get("#mobile.form-control").type("93345");
    cy.get("#password.form-control").type("123456");
    cy.get(".btn.login-btn.btn-green.w-100").click();
    cy.contains('username or password is incorrect').should('be.visible');
  });

  it("should catch error when trying empty fields", () => {
    cy.get(".btn-way").click({ force: true });
    cy.get(".btn.login-btn.btn-green.w-100").click();
    cy.get(".erorr-text").contains("رمز عبور الزامی است").should('be.visible');
    cy.get(".erorr-text").contains("موبایل باید حداقل 10 کاراکتر باشد").should('be.visible');
  });
});
