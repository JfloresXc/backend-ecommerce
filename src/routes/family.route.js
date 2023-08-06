const {
  verifyToken,
  checkRole,
} = require('../middlewares/authorization.midlewares')
const { Router } = require('express')
const route = new Router()
const {
  getFamilies,
  postFamily,
  getFamily,
  updateFamily,
  getActivedFamilies,
} = require('../controllers/family.controller')
const {
  DICTIONARY_ACTIONS,
  DICTIONARY_MODULES,
} = require('../utils/permissions')
const { LIST, ADD, DELETE, UPDATE } = DICTIONARY_ACTIONS
const { FAMILY } = DICTIONARY_MODULES

route.get('/', verifyToken, checkRole(FAMILY, LIST), getFamilies)
route.get('/activedFamilies', getActivedFamilies)
route.get('/:id', verifyToken, checkRole(FAMILY, LIST), getFamily)
route.post('/', verifyToken, checkRole(FAMILY, ADD), postFamily)
route.put('/:id', verifyToken, checkRole(FAMILY, UPDATE), updateFamily)
route.delete('/:id', verifyToken, checkRole(FAMILY, DELETE), updateFamily)

module.exports = route
