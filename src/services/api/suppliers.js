import axios from 'axios'

export default {
  getAllSuppliers() {
    return axios.get('/suppliers/all')
  }
}
