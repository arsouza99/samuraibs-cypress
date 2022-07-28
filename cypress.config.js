const { defineConfig } = require("cypress");
const { Pool } = require('pg');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1440,
    viewportHeight: 900,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const pool = new Pool({
        host: 'queenie.db.elephantsql.com',
        user: 'borqcoay',
        password: '5k_wX71gRlhIV99NX9h-3Q6hUKoMVMuK',
        database: 'borqcoay',
        port: 5432
      })

      on('task', {
        removeUser(email) {
          return new Promise(function (resolve) {
            pool.query('DELETE FROM public.users WHERE email = $1', [email], function (error, result) {
              if (error) {
                throw error
              }
              resolve({ success: result })
            })
          })
        }
      })
    },
  },
});