(self.webpackChunktest_website_in_workspace=self.webpackChunktest_website_in_workspace||[]).push([[6061],{2473:(e,t,n)=>{"use strict";n.d(t,{A:()=>H});var s=n(6540),a=n(4848);function r(e){const{mdxAdmonitionTitle:t,rest:n}=function(e){const t=s.Children.toArray(e),n=t.find((e=>s.isValidElement(e)&&"mdxAdmonitionTitle"===e.type)),r=t.filter((e=>e!==n)),o=n?.props.children;return{mdxAdmonitionTitle:o,rest:r.length>0?(0,a.jsx)(a.Fragment,{children:r}):null}}(e.children),r=e.title??t;return{...e,...r&&{title:r},children:n}}var o=n(1750),i=n(4709),c=n(8532);const l="admonition_o5H7",d="admonitionHeading_FzoX",u="admonitionIcon_rXq6",m="admonitionContent_Knsx";function h(e){let{type:t,className:n,children:s}=e;return(0,a.jsx)("div",{className:(0,o.A)(c.G.common.admonition,c.G.common.admonitionType(t),l,n),children:s})}function f(e){let{icon:t,title:n}=e;return(0,a.jsxs)("div",{className:d,children:[(0,a.jsx)("span",{className:u,children:t}),n]})}function p(e){let{children:t}=e;return t?(0,a.jsx)("div",{className:m,children:t}):null}function x(e){const{type:t,icon:n,title:s,children:r,className:o}=e;return(0,a.jsxs)(h,{type:t,className:o,children:[s||n?(0,a.jsx)(f,{title:s,icon:n}):null,(0,a.jsx)(p,{children:r})]})}function g(e){return(0,a.jsx)("svg",{viewBox:"0 0 14 16",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})})}const v={icon:(0,a.jsx)(g,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})};function j(e){return(0,a.jsx)(x,{...v,...e,className:(0,o.A)("alert alert--secondary",e.className),children:e.children})}function b(e){return(0,a.jsx)("svg",{viewBox:"0 0 12 16",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})})}const N={icon:(0,a.jsx)(b,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})};function A(e){return(0,a.jsx)(x,{...N,...e,className:(0,o.A)("alert alert--success",e.className),children:e.children})}function y(e){return(0,a.jsx)("svg",{viewBox:"0 0 14 16",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})})}const k={icon:(0,a.jsx)(y,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})};function C(e){return(0,a.jsx)(x,{...k,...e,className:(0,o.A)("alert alert--info",e.className),children:e.children})}function w(e){return(0,a.jsx)("svg",{viewBox:"0 0 16 16",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})})}const B={icon:(0,a.jsx)(w,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.warning",description:"The default label used for the Warning admonition (:::warning)",children:"warning"})};function L(e){return(0,a.jsx)("svg",{viewBox:"0 0 12 16",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})})}const _={icon:(0,a.jsx)(L,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})};const E={icon:(0,a.jsx)(w,{}),title:(0,a.jsx)(i.A,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})};const T={...{note:j,tip:A,info:C,warning:function(e){return(0,a.jsx)(x,{...B,...e,className:(0,o.A)("alert alert--warning",e.className),children:e.children})},danger:function(e){return(0,a.jsx)(x,{..._,...e,className:(0,o.A)("alert alert--danger",e.className),children:e.children})}},...{secondary:e=>(0,a.jsx)(j,{title:"secondary",...e}),important:e=>(0,a.jsx)(C,{title:"important",...e}),success:e=>(0,a.jsx)(A,{title:"success",...e}),caution:function(e){return(0,a.jsx)(x,{...E,...e,className:(0,o.A)("alert alert--warning",e.className),children:e.children})}}};function H(e){const t=r(e),n=(s=t.type,T[s]||(console.warn(`No admonition component found for admonition type "${s}". Using Info as fallback.`),T.info));var s;return(0,a.jsx)(n,{...t})}},9169:(e,t,n)=>{"use strict";n.d(t,{A:()=>l});n(6540);var s=n(1750),a=n(9137),r=n(8532),o=n(2473),i=n(4848);function c(e){let{className:t}=e;return(0,i.jsx)(o.A,{type:"caution",title:(0,i.jsx)(a.Rc,{}),className:(0,s.A)(t,r.G.common.unlistedBanner),children:(0,i.jsx)(a.Uh,{})})}function l(e){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(a.AE,{}),(0,i.jsx)(c,{...e})]})}},5088:(e,t,n)=>{"use strict";n.d(t,{A:()=>d});n(6540);var s=n(1750),a=n(9137),r=n(8532),o=n(2473),i=n(4848);function c(e){let{className:t}=e;return(0,i.jsx)(o.A,{type:"caution",title:(0,i.jsx)(a.Yh,{}),className:(0,s.A)(t,r.G.common.draftBanner),children:(0,i.jsx)(a.TT,{})})}var l=n(9169);function d(e){let{metadata:t}=e;const{unlisted:n,frontMatter:s}=t;return(0,i.jsxs)(i.Fragment,{children:[(n||s.unlisted)&&(0,i.jsx)(l.A,{}),s.draft&&(0,i.jsx)(c,{})]})}},8800:(e,t,n)=>{"use strict";n.d(t,{A:()=>x});n(6540);var s=n(1750),a=n(4709),r=n(8532),o=n(5739);const i={iconEdit:"iconEdit_IMw_"};var c=n(4848);function l(e){let{className:t,...n}=e;return(0,c.jsx)("svg",{fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,s.A)(i.iconEdit,t),"aria-hidden":"true",...n,children:(0,c.jsx)("g",{children:(0,c.jsx)("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})})})}function d(e){let{editUrl:t}=e;return(0,c.jsxs)(o.A,{to:t,className:r.G.common.editThisPage,children:[(0,c.jsx)(l,{}),(0,c.jsx)(a.A,{id:"theme.common.editThisPage",description:"The link label to edit the current page",children:"Edit this page"})]})}var u=n(9153);function m(e){let{lastUpdatedAt:t}=e;const n=new Date(t),s=(0,u.i)({day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(n);return(0,c.jsx)(a.A,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:(0,c.jsx)("b",{children:(0,c.jsx)("time",{dateTime:n.toISOString(),itemProp:"dateModified",children:s})})},children:" on {date}"})}function h(e){let{lastUpdatedBy:t}=e;return(0,c.jsx)(a.A,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:(0,c.jsx)("b",{children:t})},children:" by {user}"})}function f(e){let{lastUpdatedAt:t,lastUpdatedBy:n}=e;return(0,c.jsxs)("span",{className:r.G.common.lastUpdated,children:[(0,c.jsx)(a.A,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t?(0,c.jsx)(m,{lastUpdatedAt:t}):"",byUser:n?(0,c.jsx)(h,{lastUpdatedBy:n}):""},children:"Last updated{atDate}{byUser}"}),!1]})}const p={lastUpdated:"lastUpdated_OHCJ"};function x(e){let{className:t,editUrl:n,lastUpdatedAt:a,lastUpdatedBy:r}=e;return(0,c.jsxs)("div",{className:(0,s.A)("row",t),children:[(0,c.jsx)("div",{className:"col",children:n&&(0,c.jsx)(d,{editUrl:n})}),(0,c.jsx)("div",{className:(0,s.A)("col",p.lastUpdated),children:(a||r)&&(0,c.jsx)(f,{lastUpdatedAt:a,lastUpdatedBy:r})})]})}},853:(e,t,n)=>{"use strict";n.d(t,{A:()=>he});var s=n(6540),a=n(3023),r=n(2785),o=n(3754),i=n(1750),c=n(5407),l=n(6963);function d(){const{prism:e}=(0,l.p)(),{colorMode:t}=(0,c.G)(),n=e.theme,s=e.darkTheme||n;return"dark"===t?s:n}var u=n(8532),m=n(9934),h=n.n(m);const f=/title=(?<quote>["'])(?<title>.*?)\1/,p=/\{(?<range>[\d,-]+)\}/,x={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}},g={...x,lua:{start:"--",end:""},wasm:{start:"\\;\\;",end:""},tex:{start:"%",end:""},vb:{start:"['\u2018\u2019]",end:""},vbnet:{start:"(?:_\\s*)?['\u2018\u2019]",end:""},rem:{start:"[Rr][Ee][Mm]\\b",end:""},f90:{start:"!",end:""},ml:{start:"\\(\\*",end:"\\*\\)"},cobol:{start:"\\*>",end:""}},v=Object.keys(x);function j(e,t){const n=e.map((e=>{const{start:n,end:s}=g[e];return`(?:${n}\\s*(${t.flatMap((e=>[e.line,e.block?.start,e.block?.end].filter(Boolean))).join("|")})\\s*${s})`})).join("|");return new RegExp(`^\\s*(?:${n})\\s*$`)}function b(e){let{showLineNumbers:t,metastring:n}=e;return"boolean"==typeof t?t?1:void 0:"number"==typeof t?t:function(e){const t=e?.split(" ").find((e=>e.startsWith("showLineNumbers")));if(t){if(t.startsWith("showLineNumbers=")){const e=t.replace("showLineNumbers=","");return parseInt(e,10)}return 1}}(n)}function N(e,t){let n=e.replace(/\n$/,"");const{language:s,magicComments:a,metastring:r}=t;if(r&&p.test(r)){const e=r.match(p).groups.range;if(0===a.length)throw new Error(`A highlight range has been given in code block's metastring (\`\`\` ${r}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.`);const t=a[0].className,s=h()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(s),code:n}}if(void 0===s)return{lineClassNames:{},code:n};const o=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return j(["js","jsBlock"],t);case"jsx":case"tsx":return j(["js","jsBlock","jsx"],t);case"html":return j(["js","jsBlock","html"],t);case"python":case"py":case"bash":return j(["bash"],t);case"markdown":case"md":return j(["html","jsx","bash"],t);case"tex":case"latex":case"matlab":return j(["tex"],t);case"lua":case"haskell":return j(["lua"],t);case"sql":return j(["lua","jsBlock"],t);case"wasm":return j(["wasm"],t);case"vb":case"vba":case"visual-basic":return j(["vb","rem"],t);case"vbnet":return j(["vbnet","rem"],t);case"batch":return j(["rem"],t);case"basic":return j(["rem","f90"],t);case"fsharp":return j(["js","ml"],t);case"ocaml":case"sml":return j(["ml"],t);case"fortran":return j(["f90"],t);case"cobol":return j(["cobol"],t);default:return j(v,t)}}(s,a),i=n.split("\n"),c=Object.fromEntries(a.map((e=>[e.className,{start:0,range:""}]))),l=Object.fromEntries(a.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),d=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),u=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let h=0;h<i.length;){const e=i[h].match(o);if(!e){h+=1;continue}const t=e.slice(1).find((e=>void 0!==e));l[t]?c[l[t]].range+=`${h},`:d[t]?c[d[t]].start=h:u[t]&&(c[u[t]].range+=`${c[u[t]].start}-${h-1},`),i.splice(h,1)}n=i.join("\n");const m={};return Object.entries(c).forEach((e=>{let[t,{range:n}]=e;h()(n).forEach((e=>{m[e]??=[],m[e].push(t)}))})),{lineClassNames:m,code:n}}const A="codeBlockContainer_jDV4";var y=n(4848);function k(e){let{as:t,...n}=e;const s=function(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[s,a]=e;const r=t[s];r&&"string"==typeof a&&(n[r]=a)})),n}(d());return(0,y.jsx)(t,{...n,style:s,className:(0,i.A)(n.className,A,u.G.common.codeBlock)})}const C={codeBlockContent:"codeBlockContent_vx7S",codeBlockTitle:"codeBlockTitle_bdru",codeBlock:"codeBlock_Gebt",codeBlockStandalone:"codeBlockStandalone_i_cY",codeBlockLines:"codeBlockLines_FJaf",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_FU9Q",buttonGroup:"buttonGroup_cUGO"};function w(e){let{children:t,className:n}=e;return(0,y.jsx)(k,{as:"pre",tabIndex:0,className:(0,i.A)(C.codeBlockStandalone,"thin-scrollbar",n),children:(0,y.jsx)("code",{className:C.codeBlockLines,children:t})})}var B=n(9129);const L={attributes:!0,characterData:!0,childList:!0,subtree:!0};function _(e,t){const[n,a]=(0,s.useState)(),r=(0,s.useCallback)((()=>{a(e.current?.closest("[role=tabpanel][hidden]"))}),[e,a]);(0,s.useEffect)((()=>{r()}),[r]),function(e,t,n){void 0===n&&(n=L);const a=(0,B._q)(t),r=(0,B.Be)(n);(0,s.useEffect)((()=>{const t=new MutationObserver(a);return e&&t.observe(e,r),()=>t.disconnect()}),[e,a,r])}(n,(e=>{e.forEach((e=>{"attributes"===e.type&&"hidden"===e.attributeName&&(t(),r())}))}),{attributes:!0,characterData:!1,childList:!1,subtree:!1})}var E=n(7663);const T="codeLine_qRmp",H="codeLineNumber_dS_J",U="codeLineContent_XF5l";function M(e){let{line:t,classNames:n,showLineNumbers:s,getLineProps:a,getTokenProps:r}=e;1===t.length&&"\n"===t[0].content&&(t[0].content="");const o=a({line:t,className:(0,i.A)(n,s&&T)}),c=t.map(((e,t)=>(0,y.jsx)("span",{...r({token:e})},t)));return(0,y.jsxs)("span",{...o,children:[s?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("span",{className:H}),(0,y.jsx)("span",{className:U,children:c})]}):c,(0,y.jsx)("br",{})]})}var I=n(4709);function S(e){return(0,y.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,y.jsx)("path",{fill:"currentColor",d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})})}function z(e){return(0,y.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,y.jsx)("path",{fill:"currentColor",d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"})})}const R={copyButtonCopied:"copyButtonCopied_OkN_",copyButtonIcons:"copyButtonIcons_OqsO",copyButtonIcon:"copyButtonIcon_PgCn",copyButtonSuccessIcon:"copyButtonSuccessIcon_bsQG"};function O(e){let{code:t,className:n}=e;const[a,r]=(0,s.useState)(!1),o=(0,s.useRef)(void 0),c=(0,s.useCallback)((()=>{!function(e,t){let{target:n=document.body}=void 0===t?{}:t;if("string"!=typeof e)throw new TypeError(`Expected parameter \`text\` to be a \`string\`, got \`${typeof e}\`.`);const s=document.createElement("textarea"),a=document.activeElement;s.value=e,s.setAttribute("readonly",""),s.style.contain="strict",s.style.position="absolute",s.style.left="-9999px",s.style.fontSize="12pt";const r=document.getSelection(),o=r.rangeCount>0&&r.getRangeAt(0);n.append(s),s.select(),s.selectionStart=0,s.selectionEnd=e.length;let i=!1;try{i=document.execCommand("copy")}catch{}s.remove(),o&&(r.removeAllRanges(),r.addRange(o)),a&&a.focus()}(t),r(!0),o.current=window.setTimeout((()=>{r(!1)}),1e3)}),[t]);return(0,s.useEffect)((()=>()=>window.clearTimeout(o.current)),[]),(0,y.jsx)("button",{type:"button","aria-label":a?(0,I.T)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,I.T)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,I.T)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,i.A)("clean-btn",n,R.copyButton,a&&R.copyButtonCopied),onClick:c,children:(0,y.jsxs)("span",{className:R.copyButtonIcons,"aria-hidden":"true",children:[(0,y.jsx)(S,{className:R.copyButtonIcon}),(0,y.jsx)(z,{className:R.copyButtonSuccessIcon})]})})}function P(e){return(0,y.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,y.jsx)("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})})}const V="wordWrapButtonIcon_MQXS",G="wordWrapButtonEnabled_TBIH";function $(e){let{className:t,onClick:n,isEnabled:s}=e;const a=(0,I.T)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return(0,y.jsx)("button",{type:"button",onClick:n,className:(0,i.A)("clean-btn",t,s&&G),"aria-label":a,title:a,children:(0,y.jsx)(P,{className:V,"aria-hidden":"true"})})}function W(e){let{children:t,className:n="",metastring:a,title:r,showLineNumbers:c,language:u}=e;const{prism:{defaultLanguage:m,magicComments:h}}=(0,l.p)(),p=function(e){return e?.toLowerCase()}(u??function(e){const t=e.split(" ").find((e=>e.startsWith("language-")));return t?.replace(/language-/,"")}(n)??m),x=d(),g=function(){const[e,t]=(0,s.useState)(!1),[n,a]=(0,s.useState)(!1),r=(0,s.useRef)(null),o=(0,s.useCallback)((()=>{const n=r.current.querySelector("code");e?n.removeAttribute("style"):(n.style.whiteSpace="pre-wrap",n.style.overflowWrap="anywhere"),t((e=>!e))}),[r,e]),i=(0,s.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=r.current,n=e>t||r.current.querySelector("code").hasAttribute("style");a(n)}),[r]);return _(r,i),(0,s.useEffect)((()=>{i()}),[e,i]),(0,s.useEffect)((()=>(window.addEventListener("resize",i,{passive:!0}),()=>{window.removeEventListener("resize",i)})),[i]),{codeBlockRef:r,isEnabled:e,isCodeScrollable:n,toggle:o}}(),v=(0,o.A)(),j=function(e){return e?.match(f)?.groups.title??""}(a)||r,{lineClassNames:A,code:w}=N(t,{metastring:a,language:p,magicComments:h}),B=b({showLineNumbers:c,metastring:a});return(0,y.jsxs)(k,{as:"div",className:(0,i.A)(n,p&&!n.includes(`language-${p}`)&&`language-${p}`),children:[j&&(0,y.jsx)("div",{className:C.codeBlockTitle,children:j}),(0,y.jsxs)("div",{className:C.codeBlockContent,children:[(0,y.jsx)(E.f4,{theme:x,code:w,language:p??"text",children:e=>{let{className:t,style:n,tokens:s,getLineProps:a,getTokenProps:r}=e;return(0,y.jsx)("pre",{tabIndex:0,ref:g.codeBlockRef,className:(0,i.A)(t,C.codeBlock,"thin-scrollbar"),style:n,children:(0,y.jsx)("code",{className:(0,i.A)(C.codeBlockLines,void 0!==B&&C.codeBlockLinesWithNumbering),style:void 0===B?void 0:{counterReset:"line-count "+(B-1)},children:s.map(((e,t)=>(0,y.jsx)(M,{line:e,getLineProps:a,getTokenProps:r,classNames:A[t],showLineNumbers:void 0!==B},t)))})})}}),v?(0,y.jsxs)("div",{className:C.buttonGroup,children:[(g.isEnabled||g.isCodeScrollable)&&(0,y.jsx)($,{className:C.codeButton,onClick:()=>g.toggle(),isEnabled:g.isEnabled}),(0,y.jsx)(O,{className:C.codeButton,code:w})]}):null]})]})}function D(e){let{children:t,...n}=e;const a=(0,o.A)(),r=function(e){return s.Children.toArray(e).some((e=>(0,s.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(t),i="string"==typeof r?W:w;return(0,y.jsx)(i,{...n,children:r},String(a))}function F(e){return(0,y.jsx)("code",{...e})}var q=n(5739);var X=n(6051),Q=n(343);const Y="details_Nokh",Z="isBrowser_QrB5",J="collapsibleContent_EoA1";function K(e){return!!e&&("SUMMARY"===e.tagName||K(e.parentElement))}function ee(e,t){return!!e&&(e===t||ee(e.parentElement,t))}function te(e){let{summary:t,children:n,...a}=e;(0,X.A)().collectAnchor(a.id);const r=(0,o.A)(),c=(0,s.useRef)(null),{collapsed:l,setCollapsed:d}=(0,Q.u)({initialState:!a.open}),[u,m]=(0,s.useState)(a.open),h=s.isValidElement(t)?t:(0,y.jsx)("summary",{children:t??"Details"});return(0,y.jsxs)("details",{...a,ref:c,open:u,"data-collapsed":l,className:(0,i.A)(Y,r&&Z,a.className),onMouseDown:e=>{K(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;K(t)&&ee(t,c.current)&&(e.preventDefault(),l?(d(!1),m(!0)):d(!0))},children:[h,(0,y.jsx)(Q.N,{lazy:!1,collapsed:l,onCollapseTransitionEnd:e=>{d(e),m(!e)},children:(0,y.jsx)("div",{className:J,children:n})})]})}const ne="details_Cn_P";function se(e){let{...t}=e;return(0,y.jsx)(te,{...t,className:(0,i.A)("alert alert--info",ne,t.className)})}function ae(e){const t=s.Children.toArray(e.children),n=t.find((e=>s.isValidElement(e)&&"summary"===e.type)),a=(0,y.jsx)(y.Fragment,{children:t.filter((e=>e!==n))});return(0,y.jsx)(se,{...e,summary:n,children:a})}var re=n(2409);function oe(e){return(0,y.jsx)(re.A,{...e})}const ie="containsTaskList_k9gM";function ce(e){if(void 0!==e)return(0,i.A)(e,e?.includes("contains-task-list")&&ie)}const le="img_vXGZ";var de=n(2473),ue=n(219);const me={Head:r.A,details:ae,Details:ae,code:function(e){return function(e){return void 0!==e.children&&s.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")))}(e)?(0,y.jsx)(F,{...e}):(0,y.jsx)(D,{...e})},a:function(e){return(0,y.jsx)(q.A,{...e})},pre:function(e){return(0,y.jsx)(y.Fragment,{children:e.children})},ul:function(e){return(0,y.jsx)("ul",{...e,className:ce(e.className)})},li:function(e){return(0,X.A)().collectAnchor(e.id),(0,y.jsx)("li",{...e})},img:function(e){return(0,y.jsx)("img",{decoding:"async",loading:"lazy",...e,className:(t=e.className,(0,i.A)(t,le))});var t},h1:e=>(0,y.jsx)(oe,{as:"h1",...e}),h2:e=>(0,y.jsx)(oe,{as:"h2",...e}),h3:e=>(0,y.jsx)(oe,{as:"h3",...e}),h4:e=>(0,y.jsx)(oe,{as:"h4",...e}),h5:e=>(0,y.jsx)(oe,{as:"h5",...e}),h6:e=>(0,y.jsx)(oe,{as:"h6",...e}),admonition:de.A,mermaid:ue.A};function he(e){let{children:t}=e;return(0,y.jsx)(a.x,{components:me,children:t})}},3255:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>h});n(6540);var s=n(1750),a=n(5861),r=n(8532),o=n(7374),i=n(853),c=n(8649),l=n(5088),d=n(8800);const u={mdxPageWrapper:"mdxPageWrapper_bWhk"};var m=n(4848);function h(e){const{content:t}=e,{metadata:n,assets:h}=t,{title:f,editUrl:p,description:x,frontMatter:g,lastUpdatedBy:v,lastUpdatedAt:j}=n,{keywords:b,wrapperClassName:N,hide_table_of_contents:A}=g,y=h.image??g.image,k=!!(p||j||v);return(0,m.jsx)(a.e3,{className:(0,s.A)(N??r.G.wrapper.mdxPages,r.G.page.mdxPage),children:(0,m.jsxs)(o.A,{children:[(0,m.jsx)(a.be,{title:f,description:x,keywords:b,image:y}),(0,m.jsx)("main",{className:"container container--fluid margin-vert--lg",children:(0,m.jsxs)("div",{className:(0,s.A)("row",u.mdxPageWrapper),children:[(0,m.jsxs)("div",{className:(0,s.A)("col",!A&&"col--8"),children:[(0,m.jsx)(l.A,{metadata:n}),(0,m.jsx)("article",{children:(0,m.jsx)(i.A,{children:(0,m.jsx)(t,{})})}),k&&(0,m.jsx)(d.A,{className:(0,s.A)("margin-top--sm",r.G.pages.pageFooterEditMetaRow),editUrl:p,lastUpdatedAt:j,lastUpdatedBy:v})]}),!A&&t.toc.length>0&&(0,m.jsx)("div",{className:"col col--2",children:(0,m.jsx)(c.A,{toc:t.toc,minHeadingLevel:g.toc_min_heading_level,maxHeadingLevel:g.toc_max_heading_level})})]})})]})})}},8649:(e,t,n)=>{"use strict";n.d(t,{A:()=>l});n(6540);var s=n(1750),a=n(1731);const r={tableOfContents:"tableOfContents_RLlU",docItemContainer:"docItemContainer_oucX"};var o=n(4848);const i="table-of-contents__link toc-highlight",c="table-of-contents__link--active";function l(e){let{className:t,...n}=e;return(0,o.jsx)("div",{className:(0,s.A)(r.tableOfContents,"thin-scrollbar",t),children:(0,o.jsx)(a.A,{...n,linkClassName:i,linkActiveClassName:c})})}},1731:(e,t,n)=>{"use strict";n.d(t,{A:()=>p});var s=n(6540),a=n(6963);function r(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const s=n.slice(2,e.level);e.parentIndex=Math.max(...s),n[e.level]=t}));const s=[];return t.forEach((e=>{const{parentIndex:n,...a}=e;n>=0?t[n].children.push(a):s.push(a)})),s}function o(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:s}=e;return t.flatMap((e=>{const t=o({toc:e.children,minHeadingLevel:n,maxHeadingLevel:s});return function(e){return e.level>=n&&e.level<=s}(e)?[{...e,children:t}]:t}))}function i(e){const t=e.getBoundingClientRect();return t.top===t.bottom?i(e.parentNode):t}function c(e,t){let{anchorTopOffset:n}=t;const s=e.find((e=>i(e).top>=n));if(s){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(i(s))?s:e[e.indexOf(s)-1]??null}return e[e.length-1]??null}function l(){const e=(0,s.useRef)(0),{navbar:{hideOnScroll:t}}=(0,a.p)();return(0,s.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function d(e){const t=(0,s.useRef)(void 0),n=l();(0,s.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:s,linkActiveClassName:a,minHeadingLevel:r,maxHeadingLevel:o}=e;function i(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(s),i=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const s=[];for(let a=t;a<=n;a+=1)s.push(`h${a}.anchor`);return Array.from(document.querySelectorAll(s.join()))}({minHeadingLevel:r,maxHeadingLevel:o}),l=c(i,{anchorTopOffset:n.current}),d=e.find((e=>l&&l.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(a),e.classList.add(a),t.current=e):e.classList.remove(a)}(e,e===d)}))}return document.addEventListener("scroll",i),document.addEventListener("resize",i),i(),()=>{document.removeEventListener("scroll",i),document.removeEventListener("resize",i)}}),[e,n])}var u=n(5739),m=n(4848);function h(e){let{toc:t,className:n,linkClassName:s,isChild:a}=e;return t.length?(0,m.jsx)("ul",{className:a?void 0:n,children:t.map((e=>(0,m.jsxs)("li",{children:[(0,m.jsx)(u.A,{to:`#${e.id}`,className:s??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,m.jsx)(h,{isChild:!0,toc:e.children,className:n,linkClassName:s})]},e.id)))}):null}const f=s.memo(h);function p(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:i="table-of-contents__link",linkActiveClassName:c,minHeadingLevel:l,maxHeadingLevel:u,...h}=e;const p=(0,a.p)(),x=l??p.tableOfContents.minHeadingLevel,g=u??p.tableOfContents.maxHeadingLevel,v=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return(0,s.useMemo)((()=>o({toc:r(t),minHeadingLevel:n,maxHeadingLevel:a})),[t,n,a])}({toc:t,minHeadingLevel:x,maxHeadingLevel:g});return d((0,s.useMemo)((()=>{if(i&&c)return{linkClassName:i,linkActiveClassName:c,minHeadingLevel:x,maxHeadingLevel:g}}),[i,c,x,g])),(0,m.jsx)(f,{toc:v,className:n,linkClassName:i,...h})}},9137:(e,t,n)=>{"use strict";n.d(t,{AE:()=>c,Rc:()=>o,TT:()=>d,Uh:()=>i,Yh:()=>l});n(6540);var s=n(4709),a=n(2785),r=n(4848);function o(){return(0,r.jsx)(s.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function i(){return(0,r.jsx)(s.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,r.jsx)(a.A,{children:(0,r.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function l(){return(0,r.jsx)(s.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function d(){return(0,r.jsx)(s.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}},9153:(e,t,n)=>{"use strict";n.d(t,{i:()=>a});var s=n(1571);function a(e){void 0===e&&(e={});const{i18n:{currentLocale:t}}=(0,s.A)(),n=function(){const{i18n:{currentLocale:e,localeConfigs:t}}=(0,s.A)();return t[e].calendar}();return new Intl.DateTimeFormat(t,{calendar:n,...e})}},9934:(e,t)=>{function n(e){let t,n=[];for(let s of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(s))n.push(parseInt(s,10));else if(t=s.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,s,a,r]=t;if(s&&r){s=parseInt(s),r=parseInt(r);const e=s<r?1:-1;"-"!==a&&".."!==a&&"\u2025"!==a||(r+=e);for(let t=s;t!==r;t+=e)n.push(t)}}return n}t.default=n,e.exports=n},3023:(e,t,n)=>{"use strict";n.d(t,{R:()=>o,x:()=>i});var s=n(6540);const a={},r=s.createContext(a);function o(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);