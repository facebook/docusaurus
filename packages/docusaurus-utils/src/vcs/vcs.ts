/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {VcsHardcoded} from './vcsHardcoded';
import {VcsGitAdHoc} from './vcsGitAdHoc';
import {VscGitEager} from './vcsGitEager';
import type {VcsConfig, VcsPreset} from '@docusaurus/types';

const VcsPresets: Record<VcsPreset, VcsConfig> = {
  'git-ad-hoc': VcsGitAdHoc,
  'git-eager': VscGitEager,
  hardcoded: VcsHardcoded,
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

export function getDefaultVcsPreset(): VcsPreset {
  // Escape hatch to override the default VCS preset we use
  if (process.env.DOCUSAURUS_VCS) {
    return process.env.DOCUSAURUS_VCS as VcsPreset;
  }

  if (process.env.NODE_ENV === 'production') {
    // TODO add feature flag switch for git-eager / git-ad-hoc strategies
    // return getVcsPreset('git-ad-hoc');
    return 'git-eager';
  }
  // Return hardcoded values in dev to improve DX
  if (process.env.NODE_ENV === 'development') {
    return 'hardcoded';
  }

  // Return hardcoded values in test to make tests simpler and faster
  if (process.env.NODE_ENV === 'test') {
    return 'hardcoded';
  }

  return 'git-eager';
}

export function getDefaultVcsConfig(): VcsConfig {
  // Escape hatch to override the default VCS preset we use
  if (process.env.DOCUSAURUS_VCS) {
    return getVcsPreset(process.env.DOCUSAURUS_VCS as VcsPreset);
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
