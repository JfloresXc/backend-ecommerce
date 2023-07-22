const {
  Types: { ObjectId },
} = require('mongoose')
const { Product: Model } = require('../models/Product.model')
const {
  ImagesOfProduct: ModelImagesOfProduct,
} = require('../models/ImagesOfProduct.model')
const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'PRODUCT'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')
const { uploadImageToDB, deleteImage } = require('../helpers/image.helper')

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

controller.getProductsForSearchParameters = async (req, res, next) => {
  try {
    const { searchtext = '', page = '', limit = '' } = req.query

    const query = {
      $or: [
        { name: { $regex: searchtext, $options: 'i' } },
        { description: { $regex: searchtext, $options: 'i' } },
      ],
    }

    const count = await Model.countDocuments(query)
    const totalPages = Math.ceil(count / parseInt(limit))
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Model.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('category')
      .populate('images')

    res.status(200).json({ products, totalPages })
  } catch (error) {
    setConfigError(error, { action: 'GET - All products' }, next)
  }
}

controller.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const product = await Model.findById(id).populate('category')
    res.json(product)
  } catch (error) {
    setConfigError(error, { action: 'GET - One product for id' }, next)
  }
}

controller.getImagesForIdProduct = async (req, res, next) => {
  try {
    const { idProduct } = req.params

    const images = await ModelImagesOfProduct.find({
      product: ObjectId(idProduct),
    })
    res.status(200).json(images)
  } catch (error) {
    setConfigError(error, { action: 'GET - All images for a product' }, next)
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
      idCategory,
    } = body

    if (isSomeEmptyFromModel([name, code, price, idCategory])) return

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
      category: ObjectId(idCategory),
      images: [],
    })
    const response = await productToSave.save()
    res.status(200).json(response)
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new product' }, next)
  }
}

controller.postOneImage = async (req, res, next) => {
  try {
    const files = req.files ?? []
    const file = files.file
    const dateNow = new Date().toISOString().substring(0, 10)
    const fileName = `${dateNow}-${file.name}`

    const body = req.body
    const { idProduct } = body
    if (isSomeEmptyFromModel([idProduct])) return

    const { url } = await uploadImageToDB({ file, fileName })
    const imagesOfProduct = new ModelImagesOfProduct({
      url,
      order: 2,
      fileName,
      product: ObjectId(idProduct),
    })

    const imageResult = await imagesOfProduct.save()
    const product = await Model.findById(idProduct)
    const { images = [] } = product

    await Model.findByIdAndUpdate(idProduct, {
      images: [...images, imageResult._id],
    })

    res
      .status(200)
      .json({ message: '¡Archivo subido correctamente!', url: 'hello' })
  } catch (error) {
    setConfigError(error, { action: 'POST - A image of product' }, next)
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
      idCategory,
    } = body

    if (isSomeEmptyFromModel([name, code, price, idCategory])) return

    const response = await Model.findByIdAndUpdate(
      id,
      {
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
        category: ObjectId(idCategory),
      },
      { new: true }
    )
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

    if (!deletedProduct)
      throw new ErrorLocal({
        message: 'Id is not finded, product is not deleted',
        statusCode: 400,
      })
    res.status(200).json({ message: '¡Deleted successfully!', deletedProduct })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A product for id' }, next)
  }
}

controller.deleteImageOfProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const deletedProduct = await ModelImagesOfProduct.findByIdAndDelete(id)
    if (!deletedProduct)
      throw new ErrorLocal({
        message: 'Id is not finded, image is not deleted',
        statusCode: 400,
      })

    const fileName = deletedProduct.fileName
    await deleteImage({ fileName })

    const idProduct = deletedProduct.product
    const { images = [] } = await Model.findById(idProduct).populate('images')
    const idImage = `${id}`

    const imagesFiltered = images.filter((image) => image.id !== idImage)

    await Model.findByIdAndUpdate(idProduct, {
      images: [...imagesFiltered],
    })

    res.status(200).json({ message: '¡Deleted successfully!', deletedProduct })
  } catch (error) {
    setConfigError(
      error,
      { action: 'DELETE - A image of product for id' },
      next
    )
  }
}

module.exports = controller
