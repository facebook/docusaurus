---
id: 'docusaurus_theme_common_lib.ReactContextError'
title: 'Class: ReactContextError'
sidebar_label: 'ReactContextError'
custom_edit_url: null
---

[docusaurus-theme-common/lib](../modules/docusaurus_theme_common_lib.md).ReactContextError

This error is thrown when a context is consumed outside its provider. Allows reusing a generic error message format and reduces bundle size. The hook's name will be extracted from its stack, so only the provider's name is needed.

## Hierarchy

- `Error`

  ↳ **`ReactContextError`**

## Constructors

### constructor

• **new ReactContextError**(`providerName`, `additionalInfo?`)

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `providerName`    | `string` |
| `additionalInfo?` | `string` |

#### Overrides

Error.constructor

#### Defined in

packages/docusaurus-theme-common/lib/utils/reactUtils.d.ts:40
