"use strict";(self.rspackChunkwebsite=self.rspackChunkwebsite||[]).push([[39980],{66656(t,e,a){var n=a(95745);function r(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}(0,a(36851).K2)(r,"populateCommonDb"),(0,n.K)(r,"populateCommonDb"),a.d(e,{S:()=>r})},89927(t,e,a){var n=a(66656),r=a(98857);a(80650);var i=a(12177);a(69990),a(89099),a(14125),a(42520),a(63753),a(68790),a(48026),a(30307),a(41135),a(27145),a(32075),a(39640),a(15594),a(72535),a(83290);var o=a(73113);a(9304);var l=a(87018),c=a(40586),s=a(95745),d=a(36851),f=(0,s.K)(()=>({domains:new Map,transitions:[]}),"createDefaultData"),p=f(),m=(0,s.K)(()=>p.domains,"getDomains"),y={getDomains:m,getTransitions:(0,s.K)(()=>p.transitions,"getTransitions"),setDomains:(0,s.K)(t=>{if(t)for(let e of t){let t=e.domain,a=(e.items??[]).map(t=>({label:t.label}));p.domains.set(t,{name:t,items:a})}},"setDomains"),setTransitions:(0,s.K)(t=>{t&&(p.transitions=t.filter(t=>t.from!==t.to||(c.Rm.warn(`Cynefin: self-loop transition on domain "${t.from}" is not meaningful and will be skipped.`),!1)).map(t=>({from:t.from,to:t.to,label:t.label||void 0})))},"setTransitions"),getConfig:(0,s.K)(()=>(0,o.$t)({...l.UI.cynefin,...(0,l.zj)().cynefin}),"getConfig"),clear:(0,s.K)(()=>{(0,l.IU)(),p=f()},"clear"),setAccTitle:l.SV,getAccTitle:l.iN,setDiagramTitle:l.ke,getDiagramTitle:l.ab,getAccDescription:l.m7,setAccDescription:l.EI},x=(0,s.K)(t=>{(0,n.S)(t,y),y.setDomains(t.domains),y.setTransitions(t.transitions)},"populate"),h={parse:(0,s.K)(async t=>{let e=await (0,r.q)("cynefin",t);c.Rm.debug(e),x(e)},"parse")};function g(t){let e=t+0x6d2b79f5|0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}function $(t){let e=0;for(let a=0;a<t.length;a++)e=(e<<5)-e+t.charCodeAt(a)|0;return e}function u(t,e){return"number"==typeof t&&Number.isFinite(t)&&0!==t?t:$(e)}function b(t,e,a,n){let r=t/2,i=n??.015*t,o=e/7,l=[];for(let t=0;t<=7;t++){let e=g(a+17*t)*i*2-i;l.push({x:r+e,y:t*o})}let c=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.y+n.y)/2,o=1.5*i*(t%2==0?1:-1)*g(a+31*t+7),s=e.x+o,d=n.x-o;c+=` C${s},${r} ${d},${r} ${n.x},${n.y}`}return c}function w(t,e,a,n){let r=e/2,i=n??.015*e,o=t/7,l=[];for(let t=0;t<=7;t++){let e=g(a+23*t)*i*2-i;l.push({x:t*o,y:r+e})}let c=`M${l[0].x},${l[0].y}`;for(let t=0;t<l.length-1;t++){let e=l[t],n=l[t+1],r=(e.x+n.x)/2,o=1.5*i*(t%2==0?1:-1)*g(a+37*t+11),s=e.y+o,d=n.y-o;c+=` C${r},${s} ${r},${d} ${n.x},${n.y}`}return c}function C(t,e){let a=t/2,n=.5*e,r=.03*t;return`M${a},${n} C${a+r},${n+(e-n)*.2} ${a-1.5*r},${n+(e-n)*.55} ${a+.5*r},${n+(e-n)*.75} C${a-r},${n+(e-n)*.85} ${a+.3*r},${n+(e-n)*.95} ${a},${e}`}function k(t,e,a,n){return`M${t-a},${e} A${a},${n} 0 1,1 ${t+a},${e} A${a},${n} 0 1,1 ${t-a},${e} Z`}(0,d.K2)(g,"seededRandom"),(0,s.K)(g,"seededRandom"),(0,d.K2)($,"hashString"),(0,s.K)($,"hashString"),(0,d.K2)(u,"resolveSeed"),(0,s.K)(u,"resolveSeed"),(0,d.K2)(b,"generateFoldPath"),(0,s.K)(b,"generateFoldPath"),(0,d.K2)(w,"generateHorizontalBoundary"),(0,s.K)(w,"generateHorizontalBoundary"),(0,d.K2)(C,"generateCliffPath"),(0,s.K)(C,"generateCliffPath"),(0,d.K2)(k,"generateConfusionPath"),(0,s.K)(k,"generateConfusionPath");var D={complex:{model:"Probe \u2192 Sense \u2192 Respond",practice:"Emergent Practices"},complicated:{model:"Sense \u2192 Analyse \u2192 Respond",practice:"Good Practices"},clear:{model:"Sense \u2192 Categorise \u2192 Respond",practice:"Best Practices"},chaotic:{model:"Act \u2192 Sense \u2192 Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},K=(0,s.K)((t,e)=>{let a=t/2,n=e/2;return{complex:{cx:a/2,cy:n/2,x:0,y:0,w:a,h:n},complicated:{cx:a+a/2,cy:n/2,x:a,y:0,w:a,h:n},chaotic:{cx:a/2,cy:n+n/2,x:0,y:n,w:a,h:n},clear:{cx:a+a/2,cy:n+n/2,x:a,y:n,w:a,h:n},confusion:{cx:a,cy:n,x:.7*a,y:.7*n,w:.6*a,h:.6*n}}},"getDomainLayouts"),A=(0,s.K)(()=>{let t=(0,l.gA)(),e=(0,l.zj)();return(0,o.$t)(t,e.themeVariables).cynefin},"getCynefinDomainColors"),T=(0,s.K)((t,e,a,n)=>{let r=n.db,o=r.getDomains(),s=r.getTransitions(),d=r.getDiagramTitle(),f=r.getAccTitle(),p=r.getAccDescription(),m=r.getConfig(),y=A();c.Rm.debug("Rendering Cynefin diagram");let x=m.width,h=m.height,g=m.padding,$=m.showDomainDescriptions,T=m.boundaryAmplitude,B=x+2*g,S=h+2*g,v={complex:y.complexBg,complicated:y.complicatedBg,clear:y.clearBg,chaotic:y.chaoticBg,confusion:y.confusionBg},z=(0,i.D)(e);(0,l.a$)(z,S,B,m.useMaxWidth??!0),z.attr("viewBox",`0 0 ${B} ${S}`),f&&z.append("title").text(f),p&&z.append("desc").text(p);let M=z.append("g").attr("transform",`translate(${g}, ${g})`),P=K(x,h),R=u(m.seed,e),I=M.append("g").attr("class","cynefin-backgrounds"),L=["complex","complicated","chaotic","clear"];for(let t of L){let e=P[t];I.append("rect").attr("class","cynefinDomain").attr("x",e.x).attr("y",e.y).attr("width",e.w).attr("height",e.h).attr("fill",v[t]).attr("fill-opacity",.4).attr("stroke","none")}let F=M.append("g").attr("class","cynefin-boundaries");F.append("path").attr("class","cynefinBoundary").attr("d",b(x,h,R,T)).attr("fill","none"),F.append("path").attr("class","cynefinBoundary").attr("d",w(x,h,R+100,T)).attr("fill","none"),F.append("path").attr("class","cynefinCliff").attr("d",C(x,h)).attr("fill","none");let H=.15*x,W=.15*h;M.append("path").attr("class","cynefinConfusion").attr("d",k(x/2,h/2,H,W)).attr("fill",v.confusion).attr("fill-opacity",.5);let E=M.append("g").attr("class","cynefin-labels");for(let t of L){let e=P[t];E.append("text").attr("class","cynefinDomainLabel").attr("x",e.cx).attr("y",$?e.cy-30:e.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(t.charAt(0).toUpperCase()+t.slice(1))}if(E.append("text").attr("class","cynefinDomainLabel").attr("x",x/2).attr("y",$?h/2-10:h/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),$){let t=M.append("g").attr("class","cynefin-subtitles");for(let e of L){let a=P[e],n=D[e];t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.model),t.append("text").attr("class","cynefinSubtitle").attr("x",a.cx).attr("y",a.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(n.practice)}t.append("text").attr("class","cynefinSubtitle").attr("x",x/2).attr("y",h/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(D.confusion.practice)}let j=M.append("g").attr("class","cynefin-items");for(let t of["complex","complicated","chaotic","clear","confusion"]){let e,a=o.get(t);if(!a||0===a.items.length)continue;let n=P[t],r="confusion"===t,i=a.items,l=0;if(r&&a.items.length>3&&(l=a.items.length-3,i=a.items.slice(0,3)),r){let t=$?22:14;e=n.cy+t}else e=n.cy+($?25:15);if([...i].forEach((a,r)=>{let i=e+30*r,o=j.append("g"),l=o.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(a.label),c=7*a.label.length,s=l.node();if(s&&"function"==typeof s.getBBox){let t=s.getBBox();t.width>0&&(c=t.width)}let d=c+20,f=n.cx-d/2;o.attr("transform",`translate(${f}, ${i})`),o.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",d).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",v[t]).attr("fill-opacity",.95),l.attr("x",d/2).attr("y",13)}),l>0){let a=e+30*i.length,r=`+${l} more`,o=j.append("g"),c=o.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",13).attr("text-anchor","middle").attr("dominant-baseline","central").text(r),s=7*r.length,d=c.node();if(d&&"function"==typeof d.getBBox){let t=d.getBBox();t.width>0&&(s=t.width)}let f=s+20,p=n.cx-f/2;o.attr("transform",`translate(${p}, ${a})`),o.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",f).attr("height",26).attr("rx",4).attr("ry",4).attr("fill",v[t]).attr("fill-opacity",.6),c.attr("x",f/2).attr("y",13)}}if(s.length>0){let t=z.select("defs").empty()?z.append("defs"):z.select("defs"),a=`cynefin-arrow-${e}`;t.append("marker").attr("id",a).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let n=M.append("g").attr("class","cynefin-arrows");s.forEach(t=>{let e=P[t.from],r=P[t.to];if(!e||!r)return;if(t.from===t.to)return void c.Rm.warn(`Cynefin renderer: skipping self-loop on domain "${t.from}"`);let i=e.cx,o=e.cy,l=r.cx,s=r.cy,d=l-i,f=s-o,p=Math.sqrt(d*d+f*f),m=.15*p,y=(i+l)/2+-f/p*m,x=(o+s)/2+d/p*m;n.append("path").attr("class","cynefinArrowLine").attr("d",`M${i},${o} Q${y},${x} ${l},${s}`).attr("fill","none").attr("marker-end",`url(#${a})`),t.label&&n.append("text").attr("class","cynefinArrowLabel").attr("x",y).attr("y",x-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(t.label)})}d&&M.append("text").attr("class","cynefinTitle").attr("x",x/2).attr("y",-g/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d)},"draw"),B=(0,s.K)(()=>{let t=(0,l.gA)(),e=(0,l.zj)();return(0,o.$t)(t,e.themeVariables).cynefin},"getCynefinTheme"),S={parser:h,db:y,renderer:{draw:T},styles:(0,s.K)(()=>{let t=B();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`},"styles")};a.d(e,{diagram:()=>S})}}]);