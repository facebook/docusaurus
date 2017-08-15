---
id: navigation
title: Navigation and Sidebars
---

## New Hidden Docs

New markdown files within `docs` will show up as pages on the website. Creating a file such as "docs/getting-started.md" will enable the new page `/docs/getting-started.html`.

To change the id (link name) of the file, set the `id` field in the markdown header. At the top of `getting-started.md`:

```
---
id: intro
title: Getting Started
---

My *new content* here..
```

Now, the doc can be accessed from `/docs/intro.html`.


## Adding Docs to a Sidebar

Now we want our new page to show up on the sidebar. We configure the order of the sidebar in `website/sidebars.json`.

Within `sidebars.json`, add the doc ID within an existing sidebar/category:

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

## New Hidden Sections

You can also put the doc in a new sidebar. In this case we are creating a `intro` section within `sidebars.json`.

```
{
  "intro": {
    "My Sidebar Category": [
      "getting-started"
    ],
  },
  ...
```

Keep in mind, until you add the section to the nav bar (below), this new "intro" section of the site will be hidden with no links going to it.



## Adding doc to site nav bar

After creating a new section of the site by adding to `sidebars.json`, you can link to the new doc from the top navigation bar by editing the `headerLinks` field of `siteConfig.js`.

```
headerLinks: [
  ...
  { doc: 'intro', label: 'Getting Started' },
  ...
],
```

## Custom page links in nav bar

To add custom pages to the navigation bar, entries can be added to the `headerLinks` of `siteConfig.js`. For example, if we have a page within `website/pages/help.js`, we can link to it by adding the following:

```
headerLinks: [
  ...
  { page: 'help', label: 'Help' },
  ...
],
```

## External links in nav bar

Custom links can be added to the nav bar with the following entry in `siteConfig.js`:

```
headerLinks: [
  ...
  { href: 'https://github.com/facebookexperimental/Docusaurus', label: 'GitHub' },
  ...
],
```

To open external links in a new tab, provide an `external: true` flag within the header link config.

## Search bar position in nav bar

If search is enabled on your site, your search bar will appear to the right of your links. If you want to put the search bar between links in the header, add a search entry in the `headerLinks` config array:

```
headerLinks: [
  { doc: 'foo', label: 'Foo' },
  { search: true },
  { doc: 'bar', label: 'Bar' },
],
```
## Languages drop down position in nav bar

If translations is enabled on your site, the language drop down will appear to the right of your links (and to the left of the search bar, if search is enabled). If you want to put the language selection drop down between links in the header, add a languages entry in the `headerLinks` config array:

```
headerLinks: [
  { doc: 'foo', label: 'Foo' },
  { languages: true },
  { doc: 'bar', label: 'Bar' },
],
```
