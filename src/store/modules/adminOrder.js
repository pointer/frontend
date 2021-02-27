import * as types from '@/store/mutation-types'
import api from '@/services/api/adminOrder'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  orders: (state) => state.orders,
  totalOrders: (state) => state.totalOrders
}

const actions = {
  getOrders({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getOrders(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data.docs)
            commit(types.ORDERS, response.data.docs)
            commit(types.TOTAL_ORDERS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editOrder({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editOrder(payload._id, payload)
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
  saveOrder({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveOrder(payload)
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
  deleteOrder({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteOrder(payload)
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
  [types.ORDERS](state, orders) {
    state.orders = orders
  },
  [types.TOTAL_ORDERS](state, value) {
    state.totalOrders = value
  }
}

const state = {
  orders: [],
  totalOrders: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
