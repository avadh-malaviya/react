import React from "react";

function SimpleTextarea({
  children = "",
  placeholder = "",
  className = "",
  placeText = "",
  defaultValue = "",
  disable = false,
  onChange = () => {},
  ...rest
}) {
  return (
    <form>
      <fieldset>
        <legend className="label">{placeholder}</legend>
        {/* {placeholder && <label className="label">{placeholder}</label>} */}
        {/* <div className={`simple-textarea ${className}`}> */}
        <textarea
          className="from-input"
          onChange={onChange}
          placeholder={placeText}
          {...rest}
          disabled={disable}
          defaultValue={defaultValue}
        >
          {/* {children} */}
        </textarea>
        {/* </div> */}
      </fieldset>
    </form>
  );
}
export default SimpleTextarea;
