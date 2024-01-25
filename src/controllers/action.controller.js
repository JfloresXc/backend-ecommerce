const { Action: Model } = require('../models/Action.model')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'MODULE'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')

const controller = {}

controller.postAction = async (req, res, next) => {
  try {
    const body = req.body
    const { name, code } = body
    if (isSomeEmptyFromModel([name, code])) return

    const actionSave = new Model({
      name,
      code,
    })
    const response = await actionSave.save()
    res.status(200).json({ data: response })
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new action' }, next)
  }
}

controller.postActions = async (req, res, next) => {
  try {
    const body = req.body
    const { actions } = body
    const actionsToSend = []

    for (const actionKey of actions) {
      const { name, code } = actionKey
      isSomeEmptyFromModel([name, code])
    }

    for (const actionKey of actions) {
      const { name, code } = actionKey
      const actionSave = new Model({
        name,
        code,
      })
      const response = await actionSave.save()
      actionsToSend.push(response)
    }

    res.status(200).json({ data: actionsToSend })
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a many actions' }, next)
  }
}

controller.getAllActions = async (req, res, next) => {
  try {
    const actions = await Model.find({})
    res.status(200).json({ data: actions })
  } catch (error) {
    setConfigError(error, { action: 'GET - All actions' }, next)
  }
}

module.exports = controller
