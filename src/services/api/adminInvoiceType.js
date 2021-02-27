import axios from 'axios'

export default {
  getInvoiceTypes(params) {
    return axios.get('/invoicetypes', {
      params
    })
  },
  editInvoiceType(id, payload) {
    return axios.patch(`/invoicetypes/${id}`, payload)
  },
  saveInvoiceType(payload) {
    return axios.post('/invoicetypes/', payload)
  },
  deleteInvoiceType(id) {
    return axios.delete(`/invoicetypes/${id}`)
  }
}
