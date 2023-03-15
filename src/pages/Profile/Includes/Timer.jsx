import React, { useEffect, useState } from "react";
// import "./../../../css/profile.scss";
import moment from "moment";

export default function Timer(props) {
  let createdTime = moment(props.info.created_time, "YYYY-MM-DD hh:mm:ss");
  let currentTime = moment(props.info.cur_time, "YYYY-MM-DD hh:mm:ss");
  let endTime = moment(props.info.end_date_time, "YYYY-MM-DD hh:mm:ss");
  let startTime = moment(props.info.start_date_time, "YYYY-MM-DD hh:mm:ss");
  let evtStartTime = moment(props.info.evt_start_time, "YYYY-MM-DD hh:mm:ss");
  let evtEndTime = moment(props.info.evt_end_time, "YYYY-MM-DD hh:mm:ss"); // for status Escalated

  if (props.status == "Escalated") {
    var timeDiff = evtEndTime.diff(currentTime, "seconds");
    var secDiff = timeDiff;
  } else {
    var timeDiff = currentTime.diff(createdTime, "seconds");
    var secDiff = props.sec - timeDiff;
  }

  const [count, setCount] = useState(secDiff); // seconds
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [reset, setReset] = useState(false);

  function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    return {
      h: hours,
      m: minutes < 10 ? `0${minutes}` : minutes,
      s: seconds < 10 ? `0${seconds}` : seconds,
    };
  }
  useEffect(() => {
    switch (props.status) {
      case "Escalated":
      case "Open":
        if (count >= 0) {
          const secondsLeft = setInterval(() => {
            setCount((c) => c - 1);
            let timeLeftVar = secondsToTime(count);
            setHour(timeLeftVar.h);
            setMinute(timeLeftVar.m);
            setSecond(timeLeftVar.s);
          }, 1000);
          return () => clearInterval(secondsLeft);
        } else {
          setHour(0);
          setMinute("00");
          setSecond("00");
        }
        break;

      case "Timeout":
        setCount(0);
        let timeLeftVar = secondsToTime(count);
        setHour(timeLeftVar.h);
        setMinute(timeLeftVar.m);
        setSecond(timeLeftVar.s);
        break;

      case "Feedback":
      case "Canceled":
        let hoursDiff = endTime.diff(createdTime, "hours");
        setHour(hoursDiff);

        let minutesDiff = endTime.diff(createdTime, "minutes");
        setMinute(moment().minute(minutesDiff).format("mm"));

        let secondsDiff = endTime.diff(createdTime, "seconds");
        setSecond(moment().second(secondsDiff).format("ss"));
        break;

      case "Hold":
      case "Escalated Hold":
        if (reset) {
          const secondsLeft = setInterval(() => {
            setCount((c) => c + 1);
            let timeLeftVar = secondsToTime(count);
            setHour(timeLeftVar.h);
            setMinute(timeLeftVar.m);
            setSecond(timeLeftVar.s);
          }, 1000);
          return () => clearInterval(secondsLeft);
        } else {
          setReset(true);
          let secondsDiff = currentTime.diff(evtStartTime, "seconds");
          setCount(secondsDiff);
        }
        break;

      case "Complete":
        let completeSec = endTime.diff(createdTime, "seconds");
        setCount(completeSec);
        let completeFun = secondsToTime(count);
        setHour(completeFun.h);
        setMinute(completeFun.m);
        setSecond(completeFun.s);
        break;

      case "Closed":
        let closeSec = endTime.diff(startTime, "seconds");
        setCount(closeSec);
        let closeFun = secondsToTime(count);
        setHour(closeFun.h);
        setMinute(closeFun.m);
        setSecond(closeFun.s);
        break;

      // case "Escalated":
      // let completeSec = endTime.diff(createdTime, "seconds");
      // setCount(completeSec);
      // let completeFun = secondsToTime(count);
      // setHour(completeFun.h);
      // setMinute(completeFun.m);
      // setSecond(completeFun.s);
      // break;

      default:
        break;
    }
  }, [count]);

  return (
    <div className={hour == 0 && minute == 0 && second == 0 ? "red-color" : ""}>
      {hour < 10 ? "0" + hour : hour} : {minute} : {second}
    </div>
  );
}
