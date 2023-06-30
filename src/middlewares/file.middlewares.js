const fileMiddleware = (req, res, next) => {
  if (req.files) {
    const files = req.files ?? []
    const limit = 1024 * 1024
    const file = files.file

    if (file.size > limit) {
      return res.json({
        message: `File ${file.name} size limit has been reached`,
      })
    }
    next()
  } else return res.status(403).json({ message: 'Files not found' })
}

module.exports = { fileMiddleware }
