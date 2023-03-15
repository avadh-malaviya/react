import React from "react";
import { zeroPad } from "../helper/helper";
import SimpleCheckbox from "./FormElements/InputCheckbox";
import SimpleRadiobox from "./FormElements/SimpleRadiobox";
import SubHeader from "./SubHeader";

function SimpleTable({
  loader = true,
  title,
  data = [],
  actions = [],
  columns = [],
  onTrClick = () => {},
  gridTemplateColumns = null,
  keycompareactive = "",
  activetr = false,
  className = "",
  bulkbar = "",
  cardBodyPadding = "2px",
  searchbox = null,
  subHeaderActions = "",
  subHeaderTitleWidth = 4,
}) {
  return (
    <>
      {title && (
        <SubHeader
          title={title}
          actions={subHeaderActions}
          titleWidth={subHeaderTitleWidth}
        />
      )}
      <div className={`simple-table` + (className ? ` ${className}` : ``)}>
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="card">
              {actions.length !== 0 || bulkbar !== "" ? (
                <div className="card-header">
                  {actions.length !== 0 ? (
                    <div className="grid">
                      <div
                        className="grid-left"
                        style={
                          gridTemplateColumns
                            ? { gridTemplateColumns: gridTemplateColumns }
                            : {}
                        }
                      >
                        {actions && actions.map((action) => action)}
                      </div>
                      <div className="grid-right">
                        <div className="form-group">
                          <label htmlFor="mode" className="col-lg-4"></label>

                          {searchbox ? (
                            searchbox
                          ) : (
                            <div className="input-group input-group-sm searchbox-container">
                              <div className="input-group-prepend">
                                <button
                                  type="submit"
                                  className="btn btn-default"
                                >
                                  <i className="fas fa-search"></i>
                                </button>
                              </div>
                              <input
                                type="text"
                                style={{ border: "hidden" }}
                                name="table_search"
                                className="form-control float-right table_search"
                                placeholder="Search"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {bulkbar ? (
                    <div className="grid bulk-actions">
                      <div className="grid-left">
                        <h3 className="bulk-title">{bulkbar.title}</h3>
                      </div>
                      <div className="grid-right">
                        {bulkbar.actions.map((action) => action)}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              <div
                className="card-body table-responsive"
                style={{ padding: cardBodyPadding }}
              >
                <table className="table text-nowrap">
                  <thead>
                    {columns.length > 0 ? (
                      <tr>
                        {columns.map(({ label, ...column }, index) => (
                          <th key={index}>{label}</th>
                        ))}
                      </tr>
                    ) : (
                      <></>
                    )}
                  </thead>
                  <tbody>
                    {loader ? (
                      <tr>
                        <td className="text-center" colSpan={columns.length}>
                          <img
                            src={process.env.PUBLIC_URL + "/images/loader.gif"}
                            alt="loader"
                            width="30px"
                          />
                        </td>
                      </tr>
                    ) : data.length == 0 ? (
                      <tr>
                        <td className="text-center" colSpan={columns.length}>
                          No Record Found...
                        </td>
                      </tr>
                    ) : (
                      data &&
                      data.length > 0 &&
                      data.map((each, index) => {
                        return (
                          <tr
                            key={index}
                            onClick={onTrClick.bind(this, each)}
                            className={
                              activetr == true ||
                              each[keycompareactive] == activetr
                                ? "active-tr"
                                : ""
                            }
                          >
                            {columns.map(
                              (
                                {
                                  key,
                                  className = "",
                                  icon = "",
                                  isActive = false,
                                  spaceBefore = false,
                                  spaceAfter = false,
                                  spaceIconAfter = false,
                                  checkbox = false,
                                  radiobox = false,
                                  template = ({ children }) => (
                                    <>{children.map((child) => child)}</>
                                  ),
                                  onTdClick = () => {},
                                  ...column
                                },
                                cindex
                              ) => {
                                if (key === "autoindexing") {
                                  each[key] = zeroPad(index + 1, 4);
                                }
                                key = typeof key === "string" ? [key] : key;
                                return (
                                  <td
                                    {...column}
                                    onClick={onTdClick.bind(this, each)}
                                    className={`${className} ${
                                      isActive && each.active ? `active` : ``
                                    }`}
                                    key={cindex}
                                  >
                                    {key.filter(
                                      (everykey) => each[everykey] !== undefined
                                    ) ? (
                                      <>
                                        {spaceBefore ? " " : ""}
                                        {checkbox === true
                                          ? key.map((everykey) => (
                                              <SimpleCheckbox
                                                value={each[everykey]}
                                                name={column?.name}
                                                id={column?.id}
                                                checked={column?.checked}
                                              />
                                            ))
                                          : radiobox === true
                                          ? key.map((everykey) => (
                                              <SimpleRadiobox
                                                value={each[everykey]}
                                                name={column?.name}
                                                id={column?.id}
                                              />
                                            ))
                                          : template({
                                              data: each,
                                              ind: index,
                                              children: key.map(
                                                (everykey) => each[everykey]
                                              ),
                                            })}
                                        {spaceAfter ? " " : ""}
                                        {icon}
                                        {spaceIconAfter ? " " : ""}
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                );
                              }
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SimpleTable;
