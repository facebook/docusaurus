"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["25647"],{93373:function(e,t,s){s.r(t),s.d(t,{default:()=>h,frontMatter:()=>i,metadata:()=>n,assets:()=>o,toc:()=>u,contentTitle:()=>c});var n=JSON.parse('{"id":"index","title":"Docs tests","description":"This Docusaurus docs plugin instance is meant to test fancy edge-cases that regular unit tests don\'t really cover.","source":"@site/_dogfooding/_docs tests/index.mdx","sourceDirName":".","slug":"/","permalink":"/tests/docs/","draft":false,"unlisted":true,"tags":[{"inline":false,"label":"A","permalink":"/tests/docs/tags/a","description":"Description for tag a"},{"inline":false,"label":"Label for tag b","permalink":"/tests/docs/tags/b"},{"inline":false,"label":"C","permalink":"/tests/docs/tags/permalink-for-tag-c"}],"version":"current","lastUpdatedBy":"Max Schmitt","lastUpdatedAt":1738844754000,"frontMatter":{"slug":"/","tags":["a","b","c"],"unlisted":true,"id":"index","sidebar_label":"Docs tests"},"sidebar":"sidebar"}'),r=s(85893),l=s(80980),a=s(86762);let i={slug:"/",tags:["a","b","c"],unlisted:!0,id:"index",sidebar_label:"Docs tests"},c="Docs tests",o={},u=[];function d(e){let t={a:"a",h1:"h1",header:"header",hr:"hr",li:"li",p:"p",ul:"ul",...(0,l.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"docs-tests",children:"Docs tests"})}),"\n",(0,r.jsx)(t.p,{children:"This Docusaurus docs plugin instance is meant to test fancy edge-cases that regular unit tests don't really cover."}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"/tests/docs",children:"/tests/docs"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"/tests/blog",children:"/tests/blog"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"/tests/pages",children:"/tests/pages"})}),"\n"]}),"\n",(0,r.jsx)(t.hr,{}),"\n","\n",(0,r.jsx)(a.Z,{})]})}function h(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}h.displayName="MDXContent(_dogfooding/_docs tests/index.mdx)"},86762:function(e,t,s){s.d(t,{Z:()=>b});var n=s(85893);s(67294);var r=s(90496),l=s(85921),a=s(35363),i=s(11660),c=s(82095),o=s(77827),u=s(57922);let d={cardContainer:"cardContainer_Uewx",cardTitle:"cardTitle_dwRT",cardDescription:"cardDescription_mCBT"};function h(e){let{className:t,href:s,children:l}=e;return(0,n.jsx)(a.Z,{href:s,className:(0,r.Z)("card padding--lg",d.cardContainer,t),children:l})}function f(e){let{className:t,href:s,icon:l,title:a,description:i}=e;return(0,n.jsxs)(h,{href:s,className:t,children:[(0,n.jsxs)(u.Z,{as:"h2",className:(0,r.Z)("text--truncate",d.cardTitle),title:a,children:[l," ",a]}),i&&(0,n.jsx)("p",{className:(0,r.Z)("text--truncate",d.cardDescription),title:i,children:i})]})}function m(e){let{item:t}=e,s=(0,l.LM)(t),r=function(){let{selectMessage:e}=(0,i.c)();return t=>e(t,(0,o.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return s?(0,n.jsx)(f,{className:t.className,href:s,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??r(t.items.length)}):null}function p(e){let{item:t}=e,s=(0,c.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",r=(0,l.xz)(t.docId??void 0);return(0,n.jsx)(f,{className:t.className,href:t.href,icon:s,title:t.label,description:t.description??r?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return(0,n.jsx)(p,{item:t});case"category":return(0,n.jsx)(m,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function x(e){let{className:t}=e,s=(0,l.Ok)();return(0,n.jsx)(b,{items:s,className:t})}function j(e){let{item:t}=e;return(0,n.jsx)("article",{className:(0,r.Z)("docCardListItem_hvcp","col col--6"),children:(0,n.jsx)(g,{item:t})})}function b(e){let{items:t,className:s}=e;if(!t)return(0,n.jsx)(x,{...e});let a=(0,l.MN)(t);return(0,n.jsx)("section",{className:(0,r.Z)("row",s),children:a.map((e,t)=>(0,n.jsx)(j,{item:e},t))})}},11660:function(e,t,s){s.d(t,{c:()=>c});var n=s(67294),r=s(8156);let l=["zero","one","two","few","many","other"];function a(e){return l.filter(t=>e.includes(t))}let i={locale:"en",pluralForms:a(["one","other"]),select:e=>1===e?"one":"other"};function c(){let e=function(){let{i18n:{currentLocale:e}}=(0,r.Z)();return(0,n.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:a(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),i}},[e])}();return{selectMessage:(t,s)=>(function(e,t,s){let n=e.split("|");if(1===n.length)return n[0];n.length>s.pluralForms.length&&console.error(`For locale=${s.locale}, a maximum of ${s.pluralForms.length} plural forms are expected (${s.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);let r=s.select(t);return n[Math.min(s.pluralForms.indexOf(r),n.length-1)]})(s,t,e)}}},80980:function(e,t,s){s.d(t,{Z:()=>i,a:()=>a});var n=s(67294);let r={},l=n.createContext(r);function a(e){let t=n.useContext(l);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);