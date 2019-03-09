'use strict'

const tap = require('tap')

const { Module, FileSource, PackageSource } = require('../..')
const fakeMitFile = new FileSource('/dir/myMitFile')
const fakeApacheFile = new FileSource('/dir/myApacheFile')
const fakeGplFile = new FileSource('/dir/myGplFile')

fakeMitFile.text = 'blah MIT blah'
fakeApacheFile.text = 'blah The Apache License blah'
fakeGplFile.text = 'blah GPL blah'

tap.test('constructor', async ({ test }) => {
  test('should be a function', async t => {
    t.type(Module, Function)
  })

  test('throws when no name', async t => {
    t.throws(() => new Module(undefined, undefined, undefined, '/my/dir'))
  })

  test('throws when no dir', async t => {
    t.throws(() => new Module('my-module'))
  })

  test('returns an object with basic parameters', async t => {
    const mod = new Module('my-module@1.0.0', undefined, undefined, '/my/dir', undefined)
    t.type(mod, Object)
  })

  test('sets name, version, dir, repo, and type', async t => {
    const mod = new Module(
      'my-module@1.0.0',
      'my-module',
      '1.0.0',
      '/my/dir',
      'https://myhost/myrepo',
      'development'
    )
    t.match(mod, {
      id: 'my-module@1.0.0',
      name: 'my-module',
      version: '1.0.0',
      directory: '/my/dir',
      repository: 'https://myhost/myrepo',
      type: 'development'
    })
  })

  test('removes git prefix from repo url', async t => {
    const mod = new Module(
      'my-module@1.0.0',
      undefined,
      undefined,
      '/my/dir',
      'git+https://myhost/myrepo.git'
    )
    t.is(mod.repository, 'https://myhost/myrepo')
  })

  test('replaces git protocol with http', async t => {
    const mod = new Module(
      'my-module@1.0.0',
      undefined,
      undefined,
      '/my/dir',
      'git://myhost/myrepo.git'
    )
    t.is(mod.repository, 'http://myhost/myrepo')
  })

  test('should have a licenseSources object with empty collections in it', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    t.ok(mod.licenseSources)
    t.deepEqual(mod.licenseSources, {
      package: {
        sources: []
      },
      readme: {
        sources: []
      },
      license: {
        sources: []
      }
    })
  })
})

tap.test('summary method', async ({ test }) => {
  test('on initialization only have Unknown', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    t.deepEqual(mod.summary(), ['Unknown'])
  })

  test('single package should appear in summary', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.package.sources.push(new PackageSource('MIT'))
    t.deepEqual(mod.summary(), ['MIT'])
  })

  test('multiple modules appear alphabetically', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.package.sources.push(new PackageSource('MIT'))
    mod.licenseSources.package.sources.push(new PackageSource('Apache'))
    t.deepEqual(mod.summary(), ['Apache', 'MIT'])
  })

  test('single license file should appear in summary', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.license.sources.push(fakeMitFile)
    t.deepEqual(mod.summary(), ['MIT'])
  })

  test('multiple license files appear alphabetically', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.license.sources.push(fakeMitFile)
    mod.licenseSources.license.sources.push(fakeApacheFile)
    t.deepEqual(mod.summary(), ['Apache', 'MIT'])
  })

  test('single readme file should appear in summary', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.readme.sources.push(fakeMitFile)
    t.deepEqual(mod.summary(), ['MIT'])
  })

  test('multiple readme files should appear alphabetically', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.readme.sources.push(fakeMitFile)
    mod.licenseSources.readme.sources.push(fakeApacheFile)
    t.deepEqual(mod.summary(), ['Apache', 'MIT'])
  })

  test('duplicate licenses from different sources are omitted', async t => {
    const mod = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
    mod.licenseSources.package.sources.push(new PackageSource('MIT'))
    mod.licenseSources.package.sources.push(new PackageSource('Apache'))
    mod.licenseSources.package.sources.push(new PackageSource('GPL'))
    mod.licenseSources.license.sources.push(fakeMitFile)
    mod.licenseSources.license.sources.push(fakeApacheFile)
    mod.licenseSources.readme.sources.push(fakeMitFile)
    mod.licenseSources.readme.sources.push(fakeApacheFile)
    t.deepEqual(mod.summary(), ['Apache', 'GPL', 'MIT'])
  })
})
