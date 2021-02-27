import axios from 'axios'

export default {
  getAllProducts() {
    return axios.get('/products/all')
  }
}
