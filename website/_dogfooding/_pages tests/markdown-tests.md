# Markdown tests

This is a test page to see if Docusaurus Markdown features are working properly

## Linking to assets

See [#3337](https://github.com/facebook/docusaurus/issues/3337)

- [/someFile.pdf](/someFile.pdf)

- [/someFile.xyz](/someFile.xyz)

- [@site/\_dogfooding/\_asset-tests/someFile.pdf](@site/_dogfooding/_asset-tests/someFile.pdf)

- [@site/\_dogfooding/\_asset-tests/someFile.xyz](@site/_dogfooding/_asset-tests/someFile.xyz)

## Linking to non-SPA page hosted within website

See [#3309](https://github.com/facebook/docusaurus/issues/3309)

- [pathname:///dogfooding/javadoc](pathname:///dogfooding/javadoc)

- [pathname:///dogfooding/javadoc/index.html](pathname:///dogfooding/javadoc/index.html)

- [pathname://../dogfooding/javadoc](pathname://../dogfooding/javadoc)

- [pathname://../dogfooding/javadoc/index.html](pathname://../dogfooding/javadoc/index.html)

## Linking to JSON

- [./script.js](./_script.js)

- [./data.json](./data.json)
