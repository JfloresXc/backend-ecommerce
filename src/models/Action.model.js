const { model, Schema } = require('mongoose')
const { setCustomedModel } = require('../helpers/mongooseHandler')

const MongoSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    code: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
)

setCustomedModel(MongoSchema)

module.exports = { Action: model('Action', MongoSchema) }
