const { Router } = require('express')
const {
  getAllPermissionss,
  getPermissionssForIdRole,
  getModulesAndActions,
  postPermission,
  postManyPermission,
  deletePermission,
} = require('../controllers/permission.controller')
const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST, ADD, DELETE } = DICTIONARY_ACTIONS
const { PERMISSION } = DICTIONARY_MODULES

const route = new Router()

route.get('/', verifyToken, checkRole(PERMISSION, LIST), getAllPermissionss)
route.get(
  '/getModulesAndActions',
  verifyToken,
  checkRole(PERMISSION, LIST),
  getModulesAndActions
)
route.get(
  '/:idRole',
  verifyToken,
  checkRole(PERMISSION, LIST),
  getPermissionssForIdRole
)
route.post('/', verifyToken, checkRole(PERMISSION, ADD), postPermission)
route.delete(
  '/:id',
  verifyToken,
  checkRole(PERMISSION, DELETE),
  deletePermission
)
route.post('/many', verifyToken, checkRole(PERMISSION, ADD), postManyPermission)
route.delete(
  '/many',
  verifyToken,
  checkRole(PERMISSION, DELETE),
  deletePermission
)

module.exports = route
