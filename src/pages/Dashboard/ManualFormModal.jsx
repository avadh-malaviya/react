import React, { useState } from "react";
import "../../css/modal.css";
import { Button, Modal } from "react-bootstrap";
import Switcher from "../../common/FormElements/Switcher";
import Dropdown from "../../common/FormElements/Dropdown";
import { useEffect } from "react";
import {
  SERVICE_STATE_LIST,
  CLEANING_STATE_LIST,
  ROOM_STATUS_LIST,
} from "./List";
import { ListOptions } from "../../common/TaskActions/GetActions";
import realtimeService from "../../services/housekeeping/realtime";

function ManualFormModal(props) {
  const [rushFlag, setRushFlag] = useState(props?.room?.rush_flag);
  const [assignes, setAssignes] = useState([]);
  const [roomStatus, setRoomStatus] = useState();
  const [preference, setPreference] = useState();
  const [cleanStatus, setCleanStatus] = useState();
  const [assigne, setAssigne] = useState();
  const [schedule, setSchedule] = useState();
  const [service, setService] = useState();
  const [comment, setComment] = useState();
  const serviceList = ListOptions(SERVICE_STATE_LIST);
  const cleaningList = ListOptions(CLEANING_STATE_LIST);
  const roomStatusList = ListOptions(ROOM_STATUS_LIST);
  const [scheduleList, setScheduleList] = useState([
    { value: "Not Aplicable", text: "Not Aplicable" },
  ]);
  const rushCleanChangeToogle = () => setRushFlag((flag) => !flag);

  useEffect(() => {
    // debugger;;
    setAssignes([
      {
        text: props?.room?.assigne_to,
        value: props?.room?.assigne_id,
      },
    ]);
  }, [props?.room]);

  useEffect(() => {
    if (scheduleList.length === 0 && props?.scheduleList) {
      console.log("props?.scheduleList", ListOptions(props?.scheduleList));
      setScheduleList(() => ListOptions(props?.scheduleList));
    }
  }, [props?.scheduleList]);

  // updaterushclean
  // updatecleaningstate
  // updatecleaningstate

  const updateHandler = () => {
    console.log("props?.room", props?.room);
    if (props?.room?.id) {
      realtimeService.updaterushclean({
        room_id: props?.room?.id,
        rush_flag: rushFlag,
        method: "Agent",
      });
      realtimeService.updatecleaningstate({
        room_id: props?.room?.id,
        cleaning_state: cleanStatus,
      });
      realtimeService.updatecleaningstate({
        room_id: props?.room?.id,
        comment: comment,
        schedule: schedule ?? 0,
      });
    }
    props.onHide();
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header>
        {/* <Modal.Title id="contained-modal-title-vcenter"> */}
        <div className="w-100 text-center lato-model-head mb-0">
          Room {props?.room?.room}
        </div>
        {/* </Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <div className="row lato-model-input">
          <div className="col-md-6">
            <div className="card-body">
              <div className="form-group">
                <label className="pr-2" htmlFor="exampleInputEmail1">
                  Room Type :
                </label>
                <span className="textbox-plain">{props?.room?.type}</span>
              </div>

              <div className="form-group">
                <label className="pr-2" htmlFor="exampleInputEmail1">
                  Duration :
                </label>
                <span className="textbox-plain">{props?.room?.duration}</span>
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Cleaning Status</label>
                <Dropdown
                  options={cleaningList}
                  selected={cleanStatus}
                  name="cleanStatus"
                  className="form-select form-control lato-model-input"
                  onChange={setCleanStatus}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Room Status</label>
                <Dropdown
                  options={roomStatusList}
                  selected={roomStatus}
                  name="roomStatus"
                  className="form-select form-control lato-model-input"
                  onChange={setRoomStatus}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Schedule</label>
                <Dropdown
                  options={scheduleList}
                  selected={schedule}
                  name="schedule"
                  className="form-select form-control lato-model-input"
                  onChange={setSchedule}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card-body">
              <div className="form-group">
                <label className="pr-2" htmlFor="exampleInputEmail1">
                  Credit :
                </label>
                <span className="textbox-plain">{props?.room?.credits}</span>
              </div>
              <div className="form-group row align-items-center mb-2">
                <label
                  className="col-sm-4 col-form-label"
                  htmlFor="exampleInputEmail1"
                >
                  Rush Clean
                </label>
                <Switcher
                  name="rushclean"
                  className="mt-2 col-sm-8"
                  checked={rushFlag}
                  onChange={rushCleanChangeToogle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Assign to</label>
                <Dropdown
                  options={assignes}
                  selected={assigne}
                  className="form-select form-control lato-model-input"
                  onChange={setAssigne}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Service Status</label>
                <Dropdown
                  options={serviceList}
                  selected={service}
                  className="form-select form-control lato-model-input"
                  onChange={setService}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Preference</label>
                <input
                  className="form-control"
                  name="preference"
                  placeholder="Type here"
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Comment</label>
                <textarea
                  className="form-control lato-model-input"
                  name="comment"
                  value={comment}
                  placeholder="Type here"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="close-btn lato-sub-td" onClick={props.onHide}>
          Close
        </button>
        <button className="btn-green lato-sub-td" onClick={updateHandler}>
          Update
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ManualFormModal;
