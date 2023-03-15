import React from "react";

function ButtonCheckBox({
  value,
  label,
  selected,
  onClick = () => {},
  containerType = "default",
  className = "col-lg-5",
  style = {},
  ...rest
}) {
  return (
    <>
      <label
        className={`${
          containerType ? containerType : ""
        }-checkbox button-checkmark-container button-color ${
          selected === value ? `bg-color` : ``
        } ${className}`}
        htmlFor={`checkbox-` + value}
        style={style}
        onClick={onClick}
      >
        {label}
        <input
          type="radio"
          id={`checkbox-` + value}
          checked={selected === value}
          className={`${selected === value ? `checked` : ``}`}
          {...rest}
        />
        <span className="checkmark"></span>
      </label>
    </>
  );
}
export default ButtonCheckBox;
