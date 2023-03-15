import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import ButtonCheckBox from "../../../common/FormElements/ButtonCheckBox";
import Dropdown from "../../../common/FormElements/Dropdown";
import SimpleTextarea from "../../../common/FormElements/SimpleTextarea";
import Switcher from "../../../common/FormElements/Switcher";
import ModalOffcanvas from "../../../common/Modals/ModalOffcanvas";
import SimpleTable from "../../../common/SimpleTable";
import { GetActionOptions } from "../../../common/TaskActions/GetActions";
import dropdownStyle from "../../../config/dropdownStyle";
import dateTime from "../../../helper/dateTime";
import departmentService from "../../../services/department";
import guestService from "../../../services/guest";
import { useAuthState } from "../../../store/context";
import Timer from "./Timer";

export default function TaskDetail(props) {
  const [feedback, setFeedback] = useState(props.task?.feedback_type);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [notification, setNotification] = useState([]);
  const [request, setRequest] = useState([]);
  const [actions, setActions] = useState([]);
  const [feedbacks, setFeedbacks] = useState(props.task?.compensation_comment);
  const [flag, setFlag] = useState(true);
  const [extendFlag, setExtendFlag] = useState(false);
  const [feedbackFlag, setFeedbackFlag] = useState();
  const [loader, setLoader] = useState(true);
  const [staffOption, setStaffOption] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const feedbackChangeToogle = () => {
    setFeedbackFlag((b) => !b);
    setFlag(false);
  };
  const dataObj = {
    comment: props.task.custom_message,
    log_type: "",
    feedbacks: "",
    staff: null,
  };
  const [data, setData] = useState(dataObj);
  const {
    user: { id, property_id, wholename },
  } = useAuthState();

  useEffect(() => {
    setData(dataObj);
    setExtendFlag(false);
    setFeedback(props.task?.feedback_type);
    if (props.show == true) {
      resetValues();
    }
  }, [props.show]);

  const resetValues = () => {
    setNotification([]);
    setRequest([]);
    setLoader(true);
    messageList();
    notifyList();
    initActionList();
    fetchAssignedInfo();
  };

  const fetchAssignedInfo = () => {
    guestService
      .gettaskinfowithassign({
        task_id: props.task?.task_list,
        location_id: props.task?.location_id,
      })
      .then((res) =>
        setStaffOption(() =>
          res.staff_list.map((item) => {
            return { label: item.wholename, value: item.id };
          })
        )
      );
  };

  useEffect(() => {
    setFeedbackFlag(props.task?.feedback_flag === "1");
    setFlag(true);
  }, [props.task]);

  useEffect(() => {
    setDuration();
  });

  const setDuration = () => {
    setHour(Math.floor(props?.task?.duration / (60 * 60)));
    var divisor_for_minutes = props?.task?.duration % (60 * 60);
    setMinute(Math.floor(divisor_for_minutes / 60));
    var divisor_for_seconds = divisor_for_minutes % 60;
    setSecond(Math.ceil(divisor_for_seconds));
  };

  const messageList = () => {
    guestService
      .messagelist({ property_id: property_id, task_id: props.task.id })
      .then((res) => {
        setLoader(false);
        setRequest(res);
      });
  };

  const notifyList = () => {
    guestService
      .notifylist({
        field: "id",
        page: 1,
        pagesize: 1000000,
        sort: "asc",
        task_id: props.task.id,
      })
      .then((res) => setNotification(res));
  };

  const initActionList = () => {
    setActions(GetActionOptions(props.task));
  };

  const handleChange = (data) => {
    // if (data.name == "log_type" && data.value == "Extended")
    //   setExtendFlag(true);
    // else {
    //   if (data.name == "log_type" && data.value != "Extended")
    //     setExtendFlag(false);
    // }
    if (data.value == "Extended") setExtendFlag(true);
    else {
      if (data.value != "Extended") setExtendFlag(false);
    }

    if (
      data.value == null ||
      data.value == " " ||
      data.value == "--Select Action--" ||
      data.value == undefined
    )
      setFlag(true);
    else setFlag(false);
    setData((o) => {
      let obj = o;
      if (data.label) obj["log_type"] = data.value;
      else obj[data.name] = data.value;
      return { ...obj };
    });
  };

  const onFeedbackChange = (value) => {
    setFeedback(value);
    setFlag(false);
  };

  const onFeedbacksChange = (e) => {
    setFeedbacks(e.target.value);
    setFlag(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (actions[0]?.label == "Assign") {
      if (selectedStaff.length == 0) return toast.error("please select staff");
      else
        var obj = {
          assign_id: selectedStaff,
          log_type: "Assigned To",
          max_time: data.max_time ? data.max_time * 60 : props.task.max_time,
          original_status_id: props.task.status_id,
          property_id: property_id,
          running: props.task.running,
          start_date_time: moment().format("YYYY-MM-DD hh:mm:ss"),
          status_id: 1,
          task_id: props.task.id,
        };
    } else {
      var obj = {
        ...data,
        property_id: property_id,
        status_id: props.task.status_id,
        task_id: props.task.id,
        max_time: data.max_time ? data.max_time * 60 : props.task.max_time,
        original_status_id: props.task.status_id,
      };
    }
    guestService.changetask(obj).then(() => {
      props.handleClose();
      props.reset();
    });
    guestService
      .changefeedback({
        choice: feedback ? 1 : 2,
        comment: feedbacks,
        feedback_flag: feedbackFlag ? 1 : 0,
        property_id,
        task_id: props.task.id,
        user_id: id,
      })
      .then(() => {
        console.log("changefeedback response");
      })
      .finally(() => setFlag(true));
  };

  const forwardRequest = () => {
    let req = props.task.quantity + " X " + props.task.task_name;
    let obj = {
      ...props.task,
      action_disable_flag: false,
      active: true,
      pictureflag: false,
      picturepath: "",
      repeat_end_date: "1970-01-01T00:00:00.000Z",
      repeat_flag: false,
      schedule_flag: true,
      userlist: [],
      username: "",
    };
    delete obj.ack_img;
    obj["action"] = data.log_type;
    obj["browser_time"] = moment.utc().format();
    obj["currentTime"] = moment().format("YYYY-MM-DD hh:mm:ss");
    obj["extend_time_flag"] = false;
    obj["feedback"] = feedbackFlag;
    obj["reason"] = data.comment;
    obj["requested_name"] = `Request for ${req}`;
    obj["status"] = props.task.status_flag;
    obj["ticket_item_name"] = req;
    obj["ticket_no"] = props.task.typenum;
    obj["user_name"] = wholename;

    departmentService
      .forward(obj)
      .then(() => toast.success("request forwarded successfully"))
      .catch(() => toast.error("Fail to forward request"));
  };

  return (
    <>
      <ModalOffcanvas
        {...props}
        headerContainer={
          <div style={{ flexBasis: "98%" }}>
            <div className="float-start pt-1 pl-2 lato-canvas-title">
              {props.task.quantity + "x " + props.task.task_name}
            </div>
            <div className="float-start ml-4">
              <span
                className={`fill-badge lato-input ${props?.task?.priority_name?.toLowerCase()}`}
              >
                {props.task.priority_name}
              </span>
              <span
                className={`outline-badge lato-input ${props?.task?.status_flag?.toLowerCase()}`}
              >
                {props.task.status_flag}
              </span>
            </div>
            {data.log_type == "On-Hold" || data.log_type == "Canceled" ? (
              <>
                {" "}
                {props?.task?.type == 2 ? (
                  <button
                    type="button"
                    onClick={forwardRequest}
                    className={
                      flag
                        ? "float-end btn-update mr-1 lato-btn"
                        : "float-end btn-update-active mr-1 lato-btn"
                    }
                    disabled={flag}
                  >
                    Forward Request
                  </button>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
            <button
              onClick={handleSubmit}
              className={
                flag
                  ? "float-end btn-update mr-1 lato-btn"
                  : "float-end btn-update-active mr-1 lato-btn"
              }
              disabled={flag}
            >
              Update Request
            </button>
          </div>
        }
        bodyContainer={
          <div className="guestservice-canvas">
            <div className="guestservice-taskdetail-content">
              <div className="row container-fluid m-0 p-2 bdr-bottom">
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="requestor-icon">Request ID</label>
                    <div className="lato-input">{props.task.typenum}</div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="requestor-icon">Guest Name</label>
                    <div className="lato-input">{props.task.guest_name}</div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="location-icon">Location</label>
                    <div className="lato-input">{props.task.lgm_name}</div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label className="location-type">Location Type</label>
                    <div className="lato-input">{props.task.lgm_type}</div>
                  </div>
                </div>
              </div>
              <div className="row container-fluid m-0 p-2 bdr-bottom">
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="staff-icon">Created By</label>
                    <div className="lato-input">
                      {props.task.attendant_name}
                    </div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="calendar-icon">Date Created</label>
                    <div className="lato-input">
                      {" "}
                      {dateTime(props.task.created_time).dateMonthYear}{" "}
                      {dateTime(props.task.created_time).time}
                    </div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="category-icon">Department</label>
                    <div className="lato-input">{props.task.department}</div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label className="function-icon">Function</label>
                    <div className="lato-input">{props.task.function}</div>
                  </div>
                </div>
              </div>
              <div className="row container-fluid m-0 p-2 bdr-bottom">
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="device-icon">Device</label>
                    <div className="lato-input">{props.task.device}</div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="priority-icon">Priority</label>
                    <div className="lato-input">{props.task.priority_name}</div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="clock-icon">Duration</label>
                    <div className="lato-input">
                      <Timer
                        info={{
                          ...props.task,
                          cur_time: moment()
                            .subtract(1, "hour")
                            .subtract(30, "minute")
                            .subtract(4, "seconds")
                            .format("YYYY-MM-DD HH:mm:ss"),
                        }}
                        sec={props.task.max_time}
                        status={props.task.status_flag}
                      />
                      {/* {hour < 10 ? "0" + hour : hour} :{" "}
                    {minute < 10 ? "0" + minute : minute} :{" "}
                    {second < 10 ? "0" + second : second} */}
                    </div>
                  </div>
                </div>
                <div className="col-sm-3 bdr-right">
                  <div className="form-group">
                    <label className="staff-icon">Staff</label>
                    <div className="lato-input">{props.task.wholename}</div>
                  </div>
                </div>
              </div>
              <div className="row container-fluid m-0 p-2 bdr-bottom">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label className="note-icon">Notes</label>
                    <div className="lato-input">
                      {/* {props.task.custom_message} */}
                      <input
                        type="text"
                        name="comment"
                        className="plain-input w-100"
                        defaultValue={data.comment}
                        onChange={(e) => handleChange(e.target)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="blank-container"></div>
              <div className="row container-fluid m-0 p-2 bdr-bottom">
                <div className="col-sm-3 bdr-right">
                  <label className="update-icon">Update Status</label>
                  <div className="form-group">
                    <Select
                      styles={dropdownStyle}
                      // menuPlacement={
                      //   props.task.status_flag == "Timeout" ? "bottom" : "top"
                      // }
                      menuPosition="fixed"
                      menuShouldBlockScroll={true}
                      options={actions}
                      isSearchable={false}
                      placeholder="Select Action"
                      isDisabled={
                        props.task.status_id == 0 ||
                        props.task.status_id == 4 ||
                        props.task.status_id == 5 ||
                        props.task.closed_flag == 1
                      }
                      onChange={handleChange}
                      defaultValue={actions.filter(
                        (option) => option.label === data.log_type
                      )}
                    />
                    {/* <Dropdown
                    disable={props.task.status_flag == "Canceled"}
                    keyName="log_type"
                    style={{ outline: "none" }}
                    className={`bg-light mt-1 p-2 ${
                      props.task.status_flag == "Canceled" ? "opacity-50" : ""
                    }`}
                    options={actions}
                    selected={data.log_type}
                    defaultValue={""}
                    onChange={(e) => handleChange(e.target)}
                  /> */}
                  </div>
                </div>
                {actions[0]?.label == "Assign" ? (
                  <div className="col-sm-3 bdr-right">
                    <div className="form-group">
                      <label className="staff-icon">Staff</label>
                      <Select
                        styles={dropdownStyle}
                        // menuPlacement="top"
                        menuPosition="fixed"
                        menuShouldBlockScroll={true}
                        options={staffOption}
                        isSearchable={true}
                        placeholder="Select"
                        onChange={(val) => setSelectedStaff(val.value)}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {extendFlag ? (
                  <div className="col-sm-3 bdr-right">
                    <div className="form-group">
                      <label className="clock-icon">Extend For</label>
                      <div>
                        <input
                          type="number"
                          name="max_time"
                          className="plain-input mb-2"
                          placeholder="enter min"
                          onChange={(e) =>
                            setData((p) => {
                              return { ...p, max_time: e.target.value };
                            })
                          }
                        />
                      </div>{" "}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {props.task.status_flag == "Timeout" ||
                props.task.status_flag == "Canceled" ||
                props.task.status_flag == "Complete" ||
                props.task.status_flag == "Feedback" ? (
                  ""
                ) : (
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label className="feedback-icon">Feedback</label>
                      <div className="row">
                        <Switcher
                          name="rushclean"
                          className="mt-2 col-sm-8"
                          checked={feedbackFlag}
                          onChange={feedbackChangeToogle}
                          disabled={
                            props.task.status_flag == "Escalated" ||
                            props.task.status_flag == "Escalated Hold"
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {props.task.status_flag == "Feedback" ||
              props.task.status_flag == "Complete" ||
              props.task.status_flag == "Canceled" ||
              props.task.status_flag == "Timeout" ? (
                <div className="row container-fluid m-0 p-2 ">
                  <div className="col-sm-3 bdr-right">
                    <div className="form-group">
                      <label className="feedback-icon">Feedback</label>
                      <div className="row">
                        <ButtonCheckBox
                          containerType="simple"
                          className="col m-1 lato-dropdown"
                          // style={{ width: "100px" }}
                          label="Positive"
                          value={1}
                          name="feedback"
                          selected={feedback}
                          onChange={onFeedbackChange.bind(this, 1)}
                          disabled={
                            props.task.status_flag == "Feedback"
                              ? false
                              : props.task.feedback_closed_flag
                          }
                        />
                        <ButtonCheckBox
                          containerType="simple"
                          className="col m-1 lato-dropdown"
                          // style={{ width: "100px" }}
                          label="Negative"
                          value={0}
                          name="feedback"
                          selected={feedback}
                          onChange={onFeedbackChange.bind(this, 0)}
                          disabled={
                            props.task.status_flag == "Feedback"
                              ? false
                              : props.task.feedback_closed_flag
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-9">
                    <div className="form-group">
                      <div className="row">
                        <SimpleTextarea
                          placeholder="Feedback"
                          style={{
                            width: "97%",
                            margin: "5px",
                            outline: "none",
                          }}
                          label="Feedbacks"
                          name="feedbacks"
                          defaultValue={feedbacks}
                          placeText="Type here..."
                          onChange={onFeedbacksChange}
                        >
                          {feedbacks}
                        </SimpleTextarea>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="blank-container"></div>
            <div>
              <Tabs defaultActiveKey="request" id="uncontrolled-tab-example">
                <Tab
                  eventKey="request"
                  title={<span className="lato-sub-tab">Request History </span>}
                  className="bdr-right guestservice-taskdetail-table"
                >
                  <SimpleTable
                    loader={loader}
                    key={`request`}
                    columns={[
                      {
                        key: "log_time",
                        label: "Date & Time",
                        width: "150",
                        template: ({ children }) => (
                          <div>
                            {children[0]?.substring(0, 10) +
                              " | " +
                              children[0]?.substring(11, 16)}
                          </div>
                        ),
                      },
                      { key: "status", label: "Status", width: "150" },
                      { key: "log_type", label: "Type", width: "150" },
                      { key: "comment", label: "Commment", width: "150" },
                      { key: "method", label: "Method", width: "150" },
                      { key: "wholename", label: "User", width: "150" },
                    ]}
                    data={request.messagelist}
                  />
                </Tab>
                <Tab
                  eventKey="notification"
                  title={
                    <span className="lato-sub-tab"> Notification History </span>
                  }
                  className="bdr-right guestservice-taskdetail-table"
                >
                  <SimpleTable
                    loader={loader}
                    key={`notification`}
                    columns={[
                      { key: "id", label: "ID", width: "150" },
                      { key: "staff", label: "Satff", width: "150" },
                      { key: "send_time", label: "Time", width: "150" },
                      { key: "type", label: "Type", width: "150" },
                      { key: "job_role", label: "Job Role", width: "150" },
                      { key: "mode", label: "Method", width: "150" },
                    ]}
                    data={notification.datalist}
                  />
                </Tab>
                <Tab
                  eventKey="chat"
                  title={<span className="lato-sub-tab">Chat</span>}
                >
                  chat
                </Tab>
              </Tabs>
            </div>
          </div>
        }
      />
    </>
  );
}
