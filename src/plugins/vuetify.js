// import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import i18n from '@/plugins/i18n'
import '../sass/overrides.sass'
import fr from '../locales/fr'
// import colors from 'vuetify/es5/util/colors'
// import VuetifyConfirm from 'vuetify-confirm'
Vue.use(Vuetify, {
  lang: {
    locales: { fr },
    current: 'fr'
  }
})

const theme = {
  primary: '#1e88e5',
  secondary: '#4CAF50',
  accent: '#9C27b0',
  info: '#00CAE3'
}

// const theme = {
//   primary: '#4CAF50',
//   secondary: '#9C27b0',
//   accent: '#9C27b0',
//   info: '#00CAE3'
// }

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  // lang: {
  //   t: (key, ...params) => i18n.t(key, params)
  // },
  theme: {
    themes: {
      dark: theme,
      light: theme
    }
  }
})
