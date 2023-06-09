const { verifyToken, checkRole } = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  postProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductForIdCategory,
  getProducts
} = require('../controllers/product.controllers')
const { DICITONARY_ACTIONS, DICTIONARY_MODULES } = require('../utils/permissions')
const { LIST, ADD, DELETE, UPDATE } = DICITONARY_ACTIONS
const { PRODUCT } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(PRODUCT, LIST), getProducts)
route.get('/forIdCollection/:idCollection', verifyToken, checkRole(PRODUCT, LIST), getProductForIdCategory)
route.get('/:id', verifyToken, checkRole(PRODUCT, LIST), getProduct)
route.post('/', verifyToken, checkRole(PRODUCT, ADD), postProduct)
route.put('/:id', verifyToken, checkRole(PRODUCT, UPDATE), updateProduct)
route.delete('/:id', verifyToken, checkRole(PRODUCT, DELETE), deleteProduct)

module.exports = route
