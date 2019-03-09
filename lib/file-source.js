'use strict'

const licenseFind = require('./license-find')
const fs = require('fs')

const sourceProto = require('./source-proto')
module.exports = function fileSource (filePath, cb) {
  if (typeof filePath !== 'string') {
    throw Error('filePath must be a string')
  }
  if (Function.prototype.isPrototypeOf(cb) === false) {
    throw Error('callback must be function')
  }

  const source = Object.create(sourceProto)
  source.filePath = filePath
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return cb(err, source)
    }
    source.names = licenseFind(data)
    cb(null, source)
  })
}
