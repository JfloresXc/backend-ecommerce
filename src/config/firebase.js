const admin = require('firebase-admin')
const serviceAccount = require('../config/ecommerce-c9bd6-firebase-adminsdk-k7o1z-c32e1cd5bb.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://ecommerce-c9bd6.appspot.com',
})

module.exports = {
  bucket: admin.storage().bucket(),
}
