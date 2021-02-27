import axios from 'axios'

export default {
  getUsers(params) {
    return axios.get('/users/all', {
      params
    })
  },
  editUser(id, payload) {
    return axios.patch(`/users/${id}`, payload)
  },
  saveUser(payload) {
    // console.log('services/api payload :', payload)
    return axios.post('/users/', payload)
  },
  deleteUser(id) {
    return axios.delete(`/users/${id}`)
  }
}
