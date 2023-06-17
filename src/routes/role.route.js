const { Router } = require('express')
const {
  postRole,
  getRoleforId,
  updateRole,
  getAllRoles,
} = require('../controllers/role.controller')
const {
  checkRole,
  verifyToken,
} = require('../middlewares/authorization.midlewares')
const route = new Router()
const {
  DICTIONARY_MODULES,
  DICTIONARY_ACTIONS,
} = require('../utils/permissions')
const { LIST, ADD, UPDATE } = DICTIONARY_ACTIONS
const { ROLE } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(ROLE, LIST), getAllRoles)
route.post('/', verifyToken, checkRole(ROLE, ADD), postRole)
route.get('/:id', verifyToken, checkRole(ROLE, LIST), getRoleforId)
route.put('/:id', verifyToken, checkRole(ROLE, UPDATE), verifyToken, updateRole)

module.exports = route
