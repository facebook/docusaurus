---
id: docusaurus-core
title: Docusaurus Client API
sidebar_label: Client API
---

Docusaurus provides some APIs on the clients that can be helpful to you when building your site.

## Components

### `<Head/>`

This reusable React component will manage all of your changes to the document head. It takes plain HTML tags and outputs plain HTML tags and is beginner-friendly. It is a wrapper around [React Helmet](https://github.com/nfl/react-helmet).

Usage Example:

```jsx {2,6,11}
import React from 'react';
import Head from '@docusaurus/Head';

const MySEO = () => (
  <>
    <Head>
      <meta property="og:description" content="My custom description" />
      <meta charSet="utf-8" />
      <title>My Title</title>
      <link rel="canonical" href="http://mysite.com/example" />
    </Head>
  </>
);
```

Nested or latter components will override duplicate usages:

```jsx {2,5,8,11}
<Parent>
  <Head>
    <title>My Title</title>
    <meta name="description" content="Helmet application" />
  </Head>

  <Child>
    <Head>
      <title>Nested Title</title>
      <meta name="description" content="Nested component" />
    </Head>
  </Child>
</Parent>
```

Outputs

```html
<head>
  <title>Nested Title</title>
  <meta name="description" content="Nested component" />
</head>
```

### `<Link/>`

This component enables linking to internal pages as well as a powerful performance feature called preloading. Preloading is used to prefetch resources so that the resources are fetched by the time the user navigates with this component. We use an `IntersectionObserver` to fetch a low-priority request when the `<Link>` is in the viewport and then use an `onMouseOver` event to trigger a high-priority request when it is likely that a user will navigate to the requested resource.

The component is a wrapper around react-router’s `<Link>` component that adds useful enhancements specific to Docusaurus. All props are passed through to react-router’s `<Link>` component.

```jsx {2,7}
import React from 'react';
import Link from '@docusaurus/Link';

const Page = () => (
  <div>
    <p>
      Check out my <Link to="/blog">blog</Link>!
    </p>
    <p>
      {/* Note that external links still use `a` tags, but automatically opens in new tab. */}
      Follow me on <a href="https://twitter.com/docusaurus">Twitter</a>!
    </p>
  </div>
);
```

#### `to`: string

The target location to navigate to. Example: `/docs/introduction`.

```jsx
<Link to="/courses" />
```

### `<Redirect/>`

Rendering a `<Redirect>` will navigate to a new location. The new location will override the current location in the history stack, like server-side redirects (HTTP 3xx) do. You can refer to [React Router's Redirect documentation](https://reacttraining.com/react-router/web/api/Redirect) for more info on available props.

Example usage:

```jsx {2,5}
import React from 'react';
import {Redirect} from '@docusaurus/router';

function Home() {
  return <Redirect to="/docs/test" />;
}
```

:::note

`@docusaurus/router` implements [React Router](https://reacttraining.com/react-router/web/guides/quick-start) and supports its features.

:::

### `<BrowserOnly/>`

The `<BrowserOnly>` component accepts a `children` prop, a render function which will not be executed during the pre-rendering phase of the build process. This is useful for hiding code that is only meant to run in the browsers (e.g. where the `window`/`document` objects are being accessed). To improve SEO, you can also provide fallback content using the `fallback` prop, which will be prerendered until in the build process and replaced with the client-side only contents when viewed in the browser.

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

function MyComponent() {
  return (
    <BrowserOnly
      fallback={<div>The fallback content to display on prerendering</div>}>
      {() => {
        // Something that should be excluded during build process prerendering.
      }}
    </BrowserOnly>
  );
}
```

## Hooks

### `useDocusaurusContext`

React hook to access Docusaurus Context. Context contains `siteConfig` object from [docusaurus.config.js](api/docusaurus.config.js.md), and some additional site metadata.

```ts
type DocusaurusPluginVersionInformation =
  | {readonly type: 'package'; readonly version?: string}
  | {readonly type: 'project'}
  | {readonly type: 'local'}
  | {readonly type: 'synthetic'};

interface DocusaurusSiteMetadata {
  readonly docusaurusVersion: string;
  readonly siteVersion?: string;
  readonly pluginVersions: Record<string, DocusaurusPluginVersionInformation>;
}

interface DocusaurusContext {
  siteConfig: DocusaurusConfig;
  siteMetadata: DocusaurusSiteMetadata;
}
```

Usage example:

```jsx {5,8,9}
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const MyComponent = () => {
  const {siteConfig, siteMetadata} = useDocusaurusContext();
  return (
    <div>
      <h1>{siteConfig.title}</h1>
      <div>{siteMetadata.siteVersion}</div>
      <div>{siteMetadata.docusaurusVersion}</div>
    </div>
  );
};
```

### `useBaseUrl`

React hook to automatically prepend `baseUrl` to a string automatically. This is particularly useful if you don't want to hardcode your config's `baseUrl`. We highly recommend you to use this.

```ts
type BaseUrlOptions = {
  forcePrependBaseUrl: boolean;
  absolute: boolean;
};
```

Example usage:

```jsx {3,11}
import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Help() {
  return (
    <div className="col">
      <h2>Browse the docs</h2>
      <p>
        Learn more about Docusaurus using the{' '}
        <Link to={useBaseUrl('docs/introduction')}>official documentation</Link>
      </p>
    </div>
  );
}
```

### `useBaseUrlUtils`

Sometimes `useBaseUrl` is not good enough. This hook return additional utils related to your site's base url.

- `withBaseUrl`: useful if you need to add base urls to multiple urls at once

```jsx {2,5,6,7}
import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

function Component() {
  const urls = ['/a', '/b'];
  const {withBaseUrl} = useBaseUrlUtils();
  const urlsWithBaseUrl = urls.map(withBaseUrl);
  return <div className="col">{/* ... */}</div>;
}
```

### `useGlobalData()`

React hook to access Docusaurus global data created by all the plugins.

Global data is namespaced by plugin name, and plugin id.

:::info

Plugin id is only useful when a plugin is used multiple times on the same site. Each plugin instance is able to create its own global data.

:::

```ts
type GlobalData = Record<
  PluginName,
  Record<
    PluginId, // "default" by default
    any // plugin-specific data
  >
>;
```

Usage example:

```jsx {2,5,6,7}
import React from 'react';
import useGlobalData from '@docusaurus/useGlobalData';

const MyComponent = () => {
  const globalData = useDocusaurusContext();
  const myPluginData = globalData['my-plugin']['default'];
  return <div>{myPluginData.someAttribute}</div>;
};
```

:::tip

Inspect your site's global data at `./docusaurus/globalData.json`

:::

### `usePluginData(pluginName: string, pluginId?: string)`

Access global data created by a specific plugin instance.

This is the most convenient hook to access plugin global data, and should be used most of the time.

`pluginId` is optional if you don't use multi-instance plugins.

Usage example:

```jsx {2,5,6}
import React from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';

const MyComponent = () => {
  const myPluginData = usePluginData('my-plugin');
  return <div>{myPluginData.someAttribute}</div>;
};
```

### `useAllPluginInstancesData(pluginName: string)`

Access global data created by a specific plugin. Given a plugin name, it returns the data of all the plugins instances of that name, by pluginId.

Usage example:

```jsx {2,5,6,7}
import React from 'react';
import {useAllPluginInstancesData} from '@docusaurus/useGlobalData';

const MyComponent = () => {
  const allPluginInstancesData = useAllPluginInstancesData('my-plugin');
  const myPluginData = allPluginInstancesData['default'];
  return <div>{myPluginData.someAttribute}</div>;
};
```

## Modules

### `ExecutionEnvironment`

A module which exposes a few boolean variables to check the current rendering environment. Useful if you want to only run certain code on client/server or need to write server-side rendering compatible code.

```jsx {2}
import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function MyPage() {
  const location = ExecutionEnvironment.canUseDOM ? window.location.href : null;
  return <div>{location}</div>;
}
```

| Field | Description |
| --- | --- |
| `ExecutionEnvironment.canUseDOM` | `true` if on client, `false` if prerendering. |
| `ExecutionEnvironment.canUseEventListeners` | `true` if on client and has `window.addEventListener`. |
| `ExecutionEnvironment.canUseIntersectionObserver` | `true` if on client and has `IntersectionObserver`. |
| `ExecutionEnvironment.canUseViewport` | `true` if on client and has `window.screen`. |
