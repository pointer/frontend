import axios from 'axios'

export default {
  getAllInvoiceLineItems() {
    return axios.get('/invoiceLineItems/all')
  }
}
