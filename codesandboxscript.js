let {readFileSync, writeFileSync, readdir, rmdirSync} = require('fs');
let {execSync} = require('child_process');

//delete the examples directory if it exists
rmdirSync('./examples', {recursive: true});
// get the list of all available templates
readdir('./packages/docusaurus-init/templates', (err, data) => {
  let templates = data.filter((i) => i !== 'README.MD');
  templates.forEach((template) => {
    try {
      console.log(
        `generating ${template} template for codesandbox in the examples folder...`,
      );
      // run the docusaurus script to bootstrap the template in the examples folder
      execSync(
        `node ./packages/docusaurus-init/bin/index.js init examples/${template} ${template}`,
      );
      //read the content of the package.json
      let getPackagedDotJson = readFileSync(
        `examples/${template}/package.json`,
      );
      // parse it into an object
      let toJSON = JSON.parse(getPackagedDotJson.toString());
      // attach the dev script which would be used in code sandbox by default
      toJSON.scripts.dev = 'docusaurus start';

      //rewrite the package.json file with the new edit
      writeFileSync(
        `./examples/${template}/package.json`,
        JSON.stringify(toJSON, null, 2),
      );

      //create sandbox.config.json file at the root of template
      let sandboxConfigContent = {
        infiniteLoopProtection: true,
        hardReloadOnChange: true,
        view: 'browser',
        template: 'node',
      };

      writeFileSync(
        `./examples/${template}/sandbox.config.json`,
        JSON.stringify(sandboxConfigContent, null, 2),
      );
      console.log('done');
    } catch (error) {
      console.log(error);
    }
  });
});
