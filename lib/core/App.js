import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import docsMetadatas from '@generated/docsMetadatas'; // eslint-disable-line
import pagesMetadatas from '@generated/pagesMetadatas'; // eslint-disable-line
import siteConfig from '@generated/siteConfig'; //eslint-disable-line

export default () =>
  renderRoutes(routes, {docsMetadatas, pagesMetadatas, siteConfig});
