'use strict'

const kSources = Symbol('audit-license.licenses-collection-sources')
const proto = {}
Object.defineProperties(proto, {
  add: {
    value: function (source) {
      if (Object.prototype.toString.apply(source) !== '[object Object]') {
        throw Error('source must be an object')
      }
      this[kSources].add(source)
    }
  },
  sources: {
    get () {
      return Array.from(this[kSources])
    }
  },
  summary: {
    value: function () {
      const result = new Set()
      for (const val of this[kSources].values()) {
        Set.prototype.add.apply(result, val.names || [])
      }
      return Array.from(result)
    }
  }
})

module.exports = function licenseCollection () {
  const collection = Object.create(proto)
  Object.defineProperty(collection, kSources, {
    value: new Set()
  })
  return collection
}
