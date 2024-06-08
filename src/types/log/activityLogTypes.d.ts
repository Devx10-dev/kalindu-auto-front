export interface ActivityLog {
  id: number;
  doneBy: string;
  feature: string;
  doneAt: LocalDateTime;
  dbaction: string;
  description: string;
}

export type ActivityLogsResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  activityLogs: ActivityLog[];
};
