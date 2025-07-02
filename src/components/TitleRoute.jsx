import { useEffect } from "react";
import { useLocation } from "react-router";

const TitleRoute = ({ title, children }) => {
  const location = useLocation();
  useEffect(() => {
    document.title = title ? `${title} | SharedSpoon` : "SharedSpoon";
  }, [title, location.pathname]);
  return children;
};

export default TitleRoute;