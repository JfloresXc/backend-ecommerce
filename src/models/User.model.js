const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const ShemaModel = new Schema(
  {
    username: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Types.ObjectId,
      ref: 'Role',
      required: true,
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

setCustomedModel(ShemaModel)

module.exports = { User: model('User', ShemaModel) }
