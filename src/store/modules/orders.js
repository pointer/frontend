import * as types from '@/store/mutation-types'
import api from '@/services/api/orders'
import { handleError } from '@/utils/utils.js'

const getters = {
  allOrders: (state) => state.allOrders
}

const actions = {
  getAllOrders({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllOrders()
        .then((response) => {
          if (response.status === 200) {
            const orders = []
            const array = response.data
            array.forEach((element) => {
              orders.push(element.other_order_details)
            })
            commit(types.FILL_ALL_ORDERS, orders)
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
  [types.FILL_ALL_ORDERS](state, orders) {
    state.allOrders = orders
  }
}

const state = {
  allOrders: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
