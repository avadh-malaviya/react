import React,{ useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import SimpleTable from "../../../common/SimpleTable";
import rosterService from "../../../services/housekeeping/roster";
import { RosterContext } from "./RosterContext";

function AssignedRoomModal({assignes, locations, setAssignes, oldAssignes, updateRosterDevice, ...props}) {
  const {property_id, role, func, setFunc, setRole, mode, setChange, select, devices, reload, setReload} = useContext(RosterContext);
  let device = devices.find((device)=> device.id === parseInt(select));

  const onClick = () => {
    setAssignes(oldAssignes);
    updateRosterDevice();
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
          Successfully assigned {assignes.length} rooms to {device?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body bsPrefix="xmodal-body">
      <SimpleTable
        key={`assignes`}
        className="list"
        loader={false}
        columns={[
          { key: "room", label: "Room Number", width: "150" },
          { key: "credits", label: "Credits", width: "150" },
          { key: "room_type", label: "Type", width: "150" },
          { key: "room_status", label: "Status", width: "150" },
          { key: "cleaning_state", label: "Cleaning", width: "150" },
          { key: "occupancy", label: "Occupancy", width: "150" },
        ]}
        data={locations.filter((location) => assignes.indexOf(location.id) !== -1 ) }
      />

      </Modal.Body>
      <Modal.Footer>
        <button
          className="close-btn"
          onClick={onClick}
        >
          Undo Allocation
        </button>
        <button className="btn-green" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignedRoomModal;
