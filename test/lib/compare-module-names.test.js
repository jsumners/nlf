'use strict'

const tap = require('tap')
const compare = require('../../lib/compare-module-names')
const { Module } = require('../..')

tap.test('names are different', async ({ test }) => {
  test('versions are the same', async t => {
    const module1 = new Module('aaa@1.0.0', 'aaa', '1.0.0', '/', '', 'production')
    const module2 = new Module('bbb@1.0.0', 'bbb', '1.0.0', '/', '', 'production')
    t.is(compare(module1, module2), -1)
    t.is(compare(module2, module1), 1)
  })

  test('versions are different', async t => {
    const module1 = new Module('aaa@2.0.0', 'aaa', '1.0.0', '/', '', 'production')
    const module2 = new Module('bbb@1.0.0', 'bbb', '1.0.0', '/', '', 'production')
    t.is(compare(module1, module2), -1)
    t.is(compare(module2, module1), 1)
  })
})

tap.test('names are the same', async ({ test }) => {
  test('versions are the same', async t => {
    const module1 = new Module('aaa@1.0.0', 'aaa', '1.0.0', '/', '', 'production')
    const module2 = new Module('aaa@1.0.0', 'aaa', '1.0.0', '/', '', 'production')
    t.is(compare(module1, module2), 0)
    t.is(compare(module2, module1), 0)
  })

  test('versions are different', async t => {
    const module1 = new Module('aaa@2.0.0', 'aaa', '2.0.0', '/', '', 'production')
    const module2 = new Module('aaa@1.0.0', 'aaa', '1.0.0', '/', '', 'production')
    t.is(compare(module1, module2), 1)
    t.is(compare(module2, module1), -1)
  })

  test('versions have pre-release modifiers', async t => {
    const module1 = new Module('aaa@2.0.0', 'aaa', '1.0.0', '/', '', 'production')
    const module2 = new Module('aaa@1.0.0', 'aaa', '1.0.0-alpha1', '/', '', 'production')
    t.is(compare(module1, module2), 1)
    t.is(compare(module2, module1), -1)
  })
})
