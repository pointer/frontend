import supportedLocales from '../../config/supported-locales'
export default {
  getSupportedLocales() {
    const annotatedLocales = []

    for (const code of Object.keys(supportedLocales)) {
      annotatedLocales.push({
        code,
        name: supportedLocales[code]
      })
    }

    return annotatedLocales
  },
  supportedLocalesInclude(locale) {
    return Object.keys(supportedLocales).includes(locale)
  }
}
// export const getSupportedLocales = 'getSupportedLocales'
// export const supportedLocalesInclude = 'supportedLocalesInclude'
