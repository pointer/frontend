import Vue from 'vue'
import Vuex from 'vuex'
import modules from '@/store/modules'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ...modules
  },
  state: {
    pagination: {
      descending: true,
      page: 1,
      rowsPerPage: 4,
      sortBy: 'fat',
      totalItems: 0,
      rowsPerPageItems: [1, 2, 4, 8, 16]
    }
  }
})

if (window.Cypress) {
  // Only available during E2E tests
  window.__store__ = store
}
