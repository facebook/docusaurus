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
import type {FrontMatterTag} from '@docusaurus/utils';
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

export const tagSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
  }),
);

export function validateTags(tags: unknown): Joi.ValidationResult {
  return tagSchema.validate(tags);
}

export function createTagSchema(tags: string[]): Joi.Schema {
  return Joi.array().items(Joi.string().valid(...tags));
}

export function validateFrontMatterTags({
  frontMatterTags,
  validTagsSchema,
  source,
  onBrokenTags,
}: {
  frontMatterTags: FrontMatterTag[] | undefined;
  validTagsSchema: Joi.Schema<string[]>;
  source: string;
  onBrokenTags: MetadataOptions['onBrokenTags'];
}): void {
  if (frontMatterTags === undefined || !Array.isArray(frontMatterTags)) {
    return;
  }

  const labels = frontMatterTags.map((tag) =>
    typeof tag === 'string' ? tag : tag.permalink,
  );

  const tagList = validTagsSchema.validate(labels);

  if (tagList.error) {
    logger.report(onBrokenTags)(
      `Broken tags found in ${source} [${labels}] : ${tagList.error.message}`,
    );
  }
}
