/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {type TagsMap, getDataFileData} from '@docusaurus/utils';
import {Joi} from '@docusaurus/utils-validation';
import {BlogContentPaths} from './types';

const TagsMapSchema = Joi.object<TagsMap>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    permalink: Joi.string(),
  })
    .unknown()
    .required(),
);

export function validateTagsMap(content: unknown): TagsMap {
  return Joi.attempt(content, TagsMapSchema);
}

export async function getTagsMap(params: {
  tagsMapPath: string;
  contentPaths: BlogContentPaths;
}): Promise<TagsMap | undefined> {
  return getDataFileData(
    {
      filePath: params.tagsMapPath,
      contentPaths: params.contentPaths,
      fileType: 'tags map',
    },
    validateTagsMap,
  );
}
