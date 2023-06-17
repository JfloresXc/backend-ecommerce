const { Router } = require('express')
const { getUsers } = require('../controllers/user.controller')
const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST } = DICTIONARY_ACTIONS
const { USER } = DICTIONARY_MODULES
const route = new Router()

route.get('/', verifyToken, checkRole(USER, LIST), getUsers)

module.exports = route
