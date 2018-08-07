import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import props from '@generated/docsData'; // eslint-disable-line

export default () => renderRoutes(routes, props);
