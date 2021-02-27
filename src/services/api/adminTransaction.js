import axios from 'axios'

export default {
  getTransactions(params) {
    return axios.get('/transactions', {
      params
    })
  },
  editTransaction(id, payload) {
    return axios.patch(`/transactions/${id}`, payload)
  },
  saveTransaction(payload) {
    return axios.post('/transactions/', payload)
  },
  deleteTransaction(id) {
    return axios.delete(`/transactions/${id}`)
  }
}
