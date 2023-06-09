const { Types: { ObjectId } } = require('mongoose')
const { Product: Model } = require('../models/Product.model')
const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'PRODUCT'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')

const controller = {}

controller.getProducts = async (req, res, next) => {
  try {
    const products = await Model.find({}).populate('category')
    res.status(200).json(products)
  } catch (error) {
    setConfigError(error, { action: 'GET - All products' }, next)
  }
}

controller.getProductForIdCategory = async (req, res, next) => {
  try {
    const { idCategory } = req.params

    const products = await Model.find({ category: ObjectId(idCategory) })
    res.status(200).json(products)
  } catch (error) {
    setConfigError(error, { action: 'GET - All products' }, next)
  }
}

controller.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const product = await Model.findById(id)
    res.json(product)
  } catch (error) {
    setConfigError(error, { action: 'GET - One product for id' }, next)
  }
}

controller.postProduct = async (req, res, next) => {
  try {
    const body = req.body
    const {
      name,
      code,
      description,
      price,
      priceBefore,
      discountPercentage,
      stock,
      rating,
      brand,
      state,
      idCategory
    } = body

    if (isSomeEmptyFromModel([
      name,
      code,
      price,
      idCategory
    ])) return

    const productToSave = new Model({
      name,
      code,
      description,
      price,
      priceBefore,
      discountPercentage,
      stock,
      rating,
      brand,
      state,
      category: ObjectId(idCategory)
    })
    const response = await productToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new product' }, next)
  }
}

controller.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const body = req.body
    const {
      name,
      code,
      description,
      price,
      priceBefore,
      discountPercentage,
      stock,
      rating,
      brand,
      state,
      idCategory
    } = body

    if (isSomeEmptyFromModel([
      name,
      code,
      price,
      idCategory
    ])) return

    const response = await Model.findByIdAndUpdate(id, {
      name,
      code,
      description,
      price,
      priceBefore,
      discountPercentage,
      stock,
      rating,
      brand,
      state,
      category: ObjectId(idCategory)
    }, { new: true })
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'PUT - Update a product for id' }, next)
  }
}

controller.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const deletedProduct = await Model.findByIdAndDelete(id)

    if (!deletedProduct) throw new ErrorLocal({ message: 'Id is not finded, product is not deleted', statusCode: 400 })
    res.status(200).json({ message: '¡Deleted successfully!', deletedProduct })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A product for id' }, next)
  }
}

module.exports = controller
