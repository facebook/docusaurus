"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["99354"],{69852:function(t,e,a){function l(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}a.d(e,{S:()=>l}),(0,a(94442).K2)(l,"populateCommonDb")},2433:function(t,e,a){a.d(e,{diagram:()=>m});var l=a(69852),r=a(39509),o=a(4894),i=a(94442),c=a(27077),n={packet:[]},s=structuredClone(n),d=i.UI.packet,k=(0,i.K2)(()=>{let t=(0,r.$t)({...d,...(0,i.zj)().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),p=(0,i.K2)(()=>s.packet,"getPacket"),b={pushWord:(0,i.K2)(t=>{t.length>0&&s.packet.push(t)},"pushWord"),getPacket:p,getConfig:k,clear:(0,i.K2)(()=>{(0,i.IU)(),s=structuredClone(n)},"clear"),setAccTitle:i.SV,getAccTitle:i.iN,setDiagramTitle:i.ke,getDiagramTitle:i.ab,getAccDescription:i.m7,setAccDescription:i.EI},g=(0,i.K2)(t=>{(0,l.S)(t,b);let e=-1,a=[],r=1,{bitsPerRow:o}=b.getConfig();for(let{start:l,end:c,label:n}of t.blocks){if(c&&c<l)throw Error(`Packet block ${l} - ${c} is invalid. End must be greater than start.`);if(l!==e+1)throw Error(`Packet block ${l} - ${c??l} is not contiguous. It should start from ${e+1}.`);for(e=c??l,i.Rm.debug(`Packet block ${l} - ${e} with label ${n}`);a.length<=o+1&&b.getPacket().length<1e4;){let[t,e]=f({start:l,end:c,label:n},r,o);if(a.push(t),t.end+1===r*o&&(b.pushWord(a),a=[],r++),!e)break;({start:l,end:c,label:n}=e)}}b.pushWord(a)},"populate"),f=(0,i.K2)((t,e,a)=>{if(void 0===t.end&&(t.end=t.start),t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*a?[t,void 0]:[{start:t.start,end:e*a-1,label:t.label},{start:e*a,end:t.end,label:t.label}]},"getNextFittingBlock"),h={parse:(0,i.K2)(async t=>{let e=await (0,c.qg)("packet",t);i.Rm.debug(e),g(e)},"parse")},u=(0,i.K2)((t,e,a,l)=>{let r=l.db,c=r.getConfig(),{rowHeight:n,paddingY:s,bitWidth:d,bitsPerRow:k}=c,p=r.getPacket(),b=r.getDiagramTitle(),g=n+s,f=g*(p.length+1)-(b?0:n),h=d*k+2,u=(0,o.D)(e);for(let[t,e]of(u.attr("viewbox",`0 0 ${h} ${f}`),(0,i.a$)(u,f,h,c.useMaxWidth),p.entries()))$(u,e,t,c);u.append("text").text(b).attr("x",h/2).attr("y",f-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),$=(0,i.K2)((t,e,a,{rowHeight:l,paddingX:r,paddingY:o,bitWidth:i,bitsPerRow:c,showBits:n})=>{let s=t.append("g"),d=a*(l+o)+o;for(let t of e){let e=t.start%c*i+1,a=(t.end-t.start+1)*i-r;if(s.append("rect").attr("x",e).attr("y",d).attr("width",a).attr("height",l).attr("class","packetBlock"),s.append("text").attr("x",e+a/2).attr("y",d+l/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(t.label),!n)continue;let o=t.end===t.start,k=d-2;s.append("text").attr("x",e+(o?a/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",o?"middle":"start").text(t.start),o||s.append("text").attr("x",e+a).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(t.end)}},"drawWord"),x={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},m={parser:h,db:b,renderer:{draw:u},styles:(0,i.K2)(({packet:t}={})=>{let e=(0,r.$t)(x,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles")}}}]);