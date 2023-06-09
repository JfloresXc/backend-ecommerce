const { Collection: Model } = require('../models/Collection.model')

const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const { isSomeEmptyFromModel } = require('../helpers/validations')
const MODULE = 'COLLECTION'
const { setConfigError } = configError({ module: MODULE })

const controller = {}

controller.getCollections = async (req, res, next) => {
  try {
    const collections = await Model.find({})
    res.status(200).json(collections)
  } catch (error) {
    setConfigError(error, { action: 'GET - All collections' }, next)
  }
}

controller.getCollection = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const collection = await Model.findById(id)
    res.json(collection)
  } catch (error) {
    setConfigError(error, { action: 'GET - One Collection for id' }, next)
  }
}

controller.postCollection = async (req, res, next) => {
  try {
    const body = req.body
    const { name, description } = body

    if (isSomeEmptyFromModel([name])) return

    const collectionToSave = new Model({
      name,
      description,
    })

    const response = await collectionToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new collection' }, next)
  }
}

controller.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description } = req.body

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    if (isSomeEmptyFromModel([title, description])) return

    const response = await Model.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    )
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'PUT - Update a collection for id' }, next)
  }
}

controller.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    await Model.findByIdAndDelete(id)

    res.status(200).json({ message: 'Eliminado satisfactoriamente' })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A collection for id' }, next)
  }
}

module.exports = controller
