import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ClockWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    return `${formattedHours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className=" h-full bg-white border border-gray-200 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center h-full py-1 gap-0">
        <div className="text-2xl font-bold text-black">
          {formatTime(currentTime)}
          <span className="text-sm ml-1 font-normal text-gray-600">
            {currentTime.getHours() >= 12 ? "PM" : "AM"}
          </span>
        </div>
        <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
      </CardContent>
    </Card>
  );
}
