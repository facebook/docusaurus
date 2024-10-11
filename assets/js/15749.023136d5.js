"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["15749"],{29277:function(t,e,s){s.d(e,{Ee:function(){return tY},J8:function(){return l},_$:function(){return R},bH:function(){return tB}});var i=s(8382),r=s(63985),n=s(84890),a=s(28923),o=function(){var t=(0,a.eW)(function(t,e,s,i){for(s=s||{},i=t.length;i--;s[t[i]]=e);return s},"o"),e=[1,2],s=[1,3],i=[1,4],r=[2,4],n=[1,9],o=[1,11],l=[1,16],c=[1,17],h=[1,18],u=[1,19],d=[1,32],p=[1,20],y=[1,21],f=[1,22],g=[1,23],S=[1,24],m=[1,26],_=[1,27],b=[1,28],T=[1,29],k=[1,30],E=[1,31],x=[1,34],$=[1,35],C=[1,36],D=[1,37],v=[1,33],L=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],A=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],I=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],W={trace:(0,a.eW)(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"--\x3e":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,classDef:38,CLASSDEF_ID:39,CLASSDEF_STYLEOPTS:40,DEFAULT:41,style:42,STYLE_IDS:43,STYLEDEF_STYLEOPTS:44,class:45,CLASSENTITY_IDS:46,STYLECLASS:47,direction_tb:48,direction_bt:49,direction_rl:50,direction_lr:51,eol:52,";":53,EDGE_STATE:54,STYLE_SEPARATOR:55,left_of:56,right_of:57,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"--\x3e",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"classDef",39:"CLASSDEF_ID",40:"CLASSDEF_STYLEOPTS",41:"DEFAULT",42:"style",43:"STYLE_IDS",44:"STYLEDEF_STYLEOPTS",45:"class",46:"CLASSENTITY_IDS",47:"STYLECLASS",48:"direction_tb",49:"direction_bt",50:"direction_rl",51:"direction_lr",53:";",54:"EDGE_STATE",55:"STYLE_SEPARATOR",56:"left_of",57:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[52,1],[52,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:(0,a.eW)(function(t,e,s,i,r,n,a){var o=n.length-1;switch(r){case 3:return i.setRootDoc(n[o]),n[o];case 4:this.$=[];break;case 5:"nl"!=n[o]&&(n[o-1].push(n[o]),this.$=n[o-1]);break;case 6:case 7:case 12:this.$=n[o];break;case 8:this.$="nl";break;case 13:let l=n[o-1];l.description=i.trimColon(n[o]),this.$=l;break;case 14:this.$={stmt:"relation",state1:n[o-2],state2:n[o]};break;case 15:let c=i.trimColon(n[o]);this.$={stmt:"relation",state1:n[o-3],state2:n[o-1],description:c};break;case 19:this.$={stmt:"state",id:n[o-3],type:"default",description:"",doc:n[o-1]};break;case 20:var h=n[o],u=n[o-2].trim();if(n[o].match(":")){var d=n[o].split(":");h=d[0],u=[u,d[1]]}this.$={stmt:"state",id:h,type:"default",description:u};break;case 21:this.$={stmt:"state",id:n[o-3],type:"default",description:n[o-5],doc:n[o-1]};break;case 22:this.$={stmt:"state",id:n[o],type:"fork"};break;case 23:this.$={stmt:"state",id:n[o],type:"join"};break;case 24:this.$={stmt:"state",id:n[o],type:"choice"};break;case 25:this.$={stmt:"state",id:i.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:n[o-1].trim(),note:{position:n[o-2].trim(),text:n[o].trim()}};break;case 29:this.$=n[o].trim(),i.setAccTitle(this.$);break;case 30:case 31:this.$=n[o].trim(),i.setAccDescription(this.$);break;case 32:case 33:this.$={stmt:"classDef",id:n[o-1].trim(),classes:n[o].trim()};break;case 34:this.$={stmt:"style",id:n[o-1].trim(),styleClass:n[o].trim()};break;case 35:this.$={stmt:"applyClass",id:n[o-1].trim(),styleClass:n[o].trim()};break;case 36:i.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 37:i.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 38:i.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 39:i.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 42:case 43:this.$={stmt:"state",id:n[o].trim(),type:"default",description:""};break;case 44:this.$={stmt:"state",id:n[o-2].trim(),classes:[n[o].trim()],type:"default",description:""};break;case 45:this.$={stmt:"state",id:n[o-2].trim(),classes:[n[o].trim()],type:"default",description:""}}},"anonymous"),table:[{3:1,4:e,5:s,6:i},{1:[3]},{3:5,4:e,5:s,6:i},{3:6,4:e,5:s,6:i},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:n,5:o,8:8,9:10,10:12,11:13,12:14,13:15,16:l,17:c,19:h,22:u,24:d,25:p,26:y,27:f,28:g,29:S,32:25,33:m,35:_,37:b,38:T,42:k,45:E,48:x,49:$,50:C,51:D,54:v},t(L,[2,5]),{9:38,10:12,11:13,12:14,13:15,16:l,17:c,19:h,22:u,24:d,25:p,26:y,27:f,28:g,29:S,32:25,33:m,35:_,37:b,38:T,42:k,45:E,48:x,49:$,50:C,51:D,54:v},t(L,[2,7]),t(L,[2,8]),t(L,[2,9]),t(L,[2,10]),t(L,[2,11]),t(L,[2,12],{14:[1,39],15:[1,40]}),t(L,[2,16]),{18:[1,41]},t(L,[2,18],{20:[1,42]}),{23:[1,43]},t(L,[2,22]),t(L,[2,23]),t(L,[2,24]),t(L,[2,25]),{30:44,31:[1,45],56:[1,46],57:[1,47]},t(L,[2,28]),{34:[1,48]},{36:[1,49]},t(L,[2,31]),{39:[1,50],41:[1,51]},{43:[1,52]},{46:[1,53]},t(A,[2,42],{55:[1,54]}),t(A,[2,43],{55:[1,55]}),t(L,[2,36]),t(L,[2,37]),t(L,[2,38]),t(L,[2,39]),t(L,[2,6]),t(L,[2,13]),{13:56,24:d,54:v},t(L,[2,17]),t(I,r,{7:57}),{24:[1,58]},{24:[1,59]},{23:[1,60]},{24:[2,46]},{24:[2,47]},t(L,[2,29]),t(L,[2,30]),{40:[1,61]},{40:[1,62]},{44:[1,63]},{47:[1,64]},{24:[1,65]},{24:[1,66]},t(L,[2,14],{14:[1,67]}),{4:n,5:o,8:8,9:10,10:12,11:13,12:14,13:15,16:l,17:c,19:h,21:[1,68],22:u,24:d,25:p,26:y,27:f,28:g,29:S,32:25,33:m,35:_,37:b,38:T,42:k,45:E,48:x,49:$,50:C,51:D,54:v},t(L,[2,20],{20:[1,69]}),{31:[1,70]},{24:[1,71]},t(L,[2,32]),t(L,[2,33]),t(L,[2,34]),t(L,[2,35]),t(A,[2,44]),t(A,[2,45]),t(L,[2,15]),t(L,[2,19]),t(I,r,{7:72}),t(L,[2,26]),t(L,[2,27]),{4:n,5:o,8:8,9:10,10:12,11:13,12:14,13:15,16:l,17:c,19:h,21:[1,73],22:u,24:d,25:p,26:y,27:f,28:g,29:S,32:25,33:m,35:_,37:b,38:T,42:k,45:E,48:x,49:$,50:C,51:D,54:v},t(L,[2,21])],defaultActions:{5:[2,1],6:[2,2],46:[2,46],47:[2,47]},parseError:(0,a.eW)(function(t,e){if(e.recoverable)this.trace(t);else{var s=Error(t);throw s.hash=e,s}},"parseError"),parse:(0,a.eW)(function(t){var e=this,s=[0],i=[],r=[null],n=[],o=this.table,l="",c=0,h=0,u=0,d=n.slice.call(arguments,1),p=Object.create(this.lexer),y={yy:{}};for(var f in this.yy)Object.prototype.hasOwnProperty.call(this.yy,f)&&(y.yy[f]=this.yy[f]);p.setInput(t,y.yy),y.yy.lexer=p,y.yy.parser=this,void 0===p.yylloc&&(p.yylloc={});var g=p.yylloc;n.push(g);var S=p.options&&p.options.ranges;"function"==typeof y.yy.parseError?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function m(){var t;return"number"!=typeof(t=i.pop()||p.lex()||1)&&(t instanceof Array&&(t=(i=t).pop()),t=e.symbols_[t]||t),t}(0,a.eW)(function(t){s.length=s.length-2*t,r.length=r.length-t,n.length=n.length-t},"popStack"),(0,a.eW)(m,"lex");for(var _,b,T,k,E,x,$,C,D,v={};;){if(T=s[s.length-1],this.defaultActions[T]?k=this.defaultActions[T]:(null==_&&(_=m()),k=o[T]&&o[T][_]),void 0===k||!k.length||!k[0]){var L="";for(x in D=[],o[T])this.terminals_[x]&&x>2&&D.push("'"+this.terminals_[x]+"'");L=p.showPosition?"Parse error on line "+(c+1)+":\n"+p.showPosition()+"\nExpecting "+D.join(", ")+", got '"+(this.terminals_[_]||_)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==_?"end of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(L,{text:p.match,token:this.terminals_[_]||_,line:p.yylineno,loc:g,expected:D})}if(k[0]instanceof Array&&k.length>1)throw Error("Parse Error: multiple actions possible at state: "+T+", token: "+_);switch(k[0]){case 1:s.push(_),r.push(p.yytext),n.push(p.yylloc),s.push(k[1]),_=null,b?(_=b,b=null):(h=p.yyleng,l=p.yytext,c=p.yylineno,g=p.yylloc,u>0&&u--);break;case 2:if($=this.productions_[k[1]][1],v.$=r[r.length-$],v._$={first_line:n[n.length-($||1)].first_line,last_line:n[n.length-1].last_line,first_column:n[n.length-($||1)].first_column,last_column:n[n.length-1].last_column},S&&(v._$.range=[n[n.length-($||1)].range[0],n[n.length-1].range[1]]),void 0!==(E=this.performAction.apply(v,[l,h,c,y.yy,k[1],r,n].concat(d))))return E;$&&(s=s.slice(0,-1*$*2),r=r.slice(0,-1*$),n=n.slice(0,-1*$)),s.push(this.productions_[k[1]][0]),r.push(v.$),n.push(v._$),C=o[s[s.length-2]][s[s.length-1]],s.push(C);break;case 3:return!0}}return!0},"parse")},w={EOF:1,parseError:(0,a.eW)(function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},"parseError"),setInput:(0,a.eW)(function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:(0,a.eW)(function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},"input"),unput:(0,a.eW)(function(t){var e=t.length,s=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var i=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),s.length-1&&(this.yylineno-=s.length-1);var r=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:s?(s.length===i.length?this.yylloc.first_column:0)+i[i.length-s.length].length-s[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[r[0],r[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},"unput"),more:(0,a.eW)(function(){return this._more=!0,this},"more"),reject:(0,a.eW)(function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"reject"),less:(0,a.eW)(function(t){this.unput(this.match.slice(t))},"less"),pastInput:(0,a.eW)(function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:(0,a.eW)(function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:(0,a.eW)(function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},"showPosition"),test_match:(0,a.eW)(function(t,e){var s,i,r;if(this.options.backtrack_lexer&&(r={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(r.yylloc.range=this.yylloc.range.slice(0))),(i=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],s=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),s)return s;if(this._backtrack)for(var n in r)this[n]=r[n];return!1},"test_match"),next:(0,a.eW)(function(){if(this.done)return this.EOF;!this._input&&(this.done=!0),!this._more&&(this.yytext="",this.match="");for(var t,e,s,i,r=this._currentRules(),n=0;n<r.length;n++)if((s=this._input.match(this.rules[r[n]]))&&(!e||s[0].length>e[0].length)){if(e=s,i=n,this.options.backtrack_lexer){if(!1!==(t=this.test_match(s,r[n])))return t;if(!this._backtrack)return!1;else{e=!1;continue}}if(!this.options.flex)break}if(e)return!1!==(t=this.test_match(e,r[i]))&&t;return""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:(0,a.eW)(function(){var t=this.next();return t?t:this.lex()},"lex"),begin:(0,a.eW)(function(t){this.conditionStack.push(t)},"begin"),popState:(0,a.eW)(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:(0,a.eW)(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:(0,a.eW)(function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},"topState"),pushState:(0,a.eW)(function(t){this.begin(t)},"pushState"),stateStackSize:(0,a.eW)(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,a.eW)(function(t,e,s,i){switch(s){case 0:return 41;case 1:case 42:return 48;case 2:case 43:return 49;case 3:case 44:return 50;case 4:case 45:return 51;case 5:case 6:case 8:case 9:case 10:case 11:case 54:case 56:case 62:break;case 7:case 77:return 5;case 12:case 32:return this.pushState("SCALE"),17;case 13:case 33:return 18;case 14:case 20:case 34:case 49:case 52:this.popState();break;case 15:return this.begin("acc_title"),33;case 16:return this.popState(),"acc_title_value";case 17:return this.begin("acc_descr"),35;case 18:return this.popState(),"acc_descr_value";case 19:this.begin("acc_descr_multiline");break;case 21:return"acc_descr_multiline_value";case 22:return this.pushState("CLASSDEF"),38;case 23:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 24:return this.popState(),this.pushState("CLASSDEFID"),39;case 25:return this.popState(),40;case 26:return this.pushState("CLASS"),45;case 27:return this.popState(),this.pushState("CLASS_STYLE"),46;case 28:return this.popState(),47;case 29:return this.pushState("STYLE"),42;case 30:return this.popState(),this.pushState("STYLEDEF_STYLES"),43;case 31:return this.popState(),44;case 35:this.pushState("STATE");break;case 36:case 39:return this.popState(),e.yytext=e.yytext.slice(0,-8).trim(),25;case 37:case 40:return this.popState(),e.yytext=e.yytext.slice(0,-8).trim(),26;case 38:case 41:return this.popState(),e.yytext=e.yytext.slice(0,-10).trim(),27;case 46:this.pushState("STATE_STRING");break;case 47:return this.pushState("STATE_ID"),"AS";case 48:case 64:return this.popState(),"ID";case 50:return"STATE_DESCR";case 51:return 19;case 53:return this.popState(),this.pushState("struct"),20;case 55:return this.popState(),21;case 57:return this.begin("NOTE"),29;case 58:return this.popState(),this.pushState("NOTE_ID"),56;case 59:return this.popState(),this.pushState("NOTE_ID"),57;case 60:this.popState(),this.pushState("FLOATING_NOTE");break;case 61:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 63:return"NOTE_TEXT";case 65:return this.popState(),this.pushState("NOTE_TEXT"),24;case 66:return this.popState(),e.yytext=e.yytext.substr(2).trim(),31;case 67:return this.popState(),e.yytext=e.yytext.slice(0,-8).trim(),31;case 68:case 69:return 6;case 70:return 16;case 71:return 54;case 72:return 24;case 73:return e.yytext=e.yytext.trim(),14;case 74:return 15;case 75:return 28;case 76:return 55;case 78:return"INVALID"}},"anonymous"),rules:[/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[9,10],inclusive:!1},struct:{rules:[9,10,22,26,29,35,42,43,44,45,54,55,56,57,71,72,73,74,75],inclusive:!1},FLOATING_NOTE_ID:{rules:[64],inclusive:!1},FLOATING_NOTE:{rules:[61,62,63],inclusive:!1},NOTE_TEXT:{rules:[66,67],inclusive:!1},NOTE_ID:{rules:[65],inclusive:!1},NOTE:{rules:[58,59,60],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[31],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[30],inclusive:!1},CLASS_STYLE:{rules:[28],inclusive:!1},CLASS:{rules:[27],inclusive:!1},CLASSDEFID:{rules:[25],inclusive:!1},CLASSDEF:{rules:[23,24],inclusive:!1},acc_descr_multiline:{rules:[20,21],inclusive:!1},acc_descr:{rules:[18],inclusive:!1},acc_title:{rules:[16],inclusive:!1},SCALE:{rules:[13,14,33,34],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[48],inclusive:!1},STATE_STRING:{rules:[49,50],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[9,10,36,37,38,39,40,41,46,47,51,52,53],inclusive:!1},ID:{rules:[9,10],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,10,11,12,15,17,19,22,26,29,32,35,53,57,68,69,70,71,72,73,74,76,77,78],inclusive:!0}}};function O(){this.yy={}}return W.lexer=w,(0,a.eW)(O,"Parser"),O.prototype=W,W.Parser=O,new O}();o.parser=o;var l=o,c="TB",h="state",u="relation",d="default",p="divider",y="fill:none",f="fill: #333",g="text",S="normal",m="rect",_="rectWithTitle",b="divider",T="roundedWithTitle",k="statediagram",E=`${k}-state`,x="transition",$=`${x} note-edge`,C=`${k}-note`,D=`${k}-cluster`,v=`${k}-cluster-alt`,L="parent",A="note",I="----",W=`${I}${A}`,w=`${I}${L}`,O=(0,a.eW)((t,e=c)=>{if(!t.doc)return e;let s=e;for(let e of t.doc)"dir"===e.stmt&&(s=e.value);return s},"getDir"),N=(0,a.eW)(function(t,e){return e.db.extract(e.db.getRootDocV2()),e.db.getClasses()},"getClasses"),R={getClasses:N,draw:(0,a.eW)(async function(t,e,s,o){a.cM.info("REF0:"),a.cM.info("Drawing state diagram (v2)",e);let{securityLevel:l,state:c,layout:h}=(0,a.nV)();o.db.extract(o.db.getRootDocV2());let u=o.db.getData(),d=(0,i.q)(e,l);u.type=o.type,u.layoutAlgorithm=h,u.nodeSpacing=c?.nodeSpacing||50,u.rankSpacing=c?.rankSpacing||50,u.markers=["barb"],u.diagramId=e,await (0,r.sY)(u,d);n.w8.insertTitle(d,"statediagramTitleText",c?.titleTopMargin??25,o.db.getDiagramTitle()),(0,i.j)(d,8,k,c?.useMaxWidth??!0)},"draw"),getDir:O},B=new Map,Y=0;function F(t="",e=0,s="",i=I){let r=null!==s&&s.length>0?`${i}${s}`:"";return`state-${t}${r}-${e}`}(0,a.eW)(F,"stateDomId");var P=(0,a.eW)((t,e,s,i,r,n,o,l)=>{a.cM.trace("items",e),e.forEach(e=>{switch(e.stmt){case h:case d:z(t,e,s,i,r,n,o,l);break;case u:{z(t,e.state1,s,i,r,n,o,l),z(t,e.state2,s,i,r,n,o,l);let c={id:"edge"+Y,start:e.state1.id,end:e.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:y,labelStyle:"",label:a.SY.sanitizeText(e.description,(0,a.nV)()),arrowheadStyle:f,labelpos:"c",labelType:g,thickness:S,classes:x,look:o};r.push(c),Y++}}})},"setupDoc"),M=(0,a.eW)((t,e=c)=>{let s=e;if(t.doc)for(let e of t.doc)"dir"===e.stmt&&(s=e.value);return s},"getDir");function G(t,e,s){if(!e.id||"</join></fork>"===e.id||"</choice>"===e.id)return;e.cssClasses&&(!Array.isArray(e.cssCompiledStyles)&&(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(t=>{if(s.get(t)){let i=s.get(t);e.cssCompiledStyles=[...e.cssCompiledStyles,...i.styles]}}));let i=t.find(t=>t.id===e.id);i?Object.assign(i,e):t.push(e)}function j(t){return t?.classes?.join(" ")??""}function V(t){return t?.styles??[]}(0,a.eW)(G,"insertOrUpdateNode"),(0,a.eW)(j,"getClassesFromDbInfo"),(0,a.eW)(V,"getStylesFromDbInfo");var z=(0,a.eW)((t,e,s,i,r,n,o,l)=>{let c=e.id,h=s.get(c),u=j(h),k=V(h);if(a.cM.info("dataFetcher parsedItem",e,h,k),"root"!==c){let s=m;!0===e.start?s="stateStart":!1===e.start&&(s="stateEnd"),e.type!==d&&(s=e.type),!B.get(c)&&B.set(c,{id:c,shape:s,description:a.SY.sanitizeText(c,(0,a.nV)()),cssClasses:`${u} ${E}`,cssStyles:k});let h=B.get(c);e.description&&(Array.isArray(h.description)?(h.shape=_,h.description.push(e.description)):h.description?.length>0?(h.shape=_,h.description===c?h.description=[e.description]:h.description=[h.description,e.description]):(h.shape=m,h.description=e.description),h.description=a.SY.sanitizeTextOrArray(h.description,(0,a.nV)())),h.description?.length===1&&h.shape===_&&("group"===h.type?h.shape=T:h.shape=m),!h.type&&e.doc&&(a.cM.info("Setting cluster for XCX",c,M(e)),h.type="group",h.isGroup=!0,h.dir=M(e),h.shape=e.type===p?b:T,h.cssClasses=`${h.cssClasses} ${D} ${n?v:""}`);let x={labelStyle:"",shape:h.shape,label:h.description,cssClasses:h.cssClasses,cssCompiledStyles:[],cssStyles:h.cssStyles,id:c,dir:h.dir,domId:F(c,Y),type:h.type,isGroup:"group"===h.type,padding:8,rx:10,ry:10,look:o};if(x.shape===b&&(x.label=""),t&&"root"!==t.id&&(a.cM.trace("Setting node ",c," to be child of its parent ",t.id),x.parentId=t.id),x.centerLabel=!0,e.note){let t={labelStyle:"",shape:"note",label:e.note.text,cssClasses:C,cssStyles:[],cssCompilesStyles:[],id:c+W+"-"+Y,domId:F(c,Y,A),type:h.type,isGroup:"group"===h.type,padding:(0,a.nV)().flowchart.padding,look:o,position:e.note.position},s=c+w,n={labelStyle:"",shape:"noteGroup",label:e.note.text,cssClasses:h.cssClasses,cssStyles:[],id:c+w,domId:F(c,Y,L),type:"group",isGroup:!0,padding:16,look:o,position:e.note.position};Y++,n.id=s,t.parentId=s,G(i,n,l),G(i,t,l),G(i,x,l);let u=c,d=t.id;"left of"===e.note.position&&(u=t.id,d=c),r.push({id:u+"-"+d,start:u,end:d,arrowhead:"none",arrowTypeEnd:"",style:y,labelStyle:"",classes:$,arrowheadStyle:f,labelpos:"c",labelType:g,thickness:S,look:o})}else G(i,x,l)}e.doc&&(a.cM.trace("Adding nodes children "),P(e,e.doc,s,i,r,!n,o,l))},"dataFetcher"),U=(0,a.eW)(()=>{B.clear(),Y=0},"reset"),H="start",X="color",J="fill";function K(){return new Map}(0,a.eW)(K,"newClassesList");var q=[],Z=[],Q="LR",tt=[],te=K(),ts=(0,a.eW)(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),ti={root:ts()},tr=ti.root,tn=0,ta=0,to=(0,a.eW)(t=>JSON.parse(JSON.stringify(t)),"clone"),tl=(0,a.eW)(t=>{a.cM.info("Setting root doc",t),tt=t},"setRootDoc"),tc=(0,a.eW)(()=>tt,"getRootDoc"),th=(0,a.eW)((t,e,s)=>{if(e.stmt===u)th(t,e.state1,!0),th(t,e.state2,!1);else if(e.stmt===h&&("[*]"===e.id?(e.id=s?t.id+"_start":t.id+"_end",e.start=s):e.id=e.id.trim()),e.doc){let t;let s=[],i=[];for(t=0;t<e.doc.length;t++)if(e.doc[t].type===p){let r=to(e.doc[t]);r.doc=to(i),s.push(r),i=[]}else i.push(e.doc[t]);if(s.length>0&&i.length>0){let t={stmt:h,id:(0,n.Ox)(),type:"divider",doc:to(i)};s.push(to(t)),e.doc=s}e.doc.forEach(t=>th(e,t,!0))}},"docTranslator"),tu=(0,a.eW)(()=>(th({id:"root"},{id:"root",doc:tt},!0),{id:"root",doc:tt}),"getRootDocV2"),td=(0,a.eW)(t=>{let e;e=t.doc?t.doc:t,a.cM.info(e),ty(!0),a.cM.info("Extract initial document:",e),e.forEach(t=>{switch(a.cM.warn("Statement",t.stmt),t.stmt){case h:tp(t.id.trim(),t.type,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles);break;case u:tx(t.state1,t.state2,t.description);break;case"classDef":tv(t.id.trim(),t.classes);break;case"style":{let e=t.id.trim().split(","),s=t.styleClass.split(",");e.forEach(t=>{let e=tf(t);if(void 0===e){let s=t.trim();tp(s),e=tf(s)}e.styles=s.map(t=>t.replace(/;/g,"")?.trim())})}break;case"applyClass":tA(t.id.trim(),t.styleClass)}});let s=tg(),i=(0,a.nV)().look;U(),z(void 0,tu(),s,q,Z,!0,i,te),q.forEach(t=>{if(Array.isArray(t.label)){if(t.description=t.label.slice(1),t.isGroup&&t.description.length>0)throw Error("Group nodes can only have label. Remove the additional description for node ["+t.id+"]");t.label=t.label[0]}})},"extract"),tp=(0,a.eW)(function(t,e=d,s=null,i=null,r=null,n=null,o=null,l=null){let c=t?.trim();if(tr.states.has(c)?(!tr.states.get(c).doc&&(tr.states.get(c).doc=s),!tr.states.get(c).type&&(tr.states.get(c).type=e)):(a.cM.info("Adding state ",c,i),tr.states.set(c,{id:c,descriptions:[],type:e,doc:s,note:r,classes:[],styles:[],textStyles:[]})),i&&(a.cM.info("Setting state description",c,i),"string"==typeof i&&t$(c,i.trim()),"object"==typeof i&&i.forEach(t=>t$(c,t.trim()))),r){let t=tr.states.get(c);t.note=r,t.note.text=a.SY.sanitizeText(t.note.text,(0,a.nV)())}if(n&&(a.cM.info("Setting state classes",c,n),("string"==typeof n?[n]:n).forEach(t=>tA(c,t.trim()))),o&&(a.cM.info("Setting state styles",c,o),("string"==typeof o?[o]:o).forEach(t=>tI(c,t.trim()))),l){a.cM.info("Setting state styles",c,o);("string"==typeof l?[l]:l).forEach(t=>tW(c,t.trim()))}},"addState"),ty=(0,a.eW)(function(t){q=[],Z=[],tr=(ti={root:ts()}).root,tn=0,te=K(),!t&&(0,a.ZH)()},"clear"),tf=(0,a.eW)(function(t){return tr.states.get(t)},"getState"),tg=(0,a.eW)(function(){return tr.states},"getStates"),tS=(0,a.eW)(function(){a.cM.info("Documents = ",ti)},"logDocuments"),tm=(0,a.eW)(function(){return tr.relations},"getRelations");function t_(t=""){let e=t;return"[*]"===t&&(tn++,e=`${H}${tn}`),e}function tb(t="",e=d){return"[*]"===t?H:e}function tT(t=""){let e=t;return"[*]"===t&&(tn++,e=`end${tn}`),e}function tk(t="",e=d){return"[*]"===t?"end":e}function tE(t,e,s){let i=t_(t.id.trim()),r=tb(t.id.trim(),t.type),n=t_(e.id.trim()),o=tb(e.id.trim(),e.type);tp(i,r,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),tp(n,o,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),tr.relations.push({id1:i,id2:n,relationTitle:a.SY.sanitizeText(s,(0,a.nV)())})}(0,a.eW)(t_,"startIdIfNeeded"),(0,a.eW)(tb,"startTypeIfNeeded"),(0,a.eW)(tT,"endIdIfNeeded"),(0,a.eW)(tk,"endTypeIfNeeded"),(0,a.eW)(tE,"addRelationObjs");var tx=(0,a.eW)(function(t,e,s){if("object"==typeof t)tE(t,e,s);else{let i=t_(t.trim()),r=tb(t),n=tT(e.trim()),o=tk(e);tp(i,r),tp(n,o),tr.relations.push({id1:i,id2:n,title:a.SY.sanitizeText(s,(0,a.nV)())})}},"addRelation"),t$=(0,a.eW)(function(t,e){let s=tr.states.get(t),i=e.startsWith(":")?e.replace(":","").trim():e;s.descriptions.push(a.SY.sanitizeText(i,(0,a.nV)()))},"addDescription"),tC=(0,a.eW)(function(t){return":"===t.substring(0,1)?t.substr(2).trim():t.trim()},"cleanupLabel"),tD=(0,a.eW)(()=>"divider-id-"+ ++ta,"getDividerId"),tv=(0,a.eW)(function(t,e=""){!te.has(t)&&te.set(t,{id:t,styles:[],textStyles:[]});let s=te.get(t);null!=e&&e.split(",").forEach(t=>{let e=t.replace(/([^;]*);/,"$1").trim();if(RegExp(X).exec(t)){let t=e.replace(J,"bgFill").replace(X,J);s.textStyles.push(t)}s.styles.push(e)})},"addStyleClass"),tL=(0,a.eW)(function(){return te},"getClasses"),tA=(0,a.eW)(function(t,e){t.split(",").forEach(function(t){let s=tf(t);if(void 0===s){let e=t.trim();tp(e),s=tf(e)}s.classes.push(e)})},"setCssClass"),tI=(0,a.eW)(function(t,e){let s=tf(t);void 0!==s&&s.styles.push(e)},"setStyle"),tW=(0,a.eW)(function(t,e){let s=tf(t);void 0!==s&&s.textStyles.push(e)},"setTextStyle"),tw=(0,a.eW)(()=>Q,"getDirection"),tO=(0,a.eW)(t=>{Q=t},"setDirection"),tN=(0,a.eW)(t=>t&&":"===t[0]?t.substr(1).trim():t.trim(),"trimColon"),tR=(0,a.eW)(()=>{let t=(0,a.nV)();return{nodes:q,edges:Z,other:{},config:t,direction:O(tu())}},"getData"),tB={getConfig:(0,a.eW)(()=>(0,a.nV)().state,"getConfig"),getData:tR,addState:tp,clear:ty,getState:tf,getStates:tg,getRelations:tm,getClasses:tL,getDirection:tw,addRelation:tx,getDividerId:tD,setDirection:tO,cleanupLabel:tC,lineType:{LINE:0,DOTTED_LINE:1},relationType:{AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},logDocuments:tS,getRootDoc:tc,setRootDoc:tl,getRootDocV2:tu,extract:td,trimColon:tN,getAccTitle:a.eu,setAccTitle:a.GN,getAccDescription:a.Mx,setAccDescription:a.U$,addStyleClass:tv,setCssClass:tA,addDescription:t$,setDiagramTitle:a.g2,getDiagramTitle:a.Kr},tY=(0,a.eW)(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles")},8382:function(t,e,s){s.d(e,{j:function(){return a},q:function(){return n}});var i=s(28923),r=s(11141),n=(0,i.eW)((t,e)=>{let s;return"sandbox"===e&&(s=(0,r.Ys)("#i"+t)),("sandbox"===e?(0,r.Ys)(s.nodes()[0].contentDocument.body):(0,r.Ys)("body")).select(`[id="${t}"]`)},"getDiagramElement"),a=(0,i.eW)((t,e,s,r)=>{t.attr("class",s);let{width:n,height:a,x:c,y:h}=o(t,e);(0,i.v2)(t,a,n,r);let u=l(c,h,n,a,e);t.attr("viewBox",u),i.cM.debug(`viewBox configured: ${u} with padding: ${e}`)},"setupViewPortForSVG"),o=(0,i.eW)((t,e)=>{let s=t.node()?.getBBox()||{width:0,height:0,x:0,y:0};return{width:s.width+2*e,height:s.height+2*e,x:s.x,y:s.y}},"calculateDimensionsWithPadding"),l=(0,i.eW)((t,e,s,i,r)=>`${t-r} ${e-r} ${s} ${i}`,"createViewBox")}}]);