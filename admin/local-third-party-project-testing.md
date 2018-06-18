Sometimes you want to test the latest version of Docusaurus on a third-party project via `npm` or `yarn` without having to publish it to npm itself. For example, you may want to use the latest code in `master`.

> If you want to use Docusaurus to test Docusaurus, see the [testing changes on Docusaurus itself doc](./testing-changes-on-Docusaurus-itself.md)

There are two reasonable ways to use a local version of the Docusaurus npm package to test changes you make to the Docusaurus core on a third-party project.

## Install from a local Docusaurus repo

> If you want to use the docusaurus-init script for testing, you will have to update the `initialize.js` file to point to the local Docusaurus repo instead of installing it from the npm server. In some ways, it is just easier to do the manual steps.

### Install the package from the Docusaurus repo

```bash
cd /path/to/testing_project
mkdir website # if this does not exist already
cd website
```

If you do not have a `package.json` file in the `website` directory, create one with the following content:

```json
{
  "scripts": {
    "start": "docusaurus-start",
    "build": "docusaurus-build",
    "publish-gh-pages": "docusaurus-publish",
    "examples": "docusaurus-examples"
  }
}
```

Then:

```sh
# Path to your Docusaurus clone
npm install ../../path/to/docusaurus/
```

### Clowntown!

Now, we have a bit of clowntown here in the way symlinks are handled. The above `npm install`, creates a `node_modules` directory with a symlink in it. And errors will result if you try to access the local site after starting the server (as you do below). You will get something like this error:

```
ReferenceError: Unknown plugin "transform-class-properties" specified in "base" at 1, attempted to resolve relative to "/Users/joelm/dev/testing-local-Docusaurus-changes-site/website/core"

```

So, you should install these packages locally. **Base the versions on the versions defined in the Docusaurus `package.json`**. e.g.,

```bash
# Still in the website directory of the testing project
npm install babel-plugin-transform-class-properties@^6.24.1
npm install babel-plugin-transform-object-rest-spread@^6.26.0
npm install react@^16.4.1
npm install babel-preset-env@^1.7.0
npm install babel-preset-react@^6.24.1
```

### Test

```bash
./node_modules/.bin/docusaurus-examples # or whatever you want to test, if anything
./node_modules/.bin/docusaurus-start
```

## Use Verdaccio

Verdaccio is a good local npm server that you can use to test your packages.

### Install verdaccio

```bash
npm install --global verdaccio
```

### Publish to verdaccio

When you are ready to test the code that could make up the next version of your package, you can publish locally to verdaccio

Run verdaccio in a **separate terminal window**:

```bash
verdaccio
```

In another terminal window, get ready to publish your local npm package:

```bash
# Your clone of Docusaurus
cd /path/to/docusaurus/

# use anything for user, password, email
# You should only have to do this once as long as you keep verdaccio installed
npm adduser --registry http://localhost:4873

npm publish --registry http://localhost:4873
```

You can navigate to localhost:4873 and you can see that your package was published. You can also see it showing you the steps you ran above as well.

### Install the local npm package and test

Now install the package in the repo you want to test Docusaurus on.

```bash
cd /path/to/testing_project/
mkdir website # if this does not exist already
cd website
```

If you do not have a `package.json` file in the `website` directory, create one with the following content:

```json
{
  "scripts": {
    "start": "docusaurus-start",
    "build": "docusaurus-build",
    "publish-gh-pages": "docusaurus-publish",
    "examples": "docusaurus-examples"
  }
}
```

Then:

```bash
npm install docusaurus --registry http://localhost:4873 # this may be slower than the normal npm registry
npm run examples # or whatever you want to test, if anything
npm run start
```
