import axios from 'axios'

export default {
  getInvoiceLineItems(params) {
    return axios.get('/invoiceLineItems', {
      params
    })
  },
  editInvoiceLineItem(id, payload) {
    return axios.patch(`/invoiceLineItems/${id}`, payload)
  },
  saveInvoiceLineItem(payload) {
    return axios.post('/invoiceLineItems/', payload)
  },
  deleteInvoiceLineItem(id) {
    return axios.delete(`/invoiceLineItems/${id}`)
  }
}
