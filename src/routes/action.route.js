const { Router } = require('express')
const {
  getAllActions,
  postAction,
  postActions,
} = require('../controllers/action.controller')

const route = new Router()

route.get('/', getAllActions)
route.post('/', postAction)
route.post('/many', postActions)

module.exports = route
