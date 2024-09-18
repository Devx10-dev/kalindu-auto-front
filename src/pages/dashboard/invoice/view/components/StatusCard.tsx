import { Card } from "@/components/ui/card";

function StatusCard({
  icon,
  status,
  statusColor,
  statusText,
  type,
  className,
}: {
  icon: React.ReactNode;
  status: string;
  statusColor: string;
  statusText: string;
  type: string;
  className?: string;
}) {
  return (
    <>
      <Card className={`p-4 shadow-sm bg-green-50 ${className}`}>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-md font-semibold leading-none tracking-tight">
              {status}
            </h3>
            <p className="text-sm font-regular text-gray-500">{statusText}</p>
          </div>
        </div>
      </Card>
    </>
  );
}

export default StatusCard;
