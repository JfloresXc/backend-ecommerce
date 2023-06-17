// const ErrorLocal = require('../utils/Error')
const { Action: ActionModel } = require('../models/Action.model')
const helper = {}

helper.getAllActions = async () => {
  const actions = await ActionModel.find({})
  return actions
}

module.exports = helper
