import axios from 'axios'

export default {
  getSuppliers(params) {
    return axios.get('/suppliers', {
      params
    })
  },
  editSupplier(id, payload) {
    return axios.patch(`/suppliers/${id}`, payload)
  },
  saveSupplier(payload) {
    return axios.post('/suppliers/', payload)
  },
  deleteSupplier(id) {
    return axios.delete(`/suppliers/${id}`)
  }
}
