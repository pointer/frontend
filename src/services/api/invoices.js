import axios from 'axios'

export default {
  getAllInvoices() {
    return axios.get('/invoices/all')
  }
}
