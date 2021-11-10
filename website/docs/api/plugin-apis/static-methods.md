---
sidebar_position: 4
---

# Static methods

Static methods are not part of the plugin instance—they are attached to the constructor function. These methods are used to validate and normalize the plugin options and theme config, which are then used to initialize the plugin as constructor parameters.

## `validateOptions({options, validate})` {#validateOptions}

Return validated and normalized options for the plugin. This method is called before the plugin is initialized.You must return options since the returned options will be passed to plugin during initialization.

### `options` {#options}

`validateOptions` is called with `options` passed to plugin for validation and normalization.

### `validate` {#validate}

`validateOptions` is called with `validate` function which takes a **[Joi](https://www.npmjs.com/package/joi)** schema and options as argument, returns validated and normalized options. `validate` will automatically handle error and validation config.

:::tip

[Joi](https://www.npmjs.com/package/joi) is recommended for validation and normalization of options.

To avoid mixing Joi versions, use `const {Joi} = require("@docusaurus/utils-validation")`

:::

If you don't use **[Joi](https://www.npmjs.com/package/joi)** for validation you can throw an Error in case of invalid options and return options in case of success.

```js {8-11} title="my-plugin/src/index.js"
function myPlugin(context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
}

myPlugin.validateOptions = ({options, validate}) => {
  const validatedOptions = validate(myValidationSchema, options);
  return validationOptions;
};

module.exports = myPlugin;
```

You can also use ES modules style exports.

```ts {8-11} title="my-plugin/src/index.ts"
export default function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
}

export function validateOptions({options, validate}) {
  const validatedOptions = validate(myValidationSchema, options);
  return validationOptions;
}
```

## `validateThemeConfig({themeConfig, validate})` {#validateThemeConfig}

Return validated and normalized configuration for the theme.

### `themeConfig` {#themeconfig}

`validateThemeConfig` is called with `themeConfig` provided in `docusaurus.config.js` for validation and normalization.

### `validate` {#validate-1}

`validateThemeConfig` is called with `validate` function which takes a **[Joi](https://www.npmjs.com/package/joi)** schema and `themeConfig` as argument, returns validated and normalized options. `validate` will automatically handle error and validation config.

:::tip

[Joi](https://www.npmjs.com/package/joi) is recommended for validation and normalization of theme config.

To avoid mixing Joi versions, use `const {Joi} = require("@docusaurus/utils-validation")`

:::

If you don't use **[Joi](https://www.npmjs.com/package/joi)** for validation you can throw an Error in case of invalid options.

```js {8-11} title="my-theme/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
};

module.exports.validateThemeConfig = ({themeConfig, validate}) => {
  const validatedThemeConfig = validate(myValidationSchema, options);
  return validatedThemeConfig;
};
```

You can also use ES modules style exports.

```ts {8-11} title="my-theme/src/index.ts"
export default function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
}

export function validateThemeConfig({themeConfig, validate}) {
  const validatedThemeConfig = validate(myValidationSchema, options);
  return validatedThemeConfig;
}
```
