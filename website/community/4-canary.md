# Canary releases

Docusaurus has a canary releases system.

It permits you to **test new unreleased features** as soon as the pull-requests are merged.

It is a good way to **give feedback to maintainers**, ensuring the newly implemented feature works as intended.

:::note

Using a canary release in production might seem risky, but in practice it's not.

A canary release passes all automated tests, and is used in production by the Docusaurus site itself.

:::

## Canary npm dist tag

For any code-related commit on `master`, the continuous integration will publish a canary release under the `@canary` npm dist tag. It generally takes up to 10 minutes.

You can see on [npm](https://www.npmjs.com/package/@docusaurus/core?activeTab=versions) the current dist tags:

- `latest`: stable releases (example: `2.0.0-beta.0`)
- `canary`: canary releases (example: `2.0.0-beta.4a6de5cf7`)

:::tip

Make sure to use the latest canary release and check the publication date (sometimes the publish process fails).

:::

## Using a canary release

Take the latest version published under the [canary npm dist tag](https://www.npmjs.com/package/@docusaurus/core?activeTab=versions) (for example: `2.0.0-beta.4a6de5cf7`).

Use it for all the `@docusaurus/*` dependencies in your `package.json`:

```diff
-  "@docusaurus/core": "^2.0.0-beta.0",
-  "@docusaurus/preset-classic": "^2.0.0-beta.0",
+  "@docusaurus/core": "2.0.0-beta.4a6de5cf7",
+  "@docusaurus/preset-classic": "2.0.0-beta.4a6de5cf7",
```

Then, install the dependencies again and start your site:

```bash npm2yarn
npm install
npm start
```

You can also upgrade the `@docusaurus/*` packages with a command line:

```bash npm2yarn
npm install --save-exact @docusaurus/core@canary @docusaurus/preset-classic@canary
```

:::caution

Make sure to include all the `@docusaurus/*` packages.

For canary releases, prefer using an exact version instead of a semver range (avoid the `^` prefix).

:::
