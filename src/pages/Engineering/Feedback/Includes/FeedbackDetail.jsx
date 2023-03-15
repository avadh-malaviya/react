import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import ModalOffcanvas from "../../../../common/Modals/ModalOffcanvas";
import dateTime from "../../../../helper/dateTime";
import Multiselect from "multiselect-react-dropdown";
import FileUpload from "../../../../common/FormElements/FileUpload";
import feedback from "../../../../services/Engineering/feedbackRequest/feedback";
import SimpleTable from "../../../../common/SimpleTable";
import { useAuthState } from "../../../../store/context";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Select from "react-select";
import dropdownStyle from "../../../../config/dropdownStyle";

function FeedbackDetail(props) {
  const [historylist, setHistorylist] = useState([]);
  const [complaintDatalist, setComplaintDatalist] = useState([]);
  const department = useRef();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [filelist, setFilelist] = useState({
    service_recovery: [],
    complaint_files: [],
    sub_complaint: [],
  });
  const {
    user: { client_id },
  } = useAuthState();

  const optDropdown = [
    {
      cat: "Group 1",
      key: "Department 1",
    },
    {
      cat: "Group 1",
      key: "Department 2",
    },
    {
      cat: "Group 1",
      key: "Department 3",
    },
    {
      cat: "Group 2",
      key: "Department 4",
    },
    {
      cat: "Group 2",
      key: "Department 5",
    },
    {
      cat: "Group 2",
      key: "Department 6",
    },
    {
      cat: "Group 2",
      key: "Department 7",
    },
  ];

  useEffect(() => {
    handleDateChange(new Date(props.list.incident_time));
  }, [props.list]);

  useEffect(() => {
    feedback
      .getComplaintDatalist({ client_id: client_id })
      .then((res) => setComplaintDatalist(res));
    feedback
      .gethistorylist({ guest_id: props.list.guest_id })
      .then((res) => setHistorylist(res.datalist));
  }, []);

  const removeFile = (name, i) => {
    setFilelist((p) => {
      let obj = p;
      obj[name].splice(i, 1);
      return { ...obj };
    });
  };

  const handleFileChange = (elem) => {
    setFilelist((old) => {
      let obj = old;
      obj[elem.target.name] = [...old[elem.target.name], elem.target.files[0]];
      return { ...obj };
    });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let feed_type = formData.get("feedback_type").split(",");
    let feed_source = formData.get("feedback_source").split(",");

    let obj = {
      ...props.list,
      depts_list: getSelectedDepartment(),
      initial_response: formData.get("comment_response"),
      comment_response: formData.get("comment_response"),
      response: formData.get("response"),
      comment: formData.get("response"),
      feedback_type_id: feed_type[0],
      feedback_type: feed_type[1],
      loc_id: formData.get("location"),
      feedback_source_id: feed_source[0],
      feedback_source: feed_source[1],
      selected_ids: department.current.state.selectedValues,
      category_id:
        formData.get("category") == "select"
          ? props.list.category_id
          : formData.get("category"),
      incident_time: dateTime(selectedDate).yyyy_mm_dd_tt,
      active: true,
      approval_route_flag: false,
      comp_total: 0,
      compensation_comment_is_open: false,
      complaint_comment_is_open: false,
      created_at_time: props.list.created_at,
      discuss_end_time_at: props.list.discuss_end_time,
      download_array: [],
      gender: "Male",
      guest_is_open: true,
      history_view: false,
      icon_class: [""],
      location: "Room - 211",
      modified_by: 1,
      running_subcomplaint_is_open: false,
      ticket_no:
        "F" + props.list?.id?.toString().length > 4
          ? props.list.id
          : "0" + props.list.id,
      type_id: feed_type[0],
    };

    feedback.updateComplaint(obj).then(() => {
      props.reset();
      props.handleClose();
    });
  };

  const getSelectedDepartment = () => {
    let arr = department.current.state.selectedValues.map((item) => item.id);
    return arr;
  };

  const feedbacktypeOptions = complaintDatalist.feedback_type_list?.map(
    (item, i) => {
      return {
        label: item.name,
        value: item.id + "," + item.name,
      };
    }
  );

  const locationOptions = props?.locations?.map((item, i) => {
    return {
      label: item.name + " - " + item.type,
      value: item.id,
    };
  });

  const sourceOptions = complaintDatalist.feedback_source_list?.map(
    (item, i) => {
      return {
        label: item.name,
        value: item.id + "," + item.name,
      };
    }
  );

  const categoryOptions = complaintDatalist.category_list?.map((item, i) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={(e) => handlesubmit(e)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="float-start pt-1 pl-2 lato-canvas-title">
            {props.list.guest_name}
          </div>
          <div className="float-start ml-4">
            <span
              className={`fill-badge ${props?.list?.status?.toLowerCase()}`}
            >
              {props.list.status}
            </span>
            <span
              className={`outline-badge ${props?.list?.final_status?.toLowerCase()}`}
            >
              {props.list.final_status}
            </span>
          </div>
          <button
            // onClick={handleSubmit}
            className="float-end lato-btn btn-update-active mr-1 opacity-100"
            // disabled={flag}
          >
            Update Request
          </button>
        </div>
      }
      bodyContainer={
        <div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Request ID</label>
                <div className="lato-input">
                  F
                  {props.list?.id?.toString().length > 4
                    ? props.list.id
                    : "0" + props.list.id}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Guest Full Name</label>
                <div className="lato-input">{props.list.guest_name}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Guest Type</label>
                <div className="lato-input">{props.list.guest_type}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Guest VIP Status</label>
                <div className="lato-input">{props.list.vip}</div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Room Number</label>
                <div className="lato-input">{props.list.room}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Booking SRC</label>
                <div className="lato-input">{props.list.booking_src}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Booking Rate</label>
                <div className="lato-input">{props.list.booking_rate}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Company</label>
                <div className="lato-input">{props.list.company}</div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Check-In-Date</label>
                <div className="lato-input">
                  {dateTime(props.list.arrival).dateMonthYear}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Check-Out-Date</label>
                <div className="lato-input">
                  {dateTime(props.list.departure).dateMonthYear}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>E-mail</label>
                <div className="lato-input">{props.list?.email}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Mobile</label>
                <div className="lato-input">{props.list.mobile}</div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Guest Nationality</label>
                <div className="lato-input">{props.list?.nationality}</div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <Row>
                <div className="col-4 text-end">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/service-recovery.svg"
                    }
                    alt="service"
                    width="50px"
                  />
                </div>
                <div className="col pt-2">
                  <div className="lato-label">Service Recovery</div>
                  <FileUpload
                    keyName="service_recovery"
                    title={
                      <span className="lato-input">
                        <i className="fas fa-plus mr-1"></i> Add Recovery{" "}
                      </span>
                    }
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                </div>
                {filelist?.service_recovery?.map((elem, i) => {
                  return (
                    <div className="color-green lato-input" key={i}>
                      {elem.name}
                      <i
                        className="fas fa-times-circle text-danger float-right mt-1"
                        onClick={() => removeFile("service_recovery", i)}
                      ></i>
                    </div>
                  );
                })}
              </Row>
            </div>
            <div className="col-sm-3 bdr-right">
              <Row>
                <div className="col-4 text-end">
                  <img
                    src={process.env.PUBLIC_URL + "/images/compaint-files.svg"}
                    alt="service"
                    width="50px"
                  />
                </div>
                <div className="col pt-2">
                  <div className="lato-label">Complaint files</div>
                  <FileUpload
                    keyName="complaint_files"
                    title={
                      <span className="lato-input">
                        <i className="fas fa-plus mr-1"></i> Add Files
                      </span>
                    }
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
                {filelist?.complaint_files?.map((elem, i) => {
                  return (
                    <div className="color-green lato-input" key={i}>
                      {elem.name}
                      <i
                        className="fas fa-times-circle text-danger float-right mt-1"
                        onClick={() => removeFile("complaint_files", i)}
                      ></i>
                    </div>
                  );
                })}
              </Row>
            </div>
            <div className="col-sm-3 bdr-right">
              <Row>
                <div className="col-4 text-end">
                  <img
                    src={process.env.PUBLIC_URL + "/images/sub-compaint.svg"}
                    alt="service"
                    width="50px"
                  />
                </div>
                <div className="col pt-2">
                  <div className="lato-label">Sub Complaint</div>
                  <FileUpload
                    keyName="sub_complaint"
                    title={
                      <span className="lato-input">
                        <i className="fas fa-plus mr-1"></i> Add Here
                      </span>
                    }
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
                {filelist?.sub_complaint?.map((elem, i) => {
                  return (
                    <div className="color-green lato-input" key={i}>
                      {elem.name}
                      <i
                        className="fas fa-times-circle text-danger float-right mt-1"
                        onClick={() => removeFile("sub_complaint", i)}
                      ></i>
                    </div>
                  );
                })}
              </Row>
            </div>
            <div className="col-sm-3 pb-3">
              <fieldset>
                <legend>Add Departments</legend>
                <Multiselect
                  customCloseIcon={<i class="fas fa-times ml-2"></i>}
                  displayValue="department"
                  ref={department}
                  options={props.department}
                  style={{
                    multiselectContainer: {
                      width: "100%",
                    },
                    searchBox: {
                      border: "none",
                    },
                    chips: {
                      wordWrap: "break-word",
                      background: "#0B8376",
                      borderRadius: "5px",
                    },
                    highlightOption: {
                      background: "#0B8376",
                    },
                    highlight: {
                      background: "#0B8376",
                    },
                  }}
                  selectedValues={props.list.selected_ids}
                />
              </fieldset>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 pb-3 bdr-right">
              <fieldset>
                <legend>Add Sub-Departments</legend>
                <Multiselect
                  customCloseIcon={<i className="fas fa-times ml-2"></i>}
                  displayValue="key"
                  options={optDropdown}
                  style={{
                    searchBox: {
                      border: "none",
                    },
                    chips: {
                      background: "#0B8376",
                      borderRadius: "5px",
                    },
                  }}
                />
              </fieldset>
            </div>
            <div className="col-sm-9 pb-3">
              <label>Comment</label> <br />
              <input
                type="text"
                placeholder="Type comment here..."
                style={{ outline: "none", width: "100%" }}
              />
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Created on</label>
                <div className="lato-input">
                  {dateTime(props.list.created_at).dateMonthYear} |{" "}
                  {dateTime(props.list.created_at).time}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Incident Time</label>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Type</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={feedbacktypeOptions}
                    isSearchable={false}
                    placeholder="Select Action"
                    name="feedback_type"
                    defaultValue={feedbacktypeOptions?.filter(
                      (option) => option.label === props.list.feedback_type
                    )}
                  />
                  {/* <select
                    name="feedback_type"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    defaultValue={
                      props.list.feedback_type_id +
                      "," +
                      props.list.feedback_type
                    }
                    id="feedback_type"
                  >
                    {complaintDatalist.feedback_type_list?.map((item, i) => {
                      return (
                        <option value={item.id + "," + item.name} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Location</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={locationOptions}
                    isSearchable={true}
                    placeholder="Select"
                    name="location"
                    defaultValue={locationOptions?.filter(
                      (option) => option.value === props.list.loc_id
                    )}
                  />
                  {/* <select
                    name="location"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    defaultValue={props.list.loc_id}
                    id="location"
                  >
                    {props.locations?.map((item, i) => {
                      return (
                        <option value={item.id} key={i}>
                          {item.name} - {item.type}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Source</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={sourceOptions}
                    isSearchable={false}
                    placeholder="Select"
                    name="feedback_source"
                    defaultValue={sourceOptions?.filter(
                      (option) => option.label === props.list.feedback_source
                    )}
                  />
                  {/* <select
                    name="feedback_source"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    defaultValue={
                      props.list.feedback_source_id +
                      "," +
                      props.list.feedback_source
                    }
                    id="feedback_source"
                  >
                    {complaintDatalist.feedback_source_list?.map((item, i) => {
                      return (
                        <option value={item.id + "," + item.name} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Requestor</label>
                <div className="lato-input">{props.list.wholename}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Job Role</label>
                <div className="lato-input">{props.list.job_role}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Category</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={categoryOptions}
                    isSearchable={true}
                    placeholder="Select"
                    name="category"
                    defaultValue={categoryOptions?.filter(
                      (option) => option.value === props.list.category_id
                    )}
                  />
                  {/* <select
                    name="category"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    defaultValue={props.list.category_id}
                    id="category"
                  >
                    <option value="select">Select</option>
                    {complaintDatalist.category_list?.map((item, i) => {
                      return (
                        <option value={item.id} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-6 bdr-right">
              <div className="form-group">
                <label>Feedback</label>
                <div>
                  <textarea
                    name="response"
                    placeholder="Type here..."
                    className="plain-input w-100"
                    defaultValue={props.list.response}
                    // onChange={(e) => handleChange(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Initial Response</label>
                <div>
                  <textarea
                    name="comment_response"
                    placeholder="Type here..."
                    className="plain-input w-100"
                    defaultValue={props.list.comment_response}
                    // onChange={(e) => handleChange(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Tabs
              defaultActiveKey="request"
              id="uncontrolled-tab-example"
              className="p-2"
            >
              <Tab
                eventKey="request"
                title={<span className="lato-sub-tab  ">Request History </span>}
                className="bdr-right"
              >
                <SimpleTable
                  loader={false}
                  key={`historylist`}
                  columns={[
                    {
                      key: "created_time",
                      label: "Date & Time",
                      width: "150",
                      template: ({ children }) => (
                        <div>
                          {children[0]?.substring(0, 10) +
                            " | " +
                            dateTime(children[0]).time}
                        </div>
                      ),
                    },
                    { key: "id", label: "Ticket", width: "150" },
                    {
                      key: "guest_id",
                      label: "Type",
                      width: "150",
                      template: ({ children }) => <div>Guest</div>,
                    },
                    {
                      key: ["quantity", "task_name"],
                      label: "Task",
                      width: "150",
                      template: ({ children }) => (
                        <div>
                          {children[0]}x {children[1]}
                        </div>
                      ),
                    },
                  ]}
                  data={historylist}
                />
              </Tab>
              <Tab
                eventKey="notification"
                title={
                  <span className="lato-sub-tab "> Notification History </span>
                }
                className="bdr-right"
              >
                Notification History
              </Tab>
              <Tab
                eventKey="chat"
                title={<span className="lato-sub-tab  ">Chat</span>}
              >
                chat
              </Tab>
            </Tabs>
          </div>
        </div>
      }
    />
  );
}

export default FeedbackDetail;
