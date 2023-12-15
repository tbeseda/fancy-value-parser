import assert from 'node:assert/strict'
import test from 'node:test'
import parseOption from '../index.js'

for (const { actual, expected } of [
  { actual: "'foobar'", expected: { type: 'string', value: 'foobar' } },
  { actual: 'baz', expected: { type: null, value: 'baz' } },
  { actual: '1', expected: { type: 'number', value: 1 } },
  { actual: '42', expected: { type: 'number', value: 42 } },
  { actual: '1000', expected: { type: 'number', value: 1000 } },
  { actual: '42.666', expected: { type: 'number', value: 42 } },
  { actual: 'true', expected: { type: 'boolean', value: true } },
  { actual: 'false', expected: { type: 'boolean', value: false } },
  { actual: '2-4', expected: { type: 'range', value: [2, 4] } },
  { actual: '5-', expected: { type: 'range', value: [5, null] } },
  { actual: '6-66', expected: { type: 'range', value: [6, 66] } },
  { actual: '/regex/', expected: { type: 'regex', value: /regex/ } },
  {
    actual: '{2}',
    expected: {
      type: 'set',
      value: [{ type: 'number', value: 2 }],
    },
  },
  {
    actual: "{/foo/,1000 ,'str ings', 5-7 }",
    expected: {
      type: 'set',
      value: [
        { type: 'regex', value: /foo/ },
        { type: 'number', value: 1000 },
        { type: 'string', value: 'str ings' },
        { type: 'range', value: [5, 7] },
      ],
    },
  },
  {
    actual: 'foo:bar',
    expected: {
      type: 'pair',
      value: [
        { type: null, value: 'foo' },
        { type: null, value: 'bar' },
      ],
      foo: 'bar',
    },
  },
  {
    actual: 'foo:',
    expected: {
      type: 'pair',
      value: [
        { type: null, value: 'foo' },
        null,
      ],
      foo: null,
    },
  },
  {
    actual: ':bar',
    expected: {
      type: 'pair',
      value: [
        null,
        { type: null, value: 'bar' },
      ],
      null: 'bar',
    },
  },
  {
    actual: "'foobar':42",
    expected: {
      type: 'pair',
      value: [
        { type: 'string', value: 'foobar' },
        { type: 'number', value: 42 },
      ],
      foobar: 42,
    },
  },
  {
    actual: '666:/baz/',
    expected: {
      type: 'pair',
      value: [
        { type: 'number', value: 666 },
        { type: 'regex', value: /baz/ },
      ],
      666: /baz/,
    },
  },
  {
    actual: '/baz/:6-66',
    expected: {
      type: 'pair',
      value: [
        { type: 'regex', value: /baz/ },
        { type: 'range', value: [6, 66] },
      ],
      '/baz/': '6-66',
    },
  },
  {
    actual: 'foo:bar:baz',
    expected: {
      type: 'pair',
      value: [
        { type: null, value: 'foo' },
        {
          type: 'pair',
          value: [
            { type: null, value: 'bar' },
            { type: null, value: 'baz' },
          ],
          bar: 'baz',
        },
      ],
      foo: 'bar:baz',
    },
  },
  {
    actual: "42:6-66:'foo bar':/baz/",
    expected: {
      type: 'pair',
      value: [
        { type: 'number', value: 42 },
        {
          type: 'pair',
          value: [
            { type: 'range', value: [6, 66] },
            {
              type: 'pair',
              value: [
                { type: 'string', value: 'foo bar' },
                { type: 'regex', value: /baz/ },
              ],
              'foo bar': /baz/,
            },
          ],
          '6-66': "'foo bar':/baz/",
        },
      ],
      42: "6-66:'foo bar':/baz/",
    },
  },
  {
    actual: '{foo,bar:baz}',
    expected: {
      type: 'set',
      value: [
        { type: null, value: 'foo' },
        {
          type: 'pair',
          value: [
            { type: null, value: 'bar' },
            { type: null, value: 'baz' },
          ],
          bar: 'baz',
        },
      ],
    },
  },
  {
    actual: 'foo:{bar,baz}',
    expected: {
      type: 'pair',
      value: [
        { type: null, value: 'foo' },
        {
          type: 'set',
          value: [
            { type: null, value: 'bar' },
            { type: null, value: 'baz' },
          ],
        },
      ],
      foo: '{bar,baz}',
    },
  },
  {
    actual: '{foobar,baz}:qux',
    expected: {
      type: 'pair',
      value: [
        {
          type: 'set',
          value: [
            { type: null, value: 'foobar' },
            { type: null, value: 'baz' },
          ],
        },
        { type: null, value: 'qux' },
      ],
      '{foobar,baz}': 'qux',
    },
  },
]) {
  const parsed = parseOption(actual)

  test(`parseOption("${actual}")`, () => {
    assert.deepStrictEqual(
      parsed,
      expected,
      sideBySide(
        ['EXPECTED', JSON.stringify(expected, null, 2)],
        ['ACTUAL', JSON.stringify(parsed, null, 2)],
      ),
    )
  })
}

/**
 * @param {[string, string]} col1
 * @param {[string, string]} col2
 * @returns {string}
 */
function sideBySide ([label1, string1], [label2, string2]) {
  const ls1 = string1.split('\n')
  const ls2 = string2.split('\n')
  const w1 = Math.max(
    label1.length,
    ls1.reduce((acc, cur) => Math.max(acc, cur.length), 0),
  )
  const w2 = Math.max(
    label2.length,
    ls2.reduce((acc, cur) => Math.max(acc, cur.length), 0),
  )

  const zipped = Array.from(
    Array(Math.max(ls1.length, ls2.length)),
    (_, i) => [ls1[i], ls2[i]],
  )

  const PAD = '  '
  const LINE = '─'
  const BAR = '│'
  const CROSS = '┼'
  const header1 = [
    PAD,
    label1,
    ' '.repeat(w1 - label1.length),
  ].join('')

  return `
${[header1, BAR, label2].join(PAD)}
${[
  LINE.repeat(header1.length + PAD.length),
  LINE.repeat(w2 + (PAD.length * 2)),
].join(CROSS)}
${zipped.map(([l1 = '', l2 = '']) => [
  PAD,
  l1,
  ' '.repeat(w1 - l1.length),
  PAD, BAR, PAD,
  l2,
].join('')).join('\n')}`
}
