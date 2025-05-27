"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["63769"],{9022:function(e,t,a){function r(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{A:()=>r}),(0,a(23024).eW)(r,"populateCommonDb")},62398:function(e,t,a){a.d(t,{diagram:()=>D});var r=a(9022),i=a(96057),n=a(33714),l=a(23024),s=a(16750),o={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},c={axes:[],curves:[],options:o},d=structuredClone(c),g=l.vZ.radar,u=(0,l.eW)(()=>(0,i.Rb)({...g,...(0,l.iE)().radar}),"getConfig"),h=(0,l.eW)(()=>d.axes,"getAxes"),p=(0,l.eW)(()=>d.curves,"getCurves"),x=(0,l.eW)(()=>d.options,"getOptions"),m=(0,l.eW)(e=>{d.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},"setAxes"),$=(0,l.eW)(e=>{d.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:f(e.entries)}))},"setCurves"),f=(0,l.eW)(e=>{if(void 0==e[0].axis)return e.map(e=>e.value);let t=h();if(0===t.length)throw Error("Axes must be populated before curves for reference entries");return t.map(t=>{let a=e.find(e=>e.axis?.$refText===t.name);if(void 0===a)throw Error("Missing entry for axis "+t.label);return a.value})},"computeCurveEntries"),y={getAxes:h,getCurves:p,getOptions:x,setAxes:m,setCurves:$,setOptions:(0,l.eW)(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});d.options={showLegend:t.showLegend?.value??o.showLegend,ticks:t.ticks?.value??o.ticks,max:t.max?.value??o.max,min:t.min?.value??o.min,graticule:t.graticule?.value??o.graticule}},"setOptions"),getConfig:u,clear:(0,l.eW)(()=>{(0,l.ZH)(),d=structuredClone(c)},"clear"),setAccTitle:l.GN,getAccTitle:l.eu,setDiagramTitle:l.g2,getDiagramTitle:l.Kr,getAccDescription:l.Mx,setAccDescription:l.U$},v=(0,l.eW)(e=>{(0,r.A)(e,y);let{axes:t,curves:a,options:i}=e;y.setAxes(t),y.setCurves(a),y.setOptions(i)},"populate"),b={parse:(0,l.eW)(async e=>{let t=await (0,s.Qc)("radar",e);l.cM.debug(t),v(t)},"parse")},w=(0,l.eW)((e,t,a,r)=>{let i=r.db,l=i.getAxes(),s=i.getCurves(),o=i.getOptions(),c=i.getConfig(),d=i.getDiagramTitle(),g=M((0,n.P)(t),c),u=o.max??Math.max(...s.map(e=>Math.max(...e.entries))),h=o.min,p=Math.min(c.width,c.height)/2;W(g,l,p,o.ticks,o.graticule),C(g,l,p,c),L(g,l,s,h,u,o.graticule,c),A(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),M=(0,l.eW)((e,t)=>{let a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),W=(0,l.eW)((e,t,a,r,i)=>{if("circle"===i)for(let t=0;t<r;t++){let i=a*(t+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=t.length;for(let n=0;n<r;n++){let l=a*(n+1)/r,s=t.map((e,t)=>{let a=2*t*Math.PI/i-Math.PI/2,r=l*Math.cos(a),n=l*Math.sin(a);return`${r},${n}`}).join(" ");e.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),C=(0,l.eW)((e,t,a,r)=>{let i=t.length;for(let n=0;n<i;n++){let l=t[n].label,s=2*n*Math.PI/i-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),e.append("text").text(l).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function L(e,t,a,r,i,n,l){let s=t.length,o=Math.min(l.width,l.height)/2;a.forEach((t,a)=>{if(t.entries.length!==s)return;let c=t.entries.map((e,t)=>{let a=2*Math.PI*t/s-Math.PI/2,n=T(e,r,i,o);return{x:n*Math.cos(a),y:n*Math.sin(a)}});"circle"===n?e.append("path").attr("d",k(c,l.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===n&&e.append("polygon").attr("points",c.map(e=>`${e.x},${e.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function T(e,t,a,r){return r*(Math.min(Math.max(e,t),a)-t)/(a-t)}function k(e,t){let a=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<a;i++){let n=e[(i-1+a)%a],l=e[i],s=e[(i+1)%a],o=e[(i+2)%a],c={x:l.x+(s.x-n.x)*t,y:l.y+(s.y-n.y)*t},d={x:s.x-(o.x-l.x)*t,y:s.y-(o.y-l.y)*t};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function A(e,t,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,n=-(3*(r.height/2+r.marginTop))/4;t.forEach((t,a)=>{let r=e.append("g").attr("transform",`translate(${i}, ${n+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(t.label)})}(0,l.eW)(L,"drawCurves"),(0,l.eW)(T,"relativeRadius"),(0,l.eW)(k,"closedRoundCurve"),(0,l.eW)(A,"drawLegend");var O=(0,l.eW)((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return a},"genIndexStyles"),S=(0,l.eW)(e=>{let t=(0,l.xN)(),a=(0,l.iE)(),r=(0,i.Rb)(t,a.themeVariables),n=(0,i.Rb)(r.radar,e);return{themeVariables:r,radarOptions:n}},"buildRadarStyleOptions"),D={parser:b,db:y,renderer:{draw:w},styles:(0,l.eW)(({radar:e}={})=>{let{themeVariables:t,radarOptions:a}=S(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
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
	${O(t,a)}
	`},"styles")}}}]);