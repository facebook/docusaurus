"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["16034"],{95231:function(e,t,s){s.r(t),s.d(t,{frontMatter:()=>o,default:()=>h,contentTitle:()=>a,assets:()=>d,toc:()=>c,metadata:()=>i});var i=JSON.parse('{"id":"tests/visibility/index","title":"Visibility","description":"A category to play with draft/unlisted front matter.","source":"@site/_dogfooding/_docs tests/tests/visibility/index.mdx","sourceDirName":"tests/visibility","slug":"/tests/visibility/","permalink":"/tests/docs/tests/visibility/","draft":false,"unlisted":false,"tags":[{"inline":false,"label":"Visibility","permalink":"/tests/docs/tags/visibility"}],"version":"current","lastUpdatedBy":"dependabot[bot]","lastUpdatedAt":1740766043000,"frontMatter":{"tags":["visibility"]},"sidebar":"sidebar","previous":{"title":"TOC partial test","permalink":"/tests/docs/tests/toc-partials/"},"next":{"title":"Some Drafts - Listed 1","permalink":"/tests/docs/tests/visibility/some-drafts/draft-subcategory/listed1"}}'),n=s(85893),l=s(80980),r=s(86762);let o={tags:["visibility"]},a="Visibility",d={},c=[];function u(e){let t={a:"a",h1:"h1",header:"header",hr:"hr",li:"li",p:"p",ul:"ul",...(0,l.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"visibility",children:"Visibility"})}),"\n",(0,n.jsx)(t.p,{children:"A category to play with draft/unlisted front matter."}),"\n",(0,n.jsx)(t.p,{children:"In dev, both draft/unlisted items are displayed."}),"\n",(0,n.jsx)(t.hr,{}),"\n",(0,n.jsx)(t.p,{children:"In production, draft items shouldn't be accessible:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"pathname:///tests/docs/tests/visibility/only-drafts/draft1",children:"/tests/docs/tests/visibility/only-drafts/draft1"})}),"\n"]}),"\n",(0,n.jsx)(t.hr,{}),"\n",(0,n.jsx)(t.p,{children:"In production, unlisted items should remain accessible, but be hidden in the sidebar (unless currently browsed):"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/only-unlisteds/unlisted1",children:"./only-unlisteds/unlisted1.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/only-unlisteds/unlisted2",children:"./only-unlisteds/unlisted2.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/only-unlisteds/unlisted-subcategory/unlisted3",children:"./only-unlisteds/unlisted-subcategory/unlisted3.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/some-unlisteds/unlisted1",children:"./some-unlisteds/unlisted1.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/some-unlisteds/unlisted2",children:"./some-unlisteds/unlisted2.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/some-unlisteds/unlisted-subcategory/unlisted3",children:"./some-unlisteds/unlisted-subcategory/unlisted3.md"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"/tests/docs/tests/visibility/force-unlisted",children:"./force-unlisted.mdx"})}),"\n"]}),"\n",(0,n.jsx)(t.hr,{}),"\n","\n",(0,n.jsx)(r.Z,{})]})}function h(e={}){let{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(u,{...e})}):u(e)}h.displayName="MDXContent(_dogfooding/_docs tests/tests/visibility/index.mdx)"},86762:function(e,t,s){s.d(t,{Z:()=>j});var i=s(85893);s(67294);var n=s(90496),l=s(85921),r=s(35363),o=s(11660),a=s(82095),d=s(77827),c=s(57922);let u={cardContainer:"cardContainer_Uewx",cardTitle:"cardTitle_dwRT",cardDescription:"cardDescription_mCBT"};function h(e){let{className:t,href:s,children:l}=e;return(0,i.jsx)(r.Z,{href:s,className:(0,n.Z)("card padding--lg",u.cardContainer,t),children:l})}function m(e){let{className:t,href:s,icon:l,title:r,description:o}=e;return(0,i.jsxs)(h,{href:s,className:t,children:[(0,i.jsxs)(c.Z,{as:"h2",className:(0,n.Z)("text--truncate",u.cardTitle),title:r,children:[l," ",r]}),o&&(0,i.jsx)("p",{className:(0,n.Z)("text--truncate",u.cardDescription),title:o,children:o})]})}function f(e){let{item:t}=e,s=(0,l.LM)(t),n=function(){let{selectMessage:e}=(0,o.c)();return t=>e(t,(0,d.I)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return s?(0,i.jsx)(m,{className:t.className,href:s,icon:"\uD83D\uDDC3\uFE0F",title:t.label,description:t.description??n(t.items.length)}):null}function p(e){let{item:t}=e,s=(0,a.Z)(t.href)?"\uD83D\uDCC4\uFE0F":"\uD83D\uDD17",n=(0,l.xz)(t.docId??void 0);return(0,i.jsx)(m,{className:t.className,href:t.href,icon:s,title:t.label,description:t.description??n?.description})}function x(e){let{item:t}=e;switch(t.type){case"link":return(0,i.jsx)(p,{item:t});case"category":return(0,i.jsx)(f,{item:t});default:throw Error(`unknown item type ${JSON.stringify(t)}`)}}function y(e){let{className:t}=e,s=(0,l.Ok)();return(0,i.jsx)(j,{items:s,className:t})}function b(e){let{item:t}=e;return(0,i.jsx)("article",{className:(0,n.Z)("docCardListItem_hvcp","col col--6"),children:(0,i.jsx)(x,{item:t})})}function j(e){let{items:t,className:s}=e;if(!t)return(0,i.jsx)(y,{...e});let r=(0,l.MN)(t);return(0,i.jsx)("section",{className:(0,n.Z)("row",s),children:r.map((e,t)=>(0,i.jsx)(b,{item:e},t))})}},11660:function(e,t,s){s.d(t,{c:()=>a});var i=s(67294),n=s(8156);let l=["zero","one","two","few","many","other"];function r(e){return l.filter(t=>e.includes(t))}let o={locale:"en",pluralForms:r(["one","other"]),select:e=>1===e?"one":"other"};function a(){let e=function(){let{i18n:{currentLocale:e}}=(0,n.Z)();return(0,i.useMemo)(()=>{try{return function(e){let t=new Intl.PluralRules(e);return{locale:e,pluralForms:r(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".
Docusaurus will fallback to the default (English) implementation.
Error: ${t.message}
`),o}},[e])}();return{selectMessage:(t,s)=>(function(e,t,s){let i=e.split("|");if(1===i.length)return i[0];i.length>s.pluralForms.length&&console.error(`For locale=${s.locale}, a maximum of ${s.pluralForms.length} plural forms are expected (${s.pluralForms.join(",")}), but the message contains ${i.length}: ${e}`);let n=s.select(t);return i[Math.min(s.pluralForms.indexOf(n),i.length-1)]})(s,t,e)}}},80980:function(e,t,s){s.d(t,{Z:()=>o,a:()=>r});var i=s(67294);let n={},l=i.createContext(n);function r(e){let t=i.useContext(l);return i.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),i.createElement(l.Provider,{value:t},e.children)}}}]);