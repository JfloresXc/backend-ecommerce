const {
  SECRET_KEY,
  NODE_ENV,
  DATABASE_CONECTION_TEST,
  DATABASE_CONECTION_PRODUCTION,
  DATABASE_CONECTION_DEV,
  PORT
} = process.env

module.exports = {
  SECRET_KEY,
  PORT,
  NODE_ENV,
  DATABASE_CONECTION_TEST,
  DATABASE_CONECTION_PRODUCTION,
  DATABASE_CONECTION_DEV
}
