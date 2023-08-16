const { Family: Model } = require('../models/Family.model')
const { Category: ModelCategory } = require('../models/Category.models')

const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'FAMILY'
const { setConfigError } = configError({ module: MODULE })
const {
  isSomeEmptyFromModel,
  validateParamsInQuery,
} = require('../helpers/validations')

const controller = {}

controller.getFamilies = async (request, res, next) => {
  try {
    const query = validateParamsInQuery({ request })
    const Families = await Model.find(query)
    res.status(200).json(Families)
  } catch (error) {
    setConfigError(error, { action: 'GET - All Families' }, next)
  }
}

controller.getActivedFamilies = async (request, res, next) => {
  try {
    const families = await Model.find({ state: 1 })
    const categories = await ModelCategory.find({ state: 1 })

    const familiesWithCategories = families.map((family) => {
      const categoriesByFamily = categories.filter(
        (category) => category.family.toString() === family._id.toString()
      )

      const familyObject = {
        ...family._doc,
        id: family._id,
      }
      delete familyObject._id
      delete familyObject.__v

      return { ...familyObject, categories: categoriesByFamily }
    })

    res.status(200).json(familiesWithCategories)
  } catch (error) {
    setConfigError(error, { action: 'GET - All Families' }, next)
  }
}

controller.getFamily = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const family = await Model.findById(id)
    res.json(family)
  } catch (error) {
    setConfigError(error, { action: 'GET - One Family for id' }, next)
  }
}

controller.postFamily = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description, state } = body

    if (isSomeEmptyFromModel([name])) return

    const familyToSave = new Model({
      name,
      description,
      state,
    })

    const response = await familyToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new Family' }, next)
  }
}

controller.updateFamily = async (req, res, next) => {
  try {
    const { id } = req.params
    const body = req.body
    const { name, description, state } = body

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

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
    setConfigError(error, { action: 'PUT - Update a family for id' }, next)
  }
}

controller.deleteFamily = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    await Model.findByIdAndDelete(id)

    res.status(200).json({ message: 'Eliminado satisfactoriamente' })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A family for id' }, next)
  }
}

module.exports = controller
