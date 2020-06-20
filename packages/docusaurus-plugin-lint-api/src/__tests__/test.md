# API

### `getConfig(path?: string): Promise<Config>`

Reads your Build Tracker Utility configuration. If a path is not provided, this will use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find the appropriate file.

```js
import { getConfig } from '@build-tracker/api-client';

const config = await getConfig();
```

### `createBuild(config: Config, opts: Options): Promise<Build>`

Creates a JSON-friendly build configuration, suitable for POSTing to the Build Tracker API.

```js
import { createBuild, getConfig } from '@build-tracker/api-client';

const config = await getConfig();
createBuild(config, {
  branch: 'master', // optional, in case your git state is not on a branch
  meta: {}, // optional additional metadata to provide in the build
  parentRevision: '123456', // optional, in case your git state cannot find the merge-base
  skipDirtyCheck: false, // set to true to bypass enforcing no local changes in your git work tree
}).then((build) => {
  // do something with the build
});
```

### `statArtifacts(config): Map<string, Stat>`

Reads the artifacts from disk and builds a map of filenames to size stats. This is done automatically by `createBuild`; it is only included in case you want to create builds with a custom script.

```js
import { getConfig, statArtifacts } from '@build-tracker/api-client';

const config = await getConfig();
const artifactMap = statArtifacts(config);
const mainSizes = artifactMap.get('main.js');
```

### `uploadBuild(config: Config, build: Build, apiToken?: string, logger: { log, error }): Promise<ApiReturn>`

Uploads a Build to your Build Tracker instance.

```js
import { createBuild, getConfig, uploadBuild } from '@build-tracker/api-client';

const config = await getConfig();
createBuild(config, {}).then((build) => {
  return uploadBuild(config, build, process.env.BT_API_AUTH_TOKEN);
});
```
