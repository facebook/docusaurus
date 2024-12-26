"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["28620"],{41746:function(s,e,a){a.r(e),a.d(e,{metadata:()=>n,contentTitle:()=>h,default:()=>p,assets:()=>d,toc:()=>o,frontMatter:()=>m});var n=JSON.parse('{"id":"guides/markdown-features/math-equations","title":"Math Equations","description":"Writing LaTeX Math Equations","source":"@site/docs/guides/markdown-features/markdown-features-math-equations.mdx","sourceDirName":"guides/markdown-features","slug":"/markdown-features/math-equations","permalink":"/docs/markdown-features/math-equations","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/main/website/docs/guides/markdown-features/markdown-features-math-equations.mdx","tags":[],"version":"current","lastUpdatedBy":"dependabot[bot]","lastUpdatedAt":1735217268000,"frontMatter":{"id":"math-equations","description":"Writing LaTeX Math Equations","slug":"/markdown-features/math-equations"},"sidebar":"docs","previous":{"title":"MDX Plugins","permalink":"/docs/markdown-features/plugins"},"next":{"title":"Diagrams","permalink":"/docs/markdown-features/diagrams"}}'),t=a("85893"),l=a("80980"),r=a("46291"),i=a("67860"),c=a("11678");let m={id:"math-equations",description:"Writing LaTeX Math Equations",slug:"/markdown-features/math-equations"},h="Math Equations",d={},o=[{value:"Usage",id:"usage",level:2},{value:"Inline",id:"inline",level:3},{value:"Blocks",id:"blocks",level:3},{value:"Enabling math equations",id:"configuration",level:2},{value:"Self-hosting KaTeX assets",id:"self-hosting-katex-assets",level:2}];function x(s){let e={a:"a",admonition:"admonition",annotation:"annotation",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",math:"math",mi:"mi",mn:"mn",mo:"mo",mrow:"mrow",mspace:"mspace",msubsup:"msubsup",msup:"msup",mtext:"mtext",ol:"ol",p:"p",pre:"pre",semantics:"semantics",span:"span",strong:"strong",...(0,l.a)(),...s.components},{Details:a}=e;return!a&&function(s,e){throw Error("Expected "+(e?"component":"object")+" `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(e.header,{children:(0,t.jsx)(e.h1,{id:"math-equations",children:"Math Equations"})}),"\n","\n",(0,t.jsxs)(e.p,{children:["Mathematical equations can be rendered using ",(0,t.jsx)(e.a,{href:"https://katex.org",children:"KaTeX"}),"."]}),"\n",(0,t.jsx)(e.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsxs)(e.p,{children:["Please read ",(0,t.jsx)(e.a,{href:"https://katex.org",children:"KaTeX"})," documentation for more details."]}),"\n",(0,t.jsx)(e.h3,{id:"inline",children:"Inline"}),"\n",(0,t.jsxs)(e.p,{children:["Write inline math equations by wrapping LaTeX equations between ",(0,t.jsx)(e.code,{children:"$"}),":"]}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-latex",children:"Let $f\\colon[a,b]\\to\\R$ be Riemann integrable. Let $F\\colon[a,b]\\to\\R$ be\n$F(x)=\\int_{a}^{x} f(t)\\,dt$. Then $F$ is continuous, and at all $x$ such that\n$f$ is continuous at $x$, $F$ is differentiable at $x$ with $F'(x)=f(x)$.\n"})}),"\n",(0,t.jsx)(c.Z,{children:(0,t.jsxs)(e.p,{children:["Let ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsxs)(e.mrow,{children:[(0,t.jsx)(e.mi,{children:"f"}),(0,t.jsx)(e.mspace,{}),(0,t.jsx)(e.mspace,{width:"0.1111em"}),(0,t.jsx)(e.mo,{lspace:"0em",rspace:"0.17em"}),(0,t.jsx)(e.mtext,{children:"\u2009\u2063"}),(0,t.jsx)(e.mo,{lspace:"0em",rspace:"0em",children:":"}),(0,t.jsx)(e.mspace,{width:"0.3333em"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"["}),(0,t.jsx)(e.mi,{children:"a"}),(0,t.jsx)(e.mo,{separator:"true",children:","}),(0,t.jsx)(e.mi,{children:"b"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"]"}),(0,t.jsx)(e.mo,{children:"\u2192"}),(0,t.jsx)(e.mi,{mathvariant:"double-struck",children:"R"})]}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"f\\colon[a,b] \\to \\R"})]})})}),(0,t.jsxs)(e.span,{className:"katex-html","aria-hidden":"true",children:[(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.10764em"},children:"f"}),(0,t.jsx)(e.span,{className:"mspace nobreak"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1111em"}}),(0,t.jsx)(e.span,{className:"mpunct"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"-0.1667em"}}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord",children:(0,t.jsx)(e.span,{className:"mrel",children:":"})}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.3333em"}}),(0,t.jsx)(e.span,{className:"mopen",children:"["}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"a"}),(0,t.jsx)(e.span,{className:"mpunct",children:","}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"b"}),(0,t.jsx)(e.span,{className:"mclose",children:"]"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}}),(0,t.jsx)(e.span,{className:"mrel",children:"\u2192"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.6889em"}}),(0,t.jsx)(e.span,{className:"mord mathbb",children:"R"})]})]})]})," be Riemann integrable. Let ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsxs)(e.mrow,{children:[(0,t.jsx)(e.mi,{children:"F"}),(0,t.jsx)(e.mspace,{}),(0,t.jsx)(e.mspace,{width:"0.1111em"}),(0,t.jsx)(e.mo,{lspace:"0em",rspace:"0.17em"}),(0,t.jsx)(e.mtext,{children:"\u2009\u2063"}),(0,t.jsx)(e.mo,{lspace:"0em",rspace:"0em",children:":"}),(0,t.jsx)(e.mspace,{width:"0.3333em"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"["}),(0,t.jsx)(e.mi,{children:"a"}),(0,t.jsx)(e.mo,{separator:"true",children:","}),(0,t.jsx)(e.mi,{children:"b"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"]"}),(0,t.jsx)(e.mo,{children:"\u2192"}),(0,t.jsx)(e.mi,{mathvariant:"double-struck",children:"R"})]}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"F\\colon[a,b]\\to\\R"})]})})}),(0,t.jsxs)(e.span,{className:"katex-html","aria-hidden":"true",children:[(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.13889em"},children:"F"}),(0,t.jsx)(e.span,{className:"mspace nobreak"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1111em"}}),(0,t.jsx)(e.span,{className:"mpunct"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"-0.1667em"}}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord",children:(0,t.jsx)(e.span,{className:"mrel",children:":"})}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.3333em"}}),(0,t.jsx)(e.span,{className:"mopen",children:"["}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"a"}),(0,t.jsx)(e.span,{className:"mpunct",children:","}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"b"}),(0,t.jsx)(e.span,{className:"mclose",children:"]"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}}),(0,t.jsx)(e.span,{className:"mrel",children:"\u2192"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.6889em"}}),(0,t.jsx)(e.span,{className:"mord mathbb",children:"R"})]})]})]})," be ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsxs)(e.mrow,{children:[(0,t.jsx)(e.mi,{children:"F"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"("}),(0,t.jsx)(e.mi,{children:"x"}),(0,t.jsx)(e.mo,{stretchy:"false",children:")"}),(0,t.jsx)(e.mo,{children:"="}),(0,t.jsxs)(e.msubsup,{children:[(0,t.jsx)(e.mo,{children:"\u222B"}),(0,t.jsx)(e.mi,{children:"a"}),(0,t.jsx)(e.mi,{children:"x"})]}),(0,t.jsx)(e.mi,{children:"f"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"("}),(0,t.jsx)(e.mi,{children:"t"}),(0,t.jsx)(e.mo,{stretchy:"false",children:")"}),(0,t.jsx)(e.mtext,{children:"\u2009"}),(0,t.jsx)(e.mi,{children:"d"}),(0,t.jsx)(e.mi,{children:"t"})]}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"F(x)=\n\\int_{a}^{x} f(t)\\,dt"})]})})}),(0,t.jsxs)(e.span,{className:"katex-html","aria-hidden":"true",children:[(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.13889em"},children:"F"}),(0,t.jsx)(e.span,{className:"mopen",children:"("}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"}),(0,t.jsx)(e.span,{className:"mclose",children:")"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}}),(0,t.jsx)(e.span,{className:"mrel",children:"="}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1.2151em",verticalAlign:"-0.3558em"}}),(0,t.jsxs)(e.span,{className:"mop",children:[(0,t.jsx)(e.span,{className:"mop op-symbol small-op",style:{marginRight:"0.19445em",position:"relative",top:"-0.0006em"},children:"\u222B"}),(0,t.jsx)(e.span,{className:"msupsub",children:(0,t.jsxs)(e.span,{className:"vlist-t vlist-t2",children:[(0,t.jsxs)(e.span,{className:"vlist-r",children:[(0,t.jsxs)(e.span,{className:"vlist",style:{height:"0.8593em"},children:[(0,t.jsxs)(e.span,{style:{top:"-2.3442em",marginLeft:"-0.1945em",marginRight:"0.05em"},children:[(0,t.jsx)(e.span,{className:"pstrut",style:{height:"2.7em"}}),(0,t.jsx)(e.span,{className:"sizing reset-size6 size3 mtight",children:(0,t.jsx)(e.span,{className:"mord mtight",children:(0,t.jsx)(e.span,{className:"mord mathnormal mtight",children:"a"})})})]}),(0,t.jsxs)(e.span,{style:{top:"-3.2579em",marginRight:"0.05em"},children:[(0,t.jsx)(e.span,{className:"pstrut",style:{height:"2.7em"}}),(0,t.jsx)(e.span,{className:"sizing reset-size6 size3 mtight",children:(0,t.jsx)(e.span,{className:"mord mtight",children:(0,t.jsx)(e.span,{className:"mord mathnormal mtight",children:"x"})})})]})]}),(0,t.jsx)(e.span,{className:"vlist-s",children:"\u200B"})]}),(0,t.jsx)(e.span,{className:"vlist-r",children:(0,t.jsx)(e.span,{className:"vlist",style:{height:"0.3558em"},children:(0,t.jsx)(e.span,{})})})]})})]}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.10764em"},children:"f"}),(0,t.jsx)(e.span,{className:"mopen",children:"("}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"t"}),(0,t.jsx)(e.span,{className:"mclose",children:")"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"d"}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"t"})]})]})]}),". Then ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"F"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"F"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.6833em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.13889em"},children:"F"})]})})]})," is continuous, and at all ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"x"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"x"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.4306em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"})]})})]})," such that ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"f"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"f"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.8889em",verticalAlign:"-0.1944em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.10764em"},children:"f"})]})})]})," is continuous at ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"x"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"x"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.4306em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"})]})})]}),", ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"F"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"F"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.6833em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.13889em"},children:"F"})]})})]})," is differentiable at ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsx)(e.mrow,{children:(0,t.jsx)(e.mi,{children:"x"})}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"x"})]})})}),(0,t.jsx)(e.span,{className:"katex-html","aria-hidden":"true",children:(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.4306em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"})]})})]})," with ",(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsxs)(e.mrow,{children:[(0,t.jsxs)(e.msup,{children:[(0,t.jsx)(e.mi,{children:"F"}),(0,t.jsx)(e.mo,{mathvariant:"normal",lspace:"0em",rspace:"0em",children:"\u2032"})]}),(0,t.jsx)(e.mo,{stretchy:"false",children:"("}),(0,t.jsx)(e.mi,{children:"x"}),(0,t.jsx)(e.mo,{stretchy:"false",children:")"}),(0,t.jsx)(e.mo,{children:"="}),(0,t.jsx)(e.mi,{children:"f"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"("}),(0,t.jsx)(e.mi,{children:"x"}),(0,t.jsx)(e.mo,{stretchy:"false",children:")"})]}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"F'(x)=f(x)"})]})})}),(0,t.jsxs)(e.span,{className:"katex-html","aria-hidden":"true",children:[(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1.0019em",verticalAlign:"-0.25em"}}),(0,t.jsxs)(e.span,{className:"mord",children:[(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.13889em"},children:"F"}),(0,t.jsx)(e.span,{className:"msupsub",children:(0,t.jsx)(e.span,{className:"vlist-t",children:(0,t.jsx)(e.span,{className:"vlist-r",children:(0,t.jsx)(e.span,{className:"vlist",style:{height:"0.7519em"},children:(0,t.jsxs)(e.span,{style:{top:"-3.063em",marginRight:"0.05em"},children:[(0,t.jsx)(e.span,{className:"pstrut",style:{height:"2.7em"}}),(0,t.jsx)(e.span,{className:"sizing reset-size6 size3 mtight",children:(0,t.jsx)(e.span,{className:"mord mtight",children:(0,t.jsx)(e.span,{className:"mord mtight",children:"\u2032"})})})]})})})})})]}),(0,t.jsx)(e.span,{className:"mopen",children:"("}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"}),(0,t.jsx)(e.span,{className:"mclose",children:")"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}}),(0,t.jsx)(e.span,{className:"mrel",children:"="}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.10764em"},children:"f"}),(0,t.jsx)(e.span,{className:"mopen",children:"("}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"}),(0,t.jsx)(e.span,{className:"mclose",children:")"})]})]})]}),"."]})}),"\n",(0,t.jsx)(e.h3,{id:"blocks",children:"Blocks"}),"\n",(0,t.jsxs)(e.p,{children:["For equation block or display mode, use line breaks and ",(0,t.jsx)(e.code,{children:"$$"}),":"]}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-latex",children:"$$\nI = \\int_0^{2\\pi} \\sin(x)\\,dx\n$$\n"})}),"\n",(0,t.jsx)(c.Z,{children:(0,t.jsx)(e.span,{className:"katex-display",children:(0,t.jsxs)(e.span,{className:"katex",children:[(0,t.jsx)(e.span,{className:"katex-mathml",children:(0,t.jsx)(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block",children:(0,t.jsxs)(e.semantics,{children:[(0,t.jsxs)(e.mrow,{children:[(0,t.jsx)(e.mi,{children:"I"}),(0,t.jsx)(e.mo,{children:"="}),(0,t.jsxs)(e.msubsup,{children:[(0,t.jsx)(e.mo,{children:"\u222B"}),(0,t.jsx)(e.mn,{children:"0"}),(0,t.jsxs)(e.mrow,{children:[(0,t.jsx)(e.mn,{children:"2"}),(0,t.jsx)(e.mi,{children:"\u03C0"})]})]}),(0,t.jsx)(e.mi,{children:"sin"}),(0,t.jsx)(e.mo,{children:"\u2061"}),(0,t.jsx)(e.mo,{stretchy:"false",children:"("}),(0,t.jsx)(e.mi,{children:"x"}),(0,t.jsx)(e.mo,{stretchy:"false",children:")"}),(0,t.jsx)(e.mtext,{children:"\u2009"}),(0,t.jsx)(e.mi,{children:"d"}),(0,t.jsx)(e.mi,{children:"x"})]}),(0,t.jsx)(e.annotation,{encoding:"application/x-tex",children:"I = \\int_0^{2\\pi} \\sin(x)\\,dx"})]})})}),(0,t.jsxs)(e.span,{className:"katex-html","aria-hidden":"true",children:[(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"0.6833em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",style:{marginRight:"0.07847em"},children:"I"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}}),(0,t.jsx)(e.span,{className:"mrel",children:"="}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),(0,t.jsxs)(e.span,{className:"base",children:[(0,t.jsx)(e.span,{className:"strut",style:{height:"2.476em",verticalAlign:"-0.9119em"}}),(0,t.jsxs)(e.span,{className:"mop",children:[(0,t.jsx)(e.span,{className:"mop op-symbol large-op",style:{marginRight:"0.44445em",position:"relative",top:"-0.0011em"},children:"\u222B"}),(0,t.jsx)(e.span,{className:"msupsub",children:(0,t.jsxs)(e.span,{className:"vlist-t vlist-t2",children:[(0,t.jsxs)(e.span,{className:"vlist-r",children:[(0,t.jsxs)(e.span,{className:"vlist",style:{height:"1.564em"},children:[(0,t.jsxs)(e.span,{style:{top:"-1.7881em",marginLeft:"-0.4445em",marginRight:"0.05em"},children:[(0,t.jsx)(e.span,{className:"pstrut",style:{height:"2.7em"}}),(0,t.jsx)(e.span,{className:"sizing reset-size6 size3 mtight",children:(0,t.jsx)(e.span,{className:"mord mtight",children:"0"})})]}),(0,t.jsxs)(e.span,{style:{top:"-3.8129em",marginRight:"0.05em"},children:[(0,t.jsx)(e.span,{className:"pstrut",style:{height:"2.7em"}}),(0,t.jsx)(e.span,{className:"sizing reset-size6 size3 mtight",children:(0,t.jsxs)(e.span,{className:"mord mtight",children:[(0,t.jsx)(e.span,{className:"mord mtight",children:"2"}),(0,t.jsx)(e.span,{className:"mord mathnormal mtight",style:{marginRight:"0.03588em"},children:"\u03C0"})]})})]})]}),(0,t.jsx)(e.span,{className:"vlist-s",children:"\u200B"})]}),(0,t.jsx)(e.span,{className:"vlist-r",children:(0,t.jsx)(e.span,{className:"vlist",style:{height:"0.9119em"},children:(0,t.jsx)(e.span,{})})})]})})]}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mop",children:"sin"}),(0,t.jsx)(e.span,{className:"mopen",children:"("}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"}),(0,t.jsx)(e.span,{className:"mclose",children:")"}),(0,t.jsx)(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"d"}),(0,t.jsx)(e.span,{className:"mord mathnormal",children:"x"})]})]})]})})}),"\n",(0,t.jsx)(e.h2,{id:"configuration",children:"Enabling math equations"}),"\n",(0,t.jsx)(e.p,{children:"Enable KaTeX:"}),"\n",(0,t.jsxs)(e.ol,{children:["\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:["Install the ",(0,t.jsx)(e.code,{children:"remark-math"})," and ",(0,t.jsx)(e.code,{children:"rehype-katex"})," plugins:"]}),"\n",(0,t.jsxs)(r.Z,{groupId:"npm2yarn",children:[(0,t.jsx)(i.Z,{value:"npm",children:(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-bash",children:"npm install --save remark-math@6 rehype-katex@7\n"})})}),(0,t.jsx)(i.Z,{value:"yarn",label:"Yarn",children:(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-bash",children:"yarn add remark-math@6 rehype-katex@7\n"})})}),(0,t.jsx)(i.Z,{value:"pnpm",label:"pnpm",children:(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-bash",children:"pnpm add remark-math@6 rehype-katex@7\n"})})})]}),"\n",(0,t.jsx)(e.admonition,{type:"warning",children:(0,t.jsxs)(e.p,{children:["Make sure to use ",(0,t.jsx)(e.code,{children:"remark-math 6"})," and ",(0,t.jsx)(e.code,{children:"rehype-katex 7"})," for Docusaurus v3 (using MDX v3). We can't guarantee other versions will work."]})}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:["These 2 plugins are ",(0,t.jsx)(e.a,{href:"https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c",children:(0,t.jsx)(e.strong,{children:"only available as ES Modules"})}),". We recommended to use an ",(0,t.jsx)(e.a,{href:"https://flaviocopes.com/es-modules/",children:(0,t.jsx)(e.strong,{children:"ES Modules"})})," config file:"]}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-js",metastring:'title="ES module docusaurus.config.js"',children:"// highlight-start\nimport remarkMath from 'remark-math';\nimport rehypeKatex from 'rehype-katex';\n// highlight-end\n\n// highlight-start\nexport default {\n  presets: [\n    [\n      '@docusaurus/preset-classic',\n      {\n        docs: {\n          path: 'docs',\n          // highlight-start\n          remarkPlugins: [remarkMath],\n          rehypePlugins: [rehypeKatex],\n          // highlight-end\n        },\n      },\n    ],\n  ],\n};\n"})}),"\n",(0,t.jsxs)(a,{children:[(0,t.jsx)("summary",{children:(0,t.jsxs)(e.p,{children:["Using a\n",(0,t.jsx)(e.a,{href:"https://nodejs.org/api/modules.html#modules-commonjs-modules",children:(0,t.jsx)(e.strong,{children:"CommonJS"})}),"\nconfig file?"]})}),(0,t.jsx)(e.p,{children:"If you decide to use a CommonJS config file, it is possible to load those ES module plugins thanks to dynamic imports and an async config creator function:"}),(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-js",metastring:'title="CommonJS module docusaurus.config.js"',children:"// highlight-start\nmodule.exports = async function createConfigAsync() {\n  // highlight-end\n  return {\n    presets: [\n      [\n        '@docusaurus/preset-classic',\n        {\n          docs: {\n            path: 'docs',\n            // highlight-start\n            remarkPlugins: [(await import('remark-math')).default],\n            rehypePlugins: [(await import('rehype-katex')).default],\n            // highlight-end\n          },\n        },\n      ],\n    ],\n  };\n};\n"})})]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:["Include the KaTeX CSS in your config under ",(0,t.jsx)(e.code,{children:"stylesheets"}),":"]}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-js",children:"export default {\n  //...\n  stylesheets: [\n    {\n      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',\n      type: 'text/css',\n      integrity:\n        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',\n      crossorigin: 'anonymous',\n    },\n  ],\n};\n"})}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(a,{children:[(0,t.jsx)("summary",{children:"See a config file example"}),(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"// highlight-start\nimport remarkMath from 'remark-math';\nimport rehypeKatex from 'rehype-katex';\n// highlight-end\n\nexport default {\n  title: 'Docusaurus',\n  tagline: 'Build optimized websites quickly, focus on your content',\n  presets: [\n    [\n      '@docusaurus/preset-classic',\n      {\n        docs: {\n          path: 'docs',\n          // highlight-start\n          remarkPlugins: [remarkMath],\n          rehypePlugins: [rehypeKatex],\n          // highlight-end\n        },\n      },\n    ],\n  ],\n  // highlight-start\n  stylesheets: [\n    {\n      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',\n      type: 'text/css',\n      integrity:\n        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',\n      crossorigin: 'anonymous',\n    },\n  ],\n  // highlight-end\n};\n"})})]}),"\n",(0,t.jsx)(e.h2,{id:"self-hosting-katex-assets",children:"Self-hosting KaTeX assets"}),"\n",(0,t.jsxs)(e.p,{children:["Loading stylesheets, fonts, and JavaScript libraries from CDN sources is a good practice for popular libraries and assets, since it reduces the amount of assets you have to host. In case you prefer to self-host the ",(0,t.jsx)(e.code,{children:"katex.min.css"})," (along with required KaTeX fonts), you can download the latest version from ",(0,t.jsx)(e.a,{href:"https://github.com/KaTeX/KaTeX/releases",children:"KaTeX GitHub releases"}),", extract and copy ",(0,t.jsx)(e.code,{children:"katex.min.css"})," and ",(0,t.jsx)(e.code,{children:"fonts"})," directory (only ",(0,t.jsx)(e.code,{children:".woff2"})," font types should be enough) to your site's ",(0,t.jsx)(e.code,{children:"static"})," directory, and in ",(0,t.jsx)(e.code,{children:"docusaurus.config.js"}),", replace the stylesheet's ",(0,t.jsx)(e.code,{children:"href"})," from the CDN URL to your local path (say, ",(0,t.jsx)(e.code,{children:"/katex/katex.min.css"}),")."]}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"export default {\n  stylesheets: [\n    {\n      href: '/katex/katex.min.css',\n      type: 'text/css',\n    },\n  ],\n};\n"})})]})}function p(s={}){let{wrapper:e}={...(0,l.a)(),...s.components};return e?(0,t.jsx)(e,{...s,children:(0,t.jsx)(x,{...s})}):x(s)}},67860:function(s,e,a){a.d(e,{Z:()=>r});var n=a("85893");a("67294");var t=a("90496");let l="tabItem_pnkT";function r(s){let{children:e,hidden:a,className:r}=s;return(0,n.jsx)("div",{role:"tabpanel",className:(0,t.Z)(l,r),hidden:a,children:e})}},46291:function(s,e,a){a.d(e,{Z:()=>y});var n=a("85893"),t=a("67294"),l=a("90496"),r=a("12451"),i=a("3620"),c=a("89637"),m=a("74417"),h=a("46918"),d=a("58247");function o(s){return t.Children.toArray(s).filter(s=>"\n"!==s).map(s=>{if(!s||t.isValidElement(s)&&function(s){let{props:e}=s;return!!e&&"object"==typeof e&&"value"in e}(s))return s;throw Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof s.type?s.type:s.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})?.filter(Boolean)??[]}function x(s){let{value:e,tabValues:a}=s;return a.some(s=>s.value===e)}var p=a("8903");let j="tabList_Qoir",u="tabItem_AQgk";function g(s){let{className:e,block:a,selectedValue:t,selectValue:i,tabValues:c}=s,m=[],{blockElementScrollPositionUntilNextRender:h}=(0,r.o5)(),d=s=>{let e=s.currentTarget,a=c[m.indexOf(e)].value;a!==t&&(h(e),i(a))},o=s=>{let e=null;switch(s.key){case"Enter":d(s);break;case"ArrowRight":{let a=m.indexOf(s.currentTarget)+1;e=m[a]??m[0];break}case"ArrowLeft":{let a=m.indexOf(s.currentTarget)-1;e=m[a]??m[m.length-1]}}e?.focus()};return(0,n.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":a},e),children:c.map(s=>{let{value:e,label:a,attributes:r}=s;return(0,n.jsx)("li",{role:"tab",tabIndex:t===e?0:-1,"aria-selected":t===e,ref:s=>{m.push(s)},onKeyDown:o,onClick:d,...r,className:(0,l.Z)("tabs__item",u,r?.className,{"tabs__item--active":t===e}),children:a??e},e)})})}function N(s){let{lazy:e,children:a,selectedValue:r}=s,i=(Array.isArray(a)?a:[a]).filter(Boolean);if(e){let s=i.find(s=>s.props.value===r);return s?(0,t.cloneElement)(s,{className:(0,l.Z)("margin-top--md",s.props.className)}):null}return(0,n.jsx)("div",{className:"margin-top--md",children:i.map((s,e)=>(0,t.cloneElement)(s,{key:e,hidden:s.props.value!==r}))})}function f(s){let e=function(s){let{defaultValue:e,queryString:a=!1,groupId:n}=s,l=function(s){let{values:e,children:a}=s;return(0,t.useMemo)(()=>{let s=e??o(a).map(s=>{let{props:{value:e,label:a,attributes:n,default:t}}=s;return{value:e,label:a,attributes:n,default:t}});return!function(s){let e=(0,h.lx)(s,(s,e)=>s.value===e.value);if(e.length>0)throw Error(`Docusaurus error: Duplicate values "${e.map(s=>s.value).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(s),s},[e,a])}(s),[r,p]=(0,t.useState)(()=>(function(s){let{defaultValue:e,tabValues:a}=s;if(0===a.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(e){if(!x({value:e,tabValues:a}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${e}" but none of its children has the corresponding value. Available values are: ${a.map(s=>s.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return e}let n=a.find(s=>s.default)??a[0];if(!n)throw Error("Unexpected error: 0 tabValues");return n.value})({defaultValue:e,tabValues:l})),[j,u]=function(s){let{queryString:e=!1,groupId:a}=s,n=(0,i.k6)(),l=function(s){let{queryString:e=!1,groupId:a}=s;if("string"==typeof e)return e;if(!1===e)return null;if(!0===e&&!a)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:e,groupId:a}),r=(0,m._X)(l);return[r,(0,t.useCallback)(s=>{if(!l)return;let e=new URLSearchParams(n.location.search);e.set(l,s),n.replace({...n.location,search:e.toString()})},[l,n])]}({queryString:a,groupId:n}),[g,N]=function(s){var e;let{groupId:a}=s;let n=(e=a)?`docusaurus.tab.${e}`:null,[l,r]=(0,d.Nk)(n);return[l,(0,t.useCallback)(s=>{if(!!n)r.set(s)},[n,r])]}({groupId:n}),f=(()=>{let s=j??g;return x({value:s,tabValues:l})?s:null})();return(0,c.Z)(()=>{f&&p(f)},[f]),{selectedValue:r,selectValue:(0,t.useCallback)(s=>{if(!x({value:s,tabValues:l}))throw Error(`Can't select invalid tab value=${s}`);p(s),u(s),N(s)},[u,N,l]),tabValues:l}}(s);return(0,n.jsxs)("div",{className:(0,l.Z)("tabs-container",j),children:[(0,n.jsx)(g,{...e,...s}),(0,n.jsx)(N,{...e,...s})]})}function y(s){let e=(0,p.Z)();return(0,n.jsx)(f,{...s,children:o(s.children)},String(e))}},11678:function(s,e,a){a.d(e,{Z:()=>x});var n=a("85893");a("67294");var t=a("90496");let l="browserWindow_my1Q",r="browserWindowHeader_jXSR",i="buttons_uHc7",c="browserWindowAddressBar_Pd8y",m="dot_giz1",h="browserWindowMenuIcon_Vhuh",d="bar_rrRL",o="browserWindowBody_Idgs";function x(s){let{children:e,minHeight:a,url:x="http://localhost:3000",style:p,bodyStyle:j}=s;return(0,n.jsxs)("div",{className:l,style:{...p,minHeight:a},children:[(0,n.jsxs)("div",{className:r,children:[(0,n.jsxs)("div",{className:i,children:[(0,n.jsx)("span",{className:m,style:{background:"#f25f58"}}),(0,n.jsx)("span",{className:m,style:{background:"#fbbe3c"}}),(0,n.jsx)("span",{className:m,style:{background:"#58cb42"}})]}),(0,n.jsx)("div",{className:(0,t.Z)(c,"text--truncate"),children:x}),(0,n.jsx)("div",{className:h,children:(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:d}),(0,n.jsx)("span",{className:d}),(0,n.jsx)("span",{className:d})]})})]}),(0,n.jsx)("div",{className:o,style:j,children:e})]})}},80980:function(s,e,a){a.d(e,{Z:function(){return i},a:function(){return r}});var n=a(67294);let t={},l=n.createContext(t);function r(s){let e=n.useContext(l);return n.useMemo(function(){return"function"==typeof s?s(e):{...e,...s}},[e,s])}function i(s){let e;return e=s.disableParentContext?"function"==typeof s.components?s.components(t):s.components||t:r(s.components),n.createElement(l.Provider,{value:e},s.children)}}}]);