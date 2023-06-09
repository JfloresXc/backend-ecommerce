const { Router } = require('express')
const { getRoles, postRole } = require('../controllers/role.controller')

const route = new Router()

route.get('/', getRoles)
route.post('/', postRole)

module.exports = route
