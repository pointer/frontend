import * as types from '@/store/mutation-types'
import api from '@/services/api/adminInvoiceLineItem'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  invoicelineitems: (state) => state.invoicelineitems,
  totalInvoiceLineitems: (state) => state.totalInvoiceLineitems
}

const actions = {
  getInvoiceLineitems({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getInvoiceLineitems(payload)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.docs)
            commit(types.INVOICELINEITEMS, response.data.docs)
            commit(types.TOTAL_INVOICELINEITEMS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editInvoiceLineitem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editInvoiceLineitem(payload._id, payload)
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
  saveInvoiceLineitem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveInvoiceLineitem(payload)
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
  deleteInvoiceLineitem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteInvoiceLineitem(payload)
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
  [types.INVOICELINEITEMS](state, invoicelineitems) {
    state.invoicelineitems = invoicelineitems
  },
  [types.TOTAL_INVOICELINEITEMS](state, value) {
    state.totalInvoiceLineitems = value
  }
}

const state = {
  invoicelineitems: [],
  totalInvoiceLineitems: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
