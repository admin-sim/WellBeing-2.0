import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./style.css";
import { useMemo } from "react";

export default function Calendar(props) {
  const localizer = useMemo(() => momentLocalizer(moment), []);
  return (
    <BigCalendar
      {...props}
      localizer={localizer}
      showMultiDayTimes={true}
      style={{ height: "100%" }}
    />
  );
}
