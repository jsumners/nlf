'use strict'

const tap = require('tap')
const fileSource = require('../../lib/file-source')
const path = require('path')
const mitPath = path.join(__dirname, '..', 'fixtures', 'MIT')

tap.test('should be a function', async t => {
  t.type(fileSource, Function)
})

tap.test('throws with no path', async t => {
  t.throws(() => fileSource())
})

tap.test('throws with no callback', async t => {
  t.throws(() => fileSource('/dir/filename'))
})

tap.test('creates an initialized object with a path', t => {
  fileSource(mitPath, (err, source) => {
    t.error(err)
    t.is(source.filePath, mitPath)
    t.deepEqual(source.names, ['MIT'])
    t.end()
  })
})

tap.test('returns error for bad filename', t => {
  fileSource(path.join(__dirname, '..', 'fixtures', 'CATS'), (err, source) => {
    t.match(err, /ENOENT: no such file or directory/)
    t.ok(source)
    t.end()
  })
})
