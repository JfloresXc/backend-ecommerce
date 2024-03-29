const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  postProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  postOneImage,
  getImagesForIdProduct,
  deleteImageOfProduct,
  getProductsForSearchParameters,
  getProductsForIdFamily,
  getActivedProduct,
  getProductsForIdCategory,
} = require('../controllers/product.controller')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { fileMiddleware } = require('../middlewares/file.middlewares')
const { LIST, ADD, DELETE, UPDATE } = DICTIONARY_ACTIONS
const { PRODUCT } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(PRODUCT, LIST), getProducts)
route.get(
  '/forIdCollection/:idCollection',
  verifyToken,
  checkRole(PRODUCT, LIST),
  getProductsForIdCategory
)
route.get(
  '/imagesForIdProduct/:idProduct',
  verifyToken,
  checkRole(PRODUCT, LIST),
  getImagesForIdProduct
)
route.get('/family/:idFamily', getProductsForIdFamily)
route.get('/search', getProductsForSearchParameters)
route.get('/actived/:id', getActivedProduct)
route.get('/:id', verifyToken, checkRole(PRODUCT, LIST), getProduct)
route.post('/image', fileMiddleware, postOneImage)
route.post('/', verifyToken, checkRole(PRODUCT, ADD), postProduct)
route.put('/:id', verifyToken, checkRole(PRODUCT, UPDATE), updateProduct)
route.delete('/:id', verifyToken, checkRole(PRODUCT, DELETE), deleteProduct)
route.delete(
  '/imagesForIdProduct/:id',
  verifyToken,
  checkRole(PRODUCT, DELETE),
  deleteImageOfProduct
)

module.exports = route
