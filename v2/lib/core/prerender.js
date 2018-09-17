import {matchRoutes} from 'react-router-config';

/**
 * This helps us to make sure all the async component for that particular route
 * is loaded before rendering. This is to avoid loading screens on first page load
 */
export default function prerender(routeConfig, providedLocation) {
  const matches = matchRoutes(routeConfig, providedLocation);
  return Promise.all(
    matches.map(match => {
      const {component} = match.route;
      if (component && component.preload) {
        return component.preload();
      }
      return undefined;
    }),
  );
}
