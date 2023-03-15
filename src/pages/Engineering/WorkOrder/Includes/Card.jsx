import React from "react";
import { Col, Row } from "react-bootstrap";
import dateTime from "../../../../helper/dateTime";

function Card({ className = "", detail = {}, onClick = () => {}, ...props }) {
  return (
    <div className={`w-100 p-3 ${className}`} onClick={() => onClick(detail)}>
      <Row className="lato-tbody p-1">
        <Col>{detail.ticket_id}</Col>
        <Col>Due {dateTime(detail.due_date).dateMonthYear}</Col>
      </Row>
      <div className="lato-model-input p-1">
        {detail.equipment_name ? detail.equipment_name : "-"}
      </div>
      <Row className="p-1">
        <Col>
          <span
            className={`outline-badge mr-1 ${detail?.work_order_type?.toLowerCase()}`}
          >
            {detail?.work_order_type}
          </span>
          <span className={`fill-badge ${detail?.priority?.toLowerCase()}`}>
            {detail?.priority}
          </span>
        </Col>
        <Col className="lato-model-input">
          Assigned to {detail.staff_status}
        </Col>
      </Row>
      <div className="lato-model-input p-1">
        {detail.location_type + " " + detail.location_name}
      </div>
      <div className="lato-model-input p-1">{detail.name}</div>
    </div>
  );
}

export default Card;
