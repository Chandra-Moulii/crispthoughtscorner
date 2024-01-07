import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

import Spinner from "../stateless/Spinner";
import useDarkMode from "../../customHooks/useDarkmode";

export default function Protect(props: protectPropsType) {
  const { el } = props;
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  useDarkMode();

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");

    if (!isAuthenticated) {
      localStorage.setItem("prevPath", location.pathname);
      navigate("/");
    } else if (prevPath && isAuthenticated) {
      localStorage.removeItem("prevPath");
      navigate(prevPath);
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (isLoading) return <Spinner info="Just a second" />;

  return <>{isAuthenticated ? el : null}</>;
}

type protectPropsType = {
  el: React.ReactElement;
};
