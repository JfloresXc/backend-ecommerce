const { Category: Model } = require('../models/Category.models')
const {
  Types: { ObjectId },
} = require('mongoose')
const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'Category'
const { setConfigError } = configError({ module: MODULE })
const {
  isSomeEmptyFromModel,
  validateParamsInQuery,
} = require('../helpers/validations')

const controller = {}

controller.getCategories = async (request, res, next) => {
  try {
    const query = validateParamsInQuery({ request })
    const Categories = await Model.find(query).populate('family')
    res.status(200).json(Categories)
  } catch (error) {
    setConfigError(error, { action: 'GET - All Categories' }, next)
  }
}

controller.getCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const category = await Model.findById(id).populate('family')
    res.json(category)
  } catch (error) {
    setConfigError(error, { action: 'GET - One Category for id' }, next)
  }
}

controller.postCategory = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description, idFamily, state } = body

    if (isSomeEmptyFromModel([name, idFamily])) return

    const categoryToSave = new Model({
      name,
      description,
      family: ObjectId(idFamily),
      state,
    })

    const response = await categoryToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new Category' }, next)
  }
}

controller.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const body = req.body
    const { name, description, idFamily, state } = body

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    if (isSomeEmptyFromModel([name, idFamily])) return

    const response = await Model.findByIdAndUpdate(
      id,
      {
        name,
        description,
        family: ObjectId(idFamily),
        state,
      },
      { new: true }
    )
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'PUT - Update a category for id' }, next)
  }
}

controller.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    await Model.findByIdAndDelete(id)

    res.status(200).json({ message: 'Eliminado satisfactoriamente' })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A category for id' }, next)
  }
}

module.exports = controller
