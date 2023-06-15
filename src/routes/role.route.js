const { Router } = require('express')
const {
  getRoles,
  postRole,
  getRoleforId,
  updateRole,
} = require('../controllers/role.controller')
const {
  checkRole,
  verifyToken,
} = require('../middlewares/authorization.midlewares')
const route = new Router()
const {
  DICTIONARY_MODULES,
  DICITONARY_ACTIONS,
} = require('../utils/permissions')
const { LIST, ADD, UPDATE } = DICITONARY_ACTIONS
const { ROLE } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(ROLE, LIST), getRoles)
route.post('/', verifyToken, checkRole(ROLE, ADD), postRole)
route.get('/:id', verifyToken, checkRole(ROLE, LIST), getRoleforId)
route.put('/:id', verifyToken, checkRole(ROLE, UPDATE), verifyToken, updateRole)

module.exports = route
