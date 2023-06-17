// const ErrorLocal = require('../utils/Error')
const { Module: ModuleModel } = require('../models/Module.model')
const helper = {}

helper.getAllModules = async () => {
  const modules = await ModuleModel.find({ state: 1 })
  return modules
}

module.exports = helper
