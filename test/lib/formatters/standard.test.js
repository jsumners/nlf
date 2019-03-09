'use strict'

const tap = require('tap')
const path = require('path')
const fileSource = require('../../../lib/file-source')
const packageSource = require('../../../lib/package-source')
const { standardFormatter: standardFormat, Module } = require('../../..')

const mitPath = path.join(__dirname, '..', '..', 'fixtures', 'MIT')
const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test')
mod.licenseSources.package.add(packageSource('Apache'))
const input = [mod]

const expected =
  'test@1.0.0 [license(s): Apache, MIT]\n' +
  '├── package.json:  Apache\n' +
  '├── license files: MIT\n' +
  '└── readme files: MIT\n\n' +
  'LICENSES: Apache, MIT\n'

const expectedWithDatailSummary =
  'test@1.0.0 [license(s): Apache, MIT]\n' +
  '├── package.json:  Apache\n' +
  '├── license files: MIT\n' +
  '└── readme files: MIT\n\n' +
  'LICENSES:\n' +
  '├─┬ Apache\n' +
  '│ └── test@1.0.0\n' +
  '└─┬ MIT\n' +
  '  └── test@1.0.0\n'

let ready = false
tap.beforeEach(done => {
  if (ready) return done()
  fileSource(mitPath, (err, source) => {
    ready = true
    if (err) return done(err)
    mod.licenseSources.license.add(source)
    mod.licenseSources.readme.add(source)
    done()
  })
})

tap.test('throws without callback', t => {
  t.throws(() => standardFormat.render(input))
  t.end()
})

tap.test('returns error with no input', t => {
  standardFormat.render(undefined, {}, err => {
    t.match(err, /licenseData must be an array/)
    t.end()
  })
})

tap.test('returns error with badly typed data', t => {
  t.plan(3)
  standardFormat.render(1, {}, err => {
    t.match(err, /licenseData must be an array/)
  })
  standardFormat.render(true, {}, err => {
    t.match(err, /licenseData must be an array/)
  })
  standardFormat.render('foo', {}, err => {
    t.match(err, /licenseData must be an array/)
  })
})

tap.test('returns error with empty array', t => {
  standardFormat.render([], {}, err => {
    t.match(err, /must have at least one module in data/)
    t.end()
  })
})

tap.test('returns a record in the expected simple format', t => {
  standardFormat.render(input, { summaryMode: 'simple' }, (err, output) => {
    t.error(err)
    t.is(output, expected)
    t.end()
  })
})

tap.test('returns a record in the expected detail format', t => {
  standardFormat.render(input, { summaryMode: 'detail' }, (err, output) => {
    t.error(err)
    t.is(output, expectedWithDatailSummary)
    t.end()
  })
})
