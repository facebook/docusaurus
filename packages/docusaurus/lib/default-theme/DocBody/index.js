/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext, useEffect} from 'react';

import DocsPaginator from '@theme/DocsPaginator'; // eslint-disable-line
import DocusaurusContext from '@docusaurus/context';
import Head from '@docusaurus/Head';

import './styles.css';
import styles from './styles.module.css';

const Headings = ({headings, isChild}) => {
  if (!headings.length) return null;
  return (
    <ul className={isChild ? 'contents' : 'contents contents__left-border'}>
      {headings.map(heading => (
        <li key={heading.id}>
          <a href={`#${heading.id}`} className="contents__link">
            {heading.value}
          </a>
          <Headings isChild headings={heading.children} />
        </li>
      ))}
    </ul>
  );
};

function DocBody(props) {
  const {metadata, content} = props;
  const {language, version} = metadata;
  const context = useContext(DocusaurusContext);
  useEffect(() => {
    context.setContext({metadata});
  }, []);

  const DocContents = content;
  return (
    <div className={styles.docBody}>
      <Head>
        {metadata && metadata.title && <title>{metadata.title}</title>}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
        {version && <meta name="docsearch:version" content={version} />}
      </Head>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8">
            <header>
              <h1 className="margin-bottom--lg">{metadata.title}</h1>
            </header>
            <article>
              <div className="markdown">
                <DocContents />
              </div>
            </article>
            <div className="margin-vert--lg">
              <DocsPaginator />
            </div>
          </div>
          <div className="col col--3 col--offset-1">
            {content.rightToc && <Headings headings={content.rightToc} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocBody;
