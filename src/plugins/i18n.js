import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import fr from '../locales/fr.json'
import getBrowserLocale from '../utils/i18n/get-browser-locale'
import { supportedLocalesInclude } from '../utils/i18n/supported-locales'
import {
  getChoiceIndex,
  setDefaultChoiceIndexGet
} from '../utils/i18n/choice-index-for-plural'
import dateTimeFormats from '@/locales/date-time-formats'
import numberFormats from '@/locales/number-formats'
import EventBus from '@/EventBus'
Vue.use(VueI18n)
const loadLocaleMessages = () => {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}
// const getStartingLocale = function getStartingLocale() {
//   const browserLocale = getBrowserLocale({ countryCodeOnly: true })

//   if (supportedLocalesInclude(browserLocale)) {
//     return browserLocale
//   }
//   return process.env.VUE_APP_I18N_LOCALE || 'en'
// }

setDefaultChoiceIndexGet(VueI18n.prototype.getChoiceIndex)

VueI18n.prototype.getChoiceIndex = getChoiceIndex

// const startingLocale = getStartingLocale()

const i18n = new VueI18n({
  // const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'fr',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  dateTimeFormats,
  numberFormats,
  // locale: navigator.language.slice(0, 2) || 'fr',
  messages: loadLocaleMessages()
})

const loadedLanguages = []

const loadLocaleMessagesAsync = function loadLocaleMessagesAsync(locale) {
  EventBus.$emit('i18n-load-start')

  if (loadedLanguages.length > 0 && i18n.locale === locale) {
    EventBus.$emit('i18n-load-complete')
    return Promise.resolve(locale)
  }

  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    i18n.locale = locale
    EventBus.$emit('i18n-load-complete')
    return Promise.resolve(locale)
  }

  // If the language hasn't been loaded yet
  return import(
    /* webpackChunkName: "locale-[request]" */ `@/locales/${locale}.json`
  ).then((messages) => {
    i18n.setLocaleMessage(locale, messages.default)

    loadedLanguages.push(locale)

    i18n.locale = locale

    EventBus.$emit('i18n-load-complete')
    return Promise.resolve(locale)
  })
}

export default i18n

/**
Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en'
})

const loadedLanguages = []

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (loadedLanguages.includes(lang)) {
    if (i18n.locale !== lang) setI18nLanguage(lang)
    return Promise.resolve()
  }
  return axios.get(`/api/lang/${lang}`).then(response => {
    let msgs = response.data
    loadedLanguages.push(lang)
    i18n.setLocaleMessage(lang, msgs.default)
    setI18nLanguage(lang)
  })
}

// router.js
router.beforeEach((to, from, next) => {
  const lang = to.params.lang
  loadLanguageAsync(lang).then(() => next())
})
 */
