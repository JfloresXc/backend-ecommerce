const { configError } = require('../helpers/catchHandler')
const MODULE = 'ORDER'
const { setConfigError } = configError({ module: MODULE })
const { getRows, addRow } = require('../config/spreadsheet')
const ErrorLocal = require('../utils/Error')
const { isSomeEmptyFromModel } = require('../helpers/validations')
const controller = {}
const crypto = require('crypto')

controller.getAllOrders = async (req, res, next) => {
  try {
    const orders = await getRows()

    for (let i = 0; i < orders.length; i++) {
      orders[i] = {
        id: orders[i].get('id'),
        name: orders[i].get('nombre'),
        phone: orders[i].get('telefono'),
        dni: orders[i].get('dni'),
        product: orders[i].get('producto'),
        state: orders[i].get('estado'),
        // email: orders[i].get('correo'),
      }
    }

    res.status(200).json(orders)
  } catch (error) {
    setConfigError(error, { action: 'GET - All orders' }, next)
  }
}

controller.postNewOrder = async (req, res, next) => {
  try {
    const body = req.body
    const {
      nameClient,
      phonenumber,
      department,
      province,
      district,
      address,
      products,
    } = body

    // let orderDate = new Date()

    if (products?.length === 0) {
      throw new ErrorLocal({
        message: 'Empty products amount',
        statusCode: 400,
      })
    }

    if (
      isSomeEmptyFromModel([
        nameClient,
        department,
        phonenumber,
        province,
        district,
        address,
      ])
    )
      return

    let idOrder = crypto.randomUUID({
      disableEntropyCache: true,
    })
    idOrder = idOrder.substring(0, 8)

    for (const product of products) {
      const { nameProduct = '', quantity = 0, unitPrice } = product

      await addRow({
        id: idOrder,
        nombreCliente: nameClient,
        telefono: phonenumber,
        provincia: province,
        distrito: district,
        departamento: department,
        direccion: address,
        nombreProducto: nameProduct,
        cantidad: quantity,
        precioUnitario: unitPrice,
        total: unitPrice * quantity || -1,
        estado: 'PENDIENTE',
      })
    }

    res.status(200).json(products)
  } catch (error) {
    setConfigError(error, { action: 'GET - All orders' }, next)
  }
}

module.exports = controller
