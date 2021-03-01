module.exports = {
  setDocumentDirectionPerLocale(locale) {
    document.dir = locale === 'ar' ? 'rtl' : 'ltr'
  },

  setDocumentLang(lang) {
    document.documentElement.lang = lang
  },

  setDocumentTitle(newTitle) {
    document.title = newTitle
  }
}
