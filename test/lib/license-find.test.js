'use strict'

const tap = require('tap')
const { licenseFind } = require('../..')

tap.test('is a function', async t => {
  t.type(licenseFind, Function)
})

tap.test('dual GPL & MIT', async ({ test }) => {
  test('returns both', async t => {
    const output = licenseFind('blah MIT blah\n\nblah GPL blah')
    t.deepEqual(output, ['GPL', 'MIT'])
  })
})

tap.test('GPL', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah GPL blah')
    t.deepEqual(output, ['GPL'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('GPL blah')
    t.deepEqual(output, ['GPL'])
  })
})

tap.test('LGPL', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah LGPL blah')
    t.deepEqual(output, ['LGPL'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('LGPL blah')
    t.deepEqual(output, ['LGPL'])
  })
})

tap.test('GPLvx', async ({ test }) => {
  test('can be found within license body', async t => {
    let output = licenseFind('blah GPLv2 blah')
    t.deepEqual(output, ['GPL'])

    output = licenseFind('blah GPL-3.0')
    t.deepEqual(output, ['GPL'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('GPLv2 blah')
    t.deepEqual(output, ['GPL'])
  })
})

tap.test('MIT', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah MIT blah')
    t.deepEqual(output, ['MIT'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('MIT blah')
    t.deepEqual(output, ['MIT'])
  })
})

tap.test('(MIT)', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah (MIT) blah')
    t.deepEqual(output, ['MIT'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('(MIT) blah')
    t.deepEqual(output, ['MIT'])
  })
})

tap.test('MPL', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah MPL blah')
    t.deepEqual(output, ['MPL'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('MPL blah')
    t.deepEqual(output, ['MPL'])
  })
})

tap.test('Apache', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah Apache\nLicense blah')
    t.deepEqual(output, ['Apache'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('Apache\nLicense blah')
    t.deepEqual(output, ['Apache'])
  })
})

tap.test('ISC', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah ISC blah')
    t.deepEqual(output, ['ISC'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('ISC blah')
    t.deepEqual(output, ['ISC'])
  })
})

tap.test('BSD', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah BSD blah')
    t.deepEqual(output, ['BSD'])
  })

  test('can be found at start of license body', async t => {
    const output = licenseFind('BSD blah')
    t.deepEqual(output, ['BSD'])
  })
})

tap.test('Eclipse Public License', async ({ test }) => {
  test('can be found within the license body', async t => {
    let output = licenseFind('blah Eclipse Public License blah')
    t.deepEqual(output, ['Eclipse Public License'])

    output = licenseFind('blah EPL blah')
    t.deepEqual(output, ['Eclipse Public License'])

    output = licenseFind('blah EPL-1.0 blah')
    t.deepEqual(output, ['Eclipse Public License'])
  })

  test('can be found at the start license body', async t => {
    let output = licenseFind('Eclipse Public License blah')
    t.deepEqual(output, ['Eclipse Public License'])

    output = licenseFind('EPL blah')
    t.deepEqual(output, ['Eclipse Public License'])

    output = licenseFind('EPL-1.0 blah')
    t.deepEqual(output, ['Eclipse Public License'])
  })
})

tap.test('WTFPL', async ({ test }) => {
  test('can be found within license body', async t => {
    const output = licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah')
    t.deepEqual(output, ['WTFPL'])
  })

  test('can be found at the start of license body', async t => {
    const output = licenseFind('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah')
    t.deepEqual(output, ['WTFPL'])
  })

  test('ignores case', async t => {
    const output = licenseFind('dO WHAT the fUck you want tO PUBLIC licensE blah')
    t.deepEqual(output, ['WTFPL'])
  })

  test('finds British spelling', async t => {
    const output = licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE blah')
    t.deepEqual(output, ['WTFPL'])
  })
})
