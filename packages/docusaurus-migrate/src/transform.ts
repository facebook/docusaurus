/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import jscodeshift from 'jscodeshift';

const empty = () =>
  jscodeshift.arrowFunctionExpression(
    [jscodeshift.identifier('props')],
    jscodeshift.jsxElement(
      jscodeshift.jsxOpeningElement(jscodeshift.jsxIdentifier('div'), [
        jscodeshift.jsxSpreadAttribute(jscodeshift.identifier('props')),
      ]),
      jscodeshift.jsxClosingElement(jscodeshift.jsxIdentifier('div')),
    ),
  );

const property = (key: string, value: jscodeshift.ArrowFunctionExpression) =>
  jscodeshift.objectProperty(jscodeshift.identifier(key), value);

const processCallExpression = (
  node: jscodeshift.ASTPath<jscodeshift.VariableDeclarator>,
) => {
  const args = node?.value?.init?.arguments;
  if (args.type === 'Literal') {
    if (args.value === '../../core/CompLibrary.js') {
      const newDeclartor = jscodeshift.variableDeclarator(
        node.value.id,
        jscodeshift.objectExpression([
          property('Container', empty()),
          property('GridBlock', empty()),
          property('MarkdownBlock', empty()),
        ]),
      );
      jscodeshift(node).replaceWith(newDeclartor);
    }
  }
  if (args.type === 'TemplateLiteral') {
    if (
      args.quasis
        .map((element: jscodeshift.TemplateElement) => element.value.raw)
        .join('')
        .match(/\/core\//)
    ) {
      const newDeclartor = jscodeshift.variableDeclarator(
        node.value.id,
        empty(),
      );
      jscodeshift(node).replaceWith(newDeclartor);
    }
  }
};

const processMemberExpression = (
  node: jscodeshift.ASTPath<jscodeshift.VariableDeclarator>,
) => {
  const args = node?.value?.init?.object?.arguments[0];
  if (args.type === 'Literal') {
    if (args.value === '../../core/CompLibrary.js') {
      const newDeclartor = jscodeshift.variableDeclarator(
        node.value.id,
        jscodeshift.objectExpression([
          property('Container', empty()),
          property('GridBlock', empty()),
          property('MarkdownBlock', empty()),
        ]),
      );
      jscodeshift(node).replaceWith(newDeclartor);
    } else if (args.value.match(/server/)) {
      const newDeclartor = jscodeshift.variableDeclarator(
        node.value.id,
        empty(),
      );
      jscodeshift(node).replaceWith(newDeclartor);
    }
  }
  if (args.type === 'TemplateLiteral') {
    if (
      args.quasis
        .map((ele: jscodeshift.TemplateElement) => ele.value.raw)
        .join('')
        .match(/\/core\//)
    ) {
      const newDeclartor = jscodeshift.variableDeclarator(
        node.value.id,
        empty(),
      );
      jscodeshift(node).replaceWith(newDeclartor);
    }
  }
};

export default function transformer(file: string): string {
  const root = jscodeshift(file);
  const r = getImportDeclaratorPaths(root);
  r.forEach((node) => {
    if (node?.value?.init?.type === 'CallExpression') {
      processCallExpression(node);
    } else if (node?.value?.init?.type === 'MemberExpression') {
      processMemberExpression(node);
    }
  });
  if (r[r.length - 1]) {
    jscodeshift(r[r.length - 1].parent).insertAfter(
      jscodeshift.importDeclaration(
        [jscodeshift.importDefaultSpecifier(jscodeshift.identifier('Layout'))],
        jscodeshift.literal('@theme/Layout'),
      ),
    );
  }

  root
    .find(jscodeshift.AssignmentExpression, {
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          name: 'module',
        },
        property: {
          name: 'exports',
        },
      },
      right: {
        type: 'Identifier',
      },
    })
    .filter(function (p) {
      return p.parentPath.parentPath.name === 'body';
    })
    .forEach(function (p) {
      const exportDecl = jscodeshift.exportDeclaration(
        true,
        jscodeshift.arrowFunctionExpression(
          [jscodeshift.identifier('props')],
          jscodeshift.jsxElement(
            jscodeshift.jsxOpeningElement(
              jscodeshift.jsxIdentifier('Layout'),
              [],
            ),
            jscodeshift.jsxClosingElement(jscodeshift.jsxIdentifier('Layout')),
            [
              jscodeshift.jsxElement(
                jscodeshift.jsxOpeningElement(
                  jscodeshift.jsxIdentifier(p.value.right.name),
                  [
                    jscodeshift.jsxSpreadAttribute(
                      jscodeshift.identifier('props'),
                    ),
                  ],
                  true,
                ),
              ),
            ],
          ),
        ),
      );
      exportDecl.comments = p.parentPath.value.comments;
      jscodeshift(p.parentPath).replaceWith(exportDecl);
    });
  return root.toSource();
}

function getDefaultImportDeclarators(rootAst: jscodeshift.Collection) {
  // var ... = require('y')
  return rootAst
    .find(jscodeshift.VariableDeclarator, {
      init: {
        callee: {
          name: 'require',
        },
      },
    })
    .filter((variableDeclarator) => {
      return !!variableDeclarator.value;
    });
}

function getNamedImportDeclarators(rootAst: jscodeshift.Collection) {
  // var ... = require('y').x
  return rootAst.find(jscodeshift.VariableDeclarator, {
    init: {
      object: {
        callee: {
          name: 'require',
        },
      },
    },
  });
}

function getImportDeclaratorPaths(variableDeclaration: jscodeshift.Collection) {
  const defaultImports = getDefaultImportDeclarators(variableDeclaration);

  const namedImports = getNamedImportDeclarators(variableDeclaration);

  return [...defaultImports.paths(), ...namedImports.paths()];
}
