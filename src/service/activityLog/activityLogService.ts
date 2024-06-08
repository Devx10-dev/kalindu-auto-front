import { ActivityLogsResponseData } from "@/types/log/activityLogTypes";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";

const ACTIVITY_LOG_URL = "log";

class ActivityLogService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchActivityLogs(
    pageNo: number,
    pageSize: number,
    username: string,
    feature: string,
    action: string,
    fromDate: string | null,
    toDate: string | null,
  ): Promise<ActivityLogsResponseData> {
    try {
      const url = `${ACTIVITY_LOG_URL}/${
        username === "All" ? null : username
      }/${feature === "All" ? null : feature}/${
        action === "All" ? null : action
      }/${fromDate}/${toDate}/${pageNo}/${pageSize}`;
      console.log(url);

      const response = await this.api.get<ActivityLogsResponseData>(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch activity logs");
    }
  }

  async fetchUserIds(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>(
        `${ACTIVITY_LOG_URL}/user-ids`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user IDs");
    }
  }

  async fetchFeatures(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>(
        `${ACTIVITY_LOG_URL}/features`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch features");
    }
  }

  async fetchActions(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>(
        `${ACTIVITY_LOG_URL}/actions`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user actions");
    }
  }
}

export { ActivityLogService };
