'use strict'

const { test } = require('tap')
const path = require('path')
const { csvFormatter: csvFormat, Module, PackageSource, FileSource } = require('../../..')

const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test')
mod.licenseSources.package.add(new PackageSource('Apache'))
mod.licenseSources.license.add(new FileSource(path.join(__dirname, '..', '..', 'fixtures', 'MIT')))
const input = [mod]

const expected =
  'name,version,directory,repository,summary,from package.json,' +
  'from license,from readme\n' +
  'test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,'

test('throws without callback', t => {
  t.plan(2)
  mod.licenseSources.license.sources[0].read(err => {
    t.error(err)
    t.throws(() => csvFormat.render(input))
  })
})

test('returns an error if not given data', t => {
  csvFormat.render(undefined, {}, err => {
    t.match(err, /licenseData must be an array/)
    t.end()
  })
})

test('returns an error given badly typed data', t => {
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

test('retuns an error given an empty array', t => {
  csvFormat.render([], {}, err => {
    t.match(err, /must have at least one module in data/)
    t.end()
  })
})

test('returns expected format from good input', t => {
  mod.licenseSources.license.sources[0].read(err => {
    t.error(err)
    csvFormat.render(input, {}, (err, output) => {
      t.error(err)
      t.is(output, expected)
      t.end()
    })
  })
})
