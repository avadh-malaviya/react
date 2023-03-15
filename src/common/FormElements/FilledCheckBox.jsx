import React from "react";

function FilledCheckBox({
  value,
  label,
  name = "",
  containerType = "greyone",
  className = "w-100",
  checked = false,
  style = {},
  type = "checkbox",
  onChange = () => {},
  ...rest
}) {
  return (
    <>
      <label
        className={`${
          containerType ? containerType : ""
        }-checkbox button-checkmark-container ${className}`}
        htmlFor={`checkbox-` + label + value}
        style={style}
      >
        <input
          type={type}
          name={name}
          id={`checkbox-` + label + value}
          value={value}
          checked={checked}
          className={checked ? `checked` : ""}
          onChange={onChange}
          {...rest}
        />
        <span className="checkmark"></span>
        <span className="check-label">{label}</span>
      </label>
    </>
  );
}

export default FilledCheckBox;
