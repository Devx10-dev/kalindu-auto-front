import { AnalyticalRange } from "@/types/analytics/dateRangeTypes";
import { DateRange } from "react-day-picker";

function getAnalyticalRange({
  range,
}: {
  range?: string | DateRange;
}): AnalyticalRange {
  if (typeof range === "string") {
    switch (range) {
      case "today": {

        const today = new Date();
        const from = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        const to = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
        );

        return {
          dateRange: {
            from: from,
            to: undefined,
          },
          rates: ["daily"],
          defaultRate: "daily",
        };
      }
      case "week": {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day == 0 ? -6 : 1);
        const firstDay = new Date(today.setDate(diff));

        return {
          dateRange: {
            from: firstDay,
            to: new Date(),
          },
          rates: ["daily"],
          defaultRate: "daily",
        };
      }
      case "month": {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        firstDay.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);

        return {
          dateRange: {
            from: firstDay,
            to: today,
          },
          rates: ["daily", "weekly"],
          defaultRate: "daily",
        };
      }
      case "year": {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), 0, 1);

        firstDay.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);

        return {
          dateRange: {
            from: firstDay,
            to: new Date(),
          },
          rates: ["weekly", "monthly", "yearly"],
          defaultRate: "monthly",
        };
      }
      default:
        throw new Error("Invalid range string");
    }
  } else if (range && "from" in range && "to" in range) {
    const from = range.from as Date;
    const to = range.to as Date;
    const diff = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) {
      return {
        dateRange: range,
        rates: ["hourly", "daily"],
        defaultRate: "hourly",
      };
    } else if (diffDays <= 21) {
      return {
        dateRange: range,
        rates: ["daily", "weekly"],
        defaultRate: "daily",
      };
    } else if (diffDays <= 60) {
      return {
        dateRange: range,
        rates: ["weekly", "monthly"],
        defaultRate: "weekly",
      };
    } else {
      return {
        dateRange: range,
        rates: ["weekly", "monthly", "yearly"],
        defaultRate: "monthly",
      };
    }
  } else {
    throw new Error("Invalid range object");
  }
}

export { getAnalyticalRange };
