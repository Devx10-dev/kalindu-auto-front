import { AuthContextPropsType } from "@/types/context/contextTypes";
import type { FC, PropsWithChildren } from "react";
import { createContext, useState } from "react";

// create context
const AuthContext = createContext<AuthContextPropsType>({});

/**
 * This AuthContext is used for store the access token
 * All routes are wrapped by this component,
 * so at any where we can use these data to get access token data and set the access token as well
 *
 * You can use this in any file by using useAuth hook as below
 * ts
 * const {accessToken, setAccessToken} = useAuth()
 *
 */

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [roles, setRoles] = useState<string[] | undefined>([]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, roles, setRoles }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
