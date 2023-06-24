const { Router } = require('express')
const {
  signin,
  signup,
  createAdmin,
} = require('../controllers/auth.controller')

const route = new Router()

route.post('/signin', signin)
route.post('/signup', signup)
route.get('/create-admin', createAdmin)

module.exports = route
