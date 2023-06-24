const { User: UserModel } = require('../models/User.model')
const { Role: RoleModel } = require('../models/Role.model')
const { Module: ModuleModel } = require('../models/Module.model')
const { Action: ActionModel } = require('../models/Action.model')
const { Permission: PermissionModel } = require('../models/Permission.model')
const {
  Types: { ObjectId },
} = require('mongoose')
const jwt = require('jsonwebtoken')
const { configError } = require('../helpers/catchHandler')
const {
  isExistUser,
  comparePassword,
  isNotExistUser,
} = require('../helpers/user.helper')
const { SECRET_KEY } = require('../config/variablesEnv')

const ErrorLocal = require('../utils/Error')
const { getPermissionsForIdRole } = require('../helpers/permission.helper')
const { setConfigError } = configError({ module: 'AUTHENTICATION' })
const {
  MODULES_ADMIN,
  ACTIONS_ADMIN,
  PERMISSIONS_ADMIN,
} = require('../utils/permissions')

const controller = {}

function validateModel({ email, password, idRole }, isLogin = true) {
  const isValidated = isLogin ? email && password : email && password && idRole

  if (!isValidated) {
    throw new ErrorLocal({
      message: 'Email or password or idRole not found',
      statusCode: 400,
    })
  }
}

const getToken = async ({ id, username, role }) => {
  const token = jwt.sign(
    {
      idUser: id,
      username,
      role,
    },
    SECRET_KEY,
    {
      expiresIn: '7d',
    }
  )

  return { token }
}

controller.signin = async (req, res, next) => {
  try {
    const body = req.body
    const { email, password } = body
    validateModel(body)

    const { user } = await isExistUser({ email })
    comparePassword({
      password,
      passwordToCompare: user.password || '',
    })

    const { token } = await getToken(user)
    const permissions = await getPermissionsForIdRole({
      idRole: user.role,
    })

    res.status(202).json({
      message: 'Token received',
      token,
      permissions,
      user: {
        email: user?.email,
        id: user?.id,
      },
    })
  } catch (error) {
    setConfigError(error, { action: 'POST - Signin user' }, next)
  }
}

controller.signup = async (req, res, next) => {
  try {
    const body = req.body
    const { email, password, username, idRole, state } = body
    validateModel(body, false)

    await isNotExistUser({ email })
    if (password.length < 5)
      throw new ErrorLocal({ message: 'Password length is greater than 4' })

    const userToCreate = new UserModel({
      email,
      username,
      password,
      state,
      role: ObjectId(idRole),
    })
    await userToCreate.save()

    res.status(202).json({ message: '¡User created successfully!' })
  } catch (error) {
    setConfigError(error, { action: 'POST - Signup user' }, next)
  }
}

controller.createAdmin = async (req, res, next) => {
  try {
    const roleToSave = new RoleModel({
      name: 'Administrador',
      description: 'Administrador del sistema',
      state: 1,
    })
    const responseOfRole = await roleToSave.save()
    const idRole = ObjectId(responseOfRole._id)

    for (const module of MODULES_ADMIN) {
      const moduleToSave = new ModuleModel(module)
      await moduleToSave.save()
    }

    for (const action of ACTIONS_ADMIN) {
      const actionToSave = new ActionModel(action)
      await actionToSave.save()
    }

    for (const permission of PERMISSIONS_ADMIN) {
      const permissionToSave = new PermissionModel({
        ...permission,
        role: idRole,
      })
      await permissionToSave.save()
    }

    const userToSave = new UserModel({
      email: 'administrator@gmail.com',
      username: 'administrator',
      password: 'administrator',
      state: 1,
      role: idRole,
    })
    const responseOfUser = await userToSave.save()

    res.status(200).json(responseOfUser)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new permission' }, next)
  }
}

module.exports = controller
