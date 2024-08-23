"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[64474],{96157:(e,t,r)=>{r.d(t,{a:()=>a});var l=r(36715);function a(e,t){var r=e.append("foreignObject").attr("width","100000"),a=r.append("xhtml:div");a.attr("xmlns","http://www.w3.org/1999/xhtml");var o=t.label;switch(typeof o){case"function":a.insert(o);break;case"object":a.insert(function(){return o});break;default:a.html(o)}l.bg(a,t.labelStyle),a.style("display","inline-block"),a.style("white-space","nowrap");var n=a.node().getBoundingClientRect();return r.attr("width",n.width).attr("height",n.height),r}},36715:(e,t,r)=>{r.d(t,{$p:()=>d,O1:()=>n,WR:()=>p,bF:()=>o,bg:()=>c});var l=r(22701),a=r(78246);function o(e,t){return!!e.children(t).length}function n(e){return s(e.v)+":"+s(e.w)+":"+s(e.name)}var i=/:/g;function s(e){return e?String(e).replace(i,"\\:"):""}function c(e,t){t&&e.attr("style",t)}function d(e,t,r){t&&e.attr("class",t).attr("class",r+" "+e.attr("class"))}function p(e,t){var r=t.graph();if(l.Z(r)){var o=r.transition;if(a.Z(o))return o(e)}return e}},64474:(e,t,r)=>{r.d(t,{diagram:()=>v});var l=r(64627),a=(r(88472),r(63294)),o=(r(99854),r(88103)),n=(r(65029),r(46188),r(9500),r(36715)),i=r(96157);function s(e,t,r){var l,a=t.label,o=e.append("g");"svg"===t.labelType?(o.node().appendChild(t.label),n.bg(o,t.labelStyle)):"string"!=typeof a||"html"===t.labelType?(0,i.a)(o,t):function(e,t){for(var r=e.append("text"),l=(function(e){for(var t,r="",l=!1,a=0;a<e.length;++a)(t=e[a],l)?("n"===t?r+="\n":r+=t,l=!1):"\\"===t?l=!0:r+=t;return r})(t.label).split("\n"),a=0;a<l.length;a++)r.append("tspan").attr("xml:space","preserve").attr("dy","1em").attr("x","1").text(l[a]);return n.bg(r,t.labelStyle),r}(o,t);var s=o.node().getBBox();switch(r){case"top":l=-t.height/2;break;case"bottom":l=t.height/2-s.height;break;default:l=-s.height/2}return o.attr("transform","translate("+-s.width/2+","+l+")"),o}var c=r(63345),d=r(1110);function p(e,t){return e.intersect(t)}function b(e,t){var r=(a.jvg||a.YPS.line)().x(function(e){return e.x}).y(function(e){return e.y});return(r.curve||r.interpolate)(e.curve),r(t)}var u=r(25541);function h(e,t,r,l){var a=e.x,o=e.y,n=a-l.x,i=o-l.y,s=Math.sqrt(t*t*i*i+r*r*n*n),c=Math.abs(t*r*n/s);l.x<a&&(c=-c);var d=Math.abs(t*r*i/s);return l.y<o&&(d=-d),{x:a+c,y:o+d}}function f(e,t,r){var l=e.x,a=e.y,o=[],n=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY;t.forEach(function(e){n=Math.min(n,e.x),i=Math.min(i,e.y)});for(var s=l-e.width/2-n,c=a-e.height/2-i,d=0;d<t.length;d++){var p=t[d],b=t[d<t.length-1?d+1:0],u=function(e,t,r,l){var a,o,n,i,s,c,d,p,b,u,h,f,g;if(a=t.y-e.y,n=e.x-t.x,s=t.x*e.y-e.x*t.y,b=a*r.x+n*r.y+s,u=a*l.x+n*l.y+s,(0===b||0===u||!(b*u>0))&&(o=l.y-r.y,i=r.x-l.x,c=l.x*r.y-r.x*l.y,d=o*e.x+i*e.y+c,p=o*t.x+i*t.y+c,!(0!==d&&0!==p&&d*p>0)&&0!=(h=a*i-o*n)))return f=Math.abs(h/2),{x:(g=n*c-i*s)<0?(g-f)/h:(g+f)/h,y:(g=o*s-a*c)<0?(g-f)/h:(g+f)/h}}(e,r,{x:s+p.x,y:c+p.y},{x:s+b.x,y:c+b.y});u&&o.push(u)}return o.length?(o.length>1&&o.sort(function(e,t){var l=e.x-r.x,a=e.y-r.y,o=Math.sqrt(l*l+a*a),n=t.x-r.x,i=t.y-r.y,s=Math.sqrt(n*n+i*i);return o<s?-1:o===s?0:1}),o[0]):(console.log("NO INTERSECTION FOUND, RETURN NODE CENTER",e),e)}function g(e,t){var r,l,a=e.x,o=e.y,n=t.x-a,i=t.y-o,s=e.width/2,c=e.height/2;return Math.abs(i)*s>Math.abs(n)*c?(i<0&&(c=-c),r=0===i?0:c*n/i,l=c):(n<0&&(s=-s),r=s,l=0===n?0:s*i/n),{x:a+r,y:o+l}}a.c_6;var y=r(29119);function w(e,t,r,l){return e.insert("polygon",":first-child").attr("points",l.map(function(e){return e.x+","+e.y}).join(" ")).attr("transform","translate("+-t/2+","+r/2+")")}r(27693),r(7608),r(31699),r(76576);let x={},k=function(e){for(let t of Object.keys(e))x[t]=e[t]},v={parser:l.p,db:l.f,renderer:y.f,styles:y.a,init:e=>{e.flowchart||(e.flowchart={}),e.flowchart.arrowMarkerAbsolute=e.arrowMarkerAbsolute,k(e.flowchart),l.f.clear(),l.f.setGen("gen-1")}}},29119:(e,t,r)=>{r.d(t,{a:()=>w,f:()=>g});var l=r(88472),a=r(63294),o=r(99854),n=r(30198),i=r(96157),s=r(83445),c=r(31739);let d=(e,t)=>s.Z.lang.round(c.Z.parse(e)[t]);var p=r(46442);let b={},u=function(e,t,r,l,a,n){let s=l.select(`[id="${r}"]`);Object.keys(e).forEach(function(r){let l;let c=e[r],d="default";c.classes.length>0&&(d=c.classes.join(" ")),d+=" flowchart-label";let p=(0,o.k)(c.styles),b=void 0!==c.text?c.text:c.id;if(o.l.info("vertex",c,c.labelType),"markdown"===c.labelType)o.l.info("vertex",c,c.labelType);else if((0,o.n)((0,o.c)().flowchart.htmlLabels)){let e={label:b.replace(/fa[blrs]?:fa-[\w-]+/g,e=>`<i class='${e.replace(":"," ")}'></i>`)};(l=(0,i.a)(s,e).node()).parentNode.removeChild(l)}else{let e=a.createElementNS("http://www.w3.org/2000/svg","text");for(let t of(e.setAttribute("style",p.labelStyle.replace("color:","fill:")),b.split(o.e.lineBreakRegex))){let r=a.createElementNS("http://www.w3.org/2000/svg","tspan");r.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),r.setAttribute("dy","1em"),r.setAttribute("x","1"),r.textContent=t,e.appendChild(r)}l=e}let u=0,h="";switch(c.type){case"round":u=5,h="rect";break;case"square":case"group":default:h="rect";break;case"diamond":h="question";break;case"hexagon":h="hexagon";break;case"odd":case"odd_right":h="rect_left_inv_arrow";break;case"lean_right":h="lean_right";break;case"lean_left":h="lean_left";break;case"trapezoid":h="trapezoid";break;case"inv_trapezoid":h="inv_trapezoid";break;case"circle":h="circle";break;case"ellipse":h="ellipse";break;case"stadium":h="stadium";break;case"subroutine":h="subroutine";break;case"cylinder":h="cylinder";break;case"doublecircle":h="doublecircle"}t.setNode(c.id,{labelStyle:p.labelStyle,shape:h,labelText:b,labelType:c.labelType,rx:u,ry:u,class:d,style:p.style,id:c.id,link:c.link,linkTarget:c.linkTarget,tooltip:n.db.getTooltip(c.id)||"",domId:n.db.lookUpDomId(c.id),haveCallback:c.haveCallback,width:"group"===c.type?500:void 0,dir:c.dir,type:c.type,props:c.props,padding:(0,o.c)().flowchart.padding}),o.l.info("setNode",{labelStyle:p.labelStyle,labelType:c.labelType,shape:h,labelText:b,rx:u,ry:u,class:d,style:p.style,id:c.id,domId:n.db.lookUpDomId(c.id),width:"group"===c.type?500:void 0,type:c.type,dir:c.dir,props:c.props,padding:(0,o.c)().flowchart.padding})})},h=function(e,t,r){let l,n;o.l.info("abc78 edges = ",e);let i=0,s={};if(void 0!==e.defaultStyle){let t=(0,o.k)(e.defaultStyle);l=t.style,n=t.labelStyle}e.forEach(function(r){i++;let c="L-"+r.start+"-"+r.end;void 0===s[c]?s[c]=0:s[c]++,o.l.info("abc78 new entry",c,s[c]);let d=c+"-"+s[c];o.l.info("abc78 new link id to be used is",c,d,s[c]);let p="LS-"+r.start,u="LE-"+r.end,h={style:"",labelStyle:""};switch(h.minlen=r.length||1,"arrow_open"===r.type?h.arrowhead="none":h.arrowhead="normal",h.arrowTypeStart="arrow_open",h.arrowTypeEnd="arrow_open",r.type){case"double_arrow_cross":h.arrowTypeStart="arrow_cross";case"arrow_cross":h.arrowTypeEnd="arrow_cross";break;case"double_arrow_point":h.arrowTypeStart="arrow_point";case"arrow_point":h.arrowTypeEnd="arrow_point";break;case"double_arrow_circle":h.arrowTypeStart="arrow_circle";case"arrow_circle":h.arrowTypeEnd="arrow_circle"}let f="",g="";switch(r.stroke){case"normal":f="fill:none;",void 0!==l&&(f=l),void 0!==n&&(g=n),h.thickness="normal",h.pattern="solid";break;case"dotted":h.thickness="normal",h.pattern="dotted",h.style="fill:none;stroke-width:2px;stroke-dasharray:3;";break;case"thick":h.thickness="thick",h.pattern="solid",h.style="stroke-width: 3.5px;fill:none;";break;case"invisible":h.thickness="invisible",h.pattern="solid",h.style="stroke-width: 0;fill:none;"}if(void 0!==r.style){let e=(0,o.k)(r.style);f=e.style,g=e.labelStyle}h.style=h.style+=f,h.labelStyle=h.labelStyle+=g,void 0!==r.interpolate?h.curve=(0,o.o)(r.interpolate,a.c_6):void 0!==e.defaultInterpolate?h.curve=(0,o.o)(e.defaultInterpolate,a.c_6):h.curve=(0,o.o)(b.curve,a.c_6),void 0===r.text?void 0!==r.style&&(h.arrowheadStyle="fill: #333"):(h.arrowheadStyle="fill: #333",h.labelpos="c"),h.labelType=r.labelType,h.label=r.text.replace(o.e.lineBreakRegex,"\n"),void 0===r.style&&(h.style=h.style||"stroke: #333; stroke-width: 1.5px;fill:none;"),h.labelStyle=h.labelStyle.replace("color:","fill:"),h.id=d,h.classes="flowchart-link "+p+" "+u,t.setEdge(r.start,r.end,h,i)})},f=async function(e,t,r,i){let s,c;o.l.info("Drawing flowchart");let d=i.db.getDirection();void 0===d&&(d="TD");let{securityLevel:p,flowchart:b}=(0,o.c)(),f=b.nodeSpacing||50,g=b.rankSpacing||50;"sandbox"===p&&(s=(0,a.Ys)("#i"+t));let y="sandbox"===p?(0,a.Ys)(s.nodes()[0].contentDocument.body):(0,a.Ys)("body"),w="sandbox"===p?s.nodes()[0].contentDocument:document,x=new l.k({multigraph:!0,compound:!0}).setGraph({rankdir:d,nodesep:f,ranksep:g,marginx:0,marginy:0}).setDefaultEdgeLabel(function(){return{}}),k=i.db.getSubGraphs();o.l.info("Subgraphs - ",k);for(let e=k.length-1;e>=0;e--)c=k[e],o.l.info("Subgraph - ",c),i.db.addVertex(c.id,{text:c.title,type:c.labelType},"group",void 0,c.classes,c.dir);let v=i.db.getVertices(),m=i.db.getEdges();o.l.info("Edges",m);let T=0;for(T=k.length-1;T>=0;T--){c=k[T],(0,a.td_)("cluster").append("text");for(let e=0;e<c.nodes.length;e++)o.l.info("Setting up subgraphs",c.nodes[e],c.id),x.setParent(c.nodes[e],c.id)}u(v,x,t,y,w,i),h(m,x);let S=y.select(`[id="${t}"]`),_=y.select("#"+t+" g");if(await (0,n.r)(_,x,["point","circle","cross"],"flowchart",t),o.u.insertTitle(S,"flowchartTitleText",b.titleTopMargin,i.db.getDiagramTitle()),(0,o.p)(x,S,b.diagramPadding,b.useMaxWidth),i.db.indexNodes("subGraph"+T),!b.htmlLabels)for(let e of w.querySelectorAll('[id="'+t+'"] .edgeLabel .label')){let t=e.getBBox(),r=w.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("rx",0),r.setAttribute("ry",0),r.setAttribute("width",t.width),r.setAttribute("height",t.height),e.insertBefore(r,e.firstChild)}Object.keys(v).forEach(function(e){let r=v[e];if(r.link){let l=(0,a.Ys)("#"+t+' [id="'+e+'"]');if(l){let e=w.createElementNS("http://www.w3.org/2000/svg","a");e.setAttributeNS("http://www.w3.org/2000/svg","class",r.classes.join(" ")),e.setAttributeNS("http://www.w3.org/2000/svg","href",r.link),e.setAttributeNS("http://www.w3.org/2000/svg","rel","noopener"),"sandbox"===p?e.setAttributeNS("http://www.w3.org/2000/svg","target","_top"):r.linkTarget&&e.setAttributeNS("http://www.w3.org/2000/svg","target",r.linkTarget);let t=l.insert(function(){return e},":first-child"),a=l.select(".label-container");a&&t.append(function(){return a.node()});let o=l.select(".label");o&&t.append(function(){return o.node()})}}})},g={setConf:function(e){for(let t of Object.keys(e))b[t]=e[t]},addVertices:u,addEdges:h,getClasses:function(e,t){return t.db.getClasses()},draw:f},y=(e,t)=>{let r=d(e,"r"),l=d(e,"g"),a=d(e,"b");return p.Z(r,l,a,t)},w=e=>`.label {
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
    background-color: ${y(e.edgeLabelBackground,.5)};
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