import React from 'react';
import {Link} from 'react-router-dom';

import styles from './styles.css';

function Footer(props) {
  const {pagesMetadatas, docsMetadatas, location} = props;
  const docsFlatMetadatas = Object.values(docsMetadatas);
  const routeLinks = [...pagesMetadatas, ...docsFlatMetadatas].map(
    data =>
      data.permalink !== location.pathname && (
        <li key={data.permalink}>
          <Link to={data.permalink}>{data.permalink}</Link>
        </li>
      ),
  );

  return (
    <div className={styles.footer}>
      <ul className={styles.routeLinks}>{routeLinks}</ul>
    </div>
  );
}

export default Footer;
