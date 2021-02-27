import * as types from '@/store/mutation-types'
import api from '@/services/api/accounts'
import { handleError } from '@/utils/utils.js'

const getters = {
  allAccounts: (state) => state.allAccounts
}

const actions = {
  getAllAccounts({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllAccounts()
        .then((response) => {
          if (response.status === 200) {
            const accounts = []
            const array = response.data
            array.forEach((element) => {
              accounts.push(element.account_name)
            })
            commit(types.FILL_ALL_ACCOUNTS, accounts)
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
  [types.FILL_ALL_ACCOUNTS](state, accounts) {
    state.allAccounts = accounts
  }
}

const state = {
  allAccounts: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
