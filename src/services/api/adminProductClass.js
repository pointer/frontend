import axios from 'axios'

export default {
  getProductClass(params) {
    return axios.get('/productClass', {
      params
    })
  },
  editProductClass(id, payload) {
    return axios.patch(`/productClass/${id}`, payload)
  },
  saveProductClass(payload) {
    return axios.post('/productClass/', payload)
  },
  deleteProductClass(id) {
    return axios.delete(`/productClass/${id}`)
  }
}
