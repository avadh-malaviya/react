import React from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import guestService from "../../../services/guest";

function CommentModal(props) {
  const [comment, setComment] = React.useState("");

  const cancleTask = () => {
    let obj = {
      comment: comment,
      log_type: "Canceled",
      running: props.task.running,
      status_id: 4,
      task_id: props.task.id,
      max_time: props.task.max_time,
      original_status_id: props.task.status_id,
    };
    guestService
      .changetask(obj)
      .then(() => props.save())
      .catch(() => toast.error("Fail to cancle task"));
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header>
          <div>Please input cancle reason</div>
        </Modal.Header>
        <Modal.Body>
          <div className="custom-comment">
            <label htmlFor="comment"> Comment </label> <br />
            <textarea
              name="comment"
              id="comment"
              style={{ width: "100%" }}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className="close-btn lato-btn" onClick={props.onHide}>
            Close
          </span>
          <button
            className={`btn-green lato-btn ${
              comment == "" ? "opacity-50" : ""
            }`}
            disabled={comment == "" ? true : false}
            onClick={cancleTask}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommentModal;
