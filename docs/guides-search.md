---
id: search
title: Enabling Search
---

Docusaurus supports search using [Algolia DocSearch](https://community.algolia.com/docsearch/). Once your website is online, you can [submit it to DocSearch](https://community.algolia.com/docsearch/). Algolia will then send you credentials you can add to your `siteConfig.js`.

DocSearch works by crawling the content of your website every 24 hours and putting all the content in an Algolia index. This content is then queried directly from your front-end using the Algolia API. Note that your website need to be publicly available for this to work (ie. not behind a firewall). This service is free.

## Enabling the Search Bar

Enter your API key and index name (sent by Algolia) into `siteConfig.js` in the `algolia` section to enable search for your site.

```js
const siteConfig = {
  ...
  algolia: {
    apiKey: 'my-api-key',
    indexName: 'my-index-name',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
  ...
};
```

## Extra Search Options

You can also specify extra [search options used by Algolia](https://community.algolia.com/docsearch/documentation/) by using an `algoliaOptions` field in `algolia`. This may be useful if you want to provide different search results for the different versions or languages of your docs. Any occurrences of "VERSION" or "LANGUAGE" will be replaced by the version or language of the current page, respectively. More details about search options can be [found here](https://www.algolia.com/doc/api-reference/api-parameters/#overview).	

```js	
const siteConfig = {	
  ...	
  algolia: {	
    ...	
    algoliaOptions: {	
      facetFilters: [ "language:LANGUAGE", "version:VERSION" ] 
    }	
  },	
};	
```

Algolia might provide you with [extra search options](https://community.algolia.com/docsearch/documentation/). If so, you should add them to the `algoliaOptions` object.

## Controlling the Location of the Search Bar

By default, the search bar will be the rightmost element in the top navigation bar.

If you want to change the default location, add the `searchBar` flag in the `headerLinks` field of `siteConfig.js` in your desired location. For example, you may want the search bar between your internal and external links.

```js
const siteConfig = {
  ...
  headerLinks: [
    {...}
    {...}
    { search: true }
    {...}
    {...}
  ],
  ...
};
```

## Customizing the placeholder

If you want to change the placeholder (which defaults to *Search*), add the `placeholder` field in your config. For example, you may want the search bar to display *Ask me something*:

```js
const siteConfig = {	
  ...	
  algolia: {	
    ...	
    placeholder: 'Ask me something'
  },	
};	
```

## Disabling the Search Bar

To disable the search bar, comment out (recommended) or delete the `algolia` section in the `siteConfig.js` file.

Also, if you have customized the location of the search bar in `headerLinks`, set `search: false`.
