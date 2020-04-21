const config = require('../config');
const Knex = require('knex')

const knex = Knex({
  client: 'mysql',
  connection: {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    charset: 'utf8mb4',
  },
  pool: { min: 0, max: 7 },
})

module.exports = knex;