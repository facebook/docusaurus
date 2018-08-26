import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import docsData from '@generated/docsData'; // eslint-disable-line
import pagesData from '@generated/pagesData'; // eslint-disable-line
import siteConfig from '@site/siteConfig'; //eslint-disable-line

export default () => renderRoutes(routes, {docsData, pagesData, siteConfig});
