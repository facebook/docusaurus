# Routing

This page is only accessible through version-switching. It shows how a versioned doc file becomes a webpage.

```mdx-code-block
import {useLatestVersion, useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';

export const URLPath = () => <code>{useLocation().pathname}</code>;

export const FilePath = () => {
  const currentVersion = useActiveDocContext('default').activeVersion.name;
  return <code>{currentVersion === 'current' ? './docs/' : `./versioned_docs/version-${currentVersion}/`}advanced/routing.md</code>;
}
```

This page, <URLPath />, is generated from the file at <FilePath />. The component used is `@theme/DocItem`.
