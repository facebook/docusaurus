# Default theme translations

The Docusaurus theme includes default translations for labels used by the theme itself (like the pagination "Next" / "Previous").

## For Docusaurus users:

Please help us provide exhaustive translations:

- add your `language.json` file if it is missing (copy `base.json` and remove the attributes `___DESCRIPTION`)
- double-check your `language.json` file for bad or missing translations

## For maintainers:

After updating the theme code, you can "synchronize" the translations by running:

```
yarn workspace @docusaurus/theme-classic update-code-translations
```

Then, ask contributors to translate the newly added labels on this [issue](https://github.com/facebook/docusaurus/issues/3526)
