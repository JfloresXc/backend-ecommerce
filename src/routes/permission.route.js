const { Router } = require('express')
const {
  getAllPermissionss,
  postPermission,
  postManyPermission,
  deletePermission
} = require('../controllers/permission.controller')
const { verifyToken, checkRole } = require('../middlewares/authorization.midlewares')
const { DICITONARY_ACTIONS, DICTIONARY_MODULES } = require('../utils/permissions')
const { LIST, ADD, DELETE } = DICITONARY_ACTIONS
const { PERMISSION } = DICTIONARY_MODULES

const route = new Router()

route.get('/', verifyToken, checkRole(PERMISSION, LIST), getAllPermissionss)
route.post('/', verifyToken, checkRole(PERMISSION, ADD), postPermission)
route.delete('/:id', verifyToken, checkRole(PERMISSION, DELETE), deletePermission)
route.post('/many', verifyToken, checkRole(PERMISSION, ADD), postManyPermission)
route.delete('/many', verifyToken, checkRole(PERMISSION, DELETE), deletePermission)

module.exports = route
