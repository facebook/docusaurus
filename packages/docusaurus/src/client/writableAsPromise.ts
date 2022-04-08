/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// inspired by https://raw.githubusercontent.com/gatsbyjs/gatsby/master/packages/gatsby/cache-dir/server-utils/writable-as-promise.js

/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {Writable} from 'stream';

export class WritableAsPromise extends Writable {
  private _output: string;
  private _deferred: {
    promise: Promise<string> | null;
    resolve: (value: string) => void;
    reject: (reason: Error) => void;
  };

  constructor() {
    super();

    this._output = ``;
    this._deferred = {
      promise: null,
      resolve: () => null,
      reject: () => null,
    };
    this._deferred.promise = new Promise((resolve, reject) => {
      this._deferred.resolve = resolve;
      this._deferred.reject = reject;
    });
  }

  override _write(
    chunk: {toString: () => string},
    _enc: unknown,
    cb: () => void,
  ) {
    this._output += chunk.toString();

    return cb();
  }

  override end() {
    this._deferred.resolve(this._output);

    return this.destroy();
  }

  // disguise us as a promise
  then(
    resolve:
      | ((value: string) => string | PromiseLike<string>)
      | null
      | undefined,
    reject: ((reason: unknown) => PromiseLike<never>) | null | undefined,
  ) {
    return (this._deferred.promise as Promise<string>).then(resolve, reject);
  }
}
