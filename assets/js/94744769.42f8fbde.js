"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["40104"],{7523:function(n,r,e){e.r(r),e.d(r,{default:function(){return u}});var t=e(24246);e(27378);var s=e(40424),o=e(98143),a=e(57922),i=e(39468);function u(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Z,{children:"Crash outside layout"}),(0,t.jsx)(o.Z,{children:(0,t.jsxs)("main",{className:"container margin-vert--xl",children:[(0,t.jsx)(a.Z,{as:"h1",children:"Error boundary tests"}),(0,t.jsx)("div",{children:(0,t.jsx)(i.Z,{children:"Crash inside layout"})}),(0,t.jsx)(s.Z,{values:{foo:(0,t.jsx)("span",{children:"FooFoo"}),bar:(0,t.jsx)("b",{children:"BarBar"})},children:"{foo} is {bar}"})]})})]})}},39468:function(n,r,e){e.d(r,{Z:function(){return o}});var t=e(24246),s=e(27378);function o(n){let{children:r="Boom!",message:e="Boom!\nSomething bad happened, but you can try again!",cause:o}=n,[a,i]=(0,s.useState)(!1);if(a)throw Error(e,{cause:o?Error(o):void 0});return(0,t.jsx)("button",{className:"button button--danger",type:"button",onClick:()=>i(!0),children:r})}}}]);