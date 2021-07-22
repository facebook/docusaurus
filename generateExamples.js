/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const rimraf = require('rimraf');
const {readFileSync, writeFileSync, readdir} = require('fs');
const {execSync} = require('child_process');

// Generate one example per init template
// We use those generated examples as CodeSandbox projects
// See https://github.com/facebook/docusaurus/issues/1699
function generateTemplateExample(template) {
  try {
    console.log(
      `generating ${template} template for codesandbox in the examples folder...`,
    );

    // run the docusaurus script to bootstrap the template in the examples folder
    execSync(
      // /!\ we use the published init script on purpose,
      // because using the local init script is too early and could generate upcoming/unavailable config options
      // remember CodeSandbox templates will use the published version, not the repo version
      `npx @docusaurus/init@latest init examples/${template} ${template}`,
      // `node ./packages/docusaurus-init/bin/index.js init examples/${template} ${template}`,
      {
        stdio: 'inherit',
      },
    );

    // read the content of the package.json
    const templatePackageJson = JSON.parse(
      readFileSync(`examples/${template}/package.json`, 'utf8'),
    );

    // attach the dev script which would be used in code sandbox by default
    templatePackageJson.scripts.dev = 'docusaurus start';

    // these example projects are not meant to be published to npm
    templatePackageJson.private = true;

    // make sure package.json name is not "examples-classic"
    // the package.json name appear in CodeSandbox UI so let's display a good name!
    // unfortunately we can't use uppercase or spaces
    // see also https://github.com/codesandbox/codesandbox-client/pull/5136#issuecomment-763521662
    templatePackageJson.name =
      template === 'classic' ? 'docusaurus' : `docusaurus-${template}`;
    templatePackageJson.description =
      template === 'classic'
        ? 'Docusaurus example project'
        : `Docusaurus example project (${template} template)`;

    // rewrite the package.json file with the new edit
    writeFileSync(
      `./examples/${template}/package.json`,
      JSON.stringify(templatePackageJson, null, 2),
    );

    // create sandbox.config.json file at the root of template
    const sandboxConfigContent = {
      infiniteLoopProtection: true,
      hardReloadOnChange: true,
      view: 'browser',
      template: 'docusaurus',
      node: '14',
      container: {
        node: '14',
      },
    };

    writeFileSync(
      `./examples/${template}/sandbox.config.json`,
      JSON.stringify(sandboxConfigContent, null, 2),
    );

    console.log(`Generated example for template ${template}`);
  } catch (error) {
    console.error(`Failed to generated example for template ${template}`);
    throw error;
  }
}

// delete the examples directories if they exists
rimraf.sync('./examples/classic');
rimraf.sync('./examples/facebook');
rimraf.sync('./examples/bootstrap');

/*
Starters are repositories/branches that only contains a newly initialized Docusaurus site
Those are useful for users to inspect (may be more convenient than "examples/classic)
Also some tools like Netlify deploy button currently require using the main branch of a dedicated repo
See https://github.com/jamstack/jamstack.org/pull/609
Button visible here: https://jamstack.org/generators/
 */
function updateStarters() {
  console.log('Will update starter repositories / branches');

  execSync(
    'git subtree push --prefix examples/classic --squash origin starter',
  );
  console.log(
    'Update success for https://github.com/facebook/docusaurus/tree/starter',
  );

  try {
    execSync(
      'git subtree push --prefix examples/classic --squash git@github.com:slorber/docusaurus-starter.git main --squash',
    );
    console.log(
      'Update success for https://github.com/slorber/docusaurus-starter',
    );
  } catch {
    console.error(
      'could not update https://github.com/slorber/docusaurus-starter , ask permission to @slorber if needed',
    );
  }
}

// get the list of all available templates
readdir('./packages/docusaurus-init/templates', (err, data) => {
  const templates = data.filter((i) => i !== 'README.MD');
  templates.forEach(generateTemplateExample);
  updateStarters();
});
