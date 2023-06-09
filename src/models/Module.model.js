const { model, Schema } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const Module = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      unique: true,
      required: true
    },
    state: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
)

setCustomedModel(Module)

module.exports = { Module: model('Module', Module) }
