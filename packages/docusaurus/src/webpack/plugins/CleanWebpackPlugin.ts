/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The MIT License (MIT)
 * Copyright (c) 2015 John Agan
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Forked from https://github.com/johnagan/clean-webpack-plugin
// Modified to optimize performance for Docusaurus specific use case
// More context: https://github.com/facebook/docusaurus/pull/1839

import path from 'path';
import fs from 'fs-extra';
import {sync as delSync} from 'del';
import type {Compiler, Stats} from 'webpack';

export type Options = {
  /**
   * Write Logs to Console
   * (Always enabled when dry is true)
   *
   * default: false
   */
  verbose?: boolean;

  /**
   * Automatically remove all unused webpack assets on rebuild
   *
   * default: true
   */
  cleanStaleWebpackAssets?: boolean;

  /**
   * Do not allow removal of current webpack assets
   *
   * default: true
   */
  protectWebpackAssets?: boolean;

  /**
   * Removes files once prior to Webpack compilation
   *   Not included in rebuilds (watch mode)
   *
   * Use !negative patterns to exclude files
   *
   * default: ['**\/*']
   */
  cleanOnceBeforeBuildPatterns?: string[];
};

export default class CleanWebpackPlugin {
  private readonly verbose: boolean;
  private readonly cleanStaleWebpackAssets: boolean;
  private readonly protectWebpackAssets: boolean;
  private readonly cleanOnceBeforeBuildPatterns: string[];
  private currentAssets: string[];
  private initialClean: boolean;
  private outputPath: string;

  constructor(options: Options = {}) {
    this.verbose = options.verbose === true || false;

    this.cleanStaleWebpackAssets =
      options.cleanStaleWebpackAssets === true ||
      options.cleanStaleWebpackAssets === false
        ? options.cleanStaleWebpackAssets
        : true;

    this.protectWebpackAssets =
      options.protectWebpackAssets === true ||
      options.protectWebpackAssets === false
        ? options.protectWebpackAssets
        : true;

    this.cleanOnceBeforeBuildPatterns = Array.isArray(
      options.cleanOnceBeforeBuildPatterns,
    )
      ? options.cleanOnceBeforeBuildPatterns
      : ['**/*'];

    /**
     * Store webpack build assets
     */
    this.currentAssets = [];

    /**
     * Only used with cleanOnceBeforeBuildPatterns
     */
    this.initialClean = false;

    this.outputPath = '';

    this.apply = this.apply.bind(this);
    this.handleInitial = this.handleInitial.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.removeFiles = this.removeFiles.bind(this);
  }

  apply(compiler: Compiler): void {
    if (!compiler.options.output.path) {
      console.warn(
        'clean-webpack-plugin: options.output.path not defined. Plugin disabled...',
      );

      return;
    }

    this.outputPath = compiler.options.output.path;

    const {hooks} = compiler;

    if (this.cleanOnceBeforeBuildPatterns.length !== 0) {
      hooks.compile.tap('clean-webpack-plugin', () => {
        this.handleInitial();
      });
    }

    hooks.done.tap('clean-webpack-plugin', (stats) => {
      this.handleDone(stats);
    });
  }

  /**
   * Initially remove files from output directory prior to build.
   *
   * Only happens once.
   *
   * Warning: It is recommended to initially clean your build directory outside
   * of webpack to minimize unexpected behavior.
   */
  handleInitial(): void {
    if (this.initialClean) {
      return;
    }

    if (
      // eslint-disable-next-line no-restricted-properties
      fs.pathExistsSync(this.outputPath) &&
      // eslint-disable-next-line no-restricted-properties
      fs.statSync(this.outputPath).isFile()
    ) {
      throw new Error(
        `A file '${this.outputPath}' already exists. Docusaurus needs this directory to save the build output. Either remove/change the file or choose a different build directory via '--out-dir'.`,
      );
    }

    this.initialClean = true;

    this.removeFiles(this.cleanOnceBeforeBuildPatterns);
  }

  handleDone(stats: Stats): void {
    /**
     * Do nothing if there is a webpack error
     */
    if (stats.hasErrors()) {
      if (this.verbose) {
        console.warn('clean-webpack-plugin: pausing due to webpack errors');
      }

      return;
    }

    /**
     * Fetch Webpack's output asset files
     */
    const statsAssets =
      stats.toJson({
        all: false,
        assets: true,
      }).assets ?? [];
    const assets = statsAssets.map((asset: {name: string}) => asset.name);

    /**
     * Get all files that were in the previous build but not the current
     *
     * (relies on del's cwd: outputPath option)
     */
    const staleFiles = this.currentAssets.filter(
      (previousAsset) => !assets.includes(previousAsset),
    );

    /**
     * Save assets for next compilation
     */
    this.currentAssets = assets.sort();

    const removePatterns: string[] = [];

    /**
     * Remove unused webpack assets
     */
    if (this.cleanStaleWebpackAssets && staleFiles.length !== 0) {
      removePatterns.push(...staleFiles);
    }

    if (removePatterns.length !== 0) {
      this.removeFiles(removePatterns);
    }
  }

  removeFiles(patterns: string[]): void {
    try {
      const deleted = delSync(patterns, {
        force: false,
        // Change context to build directory
        cwd: this.outputPath,
        dryRun: false,
        dot: true,
        ignore: this.protectWebpackAssets ? this.currentAssets : [],
      });

      /**
       * Log if verbose is enabled
       */
      if (this.verbose) {
        deleted.forEach((file) => {
          const filename = path.relative(process.cwd(), file);

          /**
           * Use console.warn over .log
           * https://github.com/webpack/webpack/issues/1904
           * https://github.com/johnagan/clean-webpack-plugin/issues/11
           */
          console.warn(`clean-webpack-plugin: removed ${filename}`);
        });
      }
    } catch (err) {
      const needsForce = (err as Error).message.includes(
        'Cannot delete files/folders outside the current working directory.',
      );

      if (needsForce) {
        const message =
          'clean-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the "dangerouslyAllowCleanPatternsOutsideProject" option.';

        throw new Error(message);
      }

      throw err;
    }
  }
}
