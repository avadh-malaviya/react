import React,{ useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import rosterService from "../../../services/housekeeping/roster";
import { RosterContext } from "./RosterContext";

function ClearAllModal(props) {
const {property_id, role, func, setFunc, setRole, mode, setChange, setSelect, setDevices} = useContext(RosterContext);

  const onClick = () => {
    rosterService.clearallrosters({
      property_id: property_id,
      dept_func: mode === "deviceBased" ? parseInt(func) : 0,
      job_role_id: mode === "userBased" ? parseInt(role) : 0,
      retain_flag: 1,
      device_flag: mode === "deviceBased" ? 1 : 0,
    }).then(() => {
      setChange(false);
      setSelect(null);
      setFunc(0);
      setRole(0);
      setDevices([]);
      props.onHide()
    });
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
          Clear All Rosters
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <span>Do you want to clear all rosters for Housekeeping Runner department?.</span>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-danger" onClick={props.onHide}>
          No
        </Button>
        <Button
          className="btn-green"
          onClick={onClick}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClearAllModal;
