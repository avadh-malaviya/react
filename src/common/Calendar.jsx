import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";

function Calendar({
  children,
  startDate,
  endDate,
  start = () => {},
  end = () => {},
  flag = () => {},
}) {
  const settings = {
    startDate: startDate,
    endDate: endDate,
    applyButtonClasses: "apply-btn",
    linkedCalendars: false,
    opens: "center",
    alwaysShowCalendars: true,
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Last 7 Days": [moment().subtract(6, "days"), moment()],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "Last Month": [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
    locale: {
      format: "DD/MM/YYYY",
    },
  };

  const dateSetter = (event, date) => {
    start(date.startDate);
    end(date.endDate);
    flag(event.timeStamp);
  };

  return (
    <DateRangePicker onApply={dateSetter} initialSettings={settings}>
      {children}
    </DateRangePicker>
  );
}

export default Calendar;
