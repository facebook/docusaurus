"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["17663"],{22083:function(e,t,n){n.r(t),n.d(t,{default:()=>h,frontMatter:()=>a,metadata:()=>r,assets:()=>l,toc:()=>d,contentTitle:()=>c});var r=JSON.parse('{"id":"advanced/index","title":"Advanced Tutorials","description":"This section is not going to be very structured, but we will cover the following topics:","source":"@site/docs/advanced/index.mdx","sourceDirName":"advanced","slug":"/advanced/","permalink":"/docs/advanced/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/advanced/index.mdx","tags":[],"version":"current","lastUpdatedBy":"Massoud Maboudi","lastUpdatedAt":1740053056000,"frontMatter":{},"sidebar":"docs","previous":{"title":"What\'s next?","permalink":"/docs/guides/whats-next"},"next":{"title":"Architecture","permalink":"/docs/advanced/architecture"}}'),s=n(85893),i=n(80980),o=n(86762);let a={},c="Advanced Tutorials",l={},d=[];function u(e){let t={a:"a",h1:"h1",header:"header",p:"p",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"advanced-tutorials",children:"Advanced Tutorials"})}),"\n",(0,s.jsx)(t.p,{children:"This section is not going to be very structured, but we will cover the following topics:"}),"\n","\n",(0,s.jsx)(o.Z,{}),"\n",(0,s.jsxs)(t.p,{children:["We will assume that you have finished the guides, and know the basics like how to configure plugins, how to write React components, etc. These sections will have plugin authors and code contributors in mind, so we may occasionally refer to ",(0,s.jsx)(t.a,{href:"/docs/api/plugin-methods/",children:"plugin APIs"})," or other architecture details. Don't panic if you don't understand everything\uD83D\uDE09"]})]})}function h(e={}){let{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},86762:function(e,t,n){n.d(t,{Z:()=>v});var r=n(85893);n(67294);var s=n(90496),i=n(85921),o=n(35363),a=n(11660),c=n(82095),l=n(77827),d=n(57922);let u={cardContainer:"cardContainer_Uewx",cardTitle:"cardTitle_dwRT",cardDescription:"cardDescription_mCBT"};function h(e){let{className:t,href:n,children:i}=e;return(0,r.jsx)(o.Z,{href:n,className:(0,s.Z)("card padding--lg",u.cardContainer,t),children:i})}function m(e){let{className:t,href:n,icon:i,title:o,description:a}=e;return(0,r.jsxs)(h,{href:n,className:t,children:[(0,r.jsxs)(d.Z,{as:"h2",className:(0,s.Z)("text--truncate",u.cardTitle),title:o,children:[i," ",o]}),a&&(0,r.jsx)("p",{className:(0,s.Z)("text--truncate",u.cardDescription),title:a,children:a})]})}function p(e){let{item:t}=e,n=(0,i.LM)(t),s=function(){let{selectMessage:e}=(0,a.c)();return t=>e(t,(0,l.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return n?(0,r.jsx)(m,{className:t.className,href:n,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??s(t.items.length)}):null}function f(e){let{item:t}=e,n=(0,c.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",s=(0,i.xz)(t.docId??void 0);return(0,r.jsx)(m,{className:t.className,href:t.href,icon:n,title:t.label,description:t.description??s?.description})}function x(e){let{item:t}=e;switch(t.type){case"link":return(0,r.jsx)(f,{item:t});case"category":return(0,r.jsx)(p,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function g(e){let{className:t}=e,n=(0,i.Ok)();return(0,r.jsx)(v,{items:n,className:t})}function w(e){let{item:t}=e;return(0,r.jsx)("article",{className:(0,s.Z)("docCardListItem_hvcp","col col--6"),children:(0,r.jsx)(x,{item:t})})}function v(e){let{items:t,className:n}=e;if(!t)return(0,r.jsx)(g,{...e});let o=(0,i.MN)(t);return(0,r.jsx)("section",{className:(0,s.Z)("row",n),children:o.map((e,t)=>(0,r.jsx)(w,{item:e},t))})}},11660:function(e,t,n){n.d(t,{c:()=>c});var r=n(67294),s=n(8156);let i=["zero","one","two","few","many","other"];function o(e){return i.filter(t=>e.includes(t))}let a={locale:"en",pluralForms:o(["one","other"]),select:e=>1===e?"one":"other"};function c(){let e=function(){let{i18n:{currentLocale:e}}=(0,s.Z)();return(0,r.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:o(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),a}},[e])}();return{selectMessage:(t,n)=>(function(e,t,n){let r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${r.length}: ${e}`);let s=n.select(t);return r[Math.min(n.pluralForms.indexOf(s),r.length-1)]})(n,t,e)}}},80980:function(e,t,n){n.d(t,{Z:()=>a,a:()=>o});var r=n(67294);let s={},i=r.createContext(s);function o(e){let t=r.useContext(i);return r.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);