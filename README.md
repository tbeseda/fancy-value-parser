<h1 align="center"><code>fancy-value-parser</code> 💍</h1>

<p align="center">
  Parse fancy string values to JS objects.<br>
  <a href="https://www.npmjs.com/package/fancy-value-parser"><strong><code>fancy-value-parser</code> on npmjs.org »</strong></a>
</p>

## What?

Transform fancy string values to usable JS objects.  
Helpful for parsing HTML attribute values in custom elements/web components.

## In / Out

| in (string) | out (JS) |
| -- | --- |
| `'foobar'` | `{ type: 'string', value: 'foobar' }` |
| `303` | `{ type: 'number', value: 303 }` |
| `3-5` | `{ type: 'range', value: [3, 5] }` |
| `/regex/` | `{ type: 'regex', value: /regex/ }` |
| `{1, /no[pe]/, 'foo'}` | `{ type: 'set', value: [{}, {}, {}] }` |
| `foobar` | `{ type: null, value: 'foobar' }` |

## Not yet supported

- key-value pairs like `foo:bar`
- booleans
- dates
- floating point numbers

I'm hesitant to support more complex types; at that point, the state being conveyed shouldn't be transported as strings.
