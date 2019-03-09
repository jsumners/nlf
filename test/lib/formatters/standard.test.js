'use strict'

const { test } = require('tap')
const path = require('path')
const {
  standardFormatter: standardFormat,
  Module,
  PackageSource,
  FileSource
} = require('../../..')

const mitPath = path.join(__dirname, '..', '..', 'fixtures', 'MIT')
const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test')
mod.licenseSources.package.add(new PackageSource('Apache'))
mod.licenseSources.license.add(new FileSource(mitPath))
mod.licenseSources.readme.add(new FileSource(mitPath))
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

test('throws without callback', t => {
  t.plan(3)
  mod.licenseSources.license.sources[0].read(err => {
    t.error(err)
    mod.licenseSources.readme.sources[0].read(err => {
      t.error(err)
      t.throws(() => standardFormat.render(input))
    })
  })
})

test('returns error with no input', t => {
  standardFormat.render(undefined, {}, err => {
    t.match(err, /licenseData must be an array/)
    t.end()
  })
})

test('returns error with badly typed data', t => {
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

test('returns error with empty array', t => {
  standardFormat.render([], {}, err => {
    t.match(err, /must have at least one module in data/)
    t.end()
  })
})

test('returns a record in the expected simple format', t => {
  mod.licenseSources.license.sources[0].read(err => {
    t.error(err)
    mod.licenseSources.readme.sources[0].read(err => {
      t.error(err)
      standardFormat.render(input, { summaryMode: 'simple' }, (err, output) => {
        t.error(err)
        t.is(output, expected)
        t.end()
      })
    })
  })
})

test('returns a record in the expected detail format', t => {
  mod.licenseSources.license.sources[0].read(err => {
    t.error(err)
    mod.licenseSources.readme.sources[0].read(err => {
      t.error(err)
      standardFormat.render(input, { summaryMode: 'detail' }, (err, output) => {
        t.error(err)
        t.is(output, expectedWithDatailSummary)
        t.end()
      })
    })
  })
})
