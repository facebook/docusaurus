/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {VcsHardcoded} from './vcsHardcoded';
import {VcsGitAdHoc} from './vcsGitAdHoc';
import {VscGitEager} from './vcsGitEager';
import {VcsDisabled} from './vcsDisabled';
import {VcsDefaultV1} from './vcsDefaultV1';
import {VcsDefaultV2} from './vcsDefaultV2';
import type {VcsConfig, VcsPreset} from '@docusaurus/types';

const VcsPresets: Record<VcsPreset, VcsConfig> = {
  'git-ad-hoc': VcsGitAdHoc,
  'git-eager': VscGitEager,
  hardcoded: VcsHardcoded,
  disabled: VcsDisabled,

  'default-v1': VcsDefaultV1,
  'default-v2': VcsDefaultV2,
};

export const VcsPresetNames = Object.keys(VcsPresets) as VcsPreset[];

export function findVcsPreset(presetName: string): VcsConfig | undefined {
  return VcsPresets[presetName as VcsPreset];
}

export function getVcsPreset(presetName: VcsPreset): VcsConfig {
  const vcs = findVcsPreset(presetName);
  if (vcs) {
    return vcs;
  } else {
    throw new Error(
      `Unknown Docusaurus VCS preset name: ${process.env.DOCUSAURUS_VCS}`,
    );
  }
}

export const DEFAULT_TEST_VCS_CONFIG: VcsConfig = VcsHardcoded;
