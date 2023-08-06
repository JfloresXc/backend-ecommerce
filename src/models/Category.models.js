const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    family: {
      type: Types.ObjectId,
      required: true,
      ref: 'Family',
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

module.exports = { Category: model('Category', SchemaModel) }
