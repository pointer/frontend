import * as types from '@/store/mutation-types'
import api from '@/services/api/adminProductClass'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  purchaseClass: (state) => state.purchaseClass,
  saleClass: (state) => state.saleClass,
  totalProductClass: (state) => state.totalProductClass
}

const actions = {
  getProductClass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getProductClass(payload)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.docs)
            const productClass_ = []
            response.data.forEach((element) => {
              productClass_.push(element.product_class)
            })
            const saleClass_ = []
            response.data.forEach((element) => {
              saleClass_.push(element.sale_class)
            })

            commit(types.SALE_CLASS, saleClass_)
            commit(types.PURCHASE_CLASS, productClass_)
            commit(types.TOTAL_PRODUCTCLASSES, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editProductClass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        name: payload.name
      }
      api
        .editProductClass(payload._id, data)
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
  saveProductClass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveProductClass(payload)
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
  deleteProductClass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteProductClass(payload)
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
  [types.SALE_CLASS](state, saleClass) {
    state.saleClass = saleClass
  },
  [types.PURCHASE_CLASS](state, purchaseClass) {
    state.purchaseClass = purchaseClass
  },
  [types.TOTAL_PRODUCTCLASSES](state, value) {
    state.totalProductClasses = value
  }
}

const state = {
  purchaseClass: [],
  saleClass: [],
  totalProductClasses: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
