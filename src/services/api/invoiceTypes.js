import axios from 'axios'

export default {
  getAllInvoiceTypes() {
    return axios.get('/invoicetypes/all')
  }
}
