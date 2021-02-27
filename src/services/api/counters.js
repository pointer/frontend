import axios from 'axios'

export default {
  getCounters() {
    return axios.get('/counters')
  }
}
