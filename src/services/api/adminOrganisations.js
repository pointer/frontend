import axios from 'axios'

export default {
  getOrganisations(params) {
    return axios.get('/organisations', {
      params
    })
  },
  editOrganisation(id, payload) {
    return axios.patch(`/organisations/${id}`, payload)
  },
  saveOrganisation(payload) {
    return axios.post('/organisations/', payload)
  },
  deleteOrganisation(id) {
    return axios.delete(`/organisations/${id}`)
  }
}
