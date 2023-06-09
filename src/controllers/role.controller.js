const { Role: Model } = require('../models/Role.model')
const { configError } = require('../helpers/catchHandler')
const { isSomeEmptyFromModel } = require('../helpers/validations')
const MODULE = 'ROLE'
const { setConfigError } = configError({ module: MODULE })

const controller = {}

controller.getRoles = async (req, res, next) => {
  try {
    const roles = await Model.find()
      .populate('role')
    res.status(200).json(roles)
  } catch (error) {
    setConfigError(error, { action: 'GET - All publications' }, next)
  }
}

controller.postRole = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description } = body
    if (isSomeEmptyFromModel([name])) return

    const roleToSave = new Model({
      name, description
    })
    const response = await roleToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new role' }, next)
  }
}

module.exports = controller
