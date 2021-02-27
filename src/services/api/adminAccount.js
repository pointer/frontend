import axios from 'axios'

export default {
  getAccounts(params) {
    return axios.get('/accounts', {
      params
    })
  },
  editAccount(id, payload) {
    return axios.patch(`/accounts/${id}`, payload)
  },
  saveAccount(payload) {
    return axios.post('/accounts/', payload)
  },
  deleteAccount(id) {
    return axios.delete(`/accounts/${id}`)
  }
}
