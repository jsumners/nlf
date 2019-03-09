'use strict'

const preRegex = '(?:^|\\s|"|\\()'
const postRegex = '(?:$|\\s|"|\\))'

function regexpBuilder (text, flags) {
  return new RegExp(preRegex + text + postRegex, flags)
}

const patterns = [
  {
    name: 'BSD',
    regex: [regexpBuilder('BSD')]
  },
  {
    name: 'GPL',
    regex: [
      regexpBuilder('GPL', 'i'),
      regexpBuilder('GPLv\\d'),
      regexpBuilder('GPL\\-\\d\\.?\\d?')
    ]
  },
  {
    name: 'Public Domain',
    regex: [regexpBuilder('Public domain', 'i')]
  },
  {
    name: 'LGPL',
    regex: [regexpBuilder('LGPL')]
  },
  {
    name: 'MIT',
    regex: [/(?:^|\s)MIT(?:$|\s)/, /(?:^|\s)\(MIT\)(?:$|\s)/]
  },
  {
    name: 'Apache',
    regex: [regexpBuilder('Apache\\sLicen[cs]e', 'i')]
  },
  {
    name: 'MPL',
    regex: [regexpBuilder('MPL')]
  },
  {
    name: 'WTFPL',
    regex: [
      regexpBuilder('WTFPL'),
      regexpBuilder(
        'DO\\sWHAT\\sTHE\\sFUCK\\sYOU\\sWANT\\sTO\\sPUBLIC\\sLICEN[CS]E',
        'i'
      )
    ]
  },
  {
    name: 'ISC',
    regex: [regexpBuilder('ISC')]
  },
  {
    name: 'Eclipse Public License',
    regex: [
      regexpBuilder('Eclipse\\sPublic\\sLicen[cs]e', 'i'),
      regexpBuilder('EPL'),
      regexpBuilder('EPL-1\\.0')
    ]
  }
]

// pattern to deliberately exclude a file
const excludePattern = /@@NLF-IGNORE@@/

/**
 * Identifies potential license text
 *
 * @param  {String} text The text to scan
 * @return {Array} Array of potential license names
 */
function identifyLicense (text) {
  const output = new Set()
  // Ignore files that have the ignore flag - e.g. the nlf project itself
  if (excludePattern.test(text) === true) {
    return []
  }
  patterns.forEach(pattern => {
    pattern.regex.forEach(regex => {
      if (regex.test(text)) {
        output.add(pattern.name)
      }
    })
  })
  return Array.from(output).sort()
}

module.exports = identifyLicense
