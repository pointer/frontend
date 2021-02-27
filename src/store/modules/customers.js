import * as types from '@/store/mutation-types'
import api from '@/services/api/customers'
import { handleError } from '@/utils/utils.js'

const getters = {
  allCustomers: (state) => state.allCustomers
}

const actions = {
  getAllCustomers({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllCustomers()
        .then((response) => {
          if (response.status === 200) {
            const customers = []
            const customerVat = []
            const array = response.data.docs
            array.forEach((element) => {
              customers.push({
                text: element.company,
                value: element.vat_number,
                id: element._id
              })
            })
            // console.log(customers)
            commit(types.FILL_ALL_CUSTOMERS, customers)
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
  [types.FILL_ALL_CUSTOMERS](state, customers) {
    state.allCustomers = customers
  }
}

const state = {
  allCustomers: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
