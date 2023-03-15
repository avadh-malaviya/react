import moment from "moment";

const dateTime = (dateTime) => {
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (dateTime) var date = new Date(dateTime);
  else var date = new Date();
  let dd = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
  let m =
    date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();

  const time = moment(date).format("hh:mm A");
  // const time = date.toLocaleTimeString("en-US", {
  //   timeZone: "UTC",
  //   hour12: true,
  //   hour: "numeric",
  //   minute: "numeric",
  // });
  let hour = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let sec = addZero(date.getSeconds());
  let ms = date.getMilliseconds();

  return {
    date: dd,
    month: mm,
    year: yyyy,
    time: time,
    dateMonth: dd + "-" + mm,
    dateMonthYear: dd + "-" + mm + " " + yyyy,
    dateMonthYearTime: dd + "-" + mm + " " + yyyy + " | " + time,
    dateTime: dd + "-" + mm + " " + time,
    yyyy_mm_dd: yyyy + "-" + m + "-" + dd,
    yyyy_mm_dd_tt:
      yyyy + "-" + m + "-" + dd + " " + hour + ":" + min + ":" + sec,
    ddMonthYyTime:
      dd + " " + mm + ", " + yyyy + " " + hour + ":" + min + ":" + sec,
    timestamp: `${yyyy}-${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${ms}`,
  };
};

export default dateTime;
