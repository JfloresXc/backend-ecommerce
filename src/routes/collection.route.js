const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  postCollection,
  getCollection,
  getCollections,
} = require('../controllers/collection.controllers')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST, ADD } = DICTIONARY_ACTIONS
const { COLECCTION } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(COLECCTION, LIST), getCollections)
route.get('/:id', verifyToken, checkRole(COLECCTION, LIST), getCollection)
route.post('/', verifyToken, checkRole(COLECCTION, ADD), postCollection)

module.exports = route
