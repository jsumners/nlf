'use strict'

const tap = require('tap')
const { FileSource } = require('../..')
const path = require('path')
const fs = require('fs')
const mitFile = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'MIT'), 'utf-8')

tap.test('should be a function', async t => {
  t.type(FileSource, Function)
})

tap.test('throws with no path', async t => {
  t.throws(() => new FileSource())
})

tap.test('creates an initialized object with a path', async t => {
  const source = new FileSource('/dir/filename')
  t.is(source.filePath, '/dir/filename')
  t.is(source.text, '')
  t.deepEqual(source.names(), [])
})

tap.test('reading MIT file', async ({ test, beforeEach }) => {
  let source
  beforeEach(done => {
    source = new FileSource(path.join(__dirname, '..', 'fixtures', 'MIT'))
    source.read(done)
  })

  test('contains text of the license file', async t => {
    t.is(source.text, mitFile)
  })

  test('detects only MIT license', async t => {
    const licenses = source.names()
    t.deepEqual(licenses, ['MIT'])
  })
})

tap.test('returns error for bad filename', t => {
  const source = new FileSource(path.join(__dirname, '..', 'fixtures', 'CATS'))
  source.read(err => {
    t.match(err, /ENOENT: no such file or directory/)
    t.end()
  })
})
