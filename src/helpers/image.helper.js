const { bucket } = require('../config/firebase')
const ErrorLocal = require('../utils/Error')

const FILEPATH = 'ecommerce'
async function uploadImageToDB({ file, fileName }) {
  try {
    const storagePath = `${FILEPATH}/${fileName}`
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

async function deleteImage({ fileName }) {
  try {
    const filePath = `${FILEPATH}/${fileName}`

    // Elimina el archivo del bucket
    const response = await bucket.file(filePath).delete()

    return response
  } catch (error) {
    throw new ErrorLocal({ message: error.message, statusCode: 400 })
  }
}

module.exports = { uploadImageToDB, deleteImage }
