'use strict'

const { test } = require('tap')
const sourceProto = require('../../lib/source-proto')

test('accepts a string name', async t => {
  const source = Object.create(sourceProto)
  source.names = 'foo'
  t.deepEqual(source.names, ['foo'])
})

test('accetps an array of names and returns sorted array', async t => {
  const source = Object.create(sourceProto)
  source.names = ['foo', 'bar']
  t.deepEqual(source.names, ['bar', 'foo'])
})
