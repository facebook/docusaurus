---
id: migration-overview
title: Migration overview
slug: /migration
---

:::caution

For v1 translated sites, the migration doc is not available yet.

:::

This doc guides you through migrating an existing Docusaurus 1 site to Docusaurus 2.

We try to make this as easy as possible, and provide a migration cli.

## Docusaurus 1 structure {#docusaurus-1-structure}

Your Docusaurus 1 site should have the following structure:

```sh
├── docs
└── website
    ├── blog
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

## Docusaurus 2 structure {#docusaurus-2-structure}

After the migration, your Docusaurus 2 site could look like:

```sh
├── docs
└── website
    ├── blog
    ├── src
    │   ├── components
    │   ├── css
    │   └── pages
    ├── static
    ├── package.json
    ├── sidebars.json
    ├── docusaurus.config.js
```

:::info

This migration does not change the `/docs` folder location, but Docusaurus v2 sites generally have the `/docs` folder inside `/website`

You are free to put the `/docs` folder anywhere you want after having migrated to v2.

:::

## Migration process {#migration-process}

There are multiple things to migrate to obtain a fully functional Docusaurus 2 website:

- packages
- cli commands
- site configuration
- markdown files
- sidebars file
- pages, components and CSS
- versioned docs
- i18n support 🚧

## Automated migration process {#automated-migration-process}

The [migration cli](./migration-automated.md) will handle many things of the migration for you.

However, some parts can't easily be automated, and you will have to fallback to the manual process.

:::note

We recommend running the migration cli, and complete the missing parts thanks to the manual migration process.

:::

## Manual migration process {#manual-migration-process}

Some parts of the migration can't be automated (particularly the pages), and you will have to migrate them manually.

The [manual migration guide](./migration-manual.md) will give you all the manual steps.

## Support {#support}

For any questions, you can ask in the [`#docusaurus-1-to-2-migration` Discord channel](https://discordapp.com/invite/kYaNd6V).

Feel free to tag [@slorber](https://github.com/slorber) in any migration PRs if you would like us to have a look.

We also have volunteers willing to [help you migrate your v1 site](https://github.com/facebook/docusaurus/issues/1834).

## Example migration PRs {#example-migration-prs}

You might want to refer to our migration PRs for [Create React App](https://github.com/facebook/create-react-app/pull/7785) and [Flux](https://github.com/facebook/flux/pull/471) as examples of how a migration for a basic Docusaurus v1 site can be done.
