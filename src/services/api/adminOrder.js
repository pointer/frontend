import axios from 'axios'

export default {
  getOrders(params) {
    return axios.get('/orders', {
      params
    })
  },
  editOrder(id, payload) {
    return axios.patch(`/orders/${id}`, payload)
  },
  saveOrder(payload) {
    return axios.post('/orders/', payload)
  },
  deleteOrder(id) {
    return axios.delete(`/orders/${id}`)
  }
}
