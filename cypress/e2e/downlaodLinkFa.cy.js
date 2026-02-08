describe("Button redirection tests", () => {
  beforeEach(() => {
    cy.viewport(1200, 660);
    cy.intercept('POST', 'https://sentry.mom.ir/api/**', {
      statusCode: 200,
      body: { ok: true },
    }).as('sentry');
  });
  it("should redirect to the application page when clicking each button", () => {
    // Test for the header (applicationBtn)
    cy.visit("https://mom.ir/");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the intro title (btn btn-white btn-app-download)
    cy.visit("https://mom.ir/");
    cy.get(".btn.btn-white.btn-app-download").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the banner (download-btn)
    cy.visit("https://mom.ir/");
    cy.get(".download-btn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - international patient services
    cy.visit("https://mom.ir/service/category/international-patient-services");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - infertility treatment
    cy.visit("https://mom.ir/service/category/infertility-treatment");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - treat fertility
    cy.visit("https://mom.ir/service/category/treat-fertility");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - women specialized services
    cy.visit("https://mom.ir/service/category/women-specialized-services");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - men specialized services
    cy.visit("https://mom.ir/service/category/men-specialized-services");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - complementary counselling
    cy.visit("https://mom.ir/service/category/Complementary%20Counselling");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for services - imaging and ultrasound
    cy.visit("https://mom.ir/service/category/Imaging%20and%20ultrasound");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the team page
    cy.visit("https://mom.ir/team?limit=12");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the blog page
    cy.visit("https://mom.ir/blog");
    cy.get(".btn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the about mom-at-a-glance page
    cy.visit("https://mom.ir/about/mom-at-a-glance");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the board-members page
    cy.visit("https://mom.ir/about/board-members");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the specialized committees page
    cy.visit("https://mom.ir/about/specialized-committees");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");

    // Test for the shareholders affairs page
    cy.visit("https://mom.ir/shareholders-affairs");
    cy.get("#applicationBtn").click({ force: true });
    cy.url().should("eq", "https://momapplication.com/fa");
  });
});
