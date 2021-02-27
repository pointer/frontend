import * as types from '@/store/mutation-types'
import api from '@/services/api/adminInvoiceType'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  invoicetypes: (state) => state.invoicetypes,
  totalInvoiceTypes: (state) => state.totalInvoiceTypes
}

const actions = {
  getInvoiceTypes({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getInvoiceTypes(payload)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.docs)
            commit(types.INVOICETYPES, response.data.docs)
            commit(types.TOTAL_INVOICETYPES, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editInvoiceType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editInvoiceType(payload._id, payload)
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
  saveInvoiceType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveInvoiceType(payload)
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
  deleteInvoiceType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteInvoiceType(payload)
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
  [types.INVOICETYPES](state, invoicetypes) {
    state.invoicetypes = invoicetypes
  },
  [types.TOTAL_INVOICETYPES](state, value) {
    state.totalInvoiceTypes = value
  }
}

const state = {
  invoicetypes: [],
  totalInvoiceTypes: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
