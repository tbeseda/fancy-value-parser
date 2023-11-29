import assert from 'node:assert/strict'
import test from 'node:test'
import parseOption from '../index.js'

for (const option of [
  { actual: '1', expected: { type: 'number', value: 1 } },
  { actual: '42', expected: { type: 'number', value: 42 } },
  { actual: '1000', expected: { type: 'number', value: 1000 } },
  { actual: '42.666', expected: { type: 'number', value: 42 } },
  { actual: '2-4', expected: { type: 'range', value: [2, 4] } },
  { actual: '5-', expected: { type: 'range', value: [5, null] } },
  { actual: '6-66', expected: { type: 'range', value: [6, 66] } },
  { actual: "'strang'", expected: { type: 'string', value: 'strang' } },
  { actual: 'foo', expected: { type: null, value: 'foo' } },
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
]) {
  const { actual, expected } = option
  const parsed = parseOption(actual)

  test(`parseOption("${actual}")`, () => {
    assert.deepStrictEqual(
      parsed,
      expected,
    `parseOption(${actual}) should return ${JSON.stringify(expected)}, but got ${JSON.stringify(parsed)}`,
    )
  })
}
