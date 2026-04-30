"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["85186"],{78169(t,e,a){function r(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}a.d(e,{S:()=>r}),(0,a(2155).K2)(r,"populateCommonDb")},57593(t,e,a){a.d(e,{diagram:()=>u});var r=a(37772),i=a(78169),l=a(76284),o=a(3873),s=a(2155),c=a(5165),n=o.UI.packet,d=class{constructor(){this.packet=[],this.setAccTitle=o.SV,this.getAccTitle=o.iN,this.setDiagramTitle=o.ke,this.getDiagramTitle=o.ab,this.getAccDescription=o.m7,this.setAccDescription=o.EI}static{(0,s.K2)(this,"PacketDB")}getConfig(){let t=(0,l.$t)({...n,...(0,o.zj)().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){(0,o.IU)(),this.packet=[]}},k=(0,s.K2)((t,e)=>{(0,i.S)(t,e);let a=-1,r=[],l=1,{bitsPerRow:o}=e.getConfig();for(let{start:i,end:c,bits:n,label:d}of t.blocks){if(void 0!==i&&void 0!==c&&c<i)throw Error(`Packet block ${i} - ${c} is invalid. End must be greater than start.`);if((i??=a+1)!==a+1)throw Error(`Packet block ${i} - ${c??i} is not contiguous. It should start from ${a+1}.`);if(0===n)throw Error(`Packet block ${i} is invalid. Cannot have a zero bit field.`);for(c??=i+(n??1)-1,n??=c-i+1,a=c,s.Rm.debug(`Packet block ${i} - ${a} with label ${d}`);r.length<=o+1&&e.getPacket().length<1e4;){let[t,a]=p({start:i,end:c,bits:n,label:d},l,o);if(r.push(t),t.end+1===l*o&&(e.pushWord(r),r=[],l++),!a)break;({start:i,end:c,bits:n,label:d}=a)}}e.pushWord(r)},"populate"),p=(0,s.K2)((t,e,a)=>{if(void 0===t.start)throw Error("start should have been set during first phase");if(void 0===t.end)throw Error("end should have been set during first phase");if(t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*a)return[t,void 0];let r=e*a-1,i=e*a;return[{start:t.start,end:r,label:t.label,bits:r-t.start},{start:i,end:t.end,label:t.label,bits:t.end-i}]},"getNextFittingBlock"),h={parser:{yy:void 0},parse:(0,s.K2)(async t=>{let e=await (0,c.qg)("packet",t),a=h.parser?.yy;if(!(a instanceof d))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");s.Rm.debug(e),k(e,a)},"parse")},b=(0,s.K2)((t,e,a,i)=>{let l=i.db,s=l.getConfig(),{rowHeight:c,paddingY:n,bitWidth:d,bitsPerRow:k}=s,p=l.getPacket(),h=l.getDiagramTitle(),b=c+n,g=b*(p.length+1)-(h?0:c),u=d*k+2,m=(0,r.D)(e);for(let[t,e]of(m.attr("viewBox",`0 0 ${u} ${g}`),(0,o.a$)(m,g,u,s.useMaxWidth),p.entries()))f(m,e,t,s);m.append("text").text(h).attr("x",u/2).attr("y",g-b/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),f=(0,s.K2)((t,e,a,{rowHeight:r,paddingX:i,paddingY:l,bitWidth:o,bitsPerRow:s,showBits:c})=>{let n=t.append("g"),d=a*(r+l)+l;for(let t of e){let e=t.start%s*o+1,a=(t.end-t.start+1)*o-i;if(n.append("rect").attr("x",e).attr("y",d).attr("width",a).attr("height",r).attr("class","packetBlock"),n.append("text").attr("x",e+a/2).attr("y",d+r/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(t.label),!c)continue;let l=t.end===t.start,k=d-2;n.append("text").attr("x",e+(l?a/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",l?"middle":"start").text(t.start),l||n.append("text").attr("x",e+a).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(t.end)}},"drawWord"),g={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},u={parser:h,get db(){return new d},renderer:{draw:b},styles:(0,s.K2)(({packet:t}={})=>{let e=(0,l.$t)(g,t);return`
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