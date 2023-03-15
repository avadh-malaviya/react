import React from "react";

function SubHeader({
  title,
  actions = "",
  search = "",
  background = "",
  titleWidth = 4,
}) {
  return (
    <>
      <div className="content-header" style={{ background: background }}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className={`col-sm-${titleWidth}`}>
              <span className="m-0 lato-title">{title}</span>
            </div>
            <div className="col-sm-6 row align-items-center justify-content-end">
              {actions}
            </div>
            <div className="col-sm-2">{search}</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SubHeader;
