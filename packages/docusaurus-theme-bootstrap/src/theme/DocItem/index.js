/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Head from '@docusaurus/Head';
import DocPaginator from '@theme/DocPaginator';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

function DocItem(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {url: siteUrl, title: siteTitle, titleDelimiter} = siteConfig;
  const {content: DocContent} = props;
  const {metadata} = DocContent;
  const {description, title, permalink} = metadata;
  const {
    frontMatter: {image: metaImage, keywords},
  } = DocContent;

  const metaTitle = title
    ? `${title} ${titleDelimiter} ${siteTitle}`
    : siteTitle;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta name="keywords" content={keywords.join(',')} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${title}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
      </Head>
      <main className="col col-md-8 p-0">
        <DocContent />
        <DocPaginator metadata={metadata} />
      </main>
    </>
  );
}

export default DocItem;
