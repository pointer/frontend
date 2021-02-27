import axios from 'axios'

export default {
  getTransactionTypes(params) {
    return axios.get('/transactiontypes', {
      params
    })
  },
  editTransactionType(id, payload) {
    return axios.patch(`/transactiontypes/${id}`, payload)
  },
  saveTransactionType(payload) {
    return axios.post('/transactiontypes/', payload)
  },
  deleteTransactionType(id) {
    return axios.delete(`/transactiontypes/${id}`)
  }
}
