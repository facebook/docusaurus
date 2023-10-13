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

const directiveTypes = ['containerDirective', 'leafDirective', 'textDirective'];

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return (tree, file) => {
    // We only enable these warnings for the client compiler
    // This avoids emitting duplicate warnings in prod mode
    // Note: the client compiler is used in both dev/prod modes
    if (file.data.compilerName !== 'client') {
      return;
    }

    const unusedDirectives: Array<{
      name: string;
      type: string;
      position:
        | {
            line: number;
            column: number;
          }
        | undefined;
    }> = [];

    visit<Parent>(tree, directiveTypes, (node: Directive) => {
      if (!node.data) {
        unusedDirectives.push({
          name: node.name,
          type: node.type,
          position: node.position
            ? {
                line: node.position.start.line,
                column: node.position.start.column,
              }
            : undefined,
        });
      }
    });

    if (unusedDirectives.length > 0) {
      const supportUrl = 'https://github.com/facebook/docusaurus/pull/9394';
      const customPath = posixPath(path.relative(process.cwd(), file.path));
      const warningTitle = logger.interpolate`Docusaurus found ${unusedDirectives.length} unused Markdown directives in file path=${customPath}`;
      const customSupportUrl = logger.interpolate`url=${supportUrl}`;

      const warningMessages = unusedDirectives
        .map((unusedDirective) => {
          let customDirectiveName = unusedDirective.name;

          if (unusedDirective.type === 'containerDirective') {
            customDirectiveName = `:::${unusedDirective.name}`;
          } else if (unusedDirective.type === 'leafDirective') {
            customDirectiveName = `::${unusedDirective.name}`;
          } else if (unusedDirective.type === 'textDirective') {
            customDirectiveName = `:${unusedDirective.name}`;
          }

          const positionMessage = unusedDirective.position
            ? logger.interpolate`number=${unusedDirective.position.line}:number=${unusedDirective.position.column}`
            : '';

          return `- ${positionMessage} ${customDirectiveName} `;
        })
        .join('\n');

      logger.warn(`${warningTitle}
${warningMessages}
Your content might render in an unexpected way. Visit ${customSupportUrl} to find out why and how to fix it.`);
    }
  };
};

export default plugin;
