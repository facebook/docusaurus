(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[99671],{57795:function(t){var e;e=function(){return function(t,e){var i=e.prototype,r=i.format;i.format=function(t){var e=this,i=this.$locale();if(!this.isValid())return r.bind(this)(t);var n=this.$utils(),s=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return i.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return i.ordinal(e.week(),"W");case"w":case"ww":return n.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return n.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return n.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}});return r.bind(this)(s)}}},t.exports=e()},88809:function(t){var e;e=function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d/,r=/\d\d/,n=/\d\d?/,s=/\d*[^-_:/,()\s\d]+/,a={},o=function(t){return(t=+t)+(t>68?1900:2e3)},c=function(t){return function(e){this[t]=+e}},l=[/[+-]\d\d:?(\d\d)?|Z/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t||"Z"===t)return 0;var e=t.match(/([+-]|\d\d)/g),i=60*e[1]+(+e[2]||0);return 0===i?0:"+"===e[0]?-i:i}(t)}],d=function(t){var e=a[t];return e&&(e.indexOf?e:e.s.concat(e.f))},u=function(t,e){var i,r=a.meridiem;if(r){for(var n=1;n<=24;n+=1)if(t.indexOf(r(n,0,e))>-1){i=n>12;break}}else i=t===(e?"pm":"PM");return i},h={A:[s,function(t){this.afternoon=u(t,!1)}],a:[s,function(t){this.afternoon=u(t,!0)}],Q:[i,function(t){this.month=3*(t-1)+1}],S:[i,function(t){this.milliseconds=100*+t}],SS:[r,function(t){this.milliseconds=10*+t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[n,c("seconds")],ss:[n,c("seconds")],m:[n,c("minutes")],mm:[n,c("minutes")],H:[n,c("hours")],h:[n,c("hours")],HH:[n,c("hours")],hh:[n,c("hours")],D:[n,c("day")],DD:[r,c("day")],Do:[s,function(t){var e=a.ordinal,i=t.match(/\d+/);if(this.day=i[0],e)for(var r=1;r<=31;r+=1)e(r).replace(/\[|\]/g,"")===t&&(this.day=r)}],w:[n,c("week")],ww:[r,c("week")],M:[n,c("month")],MM:[r,c("month")],MMM:[s,function(t){var e=d("months"),i=(d("monthsShort")||e.map(function(t){return t.slice(0,3)})).indexOf(t)+1;if(i<1)throw Error();this.month=i%12||i}],MMMM:[s,function(t){var e=d("months").indexOf(t)+1;if(e<1)throw Error();this.month=e%12||e}],Y:[/[+-]?\d+/,c("year")],YY:[r,function(t){this.year=o(t)}],YYYY:[/\d{4}/,c("year")],Z:l,ZZ:l};return function(i,r,n){n.p.customParseFormat=!0,i&&i.parseTwoDigitYear&&(o=i.parseTwoDigitYear);var s=r.prototype,c=s.parse;s.parse=function(i){var r=i.date,s=i.utc,o=i.args;this.$u=s;var l=o[1];if("string"==typeof l){var d=!0===o[2],u=!0===o[3],f=o[2];u&&(f=o[2]),a=this.$locale(),!d&&f&&(a=n.Ls[f]),this.$d=function(i,r,n,s){try{if(["x","X"].indexOf(r)>-1)return new Date(("X"===r?1e3:1)*i);var o=(function(i){var r,n;r=i,n=a&&a.formats;for(var s=(i=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(e,i,r){var s=r&&r.toUpperCase();return i||n[r]||t[r]||n[s].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(t,e,i){return e||i.slice(1)})})).match(e),o=s.length,c=0;c<o;c+=1){var l=s[c],d=h[l],u=d&&d[0],f=d&&d[1];s[c]=f?{regex:u,parser:f}:l.replace(/^\[|\]$/g,"")}return function(t){for(var e={},i=0,r=0;i<o;i+=1){var n=s[i];if("string"==typeof n)r+=n.length;else{var a=n.regex,c=n.parser,l=t.slice(r),d=a.exec(l)[0];c.call(e,d),t=t.replace(d,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var i=t.hours;e?i<12&&(t.hours+=12):12===i&&(t.hours=0),delete t.afternoon}}(e),e}})(r)(i),c=o.year,l=o.month,d=o.day,u=o.hours,f=o.minutes,y=o.seconds,m=o.milliseconds,k=o.zone,p=o.week,g=new Date,b=d||(c||l?1:g.getDate()),T=c||g.getFullYear(),v=0;c&&!l||(v=l>0?l-1:g.getMonth());var x,w=u||0,_=f||0,D=y||0,$=m||0;return k?new Date(Date.UTC(T,v,b,w,_,D,$+60*k.offset*1e3)):n?new Date(Date.UTC(T,v,b,w,_,D,$)):(x=new Date(T,v,b,w,_,D,$),p&&(x=s(x).week(p).toDate()),x)}catch(t){return new Date("")}}(r,l,s,n),this.init(),f&&!0!==f&&(this.$L=this.locale(f).$L),(d||u)&&r!=this.format(l)&&(this.$d=new Date("")),a={}}else if(l instanceof Array)for(var y=l.length,m=1;m<=y;m+=1){o[1]=l[m-1];var k=n.apply(this,o);if(k.isValid()){this.$d=k.$d,this.$L=k.$L,this.init();break}m===y&&(this.$d=new Date(""))}else c.call(this,i)}}},t.exports=e()},6973:function(t){var e;e=function(){return function(t,e,i){var r=function(t){return t.add(4-t.isoWeekday(),"day")},n=e.prototype;n.isoWeekYear=function(){return r(this).year()},n.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),"day");var e,n,s,a=r(this),o=(e=this.isoWeekYear(),s=4-(n=(this.$u?i.utc:i)().year(e).startOf("year")).isoWeekday(),n.isoWeekday()>4&&(s+=7),n.add(s,"day"));return a.diff(o,"week")+1},n.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var s=n.startOf;n.startOf=function(t,e){var i=this.$utils(),r=!!i.u(e)||e;return"isoweek"===i.p(t)?r?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):s.bind(this)(t,e)}}},t.exports=e()},99671:(t,e,i)=>{"use strict";i.d(e,{diagram:()=>tY});var r,n,s,a=i(67027),o=i(72912),c=i(31546),l=i(95285),d=i(6973),u=i(88809),h=i(57795),f=i(89601),y=function(){var t=(0,o.K2)(function(t,e,i,r){for(i=i||{},r=t.length;r--;i[t[r]]=e);return i},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],i=[1,26],r=[1,27],n=[1,28],s=[1,29],a=[1,30],c=[1,31],l=[1,32],d=[1,33],u=[1,34],h=[1,9],f=[1,10],y=[1,11],m=[1,12],k=[1,13],p=[1,14],g=[1,15],b=[1,16],T=[1,19],v=[1,20],x=[1,21],w=[1,22],_=[1,23],D=[1,25],$=[1,35],C={trace:(0,o.K2)(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:(0,o.K2)(function(t,e,i,r,n,s,a){var o=s.length-1;switch(n){case 1:return s[o-1];case 2:case 6:case 7:this.$=[];break;case 3:s[o-1].push(s[o]),this.$=s[o-1];break;case 4:case 5:this.$=s[o];break;case 8:r.setWeekday("monday");break;case 9:r.setWeekday("tuesday");break;case 10:r.setWeekday("wednesday");break;case 11:r.setWeekday("thursday");break;case 12:r.setWeekday("friday");break;case 13:r.setWeekday("saturday");break;case 14:r.setWeekday("sunday");break;case 15:r.setWeekend("friday");break;case 16:r.setWeekend("saturday");break;case 17:r.setDateFormat(s[o].substr(11)),this.$=s[o].substr(11);break;case 18:r.enableInclusiveEndDates(),this.$=s[o].substr(18);break;case 19:r.TopAxis(),this.$=s[o].substr(8);break;case 20:r.setAxisFormat(s[o].substr(11)),this.$=s[o].substr(11);break;case 21:r.setTickInterval(s[o].substr(13)),this.$=s[o].substr(13);break;case 22:r.setExcludes(s[o].substr(9)),this.$=s[o].substr(9);break;case 23:r.setIncludes(s[o].substr(9)),this.$=s[o].substr(9);break;case 24:r.setTodayMarker(s[o].substr(12)),this.$=s[o].substr(12);break;case 27:r.setDiagramTitle(s[o].substr(6)),this.$=s[o].substr(6);break;case 28:this.$=s[o].trim(),r.setAccTitle(this.$);break;case 29:case 30:this.$=s[o].trim(),r.setAccDescription(this.$);break;case 31:r.addSection(s[o].substr(8)),this.$=s[o].substr(8);break;case 33:r.addTask(s[o-1],s[o]),this.$="task";break;case 34:this.$=s[o-1],r.setClickEvent(s[o-1],s[o],null);break;case 35:this.$=s[o-2],r.setClickEvent(s[o-2],s[o-1],s[o]);break;case 36:this.$=s[o-2],r.setClickEvent(s[o-2],s[o-1],null),r.setLink(s[o-2],s[o]);break;case 37:this.$=s[o-3],r.setClickEvent(s[o-3],s[o-2],s[o-1]),r.setLink(s[o-3],s[o]);break;case 38:this.$=s[o-2],r.setClickEvent(s[o-2],s[o],null),r.setLink(s[o-2],s[o-1]);break;case 39:this.$=s[o-3],r.setClickEvent(s[o-3],s[o-1],s[o]),r.setLink(s[o-3],s[o-2]);break;case 40:this.$=s[o-1],r.setLink(s[o-1],s[o]);break;case 41:case 47:this.$=s[o-1]+" "+s[o];break;case 42:case 43:case 45:this.$=s[o-2]+" "+s[o-1]+" "+s[o];break;case 44:case 46:this.$=s[o-3]+" "+s[o-2]+" "+s[o-1]+" "+s[o]}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:i,13:r,14:n,15:s,16:a,17:c,18:l,19:18,20:d,21:u,22:h,23:f,24:y,25:m,26:k,27:p,28:g,29:b,30:T,31:v,33:x,35:w,36:_,37:24,38:D,40:$},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:i,13:r,14:n,15:s,16:a,17:c,18:l,19:18,20:d,21:u,22:h,23:f,24:y,25:m,26:k,27:p,28:g,29:b,30:T,31:v,33:x,35:w,36:_,37:24,38:D,40:$},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:(0,o.K2)(function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},"parseError"),parse:(0,o.K2)(function(t){var e=this,i=[0],r=[],n=[null],s=[],a=this.table,c="",l=0,d=0,u=0,h=s.slice.call(arguments,1),f=Object.create(this.lexer),y={yy:{}};for(var m in this.yy)Object.prototype.hasOwnProperty.call(this.yy,m)&&(y.yy[m]=this.yy[m]);f.setInput(t,y.yy),y.yy.lexer=f,y.yy.parser=this,void 0===f.yylloc&&(f.yylloc={});var k=f.yylloc;s.push(k);var p=f.options&&f.options.ranges;function g(){var t;return"number"!=typeof(t=r.pop()||f.lex()||1)&&(t instanceof Array&&(t=(r=t).pop()),t=e.symbols_[t]||t),t}"function"==typeof y.yy.parseError?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError,(0,o.K2)(function(t){i.length=i.length-2*t,n.length=n.length-t,s.length=s.length-t},"popStack"),(0,o.K2)(g,"lex");for(var b,T,v,x,w,_,D,$,C,K={};;){if(v=i[i.length-1],this.defaultActions[v]?x=this.defaultActions[v]:(null==b&&(b=g()),x=a[v]&&a[v][b]),void 0===x||!x.length||!x[0]){var S="";for(_ in C=[],a[v])this.terminals_[_]&&_>2&&C.push("'"+this.terminals_[_]+"'");S=f.showPosition?"Parse error on line "+(l+1)+":\n"+f.showPosition()+"\nExpecting "+C.join(", ")+", got '"+(this.terminals_[b]||b)+"'":"Parse error on line "+(l+1)+": Unexpected "+(1==b?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(S,{text:f.match,token:this.terminals_[b]||b,line:f.yylineno,loc:k,expected:C})}if(x[0]instanceof Array&&x.length>1)throw Error("Parse Error: multiple actions possible at state: "+v+", token: "+b);switch(x[0]){case 1:i.push(b),n.push(f.yytext),s.push(f.yylloc),i.push(x[1]),b=null,T?(b=T,T=null):(d=f.yyleng,c=f.yytext,l=f.yylineno,k=f.yylloc,u>0&&u--);break;case 2:if(D=this.productions_[x[1]][1],K.$=n[n.length-D],K._$={first_line:s[s.length-(D||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(D||1)].first_column,last_column:s[s.length-1].last_column},p&&(K._$.range=[s[s.length-(D||1)].range[0],s[s.length-1].range[1]]),void 0!==(w=this.performAction.apply(K,[c,d,l,y.yy,x[1],n,s].concat(h))))return w;D&&(i=i.slice(0,-1*D*2),n=n.slice(0,-1*D),s=s.slice(0,-1*D)),i.push(this.productions_[x[1]][0]),n.push(K.$),s.push(K._$),$=a[i[i.length-2]][i[i.length-1]],i.push($);break;case 3:return!0}}return!0},"parse")},K={EOF:1,parseError:(0,o.K2)(function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},"parseError"),setInput:(0,o.K2)(function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:(0,o.K2)(function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},"input"),unput:(0,o.K2)(function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var n=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===r.length?this.yylloc.first_column:0)+r[r.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[n[0],n[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},"unput"),more:(0,o.K2)(function(){return this._more=!0,this},"more"),reject:(0,o.K2)(function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"reject"),less:(0,o.K2)(function(t){this.unput(this.match.slice(t))},"less"),pastInput:(0,o.K2)(function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:(0,o.K2)(function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:(0,o.K2)(function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},"showPosition"),test_match:(0,o.K2)(function(t,e){var i,r,n;if(this.options.backtrack_lexer&&(n={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(n.yylloc.range=this.yylloc.range.slice(0))),(r=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var s in n)this[s]=n[s];return!1},"test_match"),next:(0,o.K2)(function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,r,n=this._currentRules(),s=0;s<n.length;s++)if((i=this._input.match(this.rules[n[s]]))&&(!e||i[0].length>e[0].length)){if(e=i,r=s,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,n[s])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,n[r]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:(0,o.K2)(function(){return this.next()||this.lex()},"lex"),begin:(0,o.K2)(function(t){this.conditionStack.push(t)},"begin"),popState:(0,o.K2)(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:(0,o.K2)(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:(0,o.K2)(function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},"topState"),pushState:(0,o.K2)(function(t){this.begin(t)},"pushState"),stateStackSize:(0,o.K2)(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,o.K2)(function(t,e,i,r){switch(i){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:case 15:case 18:case 21:case 24:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:case 9:case 10:case 12:case 13:break;case 11:return 10;case 14:this.begin("href");break;case 16:return 43;case 17:this.begin("callbackname");break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 22:return 42;case 23:this.begin("click");break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};function S(){this.yy={}}return C.lexer=K,(0,o.K2)(S,"Parser"),S.prototype=C,C.Parser=S,new S}();y.parser=y,l.extend(d),l.extend(u),l.extend(h);var m={friday:5,saturday:6},k="",p="",g=void 0,b="",T=[],v=[],x=new Map,w=[],_=[],D="",$="",C=["active","done","crit","milestone"],K=[],S=!1,E=!1,M="sunday",A="saturday",Y=0,L=(0,o.K2)(function(){w=[],_=[],D="",K=[],th=0,r=void 0,n=void 0,tk=[],k="",p="",$="",g=void 0,b="",T=[],v=[],S=!1,E=!1,Y=0,x=new Map,(0,o.IU)(),M="sunday",A="saturday"},"clear"),I=(0,o.K2)(function(t){p=t},"setAxisFormat"),W=(0,o.K2)(function(){return p},"getAxisFormat"),O=(0,o.K2)(function(t){g=t},"setTickInterval"),F=(0,o.K2)(function(){return g},"getTickInterval"),P=(0,o.K2)(function(t){b=t},"setTodayMarker"),B=(0,o.K2)(function(){return b},"getTodayMarker"),z=(0,o.K2)(function(t){k=t},"setDateFormat"),N=(0,o.K2)(function(){S=!0},"enableInclusiveEndDates"),G=(0,o.K2)(function(){return S},"endDatesAreInclusive"),H=(0,o.K2)(function(){E=!0},"enableTopAxis"),R=(0,o.K2)(function(){return E},"topAxisEnabled"),j=(0,o.K2)(function(t){$=t},"setDisplayMode"),U=(0,o.K2)(function(){return $},"getDisplayMode"),V=(0,o.K2)(function(){return k},"getDateFormat"),Z=(0,o.K2)(function(t){T=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),X=(0,o.K2)(function(){return T},"getIncludes"),q=(0,o.K2)(function(t){v=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),Q=(0,o.K2)(function(){return v},"getExcludes"),J=(0,o.K2)(function(){return x},"getLinks"),tt=(0,o.K2)(function(t){D=t,w.push(t)},"addSection"),te=(0,o.K2)(function(){return w},"getSections"),ti=(0,o.K2)(function(){let t=tv(),e=0;for(;!t&&e<10;)t=tv(),e++;return _=tk},"getTasks"),tr=(0,o.K2)(function(t,e,i,r){return!r.includes(t.format(e.trim()))&&(!!(i.includes("weekends")&&(t.isoWeekday()===m[A]||t.isoWeekday()===m[A]+1)||i.includes(t.format("dddd").toLowerCase()))||i.includes(t.format(e.trim())))},"isInvalidDate"),tn=(0,o.K2)(function(t){M=t},"setWeekday"),ts=(0,o.K2)(function(){return M},"getWeekday"),ta=(0,o.K2)(function(t){A=t},"setWeekend"),to=(0,o.K2)(function(t,e,i,r){let n;if(!i.length||t.manualEndTime)return;let[s,a]=tc((t.startTime instanceof Date?l(t.startTime):l(t.startTime,e,!0)).add(1,"d"),t.endTime instanceof Date?l(t.endTime):l(t.endTime,e,!0),e,i,r);t.endTime=s.toDate(),t.renderEndTime=a},"checkTaskDates"),tc=(0,o.K2)(function(t,e,i,r,n){let s=!1,a=null;for(;t<=e;)s||(a=e.toDate()),(s=tr(t,i,r,n))&&(e=e.add(1,"d")),t=t.add(1,"d");return[e,a]},"fixTaskDates"),tl=(0,o.K2)(function(t,e,i){i=i.trim();let r=/^after\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==r){let t=null;for(let e of r.groups.ids.split(" ")){let i=tb(e);void 0!==i&&(!t||i.endTime>t.endTime)&&(t=i)}if(t)return t.endTime;let e=new Date;return e.setHours(0,0,0,0),e}let n=l(i,e.trim(),!0);if(n.isValid())return n.toDate();{o.Rm.debug("Invalid date:"+i),o.Rm.debug("With date format:"+e.trim());let t=new Date(i);if(void 0===t||isNaN(t.getTime())||-1e4>t.getFullYear()||t.getFullYear()>1e4)throw Error("Invalid date:"+i);return t}},"getStartDate"),td=(0,o.K2)(function(t){let e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return null!==e?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),tu=(0,o.K2)(function(t,e,i,r=!1){i=i.trim();let n=/^until\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==n){let t=null;for(let e of n.groups.ids.split(" ")){let i=tb(e);void 0!==i&&(!t||i.startTime<t.startTime)&&(t=i)}if(t)return t.startTime;let e=new Date;return e.setHours(0,0,0,0),e}let s=l(i,e.trim(),!0);if(s.isValid())return r&&(s=s.add(1,"d")),s.toDate();let a=l(t),[o,c]=td(i);if(!Number.isNaN(o)){let t=a.add(o,c);t.isValid()&&(a=t)}return a.toDate()},"getEndDate"),th=0,tf=(0,o.K2)(function(t){return void 0===t?"task"+(th+=1):t},"parseId"),ty=(0,o.K2)(function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),r={};tS(i,r,C);for(let t=0;t<i.length;t++)i[t]=i[t].trim();let n="";switch(i.length){case 1:r.id=tf(),r.startTime=t.endTime,n=i[0];break;case 2:r.id=tf(),r.startTime=tl(void 0,k,i[0]),n=i[1];break;case 3:r.id=tf(i[0]),r.startTime=tl(void 0,k,i[1]),n=i[2]}return n&&(r.endTime=tu(r.startTime,k,n,S),r.manualEndTime=l(n,"YYYY-MM-DD",!0).isValid(),to(r,k,v,T)),r},"compileData"),tm=(0,o.K2)(function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),r={};tS(i,r,C);for(let t=0;t<i.length;t++)i[t]=i[t].trim();switch(i.length){case 1:r.id=tf(),r.startTime={type:"prevTaskEnd",id:t},r.endTime={data:i[0]};break;case 2:r.id=tf(),r.startTime={type:"getStartDate",startData:i[0]},r.endTime={data:i[1]};break;case 3:r.id=tf(i[0]),r.startTime={type:"getStartDate",startData:i[1]},r.endTime={data:i[2]}}return r},"parseData"),tk=[],tp={},tg=(0,o.K2)(function(t,e){let i={section:D,type:D,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},r=tm(n,e);i.raw.startTime=r.startTime,i.raw.endTime=r.endTime,i.id=r.id,i.prevTaskId=n,i.active=r.active,i.done=r.done,i.crit=r.crit,i.milestone=r.milestone,i.order=Y,Y++;let s=tk.push(i);n=i.id,tp[i.id]=s-1},"addTask"),tb=(0,o.K2)(function(t){return tk[tp[t]]},"findTaskById"),tT=(0,o.K2)(function(t,e){let i={section:D,type:D,description:t,task:t,classes:[]},n=ty(r,e);i.startTime=n.startTime,i.endTime=n.endTime,i.id=n.id,i.active=n.active,i.done=n.done,i.crit=n.crit,i.milestone=n.milestone,r=i,_.push(i)},"addTaskOrg"),tv=(0,o.K2)(function(){let t=(0,o.K2)(function(t){let e=tk[t],i="";switch(tk[t].raw.startTime.type){case"prevTaskEnd":{let t=tb(e.prevTaskId);e.startTime=t.endTime;break}case"getStartDate":(i=tl(void 0,k,tk[t].raw.startTime.startData))&&(tk[t].startTime=i)}return tk[t].startTime&&(tk[t].endTime=tu(tk[t].startTime,k,tk[t].raw.endTime.data,S),tk[t].endTime&&(tk[t].processed=!0,tk[t].manualEndTime=l(tk[t].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),to(tk[t],k,v,T))),tk[t].processed},"compileTask"),e=!0;for(let[i,r]of tk.entries())t(i),e=e&&r.processed;return e},"compileTasks"),tx=(0,o.K2)(function(t,e){let i=e;"loose"!==(0,o.D7)().securityLevel&&(i=(0,c.J)(e)),t.split(",").forEach(function(t){void 0!==tb(t)&&(tD(t,()=>{window.open(i,"_self")}),x.set(t,i))}),tw(t,"clickable")},"setLink"),tw=(0,o.K2)(function(t,e){t.split(",").forEach(function(t){let i=tb(t);void 0!==i&&i.classes.push(e)})},"setClass"),t_=(0,o.K2)(function(t,e,i){if("loose"!==(0,o.D7)().securityLevel||void 0===e)return;let r=[];if("string"==typeof i){r=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let t=0;t<r.length;t++){let e=r[t].trim();e.startsWith('"')&&e.endsWith('"')&&(e=e.substr(1,e.length-2)),r[t]=e}}0===r.length&&r.push(t),void 0!==tb(t)&&tD(t,()=>{a._K.runFunc(e,...r)})},"setClickFun"),tD=(0,o.K2)(function(t,e){K.push(function(){let i=document.querySelector(`[id="${t}"]`);null!==i&&i.addEventListener("click",function(){e()})},function(){let i=document.querySelector(`[id="${t}-text"]`);null!==i&&i.addEventListener("click",function(){e()})})},"pushFun"),t$=(0,o.K2)(function(t,e,i){t.split(",").forEach(function(t){t_(t,e,i)}),tw(t,"clickable")},"setClickEvent"),tC=(0,o.K2)(function(t){K.forEach(function(e){e(t)})},"bindFunctions"),tK={getConfig:(0,o.K2)(()=>(0,o.D7)().gantt,"getConfig"),clear:L,setDateFormat:z,getDateFormat:V,enableInclusiveEndDates:N,endDatesAreInclusive:G,enableTopAxis:H,topAxisEnabled:R,setAxisFormat:I,getAxisFormat:W,setTickInterval:O,getTickInterval:F,setTodayMarker:P,getTodayMarker:B,setAccTitle:o.SV,getAccTitle:o.iN,setDiagramTitle:o.ke,getDiagramTitle:o.ab,setDisplayMode:j,getDisplayMode:U,setAccDescription:o.EI,getAccDescription:o.m7,addSection:tt,getSections:te,getTasks:ti,addTask:tg,findTaskById:tb,addTaskOrg:tT,setIncludes:Z,getIncludes:X,setExcludes:q,getExcludes:Q,setClickEvent:t$,setLink:tx,getLinks:J,bindFunctions:tC,parseDuration:td,isInvalidDate:tr,setWeekday:tn,getWeekday:ts,setWeekend:ta};function tS(t,e,i){let r=!0;for(;r;)r=!1,i.forEach(function(i){let n=RegExp("^\\s*"+i+"\\s*$");t[0].match(n)&&(e[i]=!0,t.shift(1),r=!0)})}(0,o.K2)(tS,"getTaskTags");var tE=(0,o.K2)(function(){o.Rm.debug("Something is calling, setConf, remove the call")},"setConf"),tM={monday:f.ABi,tuesday:f.PGu,wednesday:f.GuW,thursday:f.Mol,friday:f.TUC,saturday:f.rGn,sunday:f.YPH},tA=(0,o.K2)((t,e)=>{let i=[...t].map(()=>-1/0),r=[...t].sort((t,e)=>t.startTime-e.startTime||t.order-e.order),n=0;for(let t of r)for(let r=0;r<i.length;r++)if(t.startTime>=i[r]){i[r]=t.endTime,t.order=r+e,r>n&&(n=r);break}return n},"getMaxIntersections"),tY={parser:y,db:tK,renderer:{setConf:tE,draw:(0,o.K2)(function(t,e,i,r){let n;let a=(0,o.D7)().gantt,c=(0,o.D7)().securityLevel;"sandbox"===c&&(n=(0,f.Ltv)("#i"+e));let d="sandbox"===c?(0,f.Ltv)(n.nodes()[0].contentDocument.body):(0,f.Ltv)("body"),u="sandbox"===c?n.nodes()[0].contentDocument:document,h=u.getElementById(e);void 0===(s=h.parentElement.offsetWidth)&&(s=1200),void 0!==a.useWidth&&(s=a.useWidth);let y=r.db.getTasks(),m=[];for(let t of y)m.push(t.type);m=C(m);let k={},p=2*a.topPadding;if("compact"===r.db.getDisplayMode()||"compact"===a.displayMode){let t={};for(let e of y)void 0===t[e.section]?t[e.section]=[e]:t[e.section].push(e);let e=0;for(let i of Object.keys(t)){let r=tA(t[i],e)+1;e+=r,p+=r*(a.barHeight+a.barGap),k[i]=r}}else for(let t of(p+=y.length*(a.barHeight+a.barGap),m))k[t]=y.filter(e=>e.type===t).length;h.setAttribute("viewBox","0 0 "+s+" "+p);let g=d.select(`[id="${e}"]`),b=(0,f.w7C)().domain([(0,f.jkA)(y,function(t){return t.startTime}),(0,f.T9B)(y,function(t){return t.endTime})]).rangeRound([0,s-a.leftPadding-a.rightPadding]);function T(t,e){let i=t.startTime,r=e.startTime,n=0;return i>r?n=1:i<r&&(n=-1),n}function v(t,e,i){let n=a.barHeight,s=n+a.barGap,o=a.topPadding,c=a.leftPadding,l=(0,f.m4Y)().domain([0,m.length]).range(["#00B9FA","#F95002"]).interpolate(f.bEH);w(s,o,c,e,i,t,r.db.getExcludes(),r.db.getIncludes()),_(c,o,e,i),x(t,s,o,c,n,l,e,i),D(s,o,c,n,l),$(c,o,e,i)}function x(t,i,n,s,c,l,d){let u=[...new Set(t.map(t=>t.order))].map(e=>t.find(t=>t.order===e));g.append("g").selectAll("rect").data(u).enter().append("rect").attr("x",0).attr("y",function(t,e){return t.order*i+n-2}).attr("width",function(){return d-a.rightPadding/2}).attr("height",i).attr("class",function(t){for(let[e,i]of m.entries())if(t.type===i)return"section section"+e%a.numberSectionStyles;return"section section0"});let h=g.append("g").selectAll("rect").data(t).enter(),y=r.db.getLinks();if(h.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?b(t.startTime)+s+.5*(b(t.endTime)-b(t.startTime))-.5*c:b(t.startTime)+s}).attr("y",function(t,e){return t.order*i+n}).attr("width",function(t){return t.milestone?c:b(t.renderEndTime||t.endTime)-b(t.startTime)}).attr("height",c).attr("transform-origin",function(t,e){return e=t.order,(b(t.startTime)+s+.5*(b(t.endTime)-b(t.startTime))).toString()+"px "+(e*i+n+.5*c).toString()+"px"}).attr("class",function(t){let e="";t.classes.length>0&&(e=t.classes.join(" "));let i=0;for(let[e,r]of m.entries())t.type===r&&(i=e%a.numberSectionStyles);let r="";return t.active?t.crit?r+=" activeCrit":r=" active":t.done?r=t.crit?" doneCrit":" done":t.crit&&(r+=" crit"),0===r.length&&(r=" task"),t.milestone&&(r=" milestone "+r),"task"+(r+=i+" "+e)}),h.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",a.fontSize).attr("x",function(t){let e=b(t.startTime),i=b(t.renderEndTime||t.endTime);t.milestone&&(e+=.5*(b(t.endTime)-b(t.startTime))-.5*c),t.milestone&&(i=e+c);let r=this.getBBox().width;return r>i-e?i+r+1.5*a.leftPadding>d?e+s-5:i+s+5:(i-e)/2+e+s}).attr("y",function(t,e){return t.order*i+a.barHeight/2+(a.fontSize/2-2)+n}).attr("text-height",c).attr("class",function(t){let e=b(t.startTime),i=b(t.endTime);t.milestone&&(i=e+c);let r=this.getBBox().width,n="";t.classes.length>0&&(n=t.classes.join(" "));let s=0;for(let[e,i]of m.entries())t.type===i&&(s=e%a.numberSectionStyles);let o="";return(t.active&&(o=t.crit?"activeCritText"+s:"activeText"+s),t.done?o=t.crit?o+" doneCritText"+s:o+" doneText"+s:t.crit&&(o=o+" critText"+s),t.milestone&&(o+=" milestoneText"),r>i-e)?i+r+1.5*a.leftPadding>d?n+" taskTextOutsideLeft taskTextOutside"+s+" "+o:n+" taskTextOutsideRight taskTextOutside"+s+" "+o+" width-"+r:n+" taskText taskText"+s+" "+o+" width-"+r}),"sandbox"===(0,o.D7)().securityLevel){let t=(0,f.Ltv)("#i"+e).nodes()[0].contentDocument;h.filter(function(t){return y.has(t.id)}).each(function(e){var i=t.querySelector("#"+e.id),r=t.querySelector("#"+e.id+"-text");let n=i.parentNode;var s=t.createElement("a");s.setAttribute("xlink:href",y.get(e.id)),s.setAttribute("target","_top"),n.appendChild(s),s.appendChild(i),s.appendChild(r)})}}function w(t,e,i,n,s,c,d,u){let h,f;if(0===d.length&&0===u.length)return;for(let{startTime:t,endTime:e}of c)(void 0===h||t<h)&&(h=t),(void 0===f||e>f)&&(f=e);if(!h||!f)return;if(l(f).diff(l(h),"year")>5){o.Rm.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}let y=r.db.getDateFormat(),m=[],k=null,p=l(h);for(;p.valueOf()<=f;)r.db.isInvalidDate(p,y,d,u)?k?k.end=p:k={start:p,end:p}:k&&(m.push(k),k=null),p=p.add(1,"d");g.append("g").selectAll("rect").data(m).enter().append("rect").attr("id",function(t){return"exclude-"+t.start.format("YYYY-MM-DD")}).attr("x",function(t){return b(t.start)+i}).attr("y",a.gridLineStartPadding).attr("width",function(t){return b(t.end.add(1,"day"))-b(t.start)}).attr("height",s-e-a.gridLineStartPadding).attr("transform-origin",function(e,r){return(b(e.start)+i+.5*(b(e.end)-b(e.start))).toString()+"px "+(r*t+.5*s).toString()+"px"}).attr("class","exclude-range")}function _(t,e,i,n){let s=(0,f.l78)(b).tickSize(-n+e+a.gridLineStartPadding).tickFormat((0,f.DCK)(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d")),o=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||a.tickInterval);if(null!==o){let t=o[1],e=o[2],i=r.db.getWeekday()||a.weekday;switch(e){case"millisecond":s.ticks(f.t6C.every(t));break;case"second":s.ticks(f.ucG.every(t));break;case"minute":s.ticks(f.wXd.every(t));break;case"hour":s.ticks(f.Agd.every(t));break;case"day":s.ticks(f.UAC.every(t));break;case"week":s.ticks(tM[i].every(t));break;case"month":s.ticks(f.Ui6.every(t))}}if(g.append("g").attr("class","grid").attr("transform","translate("+t+", "+(n-50)+")").call(s).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||a.topAxis){let i=(0,f.tlR)(b).tickSize(-n+e+a.gridLineStartPadding).tickFormat((0,f.DCK)(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));if(null!==o){let t=o[1],e=o[2],n=r.db.getWeekday()||a.weekday;switch(e){case"millisecond":i.ticks(f.t6C.every(t));break;case"second":i.ticks(f.ucG.every(t));break;case"minute":i.ticks(f.wXd.every(t));break;case"hour":i.ticks(f.Agd.every(t));break;case"day":i.ticks(f.UAC.every(t));break;case"week":i.ticks(tM[n].every(t));break;case"month":i.ticks(f.Ui6.every(t))}}g.append("g").attr("class","grid").attr("transform","translate("+t+", "+e+")").call(i).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function D(t,e){let i=0,r=Object.keys(k).map(t=>[t,k[t]]);g.append("g").selectAll("text").data(r).enter().append(function(t){let e=t[0].split(o.Y2.lineBreakRegex),i=-(e.length-1)/2,r=u.createElementNS("http://www.w3.org/2000/svg","text");for(let[t,n]of(r.setAttribute("dy",i+"em"),e.entries())){let e=u.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),t>0&&e.setAttribute("dy","1em"),e.textContent=n,r.appendChild(e)}return r}).attr("x",10).attr("y",function(n,s){if(!(s>0))return n[1]*t/2+e;for(let a=0;a<s;a++)return i+=r[s-1][1],n[1]*t/2+i*t+e}).attr("font-size",a.sectionFontSize).attr("class",function(t){for(let[e,i]of m.entries())if(t[0]===i)return"sectionTitle sectionTitle"+e%a.numberSectionStyles;return"sectionTitle"})}function $(t,e,i,n){let s=r.db.getTodayMarker();if("off"===s)return;let o=g.append("g").attr("class","today"),c=new Date,l=o.append("line");l.attr("x1",b(c)+t).attr("x2",b(c)+t).attr("y1",a.titleTopMargin).attr("y2",n-a.titleTopMargin).attr("class","today"),""!==s&&l.attr("style",s.replace(/,/g,";"))}function C(t){let e={},i=[];for(let r=0,n=t.length;r<n;++r)Object.prototype.hasOwnProperty.call(e,t[r])||(e[t[r]]=!0,i.push(t[r]));return i}(0,o.K2)(T,"taskCompare"),y.sort(T),v(y,s,p),(0,o.a$)(g,p,s,a.useMaxWidth),g.append("text").text(r.db.getDiagramTitle()).attr("x",s/2).attr("y",a.titleTopMargin).attr("class","titleText"),(0,o.K2)(v,"makeGantt"),(0,o.K2)(x,"drawRects"),(0,o.K2)(w,"drawExcludeDays"),(0,o.K2)(_,"makeGrid"),(0,o.K2)(D,"vertLabels"),(0,o.K2)($,"drawToday"),(0,o.K2)(C,"checkUnique")},"draw")},styles:(0,o.K2)(t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
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
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
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
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
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
    fill: ${t.titleColor||t.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,"getStyles")}}}]);