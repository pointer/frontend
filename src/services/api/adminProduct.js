import axios from 'axios'

export default {
  getProducts(params) {
    return axios.get('/products', {
      params
    })
  },
  editProduct(id, payload) {
    return axios.patch(`/products/${id}`, payload)
  },
  saveProduct(payload) {
    return axios.post('/products/', payload)
  },
  deleteProduct(id) {
    return axios.delete(`/products/${id}`)
  }
}
