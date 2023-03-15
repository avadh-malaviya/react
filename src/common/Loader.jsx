import React from "react";

function Loader() {
  return (
    <div className="text-center">
      <img
        src={process.env.PUBLIC_URL + "/images/loader.gif"}
        alt="loader"
        width="30px"
      />
    </div>
  );
}

export default Loader;
