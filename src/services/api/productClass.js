import axios from 'axios'

export default {
  getAllProductClass() {
    return axios.get('/productClass/all')
  }
}
