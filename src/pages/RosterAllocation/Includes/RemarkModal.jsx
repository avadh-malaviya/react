import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useAuthState } from "../../../store/context";
import rosterService from "../../../services/housekeeping/roster";

function RemarkModal({remarkRoom,...props}) {
  const [remark, setRemark] = React.useState("");
  const {
    user: { property_id },
  } = useAuthState();

  const createRemark = () => {
    let obj = {
      ...remarkRoom,
      remark: remark,
      property_id: property_id,
    };
    rosterService.addpreference(obj).then(() => props.onHide());
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
          Add Preference (Comment)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-comment">
          <label htmlFor="comment"> Comment </label> <br />
          <textarea
            name="comment"
            id="comment"
            style={{ width: "100%" }}
            onChange={(e) => setRemark(e.target.value)}
          ></textarea>
          <span>* Please enter a valid comment not more than 120 characters. Also avoid special characters.</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-danger" onClick={props.onHide}>
          Cancel
        </Button>
        <Button
          className="btn-green"
          disabled={remark === "" ? true : false}
          onClick={createRemark}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemarkModal;
