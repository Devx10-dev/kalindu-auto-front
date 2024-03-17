import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { refreshToken } from "../components/auth/Keycloak";
import axiosPrivate from "../service/apiService";
import useAuth from "./useAuth";

const ERROR_500_PAGE = "error/500";

const useAxiosPrivate = () => {
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // catch request and set the authorization header to request
    const requestIntercept = axiosPrivate.interceptors.request.use(
      // catch the request (without any issue)
      (request) => {
        // set the authorization header

        if (!request.headers["Authorization"]) {
          request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return request;
      },
      //   pass the error to next block
      (error) => Promise.reject(error),
    );

    // catch and handle every response
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // in this scenario, there is no issue with the response, so keep it as it is
      (response) => {
        return response;
      },

      // in this scenario, there is an issue with the response, so has to be to handle it if it is occur due to expire the access token
      async (error) => {
        // get the previous request
        const prevRequest = error?.config;

        // check the issue with token (in our case, if token expire or token is invalid, then got 401)
        if (error?.response?.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;

          // set new access token to previous request header
          // try to update token via keycloak

          let newAccessToken: string | undefined;
          try {
            newAccessToken = await refreshToken();
            if (setAccessToken) setAccessToken(newAccessToken);
          } catch (error) {
            navigate(ERROR_500_PAGE, {
              state: { message: "Authentication system is down" },
            });
          }

          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // send the previous request again after set correct credentials
          return axiosPrivate.request(prevRequest);
        } else if (error?.response?.status === 403) {
          navigate("/error/error403");
        }

        return Promise.reject(error);
      },
    );

    // remove previously caught up response and request
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;