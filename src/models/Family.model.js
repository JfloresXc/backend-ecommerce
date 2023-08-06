const { model, Schema } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const SchemaModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
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

module.exports = { Family: model('Family', SchemaModel) }
