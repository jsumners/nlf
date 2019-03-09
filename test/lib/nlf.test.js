'use strict'

const tap = require('tap')
const path = require('path')
const os = require('os')
const fs = require('fs')
const nlf = require('../..')

function getFixturePath (name) {
  return path.join(__dirname, '..', 'fixtures', name)
}

const fixturedir = getFixturePath('test-project')
const fixtureSubdirs = getFixturePath('test-project-subdirs')
const licensesArrayDir = getFixturePath('licenses-array')
const licenseObjectDir = getFixturePath('license-object')
const licensesObjectDir = getFixturePath('licenses-object')
const licensesStringDir = getFixturePath('licenses-string')
const missingName = getFixturePath('missing-name')

tap.test('#find', ({ test, end: done }) => {
  test('returns in timely manner', { timeout: 50000 }, t => {
    nlf.find({ directory: fixturedir }, err => {
      t.error(err)
      t.end()
    })
  })

  test('returns in timely manner in production mode', { timeout: 50000 }, t => {
    nlf.find({ directory: fixturedir, production: true }, err => {
      t.error(err)
      t.end()
    })
  })

  test(
    'returns in a timely manner in a non-node dir',
    { timeout: 50000 },
    t => {
      const testDir = path.join(os.tmpdir(), 'nlf-' + Date.now())
      fs.mkdir(testDir, err => {
        t.error(err)
        nlf.find({ directory: testDir }, err => {
          t.match(err, /No package\.json file found./)
          t.end()
        })
      })
      t.tearDown(() => {
        fs.access(testDir, result => {
          if (result) {
            fs.unlink(testDir, () => {})
          }
        })
      })
    }
  )

  test('returns in a timely manner without options', { timeout: 50000 }, t => {
    nlf.find(err => {
      t.error(err)
      t.end()
    })
  })

  test('requires options.production to be a boolean', t => {
    nlf.find({ directory: fixturedir, production: 'TRUE' }, err => {
      t.match(err, /options\.production must be a boolean/)
      t.end()
    })
  })

  test('requires options.directory to be a string', t => {
    nlf.find({ directory: 1 }, err => {
      t.match(err, /options\.directory must be a string/)
      t.end()
    })
  })

  test('should parse with a depth of 0', t => {
    nlf.find(
      { directory: fixturedir, production: true, depth: 0 },
      (err, results) => {
        t.error(err)
        t.match(results, [
          {
            id: 'nlf-test@1.0.0',
            name: 'nlf-test',
            version: '1.0.0',
            licenseSources: {
              package: { sources: [{ license: 'MIT' }] }
            }
          }
        ])
        t.end()
      }
    )
  })

  test('should parse with a depth of 1', t => {
    nlf.find(
      { directory: fixturedir, production: true, depth: 1 },
      (err, results) => {
        t.error(err)
        t.is(results.length, 2)
        t.end()
      }
    )
  })

  test('should parse with a depth of 0 includeing dev deps', t => {
    nlf.find(
      { directory: fixturedir, depth: 0, production: false },
      (err, results) => {
        t.error(err)
        t.is(results.length, 1)
        t.end()
      }
    )
  })

  test('should parse with a depth of 1 includeing dev deps', t => {
    nlf.find(
      { directory: fixturedir, depth: 1, production: false },
      (err, results) => {
        t.error(err)
        t.is(results.length, 3)
        t.end()
      }
    )
  })

  test('should parse with a depth of Infinity', t => {
    nlf.find({ directory: fixturedir, production: true }, (err, results) => {
      t.error(err)
      t.is(results.length, 4)
      t.end()
    })
  })

  test('should parse with a depth of Infinity with dev deps', t => {
    nlf.find({ directory: fixturedir, production: false }, (err, results) => {
      t.error(err)
      t.is(results.length, 7)
      t.end()
    })
  })

  test('should include subdirs but ignore node_modules and bower_modules', t => {
    nlf.find(
      { directory: fixtureSubdirs, production: false },
      (err, results) => {
        t.error(err)
        t.is(results.length, 4)
        const nlfTestModule = results.find(r => r.id === 'nlf-test@1.0.0')
        t.match(nlfTestModule, {
          licenseSources: {
            package: { sources: [] },
            readme: { sources: [] },
            license: {
              sources: [
                {
                  filePath: path.join(
                    fixtureSubdirs,
                    'subdir',
                    'docs',
                    'license.md'
                  )
                }
              ]
            }
          }
        })
        t.end()
      }
    )
  })

  // Single license object.
  test('with a license object should correctly get the license', t => {
    nlf.find({ directory: licenseObjectDir }, (err, results) => {
      t.error(err)
      t.match(results, [
        {
          licenseSources: {
            package: {
              sources: [{ license: 'MIT' }]
            }
          }
        }
      ])
      t.end()
    })
  })

  // Multiple licences object.
  test('with a licenses object should correctly get the license', t => {
    nlf.find({ directory: licensesObjectDir }, (err, results) => {
      t.error(err)
      t.match(results, [
        {
          licenseSources: {
            package: {
              sources: [{ license: 'MIT' }]
            }
          }
        }
      ])
      t.end()
    })
  })

  test('should get all licenses from an array of licenses', t => {
    nlf.find({ directory: licensesArrayDir }, (err, results) => {
      t.error(err)
      t.match(results, [
        {
          licenseSources: {
            package: {
              sources: [{ license: 'MIT' }, { license: 'GPLv2' }]
            }
          }
        }
      ])
      t.end()
    })
  })

  test('should get single licenses from single "licenses" property', t => {
    nlf.find({ directory: licensesStringDir }, (err, results) => {
      t.error(err)
      t.match(results, [
        {
          licenseSources: {
            package: {
              sources: [{ license: 'MIT' }]
            }
          }
        }
      ])
      t.end()
    })
  })

  test('gets license from project without name or version', t => {
    nlf.find({ directory: missingName }, (err, results) => {
      t.error(err)
      t.match(results, [
        {
          name: 'missing-name',
          id: 'missing-name@0.0.0',
          version: '0.0.0',
          licenseSources: {
            package: {
              sources: [{ license: 'MIT' }]
            }
          }
        }
      ])
      t.end()
    })
  })

  done()
})
