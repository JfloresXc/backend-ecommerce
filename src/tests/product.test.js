const moongose = require('mongoose')
const Product = require('../models/Product.model')
const { server } = require('../index')
const {
  api,
  PRODUCTS,
  API_URLS,
  HEADERS,
  getAllProducts
} = require('./helpers')

const { productUrl: API_URL } = API_URLS

beforeEach(async () => {
  await Product.deleteMany()

  for (const product of PRODUCTS) {
    const productModel = new Product(product)
    await productModel.save()
  }
})

describe('products', () => {
  test('are returned as json and status 200', async () => {
    await api
      .get(`${API_URL}`)
      .set(HEADERS)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`there are ${PRODUCTS.length} objects`, async () => {
    const { products } = await getAllProducts()

    expect(products).toHaveLength(PRODUCTS.length)
  })

  const description1 = PRODUCTS[0].description
  test(`to contains ${description1}`, async () => {
    const { products } = await getAllProducts()

    const descriptions = products.map(item => item.description)
    expect(descriptions).toContain(description1)
  })

  test('one note is not received with incorrect id', async () => {
    await api
      .get(`${API_URL}/1234`)
      .set(HEADERS)
      .expect(400)
  })

  test('one note is received with correct id', async () => {
    const { products } = await getAllProducts()
    const [firstProduct] = products

    const { body: oneProduct } = await api
      .get(`${API_URL}/${firstProduct.id}`)
      .set(HEADERS)
      .expect(200)

    const descriptions = products.map(item => item.description)
    expect(descriptions).toContain(oneProduct.description)
  })

  test('a empty note is not added', async () => {
    const newObject = {
      title: '',
      description: 'Test 3 Desc'
    }

    await api
      .post(`${API_URL}`)
      .set(HEADERS)
      .send(newObject)
      .expect(400)
  })

  test('a valid note can be added', async () => {
    const newObject = {
      title: 'Test 3 Title',
      description: 'Test 3 Desc'
    }

    const { body: addedProduct } = await api
      .post(`${API_URL}`)
      .set(HEADERS)
      .send(newObject)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { products } = await getAllProducts()
    const descriptions = products.map(item => item.description)

    expect(descriptions).toContain(addedProduct.description)
  })

  test('a note is not deleted for empty id', async () => {
    await api
      .delete(`${API_URL}`)
      .set(HEADERS)
      .expect(400)
  })

  test('a note is deleted for id', async () => {
    const { products: firstResponde } = await getAllProducts()

    await api
      .delete(`${API_URL}/${firstResponde[0].id}`)
      .set(HEADERS)
      .expect(200)

    const { products: secondResponse } = await getAllProducts()
    expect(secondResponse).toHaveLength(firstResponde.length - 1)
  })
})

afterAll(() => {
  server.close()
  moongose.connection.close()
})
