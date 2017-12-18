If you are developing the Docusuarus core and you want a quick way to test your changes, you can use the Docusaurus website itself as your testing area.

> For tips on testing other projects, see the [local testing of third-party projects doc](./local-third-party-project-testing.md).

## Testing

It is straightforward to test your Docusaurus changes with Docusaurus.

```
cd /path/to/docusaurus-repo
npm install
cd website
npm run start
```

> If you look in the `website/package.json` file, you will notice that running `start` with `npm run` actually executes the local `start-server.js` file. This is how you know you are running with local code.

### Observing changes

Now that the server is running, you can make changes to the core Docusaurus code and docs to see the effects on the Docusaurus site. Just refresh the local site, usually running at http://localhost:3000
