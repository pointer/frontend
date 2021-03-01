import * as types from '@/store/mutation-types'
import api from '@/services/api/adminCustomer'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  customers: (state) => state.customers,
  totalCustomers: (state) => state.totalCustomers
}

const actions = {
  getCustomers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getCustomers(payload)
        .then((response) => {
          if (response.status === 200) {
            // // console.log(response.data)
            commit(types.CUSTOMERS, response.data)
            commit(types.TOTAL_CUSTOMERS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editCustomer({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editCustomer(payload._id, payload)
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
  saveCustomer({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveCustomer(payload)
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
  deleteCustomer({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteCustomer(payload)
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
  [types.CUSTOMERS](state, customers) {
    state.customers = customers
  },
  [types.TOTAL_CUSTOMERS](state, value) {
    state.totalCustomers = value
  }
}

const state = {
  customers: [],
  totalCustomers: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
