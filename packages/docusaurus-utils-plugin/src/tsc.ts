/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ts from 'typescript';

export default function tsc(): void {
  const currentDir = process.cwd();
  const configFile = ts.findConfigFile(
    currentDir,
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configFile) {
    throw Error('tsconfig.json not found');
  }
  const {config} = ts.readConfigFile(configFile, ts.sys.readFile);

  const {options, fileNames, errors} = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    currentDir,
  );

  const program = ts.createIncrementalProgram({
    options,
    rootNames: fileNames,
    configFileParsingDiagnostics: errors,
  });

  const {diagnostics, emitSkipped} = program.emit();

  const allDiagnostics = diagnostics.concat(errors);

  if (allDiagnostics.length) {
    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (path) => path,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    const message = ts.formatDiagnostics(allDiagnostics, formatHost);
    console.warn(message);
  }

  if (emitSkipped) {
    process.exit(1);
  }
}
