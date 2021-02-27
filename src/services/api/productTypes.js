import axios from 'axios'

export default {
  getAllProductTypes() {
    return axios.get('/producttypes/all')
  }
}
