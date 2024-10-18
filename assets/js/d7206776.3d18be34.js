"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["17663"],{22083:function(e,t,n){n.r(t),n.d(t,{metadata:()=>r,contentTitle:()=>s,default:()=>h,assets:()=>l,toc:()=>u,frontMatter:()=>a});var r=JSON.parse('{"id":"advanced/index","title":"Advanced Tutorials","description":"This section is not going to be very structured, but we will cover the following topics:","source":"@site/docs/advanced/index.mdx","sourceDirName":"advanced","slug":"/advanced/","permalink":"/docs/advanced/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/advanced/index.mdx","tags":[],"version":"current","lastUpdatedBy":"S\xe9bastien Lorber","lastUpdatedAt":1729270509000,"frontMatter":{},"sidebar":"docs","previous":{"title":"What\'s next?","permalink":"/docs/guides/whats-next"},"next":{"title":"Architecture","permalink":"/docs/advanced/architecture"}}'),o=n("24246"),i=n("80980"),c=n("78042");let a={},s="Advanced Tutorials",l={},u=[];function d(e){let t={a:"a",h1:"h1",header:"header",p:"p",...(0,i.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"advanced-tutorials",children:"Advanced Tutorials"})}),"\n",(0,o.jsx)(t.p,{children:"This section is not going to be very structured, but we will cover the following topics:"}),"\n","\n",(0,o.jsx)(c.Z,{}),"\n",(0,o.jsxs)(t.p,{children:["We will assume that you have finished the guides, and know the basics like how to configure plugins, how to write React components, etc. These sections will have plugin authors and code contributors in mind, so we may occasionally refer to ",(0,o.jsx)(t.a,{href:"/docs/api/plugin-methods/",children:"plugin APIs"})," or other architecture details. Don't panic if you don't understand everything\uD83D\uDE09"]})]})}function h(e={}){let{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},78042:function(e,t,n){n.d(t,{Z:()=>x});var r=n("24246");n("27378");var o=n("90496"),i=n("85921"),c=n("35363"),a=n("11660"),s=n("82095"),l=n("77827"),u=n("57922");let d={cardContainer:"cardContainer_Uewx",cardTitle:"cardTitle_dwRT",cardDescription:"cardDescription_mCBT"};function h(e){var t=e.href,n=e.children;return(0,r.jsx)(c.Z,{href:t,className:(0,o.Z)("card padding--lg",d.cardContainer),children:n})}function f(e){var t=e.href,n=e.icon,i=e.title,c=e.description;return(0,r.jsxs)(h,{href:t,children:[(0,r.jsxs)(u.Z,{as:"h2",className:(0,o.Z)("text--truncate",d.cardTitle),title:i,children:[n," ",i]}),c&&(0,r.jsx)("p",{className:(0,o.Z)("text--truncate",d.cardDescription),title:c,children:c})]})}function m(e){var t,n,o=e.item,c=(0,i.LM)(o);var s=(t=(0,a.c)().selectMessage,function(e){return t(e,(0,l.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:e}))});return c?(0,r.jsx)(f,{href:c,icon:"\uD83D\uDDC3\uFE0F",title:o.label,description:null!==(n=o.description)&&void 0!==n?n:s(o.items.length)}):null}function p(e){var t,n,o=e.item,c=(0,s.Z)(o.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",a=(0,i.xz)(null!==(t=o.docId)&&void 0!==t?t:void 0);return(0,r.jsx)(f,{href:o.href,icon:c,title:o.label,description:null!==(n=o.description)&&void 0!==n?n:null==a?void 0:a.description})}function v(e){var t=e.item;switch(t.type){case"link":return(0,r.jsx)(p,{item:t});case"category":return(0,r.jsx)(m,{item:t});default:throw Error("unknown item type ".concat(JSON.stringify(t)))}}function g(e){var t=e.className,n=(0,i.jA)();return(0,r.jsx)(x,{items:n.items,className:t})}function x(e){var t=e.items,n=e.className;if(!t)return(0,r.jsx)(g,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){var r,o,i;r=e,o=t,i=n[t],o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i})}return e}({},e));var c=(0,i.MN)(t);return(0,r.jsx)("section",{className:(0,o.Z)("row",n),children:c.map(function(e,t){return(0,r.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,r.jsx)(v,{item:e})},t)})})}},11660:function(e,t,n){n.d(t,{c:function(){return s}});var r=n(27378),o=n(8156),i=["zero","one","two","few","many","other"];function c(e){return i.filter(function(t){return e.includes(t)})}var a={locale:"en",pluralForms:c(["one","other"]),select:function(e){return 1===e?"one":"other"}};function s(){var e,t=(e=(0,o.Z)().i18n.currentLocale,(0,r.useMemo)(function(){try{var t,n;return t=e,n=new Intl.PluralRules(t),{locale:t,pluralForms:c(n.resolvedOptions().pluralCategories),select:function(e){return n.select(e)}}}catch(t){return console.error('Failed to use Intl.PluralRules for locale "'.concat(e,'".\nDocusaurus will fallback to the default (English) implementation.\nError: ').concat(t.message,"\n")),a}},[e]));return{selectMessage:function(e,n){return function(e,t,n){var r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error("For locale=".concat(n.locale,", a maximum of ").concat(n.pluralForms.length," plural forms are expected (").concat(n.pluralForms.join(","),"), but the message contains ").concat(r.length,": ").concat(e));var o=n.select(t);return r[Math.min(n.pluralForms.indexOf(o),r.length-1)]}(n,e,t)}}}},80980:function(e,t,n){n.d(t,{Z:function(){return a},a:function(){return c}});var r=n(27378);let o={},i=r.createContext(o);function c(e){let t=r.useContext(i);return r.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);