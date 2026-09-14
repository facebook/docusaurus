"use strict";(self.rspackChunkwebsite=self.rspackChunkwebsite||[]).push([[64599],{66656(e,t,r){var i=r(95745);function a(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}(0,r(36851).K2)(a,"populateCommonDb"),(0,i.K)(a,"populateCommonDb"),r.d(t,{S:()=>a})},8813(e,t,r){var i=r(12177),a=r(87018),n=r(40586),o=r(95745),l=r(36851),s="",d="",m="",c=[],h=new Map,p=(0,o.K)(e=>(0,a.jZ)(e,(0,a.D7)()),"sanitizeText"),u=(0,o.K)(e=>{switch(e.type){case"terminal":return{...e,value:p(e.value)};case"nonterminal":return{...e,name:p(e.name)};case"sequence":return{...e,elements:e.elements.map(u)};case"choice":return{...e,alternatives:e.alternatives.map(u)};case"optional":return{...e,element:u(e.element)};case"repetition":return{...e,element:u(e.element),separator:e.separator?u(e.separator):void 0};case"special":return{...e,text:p(e.text)}}},"sanitizeAstNode"),g=(0,o.K)(()=>{s="",d="",m="",c.length=0,h.clear(),(0,a.IU)(),n.Rm.debug("[Railroad] Database cleared")},"clear"),T=(0,o.K)(e=>{s=p(e),n.Rm.debug("[Railroad] Title set:",e)},"setTitle"),f=(0,o.K)(()=>s,"getTitle"),x=(0,o.K)(e=>{let t={...e,name:p(e.name),definition:u(e.definition),comment:e.comment?p(e.comment):void 0};n.Rm.debug("[Railroad] Adding rule:",t.name),h.has(t.name)&&n.Rm.warn(`[Railroad] Rule '${t.name}' is already defined. Overwriting.`),c.push(t),h.set(t.name,t)},"addRule"),w=(0,o.K)(()=>c,"getRules"),k=(0,o.K)(e=>h.get(e),"getRule"),C=(0,o.K)(e=>{d=p(e).replace(/^\s+/g,""),n.Rm.debug("[Railroad] Accessibility title set:",e)},"setAccTitle"),$=(0,o.K)(()=>d,"getAccTitle"),S=(0,o.K)(e=>{m=p(e).replace(/\n\s+/g,"\n"),n.Rm.debug("[Railroad] Accessibility description set:",e)},"setAccDescription"),F={clear:g,setTitle:T,getTitle:f,addRule:x,getRules:w,getRule:k,setAccTitle:C,getAccTitle:$,setAccDescription:S,getAccDescription:(0,o.K)(()=>m,"getAccDescription"),setDiagramTitle:T,getDiagramTitle:f},R={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},y=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,b=/^[\w "',.-]+$/,v=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),z=(0,o.K)(e=>!!e&&Object.keys(e).every(e=>"railroad"===e||v.has(e)),"isRailroadStyleOptions"),K=(0,o.K)(e=>e?"railroad"in e&&e.railroad?e.railroad:z(e)?e:{}:{},"extractRailroadOverrides"),M=(0,o.K)(e=>{if(!e||z(e))return{};let{railroad:t,svgId:r,theme:i,look:a,...n}=e;return n},"extractThemeOverrides"),A=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return y.test(r)?r:t},"sanitizeColorValue"),D=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return b.test(r)?r:t},"sanitizeFontFamilyValue"),N=(0,o.K)((e,t)=>{let r="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):0/0;return Number.isFinite(r)&&r>=0?r:t},"sanitizeNumberValue"),B=(0,o.K)(e=>{let t="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):0/0;return Number.isFinite(t)&&t>0?t:void 0},"parseThemeFontSize"),E=(0,o.K)(e=>{let t=D(e.fontFamily,R.fontFamily),r=B(e.fontSize)??R.fontSize;return{...R,fontFamily:t,fontSize:r,terminalFill:A(e.secondBkg??e.secondaryColor,R.terminalFill),terminalStroke:A(e.secondaryBorderColor??e.lineColor,R.terminalStroke),terminalTextColor:A(e.secondaryTextColor??e.textColor,R.terminalTextColor),nonTerminalFill:A(e.mainBkg??e.background,R.nonTerminalFill),nonTerminalStroke:A(e.primaryBorderColor??e.lineColor,R.nonTerminalStroke),nonTerminalTextColor:A(e.primaryTextColor??e.textColor,R.nonTerminalTextColor),lineColor:A(e.lineColor,R.lineColor),markerFill:A(e.lineColor,R.markerFill),commentFill:A(e.labelBackground??e.tertiaryColor,R.commentFill),commentStroke:A(e.tertiaryBorderColor??e.lineColor,R.commentStroke),commentTextColor:A(e.tertiaryTextColor??e.textColor,R.commentTextColor),specialFill:A(e.tertiaryColor??e.secondaryColor,R.specialFill),specialStroke:A(e.tertiaryBorderColor??e.secondaryBorderColor,R.specialStroke),ruleNameColor:A(e.titleColor??e.textColor,R.ruleNameColor)}},"buildThemeDefaults"),O=(0,o.K)(e=>{let t=(0,a.zj)(),r=E({...(0,a.gA)(),...t.themeVariables??{},...M(e)}),i={...t.railroad??{},...K(e)};return{compactMode:i.compactMode??r.compactMode,padding:N(i.padding,r.padding),verticalSeparation:N(i.verticalSeparation,r.verticalSeparation),horizontalSeparation:N(i.horizontalSeparation,r.horizontalSeparation),arcRadius:N(i.arcRadius,r.arcRadius),fontSize:N(i.fontSize,r.fontSize),fontFamily:D(i.fontFamily,r.fontFamily),terminalFill:A(i.terminalFill,r.terminalFill),terminalStroke:A(i.terminalStroke,r.terminalStroke),terminalTextColor:A(i.terminalTextColor,r.terminalTextColor),nonTerminalFill:A(i.nonTerminalFill,r.nonTerminalFill),nonTerminalStroke:A(i.nonTerminalStroke,r.nonTerminalStroke),nonTerminalTextColor:A(i.nonTerminalTextColor,r.nonTerminalTextColor),lineColor:A(i.lineColor,r.lineColor),strokeWidth:N(i.strokeWidth,r.strokeWidth),markerFill:A(i.markerFill,r.markerFill),commentFill:A(i.commentFill,r.commentFill),commentStroke:A(i.commentStroke,r.commentStroke),commentTextColor:A(i.commentTextColor,r.commentTextColor),specialFill:A(i.specialFill,r.specialFill),specialStroke:A(i.specialStroke,r.specialStroke),ruleNameColor:A(i.ruleNameColor,r.ruleNameColor),showMarkers:i.showMarkers??r.showMarkers,markerRadius:N(i.markerRadius,r.markerRadius)}},"buildRailroadStyleOptions"),W=(0,o.K)(e=>{let{fontFamily:t,fontSize:r,terminalFill:i,terminalStroke:a,terminalTextColor:n,nonTerminalFill:o,nonTerminalStroke:l,nonTerminalTextColor:s,lineColor:d,strokeWidth:m,markerFill:c,commentFill:h,commentStroke:p,commentTextColor:u,specialFill:g,specialStroke:T,ruleNameColor:f}=O(e);return`
  .railroad-diagram {
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-terminal rect {
    fill: ${i};
    stroke: ${a};
    stroke-width: ${m}px;
  }

  .railroad-terminal text {
    fill: ${n};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${o};
    stroke: ${l};
    stroke-width: ${m}px;
  }

  .railroad-nonterminal text {
    fill: ${s};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${d};
    stroke-width: ${m}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${c};
  }

  .railroad-comment ellipse {
    fill: ${h};
    stroke: ${p};
    stroke-width: ${m}px;
  }

  .railroad-comment text {
    fill: ${u};
    font-style: italic;
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${g};
    stroke: ${T};
    stroke-width: ${m}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${s};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${f};
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),q=class{static{(0,l.K2)(this,"PathBuilder")}constructor(){this.d=""}static{(0,o.K)(this,"PathBuilder")}moveTo(e,t){return this.d+=`M ${e} ${t} `,this}lineTo(e,t){return this.d+=`L ${e} ${t} `,this}horizontalTo(e){return this.d+=`H ${e} `,this}verticalTo(e){return this.d+=`V ${e} `,this}arcTo(e,t,r,i,a,n,o){return this.d+=`A ${e} ${t} ${r} ${+!!i} ${+!!a} ${n} ${o} `,this}build(){return this.d.trim()}},V=class{static{(0,l.K2)(this,"RailroadRenderer")}constructor(e,t=O()){this.textCache=new Map,this.svg=e,this.config=t}static{(0,o.K)(this,"RailroadRenderer")}measureText(e){if(this.textCache.has(e))return this.textCache.get(e);let t=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(e),r=t.node().getBBox(),i={width:r.width,height:r.height};return t.remove(),this.textCache.set(e,i),i}renderTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-terminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a).attr("rx",10).attr("ry",10),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderNonTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-nonterminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderSequence(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0,n=0;for(let e of r)i+=e.dimensions.width,a=Math.max(a,e.dimensions.up),n=Math.max(n,e.dimensions.down);i+=(r.length-1)*this.config.horizontalSeparation;let o=e.append("g").attr("class","railroad-sequence"),l=0;for(let e=0;e<r.length;e++){let t=r[e],i=a-t.dimensions.up;if(o.node().appendChild(t.element).setAttribute("transform",`translate(${l}, ${i})`),e<r.length-1){let e=l+t.dimensions.width,r=e+this.config.horizontalSeparation,i=a;o.append("path").attr("class","railroad-line").attr("d",new q().moveTo(e,i).lineTo(r,i).build())}l+=t.dimensions.width+this.config.horizontalSeparation}return{element:o.node(),dimensions:{width:i,height:a+n,up:a,down:n}}}renderChoice(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0;for(let e of r)i=Math.max(i,e.dimensions.width),a+=e.dimensions.height;a+=(r.length-1)*this.config.verticalSeparation;let n=this.config.arcRadius,o=i+4*n,l=e.append("g").attr("class","railroad-choice"),s=0,d=a/2;for(let e of r){let t=s,r=t+e.dimensions.up,a=2*n+(i-e.dimensions.width)/2;l.node().appendChild(e.element).setAttribute("transform",`translate(${a}, ${t})`);let m=new q,c=r>d;r===d?m.moveTo(0,d).lineTo(a,r):m.moveTo(0,d).arcTo(n,n,0,!1,c,n,d+(c?n:-n)).lineTo(n,r-(c?n:-n)).arcTo(n,n,0,!1,!c,2*n,r).lineTo(a,r),l.append("path").attr("class","railroad-line").attr("d",m.build());let h=new q,p=a+e.dimensions.width,u=o-2*n;r===d?h.moveTo(p,r).lineTo(o,d):h.moveTo(p,r).lineTo(u,r).arcTo(n,n,0,!1,!c,o-n,r+(c?-n:n)).lineTo(o-n,d+(c?n:-n)).arcTo(n,n,0,!1,c,o,d),l.append("path").attr("class","railroad-line").attr("d",h.build()),s+=e.dimensions.height+this.config.verticalSeparation}return{element:l.node(),dimensions:{width:o,height:a,up:d,down:a-d}}}renderOptional(e,t){let r=this.renderExpression(e,t),i=this.config.arcRadius,a=2*i,n=r.dimensions.width+4*i,o=r.dimensions.height+a,l=e.append("g").attr("class","railroad-optional"),s=2*i;l.node().appendChild(r.element).setAttribute("transform",`translate(${s}, ${a})`);let d=a+r.dimensions.up,m=new q().moveTo(0,d).lineTo(2*i,d);l.append("path").attr("class","railroad-line").attr("d",m.build());let c=new q().moveTo(s+r.dimensions.width,d).lineTo(n,d);l.append("path").attr("class","railroad-line").attr("d",c.build());let h=new q().moveTo(0,d).arcTo(i,i,0,!1,!1,i,d-i).lineTo(i,i).arcTo(i,i,0,!1,!0,2*i,0).lineTo(n-2*i,0).arcTo(i,i,0,!1,!0,n-i,i).lineTo(n-i,d-i).arcTo(i,i,0,!1,!1,n,d);return l.append("path").attr("class","railroad-line").attr("d",h.build()),{element:l.node(),dimensions:{width:n,height:o,up:d,down:o-d}}}renderRepetition(e,t,r){let i=this.renderExpression(e,t),a=this.config.arcRadius,n=2*a,o=i.dimensions.width+4*a,l=0===r,s=i.dimensions.height+n+(l?n:0),d=e.append("g").attr("class","railroad-repetition"),m=2*a,c=l?n:0;d.node().appendChild(i.element).setAttribute("transform",`translate(${m}, ${c})`);let h=c+i.dimensions.up;d.append("path").attr("class","railroad-line").attr("d",new q().moveTo(0,h).lineTo(2*a,h).build()),d.append("path").attr("class","railroad-line").attr("d",new q().moveTo(m+i.dimensions.width,h).lineTo(o,h).build());let p=c+i.dimensions.height+a,u=new q().moveTo(m+i.dimensions.width,h).arcTo(a,a,0,!1,!0,m+i.dimensions.width+a,h+a).lineTo(m+i.dimensions.width+a,p).arcTo(a,a,0,!1,!0,m+i.dimensions.width,p+a).lineTo(2*a,p+a).arcTo(a,a,0,!1,!0,a,p).lineTo(a,h+a).arcTo(a,a,0,!1,!0,2*a,h);if(d.append("path").attr("class","railroad-line").attr("d",u.build()),l){let e=new q().moveTo(0,h).arcTo(a,a,0,!1,!1,a,h-a).lineTo(a,a).arcTo(a,a,0,!1,!0,2*a,0).lineTo(o-2*a,0).arcTo(a,a,0,!1,!0,o-a,a).lineTo(o-a,h-a).arcTo(a,a,0,!1,!1,o,h);d.append("path").attr("class","railroad-line").attr("d",e.build())}return{element:d.node(),dimensions:{width:o,height:s,up:h,down:s-h}}}renderSpecial(e,t){let r=this.measureText("? "+t+" ?"),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-special");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text("? "+t+" ?"),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderExpression(e,t){switch(t.type){case"terminal":return this.renderTerminal(e,t.value);case"nonterminal":return this.renderNonTerminal(e,t.name);case"sequence":return this.renderSequence(e,t.elements);case"choice":return this.renderChoice(e,t.alternatives);case"optional":return this.renderOptional(e,t.element);case"repetition":return this.renderRepetition(e,t.element,t.min);case"special":return this.renderSpecial(e,t.text);default:throw Error(`Unknown node type: ${t.type}`)}}renderRule(e,t){let r=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${t})`),i=e.name+" =",a=this.measureText(i).width+20,n=a+20,o=r.append("g"),l=this.renderExpression(o,e.definition),s=Math.max(20,l.dimensions.up),d=s-l.dimensions.up;return o.attr("transform",`translate(${n}, ${d})`),r.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",s).text(i),r.append("g").attr("class","railroad-start").append("circle").attr("cx",a).attr("cy",s).attr("r",this.config.markerRadius),r.append("g").attr("class","railroad-end").append("circle").attr("cx",n+l.dimensions.width+10).attr("cy",s).attr("r",this.config.markerRadius),r.append("path").attr("class","railroad-line").attr("d",new q().moveTo(a+this.config.markerRadius,s).lineTo(n,s).build()),r.append("path").attr("class","railroad-line").attr("d",new q().moveTo(n+l.dimensions.width,s).lineTo(n+l.dimensions.width+10-this.config.markerRadius,s).build()),{height:Math.max(40,d+l.dimensions.height+2*this.config.padding),width:n+l.dimensions.width+10+this.config.markerRadius}}renderDiagram(e){let t=this.config.padding,r=0;for(let i of e){let e=this.renderRule(i,t);t+=e.height+this.config.verticalSeparation,r=Math.max(r,e.width)}return{width:r+2*this.config.padding,height:t+this.config.padding}}},j=(0,o.K)((e,t,r)=>{(0,a.a$)(e,t.height,t.width,r),e.attr("viewBox",`0 0 ${t.width} ${t.height}`)},"configureRailroadSvgSize"),U={draw:(0,o.K)((e,t,r)=>{n.Rm.debug("[Railroad] Rendering diagram\n"+e);try{let e=(0,i.D)(t);e.attr("class","railroad-diagram");let r=(0,a.zj)().railroad,o=r?.useMaxWidth??!0,l=F.getRules();if(n.Rm.debug(`[Railroad] Rendering ${l.length} rules`),0===l.length){n.Rm.warn("[Railroad] No rules to render"),j(e,{height:100,width:200},o);return}let s=new V(e,O()).renderDiagram(l);j(e,s,o),n.Rm.debug("[Railroad] Render complete")}catch(e){throw n.Rm.error("[Railroad] Render error:",e),e}},"draw")};r.d(t,{$:()=>W,U:()=>U,db:()=>F})}}]);