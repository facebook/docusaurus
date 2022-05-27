/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {escapeShellArg} from '../shellUtils';

describe('shellUtils', () => {
  it('escapeShellArg', () => {
    expect(escapeShellArg('hello')).toBe("'hello'");
    expect(escapeShellArg('*')).toBe("'*'");
    expect(escapeShellArg('hello world')).toBe("'hello world'");
    expect(escapeShellArg("'hello'")).toBe("\\''hello'\\'");
    expect(escapeShellArg('$(pwd)')).toBe("'$(pwd)'");
    expect(escapeShellArg('hello$(pwd)')).toBe("'hello$(pwd)'");
  });
});
