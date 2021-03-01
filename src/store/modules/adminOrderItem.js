import * as types from '@/store/mutation-types'
import api from '@/services/api/adminOrderItem'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  orderitems: (state) => state.orderitems,
  totalOrderItems: (state) => state.totalOrderItems
}

const actions = {
  getOrderItems({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getOrderItems(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data.docs)
            commit(types.ORDERITEMS, response.data.docs)
            commit(types.TOTAL_ORDERITEMS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editOrderItem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editOrderItem(payload._id, payload)
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
  saveOrderItem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveOrderItem(payload)
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
  deleteOrderItem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteOrderItem(payload)
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
  [types.ORDERITEMS](state, orderitems) {
    state.orderitems = orderitems
  },
  [types.TOTAL_ORDERITEMS](state, value) {
    state.totalOrderItems = value
  }
}

const state = {
  orderitems: [],
  totalOrderItems: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
