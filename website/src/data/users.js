/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {difference, sortBy} from '../utils/jsUtils';

/*
 * ADD YOUR SITE TO THE DOCUSAURUS SHOWCASE:
 *
 * Requirements for adding your site to our showcase:
 * - It is a production-ready site with real content and decent customizations (different from the init templates)
 * - It is NOT a work-in-progress with empty pages
 * - It has a stable domain name (a Netlify/Vercel deploy preview is not allowed)
 *
 * Instructions:
 * - Add your site in the json array below
 * - Add a local image preview (decent screenshot of your Docusaurus site)
 * - Use relevant tags to qualify your site (read the tag descriptions bellow)
 * - The image MUST be added to the GitHub repository, and use `require("image")`
 * - Open a PR and check for reported CI errors
 *
 * Example PR: https://github.com/facebook/docusaurus/pull/3976
 *
 * If you edit this file through the Github interface, you can:
 * - Submit first your users.js edit PR
 * - This will create a branch on your Docusaurus fork (usually "patch-1")
 * - Go to https://github.com/<username>/docusaurus/tree/<branch>/website/src/data/showcase
 * - Drag-and-drop an image here to add it to your existing PR
 *
 * Please help us maintain this showcase page data:
 * - Update sites with wrong data
 * - Ensure site tags remains correct over time
 * - Remove sites not using Docusaurus anymore
 * - Add missing Docusaurus sites (if the site owner agreed)
 *
 */

// LIST OF AVAILABLE TAGS
// Available tags to assign to your site
// Please choose widely, we'll remove unappropriate tags
export const Tags = {
  // DO NOT USE THIS TAG: we choose sites to add to favorites
  favorite: {
    label: 'Favorite',
    description:
      'Our favorite Docusaurus sites that you must absolutely check-out!',
    icon: <>❤️</>,
  },

  // For open-source sites, a link to the source code is required
  opensource: {
    label: 'Open-Source',
    description: 'Open-Source Docusaurus sites can be useful for inspiration!',
    icon: <>👨‍💻</>,
  },

  product: {
    label: 'Product',
    description: 'Docusaurus sites associated to a commercial product!',
    icon: <>💵</>,
  },

  design: {
    label: 'Design',
    description:
      'Beautiful Docusaurus sites, polished and standing out from the initial template!',
    icon: <>💅</>,
  },

  i18n: {
    label: 'I18n',
    description:
      'Translated Docusaurus sites using the internationalization support with more than 1 locale.',
    icon: <>🏳️</>,
  },

  versioning: {
    label: 'Versioning',
    description:
      'Docusaurus sites using the versioning feature of the docs plugin to manage multiple versions.',
    icon: <>👨‍👦‍👦</>,
  },
  // Sites using multi-instance plugins
  multiInstance: {
    label: 'Multi-Instance',
    description:
      'Docusaurus sites using multiple instances of the same plugin on the same site.',
    icon: <>👨‍👩‍👧‍👦</>,
  },

  // Large Docusaurus sites, with a lot of content (> 200 pages, excluding versions)
  large: {
    label: 'Large site',
    description:
      'Very large Docusaurus sites, including much more pages than the average!',
    icon: <>💪</>,
  },

  facebook: {
    label: 'Facebook sites',
    description: 'Docusaurus sites of Facebook projects',
    icon: <>👥</>,
  },

  personal: {
    label: 'Personal sites',
    description:
      'Personal websites, blogs and digital gardens built with Docusaurus',
    icon: <>🙋</>,
  },

  rtl: {
    label: 'RTL Direction',
    description:
      'Docusaurus sites using the right-to-left reading direction support.',
    icon: <>↪️</>,
  },
};

// Add your site to this list
// prettier-ignore
const Users = [
  {
    title: 'Aide Jeune',
    description: 'French Discord server that helps young people who have been bullied or feel bad about themselves',
    preview: require('./showcase/aide_jeune.png'),
    website: 'https://aidejeune.fr',
    source: 'https://github.com/AideJeune',
    tags: ['opensource'],
  },
  {
    title: 'AgileTs',
    description: 'Global State and Logic Framework for reactive Applications',
    preview: require('./showcase/agilets.png'),
    website: 'https://agile-ts.org/',
    source: 'https://github.com/agile-ts/documentation',
    tags: ['opensource', 'design'],
  },
  {
    title: 'AI-Speaker',
    description: 'Local, reliable, fast and private Audio and IoT gate.',
    preview: require('./showcase/aispeaker.png'),
    website: 'https://ai-speaker.com/',
    source: 'https://github.com/sviete/AIS-WWW',
    tags: ['opensource'],
  },
  {
    title: 'Algolia Docsearch',
    description:
      'The best search experience for docs, integrates in minutes, for free',
    preview: require('./showcase/algolia.png'),
    website: 'https://docsearch.algolia.com/',
    source: 'https://github.com/algolia/docsearch-website',
    tags: ['favorite', 'opensource', 'product'],
  },
  {
    title: 'Amphora Data',
    description: 'Connecting the world’s real-time information',
    preview: require('./showcase/amphora.png'),
    website: 'https://www.amphoradata.com/',
    source: 'https://github.com/amphoradata/amphoradata.github.io',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Apache APISIX',
    description:
      'A Dynamic, Real-Time, High-Performance Cloud-Native API Gateway',
    preview: require('./showcase/apache-apisix.png'),
    website: 'https://apisix.apache.org/',
    source: 'https://github.com/apache/apisix-website',
    tags: ['opensource','i18n','large'],
  },
  {
    title: 'AttoBot',
    description:
      'A multi-purpose Discord bot with many features and API integrations that will enhance your Discord experience.',
    preview: require('./showcase/attobot.png'),
    website: 'https://attobot.xyz',
    source: 'https://github.com/attobot-discord/website',
    tags: ['opensource'],
  },
  {
    title: 'Awe framework',
    description:
      'Awe framework, Build light-weight and functional websites quickly',
    preview: require('./showcase/awe-framework.png'),
    website: 'https://docs.aweframework.com/',
    source: 'https://gitlab.com/aweframework/awe',
    tags: ['opensource', 'i18n', 'versioning'],
  },
  {
    title: 'Axioms',
    description: 'Axioms Developer Hub and Documentation Portal',
    preview: require('./showcase/axioms.png'),
    website: 'https://developer.axioms.io/',
    source: 'https://github.com/axioms-io/developer',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Benthos',
    description: 'A stream processor for mundane tasks',
    preview: require('./showcase/benthos.png'),
    website: 'https://benthos.dev/',
    source: 'https://github.com/Jeffail/benthos',
    tags: ['opensource', 'large'],
  },
  {
    title: 'Blink Shell Docs',
    description: 'Documentation for Blink Shell a professional, desktop grade terminal for iOS',
    preview: require('./showcase/blinkshell.png'),
    website: 'https://docs.blink.sh/',
    source: 'https://github.com/blinksh/docs',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'blog.johnnyreilly.com',
    description: 'The blog of johnnyreilly',
    preview: require('./showcase/johnnyreilly.png'),
    website: 'https://blog.johnnyreilly.com/',
    source: 'https://github.com/johnnyreilly/blog.johnnyreilly.com',
    tags: ['opensource','personal','large'],
  },
  {
    title: 'Botonic',
    description: 'Build Chatbots and Conversational Apps Using React',
    preview: require('./showcase/botonic.png'),
    website: 'https://botonic.io/',
    source: 'https://github.com/hubtype/botonic',
    tags: ['opensource'],
  },
  {
    title: 'Build Tracker',
    description:
      'Track performance budgets & prevent unexpected bloat in your app',
    preview: require('./showcase/build-tracker.png'),
    website: 'https://buildtracker.dev',
    source: 'https://github.com/paularmstrong/build-tracker',
    tags: ['opensource'],
  },
  {
    title: 'ClarityChallenge',
    description: 'Documentation for the Clarity machine learning challenges for improving hearing aid signal processing',
    preview: require('./showcase/claritychallenge.png'),
    website: 'https://claritychallenge.github.io/clarity_CEC1_doc',
    source: 'https://github.com/claritychallenge/clarity_CEC1_doc',
    tags: ['opensource'],
  },
  {
    title: 'Clutch',
    description: 'An extensible API and UI platform for infrastructure tooling',
    preview: require('./showcase/clutch.png'),
    website: 'https://clutch.sh/',
    source: 'https://github.com/lyft/clutch',
    tags: ['opensource'],
  },
  {
    title: 'CodeYourFuture',
    description: 'The syllabus for CodeYourFuture - a free code school for refugees, asylum seekers and disadvantaged people',
    preview: require('./showcase/codeyourfuture.png'),
    website: 'https://syllabus.codeyourfuture.io/',
    source: 'https://github.com/CodeYourFuture/syllabus',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Component Kit',
    description: 'A declarative UI framework for iOS',
    preview: require('./showcase/componentkit.png'),
    website: 'https://componentkit.org',
    source: 'https://github.com/facebook/componentkit',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'ConfigCat Feature Flags',
    description: 'A feature flag and remote configuration service.',
    preview: require('./showcase/configcat.png'),
    website: 'https://configcat.com/docs/',
    source: 'https://github.com/configcat/docs',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Console Table',
    description: 'Printing Pretty Tables on your console.',
    preview: require('./showcase/console-table.png'),
    website: 'https://console-table.netlify.app/',
    source: 'https://github.com/ayonious/console-table-docu',
    tags: ['opensource'],
  },
  {
    title: 'Create React App',
    description: 'Set up a modern web app by running one command',
    preview: require('./showcase/create-react-app.png'),
    website: 'https://facebook.github.io/create-react-app/',
    source: 'https://github.com/facebook/create-react-app',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'CryptoDevHub',
    description: 'The place where Blockchain- and Crypto developers learn, meet and grow.',
    preview: require('./showcase/cryptodevhub.png'),
    website: 'https://cryptodevhub.io',
    source: 'https://github.com/cryptodevhub/site',
    tags: ['opensource'],
  },
  {
    title: 'Daily Digest - COVID-19 IN FRANCE',
    description:
      'A website that presents daily COVID-19 statistics and news in France in the form of a daily digest.',
    preview: require('./showcase/daily-digest-covid-19-in-france.png'),
    website: 'https://covid-fr.misterfishup.com/en/',
    source: 'https://github.com/MisterFISHUP/covid-19-in-france',
    tags: ['opensource', 'i18n', 'large'],
  },
  {
    title: 'Datagit',
    description:
      'A persian tutorial website strive to make quality education for everyone.',
    preview: require('./showcase/datagit.png'),
    website: 'https://datagit.ir/',
    source: 'https://github.com/massoudmaboudi/datagit_v2.docusaurus',
    tags: ['opensource', 'favorite', 'rtl'],
  },
  {
    title: 'DevSpace',
    description: 'Deploy & Develop Kubernetes Apps',
    preview: require('./showcase/devspace.png'),
    website: 'https://devspace.sh/cli/docs/',
    source: 'https://github.com/loft-sh/devspace',
    tags: ['opensource'],
  },
  {
    title: 'Draft.js',
    description: 'Rich Text Editor Framework for React',
    preview: require('./showcase/draftjs.png'),
    website: 'https://draftjs.org/',
    source: 'https://github.com/facebook/draft-js',
    tags: ['opensource','facebook'],
  },
  {
    title: 'Easyjwt',
    description: 'JWT creation and validation library',
    preview: require('./showcase/easyjwt.png'),
    website: 'https://www.easyjwt.org',
    source: 'https://github.com/authdog/easyjwt',
    tags: ['opensource','i18n'],
  },
  {
    title: 'Eightshift Docs',
    description:
      'All the tools you need to start building a modern WordPress project, using all the latest development tools.',
    preview: require('./showcase/eightshift-docs.png'),
    website: 'https://infinum.github.io/eightshift-docs/',
    source: 'https://github.com/infinum/eightshift-docs',
    tags: ['opensource', 'favorite', 'design'],
  },
  {
    title: 'Erxes',
    description:
      'Combine all your business tools into one streamlined and integrated open-source framework',
    preview: require('./showcase/erxes.png'),
    website: 'https://docs.erxes.io/',
    source: 'https://github.com/erxes/erxes',
    tags: ['opensource'],
  },
  {
    title: 'Eta',
    description: 'Faster embedded JS template engine in TypeScript',
    preview: require('./showcase/eta.png'),
    website: 'https://eta.js.org/',
    source: 'https://github.com/eta-dev/eta',
    tags: ['opensource'],
  },
  {
    title: "Evan Tay's Personal Website",
    description: "A Software Engineer's blog, documentation and project portfolio.",
    preview: require('./showcase/evantay.png'),
    website: 'https://evantay.com/',
    source: 'https://github.com/DigiPie/kaya-folio',
    tags: ['opensource', 'personal'],
  },
  {
    title: 'FBT',
    description: 'An internationalization framework',
    preview: require('./showcase/fbt.png'),
    website: 'https://facebookincubator.github.io/fbt/',
    source: 'https://github.com/facebook/fbt',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'FireCMS',
    description: 'Firebase/Firestore based headless CMS',
    preview: require('./showcase/firecms.png'),
    website: 'https://firecms.co',
    source: 'https://github.com/Camberi/firecms',
    tags: ['opensource', 'design'],
  },
  {
    title: 'Flagsmith',
    description: 'Open Source Feature Flag and Remote Config Service',
    preview: require('./showcase/flagsmith.png'),
    website: 'https://docs.flagsmith.com',
    source: 'https://github.com/Flagsmith/flagsmith-docs',
    tags: ['opensource'],
  },
  {
    title: 'Flipper',
    description: 'Extensible mobile app debugger',
    preview: require('./showcase/flipper.png'),
    website: 'https://fbflipper.com',
    source: 'https://github.com/facebook/flipper',
    tags: ['opensource', 'design', 'facebook'],
  },
  {
    title: 'FlexIt Analytics',
    description: 'Business Intelligence and Data Analytics platform',
    preview: require('./showcase/flexit.png'),
    website: 'https://learn.flexitanalytics.com/',
    source: 'https://github.com/ataft/flexit-docs',
    tags: ['opensource','product'],
  },
  {
    title: 'Flux',
    description: 'Application architecture for building user interfaces',
    preview: require('./showcase/flux.png'),
    website: 'https://facebook.github.io/flux/',
    source: 'https://github.com/facebook/flux',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'FoalTS',
    description: 'Node.JS framework for building web applications',
    preview: require('./showcase/foal.png'),
    website: 'https://foalts.org/',
    source: 'https://github.com/FoalTS/foal/tree/master/docs',
    tags: ['opensource', 'design', 'versioning', 'i18n'],
  },
  {
    title: 'FormatJS',
    description: 'Internationalize your web apps on the client & server.',
    preview: require('./showcase/formatjs.png'),
    website: 'https://formatjs.io/',
    source: 'https://github.com/formatjs/formatjs/tree/main/website',
    tags: ['opensource'],
  },
  {
    title: 'Gladys Assistant',
    description: 'A privacy-first, open-source home assistant',
    preview: require('./showcase/gladys-assistant.png'),
    website: 'https://gladysassistant.com/',
    source: 'https://github.com/GladysAssistant/v4-website',
    tags: ['opensource', 'i18n'],
  },
  {
    title: 'GraphQL Code Generator',
    description:
      'Generate code from your GraphQL schema and operations with a simple CLI',
    preview: require('./showcase/graphql-codegen.png'),
    website: 'https://graphql-code-generator.com/',
    source: 'https://github.com/dotansimha/graphql-code-generator',
    tags: ['favorite', 'opensource','design'],
  },
  {
    title: 'GraphQL Inspector',
    description: 'An open-source tool to help you work with GraphQL',
    preview: require('./showcase/graphql-inspector.png'),
    website: 'https://graphql-inspector.com',
    source: 'https://github.com/kamilkisiela/graphql-inspector',
    tags: ['opensource', 'design','product'],
  },
  {
    title: 'GraphQL Mesh',
    description: 'Query anything, run everywhere',
    preview: require('./showcase/graphql-mesh.png'),
    website: 'https://graphql-mesh.com',
    source: 'https://github.com/urigo/graphql-mesh',
    tags: ['opensource'],
  },
  {
    title: 'Gulp',
    description: 'A toolkit to automate & enhance your workflow',
    preview: require('./showcase/gulp.png'),
    website: 'https://gulpjs.com',
    source: 'https://github.com/gulpjs/gulp',
    tags: ['opensource', 'large'],
  },
  {
    title: 'Hashnode Support',
    description: 'A help portal for Hashnode users',
    preview: require('./showcase/hashnode.png'),
    website: 'https://support.hashnode.com/',
    source: 'https://github.com/Hashnode/support',
    tags: ['opensource'],
  },
  {
    title: 'hCaptcha.com Docs',
    description: 'hCaptcha.com anti-bot service docs',
    preview: require('./showcase/hcaptcha.png'),
    website: 'https://docs.hcaptcha.com/',
    source: null,
    tags: ['product'],
  },

  {
    title: 'Hermes',
    description: 'JavaScript engine optimized for React Native',
    preview: require('./showcase/hermes.png'),
    website: 'https://hermesengine.dev',
    source: 'https://github.com/facebook/hermes',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'Home Assistant',
    description: 'All you need to start developing',
    preview: require('./showcase/home-assistant.png'),
    website: 'https://developers.home-assistant.io/',
    source: 'https://github.com/home-assistant/core',
    tags: ['opensource'],
  },
  {
    title: 'Idb',
    description: 'iOS Development Bridge',
    preview: require('./showcase/idb.png'),
    website: 'https://www.fbidb.io/',
    source: 'https://github.com/facebook/idb',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'IntelAGENT Billing',
    description: 'OHIP Billing Agent',
    preview: require('./showcase/intelagent.png'),
    website: 'https://www.intelagent.ca/',
    source: 'https://github.com/intelagentbilling/docs',
    tags: ['opensource','product'],
  },
  {
    title: 'Jest',
    description: 'Jest is a delightful JavaScript Testing Framework with a focus on simplicity.',
    preview: require('./showcase/jest.png'),
    website: 'https://jestjs.io/',
    source: 'https://github.com/facebook/jest/tree/master/website',
    tags: ['favorite','opensource','design','i18n','versioning'],
  },
  {
    title: 'Kosko',
    description: 'Organize Kubernetes manifests in JavaScript',
    preview: require('./showcase/kosko.png'),
    website: 'https://kosko.dev',
    source: 'https://github.com/tommy351/kosko',
    tags: ['opensource']
  },
  {
    title: 'Kotest',
    description: 'Kotlin test framework',
    preview: require('./showcase/kotest.jpg'),
    website: 'https://kotest.io',
    source: 'https://github.com/kotest/kotest',
    tags: ['opensource'],
  },
  {
    title: 'SICOPE Model',
    description: 'An open source model-based testing tool for web applications',
    preview: require('./showcase/sicope-model.png'),
    website: 'https://sicope-model.github.io/',
    source: 'https://github.com/sicope-model/sicope-model',
    tags: ['opensource'],
  },
  {
    title: 'Mailgo',
    description: 'A new concept of mailto and tel links',
    preview: require('./showcase/mailgo.png'),
    website: 'https://mailgo.dev/',
    source: 'https://github.com/manzinello/mailgo.dev',
    tags: ['opensource'],
  },
  {
    title: 'MediaMachine',
    description: 'Infrastructure for User-Generated Video content',
    preview: require('./showcase/mediamachine.png'),
    website: 'https://mediamachine.io/',
    source: null,
    tags: ['product'],
  },
  {
    title: 'Meli',
    description: 'Platform to deploy static sites, frontend applications and hosted forms',
    preview: require('./showcase/meli.png'),
    website: 'https://docs.meli.sh/',
    source: 'https://github.com/getmeli/meli',
    tags: ['opensource'],
  },
  {
    title: 'Metro',
    description: 'The JavaScript bundler for React Native',
    preview: require('./showcase/metro.png'),
    website: 'https://facebook.github.io/metro/',
    source: 'https://github.com/facebook/metro',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'Mia-Platform',
    description: 'Mia-Platform is the simplest way to develop and operate modern applications on Kubernetes. Don\'t waste time to set up your platform, just push the code!',
    preview: require('./showcase/mia-platform.png'),
    website: 'https://docs.mia-platform.eu/',
    source: null,
    tags: ['product', 'large', 'versioning'],
  },
  {
    title: 'MikroORM',
    description:
      'TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns.',
    preview: require('./showcase/mikro-orm.png'),
    website: 'https://mikro-orm.io',
    source: 'https://github.com/mikro-orm/mikro-orm',
    tags: ['opensource', 'large', 'versioning'],
  },
  {
    title: 'Motion Layout',
    description:
      'Create beautiful immersive React.js animations using shared components',
    preview: require('./showcase/motion-layout.png'),
    website: 'https://motion-layout.azurewebsites.net',
    source: 'https://github.com/jeffersonlicet/react-motion-layout',
    tags: ['opensource'],
  },
  {
    title: 'Netdata Learn',
    description: 'An educational site for monitoring and troubleshooting systems',
    preview: require('./showcase/netdata.png'),
    website: 'https://learn.netdata.cloud',
    source: 'https://github.com/netdata/netdata-learn-docusaurus',
    tags: ['opensource', 'product', 'large'],
  },
  {
    title: 'Neutron JS',
    description: 'An open source CLI to work with Redux + Redux Saga',
    preview: require('./showcase/neutronjs.png'),
    website: 'https://www.neutronjs.com/',
    source: 'https://github.com/neutronjs/neutron-cli',
    tags: ['opensource', 'versioning'],
  },
  {
    title: 'NextAuth.js',
    description: 'An open source serverless authentication library for next.js',
    preview: require('./showcase/nextauthjs.png'),
    website: 'https://next-auth.js.org/',
    source: 'https://github.com/nextauthjs/next-auth',
    tags: ['opensource','design'],
  },
  {
    title: 'Node SerialPort',
    description: 'Talk to your Serial devices',
    preview: require('./showcase/node-serialport.png'),
    website: 'https://serialport.io',
    source: 'https://github.com/serialport/node-serialport',
    tags: ['opensource','versioning'],
  },
  {
    title: 'Nodify',
    description:
      'High-performance WPF node editor component designed for MVVM.',
    preview: require('./showcase/nodify.png'),
    website: 'https://miroiu.github.io/nodify/',
    source: 'https://github.com/miroiu/nodify',
    tags: ['opensource', 'design'],
  },
  {
    title: 'OCPeasy',
    description:
      'Open-source software provisioning, configuration management, and application-deployment tool enabling infrastructure as code on OpenShift.',
    preview: require('./showcase/ocpeasy.png'),
    website: 'https://www.ocpeasy.org',
    source: 'https://github.com/ocpeasy/website',
    tags: ['opensource'],
  },
  {
    title: 'Orbit.js',
    description: 'The Universal Data Layer',
    preview: require('./showcase/orbitjs.png'),
    website: 'https://orbitjs.com',
    source: 'https://github.com/orbitjs/orbit/tree/main/website',
    tags: ['opensource','versioning'],
  },
  {
    title: 'Oxidizer',
    description: 'A Rust ORM based on tokio-postgres and refinery',
    preview: require('./showcase/oxidizer.png'),
    website: 'https://oxidizer.rs',
    source: 'https://github.com/oxidizer-rs/website',
    tags: ['opensource'],
  },
  {
    title: 'Paubox',
    description: 'Paubox API Documentation',
    preview: require('./showcase/paubox.png'),
    website: 'https://docs.paubox.com/',
    source: null,
    tags: ["product"],
  },
  {
    title: 'pnpm',
    description: 'Fast, disk space efficient package manager',
    preview: require('./showcase/pnpm.png'),
    website: 'https://pnpm.js.org/',
    source: 'https://github.com/pnpm/pnpm.github.io/',
    tags: ['opensource','i18n'],
  },
  {
    title: 'Postgres.ai – Database Lab',
    description:
      "Deploy with confidence. Been stung by a poorly tested database migration? We won't let it happen again.",
    preview: require('./showcase/postgres-ai.png'),
    website: 'https://postgres.ai/',
    source: 'https://gitlab.com/postgres-ai/docs',
    tags: ['opensource', 'product'],
  },
  {
    title: "Power's Wiki",
    description: 'An example of personal wiki ',
    preview: require('./showcase/power.png'),
    website: 'https://wiki-power.com/',
    source: 'https://github.com/linyuxuanlin/Wiki_Docusaurus',
    tags: ['opensource', 'large', 'personal'],
  },
  {
    title: 'PptxGenJS',
    description: 'PowerPoint JavaScript Library',
    preview: require('./showcase/pptxgenjs.png'),
    website: 'https://gitbrent.github.io/PptxGenJS/',
    source: 'https://github.com/gitbrent/PptxGenJS',
    tags: ['opensource','design'],
  },
  {
    title: 'Prismatic',
    description: 'An Integration Platform for B2B Software Companies',
    preview: require('./showcase/prismatic.png'),
    website: 'https://prismatic.io/docs/',
    source: null,
    tags: ['product'],
  },
  {
    title: 'Profilo',
    description: 'An Android performance library',
    preview: require('./showcase/profolo.png'),
    website: 'https://facebookincubator.github.io/profilo/',
    source: 'https://github.com/facebookincubator/profilo',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'Pyre',
    description: 'A performant type-checker for Python 3',
    preview: require('./showcase/pyre.png'),
    website: 'https://pyre-check.org',
    source: 'https://github.com/facebook/pyre-check',
    tags: ['opensource', 'facebook'],
  },
  {
    title: 'QA-Board',
    description:
      'An open source run-tracker for algorithm and performance engineering with rich visualizations',
    preview: require('./showcase/qa-board.png'),
    website: 'https://samsung.github.io/qaboard/',
    source: 'https://github.com/Samsung/qaboard',
    tags: ['opensource'],
  },
  {
    title: 'QuantCDN',
    description:
      'An all-in-one Static Web solution and global Content Delivery Network',
    preview: require('./showcase/quantcdn.png'),
    website: 'https://docs.quantcdn.io',
    source: 'https://github.com/quantcdn/docs',
    tags: ['opensource','product'],
  },
  {
    title: 'QuestDB',
    description:
      'An open source SQL database designed to process time series data',
    preview: require('./showcase/questdb.png'),
    website: 'https://questdb.io',
    source: 'https://github.com/questdb/questdb.io',
    tags: ['opensource', 'favorite', 'design', 'large'],
  },
  {
    title: 'RactivePlayer',
    description: 'Interactive videos in React',
    preview: require('./showcase/ractive-player.png'),
    website: 'https://ractive-player.org',
    source: 'https://github.com/ysulyma/ractive-player',
    tags: ['opensource'],
  },
  {
    title: 'React Complex Tree',
    description: 'Unopinionated Accessible React Tree Component with Multi-Select and Drag-And-Drop',
    preview: require('./showcase/react-complex-tree.png'),
    website: 'https://rct.lukasbach.com/',
    source: 'https://github.com/lukasbach/react-complex-tree',
    tags: ['opensource'],
  },
  {
    title: 'React-Leaflet',
    description: 'React components for Leaflet maps',
    preview: require('./showcase/react-leaflet.png'),
    website: 'https://react-leaflet.js.org/',
    source: 'https://github.com/PaulLeCam/react-leaflet',
    tags: ['opensource'],
  },
  {
    title: 'React Native',
    description: 'A framework for building native apps using React',
    preview: require('./showcase/reactnative.png'),
    website: 'https://reactnative.dev',
    source: 'https://github.com/facebook/react-native-website',
    tags: [
      'opensource',
      'facebook',
      'large',
      'favorite',
      'design',
      'versioning',
    ],
  },
  {
    title: 'React Native ARIA',
    description:
      'A library that provides accessible UI primitives for React Native apps.',
    preview: require('./showcase/reactnative-aria.png'),
    website: 'https://react-native-aria.geekyants.com',
    source: 'https://github.com/GeekyAnts/react-native-aria-website',
    tags: ['opensource'],
  },
  {
    title: 'React Native Boilerplate',
    description:
      'A React Native project template for building solid applications through separation of concerns between the UI, state management and business logic.',
    preview: require('./showcase/reactnativeboilerplate.png'),
    website: 'https://thecodingmachine.github.io/react-native-boilerplate/',
    source: 'https://github.com/thecodingmachine/react-native-boilerplate',
    tags: ['opensource'],
  },
  {
    title: 'React Native Elements',
    description: 'Cross Platform React Native UI Toolkit',
    preview: require('./showcase/react-native-elements.png'),
    website: 'https://react-native-training.github.io/react-native-elements/',
    source: 'https://github.com/react-native-elements/react-native-elements',
    tags: ['opensource'],
  },
  {
    title: 'React Native iOS Kit',
    description: 'The missing React Native UI Kit for iOS.',
    preview: require('./showcase/react-native-ios-kit.png'),
    website: 'https://callstack.github.io/react-native-ios-kit',
    source: 'https://github.com/callstack/react-native-ios-kit',
    tags: ['opensource'],
  },
  {
    title: 'React Native Reanimated',
    description: 'React Native\'s Animated library reimplemented',
    preview: require('./showcase/react-native-reanimated.png'),
    website: 'https://docs.swmansion.com/react-native-reanimated/',
    source: 'https://github.com/software-mansion/react-native-reanimated/tree/master/docs',
    tags: ['opensource','design','versioning'],
  },
  {
    title: "React Native Render HTML",
    description: "The hackable, full-featured Open Source HTML rendering solution for React Native.",
    preview: require('./showcase/rnrh.png'),
    website: "https://meliorence.github.io/react-native-render-html",
    source: "https://github.com/meliorence/react-native-render-html/tree/master/apps/website",
    tags: ['opensource', 'design'],
  },
  {
    title: 'React Native Testing Library',
    description: 'Helps you to write better tests with less effort.',
    preview: require('./showcase/react-native-testing-library.png'),
    website: 'https://callstack.github.io/react-native-testing-library/',
    source: 'https://github.com/callstack/react-native-testing-library',
    tags: ['opensource'],
  },
  {
    title: 'React Navigation',
    description: 'Routing and navigation for your React Native apps',
    preview: require('./showcase/react-navigation.png'),
    website: 'https://reactnavigation.org/',
    source: 'https://github.com/react-navigation/react-navigation.github.io',
    tags: ['opensource','design','versioning'],
  },
  {
    title: 'React Redux',
    description: 'Official React bindings for Redux',
    preview: require('./showcase/react-redux.png'),
    website: 'https://react-redux.js.org',
    source: 'https://www.github.com/reduxjs/react-redux',
    tags: ['opensource'],
  },
  {
    title: 'Realtime Web Applications Workshop',
    description:
      'A workshop about building realtime web applications with WebSockets and WebRTC.',
    preview: require('./showcase/realtime-apps-workshop.png'),
    website: 'https://realtime-apps-iap.github.io',
    source: 'https://github.com/realtime-apps-iap/realtime-apps-iap.github.io',
    tags: ['opensource'],
  },
  {
    title: 'Redux',
    description: 'A Predictable State Container for JS Apps',
    preview: require('./showcase/redux.png'),
    website: 'https://redux.js.org/',
    source: 'https://www.github.com/reduxjs/redux',
    tags: ['opensource'],
  },
  {
    title: 'Redis Labs Developer Site',
    description: 'The Home of Redis Developers',
    preview: require('./showcase/redis-developer.png'),
    website: 'https://developer.redislabs.com',
    source: 'https://github.com/redis-developer/redis-developer.github.io',
    tags: ['opensource','product','design','favorite'],
  },
  {
    title: 'Rematch',
    description:
      'Redux best practices without the boilerplate in less than 2kb',
    preview: require('./showcase/rematch.png'),
    website: 'https://rematchjs.org',
    source: 'https://github.com/rematch/rematch',
    tags: ['opensource', 'design'],
  },
  {
    title: 'Relay',
    description: 'The GraphQL client that scales with you',
    preview: require('./showcase/relay.png'),
    website: 'https://relay.dev/',
    source: 'https://github.com/facebook/relay/tree/master/website',
    tags: ['opensource','favorite','design','versioning'],
  },
  {
    title: 'Remotion',
    description: 'Write videos programmatically in React',
    preview: require('./showcase/remotion.png'),
    website: 'https://www.remotion.dev/',
    source: 'https://github.com/JonnyBurger/remotion/tree/main/packages/docs',
    tags: ['opensource','product'],
  },
  {
    title: 'Repeater.js',
    description: 'The missing constructor for creating safe async iterators',
    preview: require('./showcase/repeaterjs.png'),
    website: 'https://repeater.js.org/',
    source: 'https://github.com/repeaterjs/repeater',
    tags: ['opensource'],
  },
  {
    title: 'Rooks',
    description:
      'Supercharge your components with this collection of React hooks.',
    preview: require('./showcase/rooks.png'),
    website: 'https://react-hooks.org/',
    source: 'https://github.com/imbhargav5/rooks',
    tags: ['opensource', 'versioning'],
  },
  {
    title: 'RSocket',
    description: 'Application protocol providing Reactive Streams semantics.',
    preview: require('./showcase/rsocket.png'),
    website: 'https://rsocket.io/',
    source: 'https://github.com/rsocket/rsocket-website',
    tags: ['opensource'],
  },
  {
    title: 'Runlet',
    description: 'A cloud-based job manager that integrates your devices',
    preview: require('./showcase/runlet.png'),
    website: 'https://runlet.app',
    source: 'https://github.com/runletapp/website',
    tags: ['opensource'],
  },
    {
    title: 'Runiac',
    description: 'Run IaC Anywhere with Ease',
    preview: require('./showcase/runiac.png'),
    website: 'https://runiac.io',
    source: 'https://github.com/runiac/website',
    tags: ['opensource'],
  },
  {
    title: 'Saleor',
    description: 'Saleor Documentation',
    preview: require('./showcase/saleor.png'),
    website: 'https://docs.getsaleor.com/',
    source: 'https://github.com/mirumee/saleor-docs',
    tags: ['opensource', 'product', 'versioning'],
  },
  {
    title: 'SCI WP Framework',
    description: 'A PHP framework to create MVC plugins for WordPress',
    preview: require('./showcase/sciwp.png'),
    website: 'https://sciwp.com/',
    source: 'https://github.com/sciwp/sciwp-framework',
    tags: ['opensource'],
  },
  {
    title: 'Single SPA',
    description: 'A javascript router for front-end microservices',
    preview: require('./showcase/single-spa.png'),
    website: 'https://single-spa.js.org/',
    source: 'https://github.com/single-spa/single-spa',
    tags: ['opensource', 'large', 'versioning', 'i18n'],
  },
  {
    title: 'smash.gg',
    description: 'Turning passions into careers',
    preview: require('./showcase/smashgg.png'),
    website: 'https://developer.smash.gg',
    source: 'https://github.com/smashgg/developer-portal',
    tags: ['opensource','product'],
  },
  {
    title: 'Shabad OS Docs',
    description:
      'Browse the latest docs, including tutorial guides, sample code, product articles, and API references',
    preview: require('./showcase/shabados.png'),
    website: 'https://docs.shabados.com',
    source: 'https://github.com/shabados/docs',
    tags: ['opensource', 'design'],
  },
  {
    title: 'social-embed',
    description:
      'Drop-in replacement for embed-friendly websites (and à la carte APIs for detecting and parsing them)',
    preview: require('./showcase/social-embed.png'),
    website: 'https://social-embed.git-pull.com/',
    source: 'https://github.com/social-embed/social-embed',
    tags: ['opensource'],
  },
  {
    title: 'SpotifyAPI-NET',
    description: 'A Client for the Spotify Web API, written in C#/.NET',
    preview: require('./showcase/spotifyapi-net.png'),
    website: 'https://johnnycrazy.github.io/SpotifyAPI-NET/',
    source: 'https://github.com/JohnnyCrazy/SpotifyAPI-NET',
    tags: ['opensource', 'versioning'],
  },
  {
    title: 'SQL Frames',
    description: 'DataFrames meet SQL, in the browser',
    preview: require('./showcase/sqlframes_docusaurus.png'),
    website: 'https://sqlframes.com/',
    source: null,
    tags: ['product'],
  },
  {
    title: 'Stryker Mutator',
    description: 'Mutation testing for JavaScript, .NET and JVM',
    preview: require('./showcase/stryker-mutator.png'),
    website: 'https://stryker-mutator.io',
    source: 'https://github.com/stryker-mutator/stryker-mutator.github.io',
    tags: ['opensource'],
  },
  {
    title: 'Stylable',
    description: 'A CSS preprocessor made for components',
    preview: require('./showcase/stylable.png'),
    website: 'https://stylable.io',
    source: 'https://github.com/wixplosives/stylable.io',
    tags: ['opensource'],
  },
  {
    title: 'Supabase',
    description: 'Open Source Realtime and RESTful APIs for Postgres',
    preview: require('./showcase/supabase.png'),
    website: 'https://www.supabase.io/',
    source: 'https://github.com/supabase/monorepo',
    tags: ['opensource', 'favorite', 'design', 'large','product'],
  },
  {
    title: 'T-Regx',
    description: 'Programmer-oriented Regular Expressions library for PHP',
    preview: require('./showcase/t-regx.png'),
    website: 'https://t-regx.com/',
    source: 'https://github.com/T-Regx/T-Regx',
    tags: ['opensource'],
  },
  {
    title: 'Taro',
    description: 'An open cross-end and cross-frame solution',
    preview: require('./showcase/docs-taro-zone.png'),
    website: 'https://docs.taro.zone/',
    source: 'https://github.com/NervJS/taro',
    tags: ['opensource', 'versioning', 'large'],
  },
  {
    title: 'Testing Library',
    description:
      'Simple and complete testing utilities that encourage good testing practices',
    preview: require('./showcase/testing-library.png'),
    website: 'https://testing-library.com/',
    source: 'https://github.com/testing-library/testing-library-docs',
    tags: ['opensource'],
  },
  {
    title: 'Tasit',
    description:
      'A JavaScript SDK for building native mobile Ethereum dapps with React Native',
    preview: require('./showcase/tasit.png'),
    website: 'https://docs.tasit.io/',
    source: 'https://github.com/tasitlabs/tasit-sdk',
    tags: ['opensource'],
  },
  {
    title: 'The Diff Podcast',
    description: 'A Podcast from Facebook Open Source',
    preview: require('./showcase/the-diff.png'),
    website: 'https://thediffpodcast.com',
    source: null,
    tags: [ 'facebook'],
  },
  {
    title: 'Tinaël Devresse',
    description: 'Personal website of Tinaël Devresse, a blog about anything that crosses my mind which I think could interest y\'all.',
    preview: require('./showcase/tinaeldevresse.png'),
    website: 'https://tinaeldevresse.eu/',
    source: 'https://github.com/hunteroi/tinaeldevresse.eu',
    tags: ['personal', 'opensource', 'i18n']
  },
  {
    title: 'TRPG Engine',
    description: 'IM Application which build for TRPG, like slack and discord',
    preview: require('./showcase/trpgengine.png'),
    website: 'https://trpgdoc.moonrailgun.com/',
    source: 'https://github.com/TRPGEngine/Client',
    tags: ['opensource'],
  },
  {
    title: 'Tuist',
    description: 'A tool to maintain and interact with Xcode projects at scale',
    preview: require('./showcase/tuist.png'),
    website: 'https://docs.tuist.io/',
    source: 'https://github.com/tuist/tuist',
    tags: ['opensource'],
  },
  {
    title: 'uniforms',
    description: 'A set of React libraries for building forms',
    preview: require('./showcase/uniforms.png'),
    website: 'https://uniforms.tools/',
    source: 'https://github.com/vazco/uniforms',
    tags: ['opensource'],
  },
  {
    title: 'Vector',
    description: 'A High-Performance, Logs, Metrics, & Events Router',
    preview: require('./showcase/vector.png'),
    website: 'https://vector.dev/',
    source: 'https://github.com/timberio/vector',
    tags: ['opensource', 'favorite', 'design', 'large'],
  },
  {
    title: 'Vue NodeGui',
    description: 'A cross-platform native desktop app library',
    preview: require('./showcase/vue-nodegui.png'),
    website: 'https://vue.nodegui.org/',
    source: 'https://github.com/nodegui/vue-nodegui',
    tags: ['opensource'],
  },
  {
    title: 'Wasp',
    description:
      'A DSL for building full-stack web apps with less boilerplate.',
    preview: require('./showcase/wasp.png'),
    website: 'https://wasp-lang.dev/',
    source: 'https://github.com/wasp-lang/wasp',
    tags: ['opensource'],
  },
  {
    title: 'WebdriverIO',
    description:
      'Next-gen browser and mobile automation test framework for Node.js',
    preview: require('./showcase/webdriverio.png'),
    website: 'https://webdriver.io/',
    source: 'https://github.com/webdriverio/webdriverio',
    tags: ['opensource', 'design', 'large','favorite'],
  },
  {
    title: 'Wisdom',
    description: 'Session replay web analytics with open data SQL/S3 access.',
    preview: require('./showcase/wisdom.png'),
    website: 'https://developers.getwisdom.io/',
    source: 'https://github.com/Wisdom/dev-docs',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'KubeVela',
    description:
      "KubeVela is a modern application engine that adapts to your application's needs, not the other way around.",
    preview: require('./showcase/kubevela.png'),
    website: 'https://kubevela.io/',
    source: 'https://github.com/oam-dev/kubevela.io',
    tags: ['opensource', 'versioning', 'i18n'],
  },
  {
    title: 'Leon',
    description: 'Your open-source personal assistant.',
    preview: require('./showcase/leon.png'),
    website: 'https://docs.getleon.ai',
    source: 'https://github.com/leon-ai/docs.getleon.ai',
    tags: ['opensource', 'versioning', 'i18n'],
  },
  {
    title: 'Joel PO',
    description: 'A minimalist personal website',
    preview: require('./showcase/joelpo.png'),
    website: 'https://joelpo.github.io',
    source: 'https://github.com/Joelpo/joelpo.github.io',
    tags: ['personal', 'opensource']
  },
  {
    title: 'LiveKit',
    description: 'Open source, scalable, real-time audio and video rooms over WebRTC',
    preview: require('./showcase/livekit.png'),
    website: 'https://docs.livekit.io',
    source: 'https://github.com/livekit/livekit-docs',
    tags: ['opensource', 'product', 'design']
  },
  {
    title: 'Zowe',
    description: 'Open source framework for leveraging data and applications in z/OS',
    preview: require('./showcase/zowe.png'),
    website: 'https://docs.zowe.org',
    source: 'https://github.com/zowe/docs-site',
    tags: ['opensource', 'product', 'large', 'design', 'versioning']
  },
  {
    title: 'Quickwit',
    description: 'The open source search engine on object storage with subsecond latency',
    preview: require('./showcase/quickwit.png'),
    website: 'https://quickwit.io',
    source: 'https://github.com/quickwit-inc/quickwit',
    tags: ['favorite', 'opensource', 'design']
  }
];

export const TagList = Object.keys(Tags);
function sortUsers() {
  let result = Users;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes('favorite'));
  return result;
}

export const SortedUsers = sortUsers();

// Fail-fast on common errors
function ensureUserValid(user) {
  function checkFields() {
    const keys = Object.keys(user);
    const validKeys = [
      'title',
      'description',
      'preview',
      'website',
      'source',
      'tags',
    ];
    const unknownKeys = difference(keys, validKeys);
    if (unknownKeys.length > 0) {
      throw new Error(
        `Site contains unknown attribute names=[${unknownKeys.join(',')}]`,
      );
    }
  }

  function checkTitle() {
    if (!user.title) {
      throw new Error('Site title is missing');
    }
  }

  function checkDescription() {
    if (!user.description) {
      throw new Error('Site description is missing');
    }
  }

  function checkWebsite() {
    if (!user.website) {
      throw new Error('Site website is missing');
    }
    const isHttpUrl =
      user.website.startsWith('http://') || user.website.startsWith('https://');
    if (!isHttpUrl) {
      throw new Error(
        `Site website does not look like a valid url: ${user.website}`,
      );
    }
  }

  function checkPreview() {
    if (
      !user.preview ||
      (user.preview instanceof String &&
        (user.preview.startsWith('http') || user.preview.startsWith('//')))
    ) {
      throw new Error(
        `Site has bad image preview=[${user.preview}].\nThe image should be hosted on Docusaurus site, and not use remote HTTP or HTTPS URLs`,
      );
    }
  }

  function checkTags() {
    if (!user.tags || !(user.tags instanceof Array) || user.tags.includes('')) {
      throw new Error(`Bad showcase tags=[${JSON.stringify(user.tags)}]`);
    }
    const unknownTags = difference(user.tags, TagList);
    if (unknownTags.length > 0) {
      throw new Error(
        `Unknown tags=[${unknownTags.join(
          ',',
        )}\nThe available tags are ${TagList.join(',')}`,
      );
    }
  }

  function checkOpenSource() {
    if (typeof user.source === 'undefined') {
      throw new Error(
        "The source attribute is required.\nIf your Docusaurus site is not open-source, please make it explicit with 'source: null'",
      );
    } else {
      const hasOpenSourceTag = user.tags.includes('opensource');
      if (user.source === null && hasOpenSourceTag) {
        throw new Error(
          "You can't add the opensource tag to a site that does not have a link to source code.",
        );
      } else if (user.source && !hasOpenSourceTag) {
        throw new Error(
          "For open-source sites, please add the 'opensource' tag",
        );
      }
    }
  }

  try {
    checkFields();
    checkTitle();
    checkDescription();
    checkWebsite();
    checkPreview();
    checkTags();
    checkOpenSource();
  } catch (e) {
    throw new Error(
      `Showcase site with title=${user.title} contains errors:\n${e.message}`,
    );
  }
}

Users.forEach(ensureUserValid);
