import axios from 'axios'

export default {
  getAllTransactions() {
    return axios.get('/transactions/all')
  }
}
