"use strict";
exports.id = 509;
exports.ids = [509];
exports.modules = {

/***/ 39509:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99854);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63294);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27693);
/* harmony import */ var _braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7608);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42605);











var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 3], $V1 = [1, 5], $V2 = [1, 6], $V3 = [1, 7], $V4 = [1, 8], $V5 = [1, 10], $V6 = [1, 5, 14, 16, 18, 20, 21, 26, 28, 29, 30, 31, 32, 38, 39, 40, 41, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], $V7 = [1, 5, 7, 14, 16, 18, 20, 21, 26, 28, 29, 30, 31, 32, 38, 39, 40, 41, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], $V8 = [38, 39, 40], $V9 = [2, 8], $Va = [1, 19], $Vb = [1, 23], $Vc = [1, 24], $Vd = [1, 25], $Ve = [1, 26], $Vf = [1, 27], $Vg = [1, 29], $Vh = [1, 30], $Vi = [1, 31], $Vj = [1, 32], $Vk = [1, 33], $Vl = [1, 34], $Vm = [1, 37], $Vn = [1, 38], $Vo = [1, 39], $Vp = [1, 40], $Vq = [1, 41], $Vr = [1, 42], $Vs = [1, 43], $Vt = [1, 44], $Vu = [1, 45], $Vv = [1, 46], $Vw = [1, 47], $Vx = [1, 48], $Vy = [1, 49], $Vz = [1, 52], $VA = [1, 67], $VB = [1, 68], $VC = [5, 23, 27, 38, 39, 40, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61], $VD = [5, 7, 38, 39, 40, 41];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "eol": 4, "SPACE": 5, "directive": 6, "QUADRANT": 7, "document": 8, "line": 9, "statement": 10, "axisDetails": 11, "quadrantDetails": 12, "points": 13, "title": 14, "title_value": 15, "acc_title": 16, "acc_title_value": 17, "acc_descr": 18, "acc_descr_value": 19, "acc_descr_multiline_value": 20, "section": 21, "text": 22, "point_start": 23, "point_x": 24, "point_y": 25, "X-AXIS": 26, "AXIS-TEXT-DELIMITER": 27, "Y-AXIS": 28, "QUADRANT_1": 29, "QUADRANT_2": 30, "QUADRANT_3": 31, "QUADRANT_4": 32, "openDirective": 33, "typeDirective": 34, "closeDirective": 35, ":": 36, "argDirective": 37, "NEWLINE": 38, "SEMI": 39, "EOF": 40, "open_directive": 41, "type_directive": 42, "arg_directive": 43, "close_directive": 44, "alphaNumToken": 45, "textNoTagsToken": 46, "STR": 47, "MD_STR": 48, "alphaNum": 49, "PUNCTUATION": 50, "AMP": 51, "NUM": 52, "ALPHA": 53, "COMMA": 54, "PLUS": 55, "EQUALS": 56, "MULT": 57, "DOT": 58, "BRKT": 59, "UNDERSCORE": 60, "MINUS": 61, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 5: "SPACE", 7: "QUADRANT", 14: "title", 15: "title_value", 16: "acc_title", 17: "acc_title_value", 18: "acc_descr", 19: "acc_descr_value", 20: "acc_descr_multiline_value", 21: "section", 23: "point_start", 24: "point_x", 25: "point_y", 26: "X-AXIS", 27: "AXIS-TEXT-DELIMITER", 28: "Y-AXIS", 29: "QUADRANT_1", 30: "QUADRANT_2", 31: "QUADRANT_3", 32: "QUADRANT_4", 36: ":", 38: "NEWLINE", 39: "SEMI", 40: "EOF", 41: "open_directive", 42: "type_directive", 43: "arg_directive", 44: "close_directive", 47: "STR", 48: "MD_STR", 50: "PUNCTUATION", 51: "AMP", 52: "NUM", 53: "ALPHA", 54: "COMMA", 55: "PLUS", 56: "EQUALS", 57: "MULT", 58: "DOT", 59: "BRKT", 60: "UNDERSCORE", 61: "MINUS" },
    productions_: [0, [3, 2], [3, 2], [3, 2], [3, 2], [8, 0], [8, 2], [9, 2], [10, 0], [10, 2], [10, 1], [10, 1], [10, 1], [10, 2], [10, 2], [10, 2], [10, 1], [10, 1], [10, 1], [13, 4], [11, 4], [11, 3], [11, 2], [11, 4], [11, 3], [11, 2], [12, 2], [12, 2], [12, 2], [12, 2], [6, 3], [6, 5], [4, 1], [4, 1], [4, 1], [33, 1], [34, 1], [37, 1], [35, 1], [22, 1], [22, 2], [22, 1], [22, 1], [49, 1], [49, 2], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [45, 1], [46, 1], [46, 1], [46, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 13:
          this.$ = $$[$0].trim();
          yy.setDiagramTitle(this.$);
          break;
        case 14:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 15:
        case 16:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 17:
          yy.addSection($$[$0].substr(8));
          this.$ = $$[$0].substr(8);
          break;
        case 19:
          yy.addPoint($$[$0 - 3], $$[$0 - 1], $$[$0]);
          break;
        case 20:
          yy.setXAxisLeftText($$[$0 - 2]);
          yy.setXAxisRightText($$[$0]);
          break;
        case 21:
          $$[$0 - 1].text += " ⟶ ";
          yy.setXAxisLeftText($$[$0 - 1]);
          break;
        case 22:
          yy.setXAxisLeftText($$[$0]);
          break;
        case 23:
          yy.setYAxisBottomText($$[$0 - 2]);
          yy.setYAxisTopText($$[$0]);
          break;
        case 24:
          $$[$0 - 1].text += " ⟶ ";
          yy.setYAxisBottomText($$[$0 - 1]);
          break;
        case 25:
          yy.setYAxisBottomText($$[$0]);
          break;
        case 26:
          yy.setQuadrant1Text($$[$0]);
          break;
        case 27:
          yy.setQuadrant2Text($$[$0]);
          break;
        case 28:
          yy.setQuadrant3Text($$[$0]);
          break;
        case 29:
          yy.setQuadrant4Text($$[$0]);
          break;
        case 35:
          yy.parseDirective("%%{", "open_directive");
          break;
        case 36:
          yy.parseDirective($$[$0], "type_directive");
          break;
        case 37:
          $$[$0] = $$[$0].trim().replace(/'/g, '"');
          yy.parseDirective($$[$0], "arg_directive");
          break;
        case 38:
          yy.parseDirective("}%%", "close_directive", "quadrantChart");
          break;
        case 39:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 40:
          this.$ = { text: $$[$0 - 1].text + "" + $$[$0], type: $$[$0 - 1].type };
          break;
        case 41:
          this.$ = { text: $$[$0], type: "text" };
          break;
        case 42:
          this.$ = { text: $$[$0], type: "markdown" };
          break;
        case 43:
          this.$ = $$[$0];
          break;
        case 44:
          this.$ = $$[$0 - 1] + "" + $$[$0];
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 5: $V0, 6: 4, 7: $V1, 33: 9, 38: $V2, 39: $V3, 40: $V4, 41: $V5 }, { 1: [3] }, { 3: 11, 4: 2, 5: $V0, 6: 4, 7: $V1, 33: 9, 38: $V2, 39: $V3, 40: $V4, 41: $V5 }, { 3: 12, 4: 2, 5: $V0, 6: 4, 7: $V1, 33: 9, 38: $V2, 39: $V3, 40: $V4, 41: $V5 }, { 3: 13, 4: 2, 5: $V0, 6: 4, 7: $V1, 33: 9, 38: $V2, 39: $V3, 40: $V4, 41: $V5 }, o($V6, [2, 5], { 8: 14 }), o($V7, [2, 32]), o($V7, [2, 33]), o($V7, [2, 34]), { 34: 15, 42: [1, 16] }, { 42: [2, 35] }, { 1: [2, 1] }, { 1: [2, 2] }, { 1: [2, 3] }, o($V8, $V9, { 33: 9, 9: 17, 10: 18, 11: 20, 12: 21, 13: 22, 6: 28, 22: 35, 45: 36, 1: [2, 4], 5: $Va, 14: $Vb, 16: $Vc, 18: $Vd, 20: $Ve, 21: $Vf, 26: $Vg, 28: $Vh, 29: $Vi, 30: $Vj, 31: $Vk, 32: $Vl, 41: $V5, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }), { 35: 50, 36: [1, 51], 44: $Vz }, o([36, 44], [2, 36]), o($V6, [2, 6]), { 4: 53, 38: $V2, 39: $V3, 40: $V4 }, o($V8, $V9, { 33: 9, 11: 20, 12: 21, 13: 22, 6: 28, 22: 35, 45: 36, 10: 54, 5: $Va, 14: $Vb, 16: $Vc, 18: $Vd, 20: $Ve, 21: $Vf, 26: $Vg, 28: $Vh, 29: $Vi, 30: $Vj, 31: $Vk, 32: $Vl, 41: $V5, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }), o($V8, [2, 10]), o($V8, [2, 11]), o($V8, [2, 12]), { 15: [1, 55] }, { 17: [1, 56] }, { 19: [1, 57] }, o($V8, [2, 16]), o($V8, [2, 17]), o($V8, [2, 18]), { 22: 58, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 22: 59, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 22: 60, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 22: 61, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 22: 62, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 22: 63, 45: 36, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }, { 5: $VA, 23: [1, 64], 45: 66, 46: 65, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }, o($VC, [2, 39]), o($VC, [2, 41]), o($VC, [2, 42]), o($VC, [2, 45]), o($VC, [2, 46]), o($VC, [2, 47]), o($VC, [2, 48]), o($VC, [2, 49]), o($VC, [2, 50]), o($VC, [2, 51]), o($VC, [2, 52]), o($VC, [2, 53]), o($VC, [2, 54]), o($VC, [2, 55]), o($VD, [2, 30]), { 37: 69, 43: [1, 70] }, o($VD, [2, 38]), o($V6, [2, 7]), o($V8, [2, 9]), o($V8, [2, 13]), o($V8, [2, 14]), o($V8, [2, 15]), o($V8, [2, 22], { 46: 65, 45: 66, 5: $VA, 27: [1, 71], 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 25], { 46: 65, 45: 66, 5: $VA, 27: [1, 72], 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 26], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 27], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 28], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 29], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), { 24: [1, 73] }, o($VC, [2, 40]), o($VC, [2, 56]), o($VC, [2, 57]), o($VC, [2, 58]), { 35: 74, 44: $Vz }, { 44: [2, 37] }, o($V8, [2, 21], { 45: 36, 22: 75, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }), o($V8, [2, 24], { 45: 36, 22: 76, 47: $Vm, 48: $Vn, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy }), { 25: [1, 77] }, o($VD, [2, 31]), o($V8, [2, 20], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 23], { 46: 65, 45: 66, 5: $VA, 50: $Vo, 51: $Vp, 52: $Vq, 53: $Vr, 54: $Vs, 55: $Vt, 56: $Vu, 57: $Vv, 58: $Vw, 59: $Vx, 60: $Vy, 61: $VB }), o($V8, [2, 19])],
    defaultActions: { 10: [2, 35], 11: [2, 1], 12: [2, 2], 13: [2, 3], 70: [2, 37] },
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function() {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      // return next match in input
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: { "case-insensitive": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            this.begin("open_directive");
            return 41;
          case 1:
            this.begin("type_directive");
            return 42;
          case 2:
            this.popState();
            this.begin("arg_directive");
            return 36;
          case 3:
            this.popState();
            this.popState();
            return 44;
          case 4:
            return 43;
          case 5:
            break;
          case 6:
            break;
          case 7:
            return 38;
          case 8:
            break;
          case 9:
            this.begin("title");
            return 14;
          case 10:
            this.popState();
            return "title_value";
          case 11:
            this.begin("acc_title");
            return 16;
          case 12:
            this.popState();
            return "acc_title_value";
          case 13:
            this.begin("acc_descr");
            return 18;
          case 14:
            this.popState();
            return "acc_descr_value";
          case 15:
            this.begin("acc_descr_multiline");
            break;
          case 16:
            this.popState();
            break;
          case 17:
            return "acc_descr_multiline_value";
          case 18:
            return 26;
          case 19:
            return 28;
          case 20:
            return 27;
          case 21:
            return 29;
          case 22:
            return 30;
          case 23:
            return 31;
          case 24:
            return 32;
          case 25:
            this.begin("md_string");
            break;
          case 26:
            return "MD_STR";
          case 27:
            this.popState();
            break;
          case 28:
            this.begin("string");
            break;
          case 29:
            this.popState();
            break;
          case 30:
            return "STR";
          case 31:
            this.begin("point_start");
            return 23;
          case 32:
            this.begin("point_x");
            return 24;
          case 33:
            this.popState();
            break;
          case 34:
            this.popState();
            this.begin("point_y");
            break;
          case 35:
            this.popState();
            return 25;
          case 36:
            return 7;
          case 37:
            return 53;
          case 38:
            return "COLON";
          case 39:
            return 55;
          case 40:
            return 54;
          case 41:
            return 56;
          case 42:
            return 56;
          case 43:
            return 57;
          case 44:
            return 59;
          case 45:
            return 60;
          case 46:
            return 58;
          case 47:
            return 51;
          case 48:
            return 61;
          case 49:
            return 52;
          case 50:
            return 5;
          case 51:
            return 39;
          case 52:
            return 50;
          case 53:
            return 40;
        }
      },
      rules: [/^(?:%%\{)/i, /^(?:((?:(?!\}%%)[^:.])*))/i, /^(?::)/i, /^(?:\}%%)/i, /^(?:((?:(?!\}%%).|\n)*))/i, /^(?:%%(?!\{)[^\n]*)/i, /^(?:[^\}]%%[^\n]*)/i, /^(?:[\n\r]+)/i, /^(?:%%[^\n]*)/i, /^(?:title\b)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accTitle\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*\{\s*)/i, /^(?:[\}])/i, /^(?:[^\}]*)/i, /^(?: *x-axis *)/i, /^(?: *y-axis *)/i, /^(?: *--+> *)/i, /^(?: *quadrant-1 *)/i, /^(?: *quadrant-2 *)/i, /^(?: *quadrant-3 *)/i, /^(?: *quadrant-4 *)/i, /^(?:["][`])/i, /^(?:[^`"]+)/i, /^(?:[`]["])/i, /^(?:["])/i, /^(?:["])/i, /^(?:[^"]*)/i, /^(?:\s*:\s*\[\s*)/i, /^(?:(1)|(0(.\d+)?))/i, /^(?:\s*\] *)/i, /^(?:\s*,\s*)/i, /^(?:(1)|(0(.\d+)?))/i, /^(?: *quadrantChart *)/i, /^(?:[A-Za-z]+)/i, /^(?::)/i, /^(?:\+)/i, /^(?:,)/i, /^(?:=)/i, /^(?:=)/i, /^(?:\*)/i, /^(?:#)/i, /^(?:[\_])/i, /^(?:\.)/i, /^(?:&)/i, /^(?:-)/i, /^(?:[0-9]+)/i, /^(?:\s)/i, /^(?:;)/i, /^(?:[!"#$%&'*+,-.`?\\_/])/i, /^(?:$)/i],
      conditions: { "point_y": { "rules": [35], "inclusive": false }, "point_x": { "rules": [34], "inclusive": false }, "point_start": { "rules": [32, 33], "inclusive": false }, "acc_descr_multiline": { "rules": [16, 17], "inclusive": false }, "acc_descr": { "rules": [14], "inclusive": false }, "acc_title": { "rules": [12], "inclusive": false }, "close_directive": { "rules": [], "inclusive": false }, "arg_directive": { "rules": [3, 4], "inclusive": false }, "type_directive": { "rules": [2, 3], "inclusive": false }, "open_directive": { "rules": [1], "inclusive": false }, "title": { "rules": [10], "inclusive": false }, "md_string": { "rules": [26, 27], "inclusive": false }, "string": { "rules": [29, 30], "inclusive": false }, "INITIAL": { "rules": [0, 5, 6, 7, 8, 9, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24, 25, 28, 31, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const parser$1 = parser;
const defaultThemeVariables = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.G)();
class QuadrantBuilder {
  constructor() {
    this.config = this.getDefaultConfig();
    this.themeConfig = this.getDefaultThemeConfig();
    this.data = this.getDefaultData();
  }
  getDefaultData() {
    return {
      titleText: "",
      quadrant1Text: "",
      quadrant2Text: "",
      quadrant3Text: "",
      quadrant4Text: "",
      xAxisLeftText: "",
      xAxisRightText: "",
      yAxisBottomText: "",
      yAxisTopText: "",
      points: []
    };
  }
  getDefaultConfig() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    return {
      showXAxis: true,
      showYAxis: true,
      showTitle: true,
      chartHeight: ((_a = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _a.chartWidth) || 500,
      chartWidth: ((_b = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _b.chartHeight) || 500,
      titlePadding: ((_c = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _c.titlePadding) || 10,
      titleFontSize: ((_d = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _d.titleFontSize) || 20,
      quadrantPadding: ((_e = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _e.quadrantPadding) || 5,
      xAxisLabelPadding: ((_f = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _f.xAxisLabelPadding) || 5,
      yAxisLabelPadding: ((_g = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _g.yAxisLabelPadding) || 5,
      xAxisLabelFontSize: ((_h = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _h.xAxisLabelFontSize) || 16,
      yAxisLabelFontSize: ((_i = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _i.yAxisLabelFontSize) || 16,
      quadrantLabelFontSize: ((_j = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _j.quadrantLabelFontSize) || 16,
      quadrantTextTopPadding: ((_k = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _k.quadrantTextTopPadding) || 5,
      pointTextPadding: ((_l = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _l.pointTextPadding) || 5,
      pointLabelFontSize: ((_m = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _m.pointLabelFontSize) || 12,
      pointRadius: ((_n = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _n.pointRadius) || 5,
      xAxisPosition: ((_o = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _o.xAxisPosition) || "top",
      yAxisPosition: ((_p = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _p.yAxisPosition) || "left",
      quadrantInternalBorderStrokeWidth: ((_q = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _q.quadrantInternalBorderStrokeWidth) || 1,
      quadrantExternalBorderStrokeWidth: ((_r = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.C.quadrantChart) == null ? void 0 : _r.quadrantExternalBorderStrokeWidth) || 2
    };
  }
  getDefaultThemeConfig() {
    return {
      quadrant1Fill: defaultThemeVariables.quadrant1Fill,
      quadrant2Fill: defaultThemeVariables.quadrant2Fill,
      quadrant3Fill: defaultThemeVariables.quadrant3Fill,
      quadrant4Fill: defaultThemeVariables.quadrant4Fill,
      quadrant1TextFill: defaultThemeVariables.quadrant1TextFill,
      quadrant2TextFill: defaultThemeVariables.quadrant2TextFill,
      quadrant3TextFill: defaultThemeVariables.quadrant3TextFill,
      quadrant4TextFill: defaultThemeVariables.quadrant4TextFill,
      quadrantPointFill: defaultThemeVariables.quadrantPointFill,
      quadrantPointTextFill: defaultThemeVariables.quadrantPointTextFill,
      quadrantXAxisTextFill: defaultThemeVariables.quadrantXAxisTextFill,
      quadrantYAxisTextFill: defaultThemeVariables.quadrantYAxisTextFill,
      quadrantTitleFill: defaultThemeVariables.quadrantTitleFill,
      quadrantInternalBorderStrokeFill: defaultThemeVariables.quadrantInternalBorderStrokeFill,
      quadrantExternalBorderStrokeFill: defaultThemeVariables.quadrantExternalBorderStrokeFill
    };
  }
  clear() {
    this.config = this.getDefaultConfig();
    this.themeConfig = this.getDefaultThemeConfig();
    this.data = this.getDefaultData();
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.info("clear called");
  }
  setData(data) {
    this.data = { ...this.data, ...data };
  }
  addPoints(points) {
    this.data.points = [...points, ...this.data.points];
  }
  setConfig(config2) {
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("setConfig called with: ", config2);
    this.config = { ...this.config, ...config2 };
  }
  setThemeConfig(themeConfig) {
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.trace("setThemeConfig called with: ", themeConfig);
    this.themeConfig = { ...this.themeConfig, ...themeConfig };
  }
  calculateSpace(xAxisPosition, showXAxis, showYAxis, showTitle) {
    const xAxisSpaceCalculation = this.config.xAxisLabelPadding * 2 + this.config.xAxisLabelFontSize;
    const xAxisSpace = {
      top: xAxisPosition === "top" && showXAxis ? xAxisSpaceCalculation : 0,
      bottom: xAxisPosition === "bottom" && showXAxis ? xAxisSpaceCalculation : 0
    };
    const yAxisSpaceCalculation = this.config.yAxisLabelPadding * 2 + this.config.yAxisLabelFontSize;
    const yAxisSpace = {
      left: this.config.yAxisPosition === "left" && showYAxis ? yAxisSpaceCalculation : 0,
      right: this.config.yAxisPosition === "right" && showYAxis ? yAxisSpaceCalculation : 0
    };
    const titleSpaceCalculation = this.config.titleFontSize + this.config.titlePadding * 2;
    const titleSpace = {
      top: showTitle ? titleSpaceCalculation : 0
    };
    const quadrantLeft = this.config.quadrantPadding + yAxisSpace.left;
    const quadrantTop = this.config.quadrantPadding + xAxisSpace.top + titleSpace.top;
    const quadrantWidth = this.config.chartWidth - this.config.quadrantPadding * 2 - yAxisSpace.left - yAxisSpace.right;
    const quadrantHeight = this.config.chartHeight - this.config.quadrantPadding * 2 - xAxisSpace.top - xAxisSpace.bottom - titleSpace.top;
    const quadrantHalfWidth = quadrantWidth / 2;
    const quadrantHalfHeight = quadrantHeight / 2;
    const quadrantSpace = {
      quadrantLeft,
      quadrantTop,
      quadrantWidth,
      quadrantHalfWidth,
      quadrantHeight,
      quadrantHalfHeight
    };
    return {
      xAxisSpace,
      yAxisSpace,
      titleSpace,
      quadrantSpace
    };
  }
  getAxisLabels(xAxisPosition, showXAxis, showYAxis, spaceData) {
    const { quadrantSpace, titleSpace } = spaceData;
    const {
      quadrantHalfHeight,
      quadrantHeight,
      quadrantLeft,
      quadrantHalfWidth,
      quadrantTop,
      quadrantWidth
    } = quadrantSpace;
    const drawAxisLabelInMiddle = this.data.points.length === 0;
    const axisLabels = [];
    if (this.data.xAxisLeftText && showXAxis) {
      axisLabels.push({
        text: this.data.xAxisLeftText,
        fill: this.themeConfig.quadrantXAxisTextFill,
        x: quadrantLeft + (drawAxisLabelInMiddle ? quadrantHalfWidth / 2 : 0),
        y: xAxisPosition === "top" ? this.config.xAxisLabelPadding + titleSpace.top : this.config.xAxisLabelPadding + quadrantTop + quadrantHeight + this.config.quadrantPadding,
        fontSize: this.config.xAxisLabelFontSize,
        verticalPos: drawAxisLabelInMiddle ? "center" : "left",
        horizontalPos: "top",
        rotation: 0
      });
    }
    if (this.data.xAxisRightText && showXAxis) {
      axisLabels.push({
        text: this.data.xAxisRightText,
        fill: this.themeConfig.quadrantXAxisTextFill,
        x: quadrantLeft + quadrantHalfWidth + (drawAxisLabelInMiddle ? quadrantHalfWidth / 2 : 0),
        y: xAxisPosition === "top" ? this.config.xAxisLabelPadding + titleSpace.top : this.config.xAxisLabelPadding + quadrantTop + quadrantHeight + this.config.quadrantPadding,
        fontSize: this.config.xAxisLabelFontSize,
        verticalPos: drawAxisLabelInMiddle ? "center" : "left",
        horizontalPos: "top",
        rotation: 0
      });
    }
    if (this.data.yAxisBottomText && showYAxis) {
      axisLabels.push({
        text: this.data.yAxisBottomText,
        fill: this.themeConfig.quadrantYAxisTextFill,
        x: this.config.yAxisPosition === "left" ? this.config.yAxisLabelPadding : this.config.yAxisLabelPadding + quadrantLeft + quadrantWidth + this.config.quadrantPadding,
        y: quadrantTop + quadrantHeight - (drawAxisLabelInMiddle ? quadrantHalfHeight / 2 : 0),
        fontSize: this.config.yAxisLabelFontSize,
        verticalPos: drawAxisLabelInMiddle ? "center" : "left",
        horizontalPos: "top",
        rotation: -90
      });
    }
    if (this.data.yAxisTopText && showYAxis) {
      axisLabels.push({
        text: this.data.yAxisTopText,
        fill: this.themeConfig.quadrantYAxisTextFill,
        x: this.config.yAxisPosition === "left" ? this.config.yAxisLabelPadding : this.config.yAxisLabelPadding + quadrantLeft + quadrantWidth + this.config.quadrantPadding,
        y: quadrantTop + quadrantHalfHeight - (drawAxisLabelInMiddle ? quadrantHalfHeight / 2 : 0),
        fontSize: this.config.yAxisLabelFontSize,
        verticalPos: drawAxisLabelInMiddle ? "center" : "left",
        horizontalPos: "top",
        rotation: -90
      });
    }
    return axisLabels;
  }
  getQuadrants(spaceData) {
    const { quadrantSpace } = spaceData;
    const { quadrantHalfHeight, quadrantLeft, quadrantHalfWidth, quadrantTop } = quadrantSpace;
    const quadrants = [
      {
        text: {
          text: this.data.quadrant1Text,
          fill: this.themeConfig.quadrant1TextFill,
          x: 0,
          y: 0,
          fontSize: this.config.quadrantLabelFontSize,
          verticalPos: "center",
          horizontalPos: "middle",
          rotation: 0
        },
        x: quadrantLeft + quadrantHalfWidth,
        y: quadrantTop,
        width: quadrantHalfWidth,
        height: quadrantHalfHeight,
        fill: this.themeConfig.quadrant1Fill
      },
      {
        text: {
          text: this.data.quadrant2Text,
          fill: this.themeConfig.quadrant2TextFill,
          x: 0,
          y: 0,
          fontSize: this.config.quadrantLabelFontSize,
          verticalPos: "center",
          horizontalPos: "middle",
          rotation: 0
        },
        x: quadrantLeft,
        y: quadrantTop,
        width: quadrantHalfWidth,
        height: quadrantHalfHeight,
        fill: this.themeConfig.quadrant2Fill
      },
      {
        text: {
          text: this.data.quadrant3Text,
          fill: this.themeConfig.quadrant3TextFill,
          x: 0,
          y: 0,
          fontSize: this.config.quadrantLabelFontSize,
          verticalPos: "center",
          horizontalPos: "middle",
          rotation: 0
        },
        x: quadrantLeft,
        y: quadrantTop + quadrantHalfHeight,
        width: quadrantHalfWidth,
        height: quadrantHalfHeight,
        fill: this.themeConfig.quadrant3Fill
      },
      {
        text: {
          text: this.data.quadrant4Text,
          fill: this.themeConfig.quadrant4TextFill,
          x: 0,
          y: 0,
          fontSize: this.config.quadrantLabelFontSize,
          verticalPos: "center",
          horizontalPos: "middle",
          rotation: 0
        },
        x: quadrantLeft + quadrantHalfWidth,
        y: quadrantTop + quadrantHalfHeight,
        width: quadrantHalfWidth,
        height: quadrantHalfHeight,
        fill: this.themeConfig.quadrant4Fill
      }
    ];
    for (const quadrant of quadrants) {
      quadrant.text.x = quadrant.x + quadrant.width / 2;
      if (this.data.points.length === 0) {
        quadrant.text.y = quadrant.y + quadrant.height / 2;
        quadrant.text.horizontalPos = "middle";
      } else {
        quadrant.text.y = quadrant.y + this.config.quadrantTextTopPadding;
        quadrant.text.horizontalPos = "top";
      }
    }
    return quadrants;
  }
  getQuadrantPoints(spaceData) {
    const { quadrantSpace } = spaceData;
    const { quadrantHeight, quadrantLeft, quadrantTop, quadrantWidth } = quadrantSpace;
    const xAxis = (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .scaleLinear */ .BYU)().domain([0, 1]).range([quadrantLeft, quadrantWidth + quadrantLeft]);
    const yAxis = (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .scaleLinear */ .BYU)().domain([0, 1]).range([quadrantHeight + quadrantTop, quadrantTop]);
    const points = this.data.points.map((point) => {
      const props = {
        x: xAxis(point.x),
        y: yAxis(point.y),
        fill: this.themeConfig.quadrantPointFill,
        radius: this.config.pointRadius,
        text: {
          text: point.text,
          fill: this.themeConfig.quadrantPointTextFill,
          x: xAxis(point.x),
          y: yAxis(point.y) + this.config.pointTextPadding,
          verticalPos: "center",
          horizontalPos: "top",
          fontSize: this.config.pointLabelFontSize,
          rotation: 0
        }
      };
      return props;
    });
    return points;
  }
  getBorders(spaceData) {
    const halfExternalBorderWidth = this.config.quadrantExternalBorderStrokeWidth / 2;
    const { quadrantSpace } = spaceData;
    const {
      quadrantHalfHeight,
      quadrantHeight,
      quadrantLeft,
      quadrantHalfWidth,
      quadrantTop,
      quadrantWidth
    } = quadrantSpace;
    const borderLines = [
      // top border
      {
        strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
        strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
        x1: quadrantLeft - halfExternalBorderWidth,
        y1: quadrantTop,
        x2: quadrantLeft + quadrantWidth + halfExternalBorderWidth,
        y2: quadrantTop
      },
      // right border
      {
        strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
        strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
        x1: quadrantLeft + quadrantWidth,
        y1: quadrantTop + halfExternalBorderWidth,
        x2: quadrantLeft + quadrantWidth,
        y2: quadrantTop + quadrantHeight - halfExternalBorderWidth
      },
      // bottom border
      {
        strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
        strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
        x1: quadrantLeft - halfExternalBorderWidth,
        y1: quadrantTop + quadrantHeight,
        x2: quadrantLeft + quadrantWidth + halfExternalBorderWidth,
        y2: quadrantTop + quadrantHeight
      },
      // left border
      {
        strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
        strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
        x1: quadrantLeft,
        y1: quadrantTop + halfExternalBorderWidth,
        x2: quadrantLeft,
        y2: quadrantTop + quadrantHeight - halfExternalBorderWidth
      },
      // vertical inner border
      {
        strokeFill: this.themeConfig.quadrantInternalBorderStrokeFill,
        strokeWidth: this.config.quadrantInternalBorderStrokeWidth,
        x1: quadrantLeft + quadrantHalfWidth,
        y1: quadrantTop + halfExternalBorderWidth,
        x2: quadrantLeft + quadrantHalfWidth,
        y2: quadrantTop + quadrantHeight - halfExternalBorderWidth
      },
      // horizontal inner border
      {
        strokeFill: this.themeConfig.quadrantInternalBorderStrokeFill,
        strokeWidth: this.config.quadrantInternalBorderStrokeWidth,
        x1: quadrantLeft + halfExternalBorderWidth,
        y1: quadrantTop + quadrantHalfHeight,
        x2: quadrantLeft + quadrantWidth - halfExternalBorderWidth,
        y2: quadrantTop + quadrantHalfHeight
      }
    ];
    return borderLines;
  }
  getTitle(showTitle) {
    if (showTitle) {
      return {
        text: this.data.titleText,
        fill: this.themeConfig.quadrantTitleFill,
        fontSize: this.config.titleFontSize,
        horizontalPos: "top",
        verticalPos: "center",
        rotation: 0,
        y: this.config.titlePadding,
        x: this.config.chartWidth / 2
      };
    }
    return;
  }
  build() {
    const showXAxis = this.config.showXAxis && !!(this.data.xAxisLeftText || this.data.xAxisRightText);
    const showYAxis = this.config.showYAxis && !!(this.data.yAxisTopText || this.data.yAxisBottomText);
    const showTitle = this.config.showTitle && !!this.data.titleText;
    const xAxisPosition = this.data.points.length > 0 ? "bottom" : this.config.xAxisPosition;
    const calculatedSpace = this.calculateSpace(xAxisPosition, showXAxis, showYAxis, showTitle);
    return {
      points: this.getQuadrantPoints(calculatedSpace),
      quadrants: this.getQuadrants(calculatedSpace),
      axisLabels: this.getAxisLabels(xAxisPosition, showXAxis, showYAxis, calculatedSpace),
      borderLines: this.getBorders(calculatedSpace),
      title: this.getTitle(showTitle)
    };
  }
}
const config = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)();
function textSanitizer(text) {
  return (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.d)(text.trim(), config);
}
const quadrantBuilder = new QuadrantBuilder();
function setQuadrant1Text(textObj) {
  quadrantBuilder.setData({ quadrant1Text: textSanitizer(textObj.text) });
}
function setQuadrant2Text(textObj) {
  quadrantBuilder.setData({ quadrant2Text: textSanitizer(textObj.text) });
}
function setQuadrant3Text(textObj) {
  quadrantBuilder.setData({ quadrant3Text: textSanitizer(textObj.text) });
}
function setQuadrant4Text(textObj) {
  quadrantBuilder.setData({ quadrant4Text: textSanitizer(textObj.text) });
}
function setXAxisLeftText(textObj) {
  quadrantBuilder.setData({ xAxisLeftText: textSanitizer(textObj.text) });
}
function setXAxisRightText(textObj) {
  quadrantBuilder.setData({ xAxisRightText: textSanitizer(textObj.text) });
}
function setYAxisTopText(textObj) {
  quadrantBuilder.setData({ yAxisTopText: textSanitizer(textObj.text) });
}
function setYAxisBottomText(textObj) {
  quadrantBuilder.setData({ yAxisBottomText: textSanitizer(textObj.text) });
}
function addPoint(textObj, x, y) {
  quadrantBuilder.addPoints([{ x, y, text: textSanitizer(textObj.text) }]);
}
function setWidth(width) {
  quadrantBuilder.setConfig({ chartWidth: width });
}
function setHeight(height) {
  quadrantBuilder.setConfig({ chartHeight: height });
}
function getQuadrantData() {
  const config2 = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)();
  const { themeVariables, quadrantChart: quadrantChartConfig } = config2;
  if (quadrantChartConfig) {
    quadrantBuilder.setConfig(quadrantChartConfig);
  }
  quadrantBuilder.setThemeConfig({
    quadrant1Fill: themeVariables.quadrant1Fill,
    quadrant2Fill: themeVariables.quadrant2Fill,
    quadrant3Fill: themeVariables.quadrant3Fill,
    quadrant4Fill: themeVariables.quadrant4Fill,
    quadrant1TextFill: themeVariables.quadrant1TextFill,
    quadrant2TextFill: themeVariables.quadrant2TextFill,
    quadrant3TextFill: themeVariables.quadrant3TextFill,
    quadrant4TextFill: themeVariables.quadrant4TextFill,
    quadrantPointFill: themeVariables.quadrantPointFill,
    quadrantPointTextFill: themeVariables.quadrantPointTextFill,
    quadrantXAxisTextFill: themeVariables.quadrantXAxisTextFill,
    quadrantYAxisTextFill: themeVariables.quadrantYAxisTextFill,
    quadrantExternalBorderStrokeFill: themeVariables.quadrantExternalBorderStrokeFill,
    quadrantInternalBorderStrokeFill: themeVariables.quadrantInternalBorderStrokeFill,
    quadrantTitleFill: themeVariables.quadrantTitleFill
  });
  quadrantBuilder.setData({ titleText: (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.t)() });
  return quadrantBuilder.build();
}
const parseDirective = function(statement, context, type) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.m.parseDirective(this, statement, context, type);
};
const clear = function() {
  quadrantBuilder.clear();
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.v)();
};
const db = {
  setWidth,
  setHeight,
  setQuadrant1Text,
  setQuadrant2Text,
  setQuadrant3Text,
  setQuadrant4Text,
  setXAxisLeftText,
  setXAxisRightText,
  setYAxisTopText,
  setYAxisBottomText,
  addPoint,
  getQuadrantData,
  parseDirective,
  clear,
  setAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.s,
  getAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.g,
  setDiagramTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.r,
  getDiagramTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.t,
  getAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.a,
  setAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.b
};
const draw = (txt, id, _version, diagObj) => {
  var _a, _b, _c;
  function getDominantBaseLine(horizontalPos) {
    return horizontalPos === "top" ? "hanging" : "middle";
  }
  function getTextAnchor(verticalPos) {
    return verticalPos === "left" ? "start" : "middle";
  }
  function getTransformation(data) {
    return `translate(${data.x}, ${data.y}) rotate(${data.rotation || 0})`;
  }
  const conf = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)();
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Rendering quadrant chart\n" + txt);
  const securityLevel = conf.securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)("#i" + id);
  }
  const root = securityLevel === "sandbox" ? (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)(sandboxElement.nodes()[0].contentDocument.body) : (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)("body");
  const svg = root.select(`[id="${id}"]`);
  const group = svg.append("g").attr("class", "main");
  const width = ((_a = conf.quadrantChart) == null ? void 0 : _a.chartWidth) || 500;
  const height = ((_b = conf.quadrantChart) == null ? void 0 : _b.chartHeight) || 500;
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.i)(svg, height, width, ((_c = conf.quadrantChart) == null ? void 0 : _c.useMaxWidth) || true);
  svg.attr("viewBox", "0 0 " + width + " " + height);
  diagObj.db.setHeight(height);
  diagObj.db.setWidth(width);
  const quadrantData = diagObj.db.getQuadrantData();
  const quadrantsGroup = group.append("g").attr("class", "quadrants");
  const borderGroup = group.append("g").attr("class", "border");
  const dataPointGroup = group.append("g").attr("class", "data-points");
  const labelGroup = group.append("g").attr("class", "labels");
  const titleGroup = group.append("g").attr("class", "title");
  if (quadrantData.title) {
    titleGroup.append("text").attr("x", 0).attr("y", 0).attr("fill", quadrantData.title.fill).attr("font-size", quadrantData.title.fontSize).attr("dominant-baseline", getDominantBaseLine(quadrantData.title.horizontalPos)).attr("text-anchor", getTextAnchor(quadrantData.title.verticalPos)).attr("transform", getTransformation(quadrantData.title)).text(quadrantData.title.text);
  }
  if (quadrantData.borderLines) {
    borderGroup.selectAll("line").data(quadrantData.borderLines).enter().append("line").attr("x1", (data) => data.x1).attr("y1", (data) => data.y1).attr("x2", (data) => data.x2).attr("y2", (data) => data.y2).style("stroke", (data) => data.strokeFill).style("stroke-width", (data) => data.strokeWidth);
  }
  const quadrants = quadrantsGroup.selectAll("g.quadrant").data(quadrantData.quadrants).enter().append("g").attr("class", "quadrant");
  quadrants.append("rect").attr("x", (data) => data.x).attr("y", (data) => data.y).attr("width", (data) => data.width).attr("height", (data) => data.height).attr("fill", (data) => data.fill);
  quadrants.append("text").attr("x", 0).attr("y", 0).attr("fill", (data) => data.text.fill).attr("font-size", (data) => data.text.fontSize).attr(
    "dominant-baseline",
    (data) => getDominantBaseLine(data.text.horizontalPos)
  ).attr("text-anchor", (data) => getTextAnchor(data.text.verticalPos)).attr("transform", (data) => getTransformation(data.text)).text((data) => data.text.text);
  const labels = labelGroup.selectAll("g.label").data(quadrantData.axisLabels).enter().append("g").attr("class", "label");
  labels.append("text").attr("x", 0).attr("y", 0).text((data) => data.text).attr("fill", (data) => data.fill).attr("font-size", (data) => data.fontSize).attr("dominant-baseline", (data) => getDominantBaseLine(data.horizontalPos)).attr("text-anchor", (data) => getTextAnchor(data.verticalPos)).attr("transform", (data) => getTransformation(data));
  const dataPoints = dataPointGroup.selectAll("g.data-point").data(quadrantData.points).enter().append("g").attr("class", "data-point");
  dataPoints.append("circle").attr("cx", (data) => data.x).attr("cy", (data) => data.y).attr("r", (data) => data.radius).attr("fill", (data) => data.fill);
  dataPoints.append("text").attr("x", 0).attr("y", 0).text((data) => data.text.text).attr("fill", (data) => data.text.fill).attr("font-size", (data) => data.text.fontSize).attr(
    "dominant-baseline",
    (data) => getDominantBaseLine(data.text.horizontalPos)
  ).attr("text-anchor", (data) => getTextAnchor(data.text.verticalPos)).attr("transform", (data) => getTransformation(data.text));
};
const renderer = {
  draw
};
const diagram = {
  parser: parser$1,
  db,
  renderer,
  styles: () => ""
};



/***/ })

};
;