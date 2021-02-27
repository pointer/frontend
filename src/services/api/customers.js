import axios from 'axios'

export default {
  getAllCustomers() {
    return axios.get('/customers/all')
  }
}
