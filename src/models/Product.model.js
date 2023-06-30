const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    priceBefore: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
    },
    brand: {
      type: String,
      default: 'Personality',
    },
    state: {
      type: Number,
      default: 1,
    },
    category: {
      type: Types.ObjectId,
      required: true,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
)

setCustomedModel(SchemaModel)

module.exports = { Product: model('Product', SchemaModel) }
