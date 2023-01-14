const knex = require('knex')({
  client: process.env.DB_DRIVER,
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    ssl: true
  }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;