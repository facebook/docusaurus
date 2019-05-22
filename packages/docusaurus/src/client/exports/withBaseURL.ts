/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-ignore
import siteConfig from '@generated/docusaurus.config';

function withBaseURL(path: string): string {
  return (
    (siteConfig.baseUrl || '/').replace(/\/$/, '') +
    '/' +
    path.replace(/^\//, '')
  );
}

export default withBaseURL;
