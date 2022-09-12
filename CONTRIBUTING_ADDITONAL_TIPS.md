# Tips for Contributing to Docusaurus

This file expands on the Code Convenions introduced in the Code Convenions' section in CONTRIBUTING.md

"Code Conventions
Most important: Look around. Match the style you see used in the rest of the project. This includes formatting, naming files, naming things in code, naming things in documentation, etc."

# Code Contribution Helpful Tips: 

If you are using Visual Studio Code you can wrap lines by clicking alt + z.

# To make your code ‘Attractive’ try using the following conventions:

 ## Naming files

 File are typically named using dash seperation
 
   Examples: 
   docusaurus/admin/local-third-party-project-testing.md
   docusaurus/__tests__/validate-package-json.test.ts
   docusaurus/website/docs/browser-support.md
   docusaurus/website/docs/migration/migration-translated-sites.md

 ## Naming things in code

  camelCase naming is typically in config.js files
  
  Ex 1: docusaurus/examples/classic/docusaurus.config.js 

    export type ActiveDocContext = {
    activeVersion?: GlobalVersion;
    activeDoc?: GlobalDoc;
    alternateDocVersions: {[versionName: string]: GlobalDoc};
    };

  Dash separated naming is typically used in .json files
  
  Ex 1: docusaurus/examples/classic/package.json

      "serve": "docusaurus serve",
      "write-translations": "docusaurus write-translations",
      "write-heading-ids": "docusaurus write-heading-ids", 
      
   Ex 2: 

      docusaurus/packages/docusaurus-cssnano-preset/package.json
    "postcss-sort-media-queries": "^4.3.0",
    
   However, regardless of file type, camelCase is typically used when naming constants and functions.
   
   Ex 1: docusaurus/packages/docusaurus-utils-validation/src/validationSchemas.ts 
    
    export const RemarkPluginsSchema = MarkdownPluginsSchema;
    export const RehypePluginsSchema = MarkdownPluginsSchema;
    
  Ex 2: docusaurus/website/docs/configuration.md
  
    const {siteConfig} = useDocusaurusContext();

  Ex 3: docusaurus/website/docusaurus.config.js

    const {
      dogfoodingPluginInstances,
      dogfoodingThemeInstances,
    } = require('./_dogfooding/dogfooding.config');
    ....
    
    function getNextVersionName() {
    return 'Canary';
      }
 ## Commenting things in documentation
      import React from 'react';
      // highlight-next-line
      import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
      
   docusaurus/website/docs/configuration.md
      
   Comments 'highlight-start' , 'highlight-end' and  'highlight-next-line' are used to highlight specific lines of code
      
      const Hello = () => {
    // highlight-start
    const {siteConfig} = useDocusaurusContext();
    // highlight-end
    
    // highlight-next-line
       const {title, tagline} = siteConfig;
    
   Comments typically wrap before they exceed the length of the code this is being commented on. 
   
   Ex 1: docusaurus/__tests__/validate-package-json.test.ts 
      
       .forEach((packageJsonFile) => {
        // Unfortunately jest custom message do not exist in loops,
        // so using an exception instead to show failing package file
        // (see https://github.com/facebook/jest/issues/3293)
        // expect(packageJsonFile.content.publishConfig?.access)
        //  .toEqual('public');
        if (packageJsonFile.content.publishConfig?.access !== 'public') {
          throw new Error(
            `Package ${packageJsonFile.file} does not have publishConfig.access: 'public'`,
          );
        }
  
   For more examples view the docusaurus documentation files that end with the file extension .md
