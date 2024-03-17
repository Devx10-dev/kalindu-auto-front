import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

/**
 * 
 * This is used to get the context values accessToken and setAccessToken
 * You can use this as mentioned below
 * 
 * ts
 * const {accessToken, setAccessToken} = useAuth()
 * 
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;