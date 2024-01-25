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
        nameClient: orders[i].get('nombreCliente'),
        phonenumber: orders[i].get('telefono'),
        departament: orders[i].get('departarmento'),
        province: orders[i].get('provincia'),
        district: orders[i].get('distrito'),
        address: orders[i].get('direccion'),
        nameProduct: orders[i].get('nombreProducto'),
        quantity: orders[i].get('cantidad'),
        unitPrice: orders[i].get('precioUnitario'),
        total: orders[i].get('total'),
        state: orders[i].get('estado'),
        date: orders[i].get('fecha'),
      }
    }

    res.status(200).json({ data: orders })
  } catch (error) {
    setConfigError(error, { action: 'GET - All orders' }, next)
  }
}

controller.getOrderForId = async (req, res, next) => {
  const { id } = req.params
  if (!id) throw new ErrorLocal({ message: 'Id not found', statusCode: 400 })

  try {
    const orders = await getRows()

    for (let i = 0; i < orders.length; i++) {
      orders[i] = {
        id: orders[i].get('id'),
        nameClient: orders[i].get('nombreCliente'),
        phonenumber: orders[i].get('telefono'),
        departament: orders[i].get('departarmento'),
        province: orders[i].get('provincia'),
        district: orders[i].get('distrito'),
        address: orders[i].get('direccion'),
        nameProduct: orders[i].get('nombreProducto'),
        quantity: orders[i].get('cantidad'),
        unitPrice: orders[i].get('precioUnitario'),
        total: orders[i].get('total'),
        state: orders[i].get('estado'),
        date: orders[i].get('fecha'),
      }
    }

    const findedOrders = orders.filter((order) => order.id === id)
    res.status(200).json({ data: findedOrders })
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

    const nowDate = new Date().toLocaleString('es-PE', {
      timeZone: 'America/Lima',
    })

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

      console.log(parseFloat(unitPrice * quantity), quantity, unitPrice)
      await addRow({
        id: idOrder,
        nombreCliente: nameClient,
        telefono: phonenumber,
        provincia: province,
        distrito: district,
        departamento: department,
        direccion: address,
        fecha: nowDate,
        nombreProducto: nameProduct,
        cantidad: parseInt(quantity),
        precioUnitario: parseFloat(unitPrice).toFixed(2),
        total: parseFloat(unitPrice * quantity).toFixed(2) || -1,
        estado: 'PENDIENTE',
      })
    }

    res.status(200).json({ data: { idOrder, products } })
  } catch (error) {
    setConfigError(error, { action: 'GET - All orders' }, next)
  }
}

module.exports = controller
