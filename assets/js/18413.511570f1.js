"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["18413"],{38468(e,t,a){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{S:()=>i}),(0,a(35474).K2)(i,"populateCommonDb")},47996(e,t,a){a.d(t,{diagram:()=>k});var i=a(38468),l=a(28365),r=a(57670),s=a(35474),n=a(5165),o=a(24842),c=s.UI.pie,p={sections:new Map,showData:!1,config:c},d=p.sections,g=p.showData,u=structuredClone(c),f=(0,s.K2)(()=>structuredClone(u),"getConfig"),h=(0,s.K2)(()=>{d=new Map,g=p.showData,(0,s.IU)()},"clear"),m=(0,s.K2)(({label:e,value:t})=>{d.has(e)||(d.set(e,t),s.Rm.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),x=(0,s.K2)(()=>d,"getSections"),w=(0,s.K2)(e=>{g=e},"setShowData"),S=(0,s.K2)(()=>g,"getShowData"),D={getConfig:f,clear:h,setDiagramTitle:s.ke,getDiagramTitle:s.ab,setAccTitle:s.SV,getAccTitle:s.iN,setAccDescription:s.EI,getAccDescription:s.m7,addSection:m,getSections:x,setShowData:w,getShowData:S},T=(0,s.K2)((e,t)=>{(0,i.S)(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),$={parse:(0,s.K2)(async e=>{let t=await (0,n.qg)("pie",e);s.Rm.debug(t),T(t,D)},"parse")},y=(0,s.K2)(e=>`
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
`,"getStyles"),C=(0,s.K2)(e=>{let t=[...e.entries()].map(e=>({label:e[0],value:e[1]})).sort((e,t)=>t.value-e.value);return(0,o.rLf)().value(e=>e.value)(t)},"createPieArcs"),k={parser:$,db:D,renderer:{draw:(0,s.K2)((e,t,a,i)=>{s.Rm.debug("rendering pie chart\n"+e);let n=i.db,c=(0,s.D7)(),p=(0,l.$t)(n.getConfig(),c.pie),d=(0,r.D)(t),g=d.append("g");g.attr("transform","translate(225,225)");let{themeVariables:u}=c,[f]=(0,l.I5)(u.pieOuterStrokeWidth);f??=2;let h=p.textPosition,m=(0,o.JLW)().innerRadius(0).outerRadius(185),x=(0,o.JLW)().innerRadius(185*h).outerRadius(185*h);g.append("circle").attr("cx",0).attr("cy",0).attr("r",185+f/2).attr("class","pieOuterCircle");let w=n.getSections(),S=C(w),D=[u.pie1,u.pie2,u.pie3,u.pie4,u.pie5,u.pie6,u.pie7,u.pie8,u.pie9,u.pie10,u.pie11,u.pie12],T=(0,o.UMr)(D);g.selectAll("mySlices").data(S).enter().append("path").attr("d",m).attr("fill",e=>T(e.data.label)).attr("class","pieCircle");let $=0;w.forEach(e=>{$+=e}),g.selectAll("mySlices").data(S).enter().append("text").text(e=>(e.data.value/$*100).toFixed(0)+"%").attr("transform",e=>"translate("+x.centroid(e)+")").style("text-anchor","middle").attr("class","slice"),g.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");let y=g.selectAll(".legend").data(T.domain()).enter().append("g").attr("class","legend").attr("transform",(e,t)=>"translate(216,"+(22*t-22*T.domain().length/2)+")");y.append("rect").attr("width",18).attr("height",18).style("fill",T).style("stroke",T),y.data(S).append("text").attr("x",22).attr("y",14).text(e=>{let{label:t,value:a}=e.data;return n.getShowData()?`${t} [${a}]`:t});let k=512+Math.max(...y.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0));d.attr("viewBox",`0 0 ${k} 450`),(0,s.a$)(d,450,k,p.useMaxWidth)},"draw")},styles:y}}}]);