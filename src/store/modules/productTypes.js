import * as types from '@/store/mutation-types'
import api from '@/services/api/productTypes'
import { handleError } from '@/utils/utils.js'

const getters = {
  allProductTypes: (state) => state.allProductTypes
}

const actions = {
  getAllProductTypes({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllProductTypes()
        .then((response) => {
          if (response.status === 200) {
            const producttypes = []
            const array = response.data
            array.forEach((element) => {
              producttypes.push(element.product_description)
            })
            commit(types.FILL_ALL_PRODUCTTYPES, producttypes)
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
  [types.FILL_ALL_PRODUCTTYPES](state, producttypes) {
    state.allProductTypes = producttypes
  }
}

const state = {
  allProductTypes: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
