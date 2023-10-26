var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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

// node_modules/estree-util-value-to-estree/index.js
var estree_util_value_to_estree_exports = {};
__export(estree_util_value_to_estree_exports, {
  valueToEstree: () => valueToEstree
});
module.exports = __toCommonJS(estree_util_value_to_estree_exports);

// node_modules/is-plain-obj/index.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

// node_modules/estree-util-value-to-estree/index.js
function valueToEstree(value, options = {}) {
  if (value === void 0 || value === Number.POSITIVE_INFINITY || Number.isNaN(value)) {
    return { type: "Identifier", name: String(value) };
  }
  if (value == null || typeof value === "string" || typeof value === "boolean") {
    return { type: "Literal", value };
  }
  if (typeof value === "bigint") {
    return value >= 0 ? { type: "Literal", value, bigint: String(value) } : {
      type: "UnaryExpression",
      operator: "-",
      prefix: true,
      argument: valueToEstree(-value, options)
    };
  }
  if (typeof value === "number") {
    return value >= 0 && !Object.is(value, -0) ? { type: "Literal", value } : {
      type: "UnaryExpression",
      operator: "-",
      prefix: true,
      argument: valueToEstree(-value, options)
    };
  }
  if (typeof value === "symbol") {
    if (value.description && value === Symbol.for(value.description)) {
      return {
        type: "CallExpression",
        optional: false,
        callee: {
          type: "MemberExpression",
          computed: false,
          optional: false,
          object: { type: "Identifier", name: "Symbol" },
          property: { type: "Identifier", name: "for" }
        },
        arguments: [valueToEstree(value.description, options)]
      };
    }
    throw new TypeError(`Only global symbols are supported, got: ${String(value)}`);
  }
  if (Array.isArray(value)) {
    const elements = [];
    for (let i = 0; i < value.length; i += 1) {
      elements.push(i in value ? valueToEstree(value[i], options) : null);
    }
    return { type: "ArrayExpression", elements };
  }
  if (value instanceof Boolean || value instanceof Number || value instanceof String) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: value.constructor.name },
      arguments: [valueToEstree(value.valueOf())]
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "Literal",
      value,
      regex: { pattern: value.source, flags: value.flags }
    };
  }
  if (value instanceof Date) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: "Date" },
      arguments: [valueToEstree(value.getTime(), options)]
    };
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return {
      type: "CallExpression",
      optional: false,
      callee: {
        type: "MemberExpression",
        computed: false,
        optional: false,
        object: { type: "Identifier", name: "Buffer" },
        property: { type: "Identifier", name: "from" }
      },
      arguments: [valueToEstree([...value])]
    };
  }
  if (value instanceof BigInt64Array || value instanceof BigUint64Array || value instanceof Float32Array || value instanceof Float64Array || value instanceof Int8Array || value instanceof Int16Array || value instanceof Int32Array || value instanceof Map || value instanceof Set || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Uint16Array || value instanceof Uint32Array) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: value.constructor.name },
      arguments: [valueToEstree([...value], options)]
    };
  }
  if (value instanceof URL || value instanceof URLSearchParams) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: value.constructor.name },
      arguments: [valueToEstree(String(value), options)]
    };
  }
  if (options.instanceAsObject || isPlainObject(value)) {
    const properties = Reflect.ownKeys(value).map((key) => ({
      type: "Property",
      method: false,
      shorthand: false,
      computed: typeof key !== "string",
      kind: "init",
      key: valueToEstree(key, options),
      value: valueToEstree(value[key], options)
    }));
    if (Object.getPrototypeOf(value) == null) {
      properties.unshift({
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        kind: "init",
        key: { type: "Identifier", name: "__proto__" },
        value: { type: "Literal", value: null }
      });
    }
    return {
      type: "ObjectExpression",
      properties
    };
  }
  throw new TypeError(`Unsupported value: ${String(value)}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  valueToEstree
});
