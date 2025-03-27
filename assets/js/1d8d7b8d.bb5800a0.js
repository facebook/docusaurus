"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["61597"],{46877:function(e,n,r){r.d(n,{Z:()=>s});let s=r.p+"assets/images/docsearch-troubleshoot-index-facets-4c0d9816a72c457e3e8352bc0fceccb6.jpg"},49379:function(e,n,r){r.r(n),r.d(n,{frontMatter:()=>l,default:()=>g,contentTitle:()=>t,assets:()=>h,toc:()=>d,metadata:()=>s});var s=JSON.parse('{"id":"search","title":"Search","description":"There are a few options you can use to add search to your website:","source":"@site/docs/search.mdx","sourceDirName":".","slug":"/search","permalink":"/docs/search","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/search.mdx","tags":[],"version":"current","lastUpdatedBy":"S\xe9bastien Lorber","lastUpdatedAt":1743074564000,"frontMatter":{"keywords":["algolia","search"]},"sidebar":"docs","previous":{"title":"Static Assets","permalink":"/docs/static-assets"},"next":{"title":"Browser support","permalink":"/docs/browser-support"}}'),a=r(85893),o=r(80980),i=r(15398),c=r(58636);let l={keywords:["algolia","search"]},t="Search",h={},d=[{value:"\uD83E\uDD47 Using Algolia DocSearch",id:"using-algolia-docsearch",level:2},{value:"Index Configuration",id:"algolia-index-configuration",level:3},{value:"Connecting Algolia",id:"connecting-algolia",level:3},{value:"Contextual search",id:"contextual-search",level:3},{value:"Styling your Algolia search",id:"styling-your-algolia-search",level:3},{value:"Customizing the Algolia search behavior",id:"customizing-the-algolia-search-behavior",level:3},{value:"Editing the Algolia search component",id:"editing-the-algolia-search-component",level:3},{value:"Troubleshooting",id:"algolia-troubleshooting",level:3},{value:"No Search Results",id:"algolia-no-search-results",level:4},{value:"Support",id:"algolia-support",level:3},{value:"\uD83D\uDC65 Using Typesense DocSearch",id:"using-typesense-docsearch",level:2},{value:"\uD83D\uDC65 Using Local Search",id:"using-local-search",level:2},{value:"\uD83D\uDC65 Using your own search",id:"using-your-own-search",level:2}];function u(e){let n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components},{Details:s}=n;return s||function(e,n){throw Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"search",children:"Search"})}),"\n",(0,a.jsx)(n.p,{children:"There are a few options you can use to add search to your website:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\uD83E\uDD47 ",(0,a.jsx)(n.a,{href:"#using-algolia-docsearch",children:"Algolia DocSearch"})," (",(0,a.jsx)(n.strong,{children:"official"}),")"]}),"\n",(0,a.jsxs)(n.li,{children:["\uD83D\uDC65 ",(0,a.jsx)(n.a,{href:"#using-typesense-docsearch",children:"Typesense DocSearch"})]}),"\n",(0,a.jsxs)(n.li,{children:["\uD83D\uDC65 ",(0,a.jsx)(n.a,{href:"#using-local-search",children:"Local Search"})]}),"\n",(0,a.jsxs)(n.li,{children:["\uD83D\uDC65 ",(0,a.jsxs)(n.a,{href:"#using-your-own-search",children:["Your own ",(0,a.jsx)(n.code,{children:"SearchBar"})," component"]})]}),"\n"]}),"\n",(0,a.jsxs)(n.admonition,{type:"info",children:[(0,a.jsxs)(n.p,{children:["\uD83E\uDD47 Docusaurus provides ",(0,a.jsx)(n.strong,{children:"first-class support"})," for ",(0,a.jsx)(n.a,{href:"#using-algolia-docsearch",children:"Algolia DocSearch"}),"."]}),(0,a.jsxs)(n.p,{children:["\uD83D\uDC65 Other options are ",(0,a.jsx)(n.strong,{children:"maintained by the community"}),": please report bugs to their respective repositories."]})]}),"\n",(0,a.jsx)(n.h2,{id:"using-algolia-docsearch",children:"\uD83E\uDD47 Using Algolia DocSearch"}),"\n",(0,a.jsxs)(n.p,{children:["Docusaurus has ",(0,a.jsx)(n.strong,{children:"official support"})," for ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com",children:"Algolia DocSearch"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["The service is ",(0,a.jsx)(n.strong,{children:"free"})," for any developer documentation or technical blog: just make sure to read the ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/who-can-apply/",children:"checklist"})," and ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/apply",children:"apply to the DocSearch program"}),"."]}),"\n",(0,a.jsx)(n.p,{children:"DocSearch crawls your website once a week (the schedule is configurable from the web interface) and aggregates all the content in an Algolia index. This content is then queried directly from your front-end using the Algolia API."}),"\n",(0,a.jsxs)(n.p,{children:["If your website is ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/who-can-apply",children:"not eligible"})," for the free, hosted version of DocSearch, or if your website sits behind a firewall and is not public, then you can ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/run-your-own/",children:"run your own"})," DocSearch crawler."]}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["By default, the Docusaurus preset generates a ",(0,a.jsx)(n.a,{href:"https://docusaurus.io/sitemap.xml",children:"sitemap.xml"})," that the Algolia crawler can use."]})}),"\n",(0,a.jsx)(n.admonition,{title:"From the old docsearch?",type:"info",children:(0,a.jsxs)(n.p,{children:["You can read more about migration from the legacy DocSearch infra in ",(0,a.jsx)(n.a,{href:"/blog/2021/11/21/algolia-docsearch-migration",children:"our blog post"})," or ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/migrating-from-legacy",children:"the DocSearch migration docs"}),"."]})}),"\n",(0,a.jsx)(n.h3,{id:"algolia-index-configuration",children:"Index Configuration"}),"\n",(0,a.jsxs)(n.p,{children:["After your application has been approved and deployed, you will receive an email with all the details for you to add DocSearch to your project. Editing and managing your crawls can be done via ",(0,a.jsx)(n.a,{href:"https://crawler.algolia.com/",children:"the web interface"}),". Indices are readily available after deployment, so manual configuration usually isn't necessary."]}),"\n",(0,a.jsx)(n.admonition,{title:"Use the recommended crawler config",type:"danger",children:(0,a.jsxs)(n.p,{children:["It is highly recommended to use our official ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/templates/#docusaurus-v3-template",children:(0,a.jsx)(n.strong,{children:"Docusaurus v3 crawler configuration"})}),". We cannot support you if you choose a different crawler configuration."]})}),"\n",(0,a.jsxs)(n.admonition,{title:"When updating your crawler config",type:"warning",children:[(0,a.jsxs)(n.p,{children:["The crawler configuration contains a ",(0,a.jsx)(n.code,{children:"initialIndexSettings"}),", which will only be used to initialize your Algolia index if it does not exist yet."]}),(0,a.jsxs)(n.p,{children:["If you update your ",(0,a.jsx)(n.code,{children:"initialIndexSettings"})," crawler setting, it is possible to update the index manually through the interface, but ",(0,a.jsx)(n.a,{href:"https://github.com/facebook/docusaurus/issues/9200#issuecomment-1667338492",children:"the Algolia team recommends to delete your index and then restart a crawl"})," to fully reinitialize it with the new settings."]})]}),"\n",(0,a.jsx)(n.h3,{id:"connecting-algolia",children:"Connecting Algolia"}),"\n",(0,a.jsxs)(n.p,{children:["Docusaurus' own ",(0,a.jsx)(n.code,{children:"@docusaurus/preset-classic"})," supports Algolia DocSearch integration. If you use the classic preset, no additional installation is needed."]}),"\n",(0,a.jsxs)(s,{children:[(0,a.jsxs)("summary",{children:["Installation steps when not using ",(0,a.jsx)("code",{children:"@docusaurus/preset-classic"})]}),(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Install the package:"}),"\n"]}),(0,a.jsxs)(i.Z,{groupId:"npm2yarn",children:[(0,a.jsx)(c.Z,{value:"npm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm install --save @docusaurus/theme-search-algolia\n"})})}),(0,a.jsx)(c.Z,{value:"yarn",label:"Yarn",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"yarn add @docusaurus/theme-search-algolia\n"})})}),(0,a.jsx)(c.Z,{value:"pnpm",label:"pnpm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm add @docusaurus/theme-search-algolia\n"})})}),(0,a.jsx)(c.Z,{value:"bun",label:"Bun",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"bun add @docusaurus/theme-search-algolia\n"})})})]}),(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsxs)(n.li,{children:["Register the theme in ",(0,a.jsx)(n.code,{children:"docusaurus.config.js"}),":"]}),"\n"]}),(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  title: 'My site',\n  // ...\n  themes: ['@docusaurus/theme-search-algolia'],\n  themeConfig: {\n    // ...\n  },\n};\n"})})]}),"\n",(0,a.jsxs)(n.p,{children:["Then, add an ",(0,a.jsx)(n.code,{children:"algolia"})," field in your ",(0,a.jsx)(n.code,{children:"themeConfig"}),". ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/apply/",children:"Apply for DocSearch"})})," to get your Algolia index and API key."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  // ...\n  themeConfig: {\n    // ...\n    // highlight-start\n    algolia: {\n      // The application ID provided by Algolia\n      appId: 'YOUR_APP_ID',\n\n      // Public API key: it is safe to commit it\n      apiKey: 'YOUR_SEARCH_API_KEY',\n\n      indexName: 'YOUR_INDEX_NAME',\n\n      // Optional: see doc section below\n      contextualSearch: true,\n\n      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.\n      externalUrlRegex: 'external\\\\.com|domain\\\\.com',\n\n      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs\n      replaceSearchResultPathname: {\n        from: '/docs/', // or as RegExp: /\\/docs\\//\n        to: '/',\n      },\n\n      // Optional: Algolia search parameters\n      searchParameters: {},\n\n      // Optional: path for search page that enabled by default (`false` to disable it)\n      searchPagePath: 'search',\n\n      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)\n      insights: false,\n\n      //... other Algolia params\n    },\n    // highlight-end\n  },\n};\n"})}),"\n",(0,a.jsxs)(n.admonition,{type:"info",children:[(0,a.jsxs)(n.p,{children:["The ",(0,a.jsx)(n.code,{children:"searchParameters"})," option used to be named ",(0,a.jsx)(n.code,{children:"algoliaOptions"})," in Docusaurus v1."]}),(0,a.jsxs)(n.p,{children:["Refer to its ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/api#searchparameters",children:"official DocSearch documentation"})," for possible values."]})]}),"\n",(0,a.jsxs)(n.admonition,{type:"warning",children:[(0,a.jsx)(n.p,{children:"The search feature will not work reliably until Algolia crawls your site."}),(0,a.jsxs)(n.p,{children:["If search doesn't work after any significant change, please use the Algolia dashboard to ",(0,a.jsx)(n.strong,{children:"trigger a new crawl"}),"."]})]}),"\n",(0,a.jsx)(n.h3,{id:"contextual-search",children:"Contextual search"}),"\n",(0,a.jsxs)(n.p,{children:["Contextual search is ",(0,a.jsx)(n.strong,{children:"enabled by default"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["It ensures that search results are ",(0,a.jsx)(n.strong,{children:"relevant to the current language and version"}),"."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  // ...\n  themeConfig: {\n    // ...\n    // highlight-start\n    algolia: {\n      contextualSearch: true,\n    },\n    // highlight-end\n  },\n};\n"})}),"\n",(0,a.jsxs)(n.p,{children:["Let's consider you have 2 docs versions (",(0,a.jsx)(n.strong,{children:"v1"})," and ",(0,a.jsx)(n.strong,{children:"v2"}),") and 2 languages (",(0,a.jsx)(n.code,{children:"en"})," and ",(0,a.jsx)(n.code,{children:"fr"}),")."]}),"\n",(0,a.jsx)(n.p,{children:"When browsing v2 docs, it would be odd to return search results for the v1 documentation. Sometimes v1 and v2 docs are quite similar, and you would end up with duplicate search results for the same query (one result per version)."}),"\n",(0,a.jsx)(n.p,{children:"Similarly, when browsing the French site, it would be odd to return search results for the English docs."}),"\n",(0,a.jsx)(n.p,{children:"To solve this problem, the contextual search feature understands that you are browsing a specific docs version and language, and will create the search query filters dynamically."}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["on ",(0,a.jsx)(n.code,{children:"/en/docs/v1/myDoc"}),", search results will only include ",(0,a.jsx)(n.strong,{children:"English"})," results for the ",(0,a.jsx)(n.strong,{children:"v1"})," docs (+ other unversioned pages)"]}),"\n",(0,a.jsxs)(n.li,{children:["on ",(0,a.jsx)(n.code,{children:"/fr/docs/v2/myDoc"}),", search results will only include ",(0,a.jsx)(n.strong,{children:"French"})," results for the ",(0,a.jsx)(n.strong,{children:"v2"})," docs (+ other unversioned pages)"]}),"\n"]}),"\n",(0,a.jsxs)(n.admonition,{type:"info",children:[(0,a.jsxs)(n.p,{children:["When using ",(0,a.jsx)(n.code,{children:"contextualSearch: true"})," (default), the contextual facet filters will be merged with the ones provided with ",(0,a.jsx)(n.code,{children:"algolia.searchParameters.facetFilters"})," ."]}),(0,a.jsxs)(n.p,{children:["For specific needs, you can disable ",(0,a.jsx)(n.code,{children:"contextualSearch"})," and define your own ",(0,a.jsx)(n.code,{children:"facetFilters"}),":"]}),(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  // ...\n  themeConfig: {\n    // ...\n    // highlight-start\n    algolia: {\n      contextualSearch: false,\n      searchParameters: {\n        facetFilters: ['language:en', ['filter1', 'filter2'], 'filter3'],\n      },\n    },\n    // highlight-end\n  },\n};\n"})}),(0,a.jsxs)(n.p,{children:["Refer to the relevant ",(0,a.jsx)(n.a,{href:"https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/",children:"Algolia faceting documentation"}),"."]})]}),"\n",(0,a.jsx)(n.admonition,{title:"Contextual search doesn't work?",type:"warning",children:(0,a.jsxs)(n.p,{children:["If you only get search results when Contextual Search is disabled, this is very likely because of an ",(0,a.jsx)(n.a,{href:"#algolia-no-search-results",children:"index configuration issue"}),"."]})}),"\n",(0,a.jsx)(n.h3,{id:"styling-your-algolia-search",children:"Styling your Algolia search"}),"\n",(0,a.jsx)(n.p,{children:"By default, DocSearch comes with a fine-tuned theme that was designed for accessibility, making sure that colors and contrasts respect standards."}),"\n",(0,a.jsxs)(n.p,{children:["Still, you can reuse the ",(0,a.jsx)(n.a,{href:"/docs/styling-layout#styling-your-site-with-infima",children:"Infima CSS variables"})," from Docusaurus to style DocSearch by editing the ",(0,a.jsx)(n.code,{children:"/src/css/custom.css"})," file."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-css",metastring:'title="/src/css/custom.css"',children:"[data-theme='light'] .DocSearch {\n  /* --docsearch-primary-color: var(--ifm-color-primary); */\n  /* --docsearch-text-color: var(--ifm-font-color-base); */\n  --docsearch-muted-color: var(--ifm-color-secondary-darkest);\n  --docsearch-container-background: rgba(94, 100, 112, 0.7);\n  /* Modal */\n  --docsearch-modal-background: var(--ifm-color-secondary-lighter);\n  /* Search box */\n  --docsearch-searchbox-background: var(--ifm-color-secondary);\n  --docsearch-searchbox-focus-background: var(--ifm-color-white);\n  /* Hit */\n  --docsearch-hit-color: var(--ifm-font-color-base);\n  --docsearch-hit-active-color: var(--ifm-color-white);\n  --docsearch-hit-background: var(--ifm-color-white);\n  /* Footer */\n  --docsearch-footer-background: var(--ifm-color-white);\n}\n\n[data-theme='dark'] .DocSearch {\n  --docsearch-text-color: var(--ifm-font-color-base);\n  --docsearch-muted-color: var(--ifm-color-secondary-darkest);\n  --docsearch-container-background: rgba(47, 55, 69, 0.7);\n  /* Modal */\n  --docsearch-modal-background: var(--ifm-background-color);\n  /* Search box */\n  --docsearch-searchbox-background: var(--ifm-background-color);\n  --docsearch-searchbox-focus-background: var(--ifm-color-black);\n  /* Hit */\n  --docsearch-hit-color: var(--ifm-font-color-base);\n  --docsearch-hit-active-color: var(--ifm-color-white);\n  --docsearch-hit-background: var(--ifm-color-emphasis-100);\n  /* Footer */\n  --docsearch-footer-background: var(--ifm-background-surface-color);\n  --docsearch-key-gradient: linear-gradient(\n    -26.5deg,\n    var(--ifm-color-emphasis-200) 0%,\n    var(--ifm-color-emphasis-100) 100%\n  );\n}\n"})}),"\n",(0,a.jsx)(n.h3,{id:"customizing-the-algolia-search-behavior",children:"Customizing the Algolia search behavior"}),"\n",(0,a.jsxs)(n.p,{children:["Algolia DocSearch supports a ",(0,a.jsx)(n.a,{href:"https://docsearch.algolia.com/docs/api/",children:"list of options"})," that you can pass to the ",(0,a.jsx)(n.code,{children:"algolia"})," field in the ",(0,a.jsx)(n.code,{children:"docusaurus.config.js"})," file."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  themeConfig: {\n    // ...\n    algolia: {\n      apiKey: 'YOUR_API_KEY',\n      indexName: 'YOUR_INDEX_NAME',\n      // Options...\n    },\n  },\n};\n"})}),"\n",(0,a.jsx)(n.h3,{id:"editing-the-algolia-search-component",children:"Editing the Algolia search component"}),"\n",(0,a.jsxs)(n.p,{children:["If you prefer to edit the Algolia search React component, ",(0,a.jsx)(n.a,{href:"/docs/swizzling",children:"swizzle"})," the ",(0,a.jsx)(n.code,{children:"SearchBar"})," component in ",(0,a.jsx)(n.code,{children:"@docusaurus/theme-search-algolia"}),":"]}),"\n",(0,a.jsxs)(i.Z,{groupId:"npm2yarn",children:[(0,a.jsx)(c.Z,{value:"npm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run swizzle @docusaurus/theme-search-algolia SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"yarn",label:"Yarn",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"yarn swizzle @docusaurus/theme-search-algolia SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"pnpm",label:"pnpm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm run swizzle @docusaurus/theme-search-algolia SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"bun",label:"Bun",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"bun run swizzle @docusaurus/theme-search-algolia SearchBar\n"})})})]}),"\n",(0,a.jsx)(n.h3,{id:"algolia-troubleshooting",children:"Troubleshooting"}),"\n",(0,a.jsx)(n.p,{children:"Here are the most common issues Docusaurus users face when using Algolia DocSearch."}),"\n",(0,a.jsx)(n.h4,{id:"algolia-no-search-results",children:"No Search Results"}),"\n",(0,a.jsxs)(n.p,{children:["Seeing no search results is usually related to an ",(0,a.jsx)(n.strong,{children:"index configuration problem"}),"."]}),"\n",(0,a.jsxs)(s,{children:[(0,a.jsx)("summary",{children:"How to check if I have a config problem?"}),(0,a.jsxs)(n.p,{children:["Docusaurus uses ",(0,a.jsx)(n.a,{href:"https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/",children:"Algolia faceting"})," for its ",(0,a.jsx)(n.a,{href:"#contextual-search",children:"Contextual Search"})," feature, to create dynamic queries such as:"]}),(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-json",children:'[\n  "language:en",\n  [\n    "docusaurus_tag:default",\n    "docusaurus_tag:docs-default-3.2.1",\n    "docusaurus_tag:docs-community-current",\n    "docusaurus_tag:docs-docs-tests-current"\n  ]\n]\n'})}),(0,a.jsxs)(n.p,{children:["On the Algolia UI, your index should allow to create facet queries on fields ",(0,a.jsx)(n.code,{children:"docusaurus_tag"}),", ",(0,a.jsx)(n.code,{children:"language"}),", ",(0,a.jsx)(n.code,{children:"lang"}),", ",(0,a.jsx)(n.code,{children:"version"}),", ",(0,a.jsx)(n.code,{children:"type"}),", as shown in the screenshot below:"]}),(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Algolia index showing appropriate faceting fields",src:r(46877).Z+"",width:"1072",height:"1761"})}),(0,a.jsxs)(n.p,{children:["Alternatively, if you disable ",(0,a.jsx)(n.a,{href:"#contextual-search",children:"Contextual Search"})," with ",(0,a.jsx)(n.code,{children:"{contextualSearch: false}"})," (which we don't particularly recommend), Docusaurus will not use facet queries, and you should start seeing results."]})]}),"\n",(0,a.jsx)(n.admonition,{title:"Use the recommended configuration",type:"danger",children:(0,a.jsxs)(n.p,{children:["We ",(0,a.jsx)(n.a,{href:"#algolia-index-configuration",children:"recommend a specific crawler configuration"})," for a good reason. We cannot support you if you choose to use a different configuration."]})}),"\n",(0,a.jsx)(n.p,{children:"You can fix index configuration problems by following those steps:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["Use the ",(0,a.jsx)(n.a,{href:"#algolia-index-configuration",children:"recommend crawler configuration"})]}),"\n",(0,a.jsx)(n.li,{children:"Delete your index through the UI"}),"\n",(0,a.jsx)(n.li,{children:"Trigger a new crawl through the UI"}),"\n",(0,a.jsxs)(n.li,{children:["Check your index is recreated with the appropriate faceting fields: ",(0,a.jsx)(n.code,{children:"docusaurus_tag"}),", ",(0,a.jsx)(n.code,{children:"language"}),", ",(0,a.jsx)(n.code,{children:"lang"}),", ",(0,a.jsx)(n.code,{children:"version"}),", ",(0,a.jsx)(n.code,{children:"type"})]}),"\n",(0,a.jsxs)(n.li,{children:["See that you now get search results, even with ",(0,a.jsx)(n.a,{href:"#contextual-search",children:"Contextual Search"})," enabled"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"algolia-support",children:"Support"}),"\n",(0,a.jsx)(n.p,{children:"The Algolia DocSearch team can help you figure out search problems on your site."}),"\n",(0,a.jsxs)(n.p,{children:["You can reach out to Algolia via ",(0,a.jsx)(n.a,{href:"https://algolia.com/support",children:"their support page"})," or on ",(0,a.jsx)(n.a,{href:"https://discord.gg/wr2m5j948P",children:"Discord"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["Docusaurus also has an ",(0,a.jsx)(n.code,{children:"#algolia"})," channel on ",(0,a.jsx)(n.a,{href:"https://discordapp.com/invite/docusaurus",children:"Discord"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"using-typesense-docsearch",children:"\uD83D\uDC65 Using Typesense DocSearch"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.a,{href:"https://typesense.org",children:"Typesense"})," DocSearch works similar to Algolia DocSearch, except that your website is indexed into a Typesense search cluster."]}),"\n",(0,a.jsxs)(n.p,{children:["Typesense is an ",(0,a.jsx)(n.a,{href:"https://github.com/typesense/typesense",children:"open source"})," instant-search engine that you can either:"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"https://typesense.org/docs/guide/install-typesense.html#option-2-local-machine-self-hosting",children:"Self-Host"})," on your own servers or"]}),"\n",(0,a.jsxs)(n.li,{children:["Use the Managed ",(0,a.jsx)(n.a,{href:"https://cloud.typesense.org",children:"Typesense Cloud"})," service."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"Similar to Algolia DocSearch, there are two components:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"https://github.com/typesense/typesense-docsearch-scraper",children:"typesense-docsearch-scraper"})," - which scrapes your website and indexes the data in your Typesense cluster."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"https://github.com/typesense/docusaurus-theme-search-typesense",children:"docusaurus-theme-search-typesense"})," - a search bar UI component to add to your website."]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["Read a step-by-step walk-through of how to ",(0,a.jsx)(n.a,{href:"https://typesense.org/docs/guide/docsearch.html#step-1-set-up-docsearch-scraper",children:"run typesense-docsearch-scraper here"})," and how to ",(0,a.jsx)(n.a,{href:"https://typesense.org/docs/guide/docsearch.html#option-a-docusaurus-powered-sites",children:"install the Search Bar in your Docusaurus Site here"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"using-local-search",children:"\uD83D\uDC65 Using Local Search"}),"\n",(0,a.jsx)(n.p,{children:"You can use a local search plugin for websites where the search index is small and can be downloaded to your users' browsers when they visit your website."}),"\n",(0,a.jsxs)(n.p,{children:["You'll find a list of community-supported ",(0,a.jsx)(n.a,{href:"https://docusaurus.io/community/resources#search",children:"local search plugins listed here"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"using-your-own-search",children:"\uD83D\uDC65 Using your own search"}),"\n",(0,a.jsxs)(n.p,{children:["To use your own search, swizzle the ",(0,a.jsx)(n.code,{children:"SearchBar"})," component in ",(0,a.jsx)(n.code,{children:"@docusaurus/theme-classic"})]}),"\n",(0,a.jsxs)(i.Z,{groupId:"npm2yarn",children:[(0,a.jsx)(c.Z,{value:"npm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run swizzle @docusaurus/theme-classic SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"yarn",label:"Yarn",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"yarn swizzle @docusaurus/theme-classic SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"pnpm",label:"pnpm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm run swizzle @docusaurus/theme-classic SearchBar\n"})})}),(0,a.jsx)(c.Z,{value:"bun",label:"Bun",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"bun run swizzle @docusaurus/theme-classic SearchBar\n"})})})]}),"\n",(0,a.jsxs)(n.p,{children:["This will create an ",(0,a.jsx)(n.code,{children:"src/theme/SearchBar"})," file in your project folder. Restart your dev server and edit the component, you will see that Docusaurus uses your own ",(0,a.jsx)(n.code,{children:"SearchBar"})," component now."]}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Notes"}),": You can alternatively ",(0,a.jsx)(n.a,{href:"#editing-the-algolia-search-component",children:"swizzle from Algolia SearchBar"})," and create your own search component from there."]})]})}function g(e={}){let{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},58636:function(e,n,r){r.d(n,{Z:()=>o});var s=r(85893);r(67294);var a=r(90496);function o(e){let{children:n,hidden:r,className:o}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,a.Z)("tabItem_pnkT",o),hidden:r,children:n})}},15398:function(e,n,r){r.d(n,{Z:()=>j});var s=r(85893),a=r(67294),o=r(90496),i=r(54947),c=r(3620),l=r(844),t=r(97486),h=r(32263),d=r(16971);function u(e){return a.Children.toArray(e).filter(e=>"\n"!==e).map(e=>{if(!e||a.isValidElement(e)&&function(e){let{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})?.filter(Boolean)??[]}function g(e){let{value:n,tabValues:r}=e;return r.some(e=>e.value===n)}var p=r(71607);function x(e){let{className:n,block:r,selectedValue:a,selectValue:c,tabValues:l}=e,t=[],{blockElementScrollPositionUntilNextRender:h}=(0,i.o5)(),d=e=>{let n=e.currentTarget,r=l[t.indexOf(n)].value;r!==a&&(h(n),c(r))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{let r=t.indexOf(e.currentTarget)+1;n=t[r]??t[0];break}case"ArrowLeft":{let r=t.indexOf(e.currentTarget)-1;n=t[r]??t[t.length-1]}}n?.focus()};return(0,s.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":r},n),children:l.map(e=>{let{value:n,label:r,attributes:i}=e;return(0,s.jsx)("li",{role:"tab",tabIndex:a===n?0:-1,"aria-selected":a===n,ref:e=>{t.push(e)},onKeyDown:u,onClick:d,...i,className:(0,o.Z)("tabs__item","tabItem_AQgk",i?.className,{"tabs__item--active":a===n}),children:r??n},n)})})}function f(e){let{lazy:n,children:r,selectedValue:i}=e,c=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){let e=c.find(e=>e.props.value===i);return e?(0,a.cloneElement)(e,{className:(0,o.Z)("margin-top--md",e.props.className)}):null}return(0,s.jsx)("div",{className:"margin-top--md",children:c.map((e,n)=>(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==i}))})}function m(e){let n=function(e){let{defaultValue:n,queryString:r=!1,groupId:s}=e,o=function(e){let{values:n,children:r}=e;return(0,a.useMemo)(()=>{let e=n??u(r).map(e=>{let{props:{value:n,label:r,attributes:s,default:a}}=e;return{value:n,label:r,attributes:s,default:a}});return!function(e){let n=(0,h.lx)(e,(e,n)=>e.value===n.value);if(n.length>0)throw Error(`Docusaurus error: Duplicate values "${n.map(e=>e.value).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e},[n,r])}(e),[i,p]=(0,a.useState)(()=>(function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!g({value:n,tabValues:r}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}let s=r.find(e=>e.default)??r[0];if(!s)throw Error("Unexpected error: 0 tabValues");return s.value})({defaultValue:n,tabValues:o})),[x,f]=function(e){let{queryString:n=!1,groupId:r}=e,s=(0,c.k6)(),o=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,t._X)(o),(0,a.useCallback)(e=>{if(!o)return;let n=new URLSearchParams(s.location.search);n.set(o,e),s.replace({...s.location,search:n.toString()})},[o,s])]}({queryString:r,groupId:s}),[m,j]=function(e){let{groupId:n}=e,r=n?`docusaurus.tab.${n}`:null,[s,o]=(0,d.Nk)(r);return[s,(0,a.useCallback)(e=>{r&&o.set(e)},[r,o])]}({groupId:s}),y=(()=>{let e=x??m;return g({value:e,tabValues:o})?e:null})();return(0,l.Z)(()=>{y&&p(y)},[y]),{selectedValue:i,selectValue:(0,a.useCallback)(e=>{if(!g({value:e,tabValues:o}))throw Error(`Can't select invalid tab value=${e}`);p(e),f(e),j(e)},[f,j,o]),tabValues:o}}(e);return(0,s.jsxs)("div",{className:(0,o.Z)("tabs-container","tabList_Qoir"),children:[(0,s.jsx)(x,{...n,...e}),(0,s.jsx)(f,{...n,...e})]})}function j(e){let n=(0,p.Z)();return(0,s.jsx)(m,{...e,children:u(e.children)},String(n))}},80980:function(e,n,r){r.d(n,{Z:()=>c,a:()=>i});var s=r(67294);let a={},o=s.createContext(a);function i(e){let n=s.useContext(o);return s.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);