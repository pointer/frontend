import * as types from '@/store/mutation-types'
import api from '@/services/api/invoices'
import { handleError } from '@/utils/utils.js'

const getters = {
  allInvoices: (state) => state.allInvoices
}

const actions = {
  getAllInvoices({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllInvoices()
        .then((response) => {
          if (response.status === 200) {
            const invoices = []
            const array = response.data
            array.forEach((element) => {
              invoices.push(element.invoice_num)
            })
            commit(types.FILL_ALL_INVOICES, invoices)
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
  [types.FILL_ALL_INVOICES](state, invoices) {
    state.allInvoices = invoices
  }
}

const state = {
  allInvoices: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
