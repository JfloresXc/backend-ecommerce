const { User: Model } = require('../models/User.model')
const {
  Types: { ObjectId },
} = require('mongoose')
const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const {
  validateParamsInQuery,
  isSomeEmptyFromModel,
} = require('../helpers/validations')
const { isNotExistUser, comparePassword } = require('../helpers/user.helper')
const MODULE = 'PUBLICATION'
const { setConfigError } = configError({ module: MODULE })

const controller = {}

controller.getUsers = async (request, res, next) => {
  try {
    const query = validateParamsInQuery({ request })

    const users = await Model.find(query).populate('role')
    res.status(200).json(users)
  } catch (error) {
    setConfigError(error, { action: 'GET - All publications' }, next)
  }
}

controller.getUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const publication = await Model.findById(id)
    res.json(publication)
  } catch (error) {
    setConfigError(error, { action: 'GET - One User for id' }, next)
  }
}

controller.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const body = req.body
    const { email, username, idRole, state } = body
    if (isSomeEmptyFromModel([email, username, idRole])) return

    const userBefore = await Model.findById(id)
    if (userBefore.email !== email) await isNotExistUser({ email })

    const response = await Model.findByIdAndUpdate(
      id,
      {
        email,
        username,
        state,
        role: ObjectId(idRole),
      },
      { new: true }
    )

    res.status(202).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Update user' }, next)
  }
}

controller.changePassword = async (req, res, next) => {
  try {
    const id = req.query.id
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const body = req.body
    const { passwordBefore, password } = body
    if (isSomeEmptyFromModel([passwordBefore, password])) return

    const userBefore = await Model.findById(id)
    comparePassword({
      password: userBefore?.password,
      passwordToCompare: passwordBefore,
    })

    const response = await Model.findByIdAndUpdate(
      id,
      {
        password,
      },
      { new: true }
    )

    res.status(202).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Change password' }, next)
  }
}

module.exports = controller
