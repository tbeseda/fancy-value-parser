/**
 * @param {string} option
 * @returns {Record<string, any>}
 */
export default function parseOption (option) {
  /*
    option is a string representation of:
    ╰─ a string "'string'",
    ╰─ a number "42",
    ╰─ a number range "6-66",
    ╰─ a regex "/regex/",
    ╰─ an unknown value "foo",
    ╰─ or a set of values "{}"
    a set can be
    ╰─ a single value "{2}"
    ╰─ or a (janky) comma separated list of values:
       ╰─ "{/foo/,1 ,'str ings', 5-7 }"
   */

  if (typeof option !== 'string') {
    throw new TypeError(`Expected string, got ${typeof option}`)
  }

  const firstChar = option.charAt(0)
  let type
  let value

  if (option.includes(':')) {
    const [k = null, v = null] = option.split(/:(.*)/s)
    const parsedKey = k ? parseOption(k) : null
    const parsedVal = v ? parseOption(v) : null

    type = 'pair'
    value = [parsedKey, parsedVal]

    const pair = {}
    const pairKey = parsedKey?.value || null
    const pairVal = (parsedVal?.value?.value)
      ? v || null
      : parsedVal?.value || null
    pair[pairKey] = pairVal

    return {
      type,
      value,
      ...pair,
    }
  }

  switch (firstChar) {
    case "'":
      type = 'string'
      value = option.substring(1, option.length - 1)
      break
    case '/':
      type = 'regex'
      value = new RegExp(option.substring(1, option.length - 1))
      break
    case '{':
      type = 'set'
      value = option.substring(1, option.length - 1)
        .split(',')
        .map(item => item.trim())
        .map(parseOption)
      break
    default: {
      const n = Number(firstChar)
      if (isNaN(n)) {
        type = null // untyped is fine
        value = option
      } else if (option.includes('-')) {
        const [start, end] = option.split('-')
        type = 'range'
        value = [parseInt(start), parseInt(end) || null]
      } else {
        type = 'number'
        value = parseInt(option)
      }
      break
    }
  }

  return { type, value }
}
