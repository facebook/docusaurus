/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import Yaml from 'js-yaml';
import {tagSchema} from './options';
import type {TagsOption} from '@docusaurus/plugin-content-showcase';

// todo extract in another file
export async function getTagsList({
  configTags,
  configPath,
}: {
  configTags: string | TagsOption;
  configPath: string;
}): Promise<string[]> {
  if (typeof configTags === 'object') {
    return Object.keys(configTags);
  }

  const tagsPath = path.resolve(configPath, configTags);

  try {
    const data = await fs.readFile(tagsPath, 'utf-8');
    const unsafeData = Yaml.load(data);
    const tags = tagSchema.validate(unsafeData);

    if (tags.error) {
      throw new Error(
        `There was an error extracting tags: ${tags.error.message}`,
        {cause: tags.error},
      );
    }

    const tagLabels = Object.keys(tags.value);
    return tagLabels;
  } catch (error) {
    throw new Error(`Failed to read tags file for showcase`, {cause: error});
  }
}
