const config  = require('../knexfile')
const knex = require('knex')(config)

knex.migrate.latest([config]) //Não aconselhado

module.exports = knex