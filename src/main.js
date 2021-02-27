import Vue from 'vue'
import '@/plugins/axios'
// beufy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// custom styles
import '../assets/css/styles.scss'
// import '@/plugins/vuetify'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import '@mdi/font/css/materialdesignicons.css'
import VueGeolocation from 'vue-browser-geolocation'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'
import './plugins/vuetify'
import '@/plugins/veevalidate'
import '@/plugins/common'
// import '@/plugins/googleAnalytics'
import i18n from '@/plugins/i18n'
import App from '@/App.vue'
import router from '@/router'
import { store } from '@/store'
import Vuetify from 'vuetify'
import VueTextareaAutosize from 'vue-textarea-autosize'
import ConfirmDlg from '@/components/common/ConfirmDlg'
import VueEventBus from 'vue-plugin-event-bus'
import colors from 'vuetify/lib/util/colors'
Vue.use(Buefy)
Vue.component('confirm', ConfirmDlg)
Vue.use(VueTextareaAutosize)
Vue.use(BootstrapVue)
Vue.use(VueGeolocation)
Vue.use(VueEventBus)

Vue.config.productionTip = false

Vue.use(Vuetify)

const opts = {
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3
      },
      dark: {
        primary: colors.blue.lighten3
      }
      // light: {},
      // dark: {}
    }
  }
}

const ignoreWarnMessage =
  'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null
    vm = null
    trace = null
  }
}

export const app = new Vue({
  i18n,
  router,
  store,
  vuetify: new Vuetify(opts),
  render: (h) => h(App),
  created() {
    store.dispatch('setLocale', store.getters.locale)
    if (store.getters.isTokenSet) {
      store.dispatch('autoLogin')
    }
  }
}).$mount('#app')

if (window.Cypress) {
  // Only available during E2E tests
  window.app = app
}
