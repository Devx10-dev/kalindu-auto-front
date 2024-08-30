import { DateRange } from "react-day-picker";

export type AnalyticalRange = {
  dateRange: DateRange;
  rates: string[];
  defaultRate: string;
};
