import axios from 'axios'

export default {
  getCustomers(params) {
    // console.log(params)
    return axios.get('/customers', {
      params
    })
  },
  editCustomer(id, payload) {
    return axios.patch(`/customers/${id}`, payload)
  },
  saveCustomer(payload) {
    return axios.post('/customers/', payload)
  },
  deleteCustomer(id) {
    return axios.delete(`/customers/${id}`)
  }
}
