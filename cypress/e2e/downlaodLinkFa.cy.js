describe("Button redirection tests", () => {
  const WAIT_AFTER_NAV = 1000;

  const normalizeToFa = (href) => {
    if (!href) return href;

    if (href === "https://momapplication.com" || href === "https://momapplication.com/") {
      return "https://momapplication.com/fa";
    }
    return href;
  };

  // Navigate using href from the element (optionally filtered by text),
  // then only verify URL includes momapplication.com/fa (no body / no DOM)
  const visitHrefAndAssertUrl = ({ selector, containsText }) => {
    const chain = containsText ? cy.contains(selector, containsText) : cy.get(selector);

    chain
      .should("exist")
      .invoke("attr", "href")
      .then((href) => {
        expect(href, `href for ${selector}${containsText ? ` containing "${containsText}"` : ""}`).to.be.a("string");
        expect(href).to.not.equal("javascript:void(0)");

        cy.visit(normalizeToFa(href));
        cy.wait(WAIT_AFTER_NAV);

        // ✅ Cross-origin safe URL assertion
        cy.origin("https://momapplication.com", () => {
          cy.location("href").should("include", "momapplication.com/fa");
        });
      });
  };

  beforeEach(() => {
    cy.viewport(1200, 660);

    cy.intercept("POST", "https://sentry.mom.ir/api/**", {
      statusCode: 200,
      body: { ok: true },
    }).as("sentry");

    cy.intercept("POST", "https://i.clarity.ms/collect", {
      statusCode: 200,
      body: { ok: true },
    }).as("clarity");
  });

  it("intro title (btn-app-download)", () => {
    cy.visit("https://mom.ir/");
    visitHrefAndAssertUrl({
      selector: ".btn.btn-white.btn-app-download",
      containsText: " دانلود ",
    });
  });

  it("header button", () => {
    cy.visit("https://mom.ir/");
    visitHrefAndAssertUrl({
      selector: ".btn.btn-white.free-consultation.free-consultation1",
      containsText: "اپلیکیشـن مـام",
    });
  });

  it("banner (download-btn)", () => {
    cy.visit("https://mom.ir/");
    visitHrefAndAssertUrl({ selector: ".download-btn" });
  });

  // Duplicate #applicationBtn: always choose the one that says اپلیکیشـن مـام
  const APP_BTN = { selector: "#applicationBtn", containsText: "اپلیکیشـن مـام" };

  it("international patient services", () => {
    cy.visit("https://mom.ir/service/category/international-patient-services");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("infertility treatment", () => {
    cy.visit("https://mom.ir/service/category/infertility-treatment");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("treat fertility", () => {
    cy.visit("https://mom.ir/service/category/treat-fertility");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("women specialized services", () => {
    cy.visit("https://mom.ir/service/category/women-specialized-services");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("men specialized services", () => {
    cy.visit("https://mom.ir/service/category/men-specialized-services");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("Complementary Counselling", () => {
    cy.visit("https://mom.ir/service/category/Complementary%20Counselling");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("Imaging and ultrasound", () => {
    cy.visit("https://mom.ir/service/category/Imaging%20and%20ultrasound");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("team page", () => {
    cy.visit("https://mom.ir/team?limit=12");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("blog page button", () => {
    cy.visit("https://mom.ir/blog");
    visitHrefAndAssertUrl({
      selector: "a.btn",
      containsText: "اپلیکیشـن مـام",
    });
  });

  it("about mom-at-a-glance", () => {
    cy.visit("https://mom.ir/about/mom-at-a-glance");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("board-members", () => {
    cy.visit("https://mom.ir/about/board-members");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("specialized committees", () => {
    cy.visit("https://mom.ir/about/specialized-committees");
    visitHrefAndAssertUrl(APP_BTN);
  });

  it("shareholders affairs", () => {
    cy.visit("https://mom.ir/shareholders-affairs");
    visitHrefAndAssertUrl(APP_BTN);
  });

});
