/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {getTagVisibility, groupTaggedItems} from '@docusaurus/utils';
import {Joi} from '@docusaurus/utils-validation';
import logger from '@docusaurus/logger';
import type {NormalizedTag, TagsFile} from '@docusaurus/utils';
import type {VersionTags} from './types';
import type {
  DocMetadata,
  MetadataOptions,
} from '@docusaurus/plugin-content-docs';

export function getVersionTags(docs: DocMetadata[]): VersionTags {
  const groups = groupTaggedItems(docs, (doc) => doc.tags);
  return _.mapValues(groups, ({tag, items: tagDocs}) => {
    const tagVisibility = getTagVisibility({
      items: tagDocs,
      isUnlisted: (item) => item.unlisted,
    });
    return {
      label: tag.label,
      docIds: tagVisibility.listedItems.map((item) => item.id),
      permalink: tag.permalink,
      unlisted: tagVisibility.unlisted,
    };
  });
}

export const tagDefinitionSchema = Joi.object<TagsFile>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    permalink: Joi.string(),
  }),
);

export function validateDefinedTags(
  tags: unknown,
): Joi.ValidationResult<TagsFile> {
  return tagDefinitionSchema.validate(tags);
}

export function validateFrontMatterTags({
  tags,
  source,
  onUnknownTags,
}: {
  tags: NormalizedTag[];
  source: string;
  onUnknownTags: MetadataOptions['onUnknownTags'];
}): void {
  const inlineTags = tags.filter((tag) => tag.inline);
  if (inlineTags.length > 0 && onUnknownTags !== 'ignore') {
    const uniqueUnknownTags = [...new Set(inlineTags)];
    const tagListString = uniqueUnknownTags.join(', ');
    logger.report(onUnknownTags)(
      `Tags [${tagListString}] used in ${source} are not defined in tags.yml`,
    );
  }
}
