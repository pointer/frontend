import * as types from '@/store/mutation-types'
import api from '@/services/api/adminUsers'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  users: (state) => state.users,
  totalUsers: (state) => state.totalUsers
}

const actions = {
  getUsers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getUsers(payload)
        .then((response) => {
          if (response.status === 200) {
            // const userArray = response.data.docs
            // userArray.forEach(element => {
            //   for (const [key, value] of Object.entries(element)) {
            //     if (key === 'avatar' && value.data !== undefined) {
            //       if (value.data.startsWith('blob')) {
            //         // const avatar = `${value.data.substr(0, 4)}:${value.data.substr(
            //         //   4,
            //         //   value.data.length
            //         // )}`
            //         value.data =
            //           'blob:http://localhost:8080/a3f6b9cc+daee+45c4+a86b+612d85951850'
            //         // console.log(value.data)
            //       }
            //     }
            //   }
            // })
            // // console.log(response.data.docs)
            commit(types.USERS, response.data.docs)
            commit(types.TOTAL_USERS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        username: payload.username,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
        firstname: payload.firstname,
        lastname: payload.lastname,
        observations: payload.observations
      }

      api
        .editUser(payload._id, data)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  saveUser({ commit }, payload) {
    // debugger
    // // console.log('payload.avatar: ', payload.avatar)
    // let fileType = ''
    // for (const pair of payload.avatar.formData.entries()) {
    //   fileType = pair[1].type
    // }
    // // payload.avatar = {
    // payload.contentType = fileType
    // payload.imageURL = payload.avatar.imageURL
    // }
    // // console.log(
    //   'Object.fromEntries : ',
    //   JSON.stringify(Object.fromEntries(payload.formData.entries()))
    // )
    // for (const pair of req.avatar.formData.entries()) {
    //   fileType = pair[1].type
    // }
    // const formData = payload.serializeObject()
    // // console.log('serializeObject ', formData)
    // // console.log(payload)
    // debugger
    return new Promise((resolve, reject) => {
      api
        .saveUser(payload)
        .then((response) => {
          if (response.status === 201) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  deleteUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteUser(payload)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.DELETED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  }
}

const mutations = {
  [types.USERS](state, users) {
    state.users = users
  },
  [types.TOTAL_USERS](state, value) {
    state.totalUsers = value
  }
}

const state = {
  users: [],
  totalUsers: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
