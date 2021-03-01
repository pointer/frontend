import * as types from '@/store/mutation-types'
import api from '@/services/api/adminAccount'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  accounts: (state) => state.accounts,
  totalAccounts: (state) => state.totalAccounts
}

const actions = {
  getAccounts({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getAccounts(payload)
        .then((response) => {
          if (response.status === 200) {
            // // console.log(response.data)
            commit(types.ACCOUNTS, response.data.docs)
            commit(types.TOTAL_ACCOUNTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editAccount({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editAccount(payload._id, payload)
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
  saveAccount({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveAccount(payload)
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
  deleteAccount({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteAccount(payload)
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
  [types.ACCOUNTS](state, accounts) {
    state.accounts = accounts
  },
  [types.TOTAL_ACCOUNTS](state, value) {
    state.totalAccounts = value
  }
}

const state = {
  accounts: [],
  totalAccounts: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
