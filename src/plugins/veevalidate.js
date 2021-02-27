import Vue from 'vue'
// import VeeValidate from 'vee-validate'
import * as VeeValidate from 'vee-validate'
import fr from 'vee-validate/dist/locale/fr'
import { extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'

const veeValidateConfig = {
  locale: JSON.parse(localStorage.getItem('locale')) || 'fr',
  dictionary: {
    fr
  }
}

Vue.use(VeeValidate, veeValidateConfig)
