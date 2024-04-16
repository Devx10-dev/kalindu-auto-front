import type { KeycloakConfig } from "keycloak-js";
import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import Layout from "../layout/Layout";
import Loading from "../Loading";

const ERROR_500_PAGE = "/error/500";

const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

// variable to hold the keycloak instance
let keycloak: Keycloak | null = null;

/**
 * Function to initialize the Keycloak instance with provided configuration.
 * @returns Initialized Keycloak instance.
 */
function initializeKeycloak() {
  const initOptions: KeycloakConfig = {
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
  };

  return new Keycloak(initOptions);
}

/**
 * Component responsible for loading and initializing Keycloak.
 * @returns JSX.Element representing the authentication status.
 */
function LoadKeycloak() {
  const navigate = useNavigate();
  const { setAccessToken, setRoles } = useAuth();

  const [isKeycloakUp, setIsKeycloakUp] = useState<boolean | null>(null);

  // first check if keycloak is running or not
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(
          `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`
        );
        if (response.ok) {
          setIsKeycloakUp(true);
        } else {
          setIsKeycloakUp(false);
        }
      } catch (error) {
        setIsKeycloakUp(false);
      }
    };

    checkServerStatus();
    return () => {
      if (keycloak) {
        // when logout, redirect to exact same location
        keycloak.logout({ redirectUri: window.location.href });
      }
    };
  }, []);

  // if keycloak is running then we need to initialize the keycloak instance
  useEffect(() => {
    if (isKeycloakUp && !keycloak) {
      const initializedKeycloak = initializeKeycloak();
      initializedKeycloak
        .init({
          onLoad: "login-required",
          checkLoginIframe: false,
          redirectUri: window.location.href,
        })
        .then((auth) => {
          if (!auth) {
            window.location.reload();
          }
          keycloak = initializedKeycloak;

          if (setAccessToken) setAccessToken(keycloak.token);
          if (setRoles) setRoles(keycloak.realmAccess?.roles);
          // isSuccess = true;
        })
        .catch(() => {
          navigate(ERROR_500_PAGE);
        });
    }
  }, [isKeycloakUp]);

  if (isKeycloakUp && keycloak && keycloak.authenticated) {
    return <Layout />;
  } else if (isKeycloakUp === false) {
    return <div>Keycloak server is down</div>;
  } else {
    return <Loading />;
  }
}

/**
 * This is for refresh the access token via keycloak
 * @returns new access token
 */
// eslint-disable-next-line react-refresh/only-export-components
export const refreshToken = async () => {
  // This will refresh the token if it has already expired or will expire in the next five seconds
  // This function call only when access token expired, so argument never will matter
  await keycloak?.updateToken(5);
  return keycloak?.token;
};

export default LoadKeycloak;
