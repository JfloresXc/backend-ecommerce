const { model, Schema } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const Role = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      default: ''
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

setCustomedModel(Role)

module.exports = { Role: model('Role', Role) }
