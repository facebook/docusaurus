/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import ts from 'typescript';

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (path) => path,
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
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
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

export function compile(fileNames: string[]): void {
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
  const {config} = ts.readConfigFile(configPath, (p) =>
    fs.readFileSync(p).toString(),
  );
  // Create a Program with an in-memory emit
  const createdFiles: Record<string, string> = {};
  const host = ts.createCompilerHost(config);
  host.writeFile = (fileName: string, contents: string) => {
    createdFiles[fileName] = contents;
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(fileNames, config, host);
  program.emit();
}
