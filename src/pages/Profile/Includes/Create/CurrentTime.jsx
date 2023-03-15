import React, { useEffect, useState } from "react";
import dateTime from "../../../../helper/dateTime";

function CurrentTime() {
  const [curTime, setCurTime] = useState();
  const [timeloader, setTimeloader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTimeloader(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setCurTime(dateTime().ddMonthYyTime);
    }, 1000);
  }, [curTime]);

  return (
    <>
      {timeloader ? (
        // <div style={{ width: "inherit", textAlign: "center" }}>
        <img
          src={process.env.PUBLIC_URL + "/images/loader.gif"}
          alt="loader"
          width="20px"
        />
      ) : (
        // </div>
        curTime
      )}
    </>
  );
}

export default CurrentTime;
