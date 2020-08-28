# Markdown tests

This is a test page to see if Docusaurus markdown features are working properly

## Linking to assets

See [#3337](https://github.com/facebook/docusaurus/issues/3337)

- [/dogfooding/someFile.pdf](/dogfooding/someFile.pdf)

- [/dogfooding/someFile.xyz](/dogfooding/someFile.xyz)

- [../../static/dogfooding/someFile.pdf](../../static/dogfooding/someFile.pdf)

- [../../static/dogfooding/someFile.xyz](../../static/dogfooding/someFile.xyz)

- [@site/static/dogfooding/someFile.pdf](@site/static/dogfooding/someFile.pdf)

- [@site/static/dogfooding/someFile.xyz](@site/static/dogfooding/someFile.xyz)

## Linking to non-SPA page hosted within website

See [#3309](https://github.com/facebook/docusaurus/issues/3309)

- [pathname:///dogfooding/javadoc](pathname:///dogfooding/javadoc)

- [pathname:///dogfooding/javadoc/index.html](pathname:///dogfooding/javadoc/index.html)

- [pathname://../dogfooding/javadoc](pathname://../dogfooding/javadoc)

- [pathname://../dogfooding/javadoc/index.html](pathname://../dogfooding/javadoc/index.html)
