const { bucket } = require('../config/firebase')
const ErrorLocal = require('../utils/Error')

async function uploadImageToDB({ file }) {
  try {
    const storagePath = `ecommerce/${file.name}`
    const fileRef = bucket.file(storagePath)

    // Sube el archivo a Firebase Storage
    await fileRef.save(file.data)

    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Fecha de expiración del enlace (ajusta según tus necesidades)
    })
    return { url }
  } catch (error) {
    throw new ErrorLocal({ message: error.message, statusCode: 400 })
  }
}

module.exports = { uploadImageToDB }
