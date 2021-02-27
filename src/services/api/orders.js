import axios from 'axios'

export default {
  getAllOrders() {
    return axios.get('/orders/all')
  }
}
