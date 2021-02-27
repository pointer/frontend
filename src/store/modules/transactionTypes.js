import * as types from '@/store/mutation-types'
import api from '@/services/api/transactionTypes'
import { handleError } from '@/utils/utils.js'

const getters = {
  allTransactionTypes: (state) => state.allTransactionTypes
}

const actions = {
  getAllTransactionTypes({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllTransactionTypes()
        .then((response) => {
          if (response.status === 200) {
            const transactiontypes = []
            const array = response.data
            array.forEach((element) => {
              transactiontypes.push(element.transaction_type)
            })
            commit(types.FILL_ALL_TRANSACTIONTYPES, transactiontypes)
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
  [types.FILL_ALL_TRANSACTIONTYPES](state, transactiontypes) {
    state.allTransactionTypes = transactiontypes
  }
}

const state = {
  allTransactionTypes: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
