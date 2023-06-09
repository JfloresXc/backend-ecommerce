const { SECRET_KEY } = require('../config/variablesEnv')
const jwt = require('jsonwebtoken')
const ErrorLocal = require('../utils/Error')
const { User } = require('../models/User.model')
const { getPermissionsForIdRole } = require('../helpers/permission.helper')
const midlewares = {}

const { configError } = require('../helpers/catchHandler')
const MODULE = 'AUTHORIZATION'
const { setConfigError } = configError({ module: MODULE })

midlewares.verifyToken = (request, response, next) => {
  try {
    const authorization = request.get('Authorization')

    if (authorization?.toLowerCase().startsWith('bearer')) {
      const token = authorization.split(' ')[1] || ''
      const decodedToken = jwt.verify(token, SECRET_KEY)
      if (decodedToken?.idUser) {
        request.idUser = decodedToken?.idUser
        next()
      } else {
        console.log(decodedToken)
      }
    } else throw new ErrorLocal({ message: 'No inicia con la palabra Bearer' })
  } catch (error) {
    setConfigError(error, { action: 'POST - verifyToken' }, next)
  }
}

midlewares.checkRole = (codeModule, codeAction) => async (request, response, next) => {
  try {
    const idUser = request.idUser
    const user = await User.findById(idUser).populate('role')
    if (!user) throw new ErrorLocal({ message: 'User not found' })

    const idRole = user.role.id
    const permissions = await getPermissionsForIdRole({ idRole })

    const findedPermission = permissions.find(permissionKey => permissionKey.codeModule === codeModule && permissionKey.codeAction === codeAction)

    if (findedPermission) next()
    else {
      throw new ErrorLocal({
        message: '¡Dont have permissions! - Your idRole is: ' + idRole,
        statusCode: 409
      })
    }
  } catch (error) {
    setConfigError(error, { action: 'POST - checkRole' }, next)
  }
}

module.exports = midlewares
