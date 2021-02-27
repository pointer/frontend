import * as types from '@/store/mutation-types'
import api from '@/services/api/productClass'
import { handleError } from '@/utils/utils.js'

const getters = {
  allPurchaseClass: (state) => state.allPurchaseClass,
  allSaleClass: (state) => state.allSaleClass
}

const actions = {
  getAllProductClass({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllProductClass()
        .then((response) => {
          if (response.status === 200) {
            const purchaseClass_ = []
            const saleClass_ = []
            response.data.forEach((element) => {
              purchaseClass_.push(element.purchase_class)
              saleClass_.push(element.sale_class)
            })
            commit(types.FILL_SALE_CLASS, saleClass_)
            commit(types.FILL_PURCHASE_CLASS, purchaseClass_)
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
  [types.FILL_PURCHASE_CLASS](state, productClass) {
    state.allPurchaseClass = productClass
  },
  [types.FILL_SALE_CLASS](state, productClass) {
    state.allSaleClass = productClass
  }
}

const state = {
  allPurchaseClass: [],
  allSaleClass: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
