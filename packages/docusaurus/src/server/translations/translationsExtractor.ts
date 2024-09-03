/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nodePath from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import traverse, {type Node} from '@babel/traverse';
import generate from '@babel/generator';
import {
  parse,
  type types as t,
  type NodePath,
  type TransformOptions,
} from '@babel/core';
import {SRC_DIR_NAME} from '@docusaurus/utils';
import {safeGlobby} from '../utils';
import type {
  InitializedPlugin,
  TranslationFileContent,
} from '@docusaurus/types';

// We only support extracting source code translations from these kind of files
const TranslatableSourceCodeExtension = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  // TODO support md/mdx too? (may be overkill)
  // need to compile the MDX to JSX first and remove front matter
  // '.md',
  // '.mdx',
]);
function isTranslatableSourceCodePath(filePath: string): boolean {
  return TranslatableSourceCodeExtension.has(nodePath.extname(filePath));
}

function getSiteSourceCodeFilePaths(siteDir: string): string[] {
  return [nodePath.join(siteDir, SRC_DIR_NAME)];
}

function getPluginSourceCodeFilePaths(plugin: InitializedPlugin): string[] {
  // The getPathsToWatch() generally returns the js/jsx/ts/tsx/md/mdx file paths
  // We can use this method as well to know which folders we should try to
  // extract translations from. Hacky/implicit, but do we want to introduce a
  // new lifecycle method just for that???
  const codePaths: string[] = plugin.getPathsToWatch?.() ?? [];

  // We also include theme code
  const themePath = plugin.getThemePath?.();
  if (themePath) {
    codePaths.push(themePath);
  }

  return codePaths.map((p) => nodePath.resolve(plugin.path, p));
}

export async function globSourceCodeFilePaths(
  dirPaths: string[],
): Promise<string[]> {
  const filePaths = await safeGlobby(dirPaths);
  return filePaths.filter(isTranslatableSourceCodePath);
}

async function getSourceCodeFilePaths(
  siteDir: string,
  plugins: InitializedPlugin[],
): Promise<string[]> {
  const sitePaths = getSiteSourceCodeFilePaths(siteDir);

  // The getPathsToWatch() generally returns the js/jsx/ts/tsx/md/mdx file paths
  // We can use this method as well to know which folders we should try to
  // extract translations from. Hacky/implicit, but do we want to introduce a
  // new lifecycle method for that???
  const pluginsPaths = plugins.flatMap(getPluginSourceCodeFilePaths);

  const allPaths = [...sitePaths, ...pluginsPaths];

  return globSourceCodeFilePaths(allPaths);
}

export async function extractSiteSourceCodeTranslations(
  siteDir: string,
  plugins: InitializedPlugin[],
  babelOptions: TransformOptions,
  extraSourceCodeFilePaths: string[] = [],
): Promise<TranslationFileContent> {
  // Should we warn here if the same translation "key" is found in multiple
  // source code files?
  function toTranslationFileContent(
    sourceCodeFileTranslations: SourceCodeFileTranslations[],
  ): TranslationFileContent {
    return sourceCodeFileTranslations.reduce(
      (acc, item) => ({...acc, ...item.translations}),
      {},
    );
  }

  const sourceCodeFilePaths = await getSourceCodeFilePaths(siteDir, plugins);

  const allSourceCodeFilePaths = [
    ...sourceCodeFilePaths,
    ...extraSourceCodeFilePaths,
  ];

  const sourceCodeFilesTranslations =
    await extractAllSourceCodeFileTranslations(
      allSourceCodeFilePaths,
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
      logger.warn`Translation extraction warnings for file path=${sourceCodeFilePath}: ${warnings}`;
    }
  });
}

type SourceCodeFileTranslations = {
  sourceCodeFilePath: string;
  translations: TranslationFileContent;
  warnings: string[];
};

export async function extractAllSourceCodeFileTranslations(
  sourceCodeFilePaths: string[],
  babelOptions: TransformOptions,
): Promise<SourceCodeFileTranslations[]> {
  return Promise.all(
    sourceCodeFilePaths.flatMap((sourceFilePath) =>
      extractSourceCodeFileTranslations(sourceFilePath, babelOptions),
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
      // filename is important, because babel does not process the same files
      // according to their js/ts extensions.
      // See https://twitter.com/NicoloRibaudo/status/1321130735605002243
      filename: sourceCodeFilePath,
    }) as Node;

    const translations = extractSourceCodeAstTranslations(
      ast,
      sourceCodeFilePath,
    );
    return translations;
  } catch (err) {
    logger.error`Error while attempting to extract Docusaurus translations from source code file at path=${sourceCodeFilePath}.`;
    throw err;
  }
}

/*
Need help understanding this?

Useful resources:
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
https://github.com/formatjs/formatjs/blob/main/packages/babel-plugin-formatjs/index.ts
https://github.com/pugjs/babel-walk
 */
function extractSourceCodeAstTranslations(
  ast: Node,
  sourceCodeFilePath: string,
): SourceCodeFileTranslations {
  function sourceWarningPart(node: Node) {
    return `File: ${sourceCodeFilePath} at line ${node.loc?.start.line ?? '?'}
Full code: ${generate(node).code}`;
  }

  const translations: TranslationFileContent = {};
  const warnings: string[] = [];
  let translateComponentName: string | undefined;
  let translateFunctionName: string | undefined;

  // First pass: find import declarations of Translate / translate.
  // If not found, don't process the rest to avoid false positives
  traverse(ast, {
    ImportDeclaration(path) {
      if (
        path.node.importKind === 'type' ||
        path.get('source').node.value !== '@docusaurus/Translate'
      ) {
        return;
      }
      const importSpecifiers = path.get('specifiers');
      const defaultImport = importSpecifiers.find(
        (specifier): specifier is NodePath<t.ImportDefaultSpecifier> =>
          specifier.node.type === 'ImportDefaultSpecifier',
      );
      const callbackImport = importSpecifiers.find(
        (specifier): specifier is NodePath<t.ImportSpecifier> =>
          specifier.node.type === 'ImportSpecifier' &&
          ((
            (specifier as NodePath<t.ImportSpecifier>).get('imported')
              .node as t.Identifier
          ).name === 'translate' ||
            (
              (specifier as NodePath<t.ImportSpecifier>).get('imported')
                .node as t.StringLiteral
            ).value === 'translate'),
      );

      translateComponentName = defaultImport?.get('local').node.name;
      translateFunctionName = callbackImport?.get('local').node.name;
    },
  });

  traverse(ast, {
    ...(translateComponentName && {
      JSXElement(path) {
        if (
          !path
            .get('openingElement')
            .get('name')
            .isJSXIdentifier({name: translateComponentName})
        ) {
          return;
        }
        function evaluateJSXProp(propName: string): string | undefined {
          const attributePath = path
            .get('openingElement.attributes')
            .find(
              (attr) =>
                attr.isJSXAttribute() &&
                attr.get('name').isJSXIdentifier({name: propName}),
            );

          if (attributePath) {
            const attributeValue = attributePath.get('value') as NodePath;

            const attributeValueEvaluated =
              attributeValue.isJSXExpressionContainer()
                ? (attributeValue.get('expression') as NodePath).evaluate()
                : attributeValue.evaluate();

            if (
              attributeValueEvaluated.confident &&
              typeof attributeValueEvaluated.value === 'string'
            ) {
              return attributeValueEvaluated.value;
            }
            warnings.push(
              `<Translate> prop=${propName} should be a statically evaluable object.
Example: <Translate id="optional id" description="optional description">Message</Translate>
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
${sourceWarningPart(path.node)}`,
            );
          }

          return undefined;
        }

        const id = evaluateJSXProp('id');
        const description = evaluateJSXProp('description');
        let message: string;
        const childrenPath = path.get('children');

        // Handle empty content
        if (!childrenPath.length) {
          if (!id) {
            warnings.push(`<Translate> without children must have id prop.
Example: <Translate id="my-id" />
${sourceWarningPart(path.node)}`);
          } else {
            translations[id] = {
              message: id,
              ...(description && {description}),
            };
          }

          return;
        }

        // Handle single non-empty content
        const singleChildren = childrenPath
          // Remove empty/useless text nodes that might be around our
          // translation! Makes the translation system more reliable to JSX
          // formatting issues
          .filter(
            (children) =>
              !(
                children.isJSXText() &&
                children.node.value.replace('\n', '').trim() === ''
              ),
          )
          .pop();
        const isJSXText = singleChildren?.isJSXText();
        const isJSXExpressionContainer =
          singleChildren?.isJSXExpressionContainer() &&
          (singleChildren.get('expression') as NodePath).evaluate().confident;

        if (isJSXText || isJSXExpressionContainer) {
          message = isJSXText
            ? singleChildren.node.value.trim().replace(/\s+/g, ' ')
            : String(
                (singleChildren.get('expression') as NodePath).evaluate().value,
              );

          translations[id ?? message] = {
            message,
            ...(description && {description}),
          };
        } else {
          warnings.push(
            `Translate content could not be extracted. It has to be a static string and use optional but static props, like <Translate id="my-id" description="my-description">text</Translate>.
${sourceWarningPart(path.node)}`,
          );
        }
      },
    }),

    ...(translateFunctionName && {
      CallExpression(path) {
        if (!path.get('callee').isIdentifier({name: translateFunctionName})) {
          return;
        }

        const args = path.get('arguments');
        if (args.length === 1 || args.length === 2) {
          const firstArgPath = args[0]!;

          // translate("x" + "y"); => translate("xy");
          const firstArgEvaluated = firstArgPath.evaluate();

          if (
            firstArgEvaluated.confident &&
            typeof firstArgEvaluated.value === 'object'
          ) {
            const {message, id, description} = firstArgEvaluated.value as {
              [propName: string]: unknown;
            };
            translations[String(id ?? message)] = {
              message: String(message ?? id),
              ...(Boolean(description) && {description: String(description)}),
            };
          } else {
            warnings.push(
              `translate() first arg should be a statically evaluable object.
Example: translate({message: "text",id: "optional.id",description: "optional description"}
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
${sourceWarningPart(path.node)}`,
            );
          }
        } else {
          warnings.push(
            `translate() function only takes 1 or 2 args
${sourceWarningPart(path.node)}`,
          );
        }
      },
    }),
  });

  return {sourceCodeFilePath, translations, warnings};
}
