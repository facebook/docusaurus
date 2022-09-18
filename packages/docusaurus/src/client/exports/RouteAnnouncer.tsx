import React from "react";
import {useLocation} from "@docusaurus/router";

const docusaurusjsRouteAnnouncerStyles: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal",
};

export const RouteAnnouncer = React.memo(() => {
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
  }, [asPath]);

  return (
    <p
      aria-live="assertive"
      id="__docusaurus-route-announcer__"
      role="alert"
      style={docusaurusjsRouteAnnouncerStyles}
    >
      {routeAnnouncement}
    </p>
  );
});

export default RouteAnnouncer;
