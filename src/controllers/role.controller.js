const { Role: Model } = require('../models/Role.model')
const { configError } = require('../helpers/catchHandler')
const { isSomeEmptyFromModel } = require('../helpers/validations')
const ErrorLocal = require('../utils/Error')
const MODULE = 'ROLE'
const { setConfigError } = configError({ module: MODULE })

const controller = {}

controller.getRoles = async (req, res, next) => {
  try {
    const roles = await Model.find().populate('role')
    res.status(200).json(roles)
  } catch (error) {
    setConfigError(error, { action: 'GET - All publications' }, next)
  }
}

controller.getRoleforId = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const role = await Model.findById(id)
    res.json(role)
  } catch (error) {
    setConfigError(error, { action: 'GET - One role for id' }, next)
  }
}

controller.postRole = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description, state } = body
    if (isSomeEmptyFromModel([name])) return

    const roleToSave = new Model({
      name,
      description,
      state,
    })
    const response = await roleToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new role' }, next)
  }
}

controller.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const body = req.body
    const { name, description, state } = body

    if (isSomeEmptyFromModel([name])) return

    const response = await Model.findByIdAndUpdate(
      id,
      {
        name,
        description,
        state,
      },
      { new: true }
    )
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'PUT - Update a product for id' }, next)
  }
}

module.exports = controller
