'use strict'

const { test } = require('tap')
const packageSource = require('../../lib/package-source')
const { LicenseCollection } = require('../..')

test('should be a function', async t => {
  t.type(LicenseCollection, Function)
})

test('initializes object with empty sources', async t => {
  const collection = new LicenseCollection()
  t.deepEqual(collection.sources, [])
})

test('throws adding non-objects', async t => {
  const collection = new LicenseCollection()
  t.throws(() => collection.add())
  t.throws(() => collection.add('cats'))
})

test('adds objects', async t => {
  const collection = new LicenseCollection()
  collection.add({ hello: 'world' })
  t.deepEqual(collection.sources, [{ hello: 'world' }])
})

test('summary returns an empty array', async t => {
  const collection = new LicenseCollection()
  t.deepEqual(collection.summary(), [])
})

test('summary returns license names', async t => {
  const collection = new LicenseCollection()
  collection.add(packageSource('MIT'))
  t.deepEqual(collection.summary(), ['MIT'])
})
