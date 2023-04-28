# Argos visual regression tests

We use [Argos CI](https://argos-ci.com) to detect visual regressions on Docusaurus.

This workspace can be run manually, but is generally run through the [Argos GitHub Action](../.github/workflows/argos.yml).

The workflow execute those following steps:

- Build the website locally with `yarn build:website:fast`
- Start the website server with `yarn serve:website` on [http://localhost:3000](http://localhost:3000)
- Take screenshots of all pages found in `sitemap.xml` with Playwright
- Upload all screenshots to [Argos CI](https://argos-ci.com)

This workflow runs for `main` and PR branches, and add a commit status to each PR with a visual diff that we can easily inspect.

---

Some additional capabilities:

- Use [./tests/screenshot.spec.ts](./tests/screenshot.spec.ts) to customize the screenshots we take, eventually filter out some useless sitemap pages like versioned docs
- Use [./tests/screenshot.css](./tests/screenshot.css) to hide flaky CSS elements: iframe, video, gif...
