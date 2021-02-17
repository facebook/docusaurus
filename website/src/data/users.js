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
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'AI-Speaker',
    description: 'Local, reliable, fast and private Audio and IoT gate.',
    preview: require('./showcase/aispeaker.png'),
    website: 'https://ai-speaker.com/',
    source: 'https://github.com/sviete/AIS-WWW',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Algolia Docsearch',
    description:
      'The best search experience for docs, integrates in minutes, for free',
    preview: require('./showcase/algolia.png'),
    website: 'https://docsearch.algolia.com/',
    source: 'https://github.com/algolia/docsearch-website',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Amphora Data',
    description: 'Connecting the world’s real-time information',
    preview: require('./showcase/amphora.png'),
    website: 'https://www.amphoradata.com/',
    source: 'https://github.com/amphoradata/amphoradata.github.io',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Apache APISIX',
    description: 'A Dynamic, Real-Time, High-Performance Cloud-Native API Gateway',
    preview: require('./showcase/apache-apisix.png'),
    website: 'https://apisix.apache.org/',
    source: 'https://github.com/apache/apisix-website',
    fbOpenSource: false,
    pinned: true,
  },
  {
    title: 'Axioms',
    description: 'Axioms Developer Hub and Documentation Portal',
    preview: require('./showcase/axioms.png'),
    website: 'https://developer.axioms.io/',
    source: 'https://github.com/axioms-io/developer',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Benthos',
    description: 'A stream processor for mundane tasks',
    preview: require('./showcase/benthos.png'),
    website: 'https://benthos.dev/',
    source: 'https://github.com/Jeffail/benthos',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Botonic',
    description: 'Build Chatbots and Conversational Apps Using React',
    preview: require('./showcase/botonic.png'),
    website: 'https://botonic.io/',
    source: 'https://github.com/hubtype/botonic',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Build Tracker',
    description:
      'Track performance budgets & prevent unexpected bloat in your app',
    preview: require('./showcase/build-tracker.png'),
    website: 'https://buildtracker.dev',
    source: 'https://github.com/paularmstrong/build-tracker',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Channel.js',
    description: 'The missing constructor for creating safe async iterators',
    preview: require('./showcase/channeljs.png'),
    website: 'https://repeater.js.org/',
    source: 'https://github.com/repeaterjs/repeater',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Clutch',
    description: 'An extensible API and UI platform for infrastructure tooling',
    preview: require('./showcase/clutch.png'),
    website: 'https://clutch.sh/',
    source: 'https://github.com/lyft/clutch',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Component Kit',
    description: 'A declarative UI framework for iOS',
    preview: require('./showcase/componentkit.png'),
    website: 'https://componentkit.org',
    source: 'https://github.com/facebook/componentkit',
    fbOpenSource: true,
    pinned: true,
  },
  {
    title: 'ConfigCat Feature Flags',
    description: 'A feature flag and remote configuration service.',
    preview: require('./showcase/configcat.png'),
    website: 'https://configcat.com/docs/',
    source: 'https://github.com/configcat/docs',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Console Table',
    description: 'Printing Pretty Tables on your console.',
    preview: require('./showcase/console-table.png'),
    website: 'https://console-table.netlify.app/',
    source: 'https://github.com/ayonious/console-table-docu',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Datagit',
    description:
      'A persian tutorial website strive to make quality education for everyone.',
    preview: require('./showcase/datagit.png'),
    website: 'https://datagit.ir/',
    source: 'https://github.com/massoudmaboudi/datagit_v2.docusaurus',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Eightshift Docs',
    description: 'All the tools you need to start building a modern WordPress project, using all the latest development tools.',
    preview: require('./showcase/eightshift-docs.png'),
    website: 'https://infinum.github.io/eightshift-docs/',
    source: 'https://github.com/infinum/eightshift-docs',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Eta',
    description: 'Faster embedded JS template engine in TypeScript',
    preview: require('./showcase/eta.png'),
    website: 'https://eta.js.org/',
    source: 'https://github.com/eta-dev/eta',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'FlexIt Analytics',
    description: 'Business Intelligence and Data Analytics platform',
    preview: require('./showcase/flexit.png'),
    website: 'https://learn.flexitanalytics.com/',
    source: 'https://github.com/ataft/flexit-docs',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Flux',
    description: 'Application architecture for building user interfaces',
    preview: require('./showcase/flux.png'),
    website: 'https://facebook.github.io/flux/',
    source: 'https://github.com/facebook/flux',
    fbOpenSource: true,
    pinned: true,
  },
  {
    title: 'FoalTS',
    description: 'Node.JS framework for building web applications',
    preview: require('./showcase/foal.png'),
    website: 'https://foalts.org/',
    source: 'https://github.com/FoalTS/foal/tree/master/docs',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'GraphQL Code Generator',
    description:
      'Generate code from your GraphQL schema and operations with a simple CLI',
    preview: require('./showcase/graphql-codegen.png'),
    website: 'https://graphql-code-generator.com/',
    source: 'https://github.com/dotansimha/graphql-code-generator',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'GraphQL Inspector',
    description: 'An open-source tool to help you work with GraphQL',
    preview: require('./showcase/graphql-inspector.png'),
    website: 'https://graphql-inspector.com',
    source: 'https://github.com/kamilkisiela/graphql-inspector',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'GraphQL Mesh',
    description: 'Query anything, run everywhere',
    preview: require('./showcase/graphql-mesh.png'),
    website: 'https://graphql-mesh.com',
    source: 'https://github.com/urigo/graphql-mesh',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Hashnode Support',
    description: 'A help portal for Hashnode users',
    preview: require('./showcase/hashnode.png'),
    website: 'https://support.hashnode.com/',
    source: 'https://github.com/Hashnode/support',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Hermes',
    description: 'JavaScript engine optimized for React Native',
    preview: require('./showcase/hermes.png'),
    website: 'https://hermesengine.dev',
    source: 'https://github.com/facebook/hermes',
    fbOpenSource: true,
    pinned: true,
  },
  {
    title: 'SICOPE Model',
    description: 'An open source model-based testing tool for web applications',
    preview: require('./showcase/sicope-model.png'),
    website: 'https://sicope-model.github.io/',
    source: 'https://github.com/sicope-model/sicope-model',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'MikroORM',
    description: 'TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns.',
    preview: require('./showcase/mikro-orm.png'),
    website: 'https://mikro-orm.io',
    source: 'https://github.com/mikro-orm/mikro-orm',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Motion Layout',
    description:
      'Create beautiful immersive React.js animations using shared components',
    preview: require('./showcase/motion-layout.png'),
    website: 'https://motion-layout.azurewebsites.net',
    source: 'https://github.com/jeffersonlicet/react-motion-layout',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Neutron JS',
    description: 'An open source CLI to work with Redux + Redux Saga',
    preview: require('./showcase/neutronjs.png'),
    website: 'https://www.neutronjs.com/',
    source: 'https://github.com/neutronjs/neutron-cli',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'NextAuth.js',
    description: 'An open source serverless authentication library for next.js',
    preview: require('./showcase/nextauthjs.png'),
    website: 'https://next-auth.js.org/',
    source: 'https://github.com/nextauthjs/next-auth',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Nodify',
    description: 'High-performance WPF node editor component designed for MVVM.',
    preview: require('./showcase/nodify.png'),
    website: 'https://miroiu.github.io/nodify/',
    source: 'https://github.com/miroiu/nodify',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Oxidizer',
    description: 'A Rust ORM based on tokio-postgres and refinery',
    preview: require('./showcase/oxidizer.png'),
    website: 'https://oxidizer.rs',
    source: 'https://github.com/oxidizer-rs/website',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Power\'s Wiki',
    description: 'An example of personal wiki ',
    preview: require('./showcase/power.png'),
    website: 'https://wiki-power.com/',
    source: 'https://github.com/linyuxuanlin/Wiki_Docusaurus',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'QA-Board',
    description:
      'An open source run-tracker for algorithm and performance engineering with rich visualizations',
    preview: require('./showcase/qa-board.png'),
    website: 'https://samsung.github.io/qaboard/',
    source: 'https://github.com/Samsung/qaboard',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'QuestDB',
    description:
      'An open source SQL database designed to process time series data',
    preview: require('./showcase/questdb.png'),
    website: 'https://questdb.io',
    source: 'https://github.com/questdb/questdb.io',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'React Native',
    description: 'A framework for building native apps using React',
    preview: require('./showcase/reactnative.png'),
    website: 'https://reactnative.dev',
    source: 'https://github.com/facebook/react-native-website',
    fbOpenSource: true,
    pinned: false,
  },
  {
    title: 'Rematch',
    description: 'Redux best practices without the boilerplate in less than 2kb',
    preview: require('./showcase/rematch.png'),
    website: 'https://rematchjs.org',
    source: 'https://github.com/rematch/rematch',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Rooks',
    description: 'Supercharge your components with this collection of React hooks.',
    preview: require('./showcase/rooks.png'),
    website: 'https://react-hooks.org/',
    source: 'https://github.com/imbhargav5/rooks',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Runlet',
    description: 'A cloud-based job manager that integrates your devices',
    preview: require('./showcase/runlet.png'),
    website: 'https://runlet.app',
    source: 'https://github.com/runletapp/website',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'SCI WP Framework',
    description: 'A PHP framework to create MVC plugins for WordPress',
    preview: require('./showcase/sciwp.png'),
    website: 'https://sciwp.com/',
    source: 'https://github.com/sciwp/sciwp-framework',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'SpotifyAPI-NET',
    description: 'A Client for the Spotify Web API, written in C#/.NET',
    preview: require('./showcase/spotifyapi-net.png'),
    website: 'https://johnnycrazy.github.io/SpotifyAPI-NET/',
    source: 'https://github.com/JohnnyCrazy/SpotifyAPI-NET',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Supabase',
    description: 'Open Source Realtime and RESTful APIs for Postgres',
    preview: require('./showcase/supabase.png'),
    website: 'https://www.supabase.io/',
    source: 'https://github.com/supabase/monorepo',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'T-Regx',
    description: 'Programmer-oriented Regular Expressions library for PHP',
    preview: require('./showcase/t-regx.png'),
    website: 'https://t-regx.com/',
    source: 'https://github.com/T-Regx/T-Regx',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Taro',
    description: 'An open cross-end and cross-frame solution',
    preview: require('./showcase/docs-taro-zone.png'),
    website: 'https://docs.taro.zone/',
    source: 'https://github.com/NervJS/taro',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Tasit',
    description:
      'A JavaScript SDK for building native mobile Ethereum dapps with React Native',
    preview: require('./showcase/tasit.png'),
    website: 'https://docs.tasit.io/',
    source: 'https://github.com/tasitlabs/tasit-sdk',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Tourmaline',
    description:
      'Fast and performant Telegram bot framework for the Crystal programming language',
    preview: require('./showcase/tourmaline.png'),
    website: 'https://tourmaline.dev',
    source: 'https://github.com/protoncr/tourmaline',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'uniforms',
    description: 'A set of React libraries for building forms',
    preview: require('./showcase/uniforms.png'),
    website: 'https://uniforms.tools/',
    source: 'https://github.com/vazco/uniforms',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Vector',
    description: 'A High-Performance, Logs, Metrics, & Events Router',
    preview: require('./showcase/vector.png'),
    website: 'https://vector.dev/',
    source: 'https://github.com/timberio/vector',
    fbOpenSource: false,
    pinned: true,
  },
  {
    title: 'Vue NodeGui',
    description: 'A cross-platform native desktop app library',
    preview: require('./showcase/vue-nodegui.png'),
    website: 'https://vue.nodegui.org/',
    source: 'https://github.com/nodegui/vue-nodegui',
    fbOpenSource: false,
    pinned: true,
  },
  {
    title: 'Wasp',
    description:
      'A DSL for building full-stack web apps with less boilerplate.',
    preview: require('./showcase/wasp.png'),
    website: 'https://wasp-lang.dev/',
    source: 'https://github.com/wasp-lang/wasp',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'WebdriverIO',
    description:
      'Next-gen browser and mobile automation test framework for Node.js',
    preview: require('./showcase/webdriverio.png'),
    website: 'https://webdriver.io/',
    source: 'https://github.com/webdriverio/webdriverio',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Wisdom',
    description: 'Session replay web analytics with open data SQL/S3 access.',
    preview: require('./showcase/wisdom.png'),
    website: 'https://developers.getwisdom.io/',
    source: 'https://github.com/Wisdom/dev-docs',
    fbOpenSource: false,
    pinned: false,
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
