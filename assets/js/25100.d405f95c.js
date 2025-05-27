"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["25100"],{37394:function(t,e,i){i.d(e,{AD:()=>u,AE:()=>o,Mu:()=>s,O:()=>a,kc:()=>h,rB:()=>c,yU:()=>l});var r=i(23024),n=i(7608),s=(0,r.eW)((t,e)=>{let i=t.append("rect");if(i.attr("x",e.x),i.attr("y",e.y),i.attr("fill",e.fill),i.attr("stroke",e.stroke),i.attr("width",e.width),i.attr("height",e.height),e.name&&i.attr("name",e.name),e.rx&&i.attr("rx",e.rx),e.ry&&i.attr("ry",e.ry),void 0!==e.attrs)for(let t in e.attrs)i.attr(t,e.attrs[t]);return e.class&&i.attr("class",e.class),i},"drawRect"),a=(0,r.eW)((t,e)=>{s(t,{x:e.startx,y:e.starty,width:e.stopx-e.startx,height:e.stopy-e.starty,fill:e.fill,stroke:e.stroke,class:"rect"}).lower()},"drawBackgroundRect"),l=(0,r.eW)((t,e)=>{let i=e.text.replace(r.Vw," "),n=t.append("text");n.attr("x",e.x),n.attr("y",e.y),n.attr("class","legend"),n.style("text-anchor",e.anchor),e.class&&n.attr("class",e.class);let s=n.append("tspan");return s.attr("x",e.x+2*e.textMargin),s.text(i),n},"drawText"),o=(0,r.eW)((t,e,i,r)=>{let s=t.append("image");s.attr("x",e),s.attr("y",i);let a=(0,n.sanitizeUrl)(r);s.attr("xlink:href",a)},"drawImage"),c=(0,r.eW)((t,e,i,r)=>{let s=t.append("use");s.attr("x",e),s.attr("y",i);let a=(0,n.sanitizeUrl)(r);s.attr("xlink:href",`#${a}`)},"drawEmbeddedImage"),h=(0,r.eW)(()=>({x:0,y:0,width:100,height:100,fill:"#EDF2AE",stroke:"#666",anchor:"start",rx:0,ry:0}),"getNoteRect"),u=(0,r.eW)(()=>({x:0,y:0,width:100,height:100,"text-anchor":"start",style:"#666",textMargin:0,rx:0,ry:0,tspan:!0}),"getTextObj")},25169:function(t,e,i){i.d(e,{diagram:()=>R});var r=i(37394),n=i(23024),s=i(17736),a=function(){var t=(0,n.eW)(function(t,e,i,r){for(i=i||{},r=t.length;r--;i[t[r]]=e);return i},"o"),e=[6,8,10,11,12,14,16,17,18],i=[1,9],r=[1,10],s=[1,11],a=[1,12],l=[1,13],o=[1,14],c={trace:(0,n.eW)(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:(0,n.eW)(function(t,e,i,r,n,s,a){var l=s.length-1;switch(n){case 1:return s[l-1];case 2:case 6:case 7:this.$=[];break;case 3:s[l-1].push(s[l]),this.$=s[l-1];break;case 4:case 5:this.$=s[l];break;case 8:r.setDiagramTitle(s[l].substr(6)),this.$=s[l].substr(6);break;case 9:this.$=s[l].trim(),r.setAccTitle(this.$);break;case 10:case 11:this.$=s[l].trim(),r.setAccDescription(this.$);break;case 12:r.addSection(s[l].substr(8)),this.$=s[l].substr(8);break;case 13:r.addTask(s[l-1],s[l]),this.$="task"}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:i,12:r,14:s,16:a,17:l,18:o},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:15,11:i,12:r,14:s,16:a,17:l,18:o},t(e,[2,5]),t(e,[2,6]),t(e,[2,8]),{13:[1,16]},{15:[1,17]},t(e,[2,11]),t(e,[2,12]),{19:[1,18]},t(e,[2,4]),t(e,[2,9]),t(e,[2,10]),t(e,[2,13])],defaultActions:{},parseError:(0,n.eW)(function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},"parseError"),parse:(0,n.eW)(function(t){var e=this,i=[0],r=[],s=[null],a=[],l=this.table,o="",c=0,h=0,u=0,y=a.slice.call(arguments,1),p=Object.create(this.lexer),d={yy:{}};for(var f in this.yy)Object.prototype.hasOwnProperty.call(this.yy,f)&&(d.yy[f]=this.yy[f]);p.setInput(t,d.yy),d.yy.lexer=p,d.yy.parser=this,void 0===p.yylloc&&(p.yylloc={});var g=p.yylloc;a.push(g);var x=p.options&&p.options.ranges;function m(){var t;return"number"!=typeof(t=r.pop()||p.lex()||1)&&(t instanceof Array&&(t=(r=t).pop()),t=e.symbols_[t]||t),t}"function"==typeof d.yy.parseError?this.parseError=d.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError,(0,n.eW)(function(t){i.length=i.length-2*t,s.length=s.length-t,a.length=a.length-t},"popStack"),(0,n.eW)(m,"lex");for(var k,_,b,W,w,v,$,M,T,S={};;){if(b=i[i.length-1],this.defaultActions[b]?W=this.defaultActions[b]:(null==k&&(k=m()),W=l[b]&&l[b][k]),void 0===W||!W.length||!W[0]){var E="";for(v in T=[],l[b])this.terminals_[v]&&v>2&&T.push("'"+this.terminals_[v]+"'");E=p.showPosition?"Parse error on line "+(c+1)+":\n"+p.showPosition()+"\nExpecting "+T.join(", ")+", got '"+(this.terminals_[k]||k)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==k?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError(E,{text:p.match,token:this.terminals_[k]||k,line:p.yylineno,loc:g,expected:T})}if(W[0]instanceof Array&&W.length>1)throw Error("Parse Error: multiple actions possible at state: "+b+", token: "+k);switch(W[0]){case 1:i.push(k),s.push(p.yytext),a.push(p.yylloc),i.push(W[1]),k=null,_?(k=_,_=null):(h=p.yyleng,o=p.yytext,c=p.yylineno,g=p.yylloc,u>0&&u--);break;case 2:if($=this.productions_[W[1]][1],S.$=s[s.length-$],S._$={first_line:a[a.length-($||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-($||1)].first_column,last_column:a[a.length-1].last_column},x&&(S._$.range=[a[a.length-($||1)].range[0],a[a.length-1].range[1]]),void 0!==(w=this.performAction.apply(S,[o,h,c,d.yy,W[1],s,a].concat(y))))return w;$&&(i=i.slice(0,-1*$*2),s=s.slice(0,-1*$),a=a.slice(0,-1*$)),i.push(this.productions_[W[1]][0]),s.push(S.$),a.push(S._$),M=l[i[i.length-2]][i[i.length-1]],i.push(M);break;case 3:return!0}}return!0},"parse")};function h(){this.yy={}}return c.lexer={EOF:1,parseError:(0,n.eW)(function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},"parseError"),setInput:(0,n.eW)(function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:(0,n.eW)(function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},"input"),unput:(0,n.eW)(function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var n=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===r.length?this.yylloc.first_column:0)+r[r.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[n[0],n[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},"unput"),more:(0,n.eW)(function(){return this._more=!0,this},"more"),reject:(0,n.eW)(function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"reject"),less:(0,n.eW)(function(t){this.unput(this.match.slice(t))},"less"),pastInput:(0,n.eW)(function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:(0,n.eW)(function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:(0,n.eW)(function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},"showPosition"),test_match:(0,n.eW)(function(t,e){var i,r,n;if(this.options.backtrack_lexer&&(n={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(n.yylloc.range=this.yylloc.range.slice(0))),(r=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var s in n)this[s]=n[s];return!1},"test_match"),next:(0,n.eW)(function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,r,n=this._currentRules(),s=0;s<n.length;s++)if((i=this._input.match(this.rules[n[s]]))&&(!e||i[0].length>e[0].length)){if(e=i,r=s,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,n[s])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,n[r]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:(0,n.eW)(function(){var t=this.next();return t||this.lex()},"lex"),begin:(0,n.eW)(function(t){this.conditionStack.push(t)},"begin"),popState:(0,n.eW)(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:(0,n.eW)(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:(0,n.eW)(function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},"topState"),pushState:(0,n.eW)(function(t){this.begin(t)},"pushState"),stateStackSize:(0,n.eW)(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,n.eW)(function(t,e,i,r){switch(i){case 0:case 1:case 3:case 4:break;case 2:return 10;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;case 8:return this.popState(),"acc_title_value";case 9:return this.begin("acc_descr"),14;case 10:return this.popState(),"acc_descr_value";case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}},(0,n.eW)(h,"Parser"),h.prototype=c,c.Parser=h,new h}();a.parser=a;var l="",o=[],c=[],h=[],u=(0,n.eW)(function(){o.length=0,c.length=0,l="",h.length=0,(0,n.ZH)()},"clear"),y=(0,n.eW)(function(t){l=t,o.push(t)},"addSection"),p=(0,n.eW)(function(){return o},"getSections"),d=(0,n.eW)(function(){let t=m(),e=0;for(;!t&&e<100;)t=m(),e++;return c.push(...h),c},"getTasks"),f=(0,n.eW)(function(){let t=[];return c.forEach(e=>{e.people&&t.push(...e.people)}),[...new Set(t)].sort()},"updateActors"),g=(0,n.eW)(function(t,e){let i=e.substr(1).split(":"),r=0,n=[];1===i.length?(r=Number(i[0]),n=[]):(r=Number(i[0]),n=i[1].split(","));let s=n.map(t=>t.trim()),a={section:l,type:l,people:s,task:t,score:r};h.push(a)},"addTask"),x=(0,n.eW)(function(t){let e={section:l,type:l,description:t,task:t,classes:[]};c.push(e)},"addTaskOrg"),m=(0,n.eW)(function(){let t=(0,n.eW)(function(t){return h[t].processed},"compileTask"),e=!0;for(let[i,r]of h.entries())t(i),e=e&&r.processed;return e},"compileTasks"),k=(0,n.eW)(function(){return f()},"getActors"),_={getConfig:(0,n.eW)(()=>(0,n.nV)().journey,"getConfig"),clear:u,setDiagramTitle:n.g2,getDiagramTitle:n.Kr,setAccTitle:n.GN,getAccTitle:n.eu,setAccDescription:n.U$,getAccDescription:n.Mx,addSection:y,getSections:p,getTasks:d,addTask:g,addTaskOrg:x,getActors:k},b=(0,n.eW)(t=>`.label {
    font-family: ${t.fontFamily};
    color: ${t.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${t.textColor}
  }

  .legend {
    fill: ${t.textColor};
    font-family: ${t.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${t.textColor}
  }

  .face {
    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${t.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${t.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${t.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${t.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${t.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${t.fontFamily};
    font-size: 12px;
    background: ${t.tertiaryColor};
    border: 1px solid ${t.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${t.fillType0?`fill: ${t.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${t.fillType0?`fill: ${t.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${t.fillType0?`fill: ${t.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${t.fillType0?`fill: ${t.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${t.fillType0?`fill: ${t.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${t.fillType0?`fill: ${t.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${t.fillType0?`fill: ${t.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${t.fillType0?`fill: ${t.fillType7}`:""};
  }

  .actor-0 {
    ${t.actor0?`fill: ${t.actor0}`:""};
  }
  .actor-1 {
    ${t.actor1?`fill: ${t.actor1}`:""};
  }
  .actor-2 {
    ${t.actor2?`fill: ${t.actor2}`:""};
  }
  .actor-3 {
    ${t.actor3?`fill: ${t.actor3}`:""};
  }
  .actor-4 {
    ${t.actor4?`fill: ${t.actor4}`:""};
  }
  .actor-5 {
    ${t.actor5?`fill: ${t.actor5}`:""};
  }
`,"getStyles"),W=(0,n.eW)(function(t,e){return(0,r.Mu)(t,e)},"drawRect"),w=(0,n.eW)(function(t,e){let i=t.append("circle").attr("cx",e.cx).attr("cy",e.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),r=t.append("g");function a(t){let i=(0,s.Nb1)().startAngle(Math.PI/2).endAngle(Math.PI/2*3).innerRadius(7.5).outerRadius(15/2.2);t.append("path").attr("class","mouth").attr("d",i).attr("transform","translate("+e.cx+","+(e.cy+2)+")")}function l(t){let i=(0,s.Nb1)().startAngle(3*Math.PI/2).endAngle(Math.PI/2*5).innerRadius(7.5).outerRadius(15/2.2);t.append("path").attr("class","mouth").attr("d",i).attr("transform","translate("+e.cx+","+(e.cy+7)+")")}function o(t){t.append("line").attr("class","mouth").attr("stroke",2).attr("x1",e.cx-5).attr("y1",e.cy+7).attr("x2",e.cx+5).attr("y2",e.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return r.append("circle").attr("cx",e.cx-5).attr("cy",e.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),r.append("circle").attr("cx",e.cx+5).attr("cy",e.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),(0,n.eW)(a,"smile"),(0,n.eW)(l,"sad"),(0,n.eW)(o,"ambivalent"),e.score>3?a(r):e.score<3?l(r):o(r),i},"drawFace"),v=(0,n.eW)(function(t,e){let i=t.append("circle");return i.attr("cx",e.cx),i.attr("cy",e.cy),i.attr("class","actor-"+e.pos),i.attr("fill",e.fill),i.attr("stroke",e.stroke),i.attr("r",e.r),void 0!==i.class&&i.attr("class",i.class),void 0!==e.title&&i.append("title").text(e.title),i},"drawCircle"),$=(0,n.eW)(function(t,e){return(0,r.yU)(t,e)},"drawText"),M=(0,n.eW)(function(t,e,i){let n=t.append("g"),s=(0,r.kc)();s.x=e.x,s.y=e.y,s.fill=e.fill,s.width=i.width*e.taskCount+i.diagramMarginX*(e.taskCount-1),s.height=i.height,s.class="journey-section section-type-"+e.num,s.rx=3,s.ry=3,W(n,s),E(i)(e.text,n,s.x,s.y,s.width,s.height,{class:"journey-section section-type-"+e.num},i,e.colour)},"drawSection"),T=-1,S=(0,n.eW)(function(t,e,i){let n=e.x+i.width/2,s=t.append("g");T++,s.append("line").attr("id","task"+T).attr("x1",n).attr("y1",e.y).attr("x2",n).attr("y2",450).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),w(s,{cx:n,cy:300+(5-e.score)*30,score:e.score});let a=(0,r.kc)();a.x=e.x,a.y=e.y,a.fill=e.fill,a.width=i.width,a.height=i.height,a.class="task task-type-"+e.num,a.rx=3,a.ry=3,W(s,a);let l=e.x+14;e.people.forEach(t=>{let i=e.actors[t].color;v(s,{cx:l,cy:e.y,r:7,fill:i,stroke:"#000",title:t,pos:e.actors[t].position}),l+=10}),E(i)(e.task,s,a.x,a.y,a.width,a.height,{class:"task"},i,e.colour)},"drawTask"),E=function(){function t(t,e,i,n,s,a,l,o){r(e.append("text").attr("x",i+s/2).attr("y",n+a/2+5).style("font-color",o).style("text-anchor","middle").text(t),l)}function e(t,e,i,n,s,a,l,o,c){let{taskFontSize:h,taskFontFamily:u}=o,y=t.split(/<br\s*\/?>/gi);for(let t=0;t<y.length;t++){let o=t*h-h*(y.length-1)/2,p=e.append("text").attr("x",i+s/2).attr("y",n).attr("fill",c).style("text-anchor","middle").style("font-size",h).style("font-family",u);p.append("tspan").attr("x",i+s/2).attr("dy",o).text(y[t]),p.attr("y",n+a/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),r(p,l)}}function i(t,i,n,s,a,l,o,c){let h=i.append("switch"),u=h.append("foreignObject").attr("x",n).attr("y",s).attr("width",a).attr("height",l).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");u.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(t),e(t,h,n,s,a,l,o,c),r(u,o)}function r(t,e){for(let i in e)i in e&&t.attr(i,e[i])}return(0,n.eW)(t,"byText"),(0,n.eW)(e,"byTspan"),(0,n.eW)(i,"byFo"),(0,n.eW)(r,"_setTextAttrs"),function(r){return"fo"===r.textPlacement?i:"old"===r.textPlacement?t:e}}(),A={drawCircle:v,drawSection:M,drawText:$,drawTask:S,initGraphics:(0,n.eW)(function(t){t.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics")},I=(0,n.eW)(function(t){Object.keys(t).forEach(function(e){V[e]=t[e]})},"setConf"),P={};function C(t){let e=(0,n.nV)().journey,i=60;Object.keys(P).forEach(r=>{let n=P[r].color,s={cx:20,cy:i,r:7,fill:n,stroke:"#000",pos:P[r].position};A.drawCircle(t,s);let a={x:40,y:i+7,fill:"#666",text:r,textMargin:5|e.boxTextMargin};A.drawText(t,a),i+=20})}(0,n.eW)(C,"drawActorLegend");var V=(0,n.nV)().journey,j=V.leftMargin,N=(0,n.eW)(function(t,e,i,r){let a,l=(0,n.nV)().journey,o=(0,n.nV)().securityLevel;"sandbox"===o&&(a=(0,s.Ys)("#i"+e));let c="sandbox"===o?(0,s.Ys)(a.nodes()[0].contentDocument.body):(0,s.Ys)("body");O.init();let h=c.select("#"+e);A.initGraphics(h);let u=r.db.getTasks(),y=r.db.getDiagramTitle(),p=r.db.getActors();for(let t in P)delete P[t];let d=0;p.forEach(t=>{P[t]={color:l.actorColours[d%l.actorColours.length],position:d},d++}),C(h),O.insert(0,0,j,50*Object.keys(P).length),L(h,u,0);let f=O.getBounds();y&&h.append("text").text(y).attr("x",j).attr("font-size","4ex").attr("font-weight","bold").attr("y",25);let g=f.stopy-f.starty+2*l.diagramMarginY,x=j+f.stopx+2*l.diagramMarginX;(0,n.v2)(h,g,x,l.useMaxWidth),h.append("line").attr("x1",j).attr("y1",4*l.height).attr("x2",x-j-4).attr("y2",4*l.height).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)");let m=70*!!y;h.attr("viewBox",`${f.startx} -25 ${x} ${g+m}`),h.attr("preserveAspectRatio","xMinYMin meet"),h.attr("height",g+m+25)},"draw"),O={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:(0,n.eW)(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},"init"),updateVal:(0,n.eW)(function(t,e,i,r){void 0===t[e]?t[e]=i:t[e]=r(i,t[e])},"updateVal"),updateBounds:(0,n.eW)(function(t,e,i,r){let s=(0,n.nV)().journey,a=this,l=0;function o(o){return(0,n.eW)(function(n){l++;let c=a.sequenceItems.length-l+1;a.updateVal(n,"starty",e-c*s.boxMargin,Math.min),a.updateVal(n,"stopy",r+c*s.boxMargin,Math.max),a.updateVal(O.data,"startx",t-c*s.boxMargin,Math.min),a.updateVal(O.data,"stopx",i+c*s.boxMargin,Math.max),"activation"!==o&&(a.updateVal(n,"startx",t-c*s.boxMargin,Math.min),a.updateVal(n,"stopx",i+c*s.boxMargin,Math.max),a.updateVal(O.data,"starty",e-c*s.boxMargin,Math.min),a.updateVal(O.data,"stopy",r+c*s.boxMargin,Math.max))},"updateItemBounds")}(0,n.eW)(o,"updateFn"),this.sequenceItems.forEach(o())},"updateBounds"),insert:(0,n.eW)(function(t,e,i,r){let n=Math.min(t,i),s=Math.max(t,i),a=Math.min(e,r),l=Math.max(e,r);this.updateVal(O.data,"startx",n,Math.min),this.updateVal(O.data,"starty",a,Math.min),this.updateVal(O.data,"stopx",s,Math.max),this.updateVal(O.data,"stopy",l,Math.max),this.updateBounds(n,a,s,l)},"insert"),bumpVerticalPos:(0,n.eW)(function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos},"bumpVerticalPos"),getVerticalPos:(0,n.eW)(function(){return this.verticalPos},"getVerticalPos"),getBounds:(0,n.eW)(function(){return this.data},"getBounds")},D=V.sectionFills,F=V.sectionColours,L=(0,n.eW)(function(t,e,i){let r=(0,n.nV)().journey,s="",a=i+(2*r.height+r.diagramMarginY),l=0,o="#CCC",c="black",h=0;for(let[i,n]of e.entries()){if(s!==n.section){o=D[l%D.length],h=l%D.length,c=F[l%F.length];let a=0,u=n.section;for(let t=i;t<e.length;t++)if(e[t].section==u)a+=1;else break;let y={x:i*r.taskMargin+i*r.width+j,y:50,text:n.section,fill:o,num:h,colour:c,taskCount:a};A.drawSection(t,y,r),s=n.section,l++}let u=n.people.reduce((t,e)=>(P[e]&&(t[e]=P[e]),t),{});n.x=i*r.taskMargin+i*r.width+j,n.y=a,n.width=r.diagramMarginX,n.height=r.diagramMarginY,n.colour=c,n.fill=o,n.num=h,n.actors=u,A.drawTask(t,n,r),O.insert(n.x,n.y,n.x+n.width+r.taskMargin,450)}},"drawTasks"),B={setConf:I,draw:N},R={parser:a,db:_,renderer:B,styles:b,init:(0,n.eW)(t=>{B.setConf(t.journey),_.clear()},"init")}}}]);