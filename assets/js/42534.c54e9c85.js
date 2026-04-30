"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["42534"],{78169(t,e,a){function r(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}a.d(e,{S:()=>r}),(0,a(2155).K2)(r,"populateCommonDb")},50597(t,e,a){a.d(e,{diagram:()=>O});var r=a(37772),i=a(78169),l=a(76284),n=a(3873),s=a(2155),o=a(5165),c={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},d={axes:[],curves:[],options:c},g=structuredClone(d),u=n.UI.radar,h=(0,s.K2)(()=>(0,l.$t)({...u,...(0,n.zj)().radar}),"getConfig"),p=(0,s.K2)(()=>g.axes,"getAxes"),x=(0,s.K2)(()=>g.curves,"getCurves"),m=(0,s.K2)(()=>g.options,"getOptions"),$=(0,s.K2)(t=>{g.axes=t.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),f=(0,s.K2)(t=>{g.curves=t.map(t=>({name:t.name,label:t.label??t.name,entries:y(t.entries)}))},"setCurves"),y=(0,s.K2)(t=>{if(void 0==t[0].axis)return t.map(t=>t.value);let e=p();if(0===e.length)throw Error("Axes must be populated before curves for reference entries");return e.map(e=>{let a=t.find(t=>t.axis?.$refText===e.name);if(void 0===a)throw Error("Missing entry for axis "+e.label);return a.value})},"computeCurveEntries"),v={getAxes:p,getCurves:x,getOptions:m,setAxes:$,setCurves:f,setOptions:(0,s.K2)(t=>{let e=t.reduce((t,e)=>(t[e.name]=e,t),{});g.options={showLegend:e.showLegend?.value??c.showLegend,ticks:e.ticks?.value??c.ticks,max:e.max?.value??c.max,min:e.min?.value??c.min,graticule:e.graticule?.value??c.graticule}},"setOptions"),getConfig:h,clear:(0,s.K2)(()=>{(0,n.IU)(),g=structuredClone(d)},"clear"),setAccTitle:n.SV,getAccTitle:n.iN,setDiagramTitle:n.ke,getDiagramTitle:n.ab,getAccDescription:n.m7,setAccDescription:n.EI},w=(0,s.K2)(t=>{(0,i.S)(t,v);let{axes:e,curves:a,options:r}=t;v.setAxes(e),v.setCurves(a),v.setOptions(r)},"populate"),b={parse:(0,s.K2)(async t=>{let e=await (0,o.qg)("radar",t);s.Rm.debug(e),w(e)},"parse")},C=(0,s.K2)((t,e,a,i)=>{let l=i.db,n=l.getAxes(),s=l.getCurves(),o=l.getOptions(),c=l.getConfig(),d=l.getDiagramTitle(),g=M((0,r.D)(e),c),u=o.max??Math.max(...s.map(t=>Math.max(...t.entries))),h=o.min,p=Math.min(c.width,c.height)/2;K(g,n,p,o.ticks,o.graticule),L(g,n,p,c),T(g,n,s,h,u,o.graticule,c),S(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),M=(0,s.K2)((t,e)=>{let a=e.width+e.marginLeft+e.marginRight,r=e.height+e.marginTop+e.marginBottom,i={x:e.marginLeft+e.width/2,y:e.marginTop+e.height/2};return(0,n.a$)(t,r,a,e.useMaxWidth??!0),t.attr("viewBox",`0 0 ${a} ${r}`),t.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),K=(0,s.K2)((t,e,a,r,i)=>{if("circle"===i)for(let e=0;e<r;e++){let i=a*(e+1)/r;t.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=e.length;for(let l=0;l<r;l++){let n=a*(l+1)/r,s=e.map((t,e)=>{let a=2*e*Math.PI/i-Math.PI/2,r=n*Math.cos(a),l=n*Math.sin(a);return`${r},${l}`}).join(" ");t.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),L=(0,s.K2)((t,e,a,r)=>{let i=e.length;for(let l=0;l<i;l++){let n=e[l].label,s=2*l*Math.PI/i-Math.PI/2;t.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),t.append("text").text(n).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function T(t,e,a,r,i,l,n){let s=e.length,o=Math.min(n.width,n.height)/2;a.forEach((e,a)=>{if(e.entries.length!==s)return;let c=e.entries.map((t,e)=>{let a=2*Math.PI*e/s-Math.PI/2,l=k(t,r,i,o);return{x:l*Math.cos(a),y:l*Math.sin(a)}});"circle"===l?t.append("path").attr("d",A(c,n.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===l&&t.append("polygon").attr("points",c.map(t=>`${t.x},${t.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function k(t,e,a,r){return r*(Math.min(Math.max(t,e),a)-e)/(a-e)}function A(t,e){let a=t.length,r=`M${t[0].x},${t[0].y}`;for(let i=0;i<a;i++){let l=t[(i-1+a)%a],n=t[i],s=t[(i+1)%a],o=t[(i+2)%a],c={x:n.x+(s.x-l.x)*e,y:n.y+(s.y-l.y)*e},d={x:s.x-(o.x-n.x)*e,y:s.y-(o.y-n.y)*e};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function S(t,e,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,l=-(3*(r.height/2+r.marginTop))/4;e.forEach((e,a)=>{let r=t.append("g").attr("transform",`translate(${i}, ${l+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(e.label)})}(0,s.K2)(T,"drawCurves"),(0,s.K2)(k,"relativeRadius"),(0,s.K2)(A,"closedRoundCurve"),(0,s.K2)(S,"drawLegend");var I=(0,s.K2)((t,e)=>{let a="";for(let r=0;r<t.THEME_COLOR_LIMIT;r++){let i=t[`cScale${r}`];a+=`
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
		`}return a},"genIndexStyles"),D=(0,s.K2)(t=>{let e=(0,n.P$)(),a=(0,n.zj)(),r=(0,l.$t)(e,a.themeVariables),i=(0,l.$t)(r.radar,t);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),O={parser:b,db:v,renderer:{draw:C},styles:(0,s.K2)(({radar:t}={})=>{let{themeVariables:e,radarOptions:a}=D(t);return`
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
		dominant-baseline: middle;
		text-anchor: middle;
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
	${I(e,a)}
	`},"styles")}}}]);