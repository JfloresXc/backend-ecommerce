const { model, Schema } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    nameClient: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    province: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      default: 0,
    },
    address: {
      type: Number,
      default: 0,
    },
    district: {
      type: String,
      default: 'Personality',
    },
    state: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

setCustomedModel(SchemaModel)

module.exports = { Order: model('Order', SchemaModel) }
