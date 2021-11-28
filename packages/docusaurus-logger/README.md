# `@docusaurus/logger`

An encapsulated logger for semantically formatting console messages.

## APIs

It exports a single object as default export: `logger`. `logger` has the following properties:

- All fields of `picocolors`. This includes `yellow`, `createColors`, `isColorSupported`, etc.
- Formatters. These functions have the same signature as the formatters of `picocolors`. Note that their implementations are not guaranteed. You should only care about their semantics.
  - `path`: formats a file path or URL.
  - `id`: formats an identifier.
  - `code`: formats a code snippet.
  - `subdue`: subdues the text.
  - `num`: formats a number.
- The `interpolate` function. It is a template literal tag.
- Logging functions. All logging functions can both be used as functions (in which it has the same usage as `console.log`) or template literal tags.
  - `info`: prints information.
  - `warn`: prints a warning that should be payed attention to.
  - `error`: prints an error (not necessarily halting the program) that signals significant problems.
  - `success`: prints a success message.

### Using the template literal tag

The template literal tag evaluates the template and expressions embedded. `interpolate` returns a new string, while other logging functions prints it. Below is a typical usage:

```js
logger.info`Hello %i${name}! You have %n${money} dollars. Here are the ${
  items.length > 1 ? 'items' : 'item'
} on the shelf: ${items}`;
```

An embedded expression is optionally preceded by a flag in the form `%[a-z]+` (a percentage sign followed by a few lowercase letters). The expression is first casted to a string—if it's an array, it's formatted by `` `\n- ${array.join('\n- ')}\n` `` (note it automatically gets line ends on both ends). If it's not preceded by any flag, it's printed out as-is. Otherwise, it's formatted with one of the formatters:

- `%p`: `path`
- `%i`: `id`
- `%c`: `code`
- `%s`: `subdue`
- `%n`: `num`

So you would see the above message printed as:

![demo](./demo.png)
