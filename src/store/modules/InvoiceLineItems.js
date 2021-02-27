import * as types from '@/store/mutation-types'
import api from '@/services/api/invoiceLineItems'
import { handleError } from '@/utils/utils.js'

const getters = {
  allInvoiceLineItems: (state) => state.allInvoiceLineItems
}

const actions = {
  getAllInvoiceLineItems({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllInvoiceLineItems()
        .then((response) => {
          if (response.status === 200) {
            const invoicelineitems = []
            const array = response.data
            array.forEach((element) => {
              invoicelineitems.push(element.other_line_item_details)
            })
            commit(types.FILL_ALL_INVOICELINEITEMS, invoicelineitems)
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
  [types.FILL_ALL_INVOICELINEITEMS](state, invoicelineitems) {
    state.allInvoiceLineItems = invoicelineitems
  }
}

const state = {
  allInvoiceLineItems: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
