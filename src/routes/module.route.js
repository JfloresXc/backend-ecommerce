const { Router } = require('express')
const {
  postModule,
  getAllModules,
  postModules,
} = require('../controllers/module.controller')

const route = new Router()

route.get('/', getAllModules)
route.post('/', postModule)
route.post('/many', postModules)

module.exports = route
