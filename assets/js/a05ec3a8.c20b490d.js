"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["47749"],{70531:function(e,t,n){n.r(t),n.d(t,{metadata:()=>r,contentTitle:()=>l,default:()=>h,assets:()=>u,toc:()=>p,frontMatter:()=>c});var r=JSON.parse('{"id":"typescript-support","title":"TypeScript Support","description":"Docusaurus is written in TypeScript and provides first-class TypeScript support.","source":"@site/docs/typescript-support.mdx","sourceDirName":".","slug":"/typescript-support","permalink":"/docs/typescript-support","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/typescript-support.mdx","tags":[],"version":"current","lastUpdatedBy":"S\xe9bastien Lorber","lastUpdatedAt":1729593657000,"frontMatter":{"description":"Docusaurus is written in TypeScript and provides first-class TypeScript support."},"sidebar":"docs","previous":{"title":"Playground","permalink":"/docs/playground"},"next":{"title":"Guides","permalink":"/docs/category/guides"}}'),i=n("24246"),s=n("80980"),o=n("15398"),a=n("58636");let c={description:"Docusaurus is written in TypeScript and provides first-class TypeScript support."},l="TypeScript Support",u={},p=[{value:"Initialization",id:"initialization",level:2},{value:"Setup",id:"setup",level:2},{value:"Typing the config file",id:"typing-config",level:2},{value:"Swizzling TypeScript theme components",id:"swizzling-typescript-theme-components",level:2}];function d(e){let t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...e.components},{Details:n}=t;return!n&&function(e,t){throw Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"typescript-support",children:"TypeScript Support"})}),"\n",(0,i.jsx)(t.p,{children:"Docusaurus is written in TypeScript and provides first-class TypeScript support."}),"\n",(0,i.jsxs)(t.p,{children:["The minimum required version is ",(0,i.jsx)(t.strong,{children:"TypeScript 5.1"}),"."]}),"\n",(0,i.jsx)(t.h2,{id:"initialization",children:"Initialization"}),"\n",(0,i.jsxs)(t.p,{children:["Docusaurus supports writing and using TypeScript theme components. If the init template provides a TypeScript variant, you can directly initialize a site with full TypeScript support by using the ",(0,i.jsx)(t.code,{children:"--typescript"})," flag."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"npx create-docusaurus@latest my-website classic --typescript\n"})}),"\n",(0,i.jsx)(t.p,{children:"Below are some guides on how to migrate an existing project to TypeScript."}),"\n",(0,i.jsx)(t.h2,{id:"setup",children:"Setup"}),"\n",(0,i.jsx)(t.p,{children:"Add the following packages to your project:"}),"\n",(0,i.jsxs)(o.Z,{groupId:"npm2yarn",children:[(0,i.jsx)(a.Z,{value:"npm",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"npm install --save-dev typescript @docusaurus/module-type-aliases @docusaurus/tsconfig @docusaurus/types\n"})})}),(0,i.jsx)(a.Z,{value:"yarn",label:"Yarn",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"yarn add --dev typescript @docusaurus/module-type-aliases @docusaurus/tsconfig @docusaurus/types\n"})})}),(0,i.jsx)(a.Z,{value:"pnpm",label:"pnpm",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"pnpm add --save-dev typescript @docusaurus/module-type-aliases @docusaurus/tsconfig @docusaurus/types\n"})})})]}),"\n",(0,i.jsxs)(t.p,{children:["Then add ",(0,i.jsx)(t.code,{children:"tsconfig.json"})," to your project root with the following content:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-json",metastring:'title="tsconfig.json"',children:'{\n  "extends": "@docusaurus/tsconfig",\n  "compilerOptions": {\n    "baseUrl": "."\n  }\n}\n'})}),"\n",(0,i.jsxs)(t.p,{children:["Docusaurus doesn't use this ",(0,i.jsx)(t.code,{children:"tsconfig.json"})," to compile your project. It is added just for a nicer Editor experience, although you can choose to run ",(0,i.jsx)(t.code,{children:"tsc"})," to type check your code for yourself or on CI."]}),"\n",(0,i.jsx)(t.p,{children:"Now you can start writing TypeScript theme components."}),"\n",(0,i.jsx)(t.h2,{id:"typing-config",children:"Typing the config file"}),"\n",(0,i.jsx)(t.p,{children:"It is possible to use a TypeScript config file in Docusaurus."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ts",metastring:'title="docusaurus.config.ts"',children:"import type {Config} from '@docusaurus/types';\nimport type * as Preset from '@docusaurus/preset-classic';\n\n// highlight-next-line\nconst config: Config = {\n  title: 'My Site',\n  favicon: 'img/favicon.ico',\n\n  /* Your site config here */\n\n  presets: [\n    [\n      'classic',\n      {\n        /* Your preset config here */\n        // highlight-next-line\n      } satisfies Preset.Options,\n    ],\n  ],\n\n  themeConfig: {\n    /* Your theme config here */\n    // highlight-next-line\n  } satisfies Preset.ThemeConfig,\n};\n\nexport default config;\n"})}),"\n",(0,i.jsxs)(n,{children:[(0,i.jsxs)("summary",{children:["It is also possible to use ",(0,i.jsx)(t.a,{href:"https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html",children:"JSDoc type annotations"})," within a ",(0,i.jsx)(t.code,{children:".js"})," file:"]}),(0,i.jsx)(t.p,{children:"By default, the Docusaurus TypeScript config does not type-check JavaScript files."}),(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"// @ts-check"})," comment ensures the config file is properly type-checked when running ",(0,i.jsx)(t.code,{children:"npx tsc"}),"."]}),(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"// highlight-next-line\n// @ts-check\n\n// highlight-next-line\n/** @type {import('@docusaurus/types').Config} */\nconst config = {\n  tagline: 'Dinosaurs are cool',\n  favicon: 'img/favicon.ico',\n\n  /* Your site config here */\n\n  presets: [\n    [\n      '@docusaurus/preset-classic',\n      // highlight-next-line\n      /** @type {import('@docusaurus/preset-classic').Options} */\n      (\n        {\n          /* Your preset config here */\n        }\n      ),\n    ],\n  ],\n  themeConfig:\n    // highlight-next-line\n    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */\n    (\n      {\n        /* Your theme config here */\n      }\n    ),\n};\n\nexport default config;\n"})})]}),"\n",(0,i.jsxs)(t.admonition,{type:"tip",children:[(0,i.jsx)(t.p,{children:"Type annotations are very useful and help your IDE understand the type of config objects!"}),(0,i.jsx)(t.p,{children:"The best IDEs (VS Code, WebStorm, IntelliJ...) will provide a nice auto-completion experience."})]}),"\n",(0,i.jsx)(t.h2,{id:"swizzling-typescript-theme-components",children:"Swizzling TypeScript theme components"}),"\n",(0,i.jsxs)(t.p,{children:["For themes that support TypeScript theme components, you can add the ",(0,i.jsx)(t.code,{children:"--typescript"})," flag to the end of the ",(0,i.jsx)(t.code,{children:"swizzle"})," command to get TypeScript source code. For example, the following command will generate ",(0,i.jsx)(t.code,{children:"index.tsx"})," and ",(0,i.jsx)(t.code,{children:"styles.module.css"})," into ",(0,i.jsx)(t.code,{children:"src/theme/Footer"}),"."]}),"\n",(0,i.jsxs)(o.Z,{groupId:"npm2yarn",children:[(0,i.jsx)(a.Z,{value:"npm",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"npm run swizzle @docusaurus/theme-classic Footer -- --typescript\n"})})}),(0,i.jsx)(a.Z,{value:"yarn",label:"Yarn",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"yarn swizzle @docusaurus/theme-classic Footer --typescript\n"})})}),(0,i.jsx)(a.Z,{value:"pnpm",label:"pnpm",children:(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"pnpm run swizzle @docusaurus/theme-classic Footer --typescript\n"})})})]}),"\n",(0,i.jsxs)(t.p,{children:["All official Docusaurus themes support TypeScript theme components, including ",(0,i.jsx)(t.a,{href:"/docs/api/themes/@docusaurus/theme-classic",children:(0,i.jsx)(t.code,{children:"theme-classic"})}),", ",(0,i.jsx)(t.a,{href:"/docs/api/themes/@docusaurus/theme-live-codeblock",children:(0,i.jsx)(t.code,{children:"theme-live-codeblock"})}),", and ",(0,i.jsx)(t.a,{href:"/docs/api/themes/@docusaurus/theme-search-algolia",children:(0,i.jsx)(t.code,{children:"theme-search-algolia"})}),". If you are a Docusaurus theme package author who wants to add TypeScript support, see the ",(0,i.jsx)(t.a,{href:"/docs/api/plugin-methods/extend-infrastructure#getTypeScriptThemePath",children:"Lifecycle APIs docs"}),"."]})]})}function h(e={}){let{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},58636:function(e,t,n){n.d(t,{Z:()=>o});var r=n("24246");n("27378");var i=n("90496");let s="tabItem_pnkT";function o(e){var t=e.children,n=e.hidden,o=e.className;return(0,r.jsx)("div",{role:"tabpanel",className:(0,i.Z)(s,o),hidden:n,children:t})}},15398:function(e,t,n){n.d(t,{Z:()=>O});var r=n("24246"),i=n("27378"),s=n("90496"),o=n("54947"),a=n("3620"),c=n("844"),l=n("97486"),u=n("32263"),p=n("16971");function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n,r,i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var s=[],o=!0,a=!1;try{for(i=i.call(e);!(o=(n=i.next()).done)&&(s.push(n.value),!t||s.length!==t);o=!0);}catch(e){a=!0,r=e}finally{try{!o&&null!=i.return&&i.return()}finally{if(a)throw r}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(e,t)}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){var t,n;return null!==(n=null===(t=i.Children.toArray(e).filter(function(e){return"\n"!==e}).map(function(e){var t,n;if(!e||(0,i.isValidElement)(e)&&(t=e.props)&&(void 0===t?"undefined":(n=t)&&"undefined"!=typeof Symbol&&n.constructor===Symbol?"symbol":typeof n)=="object"&&"value"in t)return e;throw Error("Docusaurus error: Bad <Tabs> child <".concat("string"==typeof e.type?e.type:e.type.name,'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.'))}))||void 0===t?void 0:t.filter(Boolean))&&void 0!==n?n:[]}function m(e){var t=e.value;return e.tabValues.some(function(e){return e.value===t})}var y=n("71607");let g="tabList_Qoir",b="tabItem_AQgk";function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){var r,i,s;r=e,i=t,s=n[t],i in r?Object.defineProperty(r,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):r[i]=s})}return e}function j(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):(function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n.push.apply(n,r)}return n})(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function x(e){var t=e.className,n=e.block,i=e.selectedValue,a=e.selectValue,c=e.tabValues,l=[],u=(0,o.o5)().blockElementScrollPositionUntilNextRender,p=function(e){var t=e.currentTarget,n=c[l.indexOf(t)].value;n!==i&&(u(t),a(n))},d=function(e){var t=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":var n,r=l.indexOf(e.currentTarget)+1;t=null!==(n=l[r])&&void 0!==n?n:l[0];break;case"ArrowLeft":var i,s=l.indexOf(e.currentTarget)-1;t=null!==(i=l[s])&&void 0!==i?i:l[l.length-1]}null==t||t.focus()};return(0,r.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":n},t),children:c.map(function(e){var t=e.value,n=e.label,o=e.attributes;return(0,r.jsx)("li",j(v({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,ref:function(e){return l.push(e)},onKeyDown:d,onClick:p},o),{className:(0,s.Z)("tabs__item",b,null==o?void 0:o.className,{"tabs__item--active":i===t}),children:null!=n?n:t}),t)})})}function w(e){var t=e.lazy,n=e.children,o=e.selectedValue,a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){var c=a.find(function(e){return e.props.value===o});return c?(0,i.cloneElement)(c,{className:(0,s.Z)("margin-top--md",c.props.className)}):null}return(0,r.jsx)("div",{className:"margin-top--md",children:a.map(function(e,t){return(0,i.cloneElement)(e,{key:t,hidden:e.props.value!==o})})})}function S(e){var t=function(e){var t,n,r,s,o,d,y,g,b,v,j,x,w,S,O=e.defaultValue,T=e.queryString,k=e.groupId;var I=(n=(t=e).values,r=t.children,(0,i.useMemo)(function(){var e=null!=n?n:f(r).map(function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes,default:t.default}});return!function(e){var t=(0,u.lx)(e,function(e,t){return e.value===t.value});if(t.length>0)throw Error('Docusaurus error: Duplicate values "'.concat(t.map(function(e){return e.value}).join(", "),'" found in <Tabs>. Every value needs to be unique.'))}(e),e},[n,r])),P=h((0,i.useState)(function(){return function(e){var t,n=e.defaultValue,r=e.tabValues;if(0===r.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:r}))throw Error('Docusaurus error: The <Tabs> has a defaultValue "'.concat(n,'" but none of its children has the corresponding value. Available values are: ').concat(r.map(function(e){return e.value}).join(", "),". If you intend to show no default tab, use defaultValue={null} instead."));return n}var i=null!==(t=r.find(function(e){return e.default}))&&void 0!==t?t:r[0];if(!i)throw Error("Unexpected error: 0 tabValues");return i.value}({defaultValue:O,tabValues:I})}),2),D=P[0],N=P[1];var E=h((o=(s={queryString:void 0!==T&&T,groupId:k}).queryString,d=s.groupId,y=(0,a.k6)(),g=function(e){var t=e.queryString,n=void 0!==t&&t,r=e.groupId;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=r?r:null}({queryString:void 0!==o&&o,groupId:d}),[(0,l._X)(g),(0,i.useCallback)(function(e){if(!!g){var t,n,r=new URLSearchParams(y.location.search);r.set(g,e),y.replace((t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){var r,i,s;r=e,i=t,s=n[t],i in r?Object.defineProperty(r,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):r[i]=s})}return e}({},y.location),n=(n={search:r.toString()},n),Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):(function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n.push.apply(n,r)}return n})(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}),t))}},[g,y])]),2),z=E[0],C=E[1];var V=h((v=(b=({groupId:k}).groupId)?"docusaurus.tab.".concat(b):null,x=(j=h((0,p.Nk)(v),2))[0],w=j[1],[x,(0,i.useCallback)(function(e){if(!!v)w.set(e)},[v,w])]),2),Z=V[0],A=V[1];var q=m({value:S=null!=z?z:Z,tabValues:I})?S:null;return(0,c.Z)(function(){q&&N(q)},[q]),{selectedValue:D,selectValue:(0,i.useCallback)(function(e){if(!m({value:e,tabValues:I}))throw Error("Can't select invalid tab value=".concat(e));N(e),C(e),A(e)},[C,A,I]),tabValues:I}}(e);return(0,r.jsxs)("div",{className:(0,s.Z)("tabs-container",g),children:[(0,r.jsx)(x,v({},t,e)),(0,r.jsx)(w,v({},t,e))]})}function O(e){var t=(0,y.Z)();return(0,r.jsx)(S,j(v({},e),{children:f(e.children)}),String(t))}},80980:function(e,t,n){n.d(t,{Z:function(){return a},a:function(){return o}});var r=n(27378);let i={},s=r.createContext(i);function o(e){let t=r.useContext(s);return r.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);