module.exports = {
  getBrowserLocale(options = {}) {
    const defaultOptions = { countryCodeOnly: false }

    const opt = { ...defaultOptions, ...options }

    const navigatorLocale =
      navigator.languages !== undefined
        ? navigator.languages[0]
        : navigator.language

    if (!navigatorLocale) {
      return false // undefined
    }

    // const trimmedLocale =
    return opt.countryCodeOnly
      ? navigatorLocale.trim().split(/-|_/)[0]
      : navigatorLocale.trim()

    // return trimmedLocale
  }
}
