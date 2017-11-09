---
id: navigation
title: Navigation and Sidebars
---

## How Documents are Linked

New markdown files within `docs` will show up as pages on the website. Links to those documents are created first by using the `id` in the header of each document. If there is no `id` field, then the name of the file will serve as the link name.

For example, creating an empty file such as "docs/getting-started.md" will enable the new page URL as `/docs/getting-started.html`.

Suppose you add this to your document:

```
---
id: intro
title: Getting Started
---

My *new content* here..
```

If you set the `id` field in the markdown header of the file, the doc will then be accessed from a URL of the form `/docs/intro.html`.

> You need an `id` field to be able to add the document to the sidebar.

## Adding Documents to a Sidebar

Many times, you will want to add a document to a sidebar that will be associated with one of the headers in the top navigation bar of the website. The most common sidebar, and the one that comes installed when Docusaurus is initialized, is the `docs` sidebar.

> "docs" is just a name. It has no inherit meaning. You can change it as you wish.

You configure the contents of the sidebar, and the order of its documents, in the `website/sidebars.json` file.

> Until you add your document to `website/sidebars.json`, they will only be accessible via a direct URL. The doc will not show up in any sidebar.

Within `sidebars.json`, add the `id` you used in the document header to existing sidebar/category. In the below case, `docs` is the name of the sidebar and `Getting Started` is a category within the sidebar.

```
{
  "docs": {
    "Getting Started": [
      "getting-started"
```

Or you can create a new category within the sidebar:

```
{
  "docs": {
    ...
    "My New Sidebar Category": [
      "getting-started"
    ],
    ...
```

### Adding New Sidebars

You can also put a document in a new sidebar. In the following example, we are creating an `examples-sidebar` sidebar within `sidebars.json` that has a category called `My Example Category` containing a document with an `id` of `my-examples`.

```
{
  "examples-sidebar": {
    "My Example Category": [
      "my-examples"
    ],
  },
  ...
```

It is important to note that until you [add a document from the the `"examples-sidebar"` sidebar to the nav bar](#additions-to-the-site-navigation-bar), it will be hidden.

## Additions to the Site Navigation Bar

To expose sidebars, you will add clickable labels to the site navigation bar at the top of the website. You can add documents, pages and external links.

### Adding Documents

After creating a new sidebar for the site by [adding](#adding-new-sidebars) it to `sidebars.json`, you can expose the new sidebar from the top navigation bar by editing the `headerLinks` field of `siteConfig.js`.

```
headerLinks: [
  ...
  { doc: 'my-examples', label: 'Examples' },
  ...
],
```

A label called `Examples` will be added to the site navigation bar and when you click on it at the top of your site, the `examples-sidebar` will be shown and the default document will be `my-examples`.

### Adding Custom Pages

To add custom pages to the site navigation bar, entries can be added to the `headerLinks` of `siteConfig.js`. For example, if we have a page within `website/pages/help.js`, we can link to it by adding the following:

```
headerLinks: [
  ...
  { page: 'help', label: 'Help' },
  ...
],
```

A label called `Help` will be added to the site navigation bar and when you click on it at the top of your site, the content from the `help.js` page will be shown.

### Adding External Links

Custom links can be added to the site navigation bar with the following entry in `siteConfig.js`:

```
headerLinks: [
  ...
  { href: 'https://github.com/facebookexperimental/Docusaurus', label: 'GitHub' },
  ...
],
```

A label called `GitHub` will be added to the site navigation bar and when you click on it at the top of your site, the content of the external link will be shown.

> To open external links in a new tab, provide an `external: true` flag within the header link config.

## Site Navigation Bar Positioning

You have limited control where the search and languages dropdown elements are shown in the site navigation bar at the top of your website.

### Search

If search is enabled on your site, your search bar will appear to the right of your links. If you want to put the search bar between links in the header, add a search entry in the `headerLinks` config array:

```
headerLinks: [
  { doc: 'foo', label: 'Foo' },
  { search: true },
  { doc: 'bar', label: 'Bar' },
],
```

### Languages Dropdown

If translations is enabled on your site, the language dropdown will appear to the right of your links (and to the left of the search bar, if search is enabled). If you want to put the language selection drop down between links in the header, add a languages entry in the `headerLinks` config array:

```
headerLinks: [
  { doc: 'foo', label: 'Foo' },
  { languages: true },
  { doc: 'bar', label: 'Bar' },
],
```
