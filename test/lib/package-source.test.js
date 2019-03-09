'use strict'

const { test } = require('tap')
const { PackageSource } = require('../..')

test('is a function', async t => {
  t.type(PackageSource, Function)
})

test('throws with no argument', async t => {
  t.throws(() => new PackageSource())
})

test('creates an initialized object with a string parameter', async t => {
  const source = new PackageSource('MIT')
  t.is(source.license, 'MIT')
  t.is(source.url, '(none)')
})

test('creates an initialized object with an object parameter', async t => {
  const source = new PackageSource({
    type: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  })
  t.is(source.license, 'MIT')
  t.is(source.url, 'https://opensource.org/licenses/MIT')
})

test('instance.names should return array log licenses', async t => {
  const source = new PackageSource('MIT')
  const licenses = source.names()
  t.type(licenses, Array)
  t.is(licenses.length, 1)
  t.deepEqual(licenses, ['MIT'])
})
