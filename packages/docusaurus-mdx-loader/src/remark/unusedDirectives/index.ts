/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import process from 'process';
import visit from 'unist-util-visit';
import logger from '@docusaurus/logger';
import {posixPath} from '@docusaurus/utils';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';
import type {
  Directive,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-directive';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

type DirectiveType = Directive['type'];

const directiveTypes: DirectiveType[] = [
  'containerDirective',
  'leafDirective',
  'textDirective',
];

function formatUnusedDirectiveMessage(unusedDirective: Directive) {
  let customDirectiveName = unusedDirective.name;

  if (unusedDirective.type === 'containerDirective') {
    customDirectiveName = `:::${unusedDirective.name}`;
  } else if (unusedDirective.type === 'leafDirective') {
    customDirectiveName = `::${unusedDirective.name}`;
  } else if (unusedDirective.type === 'textDirective') {
    customDirectiveName = `:${unusedDirective.name}`;
  }

  const positionMessage = unusedDirective.position?.start
    ? logger.interpolate`number=${unusedDirective.position.start.line}:number=${unusedDirective.position.start.column}`
    : '';

  return `- ${positionMessage} ${customDirectiveName} `;
}

function formatUnusedDirectivesMessage({
  unusedDirectives,
  filePath,
}: {
  unusedDirectives: Directive[];
  filePath: string;
}): string {
  const supportUrl = 'https://github.com/facebook/docusaurus/pull/9394';
  const customPath = posixPath(path.relative(process.cwd(), filePath));
  const warningTitle = logger.interpolate`Docusaurus found ${unusedDirectives.length} unused Markdown directives in file path=${customPath}`;
  const customSupportUrl = logger.interpolate`url=${supportUrl}`;
  const warningMessages = unusedDirectives
    .map(formatUnusedDirectiveMessage)
    .join('\n');

  return `${warningTitle}
${warningMessages}
Your content might render in an unexpected way. Visit ${customSupportUrl} to find out why and how to fix it.`;
}

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return (tree, file) => {
    // We only enable these warnings for the client compiler
    // This avoids emitting duplicate warnings in prod mode
    // Note: the client compiler is used in both dev/prod modes
    if (file.data.compilerName !== 'client') {
      return;
    }

    const unusedDirectives: Directive[] = [];

    visit<Parent>(tree, directiveTypes, (directive: Directive) => {
      // If directive data is set (notably hName/hProperties set by admonitions)
      // this usually means the directive has been handled by another plugin
      if (!directive.data) {
        unusedDirectives.push(directive);
      }
    });

    if (unusedDirectives.length > 0) {
      const message = formatUnusedDirectivesMessage({
        unusedDirectives,
        filePath: file.path,
      });
      logger.warn(message);
    }
  };
};

export default plugin;
