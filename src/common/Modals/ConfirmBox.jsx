import React from "react";
import { Button, Modal } from "react-bootstrap";

function ConfirmBox({
  ondelete = () => {},
  title = "Are you sure?",
  body = "You won't be able to revert this record!",
  btn = "Delete",
  btnclose = "Close",
  ...props
}) {
  return (
    <>
      <Modal {...props}>
        <Modal.Header closeButton>
          <div>{title}</div>
        </Modal.Header>
        <Modal.Body>
          <div className="lato-modal-body">{body}</div>
        </Modal.Body>
        <Modal.Footer>
          <span className="close-btn lato-btn" onClick={() => props.onHide()}>
            {btnclose}
          </span>
          <span className="btn-green lato-btn" onClick={ondelete}>
            {btn}
          </span>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmBox;
