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

export const tagDefinitionSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    permalink: Joi.string(),
  }),
);

export function validateDefinedTags(tags: unknown): Joi.ValidationResult {
  return tagDefinitionSchema.validate(tags);
}

export function validateFrontMatterTags({
  frontMatterTags,
  validTagList,
  source,
  onUnknownTags,
}: {
  frontMatterTags: FrontMatterTag[] | undefined;
  validTagList: string[];
  source: string;
  onUnknownTags: MetadataOptions['onUnknownTags'];
}): void {
  if (frontMatterTags === undefined || !Array.isArray(frontMatterTags)) {
    return;
  }

  const labels = frontMatterTags.map((tag) =>
    typeof tag === 'string' ? tag : tag.permalink,
  );

  const unknownTags = _.difference(labels, validTagList);

  if (unknownTags.length > 0) {
    const uniqueUnknownTags = [...new Set(unknownTags)];
    const tagListString = uniqueUnknownTags.join(', ');
    logger.report(onUnknownTags)(
      `Tags [${tagListString}] used in ${source} are not defined in tags.yml`,
    );
  }
}
