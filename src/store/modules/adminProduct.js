import * as types from '@/store/mutation-types'
import api from '@/services/api/adminProduct'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  products: (state) => state.products,
  totalProducts: (state) => state.totalProducts
}

const actions = {
  getProducts({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getProducts(payload)
        .then((response) => {
          if (response.status === 200) {
            // // console.log(response.data.docs)
            commit(types.PRODUCTS, response.data.docs)
            commit(types.TOTAL_PRODUCTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editProduct({ commit }, payload) {
    // // console.log(payload)
    return new Promise((resolve, reject) => {
      api
        .editProduct(payload._id, payload)
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
  saveProduct({ commit }, payload) {
    // // console.log(payload)
    return new Promise((resolve, reject) => {
      api
        .saveProduct(payload)
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
  deleteProduct({ commit }, payload) {
    // // console.log(payload)
    return new Promise((resolve, reject) => {
      api
        .deleteProduct(payload)
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
  [types.PRODUCTS](state, products) {
    state.products = products
  },
  [types.TOTAL_PRODUCTS](state, value) {
    state.totalProducts = value
  }
}

const state = {
  products: [],
  totalProducts: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
