const {
  Types: { ObjectId },
} = require('mongoose')
const { Product: Model } = require('../models/Product.model')
const {
  ImagesOfProduct: ModelImagesOfProduct,
} = require('../models/ImagesOfProduct.model')
const { Category } = require('../models/Category.models')
const ErrorLocal = require('../utils/Error')
const { configError } = require('../helpers/catchHandler')
const MODULE = 'PRODUCT'
const { setConfigError } = configError({ module: MODULE })
const { isSomeEmptyFromModel } = require('../helpers/validations')
const { uploadImageToDB, deleteImage } = require('../helpers/image.helper')
const { getSortOptions } = require('../utils/moongose-utils')

const controller = {}

/**
 * Obtener todos los productos.
 * Esto nos servirá para el listado de productos desde el administrador.
 * @returns {Array} Model Product
 */
controller.getProducts = async (req, res, next) => {
  try {
    const products = await Model.find({}).populate('category')
    res.status(200).json({ data: products })
  } catch (error) {
    setConfigError(error, { action: 'GET - All products' }, next)
  }
}

/**
 * Obtener productos mediante el id de la categoría.
 * Esto nos servirá para el filtro de categoría
 * @returns {Array} Model Product
 */
controller.getProductsForIdCategory = async (req, res, next) => {
  try {
    const { idCategory } = req.params

    const products = await Model.find({ category: ObjectId(idCategory) })
    res.status(200).json({ data: products })
  } catch (error) {
    setConfigError(error, { action: 'GET - All products' }, next)
  }
}

/**
 * Obtener productos mediante una búsqueda de texto
 * a partir de nombre y descripción.
 * También se puede filtrar por precio máximo y ordenar por precio.
 * Esto nos servirá para el buscador de un ecommerce.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
controller.getProductsForSearchParameters = async (req, res, next) => {
  try {
    const {
      searchtext = '',
      page = 1,
      limit = 1,
      maxprice = 1000,
      order = '',
      idcategory = '',
    } = req.query

    const query = {
      $or: [
        { name: { $regex: searchtext, $options: 'i' } },
        { description: { $regex: searchtext, $options: 'i' } },
      ],
      price: { $lte: maxprice },
      state: 1,
    }

    if (idcategory) query.category = ObjectId(idcategory)

    const count = await Model.countDocuments(query)
    const totalPages = Math.ceil(count / parseInt(limit))
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Model.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ ...getSortOptions(order) })
      .populate('category')
      .populate('images')

    res
      .status(200)
      .json({ data: { products, totalPages, totalProducts: count } })
  } catch (error) {
    setConfigError(error, { action: 'GET - Products from search' }, next)
  }
}

/**
 * Obtener productos mediante el id familia.
 * Esto nos servirá para el navbar en un ecommerce.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
controller.getProductsForIdFamily = async (req, res, next) => {
  try {
    const { idFamily } = req.params
    if (!idFamily)
      throw new ErrorLocal({ message: 'IdFamily not found', statusCode: 400 })

    const { page = 1, limit = 1, maxprice = 1000, order = '' } = req.query

    const categories =
      (await Category.find({ family: ObjectId(idFamily) })) || []

    const query = {
      price: { $lte: maxprice },
      category: { $in: categories.map((cat) => cat._id) },
      state: 1,
    }

    const count = await Model.countDocuments(query)
    const totalPages = Math.ceil(count / parseInt(limit))
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Model.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ ...getSortOptions(order) })
      .populate({
        path: 'category',
        populate: {
          path: 'family',
          match: { _id: idFamily },
        },
      })
      .populate('images')

    res
      .status(200)
      .json({ data: { totalPages, totalProducts: count, products } })
  } catch (error) {
    setConfigError(error, { action: 'GET - Products for idFamily' }, next)
  }
}

/**
 * Obtener un producto mediante el id.
 * Este metodo cuenta con permisos de administrador.
 * @returns {Object} Model Product
 */
controller.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const product = await Model.findById(id).populate('category')
    res.json({ data: product })
  } catch (error) {
    setConfigError(
      error,
      { action: 'GET - One product for id in administrator' },
      next
    )
  }
}

/**
 * Obtener un producto activo mediante el id.
 * Esto nos servirá para mostrar el detalle de un producto, ademas de sus imagénes.
 * Este metodo no cuenta con permisos de administrador.
 */
controller.getActivedProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

    const product = await Model.findById(id)
      .populate({
        path: 'category',
        populate: {
          path: 'family',
        },
      })
      .populate('images')
    res.json({ data: product })
  } catch (error) {
    setConfigError(error, { action: 'GET - One product for id in user' }, next)
  }
}

/**
 * Obtener imagenes de un producto mediante el id.
 * @returns {Array} Model ImagesOfProduct
 */
controller.getImagesForIdProduct = async (req, res, next) => {
  try {
    const { idProduct } = req.params

    const images = await ModelImagesOfProduct.find({
      product: ObjectId(idProduct),
    })
    res.status(200).json({ data: images })
  } catch (error) {
    setConfigError(error, { action: 'GET - All images for a product' }, next)
  }
}

/**
 * Crear un nuevo producto.
 * @returns {Object} Model Product
 */
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
    res.status(200).json({ data: response })
  } catch (error) {
    setConfigError(error, { action: 'POST - Create a new product' }, next)
  }
}

/**
 * Crear una nueva imagen para un producto específico.
 * @returns {String} Mensaje de éxito
 */
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
    console.log(idProduct)

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

/**
 * Actualizar un producto mediante el id.
 * @returns {Object} Model Product
 */
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
    res.status(200).json({ data: response })
  } catch (error) {
    setConfigError(error, { action: 'PUT - Update a product for id' }, next)
  }
}

/**
 * Eliminar un producto mediante el id.
 * @returns {Object} Model Product
 */
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
    res
      .status(200)
      .json({ message: '¡Deleted successfully!', data: deletedProduct })
  } catch (error) {
    setConfigError(error, { action: 'DELETE - A product for id' }, next)
  }
}

/**
 * Eliminar una imagen de un producto mediante el id del producto.
 *
 */
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

    res
      .status(200)
      .json({ message: '¡Deleted successfully!', data: deletedProduct })
  } catch (error) {
    setConfigError(
      error,
      { action: 'DELETE - A image of product for id' },
      next
    )
  }
}

module.exports = controller
