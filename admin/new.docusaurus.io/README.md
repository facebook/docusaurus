# new.docusaurus.io

This is a Netlify deployment to handle the Docusaurus playgrounds shortcut [new.docusaurus.io](https://new.docusaurus.io).

We use serverless functions because we want to persist the latest choice of the user in a cookie, so that it redirects directly to the preferred playground next time user visits this link. This is better to do it server-side with cookies and 302 redirects than with client redirects and localStorage.

Netlify deployment (Joel can give access): https://app.netlify.com/sites/docusaurus-new/overview

Builds are stopped because we shouldn't need to redeploy very often. You can just trigger a manual build if needed.
