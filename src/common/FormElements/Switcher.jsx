import React from "react";

function Switcher({ placeholder = "", className, ...rest }) {
  return (
    <div className={`swicher ${className}`}>
      {placeholder && (
        <label className="placeholder-label">{placeholder}</label>
      )}
      <label className="switch">
        <input type="checkbox" {...rest} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
export default Switcher;
