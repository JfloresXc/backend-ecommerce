const { Router } = require('express')
const {
  getAllOrders,
  postNewOrder,
} = require('../controllers/order.controller')

const route = new Router()

route.get('/', getAllOrders)
route.post('/', postNewOrder)

module.exports = route
