<h1 align="center"><code>fancy-value-parser</code> 💍</h1>

<p align="center">
  Parse fancy string values to JS objects.<br>
  <a href="https://www.npmjs.com/package/fancy-value-parser"><strong><code>fancy-value-parser</code> on npmjs.org »</strong></a>
</p>

## What?

Transform fancy string values to usable JS objects.  
Helpful for parsing HTML attribute values in custom elements/web components.

```js
import parseOption from 'fancy-value-parser'

parseOption('foo')       // { type: null, value: 'foo' }
parseOption('foo:666')   // { type: 'pair', foo: 666, value: [{⋯}, {⋯}] }
parseOption('0-42')      // { type: 'range', value: [0, 42] }
parseOption('true')      // { type: 'boolean', value: true }
parseOption('/foo/')     // { type: 'regex', value: /foo/ }
parseOption('{foo,bar}') // { type: 'set', value: [{⋯}, {⋯}] }
```

## In / Out

| in (as a string) | out (structured JS) |
| -- | --- |
| `foobar` | `{ type: null, value: 'foobar' }` |
| `'foobar'` | `{ type: 'string', value: 'foobar' }` |
| `/regex/` | `{ type: 'regex', value: /regex/ }` |
| `303` | `{ type: 'number', value: 303 }` |
| `3-5` | `{ type: 'range', value: [3, 5] }` |
| `true` | `{ type: 'boolean', value: true }` |
| `foo:bar` | `{ type: 'pair', foo: 'bar', value: [{⋯}, {⋯}] }` |
| `{1, /no[pe]/, 'foo'}` | `{ type: 'set', value: [{⋯}, {⋯}, {⋯}] }` |

Yes, various types can be combined with pairs and sets:

```
42:/baz/:{6-66:{qux, 'foo bar', false}}
```

I have no idea why you'd want this, but it's possible!

## Not yet supported

- ~~key-value pairs like `foo:bar`~~
- ~~booleans~~
- dates
- floating point numbers

~~I'm hesitant to support more complex types; at that point, the state being conveyed shouldn't be transported as strings.~~  
Clearly this ☝️ goal has been abandoned with the addition of pairs and sets. But there are good use cases and they are well tested.
