const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NDVmOTYzZmExZWY4YTQ3NjA5YzhmOTQiLCJ1c2VybmFtZSI6ImpmbG9yZXN4YyIsImlhdCI6MTY4Mzk4NTk5OSwiZXhwIjoxNjg0NTkwNzk5fQ.Jz3I-TOxxq3SXKR_YXbM6rp9EioFRpRry1IxPIgCYi8'
const API_URLS = {
  productUrl: '/api/product',
  authUrl: '/api/auth'
}

const HEADERS = { Authorization: TOKEN }

const PRODUCTS = [
  {
    id: 30,
    name: 'Key Holder',
    description: 'Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality',
    price: 30,
    discountPercentage: 2.92,
    brand: 'Golden',
    category: '14121351',
    thumbnail: 'https://i.dummyjson.com/data/products/30/thumbnail.jpg'
  }
]

const USERS = [
  {
    username: 'test',
    email: 'test@test.com',
    password: 'test'
  }
]

const getAllProducts = async () => {
  const { body: products } = await api
    .get(`${API_URLS.productUrl}`)
    .set('Authorization', TOKEN)

  return { products }
}

module.exports = {
  api,
  PRODUCTS,
  USERS,
  HEADERS,
  API_URLS,
  getAllProducts
}
