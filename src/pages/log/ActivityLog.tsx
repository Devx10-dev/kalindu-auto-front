import PageHeader from "@/components/card/PageHeader";
import TaskIcon from "@/components/icon/TaskIcon";
import ActivityLogGrid from "@/components/table/log/ActivityLogGrid";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { ActivityLogService } from "@/service/activityLog/activityLogService";
import { Fragment } from "react";

function ActivityLog() {
  const axiosPrivate = useAxiosPrivate();
  const activityLogService = new ActivityLogService(axiosPrivate);

  return (
    <Fragment>
      <div className="mr-2 ml-2">
        <CardHeader>
          <PageHeader
            title="Activity Logs"
            description="An activity log records user actions and system events for monitoring and security."
            icon={<TaskIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent style={{ width: "98%" }}>
          <ActivityLogGrid activityLogService={activityLogService} />
        </CardContent>
      </div>
    </Fragment>
  );
}

export default ActivityLog;
