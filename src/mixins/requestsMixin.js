const axios = require('axios')
const APIURL = 'https://represent.opennorth.ca'
export const requestsMixin = {
  methods: {
    getRepresentatives(lat, lng) {
      return axios.get(`${APIURL}/representatives/?point=${lat},${lng}`)
    },
    getBoundaries(lat, lng) {
      return axios.get(`${APIURL}/boundaries/?contains=${lat},${lng}`)
    },
    getRepresentativeSetsRepresentatives(set, lat, lng) {
      return axios.get(`${APIURL}/representatives/${set}/?point=${lat},${lng}`)
    },
    getRepresentativeSets() {
      return axios.get(`${APIURL}/representative-sets/?offset=0&limit=200`)
    }
  }
}
