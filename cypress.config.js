const { defineConfig } = require("cypress");
const { Pool } = require('pg');

const dbConfig = {
  host: 'queenie.db.elephantsql.com',
  user: 'borqcoay',
  password: '5k_wX71gRlhIV99NX9h-3Q6hUKoMVMuK',
  database: 'borqcoay',
  port: 5432
};

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1440,
    viewportHeight: 900,

    setupNodeEvents(on, config) {
      // implement node event listeners here

      const pool = new Pool(dbConfig)

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
        },

        findToken(email) {
          return new Promise(function (resolve) {
            pool.query(`select B.token from public.users A INNER JOIN public.user_tokens B ON A.id = B.user_id WHERE A.email = $1 ORDER BY B.created_at`, [email], function (error, result) {
              if (error) {
                throw error
              }
              resolve({ token: result.rows[0].token })
            })
          })
        }
      })
    },
  },
});