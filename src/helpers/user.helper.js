const ErrorLocal = require('../utils/Error')
const { User: UserModel } = require('../models/User.model')
const helper = {}

helper.isExistUser = async ({ email }) => {
  const user = await UserModel.findOne({ email })
  if (!user)
    throw new ErrorLocal({ message: 'User not found', statusCode: 405 })

  return { user }
}

helper.isNotExistUser = async ({ email }) => {
  const user = await UserModel.findOne({ email })
  if (user)
    throw new ErrorLocal({ message: 'Email already created', statusCode: 405 })

  return { user }
}

helper.comparePassword = ({ password, passwordToCompare }) => {
  const isCorrectPassword = password === passwordToCompare
  if (!isCorrectPassword)
    throw new ErrorLocal({ message: 'Incorrect password', statusCode: 405 })
}

module.exports = helper
