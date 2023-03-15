import React from "react";

function TableHead({
  className = "",
  title,
  path = "/images/general-icons/updown-arrow.svg",
  onClick = () => {},
  ...props
}) {
  return (
    <div>
      <span className="pr-2">{title}</span>
      <img
        src={process.env.PUBLIC_URL + path}
        className={`p-0 cursor-pointer mb-1 ${className}`}
        onClick={onClick}
        style={{ width: "10px" }}
        {...props}
      />
    </div>
  );
}

export default TableHead;
