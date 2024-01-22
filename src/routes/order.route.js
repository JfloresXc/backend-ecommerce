const { Router } = require('express')
const {
  getAllOrders,
  postNewOrder,
  getOrderForId,
} = require('../controllers/order.controller')
const {
  verifyToken,
  // checkRole,
} = require('../middlewares/authorization.midlewares')
// const {
//   DICTIONARY_ACTIONS,
//   DICTIONARY_MODULES,
// } = require('../utils/permissions')
// const { LIST, ADD, } = DICTIONARY_ACTIONS
// const { ORDER } = DICTIONARY_MODULES

const route = new Router()

route.get('/', verifyToken, getAllOrders)
route.get('/:id', getOrderForId)
route.post('/', postNewOrder)

module.exports = route
