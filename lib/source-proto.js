'use strict'

const kNames = Symbol('audit-license.source.names')
const proto = {}

Object.defineProperties(proto, {
  names: {
    get () {
      return this[kNames] ? Array.from(this[kNames]).sort() : []
    },
    set (val) {
      if (!this[kNames]) this[kNames] = new Set()
      if (Array.isArray(val)) {
        val.forEach(v => this[kNames].add(v))
      } else {
        this[kNames].add(val)
      }
    }
  }
})

module.exports = proto
