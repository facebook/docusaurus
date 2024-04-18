"use strict";
exports.id = 775;
exports.ids = [775];
exports.modules = {

/***/ 12775:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99854);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63294);
/* harmony import */ var _svgDrawCommon_42e92da3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(47435);
/* harmony import */ var _braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7608);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(27693);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42605);












var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 6], $V1 = [1, 7], $V2 = [1, 8], $V3 = [1, 9], $V4 = [1, 16], $V5 = [1, 11], $V6 = [1, 12], $V7 = [1, 13], $V8 = [1, 14], $V9 = [1, 15], $Va = [1, 27], $Vb = [1, 33], $Vc = [1, 34], $Vd = [1, 35], $Ve = [1, 36], $Vf = [1, 37], $Vg = [1, 72], $Vh = [1, 73], $Vi = [1, 74], $Vj = [1, 75], $Vk = [1, 76], $Vl = [1, 77], $Vm = [1, 78], $Vn = [1, 38], $Vo = [1, 39], $Vp = [1, 40], $Vq = [1, 41], $Vr = [1, 42], $Vs = [1, 43], $Vt = [1, 44], $Vu = [1, 45], $Vv = [1, 46], $Vw = [1, 47], $Vx = [1, 48], $Vy = [1, 49], $Vz = [1, 50], $VA = [1, 51], $VB = [1, 52], $VC = [1, 53], $VD = [1, 54], $VE = [1, 55], $VF = [1, 56], $VG = [1, 57], $VH = [1, 59], $VI = [1, 60], $VJ = [1, 61], $VK = [1, 62], $VL = [1, 63], $VM = [1, 64], $VN = [1, 65], $VO = [1, 66], $VP = [1, 67], $VQ = [1, 68], $VR = [1, 69], $VS = [24, 52], $VT = [24, 44, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84], $VU = [15, 24, 44, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84], $VV = [1, 94], $VW = [1, 95], $VX = [1, 96], $VY = [1, 97], $VZ = [15, 24, 52], $V_ = [7, 8, 9, 10, 18, 22, 25, 26, 27, 28], $V$ = [15, 24, 43, 52], $V01 = [15, 24, 43, 52, 86, 87, 89, 90], $V11 = [15, 43], $V21 = [44, 46, 47, 48, 49, 50, 51, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "mermaidDoc": 4, "direction": 5, "directive": 6, "direction_tb": 7, "direction_bt": 8, "direction_rl": 9, "direction_lr": 10, "graphConfig": 11, "openDirective": 12, "typeDirective": 13, "closeDirective": 14, "NEWLINE": 15, ":": 16, "argDirective": 17, "open_directive": 18, "type_directive": 19, "arg_directive": 20, "close_directive": 21, "C4_CONTEXT": 22, "statements": 23, "EOF": 24, "C4_CONTAINER": 25, "C4_COMPONENT": 26, "C4_DYNAMIC": 27, "C4_DEPLOYMENT": 28, "otherStatements": 29, "diagramStatements": 30, "otherStatement": 31, "title": 32, "accDescription": 33, "acc_title": 34, "acc_title_value": 35, "acc_descr": 36, "acc_descr_value": 37, "acc_descr_multiline_value": 38, "boundaryStatement": 39, "boundaryStartStatement": 40, "boundaryStopStatement": 41, "boundaryStart": 42, "LBRACE": 43, "ENTERPRISE_BOUNDARY": 44, "attributes": 45, "SYSTEM_BOUNDARY": 46, "BOUNDARY": 47, "CONTAINER_BOUNDARY": 48, "NODE": 49, "NODE_L": 50, "NODE_R": 51, "RBRACE": 52, "diagramStatement": 53, "PERSON": 54, "PERSON_EXT": 55, "SYSTEM": 56, "SYSTEM_DB": 57, "SYSTEM_QUEUE": 58, "SYSTEM_EXT": 59, "SYSTEM_EXT_DB": 60, "SYSTEM_EXT_QUEUE": 61, "CONTAINER": 62, "CONTAINER_DB": 63, "CONTAINER_QUEUE": 64, "CONTAINER_EXT": 65, "CONTAINER_EXT_DB": 66, "CONTAINER_EXT_QUEUE": 67, "COMPONENT": 68, "COMPONENT_DB": 69, "COMPONENT_QUEUE": 70, "COMPONENT_EXT": 71, "COMPONENT_EXT_DB": 72, "COMPONENT_EXT_QUEUE": 73, "REL": 74, "BIREL": 75, "REL_U": 76, "REL_D": 77, "REL_L": 78, "REL_R": 79, "REL_B": 80, "REL_INDEX": 81, "UPDATE_EL_STYLE": 82, "UPDATE_REL_STYLE": 83, "UPDATE_LAYOUT_CONFIG": 84, "attribute": 85, "STR": 86, "STR_KEY": 87, "STR_VALUE": 88, "ATTRIBUTE": 89, "ATTRIBUTE_EMPTY": 90, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 7: "direction_tb", 8: "direction_bt", 9: "direction_rl", 10: "direction_lr", 15: "NEWLINE", 16: ":", 18: "open_directive", 19: "type_directive", 20: "arg_directive", 21: "close_directive", 22: "C4_CONTEXT", 24: "EOF", 25: "C4_CONTAINER", 26: "C4_COMPONENT", 27: "C4_DYNAMIC", 28: "C4_DEPLOYMENT", 32: "title", 33: "accDescription", 34: "acc_title", 35: "acc_title_value", 36: "acc_descr", 37: "acc_descr_value", 38: "acc_descr_multiline_value", 43: "LBRACE", 44: "ENTERPRISE_BOUNDARY", 46: "SYSTEM_BOUNDARY", 47: "BOUNDARY", 48: "CONTAINER_BOUNDARY", 49: "NODE", 50: "NODE_L", 51: "NODE_R", 52: "RBRACE", 54: "PERSON", 55: "PERSON_EXT", 56: "SYSTEM", 57: "SYSTEM_DB", 58: "SYSTEM_QUEUE", 59: "SYSTEM_EXT", 60: "SYSTEM_EXT_DB", 61: "SYSTEM_EXT_QUEUE", 62: "CONTAINER", 63: "CONTAINER_DB", 64: "CONTAINER_QUEUE", 65: "CONTAINER_EXT", 66: "CONTAINER_EXT_DB", 67: "CONTAINER_EXT_QUEUE", 68: "COMPONENT", 69: "COMPONENT_DB", 70: "COMPONENT_QUEUE", 71: "COMPONENT_EXT", 72: "COMPONENT_EXT_DB", 73: "COMPONENT_EXT_QUEUE", 74: "REL", 75: "BIREL", 76: "REL_U", 77: "REL_D", 78: "REL_L", 79: "REL_R", 80: "REL_B", 81: "REL_INDEX", 82: "UPDATE_EL_STYLE", 83: "UPDATE_REL_STYLE", 84: "UPDATE_LAYOUT_CONFIG", 86: "STR", 87: "STR_KEY", 88: "STR_VALUE", 89: "ATTRIBUTE", 90: "ATTRIBUTE_EMPTY" },
    productions_: [0, [3, 1], [3, 1], [3, 2], [5, 1], [5, 1], [5, 1], [5, 1], [4, 1], [6, 4], [6, 6], [12, 1], [13, 1], [17, 1], [14, 1], [11, 4], [11, 4], [11, 4], [11, 4], [11, 4], [23, 1], [23, 1], [23, 2], [29, 1], [29, 2], [29, 3], [31, 1], [31, 1], [31, 2], [31, 2], [31, 1], [39, 3], [40, 3], [40, 3], [40, 4], [42, 2], [42, 2], [42, 2], [42, 2], [42, 2], [42, 2], [42, 2], [41, 1], [30, 1], [30, 2], [30, 3], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 1], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [53, 2], [45, 1], [45, 2], [85, 1], [85, 2], [85, 1], [85, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 4:
          yy.setDirection("TB");
          break;
        case 5:
          yy.setDirection("BT");
          break;
        case 6:
          yy.setDirection("RL");
          break;
        case 7:
          yy.setDirection("LR");
          break;
        case 11:
          yy.parseDirective("%%{", "open_directive");
          break;
        case 12:
          break;
        case 13:
          $$[$0] = $$[$0].trim().replace(/'/g, '"');
          yy.parseDirective($$[$0], "arg_directive");
          break;
        case 14:
          yy.parseDirective("}%%", "close_directive", "c4Context");
          break;
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
          yy.setC4Type($$[$0 - 3]);
          break;
        case 26:
          yy.setTitle($$[$0].substring(6));
          this.$ = $$[$0].substring(6);
          break;
        case 27:
          yy.setAccDescription($$[$0].substring(15));
          this.$ = $$[$0].substring(15);
          break;
        case 28:
          this.$ = $$[$0].trim();
          yy.setTitle(this.$);
          break;
        case 29:
        case 30:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 35:
        case 36:
          $$[$0].splice(2, 0, "ENTERPRISE");
          yy.addPersonOrSystemBoundary(...$$[$0]);
          this.$ = $$[$0];
          break;
        case 37:
          yy.addPersonOrSystemBoundary(...$$[$0]);
          this.$ = $$[$0];
          break;
        case 38:
          $$[$0].splice(2, 0, "CONTAINER");
          yy.addContainerBoundary(...$$[$0]);
          this.$ = $$[$0];
          break;
        case 39:
          yy.addDeploymentNode("node", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 40:
          yy.addDeploymentNode("nodeL", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 41:
          yy.addDeploymentNode("nodeR", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 42:
          yy.popBoundaryParseStack();
          break;
        case 46:
          yy.addPersonOrSystem("person", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 47:
          yy.addPersonOrSystem("external_person", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 48:
          yy.addPersonOrSystem("system", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 49:
          yy.addPersonOrSystem("system_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 50:
          yy.addPersonOrSystem("system_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 51:
          yy.addPersonOrSystem("external_system", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 52:
          yy.addPersonOrSystem("external_system_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 53:
          yy.addPersonOrSystem("external_system_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 54:
          yy.addContainer("container", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 55:
          yy.addContainer("container_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 56:
          yy.addContainer("container_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 57:
          yy.addContainer("external_container", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 58:
          yy.addContainer("external_container_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 59:
          yy.addContainer("external_container_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 60:
          yy.addComponent("component", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 61:
          yy.addComponent("component_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 62:
          yy.addComponent("component_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 63:
          yy.addComponent("external_component", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 64:
          yy.addComponent("external_component_db", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 65:
          yy.addComponent("external_component_queue", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 67:
          yy.addRel("rel", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 68:
          yy.addRel("birel", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 69:
          yy.addRel("rel_u", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 70:
          yy.addRel("rel_d", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 71:
          yy.addRel("rel_l", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 72:
          yy.addRel("rel_r", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 73:
          yy.addRel("rel_b", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 74:
          $$[$0].splice(0, 1);
          yy.addRel("rel", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 75:
          yy.updateElStyle("update_el_style", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 76:
          yy.updateRelStyle("update_rel_style", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 77:
          yy.updateLayoutConfig("update_layout_config", ...$$[$0]);
          this.$ = $$[$0];
          break;
        case 78:
          this.$ = [$$[$0]];
          break;
        case 79:
          $$[$0].unshift($$[$0 - 1]);
          this.$ = $$[$0];
          break;
        case 80:
        case 82:
          this.$ = $$[$0].trim();
          break;
        case 81:
          let kv = {};
          kv[$$[$0 - 1].trim()] = $$[$0].trim();
          this.$ = kv;
          break;
        case 83:
          this.$ = "";
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 5: 3, 6: 4, 7: $V0, 8: $V1, 9: $V2, 10: $V3, 11: 5, 12: 10, 18: $V4, 22: $V5, 25: $V6, 26: $V7, 27: $V8, 28: $V9 }, { 1: [3] }, { 1: [2, 1] }, { 1: [2, 2] }, { 3: 17, 4: 2, 5: 3, 6: 4, 7: $V0, 8: $V1, 9: $V2, 10: $V3, 11: 5, 12: 10, 18: $V4, 22: $V5, 25: $V6, 26: $V7, 27: $V8, 28: $V9 }, { 1: [2, 8] }, { 1: [2, 4] }, { 1: [2, 5] }, { 1: [2, 6] }, { 1: [2, 7] }, { 13: 18, 19: [1, 19] }, { 15: [1, 20] }, { 15: [1, 21] }, { 15: [1, 22] }, { 15: [1, 23] }, { 15: [1, 24] }, { 19: [2, 11] }, { 1: [2, 3] }, { 14: 25, 16: [1, 26], 21: $Va }, o([16, 21], [2, 12]), { 23: 28, 29: 29, 30: 30, 31: 31, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 23: 79, 29: 29, 30: 30, 31: 31, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 23: 80, 29: 29, 30: 30, 31: 31, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 23: 81, 29: 29, 30: 30, 31: 31, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 23: 82, 29: 29, 30: 30, 31: 31, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 15: [1, 83] }, { 17: 84, 20: [1, 85] }, { 15: [2, 14] }, { 24: [1, 86] }, o($VS, [2, 20], { 53: 32, 39: 58, 40: 70, 42: 71, 30: 87, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }), o($VS, [2, 21]), o($VT, [2, 23], { 15: [1, 88] }), o($VS, [2, 43], { 15: [1, 89] }), o($VU, [2, 26]), o($VU, [2, 27]), { 35: [1, 90] }, { 37: [1, 91] }, o($VU, [2, 30]), { 45: 92, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 98, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 99, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 100, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 101, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 102, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 103, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 104, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 105, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 106, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 107, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 108, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 109, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 110, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 111, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 112, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 113, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 114, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 115, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 116, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, o($VZ, [2, 66]), { 45: 117, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 118, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 119, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 120, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 121, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 122, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 123, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 124, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 125, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 126, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 127, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 30: 128, 39: 58, 40: 70, 42: 71, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 53: 32, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }, { 15: [1, 130], 43: [1, 129] }, { 45: 131, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 132, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 133, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 134, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 135, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 136, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 45: 137, 85: 93, 86: $VV, 87: $VW, 89: $VX, 90: $VY }, { 24: [1, 138] }, { 24: [1, 139] }, { 24: [1, 140] }, { 24: [1, 141] }, o($V_, [2, 9]), { 14: 142, 21: $Va }, { 21: [2, 13] }, { 1: [2, 15] }, o($VS, [2, 22]), o($VT, [2, 24], { 31: 31, 29: 143, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf }), o($VS, [2, 44], { 29: 29, 30: 30, 31: 31, 53: 32, 39: 58, 40: 70, 42: 71, 23: 144, 32: $Vb, 33: $Vc, 34: $Vd, 36: $Ve, 38: $Vf, 44: $Vg, 46: $Vh, 47: $Vi, 48: $Vj, 49: $Vk, 50: $Vl, 51: $Vm, 54: $Vn, 55: $Vo, 56: $Vp, 57: $Vq, 58: $Vr, 59: $Vs, 60: $Vt, 61: $Vu, 62: $Vv, 63: $Vw, 64: $Vx, 65: $Vy, 66: $Vz, 67: $VA, 68: $VB, 69: $VC, 70: $VD, 71: $VE, 72: $VF, 73: $VG, 74: $VH, 75: $VI, 76: $VJ, 77: $VK, 78: $VL, 79: $VM, 80: $VN, 81: $VO, 82: $VP, 83: $VQ, 84: $VR }), o($VU, [2, 28]), o($VU, [2, 29]), o($VZ, [2, 46]), o($V$, [2, 78], { 85: 93, 45: 145, 86: $VV, 87: $VW, 89: $VX, 90: $VY }), o($V01, [2, 80]), { 88: [1, 146] }, o($V01, [2, 82]), o($V01, [2, 83]), o($VZ, [2, 47]), o($VZ, [2, 48]), o($VZ, [2, 49]), o($VZ, [2, 50]), o($VZ, [2, 51]), o($VZ, [2, 52]), o($VZ, [2, 53]), o($VZ, [2, 54]), o($VZ, [2, 55]), o($VZ, [2, 56]), o($VZ, [2, 57]), o($VZ, [2, 58]), o($VZ, [2, 59]), o($VZ, [2, 60]), o($VZ, [2, 61]), o($VZ, [2, 62]), o($VZ, [2, 63]), o($VZ, [2, 64]), o($VZ, [2, 65]), o($VZ, [2, 67]), o($VZ, [2, 68]), o($VZ, [2, 69]), o($VZ, [2, 70]), o($VZ, [2, 71]), o($VZ, [2, 72]), o($VZ, [2, 73]), o($VZ, [2, 74]), o($VZ, [2, 75]), o($VZ, [2, 76]), o($VZ, [2, 77]), { 41: 147, 52: [1, 148] }, { 15: [1, 149] }, { 43: [1, 150] }, o($V11, [2, 35]), o($V11, [2, 36]), o($V11, [2, 37]), o($V11, [2, 38]), o($V11, [2, 39]), o($V11, [2, 40]), o($V11, [2, 41]), { 1: [2, 16] }, { 1: [2, 17] }, { 1: [2, 18] }, { 1: [2, 19] }, { 15: [1, 151] }, o($VT, [2, 25]), o($VS, [2, 45]), o($V$, [2, 79]), o($V01, [2, 81]), o($VZ, [2, 31]), o($VZ, [2, 42]), o($V21, [2, 32]), o($V21, [2, 33], { 15: [1, 152] }), o($V_, [2, 10]), o($V21, [2, 34])],
    defaultActions: { 2: [2, 1], 3: [2, 2], 5: [2, 8], 6: [2, 4], 7: [2, 5], 8: [2, 6], 9: [2, 7], 16: [2, 11], 17: [2, 3], 27: [2, 14], 85: [2, 13], 86: [2, 15], 138: [2, 16], 139: [2, 17], 140: [2, 18], 141: [2, 19] },
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
        var c2 = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c2 + "^";
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
      options: {},
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            this.begin("open_directive");
            return 18;
          case 1:
            return 7;
          case 2:
            return 8;
          case 3:
            return 9;
          case 4:
            return 10;
          case 5:
            this.begin("type_directive");
            return 19;
          case 6:
            this.popState();
            this.begin("arg_directive");
            return 16;
          case 7:
            this.popState();
            this.popState();
            return 21;
          case 8:
            return 20;
          case 9:
            return 32;
          case 10:
            return 33;
          case 11:
            this.begin("acc_title");
            return 34;
          case 12:
            this.popState();
            return "acc_title_value";
          case 13:
            this.begin("acc_descr");
            return 36;
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
            break;
          case 19:
            c;
            break;
          case 20:
            return 15;
          case 21:
            break;
          case 22:
            return 22;
          case 23:
            return 25;
          case 24:
            return 26;
          case 25:
            return 27;
          case 26:
            return 28;
          case 27:
            this.begin("person_ext");
            return 55;
          case 28:
            this.begin("person");
            return 54;
          case 29:
            this.begin("system_ext_queue");
            return 61;
          case 30:
            this.begin("system_ext_db");
            return 60;
          case 31:
            this.begin("system_ext");
            return 59;
          case 32:
            this.begin("system_queue");
            return 58;
          case 33:
            this.begin("system_db");
            return 57;
          case 34:
            this.begin("system");
            return 56;
          case 35:
            this.begin("boundary");
            return 47;
          case 36:
            this.begin("enterprise_boundary");
            return 44;
          case 37:
            this.begin("system_boundary");
            return 46;
          case 38:
            this.begin("container_ext_queue");
            return 67;
          case 39:
            this.begin("container_ext_db");
            return 66;
          case 40:
            this.begin("container_ext");
            return 65;
          case 41:
            this.begin("container_queue");
            return 64;
          case 42:
            this.begin("container_db");
            return 63;
          case 43:
            this.begin("container");
            return 62;
          case 44:
            this.begin("container_boundary");
            return 48;
          case 45:
            this.begin("component_ext_queue");
            return 73;
          case 46:
            this.begin("component_ext_db");
            return 72;
          case 47:
            this.begin("component_ext");
            return 71;
          case 48:
            this.begin("component_queue");
            return 70;
          case 49:
            this.begin("component_db");
            return 69;
          case 50:
            this.begin("component");
            return 68;
          case 51:
            this.begin("node");
            return 49;
          case 52:
            this.begin("node");
            return 49;
          case 53:
            this.begin("node_l");
            return 50;
          case 54:
            this.begin("node_r");
            return 51;
          case 55:
            this.begin("rel");
            return 74;
          case 56:
            this.begin("birel");
            return 75;
          case 57:
            this.begin("rel_u");
            return 76;
          case 58:
            this.begin("rel_u");
            return 76;
          case 59:
            this.begin("rel_d");
            return 77;
          case 60:
            this.begin("rel_d");
            return 77;
          case 61:
            this.begin("rel_l");
            return 78;
          case 62:
            this.begin("rel_l");
            return 78;
          case 63:
            this.begin("rel_r");
            return 79;
          case 64:
            this.begin("rel_r");
            return 79;
          case 65:
            this.begin("rel_b");
            return 80;
          case 66:
            this.begin("rel_index");
            return 81;
          case 67:
            this.begin("update_el_style");
            return 82;
          case 68:
            this.begin("update_rel_style");
            return 83;
          case 69:
            this.begin("update_layout_config");
            return 84;
          case 70:
            return "EOF_IN_STRUCT";
          case 71:
            this.begin("attribute");
            return "ATTRIBUTE_EMPTY";
          case 72:
            this.begin("attribute");
            break;
          case 73:
            this.popState();
            this.popState();
            break;
          case 74:
            return 90;
          case 75:
            break;
          case 76:
            return 90;
          case 77:
            this.begin("string");
            break;
          case 78:
            this.popState();
            break;
          case 79:
            return "STR";
          case 80:
            this.begin("string_kv");
            break;
          case 81:
            this.begin("string_kv_key");
            return "STR_KEY";
          case 82:
            this.popState();
            this.begin("string_kv_value");
            break;
          case 83:
            return "STR_VALUE";
          case 84:
            this.popState();
            this.popState();
            break;
          case 85:
            return "STR";
          case 86:
            return "LBRACE";
          case 87:
            return "RBRACE";
          case 88:
            return "SPACE";
          case 89:
            return "EOL";
          case 90:
            return 24;
        }
      },
      rules: [/^(?:%%\{)/, /^(?:.*direction\s+TB[^\n]*)/, /^(?:.*direction\s+BT[^\n]*)/, /^(?:.*direction\s+RL[^\n]*)/, /^(?:.*direction\s+LR[^\n]*)/, /^(?:((?:(?!\}%%)[^:.])*))/, /^(?::)/, /^(?:\}%%)/, /^(?:((?:(?!\}%%).|\n)*))/, /^(?:title\s[^#\n;]+)/, /^(?:accDescription\s[^#\n;]+)/, /^(?:accTitle\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*\{\s*)/, /^(?:[\}])/, /^(?:[^\}]*)/, /^(?:%%(?!\{)*[^\n]*(\r?\n?)+)/, /^(?:%%[^\n]*(\r?\n)*)/, /^(?:\s*(\r?\n)+)/, /^(?:\s+)/, /^(?:C4Context\b)/, /^(?:C4Container\b)/, /^(?:C4Component\b)/, /^(?:C4Dynamic\b)/, /^(?:C4Deployment\b)/, /^(?:Person_Ext\b)/, /^(?:Person\b)/, /^(?:SystemQueue_Ext\b)/, /^(?:SystemDb_Ext\b)/, /^(?:System_Ext\b)/, /^(?:SystemQueue\b)/, /^(?:SystemDb\b)/, /^(?:System\b)/, /^(?:Boundary\b)/, /^(?:Enterprise_Boundary\b)/, /^(?:System_Boundary\b)/, /^(?:ContainerQueue_Ext\b)/, /^(?:ContainerDb_Ext\b)/, /^(?:Container_Ext\b)/, /^(?:ContainerQueue\b)/, /^(?:ContainerDb\b)/, /^(?:Container\b)/, /^(?:Container_Boundary\b)/, /^(?:ComponentQueue_Ext\b)/, /^(?:ComponentDb_Ext\b)/, /^(?:Component_Ext\b)/, /^(?:ComponentQueue\b)/, /^(?:ComponentDb\b)/, /^(?:Component\b)/, /^(?:Deployment_Node\b)/, /^(?:Node\b)/, /^(?:Node_L\b)/, /^(?:Node_R\b)/, /^(?:Rel\b)/, /^(?:BiRel\b)/, /^(?:Rel_Up\b)/, /^(?:Rel_U\b)/, /^(?:Rel_Down\b)/, /^(?:Rel_D\b)/, /^(?:Rel_Left\b)/, /^(?:Rel_L\b)/, /^(?:Rel_Right\b)/, /^(?:Rel_R\b)/, /^(?:Rel_Back\b)/, /^(?:RelIndex\b)/, /^(?:UpdateElementStyle\b)/, /^(?:UpdateRelStyle\b)/, /^(?:UpdateLayoutConfig\b)/, /^(?:$)/, /^(?:[(][ ]*[,])/, /^(?:[(])/, /^(?:[)])/, /^(?:,,)/, /^(?:,)/, /^(?:[ ]*["]["])/, /^(?:[ ]*["])/, /^(?:["])/, /^(?:[^"]*)/, /^(?:[ ]*[\$])/, /^(?:[^=]*)/, /^(?:[=][ ]*["])/, /^(?:[^"]+)/, /^(?:["])/, /^(?:[^,]+)/, /^(?:\{)/, /^(?:\})/, /^(?:[\s]+)/, /^(?:[\n\r]+)/, /^(?:$)/],
      conditions: { "acc_descr_multiline": { "rules": [16, 17], "inclusive": false }, "acc_descr": { "rules": [14], "inclusive": false }, "acc_title": { "rules": [12], "inclusive": false }, "close_directive": { "rules": [], "inclusive": false }, "arg_directive": { "rules": [7, 8], "inclusive": false }, "type_directive": { "rules": [6, 7], "inclusive": false }, "open_directive": { "rules": [5], "inclusive": false }, "string_kv_value": { "rules": [83, 84], "inclusive": false }, "string_kv_key": { "rules": [82], "inclusive": false }, "string_kv": { "rules": [81], "inclusive": false }, "string": { "rules": [78, 79], "inclusive": false }, "attribute": { "rules": [73, 74, 75, 76, 77, 80, 85], "inclusive": false }, "update_layout_config": { "rules": [70, 71, 72, 73], "inclusive": false }, "update_rel_style": { "rules": [70, 71, 72, 73], "inclusive": false }, "update_el_style": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_b": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_r": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_l": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_d": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_u": { "rules": [70, 71, 72, 73], "inclusive": false }, "rel_bi": { "rules": [], "inclusive": false }, "rel": { "rules": [70, 71, 72, 73], "inclusive": false }, "node_r": { "rules": [70, 71, 72, 73], "inclusive": false }, "node_l": { "rules": [70, 71, 72, 73], "inclusive": false }, "node": { "rules": [70, 71, 72, 73], "inclusive": false }, "index": { "rules": [], "inclusive": false }, "rel_index": { "rules": [70, 71, 72, 73], "inclusive": false }, "component_ext_queue": { "rules": [], "inclusive": false }, "component_ext_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "component_ext": { "rules": [70, 71, 72, 73], "inclusive": false }, "component_queue": { "rules": [70, 71, 72, 73], "inclusive": false }, "component_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "component": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_boundary": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_ext_queue": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_ext_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_ext": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_queue": { "rules": [70, 71, 72, 73], "inclusive": false }, "container_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "container": { "rules": [70, 71, 72, 73], "inclusive": false }, "birel": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_boundary": { "rules": [70, 71, 72, 73], "inclusive": false }, "enterprise_boundary": { "rules": [70, 71, 72, 73], "inclusive": false }, "boundary": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_ext_queue": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_ext_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_ext": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_queue": { "rules": [70, 71, 72, 73], "inclusive": false }, "system_db": { "rules": [70, 71, 72, 73], "inclusive": false }, "system": { "rules": [70, 71, 72, 73], "inclusive": false }, "person_ext": { "rules": [70, 71, 72, 73], "inclusive": false }, "person": { "rules": [70, 71, 72, 73], "inclusive": false }, "INITIAL": { "rules": [0, 1, 2, 3, 4, 9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 86, 87, 88, 89, 90], "inclusive": true } }
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
const c4Parser = parser;
let c4ShapeArray = [];
let boundaryParseStack = [""];
let currentBoundaryParse = "global";
let parentBoundaryParse = "";
let boundarys = [
  {
    alias: "global",
    label: { text: "global" },
    type: { text: "global" },
    tags: null,
    link: null,
    parentBoundary: ""
  }
];
let rels = [];
let title = "";
let wrapEnabled = false;
let c4ShapeInRow$1 = 4;
let c4BoundaryInRow$1 = 2;
var c4Type;
const getC4Type = function() {
  return c4Type;
};
const setC4Type = function(c4TypeParam) {
  let sanitizedText = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.d)(c4TypeParam, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  c4Type = sanitizedText;
};
const parseDirective = function(statement, context, type) {
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.m.parseDirective(this, statement, context, type);
};
const addRel = function(type, from, to, label, techn, descr, sprite, tags, link) {
  if (type === void 0 || type === null || from === void 0 || from === null || to === void 0 || to === null || label === void 0 || label === null) {
    return;
  }
  let rel = {};
  const old = rels.find((rel2) => rel2.from === from && rel2.to === to);
  if (old) {
    rel = old;
  } else {
    rels.push(rel);
  }
  rel.type = type;
  rel.from = from;
  rel.to = to;
  rel.label = { text: label };
  if (techn === void 0 || techn === null) {
    rel.techn = { text: "" };
  } else {
    if (typeof techn === "object") {
      let [key, value] = Object.entries(techn)[0];
      rel[key] = { text: value };
    } else {
      rel.techn = { text: techn };
    }
  }
  if (descr === void 0 || descr === null) {
    rel.descr = { text: "" };
  } else {
    if (typeof descr === "object") {
      let [key, value] = Object.entries(descr)[0];
      rel[key] = { text: value };
    } else {
      rel.descr = { text: descr };
    }
  }
  if (typeof sprite === "object") {
    let [key, value] = Object.entries(sprite)[0];
    rel[key] = value;
  } else {
    rel.sprite = sprite;
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    rel[key] = value;
  } else {
    rel.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    rel[key] = value;
  } else {
    rel.link = link;
  }
  rel.wrap = autoWrap();
};
const addPersonOrSystem = function(typeC4Shape, alias, label, descr, sprite, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let personOrSystem = {};
  const old = c4ShapeArray.find((personOrSystem2) => personOrSystem2.alias === alias);
  if (old && alias === old.alias) {
    personOrSystem = old;
  } else {
    personOrSystem.alias = alias;
    c4ShapeArray.push(personOrSystem);
  }
  if (label === void 0 || label === null) {
    personOrSystem.label = { text: "" };
  } else {
    personOrSystem.label = { text: label };
  }
  if (descr === void 0 || descr === null) {
    personOrSystem.descr = { text: "" };
  } else {
    if (typeof descr === "object") {
      let [key, value] = Object.entries(descr)[0];
      personOrSystem[key] = { text: value };
    } else {
      personOrSystem.descr = { text: descr };
    }
  }
  if (typeof sprite === "object") {
    let [key, value] = Object.entries(sprite)[0];
    personOrSystem[key] = value;
  } else {
    personOrSystem.sprite = sprite;
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    personOrSystem[key] = value;
  } else {
    personOrSystem.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    personOrSystem[key] = value;
  } else {
    personOrSystem.link = link;
  }
  personOrSystem.typeC4Shape = { text: typeC4Shape };
  personOrSystem.parentBoundary = currentBoundaryParse;
  personOrSystem.wrap = autoWrap();
};
const addContainer = function(typeC4Shape, alias, label, techn, descr, sprite, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let container = {};
  const old = c4ShapeArray.find((container2) => container2.alias === alias);
  if (old && alias === old.alias) {
    container = old;
  } else {
    container.alias = alias;
    c4ShapeArray.push(container);
  }
  if (label === void 0 || label === null) {
    container.label = { text: "" };
  } else {
    container.label = { text: label };
  }
  if (techn === void 0 || techn === null) {
    container.techn = { text: "" };
  } else {
    if (typeof techn === "object") {
      let [key, value] = Object.entries(techn)[0];
      container[key] = { text: value };
    } else {
      container.techn = { text: techn };
    }
  }
  if (descr === void 0 || descr === null) {
    container.descr = { text: "" };
  } else {
    if (typeof descr === "object") {
      let [key, value] = Object.entries(descr)[0];
      container[key] = { text: value };
    } else {
      container.descr = { text: descr };
    }
  }
  if (typeof sprite === "object") {
    let [key, value] = Object.entries(sprite)[0];
    container[key] = value;
  } else {
    container.sprite = sprite;
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    container[key] = value;
  } else {
    container.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    container[key] = value;
  } else {
    container.link = link;
  }
  container.wrap = autoWrap();
  container.typeC4Shape = { text: typeC4Shape };
  container.parentBoundary = currentBoundaryParse;
};
const addComponent = function(typeC4Shape, alias, label, techn, descr, sprite, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let component = {};
  const old = c4ShapeArray.find((component2) => component2.alias === alias);
  if (old && alias === old.alias) {
    component = old;
  } else {
    component.alias = alias;
    c4ShapeArray.push(component);
  }
  if (label === void 0 || label === null) {
    component.label = { text: "" };
  } else {
    component.label = { text: label };
  }
  if (techn === void 0 || techn === null) {
    component.techn = { text: "" };
  } else {
    if (typeof techn === "object") {
      let [key, value] = Object.entries(techn)[0];
      component[key] = { text: value };
    } else {
      component.techn = { text: techn };
    }
  }
  if (descr === void 0 || descr === null) {
    component.descr = { text: "" };
  } else {
    if (typeof descr === "object") {
      let [key, value] = Object.entries(descr)[0];
      component[key] = { text: value };
    } else {
      component.descr = { text: descr };
    }
  }
  if (typeof sprite === "object") {
    let [key, value] = Object.entries(sprite)[0];
    component[key] = value;
  } else {
    component.sprite = sprite;
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    component[key] = value;
  } else {
    component.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    component[key] = value;
  } else {
    component.link = link;
  }
  component.wrap = autoWrap();
  component.typeC4Shape = { text: typeC4Shape };
  component.parentBoundary = currentBoundaryParse;
};
const addPersonOrSystemBoundary = function(alias, label, type, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let boundary = {};
  const old = boundarys.find((boundary2) => boundary2.alias === alias);
  if (old && alias === old.alias) {
    boundary = old;
  } else {
    boundary.alias = alias;
    boundarys.push(boundary);
  }
  if (label === void 0 || label === null) {
    boundary.label = { text: "" };
  } else {
    boundary.label = { text: label };
  }
  if (type === void 0 || type === null) {
    boundary.type = { text: "system" };
  } else {
    if (typeof type === "object") {
      let [key, value] = Object.entries(type)[0];
      boundary[key] = { text: value };
    } else {
      boundary.type = { text: type };
    }
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    boundary[key] = value;
  } else {
    boundary.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    boundary[key] = value;
  } else {
    boundary.link = link;
  }
  boundary.parentBoundary = currentBoundaryParse;
  boundary.wrap = autoWrap();
  parentBoundaryParse = currentBoundaryParse;
  currentBoundaryParse = alias;
  boundaryParseStack.push(parentBoundaryParse);
};
const addContainerBoundary = function(alias, label, type, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let boundary = {};
  const old = boundarys.find((boundary2) => boundary2.alias === alias);
  if (old && alias === old.alias) {
    boundary = old;
  } else {
    boundary.alias = alias;
    boundarys.push(boundary);
  }
  if (label === void 0 || label === null) {
    boundary.label = { text: "" };
  } else {
    boundary.label = { text: label };
  }
  if (type === void 0 || type === null) {
    boundary.type = { text: "container" };
  } else {
    if (typeof type === "object") {
      let [key, value] = Object.entries(type)[0];
      boundary[key] = { text: value };
    } else {
      boundary.type = { text: type };
    }
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    boundary[key] = value;
  } else {
    boundary.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    boundary[key] = value;
  } else {
    boundary.link = link;
  }
  boundary.parentBoundary = currentBoundaryParse;
  boundary.wrap = autoWrap();
  parentBoundaryParse = currentBoundaryParse;
  currentBoundaryParse = alias;
  boundaryParseStack.push(parentBoundaryParse);
};
const addDeploymentNode = function(nodeType, alias, label, type, descr, sprite, tags, link) {
  if (alias === null || label === null) {
    return;
  }
  let boundary = {};
  const old = boundarys.find((boundary2) => boundary2.alias === alias);
  if (old && alias === old.alias) {
    boundary = old;
  } else {
    boundary.alias = alias;
    boundarys.push(boundary);
  }
  if (label === void 0 || label === null) {
    boundary.label = { text: "" };
  } else {
    boundary.label = { text: label };
  }
  if (type === void 0 || type === null) {
    boundary.type = { text: "node" };
  } else {
    if (typeof type === "object") {
      let [key, value] = Object.entries(type)[0];
      boundary[key] = { text: value };
    } else {
      boundary.type = { text: type };
    }
  }
  if (descr === void 0 || descr === null) {
    boundary.descr = { text: "" };
  } else {
    if (typeof descr === "object") {
      let [key, value] = Object.entries(descr)[0];
      boundary[key] = { text: value };
    } else {
      boundary.descr = { text: descr };
    }
  }
  if (typeof tags === "object") {
    let [key, value] = Object.entries(tags)[0];
    boundary[key] = value;
  } else {
    boundary.tags = tags;
  }
  if (typeof link === "object") {
    let [key, value] = Object.entries(link)[0];
    boundary[key] = value;
  } else {
    boundary.link = link;
  }
  boundary.nodeType = nodeType;
  boundary.parentBoundary = currentBoundaryParse;
  boundary.wrap = autoWrap();
  parentBoundaryParse = currentBoundaryParse;
  currentBoundaryParse = alias;
  boundaryParseStack.push(parentBoundaryParse);
};
const popBoundaryParseStack = function() {
  currentBoundaryParse = parentBoundaryParse;
  boundaryParseStack.pop();
  parentBoundaryParse = boundaryParseStack.pop();
  boundaryParseStack.push(parentBoundaryParse);
};
const updateElStyle = function(typeC4Shape, elementName, bgColor, fontColor, borderColor, shadowing, shape, sprite, techn, legendText, legendSprite) {
  let old = c4ShapeArray.find((element) => element.alias === elementName);
  if (old === void 0) {
    old = boundarys.find((element) => element.alias === elementName);
    if (old === void 0) {
      return;
    }
  }
  if (bgColor !== void 0 && bgColor !== null) {
    if (typeof bgColor === "object") {
      let [key, value] = Object.entries(bgColor)[0];
      old[key] = value;
    } else {
      old.bgColor = bgColor;
    }
  }
  if (fontColor !== void 0 && fontColor !== null) {
    if (typeof fontColor === "object") {
      let [key, value] = Object.entries(fontColor)[0];
      old[key] = value;
    } else {
      old.fontColor = fontColor;
    }
  }
  if (borderColor !== void 0 && borderColor !== null) {
    if (typeof borderColor === "object") {
      let [key, value] = Object.entries(borderColor)[0];
      old[key] = value;
    } else {
      old.borderColor = borderColor;
    }
  }
  if (shadowing !== void 0 && shadowing !== null) {
    if (typeof shadowing === "object") {
      let [key, value] = Object.entries(shadowing)[0];
      old[key] = value;
    } else {
      old.shadowing = shadowing;
    }
  }
  if (shape !== void 0 && shape !== null) {
    if (typeof shape === "object") {
      let [key, value] = Object.entries(shape)[0];
      old[key] = value;
    } else {
      old.shape = shape;
    }
  }
  if (sprite !== void 0 && sprite !== null) {
    if (typeof sprite === "object") {
      let [key, value] = Object.entries(sprite)[0];
      old[key] = value;
    } else {
      old.sprite = sprite;
    }
  }
  if (techn !== void 0 && techn !== null) {
    if (typeof techn === "object") {
      let [key, value] = Object.entries(techn)[0];
      old[key] = value;
    } else {
      old.techn = techn;
    }
  }
  if (legendText !== void 0 && legendText !== null) {
    if (typeof legendText === "object") {
      let [key, value] = Object.entries(legendText)[0];
      old[key] = value;
    } else {
      old.legendText = legendText;
    }
  }
  if (legendSprite !== void 0 && legendSprite !== null) {
    if (typeof legendSprite === "object") {
      let [key, value] = Object.entries(legendSprite)[0];
      old[key] = value;
    } else {
      old.legendSprite = legendSprite;
    }
  }
};
const updateRelStyle = function(typeC4Shape, from, to, textColor, lineColor, offsetX, offsetY) {
  const old = rels.find((rel) => rel.from === from && rel.to === to);
  if (old === void 0) {
    return;
  }
  if (textColor !== void 0 && textColor !== null) {
    if (typeof textColor === "object") {
      let [key, value] = Object.entries(textColor)[0];
      old[key] = value;
    } else {
      old.textColor = textColor;
    }
  }
  if (lineColor !== void 0 && lineColor !== null) {
    if (typeof lineColor === "object") {
      let [key, value] = Object.entries(lineColor)[0];
      old[key] = value;
    } else {
      old.lineColor = lineColor;
    }
  }
  if (offsetX !== void 0 && offsetX !== null) {
    if (typeof offsetX === "object") {
      let [key, value] = Object.entries(offsetX)[0];
      old[key] = parseInt(value);
    } else {
      old.offsetX = parseInt(offsetX);
    }
  }
  if (offsetY !== void 0 && offsetY !== null) {
    if (typeof offsetY === "object") {
      let [key, value] = Object.entries(offsetY)[0];
      old[key] = parseInt(value);
    } else {
      old.offsetY = parseInt(offsetY);
    }
  }
};
const updateLayoutConfig = function(typeC4Shape, c4ShapeInRowParam, c4BoundaryInRowParam) {
  let c4ShapeInRowValue = c4ShapeInRow$1;
  let c4BoundaryInRowValue = c4BoundaryInRow$1;
  if (typeof c4ShapeInRowParam === "object") {
    const value = Object.values(c4ShapeInRowParam)[0];
    c4ShapeInRowValue = parseInt(value);
  } else {
    c4ShapeInRowValue = parseInt(c4ShapeInRowParam);
  }
  if (typeof c4BoundaryInRowParam === "object") {
    const value = Object.values(c4BoundaryInRowParam)[0];
    c4BoundaryInRowValue = parseInt(value);
  } else {
    c4BoundaryInRowValue = parseInt(c4BoundaryInRowParam);
  }
  if (c4ShapeInRowValue >= 1) {
    c4ShapeInRow$1 = c4ShapeInRowValue;
  }
  if (c4BoundaryInRowValue >= 1) {
    c4BoundaryInRow$1 = c4BoundaryInRowValue;
  }
};
const getC4ShapeInRow = function() {
  return c4ShapeInRow$1;
};
const getC4BoundaryInRow = function() {
  return c4BoundaryInRow$1;
};
const getCurrentBoundaryParse = function() {
  return currentBoundaryParse;
};
const getParentBoundaryParse = function() {
  return parentBoundaryParse;
};
const getC4ShapeArray = function(parentBoundary) {
  if (parentBoundary === void 0 || parentBoundary === null) {
    return c4ShapeArray;
  } else {
    return c4ShapeArray.filter((personOrSystem) => {
      return personOrSystem.parentBoundary === parentBoundary;
    });
  }
};
const getC4Shape = function(alias) {
  return c4ShapeArray.find((personOrSystem) => personOrSystem.alias === alias);
};
const getC4ShapeKeys = function(parentBoundary) {
  return Object.keys(getC4ShapeArray(parentBoundary));
};
const getBoundarys = function(parentBoundary) {
  if (parentBoundary === void 0 || parentBoundary === null) {
    return boundarys;
  } else {
    return boundarys.filter((boundary) => boundary.parentBoundary === parentBoundary);
  }
};
const getRels = function() {
  return rels;
};
const getTitle = function() {
  return title;
};
const setWrap = function(wrapSetting) {
  wrapEnabled = wrapSetting;
};
const autoWrap = function() {
  return wrapEnabled;
};
const clear = function() {
  c4ShapeArray = [];
  boundarys = [
    {
      alias: "global",
      label: { text: "global" },
      type: { text: "global" },
      tags: null,
      link: null,
      parentBoundary: ""
    }
  ];
  parentBoundaryParse = "";
  currentBoundaryParse = "global";
  boundaryParseStack = [""];
  rels = [];
  boundaryParseStack = [""];
  title = "";
  wrapEnabled = false;
  c4ShapeInRow$1 = 4;
  c4BoundaryInRow$1 = 2;
};
const LINETYPE = {
  SOLID: 0,
  DOTTED: 1,
  NOTE: 2,
  SOLID_CROSS: 3,
  DOTTED_CROSS: 4,
  SOLID_OPEN: 5,
  DOTTED_OPEN: 6,
  LOOP_START: 10,
  LOOP_END: 11,
  ALT_START: 12,
  ALT_ELSE: 13,
  ALT_END: 14,
  OPT_START: 15,
  OPT_END: 16,
  ACTIVE_START: 17,
  ACTIVE_END: 18,
  PAR_START: 19,
  PAR_AND: 20,
  PAR_END: 21,
  RECT_START: 22,
  RECT_END: 23,
  SOLID_POINT: 24,
  DOTTED_POINT: 25
};
const ARROWTYPE = {
  FILLED: 0,
  OPEN: 1
};
const PLACEMENT = {
  LEFTOF: 0,
  RIGHTOF: 1,
  OVER: 2
};
const setTitle = function(txt) {
  let sanitizedText = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.d)(txt, (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)());
  title = sanitizedText;
};
const c4Db = {
  addPersonOrSystem,
  addPersonOrSystemBoundary,
  addContainer,
  addContainerBoundary,
  addComponent,
  addDeploymentNode,
  popBoundaryParseStack,
  addRel,
  updateElStyle,
  updateRelStyle,
  updateLayoutConfig,
  autoWrap,
  setWrap,
  getC4ShapeArray,
  getC4Shape,
  getC4ShapeKeys,
  getBoundarys,
  getCurrentBoundaryParse,
  getParentBoundaryParse,
  getRels,
  getTitle,
  getC4Type,
  getC4ShapeInRow,
  getC4BoundaryInRow,
  setAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.s,
  getAccTitle: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.g,
  getAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.a,
  setAccDescription: _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.b,
  parseDirective,
  getConfig: () => (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().c4,
  clear,
  LINETYPE,
  ARROWTYPE,
  PLACEMENT,
  setTitle,
  setC4Type
  // apply,
};
const drawRect = function(elem, rectData) {
  return (0,_svgDrawCommon_42e92da3_js__WEBPACK_IMPORTED_MODULE_5__.d)(elem, rectData);
};
const drawImage = function(elem, width, height, x, y, link) {
  const imageElem = elem.append("image");
  imageElem.attr("width", width);
  imageElem.attr("height", height);
  imageElem.attr("x", x);
  imageElem.attr("y", y);
  let sanitizedLink = link.startsWith("data:image/png;base64") ? link : (0,_braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_1__/* .sanitizeUrl */ .Nm)(link);
  imageElem.attr("xlink:href", sanitizedLink);
};
const drawRels$1 = (elem, rels2, conf2) => {
  const relsElem = elem.append("g");
  let i = 0;
  for (let rel of rels2) {
    let textColor = rel.textColor ? rel.textColor : "#444444";
    let strokeColor = rel.lineColor ? rel.lineColor : "#444444";
    let offsetX = rel.offsetX ? parseInt(rel.offsetX) : 0;
    let offsetY = rel.offsetY ? parseInt(rel.offsetY) : 0;
    let url = "";
    if (i === 0) {
      let line = relsElem.append("line");
      line.attr("x1", rel.startPoint.x);
      line.attr("y1", rel.startPoint.y);
      line.attr("x2", rel.endPoint.x);
      line.attr("y2", rel.endPoint.y);
      line.attr("stroke-width", "1");
      line.attr("stroke", strokeColor);
      line.style("fill", "none");
      if (rel.type !== "rel_b") {
        line.attr("marker-end", "url(" + url + "#arrowhead)");
      }
      if (rel.type === "birel" || rel.type === "rel_b") {
        line.attr("marker-start", "url(" + url + "#arrowend)");
      }
      i = -1;
    } else {
      let line = relsElem.append("path");
      line.attr("fill", "none").attr("stroke-width", "1").attr("stroke", strokeColor).attr(
        "d",
        "Mstartx,starty Qcontrolx,controly stopx,stopy ".replaceAll("startx", rel.startPoint.x).replaceAll("starty", rel.startPoint.y).replaceAll(
          "controlx",
          rel.startPoint.x + (rel.endPoint.x - rel.startPoint.x) / 2 - (rel.endPoint.x - rel.startPoint.x) / 4
        ).replaceAll("controly", rel.startPoint.y + (rel.endPoint.y - rel.startPoint.y) / 2).replaceAll("stopx", rel.endPoint.x).replaceAll("stopy", rel.endPoint.y)
      );
      if (rel.type !== "rel_b") {
        line.attr("marker-end", "url(" + url + "#arrowhead)");
      }
      if (rel.type === "birel" || rel.type === "rel_b") {
        line.attr("marker-start", "url(" + url + "#arrowend)");
      }
    }
    let messageConf = conf2.messageFont();
    _drawTextCandidateFunc(conf2)(
      rel.label.text,
      relsElem,
      Math.min(rel.startPoint.x, rel.endPoint.x) + Math.abs(rel.endPoint.x - rel.startPoint.x) / 2 + offsetX,
      Math.min(rel.startPoint.y, rel.endPoint.y) + Math.abs(rel.endPoint.y - rel.startPoint.y) / 2 + offsetY,
      rel.label.width,
      rel.label.height,
      { fill: textColor },
      messageConf
    );
    if (rel.techn && rel.techn.text !== "") {
      messageConf = conf2.messageFont();
      _drawTextCandidateFunc(conf2)(
        "[" + rel.techn.text + "]",
        relsElem,
        Math.min(rel.startPoint.x, rel.endPoint.x) + Math.abs(rel.endPoint.x - rel.startPoint.x) / 2 + offsetX,
        Math.min(rel.startPoint.y, rel.endPoint.y) + Math.abs(rel.endPoint.y - rel.startPoint.y) / 2 + conf2.messageFontSize + 5 + offsetY,
        Math.max(rel.label.width, rel.techn.width),
        rel.techn.height,
        { fill: textColor, "font-style": "italic" },
        messageConf
      );
    }
  }
};
const drawBoundary$1 = function(elem, boundary, conf2) {
  const boundaryElem = elem.append("g");
  let fillColor = boundary.bgColor ? boundary.bgColor : "none";
  let strokeColor = boundary.borderColor ? boundary.borderColor : "#444444";
  let fontColor = boundary.fontColor ? boundary.fontColor : "black";
  let attrsValue = { "stroke-width": 1, "stroke-dasharray": "7.0,7.0" };
  if (boundary.nodeType) {
    attrsValue = { "stroke-width": 1 };
  }
  let rectData = {
    x: boundary.x,
    y: boundary.y,
    fill: fillColor,
    stroke: strokeColor,
    width: boundary.width,
    height: boundary.height,
    rx: 2.5,
    ry: 2.5,
    attrs: attrsValue
  };
  drawRect(boundaryElem, rectData);
  let boundaryConf = conf2.boundaryFont();
  boundaryConf.fontWeight = "bold";
  boundaryConf.fontSize = boundaryConf.fontSize + 2;
  boundaryConf.fontColor = fontColor;
  _drawTextCandidateFunc(conf2)(
    boundary.label.text,
    boundaryElem,
    boundary.x,
    boundary.y + boundary.label.Y,
    boundary.width,
    boundary.height,
    { fill: "#444444" },
    boundaryConf
  );
  if (boundary.type && boundary.type.text !== "") {
    boundaryConf = conf2.boundaryFont();
    boundaryConf.fontColor = fontColor;
    _drawTextCandidateFunc(conf2)(
      boundary.type.text,
      boundaryElem,
      boundary.x,
      boundary.y + boundary.type.Y,
      boundary.width,
      boundary.height,
      { fill: "#444444" },
      boundaryConf
    );
  }
  if (boundary.descr && boundary.descr.text !== "") {
    boundaryConf = conf2.boundaryFont();
    boundaryConf.fontSize = boundaryConf.fontSize - 2;
    boundaryConf.fontColor = fontColor;
    _drawTextCandidateFunc(conf2)(
      boundary.descr.text,
      boundaryElem,
      boundary.x,
      boundary.y + boundary.descr.Y,
      boundary.width,
      boundary.height,
      { fill: "#444444" },
      boundaryConf
    );
  }
};
const drawC4Shape = function(elem, c4Shape, conf2) {
  var _a;
  let fillColor = c4Shape.bgColor ? c4Shape.bgColor : conf2[c4Shape.typeC4Shape.text + "_bg_color"];
  let strokeColor = c4Shape.borderColor ? c4Shape.borderColor : conf2[c4Shape.typeC4Shape.text + "_border_color"];
  let fontColor = c4Shape.fontColor ? c4Shape.fontColor : "#FFFFFF";
  let personImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAACD0lEQVR4Xu2YoU4EMRCGT+4j8Ai8AhaH4QHgAUjQuFMECUgMIUgwJAgMhgQsAYUiJCiQIBBY+EITsjfTdme6V24v4c8vyGbb+ZjOtN0bNcvjQXmkH83WvYBWto6PLm6v7p7uH1/w2fXD+PBycX1Pv2l3IdDm/vn7x+dXQiAubRzoURa7gRZWd0iGRIiJbOnhnfYBQZNJjNbuyY2eJG8fkDE3bbG4ep6MHUAsgYxmE3nVs6VsBWJSGccsOlFPmLIViMzLOB7pCVO2AtHJMohH7Fh6zqitQK7m0rJvAVYgGcEpe//PLdDz65sM4pF9N7ICcXDKIB5Nv6j7tD0NoSdM2QrU9Gg0ewE1LqBhHR3BBdvj2vapnidjHxD/q6vd7Pvhr31AwcY8eXMTXAKECZZJFXuEq27aLgQK5uLMohCenGGuGewOxSjBvYBqeG6B+Nqiblggdjnc+ZXDy+FNFpFzw76O3UBAROuXh6FoiAcf5g9eTvUgzy0nWg6I8cXHRUpg5bOVBCo+KDpFajOf23GgPme7RSQ+lacIENUgJ6gg1k6HjgOlqnLqip4tEuhv0hNEMXUD0clyXE3p6pZA0S2nnvTlXwLJEZWlb7cTQH1+USgTN4VhAenm/wea1OCAOmqo6fE1WCb9WSKBah+rbUWPWAmE2Rvk0ApiB45eOyNAzU8xcTvj8KvkKEoOaIYeHNA3ZuygAvFMUO0AAAAASUVORK5CYII=";
  switch (c4Shape.typeC4Shape.text) {
    case "person":
      personImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAACD0lEQVR4Xu2YoU4EMRCGT+4j8Ai8AhaH4QHgAUjQuFMECUgMIUgwJAgMhgQsAYUiJCiQIBBY+EITsjfTdme6V24v4c8vyGbb+ZjOtN0bNcvjQXmkH83WvYBWto6PLm6v7p7uH1/w2fXD+PBycX1Pv2l3IdDm/vn7x+dXQiAubRzoURa7gRZWd0iGRIiJbOnhnfYBQZNJjNbuyY2eJG8fkDE3bbG4ep6MHUAsgYxmE3nVs6VsBWJSGccsOlFPmLIViMzLOB7pCVO2AtHJMohH7Fh6zqitQK7m0rJvAVYgGcEpe//PLdDz65sM4pF9N7ICcXDKIB5Nv6j7tD0NoSdM2QrU9Gg0ewE1LqBhHR3BBdvj2vapnidjHxD/q6vd7Pvhr31AwcY8eXMTXAKECZZJFXuEq27aLgQK5uLMohCenGGuGewOxSjBvYBqeG6B+Nqiblggdjnc+ZXDy+FNFpFzw76O3UBAROuXh6FoiAcf5g9eTvUgzy0nWg6I8cXHRUpg5bOVBCo+KDpFajOf23GgPme7RSQ+lacIENUgJ6gg1k6HjgOlqnLqip4tEuhv0hNEMXUD0clyXE3p6pZA0S2nnvTlXwLJEZWlb7cTQH1+USgTN4VhAenm/wea1OCAOmqo6fE1WCb9WSKBah+rbUWPWAmE2Rvk0ApiB45eOyNAzU8xcTvj8KvkKEoOaIYeHNA3ZuygAvFMUO0AAAAASUVORK5CYII=";
      break;
    case "external_person":
      personImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAB6ElEQVR4Xu2YLY+EMBCG9+dWr0aj0Wg0Go1Go0+j8Xdv2uTCvv1gpt0ebHKPuhDaeW4605Z9mJvx4AdXUyTUdd08z+u6flmWZRnHsWkafk9DptAwDPu+f0eAYtu2PEaGWuj5fCIZrBAC2eLBAnRCsEkkxmeaJp7iDJ2QMDdHsLg8SxKFEJaAo8lAXnmuOFIhTMpxxKATebo4UiFknuNo4OniSIXQyRxEA3YsnjGCVEjVXD7yLUAqxBGUyPv/Y4W2beMgGuS7kVQIBycH0fD+oi5pezQETxdHKmQKGk1eQEYldK+jw5GxPfZ9z7Mk0Qnhf1W1m3w//EUn5BDmSZsbR44QQLBEqrBHqOrmSKaQAxdnLArCrxZcM7A7ZKs4ioRq8LFC+NpC3WCBJsvpVw5edm9iEXFuyNfxXAgSwfrFQ1c0iNda8AdejvUgnktOtJQQxmcfFzGglc5WVCj7oDgFqU18boeFSs52CUh8LE8BIVQDT1ABrB0HtgSEYlX5doJnCwv9TXocKCaKbnwhdDKPq4lf3SwU3HLq4V/+WYhHVMa/3b4IlfyikAduCkcBc7mQ3/z/Qq/cTuikhkzB12Ae/mcJC9U+Vo8Ej1gWAtgbeGgFsAMHr50BIWOLCbezvhpBFUdY6EJuJ/QDW0XoMX60zZ0AAAAASUVORK5CYII=";
      break;
  }
  const c4ShapeElem = elem.append("g");
  c4ShapeElem.attr("class", "person-man");
  const rect = (0,_svgDrawCommon_42e92da3_js__WEBPACK_IMPORTED_MODULE_5__.g)();
  switch (c4Shape.typeC4Shape.text) {
    case "person":
    case "external_person":
    case "system":
    case "external_system":
    case "container":
    case "external_container":
    case "component":
    case "external_component":
      rect.x = c4Shape.x;
      rect.y = c4Shape.y;
      rect.fill = fillColor;
      rect.width = c4Shape.width;
      rect.height = c4Shape.height;
      rect.stroke = strokeColor;
      rect.rx = 2.5;
      rect.ry = 2.5;
      rect.attrs = { "stroke-width": 0.5 };
      drawRect(c4ShapeElem, rect);
      break;
    case "system_db":
    case "external_system_db":
    case "container_db":
    case "external_container_db":
    case "component_db":
    case "external_component_db":
      c4ShapeElem.append("path").attr("fill", fillColor).attr("stroke-width", "0.5").attr("stroke", strokeColor).attr(
        "d",
        "Mstartx,startyc0,-10 half,-10 half,-10c0,0 half,0 half,10l0,heightc0,10 -half,10 -half,10c0,0 -half,0 -half,-10l0,-height".replaceAll("startx", c4Shape.x).replaceAll("starty", c4Shape.y).replaceAll("half", c4Shape.width / 2).replaceAll("height", c4Shape.height)
      );
      c4ShapeElem.append("path").attr("fill", "none").attr("stroke-width", "0.5").attr("stroke", strokeColor).attr(
        "d",
        "Mstartx,startyc0,10 half,10 half,10c0,0 half,0 half,-10".replaceAll("startx", c4Shape.x).replaceAll("starty", c4Shape.y).replaceAll("half", c4Shape.width / 2)
      );
      break;
    case "system_queue":
    case "external_system_queue":
    case "container_queue":
    case "external_container_queue":
    case "component_queue":
    case "external_component_queue":
      c4ShapeElem.append("path").attr("fill", fillColor).attr("stroke-width", "0.5").attr("stroke", strokeColor).attr(
        "d",
        "Mstartx,startylwidth,0c5,0 5,half 5,halfc0,0 0,half -5,halfl-width,0c-5,0 -5,-half -5,-halfc0,0 0,-half 5,-half".replaceAll("startx", c4Shape.x).replaceAll("starty", c4Shape.y).replaceAll("width", c4Shape.width).replaceAll("half", c4Shape.height / 2)
      );
      c4ShapeElem.append("path").attr("fill", "none").attr("stroke-width", "0.5").attr("stroke", strokeColor).attr(
        "d",
        "Mstartx,startyc-5,0 -5,half -5,halfc0,half 5,half 5,half".replaceAll("startx", c4Shape.x + c4Shape.width).replaceAll("starty", c4Shape.y).replaceAll("half", c4Shape.height / 2)
      );
      break;
  }
  let c4ShapeFontConf = getC4ShapeFont(conf2, c4Shape.typeC4Shape.text);
  c4ShapeElem.append("text").attr("fill", fontColor).attr("font-family", c4ShapeFontConf.fontFamily).attr("font-size", c4ShapeFontConf.fontSize - 2).attr("font-style", "italic").attr("lengthAdjust", "spacing").attr("textLength", c4Shape.typeC4Shape.width).attr("x", c4Shape.x + c4Shape.width / 2 - c4Shape.typeC4Shape.width / 2).attr("y", c4Shape.y + c4Shape.typeC4Shape.Y).text("<<" + c4Shape.typeC4Shape.text + ">>");
  switch (c4Shape.typeC4Shape.text) {
    case "person":
    case "external_person":
      drawImage(
        c4ShapeElem,
        48,
        48,
        c4Shape.x + c4Shape.width / 2 - 24,
        c4Shape.y + c4Shape.image.Y,
        personImg
      );
      break;
  }
  let textFontConf = conf2[c4Shape.typeC4Shape.text + "Font"]();
  textFontConf.fontWeight = "bold";
  textFontConf.fontSize = textFontConf.fontSize + 2;
  textFontConf.fontColor = fontColor;
  _drawTextCandidateFunc(conf2)(
    c4Shape.label.text,
    c4ShapeElem,
    c4Shape.x,
    c4Shape.y + c4Shape.label.Y,
    c4Shape.width,
    c4Shape.height,
    { fill: fontColor },
    textFontConf
  );
  textFontConf = conf2[c4Shape.typeC4Shape.text + "Font"]();
  textFontConf.fontColor = fontColor;
  if (c4Shape.techn && ((_a = c4Shape.techn) == null ? void 0 : _a.text) !== "") {
    _drawTextCandidateFunc(conf2)(
      c4Shape.techn.text,
      c4ShapeElem,
      c4Shape.x,
      c4Shape.y + c4Shape.techn.Y,
      c4Shape.width,
      c4Shape.height,
      { fill: fontColor, "font-style": "italic" },
      textFontConf
    );
  } else if (c4Shape.type && c4Shape.type.text !== "") {
    _drawTextCandidateFunc(conf2)(
      c4Shape.type.text,
      c4ShapeElem,
      c4Shape.x,
      c4Shape.y + c4Shape.type.Y,
      c4Shape.width,
      c4Shape.height,
      { fill: fontColor, "font-style": "italic" },
      textFontConf
    );
  }
  if (c4Shape.descr && c4Shape.descr.text !== "") {
    textFontConf = conf2.personFont();
    textFontConf.fontColor = fontColor;
    _drawTextCandidateFunc(conf2)(
      c4Shape.descr.text,
      c4ShapeElem,
      c4Shape.x,
      c4Shape.y + c4Shape.descr.Y,
      c4Shape.width,
      c4Shape.height,
      { fill: fontColor },
      textFontConf
    );
  }
  return c4Shape.height;
};
const insertDatabaseIcon = function(elem) {
  elem.append("defs").append("symbol").attr("id", "database").attr("fill-rule", "evenodd").attr("clip-rule", "evenodd").append("path").attr("transform", "scale(.5)").attr(
    "d",
    "M12.258.001l.256.004.255.005.253.008.251.01.249.012.247.015.246.016.242.019.241.02.239.023.236.024.233.027.231.028.229.031.225.032.223.034.22.036.217.038.214.04.211.041.208.043.205.045.201.046.198.048.194.05.191.051.187.053.183.054.18.056.175.057.172.059.168.06.163.061.16.063.155.064.15.066.074.033.073.033.071.034.07.034.069.035.068.035.067.035.066.035.064.036.064.036.062.036.06.036.06.037.058.037.058.037.055.038.055.038.053.038.052.038.051.039.05.039.048.039.047.039.045.04.044.04.043.04.041.04.04.041.039.041.037.041.036.041.034.041.033.042.032.042.03.042.029.042.027.042.026.043.024.043.023.043.021.043.02.043.018.044.017.043.015.044.013.044.012.044.011.045.009.044.007.045.006.045.004.045.002.045.001.045v17l-.001.045-.002.045-.004.045-.006.045-.007.045-.009.044-.011.045-.012.044-.013.044-.015.044-.017.043-.018.044-.02.043-.021.043-.023.043-.024.043-.026.043-.027.042-.029.042-.03.042-.032.042-.033.042-.034.041-.036.041-.037.041-.039.041-.04.041-.041.04-.043.04-.044.04-.045.04-.047.039-.048.039-.05.039-.051.039-.052.038-.053.038-.055.038-.055.038-.058.037-.058.037-.06.037-.06.036-.062.036-.064.036-.064.036-.066.035-.067.035-.068.035-.069.035-.07.034-.071.034-.073.033-.074.033-.15.066-.155.064-.16.063-.163.061-.168.06-.172.059-.175.057-.18.056-.183.054-.187.053-.191.051-.194.05-.198.048-.201.046-.205.045-.208.043-.211.041-.214.04-.217.038-.22.036-.223.034-.225.032-.229.031-.231.028-.233.027-.236.024-.239.023-.241.02-.242.019-.246.016-.247.015-.249.012-.251.01-.253.008-.255.005-.256.004-.258.001-.258-.001-.256-.004-.255-.005-.253-.008-.251-.01-.249-.012-.247-.015-.245-.016-.243-.019-.241-.02-.238-.023-.236-.024-.234-.027-.231-.028-.228-.031-.226-.032-.223-.034-.22-.036-.217-.038-.214-.04-.211-.041-.208-.043-.204-.045-.201-.046-.198-.048-.195-.05-.19-.051-.187-.053-.184-.054-.179-.056-.176-.057-.172-.059-.167-.06-.164-.061-.159-.063-.155-.064-.151-.066-.074-.033-.072-.033-.072-.034-.07-.034-.069-.035-.068-.035-.067-.035-.066-.035-.064-.036-.063-.036-.062-.036-.061-.036-.06-.037-.058-.037-.057-.037-.056-.038-.055-.038-.053-.038-.052-.038-.051-.039-.049-.039-.049-.039-.046-.039-.046-.04-.044-.04-.043-.04-.041-.04-.04-.041-.039-.041-.037-.041-.036-.041-.034-.041-.033-.042-.032-.042-.03-.042-.029-.042-.027-.042-.026-.043-.024-.043-.023-.043-.021-.043-.02-.043-.018-.044-.017-.043-.015-.044-.013-.044-.012-.044-.011-.045-.009-.044-.007-.045-.006-.045-.004-.045-.002-.045-.001-.045v-17l.001-.045.002-.045.004-.045.006-.045.007-.045.009-.044.011-.045.012-.044.013-.044.015-.044.017-.043.018-.044.02-.043.021-.043.023-.043.024-.043.026-.043.027-.042.029-.042.03-.042.032-.042.033-.042.034-.041.036-.041.037-.041.039-.041.04-.041.041-.04.043-.04.044-.04.046-.04.046-.039.049-.039.049-.039.051-.039.052-.038.053-.038.055-.038.056-.038.057-.037.058-.037.06-.037.061-.036.062-.036.063-.036.064-.036.066-.035.067-.035.068-.035.069-.035.07-.034.072-.034.072-.033.074-.033.151-.066.155-.064.159-.063.164-.061.167-.06.172-.059.176-.057.179-.056.184-.054.187-.053.19-.051.195-.05.198-.048.201-.046.204-.045.208-.043.211-.041.214-.04.217-.038.22-.036.223-.034.226-.032.228-.031.231-.028.234-.027.236-.024.238-.023.241-.02.243-.019.245-.016.247-.015.249-.012.251-.01.253-.008.255-.005.256-.004.258-.001.258.001zm-9.258 20.499v.01l.001.021.003.021.004.022.005.021.006.022.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.023.018.024.019.024.021.024.022.025.023.024.024.025.052.049.056.05.061.051.066.051.07.051.075.051.079.052.084.052.088.052.092.052.097.052.102.051.105.052.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.048.144.049.147.047.152.047.155.047.16.045.163.045.167.043.171.043.176.041.178.041.183.039.187.039.19.037.194.035.197.035.202.033.204.031.209.03.212.029.216.027.219.025.222.024.226.021.23.02.233.018.236.016.24.015.243.012.246.01.249.008.253.005.256.004.259.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.021.224-.024.22-.026.216-.027.212-.028.21-.031.205-.031.202-.034.198-.034.194-.036.191-.037.187-.039.183-.04.179-.04.175-.042.172-.043.168-.044.163-.045.16-.046.155-.046.152-.047.148-.048.143-.049.139-.049.136-.05.131-.05.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.053.083-.051.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.05.023-.024.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.023.01-.022.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.127l-.077.055-.08.053-.083.054-.085.053-.087.052-.09.052-.093.051-.095.05-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.045-.118.044-.12.043-.122.042-.124.042-.126.041-.128.04-.13.04-.132.038-.134.038-.135.037-.138.037-.139.035-.142.035-.143.034-.144.033-.147.032-.148.031-.15.03-.151.03-.153.029-.154.027-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.01-.179.008-.179.008-.181.006-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.006-.179-.008-.179-.008-.178-.01-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.027-.153-.029-.151-.03-.15-.03-.148-.031-.146-.032-.145-.033-.143-.034-.141-.035-.14-.035-.137-.037-.136-.037-.134-.038-.132-.038-.13-.04-.128-.04-.126-.041-.124-.042-.122-.042-.12-.044-.117-.043-.116-.045-.113-.045-.112-.046-.109-.047-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.05-.093-.052-.09-.051-.087-.052-.085-.053-.083-.054-.08-.054-.077-.054v4.127zm0-5.654v.011l.001.021.003.021.004.021.005.022.006.022.007.022.009.022.01.022.011.023.012.023.013.023.015.024.016.023.017.024.018.024.019.024.021.024.022.024.023.025.024.024.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.052.11.051.114.051.119.052.123.05.127.051.131.05.135.049.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.044.171.042.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.022.23.02.233.018.236.016.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.012.241-.015.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.048.139-.05.136-.049.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.051.051-.049.023-.025.023-.024.021-.025.02-.024.019-.024.018-.024.017-.024.015-.023.014-.023.013-.024.012-.022.01-.023.01-.023.008-.022.006-.022.006-.022.004-.021.004-.022.001-.021.001-.021v-4.139l-.077.054-.08.054-.083.054-.085.052-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.044-.118.044-.12.044-.122.042-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.035-.143.033-.144.033-.147.033-.148.031-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.009-.179.009-.179.007-.181.007-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.007-.179-.007-.179-.009-.178-.009-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.031-.146-.033-.145-.033-.143-.033-.141-.035-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.04-.126-.041-.124-.042-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.051-.093-.051-.09-.051-.087-.053-.085-.052-.083-.054-.08-.054-.077-.054v4.139zm0-5.666v.011l.001.02.003.022.004.021.005.022.006.021.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.024.018.023.019.024.021.025.022.024.023.024.024.025.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.051.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.043.171.043.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.021.23.02.233.018.236.017.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.013.241-.014.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.049.139-.049.136-.049.131-.051.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.049.023-.025.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.022.01-.023.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.153l-.077.054-.08.054-.083.053-.085.053-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.048-.105.048-.106.048-.109.046-.111.046-.114.046-.115.044-.118.044-.12.043-.122.043-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.034-.143.034-.144.033-.147.032-.148.032-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.024-.161.024-.162.023-.163.023-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.01-.178.01-.179.009-.179.007-.181.006-.182.006-.182.004-.184.003-.184.001-.185.001-.185-.001-.184-.001-.184-.003-.182-.004-.182-.006-.181-.006-.179-.007-.179-.009-.178-.01-.176-.01-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.023-.162-.023-.161-.024-.159-.024-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.032-.146-.032-.145-.033-.143-.034-.141-.034-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.041-.126-.041-.124-.041-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.048-.105-.048-.102-.048-.1-.05-.097-.049-.095-.051-.093-.051-.09-.052-.087-.052-.085-.053-.083-.053-.08-.054-.077-.054v4.153zm8.74-8.179l-.257.004-.254.005-.25.008-.247.011-.244.012-.241.014-.237.016-.233.018-.231.021-.226.022-.224.023-.22.026-.216.027-.212.028-.21.031-.205.032-.202.033-.198.034-.194.036-.191.038-.187.038-.183.04-.179.041-.175.042-.172.043-.168.043-.163.045-.16.046-.155.046-.152.048-.148.048-.143.048-.139.049-.136.05-.131.05-.126.051-.123.051-.118.051-.114.052-.11.052-.106.052-.101.052-.096.052-.092.052-.088.052-.083.052-.079.052-.074.051-.07.052-.065.051-.06.05-.056.05-.051.05-.023.025-.023.024-.021.024-.02.025-.019.024-.018.024-.017.023-.015.024-.014.023-.013.023-.012.023-.01.023-.01.022-.008.022-.006.023-.006.021-.004.022-.004.021-.001.021-.001.021.001.021.001.021.004.021.004.022.006.021.006.023.008.022.01.022.01.023.012.023.013.023.014.023.015.024.017.023.018.024.019.024.02.025.021.024.023.024.023.025.051.05.056.05.06.05.065.051.07.052.074.051.079.052.083.052.088.052.092.052.096.052.101.052.106.052.11.052.114.052.118.051.123.051.126.051.131.05.136.05.139.049.143.048.148.048.152.048.155.046.16.046.163.045.168.043.172.043.175.042.179.041.183.04.187.038.191.038.194.036.198.034.202.033.205.032.21.031.212.028.216.027.22.026.224.023.226.022.231.021.233.018.237.016.241.014.244.012.247.011.25.008.254.005.257.004.26.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.022.224-.023.22-.026.216-.027.212-.028.21-.031.205-.032.202-.033.198-.034.194-.036.191-.038.187-.038.183-.04.179-.041.175-.042.172-.043.168-.043.163-.045.16-.046.155-.046.152-.048.148-.048.143-.048.139-.049.136-.05.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.05.051-.05.023-.025.023-.024.021-.024.02-.025.019-.024.018-.024.017-.023.015-.024.014-.023.013-.023.012-.023.01-.023.01-.022.008-.022.006-.023.006-.021.004-.022.004-.021.001-.021.001-.021-.001-.021-.001-.021-.004-.021-.004-.022-.006-.021-.006-.023-.008-.022-.01-.022-.01-.023-.012-.023-.013-.023-.014-.023-.015-.024-.017-.023-.018-.024-.019-.024-.02-.025-.021-.024-.023-.024-.023-.025-.051-.05-.056-.05-.06-.05-.065-.051-.07-.052-.074-.051-.079-.052-.083-.052-.088-.052-.092-.052-.096-.052-.101-.052-.106-.052-.11-.052-.114-.052-.118-.051-.123-.051-.126-.051-.131-.05-.136-.05-.139-.049-.143-.048-.148-.048-.152-.048-.155-.046-.16-.046-.163-.045-.168-.043-.172-.043-.175-.042-.179-.041-.183-.04-.187-.038-.191-.038-.194-.036-.198-.034-.202-.033-.205-.032-.21-.031-.212-.028-.216-.027-.22-.026-.224-.023-.226-.022-.231-.021-.233-.018-.237-.016-.241-.014-.244-.012-.247-.011-.25-.008-.254-.005-.257-.004-.26-.001-.26.001z"
  );
};
const insertComputerIcon = function(elem) {
  elem.append("defs").append("symbol").attr("id", "computer").attr("width", "24").attr("height", "24").append("path").attr("transform", "scale(.5)").attr(
    "d",
    "M2 2v13h20v-13h-20zm18 11h-16v-9h16v9zm-10.228 6l.466-1h3.524l.467 1h-4.457zm14.228 3h-24l2-6h2.104l-1.33 4h18.45l-1.297-4h2.073l2 6zm-5-10h-14v-7h14v7z"
  );
};
const insertClockIcon = function(elem) {
  elem.append("defs").append("symbol").attr("id", "clock").attr("width", "24").attr("height", "24").append("path").attr("transform", "scale(.5)").attr(
    "d",
    "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.848 12.459c.202.038.202.333.001.372-1.907.361-6.045 1.111-6.547 1.111-.719 0-1.301-.582-1.301-1.301 0-.512.77-5.447 1.125-7.445.034-.192.312-.181.343.014l.985 6.238 5.394 1.011z"
  );
};
const insertArrowHead = function(elem) {
  elem.append("defs").append("marker").attr("id", "arrowhead").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");
};
const insertArrowEnd = function(elem) {
  elem.append("defs").append("marker").attr("id", "arrowend").attr("refX", 1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 10 0 L 0 5 L 10 10 z");
};
const insertArrowFilledHead = function(elem) {
  elem.append("defs").append("marker").attr("id", "filled-head").attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
};
const insertDynamicNumber = function(elem) {
  elem.append("defs").append("marker").attr("id", "sequencenumber").attr("refX", 15).attr("refY", 15).attr("markerWidth", 60).attr("markerHeight", 40).attr("orient", "auto").append("circle").attr("cx", 15).attr("cy", 15).attr("r", 6);
};
const insertArrowCrossHead = function(elem) {
  const defs = elem.append("defs");
  const marker = defs.append("marker").attr("id", "crosshead").attr("markerWidth", 15).attr("markerHeight", 8).attr("orient", "auto").attr("refX", 16).attr("refY", 4);
  marker.append("path").attr("fill", "black").attr("stroke", "#000000").style("stroke-dasharray", "0, 0").attr("stroke-width", "1px").attr("d", "M 9,2 V 6 L16,4 Z");
  marker.append("path").attr("fill", "none").attr("stroke", "#000000").style("stroke-dasharray", "0, 0").attr("stroke-width", "1px").attr("d", "M 0,1 L 6,7 M 6,1 L 0,7");
};
const getC4ShapeFont = (cnf, typeC4Shape) => {
  return {
    fontFamily: cnf[typeC4Shape + "FontFamily"],
    fontSize: cnf[typeC4Shape + "FontSize"],
    fontWeight: cnf[typeC4Shape + "FontWeight"]
  };
};
const _drawTextCandidateFunc = function() {
  function byText(content, g, x, y, width, height, textAttrs) {
    const text = g.append("text").attr("x", x + width / 2).attr("y", y + height / 2 + 5).style("text-anchor", "middle").text(content);
    _setTextAttrs(text, textAttrs);
  }
  function byTspan(content, g, x, y, width, height, textAttrs, conf2) {
    const { fontSize, fontFamily, fontWeight } = conf2;
    const lines = content.split(_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.lineBreakRegex);
    for (let i = 0; i < lines.length; i++) {
      const dy = i * fontSize - fontSize * (lines.length - 1) / 2;
      const text = g.append("text").attr("x", x + width / 2).attr("y", y).style("text-anchor", "middle").attr("dominant-baseline", "middle").style("font-size", fontSize).style("font-weight", fontWeight).style("font-family", fontFamily);
      text.append("tspan").attr("dy", dy).text(lines[i]).attr("alignment-baseline", "mathematical");
      _setTextAttrs(text, textAttrs);
    }
  }
  function byFo(content, g, x, y, width, height, textAttrs, conf2) {
    const s = g.append("switch");
    const f = s.append("foreignObject").attr("x", x).attr("y", y).attr("width", width).attr("height", height);
    const text = f.append("xhtml:div").style("display", "table").style("height", "100%").style("width", "100%");
    text.append("div").style("display", "table-cell").style("text-align", "center").style("vertical-align", "middle").text(content);
    byTspan(content, s, x, y, width, height, textAttrs, conf2);
    _setTextAttrs(text, textAttrs);
  }
  function _setTextAttrs(toText, fromTextAttrsDict) {
    for (const key in fromTextAttrsDict) {
      if (fromTextAttrsDict.hasOwnProperty(key)) {
        toText.attr(key, fromTextAttrsDict[key]);
      }
    }
  }
  return function(conf2) {
    return conf2.textPlacement === "fo" ? byFo : conf2.textPlacement === "old" ? byText : byTspan;
  };
}();
const svgDraw = {
  drawRect,
  drawBoundary: drawBoundary$1,
  drawC4Shape,
  drawRels: drawRels$1,
  drawImage,
  insertArrowHead,
  insertArrowEnd,
  insertArrowFilledHead,
  insertDynamicNumber,
  insertArrowCrossHead,
  insertDatabaseIcon,
  insertComputerIcon,
  insertClockIcon
};
let globalBoundaryMaxX = 0, globalBoundaryMaxY = 0;
let c4ShapeInRow = 4;
let c4BoundaryInRow = 2;
parser.yy = c4Db;
let conf = {};
class Bounds {
  constructor(diagObj) {
    this.name = "";
    this.data = {};
    this.data.startx = void 0;
    this.data.stopx = void 0;
    this.data.starty = void 0;
    this.data.stopy = void 0;
    this.data.widthLimit = void 0;
    this.nextData = {};
    this.nextData.startx = void 0;
    this.nextData.stopx = void 0;
    this.nextData.starty = void 0;
    this.nextData.stopy = void 0;
    this.nextData.cnt = 0;
    setConf(diagObj.db.getConfig());
  }
  setData(startx, stopx, starty, stopy) {
    this.nextData.startx = this.data.startx = startx;
    this.nextData.stopx = this.data.stopx = stopx;
    this.nextData.starty = this.data.starty = starty;
    this.nextData.stopy = this.data.stopy = stopy;
  }
  updateVal(obj, key, val, fun) {
    if (obj[key] === void 0) {
      obj[key] = val;
    } else {
      obj[key] = fun(val, obj[key]);
    }
  }
  insert(c4Shape) {
    this.nextData.cnt = this.nextData.cnt + 1;
    let _startx = this.nextData.startx === this.nextData.stopx ? this.nextData.stopx + c4Shape.margin : this.nextData.stopx + c4Shape.margin * 2;
    let _stopx = _startx + c4Shape.width;
    let _starty = this.nextData.starty + c4Shape.margin * 2;
    let _stopy = _starty + c4Shape.height;
    if (_startx >= this.data.widthLimit || _stopx >= this.data.widthLimit || this.nextData.cnt > c4ShapeInRow) {
      _startx = this.nextData.startx + c4Shape.margin + conf.nextLinePaddingX;
      _starty = this.nextData.stopy + c4Shape.margin * 2;
      this.nextData.stopx = _stopx = _startx + c4Shape.width;
      this.nextData.starty = this.nextData.stopy;
      this.nextData.stopy = _stopy = _starty + c4Shape.height;
      this.nextData.cnt = 1;
    }
    c4Shape.x = _startx;
    c4Shape.y = _starty;
    this.updateVal(this.data, "startx", _startx, Math.min);
    this.updateVal(this.data, "starty", _starty, Math.min);
    this.updateVal(this.data, "stopx", _stopx, Math.max);
    this.updateVal(this.data, "stopy", _stopy, Math.max);
    this.updateVal(this.nextData, "startx", _startx, Math.min);
    this.updateVal(this.nextData, "starty", _starty, Math.min);
    this.updateVal(this.nextData, "stopx", _stopx, Math.max);
    this.updateVal(this.nextData, "stopy", _stopy, Math.max);
  }
  init(diagObj) {
    this.name = "";
    this.data = {
      startx: void 0,
      stopx: void 0,
      starty: void 0,
      stopy: void 0,
      widthLimit: void 0
    };
    this.nextData = {
      startx: void 0,
      stopx: void 0,
      starty: void 0,
      stopy: void 0,
      cnt: 0
    };
    setConf(diagObj.db.getConfig());
  }
  bumpLastMargin(margin) {
    this.data.stopx += margin;
    this.data.stopy += margin;
  }
}
const setConf = function(cnf) {
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.f)(conf, cnf);
  if (cnf.fontFamily) {
    conf.personFontFamily = conf.systemFontFamily = conf.messageFontFamily = cnf.fontFamily;
  }
  if (cnf.fontSize) {
    conf.personFontSize = conf.systemFontSize = conf.messageFontSize = cnf.fontSize;
  }
  if (cnf.fontWeight) {
    conf.personFontWeight = conf.systemFontWeight = conf.messageFontWeight = cnf.fontWeight;
  }
};
const c4ShapeFont = (cnf, typeC4Shape) => {
  return {
    fontFamily: cnf[typeC4Shape + "FontFamily"],
    fontSize: cnf[typeC4Shape + "FontSize"],
    fontWeight: cnf[typeC4Shape + "FontWeight"]
  };
};
const boundaryFont = (cnf) => {
  return {
    fontFamily: cnf.boundaryFontFamily,
    fontSize: cnf.boundaryFontSize,
    fontWeight: cnf.boundaryFontWeight
  };
};
const messageFont = (cnf) => {
  return {
    fontFamily: cnf.messageFontFamily,
    fontSize: cnf.messageFontSize,
    fontWeight: cnf.messageFontWeight
  };
};
function calcC4ShapeTextWH(textType, c4Shape, c4ShapeTextWrap, textConf, textLimitWidth) {
  if (!c4Shape[textType].width) {
    if (c4ShapeTextWrap) {
      c4Shape[textType].text = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.w)(c4Shape[textType].text, textLimitWidth, textConf);
      c4Shape[textType].textLines = c4Shape[textType].text.split(_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.lineBreakRegex).length;
      c4Shape[textType].width = textLimitWidth;
      c4Shape[textType].height = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.j)(c4Shape[textType].text, textConf);
    } else {
      let lines = c4Shape[textType].text.split(_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.e.lineBreakRegex);
      c4Shape[textType].textLines = lines.length;
      let lineHeight = 0;
      c4Shape[textType].height = 0;
      c4Shape[textType].width = 0;
      for (const line of lines) {
        c4Shape[textType].width = Math.max(
          (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(line, textConf),
          c4Shape[textType].width
        );
        lineHeight = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.j)(line, textConf);
        c4Shape[textType].height = c4Shape[textType].height + lineHeight;
      }
    }
  }
}
const drawBoundary = function(diagram2, boundary, bounds) {
  boundary.x = bounds.data.startx;
  boundary.y = bounds.data.starty;
  boundary.width = bounds.data.stopx - bounds.data.startx;
  boundary.height = bounds.data.stopy - bounds.data.starty;
  boundary.label.y = conf.c4ShapeMargin - 35;
  let boundaryTextWrap = boundary.wrap && conf.wrap;
  let boundaryLabelConf = boundaryFont(conf);
  boundaryLabelConf.fontSize = boundaryLabelConf.fontSize + 2;
  boundaryLabelConf.fontWeight = "bold";
  let textLimitWidth = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(boundary.label.text, boundaryLabelConf);
  calcC4ShapeTextWH("label", boundary, boundaryTextWrap, boundaryLabelConf, textLimitWidth);
  svgDraw.drawBoundary(diagram2, boundary, conf);
};
const drawC4ShapeArray = function(currentBounds, diagram2, c4ShapeArray2, c4ShapeKeys) {
  let Y = 0;
  for (const c4ShapeKey of c4ShapeKeys) {
    Y = 0;
    const c4Shape = c4ShapeArray2[c4ShapeKey];
    let c4ShapeTypeConf = c4ShapeFont(conf, c4Shape.typeC4Shape.text);
    c4ShapeTypeConf.fontSize = c4ShapeTypeConf.fontSize - 2;
    c4Shape.typeC4Shape.width = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(
      "«" + c4Shape.typeC4Shape.text + "»",
      c4ShapeTypeConf
    );
    c4Shape.typeC4Shape.height = c4ShapeTypeConf.fontSize + 2;
    c4Shape.typeC4Shape.Y = conf.c4ShapePadding;
    Y = c4Shape.typeC4Shape.Y + c4Shape.typeC4Shape.height - 4;
    c4Shape.image = { width: 0, height: 0, Y: 0 };
    switch (c4Shape.typeC4Shape.text) {
      case "person":
      case "external_person":
        c4Shape.image.width = 48;
        c4Shape.image.height = 48;
        c4Shape.image.Y = Y;
        Y = c4Shape.image.Y + c4Shape.image.height;
        break;
    }
    if (c4Shape.sprite) {
      c4Shape.image.width = 48;
      c4Shape.image.height = 48;
      c4Shape.image.Y = Y;
      Y = c4Shape.image.Y + c4Shape.image.height;
    }
    let c4ShapeTextWrap = c4Shape.wrap && conf.wrap;
    let textLimitWidth = conf.width - conf.c4ShapePadding * 2;
    let c4ShapeLabelConf = c4ShapeFont(conf, c4Shape.typeC4Shape.text);
    c4ShapeLabelConf.fontSize = c4ShapeLabelConf.fontSize + 2;
    c4ShapeLabelConf.fontWeight = "bold";
    calcC4ShapeTextWH("label", c4Shape, c4ShapeTextWrap, c4ShapeLabelConf, textLimitWidth);
    c4Shape["label"].Y = Y + 8;
    Y = c4Shape["label"].Y + c4Shape["label"].height;
    if (c4Shape.type && c4Shape.type.text !== "") {
      c4Shape.type.text = "[" + c4Shape.type.text + "]";
      let c4ShapeTypeConf2 = c4ShapeFont(conf, c4Shape.typeC4Shape.text);
      calcC4ShapeTextWH("type", c4Shape, c4ShapeTextWrap, c4ShapeTypeConf2, textLimitWidth);
      c4Shape["type"].Y = Y + 5;
      Y = c4Shape["type"].Y + c4Shape["type"].height;
    } else if (c4Shape.techn && c4Shape.techn.text !== "") {
      c4Shape.techn.text = "[" + c4Shape.techn.text + "]";
      let c4ShapeTechnConf = c4ShapeFont(conf, c4Shape.techn.text);
      calcC4ShapeTextWH("techn", c4Shape, c4ShapeTextWrap, c4ShapeTechnConf, textLimitWidth);
      c4Shape["techn"].Y = Y + 5;
      Y = c4Shape["techn"].Y + c4Shape["techn"].height;
    }
    let rectHeight = Y;
    let rectWidth = c4Shape.label.width;
    if (c4Shape.descr && c4Shape.descr.text !== "") {
      let c4ShapeDescrConf = c4ShapeFont(conf, c4Shape.typeC4Shape.text);
      calcC4ShapeTextWH("descr", c4Shape, c4ShapeTextWrap, c4ShapeDescrConf, textLimitWidth);
      c4Shape["descr"].Y = Y + 20;
      Y = c4Shape["descr"].Y + c4Shape["descr"].height;
      rectWidth = Math.max(c4Shape.label.width, c4Shape.descr.width);
      rectHeight = Y - c4Shape["descr"].textLines * 5;
    }
    rectWidth = rectWidth + conf.c4ShapePadding;
    c4Shape.width = Math.max(c4Shape.width || conf.width, rectWidth, conf.width);
    c4Shape.height = Math.max(c4Shape.height || conf.height, rectHeight, conf.height);
    c4Shape.margin = c4Shape.margin || conf.c4ShapeMargin;
    currentBounds.insert(c4Shape);
    svgDraw.drawC4Shape(diagram2, c4Shape, conf);
  }
  currentBounds.bumpLastMargin(conf.c4ShapeMargin);
};
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let getIntersectPoint = function(fromNode, endPoint) {
  let x1 = fromNode.x;
  let y1 = fromNode.y;
  let x2 = endPoint.x;
  let y2 = endPoint.y;
  let fromCenterX = x1 + fromNode.width / 2;
  let fromCenterY = y1 + fromNode.height / 2;
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);
  let tanDYX = dy / dx;
  let fromDYX = fromNode.height / fromNode.width;
  let returnPoint = null;
  if (y1 == y2 && x1 < x2) {
    returnPoint = new Point(x1 + fromNode.width, fromCenterY);
  } else if (y1 == y2 && x1 > x2) {
    returnPoint = new Point(x1, fromCenterY);
  } else if (x1 == x2 && y1 < y2) {
    returnPoint = new Point(fromCenterX, y1 + fromNode.height);
  } else if (x1 == x2 && y1 > y2) {
    returnPoint = new Point(fromCenterX, y1);
  }
  if (x1 > x2 && y1 < y2) {
    if (fromDYX >= tanDYX) {
      returnPoint = new Point(x1, fromCenterY + tanDYX * fromNode.width / 2);
    } else {
      returnPoint = new Point(
        fromCenterX - dx / dy * fromNode.height / 2,
        y1 + fromNode.height
      );
    }
  } else if (x1 < x2 && y1 < y2) {
    if (fromDYX >= tanDYX) {
      returnPoint = new Point(x1 + fromNode.width, fromCenterY + tanDYX * fromNode.width / 2);
    } else {
      returnPoint = new Point(
        fromCenterX + dx / dy * fromNode.height / 2,
        y1 + fromNode.height
      );
    }
  } else if (x1 < x2 && y1 > y2) {
    if (fromDYX >= tanDYX) {
      returnPoint = new Point(x1 + fromNode.width, fromCenterY - tanDYX * fromNode.width / 2);
    } else {
      returnPoint = new Point(fromCenterX + fromNode.height / 2 * dx / dy, y1);
    }
  } else if (x1 > x2 && y1 > y2) {
    if (fromDYX >= tanDYX) {
      returnPoint = new Point(x1, fromCenterY - fromNode.width / 2 * tanDYX);
    } else {
      returnPoint = new Point(fromCenterX - fromNode.height / 2 * dx / dy, y1);
    }
  }
  return returnPoint;
};
let getIntersectPoints = function(fromNode, endNode) {
  let endIntersectPoint = { x: 0, y: 0 };
  endIntersectPoint.x = endNode.x + endNode.width / 2;
  endIntersectPoint.y = endNode.y + endNode.height / 2;
  let startPoint = getIntersectPoint(fromNode, endIntersectPoint);
  endIntersectPoint.x = fromNode.x + fromNode.width / 2;
  endIntersectPoint.y = fromNode.y + fromNode.height / 2;
  let endPoint = getIntersectPoint(endNode, endIntersectPoint);
  return { startPoint, endPoint };
};
const drawRels = function(diagram2, rels2, getC4ShapeObj, diagObj) {
  let i = 0;
  for (let rel of rels2) {
    i = i + 1;
    let relTextWrap = rel.wrap && conf.wrap;
    let relConf = messageFont(conf);
    let diagramType = diagObj.db.getC4Type();
    if (diagramType === "C4Dynamic") {
      rel.label.text = i + ": " + rel.label.text;
    }
    let textLimitWidth = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(rel.label.text, relConf);
    calcC4ShapeTextWH("label", rel, relTextWrap, relConf, textLimitWidth);
    if (rel.techn && rel.techn.text !== "") {
      textLimitWidth = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(rel.techn.text, relConf);
      calcC4ShapeTextWH("techn", rel, relTextWrap, relConf, textLimitWidth);
    }
    if (rel.descr && rel.descr.text !== "") {
      textLimitWidth = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.h)(rel.descr.text, relConf);
      calcC4ShapeTextWH("descr", rel, relTextWrap, relConf, textLimitWidth);
    }
    let fromNode = getC4ShapeObj(rel.from);
    let endNode = getC4ShapeObj(rel.to);
    let points = getIntersectPoints(fromNode, endNode);
    rel.startPoint = points.startPoint;
    rel.endPoint = points.endPoint;
  }
  svgDraw.drawRels(diagram2, rels2, conf);
};
function drawInsideBoundary(diagram2, parentBoundaryAlias, parentBounds, currentBoundaries, diagObj) {
  let currentBounds = new Bounds(diagObj);
  currentBounds.data.widthLimit = parentBounds.data.widthLimit / Math.min(c4BoundaryInRow, currentBoundaries.length);
  for (let [i, currentBoundary] of currentBoundaries.entries()) {
    let Y = 0;
    currentBoundary.image = { width: 0, height: 0, Y: 0 };
    if (currentBoundary.sprite) {
      currentBoundary.image.width = 48;
      currentBoundary.image.height = 48;
      currentBoundary.image.Y = Y;
      Y = currentBoundary.image.Y + currentBoundary.image.height;
    }
    let currentBoundaryTextWrap = currentBoundary.wrap && conf.wrap;
    let currentBoundaryLabelConf = boundaryFont(conf);
    currentBoundaryLabelConf.fontSize = currentBoundaryLabelConf.fontSize + 2;
    currentBoundaryLabelConf.fontWeight = "bold";
    calcC4ShapeTextWH(
      "label",
      currentBoundary,
      currentBoundaryTextWrap,
      currentBoundaryLabelConf,
      currentBounds.data.widthLimit
    );
    currentBoundary["label"].Y = Y + 8;
    Y = currentBoundary["label"].Y + currentBoundary["label"].height;
    if (currentBoundary.type && currentBoundary.type.text !== "") {
      currentBoundary.type.text = "[" + currentBoundary.type.text + "]";
      let currentBoundaryTypeConf = boundaryFont(conf);
      calcC4ShapeTextWH(
        "type",
        currentBoundary,
        currentBoundaryTextWrap,
        currentBoundaryTypeConf,
        currentBounds.data.widthLimit
      );
      currentBoundary["type"].Y = Y + 5;
      Y = currentBoundary["type"].Y + currentBoundary["type"].height;
    }
    if (currentBoundary.descr && currentBoundary.descr.text !== "") {
      let currentBoundaryDescrConf = boundaryFont(conf);
      currentBoundaryDescrConf.fontSize = currentBoundaryDescrConf.fontSize - 2;
      calcC4ShapeTextWH(
        "descr",
        currentBoundary,
        currentBoundaryTextWrap,
        currentBoundaryDescrConf,
        currentBounds.data.widthLimit
      );
      currentBoundary["descr"].Y = Y + 20;
      Y = currentBoundary["descr"].Y + currentBoundary["descr"].height;
    }
    if (i == 0 || i % c4BoundaryInRow === 0) {
      let _x = parentBounds.data.startx + conf.diagramMarginX;
      let _y = parentBounds.data.stopy + conf.diagramMarginY + Y;
      currentBounds.setData(_x, _x, _y, _y);
    } else {
      let _x = currentBounds.data.stopx !== currentBounds.data.startx ? currentBounds.data.stopx + conf.diagramMarginX : currentBounds.data.startx;
      let _y = currentBounds.data.starty;
      currentBounds.setData(_x, _x, _y, _y);
    }
    currentBounds.name = currentBoundary.alias;
    let currentPersonOrSystemArray = diagObj.db.getC4ShapeArray(currentBoundary.alias);
    let currentPersonOrSystemKeys = diagObj.db.getC4ShapeKeys(currentBoundary.alias);
    if (currentPersonOrSystemKeys.length > 0) {
      drawC4ShapeArray(
        currentBounds,
        diagram2,
        currentPersonOrSystemArray,
        currentPersonOrSystemKeys
      );
    }
    parentBoundaryAlias = currentBoundary.alias;
    let nextCurrentBoundarys = diagObj.db.getBoundarys(parentBoundaryAlias);
    if (nextCurrentBoundarys.length > 0) {
      drawInsideBoundary(
        diagram2,
        parentBoundaryAlias,
        currentBounds,
        nextCurrentBoundarys,
        diagObj
      );
    }
    if (currentBoundary.alias !== "global") {
      drawBoundary(diagram2, currentBoundary, currentBounds);
    }
    parentBounds.data.stopy = Math.max(
      currentBounds.data.stopy + conf.c4ShapeMargin,
      parentBounds.data.stopy
    );
    parentBounds.data.stopx = Math.max(
      currentBounds.data.stopx + conf.c4ShapeMargin,
      parentBounds.data.stopx
    );
    globalBoundaryMaxX = Math.max(globalBoundaryMaxX, parentBounds.data.stopx);
    globalBoundaryMaxY = Math.max(globalBoundaryMaxY, parentBounds.data.stopy);
  }
}
const draw = function(_text, id, _version, diagObj) {
  conf = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().c4;
  const securityLevel = (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.c)().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)("#i" + id);
  }
  const root = securityLevel === "sandbox" ? (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)(sandboxElement.nodes()[0].contentDocument.body) : (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)("body");
  let db = diagObj.db;
  diagObj.db.setWrap(conf.wrap);
  c4ShapeInRow = db.getC4ShapeInRow();
  c4BoundaryInRow = db.getC4BoundaryInRow();
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(`C:${JSON.stringify(conf, null, 2)}`);
  const diagram2 = securityLevel === "sandbox" ? root.select(`[id="${id}"]`) : (0,d3__WEBPACK_IMPORTED_MODULE_0__/* .select */ .Ys)(`[id="${id}"]`);
  svgDraw.insertComputerIcon(diagram2);
  svgDraw.insertDatabaseIcon(diagram2);
  svgDraw.insertClockIcon(diagram2);
  let screenBounds = new Bounds(diagObj);
  screenBounds.setData(
    conf.diagramMarginX,
    conf.diagramMarginX,
    conf.diagramMarginY,
    conf.diagramMarginY
  );
  screenBounds.data.widthLimit = screen.availWidth;
  globalBoundaryMaxX = conf.diagramMarginX;
  globalBoundaryMaxY = conf.diagramMarginY;
  const title2 = diagObj.db.getTitle();
  let currentBoundaries = diagObj.db.getBoundarys("");
  drawInsideBoundary(diagram2, "", screenBounds, currentBoundaries, diagObj);
  svgDraw.insertArrowHead(diagram2);
  svgDraw.insertArrowEnd(diagram2);
  svgDraw.insertArrowCrossHead(diagram2);
  svgDraw.insertArrowFilledHead(diagram2);
  drawRels(diagram2, diagObj.db.getRels(), diagObj.db.getC4Shape, diagObj);
  screenBounds.data.stopx = globalBoundaryMaxX;
  screenBounds.data.stopy = globalBoundaryMaxY;
  const box = screenBounds.data;
  let boxHeight = box.stopy - box.starty;
  let height = boxHeight + 2 * conf.diagramMarginY;
  let boxWidth = box.stopx - box.startx;
  const width = boxWidth + 2 * conf.diagramMarginX;
  if (title2) {
    diagram2.append("text").text(title2).attr("x", (box.stopx - box.startx) / 2 - 4 * conf.diagramMarginX).attr("y", box.starty + conf.diagramMarginY);
  }
  (0,_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.i)(diagram2, height, width, conf.useMaxWidth);
  const extraVertForTitle = title2 ? 60 : 0;
  diagram2.attr(
    "viewBox",
    box.startx - conf.diagramMarginX + " -" + (conf.diagramMarginY + extraVertForTitle) + " " + width + " " + (height + extraVertForTitle)
  );
  _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_4__.l.debug(`models:`, box);
};
const c4Renderer = {
  drawPersonOrSystemArray: drawC4ShapeArray,
  drawBoundary,
  setConf,
  draw
};
const getStyles = (options) => `.person {
    stroke: ${options.personBorder};
    fill: ${options.personBkg};
  }
`;
const c4Styles = getStyles;
const diagram = {
  parser: c4Parser,
  db: c4Db,
  renderer: c4Renderer,
  styles: c4Styles,
  init: (cnf) => {
    c4Renderer.setConf(cnf.c4);
  }
};



/***/ }),

/***/ 47435:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ drawBackgroundRect),
/* harmony export */   b: () => (/* binding */ drawEmbeddedImage),
/* harmony export */   c: () => (/* binding */ drawImage),
/* harmony export */   d: () => (/* binding */ drawRect),
/* harmony export */   e: () => (/* binding */ getTextObj),
/* harmony export */   f: () => (/* binding */ drawText),
/* harmony export */   g: () => (/* binding */ getNoteRect)
/* harmony export */ });
/* harmony import */ var _braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7608);
/* harmony import */ var _mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99854);


const drawRect = (element, rectData) => {
  const rectElement = element.append("rect");
  rectElement.attr("x", rectData.x);
  rectElement.attr("y", rectData.y);
  rectElement.attr("fill", rectData.fill);
  rectElement.attr("stroke", rectData.stroke);
  rectElement.attr("width", rectData.width);
  rectElement.attr("height", rectData.height);
  rectData.rx !== void 0 && rectElement.attr("rx", rectData.rx);
  rectData.ry !== void 0 && rectElement.attr("ry", rectData.ry);
  if (rectData.attrs !== void 0) {
    for (const attrKey in rectData.attrs) {
      rectElement.attr(attrKey, rectData.attrs[attrKey]);
    }
  }
  rectData.class !== void 0 && rectElement.attr("class", rectData.class);
  return rectElement;
};
const drawBackgroundRect = (element, bounds) => {
  const rectData = {
    x: bounds.startx,
    y: bounds.starty,
    width: bounds.stopx - bounds.startx,
    height: bounds.stopy - bounds.starty,
    fill: bounds.fill,
    stroke: bounds.stroke,
    class: "rect"
  };
  const rectElement = drawRect(element, rectData);
  rectElement.lower();
};
const drawText = (element, textData) => {
  const nText = textData.text.replace(_mermaid_768dc893_js__WEBPACK_IMPORTED_MODULE_1__.J, " ");
  const textElem = element.append("text");
  textElem.attr("x", textData.x);
  textElem.attr("y", textData.y);
  textElem.attr("class", "legend");
  textElem.style("text-anchor", textData.anchor);
  textData.class !== void 0 && textElem.attr("class", textData.class);
  const tspan = textElem.append("tspan");
  tspan.attr("x", textData.x + textData.textMargin * 2);
  tspan.text(nText);
  return textElem;
};
const drawImage = (elem, x, y, link) => {
  const imageElement = elem.append("image");
  imageElement.attr("x", x);
  imageElement.attr("y", y);
  const sanitizedLink = (0,_braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_0__/* .sanitizeUrl */ .Nm)(link);
  imageElement.attr("xlink:href", sanitizedLink);
};
const drawEmbeddedImage = (element, x, y, link) => {
  const imageElement = element.append("use");
  imageElement.attr("x", x);
  imageElement.attr("y", y);
  const sanitizedLink = (0,_braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_0__/* .sanitizeUrl */ .Nm)(link);
  imageElement.attr("xlink:href", `#${sanitizedLink}`);
};
const getNoteRect = () => {
  const noteRectData = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: "#EDF2AE",
    stroke: "#666",
    anchor: "start",
    rx: 0,
    ry: 0
  };
  return noteRectData;
};
const getTextObj = () => {
  const testObject = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    "text-anchor": "start",
    style: "#666",
    textMargin: 0,
    rx: 0,
    ry: 0,
    tspan: true
  };
  return testObject;
};



/***/ })

};
;