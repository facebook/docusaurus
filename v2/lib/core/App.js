import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import blogMetadatas from '@generated/blogMetadatas'; // eslint-disable-line
import docsMetadatas from '@generated/docsMetadatas'; // eslint-disable-line
import docsSidebars from '@generated/docsSidebars'; // eslint-disable-line
import pagesMetadatas from '@generated/pagesMetadatas'; // eslint-disable-line
import siteConfig from '@generated/siteConfig'; //eslint-disable-line

export default () =>
  renderRoutes(routes, {
    blogMetadatas,
    docsMetadatas,
    docsSidebars,
    pagesMetadatas,
    siteConfig,
  });
