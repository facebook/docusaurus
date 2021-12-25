/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import traverse, {Node} from '@babel/traverse';
import generate from '@babel/generator';
import logger from '@docusaurus/logger';
import {parse, types as t, NodePath, TransformOptions} from '@babel/core';
import {
  InitializedPlugin,
  TranslationFileContent,
  TranslationMessage,
} from '@docusaurus/types';
import nodePath from 'path';
import {SRC_DIR_NAME} from '@docusaurus/utils';
import {safeGlobby} from '../utils';

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

function getSiteSourceCodeFilePaths(siteDir: string): string[] {
  return [nodePath.join(siteDir, SRC_DIR_NAME)];
}

function getPluginSourceCodeFilePaths(plugin: InitializedPlugin): string[] {
  // The getPathsToWatch() generally returns the js/jsx/ts/tsx/md/mdx file paths
  // We can use this method as well to know which folders we should try to extract translations from
  // Hacky/implicit, but do we want to introduce a new lifecycle method just for that???
  const codePaths: string[] = plugin.getPathsToWatch?.() ?? [];

  // We also include theme code
  const themePath = plugin.getThemePath?.();
  if (themePath) {
    codePaths.push(themePath);
  }

  return codePaths;
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
  // We can use this method as well to know which folders we should try to extract translations from
  // Hacky/implicit, but do we want to introduce a new lifecycle method for that???
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
  // Should we warn here if the same translation "key" is found in multiple source code files?
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
  translations: Record<string, TranslationMessage>;
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
      // filename is important, because babel does not process the same files according to their js/ts extensions
      // see  see https://twitter.com/NicoloRibaudo/status/1321130735605002243
      filename: sourceCodeFilePath,
    }) as Node;

    const translations = await extractSourceCodeAstTranslations(
      ast,
      sourceCodeFilePath,
    );
    return translations;
  } catch (e) {
    if (e instanceof Error) {
      e.message = `Error while attempting to extract Docusaurus translations from source code file at path=${sourceCodeFilePath}\n${e.message}`;
    }
    throw e;
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
    return `File: ${sourceCodeFilePath} at ${
      node.loc?.start.line
    } line\nFull code: ${generate(node).code}`;
  }

  const translations: Record<string, TranslationMessage> = {};
  const warnings: string[] = [];

  // TODO we should check the presence of the correct @docusaurus imports here!

  traverse(ast, {
    JSXElement(path) {
      if (
        !path
          .get('openingElement')
          .get('name')
          .isJSXIdentifier({name: 'Translate'})
      ) {
        return;
      }
      function evaluateJSXProp(propName: string): string | undefined {
        const attributePath = path
          .get('openingElement.attributes')
          .find(
            (attr) =>
              attr.isJSXAttribute() &&
              (attr as NodePath<t.JSXAttribute>)
                .get('name')
                .isJSXIdentifier({name: propName}),
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
          } else {
            warnings.push(
              `<Translate> prop=${propName} should be a statically evaluable object.\nExample: <Translate id="optional.id" description="optional description">Message</Translate>\nDynamically constructed values are not allowed, because they prevent translations to be extracted.\n${sourceWarningPart(
                path.node,
              )}`,
            );
          }
        }

        return undefined;
      }

      const id = evaluateJSXProp('id');
      const description = evaluateJSXProp('description');
      let message;
      const childrenPath = path.get('children');

      // Handle empty content
      if (!childrenPath.length) {
        if (!id) {
          warnings.push(`
            <Translate> without children must have id prop.\nExample: <Translate id="my-id" />\n${sourceWarningPart(
              path.node,
            )}
          `);
        } else {
          translations[id] = {
            message: message ?? id,
            ...(description && {description}),
          };
        }

        return;
      }

      // Handle single non-empty content
      const singleChildren = childrenPath
        // Remove empty/useless text nodes that might be around our translation!
        // Makes the translation system more reliable to JSX formatting issues
        .filter(
          (children) =>
            !(
              children.isJSXText() &&
              children.node.value.replace('\n', '').trim() === ''
            ),
        )
        .pop();
      const isJSXText = singleChildren && singleChildren.isJSXText();
      const isJSXExpressionContainer =
        singleChildren &&
        singleChildren.isJSXExpressionContainer() &&
        (singleChildren.get('expression') as NodePath).evaluate().confident;

      if (isJSXText || isJSXExpressionContainer) {
        message = isJSXText
          ? singleChildren.node.value.trim().replace(/\s+/g, ' ')
          : (singleChildren.get('expression') as NodePath).evaluate().value;

        translations[id ?? message] = {
          message,
          ...(description && {description}),
        };
      } else {
        warnings.push(
          `Translate content could not be extracted. It has to be a static string and use optional but static props, like <Translate id="my-id" description="my-description">text</Translate>.\n${sourceWarningPart(
            path.node,
          )}`,
        );
      }
    },

    CallExpression(path) {
      if (!path.get('callee').isIdentifier({name: 'translate'})) {
        return;
      }

      const args = path.get('arguments');
      if (args.length === 1 || args.length === 2) {
        const firstArgPath = args[0];

        // evaluation allows translate("x" + "y"); to be considered as translate("xy");
        const firstArgEvaluated = firstArgPath.evaluate();

        if (
          firstArgEvaluated.confident &&
          typeof firstArgEvaluated.value === 'object'
        ) {
          const {message, id, description} = firstArgEvaluated.value;
          translations[id ?? message] = {
            message: message ?? id,
            ...(description && {description}),
          };
        } else {
          warnings.push(
            `translate() first arg should be a statically evaluable object.\nExample: translate({message: "text",id: "optional.id",description: "optional description"}\nDynamically constructed values are not allowed, because they prevent translations to be extracted.\n${sourceWarningPart(
              path.node,
            )}`,
          );
        }
      } else {
        warnings.push(
          `translate() function only takes 1 or 2 args\n${sourceWarningPart(
            path.node,
          )}`,
        );
      }
    },
  });

  return {sourceCodeFilePath, translations, warnings};
}
