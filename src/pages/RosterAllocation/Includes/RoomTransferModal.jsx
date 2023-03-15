import React,{ useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import rosterService from "../../../services/housekeeping/roster";
import { RosterContext } from "./RosterContext";

function RoomTransferModal(props) {

  const onClick = () => {

  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Room Transfer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>


      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-danger" onClick={props.onHide}>
          Cancel
        </Button>
        <Button
          className="btn-green"
          onClick={onClick}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RoomTransferModal;
