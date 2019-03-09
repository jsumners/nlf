'use strict'

const tap = require('tap')
const path = require('path')
const fileSource = require('../../../lib/file-source')
const packageSource = require('../../../lib/package-source')
const { csvFormatter: csvFormat, Module } = require('../../..')

const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test')
mod.licenseSources.package.add(packageSource('Apache'))
const input = [mod]

const expected =
  '"name","version","directory","repository","summary","from package.json",' +
  '"from license","from readme"\n' +
  '"test","1.0.0","/dir/test","(none)","Apache;MIT","Apache","MIT",""'

let ready = false
tap.beforeEach(done => {
  if (ready) return done()
  fileSource(
    path.join(__dirname, '..', '..', 'fixtures', 'MIT'),
    (err, source) => {
      ready = true
      if (err) return done(err)
      mod.licenseSources.license.add(source)
      done()
    }
  )
})

tap.test('throws without callback', t => {
  t.throws(() => csvFormat.render(input))
  t.end()
})

tap.test('returns an error if not given data', t => {
  csvFormat.render(undefined, {}, err => {
    t.match(err, /licenseData must be an array/)
    t.end()
  })
})

tap.test('returns an error given badly typed data', t => {
  t.plan(3)
  csvFormat.render(1, {}, err => {
    t.match(err, /licenseData must be an array/)
  })
  csvFormat.render(true, {}, err => {
    t.match(err, /licenseData must be an array/)
  })
  csvFormat.render('foo', {}, err => {
    t.match(err, /licenseData must be an array/)
  })
})

tap.test('retuns an error given an empty array', t => {
  csvFormat.render([], {}, err => {
    t.match(err, /must have at least one module in data/)
    t.end()
  })
})

tap.test('returns expected format from good input', t => {
  csvFormat.render(input, {}, (err, output) => {
    t.error(err)
    t.is(output, expected)
    t.end()
  })
})
