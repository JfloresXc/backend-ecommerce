const { Module: Model } = require('../models/Module.model')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'MODULE'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')

const controller = {}

controller.postModule = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description, state, code } = body
    if (isSomeEmptyFromModel([name, code])) return

    const moduleSave = new Model({
      name,
      description,
      state,
      code,
    })
    const response = await moduleSave.save()
    res.status(200).json({ data: response })
  } catch (error) {
    setConfigError(error, { module: 'POST - Create a new module' }, next)
  }
}

controller.postModules = async (req, res, next) => {
  try {
    const body = req.body
    const { modules } = body
    const modulesToSend = []

    for (const moduleKey of modules) {
      const { name, code } = moduleKey
      isSomeEmptyFromModel([name, code])
    }

    for (const moduleKey of modules) {
      const { name, code, description, state = 1 } = moduleKey
      const moduleSave = new Model({
        name,
        code,
        description,
        state,
      })
      const response = await moduleSave.save()
      modulesToSend.push(response)
    }

    res.status(200).json({ data: modulesToSend })
  } catch (error) {
    setConfigError(error, { module: 'POST - Create a many modules' }, next)
  }
}

controller.getAllModules = async (req, res, next) => {
  try {
    const modules = await Model.find({})
    res.status(200).json({ data: modules })
  } catch (error) {
    setConfigError(error, { module: 'GET - All modules' }, next)
  }
}

module.exports = controller
