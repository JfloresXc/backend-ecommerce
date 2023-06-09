const { verifyToken, checkRole } = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  getCategories,
  postCategory,
  getCategory
} = require('../controllers/category.controller')
const { DICITONARY_ACTIONS, DICTIONARY_MODULES } = require('../utils/permissions')
const { LIST, ADD } = DICITONARY_ACTIONS
const { CATEGORY } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(CATEGORY, LIST), getCategories)
route.get('/:id', verifyToken, checkRole(CATEGORY, LIST), getCategory)
route.post('/', verifyToken, checkRole(CATEGORY, ADD), postCategory)

module.exports = route
