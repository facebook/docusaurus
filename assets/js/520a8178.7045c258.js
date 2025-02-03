"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["4828"],{25891:function(e,n,t){t.r(n),t.d(n,{default:()=>h,frontMatter:()=>u,metadata:()=>i,assets:()=>c,toc:()=>d,contentTitle:()=>o});var i=JSON.parse('{"id":"api/plugins/plugin-debug","title":"\uD83D\uDCE6 plugin-debug","description":"The debug plugin will display useful debug information at http3000/docusaurus/debug.","source":"@site/docs/api/plugins/plugin-debug.mdx","sourceDirName":"api/plugins","slug":"/api/plugins/@docusaurus/plugin-debug","permalink":"/docs/api/plugins/@docusaurus/plugin-debug","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/api/plugins/plugin-debug.mdx","tags":[],"version":"current","lastUpdatedBy":"Stephen Glass","lastUpdatedAt":1738583816000,"sidebarPosition":5,"frontMatter":{"sidebar_position":5,"slug":"/api/plugins/@docusaurus/plugin-debug"},"sidebar":"api","previous":{"title":"\uD83D\uDCE6 plugin-client-redirects","permalink":"/docs/api/plugins/@docusaurus/plugin-client-redirects"},"next":{"title":"\uD83D\uDCE6 plugin-google-analytics","permalink":"/docs/api/plugins/@docusaurus/plugin-google-analytics"}}'),s=t(85893),r=t(80980),l=t(15398),a=t(58636);let u={sidebar_position:5,slug:"/api/plugins/@docusaurus/plugin-debug"},o="\uD83D\uDCE6 plugin-debug",c={},d=[{value:"Installation",id:"installation",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Example configuration",id:"ex-config",level:3}];function p(e){let n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"-plugin-debug",children:"\uD83D\uDCE6 plugin-debug"})}),"\n","\n",(0,s.jsxs)(n.p,{children:["The debug plugin will display useful debug information at ",(0,s.jsx)(n.a,{href:"http://localhost:3000/__docusaurus/debug",children:(0,s.jsx)(n.code,{children:"http://localhost:3000/__docusaurus/debug"})}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["It is mostly useful for plugin authors, that will be able to inspect more easily the content of the ",(0,s.jsx)(n.code,{children:".docusaurus"})," folder (like the creates routes), but also be able to inspect data structures that are never written to disk, like the plugin data loaded through the ",(0,s.jsx)(n.code,{children:"contentLoaded"})," lifecycle."]}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsxs)(n.p,{children:["If you use the plugin via the classic preset, the preset will ",(0,s.jsx)(n.strong,{children:"enable the plugin in development and disable it in production"})," by default (",(0,s.jsx)(n.code,{children:"debug: undefined"}),") to avoid exposing potentially sensitive information. You can use ",(0,s.jsx)(n.code,{children:"debug: true"})," to always enable it or ",(0,s.jsx)(n.code,{children:"debug: false"})," to always disable it."]}),(0,s.jsx)(n.p,{children:"If you use a standalone plugin, you may need to achieve the same effect by checking the environment:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  plugins: [\n    // highlight-next-line\n    process.env.NODE_ENV === 'production' && '@docusaurus/plugin-debug',\n  ].filter(Boolean),\n};\n"})})]}),"\n",(0,s.jsxs)(n.admonition,{type:"note",children:[(0,s.jsx)(n.p,{children:"If you report a bug, we will probably ask you to have this plugin turned on in the production, so that we can inspect your deployment config more easily."}),(0,s.jsxs)(n.p,{children:["If you don't have any sensitive information, you can keep it on in production ",(0,s.jsx)(n.a,{href:"/__docusaurus/debug",children:"like we do"}),"."]})]}),"\n",(0,s.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsxs)(l.Z,{groupId:"npm2yarn",children:[(0,s.jsx)(a.Z,{value:"npm",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install --save @docusaurus/plugin-debug\n"})})}),(0,s.jsx)(a.Z,{value:"yarn",label:"Yarn",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn add @docusaurus/plugin-debug\n"})})}),(0,s.jsx)(a.Z,{value:"pnpm",label:"pnpm",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"pnpm add @docusaurus/plugin-debug\n"})})})]}),"\n",(0,s.jsxs)(n.admonition,{type:"tip",children:[(0,s.jsxs)(n.p,{children:["If you use the preset ",(0,s.jsx)(n.code,{children:"@docusaurus/preset-classic"}),", you don't need to install this plugin as a dependency."]}),(0,s.jsxs)(n.p,{children:["You can configure this plugin through the ",(0,s.jsx)(n.a,{href:"/docs/using-plugins#docusauruspreset-classic",children:"preset options"}),"."]})]}),"\n",(0,s.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,s.jsx)(n.p,{children:"This plugin currently has no options."}),"\n",(0,s.jsx)(n.h3,{id:"ex-config",children:"Example configuration"}),"\n",(0,s.jsx)(n.p,{children:"You can configure this plugin through preset options or plugin options."}),"\n",(0,s.jsx)(n.admonition,{type:"tip",children:(0,s.jsx)(n.p,{children:"Most Docusaurus users configure this plugin through the preset options."})}),"\n",(0,s.jsxs)(l.Z,{groupId:"api-config-ex",children:[(0,s.jsxs)(a.Z,{value:"preset",label:"Preset options",children:[(0,s.jsxs)(n.p,{children:["If you use a preset, configure this plugin through the ",(0,s.jsx)(n.a,{href:"/docs/using-plugins#docusauruspreset-classic",children:"preset options"}),":"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  presets: [\n    [\n      '@docusaurus/preset-classic',\n      {\n        // highlight-next-line\n        debug: true, // This will enable the plugin in production\n      },\n    ],\n  ],\n};\n"})})]}),(0,s.jsxs)(a.Z,{value:"plugin",label:"Plugin Options",children:[(0,s.jsx)(n.p,{children:"If you are using a standalone plugin, provide options directly to the plugin:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  // highlight-next-line\n  plugins: ['@docusaurus/plugin-debug'],\n};\n"})})]})]})]})}function h(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},58636:function(e,n,t){t.d(n,{Z:()=>r});var i=t(85893);t(67294);var s=t(90496);function r(e){let{children:n,hidden:t,className:r}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,s.Z)("tabItem_pnkT",r),hidden:t,children:n})}},15398:function(e,n,t){t.d(n,{Z:()=>x});var i=t(85893),s=t(67294),r=t(90496),l=t(54947),a=t(3620),u=t(844),o=t(97486),c=t(32263),d=t(16971);function p(e){return s.Children.toArray(e).filter(e=>"\n"!==e).map(e=>{if(!e||s.isValidElement(e)&&function(e){let{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})?.filter(Boolean)??[]}function h(e){let{value:n,tabValues:t}=e;return t.some(e=>e.value===n)}var g=t(71607);function f(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:u}=e,o=[],{blockElementScrollPositionUntilNextRender:c}=(0,l.o5)(),d=e=>{let n=e.currentTarget,t=u[o.indexOf(n)].value;t!==s&&(c(n),a(t))},p=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{let t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{let t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1]}}n?.focus()};return(0,i.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":t},n),children:u.map(e=>{let{value:n,label:t,attributes:l}=e;return(0,i.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>{o.push(e)},onKeyDown:p,onClick:d,...l,className:(0,r.Z)("tabs__item","tabItem_AQgk",l?.className,{"tabs__item--active":s===n}),children:t??n},n)})})}function b(e){let{lazy:n,children:t,selectedValue:l}=e,a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){let e=a.find(e=>e.props.value===l);return e?(0,s.cloneElement)(e,{className:(0,r.Z)("margin-top--md",e.props.className)}):null}return(0,i.jsx)("div",{className:"margin-top--md",children:a.map((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==l}))})}function m(e){let n=function(e){let{defaultValue:n,queryString:t=!1,groupId:i}=e,r=function(e){let{values:n,children:t}=e;return(0,s.useMemo)(()=>{let e=n??p(t).map(e=>{let{props:{value:n,label:t,attributes:i,default:s}}=e;return{value:n,label:t,attributes:i,default:s}});return!function(e){let n=(0,c.lx)(e,(e,n)=>e.value===n.value);if(n.length>0)throw Error(`Docusaurus error: Duplicate values "${n.map(e=>e.value).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e},[n,t])}(e),[l,g]=(0,s.useState)(()=>(function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:t}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}let i=t.find(e=>e.default)??t[0];if(!i)throw Error("Unexpected error: 0 tabValues");return i.value})({defaultValue:n,tabValues:r})),[f,b]=function(e){let{queryString:n=!1,groupId:t}=e,i=(0,a.k6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o._X)(r),(0,s.useCallback)(e=>{if(!r)return;let n=new URLSearchParams(i.location.search);n.set(r,e),i.replace({...i.location,search:n.toString()})},[r,i])]}({queryString:t,groupId:i}),[m,x]=function(e){let{groupId:n}=e,t=n?`docusaurus.tab.${n}`:null,[i,r]=(0,d.Nk)(t);return[i,(0,s.useCallback)(e=>{t&&r.set(e)},[t,r])]}({groupId:i}),j=(()=>{let e=f??m;return h({value:e,tabValues:r})?e:null})();return(0,u.Z)(()=>{j&&g(j)},[j]),{selectedValue:l,selectValue:(0,s.useCallback)(e=>{if(!h({value:e,tabValues:r}))throw Error(`Can't select invalid tab value=${e}`);g(e),b(e),x(e)},[b,x,r]),tabValues:r}}(e);return(0,i.jsxs)("div",{className:(0,r.Z)("tabs-container","tabList_Qoir"),children:[(0,i.jsx)(f,{...n,...e}),(0,i.jsx)(b,{...n,...e})]})}function x(e){let n=(0,g.Z)();return(0,i.jsx)(m,{...e,children:p(e.children)},String(n))}},80980:function(e,n,t){t.d(n,{Z:()=>a,a:()=>l});var i=t(67294);let s={},r=i.createContext(s);function l(e){let n=i.useContext(r);return i.useMemo(function(){return"function"==typeof e?e(n):{...n,...e}},[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);