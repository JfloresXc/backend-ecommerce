const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    state: {
      type: Number,
      default: 1
    },
    idCollection: {
      type: Types.ObjectId,
      ref: 'Collection',
      required: true
    }
  },
  {
    timestamps: true
  }
)

setCustomedModel(SchemaModel)

module.exports = { Category: model('Category', SchemaModel) }
