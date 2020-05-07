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
import useSidebarContext from '@theme/hooks/useSidebarContext';
import {Button} from 'reactstrap';

function DocItem(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {url: siteUrl, title: siteTitle} = siteConfig;
  const {content: DocContent} = props;
  const {metadata} = DocContent;
  const {description, title, permalink} = metadata;
  const {
    frontMatter: {image: metaImage, keywords},
  } = DocContent;

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }
  const {handleSidebarToggle} = useSidebarContext();

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
        <Button color="info" onClick={handleSidebarToggle} className="mr-2">
          <svg
            aria-label="Menu"
            xmlns="http://www.w3.org/2000/svg"
            height={24}
            width={24}
            viewBox="0 0 32 32"
            role="img"
            focusable="false">
            <title>Menu</title>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="2"
              d="M4 7h22M4 15h22M4 23h22"
            />
          </svg>
        </Button>
        <DocContent />
        <DocPaginator metadata={metadata} />
      </main>
    </>
  );
}

export default DocItem;
