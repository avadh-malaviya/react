import React from "react";

function Dropdown({
  keyName = "",
  optStyle = {},
  options,
  className,
  selected,
  disable = false,
  validation = {},
  ...rest
}) {
  return (
    <>
      <select
        name={keyName}
        defaultValue={selected}
        className={`${className}`}
        {...validation}
        {...rest}
        disabled={disable}
      >
        {options &&
          options.length > 0 &&
          options.map((item, index) => {
            return (
              <option
                key={index}
                value={item?.value}
                // selected={selected === item?.value}
                style={optStyle}
              >
                {item?.text}
              </option>
            );
          })}
      </select>
    </>
  );
}
export default Dropdown;
