/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
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

import {Compiler, Stats} from 'webpack';
import path from 'path';
import {sync as delSync} from 'del';

export interface Options {
  /**
   * Simulate the removal of files
   *
   * default: false
   */
  dry?: boolean;

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

  /**
   * Removes files after every build (including watch mode) that match this pattern.
   * Used for files that are not created directly by Webpack.
   *
   * Use !negative patterns to exclude files
   *
   * default: disabled
   */
  cleanAfterEveryBuildPatterns?: string[];

  /**
   * Allow clean patterns outside of process.cwd()
   *
   * requires dry option to be explicitly set
   *
   * default: false
   */
  dangerouslyAllowCleanPatternsOutsideProject?: boolean;
}

class CleanWebpackPlugin {
  private readonly dry: boolean;

  private readonly verbose: boolean;

  private readonly cleanStaleWebpackAssets: boolean;

  private readonly protectWebpackAssets: boolean;

  private readonly cleanAfterEveryBuildPatterns: string[];

  private readonly cleanOnceBeforeBuildPatterns: string[];

  private readonly dangerouslyAllowCleanPatternsOutsideProject: boolean;

  private currentAssets: string[];

  private initialClean: boolean;

  private outputPath: string;

  constructor(options: Options = {}) {
    if (typeof options !== 'object' || Array.isArray(options) === true) {
      throw new Error(`clean-webpack-plugin only accepts an options object. See:
            https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional`);
    }

    // @ts-ignore
    if (options.allowExternal) {
      throw new Error(
        'clean-webpack-plugin: `allowExternal` option no longer supported. Use `dangerouslyAllowCleanPatternsOutsideProject`',
      );
    }

    if (
      options.dangerouslyAllowCleanPatternsOutsideProject === true &&
      options.dry !== true &&
      options.dry !== false
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        'clean-webpack-plugin: dangerouslyAllowCleanPatternsOutsideProject requires dry: false to be explicitly set. Enabling dry mode',
      );
    }

    this.dangerouslyAllowCleanPatternsOutsideProject =
      options.dangerouslyAllowCleanPatternsOutsideProject === true || false;

    this.dry =
      options.dry === true || options.dry === false
        ? options.dry
        : this.dangerouslyAllowCleanPatternsOutsideProject === true || false;

    this.verbose = this.dry === true || options.verbose === true || false;

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

    this.cleanAfterEveryBuildPatterns = Array.isArray(
      options.cleanAfterEveryBuildPatterns,
    )
      ? options.cleanAfterEveryBuildPatterns
      : [];

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

  apply(compiler: Compiler) {
    if (!compiler.options.output || !compiler.options.output.path) {
      // eslint-disable-next-line no-console
      console.warn(
        'clean-webpack-plugin: options.output.path not defined. Plugin disabled...',
      );

      return;
    }

    this.outputPath = compiler.options.output.path;

    /**
     * webpack 4+ comes with a new plugin system.
     *
     * Check for hooks in-order to support old plugin system
     */
    const {hooks} = compiler;

    if (this.cleanOnceBeforeBuildPatterns.length !== 0) {
      if (hooks) {
        hooks.compile.tap('clean-webpack-plugin', () => {
          this.handleInitial();
        });
      } else {
        compiler.plugin('compile', () => {
          this.handleInitial();
        });
      }
    }

    if (hooks) {
      hooks.done.tap('clean-webpack-plugin', stats => {
        this.handleDone(stats);
      });
    } else {
      compiler.plugin('done', stats => {
        this.handleDone(stats);
      });
    }
  }

  /**
   * Initially remove files from output directory prior to build.
   *
   * Only happens once.
   *
   * Warning: It is recommended to initially clean your build directory outside of webpack to minimize unexpected behavior.
   */
  handleInitial() {
    if (this.initialClean) {
      return;
    }

    this.initialClean = true;

    this.removeFiles(this.cleanOnceBeforeBuildPatterns);
  }

  handleDone(stats: Stats) {
    /**
     * Do nothing if there is a webpack error
     */
    if (stats.hasErrors()) {
      if (this.verbose) {
        // eslint-disable-next-line no-console
        console.warn('clean-webpack-plugin: pausing due to webpack errors');
      }

      return;
    }

    /**
     * Fetch Webpack's output asset files
     */
    const statsAssets =
      stats.toJson(
        {
          all: false,
          assets: true,
        },
        true,
      ).assets || [];
    const assets = statsAssets.map((asset: {name: string}) => {
      return asset.name;
    });

    /**
     * Get all files that were in the previous build but not the current
     *
     * (relies on del's cwd: outputPath option)
     */
    const staleFiles = this.currentAssets.filter(previousAsset => {
      const assetCurrent = assets.includes(previousAsset) === false;

      return assetCurrent;
    });

    /**
     * Save assets for next compilation
     */
    this.currentAssets = assets.sort();

    const removePatterns: string[] = [];

    /**
     * Remove unused webpack assets
     */
    if (this.cleanStaleWebpackAssets === true && staleFiles.length !== 0) {
      removePatterns.push(...staleFiles);
    }

    /**
     * Remove cleanAfterEveryBuildPatterns
     */
    if (this.cleanAfterEveryBuildPatterns.length !== 0) {
      removePatterns.push(...this.cleanAfterEveryBuildPatterns);
    }

    if (removePatterns.length !== 0) {
      this.removeFiles(removePatterns);
    }
  }

  removeFiles(patterns: string[]) {
    try {
      const deleted = delSync(patterns, {
        force: this.dangerouslyAllowCleanPatternsOutsideProject,
        // Change context to build directory
        cwd: this.outputPath,
        dryRun: this.dry,
        dot: true,
        ignore: this.protectWebpackAssets ? this.currentAssets : [],
      });

      /**
       * Log if verbose is enabled
       */
      if (this.verbose) {
        deleted.forEach(file => {
          const filename = path.relative(process.cwd(), file);

          const message = this.dry ? 'dry' : 'removed';

          /**
           * Use console.warn over .log
           * https://github.com/webpack/webpack/issues/1904
           * https://github.com/johnagan/clean-webpack-plugin/issues/11
           */
          // eslint-disable-next-line no-console
          console.warn(`clean-webpack-plugin: ${message} ${filename}`);
        });
      }
    } catch (error) {
      const needsForce = /Cannot delete files\/folders outside the current working directory\./.test(
        error.message,
      );

      if (needsForce) {
        const message =
          'clean-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.';

        throw new Error(message);
      }

      throw error;
    }
  }
}

export default CleanWebpackPlugin;
