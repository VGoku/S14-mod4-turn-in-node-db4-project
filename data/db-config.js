const knex = require("knex");
const configurations = require("../knexfile")
const environment = process.env.MODE_ENV //|| "development"