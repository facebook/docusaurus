"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["57301"],{10317:function(e,r,a){a.r(r),a.d(r,{frontMatter:()=>u,default:()=>h,contentTitle:()=>l,assets:()=>c,toc:()=>d,metadata:()=>t});var t=JSON.parse('{"id":"api/themes/theme-mermaid","title":"\uD83D\uDCE6 theme-mermaid","description":"This theme provides a @theme/Mermaid component that is powered by mermaid. You can read more on diagrams documentation.","source":"@site/docs/api/themes/theme-mermaid.mdx","sourceDirName":"api/themes","slug":"/api/themes/@docusaurus/theme-mermaid","permalink":"/docs/api/themes/@docusaurus/theme-mermaid","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/api/themes/theme-mermaid.mdx","tags":[],"version":"current","lastUpdatedBy":"Ben McCann","lastUpdatedAt":1744155424000,"sidebarPosition":5,"frontMatter":{"sidebar_position":5,"slug":"/api/themes/@docusaurus/theme-mermaid"},"sidebar":"api","previous":{"title":"\uD83D\uDCE6 theme-search-algolia","permalink":"/docs/api/themes/@docusaurus/theme-search-algolia"},"next":{"title":"\uD83D\uDCE6 create-docusaurus","permalink":"/docs/api/misc/create-docusaurus"}}'),n=a(85893),s=a(80980),i=a(15398),o=a(58636);let u={sidebar_position:5,slug:"/api/themes/@docusaurus/theme-mermaid"},l="\uD83D\uDCE6 theme-mermaid",c={},d=[{value:"Configuration",id:"configuration",level:2}];function m(e){let r={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"-theme-mermaid",children:"\uD83D\uDCE6 theme-mermaid"})}),"\n",(0,n.jsxs)(r.p,{children:["This theme provides a ",(0,n.jsx)(r.code,{children:"@theme/Mermaid"})," component that is powered by ",(0,n.jsx)(r.a,{href:"https://mermaid-js.github.io/",children:"mermaid"}),". You can read more on ",(0,n.jsx)(r.a,{href:"/docs/markdown-features/diagrams",children:"diagrams"})," documentation."]}),"\n",(0,n.jsxs)(i.Z,{groupId:"npm2yarn",children:[(0,n.jsx)(o.Z,{value:"npm",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"npm install --save @docusaurus/theme-mermaid\n"})})}),(0,n.jsx)(o.Z,{value:"yarn",label:"Yarn",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"yarn add @docusaurus/theme-mermaid\n"})})}),(0,n.jsx)(o.Z,{value:"pnpm",label:"pnpm",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"pnpm add @docusaurus/theme-mermaid\n"})})}),(0,n.jsx)(o.Z,{value:"bun",label:"Bun",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"bun add @docusaurus/theme-mermaid\n"})})})]}),"\n",(0,n.jsx)(r.h2,{id:"configuration",children:"Configuration"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  themes: ['@docusaurus/theme-mermaid'],\n  // In order for Mermaid code blocks in Markdown to work,\n  // you also need to enable the Remark plugin with this option\n  markdown: {\n    mermaid: true,\n  },\n};\n"})})]})}function h(e={}){let{wrapper:r}={...(0,s.a)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(m,{...e})}):m(e)}},58636:function(e,r,a){a.d(r,{Z:()=>s});var t=a(85893);a(67294);var n=a(90496);function s(e){let{children:r,hidden:a,className:s}=e;return(0,t.jsx)("div",{role:"tabpanel",className:(0,n.Z)("tabItem_pnkT",s),hidden:a,children:r})}},15398:function(e,r,a){a.d(r,{Z:()=>g});var t=a(85893),n=a(67294),s=a(90496),i=a(54947),o=a(3620),u=a(844),l=a(97486),c=a(32263),d=a(16971);function m(e){return n.Children.toArray(e).filter(e=>"\n"!==e).map(e=>{if(!e||(0,n.isValidElement)(e)&&function(e){let{props:r}=e;return!!r&&"object"==typeof r&&"value"in r}(e))return e;throw Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})?.filter(Boolean)??[]}function h(e){let{value:r,tabValues:a}=e;return a.some(e=>e.value===r)}var p=a(71607);function f(e){let{className:r,block:a,selectedValue:n,selectValue:o,tabValues:u}=e,l=[],{blockElementScrollPositionUntilNextRender:c}=(0,i.o5)(),d=e=>{let r=e.currentTarget,a=u[l.indexOf(r)].value;a!==n&&(c(r),o(a))},m=e=>{let r=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{let a=l.indexOf(e.currentTarget)+1;r=l[a]??l[0];break}case"ArrowLeft":{let a=l.indexOf(e.currentTarget)-1;r=l[a]??l[l.length-1]}}r?.focus()};return(0,t.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":a},r),children:u.map(e=>{let{value:r,label:a,attributes:i}=e;return(0,t.jsx)("li",{role:"tab",tabIndex:n===r?0:-1,"aria-selected":n===r,ref:e=>{l.push(e)},onKeyDown:m,onClick:d,...i,className:(0,s.Z)("tabs__item","tabItem_AQgk",i?.className,{"tabs__item--active":n===r}),children:a??r},r)})})}function b(e){let{lazy:r,children:a,selectedValue:i}=e,o=(Array.isArray(a)?a:[a]).filter(Boolean);if(r){let e=o.find(e=>e.props.value===i);return e?(0,n.cloneElement)(e,{className:(0,s.Z)("margin-top--md",e.props.className)}):null}return(0,t.jsx)("div",{className:"margin-top--md",children:o.map((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==i}))})}function v(e){let r=function(e){let{defaultValue:r,queryString:a=!1,groupId:t}=e,s=function(e){let{values:r,children:a}=e;return(0,n.useMemo)(()=>{let e=r??m(a).map(e=>{let{props:{value:r,label:a,attributes:t,default:n}}=e;return{value:r,label:a,attributes:t,default:n}}),t=(0,c.lx)(e,(e,r)=>e.value===r.value);if(t.length>0)throw Error(`Docusaurus error: Duplicate values "${t.map(e=>e.value).join(", ")}" found in <Tabs>. Every value needs to be unique.`);return e},[r,a])}(e),[i,p]=(0,n.useState)(()=>(function(e){let{defaultValue:r,tabValues:a}=e;if(0===a.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(r){if(!h({value:r,tabValues:a}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${r}" but none of its children has the corresponding value. Available values are: ${a.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return r}let t=a.find(e=>e.default)??a[0];if(!t)throw Error("Unexpected error: 0 tabValues");return t.value})({defaultValue:r,tabValues:s})),[f,b]=function(e){let{queryString:r=!1,groupId:a}=e,t=(0,o.k6)(),s=function(e){let{queryString:r=!1,groupId:a}=e;if("string"==typeof r)return r;if(!1===r)return null;if(!0===r&&!a)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:r,groupId:a});return[(0,l._X)(s),(0,n.useCallback)(e=>{if(!s)return;let r=new URLSearchParams(t.location.search);r.set(s,e),t.replace({...t.location,search:r.toString()})},[s,t])]}({queryString:a,groupId:t}),[v,g]=function(e){let{groupId:r}=e,a=r?`docusaurus.tab.${r}`:null,[t,s]=(0,d.Nk)(a);return[t,(0,n.useCallback)(e=>{a&&s.set(e)},[a,s])]}({groupId:t}),x=(()=>{let e=f??v;return h({value:e,tabValues:s})?e:null})();return(0,u.Z)(()=>{x&&p(x)},[x]),{selectedValue:i,selectValue:(0,n.useCallback)(e=>{if(!h({value:e,tabValues:s}))throw Error(`Can't select invalid tab value=${e}`);p(e),b(e),g(e)},[b,g,s]),tabValues:s}}(e);return(0,t.jsxs)("div",{className:(0,s.Z)("tabs-container","tabList_Qoir"),children:[(0,t.jsx)(f,{...r,...e}),(0,t.jsx)(b,{...r,...e})]})}function g(e){let r=(0,p.Z)();return(0,t.jsx)(v,{...e,children:m(e.children)},String(r))}},80980:function(e,r,a){a.d(r,{Z:()=>o,a:()=>i});var t=a(67294);let n={},s=t.createContext(n);function i(e){let r=t.useContext(s);return t.useMemo(function(){return"function"==typeof e?e(r):{...r,...e}},[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),t.createElement(s.Provider,{value:r},e.children)}}}]);