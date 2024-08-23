(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[35511],{79580:function(t){var e;e=function(){return function(t,e){var i=e.prototype,r=i.format;i.format=function(t){var e=this,i=this.$locale();if(!this.isValid())return r.bind(this)(t);var n=this.$utils(),s=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return i.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return i.ordinal(e.week(),"W");case"w":case"ww":return n.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return n.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return n.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}});return r.bind(this)(s)}}},t.exports=e()},69746:function(t){var e;e=function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d\d/,r=/\d\d?/,n=/\d*[^-_:/,()\s\d]+/,s={},a=function(t){return(t=+t)+(t>68?1900:2e3)},o=function(t){return function(e){this[t]=+e}},c=[/[+-]\d\d:?(\d\d)?|Z/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t||"Z"===t)return 0;var e=t.match(/([+-]|\d\d)/g),i=60*e[1]+(+e[2]||0);return 0===i?0:"+"===e[0]?-i:i}(t)}],l=function(t){var e=s[t];return e&&(e.indexOf?e:e.s.concat(e.f))},d=function(t,e){var i,r=s.meridiem;if(r){for(var n=1;n<=24;n+=1)if(t.indexOf(r(n,0,e))>-1){i=n>12;break}}else i=t===(e?"pm":"PM");return i},u={A:[n,function(t){this.afternoon=d(t,!1)}],a:[n,function(t){this.afternoon=d(t,!0)}],S:[/\d/,function(t){this.milliseconds=100*+t}],SS:[i,function(t){this.milliseconds=10*+t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[r,o("seconds")],ss:[r,o("seconds")],m:[r,o("minutes")],mm:[r,o("minutes")],H:[r,o("hours")],h:[r,o("hours")],HH:[r,o("hours")],hh:[r,o("hours")],D:[r,o("day")],DD:[i,o("day")],Do:[n,function(t){var e=s.ordinal,i=t.match(/\d+/);if(this.day=i[0],e)for(var r=1;r<=31;r+=1)e(r).replace(/\[|\]/g,"")===t&&(this.day=r)}],M:[r,o("month")],MM:[i,o("month")],MMM:[n,function(t){var e=l("months"),i=(l("monthsShort")||e.map(function(t){return t.slice(0,3)})).indexOf(t)+1;if(i<1)throw Error();this.month=i%12||i}],MMMM:[n,function(t){var e=l("months").indexOf(t)+1;if(e<1)throw Error();this.month=e%12||e}],Y:[/[+-]?\d+/,o("year")],YY:[i,function(t){this.year=a(t)}],YYYY:[/\d{4}/,o("year")],Z:c,ZZ:c};return function(i,r,n){n.p.customParseFormat=!0,i&&i.parseTwoDigitYear&&(a=i.parseTwoDigitYear);var o=r.prototype,c=o.parse;o.parse=function(i){var r=i.date,a=i.utc,o=i.args;this.$u=a;var l=o[1];if("string"==typeof l){var d=!0===o[2],h=!0===o[3],f=o[2];h&&(f=o[2]),s=this.$locale(),!d&&f&&(s=n.Ls[f]),this.$d=function(i,r,n){try{if(["x","X"].indexOf(r)>-1)return new Date(("X"===r?1e3:1)*i);var a=(function(i){var r,n;r=i,n=s&&s.formats;for(var a=(i=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(e,i,r){var s=r&&r.toUpperCase();return i||n[r]||t[r]||n[s].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(t,e,i){return e||i.slice(1)})})).match(e),o=a.length,c=0;c<o;c+=1){var l=a[c],d=u[l],h=d&&d[0],f=d&&d[1];a[c]=f?{regex:h,parser:f}:l.replace(/^\[|\]$/g,"")}return function(t){for(var e={},i=0,r=0;i<o;i+=1){var n=a[i];if("string"==typeof n)r+=n.length;else{var s=n.regex,c=n.parser,l=t.slice(r),d=s.exec(l)[0];c.call(e,d),t=t.replace(d,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var i=t.hours;e?i<12&&(t.hours+=12):12===i&&(t.hours=0),delete t.afternoon}}(e),e}})(r)(i),o=a.year,c=a.month,l=a.day,d=a.hours,h=a.minutes,f=a.seconds,y=a.milliseconds,m=a.zone,k=new Date,p=l||(o||c?1:k.getDate()),g=o||k.getFullYear(),v=0;o&&!c||(v=c>0?c-1:k.getMonth());var b=d||0,x=h||0,T=f||0,_=y||0;return m?new Date(Date.UTC(g,v,p,b,x,T,_+60*m.offset*1e3)):n?new Date(Date.UTC(g,v,p,b,x,T,_)):new Date(g,v,p,b,x,T,_)}catch(t){return new Date("")}}(r,l,a),this.init(),f&&!0!==f&&(this.$L=this.locale(f).$L),(d||h)&&r!=this.format(l)&&(this.$d=new Date("")),s={}}else if(l instanceof Array)for(var y=l.length,m=1;m<=y;m+=1){o[1]=l[m-1];var k=n.apply(this,o);if(k.isValid()){this.$d=k.$d,this.$L=k.$L,this.init();break}m===y&&(this.$d=new Date(""))}else c.call(this,i)}}},t.exports=e()},57635:function(t){var e;e=function(){return function(t,e,i){var r=function(t){return t.add(4-t.isoWeekday(),"day")},n=e.prototype;n.isoWeekYear=function(){return r(this).year()},n.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),"day");var e,n,s,a=r(this),o=(e=this.isoWeekYear(),s=4-(n=(this.$u?i.utc:i)().year(e).startOf("year")).isoWeekday(),n.isoWeekday()>4&&(s+=7),n.add(s,"day"));return a.diff(o,"week")+1},n.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var s=n.startOf;n.startOf=function(t,e){var i=this.$utils(),r=!!i.u(e)||e;return"isoweek"===i.p(t)?r?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):s.bind(this)(t,e)}}},t.exports=e()},35511:(t,e,i)=>{"use strict";let r,n,s,a;i.d(e,{diagram:()=>J});var o=i(7608),c=i(27693),l=i(57635),d=i(69746),u=i(79580),h=i(99854),f=i(63294);i(31699);var y=function(){var t=function(t,e,i,r){for(i=i||{},r=t.length;r--;i[t[r]]=e);return i},e=[1,3],i=[1,5],r=[7,9,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,33,34,36,43,48],n=[1,32],s=[1,33],a=[1,34],o=[1,35],c=[1,36],l=[1,37],d=[1,38],u=[1,15],h=[1,16],f=[1,17],y=[1,18],m=[1,19],k=[1,20],p=[1,21],g=[1,22],v=[1,24],b=[1,25],x=[1,26],T=[1,27],_=[1,28],w=[1,30],$=[1,39],D=[1,42],S=[5,7,9,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,33,34,36,43,48],C={trace:function(){},yy:{},symbols_:{error:2,start:3,directive:4,gantt:5,document:6,EOF:7,line:8,SPACE:9,statement:10,NL:11,weekday:12,weekday_monday:13,weekday_tuesday:14,weekday_wednesday:15,weekday_thursday:16,weekday_friday:17,weekday_saturday:18,weekday_sunday:19,dateFormat:20,inclusiveEndDates:21,topAxis:22,axisFormat:23,tickInterval:24,excludes:25,includes:26,todayMarker:27,title:28,acc_title:29,acc_title_value:30,acc_descr:31,acc_descr_value:32,acc_descr_multiline_value:33,section:34,clickStatement:35,taskTxt:36,taskData:37,openDirective:38,typeDirective:39,closeDirective:40,":":41,argDirective:42,click:43,callbackname:44,callbackargs:45,href:46,clickStatementDebug:47,open_directive:48,type_directive:49,arg_directive:50,close_directive:51,$accept:0,$end:1},terminals_:{2:"error",5:"gantt",7:"EOF",9:"SPACE",11:"NL",13:"weekday_monday",14:"weekday_tuesday",15:"weekday_wednesday",16:"weekday_thursday",17:"weekday_friday",18:"weekday_saturday",19:"weekday_sunday",20:"dateFormat",21:"inclusiveEndDates",22:"topAxis",23:"axisFormat",24:"tickInterval",25:"excludes",26:"includes",27:"todayMarker",28:"title",29:"acc_title",30:"acc_title_value",31:"acc_descr",32:"acc_descr_value",33:"acc_descr_multiline_value",34:"section",36:"taskTxt",37:"taskData",41:":",43:"click",44:"callbackname",45:"callbackargs",46:"href",48:"open_directive",49:"type_directive",50:"arg_directive",51:"close_directive"},productions_:[0,[3,2],[3,3],[6,0],[6,2],[8,2],[8,1],[8,1],[8,1],[12,1],[12,1],[12,1],[12,1],[12,1],[12,1],[12,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,2],[10,2],[10,1],[10,1],[10,1],[10,2],[10,1],[4,4],[4,6],[35,2],[35,3],[35,3],[35,4],[35,3],[35,4],[35,2],[47,2],[47,3],[47,3],[47,4],[47,3],[47,4],[47,2],[38,1],[39,1],[42,1],[40,1]],performAction:function(t,e,i,r,n,s,a){var o=s.length-1;switch(n){case 2:return s[o-1];case 3:case 7:case 8:this.$=[];break;case 4:s[o-1].push(s[o]),this.$=s[o-1];break;case 5:case 6:this.$=s[o];break;case 9:r.setWeekday("monday");break;case 10:r.setWeekday("tuesday");break;case 11:r.setWeekday("wednesday");break;case 12:r.setWeekday("thursday");break;case 13:r.setWeekday("friday");break;case 14:r.setWeekday("saturday");break;case 15:r.setWeekday("sunday");break;case 16:r.setDateFormat(s[o].substr(11)),this.$=s[o].substr(11);break;case 17:r.enableInclusiveEndDates(),this.$=s[o].substr(18);break;case 18:r.TopAxis(),this.$=s[o].substr(8);break;case 19:r.setAxisFormat(s[o].substr(11)),this.$=s[o].substr(11);break;case 20:r.setTickInterval(s[o].substr(13)),this.$=s[o].substr(13);break;case 21:r.setExcludes(s[o].substr(9)),this.$=s[o].substr(9);break;case 22:r.setIncludes(s[o].substr(9)),this.$=s[o].substr(9);break;case 23:r.setTodayMarker(s[o].substr(12)),this.$=s[o].substr(12);break;case 25:r.setDiagramTitle(s[o].substr(6)),this.$=s[o].substr(6);break;case 26:this.$=s[o].trim(),r.setAccTitle(this.$);break;case 27:case 28:this.$=s[o].trim(),r.setAccDescription(this.$);break;case 29:r.addSection(s[o].substr(8)),this.$=s[o].substr(8);break;case 31:r.addTask(s[o-1],s[o]),this.$="task";break;case 35:this.$=s[o-1],r.setClickEvent(s[o-1],s[o],null);break;case 36:this.$=s[o-2],r.setClickEvent(s[o-2],s[o-1],s[o]);break;case 37:this.$=s[o-2],r.setClickEvent(s[o-2],s[o-1],null),r.setLink(s[o-2],s[o]);break;case 38:this.$=s[o-3],r.setClickEvent(s[o-3],s[o-2],s[o-1]),r.setLink(s[o-3],s[o]);break;case 39:this.$=s[o-2],r.setClickEvent(s[o-2],s[o],null),r.setLink(s[o-2],s[o-1]);break;case 40:this.$=s[o-3],r.setClickEvent(s[o-3],s[o-1],s[o]),r.setLink(s[o-3],s[o-2]);break;case 41:this.$=s[o-1],r.setLink(s[o-1],s[o]);break;case 42:case 48:this.$=s[o-1]+" "+s[o];break;case 43:case 44:case 46:this.$=s[o-2]+" "+s[o-1]+" "+s[o];break;case 45:case 47:this.$=s[o-3]+" "+s[o-2]+" "+s[o-1]+" "+s[o];break;case 49:r.parseDirective("%%{","open_directive");break;case 50:r.parseDirective(s[o],"type_directive");break;case 51:s[o]=s[o].trim().replace(/'/g,'"'),r.parseDirective(s[o],"arg_directive");break;case 52:r.parseDirective("}%%","close_directive","gantt")}},table:[{3:1,4:2,5:e,38:4,48:i},{1:[3]},{3:6,4:2,5:e,38:4,48:i},t(r,[2,3],{6:7}),{39:8,49:[1,9]},{49:[2,49]},{1:[2,1]},{4:31,7:[1,10],8:11,9:[1,12],10:13,11:[1,14],12:23,13:n,14:s,15:a,16:o,17:c,18:l,19:d,20:u,21:h,22:f,23:y,24:m,25:k,26:p,27:g,28:v,29:b,31:x,33:T,34:_,35:29,36:w,38:4,43:$,48:i},{40:40,41:[1,41],51:D},t([41,51],[2,50]),t(r,[2,8],{1:[2,2]}),t(r,[2,4]),{4:31,10:43,12:23,13:n,14:s,15:a,16:o,17:c,18:l,19:d,20:u,21:h,22:f,23:y,24:m,25:k,26:p,27:g,28:v,29:b,31:x,33:T,34:_,35:29,36:w,38:4,43:$,48:i},t(r,[2,6]),t(r,[2,7]),t(r,[2,16]),t(r,[2,17]),t(r,[2,18]),t(r,[2,19]),t(r,[2,20]),t(r,[2,21]),t(r,[2,22]),t(r,[2,23]),t(r,[2,24]),t(r,[2,25]),{30:[1,44]},{32:[1,45]},t(r,[2,28]),t(r,[2,29]),t(r,[2,30]),{37:[1,46]},t(r,[2,32]),t(r,[2,9]),t(r,[2,10]),t(r,[2,11]),t(r,[2,12]),t(r,[2,13]),t(r,[2,14]),t(r,[2,15]),{44:[1,47],46:[1,48]},{11:[1,49]},{42:50,50:[1,51]},{11:[2,52]},t(r,[2,5]),t(r,[2,26]),t(r,[2,27]),t(r,[2,31]),t(r,[2,35],{45:[1,52],46:[1,53]}),t(r,[2,41],{44:[1,54]}),t(S,[2,33]),{40:55,51:D},{51:[2,51]},t(r,[2,36],{46:[1,56]}),t(r,[2,37]),t(r,[2,39],{45:[1,57]}),{11:[1,58]},t(r,[2,38]),t(r,[2,40]),t(S,[2,34])],defaultActions:{5:[2,49],6:[2,1],42:[2,52],51:[2,51]},parseError:function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},parse:function(t){var e=this,i=[0],r=[],n=[null],s=[],a=this.table,o="",c=0,l=0,d=s.slice.call(arguments,1),u=Object.create(this.lexer),h={yy:{}};for(var f in this.yy)Object.prototype.hasOwnProperty.call(this.yy,f)&&(h.yy[f]=this.yy[f]);u.setInput(t,h.yy),h.yy.lexer=u,h.yy.parser=this,void 0===u.yylloc&&(u.yylloc={});var y=u.yylloc;s.push(y);var m=u.options&&u.options.ranges;"function"==typeof h.yy.parseError?this.parseError=h.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var k,p,g,v,b,x,T,_,w={};;){if(p=i[i.length-1],this.defaultActions[p]?g=this.defaultActions[p]:(null==k&&(k=function(){var t;return"number"!=typeof(t=r.pop()||u.lex()||1)&&(t instanceof Array&&(t=(r=t).pop()),t=e.symbols_[t]||t),t}()),g=a[p]&&a[p][k]),void 0===g||!g.length||!g[0]){var $="";for(b in _=[],a[p])this.terminals_[b]&&b>2&&_.push("'"+this.terminals_[b]+"'");$=u.showPosition?"Parse error on line "+(c+1)+":\n"+u.showPosition()+"\nExpecting "+_.join(", ")+", got '"+(this.terminals_[k]||k)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==k?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError($,{text:u.match,token:this.terminals_[k]||k,line:u.yylineno,loc:y,expected:_})}if(g[0]instanceof Array&&g.length>1)throw Error("Parse Error: multiple actions possible at state: "+p+", token: "+k);switch(g[0]){case 1:i.push(k),n.push(u.yytext),s.push(u.yylloc),i.push(g[1]),k=null,l=u.yyleng,o=u.yytext,c=u.yylineno,y=u.yylloc;break;case 2:if(x=this.productions_[g[1]][1],w.$=n[n.length-x],w._$={first_line:s[s.length-(x||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(x||1)].first_column,last_column:s[s.length-1].last_column},m&&(w._$.range=[s[s.length-(x||1)].range[0],s[s.length-1].range[1]]),void 0!==(v=this.performAction.apply(w,[o,l,c,h.yy,g[1],n,s].concat(d))))return v;x&&(i=i.slice(0,-1*x*2),n=n.slice(0,-1*x),s=s.slice(0,-1*x)),i.push(this.productions_[g[1]][0]),n.push(w.$),s.push(w._$),T=a[i[i.length-2]][i[i.length-1]],i.push(T);break;case 3:return!0}}return!0}};function E(){this.yy={}}return C.lexer={EOF:1,parseError:function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var n=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===r.length?this.yylloc.first_column:0)+r[r.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[n[0],n[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t))},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){var i,r,n;if(this.options.backtrack_lexer&&(n={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(n.yylloc.range=this.yylloc.range.slice(0))),(r=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var s in n)this[s]=n[s];return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,r,n=this._currentRules(),s=0;s<n.length;s++)if((i=this._input.match(this.rules[n[s]]))&&(!e||i[0].length>e[0].length)){if(e=i,r=s,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,n[s])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,n[r]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){return this.next()||this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(t,e,i,r){switch(i){case 0:return this.begin("open_directive"),48;case 1:return this.begin("type_directive"),49;case 2:return this.popState(),this.begin("arg_directive"),41;case 3:return this.popState(),this.popState(),51;case 4:return 50;case 5:return this.begin("acc_title"),29;case 6:return this.popState(),"acc_title_value";case 7:return this.begin("acc_descr"),31;case 8:return this.popState(),"acc_descr_value";case 9:this.begin("acc_descr_multiline");break;case 10:case 20:case 23:case 26:case 29:this.popState();break;case 11:return"acc_descr_multiline_value";case 12:case 13:case 14:case 16:case 17:case 18:break;case 15:return 11;case 19:this.begin("href");break;case 21:return 46;case 22:this.begin("callbackname");break;case 24:this.popState(),this.begin("callbackargs");break;case 25:return 44;case 27:return 45;case 28:this.begin("click");break;case 30:return 43;case 31:return 5;case 32:return 20;case 33:return 21;case 34:return 22;case 35:return 23;case 36:return 24;case 37:return 26;case 38:return 25;case 39:return 27;case 40:return 13;case 41:return 14;case 42:return 15;case 43:return 16;case 44:return 17;case 45:return 18;case 46:return 19;case 47:return"date";case 48:return 28;case 49:return"accDescription";case 50:return 34;case 51:return 36;case 52:return 37;case 53:return 41;case 54:return 7;case 55:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:((?:(?!\}%%)[^:.])*))/i,/^(?::)/i,/^(?:\}%%)/i,/^(?:((?:(?!\}%%).|\n)*))/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[10,11],inclusive:!1},acc_descr:{rules:[8],inclusive:!1},acc_title:{rules:[6],inclusive:!1},close_directive:{rules:[],inclusive:!1},arg_directive:{rules:[3,4],inclusive:!1},type_directive:{rules:[2,3],inclusive:!1},open_directive:{rules:[1],inclusive:!1},callbackargs:{rules:[26,27],inclusive:!1},callbackname:{rules:[23,24,25],inclusive:!1},href:{rules:[20,21],inclusive:!1},click:{rules:[29,30],inclusive:!1},INITIAL:{rules:[0,5,7,9,12,13,14,15,16,17,18,19,22,28,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55],inclusive:!0}}},E.prototype=C,C.Parser=E,new E}();y.parser=y,c.extend(l),c.extend(d),c.extend(u);let m="",k="",p="",g=[],v=[],b={},x=[],T=[],_="",w="",$=["active","done","crit","milestone"],D=[],S=!1,C=!1,E="sunday",M=0,Y=function(t,e,i,r){return!r.includes(t.format(e.trim()))&&(!!(t.isoWeekday()>=6&&i.includes("weekends")||i.includes(t.format("dddd").toLowerCase()))||i.includes(t.format(e.trim())))},A=function(t,e,i,r){let n;if(!i.length||t.manualEndTime)return;let[s,a]=L((t.startTime instanceof Date?c(t.startTime):c(t.startTime,e,!0)).add(1,"d"),t.endTime instanceof Date?c(t.endTime):c(t.endTime,e,!0),e,i,r);t.endTime=s.toDate(),t.renderEndTime=a},L=function(t,e,i,r,n){let s=!1,a=null;for(;t<=e;)s||(a=e.toDate()),(s=Y(t,i,r,n))&&(e=e.add(1,"d")),t=t.add(1,"d");return[e,a]},F=function(t,e,i){i=i.trim();let r=/^after\s+([\d\w- ]+)/.exec(i.trim());if(null!==r){let t=null;if(r[1].split(" ").forEach(function(e){let i=j(e);void 0!==i&&(t?i.endTime>t.endTime&&(t=i):t=i)}),t)return t.endTime;{let t=new Date;return t.setHours(0,0,0,0),t}}let n=c(i,e.trim(),!0);if(n.isValid())return n.toDate();{h.l.debug("Invalid date:"+i),h.l.debug("With date format:"+e.trim());let t=new Date(i);if(void 0===t||isNaN(t.getTime())||-1e4>t.getFullYear()||t.getFullYear()>1e4)throw Error("Invalid date:"+i);return t}},I=function(t){let e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return null!==e?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},O=function(t,e,i,r=!1){let n=c(i=i.trim(),e.trim(),!0);if(n.isValid())return r&&(n=n.add(1,"d")),n.toDate();let s=c(t),[a,o]=I(i);if(!Number.isNaN(a)){let t=s.add(a,o);t.isValid()&&(s=t)}return s.toDate()},W=0,z=function(t){return void 0===t?"task"+(W+=1):t},P=function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),r={};U(i,r,$);for(let t=0;t<i.length;t++)i[t]=i[t].trim();let n="";switch(i.length){case 1:r.id=z(),r.startTime=t.endTime,n=i[0];break;case 2:r.id=z(),r.startTime=F(void 0,m,i[0]),n=i[1];break;case 3:r.id=z(i[0]),r.startTime=F(void 0,m,i[1]),n=i[2]}return n&&(r.endTime=O(r.startTime,m,n,S),r.manualEndTime=c(n,"YYYY-MM-DD",!0).isValid(),A(r,m,v,g)),r},B=function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),r={};U(i,r,$);for(let t=0;t<i.length;t++)i[t]=i[t].trim();switch(i.length){case 1:r.id=z(),r.startTime={type:"prevTaskEnd",id:t},r.endTime={data:i[0]};break;case 2:r.id=z(),r.startTime={type:"getStartDate",startData:i[0]},r.endTime={data:i[1]};break;case 3:r.id=z(i[0]),r.startTime={type:"getStartDate",startData:i[1]},r.endTime={data:i[2]}}return r},N=[],H={},j=function(t){return N[H[t]]},Z=function(){let t=!0;for(let[e,i]of N.entries())!function(t){let e=N[t],i="";switch(N[t].raw.startTime.type){case"prevTaskEnd":{let t=j(e.prevTaskId);e.startTime=t.endTime;break}case"getStartDate":(i=F(void 0,m,N[t].raw.startTime.startData))&&(N[t].startTime=i)}N[t].startTime&&(N[t].endTime=O(N[t].startTime,m,N[t].raw.endTime.data,S),N[t].endTime&&(N[t].processed=!0,N[t].manualEndTime=c(N[t].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),A(N[t],m,v,g))),N[t].processed}(e),t=t&&i.processed;return t},G=function(t,e){t.split(",").forEach(function(t){let i=j(t);void 0!==i&&i.classes.push(e)})},V=function(t,e,i){if("loose"!==(0,h.c)().securityLevel||void 0===e)return;let r=[];if("string"==typeof i){r=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let t=0;t<r.length;t++){let e=r[t].trim();'"'===e.charAt(0)&&'"'===e.charAt(e.length-1)&&(e=e.substr(1,e.length-2)),r[t]=e}}0===r.length&&r.push(t),void 0!==j(t)&&R(t,()=>{h.u.runFunc(e,...r)})},R=function(t,e){D.push(function(){let i=document.querySelector(`[id="${t}"]`);null!==i&&i.addEventListener("click",function(){e()})},function(){let i=document.querySelector(`[id="${t}-text"]`);null!==i&&i.addEventListener("click",function(){e()})})},q={parseDirective:function(t,e,i){h.m.parseDirective(this,t,e,i)},getConfig:()=>(0,h.c)().gantt,clear:function(){x=[],T=[],_="",D=[],W=0,r=void 0,n=void 0,N=[],m="",k="",w="",a=void 0,p="",g=[],v=[],S=!1,C=!1,M=0,b={},(0,h.v)(),E="sunday"},setDateFormat:function(t){m=t},getDateFormat:function(){return m},enableInclusiveEndDates:function(){S=!0},endDatesAreInclusive:function(){return S},enableTopAxis:function(){C=!0},topAxisEnabled:function(){return C},setAxisFormat:function(t){k=t},getAxisFormat:function(){return k},setTickInterval:function(t){a=t},getTickInterval:function(){return a},setTodayMarker:function(t){p=t},getTodayMarker:function(){return p},setAccTitle:h.s,getAccTitle:h.g,setDiagramTitle:h.r,getDiagramTitle:h.t,setDisplayMode:function(t){w=t},getDisplayMode:function(){return w},setAccDescription:h.b,getAccDescription:h.a,addSection:function(t){_=t,x.push(t)},getSections:function(){return x},getTasks:function(){let t=Z(),e=0;for(;!t&&e<10;)t=Z(),e++;return T=N},addTask:function(t,e){let i={section:_,type:_,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},r=B(n,e);i.raw.startTime=r.startTime,i.raw.endTime=r.endTime,i.id=r.id,i.prevTaskId=n,i.active=r.active,i.done=r.done,i.crit=r.crit,i.milestone=r.milestone,i.order=M,M++;let s=N.push(i);n=i.id,H[i.id]=s-1},findTaskById:j,addTaskOrg:function(t,e){let i={section:_,type:_,description:t,task:t,classes:[]},n=P(r,e);i.startTime=n.startTime,i.endTime=n.endTime,i.id=n.id,i.active=n.active,i.done=n.done,i.crit=n.crit,i.milestone=n.milestone,r=i,T.push(i)},setIncludes:function(t){g=t.toLowerCase().split(/[\s,]+/)},getIncludes:function(){return g},setExcludes:function(t){v=t.toLowerCase().split(/[\s,]+/)},getExcludes:function(){return v},setClickEvent:function(t,e,i){t.split(",").forEach(function(t){V(t,e,i)}),G(t,"clickable")},setLink:function(t,e){let i=e;"loose"!==(0,h.c)().securityLevel&&(i=(0,o.Nm)(e)),t.split(",").forEach(function(t){void 0!==j(t)&&(R(t,()=>{window.open(i,"_self")}),b[t]=i)}),G(t,"clickable")},getLinks:function(){return b},bindFunctions:function(t){D.forEach(function(e){e(t)})},parseDuration:I,isInvalidDate:Y,setWeekday:function(t){E=t},getWeekday:function(){return E}};function U(t,e,i){let r=!0;for(;r;)r=!1,i.forEach(function(i){let n=RegExp("^\\s*"+i+"\\s*$");t[0].match(n)&&(e[i]=!0,t.shift(1),r=!0)})}let X={monday:f.Ox9,tuesday:f.YDX,wednesday:f.EFj,thursday:f.Igq,friday:f.y2j,saturday:f.LqH,sunday:f.Zyz},Q=(t,e)=>{let i=[...t].map(()=>-1/0),r=[...t].sort((t,e)=>t.startTime-e.startTime||t.order-e.order),n=0;for(let t of r)for(let r=0;r<i.length;r++)if(t.startTime>=i[r]){i[r]=t.endTime,t.order=r+e,r>n&&(n=r);break}return n},J={parser:y,db:q,renderer:{setConf:function(){h.l.debug("Something is calling, setConf, remove the call")},draw:function(t,e,i,r){let n;let a=(0,h.c)().gantt,o=(0,h.c)().securityLevel;"sandbox"===o&&(n=(0,f.Ys)("#i"+e));let l="sandbox"===o?(0,f.Ys)(n.nodes()[0].contentDocument.body):(0,f.Ys)("body"),d="sandbox"===o?n.nodes()[0].contentDocument:document,u=d.getElementById(e);void 0===(s=u.parentElement.offsetWidth)&&(s=1200),void 0!==a.useWidth&&(s=a.useWidth);let y=r.db.getTasks(),m=[];for(let t of y)m.push(t.type);m=function(t){let e={},i=[];for(let r=0,n=t.length;r<n;++r)Object.prototype.hasOwnProperty.call(e,t[r])||(e[t[r]]=!0,i.push(t[r]));return i}(m);let k={},p=2*a.topPadding;if("compact"===r.db.getDisplayMode()||"compact"===a.displayMode){let t={};for(let e of y)void 0===t[e.section]?t[e.section]=[e]:t[e.section].push(e);let e=0;for(let i of Object.keys(t)){let r=Q(t[i],e)+1;e+=r,p+=r*(a.barHeight+a.barGap),k[i]=r}}else for(let t of(p+=y.length*(a.barHeight+a.barGap),m))k[t]=y.filter(e=>e.type===t).length;u.setAttribute("viewBox","0 0 "+s+" "+p);let g=l.select(`[id="${e}"]`),v=(0,f.Xf)().domain([(0,f.VV$)(y,function(t){return t.startTime}),(0,f.Fp7)(y,function(t){return t.endTime})]).rangeRound([0,s-a.leftPadding-a.rightPadding]);y.sort(function(t,e){let i=t.startTime,r=e.startTime,n=0;return i>r?n=1:i<r&&(n=-1),n}),function(t,i,n){let s=a.barHeight,o=s+a.barGap,l=a.topPadding,u=a.leftPadding;(0,f.BYU)().domain([0,m.length]).range(["#00B9FA","#F95002"]).interpolate(f.JHv),function(t,e,i,n,s,o,l,d){let u=o.reduce((t,{startTime:e})=>t?Math.min(t,e):e,0),h=o.reduce((t,{endTime:e})=>t?Math.max(t,e):e,0),f=r.db.getDateFormat();if(!u||!h)return;let y=[],m=null,k=c(u);for(;k.valueOf()<=h;)r.db.isInvalidDate(k,f,l,d)?m?m.end=k:m={start:k,end:k}:m&&(y.push(m),m=null),k=k.add(1,"d");g.append("g").selectAll("rect").data(y).enter().append("rect").attr("id",function(t){return"exclude-"+t.start.format("YYYY-MM-DD")}).attr("x",function(t){return v(t.start)+i}).attr("y",a.gridLineStartPadding).attr("width",function(t){return v(t.end.add(1,"day"))-v(t.start)}).attr("height",s-e-a.gridLineStartPadding).attr("transform-origin",function(e,r){return(v(e.start)+i+.5*(v(e.end)-v(e.start))).toString()+"px "+(r*t+.5*s).toString()+"px"}).attr("class","exclude-range")}(o,l,u,0,n,t,r.db.getExcludes(),r.db.getIncludes()),function(t,e,i,n){let s=(0,f.LLu)(v).tickSize(-n+e+a.gridLineStartPadding).tickFormat((0,f.i$Z)(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d")),o=/^([1-9]\d*)(minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||a.tickInterval);if(null!==o){let t=o[1],e=o[2],i=r.db.getWeekday()||a.weekday;switch(e){case"minute":s.ticks(f.Z_i.every(t));break;case"hour":s.ticks(f.WQD.every(t));break;case"day":s.ticks(f.rr1.every(t));break;case"week":s.ticks(X[i].every(t));break;case"month":s.ticks(f.F0B.every(t))}}if(g.append("g").attr("class","grid").attr("transform","translate("+t+", "+(n-50)+")").call(s).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||a.topAxis){let i=(0,f.F5q)(v).tickSize(-n+e+a.gridLineStartPadding).tickFormat((0,f.i$Z)(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));if(null!==o){let t=o[1],e=o[2],n=r.db.getWeekday()||a.weekday;switch(e){case"minute":i.ticks(f.Z_i.every(t));break;case"hour":i.ticks(f.WQD.every(t));break;case"day":i.ticks(f.rr1.every(t));break;case"week":i.ticks(X[n].every(t));break;case"month":i.ticks(f.F0B.every(t))}}g.append("g").attr("class","grid").attr("transform","translate("+t+", "+e+")").call(i).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}(u,l,0,n),function(t,i,n,s,o,c,l){let d=[...new Set(t.map(t=>t.order))].map(e=>t.find(t=>t.order===e));g.append("g").selectAll("rect").data(d).enter().append("rect").attr("x",0).attr("y",function(t,e){return t.order*i+n-2}).attr("width",function(){return l-a.rightPadding/2}).attr("height",i).attr("class",function(t){for(let[e,i]of m.entries())if(t.type===i)return"section section"+e%a.numberSectionStyles;return"section section0"});let u=g.append("g").selectAll("rect").data(t).enter(),y=r.db.getLinks();if(u.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?v(t.startTime)+s+.5*(v(t.endTime)-v(t.startTime))-.5*o:v(t.startTime)+s}).attr("y",function(t,e){return t.order*i+n}).attr("width",function(t){return t.milestone?o:v(t.renderEndTime||t.endTime)-v(t.startTime)}).attr("height",o).attr("transform-origin",function(t,e){return e=t.order,(v(t.startTime)+s+.5*(v(t.endTime)-v(t.startTime))).toString()+"px "+(e*i+n+.5*o).toString()+"px"}).attr("class",function(t){let e="";t.classes.length>0&&(e=t.classes.join(" "));let i=0;for(let[e,r]of m.entries())t.type===r&&(i=e%a.numberSectionStyles);let r="";return t.active?t.crit?r+=" activeCrit":r=" active":t.done?r=t.crit?" doneCrit":" done":t.crit&&(r+=" crit"),0===r.length&&(r=" task"),t.milestone&&(r=" milestone "+r),"task"+(r+=i+" "+e)}),u.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",a.fontSize).attr("x",function(t){let e=v(t.startTime),i=v(t.renderEndTime||t.endTime);t.milestone&&(e+=.5*(v(t.endTime)-v(t.startTime))-.5*o),t.milestone&&(i=e+o);let r=this.getBBox().width;return r>i-e?i+r+1.5*a.leftPadding>l?e+s-5:i+s+5:(i-e)/2+e+s}).attr("y",function(t,e){return t.order*i+a.barHeight/2+(a.fontSize/2-2)+n}).attr("text-height",o).attr("class",function(t){let e=v(t.startTime),i=v(t.endTime);t.milestone&&(i=e+o);let r=this.getBBox().width,n="";t.classes.length>0&&(n=t.classes.join(" "));let s=0;for(let[e,i]of m.entries())t.type===i&&(s=e%a.numberSectionStyles);let c="";return(t.active&&(c=t.crit?"activeCritText"+s:"activeText"+s),t.done?c=t.crit?c+" doneCritText"+s:c+" doneText"+s:t.crit&&(c=c+" critText"+s),t.milestone&&(c+=" milestoneText"),r>i-e)?i+r+1.5*a.leftPadding>l?n+" taskTextOutsideLeft taskTextOutside"+s+" "+c:n+" taskTextOutsideRight taskTextOutside"+s+" "+c+" width-"+r:n+" taskText taskText"+s+" "+c+" width-"+r}),"sandbox"===(0,h.c)().securityLevel){let t=(0,f.Ys)("#i"+e).nodes()[0].contentDocument;u.filter(function(t){return void 0!==y[t.id]}).each(function(e){var i=t.querySelector("#"+e.id),r=t.querySelector("#"+e.id+"-text");let n=i.parentNode;var s=t.createElement("a");s.setAttribute("xlink:href",y[e.id]),s.setAttribute("target","_top"),n.appendChild(s),s.appendChild(i),s.appendChild(r)})}}(t,o,l,u,s,0,i),function(t,e){let i=0,r=Object.keys(k).map(t=>[t,k[t]]);g.append("g").selectAll("text").data(r).enter().append(function(t){let e=t[0].split(h.e.lineBreakRegex),i=-(e.length-1)/2,r=d.createElementNS("http://www.w3.org/2000/svg","text");for(let[t,n]of(r.setAttribute("dy",i+"em"),e.entries())){let e=d.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),t>0&&e.setAttribute("dy","1em"),e.textContent=n,r.appendChild(e)}return r}).attr("x",10).attr("y",function(n,s){if(!(s>0))return n[1]*t/2+e;for(let a=0;a<s;a++)return i+=r[s-1][1],n[1]*t/2+i*t+e}).attr("font-size",a.sectionFontSize).attr("class",function(t){for(let[e,i]of m.entries())if(t[0]===i)return"sectionTitle sectionTitle"+e%a.numberSectionStyles;return"sectionTitle"})}(o,l),function(t,e,i,n){let s=r.db.getTodayMarker();if("off"===s)return;let o=g.append("g").attr("class","today"),c=new Date,l=o.append("line");l.attr("x1",v(c)+t).attr("x2",v(c)+t).attr("y1",a.titleTopMargin).attr("y2",n-a.titleTopMargin).attr("class","today"),""!==s&&l.attr("style",s.replace(/,/g,";"))}(u,0,0,n)}(y,s,p),(0,h.i)(g,p,s,a.useMaxWidth),g.append("text").text(r.db.getDiagramTitle()).attr("x",s/2).attr("y",a.titleTopMargin).attr("class","titleText")}},styles:t=>`
  .mermaid-main-font {
    font-family: "trebuchet ms", verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    // font-size: ${t.ganttFontSize};
    // text-height: 14px;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);

  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
    text {
      font-family: ${t.fontFamily};
      fill: ${t.textColor};
    }
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }

  // .taskText:not([font-size]) {
  //   font-size: ${t.ganttFontSize};
  // }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    // font-size: ${t.ganttFontSize};
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);

  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
    // font-size: ${t.ganttFontSize};
  }

  /* Special case clickable */
  .task.clickable {
    cursor: pointer;
  }
  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.textColor}    ;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
`}}}]);