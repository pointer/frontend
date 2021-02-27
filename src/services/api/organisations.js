import axios from 'axios'

export default {
  getAllOrganisations() {
    return axios.get('/organisations/all')
  }
}
