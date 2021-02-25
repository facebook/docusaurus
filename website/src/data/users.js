/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * ADD YOUR SITE TO DOCUSAURUS SHOWCASE:
 *
 * Requirements for adding your site to our showcase:
 * - It is a real site with real content and customizations (different enough from init templates)
 * - It has a stable domain name (a random Netlify/Vercel domain is not allowed)
 * - The code is publicly available
 *
 * Instructions:
 * - Add your site in the json array below, in alphabetical order of title
 * - Add a local image preview (decent screenshot of your Docusaurus site)
 *
 * The image must be added to the GitHub repository, and use `require("image")`
 *
 * Example PR: https://github.com/facebook/docusaurus/pull/3976
 *
 * If you edit this file through the Github interface, you can:
 * - Submit first your users.js edit PR
 * - This will create a branch on your Docusaurus fork (usually "patch-1")
 * - Go to https://github.com/<username>/docusaurus/tree/<branch>/website/src/data/showcase
 * - Drag-and-drop an image here to add it to your existing PR
 *
 */

// prettier-ignore
const users = [
  {
    title: 'AgileTs',
    description: 'Global State and Logic Framework for reactive Applications',
    preview: require('./showcase/agilets.png'),
    website: 'https://agile-ts.org/',
    source: 'https://github.com/agile-ts/documentation',
    tags: ['design'],
  },
  {
    title: 'AI-Speaker',
    description: 'Local, reliable, fast and private Audio and IoT gate.',
    preview: require('./showcase/aispeaker.png'),
    website: 'https://ai-speaker.com/',
    source: 'https://github.com/sviete/AIS-WWW',
    tags: [],
  },
  {
    title: 'Algolia Docsearch',
    description:
      'The best search experience for docs, integrates in minutes, for free',
    preview: require('./showcase/algolia.png'),
    website: 'https://docsearch.algolia.com/',
    source: 'https://github.com/algolia/docsearch-website',
    tags: ['highlight', 'design'],
  },
  {
    title: 'Amphora Data',
    description: 'Connecting the world’s real-time information',
    preview: require('./showcase/amphora.png'),
    website: 'https://www.amphoradata.com/',
    source: 'https://github.com/amphoradata/amphoradata.github.io',
    tags: ['large'],
  },
  {
    title: 'Axioms',
    description: 'Axioms Developer Hub and Documentation Portal',
    preview: require('./showcase/axioms.png'),
    website: 'https://developer.axioms.io/',
    source: 'https://github.com/axioms-io/developer',
    tags: ['large'],
  },
  {
    title: 'Benthos',
    description: 'A stream processor for mundane tasks',
    preview: require('./showcase/benthos.png'),
    website: 'https://benthos.dev/',
    source: 'https://github.com/Jeffail/benthos',
    tags: ['design', 'large'],
  },
  {
    title: 'Botonic',
    description: 'Build Chatbots and Conversational Apps Using React',
    preview: require('./showcase/botonic.png'),
    website: 'https://botonic.io/',
    source: 'https://github.com/hubtype/botonic',
    tags: ['large'],
  },
  {
    title: 'Build Tracker',
    description:
      'Track performance budgets & prevent unexpected bloat in your app',
    preview: require('./showcase/build-tracker.png'),
    website: 'https://buildtracker.dev',
    source: 'https://github.com/paularmstrong/build-tracker',
    tags: [],
  },
  {
    title: 'Channel.js',
    description: 'The missing constructor for creating safe async iterators',
    preview: require('./showcase/channeljs.png'),
    website: 'https://repeater.js.org/',
    source: 'https://github.com/repeaterjs/repeater',
    tags: [],
  },
  {
    title: 'Clutch',
    description: 'An extensible API and UI platform for infrastructure tooling',
    preview: require('./showcase/clutch.png'),
    website: 'https://clutch.sh/',
    source: 'https://github.com/lyft/clutch',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Component Kit',
    description: 'A declarative UI framework for iOS',
    preview: require('./showcase/componentkit.png'),
    website: 'https://componentkit.org',
    source: 'https://github.com/facebook/componentkit',
    tags: ['highlight', 'facebook'],
  },
  {
    title: 'ConfigCat Feature Flags',
    description: 'A feature flag and remote configuration service.',
    preview: require('./showcase/configcat.png'),
    website: 'https://configcat.com/docs/',
    source: 'https://github.com/configcat/docs',
    tags: ['large'],
  },
  {
    title: 'Console Table',
    description: 'Printing Pretty Tables on your console.',
    preview: require('./showcase/console-table.png'),
    website: 'https://console-table.netlify.app/',
    source: 'https://github.com/ayonious/console-table-docu',
    tags: [],
  },
  {
    title: 'Create React App',
    description: 'Set up a modern web app by running one command',
    preview: require('./showcase/create-react-app.png'),
    website: 'https://facebook.github.io/create-react-app/',
    source: 'https://github.com/facebook/create-react-app',
    tags: ['highlight', 'design', 'large', 'facebook'],
  },
  {
    title: 'Datagit',
    description:
      'A persian tutorial website strive to make quality education for everyone.',
    preview: require('./showcase/datagit.png'),
    website: 'https://datagit.ir/',
    source: 'https://github.com/massoudmaboudi/datagit_v2.docusaurus',
    tags: ['rtl'],
  },
  {
    title: 'DevSpace',
    description: 'Deploy & Develop Kubernetes Apps',
    preview: require('./showcase/devspace.png'),
    website: 'https://devspace.sh/cli/docs/',
    source: 'https://github.com/loft-sh/devspace',
    tags: [],
  },
  {
    title: 'Diem',
    description: 'A decentralized, programmable database which provides a financial infrastructure that can empower billions of people.',
    preview: require('./showcase/diem.png'),
    website: 'https://developers.libra.org',
    source: 'https://github.com/diem/diem',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Draft.js',
    description: 'Rich Text Editor Framework for React',
    preview: require('./showcase/draftjs.png'),
    website: 'https://draftjs.org/',
    source: 'https://github.com/facebook/draft-js',
    tags: [],
  },
  {
    title: 'Eightshift Docs',
    description: 'All the tools you need to start building a modern WordPress project, using all the latest development tools.',
    preview: require('./showcase/eightshift-docs.png'),
    website: 'https://infinum.github.io/eightshift-docs/',
    source: 'https://github.com/infinum/eightshift-docs',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Erxes',
    description: 'Combine all your business tools into one streamlined and integrated open-source framework',
    preview: require('./showcase/erxes.png'),
    website: 'https://docs.erxes.io/',
    source: 'https://github.com/erxes/erxes',
    tags: ['design'],
  },
  {
    title: 'Eta',
    description: 'Faster embedded JS template engine in TypeScript',
    preview: require('./showcase/eta.png'),
    website: 'https://eta.js.org/',
    source: 'https://github.com/eta-dev/eta',
    tags: ['design'],
  },
  {
    title: 'FBT',
    description: 'An internationalization framework',
    preview: require('./showcase/fbt.png'),
    website: 'https://facebookincubator.github.io/fbt/',
    source: 'https://github.com/facebook/fbt',
    tags: ['facebook'],
  },
  {
    title: 'Flipper',
    description: 'Extensible mobile app debugger',
    preview: require('./showcase/flipper.png'),
    website: 'https://fbflipper.com',
    source: 'https://github.com/facebook/flipper',
    tags: ['design', 'facebook'],
  },
  {
    title: 'FlexIt Analytics',
    description: 'Business Intelligence and Data Analytics platform',
    preview: require('./showcase/flexit.png'),
    website: 'https://learn.flexitanalytics.com/',
    source: 'https://github.com/ataft/flexit-docs',
    tags: ['design', 'large'],
  },
  {
    title: 'Flux',
    description: 'Application architecture for building user interfaces',
    preview: require('./showcase/flux.png'),
    website: 'https://facebook.github.io/flux/',
    source: 'https://github.com/facebook/flux',
    tags: ['facebook'],
  },
  {
    title: 'FoalTS',
    description: 'Node.JS framework for building web applications',
    preview: require('./showcase/foal.png'),
    website: 'https://foalts.org/',
    source: 'https://github.com/FoalTS/foal/tree/master/docs',
    tags: ['highlight', 'design', 'large', 'versioning', 'i18n'],
  },
  {
    title: 'GraphQL Code Generator',
    description:
      'Generate code from your GraphQL schema and operations with a simple CLI',
    preview: require('./showcase/graphql-codegen.png'),
    website: 'https://graphql-code-generator.com/',
    source: 'https://github.com/dotansimha/graphql-code-generator',
    tags: ['design', 'large'],
  },
  {
    title: 'GraphQL Inspector',
    description: 'An open-source tool to help you work with GraphQL',
    preview: require('./showcase/graphql-inspector.png'),
    website: 'https://graphql-inspector.com',
    source: 'https://github.com/kamilkisiela/graphql-inspector',
    tags: ['highlight', 'design'],
  },
  {
    title: 'GraphQL Mesh',
    description: 'Query anything, run everywhere',
    preview: require('./showcase/graphql-mesh.png'),
    website: 'https://graphql-mesh.com',
    source: 'https://github.com/urigo/graphql-mesh',
    tags: ['large'],
  },
  {
    title: 'Gulp',
    description: 'A toolkit to automate & enhance your workflow',
    preview: require('./showcase/gulp.png'),
    website: 'https://gulpjs.com',
    source: 'https://github.com/gulpjs/gulp',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Hashnode Support',
    description: 'A help portal for Hashnode users',
    preview: require('./showcase/hashnode.png'),
    website: 'https://support.hashnode.com/',
    source: 'https://github.com/Hashnode/support',
    tags: ['highlight', 'large'],
  },
  {
    title: 'Hermes',
    description: 'JavaScript engine optimized for React Native',
    preview: require('./showcase/hermes.png'),
    website: 'https://hermesengine.dev',
    source: 'https://github.com/facebook/hermes',
    tags: ['facebook'],
  },
  {
    title: 'Home Assistant',
    description: 'All you need to start developing',
    preview: require('./showcase/home-assistant.png'),
    website: 'https://developers.home-assistant.io/',
    source: 'https://github.com/home-assistant/core',
    tags: ['large'],
  },
  {
    title: 'Idb',
    description: 'iOS Development Bridge',
    preview: require('./showcase/idb.png'),
    website: 'https://www.fbidb.io/',
    source: 'https://github.com/facebook/idb',
    tags: ['facebook'],
  },
  {
    title: 'mailgo',
    description: 'A new concept of mailto and tel links',
    preview: require('./showcase/mailgo.png'),
    website: 'https://mailgo.js.org/',
    source: 'https://github.com/manzinello/mailgo',
    tags: ['design', 'large'],
  },
  {
    title: 'MBT Bundle',
    description: 'An open source model-based testing tool',
    preview: require('./showcase/mbt-bundle.png'),
    website: 'https://mbtbundle.org',
    source: 'https://github.com/tienvx/mbt-bundle',
    tags: [],
  },
  {
    title: 'Metro',
    description: 'The JavaScript bundler for React Native',
    preview: require('./showcase/metro.png'),
    website: 'https://facebook.github.io/metro/',
    source: 'https://github.com/facebook/metro',
    tags: ['facebook'],
  },
  {
    title: 'MikroORM',
    description: 'TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns.',
    preview: require('./showcase/mikro-orm.png'),
    website: 'https://mikro-orm.io',
    source: 'https://github.com/mikro-orm/mikro-orm',
    tags: ['highlight', 'large', 'versioning'],
  },
  {
    title: 'Motion Layout',
    description:
      'Create beautiful immersive React.js animations using shared components',
    preview: require('./showcase/motion-layout.png'),
    website: 'https://motion-layout.azurewebsites.net',
    source: 'https://github.com/jeffersonlicet/react-motion-layout',
    tags: ['design'],
  },
  {
    title: 'Neutron JS',
    description: 'An open source CLI to work with Redux + Redux Saga',
    preview: require('./showcase/neutronjs.png'),
    website: 'https://www.neutronjs.com/',
    source: 'https://github.com/neutronjs/neutron-cli',
    tags: ['versioning'],
  },
  {
    title: 'NextAuth.js',
    description: 'An open source serverless authentication library for next.js',
    preview: require('./showcase/nextauthjs.png'),
    website: 'https://next-auth.js.org/',
    source: 'https://github.com/nextauthjs/next-auth',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Node SerialPort',
    description: 'Talk to your Serial devices',
    preview: require('./showcase/node-serialport.png'),
    website: 'https://serialport.io',
    source: 'https://github.com/serialport/node-serialport',
    tags: ['large', 'versioning'],
  },
  {
    title: 'Nodify',
    description: 'High-performance WPF node editor component designed for MVVM.',
    preview: require('./showcase/nodify.png'),
    website: 'https://miroiu.github.io/nodify/',
    source: 'https://github.com/miroiu/nodify',
    tags: ['design'],
  },
  {
    title: 'Oxidizer',
    description: 'A Rust ORM based on tokio-postgres and refinery',
    preview: require('./showcase/oxidizer.png'),
    website: 'https://oxidizer.rs',
    source: 'https://github.com/oxidizer-rs/website',
    tags: ['design'],
  },
  {
    title: 'Paubox',
    description: 'Paubox API Documentation',
    preview: require('./showcase/paubox.png'),
    website: 'https://docs.paubox.com/',
    tags: [],
  },
  {
    title: 'Power\'s Wiki',
    description: 'An example of personal wiki ',
    preview: require('./showcase/power.png'),
    website: 'https://wiki-power.com/',
    source: 'https://github.com/linyuxuanlin/Wiki_Docusaurus',
    tags: ['large', 'personal'],
  },
  {
    title: 'Profilo',
    description: 'An Android performance library',
    preview: require('./showcase/profolo.png'),
    website: 'https://facebookincubator.github.io/profilo/',
    source: 'https://github.com/facebookincubator/profilo',
    tags: ['facebook'],
  },
  {
    title: 'Pyre',
    description: 'A performant type-checker for Python 3',
    preview: require('./showcase/pyre.png'),
    website: 'https://pyre-check.org',
    source: 'https://github.com/facebook/pyre-check',
    tags: ['facebook', 'large'],
  },
  {
    title: 'QA-Board',
    description:
      'An open source run-tracker for algorithm and performance engineering with rich visualizations',
    preview: require('./showcase/qa-board.png'),
    website: 'https://samsung.github.io/qaboard/',
    source: 'https://github.com/Samsung/qaboard',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'QuestDB',
    description:
      'An open source SQL database designed to process time series data',
    preview: require('./showcase/questdb.png'),
    website: 'https://questdb.io',
    source: 'https://github.com/questdb/questdb.io',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'React-Leaflet',
    description: 'React components for Leaflet maps',
    preview: require('./showcase/react-leaflet.png'),
    website: 'https://react-leaflet.js.org/',
    source: 'https://github.com/PaulLeCam/react-leaflet',
    tags: [],
  },
  {
    title: 'React Native',
    description: 'A framework for building native apps using React',
    preview: require('./showcase/reactnative.png'),
    website: 'https://reactnative.dev',
    source: 'https://github.com/facebook/react-native-website',
    tags: ['facebook', 'large', 'highlight', 'design', 'versioning'],
  },
  {
    title: 'React Native Elements',
    description: 'Cross Platform React Native UI Toolkit',
    preview: require('./showcase/react-native-elements.png'),
    website: 'https://react-native-training.github.io/react-native-elements/',
    source: 'https://github.com/react-native-elements/react-native-elements',
    tags: ['large', 'highlight', 'design', 'versioning'],
  },
  {
    title: 'react-native-ios-kit',
    description: 'The missing React Native UI Kit for iOS.',
    preview: require('./showcase/react-native-ios-kit.png'),
    website: 'https://callstack.github.io/react-native-ios-kit',
    source: 'https://github.com/callstack/react-native-ios-kit',
    tags: [],
  },
  {
    title: 'React Native Testing Library',
    description: 'Helps you to write better tests with less effort.',
    preview: require('./showcase/react-native-testing-library.png'),
    website: 'https://callstack.github.io/react-native-testing-library/',
    source: 'https://github.com/callstack/react-native-testing-library',
    tags: [],
  },
  {
    title: 'React Redux',
    description: 'Official React bindings for Redux',
    preview: require('./showcase/react-redux.png'),
    website: 'https://react-redux.js.org',
    source: 'https://www.github.com/reduxjs/react-redux',
    tags: ['highlight', 'large', 'versioning'],
  },
  {
    title: 'Redux',
    description: 'A Predictable State Container for JS Apps',
    preview: require('./showcase/redux.png'),
    website: 'https://redux.js.org/',
    source: 'https://www.github.com/reduxjs/redux',
    tags: ['highlight', 'large'],
  },
  {
    title: 'Rematch',
    description: 'Redux best practices without the boilerplate in less than 2kb',
    preview: require('./showcase/rematch.png'),
    website: 'https://rematchjs.org',
    source: 'https://github.com/rematch/rematch',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Rooks',
    description: 'Supercharge your components with this collection of React hooks.',
    preview: require('./showcase/rooks.png'),
    website: 'https://react-hooks.org/',
    source: 'https://github.com/imbhargav5/rooks',
    tags: ['large', 'versioning'],
  },
  {
    title: 'Runlet',
    description: 'A cloud-based job manager that integrates your devices',
    preview: require('./showcase/runlet.png'),
    website: 'https://runlet.app',
    source: 'https://github.com/runletapp/website',
    tags: ['design'],
  },
  {
    title: 'Saleor',
    description: 'Saleor Documentation',
    preview: require('./showcase/saleor.png'),
    website: 'https://docs.getsaleor.com/',
    source: 'https://github.com/mirumee/saleor-docs',
    tags: ['design', 'large', 'versioning'],
  },
  {
    title: 'SCI WP Framework',
    description: 'A PHP framework to create MVC plugins for WordPress',
    preview: require('./showcase/sciwp.png'),
    website: 'https://sciwp.com/',
    source: 'https://github.com/sciwp/sciwp-framework',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'single-spa',
    description: 'A javascript router for front-end microservices',
    preview: require('./showcase/single-spa.png'),
    website: 'https://single-spa.js.org/',
    source: 'https://github.com/single-spa/single-spa',
    tags: ['highlight', 'large', 'versioning', 'i18n'],
  },
  {
    title: 'smash.gg',
    description: 'Turning passions into careers',
    preview: require('./showcase/smashgg.png'),
    website: 'https://developer.smash.gg',
    tags: ['large'],
  },
  {
    title: 'SpotifyAPI-NET',
    description: 'A Client for the Spotify Web API, written in C#/.NET',
    preview: require('./showcase/spotifyapi-net.png'),
    website: 'https://johnnycrazy.github.io/SpotifyAPI-NET/',
    source: 'https://github.com/JohnnyCrazy/SpotifyAPI-NET',
    tags: ['versioning'],
  },
  {
    title: 'Supabase',
    description: 'Open Source Realtime and RESTful APIs for Postgres',
    preview: require('./showcase/supabase.png'),
    website: 'https://www.supabase.io/',
    source: 'https://github.com/supabase/monorepo',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'T-Regx',
    description: 'Programmer-oriented Regular Expressions library for PHP',
    preview: require('./showcase/t-regx.png'),
    website: 'https://t-regx.com/',
    source: 'https://github.com/T-Regx/T-Regx',
    tags: ['design', 'large'],
  },
  {
    title: 'Taro',
    description: 'An open cross-end and cross-frame solution',
    preview: require('./showcase/docs-taro-zone.png'),
    website: 'https://docs.taro.zone/',
    source: 'https://github.com/NervJS/taro',
    tags: ['versioning', 'large'],
  },
  {
    title: 'Testing Library',
    description: 'Simple and complete testing utilities that encourage good testing practices',
    preview: require('./showcase/testing-library.png'),
    website: 'https://testing-library.com/',
    source: 'https://github.com/testing-library/testing-library-docs',
    tags: ['design', 'large'],
  },
  {
    title: 'Tasit',
    description:
      'A JavaScript SDK for building native mobile Ethereum dapps with React Native',
    preview: require('./showcase/tasit.png'),
    website: 'https://docs.tasit.io/',
    source: 'https://github.com/tasitlabs/tasit-sdk',
    tags: [],
  },
  {
    title: 'The Diff Podcast',
    description: 'A Podcast from Facebook Open Source',
    preview: require('./showcase/the-diff.png'),
    website: 'https://thediffpodcast.com',
    tags: ['facebook'],
  },
  {
    title: 'Tourmaline',
    description:
      'Fast and performant Telegram bot framework for the Crystal programming language',
    preview: require('./showcase/tourmaline.png'),
    website: 'https://tourmaline.dev',
    source: 'https://github.com/protoncr/tourmaline',
    tags: [],
  },
  {
    title: 'uniforms',
    description: 'A set of React libraries for building forms',
    preview: require('./showcase/uniforms.png'),
    website: 'https://uniforms.tools/',
    source: 'https://github.com/vazco/uniforms',
    tags: ['design', 'large', 'highlight'],
  },
  {
    title: 'Vector',
    description: 'A High-Performance, Logs, Metrics, & Events Router',
    preview: require('./showcase/vector.png'),
    website: 'https://vector.dev/',
    source: 'https://github.com/timberio/vector',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'Vue NodeGui',
    description: 'A cross-platform native desktop app library',
    preview: require('./showcase/vue-nodegui.png'),
    website: 'https://vue.nodegui.org/',
    source: 'https://github.com/nodegui/vue-nodegui',
    tags: ['design'],
  },
  {
    title: 'Wasp',
    description:
      'A DSL for building full-stack web apps with less boilerplate.',
    preview: require('./showcase/wasp.png'),
    website: 'https://wasp-lang.dev/',
    source: 'https://github.com/wasp-lang/wasp',
    tags: ['highlight', 'design', 'large'],
  },
  {
    title: 'WebdriverIO',
    description:
      'Next-gen browser and mobile automation test framework for Node.js',
    preview: require('./showcase/webdriverio.png'),
    website: 'https://webdriver.io/',
    source: 'https://github.com/webdriverio/webdriverio',
    tags: ['design', 'large'],
  },
  {
    title: 'Wisdom',
    description: 'Session replay web analytics with open data SQL/S3 access.',
    preview: require('./showcase/wisdom.png'),
    website: 'https://developers.getwisdom.io/',
    source: 'https://github.com/Wisdom/dev-docs',
    tags: ['design', 'large'],
  },
];

users.forEach((user) => {
  if (
    !user.preview ||
    (user.preview instanceof String &&
      (user.preview.startsWith('http') || user.preview.startsWith('//')))
  ) {
    throw new Error(
      `Bad user site image preview = ${user.preview}. The image should be hosted on Docusaurus site, and not use remote HTTP or HTTPS URLs`,
    );
  }
});

export default users;
