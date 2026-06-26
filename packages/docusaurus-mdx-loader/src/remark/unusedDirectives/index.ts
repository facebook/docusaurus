/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import process from 'process';
import logger from '@docusaurus/logger';
import {toMessageRelativeFilePath, posixPath} from '@docusaurus/utils';
import {formatNodePositionExtraMessage, transformNode} from '../utils';
import type {Root} from 'mdast';
import type {Parent} from 'unist';
import type {Transformer, Processor, Plugin} from 'unified';
import type {Directives, TextDirective} from 'mdast-util-directive';
import type {
  MarkdownConfig,
  OnUnusedMarkdownDirectivesFunction,
} from '@docusaurus/types';

type DirectiveType = Directives['type'];

const directiveTypes: DirectiveType[] = [
  'containerDirective',
  'leafDirective',
  'textDirective',
];

const directivePrefixMap: {[key in DirectiveType]: string} = {
  textDirective: ':',
  leafDirective: '::',
  containerDirective: ':::',
};

function formatDirectiveName(directive: Directives) {
  const prefix = directivePrefixMap[directive.type];
  if (!prefix) {
    throw new Error(
      `unexpected, no prefix found for directive of type ${directive.type}`,
    );
  }
  // To simplify we don't display the eventual label/props of directives
  return `${prefix}${directive.name}`;
}

function formatUnusedDirectiveMessage(directive: Directives) {
  const name = formatDirectiveName(directive);
  return `- ${name}${formatNodePositionExtraMessage(directive)}`;
}

function formatUnusedDirectivesMessage({
  directives,
  filePath,
}: {
  directives: Directives[];
  filePath: string;
}): string {
  const supportUrl = 'https://github.com/facebook/docusaurus/pull/9394';
  const customPath = posixPath(path.relative(process.cwd(), filePath));
  const warningTitle = logger.interpolate`Docusaurus found ${directives.length} unused Markdown directives in file path=${customPath}`;
  const customSupportUrl = logger.interpolate`url=${supportUrl}`;
  const warningMessages = directives
    .map(formatUnusedDirectiveMessage)
    .join('\n');

  return `${warningTitle}
${warningMessages}
Your content might render in an unexpected way. Visit ${customSupportUrl} to find out why and how to fix it.`;
}

export type PluginOptions = {
  onUnusedMarkdownDirectives: MarkdownConfig['hooks']['onUnusedMarkdownDirectives'];
};

function asFunction(
  onUnusedMarkdownDirectives: PluginOptions['onUnusedMarkdownDirectives'],
): OnUnusedMarkdownDirectivesFunction {
  if (typeof onUnusedMarkdownDirectives === 'string') {
    const extraHelp =
      onUnusedMarkdownDirectives === 'throw'
        ? logger.interpolate`\nTo ignore this error, use the code=${'siteConfig.markdown.hooks.onUnusedMarkdownDirectives'} option.`
        : '';
    return ({sourceFilePath, directives}) => {
      const relativePath = toMessageRelativeFilePath(sourceFilePath);
      logger.report(onUnusedMarkdownDirectives)`${formatUnusedDirectivesMessage(
        {
          directives,
          filePath: relativePath,
        },
      )}${extraHelp}`;
    };
  } else {
    return (params) =>
      onUnusedMarkdownDirectives({
        ...params,
        sourceFilePath: toMessageRelativeFilePath(params.sourceFilePath),
      });
  }
}

function isTextDirective(directive: Directives): directive is TextDirective {
  return directive.type === 'textDirective';
}

// A simple text directive is one without any label/props
function isSimpleTextDirective(
  directive: Directives,
): directive is TextDirective {
  if (isTextDirective(directive)) {
    // Attributes in MDAST = Directive props
    const hasAttributes =
      directive.attributes && Object.keys(directive.attributes).length > 0;
    // Children in MDAST = Directive label
    const hasChildren = directive.children.length > 0;
    return !hasAttributes && !hasChildren;
  }
  return false;
}

function transformSimpleTextDirectiveToString(textDirective: Directives) {
  transformNode(textDirective, {
    type: 'text',
    value: `:${textDirective.name}`, // We ignore label/props on purpose here
  });
}

function isUnusedDirective(directive: Directives) {
  // If directive data is set (notably hName/hProperties set by admonitions)
  // this usually means the directive has been handled by another plugin
  return !directive.data;
}

const plugin: Plugin<PluginOptions[], Root> = function plugin(
  this: Processor,
  options,
): Transformer<Root> {
  const onUnusedMarkdownDirectives = asFunction(
    options.onUnusedMarkdownDirectives,
  );

  return async (tree, file) => {
    const {visit} = await import('unist-util-visit');

    const unusedDirectives: Directives[] = [];

    // @ts-expect-error: TODO fix type
    visit<Parent, Directives>(tree, directiveTypes, (directive: Directives) => {
      // If directive data is set (hName/hProperties set by admonitions)
      // this usually means the directive has been handled by another plugin
      if (isUnusedDirective(directive)) {
        if (isSimpleTextDirective(directive)) {
          transformSimpleTextDirectiveToString(directive);
        } else {
          unusedDirectives.push(directive);
        }
      }
    });

    // We only process unused directives for the client compiler
    // This avoids emitting duplicate errors/warnings in prod mode
    // Note: the client compiler is used in both dev/prod modes
    // Also: the client compiler is what gets used when using crossCompilerCache
    if (file.data.compilerName === 'client' && unusedDirectives.length > 0) {
      onUnusedMarkdownDirectives({
        sourceFilePath: file.path!,
        directives: unusedDirectives,
      });
    }
  };
};

export default plugin;
