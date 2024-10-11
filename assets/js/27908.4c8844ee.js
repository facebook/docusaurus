"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["27908"],{20849:function(e,t,i){function a(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}i.d(t,{A:function(){return a}}),(0,i(28923).eW)(a,"populateCommonDb")},15573:function(e,t,i){i.d(t,{diagram:function(){return b}});var a=i(20849),l=i(84890),r=i(70466),n=i(28923),s=i(16750),c=i(11141),o=n.vZ.pie,p={sections:new Map,showData:!1,config:o},d=p.sections,u=p.showData,g=structuredClone(o),f=(0,n.eW)(()=>structuredClone(g),"getConfig"),h=(0,n.eW)(()=>{d=new Map,u=p.showData,(0,n.ZH)()},"clear"),x=(0,n.eW)(({label:e,value:t})=>{!d.has(e)&&(d.set(e,t),n.cM.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),m=(0,n.eW)(()=>d,"getSections"),w=(0,n.eW)(e=>{u=e},"setShowData"),S=(0,n.eW)(()=>u,"getShowData"),T={getConfig:f,clear:h,setDiagramTitle:n.g2,getDiagramTitle:n.Kr,setAccTitle:n.GN,getAccTitle:n.eu,setAccDescription:n.U$,getAccDescription:n.Mx,addSection:x,getSections:m,setShowData:w,getShowData:S},$=(0,n.eW)((e,t)=>{(0,a.A)(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),y={parse:(0,n.eW)(async e=>{let t=await (0,s.Qc)("pie",e);n.cM.debug(t),$(t,T)},"parse")},D=(0,n.eW)(e=>`
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
`,"getStyles"),C=(0,n.eW)(e=>{let t=[...e.entries()].map(e=>({label:e[0],value:e[1]})).sort((e,t)=>t.value-e.value);return(0,c.ve8)().value(e=>e.value)(t)},"createPieArcs"),W=(0,n.eW)((e,t,i,a)=>{n.cM.debug("rendering pie chart\n"+e);let s=a.db,o=(0,n.nV)(),p=(0,l.Rb)(s.getConfig(),o.pie),d=(0,r.P)(t),u=d.append("g");u.attr("transform","translate(225,225)");let{themeVariables:g}=o,[f]=(0,l.VG)(g.pieOuterStrokeWidth);f??=2;let h=p.textPosition,x=185,m=(0,c.Nb1)().innerRadius(0).outerRadius(x),w=(0,c.Nb1)().innerRadius(x*h).outerRadius(x*h);u.append("circle").attr("cx",0).attr("cy",0).attr("r",x+f/2).attr("class","pieOuterCircle");let S=s.getSections(),T=C(S),$=[g.pie1,g.pie2,g.pie3,g.pie4,g.pie5,g.pie6,g.pie7,g.pie8,g.pie9,g.pie10,g.pie11,g.pie12],y=(0,c.PKp)($);u.selectAll("mySlices").data(T).enter().append("path").attr("d",m).attr("fill",e=>y(e.data.label)).attr("class","pieCircle");let D=0;S.forEach(e=>{D+=e}),u.selectAll("mySlices").data(T).enter().append("text").text(e=>(e.data.value/D*100).toFixed(0)+"%").attr("transform",e=>"translate("+w.centroid(e)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");let W=u.selectAll(".legend").data(y.domain()).enter().append("g").attr("class","legend").attr("transform",(e,t)=>{let i=22,a=22*y.domain().length/2;return"translate(216,"+(t*i-a)+")"});W.append("rect").attr("width",18).attr("height",18).style("fill",y).style("stroke",y),W.data(T).append("text").attr("x",22).attr("y",14).text(e=>{let{label:t,value:i}=e.data;return s.getShowData()?`${t} [${i}]`:t});let b=512+Math.max(...W.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0));d.attr("viewBox",`0 0 ${b} 450`),(0,n.v2)(d,450,b,p.useMaxWidth)},"draw"),b={parser:y,db:T,renderer:{draw:W},styles:D}}}]);