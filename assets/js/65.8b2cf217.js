"use strict";
exports.id = 65;
exports.ids = [65];
exports.modules = {

/***/ 47065:
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
  }, $V0 = [1, 4], $V1 = [1, 7], $V2 = [1, 5], $V3 = [1, 9], $V4 = [1, 6], $V5 = [2, 6], $V6 = [1, 16], $V7 = [6, 8, 14, 20, 22, 24, 25, 27, 29, 32, 37, 40, 50, 55], $V8 = [8, 14, 20, 22, 24, 25, 27, 29, 32, 37, 40], $V9 = [8, 13, 14, 20, 22, 24, 25, 27, 29, 32, 37, 40], $Va = [1, 26], $Vb = [6, 8, 14, 50, 55], $Vc = [8, 14, 55], $Vd = [1, 53], $Ve = [1, 52], $Vf = [8, 14, 30, 33, 35, 38, 55], $Vg = [1, 67], $Vh = [1, 68], $Vi = [1, 69], $Vj = [8, 14, 33, 35, 42, 55];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "eol": 4, "directive": 5, "GG": 6, "document": 7, "EOF": 8, ":": 9, "DIR": 10, "options": 11, "body": 12, "OPT": 13, "NL": 14, "line": 15, "statement": 16, "commitStatement": 17, "mergeStatement": 18, "cherryPickStatement": 19, "acc_title": 20, "acc_title_value": 21, "acc_descr": 22, "acc_descr_value": 23, "acc_descr_multiline_value": 24, "section": 25, "branchStatement": 26, "CHECKOUT": 27, "ref": 28, "BRANCH": 29, "ORDER": 30, "NUM": 31, "CHERRY_PICK": 32, "COMMIT_ID": 33, "STR": 34, "COMMIT_TAG": 35, "EMPTYSTR": 36, "MERGE": 37, "COMMIT_TYPE": 38, "commitType": 39, "COMMIT": 40, "commit_arg": 41, "COMMIT_MSG": 42, "NORMAL": 43, "REVERSE": 44, "HIGHLIGHT": 45, "openDirective": 46, "typeDirective": 47, "closeDirective": 48, "argDirective": 49, "open_directive": 50, "type_directive": 51, "arg_directive": 52, "close_directive": 53, "ID": 54, ";": 55, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 6: "GG", 8: "EOF", 9: ":", 10: "DIR", 13: "OPT", 14: "NL", 20: "acc_title", 21: "acc_title_value", 22: "acc_descr", 23: "acc_descr_value", 24: "acc_descr_multiline_value", 25: "section", 27: "CHECKOUT", 29: "BRANCH", 30: "ORDER", 31: "NUM", 32: "CHERRY_PICK", 33: "COMMIT_ID", 34: "STR", 35: "COMMIT_TAG", 36: "EMPTYSTR", 37: "MERGE", 38: "COMMIT_TYPE", 40: "COMMIT", 42: "COMMIT_MSG", 43: "NORMAL", 44: "REVERSE", 45: "HIGHLIGHT", 50: "open_directive", 51: "type_directive", 52: "arg_directive", 53: "close_directive", 54: "ID", 55: ";" },
    productions_: [0, [3, 2], [3, 2], [3, 3], [3, 4], [3, 5], [7, 0], [7, 2], [11, 2], [11, 1], [12, 0], [12, 2], [15, 2], [15, 1], [16, 1], [16, 1], [16, 1], [16, 2], [16, 2], [16, 1], [16, 1], [16, 1], [16, 2], [26, 2], [26, 4], [19, 3], [19, 5], [19, 5], [19, 5], [19, 5], [18, 2], [18, 4], [18, 4], [18, 4], [18, 6], [18, 6], [18, 6], [18, 6], [18, 6], [18, 6], [18, 8], [18, 8], [18, 8], [18, 8], [18, 8], [18, 8], [17, 2], [17, 3], [17, 3], [17, 5], [17, 5], [17, 3], [17, 5], [17, 5], [17, 5], [17, 5], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 3], [17, 5], [17, 5], [17, 5], [17, 5], [17, 5], [17, 5], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 7], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [17, 9], [41, 0], [41, 1], [39, 1], [39, 1], [39, 1], [5, 3], [5, 5], [46, 1], [47, 1], [49, 1], [48, 1], [28, 1], [28, 1], [4, 1], [4, 1], [4, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 3:
          return $$[$0];
        case 4:
          return $$[$0 - 1];
        case 5:
          yy.setDirection($$[$0 - 3]);
          return $$[$0 - 1];
        case 7:
          yy.setOptions($$[$0 - 1]);
          this.$ = $$[$0];
          break;
        case 8:
          $$[$0 - 1] += $$[$0];
          this.$ = $$[$0 - 1];
          break;
        case 10:
          this.$ = [];
          break;
        case 11:
          $$[$0 - 1].push($$[$0]);
          this.$ = $$[$0 - 1];
          break;
        case 12:
          this.$ = $$[$0 - 1];
          break;
        case 17:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 18:
        case 19:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 20:
          yy.addSection($$[$0].substr(8));
          this.$ = $$[$0].substr(8);
          break;
        case 22:
          yy.checkout($$[$0]);
          break;
        case 23:
          yy.branch($$[$0]);
          break;
        case 24:
          yy.branch($$[$0 - 2], $$[$0]);
          break;
        case 25:
          yy.cherryPick($$[$0], "", void 0);
          break;
        case 26:
          yy.cherryPick($$[$0 - 2], "", $$[$0]);
          break;
        case 27:
        case 29:
          yy.cherryPick($$[$0 - 2], "", "");
          break;
        case 28:
          yy.cherryPick($$[$0], "", $$[$0 - 2]);
          break;
        case 30:
          yy.merge($$[$0], "", "", "");
          break;
        case 31:
          yy.merge($$[$0 - 2], $$[$0], "", "");
          break;
        case 32:
          yy.merge($$[$0 - 2], "", $$[$0], "");
          break;
        case 33:
          yy.merge($$[$0 - 2], "", "", $$[$0]);
          break;
        case 34:
          yy.merge($$[$0 - 4], $$[$0], "", $$[$0 - 2]);
          break;
        case 35:
          yy.merge($$[$0 - 4], "", $$[$0], $$[$0 - 2]);
          break;
        case 36:
          yy.merge($$[$0 - 4], "", $$[$0 - 2], $$[$0]);
          break;
        case 37:
          yy.merge($$[$0 - 4], $$[$0 - 2], $$[$0], "");
          break;
        case 38:
          yy.merge($$[$0 - 4], $$[$0 - 2], "", $$[$0]);
          break;
        case 39:
          yy.merge($$[$0 - 4], $$[$0], $$[$0 - 2], "");
          break;
        case 40:
          yy.merge($$[$0 - 6], $$[$0 - 4], $$[$0 - 2], $$[$0]);
          break;
        case 41:
          yy.merge($$[$0 - 6], $$[$0], $$[$0 - 4], $$[$0 - 2]);
          break;
        case 42:
          yy.merge($$[$0 - 6], $$[$0 - 4], $$[$0], $$[$0 - 2]);
          break;
        case 43:
          yy.merge($$[$0 - 6], $$[$0 - 2], $$[$0 - 4], $$[$0]);
          break;
        case 44:
          yy.merge($$[$0 - 6], $$[$0], $$[$0 - 2], $$[$0 - 4]);
          break;
        case 45:
          yy.merge($$[$0 - 6], $$[$0 - 2], $$[$0], $$[$0 - 4]);
          break;
        case 46:
          yy.commit($$[$0]);
          break;
        case 47:
          yy.commit("", "", yy.commitType.NORMAL, $$[$0]);
          break;
        case 48:
          yy.commit("", "", $$[$0], "");
          break;
        case 49:
          yy.commit("", "", $$[$0], $$[$0 - 2]);
          break;
        case 50:
          yy.commit("", "", $$[$0 - 2], $$[$0]);
          break;
        case 51:
          yy.commit("", $$[$0], yy.commitType.NORMAL, "");
          break;
        case 52:
          yy.commit("", $$[$0 - 2], yy.commitType.NORMAL, $$[$0]);
          break;
        case 53:
          yy.commit("", $$[$0], yy.commitType.NORMAL, $$[$0 - 2]);
          break;
        case 54:
          yy.commit("", $$[$0 - 2], $$[$0], "");
          break;
        case 55:
          yy.commit("", $$[$0], $$[$0 - 2], "");
          break;
        case 56:
          yy.commit("", $$[$0 - 4], $$[$0 - 2], $$[$0]);
          break;
        case 57:
          yy.commit("", $$[$0 - 4], $$[$0], $$[$0 - 2]);
          break;
        case 58:
          yy.commit("", $$[$0 - 2], $$[$0 - 4], $$[$0]);
          break;
        case 59:
          yy.commit("", $$[$0], $$[$0 - 4], $$[$0 - 2]);
          break;
        case 60:
          yy.commit("", $$[$0], $$[$0 - 2], $$[$0 - 4]);
          break;
        case 61:
          yy.commit("", $$[$0 - 2], $$[$0], $$[$0 - 4]);
          break;
        case 62:
          yy.commit($$[$0], "", yy.commitType.NORMAL, "");
          break;
        case 63:
          yy.commit($$[$0], "", yy.commitType.NORMAL, $$[$0 - 2]);
          break;
        case 64:
          yy.commit($$[$0 - 2], "", yy.commitType.NORMAL, $$[$0]);
          break;
        case 65:
          yy.commit($$[$0 - 2], "", $$[$0], "");
          break;
        case 66:
          yy.commit($$[$0], "", $$[$0 - 2], "");
          break;
        case 67:
          yy.commit($$[$0], $$[$0 - 2], yy.commitType.NORMAL, "");
          break;
        case 68:
          yy.commit($$[$0 - 2], $$[$0], yy.commitType.NORMAL, "");
          break;
        case 69:
          yy.commit($$[$0 - 4], "", $$[$0 - 2], $$[$0]);
          break;
        case 70:
          yy.commit($$[$0 - 4], "", $$[$0], $$[$0 - 2]);
          break;
        case 71:
          yy.commit($$[$0 - 2], "", $$[$0 - 4], $$[$0]);
          break;
        case 72:
          yy.commit($$[$0], "", $$[$0 - 4], $$[$0 - 2]);
          break;
        case 73:
          yy.commit($$[$0], "", $$[$0 - 2], $$[$0 - 4]);
          break;
        case 74:
          yy.commit($$[$0 - 2], "", $$[$0], $$[$0 - 4]);
          break;
        case 75:
          yy.commit($$[$0 - 4], $$[$0], $$[$0 - 2], "");
          break;
        case 76:
          yy.commit($$[$0 - 4], $$[$0 - 2], $$[$0], "");
          break;
        case 77:
          yy.commit($$[$0 - 2], $$[$0], $$[$0 - 4], "");
          break;
        case 78:
          yy.commit($$[$0], $$[$0 - 2], $$[$0 - 4], "");
          break;
        case 79:
          yy.commit($$[$0], $$[$0 - 4], $$[$0 - 2], "");
          break;
        case 80:
          yy.commit($$[$0 - 2], $$[$0 - 4], $$[$0], "");
          break;
        case 81:
          yy.commit($$[$0 - 4], $$[$0], yy.commitType.NORMAL, $$[$0 - 2]);
          break;
        case 82:
          yy.commit($$[$0 - 4], $$[$0 - 2], yy.commitType.NORMAL, $$[$0]);
          break;
        case 83:
          yy.commit($$[$0 - 2], $$[$0], yy.commitType.NORMAL, $$[$0 - 4]);
          break;
        case 84:
          yy.commit($$[$0], $$[$0 - 2], yy.commitType.NORMAL, $$[$0 - 4]);
          break;
        case 85:
          yy.commit($$[$0], $$[$0 - 4], yy.commitType.NORMAL, $$[$0 - 2]);
          break;
        case 86:
          yy.commit($$[$0 - 2], $$[$0 - 4], yy.commitType.NORMAL, $$[$0]);
          break;
        case 87:
          yy.commit($$[$0 - 6], $$[$0 - 4], $$[$0 - 2], $$[$0]);
          break;
        case 88:
          yy.commit($$[$0 - 6], $$[$0 - 4], $$[$0], $$[$0 - 2]);
          break;
        case 89:
          yy.commit($$[$0 - 6], $$[$0 - 2], $$[$0 - 4], $$[$0]);
          break;
        case 90:
          yy.commit($$[$0 - 6], $$[$0], $$[$0 - 4], $$[$0 - 2]);
          break;
        case 91:
          yy.commit($$[$0 - 6], $$[$0 - 2], $$[$0], $$[$0 - 4]);
          break;
        case 92:
          yy.commit($$[$0 - 6], $$[$0], $$[$0 - 2], $$[$0 - 4]);
          break;
        case 93:
          yy.commit($$[$0 - 4], $$[$0 - 6], $$[$0 - 2], $$[$0]);
          break;
        case 94:
          yy.commit($$[$0 - 4], $$[$0 - 6], $$[$0], $$[$0 - 2]);
          break;
        case 95:
          yy.commit($$[$0 - 2], $$[$0 - 6], $$[$0 - 4], $$[$0]);
          break;
        case 96:
          yy.commit($$[$0], $$[$0 - 6], $$[$0 - 4], $$[$0 - 2]);
          break;
        case 97:
          yy.commit($$[$0 - 2], $$[$0 - 6], $$[$0], $$[$0 - 4]);
          break;
        case 98:
          yy.commit($$[$0], $$[$0 - 6], $$[$0 - 2], $$[$0 - 4]);
          break;
        case 99:
          yy.commit($$[$0], $$[$0 - 4], $$[$0 - 2], $$[$0 - 6]);
          break;
        case 100:
          yy.commit($$[$0 - 2], $$[$0 - 4], $$[$0], $$[$0 - 6]);
          break;
        case 101:
          yy.commit($$[$0], $$[$0 - 2], $$[$0 - 4], $$[$0 - 6]);
          break;
        case 102:
          yy.commit($$[$0 - 2], $$[$0], $$[$0 - 4], $$[$0 - 6]);
          break;
        case 103:
          yy.commit($$[$0 - 4], $$[$0 - 2], $$[$0], $$[$0 - 6]);
          break;
        case 104:
          yy.commit($$[$0 - 4], $$[$0], $$[$0 - 2], $$[$0 - 6]);
          break;
        case 105:
          yy.commit($$[$0 - 2], $$[$0 - 4], $$[$0 - 6], $$[$0]);
          break;
        case 106:
          yy.commit($$[$0], $$[$0 - 4], $$[$0 - 6], $$[$0 - 2]);
          break;
        case 107:
          yy.commit($$[$0 - 2], $$[$0], $$[$0 - 6], $$[$0 - 4]);
          break;
        case 108:
          yy.commit($$[$0], $$[$0 - 2], $$[$0 - 6], $$[$0 - 4]);
          break;
        case 109:
          yy.commit($$[$0 - 4], $$[$0 - 2], $$[$0 - 6], $$[$0]);
          break;
        case 110:
          yy.commit($$[$0 - 4], $$[$0], $$[$0 - 6], $$[$0 - 2]);
          break;
        case 111:
          this.$ = "";
          break;
        case 112:
          this.$ = $$[$0];
          break;
        case 113:
          this.$ = yy.commitType.NORMAL;
          break;
        case 114:
          this.$ = yy.commitType.REVERSE;
          break;
        case 115:
          this.$ = yy.commitType.HIGHLIGHT;
          break;
        case 118:
          yy.parseDirective("%%{", "open_directive");
          break;
        case 119:
          yy.parseDirective($$[$0], "type_directive");
          break;
        case 120:
          $$[$0] = $$[$0].trim().replace(/'/g, '"');
          yy.parseDirective($$[$0], "arg_directive");
          break;
        case 121:
          yy.parseDirective("}%%", "close_directive", "gitGraph");
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 5: 3, 6: $V0, 8: $V1, 14: $V2, 46: 8, 50: $V3, 55: $V4 }, { 1: [3] }, { 3: 10, 4: 2, 5: 3, 6: $V0, 8: $V1, 14: $V2, 46: 8, 50: $V3, 55: $V4 }, { 3: 11, 4: 2, 5: 3, 6: $V0, 8: $V1, 14: $V2, 46: 8, 50: $V3, 55: $V4 }, { 7: 12, 8: $V5, 9: [1, 13], 10: [1, 14], 11: 15, 14: $V6 }, o($V7, [2, 124]), o($V7, [2, 125]), o($V7, [2, 126]), { 47: 17, 51: [1, 18] }, { 51: [2, 118] }, { 1: [2, 1] }, { 1: [2, 2] }, { 8: [1, 19] }, { 7: 20, 8: $V5, 11: 15, 14: $V6 }, { 9: [1, 21] }, o($V8, [2, 10], { 12: 22, 13: [1, 23] }), o($V9, [2, 9]), { 9: [1, 25], 48: 24, 53: $Va }, o([9, 53], [2, 119]), { 1: [2, 3] }, { 8: [1, 27] }, { 7: 28, 8: $V5, 11: 15, 14: $V6 }, { 8: [2, 7], 14: [1, 31], 15: 29, 16: 30, 17: 32, 18: 33, 19: 34, 20: [1, 35], 22: [1, 36], 24: [1, 37], 25: [1, 38], 26: 39, 27: [1, 40], 29: [1, 44], 32: [1, 43], 37: [1, 42], 40: [1, 41] }, o($V9, [2, 8]), o($Vb, [2, 116]), { 49: 45, 52: [1, 46] }, o($Vb, [2, 121]), { 1: [2, 4] }, { 8: [1, 47] }, o($V8, [2, 11]), { 4: 48, 8: $V1, 14: $V2, 55: $V4 }, o($V8, [2, 13]), o($Vc, [2, 14]), o($Vc, [2, 15]), o($Vc, [2, 16]), { 21: [1, 49] }, { 23: [1, 50] }, o($Vc, [2, 19]), o($Vc, [2, 20]), o($Vc, [2, 21]), { 28: 51, 34: $Vd, 54: $Ve }, o($Vc, [2, 111], { 41: 54, 33: [1, 57], 34: [1, 59], 35: [1, 55], 38: [1, 56], 42: [1, 58] }), { 28: 60, 34: $Vd, 54: $Ve }, { 33: [1, 61], 35: [1, 62] }, { 28: 63, 34: $Vd, 54: $Ve }, { 48: 64, 53: $Va }, { 53: [2, 120] }, { 1: [2, 5] }, o($V8, [2, 12]), o($Vc, [2, 17]), o($Vc, [2, 18]), o($Vc, [2, 22]), o($Vf, [2, 122]), o($Vf, [2, 123]), o($Vc, [2, 46]), { 34: [1, 65] }, { 39: 66, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 70] }, { 34: [1, 71] }, o($Vc, [2, 112]), o($Vc, [2, 30], { 33: [1, 72], 35: [1, 74], 38: [1, 73] }), { 34: [1, 75] }, { 34: [1, 76], 36: [1, 77] }, o($Vc, [2, 23], { 30: [1, 78] }), o($Vb, [2, 117]), o($Vc, [2, 47], { 33: [1, 80], 38: [1, 79], 42: [1, 81] }), o($Vc, [2, 48], { 33: [1, 83], 35: [1, 82], 42: [1, 84] }), o($Vj, [2, 113]), o($Vj, [2, 114]), o($Vj, [2, 115]), o($Vc, [2, 51], { 35: [1, 85], 38: [1, 86], 42: [1, 87] }), o($Vc, [2, 62], { 33: [1, 90], 35: [1, 88], 38: [1, 89] }), { 34: [1, 91] }, { 39: 92, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 93] }, o($Vc, [2, 25], { 35: [1, 94] }), { 33: [1, 95] }, { 33: [1, 96] }, { 31: [1, 97] }, { 39: 98, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 99] }, { 34: [1, 100] }, { 34: [1, 101] }, { 34: [1, 102] }, { 34: [1, 103] }, { 34: [1, 104] }, { 39: 105, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 106] }, { 34: [1, 107] }, { 39: 108, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 109] }, o($Vc, [2, 31], { 35: [1, 111], 38: [1, 110] }), o($Vc, [2, 32], { 33: [1, 113], 35: [1, 112] }), o($Vc, [2, 33], { 33: [1, 114], 38: [1, 115] }), { 34: [1, 116], 36: [1, 117] }, { 34: [1, 118] }, { 34: [1, 119] }, o($Vc, [2, 24]), o($Vc, [2, 49], { 33: [1, 120], 42: [1, 121] }), o($Vc, [2, 53], { 38: [1, 122], 42: [1, 123] }), o($Vc, [2, 63], { 33: [1, 125], 38: [1, 124] }), o($Vc, [2, 50], { 33: [1, 126], 42: [1, 127] }), o($Vc, [2, 55], { 35: [1, 128], 42: [1, 129] }), o($Vc, [2, 66], { 33: [1, 131], 35: [1, 130] }), o($Vc, [2, 52], { 38: [1, 132], 42: [1, 133] }), o($Vc, [2, 54], { 35: [1, 134], 42: [1, 135] }), o($Vc, [2, 67], { 35: [1, 137], 38: [1, 136] }), o($Vc, [2, 64], { 33: [1, 139], 38: [1, 138] }), o($Vc, [2, 65], { 33: [1, 141], 35: [1, 140] }), o($Vc, [2, 68], { 35: [1, 143], 38: [1, 142] }), { 39: 144, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 145] }, { 34: [1, 146] }, { 34: [1, 147] }, { 34: [1, 148] }, { 39: 149, 43: $Vg, 44: $Vh, 45: $Vi }, o($Vc, [2, 26]), o($Vc, [2, 27]), o($Vc, [2, 28]), o($Vc, [2, 29]), { 34: [1, 150] }, { 34: [1, 151] }, { 39: 152, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 153] }, { 39: 154, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 155] }, { 34: [1, 156] }, { 34: [1, 157] }, { 34: [1, 158] }, { 34: [1, 159] }, { 34: [1, 160] }, { 34: [1, 161] }, { 39: 162, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 163] }, { 34: [1, 164] }, { 34: [1, 165] }, { 39: 166, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 167] }, { 39: 168, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 169] }, { 34: [1, 170] }, { 34: [1, 171] }, { 39: 172, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 173] }, o($Vc, [2, 37], { 35: [1, 174] }), o($Vc, [2, 38], { 38: [1, 175] }), o($Vc, [2, 36], { 33: [1, 176] }), o($Vc, [2, 39], { 35: [1, 177] }), o($Vc, [2, 34], { 38: [1, 178] }), o($Vc, [2, 35], { 33: [1, 179] }), o($Vc, [2, 60], { 42: [1, 180] }), o($Vc, [2, 73], { 33: [1, 181] }), o($Vc, [2, 61], { 42: [1, 182] }), o($Vc, [2, 84], { 38: [1, 183] }), o($Vc, [2, 74], { 33: [1, 184] }), o($Vc, [2, 83], { 38: [1, 185] }), o($Vc, [2, 59], { 42: [1, 186] }), o($Vc, [2, 72], { 33: [1, 187] }), o($Vc, [2, 58], { 42: [1, 188] }), o($Vc, [2, 78], { 35: [1, 189] }), o($Vc, [2, 71], { 33: [1, 190] }), o($Vc, [2, 77], { 35: [1, 191] }), o($Vc, [2, 57], { 42: [1, 192] }), o($Vc, [2, 85], { 38: [1, 193] }), o($Vc, [2, 56], { 42: [1, 194] }), o($Vc, [2, 79], { 35: [1, 195] }), o($Vc, [2, 80], { 35: [1, 196] }), o($Vc, [2, 86], { 38: [1, 197] }), o($Vc, [2, 70], { 33: [1, 198] }), o($Vc, [2, 81], { 38: [1, 199] }), o($Vc, [2, 69], { 33: [1, 200] }), o($Vc, [2, 75], { 35: [1, 201] }), o($Vc, [2, 76], { 35: [1, 202] }), o($Vc, [2, 82], { 38: [1, 203] }), { 34: [1, 204] }, { 39: 205, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 206] }, { 34: [1, 207] }, { 39: 208, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 209] }, { 34: [1, 210] }, { 34: [1, 211] }, { 34: [1, 212] }, { 39: 213, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 214] }, { 39: 215, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 216] }, { 34: [1, 217] }, { 34: [1, 218] }, { 34: [1, 219] }, { 34: [1, 220] }, { 34: [1, 221] }, { 34: [1, 222] }, { 39: 223, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 224] }, { 34: [1, 225] }, { 34: [1, 226] }, { 39: 227, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 228] }, { 39: 229, 43: $Vg, 44: $Vh, 45: $Vi }, { 34: [1, 230] }, { 34: [1, 231] }, { 34: [1, 232] }, { 39: 233, 43: $Vg, 44: $Vh, 45: $Vi }, o($Vc, [2, 40]), o($Vc, [2, 42]), o($Vc, [2, 41]), o($Vc, [2, 43]), o($Vc, [2, 45]), o($Vc, [2, 44]), o($Vc, [2, 101]), o($Vc, [2, 102]), o($Vc, [2, 99]), o($Vc, [2, 100]), o($Vc, [2, 104]), o($Vc, [2, 103]), o($Vc, [2, 108]), o($Vc, [2, 107]), o($Vc, [2, 106]), o($Vc, [2, 105]), o($Vc, [2, 110]), o($Vc, [2, 109]), o($Vc, [2, 98]), o($Vc, [2, 97]), o($Vc, [2, 96]), o($Vc, [2, 95]), o($Vc, [2, 93]), o($Vc, [2, 94]), o($Vc, [2, 92]), o($Vc, [2, 91]), o($Vc, [2, 90]), o($Vc, [2, 89]), o($Vc, [2, 87]), o($Vc, [2, 88])],
    defaultActions: { 9: [2, 118], 10: [2, 1], 11: [2, 2], 19: [2, 3], 27: [2, 4], 46: [2, 120], 47: [2, 5] },
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
            return 50;
          case 1:
            this.begin("type_directive");
            return 51;
          case 2:
            this.popState();
            this.begin("arg_directive");
            return 9;
          case 3:
            this.popState();
            this.popState();
            return 53;
          case 4:
            return 52;
          case 5:
            this.begin("acc_title");
            return 20;
          case 6:
            this.popState();
            return "acc_title_value";
          case 7:
            this.begin("acc_descr");
            return 22;
          case 8:
            this.popState();
            return "acc_descr_value";
          case 9:
            this.begin("acc_descr_multiline");
            break;
          case 10:
            this.popState();
            break;
          case 11:
            return "acc_descr_multiline_value";
          case 12:
            return 14;
          case 13:
            break;
          case 14:
            break;
          case 15:
            return 6;
          case 16:
            return 40;
          case 17:
            return 33;
          case 18:
            return 38;
          case 19:
            return 42;
          case 20:
            return 43;
          case 21:
            return 44;
          case 22:
            return 45;
          case 23:
            return 35;
          case 24:
            return 29;
          case 25:
            return 30;
          case 26:
            return 37;
          case 27:
            return 32;
          case 28:
            return 27;
          case 29:
            return 10;
          case 30:
            return 10;
          case 31:
            return 9;
          case 32:
            return "CARET";
          case 33:
            this.begin("options");
            break;
          case 34:
            this.popState();
            break;
          case 35:
            return 13;
          case 36:
            return 36;
          case 37:
            this.begin("string");
            break;
          case 38:
            this.popState();
            break;
          case 39:
            return 34;
          case 40:
            return 31;
          case 41:
            return 54;
          case 42:
            return 8;
        }
      },
      rules: [/^(?:%%\{)/i, /^(?:((?:(?!\}%%)[^:.])*))/i, /^(?::)/i, /^(?:\}%%)/i, /^(?:((?:(?!\}%%).|\n)*))/i, /^(?:accTitle\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*\{\s*)/i, /^(?:[\}])/i, /^(?:[^\}]*)/i, /^(?:(\r?\n)+)/i, /^(?:#[^\n]*)/i, /^(?:%[^\n]*)/i, /^(?:gitGraph\b)/i, /^(?:commit(?=\s|$))/i, /^(?:id:)/i, /^(?:type:)/i, /^(?:msg:)/i, /^(?:NORMAL\b)/i, /^(?:REVERSE\b)/i, /^(?:HIGHLIGHT\b)/i, /^(?:tag:)/i, /^(?:branch(?=\s|$))/i, /^(?:order:)/i, /^(?:merge(?=\s|$))/i, /^(?:cherry-pick(?=\s|$))/i, /^(?:checkout(?=\s|$))/i, /^(?:LR\b)/i, /^(?:TB\b)/i, /^(?::)/i, /^(?:\^)/i, /^(?:options\r?\n)/i, /^(?:[ \r\n\t]+end\b)/i, /^(?:[\s\S]+(?=[ \r\n\t]+end))/i, /^(?:["]["])/i, /^(?:["])/i, /^(?:["])/i, /^(?:[^"]*)/i, /^(?:[0-9]+(?=\s|$))/i, /^(?:\w([-\./\w]*[-\w])?)/i, /^(?:$)/i, /^(?:\s+)/i],
      conditions: { "acc_descr_multiline": { "rules": [10, 11], "inclusive": false }, "acc_descr": { "rules": [8], "inclusive": false }, "acc_title": { "rules": [6], "inclusive": false }, "close_directive": { "rules": [], "inclusive": false }, "arg_directive": { "rules": [3, 4], "inclusive": false }, "type_directive": { "rules": [2, 3], "inclusive": false }, "open_directive": { "rules": [1], "inclusive": false }, "options": { "rules": [34, 35], "inclusive": false }, "string": { "rules": [38, 39], "inclusive": false }, "INITIAL": { "rules": [0, 5, 7, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 36, 37, 40, 41, 42, 43], "inclusive": true } }
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
const gitGraphParser = parser;
let mainBranchName = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().gitGraph.mainBranchName;
let mainBranchOrder = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().gitGraph.mainBranchOrder;
let commits = {};
let head = null;
let branchesConfig = {};
branchesConfig[mainBranchName] = { name: mainBranchName, order: mainBranchOrder };
let branches = {};
branches[mainBranchName] = head;
let curBranch = mainBranchName;
let direction = "LR";
let seq = 0;
function getId() {
  return (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.y)({ length: 7 });
}
const parseDirective = function(statement, context, type) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.m.parseDirective(this, statement, context, type);
};
function uniqBy(list, fn) {
  const recordMap = /* @__PURE__ */ Object.create(null);
  return list.reduce((out, item) => {
    const key = fn(item);
    if (!recordMap[key]) {
      recordMap[key] = true;
      out.push(item);
    }
    return out;
  }, []);
}
const setDirection = function(dir2) {
  direction = dir2;
};
let options = {};
const setOptions = function(rawOptString) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("options str", rawOptString);
  rawOptString = rawOptString && rawOptString.trim();
  rawOptString = rawOptString || "{}";
  try {
    options = JSON.parse(rawOptString);
  } catch (e) {
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.error("error while parsing gitGraph options", e.message);
  }
};
const getOptions = function() {
  return options;
};
const commit = function(msg, id, type, tag) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Entering commit:", msg, id, type, tag);
  id = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(id, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  msg = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(msg, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  tag = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(tag, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  const commit2 = {
    id: id ? id : seq + "-" + getId(),
    message: msg,
    seq: seq++,
    type: type ? type : commitType$1.NORMAL,
    tag: tag ? tag : "",
    parents: head == null ? [] : [head.id],
    branch: curBranch
  };
  head = commit2;
  commits[commit2.id] = commit2;
  branches[curBranch] = commit2.id;
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("in pushCommit " + commit2.id);
};
const branch = function(name, order) {
  name = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(name, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  if (branches[name] === void 0) {
    branches[name] = head != null ? head.id : null;
    branchesConfig[name] = { name, order: order ? parseInt(order, 10) : null };
    checkout(name);
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("in createBranch");
  } else {
    let error = new Error(
      'Trying to create an existing branch. (Help: Either use a new name if you want create a new branch or try using "checkout ' + name + '")'
    );
    error.hash = {
      text: "branch " + name,
      token: "branch " + name,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ['"checkout ' + name + '"']
    };
    throw error;
  }
};
const merge = function(otherBranch, custom_id, override_type, custom_tag) {
  otherBranch = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(otherBranch, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  custom_id = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(custom_id, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  const currentCommit = commits[branches[curBranch]];
  const otherCommit = commits[branches[otherBranch]];
  if (curBranch === otherBranch) {
    let error = new Error('Incorrect usage of "merge". Cannot merge a branch to itself');
    error.hash = {
      text: "merge " + otherBranch,
      token: "merge " + otherBranch,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["branch abc"]
    };
    throw error;
  } else if (currentCommit === void 0 || !currentCommit) {
    let error = new Error(
      'Incorrect usage of "merge". Current branch (' + curBranch + ")has no commits"
    );
    error.hash = {
      text: "merge " + otherBranch,
      token: "merge " + otherBranch,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["commit"]
    };
    throw error;
  } else if (branches[otherBranch] === void 0) {
    let error = new Error(
      'Incorrect usage of "merge". Branch to be merged (' + otherBranch + ") does not exist"
    );
    error.hash = {
      text: "merge " + otherBranch,
      token: "merge " + otherBranch,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["branch " + otherBranch]
    };
    throw error;
  } else if (otherCommit === void 0 || !otherCommit) {
    let error = new Error(
      'Incorrect usage of "merge". Branch to be merged (' + otherBranch + ") has no commits"
    );
    error.hash = {
      text: "merge " + otherBranch,
      token: "merge " + otherBranch,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ['"commit"']
    };
    throw error;
  } else if (currentCommit === otherCommit) {
    let error = new Error('Incorrect usage of "merge". Both branches have same head');
    error.hash = {
      text: "merge " + otherBranch,
      token: "merge " + otherBranch,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["branch abc"]
    };
    throw error;
  } else if (custom_id && commits[custom_id] !== void 0) {
    let error = new Error(
      'Incorrect usage of "merge". Commit with id:' + custom_id + " already exists, use different custom Id"
    );
    error.hash = {
      text: "merge " + otherBranch + custom_id + override_type + custom_tag,
      token: "merge " + otherBranch + custom_id + override_type + custom_tag,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: [
        "merge " + otherBranch + " " + custom_id + "_UNIQUE " + override_type + " " + custom_tag
      ]
    };
    throw error;
  }
  const commit2 = {
    id: custom_id ? custom_id : seq + "-" + getId(),
    message: "merged branch " + otherBranch + " into " + curBranch,
    seq: seq++,
    parents: [head == null ? null : head.id, branches[otherBranch]],
    branch: curBranch,
    type: commitType$1.MERGE,
    customType: override_type,
    customId: custom_id ? true : false,
    tag: custom_tag ? custom_tag : ""
  };
  head = commit2;
  commits[commit2.id] = commit2;
  branches[curBranch] = commit2.id;
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(branches);
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("in mergeBranch");
};
const cherryPick = function(sourceId, targetId, tag) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("Entering cherryPick:", sourceId, targetId, tag);
  sourceId = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(sourceId, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  targetId = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(targetId, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  tag = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(tag, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  if (!sourceId || commits[sourceId] === void 0) {
    let error = new Error(
      'Incorrect usage of "cherryPick". Source commit id should exist and provided'
    );
    error.hash = {
      text: "cherryPick " + sourceId + " " + targetId,
      token: "cherryPick " + sourceId + " " + targetId,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["cherry-pick abc"]
    };
    throw error;
  }
  let sourceCommit = commits[sourceId];
  let sourceCommitBranch = sourceCommit.branch;
  if (sourceCommit.type === commitType$1.MERGE) {
    let error = new Error(
      'Incorrect usage of "cherryPick". Source commit should not be a merge commit'
    );
    error.hash = {
      text: "cherryPick " + sourceId + " " + targetId,
      token: "cherryPick " + sourceId + " " + targetId,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ["cherry-pick abc"]
    };
    throw error;
  }
  if (!targetId || commits[targetId] === void 0) {
    if (sourceCommitBranch === curBranch) {
      let error = new Error(
        'Incorrect usage of "cherryPick". Source commit is already on current branch'
      );
      error.hash = {
        text: "cherryPick " + sourceId + " " + targetId,
        token: "cherryPick " + sourceId + " " + targetId,
        line: "1",
        loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
        expected: ["cherry-pick abc"]
      };
      throw error;
    }
    const currentCommit = commits[branches[curBranch]];
    if (currentCommit === void 0 || !currentCommit) {
      let error = new Error(
        'Incorrect usage of "cherry-pick". Current branch (' + curBranch + ")has no commits"
      );
      error.hash = {
        text: "cherryPick " + sourceId + " " + targetId,
        token: "cherryPick " + sourceId + " " + targetId,
        line: "1",
        loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
        expected: ["cherry-pick abc"]
      };
      throw error;
    }
    const commit2 = {
      id: seq + "-" + getId(),
      message: "cherry-picked " + sourceCommit + " into " + curBranch,
      seq: seq++,
      parents: [head == null ? null : head.id, sourceCommit.id],
      branch: curBranch,
      type: commitType$1.CHERRY_PICK,
      tag: tag ?? "cherry-pick:" + sourceCommit.id
    };
    head = commit2;
    commits[commit2.id] = commit2;
    branches[curBranch] = commit2.id;
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(branches);
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("in cherryPick");
  }
};
const checkout = function(branch2) {
  branch2 = _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.sanitizeText(branch2, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  if (branches[branch2] === void 0) {
    let error = new Error(
      'Trying to checkout branch which is not yet created. (Help try using "branch ' + branch2 + '")'
    );
    error.hash = {
      text: "checkout " + branch2,
      token: "checkout " + branch2,
      line: "1",
      loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
      expected: ['"branch ' + branch2 + '"']
    };
    throw error;
  } else {
    curBranch = branch2;
    const id = branches[curBranch];
    head = commits[id];
  }
};
function upsert(arr, key, newVal) {
  const index = arr.indexOf(key);
  if (index === -1) {
    arr.push(newVal);
  } else {
    arr.splice(index, 1, newVal);
  }
}
function prettyPrintCommitHistory(commitArr) {
  const commit2 = commitArr.reduce((out, commit3) => {
    if (out.seq > commit3.seq) {
      return out;
    }
    return commit3;
  }, commitArr[0]);
  let line = "";
  commitArr.forEach(function(c) {
    if (c === commit2) {
      line += "	*";
    } else {
      line += "	|";
    }
  });
  const label = [line, commit2.id, commit2.seq];
  for (let branch2 in branches) {
    if (branches[branch2] === commit2.id) {
      label.push(branch2);
    }
  }
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(label.join(" "));
  if (commit2.parents && commit2.parents.length == 2) {
    const newCommit = commits[commit2.parents[0]];
    upsert(commitArr, commit2, newCommit);
    commitArr.push(commits[commit2.parents[1]]);
  } else if (commit2.parents.length == 0) {
    return;
  } else {
    const nextCommit = commits[commit2.parents];
    upsert(commitArr, commit2, nextCommit);
  }
  commitArr = uniqBy(commitArr, (c) => c.id);
  prettyPrintCommitHistory(commitArr);
}
const prettyPrint = function() {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(commits);
  const node = getCommitsArray()[0];
  prettyPrintCommitHistory([node]);
};
const clear$1 = function() {
  commits = {};
  head = null;
  let mainBranch = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().gitGraph.mainBranchName;
  let mainBranchOrder2 = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().gitGraph.mainBranchOrder;
  branches = {};
  branches[mainBranch] = null;
  branchesConfig = {};
  branchesConfig[mainBranch] = { name: mainBranch, order: mainBranchOrder2 };
  curBranch = mainBranch;
  seq = 0;
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.v)();
};
const getBranchesAsObjArray = function() {
  const branchesArray = Object.values(branchesConfig).map((branchConfig, i) => {
    if (branchConfig.order !== null) {
      return branchConfig;
    }
    return {
      ...branchConfig,
      order: parseFloat(`0.${i}`, 10)
    };
  }).sort((a, b) => a.order - b.order).map(({ name }) => ({ name }));
  return branchesArray;
};
const getBranches = function() {
  return branches;
};
const getCommits = function() {
  return commits;
};
const getCommitsArray = function() {
  const commitArr = Object.keys(commits).map(function(key) {
    return commits[key];
  });
  commitArr.forEach(function(o) {
    _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(o.id);
  });
  commitArr.sort((a, b) => a.seq - b.seq);
  return commitArr;
};
const getCurrentBranch = function() {
  return curBranch;
};
const getDirection = function() {
  return direction;
};
const getHead = function() {
  return head;
};
const commitType$1 = {
  NORMAL: 0,
  REVERSE: 1,
  HIGHLIGHT: 2,
  MERGE: 3,
  CHERRY_PICK: 4
};
const gitGraphDb = {
  parseDirective,
  getConfig: () => (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().gitGraph,
  setDirection,
  setOptions,
  getOptions,
  commit,
  branch,
  merge,
  cherryPick,
  checkout,
  //reset,
  prettyPrint,
  clear: clear$1,
  getBranchesAsObjArray,
  getBranches,
  getCommits,
  getCommitsArray,
  getCurrentBranch,
  getDirection,
  getHead,
  setAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.s,
  getAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.g,
  getAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.a,
  setAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.b,
  setDiagramTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.r,
  getDiagramTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.t,
  commitType: commitType$1
};
let allCommitsDict = {};
const commitType = {
  NORMAL: 0,
  REVERSE: 1,
  HIGHLIGHT: 2,
  MERGE: 3,
  CHERRY_PICK: 4
};
const THEME_COLOR_LIMIT = 8;
let branchPos = {};
let commitPos = {};
let lanes = [];
let maxPos = 0;
let dir = "LR";
const clear = () => {
  branchPos = {};
  commitPos = {};
  allCommitsDict = {};
  maxPos = 0;
  lanes = [];
  dir = "LR";
};
const drawText = (txt) => {
  const svgLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  let rows = [];
  if (typeof txt === "string") {
    rows = txt.split(/\\n|\n|<br\s*\/?>/gi);
  } else if (Array.isArray(txt)) {
    rows = txt;
  } else {
    rows = [];
  }
  for (const row of rows) {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
    tspan.setAttribute("dy", "1em");
    tspan.setAttribute("x", "0");
    tspan.setAttribute("class", "row");
    tspan.textContent = row.trim();
    svgLabel.appendChild(tspan);
  }
  return svgLabel;
};
const drawCommits = (svg, commits2, modifyGraph) => {
  const gitGraphConfig = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.z)().gitGraph;
  const gBullets = svg.append("g").attr("class", "commit-bullets");
  const gLabels = svg.append("g").attr("class", "commit-labels");
  let pos = 0;
  if (dir === "TB") {
    pos = 30;
  }
  const keys = Object.keys(commits2);
  const sortedKeys = keys.sort((a, b) => {
    return commits2[a].seq - commits2[b].seq;
  });
  sortedKeys.forEach((key) => {
    const commit2 = commits2[key];
    const y = dir === "TB" ? pos + 10 : branchPos[commit2.branch].pos;
    const x = dir === "TB" ? branchPos[commit2.branch].pos : pos + 10;
    if (modifyGraph) {
      let typeClass;
      let commitSymbolType = commit2.customType !== void 0 && commit2.customType !== "" ? commit2.customType : commit2.type;
      switch (commitSymbolType) {
        case commitType.NORMAL:
          typeClass = "commit-normal";
          break;
        case commitType.REVERSE:
          typeClass = "commit-reverse";
          break;
        case commitType.HIGHLIGHT:
          typeClass = "commit-highlight";
          break;
        case commitType.MERGE:
          typeClass = "commit-merge";
          break;
        case commitType.CHERRY_PICK:
          typeClass = "commit-cherry-pick";
          break;
        default:
          typeClass = "commit-normal";
      }
      if (commitSymbolType === commitType.HIGHLIGHT) {
        const circle = gBullets.append("rect");
        circle.attr("x", x - 10);
        circle.attr("y", y - 10);
        circle.attr("height", 20);
        circle.attr("width", 20);
        circle.attr(
          "class",
          `commit ${commit2.id} commit-highlight${branchPos[commit2.branch].index % THEME_COLOR_LIMIT} ${typeClass}-outer`
        );
        gBullets.append("rect").attr("x", x - 6).attr("y", y - 6).attr("height", 12).attr("width", 12).attr(
          "class",
          `commit ${commit2.id} commit${branchPos[commit2.branch].index % THEME_COLOR_LIMIT} ${typeClass}-inner`
        );
      } else if (commitSymbolType === commitType.CHERRY_PICK) {
        gBullets.append("circle").attr("cx", x).attr("cy", y).attr("r", 10).attr("class", `commit ${commit2.id} ${typeClass}`);
        gBullets.append("circle").attr("cx", x - 3).attr("cy", y + 2).attr("r", 2.75).attr("fill", "#fff").attr("class", `commit ${commit2.id} ${typeClass}`);
        gBullets.append("circle").attr("cx", x + 3).attr("cy", y + 2).attr("r", 2.75).attr("fill", "#fff").attr("class", `commit ${commit2.id} ${typeClass}`);
        gBullets.append("line").attr("x1", x + 3).attr("y1", y + 1).attr("x2", x).attr("y2", y - 5).attr("stroke", "#fff").attr("class", `commit ${commit2.id} ${typeClass}`);
        gBullets.append("line").attr("x1", x - 3).attr("y1", y + 1).attr("x2", x).attr("y2", y - 5).attr("stroke", "#fff").attr("class", `commit ${commit2.id} ${typeClass}`);
      } else {
        const circle = gBullets.append("circle");
        circle.attr("cx", x);
        circle.attr("cy", y);
        circle.attr("r", commit2.type === commitType.MERGE ? 9 : 10);
        circle.attr(
          "class",
          `commit ${commit2.id} commit${branchPos[commit2.branch].index % THEME_COLOR_LIMIT}`
        );
        if (commitSymbolType === commitType.MERGE) {
          const circle2 = gBullets.append("circle");
          circle2.attr("cx", x);
          circle2.attr("cy", y);
          circle2.attr("r", 6);
          circle2.attr(
            "class",
            `commit ${typeClass} ${commit2.id} commit${branchPos[commit2.branch].index % THEME_COLOR_LIMIT}`
          );
        }
        if (commitSymbolType === commitType.REVERSE) {
          const cross = gBullets.append("path");
          cross.attr("d", `M ${x - 5},${y - 5}L${x + 5},${y + 5}M${x - 5},${y + 5}L${x + 5},${y - 5}`).attr(
            "class",
            `commit ${typeClass} ${commit2.id} commit${branchPos[commit2.branch].index % THEME_COLOR_LIMIT}`
          );
        }
      }
    }
    if (dir === "TB") {
      commitPos[commit2.id] = { x, y: pos + 10 };
    } else {
      commitPos[commit2.id] = { x: pos + 10, y };
    }
    if (modifyGraph) {
      const px = 4;
      const py = 2;
      if (commit2.type !== commitType.CHERRY_PICK && (commit2.customId && commit2.type === commitType.MERGE || commit2.type !== commitType.MERGE) && gitGraphConfig.showCommitLabel) {
        const wrapper = gLabels.append("g");
        const labelBkg = wrapper.insert("rect").attr("class", "commit-label-bkg");
        const text = wrapper.append("text").attr("x", pos).attr("y", y + 25).attr("class", "commit-label").text(commit2.id);
        let bbox = text.node().getBBox();
        labelBkg.attr("x", pos + 10 - bbox.width / 2 - py).attr("y", y + 13.5).attr("width", bbox.width + 2 * py).attr("height", bbox.height + 2 * py);
        if (dir === "TB") {
          labelBkg.attr("x", x - (bbox.width + 4 * px + 5)).attr("y", y - 12);
          text.attr("x", x - (bbox.width + 4 * px)).attr("y", y + bbox.height - 12);
        }
        if (dir !== "TB") {
          text.attr("x", pos + 10 - bbox.width / 2);
        }
        if (gitGraphConfig.rotateCommitLabel) {
          if (dir === "TB") {
            text.attr("transform", "rotate(-45, " + x + ", " + y + ")");
            labelBkg.attr("transform", "rotate(-45, " + x + ", " + y + ")");
          } else {
            let r_x = -7.5 - (bbox.width + 10) / 25 * 9.5;
            let r_y = 10 + bbox.width / 25 * 8.5;
            wrapper.attr(
              "transform",
              "translate(" + r_x + ", " + r_y + ") rotate(-45, " + pos + ", " + y + ")"
            );
          }
        }
      }
      if (commit2.tag) {
        const rect = gLabels.insert("polygon");
        const hole = gLabels.append("circle");
        const tag = gLabels.append("text").attr("y", y - 16).attr("class", "tag-label").text(commit2.tag);
        let tagBbox = tag.node().getBBox();
        tag.attr("x", pos + 10 - tagBbox.width / 2);
        const h2 = tagBbox.height / 2;
        const ly = y - 19.2;
        rect.attr("class", "tag-label-bkg").attr(
          "points",
          `
          ${pos - tagBbox.width / 2 - px / 2},${ly + py}
          ${pos - tagBbox.width / 2 - px / 2},${ly - py}
          ${pos + 10 - tagBbox.width / 2 - px},${ly - h2 - py}
          ${pos + 10 + tagBbox.width / 2 + px},${ly - h2 - py}
          ${pos + 10 + tagBbox.width / 2 + px},${ly + h2 + py}
          ${pos + 10 - tagBbox.width / 2 - px},${ly + h2 + py}`
        );
        hole.attr("cx", pos - tagBbox.width / 2 + px / 2).attr("cy", ly).attr("r", 1.5).attr("class", "tag-hole");
        if (dir === "TB") {
          rect.attr("class", "tag-label-bkg").attr(
            "points",
            `
            ${x},${pos + py}
            ${x},${pos - py}
            ${x + 10},${pos - h2 - py}
            ${x + 10 + tagBbox.width + px},${pos - h2 - py}
            ${x + 10 + tagBbox.width + px},${pos + h2 + py}
            ${x + 10},${pos + h2 + py}`
          ).attr("transform", "translate(12,12) rotate(45, " + x + "," + pos + ")");
          hole.attr("cx", x + px / 2).attr("cy", pos).attr("transform", "translate(12,12) rotate(45, " + x + "," + pos + ")");
          tag.attr("x", x + 5).attr("y", pos + 3).attr("transform", "translate(14,14) rotate(45, " + x + "," + pos + ")");
        }
      }
    }
    pos += 50;
    if (pos > maxPos) {
      maxPos = pos;
    }
  });
};
const hasOverlappingCommits = (commit1, commit2, allCommits) => {
  const keys = Object.keys(allCommits);
  const overlappingComits = keys.filter((key) => {
    return allCommits[key].branch === commit2.branch && allCommits[key].seq > commit1.seq && allCommits[key].seq < commit2.seq;
  });
  return overlappingComits.length > 0;
};
const findLane = (y1, y2, depth = 0) => {
  const candidate = y1 + Math.abs(y1 - y2) / 2;
  if (depth > 5) {
    return candidate;
  }
  let ok = lanes.every((lane) => Math.abs(lane - candidate) >= 10);
  if (ok) {
    lanes.push(candidate);
    return candidate;
  }
  const diff = Math.abs(y1 - y2);
  return findLane(y1, y2 - diff / 5, depth + 1);
};
const drawArrow = (svg, commit1, commit2, allCommits) => {
  const p1 = commitPos[commit1.id];
  const p2 = commitPos[commit2.id];
  const overlappingCommits = hasOverlappingCommits(commit1, commit2, allCommits);
  let arc = "";
  let arc2 = "";
  let radius = 0;
  let offset = 0;
  let colorClassNum = branchPos[commit2.branch].index;
  let lineDef;
  if (overlappingCommits) {
    arc = "A 10 10, 0, 0, 0,";
    arc2 = "A 10 10, 0, 0, 1,";
    radius = 10;
    offset = 10;
    colorClassNum = branchPos[commit2.branch].index;
    const lineY = p1.y < p2.y ? findLane(p1.y, p2.y) : findLane(p2.y, p1.y);
    const lineX = p1.x < p2.x ? findLane(p1.x, p2.x) : findLane(p2.x, p1.x);
    if (dir === "TB") {
      if (p1.x < p2.x) {
        lineDef = `M ${p1.x} ${p1.y} L ${lineX - radius} ${p1.y} ${arc2} ${lineX} ${p1.y + offset} L ${lineX} ${p2.y - radius} ${arc} ${lineX + offset} ${p2.y} L ${p2.x} ${p2.y}`;
      } else {
        lineDef = `M ${p1.x} ${p1.y} L ${lineX + radius} ${p1.y} ${arc} ${lineX} ${p1.y + offset} L ${lineX} ${p2.y - radius} ${arc2} ${lineX - offset} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    } else {
      if (p1.y < p2.y) {
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x} ${lineY - radius} ${arc} ${p1.x + offset} ${lineY} L ${p2.x - radius} ${lineY} ${arc2} ${p2.x} ${lineY + offset} L ${p2.x} ${p2.y}`;
      } else {
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x} ${lineY + radius} ${arc2} ${p1.x + offset} ${lineY} L ${p2.x - radius} ${lineY} ${arc} ${p2.x} ${lineY - offset} L ${p2.x} ${p2.y}`;
      }
    }
  } else {
    if (dir === "TB") {
      if (p1.x < p2.x) {
        arc = "A 20 20, 0, 0, 0,";
        arc2 = "A 20 20, 0, 0, 1,";
        radius = 20;
        offset = 20;
        colorClassNum = branchPos[commit2.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p2.x - radius} ${p1.y} ${arc2} ${p2.x} ${p1.y + offset} L ${p2.x} ${p2.y}`;
      }
      if (p1.x > p2.x) {
        arc = "A 20 20, 0, 0, 0,";
        arc2 = "A 20 20, 0, 0, 1,";
        radius = 20;
        offset = 20;
        colorClassNum = branchPos[commit1.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y - radius} ${arc2} ${p1.x - offset} ${p2.y} L ${p2.x} ${p2.y}`;
      }
      if (p1.x === p2.x) {
        colorClassNum = branchPos[commit1.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x + radius} ${p1.y} ${arc} ${p1.x + offset} ${p2.y + radius} L ${p2.x} ${p2.y}`;
      }
    } else {
      if (p1.y < p2.y) {
        arc = "A 20 20, 0, 0, 0,";
        radius = 20;
        offset = 20;
        colorClassNum = branchPos[commit2.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y - radius} ${arc} ${p1.x + offset} ${p2.y} L ${p2.x} ${p2.y}`;
      }
      if (p1.y > p2.y) {
        arc = "A 20 20, 0, 0, 0,";
        radius = 20;
        offset = 20;
        colorClassNum = branchPos[commit1.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p2.x - radius} ${p1.y} ${arc} ${p2.x} ${p1.y - offset} L ${p2.x} ${p2.y}`;
      }
      if (p1.y === p2.y) {
        colorClassNum = branchPos[commit1.branch].index;
        lineDef = `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y - radius} ${arc} ${p1.x + offset} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    }
  }
  svg.append("path").attr("d", lineDef).attr("class", "arrow arrow" + colorClassNum % THEME_COLOR_LIMIT);
};
const drawArrows = (svg, commits2) => {
  const gArrows = svg.append("g").attr("class", "commit-arrows");
  Object.keys(commits2).forEach((key) => {
    const commit2 = commits2[key];
    if (commit2.parents && commit2.parents.length > 0) {
      commit2.parents.forEach((parent) => {
        drawArrow(gArrows, commits2[parent], commit2, commits2);
      });
    }
  });
};
const drawBranches = (svg, branches2) => {
  const gitGraphConfig = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.z)().gitGraph;
  const g = svg.append("g");
  branches2.forEach((branch2, index) => {
    const adjustIndexForTheme = index % THEME_COLOR_LIMIT;
    const pos = branchPos[branch2.name].pos;
    const line = g.append("line");
    line.attr("x1", 0);
    line.attr("y1", pos);
    line.attr("x2", maxPos);
    line.attr("y2", pos);
    line.attr("class", "branch branch" + adjustIndexForTheme);
    if (dir === "TB") {
      line.attr("y1", 30);
      line.attr("x1", pos);
      line.attr("y2", maxPos);
      line.attr("x2", pos);
    }
    lanes.push(pos);
    let name = branch2.name;
    const labelElement = drawText(name);
    const bkg = g.insert("rect");
    const branchLabel = g.insert("g").attr("class", "branchLabel");
    const label = branchLabel.insert("g").attr("class", "label branch-label" + adjustIndexForTheme);
    label.node().appendChild(labelElement);
    let bbox = labelElement.getBBox();
    bkg.attr("class", "branchLabelBkg label" + adjustIndexForTheme).attr("rx", 4).attr("ry", 4).attr("x", -bbox.width - 4 - (gitGraphConfig.rotateCommitLabel === true ? 30 : 0)).attr("y", -bbox.height / 2 + 8).attr("width", bbox.width + 18).attr("height", bbox.height + 4);
    label.attr(
      "transform",
      "translate(" + (-bbox.width - 14 - (gitGraphConfig.rotateCommitLabel === true ? 30 : 0)) + ", " + (pos - bbox.height / 2 - 1) + ")"
    );
    if (dir === "TB") {
      bkg.attr("x", pos - bbox.width / 2 - 10).attr("y", 0);
      label.attr("transform", "translate(" + (pos - bbox.width / 2 - 5) + ", 0)");
    }
    if (dir !== "TB") {
      bkg.attr("transform", "translate(-19, " + (pos - bbox.height / 2) + ")");
    }
  });
};
const draw = function(txt, id, ver, diagObj) {
  clear();
  const conf = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.z)();
  const gitGraphConfig = conf.gitGraph;
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug("in gitgraph renderer", txt + "\n", "id:", id, ver);
  allCommitsDict = diagObj.db.getCommits();
  const branches2 = diagObj.db.getBranchesAsObjArray();
  dir = diagObj.db.getDirection();
  const diagram2 = (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)(`[id="${id}"]`);
  let pos = 0;
  branches2.forEach((branch2, index) => {
    const labelElement = drawText(branch2.name);
    const g = diagram2.append("g");
    const branchLabel = g.insert("g").attr("class", "branchLabel");
    const label = branchLabel.insert("g").attr("class", "label branch-label");
    label.node().appendChild(labelElement);
    let bbox = labelElement.getBBox();
    branchPos[branch2.name] = { pos, index };
    pos += 50 + (gitGraphConfig.rotateCommitLabel ? 40 : 0) + (dir === "TB" ? bbox.width / 2 : 0);
    label.remove();
    branchLabel.remove();
    g.remove();
  });
  drawCommits(diagram2, allCommitsDict, false);
  if (gitGraphConfig.showBranches) {
    drawBranches(diagram2, branches2);
  }
  drawArrows(diagram2, allCommitsDict);
  drawCommits(diagram2, allCommitsDict, true);
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.u.insertTitle(
    diagram2,
    "gitTitleText",
    gitGraphConfig.titleTopMargin,
    diagObj.db.getDiagramTitle()
  );
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.A)(
    void 0,
    diagram2,
    gitGraphConfig.diagramPadding,
    gitGraphConfig.useMaxWidth ?? conf.useMaxWidth
  );
};
const gitGraphRenderer = {
  draw
};
const getStyles = (options2) => `
  .commit-id,
  .commit-msg,
  .branch-label {
    fill: lightgrey;
    color: lightgrey;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(
  (i) => `
        .branch-label${i} { fill: ${options2["gitBranchLabel" + i]}; }
        .commit${i} { stroke: ${options2["git" + i]}; fill: ${options2["git" + i]}; }
        .commit-highlight${i} { stroke: ${options2["gitInv" + i]}; fill: ${options2["gitInv" + i]}; }
        .label${i}  { fill: ${options2["git" + i]}; }
        .arrow${i} { stroke: ${options2["git" + i]}; }
        `
).join("\n")}

  .branch {
    stroke-width: 1;
    stroke: ${options2.lineColor};
    stroke-dasharray: 2;
  }
  .commit-label { font-size: ${options2.commitLabelFontSize}; fill: ${options2.commitLabelColor};}
  .commit-label-bkg { font-size: ${options2.commitLabelFontSize}; fill: ${options2.commitLabelBackground}; opacity: 0.5; }
  .tag-label { font-size: ${options2.tagLabelFontSize}; fill: ${options2.tagLabelColor};}
  .tag-label-bkg { fill: ${options2.tagLabelBackground}; stroke: ${options2.tagLabelBorder}; }
  .tag-hole { fill: ${options2.textColor}; }

  .commit-merge {
    stroke: ${options2.primaryColor};
    fill: ${options2.primaryColor};
  }
  .commit-reverse {
    stroke: ${options2.primaryColor};
    fill: ${options2.primaryColor};
    stroke-width: 3;
  }
  .commit-highlight-outer {
  }
  .commit-highlight-inner {
    stroke: ${options2.primaryColor};
    fill: ${options2.primaryColor};
  }

  .arrow { stroke-width: 8; stroke-linecap: round; fill: none}
  .gitTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${options2.textColor};
  }
`;
const gitGraphStyles = getStyles;
const diagram = {
  parser: gitGraphParser,
  db: gitGraphDb,
  renderer: gitGraphRenderer,
  styles: gitGraphStyles
};



/***/ })

};
;