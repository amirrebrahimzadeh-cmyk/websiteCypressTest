const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },

    pageLoadTimeout: 120000,       // cy.visit()
    defaultCommandTimeout: 120000, // cy.get(), cy.contains(), .should(), etc.
    requestTimeout: 120000,        // cy.request()
    responseTimeout: 120000,       // waiting for responses

    // optional but helpful for flaky apps
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
