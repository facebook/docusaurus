If you are developing the Docusaurus core and you want a quick way to test your changes, you can use the Docusaurus website itself as your testing area.

> For tips on testing other projects, see the [local testing of third-party projects doc](./local-third-party-project-testing.md).

## Testing

It is straightforward to test your Docusaurus changes with Docusaurus.

```bash
cd /path/to/docusaurus-repo
npm install
cd website
npm run start
```

> If you look in the `website/package.json` file, you will notice that running `start` with `npm run` actually executes the local `start-server.js` file. This is how you know you are running with local code.

## Debugging Locally

### VS Code

Use the following code in VSCode to enable breakpoints. Please ensure you have a later version of node for non-legacy debugging.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docusaurus Start (Debug)",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/website",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start-debug"],
      "port": 9229
    }
  ]
}
```

### Other Editors

Feel free to contribute debug instructions for other IDEs

### Observing changes

Now that the server is running, you can make changes to the core Docusaurus code and docs to see the effects on the Docusaurus site. LiveReload will reflect changes to the local site in your browser, usually running at http://localhost:3000.
