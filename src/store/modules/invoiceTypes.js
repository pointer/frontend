import * as types from '@/store/mutation-types'
import api from '@/services/api/invoiceTypes'
import { handleError } from '@/utils/utils.js'

const getters = {
  allInvoiceTypes: (state) => state.allInvoiceTypes
}

const actions = {
  getAllInvoiceTypes({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllInvoiceTypes()
        .then((response) => {
          if (response.status === 200) {
            const invoicetypes = []
            const array = response.data
            array.forEach((element) => {
              invoicetypes.push(element.invoice_type)
            })
            commit(types.FILL_ALL_INVOICETYPES, invoicetypes)
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
  [types.FILL_ALL_INVOICETYPES](state, invoicetypes) {
    state.allInvoiceTypes = invoicetypes
  }
}

const state = {
  allInvoiceTypes: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
