"use strict";(self.rspackChunkwebsite=self.rspackChunkwebsite||[]).push([[6925],{66656(t,e,a){var r=a(95745);function i(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}(0,a(36851).K2)(i,"populateCommonDb"),(0,r.K)(i,"populateCommonDb"),a.d(e,{S:()=>i})},19164(t,e,a){var r=a(66656),i=a(98857);a(80650);var n=a(12177);a(69990),a(89099),a(14125),a(42520),a(63753),a(68790),a(48026),a(30307),a(41135),a(27145),a(32075),a(39640),a(15594),a(72535),a(83290);var l=a(73113);a(9304);var s=a(87018),o=a(40586),c=a(95745),d=a(36851),g={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},u={axes:[],curves:[],options:g},p=structuredClone(u),x=s.UI.radar,h=(0,c.K)(()=>(0,l.$t)({...x,...(0,s.zj)().radar}),"getConfig"),m=(0,c.K)(()=>p.axes,"getAxes"),$=(0,c.K)(()=>p.curves,"getCurves"),f=(0,c.K)(()=>p.options,"getOptions"),v=(0,c.K)(t=>{p.axes=t.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),y=(0,c.K)(t=>{p.curves=t.map(t=>({name:t.name,label:t.label??t.name,entries:w(t.entries)}))},"setCurves"),w=(0,c.K)(t=>{if(void 0==t[0].axis)return t.map(t=>t.value);let e=m();if(0===e.length)throw Error("Axes must be populated before curves for reference entries");return e.map(e=>{let a=t.find(t=>t.axis?.$refText===e.name);if(void 0===a)throw Error("Missing entry for axis "+e.label);return a.value})},"computeCurveEntries"),C={getAxes:m,getCurves:$,getOptions:f,setAxes:v,setCurves:y,setOptions:(0,c.K)(t=>{let e=t.reduce((t,e)=>(t[e.name]=e,t),{});p.options={showLegend:e.showLegend?.value??g.showLegend,ticks:e.ticks?.value??g.ticks,max:e.max?.value??g.max,min:e.min?.value??g.min,graticule:e.graticule?.value??g.graticule},p.options.ticks>32&&(o.Rm.warn(`Radar diagram ticks (${p.options.ticks}) exceeds maximum allowed (32). Using 32 instead.`),p.options.ticks=32)},"setOptions"),getConfig:h,clear:(0,c.K)(()=>{(0,s.IU)(),p=structuredClone(u)},"clear"),setAccTitle:s.SV,getAccTitle:s.iN,setDiagramTitle:s.ke,getDiagramTitle:s.ab,getAccDescription:s.m7,setAccDescription:s.EI},K=(0,c.K)(t=>{(0,r.S)(t,C);let{axes:e,curves:a,options:i}=t;C.setAxes(e),C.setCurves(a),C.setOptions(i)},"populate"),b={parse:(0,c.K)(async t=>{let e=await (0,i.q)("radar",t);o.Rm.debug(e),K(e)},"parse")},k=(0,c.K)((t,e,a,r)=>{let i=r.db,l=i.getAxes(),s=i.getCurves(),o=i.getOptions(),c=i.getConfig(),d=i.getDiagramTitle(),g=M((0,n.D)(e),c),u=o.max??Math.max(...s.map(t=>Math.max(...t.entries))),p=o.min,x=Math.min(c.width,c.height)/2;L(g,l,x,o.ticks,o.graticule),T(g,l,x,c),A(g,l,s,p,u,o.graticule,c),I(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),M=(0,c.K)((t,e)=>{let a=e.width+e.marginLeft+e.marginRight,r=e.height+e.marginTop+e.marginBottom,i={x:e.marginLeft+e.width/2,y:e.marginTop+e.height/2};return(0,s.a$)(t,r,a,e.useMaxWidth??!0),t.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),t.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),L=(0,c.K)((t,e,a,r,i)=>{if("circle"===i)for(let e=0;e<r;e++){let i=a*(e+1)/r;t.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=e.length;for(let n=0;n<r;n++){let l=a*(n+1)/r,s=e.map((t,e)=>{let a=2*e*Math.PI/i-Math.PI/2,r=l*Math.cos(a),n=l*Math.sin(a);return`${r},${n}`}).join(" ");t.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),T=(0,c.K)((t,e,a,r)=>{let i=e.length;for(let n=0;n<i;n++){let l=e[n].label,s=2*n*Math.PI/i-Math.PI/2,o=Math.cos(s),c=Math.sin(s);t.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*c).attr("class","radarAxisLine");let d=o>.01?"start":o<-.01?"end":"middle",g=c>.01?"hanging":c<-.01?"auto":"central";t.append("text").text(l).attr("x",a*r.axisLabelFactor*o+4*o).attr("y",a*r.axisLabelFactor*c+4*c).attr("text-anchor",d).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function A(t,e,a,r,i,n,l){let s=e.length,o=Math.min(l.width,l.height)/2;a.forEach((e,a)=>{if(e.entries.length!==s)return;let c=e.entries.map((t,e)=>{let a=2*Math.PI*e/s-Math.PI/2,n=S(t,r,i,o);return{x:n*Math.cos(a),y:n*Math.sin(a)}});"circle"===n?t.append("path").attr("d",D(c,l.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===n&&t.append("polygon").attr("points",c.map(t=>`${t.x},${t.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function S(t,e,a,r){return r*(Math.min(Math.max(t,e),a)-e)/(a-e)}function D(t,e){let a=t.length,r=`M${t[0].x},${t[0].y}`;for(let i=0;i<a;i++){let n=t[(i-1+a)%a],l=t[i],s=t[(i+1)%a],o=t[(i+2)%a],c={x:l.x+(s.x-n.x)*e,y:l.y+(s.y-n.y)*e},d={x:s.x-(o.x-l.x)*e,y:s.y-(o.y-l.y)*e};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function I(t,e,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,n=-(3*(r.height/2+r.marginTop))/4;e.forEach((e,a)=>{let r=t.append("g").attr("transform",`translate(${i}, ${n+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(e.label)})}(0,d.K2)(A,"drawCurves"),(0,c.K)(A,"drawCurves"),(0,d.K2)(S,"relativeRadius"),(0,c.K)(S,"relativeRadius"),(0,d.K2)(D,"closedRoundCurve"),(0,c.K)(D,"closedRoundCurve"),(0,d.K2)(I,"drawLegend"),(0,c.K)(I,"drawLegend");var O=(0,c.K)((t,e)=>{let a="";for(let r=0;r<t.THEME_COLOR_LIMIT;r++){let i=t[`cScale${r}`];a+=`
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
		`}return a},"genIndexStyles"),R=(0,c.K)(t=>{let e=(0,s.gA)(),a=(0,s.zj)(),r=(0,l.$t)(e,a.themeVariables),i=(0,l.$t)(r.radar,t);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),z={parser:b,db:C,renderer:{draw:k},styles:(0,c.K)(({radar:t}={})=>{let{themeVariables:e,radarOptions:a}=R(t);return`
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
	${O(e,a)}
	`},"styles")};a.d(e,{diagram:()=>z})}}]);