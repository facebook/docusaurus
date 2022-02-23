/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import ts from 'typescript';
import {Globby} from '@docusaurus/utils';
// eslint-disable-next-line import/no-unresolved
import {getTargetPath} from './compiler.js';

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (p) => p,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine(),
    ),
  );
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting" or "Completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

export function watch(): void {
  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configPath) {
    throw new Error(
      'Could not find a valid tsconfig.json file in current directory',
    );
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  const compilerHost = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged,
  );

  ts.createWatchProgram(compilerHost);
}

/**
 * There's no API for unrolling the `extends` field in tsconfig, so we do it
 * ourselves.
 */
function resolveCompilerOptions(configEntryPath: string): ts.CompilerOptions {
  let configPath: string | undefined = configEntryPath;
  let compilerOptions = {};
  while (configPath) {
    const {config} = ts.readConfigFile(configPath, ts.sys.readFile);
    compilerOptions = {...config.compilerOptions, ...compilerOptions};
    configPath = config.extends;
  }
  return compilerOptions;
}

/**
 * Typechecking and emitting declaration
 */
export async function tsc(
  sourceDir: string,
  targetDir: string,
  ignore: string[],
): Promise<void> {
  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configPath) {
    throw new Error(
      'Could not find a valid tsconfig.json file in current directory',
    );
  }
  const {config} = ts.readConfigFile(configPath, ts.sys.readFile);
  const compilerOptions = resolveCompilerOptions(configPath);
  // Fix error: TS expects moduleResolution to be an enum
  if ((compilerOptions.moduleResolution as unknown) === 'node') {
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
  }

  const host = ts.createCompilerHost(config);

  const program = ts.createProgram(
    await Globby(`${sourceDir}/**/*`, {ignore}),
    {...compilerOptions, emitDeclarationOnly: true},
    host,
  );
  program.emit(undefined, (filepath, data) => {
    fs.writeFileSync(getTargetPath(filepath, sourceDir, targetDir), data);
  });
}
