import { User as UserType } from "@/types/user/userTypes";
import { User } from "@/validation/schema/userSchema";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";

const USER_ROLES_URL = "/user/roles";
const USER_PROFILE_URL = "/user/profile";
const USER_URL = "/user";
const USER_ACTIVE_OR_INACTIVE_URL = "/user/active";

class UserService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchUserRoles(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>(`${USER_ROLES_URL}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user roles");
    }
  }

  async fetchUsers(): Promise<UserType[]> {
    try {
      const response = await this.api.get<UserType[]>(`${USER_URL}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async createUser(user: User): Promise<User> {
    const response = await this.api.post(USER_URL, user);
    return response.data;
  }

  async updateUser(user: User): Promise<User> {
    const response = await this.api.put(USER_URL, user);
    return response.data;
  }

  async activeOrInactiveUser(user: UserType): Promise<User> {
    console.log(user);
    const response = await this.api.put(USER_ACTIVE_OR_INACTIVE_URL, {
      ...user,
      active: !user.active,
    });
    return response.data;
  }

  async fetchUserProfileDetails(username: string): Promise<UserType> {
    try {
      if (username === undefined) return;
      const response = await this.api.get<UserType>(
        `${USER_PROFILE_URL}/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user roles");
    }
  }
}

export { UserService };
