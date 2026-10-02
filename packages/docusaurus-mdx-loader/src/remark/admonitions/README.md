# Docusaurus admonitions

Code from [remark-admonitions](https://github.com/elviswolcott/remark-admonitions) (MIT license) has been copied to this folder, and highly customized for Docusaurus needs.

Admonitions compile to `<Admonition type="note" title={...}>...</Admonition>`. The theme provides `Admonition` through `@theme/MDXComponents`. Custom MDX component mappings should use `Admonition` instead of the legacy `admonition` key. Markdown syntax and the `@theme/Admonition` props remain unchanged.

Rich titles temporarily remain in the syntax tree as marked JSX fragments so that remark and rehype plugins can process their content. The final `rehype/admonitionTitle` plugin moves each fragment into the `title` prop, after user plugins have run. No title wrapper element is emitted at runtime.
