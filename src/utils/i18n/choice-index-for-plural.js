let defaultChoiceIndex = ''

module.exports = {
  setDefaultChoiceIndexGet(fn) {
    defaultChoiceIndex = fn
  },

  /**
   * @param choice {number} a choice index given by the input to
   *   $tc: `$tc('path.to.rule', choiceIndex)`
   * @param choicesLength {number} an overall amount of available choices
   * @returns a final choice index to select plural word by
   **/
  getChoiceIndex(choice, choicesLength) {
    if (defaultChoiceIndex === undefined) {
      return choice
    }

    // this === VueI18n instance, so the locale property also exists here
    if (this.locale !== 'ar') {
      return defaultChoiceIndex.apply(this, [choice, choicesLength])
    }

    if ([0, 1, 2].includes(choice)) {
      return choice
    }

    if (choice >= 3 && choice <= 10) {
      return 3
    }

    if (choice >= 11 && choice <= 99) {
      return 4
    }
    return 5
  }
}
