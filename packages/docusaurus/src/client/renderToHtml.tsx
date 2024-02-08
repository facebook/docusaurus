/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import {renderToPipeableStream} from 'react-dom/server';
import {Writable} from 'stream';

export async function renderToHtml(app: ReactNode): Promise<string> {
  // Inspired from
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  // https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/cache-dir/static-entry.js
  const writableStream = new WritableAsPromise();

  const {pipe} = renderToPipeableStream(app, {
    onError(error) {
      writableStream.destroy(error as Error);
    },
    onAllReady() {
      pipe(writableStream);
    },
  });

  return writableStream.getPromise();
}

// WritableAsPromise inspired by https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/cache-dir/server-utils/writable-as-promise.js

/* eslint-disable no-underscore-dangle */
class WritableAsPromise extends Writable {
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
    next: () => void,
  ) {
    this._output += chunk.toString();
    next();
  }

  override _destroy(error: Error | null, next: (error?: Error | null) => void) {
    if (error instanceof Error) {
      this._deferred.reject(error);
    } else {
      next();
    }
  }

  override end() {
    this._deferred.resolve(this._output);
    return this.destroy();
  }

  getPromise(): Promise<string> {
    return this._deferred.promise!;
  }
}
