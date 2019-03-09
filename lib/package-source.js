'use strict'

const sourceProto = require('./source-proto')
function isAllowedInput (input) {
  const str = Object.prototype.toString.apply(input)
  return str === '[object Object]' || str === '[object String]'
}

module.exports = function packageSource (licenseProperty) {
  if (isAllowedInput(licenseProperty) === false) {
    throw Error('licenseProperty must be a string or an object')
  }
  const source = Object.create(sourceProto)
  switch (typeof licenseProperty) {
    case 'string':
      source.names = licenseProperty
      source.license = licenseProperty
      source.url = '(none)'
      break
    case 'object':
      source.names = licenseProperty.type
      source.license = licenseProperty.type
      source.url = licenseProperty.url
  }
  return source
}
