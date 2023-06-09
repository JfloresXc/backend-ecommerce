const mongoose = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const KardexSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  dateOfMovement: {
    type: Date,
    required: true,
    default: Date.now
  },
  movementType: { // Es el tipo de movimiento del kardex
    type: String,
    required: true,
    enum: ['Compra', 'Venta', 'Devolución', 'Ajuste']
  },
  inputs: { // La cantidad de productos que ingresaron en la transacción.
    type: Number,
    required: true,
    default: 0
  },
  output: { // La cantidad de productos que salieron en la transacción.
    type: Number,
    required: true,
    default: 0
  },
  balance: { // Es el saldo resultante después de la transacción, que representa la cantidad de productos disponibles en ese momento.
    type: Number,
    required: true
  }
})

setCustomedModel(KardexSchema)

module.exports = { Kardex: mongoose.model('Kardex', KardexSchema) }
