import * as types from '@/store/mutation-types'
import api from '@/services/api/organisations'
import { handleError } from '@/utils/utils.js'

const getters = {
  allOrganisations: (state) => state.allOrganisations
}

const actions = {
  getAllOrganisations({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllOrganisations()
        .then((response) => {
          if (response.status === 200) {
            // const accounts = []
            // const array = response.data
            // array.forEach((element) => {
            //   accounts.push(element.account_name)
            // })
            console.log(response.data)
            commit(types.FILL_ALL_ORGANISATIONS, response.data.docs)
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
  [types.FILL_ALL_ORGANISATIONS](state, accounts) {
    state.allOrganisations = accounts
  }
}

const state = {
  allOrganisations: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
