import * as types from '@/store/mutation-types'
import api from '@/services/api/accounts'
import { handleError } from '@/utils/utils.js'

const getters = {
  counters: (state) => state.counters
}

const actions = {
  getCounters({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getCounters()
        .then((response) => {
          if (response.status === 200) {
            // const accounts = []
            // const array = response.data
            // array.forEach((element) => {
            //   accounts.push(element.account_name)
            // })
            commit(types.COUNTERS, response.data)
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
  [types.COUNTERS](state, counters) {
    state.counters = counters
  }
}

const state = {
  counters: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
