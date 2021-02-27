import * as types from '@/store/mutation-types'
import api from '@/services/api/orderItems'
import { handleError } from '@/utils/utils.js'

const getters = {
  allOrderItems: (state) => state.allOrderItems
}

const actions = {
  getAllOrderItems({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllOrderItems()
        .then((response) => {
          if (response.status === 200) {
            const orderitems = []
            const array = response.data
            array.forEach((element) => {
              orderitems.push(element.other_order_item_details)
            })
            commit(types.FILL_ALL_ORDERITEMS, orderitems)
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
  [types.FILL_ALL_ORDERITEMS](state, orderitems) {
    state.allOrderItems = orderitems
  }
}

const state = {
  allOrderItems: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
