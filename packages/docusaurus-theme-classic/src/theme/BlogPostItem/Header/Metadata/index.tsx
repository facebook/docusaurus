/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {usePluralForm} from '@docusaurus/theme-common';
import {useBlogPost} from '@docusaurus/theme-common/internal';

import styles from './styles.module.css';

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const {selectMessage} = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        {readingTime},
      ),
    );
  };
}

function ReadingTime({readingTime}: {readingTime: number}) {
  const readingTimePlural = useReadingTimePlural();
  return <>{readingTimePlural(readingTime)}</>;
}

export default function BlogPostItemHeaderMetadata(): JSX.Element {
  const {metadata} = useBlogPost();
  const {date, formattedDate, readingTime} = metadata;

  return (
    <div className={clsx(styles.metadata, 'margin-vert--md')}>
      <time dateTime={date} itemProp="datePublished">
        {formattedDate}
      </time>

      {typeof readingTime !== 'undefined' && (
        <>
          {' · '}
          <ReadingTime readingTime={readingTime} />
        </>
      )}
    </div>
  );
}
