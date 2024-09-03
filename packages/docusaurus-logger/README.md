# `@docusaurus/logger`

An encapsulated logger for semantically formatting console messages.

## APIs

It exports a single object as default export: `logger`. `logger` has the following properties:

- Some useful colors.
  - `red`
  - `yellow`
  - `green`
  - `bold`
  - `dim`
- Formatters. These functions all have the signature `(msg: unknown) => string`. Note that their implementations are not guaranteed. You should only care about their semantics.
  - `path`: formats a file path.
  - `url`: formats a URL.
  - `name`: formats an identifier.
  - `code`: formats a code snippet.
  - `subdue`: subdues the text.
  - `num`: formats a number.
- The `interpolate` function. It is a template literal tag. The syntax can be found below.
- Logging functions. All logging functions can both be used as normal functions (similar to the `console.log` family, but only accepts one parameter) or template literal tags.
  - `info`: prints information.
  - `warn`: prints a warning that should be paid attention to.
  - `error`: prints an error (not necessarily halting the program) that signals significant problems.
  - `success`: prints a success message.
- The `report` function. It takes a `ReportingSeverity` value (`ignore`, `log`, `warn`, `throw`) and reports a message according to the severity.

### A word on the `error` formatter

Beware that an `error` message, even when it doesn't hang the program, is likely going to cause confusion. When users inspect logs and find an `[ERROR]`, even when the build succeeds, they will assume something is going wrong. Use it sparingly.

Docusaurus only uses `logger.error` when printing messages immediately before throwing an error, or when user has set the reporting severity of `onBrokenLink`, etc. to `"error"`.

In addition, `warn` and `error` will color the **entire** message for better attention. If you are printing large blocks of help text about an error, better use `logger.info`.

### Using the template literal tag

The template literal tag evaluates the template and expressions embedded. `interpolate` returns a new string, while other logging functions prints it. Below is a typical usage:

```js
import logger from '@docusaurus/logger';

logger.info`Hello name=${name}! You have number=${money} dollars. Here are the ${
  items.length > 1 ? 'items' : 'item'
} on the shelf: ${items}
To buy anything, enter code=${'buy x'} where code=${'x'} is the item's name; to quit, press code=${'Ctrl + C'}.`;
```

An embedded expression is optionally preceded by a flag in the form `[a-z]+=` (a few lowercase letters, followed by an equals sign, directly preceding the embedded expression). If the expression is not preceded by any flag, it's printed out as-is. Otherwise, it's formatted with one of the formatters:

- `path=`: `path`
- `url=`: `url`
- `name=`: `name`
- `code=`: `code`
- `subdue=`: `subdue`
- `number=`: `num`

If the expression is an array, it's formatted by `` `\n- ${array.join('\n- ')}\n` `` (note it automatically gets a leading line end). Each member is formatted by itself and the bullet is not formatted. So you would see the above message printed as:

![Some text output in the terminal, containing array, code, name, and number formatting](./demo.png)
