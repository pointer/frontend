/*==================================================================================================

Application:   Utility Function
Author:        John Gardner
Website:       https://www.braemoor.co.uk/software/vat.shtml

Version:       V1.0
Date:          30th July 2005
Description:   Used to check the validity of an EU country VAT number

Version:       V1.1
Date:          3rd August 2005
Description:   Lithuanian legal entities & Maltese check digit checks added.

Version:       V1.2
Date:          20th October 2005
Description:   Italian checks refined (thanks Matteo Mike Peluso).

Version:       V1.3
Date:          16th November 2005
Description:   Error in GB numbers ending in 00 fixed (thanks Guy Dawson).

Version:       V1.4
Date:          28th September 2006
Description:   EU-type numbers added.

Version:       V1.5
Date:          1st January 2007
Description:   Romanian and Bulgarian numbers added.

Version:       V1.6
Date:          7th January 2007
Description:   Error with Slovenian numbers (thanks to Ales Hotko).

Version:       V1.7
Date:          10th February 2007
Description:   Romanian check digits added.
               Thanks to Dragu Costel for the test suite.

Version:       V1.8
Date:          3rd August 2007
Description:   IE code modified to allow + and * in old format numbers.
               Thanks to Antonin Moy of Sphere Solutions for pointing out the error.

Version:       V1.9
Date:          6th August 2007
Description:   BE code modified to make a specific check that the leading character of 10 digit
               numbers is 0 (belts and braces).

Version:       V1.10
Date:          10th August 2007
Description:   Cypriot check digit support added.
               Check digit validation support for non-standard UK numbers

Version:       V1.11
Date:          25th September 2007
Description:   Spain check digit support for personal numbers.
               Author: David Perez Carmona

Version:       V1.12
Date:          23rd November 2009
Description:   GB code modified to take into account new style check digits.
               Thanks to Guy Dawson of Crossflight Ltd for pointing out the necessity.

Version:       V1.13
Date:          7th July 2012
Description:   EL, GB, SE and BE formats updated - thanks to Joost Van Biervliet of VAT Applications

Version:       V.14
Date:          8th April 2013
Description:   BE Pattern match refined
               BG Add check digit checks for all four types of VAT number
               CY Pattern match improved
               CZ Personal pattern match checking improved
               CZ Personal check digits incorporated
               EE improved pattern match
               ES Physical person number checking refined
               GB Check digit support provided for 12 digit VAT codes and range checks included
               IT Bug removed to allow 999 and 888 issuing office codes
               LT temporarily registered taxpayers check digit support added
               LV Natural persons checks added
               RO improved pattern match
               SK improved pattern match and added check digit support

               Thanks to Theo Vroom for his help in this latest release.

Version:      V1.15
Date:         15th April 2013
              Swedish algorithm re-implemented.

Version:      V1.16
Date:         25th July 2013
              Support for Croatian numbers added

Version       V1.17
              10th September 2013
              Support for Norwegian MVA numbers added (yes, I know that Norway is not in the EU!)

Version       V1.18
              29th October 2013
              Partial support for new style Irish numbers.
              See http://www.revenue.ie/en/practitioner/ebrief/2013/no-032013.html
              Thanks to Simon Leigh for drawing the author's attention to this.

Version       V1.19
              31st October 2013
              Support for Serbian PBI numbers added (yes, I know that Serbia is not in the EU!)

Version       V1.20
              1st November 2013
              Support for Swiss MWST numbers added (yes, I know that Switzerland is not in the EU!)

Version       V1.21
              16th December 2014
              Non-critical code tidies to French and Danish regular expressions.
              Thanks to Bill Seddon of Lyquidity Solutions

Version       V1.22
              14th January 2014
              Non-critical code tidy to regular expression for new format Irish numbers.
              Thanks to Olivier Reubens of UNIT4 C-Logic N.V.

Version       V1.23
              10th April 2014
              Support for Russian INN numbers added (yes, I know that Russia is not in the EU!).
              Thanks to Marco Cesaratto of Arki Tech, Italy

Version       V1.24
              4th June 2014
              Check digit validation supported for Irish Type 3 numbers
              Thanks to Olivier Reubens of UNIT4 C-Logic N.V.

Version       V1.25
              29th July 2014
              Code improvements
              Thanks to S�bastien Boelpaep and Nate Kerkhofs

Version       V1.26
              4th May 2015
              Code improvements to regular expressions
              Thanks to Robert Gust-Bardon of webcraft.ch

Version       V1.27
              3rd December 2015
              Extend Swiss optional suffix to allow TVA and ITA
              Thanks to Oskars Petermanis

Version       V1.28
              30th August 2016
              Correct Swiss optional suffix to allow TVA and IVA
              Thanks to Jan Verhaegen

Version       V1.29
              29th July 2017
              Correct Czeck Republic checking of Individual type 2 - Special Cases
              Thanks to Andreas Wuermser of Auer Packaging UK

Version       V1.30
              06 December 2019
              Support for new sole proprietor traders added to Dutch validation
              Thanks to Olivier Reubens of UNIT4 C-Logic N.V.

Version       V1.31
              19 January 2020
              Correction to the new sole proprietor traders added to Dutch validation
              Thanks to Bill Seddon of Lyquidity Solutions

Version       V1.32
              23 January 2020
              Updated to reflect new Belgium VAT format (minor difference)
              Thanks to A. Roland Wintgen, EVG Elektro-Vertriebs-Gesellschaft Martens GmbH & Co. KG

Version       V1.33
              9 June 2020
              Updated to refine pattern matching of first 2 characters of Portuguese numbers
              Thanks to Alann Jaksnon

Version       V1.34
              11 December 2020
              Correction to Dutch validation - Thanks to Olivier Reubens of UNIT4 C-Logic N.V.
              Addition of UK Northern Ireland protocols (XI)

Version       V1.35
              20 December 2020
              Code tidy

Version       V1.36
              30 December 2020
              Addition of Israeli VAT numbers, Australian ABN numbers and Brazilian CNPJ numbers

Parameters:    toCheck - VAT number be checked.

This function checks the value of the parameter for a valid European VAT number.

If the number is found to be invalid format, the function returns a value of false. Otherwise it
returns the VAT number re-formatted.

Example call:

  if (checkVATNumber (myVATNumber))
      alert ("VAT number has a valid format")
  else
      alert ("VAT number has invalid format");

---------------------------------------------------------------------------------------------------*/

function checkVATNumber(toCheck) {
  // To change the default country (e.g. from the UK to Germany - DE):
  //    1.  Change the country code in the defCCode variable below to "DE".
  //    2.  Remove the question mark from the regular expressions associated with the UK VAT number:
  //        i.e. "(GB)?" -> "(GB)"
  //    3.  Add a question mark into the regular expression associated with Germany's number
  //        following the country code: i.e. "(DE)" -> "(DE)?"

  const defCCode = 'FR'

  // Array holds the regular expressions for the national VAT formats
  const vatexp = []

  // Note - VAT codes without the "**" in the comment do not have check digit checking.

  // vatexp.push(/^(AT)U(\d{8})$/) //** Austria
  // vatexp.push(/^(AU|ABN:?)(\d{11})(\d{3})?$/) //** Australia (non EU) - allow ABN
  // vatexp.push(/^(BE)(0?\d{9})$/) //** Belgium
  // vatexp.push(/^(BE)([0-1]\d{9})$/) //** Belgium - since 01/01/2020
  // vatexp.push(/^(BR|CNPJ)[:|\.]?\s?(\d{2}\.?\d{3}\.?\d{3}\.?\/?\d{4}-?\d{2})$/) //** Brazil
  // vatexp.push(/^(BG)(\d{9,10})$/) //** Bulgaria
  // vatexp.push(/^(CHE)(\d{9})(MWST|TVA|IVA)?$/) //** Switzerland
  // vatexp.push(/^(CY)([0-59]\d{7}[A-Z])$/) //** Cyprus
  // vatexp.push(/^(CZ)(\d{8,10})(\d{3})?$/) //** Czech Republic
  // vatexp.push(/^(DE)([1-9]\d{8})$/) //** Germany
  // vatexp.push(/^(DK)(\d{8})$/) //** Denmark
  // vatexp.push(/^(EE)(10\d{7})$/) //** Estonia
  // vatexp.push(/^(EL|GR)(\d{9})$/) //** Greece
  // vatexp.push(/^(ES)([A-Z]\d{8})$/) //** Spain (National juridical entities)
  // vatexp.push(/^(ES)([A-HN-SW]\d{7}[A-J])$/) //** Spain (Other juridical entities)
  // vatexp.push(/^(ES)([0-9YZ]\d{7}[A-Z])$/) //** Spain (Personal entities type 1)
  // vatexp.push(/^(ES)([KLMX]\d{7}[A-Z])$/) //** Spain (Personal entities type 2)
  // vatexp.push(/^(EU)(\d{9})$/) //** EU-type
  // vatexp.push(/^(FI)(\d{8})$/) //** Finland
  vatexp.push(/^(FR)(\d{11})$/) //* * France (1)
  vatexp.push(/^(FR)([A-HJ-NP-Z]\d{10})$/) //   France (2)
  vatexp.push(/^(FR)(\d[A-HJ-NP-Z]\d{9})$/) //   France (3)
  vatexp.push(/^(FR)([A-HJ-NP-Z]{2}\d{9})$/) //   France (4)
  // vatexp.push(/^(GB|XI)?(\d{9})$/) //** UK (Standard) (not EU)
  // vatexp.push(/^(GB|XI)?(\d{12})$/) //** UK (Branches) (not EU)
  // vatexp.push(/^(GB|XI)?(GD\d{3})$/) //** UK (Government) (not EU)
  // vatexp.push(/^(GB|XI)?(HA\d{3})$/) //** UK (Health authority) (not EU)
  // vatexp.push(/^(HR)(\d{11})$/) //** Croatia
  // vatexp.push(/^(HU)(\d{8})$/) //** Hungary
  // vatexp.push(/^(IE)(\d{7}[A-W])$/) //** Ireland (1)
  // vatexp.push(/^(IE)([7-9][A-Z\*\+)]\d{5}[A-W])$/) //** Ireland (2)
  // vatexp.push(/^(IE)(\d{7}[A-W][AH])$/) //** Ireland (3)
  // vatexp.push(/^(IL)(\d{2,9})$/) //** Israel (not EU)
  // vatexp.push(/^(IT)(\d{11})$/) //** Italy
  // vatexp.push(/^(LV)(\d{11})$/) //** Latvia
  // vatexp.push(/^(LT)(\d{9}|\d{12})$/) //** Lithuania
  // vatexp.push(/^(LU)(\d{8})$/) //** Luxembourg
  // vatexp.push(/^(MT)([1-9]\d{7})$/) //** Malta
  // vatexp.push(/^(NL)(\d{9}B\d{2})$/) //** Netherlands
  // vatexp.push(/^(NL)([A-Z0-9\*\+]{10}\d{2})$/) //** Netherlands sole proprietor
  // vatexp.push(/^(NO)(\d{9})$/) //** Norway (not EU)
  // vatexp.push(/^(PL)(\d{10})$/) //** Poland
  // vatexp.push(
  //   /^(PT)(((([1-3]|5|6)\d)|(45)|(7([0-2]|[4-5]|[7-9]))|(9[0|1|8|9]))(\d{7}$))/
  // ) //** Portugal
  // vatexp.push(/^(RO)([1-9]\d{1,9})$/) //** Romania
  // vatexp.push(/^(RS)(\d{9})$/) //** Serbia
  // vatexp.push(/^(RU)(\d{10}|\d{12})$/) //** Russia (not EU)
  // vatexp.push(/^(SE)(\d{10}01)$/) //** Sweden
  // vatexp.push(/^(SI)([1-9]\d{7})$/) //** Slovenia
  // vatexp.push(/^(SK)([1-9]\d[2346-9]\d{7})$/) //** Slovakia Republic

  // Load up the string to check, converting it top uppercase
  let VATNumber = toCheck.toUpperCase()

  // Remove spaces etc. from the VAT number to help validation
  VATNumber = VATNumber.replace(/(\s|-|\.|\/)+/g, '')

  // Assume we're not going to find a valid VAT number
  let valid = false

  // Check the string against the regular expressions for all types of VAT numbers
  for (let i = 0; i < vatexp.length; i++) {
    // Have we recognised the VAT number?
    if (vatexp[i].test(VATNumber)) {
      // Yes - we have - remember the important elements, setting up the default county code if
      // necessary.
      const cCode = RegExp.$1.length == 0 ? defCCode : RegExp.$1 // The country code
      const cNumber = RegExp.$2 // The number

      // Alternative country codes need converting to create the routine name
      // switch (cCode.slice(0, 4)) {
      //   case 'ABN':
      //     cCode = 'AU'
      //     break // Australia
      //   case 'CNPJ':
      //     cCode = 'BR'
      //     break // Brazil
      //   case 'GR':
      //     cCode = 'EL'
      //     break // Greece
      //   case 'XI':
      //     cCode = 'GB'
      //     break // Northern Ireland
      //   default:
      //     break
      // }

      // Call the appropriate country VAT validation routine depending on the country code. The
      // function name is "VATCheckDigit" prefixed by the country code, and is called with a
      // parameter of the VAT number without the country code:
      //    e.g. GBVATCheckDigit (vatNumber)
      if (eval(`${cCode}VATCheckDigit ('${cNumber}')`)) {
        valid = VATNumber
      }

      // Having processed the number, we break from the loop
      break
    }
  }

  // Return with either an error or the reformatted VAT number
  return valid
}

function ATVATCheckDigit(vatnumber) {
  // Validates an Austrian VAT number.

  let total = 0
  const multipliers = [1, 2, 1, 2, 1, 2, 1]
  let temp = 0

  // Extract the next digit and multiply by the appropriate multiplier.
  for (let i = 0; i < 7; i++) {
    temp = Number(vatnumber.charAt(i)) * multipliers[i]
    if (temp > 9) {
      total += Math.floor(temp / 10) + (temp % 10)
    } else {
      total += temp
    }
  }

  // Establish check digit.
  total = 10 - ((total + 4) % 10)
  if (total == 10) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(7, 8)) {
    return true
  }
  return false
}

function AUVATCheckDigit(vatnumber) {
  // Validates an Australian VAT number.

  // Multipliers for a MOD 89 calculation
  const multipliers = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]

  // Take one away from the first digit character
  vatnumber = vatnumber.split('')
  vatnumber[0] = String.fromCharCode(vatnumber[0].charCodeAt() - 1)
  vatnumber = vatnumber.join('')

  // Calculate the total based on multiplying each digit by its equivalent multiplier
  let total = 0
  for (let i = 0; i < 11; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // If the remainder when divided by 89 is 0, then it is valid
  if (total % 89 == 0) {
    return true
  }
  return false
}

function BEVATCheckDigit(vatnumber) {
  // Validates a Belgium VAT number.

  // Nine digit numbers have a 0 inserted at the front.
  if (vatnumber.length == 9) {
    vatnumber = `0${vatnumber}`
  }

  if (vatnumber.slice(1, 2) == 0) {
    return false
  }

  // Perform a modulus 97 calculation on the first 8 digits - the last two digits should be the same
  if (97 - (vatnumber.slice(0, 8) % 97) == vatnumber.slice(8)) {
    return true
  }
  return false
}

function BGVATCheckDigit(vatnumber) {
  // Validates a Bulgarian VAT number.

  let total
  let i
  let temp
  let multipliers = []

  if (vatnumber.length == 9) {
    // Check the check digit of 9 digit Bulgarian VAT numbers.
    total = 0

    // First try to calculate the check digit using the first multipliers
    temp = 0
    for (i = 0; i < 8; i++) {
      temp += Number(vatnumber.charAt(i)) * (i + 1)
    }

    // See if we have a check digit yet
    total = temp % 11
    if (total != 10) {
      if (total == vatnumber.slice(8)) {
        return true
      }
      return false
    }

    // We got a modulus of 10 before so we have to keep going. Calculate the new check digit using
    // the different multipliers
    temp = 0
    for (i = 0; i < 8; i++) {
      temp += Number(vatnumber.charAt(i)) * (i + 3)
    }

    // See if we have a check digit yet. If we still have a modulus of 10, set it to 0.
    total = temp % 11
    if (total == 10) {
      total = 0
    }
    if (total == vatnumber.slice(8)) {
      return true
    }
    return false
  }

  // 10 digit VAT code - see if it relates to a standard physical person
  if (/^\d\d[0-5]\d[0-3]\d\d{4}$/.test(vatnumber)) {
    // Check month
    const month = Number(vatnumber.slice(2, 4))
    if (
      (month > 0 && month < 13) ||
      (month > 20 && month < 33) ||
      (month > 40 && month < 53)
    ) {
      // Extract the next digit and multiply by the counter.
      multipliers = [2, 4, 8, 5, 10, 9, 7, 3, 6]
      total = 0
      for (i = 0; i < 9; i++) {
        total += Number(vatnumber.charAt(i)) * multipliers[i]
      }

      // Establish check digit.
      total %= 11
      if (total == 10) {
        total = 0
      }

      // Check to see if the check digit given is correct, If not, try next type of person
      if (total == vatnumber.substr(9, 1)) {
        return true
      }
    }
  }

  // It doesn't relate to a standard physical person - see if it relates to a foreigner.

  // Extract the next digit and multiply by the counter.
  multipliers = [21, 19, 17, 13, 11, 9, 7, 3, 1]
  total = 0
  for (i = 0; i < 9; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Check to see if the check digit given is correct, If not, try next type of person
  if (total % 10 == vatnumber.substr(9, 1)) {
    return true
  }

  // Finally, if not yet identified, see if it conforms to a miscellaneous VAT number

  // Extract the next digit and multiply by the counter.
  multipliers = [4, 3, 2, 7, 6, 5, 4, 3, 2]
  total = 0
  for (i = 0; i < 9; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total = 11 - (total % 11)
  if (total == 10) {
    return false
  }
  if (total == 11) {
    total = 0
  }

  // Check to see if the check digit given is correct, If not, we have an error with the VAT number
  if (total == vatnumber.substr(9, 1)) {
    return true
  }
  return false
}

function BRVATCheckDigit(vatnumber) {
  // Validates an Brazilian CPNJ number.

  // Multipliers for a MOD 89 calculation
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6]

  // Calculate the total based on multiplying the first 12 digits by their equivalent multiplier
  let total = 0
  for (let i = 11; i > -1; i--) {
    total += Number(vatnumber.charAt(i)) * multipliers[11 - i]
  }

  // Calculate the check digit for digit 13
  let temp = total % 11
  if (temp == 0 || temp == 1) {
    temp = 0
  } else {
    temp = 11 - (total % 11)
  }

  // Return if not valid
  if (temp != Number(vatnumber.charAt(12))) {
    return false
  }

  // Repeat but include the first (correct) check digit in position 13
  total = 0
  for (i = 12; i > -1; i--) {
    total += Number(vatnumber.charAt(i)) * multipliers[12 - i]
  }

  // Calculate the check digit for digit 14
  temp = total % 11
  if (temp == 0 || temp == 1) {
    temp = 0
  } else {
    temp = 11 - (total % 11)
  }

  if (temp != Number(vatnumber.charAt(13))) {
    return false
  }
  return true
}

function CHEVATCheckDigit(vatnumber) {
  // Validates a Swiss VAT number.

  // Extract the next digit and multiply by the counter.
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4]
  let total = 0
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total = 11 - (total % 11)
  if (total == 10) {
    return false
  }
  if (total == 11) {
    total = 0
  }

  // Check to see if the 9 digit given is the same as the check digit. If not, we have an error with the VAT number
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function CYVATCheckDigit(vatnumber) {
  // Validates a Cypriot VAT number.

  // Not allowed to start with '12'
  if (Number(vatnumber.slice(0, 2) == 12)) {
    return false
  }

  // Extract the next digit and multiply by the counter.
  let total = 0
  for (let i = 0; i < 8; i++) {
    let temp = Number(vatnumber.charAt(i))
    if (i % 2 == 0) {
      switch (temp) {
        case 0:
          temp = 1
          break
        case 1:
          temp = 0
          break
        case 2:
          temp = 5
          break
        case 3:
          temp = 7
          break
        case 4:
          temp = 9
          break
        default:
          temp = temp * 2 + 3
      }
    }
    total += temp
  }

  // Establish check digit using modulus 26, and translate to char. equivalent.
  total %= 26
  total = String.fromCharCode(total + 65)

  // Check to see if the 9th digit is the check digit. If not, the VAT number is invalid
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function CZVATCheckDigit(vatnumber) {
  // Validates a Czech Republic VAT number.

  let total = 0
  const multipliers = [8, 7, 6, 5, 4, 3, 2]
  let i
  let a
  let temp

  const czexp = []
  czexp[0] = /^\d{8}$/ //  8 digit legal entities
  // Note - my specification says that that the following should have a range of 0-3 in the fourth
  // digit, but the valid number CZ395601439 did not confirm, so a range of 0-9 has been allowed.
  czexp[1] = /^[0-5][0-9][0|1|5|6][0-9][0-3][0-9]\d{3}$/ //  9 digit individuals
  czexp[2] = /^6\d{8}$/ //  9 digit individuals (Special cases)
  czexp[3] = /^\d{2}[0-3|5-8][0-9][0-3][0-9]\d{4}$/ // 10 digit individuals

  // Legal entities
  if (czexp[0].test(vatnumber)) {
    // Extract the next digit and multiply by the counter.
    for (i = 0; i < 7; i++) {
      total += Number(vatnumber.charAt(i)) * multipliers[i]
    }

    // Establish check digit.
    total = 11 - (total % 11)
    if (total == 10) {
      total = 0
    }
    if (total == 11) {
      total = 1
    }

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(7)) {
      return true
    }
    return false
  }

  // Individuals type 1 (Standard) - 9 digits without check digit
  else if (czexp[1].test(vatnumber)) {
    if (temp == Number(vatnumber.slice(0, 2)) > 62) {
      return false
    }
    return true
  }

  // Individuals type 2 (Special Cases) - 9 digits including check digit
  else if (czexp[2].test(vatnumber)) {
    // Extract the next digit and multiply by the counter.
    for (i = 0; i < 7; i++) {
      total += Number(vatnumber.charAt(i + 1)) * multipliers[i]
    }

    // Establish check digit pointer into lookup table
    if (total % 11 == 0) {
      a = total + 11
    } else {
      a = Math.ceil(total / 11) * 11
    }
    const pointer = a - total

    // Convert calculated check digit according to a lookup table;
    const lookup = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8]
    if (lookup[pointer - 1] == vatnumber.slice(8, 9)) {
      return true
    }
    return false
  }

  // Individuals type 3 - 10 digits
  else if (czexp[3].test(vatnumber)) {
    temp =
      Number(vatnumber.slice(0, 2)) +
      Number(vatnumber.slice(2, 4)) +
      Number(vatnumber.slice(4, 6)) +
      Number(vatnumber.slice(6, 8)) +
      Number(vatnumber.slice(8))
    if (temp % 11 == 0 && Number(vatnumber) % 11 == 0) {
      return true
    }
    return false
  }

  // else error
  return false
}

function DEVATCheckDigit(vatnumber) {
  // Validates a German VAT number.

  let product = 10
  let sum = 0
  let checkdigit = 0
  for (let i = 0; i < 8; i++) {
    // Extract the next digit and implement peculiar algorithm!.
    sum = (Number(vatnumber.charAt(i)) + product) % 10
    if (sum == 0) {
      sum = 10
    }
    product = (2 * sum) % 11
  }

  // Establish check digit.
  if (11 - product == 10) {
    checkdigit = 0
  } else {
    checkdigit = 11 - product
  }

  // Compare it with the last two characters of the VAT number. If the same, then it is a valid
  // check digit.
  if (checkdigit == vatnumber.slice(8)) {
    return true
  }
  return false
}

function DKVATCheckDigit(vatnumber) {
  // Validates a Danish VAT number.

  let total = 0
  const multipliers = [2, 7, 6, 5, 4, 3, 2, 1]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total %= 11

  // The remainder should be 0 for it to be valid..
  if (total == 0) {
    return true
  }
  return false
}

function EEVATCheckDigit(vatnumber) {
  // Validates an Estonian VAT number.

  let total = 0
  const multipliers = [3, 7, 1, 3, 7, 1, 3, 7]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits using modulus 10.
  total = 10 - (total % 10)
  if (total == 10) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function ELVATCheckDigit(vatnumber) {
  // Validates a Greek VAT number.

  let total = 0
  const multipliers = [256, 128, 64, 32, 16, 8, 4, 2]

  // eight character numbers should be prefixed with an 0.
  if (vatnumber.length == 8) {
    vatnumber = `0${vatnumber}`
  }

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total %= 11
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function ESVATCheckDigit(vatnumber) {
  // Validates a Spanish VAT number.

  let total = 0
  let temp = 0
  const multipliers = [2, 1, 2, 1, 2, 1, 2]
  const esexp = []
  esexp[0] = /^[A-H|J|U|V]\d{8}$/
  esexp[1] = /^[A-H|N-S|W]\d{7}[A-J]$/
  esexp[2] = /^[0-9|Y|Z]\d{7}[A-Z]$/
  esexp[3] = /^[K|L|M|X]\d{7}[A-Z]$/
  let i = 0

  // National juridical entities
  if (esexp[0].test(vatnumber)) {
    // Extract the next digit and multiply by the counter.
    for (i = 0; i < 7; i++) {
      temp = Number(vatnumber.charAt(i + 1)) * multipliers[i]
      if (temp > 9) {
        total += Math.floor(temp / 10) + (temp % 10)
      } else {
        total += temp
      }
    }
    // Now calculate the check digit itself.
    total = 10 - (total % 10)
    if (total == 10) {
      total = 0
    }

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(8)) {
      return true
    }
    return false
  }

  // Juridical entities other than national ones
  else if (esexp[1].test(vatnumber)) {
    // Extract the next digit and multiply by the counter.
    for (i = 0; i < 7; i++) {
      temp = Number(vatnumber.charAt(i + 1)) * multipliers[i]
      if (temp > 9) {
        total += Math.floor(temp / 10) + (temp % 10)
      } else {
        total += temp
      }
    }

    // Now calculate the check digit itself.
    total = 10 - (total % 10)
    total = String.fromCharCode(total + 64)

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(8)) {
      return true
    }
    return false
  }

  // Personal number (NIF) (starting with numeric of Y or Z)
  else if (esexp[2].test(vatnumber)) {
    let tempnumber = vatnumber
    if (tempnumber.substring(0, 1) == 'Y') {
      tempnumber = tempnumber.replace(/Y/, '1')
    }
    if (tempnumber.substring(0, 1) == 'Z') {
      tempnumber = tempnumber.replace(/Z/, '2')
    }
    return (
      tempnumber.charAt(8) ==
      'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(Number(tempnumber.substring(0, 8)) % 23)
    )
  }

  // Personal number (NIF) (starting with K, L, M, or X)
  else if (esexp[3].test(vatnumber)) {
    return (
      vatnumber.charAt(8) ==
      'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(Number(vatnumber.substring(1, 8)) % 23)
    )
  }
  return false
}

function EUVATCheckDigit(vatnumber) {
  // Should Validates am EU VAT number.

  // We know little about EU numbers apart from the fact that the first 3 digits represent the
  // country, and that there are nine digits in total.

  return true
}

function FIVATCheckDigit(vatnumber) {
  // Validates a Finnish VAT number.

  let total = 0
  const multipliers = [7, 9, 10, 5, 8, 4, 2]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 7; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total = 11 - (total % 11)
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(7)) {
    return true
  }
  return false
}

function FRVATCheckDigit(vatnumber) {
  // Validates a French VAT number.

  if (!/^\d{11}$/.test(vatnumber)) {
    return true
  }

  // Extract the last nine digits as an integer.
  let total = vatnumber.substring(2)

  // Establish check digit.
  total = (total * 100 + 12) % 97

  // Compare it with the first two character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(0, 2)) {
    return true
  }
  return false
}

function GBVATCheckDigit(vatnumber) {
  // Validates a UK VAT number.

  const multipliers = [8, 7, 6, 5, 4, 3, 2]

  // Government departments
  if (vatnumber.substr(0, 2) == 'GD') {
    if (vatnumber.substr(2, 3) < 500) {
      return true
    }
    return false
  }

  // Health authorities
  if (vatnumber.substr(0, 2) == 'HA') {
    if (vatnumber.substr(2, 3) > 499) {
      return true
    }
    return false
  }

  // Standard and Commercial Group numbers
  let total = 0

  // A VAT number of all zeros is disallowed
  if (vatnumber.slice(0) == 0) {
    return false
  }

  // Check range is OK for modulus 97 calculation
  const no = Number(vatnumber.slice(0, 7))

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 7; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Old numbers use a simple 97 modulus, but new numbers use an adaptation of that (less 55). Our
  // VAT number could use either system, so we check it against both.

  // Establish check digits by subtracting 97 from total until negative.
  let cd = total
  while (cd > 0) {
    cd -= 97
  }

  // Get the absolute value and compare it with the last two characters of the VAT number. If the
  // same, then it is a valid traditional check digit. However, even then the number must fit within
  // certain specified ranges.
  cd = Math.abs(cd)
  if (
    cd == vatnumber.slice(7, 9) &&
    no < 9990001 &&
    (no < 100000 || no > 999999) &&
    (no < 9490001 || no > 9700000)
  ) {
    return true
  }

  // Now try the new method by subtracting 55 from the check digit if we can - else add 42
  if (cd >= 55) {cd -= 55}
  } else {
    cd = cd + 42
  }
  if (cd == vatnumber.slice(7) && no > 1000000) {
    return true
  }
  return false
}

function HRVATCheckDigit(vatnumber) {
  // Validates a Croatian VAT number

  let product = 10
  let sum = 0

  for (let i = 0; i < 10; i++) {
    // Extract the next digit and implement the algorithm
    sum = (Number(vatnumber.charAt(i)) + product) % 10
    if (sum == 0) {
      sum = 10
    }
    product = (2 * sum) % 11
  }

  // Now check that we have the right check digit
  if ((product + Number(vatnumber.slice(10))) % 10 == 1) {
    return true
  }
  return false
}

function HUVATCheckDigit(vatnumber) {
  // Validatesf a Hungarian VAT number.

  let total = 0
  const multipliers = [9, 7, 3, 1, 9, 7, 3]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 7; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digit.
  total = 10 - (total % 10)
  if (total == 10) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(7)) {
    return true
  }
  return false
}

function IEVATCheckDigit(vatnumber) {
  // Validates an Irish VAT number.

  let total = 0
  const multipliers = [8, 7, 6, 5, 4, 3, 2]

  // If the code is type 1 format, we need to convert it to the new before performing the validation.
  if (/^\d[A-Z\*\+]/.test(vatnumber)) {
    vatnumber = `0${vatnumber.substring(2, 7)}${vatnumber.substring(
      0,
      1
    )}${vatnumber.substring(7, 8)}`
  }

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 7; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // If the number is type 3 then we need to include the trailing A or H in the calculation
  if (/^\d{7}[A-Z][AH]$/.test(vatnumber)) {
    // Add in a multiplier for the character A (1*9=9) or H (8*9=72)
    if (vatnumber.charAt(8) == 'H') {
      total += 72
    } else {
      total += 9
    }
  }

  // Establish check digit using modulus 23, and translate to char. equivalent.
  total %= 23
  if (total == 0) {
    total = 'W'
  } else {
    total = String.fromCharCode(total + 64)
  }

  // Compare it with the eighth character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(7, 8)) {
    return true
  }
  return false
}

function ILVATCheckDigit(vatnumber) {
  // Validates an Israeli VAT number.

  let total = 0
  const multipliers = [1, 2, 1, 2, 1, 2, 1, 2]
  let temp

  // Pad left with zeros if not 9 characters
  vatnumber = `000000000${vatnumber}`.slice(-9)

  // Extract the next digit and multiply by the appropriate
  for (let i = 0; i < 8; i++) {
    temp = Number(vatnumber.charAt(i)) * multipliers[i]
    if (temp > 9) {
      total += Math.floor(temp / 10) + (temp % 10)
    } else {
      total += temp
    }
  }

  // Establish check digit.
  total = 10 - (total % 10)
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function ITVATCheckDigit(vatnumber) {
  // Validates an Italian VAT number.

  let total = 0
  const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
  let temp

  // The last three digits are the issuing office, and cannot exceed more 201, unless 999 or 888
  if (Number(vatnumber.slice(0, 7)) == 0) {
    return false
  }
  temp = Number(vatnumber.slice(7, 10))
  if (temp < 1 || (temp > 201 && temp != 999 && temp != 888)) {
    return false
  }

  // Extract the next digit and multiply by the appropriate
  for (let i = 0; i < 10; i++) {
    temp = Number(vatnumber.charAt(i)) * multipliers[i]
    if (temp > 9) {
      total += Math.floor(temp / 10) + (temp % 10)
    } else {
      total += temp
    }
  }

  // Establish check digit.
  total = 10 - (total % 10)
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(10)) {
    return true
  }
  return false
}

function LTVATCheckDigit(vatnumber) {
  // Validates a Lithuanian VAT number.

  let total
  let multipliers
  let i

  // 9 character VAT numbers are for legal persons
  if (vatnumber.length == 9) {
    // 8th character must be one
    if (!/^\d{7}1/.test(vatnumber)) {
      return false
    }

    // Extract the next digit and multiply by the counter+1.
    total = 0
    for (i = 0; i < 8; i++) {
      total += Number(vatnumber.charAt(i)) * (i + 1)
    }

    // Can have a double check digit calculation!
    if (total % 11 == 10) {
      multipliers = [3, 4, 5, 6, 7, 8, 9, 1]
      total = 0
      for (i = 0; i < 8; i++) {
        total += Number(vatnumber.charAt(i)) * multipliers[i]
      }
    }

    // Establish check digit.
    total %= 11
    if (total == 10) {
      total = 0
    }

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(8)) {
      return true
    }
    return false
  }

  // 12 character VAT numbers are for temporarily registered taxpayers

  // 11th character must be one
  if (!/^\d{10}1/.test(vatnumber)) {
    return false
  }

  // Extract the next digit and multiply by the counter+1.
  total = 0
  multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2]
  for (i = 0; i < 11; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Can have a double check digit calculation!
  if (total % 11 == 10) {
    multipliers = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4]
    total = 0
    for (i = 0; i < 11; i++)
      {total += Number(vatnumber.charAt(i)) * multipliers[i]}
  }

  // Establish check digit.
  total %= 11
  if (total == 10) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(11)) {
    return true
  }
  return false
}

function LUVATCheckDigit(vatnumber) {
  // Validates a Luxembourg VAT number.

  if (vatnumber.slice(0, 6) % 89 == vatnumber.slice(6)) {
    return true
  }
  return false
}

function LVVATCheckDigit(vatnumber) {
  // CValidates a Latvian VAT number.

  // Differentiate between legal entities and natural bodies. For the latter we simply check that
  // the first six digits correspond to valid DDMMYY dates.
  if (/^[0-3]/.test(vatnumber)) {
    if (/^[0-3][0-9][0-1][0-9]/.test(vatnumber)) {
      return true
    }
    return false
  }
  let total = 0
  const multipliers = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 10; i++)
    {total += Number(vatnumber.charAt(i)) * multipliers[i]}

  // Establish check digits by getting modulus 11.
  if (total % 11 == 4 && vatnumber[0] == 9) {
    total = total - 45
  }
  if (total % 11 == 4) {
    total = 4 - (total % 11)
  } else if (total % 11 > 4) {
    total = 14 - (total % 11)
  } else if (total % 11 < 4) {
    total = 3 - (total % 11)
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(10)) {
    return true
  }
  return false
}

function MTVATCheckDigit(vatnumber) {
  // Validates a Maltese VAT number.

  let total = 0
  const multipliers = [3, 4, 6, 7, 8, 9]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 6; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits by getting modulus 37.
  total = 37 - (total % 37)

  // Compare it with the last two characters of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(6)) {
    return true
  }
  return false
}

function NLVATCheckDigit(vatnumber) {
  // Validates a Dutch VAT number.

  // Function to turn a Dutch VAT number in its entirety to a numeric equivalent
  function convert_string_tonumeric(vatstring) {
    // Add 'NL' back to front of string
    const vat = `NL${vatstring}`

    // Each character in the string is looked at one at a time
    let nextchar = ''

    // The result of the conversion goes here
    let result = ''

    for (let i = 0; i < vat.length; i++) {
      // Pick up the next character from the vat string as Unicode
      nextchar = vat.charCodeAt(i)

      // If it is a '*' convert to numeric 36
      if (nextchar == 42) {
        nextchar = 37
      }
      // If it is a '+' convert to numeric 37
      else if (nextchar == 43) {
        nextchar = 36
      }
      // Convert 0 to 9 to 0 to 9 characters
      else if (nextchar > 47 && nextchar < 58) {
        nextchar -= 48
      }
      // Convert A-Z to 10 to 35
      else if (nextchar > 64 && nextchar < 91) {
        nextchar -= 55
      }

      // Add to convert test string
      result += nextchar
    }
    return result
  }

  // Function to calculate the modulus of a long number
  function modulo(divident, divisor) {
    const partLength = 7

    while (divident.length > partLength) {
      const part = divident.substring(0, partLength)
      divident = (part % divisor) + divident.substring(partLength)
    }

    return divident % divisor
  }

  function standardNo() {
    // Checks the check digits of a Dutch VAT number.

    let total = 0
    const multipliers = [9, 8, 7, 6, 5, 4, 3, 2]

    // Extract the next digit and multiply by the counter.
    for (let i = 0; i < 8; i++) {
      total += Number(vatnumber.charAt(i)) * multipliers[i]
    }

    // Establish check digits by getting modulus 11.
    total %= 11
    if (total > 9) {
      total = 0
    }

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(8, 9)) {
      return true
    }
    return false
  }

  function soleproprietorNo(vatnumber) {
    // Checks the check digit of a sole proprietor Dutch VAT number
    const numericvat = convert_string_tonumeric(vatnumber)
    if (modulo(numericvat, 97) == 1) {
      return true
    }
    return false
  }

  // First check whether the VAT number is a valid standard one
  if (standardNo(vatnumber)) {
    return true
  }
  // If not, check whether it is a valid sole proprietor vat number
  else if (soleproprietorNo(vatnumber)) {
    return true
  }
  // Neither - it must be invalid
  return false
}

function NOVATCheckDigit(vatnumber) {
  // Validates a Norwegian VAT number.
  // See http://www.brreg.no/english/coordination/number.html

  let total = 0
  const multipliers = [3, 2, 7, 6, 5, 4, 3, 2]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits by getting modulus 11. Check digits > 9 are invalid
  total = 11 - (total % 11)
  if (total == 11) {
    total = 0
  }
  if (total < 10) {
    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    if (total == vatnumber.slice(8)) {
      return true
    }
    return false
  }
}

function PLVATCheckDigit(vatnumber) {
  // Validates a Polish VAT number.

  let total = 0
  const multipliers = [6, 5, 7, 2, 3, 4, 5, 6, 7]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 9; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits subtracting modulus 11 from 11.
  total %= 11
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(9)) {
    return true
  }
  return false
}

function PTVATCheckDigit(vatnumber) {
  // Validates a Portuguese VAT number.

  let total = 0
  const multipliers = [9, 8, 7, 6, 5, 4, 3, 2]

  // Extract the next digit and multiply by the counter.
  for (let i = 0; i < 8; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits subtracting modulus 11 from 11.
  total = 11 - (total % 11)
  if (total > 9) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(8)) {
    return true
  }
  return false
}

function ROVATCheckDigit(vatnumber) {
  // Validates a Romanian VAT number.

  const multipliers = [7, 5, 3, 2, 1, 7, 5, 3, 2]

  // Pad left with zeros if not 10 characters
  vatnumber = `000000000${vatnumber}`.slice(-10)

  // Extract the next digit and multiply by the counter.
  let total = 0
  for (let i = 0; i < 9; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits by getting modulus 11.
  total = (10 * total) % 11
  if (total == 10) {
    total = 0
  }

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (total == vatnumber.slice(9)) {
    return true
  }
  return false
}

function RSVATCheckDigit(vatnumber) {
  // Validates a Serbian VAT number

  let product = 10
  let sum = 0

  for (let i = 0; i < 8; i++) {
    // Extract the next digit and implement the algorithm
    sum = (Number(vatnumber.charAt(i)) + product) % 10
    if (sum == 0) {
      sum = 10
    }
    product = (2 * sum) % 11
  }

  // Now check that we have the right check digit
  if ((product + Number(vatnumber.slice(8))) % 10 == 1) {
    return true
  }
  return false
}

function RUVATCheckDigit(vatnumber) {
  // Validates a Russian INN number
  // See http://russianpartner.biz/test_inn.html for algorithm

  let i

  // 10 digit INN numbers
  if (vatnumber.length == 10) {
    let total = 0
    const multipliers = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0]
    for (i = 0; i < 10; i++) {
      total += Number(vatnumber.charAt(i)) * multipliers[i]
    }
    total %= 11
    if (total > 9) {
      total %= 10
    }

    // Compare it with the last character of the VAT number. If it is the same, then it's valid
    if (total == vatnumber.slice(9)) {
      return true
    }
    return false

    // 12 digit INN numbers
  } else if (vatnumber.length == 12) {
    let total1 = 0
    const multipliers1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0]
    let total2 = 0
    const multipliers2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0]

    for (i = 0; i < 11; i++) {
      total1 += Number(vatnumber.charAt(i)) * multipliers1[i]
    }
    total1 %= 11
    if (total1 > 9) {
      total1 %= 10
    }

    for (i = 0; i < 11; i++) {
      total2 += Number(vatnumber.charAt(i)) * multipliers2[i]
    }
    total2 %= 11
    if (total2 > 9) {
      total2 %= 10
    }

    // Compare the first check with the 11th character and the second check with the 12th and last
    // character of the VAT number. If they're both the same, then it's valid
    if (
      total1 == vatnumber.slice(10, 11) &&
      total2 == vatnumber.slice(11, 12)
    ) {
      return true
    }
    return false
  }
}

function SEVATCheckDigit(vatnumber) {
  // Validates a Swedish VAT number

  // Calculate R where R = R1 + R3 + R5 + R7 + R9, and Ri = INT(Ci/5) + (Ci*2) modulo 10
  let R = 0
  let digit
  for (let i = 0; i < 9; i += 2) {
    digit = Number(vatnumber.charAt(i))
    R += Math.floor(digit / 5) + ((digit * 2) % 10)
  }

  // Calculate S where S = C2 + C4 + C6 + C8
  let S = 0
  for (i = 1; i < 9; i += 2) {
    S += Number(vatnumber.charAt(i))
  }

  // Calculate the Check Digit
  const cd = (10 - ((R + S) % 10)) % 10

  // Compare it with the last character of the VAT number. If it's the same, then it's valid.
  if (cd == vatnumber.slice(9, 10)) {
    return true
  }
  return false
}

function SIVATCheckDigit(vatnumber) {
  // Validates a Slovenian VAT number.

  let total = 0
  const multipliers = [8, 7, 6, 5, 4, 3, 2]
  let i

  // Extract the next digit and multiply by the counter.
  for (i = 0; i < 7; i++) {
    total += Number(vatnumber.charAt(i)) * multipliers[i]
  }

  // Establish check digits using modulus 11
  total = 11 - (total % 11)
  if (total == 10) {
    total = 0
  }

  // Compare the number with the last character of the VAT number. If it is the
  // same, then it's a valid check digit.
  if (total != 11 && total == vatnumber.slice(7)) {
    return true
  }
  return false
}

function SKVATCheckDigit(vatnumber) {
  // Validates a Slovakian VAT number.

  // Check that the modulus of the whole VAT number is 0 - else error
  if (Number(vatnumber % 11) == 0) {
    return true
  }
  return false
}
