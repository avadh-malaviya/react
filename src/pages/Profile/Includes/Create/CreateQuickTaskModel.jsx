import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import InputField from "../../../../common/FormElements/InputField";

function CreateQuickTaskModel({ create, ...props }) {
  const [values, setvalues] = useState({});
  const [disableFlag, setDisableFlag] = useState(true);

  const createtask = () => {
    create(values);
    props.onHide();
  };

  const handleValueChange = (e) => {
    if (e.value == null || e.value == undefined || e.value == "")
      setDisableFlag(true);
    else setDisableFlag(false);
    setvalues((p) => {
      let obj = p;
      obj[e.name] = e.value;
      return { ...obj };
    });
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header>
          <div>Add Details</div>
        </Modal.Header>
        <Modal.Body>
          <div className="custom-comment">
            <InputField
              type="number"
              keyName="quantity"
              className="w-50 mb-3"
              label="Quantity"
              defaultValue={1}
              onChange={(e) => handleValueChange(e.target)}
            />
          </div>
          <div className="custom-comment">
            <InputField
              keyName="comment"
              label="Comment"
              onChange={(e) => handleValueChange(e.target)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className="close-btn lato-btn" onClick={props.onHide}>
            Close
          </span>
          <button
            className={`btn-green lato-btn ${disableFlag ? "opacity-50" : ""}`}
            disabled={disableFlag}
            onClick={createtask}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateQuickTaskModel;
