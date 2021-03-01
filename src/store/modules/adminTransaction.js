import * as types from '@/store/mutation-types'
import api from '@/services/api/adminTransaction'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  transactions: (state) => state.transactions,
  totalTransactions: (state) => state.totalTransactions
}

const actions = {
  getTransactions({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getTransactions(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data.docs)
            commit(types.TRANSACTIONS, response.data.docs)
            commit(types.TOTAL_TRANSACTIONS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editTransaction({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editTransaction(payload._id, payload)
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
  saveTransaction({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveTransaction(payload)
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
  deleteTransaction({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteTransaction(payload)
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
  [types.TRANSACTIONS](state, transactions) {
    state.transactions = transactions
  },
  [types.TOTAL_TRANSACTIONS](state, value) {
    state.totalTransactions = value
  }
}

const state = {
  transactions: [],
  totalTransactions: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
