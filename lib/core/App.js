import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import docsMetadata from '@generated/docsMetadata'; // eslint-disable-line
import pagesMetadata from '@generated/pagesMetadata'; // eslint-disable-line
import siteConfig from '@generated/siteConfig'; //eslint-disable-line

export default () =>
  renderRoutes(routes, {docsMetadata, pagesMetadata, siteConfig});
