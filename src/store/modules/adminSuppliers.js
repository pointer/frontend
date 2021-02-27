import * as types from '@/store/mutation-types'
import api from '@/services/api/adminSuppliers'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  suppliers: (state) => state.suppliers,
  totalSuppliers: (state) => state.totalSuppliers
}

const actions = {
  getSuppliers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getSuppliers(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data.docs)
            commit(types.SUPPLIERS, response.data.docs)
            commit(types.TOTAL_SUPPLIERS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editSupplier({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editSupplier(payload._id, payload)
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
  saveSupplier({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveSupplier(payload)
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
  deleteSupplier({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteSupplier(payload)
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
  [types.SUPPLIERS](state, suppliers) {
    state.suppliers = suppliers
  },
  [types.TOTAL_SUPPLIERS](state, value) {
    state.totalSuppliers = value
  }
}

const state = {
  suppliers: [],
  totalSuppliers: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
