const express = require('express')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const cors = require('cors')
const { errorHandler } = require('../helpers/errorHandlers')
const path = require('path')
const app = express()
const { PORT = 3001 } = require('./variablesEnv')

// SETTINGS
app.set('port', PORT)

// MIDLEWARES
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())
// app.use(bodyParser.json({ limit: '10mb' }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

// ROUTES
app.use('/api/product', require('../routes/product.route'))
app.use('/api/auth', require('../routes/auth.routes'))
app.use('/api/user', require('../routes/user.route'))
app.use('/api/role', require('../routes/role.route'))
app.use('/api/module', require('../routes/module.route'))
app.use('/api/action', require('../routes/action.route'))
app.use('/api/permission', require('../routes/permission.route'))
app.use('/api/category', require('../routes/category.route'))
app.use('/api/family', require('../routes/family.route'))
app.use('/api/order', require('../routes/order.route'))
app.use((error, request, response, next) => {
  errorHandler(error, response)
})

// STATICS
const publicPath = path.resolve(__dirname, '../../.next')
app.use(express.static(publicPath))

// app.get('/', (request, response) => {
//   response.send('')
// })

// LISTEN
const server = app.listen(app.get('port'), () =>
  console.log('Server on port ' + app.get('port'))
)

module.exports = { app, server }
