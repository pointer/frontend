import * as types from '@/store/mutation-types'
import api from '@/services/api/adminProductType'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  producttypes: (state) => state.producttypes,
  totalProductTypes: (state) => state.totalProductTypes
}

const actions = {
  getProductTypes({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getProductTypes(payload)
        .then((response) => {
          if (response.status === 200) {
            // // console.log(response.data.docs)
            commit(types.PRODUCTTYPES, response.data.docs)
            commit(types.TOTAL_PRODUCTTYPES, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editProductType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        product_type_code: payload.product_type_code,
        product_type_designation: payload.product_type_designation,
        product_type_details: payload.product_type_details,
        tax_rating: payload.tax_rating
      }
      api
        .editProductType(payload._id, data)
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
  saveProductType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveProductType(payload)
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
  deleteProductType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteProductType(payload)
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
  [types.PRODUCTTYPES](state, producttypes) {
    state.producttypes = producttypes
  },
  [types.TOTAL_PRODUCTTYPES](state, value) {
    state.totalProductTypes = value
  }
}

const state = {
  producttypes: [],
  totalProductTypes: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
