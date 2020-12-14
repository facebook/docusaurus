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
import {TranslationFileContent, TranslationMessage} from '@docusaurus/types';
import globby from 'globby';
import nodePath from 'path';
import {InitPlugin} from '../plugins/init';

// We only support extracting source code translations from these kind of files
const TranslatableSourceCodeExtension = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  // TODO support md/mdx too? (may be overkill)
  // need to compile the MDX to JSX first and remove frontmatter
  // '.md',
  // '.mdx',
]);
function isTranslatableSourceCodePath(filePath: string): boolean {
  return TranslatableSourceCodeExtension.has(nodePath.extname(filePath));
}

async function getSourceCodeFilePaths(
  plugins: InitPlugin[],
): Promise<string[]> {
  // The getPathsToWatch() generally returns the js/jsx/ts/tsx/md/mdx file paths
  // We can use this method as well to know which folders we should try to extract translations from
  // Hacky/implicit, but do we want to introduce a new lifecycle method for that???
  const allPathsToWatch = flatten(
    plugins.map((plugin) => plugin.getPathsToWatch?.() ?? []),
  );

  const filePaths = await globby(allPathsToWatch);

  return filePaths.filter(isTranslatableSourceCodePath);
}

export async function extractPluginsSourceCodeTranslations(
  plugins: InitPlugin[],
  babelOptions: TransformOptions,
): Promise<TranslationFileContent> {
  // Should we warn here if the same translation "key" is found in multiple source code files?
  function toTranslationFileContent(
    sourceCodeFileTranslations: SourceCodeFileTranslations[],
  ): TranslationFileContent {
    return sourceCodeFileTranslations.reduce((acc, item) => {
      return {...acc, ...item.translations};
    }, {});
  }

  const sourceCodeFilePaths = await getSourceCodeFilePaths(plugins);
  const sourceCodeFilesTranslations = await extractAllSourceCodeFileTranslations(
    sourceCodeFilePaths,
    babelOptions,
  );

  logSourceCodeFileTranslationsWarnings(sourceCodeFilesTranslations);

  return toTranslationFileContent(sourceCodeFilesTranslations);
}

function logSourceCodeFileTranslationsWarnings(
  sourceCodeFilesTranslations: SourceCodeFileTranslations[],
) {
  sourceCodeFilesTranslations.forEach(({sourceCodeFilePath, warnings}) => {
    if (warnings.length > 0) {
      console.warn(
        `Translation extraction warnings for file path=${sourceCodeFilePath}:\n- ${chalk.yellow(
          warnings.join('\n\n- '),
        )}`,
      );
    }
  });
}

type SourceCodeFileTranslations = {
  sourceCodeFilePath: string;
  translations: Record<string, TranslationMessage>;
  warnings: string[];
};

async function extractAllSourceCodeFileTranslations(
  sourceCodeFilePaths: string[],
  babelOptions: TransformOptions,
): Promise<SourceCodeFileTranslations[]> {
  return flatten(
    await Promise.all(
      sourceCodeFilePaths.map((sourceFilePath) =>
        extractSourceCodeFileTranslations(sourceFilePath, babelOptions),
      ),
    ),
  );
}

export async function extractSourceCodeFileTranslations(
  sourceCodeFilePath: string,
  babelOptions: TransformOptions,
): Promise<SourceCodeFileTranslations> {
  try {
    const code = await fs.readFile(sourceCodeFilePath, 'utf8');

    const ast = parse(code, {
      ...babelOptions,
      ast: true,
      // filename is important, because babel does not process the same files according to their js/ts extensions
      // see  see https://twitter.com/NicoloRibaudo/status/1321130735605002243
      filename: sourceCodeFilePath,
    }) as Node;

    return await extractSourceCodeAstTranslations(ast, sourceCodeFilePath);
  } catch (e) {
    e.message = `Error while attempting to extract Docusaurus translations from source code file at path=${sourceCodeFilePath}\n${e.message}`;
    throw e;
  }
}

/*
Need help understanding this?

Useful resources:
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
https://github.com/formatjs/formatjs/blob/main/packages/babel-plugin-react-intl/index.ts
https://github.com/pugjs/babel-walk
 */
function extractSourceCodeAstTranslations(
  ast: Node,
  sourceCodeFilePath: string,
): SourceCodeFileTranslations {
  function staticTranslateJSXWarningPart() {
    return 'Translate content could not be extracted.\nIt has to be a static string, like <Translate>text</Translate>.';
  }
  function sourceFileWarningPart(node: Node) {
    return `File=${sourceCodeFilePath} at line=${node.loc?.start.line}`;
  }
  function generateCode(node: Node) {
    return generate(node as any).code;
  }

  const translations: Record<string, TranslationMessage> = {};
  const warnings: string[] = [];

  // TODO we should check the presence of the correct @docusaurus imports here!

  traverse(ast, {
    JSXElement(path) {
      function evaluateJSXProp(propName: string): string | undefined {
        const attributePath = path
          .get('openingElement.attributes')
          .find(
            (attr) => attr.isJSXAttribute() && attr.node.name.name === propName,
          );

        if (attributePath) {
          const attributeValue = attributePath.get('value') as NodePath;

          const attributeValueEvaluated =
            attributeValue.node.type === 'JSXExpressionContainer'
              ? (attributeValue.get('expression') as NodePath).evaluate()
              : attributeValue.evaluate();

          if (
            attributeValueEvaluated.confident &&
            typeof attributeValueEvaluated.value === 'string'
          ) {
            return attributeValueEvaluated.value;
          } else {
            warnings.push(
              `<Translate> prop=${propName} should be a statically evaluable object.\nExample: <Translate id="optional.id" description="optional description">Message</Translate>\nDynamically constructed values are not allowed, because they prevent translations to be extracted.\n${sourceFileWarningPart(
                path.node,
              )}\n${generateCode(path.node)}`,
            );
          }
        }

        return undefined;
      }

      if (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'Translate'
      ) {
        // We only handle the optimistic case where we have a single non-empty content
        const singleChildren: NodePath | undefined = path
          .get('children')
          // Remove empty/useless text nodes that might be around our translation!
          // Makes the translation system more reliable to JSX formatting issues
          .filter(
            (childrenPath: NodePath) =>
              !(
                t.isJSXText(childrenPath.node) &&
                childrenPath.node.value.replace('\n', '').trim() === ''
              ),
          )
          .pop();

        if (singleChildren && t.isJSXText(singleChildren.node)) {
          const message = singleChildren.node.value.trim().replace(/\s+/g, ' ');

          const id = evaluateJSXProp('id');
          const description = evaluateJSXProp('description');

          translations[id ?? message] = {
            message,
            ...(description && {description}),
          };
        } else if (
          singleChildren &&
          t.isJSXExpressionContainer(singleChildren) &&
          (singleChildren.get('expression') as NodePath).evaluate().confident
        ) {
          const message = (singleChildren.get(
            'expression',
          ) as NodePath).evaluate().value;

          const id = evaluateJSXProp('id');
          const description = evaluateJSXProp('description');

          translations[id ?? message] = {
            message,
            ...(description && {description}),
          };
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

          // console.log('firstArgEvaluated', firstArgEvaluated);

          if (
            firstArgEvaluated.confident &&
            typeof firstArgEvaluated.value === 'object'
          ) {
            const {message, id, description} = firstArgEvaluated.value;
            translations[id ?? message] = {
              message,
              ...(description && {description}),
            };
          } else {
            warnings.push(
              `translate() first arg should be a statically evaluable object.\nExample: translate({message: "text",id: "optional.id",description: "optional description"}\nDynamically constructed values are not allowed, because they prevent translations to be extracted.\n${sourceFileWarningPart(
                path.node,
              )}\n${generateCode(path.node)}`,
            );
          }
        } else {
          warnings.push(
            `translate() function only takes 1 arg\n${sourceFileWarningPart(
              path.node,
            )}\n${generateCode(path.node)}`,
          );
        }
      }
    },
  });

  return {sourceCodeFilePath, translations, warnings};
}
