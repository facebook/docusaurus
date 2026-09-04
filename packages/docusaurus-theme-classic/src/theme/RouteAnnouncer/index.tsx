import React from "react";
import {useLocation} from "@docusaurus/router";
import styles from './styles.module.css';

const RouteAnnouncer = React.memo(() => {
  const { pathname } = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = React.useState("");
  const previouslyLoadedPath = React.useRef(pathname);

  React.useEffect(() => {
    if (previouslyLoadedPath.current === pathname) return;
    previouslyLoadedPath.current = pathname;

    if (document.title) {
      setRouteAnnouncement(document.title);
    } else {
      const pageHeader = document.querySelector("h1");
      const content = pageHeader?.innerText ?? pageHeader?.textContent;

      setRouteAnnouncement(content || pathname);
    }
  }, [pathname]);

  return (
    <p
      aria-live="assertive"
      id="__docusaurus-route-announcer__"
      role="alert"
      style={styles.docusaurusjsRouteAnnouncerStyles}
    >
      {routeAnnouncement}
    </p>
  );
});

export default RouteAnnouncer;
