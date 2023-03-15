import React from "react";
import { Col, Row } from "react-bootstrap";

const Options = ({
  onManualCleanbtn,
  onViewHistorybtn,
  item,
  room,
  ...props
}) => {
  return (
    <tr className="sub-tr col-xl-6 p-0">
      <td
        className="bg-darkpink text-light font-weight-bold"
        onClick={() => props.close()}
        style={{ width: "12%" }}
      >
        {room.room}
      </td>
      <td className="bg-darkpink text-light">
        <div className="float-start">
          <div className="assigne-to">{room?.assigne_to}</div>
          <small className="available-credit">
            Available credits: {room?.credits}
          </small>
        </div>
        <i className="fas fa-angle-down arrow-down"></i>
      </td>
      <td className="bg-darkpink text-light auto-clean">
        <div className="align-items-center icon-text pb-2 icon-autoclean lato-sub-td">
          Auto Clean
        </div>
      </td>

      <td
        className="bg-lightgreen text-light"
        onClick={onManualCleanbtn}
        style={{ cursor: "pointer" }}
      >
        <div className="align-items-center icon-text pb-2 lato-sub-td icon-manual-clean">
          Manual Clean
        </div>
      </td>
      <td
        className="text-lightgreen align-middle"
        onClick={onViewHistorybtn}
        style={{ cursor: "pointer" }}
      >
        <div className="align-items-center icon-text lato-sub-td pb-2 icon-view-activity">
          <span className="mb-1"> View Activity </span>
        </div>
      </td>
    </tr>
  );
};

export default Options;
