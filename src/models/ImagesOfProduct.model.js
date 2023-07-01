const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
    },
    isPrincipal: {
      type: Boolean,
    },
    product: {
      type: Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
)

setCustomedModel(SchemaModel)

module.exports = { ImagesOfProduct: model('ImagesOfProduct', SchemaModel) }
