import axios from 'axios'

export default {
  getOrderItems(params) {
    return axios.get('/orderItems', {
      params
    })
  },
  editOrderItem(id, payload) {
    return axios.patch(`/orderItems/${id}`, payload)
  },
  saveOrderItem(payload) {
    return axios.post('/orderItems/', payload)
  },
  deleteOrderItem(id) {
    return axios.delete(`/orderItems/${id}`)
  }
}
