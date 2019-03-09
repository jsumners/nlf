'use strict'

const { test } = require('tap')
const packageSource = require('../../lib/package-source')

test('is a function', async t => {
  t.type(packageSource, Function)
})

test('throws with no argument', async t => {
  t.throws(() => packageSource())
})

test('creates an initialized object with a string parameter', async t => {
  const source = packageSource('MIT')
  t.is(source.license, 'MIT')
  t.is(source.url, '(none)')
})

test('creates an initialized object with an object parameter', async t => {
  const source = packageSource({
    type: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  })
  t.is(source.license, 'MIT')
  t.is(source.url, 'https://opensource.org/licenses/MIT')
})

test('instance.names should return array log licenses', async t => {
  const source = packageSource('MIT')
  const licenses = source.names
  t.type(licenses, Array)
  t.is(licenses.length, 1)
  t.deepEqual(licenses, ['MIT'])
})
