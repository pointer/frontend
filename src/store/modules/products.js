import * as types from '@/store/mutation-types'
import api from '@/services/api/products'
import { handleError } from '@/utils/utils.js'

const getters = {
  allProducts: (state) => state.allProducts
}

const actions = {
  getAllProducts({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getAllProducts()
        .then((response) => {
          if (response.status === 200) {
            // // console.log(response.data.docs)
            const products = []
            const array = response.data.docs
            array.forEach((element) => {
              products.push(element.product_name)
            })
            commit(types.FILL_ALL_PRODUCTS, products)
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
  [types.FILL_ALL_PRODUCTS](state, products) {
    state.allProducts = products
  }
}

const state = {
  allProducts: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
