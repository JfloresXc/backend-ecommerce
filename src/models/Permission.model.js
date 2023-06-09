const { model, Schema, Types } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const Permission = new Schema(
  {
    role: {
      type: Types.ObjectId,
      required: true,
      ref: 'Role'
    },
    codeModule: { // 15
      type: String,
      required: true
    },
    codeAction: { // 1
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

setCustomedModel(Permission)

module.exports = { Permission: model('Permission', Permission) }
