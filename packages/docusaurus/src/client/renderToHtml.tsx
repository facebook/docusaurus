/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import {renderToReadableStream} from 'react-dom/server.browser';
import {text} from 'stream/consumers';

export async function renderToHtml(app: ReactNode): Promise<string> {
  const stream = await renderToReadableStream(app);
  await stream.allReady;
  return text(stream);
}
