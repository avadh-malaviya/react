import React from "react";

function FileUpload({
  keyName = "key",
  style = { color: "#21BFAE", fontWeight: "bold", fontSize: "12px" },
  className = "",
  title = "add file",
  onChange = () => {},
  disable = false,
  ...rest
}) {
  return (
    <>
      <label htmlFor={keyName} style={style} className={className}>
        {title}
      </label>
      <input
        type="file"
        id={keyName}
        name={keyName}
        className="d-none"
        onChange={onChange}
        disabled={disable}
        {...rest}
      />
    </>
  );
}

export default FileUpload;
