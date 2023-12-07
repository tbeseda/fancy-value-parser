export const T = {
  string: 'string',
  regex: 'regex',
  number: 'number',
  range: 'range',
  pair: 'pair',
  set: 'set',
  null: null,
}

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

  // pairs always handled first
  if (option.includes(':')) {
    const [k = null, v = null] = option.split(/:(.*)/s)
    const parsedKey = k ? parseOption(k) : null
    const parsedVal = v ? parseOption(v) : null

    type = 'pair'
    value = [parsedKey, parsedVal]

    let pairKey = null
    if (parsedKey) {
      if ([T.number, T.string].includes(parsedKey.type)) {
        pairKey = parsedKey.value
      } else {
        pairKey = k
      }
    }
    let pairVal = null
    if (parsedVal) {
      if ([T.number, T.string, T.regex].includes(parsedVal.type)) {
        pairVal = parsedVal.value
      } else {
        pairVal = v
      }
    }

    return {
      type,
      value,
      [pairKey]: pairVal,
    }
  }

  switch (firstChar) {
    case "'":
      type = T.string
      value = option.substring(1, option.length - 1)
      break
    case '/':
      type = T.regex
      value = new RegExp(option.substring(1, option.length - 1))
      break
    case '{':
      type = T.set
      value = option.substring(1, option.length - 1)
        .split(',')
        .map(item => item.trim())
        .map(parseOption)
      break
    default: {
      const n = Number(firstChar)
      if (isNaN(n)) {
        type = T.null // untyped is fine
        value = option
      } else if (option.includes('-')) {
        const [start, end] = option.split('-')
        type = T.range
        value = [parseInt(start), parseInt(end) || null]
      } else {
        type = T.number
        value = parseInt(option)
      }
      break
    }
  }

  return { type, value }
}
