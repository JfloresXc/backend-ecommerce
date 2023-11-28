const { GoogleSpreadsheet } = require('google-spreadsheet')
const { JWT } = require('google-auth-library')

const credentials = require('../../credentials.json')

const googleId = '1sx0XgcFsb9v5eqjtci-kU2vEKmA8k2JqH78gFMziaH8'
// Lee las variables de entorno
const serviceAccountEmail = credentials.client_email
const privateKey = credentials.private_key.replace(/\\n/g, '\n') // Reemplaza los caracteres de escape

async function accessGoogleSheet(numberSheet = 0) {
  const serviceAccountAuth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const document = new GoogleSpreadsheet(googleId, serviceAccountAuth)
  await document.loadInfo()

  const sheet = document.sheetsByIndex[numberSheet]
  return sheet
}

// accessGoogleSheet()

const getRows = async () => {
  const sheet = await accessGoogleSheet()
  const rows = await sheet.getRows()
  return rows
}

const addRow = async (row) => {
  const sheet = await accessGoogleSheet()
  const response = await sheet.addRow(row)
  return response
}

module.exports = {
  getRows,
  addRow,
}
