const mongoose = require('mongoose')
const {
  NODE_ENV,
  DATABASE_CONECTION_TEST,
  DATABASE_CONECTION_PRODUCTION,
  DATABASE_CONECTION_DEV,
} = require('./variablesEnv')

const envs = {
  development: DATABASE_CONECTION_DEV,
  test: DATABASE_CONECTION_TEST,
  production: DATABASE_CONECTION_PRODUCTION,
}

const URI = envs[NODE_ENV]

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Database ${NODE_ENV} connected`)
  })
  .catch((e) => {
    console.error(e)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
