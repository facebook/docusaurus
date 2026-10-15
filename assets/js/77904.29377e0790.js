"use strict";(globalThis.rspackChunkwebsite||=[]).push([[77904],{52938(t,e,a){function r(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}(0,a(48815).K)(r,"populateCommonDb"),a.d(e,{S:()=>r})},62067(t,e,a){var r=a(52938),i=a(31664),l=a(58204),n=a(57236),s=a(64225),o=a(48815),c=a(29874),d={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},g={axes:[],curves:[],options:d},u=structuredClone(g),p=n.UI.radar,x=(0,o.K)(()=>(0,l.$t)({...p,...(0,n.zj)().radar}),"getConfig"),h=(0,o.K)(()=>u.axes,"getAxes"),m=(0,o.K)(()=>u.curves,"getCurves"),$=(0,o.K)(()=>u.options,"getOptions"),f=(0,o.K)(t=>{u.axes=t.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),y=(0,o.K)(t=>{u.curves=t.map(t=>({name:t.name,label:t.label??t.name,entries:v(t.entries)}))},"setCurves"),v=(0,o.K)(t=>{if(void 0==t[0].axis)return t.map(t=>t.value);let e=h();if(0===e.length)throw Error("Axes must be populated before curves for reference entries");return e.map(e=>{let a=t.find(t=>t.axis?.$refText===e.name);if(void 0===a)throw Error("Missing entry for axis "+e.label);return a.value})},"computeCurveEntries"),w={getAxes:h,getCurves:m,getOptions:$,setAxes:f,setCurves:y,setOptions:(0,o.K)(t=>{let e=t.reduce((t,e)=>(t[e.name]=e,t),{});u.options={showLegend:e.showLegend?.value??d.showLegend,ticks:e.ticks?.value??d.ticks,max:e.max?.value??d.max,min:e.min?.value??d.min,graticule:e.graticule?.value??d.graticule},u.options.ticks>32&&(s.R.warn(`Radar diagram ticks (${u.options.ticks}) exceeds maximum allowed (32). Using 32 instead.`),u.options.ticks=32)},"setOptions"),getConfig:x,clear:(0,o.K)(()=>{(0,n.IU)(),u=structuredClone(g)},"clear"),setAccTitle:n.SV,getAccTitle:n.iN,setDiagramTitle:n.ke,getDiagramTitle:n.ab,getAccDescription:n.m7,setAccDescription:n.EI},b=(0,o.K)(t=>{(0,r.S)(t,w);let{axes:e,curves:a,options:i}=t;w.setAxes(e),w.setCurves(a),w.setOptions(i)},"populate"),C={parse:(0,o.K)(async t=>{let e=await (0,c.qg)("radar",t);s.R.debug(e),b(e)},"parse")},K=(0,o.K)((t,e,a,r)=>{let l=r.db,n=l.getAxes(),s=l.getCurves(),o=l.getOptions(),c=l.getConfig(),d=l.getDiagramTitle(),g=M((0,i.D)(e),c),u=o.max??Math.max(...s.map(t=>Math.max(...t.entries))),p=o.min,x=Math.min(c.width,c.height)/2;k(g,n,x,o.ticks,o.graticule),T(g,n,x,c),L(g,n,s,p,u,o.graticule,c),I(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),M=(0,o.K)((t,e)=>{let a=e.width+e.marginLeft+e.marginRight,r=e.height+e.marginTop+e.marginBottom,i={x:e.marginLeft+e.width/2,y:e.marginTop+e.height/2};return(0,n.a$)(t,r,a,e.useMaxWidth??!0),t.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),t.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),k=(0,o.K)((t,e,a,r,i)=>{if("circle"===i)for(let e=0;e<r;e++){let i=a*(e+1)/r;t.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=e.length;for(let l=0;l<r;l++){let n=a*(l+1)/r,s=e.map((t,e)=>{let a=2*e*Math.PI/i-Math.PI/2,r=n*Math.cos(a),l=n*Math.sin(a);return`${r},${l}`}).join(" ");t.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),T=(0,o.K)((t,e,a,r)=>{let i=e.length;for(let l=0;l<i;l++){let n=e[l].label,s=2*l*Math.PI/i-Math.PI/2,o=Math.cos(s),c=Math.sin(s);t.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*c).attr("class","radarAxisLine");let d=o>.01?"start":o<-.01?"end":"middle",g=c>.01?"hanging":c<-.01?"auto":"central";t.append("text").text(n).attr("x",a*r.axisLabelFactor*o+4*o).attr("y",a*r.axisLabelFactor*c+4*c).attr("text-anchor",d).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function L(t,e,a,r,i,l,n){let s=e.length,o=Math.min(n.width,n.height)/2;a.forEach((e,a)=>{if(e.entries.length!==s)return;let c=e.entries.map((t,e)=>{let a=2*Math.PI*e/s-Math.PI/2,l=A(t,r,i,o);return{x:l*Math.cos(a),y:l*Math.sin(a)}});"circle"===l?t.append("path").attr("d",S(c,n.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===l&&t.append("polygon").attr("points",c.map(t=>`${t.x},${t.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function A(t,e,a,r){return r*(Math.min(Math.max(t,e),a)-e)/(a-e)}function S(t,e){let a=t.length,r=`M${t[0].x},${t[0].y}`;for(let i=0;i<a;i++){let l=t[(i-1+a)%a],n=t[i],s=t[(i+1)%a],o=t[(i+2)%a],c={x:n.x+(s.x-l.x)*e,y:n.y+(s.y-l.y)*e},d={x:s.x-(o.x-n.x)*e,y:s.y-(o.y-n.y)*e};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function I(t,e,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,l=-(3*(r.height/2+r.marginTop))/4;e.forEach((e,a)=>{let r=t.append("g").attr("transform",`translate(${i}, ${l+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(e.label)})}(0,o.K)(L,"drawCurves"),(0,o.K)(A,"relativeRadius"),(0,o.K)(S,"closedRoundCurve"),(0,o.K)(I,"drawLegend");var D=(0,o.K)((t,e)=>{let a="";for(let r=0;r<t.THEME_COLOR_LIMIT;r++){let i=t[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${e.curveOpacity};
			stroke: ${i};
			stroke-width: ${e.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${e.curveOpacity};
			stroke: ${i};
		}
		`}return a},"genIndexStyles"),O=(0,o.K)(t=>{let e=(0,n.P$)(),a=(0,n.zj)(),r=(0,l.$t)(e,a.themeVariables),i=(0,l.$t)(r.radar,t);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),R={parser:C,db:w,renderer:{draw:K},styles:(0,o.K)(({radar:t}={})=>{let{themeVariables:e,radarOptions:a}=O(t);return`
	.radarTitle {
		font-size: ${e.fontSize};
		color: ${e.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${D(e,a)}
	`},"styles")};a.d(e,{diagram:()=>R})}}]);