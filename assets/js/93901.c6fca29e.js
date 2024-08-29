"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[93901],{18440:(e,t,l)=>{l.d(t,{H:()=>a});var r=l(17963);function a(e,t){var l=e.append("foreignObject").attr("width","100000"),a=l.append("xhtml:div");a.attr("xmlns","http://www.w3.org/1999/xhtml");var o=t.label;switch(typeof o){case"function":a.insert(o);break;case"object":a.insert(function(){return o});break;default:a.html(o)}r.AV(a,t.labelStyle),a.style("display","inline-block"),a.style("white-space","nowrap");var n=a.node().getBoundingClientRect();return l.attr("width",n.width).attr("height",n.height),l}},17963:(e,t,l)=>{l.d(t,{AV:()=>d,De:()=>o,c$:()=>p,gh:()=>n,nh:()=>c});var r=l(69113),a=l(42036);function o(e,t){return!!e.children(t).length}function n(e){return s(e.v)+":"+s(e.w)+":"+s(e.name)}var i=/:/g;function s(e){return e?String(e).replace(i,"\\:"):""}function d(e,t){t&&e.attr("style",t)}function c(e,t,l){t&&e.attr("class",t).attr("class",l+" "+e.attr("class"))}function p(e,t){var l=t.graph();if(r.A(l)){var o=l.transition;if(a.A(o))return o(e)}return e}},93901:(e,t,l)=>{l.d(t,{diagram:()=>n});var r=l(60972),a=l(8560),o=l(17367);l(93126),l(62499),l(51822),l(46591),l(95285),l(31546),l(31234);let n={parser:r.p,db:r.f,renderer:a.f,styles:a.a,init:e=>{e.flowchart||(e.flowchart={}),e.flowchart.arrowMarkerAbsolute=e.arrowMarkerAbsolute,(0,o.q)({flowchart:{arrowMarkerAbsolute:e.arrowMarkerAbsolute}}),a.f.setConf(e.flowchart),r.f.clear(),r.f.setGen("gen-2")}}},8560:(e,t,l)=>{l.d(t,{a:()=>y,f:()=>h});var r=l(62499),a=l(93126),o=l(17367),n=l(97027),i=l(18440),s=l(81283),d=l(112);let c=(e,t)=>s.A.lang.round(d.A.parse(e)[t]);var p=l(18448);let b={},w=function(e,t,l,r,a,n){let s=r.select(`[id="${l}"]`);Object.keys(e).forEach(function(l){let r;let d=e[l],c="default";d.classes.length>0&&(c=d.classes.join(" ")),c+=" flowchart-label";let p=(0,o.k)(d.styles),b=void 0!==d.text?d.text:d.id;if(o.l.info("vertex",d,d.labelType),"markdown"===d.labelType)o.l.info("vertex",d,d.labelType);else if((0,o.n)((0,o.c)().flowchart.htmlLabels)){let e={label:b.replace(/fa[blrs]?:fa-[\w-]+/g,e=>`<i class='${e.replace(":"," ")}'></i>`)};(r=(0,i.H)(s,e).node()).parentNode.removeChild(r)}else{let e=a.createElementNS("http://www.w3.org/2000/svg","text");for(let t of(e.setAttribute("style",p.labelStyle.replace("color:","fill:")),b.split(o.e.lineBreakRegex))){let l=a.createElementNS("http://www.w3.org/2000/svg","tspan");l.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),l.setAttribute("dy","1em"),l.setAttribute("x","1"),l.textContent=t,e.appendChild(l)}r=e}let w=0,f="";switch(d.type){case"round":w=5,f="rect";break;case"square":case"group":default:f="rect";break;case"diamond":f="question";break;case"hexagon":f="hexagon";break;case"odd":case"odd_right":f="rect_left_inv_arrow";break;case"lean_right":f="lean_right";break;case"lean_left":f="lean_left";break;case"trapezoid":f="trapezoid";break;case"inv_trapezoid":f="inv_trapezoid";break;case"circle":f="circle";break;case"ellipse":f="ellipse";break;case"stadium":f="stadium";break;case"subroutine":f="subroutine";break;case"cylinder":f="cylinder";break;case"doublecircle":f="doublecircle"}t.setNode(d.id,{labelStyle:p.labelStyle,shape:f,labelText:b,labelType:d.labelType,rx:w,ry:w,class:c,style:p.style,id:d.id,link:d.link,linkTarget:d.linkTarget,tooltip:n.db.getTooltip(d.id)||"",domId:n.db.lookUpDomId(d.id),haveCallback:d.haveCallback,width:"group"===d.type?500:void 0,dir:d.dir,type:d.type,props:d.props,padding:(0,o.c)().flowchart.padding}),o.l.info("setNode",{labelStyle:p.labelStyle,labelType:d.labelType,shape:f,labelText:b,rx:w,ry:w,class:c,style:p.style,id:d.id,domId:n.db.lookUpDomId(d.id),width:"group"===d.type?500:void 0,type:d.type,dir:d.dir,props:d.props,padding:(0,o.c)().flowchart.padding})})},f=function(e,t,l){let r,n;o.l.info("abc78 edges = ",e);let i=0,s={};if(void 0!==e.defaultStyle){let t=(0,o.k)(e.defaultStyle);r=t.style,n=t.labelStyle}e.forEach(function(l){i++;let d="L-"+l.start+"-"+l.end;void 0===s[d]?s[d]=0:s[d]++,o.l.info("abc78 new entry",d,s[d]);let c=d+"-"+s[d];o.l.info("abc78 new link id to be used is",d,c,s[d]);let p="LS-"+l.start,w="LE-"+l.end,f={style:"",labelStyle:""};switch(f.minlen=l.length||1,"arrow_open"===l.type?f.arrowhead="none":f.arrowhead="normal",f.arrowTypeStart="arrow_open",f.arrowTypeEnd="arrow_open",l.type){case"double_arrow_cross":f.arrowTypeStart="arrow_cross";case"arrow_cross":f.arrowTypeEnd="arrow_cross";break;case"double_arrow_point":f.arrowTypeStart="arrow_point";case"arrow_point":f.arrowTypeEnd="arrow_point";break;case"double_arrow_circle":f.arrowTypeStart="arrow_circle";case"arrow_circle":f.arrowTypeEnd="arrow_circle"}let u="",h="";switch(l.stroke){case"normal":u="fill:none;",void 0!==r&&(u=r),void 0!==n&&(h=n),f.thickness="normal",f.pattern="solid";break;case"dotted":f.thickness="normal",f.pattern="dotted",f.style="fill:none;stroke-width:2px;stroke-dasharray:3;";break;case"thick":f.thickness="thick",f.pattern="solid",f.style="stroke-width: 3.5px;fill:none;";break;case"invisible":f.thickness="invisible",f.pattern="solid",f.style="stroke-width: 0;fill:none;"}if(void 0!==l.style){let e=(0,o.k)(l.style);u=e.style,h=e.labelStyle}f.style=f.style+=u,f.labelStyle=f.labelStyle+=h,void 0!==l.interpolate?f.curve=(0,o.o)(l.interpolate,a.lUB):void 0!==e.defaultInterpolate?f.curve=(0,o.o)(e.defaultInterpolate,a.lUB):f.curve=(0,o.o)(b.curve,a.lUB),void 0===l.text?void 0!==l.style&&(f.arrowheadStyle="fill: #333"):(f.arrowheadStyle="fill: #333",f.labelpos="c"),f.labelType=l.labelType,f.label=l.text.replace(o.e.lineBreakRegex,"\n"),void 0===l.style&&(f.style=f.style||"stroke: #333; stroke-width: 1.5px;fill:none;"),f.labelStyle=f.labelStyle.replace("color:","fill:"),f.id=c,f.classes="flowchart-link "+p+" "+w,t.setEdge(l.start,l.end,f,i)})},u=async function(e,t,l,i){let s,d;o.l.info("Drawing flowchart");let c=i.db.getDirection();void 0===c&&(c="TD");let{securityLevel:p,flowchart:b}=(0,o.c)(),u=b.nodeSpacing||50,h=b.rankSpacing||50;"sandbox"===p&&(s=(0,a.Ltv)("#i"+t));let g="sandbox"===p?(0,a.Ltv)(s.nodes()[0].contentDocument.body):(0,a.Ltv)("body"),y="sandbox"===p?s.nodes()[0].contentDocument:document,k=new r.T({multigraph:!0,compound:!0}).setGraph({rankdir:c,nodesep:u,ranksep:h,marginx:0,marginy:0}).setDefaultEdgeLabel(function(){return{}}),x=i.db.getSubGraphs();o.l.info("Subgraphs - ",x);for(let e=x.length-1;e>=0;e--)d=x[e],o.l.info("Subgraph - ",d),i.db.addVertex(d.id,{text:d.title,type:d.labelType},"group",void 0,d.classes,d.dir);let v=i.db.getVertices(),m=i.db.getEdges();o.l.info("Edges",m);let S=0;for(S=x.length-1;S>=0;S--){d=x[S],(0,a.Ubm)("cluster").append("text");for(let e=0;e<d.nodes.length;e++)o.l.info("Setting up subgraphs",d.nodes[e],d.id),k.setParent(d.nodes[e],d.id)}w(v,k,t,g,y,i),f(m,k);let T=g.select(`[id="${t}"]`),C=g.select("#"+t+" g");if(await (0,n.r)(C,k,["point","circle","cross"],"flowchart",t),o.u.insertTitle(T,"flowchartTitleText",b.titleTopMargin,i.db.getDiagramTitle()),(0,o.p)(k,T,b.diagramPadding,b.useMaxWidth),i.db.indexNodes("subGraph"+S),!b.htmlLabels)for(let e of y.querySelectorAll('[id="'+t+'"] .edgeLabel .label')){let t=e.getBBox(),l=y.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("rx",0),l.setAttribute("ry",0),l.setAttribute("width",t.width),l.setAttribute("height",t.height),e.insertBefore(l,e.firstChild)}Object.keys(v).forEach(function(e){let l=v[e];if(l.link){let r=(0,a.Ltv)("#"+t+' [id="'+e+'"]');if(r){let e=y.createElementNS("http://www.w3.org/2000/svg","a");e.setAttributeNS("http://www.w3.org/2000/svg","class",l.classes.join(" ")),e.setAttributeNS("http://www.w3.org/2000/svg","href",l.link),e.setAttributeNS("http://www.w3.org/2000/svg","rel","noopener"),"sandbox"===p?e.setAttributeNS("http://www.w3.org/2000/svg","target","_top"):l.linkTarget&&e.setAttributeNS("http://www.w3.org/2000/svg","target",l.linkTarget);let t=r.insert(function(){return e},":first-child"),a=r.select(".label-container");a&&t.append(function(){return a.node()});let o=r.select(".label");o&&t.append(function(){return o.node()})}}})},h={setConf:function(e){for(let t of Object.keys(e))b[t]=e[t]},addVertices:w,addEdges:f,getClasses:function(e,t){return t.db.getClasses()},draw:u},g=(e,t)=>{let l=c(e,"r"),r=c(e,"g"),a=c(e,"b");return p.A(l,r,a,t)},y=e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.nodeTextColor||e.textColor};
  }
  .cluster-label text {
    fill: ${e.titleColor};
  }
  .cluster-label span,p {
    color: ${e.titleColor};
  }

  .label text,span,p {
    fill: ${e.nodeTextColor||e.textColor};
    color: ${e.nodeTextColor||e.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
      background-color: ${e.edgeLabelBackground};
      fill: ${e.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${g(e.edgeLabelBackground,.5)};
    // background-color: 
  }

  .cluster rect {
    fill: ${e.clusterBkg};
    stroke: ${e.clusterBorder};
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  .cluster span,p {
    color: ${e.titleColor};
  }
  /* .cluster div {
    color: ${e.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.textColor};
  }
`}}]);