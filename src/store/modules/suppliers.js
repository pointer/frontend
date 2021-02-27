import * as types from '@/store/mutation-types'
import api from '@/services/api/suppliers'
import { handleError } from '@/utils/utils.js'

const getters = {
  allSuppliers: (state) => state.allSuppliers
}

const actions = {
  getAllSuppliers({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllSuppliers()
        .then((response) => {
          if (response.status === 200) {
            const suppliers_ = []
            const array = response.data.docs
            array.forEach((element) => {
              suppliers_.push(element.company)
            })
            commit(types.FILL_ALL_SUPPLIERS, suppliers_)
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
  [types.FILL_ALL_SUPPLIERS](state, suppliers_) {
    state.allSuppliers = suppliers_
  }
}

const state = {
  allSuppliers: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
