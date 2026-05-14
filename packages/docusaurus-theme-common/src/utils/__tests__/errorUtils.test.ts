/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {reportRecoverableError} from '../errorUtils';

describe('reportRecoverableError', () => {
  const originalReportError = globalThis.reportError;

  afterEach(() => {
    globalThis.reportError = originalReportError;
    vi.restoreAllMocks();
  });

  it('forwards the error to globalThis.reportError when available', () => {
    const reportErrorMock = vi.fn();
    globalThis.reportError = reportErrorMock;
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const error = new Error('boom');
    reportRecoverableError(error);

    expect(reportErrorMock).toHaveBeenCalledTimes(1);
    expect(reportErrorMock).toHaveBeenCalledWith(error);
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  it('falls back to console.error when globalThis.reportError is missing', () => {
    // @ts-expect-error: simulating an environment without reportError
    delete globalThis.reportError;
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const error = new Error('boom');
    reportRecoverableError(error);

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenCalledWith(error);
  });
});
