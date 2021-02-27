import * as types from '@/store/mutation-types'
import api from '@/services/api/adminTransactionType'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  transactiontypes: (state) => state.transactiontypes,
  totalTransactionTypes: (state) => state.totalTransactionTypes
}

const actions = {
  getTransactionTypes({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getTransactionTypes(payload)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.docs)
            commit(types.TRANSACTIONTYPES, response.data.docs)
            commit(types.TOTAL_TRANSACTIONTYPES, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editTransactionType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editTransactionType(payload._id, payload)
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
  saveTransactionType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveTransactionType(payload)
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
  deleteTransactionType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteTransactionType(payload)
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
  [types.TRANSACTIONTYPES](state, transactiontypes) {
    state.transactiontypes = transactiontypes
  },
  [types.TOTAL_TRANSACTIONTYPES](state, value) {
    state.totalTransactionTypes = value
  }
}

const state = {
  transactiontypes: [],
  totalTransactionTypes: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
