import axios from 'axios'

export default {
  getAllTransactionTypes() {
    return axios.get('/transactionttypes/all')
  }
}
