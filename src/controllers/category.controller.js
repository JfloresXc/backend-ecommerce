const { Types: { ObjectId } } = require('mongoose')
const { Category: Model } = require('../models/Category.models')

const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'Category'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')

const controller = {}

controller.getCategories = async (req, res, next) => {
  try {
    const Categories = await Model.find({})
    res.status(200).json(Categories)
  } catch (error) {
    setConfigError(error, { action: 'GET - All Categories' }, next)
  }
}

controller.getCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const category = await Model.findById(id)
    res.json(category)
  } catch (error) {
    setConfigError(error, { action: 'GET - One Category for id' }, next)
  }
}

controller.postCategory = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description, state, idCollection } = body

    if (isSomeEmptyFromModel([name, idCollection])) return

    const categoryToSave = new Model({
      name,
      description,
      state,
      idCollection: ObjectId(idCollection)
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
    const { name, description, state, idCollection } = body

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    if (isSomeEmptyFromModel([name, idCollection])) return

    const response = await Model.findByIdAndUpdate(id, {
      name,
      description,
      state,
      idCollection: ObjectId(idCollection)
    }, { new: true })
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
