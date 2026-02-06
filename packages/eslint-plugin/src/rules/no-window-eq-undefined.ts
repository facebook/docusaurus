/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

type Options = [];

type MessageIds = 'noWindowEqUndefined';

type ExpressionOrPrivateIdentifier =
  | TSESTree.Expression
  | TSESTree.PrivateIdentifier;

export default createRule<Options, MessageIds>({
  name: 'no-window-eq-undefined',
  meta: {
    type: 'problem',
    docs: {
      description:
        "forbid typeof window !== 'undefined' because this is not an adequate way to escape SSR",
      recommended: false,
    },
    schema: [],
    messages: {
      noWindowEqUndefined:
        "Do not use 'typeof window' to synchronously detect SSR. This can cause hydration mismatches.",
    },
  },
  defaultOptions: [],
  create(context) {
    let lastEffect: TSESTree.CallExpression | null = null;
    return {
      CallExpression(node) {
        const nodeWithoutNamespace = getNodeWithoutReactNamespace(node.callee);
        if (
          isEffectIdentifier(nodeWithoutNamespace) &&
          node.arguments.length > 0
        ) {
          lastEffect = node;
        }
      },
      'CallExpression:exit': function CallExpressionExit(
        node: TSESTree.CallExpression,
      ) {
        if (node === lastEffect) {
          lastEffect = null;
        }
      },
      BinaryExpression(node) {
        if (!isEquality(node) && !isStrictEquality(node)) {
          return;
        }

        const {left, right} = node;
        const isMatch =
          (isTypeofWindowCheck(left) && isUndefined(right)) ||
          (isUndefined(left) && isTypeofWindowCheck(right));
        if (isMatch) {
          if (lastEffect !== null) {
            return;
          }

          const ancestors = context.getAncestors();
          const parentFunction = getParentFunctionNode(ancestors);

          if (parentFunction) {
            const functionNameNode = getFunctionName(parentFunction);

            if (
              !functionNameNode ||
              (!isComponentName(functionNameNode) && !isHook(functionNameNode))
            ) {
              return;
            }
          }

          context.report({
            node,
            messageId: 'noWindowEqUndefined',
          });
        }
      },
    };
  },
});

function isStrictEquality(
  node: TSESTree.Expression,
): node is TSESTree.BinaryExpression {
  return (
    node.type === 'BinaryExpression' &&
    (node.operator === '===' || node.operator === '!==')
  );
}

function isEquality(
  node: TSESTree.Expression,
): node is TSESTree.BinaryExpression {
  return (
    node.type === 'BinaryExpression' &&
    (node.operator === '==' || node.operator === '!=')
  );
}

function isTypeofStatement(
  node: ExpressionOrPrivateIdentifier,
): node is TSESTree.UnaryExpression {
  return (
    node.type === 'UnaryExpression' && node.operator === 'typeof' && node.prefix
  );
}

function isTypeofWindowCheck(node: ExpressionOrPrivateIdentifier): boolean {
  if (isTypeofStatement(node)) {
    const argument = node.argument;
    return argument.type === 'Identifier' && argument.name === 'window';
  }
  return false;
}

function isUndefinedStringLiteral(
  node: ExpressionOrPrivateIdentifier,
): boolean {
  return (
    node.type === 'Literal' && (node as TSESTree.Literal).value === 'undefined'
  );
}

function isUndefinedReference(node: ExpressionOrPrivateIdentifier): boolean {
  return node.type === 'Identifier' && node.name === 'undefined';
}

function isUndefined(node: ExpressionOrPrivateIdentifier): boolean {
  return isUndefinedStringLiteral(node) || isUndefinedReference(node);
}

// --- 2B. React/AST 헬퍼 (Effect, Component, Hook) ---

function getParentFunctionNode(ancestors: TSESTree.Node[]) {
  let parentFunction: TSESTree.Node | undefined;

  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const n = ancestors[i];
    if (!n) {
      continue;
    }

    if (
      n.type === 'FunctionExpression' ||
      n.type === 'FunctionDeclaration' ||
      n.type === 'ArrowFunctionExpression'
    ) {
      parentFunction = n;
      break;
    }
  }
  return parentFunction;
}

function getFunctionName(node: TSESTree.Node) {
  if (
    // @ts-expect-error parser-hermes produces these node types
    node.type === 'ComponentDeclaration' ||
    // @ts-expect-error parser-hermes produces these node types
    node.type === 'HookDeclaration' ||
    node.type === 'FunctionDeclaration' ||
    (node.type === 'FunctionExpression' && node.id)
  ) {
    return node.id;
  } else if (
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  ) {
    if (
      node.parent?.type === 'VariableDeclarator' &&
      node.parent.init === node
    ) {
      return node.parent.id;
    } else if (
      node.parent?.type === 'AssignmentExpression' &&
      node.parent.right === node &&
      node.parent.operator === '='
    ) {
      return node.parent.left;
    } else if (
      node.parent?.type === 'Property' &&
      node.parent.value === node &&
      !node.parent.computed
    ) {
      return node.parent.key;
    } else if (
      node.parent?.type === 'AssignmentPattern' &&
      node.parent.right === node &&
      // @ts-expect-error Property computed does not exist on type `AssignmentPattern`.
      !node.parent.computed
    ) {
      return node.parent.left;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

function isHookName(s: string): boolean {
  return s === 'use' || /^use[A-Z\d]/.test(s);
}

function isHook(node: TSESTree.Node): boolean {
  if (node.type === 'Identifier') {
    return isHookName(node.name);
  } else if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    isHook(node.property)
  ) {
    const obj = node.object;
    const isPascalCaseNameSpace = /^[A-Z].*/;
    return obj.type === 'Identifier' && isPascalCaseNameSpace.test(obj.name);
  } else {
    return false;
  }
}

function isComponentName(node: TSESTree.Node): boolean {
  return node.type === 'Identifier' && /^[A-Z]/.test(node.name);
}

function getNodeWithoutReactNamespace(
  node: TSESTree.Expression | TSESTree.Super,
): TSESTree.Expression | TSESTree.Identifier | TSESTree.Super {
  if (
    node.type === 'MemberExpression' &&
    node.object.type === 'Identifier' &&
    node.object.name === 'React' &&
    node.property.type === 'Identifier' &&
    !node.computed
  ) {
    return node.property;
  }
  return node;
}

function isEffectIdentifier(
  node: TSESTree.Node,
  additionalHooks?: RegExp,
): boolean {
  const isBuiltInEffect =
    node.type === 'Identifier' &&
    (node.name === 'useEffect' ||
      node.name === 'useLayoutEffect' ||
      node.name === 'useInsertionEffect');

  if (isBuiltInEffect) {
    return true;
  }

  if (additionalHooks && node.type === 'Identifier') {
    return additionalHooks.test(node.name);
  }

  return false;
}
