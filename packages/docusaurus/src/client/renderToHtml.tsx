/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
// @ts-expect-error: see https://github.com/facebook/react/issues/31134
import {renderToReadableStream as renderToReadableStreamImpl} from 'react-dom/server.browser';
import {
  renderToString,
  type renderToReadableStream as renderToReadableStreamType,
} from 'react-dom/server';
import {text} from 'stream/consumers';

const renderToReadableStream: typeof renderToReadableStreamType =
  renderToReadableStreamImpl;

export async function renderToHtml(app: ReactNode): Promise<string> {
  return new Promise((resolve, reject) => {
    renderToReadableStream(app, {
      onError: (error) => reject(error),
    }).then(async (stream) => {
      await stream.allReady;
      // @ts-expect-error: it works fine
      const html = await text(stream);

      if (html !== renderToString(app)) {
        throw new Error('Bad');
      }

      resolve(html);
    }, reject);
  });
}
