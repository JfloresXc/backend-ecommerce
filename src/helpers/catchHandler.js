const configError = ({ module = 'NOT MODULE' }) => {
  const setConfigError = (error, { action }, next) => {
    error.module = module
    error.action = action
    next(error)
  }

  return { setConfigError }
}

module.exports = { configError }
