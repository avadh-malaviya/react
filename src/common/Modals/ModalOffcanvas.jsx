import React from "react";
import { Form, Offcanvas } from "react-bootstrap";

function ModalOffcanvas({
  // title = "",
  headerContainer = "",
  bodyContainer = "",
  show = false,
  handleClose = () => {},
  placement = "end",
  className = "",
  handlesubmit = (e) => {},
  closeBtn = true,
  ...props
}) {
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement={placement}
      className={className}
      {...props}
    >
      <Form onSubmit={(e) => handlesubmit(e)}>
        <Offcanvas.Header closeButton={closeBtn} children={``}>
          {/* <Offcanvas.Title>{title}</Offcanvas.Title> */}
          {headerContainer}
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: "0rem 0rem 1rem 0rem" }}>
          {bodyContainer}
        </Offcanvas.Body>
      </Form>
    </Offcanvas>
  );
}
export default ModalOffcanvas;
