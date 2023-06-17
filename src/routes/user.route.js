const { Router } = require('express')
const {
  getUsers,
  getUser,
  updateUser,
  changePassword,
} = require('../controllers/user.controller')
const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST, UPDATE } = DICTIONARY_ACTIONS
const { USER } = DICTIONARY_MODULES
const route = new Router()

route.get('/', verifyToken, checkRole(USER, LIST), getUsers)
route.get('/:id', verifyToken, checkRole(USER, LIST), getUser)
route.put(
  '/changePassword',
  verifyToken,
  checkRole(USER, UPDATE),
  changePassword
)
route.put('/:id', verifyToken, checkRole(USER, UPDATE), updateUser)

module.exports = route
