/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import {sortBy} from '@site/src/utils/jsUtils';

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
 * - Use relevant tags to qualify your site (read the tag descriptions below)
 * - The image MUST be added to the GitHub repository, and use `require("image")`
 * - The image has to have minimum width 640 and an aspect of no wider than 2:1
 * - Open a PR and check for reported CI errors
 *
 * Example PR: https://github.com/facebook/docusaurus/pull/3976
 *
 * If you edit this file through the Github interface, you can:
 * - Submit first your users.tsx edit PR
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

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'i18n'
  | 'versioning'
  | 'large'
  | 'meta'
  | 'personal'
  | 'rtl';

export type User = {
  title: string;
  description: string;
  preview: any;
  website: string;
  source: string | null;
  tags: TagType[];
};

// LIST OF AVAILABLE TAGS
// Available tags to assign to your site
// Please choose all tags that you think might apply.
// We'll remove inappropriate tags, but it's less likely that we add tags.
export const Tags: Record<TagType, Tag> = {
  // DO NOT USE THIS TAG: we choose sites to add to favorites
  favorite: {
    label: 'Favorite',
    description:
      'Our favorite Docusaurus sites that you must absolutely check-out!',
    color: '#e9669e',
  },

  // For open-source sites, a link to the source code is required
  opensource: {
    label: 'Open-Source',
    description: 'Open-Source Docusaurus sites can be useful for inspiration!',
    color: '#39ca30',
  },

  product: {
    label: 'Product',
    description: 'Docusaurus sites associated to a commercial product!',
    color: '#dfd545',
  },

  design: {
    label: 'Design',
    description:
      'Beautiful Docusaurus sites, polished and standing out from the initial template!',
    color: '#a44fb7',
  },

  i18n: {
    label: 'I18n',
    description:
      'Translated Docusaurus sites using the internationalization support with more than 1 locale.',
    color: '#127f82',
  },

  versioning: {
    label: 'Versioning',
    description:
      'Docusaurus sites using the versioning feature of the docs plugin to manage multiple versions.',
    color: '#fe6829',
  },

  // Large Docusaurus sites, with a lot of content (> 200 pages, excluding versions)
  large: {
    label: 'Large',
    description:
      'Very large Docusaurus sites, including many more pages than the average!',
    color: '#8c2f00',
  },

  meta: {
    label: 'Meta',
    description: 'Docusaurus sites of Meta (formerly Facebook) projects',
    color: '#4267b2', // Facebook blue
  },

  personal: {
    label: 'Personal',
    description:
      'Personal websites, blogs and digital gardens built with Docusaurus',
    color: '#14cfc3',
  },

  rtl: {
    label: 'RTL Direction',
    description:
      'Docusaurus sites using the right-to-left reading direction support.',
    color: '#ffcfc3',
  },
};

// Add your site to this list
// prettier-ignore
const Users: User[] = [
  {
    title: 'Aide Jeune',
    description:
      'French Discord server that helps young people who have been bullied or feel bad about themselves',
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
  // TODO site unavailable on 12/31/2021
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
    tags: ['opensource', 'i18n', 'large'],
  },
  {
    title: 'Apex FP',
    description: 'Functional programming library for Salesforce Apex',
    preview: require('./showcase/apexfp.png'),
    website: 'https://www.apexfp.org',
    source: 'https://github.com/ipavlic/apex-fp/tree/master/website',
    tags: ['opensource'],
  },
  {
    title: 'Astronomer',
    description:
      'Enterprise-grade framework for Apache Airflow. Production-ready Airflow environments with just a few clicks',
    preview: require('./showcase/astronomer.png'),
    website: 'https://docs.astronomer.io',
    source: 'https://github.com/astronomer/docs',
    tags: ['product', 'versioning', 'opensource'],
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
  // TODO site unavailable on 12/31/2021
  {
    title: 'Axioms',
    description: 'Axioms Developer Hub and Documentation Portal',
    preview: require('./showcase/axioms.png'),
    website: 'https://developer.axioms.io/',
    source: 'https://github.com/axioms-io/developer',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Bandwidth',
    description:
      'Add powerful communications capabilities to your app from the only API platform with it’s own tier-1 carrier network.',
    preview: require('./showcase/bandwidth.png'),
    website: 'https://dev.bandwidth.com/',
    source: 'https://github.com/Bandwidth/api-docs',
    tags: ['opensource', 'large', 'product'],
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
    description:
      'Documentation for Blink Shell a professional, desktop grade terminal for iOS',
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
    tags: ['opensource', 'personal', 'large'],
  },
  {
    title: 'Blogasaurus',
    description: 'A blog written using Docasaurus.',
    preview: require('./showcase/blogasaurus.png'),
    website: 'https://blog.palashsh.me/',
    source: 'https://github.com/BattleOfPlassey/blogasaurus',
    tags: ['personal', 'opensource'],
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
    title: 'BoxyHQ',
    description: 'Enterprise Readiness made simple',
    preview: require('./showcase/boxyhq.png'),
    website: 'https://boxyhq.com/',
    source: 'https://github.com/boxyhq/website',
    tags: ['opensource'],
  },
  {
    title: 'Discord Resources',
    description: 'All Discord resources in one place',
    preview: require('./showcase/discordresources.png'),
    website: 'https://discordresources.com/',
    source: 'https://github.com/Discord-Resources-Wiki/Discord-Resources-Wiki',
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
    description:
      'Documentation for the Clarity machine learning challenges for improving hearing aid signal processing',
    preview: require('./showcase/claritychallenge.png'),
    website: 'https://claritychallenge.github.io/clarity_CEC1_doc',
    source: 'https://github.com/claritychallenge/clarity_CEC1_doc',
    tags: ['opensource'],
  },
  {
    title: 'Cloudy with a chance of Big Data',
    description:
      'A blog only Docusaurus site showcasing cloud, data and full stack design patterns and tutorials',
    preview: require('./showcase/cloudywithachanceofbigdata.png'),
    website: 'https://cloudywithachanceofbigdata.com/',
    source:
      'https://github.com/cloudywithachanceofbigdata/cloudywithachanceofbigdata.github.io',
    tags: ['opensource', 'personal'],
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
    description:
      'The syllabus for CodeYourFuture - a free code school for refugees, asylum seekers and disadvantaged people',
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
    tags: ['opensource', 'meta'],
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
    title: 'Country State City API',
    description:
      'Get simplified countries, states & cities data without bloating up your database.',
    preview: require('./showcase/countrystatecity.png'),
    website: 'https://countrystatecity.in/',
    source: 'https://github.com/dr5hn/csc-website',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Create React App',
    description: 'Set up a modern web app by running one command',
    preview: require('./showcase/create-react-app.png'),
    website: 'https://facebook.github.io/create-react-app/',
    source: 'https://github.com/facebook/create-react-app',
    tags: ['opensource', 'meta'],
  },
  {
    title: 'CryptoDevHub',
    description:
      'The place where Blockchain- and Crypto developers learn, meet and grow.',
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
    title: 'Darklang',
    description:
      'A new way of building serverless backends, with no infra, framework or deployment nightmares.',
    preview: require('./showcase/darklang.png'),
    website: 'https://docs.darklang.com/',
    source: 'https://github.com/darklang/docs',
    tags: ['product', 'opensource'],
  },
  {
    title: 'Dart Code Metrics',
    description:
      'Static analysis tool that helps analyse and improve Dart code quality.',
    preview: require('./showcase/dart-code-metrics.png'),
    website: 'https://dartcodemetrics.dev/',
    source: 'https://github.com/dart-code-checker/dart-code-metrics',
    tags: ['opensource'],
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
    title: 'Digital Support Services Notes',
    description: 'Open source documented notes for Digital Support Services.',
    preview: require('./showcase/digitalsupportservices.png'),
    website: 'https://notes.nayanpatel.net',
    source: 'https://github.com/PatelN123/Digital-Support-Notes',
    tags: ['opensource', 'design', 'personal'],
  },
  {
    title: 'Djamaile Rahamat',
    description: 'Djamaile Rahamat Blog on making cool stuff',
    preview: require('./showcase/djamaile.png'),
    website: 'https://djamaile.dev/',
    source: 'https://github.com/djamaile/portfolio',
    tags: ['opensource', 'personal'],
  },
  {
    title: 'Draft.js',
    description: 'Rich Text Editor Framework for React',
    preview: require('./showcase/draftjs.png'),
    website: 'https://draftjs.org/',
    source: 'https://github.com/facebook/draft-js',
    tags: ['opensource', 'meta'],
  },
  {
    title: 'Dyte',
    description: 'The most developer friendly live video SDK',
    preview: require('./showcase/dyte.png'),
    source: null,
    website: 'https://docs.dyte.io',
    tags: ['favorite', 'product', 'design', 'versioning', 'large']
  },
  {
    title: 'Easyjwt',
    description: 'JWT creation and validation library',
    preview: require('./showcase/easyjwt.png'),
    website: 'https://www.easyjwt.org',
    source: 'https://github.com/authdog/easyjwt',
    tags: ['opensource', 'i18n'],
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
    title: 'Enarx',
    description:
      'Open source framework for running applications in TEEs (Trusted Execution Environments) based on WebAssembly, allowing developers to deploy architecture-independent applications',
    preview: require('./showcase/enarx.png'),
    website: 'https://enarx.dev/',
    source: 'https://github.com/enarx/enarx.github.io',
    tags: ['opensource']
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
    title: 'Eric JiuRan',
    description: 'Front-end developer blog',
    preview: require('./showcase/eric.png'),
    website: 'https://www.siyuanwa.cn/',
    source: 'https://github.com/1084350607/blog',
    tags: ['opensource', 'personal', 'i18n'],
  },
  {
    title: "Evan Tay's Personal Website",
    description:
      "A Software Engineer's blog, documentation and project portfolio.",
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
    tags: ['opensource', 'meta'],
  },
  {
    title: 'Fenghua Frontend Developer',
    description: 'Blogs and videos about frontend development',
    preview: require('./showcase/zxuqian.png'),
    website: 'https://zxuqian.cn',
    source: null,
    tags: ['personal', 'design'],
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
    title: 'FlatifyCSS',
    description: 'Modern flat design framework for the web — inspired by Duolingo design system.',
    preview: require('./showcase/flatifycss.png'),
    website: 'https://flatifycss.com',
    source: 'https://github.com/amir2mi/flatifycss/',
    tags: ['opensource', 'design'],
  },
  {
    title: 'Flipper',
    description: 'Extensible mobile app debugger',
    preview: require('./showcase/flipper.png'),
    website: 'https://fbflipper.com',
    source: 'https://github.com/facebook/flipper',
    tags: ['opensource', 'design', 'meta'],
  },
  {
    title: 'FlexIt Analytics',
    description: 'Business Intelligence and Data Analytics platform',
    preview: require('./showcase/flexit.png'),
    website: 'https://learn.flexitanalytics.com/',
    source: 'https://github.com/ataft/flexit-docs',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Flux',
    description: 'Application architecture for building user interfaces',
    preview: require('./showcase/flux.png'),
    website: 'https://facebook.github.io/flux/',
    source: 'https://github.com/facebook/flux',
    tags: ['opensource', 'meta'],
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
    title: 'Froggit',
    description: 'French software factory based entirely on Free Software.',
    preview: require('./showcase/froggit.png'),
    website: 'https://www.froggit.fr/',
    source: 'https://lab.frogg.it/froggit/www/froggit.fr',
    tags: ['opensource', 'product'],
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
    title: 'Gotenberg',
    description: 'A Docker-powered stateless API for PDF files',
    preview: require('./showcase/gotenberg.png'),
    website: 'https://gotenberg.dev/',
    source: 'https://github.com/gotenberg/gotenberg.dev',
    tags: ['opensource', 'versioning'],
  },
  {
    title: 'GraphQL Inspector',
    description: 'An open-source tool to help you work with GraphQL',
    preview: require('./showcase/graphql-inspector.png'),
    website: 'https://graphql-inspector.com',
    source: 'https://github.com/kamilkisiela/graphql-inspector',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'GTFS-to-HTML',
    description: 'Generate human-readable HTML timetables from GTFS',
    preview: require('./showcase/gtfs-to-html.png'),
    website: 'https://gtfstohtml.com',
    source: 'https://github.com/BlinkTagInc/gtfs-to-html',
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
    tags: ['opensource', 'meta'],
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
    title: 'icodex',
    description: 'Front end engineer personal website',
    preview: require('./showcase/icodex.png'),
    website: 'https://icodex.me/',
    source: 'https://github.com/wood3n/icodex-next',
    tags: ['opensource', 'personal'],
  },
  {
    title: 'Idb',
    description: 'iOS Development Bridge',
    preview: require('./showcase/idb.png'),
    website: 'https://www.fbidb.io/',
    source: 'https://github.com/facebook/idb',
    tags: ['opensource', 'meta'],
  },
  {
    title: 'IntelAGENT Billing',
    description: 'OHIP Billing Agent',
    preview: require('./showcase/intelagent.png'),
    website: 'https://www.intelagent.ca/',
    source: 'https://github.com/intelagentbilling/docs',
    tags: ['opensource', 'product'],
  },
  {
    title: 'Indent',
    description:
      'Indent provides on-demand access control for cloud apps and infrastructure.',
    preview: require('./showcase/indent.png'),
    website: 'https://indent.com/developers',
    source: null,
    tags: ['product', 'design'],
  },
  {
    title: 'InfraQL Technologies',
    description:
      'InfraQL is a SQL based approach to cloud infrastructure coding, API querying and automation.',
    preview: require('./showcase/infraql-docs.png'),
    website: 'https://docs.infraql.io/',
    source: null,
    tags: ['product'],
  },
  {
    title: 'Ionic',
    description:
      'Ionic is an open source UI toolkit for building performant, high-quality mobile and desktop apps using web technologies.',
    preview: require('./showcase/ionic.png'),
    website: 'https://ionicframework.com/docs',
    source: 'https://github.com/ionic-team/ionic-docs',
    tags: ['favorite', 'opensource', 'product', 'design', 'i18n', 'versioning', 'large'],
  },
  {
    title: 'IOTA-Wiki',
    description: 'Documantation and wiki for the IOTA project',
    preview: require('./showcase/iota-wiki.png'),
    website: 'https://wiki.iota.org',
    source: 'https://github.com/iota-community/iota-wiki',
    tags: ['favorite', 'opensource'],
  },
  {
    title: 'Jest',
    description:
      'Jest is a delightful JavaScript Testing Framework with a focus on simplicity.',
    preview: require('./showcase/jest.png'),
    website: 'https://jestjs.io/',
    source: 'https://github.com/facebook/jest/tree/master/website',
    tags: ['favorite', 'opensource', 'design', 'i18n', 'versioning'],
  },
   {
    title: 'KaustubhK24',
    description: 'KaustubhK24 blog + Portfolio website',
    preview: require('./showcase/kaustubhk24.png'),
    website: 'https://www.kaustubhk24.com',
    source: null,
    tags: ['personal'],
  },
  {
    title: 'Khyron Realm',
    description: 'Free-to-Play social MMO game that stimulates strategic thinking for achieving goals.',
    preview: require('./showcase/khyron_realm.png'),
    website: 'https://khyron-realm.com',
    source: 'https://github.com/khyron-realm/khyron-realm-website',
    tags: ['opensource'],
  },
  {
    title: 'Kosko',
    description: 'Organize Kubernetes manifests in JavaScript',
    preview: require('./showcase/kosko.png'),
    website: 'https://kosko.dev',
    source: 'https://github.com/tommy351/kosko',
    tags: ['opensource'],
  },
  {
    title: 'Kotest',
    description: 'Kotlin test framework',
    preview: require('./showcase/kotest.png'),
    website: 'https://kotest.io',
    source: 'https://github.com/kotest/kotest',
    tags: ['opensource'],
  },
  {
    title: 'kwatch',
    description: 'monitor & detect crashes in your Kubernetes(K8s) cluster instantly',
    preview: require('./showcase/kwatch.png'),
    website: 'https://kwatch.dev',
    source: 'https://github.com/abahmed/kwatch.dev',
    tags: ['opensource', 'product'],
  },
  {
    title: 'LabVIEW 编程经验',
    description: 'A book for LabVIEW Programming',
    preview: require('./showcase/labviewbook.png'),
    website: 'https://lv.qizhen.xyz',
    source: 'https://github.com/ruanqizhen/labview_book',
    tags: ['opensource', 'i18n'],
  },
  {
    title: 'Lux Algo',
    description: 'Creation of technical trading tools',
    preview: require('./showcase/lux-algo.png'),
    website: 'https://docs.luxalgo.com',
    source: 'https://github.com/smack0202/luxdocs',
    tags: ['opensource', 'design', 'i18n', 'product'],
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
    title: 'MapillaryJS',
    description: 'Interactive, extendable street imagery map experiences',
    preview: require('./showcase/mapillaryjs.png'),
    website: 'https://mapillary.github.io/mapillary-js/',
    source: 'https://github.com/mapillary/mapillary-js',
    tags: ['opensource', 'meta'],
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
    description:
      'Platform to deploy static sites, frontend applications and hosted forms',
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
    tags: ['opensource', 'meta'],
  },
  {
    title: 'Mia-Platform',
    description:
      "Mia-Platform is the simplest way to develop and operate modern applications on Kubernetes. Don't waste time to set up your platform, just push the code!",
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
    title: 'Mint Metrics',
    description:
      'Conversion optimisation and web analytics agency from Melbourne, Australia.',
    preview: require('./showcase/mintmetrics.png'),
    website: 'https://mintmetrics.io/',
    source: null,
    tags: ['design'],
  },
  {
    title: 'Molecule',
    description:
      'Molecule is a lightweight Web IDE UI framework built with React.js and inspired by VSCode.',
    preview: require('./showcase/molecule-home.png'),
    website: 'https://dtstack.github.io/molecule/en',
    source: 'https://github.com/DTStack/molecule',
    tags: ['opensource', 'i18n'],
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
    title: 'moja global',
    description: 'A non-profit, collaborative open source project to accurately and affordably estimate greenhouse gas emissions and removals from the AFOLU sector',
    preview: require('./showcase/mojaglobal.png'),
    website: 'https://community.moja.global/',
    source: 'https://github.com/moja-global/community-website',
    tags: ['opensource', 'large', 'i18n', 'design'],
  },
  {
    title: 'nanos world documentation',
    description:
      'nanos world is the next-generation multiplayer open world sandbox game.',
    preview: require('./showcase/nanos-world.png'),
    website: 'https://docs.nanos.world/',
    source: 'https://github.com/nanos-world/docs',
    tags: ['opensource', 'versioning', 'i18n', 'product'],
  },
  {
    title: 'netboot.xyz',
    description: 'Your favorite operating systems in one place!',
    preview: require('./showcase/netbootxyz.png'),
    website: 'https://netboot.xyz',
    source: 'https://github.com/netbootxyz/netboot.xyz-docs/',
    tags: ['opensource'],
  },
  {
    title: 'Netdata Learn',
    description:
      'An educational site for monitoring and troubleshooting systems',
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
    tags: ['opensource', 'design'],
  },
  {
    title: 'Node SerialPort',
    description: 'Talk to your Serial devices',
    preview: require('./showcase/node-serialport.png'),
    website: 'https://serialport.io',
    source: 'https://github.com/serialport/node-serialport',
    tags: ['opensource', 'versioning'],
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
  // TODO site unavailable on 01/08/2022
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
    title: 'Orca',
    description: 'Modern, open-source community platform.',
    preview: require('./showcase/getorca.org-dark.png'),
    website: 'https://getorca.org',
    source: 'https://github.com/elevensymbols/getorca.org',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'Ory Documentation',
    description:
      'Ory is an open source ecosystem and a cloud offering authentication, authorization, access control, and delegation (OAuth2 & OpenID Connect) services and APIs.',
    preview: require('./showcase/ory.png'),
    website: 'https://www.ory.sh/docs',
    source: 'https://github.com/ory/docs/',
    tags: ['opensource'],
  },
  {
    title: 'Orbit.js',
    description: 'The Universal Data Layer',
    preview: require('./showcase/orbitjs.png'),
    website: 'https://orbitjs.com',
    source: 'https://github.com/orbitjs/orbit/tree/main/website',
    tags: ['opensource', 'versioning'],
  },
  {
    title: 'Oxidizer',
    description: 'A Rust ORM based on tokio-postgres and refinery',
    preview: require('./showcase/oxidizer.png'),
    website: 'https://oxidizer-rs.github.io',
    source: 'https://github.com/oxidizer-rs/website',
    tags: ['opensource'],
  },
  {
    title: 'Paubox',
    description: 'Paubox API Documentation',
    preview: require('./showcase/paubox.png'),
    website: 'https://docs.paubox.com/',
    source: null,
    tags: ['product'],
  },
  {
    title: 'Pearl UI',
    description:
      'A design-system-driven UI framework that helps developer build beautiful and accessible mobile apps right out of the box',
    preview: require('./showcase/pearl-ui.png'),
    website: 'https://docs.pearl-ui.dev/',
    source: 'https://github.com/agrawal-rohit/pearl-ui',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'Pglet',
    description:
      'Build internal web apps quickly in the language you already know',
    preview: require('./showcase/pglet.png'),
    website: 'https://pglet.io',
    source: 'https://github.com/pglet/website',
    tags: ['opensource'],
  },
  {
    title: 'Pipeline UI',
    description: 'Pipeline UI Documentation',
    preview: require('./showcase/pipeline-ui.png'),
    website: 'https://www.pipeline-ui.com/',
    source: 'https://github.com/headline-design/pipeline-ui',
    tags: ['opensource'],
  },
  {
    title: 'Plausible Analytics Docs',
    description:
      'Plausible Analytics is a simple, open source, lightweight (< 1 KB) and privacy-friendly alternative to Google Analytics. ',
    preview: require('./showcase/plausible.png'),
    website: 'https://plausible.io/docs',
    source: 'https://github.com/plausible/docs',
    tags: ['opensource', 'product'],
  },
  {
    title: 'pnpm',
    description: 'Fast, disk space efficient package manager',
    preview: require('./showcase/pnpm.png'),
    website: 'https://pnpm.js.org/',
    source: 'https://github.com/pnpm/pnpm.github.io/',
    tags: ['opensource', 'i18n'],
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
    tags: ['opensource', 'design'],
  },
  {
    title: 'PREFS',
    description: 'PREFS Python library website and documentation',
    preview: require('./showcase/prefs.png'),
    website: 'https://patitotective.github.io/PREFS/',
    source: 'https://github.com/Patitotective/PREFS',
    tags: ['opensource', 'versioning'],
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
    preview: require('./showcase/profilo.png'),
    website: 'https://facebookincubator.github.io/profilo/',
    source: 'https://github.com/facebookincubator/profilo',
    tags: ['opensource', 'meta'],
  },
  {
    title: 'Pyre',
    description: 'A performant type-checker for Python 3',
    preview: require('./showcase/pyre.png'),
    website: 'https://pyre-check.org',
    source: 'https://github.com/facebook/pyre-check',
    tags: ['opensource', 'meta'],
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
    tags: ['opensource', 'product'],
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
    description:
      'Unopinionated Accessible React Tree Component with Multi-Select and Drag-And-Drop',
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
      'meta',
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
    description: "React Native's Animated library reimplemented",
    preview: require('./showcase/react-native-reanimated.png'),
    website: 'https://docs.swmansion.com/react-native-reanimated/',
    source:
      'https://github.com/software-mansion/react-native-reanimated/tree/master/docs',
    tags: ['opensource', 'design', 'versioning'],
  },
  {
    title: 'React Native Render HTML',
    description:
      'The hackable, full-featured Open Source HTML rendering solution for React Native.',
    preview: require('./showcase/rnrh.png'),
    website: 'https://meliorence.github.io/react-native-render-html',
    source:
      'https://github.com/meliorence/react-native-render-html/tree/master/apps/website',
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
    tags: ['opensource', 'design', 'versioning'],
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
    tags: ['opensource', 'product', 'design', 'favorite'],
  },
  {
    title: 'Refine',
    description: 'A React-based framework for building data-intensive applications in no time!',
    preview: require('./showcase/refine.png'),
    website: 'https://refine.dev',
    source: 'https://github.com/pankod/refine',
    tags: ['favorite', 'opensource', 'product', 'design', 'versioning', 'large'],
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
    source: 'https://github.com/facebook/relay/tree/main/website',
    tags: ['opensource', 'favorite', 'design', 'versioning'],
  },
  {
    title: 'Remirror',
    description: 'The editor that makes ProseMirror fun to use for React developers',
    preview: require('./showcase/remirror.png'),
    website: 'https://remirror.io/',
    source: 'https://github.com/remirror/remirror',
    tags: ['opensource', 'design', 'large'],
  },
  {
    title: 'Remotion',
    description: 'Write videos programmatically in React',
    preview: require('./showcase/remotion.png'),
    website: 'https://www.remotion.dev/',
    source: 'https://github.com/JonnyBurger/remotion/tree/main/packages/docs',
    tags: ['opensource', 'product'],
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
    title: 'Sapphire',
    description: 'Sapphire is a next-gen object-oriented Discord.js bot framework.',
    preview: require('./showcase/sapphire.png'),
    website: 'https://www.sapphirejs.dev',
    source: 'https://github.com/sapphiredev/website',
    tags: ['opensource', 'large'],
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
    title: 'Smart Docs',
    description: 'A smart contract documentation visualizer for Solidity ABI interfaces.',
    preview: require('./showcase/smart-docs.png'),
    website: 'https://smart-docs.vercel.app/',
    source: 'https://github.com/wowtvds/smart-docs',
    tags: ['opensource', 'product', 'design'],
  },
  {
    title: 'smash.gg',
    description: 'Turning passions into careers',
    preview: require('./showcase/smashgg.png'),
    website: 'https://developer.smash.gg',
    source: 'https://github.com/smashgg/developer-portal',
    tags: ['opensource', 'product'],
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
    title: 'Shotstack',
    description: 'The cloud video editing API',
    preview: require('./showcase/shotstack.png'),
    website: 'https://shotstack.io/docs/guide/',
    source: 'https://github.com/shotstack/documentation',
    tags: ['product', 'design', 'opensource'],
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
    title: 'SODA for SPARC',
    description:
      'Simplifying data curation for researchers funded by the NIH SPARC initiative',
    preview: require('./showcase/sodaforsparc.png'),
    website: 'https://docs.sodaforsparc.io/',
    source: 'https://github.com/fairdataihub/SODA-for-SPARC-Docs',
    tags: ['opensource', 'versioning'],
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
    website: 'https://www.supabase.io/docs',
    source: 'https://github.com/supabase/monorepo',
    tags: ['opensource', 'favorite', 'design', 'large', 'product'],
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
    title: 'TalentBrick',
    description: 'Learning made easy without ADS and trackers, Clear concepts at a glance, and Get access to quality study materials.',
    preview: require('./showcase/talentbrick.png'),
    website: 'https://www.talentbrick.com/',
    source: 'https://gitlab.com/talentbrick/talentbrick',
    tags: ['opensource', 'design']
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
    tags: ['meta'],
  },
  {
    title: 'Tinaël Devresse',
    description:
      "Personal website of Tinaël Devresse, a blog about anything that crosses my mind which I think could interest y'all.",
    preview: require('./showcase/tinaeldevresse.png'),
    website: 'https://tinaeldevresse.eu/',
    source: 'https://github.com/hunteroi/tinaeldevresse.eu',
    tags: ['personal', 'opensource', 'i18n'],
  },
  {
    title: 'ToolJet',
    description: 'Open-source low-code platform to build & deploy internal tools with minimal engineering effort.',
    preview: require('./showcase/tooljet.png'),
    website: 'https://docs.tooljet.com/docs/intro/',
    source: 'https://github.com/tooljet/tooljet',
    tags: ['opensource', 'design', 'large', 'product'],
  },
  {
    title: 'Tremor',
    description:
      'An early-stage event processing system for unstructured data with rich support for structural pattern-matching, filtering and transformation.',
    preview: require('./showcase/tremor.png'),
    website: 'https://www.tremor.rs/',
    source: 'https://github.com/tremor-rs/tremor-www',
    tags: ['opensource', 'versioning'],
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
    title: 'Unleash',
    description: 'A feature management solution.',
    preview: require('./showcase/unleash.png'),
    website: 'https://docs.getunleash.io/',
    source: 'https://github.com/Unleash/unleash/',
    tags: ['opensource', 'product'],
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
    title: 'Warrant Docs',
    description:
      'APIs and devtools for implementing authorization and access control.',
    preview: require('./showcase/warrant.png'),
    website: 'https://docs.warrant.dev/',
    source: null,
    tags: ['product'],
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
    tags: ['opensource', 'design', 'large', 'favorite'],
  },
  {
    title: 'Webiny',
    description:
      'Serverless Application Framework and CMS - Build Full-Stack applications, GraphQL APIs, Websites & Microservices on top of the serverless infrastructure.',
    preview: require('./showcase/webiny.png'),
    website: 'https://www.webiny.com/docs/',
    source: 'https://github.com/webiny/docs.webiny.com',
    tags: ['opensource', 'product'],
  },
  // TODO site unavailable on 12/31/2021
  {
    title: 'Wisdom',
    description: 'Session replay web analytics with open data SQL/S3 access.',
    preview: require('./showcase/wisdom.png'),
    website: 'https://developers.getwisdom.io/',
    source: 'https://github.com/Wisdom/dev-docs',
    tags: ['opensource', 'design', 'product'],
  },
  {
    title: 'Whirl',
    description: "Whirl's Personal Website and Blog",
    preview: require('./showcase/whirlcodes.png'),
    website: 'https://whirl.codes',
    source: 'https://github.com/whirl21/website',
    tags: ['opensource', 'personal'],
  },
  {
    title: 'WoodpeckerCI',
    description: "Woodpecker is a simple CI engine with great extensibility.",
    preview: require('./showcase/woodpecker.png'),
    website: 'https://woodpecker-ci.org/',
    source: 'https://github.com/woodpecker-ci/woodpecker',
    tags: ['opensource'],
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
    tags: ['personal', 'opensource'],
  },
  {
    title: 'LiveKit',
    description:
      'Open source, scalable, real-time audio and video rooms over WebRTC',
    preview: require('./showcase/livekit.png'),
    website: 'https://docs.livekit.io',
    source: 'https://github.com/livekit/livekit-docs',
    tags: ['opensource', 'product', 'design'],
  },
  {
    title: 'Zowe',
    description:
      'Open source framework for leveraging data and applications in z/OS',
    preview: require('./showcase/zowe.png'),
    website: 'https://docs.zowe.org',
    source: 'https://github.com/zowe/docs-site',
    tags: ['opensource', 'product', 'large', 'design', 'versioning'],
  },
  {
    title: 'Quickwit',
    description:
      'The open source search engine on object storage with subsecond latency',
    preview: require('./showcase/quickwit.png'),
    website: 'https://quickwit.io',
    source: 'https://github.com/quickwit-inc/quickwit',
    tags: ['favorite', 'opensource', 'design'],
  },
  {
    title: 'Verdaccio',
    description: 'A lightweight open source private npm proxy registry',
    preview: require('./showcase/verdaccio.png'),
    website: 'https://verdaccio.org',
    source: 'https://github.com/verdaccio/verdaccio',
    tags: ['favorite', 'opensource', 'large', 'i18n', 'design'],
  },
  {
    title: 'Unmand',
    description:
      'A business automation platform that liberates users from repetitive tasks.',
    preview: require('./showcase/unmand.png'),
    website: 'https://unmand.com',
    source: null,
    tags: ['product', 'design'],
  },
  {
    title: 'Haochen',
    description:
      'My personal website with a blog section to record all tech-related issues I encountered.',
    preview: require('./showcase/haochen.png'),
    website: 'https://haochenqi.com/',
    source: 'https://github.com/HaochenQ/Haochen-Blog',
    tags: ['personal', 'opensource'],
  },
  {
    title: 'Drayman',
    description: 'Server-side component framework',
    preview: require('./showcase/drayman.png'),
    website: 'https://drayman.io/',
    source: 'https://github.com/Claviz/drayman',
    tags: ['opensource'],
  },
  {
    title: 'Nocalhost',
    description:
      'An open-source toolsets help to build cloud-native applications easier and faster.',
    preview: require('./showcase/nocalhost.png'),
    website: 'https://nocalhost.dev/',
    source: 'https://github.com/nocalhost/nocalhost',
    tags: ['opensource', 'i18n'],
  },
  {
    title: 'Patrik Mäsiar',
    description: 'Projects showcase and documentation of software developer',
    preview: require('./showcase/patrikmasiar.png'),
    website: 'https://projects.patrikmasiar.com/',
    source: 'https://github.com/patrikmasiar/patrikmasiar-projects-docusaurus',
    tags: ['personal', 'opensource'],
  },
  {
    title: 'Matej Jellus',
    description:
      'IT enthusiast that loves to write code, try new things and share knowledge. If not sitting in front of computer, then I am playing badminton, riding bike or hiking.',
    preview: require('./showcase/juffalow.png'),
    website: 'https://juffalow.com/',
    source: 'https://github.com/juffalow/juffalow-com',
    tags: ['personal', 'opensource'],
  },
  {
    title: 'SigNoz',
    description: 'Open source Application Performance Monitoring (APM) & Observability tool. SigNoz helps developers monitor their applications & troubleshoot problems, an open-source alternative to DataDog, NewRelic, etc. 🔥 💻',
    preview: require('./showcase/signoz.png'),
    website: 'https://signoz.io/',
    source: null,
    tags: ['product', 'design'],
  },
  {
    title: 'Dime.Scheduler',
    description: 'Stop puzzling and start planning with Dime.Scheduler, the resource and project planning solution for the Microsoft Dynamics product suite.',
    preview: require('./showcase/dimeschedulersdk.png'),
    website: 'https://sdk.dimescheduler.com',
    source: 'https://github.com/dime-scheduler/sdk-dotnet',
    tags: ['product', 'opensource'],
  },
  /*
  Pro Tip: add your site in alphabetical order.
  Appending your site here (at the end) is more likely to produce Git conflicts.
   */
];

export const TagList = Object.keys(Tags) as TagType[];
function sortUsers() {
  let result = Users;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes('favorite'));
  return result;
}

export const sortedUsers = sortUsers();
