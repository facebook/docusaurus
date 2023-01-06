var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/mdast-util-to-string/index.js
var mdast_util_to_string_exports = {};
__export(mdast_util_to_string_exports, {
  toString: () => toString
});
module.exports = __toCommonJS(mdast_util_to_string_exports);
function toString(node, options) {
  var { includeImageAlt = true } = options || {};
  return one(node, includeImageAlt);
}
function one(node, includeImageAlt) {
  return node && typeof node === "object" && (node.value || (includeImageAlt ? node.alt : "") || "children" in node && all(node.children, includeImageAlt) || Array.isArray(node) && all(node, includeImageAlt)) || "";
}
function all(values, includeImageAlt) {
  var result = [];
  var index = -1;
  while (++index < values.length) {
    result[index] = one(values[index], includeImageAlt);
  }
  return result.join("");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toString
});
