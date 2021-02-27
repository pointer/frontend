import axios from 'axios'

export default {
  getInvoices(params) {
    return axios.get('/invoices', {
      params
    })
  },
  editInvoice(id, payload) {
    return axios.patch(`/invoices/${id}`, payload)
  },
  saveInvoice(payload) {
    return axios.post('/invoices/', payload)
  },
  deleteInvoice(id) {
    return axios.delete(`/invoices/${id}`)
  }
}
