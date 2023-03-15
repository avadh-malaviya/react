import React from "react";

function InputField({
  keyName = "",
  label = "",
  className = "",
  placeholder = "",
  style = {},
  type = "text",
  validation = {},
  ...rest
}) {
  return (
    <div className={"label-float " + className} style={style}>
      <input
        type={type}
        className="inputText w-100"
        style={{ outline: "none" }}
        name={keyName}
        placeholder={label}
        {...validation}
        {...rest}
      />
      <label className="floating-label">{label}</label>
    </div>
  );
}

export default InputField;
