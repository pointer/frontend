import axios from 'axios'

export default {
  getAllOrderItems() {
    return axios.get('/orderItems/all')
  }
}
