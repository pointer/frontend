import * as types from '@/store/mutation-types'
import api from '@/services/api/adminInvoice'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  invoices: (state) => state.invoices,
  totalInvoices: (state) => state.totalInvoices
}

const actions = {
  getInvoices({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getInvoices(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data.docs)
            commit(types.INVOICES, response.data.docs)
            commit(types.TOTAL_INVOICES, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editInvoice({ commit }, payload) {
    const data = {
      invoice_status: payload.invoice_status,
      invoice_type: payload.invoice_type,
      invoice_details: payload.invoice_details,
      updated_by: payload.updated_by,
      invoice_no: payload.invoice_no
    }
    console.log(payload)
    return new Promise((resolve, reject) => {
      api
        .editInvoice(payload._id, data)
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
  saveInvoice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveInvoice(payload)
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
  deleteInvoice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteInvoice(payload)
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
  [types.INVOICES](state, invoices) {
    state.invoices = invoices
  },
  [types.TOTAL_INVOICES](state, value) {
    state.totalInvoices = value
  }
}

const state = {
  invoices: [],
  totalInvoices: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
