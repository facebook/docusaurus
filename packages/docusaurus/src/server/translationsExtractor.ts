/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import traverse, {Node} from '@babel/traverse';
import generate from '@babel/generator';
import chalk from 'chalk';
import {parse, types as t, NodePath, TransformOptions} from '@babel/core';
import {flatten} from 'lodash';

export type SourceCodeFileTranslations = {
  sourceFilePath: string;
  translations: Record<string, string>;
};

export async function extractAllSourceCodeFileTranslations(
  sourceFilePaths: string[],
  babelOptions: TransformOptions,
): Promise<SourceCodeFileTranslations[]> {
  console.log('extractAllSourceCodeFileTranslations', sourceFilePaths);
  return flatten(
    await Promise.all(
      sourceFilePaths.map((sourceFilePath) =>
        extractSourceCodeFileTranslations(sourceFilePath, babelOptions),
      ),
    ),
  );
}

export async function extractSourceCodeFileTranslations(
  sourceFilePath: string,
  babelOptions: TransformOptions,
): Promise<SourceCodeFileTranslations> {
  const code = await fs.readFile(sourceFilePath, 'utf8');

  // TODO support md/mdx too, need to parse the MDX to JSX first

  const ast = parse(code, {
    ...babelOptions,
    ast: true,
    // TODO mdx => jsx see https://twitter.com/NicoloRibaudo/status/1321130735605002243
    // Important, babel does not process the same files with js/ts extensions
    filename: sourceFilePath,
  }) as Node;

  return extractSourceCodeAstTranslations(ast, sourceFilePath);
}

function extractSourceCodeAstTranslations(
  ast: Node,
  sourceFilePath: string,
): SourceCodeFileTranslations {
  function staticTranslateJSXWarningPart() {
    return 'Translate content could not be extracted.\nIt has to be a static string, like <Translate>text</Translate>.';
  }
  function sourceFileWarningPart(node: Node) {
    return `File=${sourceFilePath} at line=${node.loc?.start.line}`;
  }
  function generateCode(node: Node) {
    return generate(node as any).code;
  }

  const translations: Record<string, string> = {};
  const warnings: string[] = [];

  traverse(ast, {
    JSXElement(path) {
      if (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'Translate'
      ) {
        const pathEvaluated = path.evaluate();
        pathEvaluated.confident && console.log(pathEvaluated);

        // TODO support JSXExpressionContainer  + https://twitter.com/NicoloRibaudo/status/1321132895101214720
        if (
          path.node.children.length === 1 &&
          t.isJSXText(path.node.children[0])
        ) {
          const text = path.node.children[0].value.trim().replace(/\s+/g, ' ');
          translations[text] = text;
        } else {
          warnings.push(
            `${staticTranslateJSXWarningPart}\n${sourceFileWarningPart(
              path.node,
            )}\n${generateCode(path.node)}`,
          );
        }
      }
    },

    CallExpression(path) {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'translate'
      ) {
        // console.log('CallExpression', path.node);
        if (path.node.arguments.length === 1) {
          const firstArgPath = path.get('arguments.0') as NodePath;
          // evaluation allows translate("x" + "y"); to be considered as translate("xy");
          const firstArgEvaluated = firstArgPath.evaluate();
          if (
            firstArgEvaluated.confident &&
            typeof firstArgEvaluated.value === 'string'
          ) {
            const text = firstArgEvaluated.value;
            translations[text] = text;
          } else {
            warnings.push(
              `translate() first arg should be a static string\n${sourceFileWarningPart(
                path.node,
              )}\n${generateCode(path.node)}`,
            );
          }
        } else {
          warnings.push(
            `translate() function only takes 1 string arg\n${sourceFileWarningPart(
              path.node,
            )}\n${generateCode(path.node)}`,
          );
        }
      }
    },
  });

  console.log('Extracted translations:\n', translations);

  if (warnings.length > 0) {
    console.warn(
      `Translation extraction warnings:\n\n- ${chalk.yellow(
        warnings.join('\n\n- '),
      )}`,
    );
  }

  return {sourceFilePath, translations};
}
