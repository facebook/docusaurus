/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {TextEncoder} from 'util';

// Required for RTL renderHook SSR tests with React-18
// See also https://github.com/testing-library/react-testing-library/issues/1120#issuecomment-1516132279
global.TextEncoder = TextEncoder;
