import axios from 'axios'

export default {
  getAllAccounts() {
    return axios.get('/accounts/all')
  }
}
