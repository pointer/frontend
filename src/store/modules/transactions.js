import * as types from '@/store/mutation-types'
import api from '@/services/api/transactions'
import { handleError } from '@/utils/utils.js'

const getters = {
  allTransactions: (state) => state.allTransactions
}

const actions = {
  getAllTransactions({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllTransactions()
        .then((response) => {
          if (response.status === 200) {
            const transactions = []
            const array = response.data
            array.forEach((element) => {
              transactions.push(element.transaction_comment)
            })
            commit(types.FILL_ALL_TRANSACTIONS, transactions)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  }
}

const mutations = {
  [types.FILL_ALL_TRANSACTIONS](state, transactions) {
    state.allTransactions = transactions
  }
}

const state = {
  allTransactions: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
