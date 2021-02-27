import axios from 'axios'

export default {
  getProductTypes(params) {
    return axios.get('/producttypes', {
      params
    })
  },
  editProductType(id, payload) {
    return axios.patch(`/producttypes/${id}`, payload)
  },
  saveProductType(payload) {
    return axios.post('/producttypes/', payload)
  },
  deleteProductType(id) {
    return axios.delete(`/producttypes/${id}`)
  }
}
