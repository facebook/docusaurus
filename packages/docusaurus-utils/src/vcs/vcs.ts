/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {VcsHardcoded} from './vcsHardcoded';
import {VcsGitAdHoc} from './vcsGitAdHoc';
import {VscGitEager} from './vcsGitEager';
import type {VcsConfig} from '@docusaurus/types';

const VcsPresets = {
  'git-ad-hoc': VcsGitAdHoc,
  'git-eager': VscGitEager,
  hardcoded: VcsHardcoded,
} as const satisfies Record<string, VcsConfig>;

type VscPresetName = keyof typeof VcsPresets;

function getVcsPreset(presetName: VscPresetName): VcsConfig {
  return VcsPresets[presetName];
}

function getDefaultVcsConfig(): VcsConfig {
  // Escape hatch to override the default VCS preset we use
  if (process.env.DOCUSAURUS_VCS) {
    const vcs = getVcsPreset(process.env.DOCUSAURUS_VCS as VscPresetName);
    if (vcs) {
      return vcs;
    } else {
      throw new Error(
        `Unknown DOCUSAURUS_VCS preset name: ${process.env.DOCUSAURUS_VCS}`,
      );
    }
  }

  if (process.env.NODE_ENV === 'production') {
    // TODO add feature flag switch for git-eager / git-ad-hoc strategies
    // return getVcsPreset('git-ad-hoc');
    return getVcsPreset('git-eager');
  }

  // Return hardcoded values in dev to improve DX
  if (process.env.NODE_ENV === 'development') {
    return getVcsPreset('hardcoded');
  }

  // Return hardcoded values in test to make tests simpler and faster
  if (process.env.NODE_ENV === 'test') {
    return getVcsPreset('hardcoded');
  }

  return VcsGitAdHoc;
}

export const DEFAULT_TEST_VCS_CONFIG: VcsConfig = VcsHardcoded;

export const DEFAULT_VCS_CONFIG: VcsConfig = getDefaultVcsConfig();
