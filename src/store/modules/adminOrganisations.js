import * as types from '@/store/mutation-types'
import api from '@/services/api/adminOrganisations'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  organisations: (state) => state.organisations,
  totalOrganisations: (state) => state.totalOrganisations
}

const actions = {
  getOrganisations({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getOrganisations(payload)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data)
            commit(types.ORGANISATIONS, response.data.docs)
            commit(types.TOTAL_ORGANISATIONS, response.data.totalDocs)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  editOrganisation({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .editOrganisation(payload._id, payload)
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
  saveOrganisation({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveOrganisation(payload)
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
  deleteOrganisation({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteOrganisation(payload)
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
  [types.ORGANISATIONS](state, organisations) {
    state.organisations = organisations
  },
  [types.TOTAL_ORGANISATIONS](state, value) {
    state.totalOrganisations = value
  }
}

const state = {
  organisations: [],
  totalOrganisations: 0
}

export default {
  state,
  getters,
  actions,
  mutations
}
