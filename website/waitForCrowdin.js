const {Translations} = require('@crowdin/crowdin-api-client');

/*
Crowdin does not support concurrent "project builds" (downloads of translations).
The Crowdin CLI fails with error 409, and it leads to failures on Netlify.

On Docusaurus, when we commit on master, we have 2 Netlify deployments triggered:
- prod
- i18n-staging (work-in-progress locales)

This script helps the 2 deployments to not download translations concurrently from Crowdin.
 */

const pollInterval = 5000;
const timeout = 5 * 60 * 1000;

const projectId = 428890;
const token = process.env.CROWDIN_PERSONAL_TOKEN; // set on Netlify

const translations = new Translations({
  token,
});

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hasBuildInProgress() {
  const projectBuilds = await translations.listProjectBuilds(projectId);
  return projectBuilds.data.some(
    (build) => build.data.status === 'in-progress',
  );
}

async function run() {
  // We delay a bit the i18n staging deployment
  // Because sometimes, prod + i18n-staging call this script at the exact same time
  // And then both try to dl the translations at the same time, and then we have a 409 error
  // This delay makes sure prod starts to dl the translations in priority
  if (
    process.env.NETLIFY === 'true' &&
    process.env.SITE_NAME === 'docusaurus-i18n-staging'
  ) {
    console.log(
      '[Crowdin] Delaying the docusaurus-i18n-staging deployment to avoid 409 errors',
    );
    await delay(30000);
  }

  const timeBefore = Date.now();
  while (true) {
    if (Date.now() - timeBefore > timeout) {
      console.warn(
        '[Crowdin] Timeout of wait script reached => will try to proceed but download translations is likely to fail...',
      );
      break;
    }

    const inProgress = await hasBuildInProgress();
    if (inProgress) {
      console.log('[Crowdin] A build is still in progress => waiting...');
      await delay(pollInterval);
    } else {
      console.warn('[Crowdin] No build in progress => lets continue');
      break;
    }
  }
}

run().then(
  () => {
    process.exit(0);
  },
  (e) => {
    console.error(e.message);
    console.error(e.stack);
    process.exit(1);
  },
);
