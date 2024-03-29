/**
 * Defines the properties for the authentication context.
 */
export interface AuthContextPropsType {
  accessToken?: string;
  setAccessToken?: React.Dispatch<React.SetStateAction<string | undefined>>;
  roles?: string[];
  setRoles?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}
