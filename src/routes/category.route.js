const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  getCategories,
  postCategory,
  getCategory,
  updateCategory,
  getActivedCategory,
} = require('../controllers/category.controller')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST, ADD, DELETE, UPDATE } = DICTIONARY_ACTIONS
const { CATEGORY } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(CATEGORY, LIST), getCategories)
route.get('/state/:id', getActivedCategory)
route.get('/:id', verifyToken, checkRole(CATEGORY, LIST), getCategory)
route.post('/', verifyToken, checkRole(CATEGORY, ADD), postCategory)
route.put('/:id', verifyToken, checkRole(CATEGORY, UPDATE), updateCategory)
route.delete('/:id', verifyToken, checkRole(CATEGORY, DELETE), updateCategory)

module.exports = route
