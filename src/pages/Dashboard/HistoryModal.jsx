import React, { useState } from "react";
import "../../css/modal.css";
import { Button, Modal } from "react-bootstrap";
import SimpleTable from "./../../common/SimpleTable";
import { useEffect } from "react";
import realtimeService from "../../services/housekeeping/realtime";

function HistoryModal(props) {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const getRoomHistory = () => {
    setLoader(true);
    realtimeService
      .getroomhistory({
        room_id: props.room?.id,
      })
      .then((res) => (res?.list ? setData(res.list) : ""))
      .finally(() => setLoader(false));
  };
  useEffect(() => {
    getRoomHistory();
  }, []);

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header>
        {/* <Modal.Title id="contained-modal-title-vcenter"> */}
        <div className="w-100 text-center lato-model-head mb-0">
          Room {props?.room?.room} Activity History
        </div>
        {/* </Modal.Title> */}
      </Modal.Header>
      <Modal.Body bsPrefix="xmodal-body">
        <SimpleTable
          className="activity-history"
          loader={loader}
          key={`location`}
          columns={[
            { key: "autoindexing", label: "Number" },
            { key: "type", label: "Type" },
            { key: "content", label: "Content" },
            { key: "created_at", label: "Date" },
          ]}
          data={data}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn-green lato-sub-td" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default HistoryModal;
