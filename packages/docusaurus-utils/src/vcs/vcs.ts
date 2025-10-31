/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {VcsGitAdHoc} from './vcsGitAdHoc';
import type {VcsConfig} from '@docusaurus/types';

function getDefaultVcsConfig(): VcsConfig {
  // TODO configure this properly for dev/test envs
  //  + opt-in for new Git Eager config
  //  + escape hatch env for forcing a given known config

  if (process.env.NODE_ENV === 'production') {
    return VcsGitAdHoc;
  }
  if (process.env.NODE_ENV === 'development') {
    return VcsGitAdHoc;
  }
  if (process.env.NODE_ENV === 'test') {
    return VcsGitAdHoc;
  }
  return VcsGitAdHoc;
}

export const DEFAULT_VCS_CONFIG: VcsConfig = getDefaultVcsConfig();
