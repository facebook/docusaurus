"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["26030"],{78169(e,t,a){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{S:()=>i}),(0,a(2155).K2)(i,"populateCommonDb")},29021(e,t,a){a.d(t,{diagram:()=>k});var i=a(37772),l=a(78169),r=a(76284),s=a(3873),n=a(2155),o=a(5165),c=a(24842),p=s.UI.pie,d={sections:new Map,showData:!1,config:p},u=d.sections,g=d.showData,h=structuredClone(p),f=(0,n.K2)(()=>structuredClone(h),"getConfig"),m=(0,n.K2)(()=>{u=new Map,g=d.showData,(0,s.IU)()},"clear"),w=(0,n.K2)(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(e)||(u.set(e,t),n.Rm.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),x=(0,n.K2)(()=>u,"getSections"),S=(0,n.K2)(e=>{g=e},"setShowData"),$=(0,n.K2)(()=>g,"getShowData"),D={getConfig:f,clear:m,setDiagramTitle:s.ke,getDiagramTitle:s.ab,setAccTitle:s.SV,getAccTitle:s.iN,setAccDescription:s.EI,getAccDescription:s.m7,addSection:w,getSections:x,setShowData:S,getShowData:$},T=(0,n.K2)((e,t)=>{(0,l.S)(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),y={parse:(0,n.K2)(async e=>{let t=await (0,o.qg)("pie",e);n.Rm.debug(t),T(t,D)},"parse")},C=(0,n.K2)(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),b=(0,n.K2)(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),a=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return(0,c.rLf)().value(e=>e.value).sort(null)(a)},"createPieArcs"),k={parser:y,db:D,renderer:{draw:(0,n.K2)((e,t,a,l)=>{n.Rm.debug("rendering pie chart\n"+e);let o=l.db,p=(0,s.D7)(),d=(0,r.$t)(o.getConfig(),p.pie),u=(0,i.D)(t),g=u.append("g");g.attr("transform","translate(225,225)");let{themeVariables:h}=p,[f]=(0,r.I5)(h.pieOuterStrokeWidth);f??=2;let m=d.textPosition,w=(0,c.JLW)().innerRadius(0).outerRadius(185),x=(0,c.JLW)().innerRadius(185*m).outerRadius(185*m);g.append("circle").attr("cx",0).attr("cy",0).attr("r",185+f/2).attr("class","pieOuterCircle");let S=o.getSections(),$=b(S),D=[h.pie1,h.pie2,h.pie3,h.pie4,h.pie5,h.pie6,h.pie7,h.pie8,h.pie9,h.pie10,h.pie11,h.pie12],T=0;S.forEach(e=>{T+=e});let y=$.filter(e=>"0"!==(e.data.value/T*100).toFixed(0)),C=(0,c.UMr)(D).domain([...S.keys()]);g.selectAll("mySlices").data(y).enter().append("path").attr("d",w).attr("fill",e=>C(e.data.label)).attr("class","pieCircle"),g.selectAll("mySlices").data(y).enter().append("text").text(e=>(e.data.value/T*100).toFixed(0)+"%").attr("transform",e=>"translate("+x.centroid(e)+")").style("text-anchor","middle").attr("class","slice");let k=g.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText"),v=[...S.entries()].map(([e,t])=>({label:e,value:t})),A=g.selectAll(".legend").data(v).enter().append("g").attr("class","legend").attr("transform",(e,t)=>"translate(216,"+(22*t-22*v.length/2)+")");A.append("rect").attr("width",18).attr("height",18).style("fill",e=>C(e.label)).style("stroke",e=>C(e.label)),A.append("text").attr("x",22).attr("y",14).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);let K=Math.max(...A.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0)),R=k.node()?.getBoundingClientRect().width??0,M=Math.min(0,225-R/2),z=Math.max(512+K,225+R/2)-M;u.attr("viewBox",`${M} 0 ${z} 450`),(0,s.a$)(u,450,z,d.useMaxWidth)},"draw")},styles:C}}}]);