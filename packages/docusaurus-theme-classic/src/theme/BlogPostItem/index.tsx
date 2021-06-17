/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {MDXProvider} from '@mdx-js/react';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import {usePluralForm} from '@docusaurus/theme-common';
import MDXComponents from '@theme/MDXComponents';
import Seo from '@theme/Seo';
import EditThisPage from '@theme/EditThisPage';
import type {Props} from '@theme/BlogPostItem';

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

function BlogPostItem(props: Props): JSX.Element {
  const readingTimePlural = useReadingTimePlural();
  const {
    children,
    frontMatter,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;
  const {
    date,
    formattedDate,
    permalink,
    tags,
    readingTime,
    title,
    editUrl,
  } = metadata;
  const {author, image, keywords} = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';

    return (
      <header>
        <TitleHeading className={styles.blogPostTitle}>
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        <div className={clsx(styles.blogPostData, 'margin-vert--md')}>
          <time dateTime={date}>{formattedDate}</time>

          {readingTime && (
            <>
              {' · '}
              {readingTimePlural(readingTime)}
            </>
          )}
        </div>
        <div className="avatar margin-vert--md">
          {authorImageURL && (
            <Link className="avatar__photo-link avatar__photo" href={authorURL}>
              <img src={authorImageURL} alt={author} />
            </Link>
          )}
          <div className="avatar__intro">
            {author && (
              <>
                <div className="avatar__name">
                  <Link href={authorURL}>{author}</Link>
                </div>
                <small className="avatar__subtitle">{authorTitle}</small>
              </>
            )}
          </div>
        </div>
      </header>
    );
  };

  return (
    <>
      <Seo {...{keywords, image}} />

      <article className={!isBlogPostPage ? 'margin-bottom--xl' : undefined}>
        {renderPostHeader()}
        <div className="markdown">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>
        {(tags.length > 0 || truncated) && (
          <footer
            className={clsx('row docusaurus-mt-lg', {
              [styles.blogPostDetailsFull]: isBlogPostPage,
            })}>
            {tags.length > 0 && (
              <div className="col">
                <b>
                  <Translate
                    id="theme.tags.tagsListLabel"
                    description="The label alongside a tag list">
                    Tags:
                  </Translate>
                </b>
                {tags.map(({label, permalink: tagPermalink}) => (
                  <Link
                    key={tagPermalink}
                    className="margin-horiz--sm"
                    to={tagPermalink}>
                    {label}
                  </Link>
                ))}
              </div>
            )}

            {isBlogPostPage && editUrl && (
              <div className="col margin-top--sm">
                <EditThisPage editUrl={editUrl} />
              </div>
            )}

            {!isBlogPostPage && truncated && (
              <div className="col text--right">
                <Link
                  to={metadata.permalink}
                  aria-label={`Read more about ${title}`}>
                  <b>
                    <Translate
                      id="theme.blog.post.readMore"
                      description="The label used in blog post item excerpts to link to full blog posts">
                      Read More
                    </Translate>
                  </b>
                </Link>
              </div>
            )}
          </footer>
        )}
      </article>
    </>
  );
}

export default BlogPostItem;
