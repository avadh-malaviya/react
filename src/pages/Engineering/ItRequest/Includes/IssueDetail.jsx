import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import Dropdown from "../../../../common/FormElements/Dropdown";
import FileUpload from "../../../../common/FormElements/FileUpload";
import ModalOffcanvas from "../../../../common/Modals/ModalOffcanvas";
import SimpleTable from "../../../../common/SimpleTable";
import dateTime from "../../../../helper/dateTime";
import itrequest from "../../../../services/Engineering/ItRequest/itrequest";
import moment from "moment";

function IssueDetail(props) {
  const [request, setRequest] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const diableObj = {
    status: true,
    prority: true,
    category: true,
    sub_category: true,
    comment: true,
    files: true,
  };
  const [disable, setDisable] = useState(diableObj);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [statusOpt, setStatusOpt] = useState([]);
  const [filelist, setFilelist] = useState([]);

  useEffect(() => {
    setFilelist([]);
    handleCategoryChange({ value: props.issue.category });
    statusBehaviour();
    requesthist();
  }, [props.issue]);

  const statusBehaviour = () => {
    switch (props.issue.status) {
      case "Closed":
        setDisable(diableObj);
        setStatusOpt([{ value: "Closed", text: "Closed" }]);
        break;

      case "Pending":
        setDisable({
          prority: true,
          comment: true,
          files: true,
          status: false,
          category: false,
          sub_category: false,
        });
        setStatusOpt([
          { value: "In-Progress", text: "In-Progress" },
          { value: "Rejected", text: "Reject" },
        ]);
        break;

      case "In-Progress":
        setDisableUpdate(true);
        setDisable({
          files: false,
          comment: false,
          status: false,
          category: false,
          sub_category: false,
          prority: true,
        });
        setStatusOpt([
          { value: "Resolved", text: "Resolve" },
          { value: "On-Hold", text: "Hold" },
        ]);
        break;

      case "Resolved":
        setDisable({ ...diableObj, status: false });
        setStatusOpt([
          { value: "Re-Opened", text: "Re-Open" },
          { value: "Closed", text: "Close" },
        ]);
        break;

      case "Rejected":
        setDisable(diableObj);
        setStatusOpt([{ value: "Rejected", text: "Rejected" }]);
        break;

      case "Re-Opened":
        setDisableUpdate(true);
        setDisable({
          files: false,
          comment: false,
          status: false,
          category: false,
          sub_category: false,
          prority: true,
        });
        setStatusOpt([
          { value: "Resolved", text: "Resolve" },
          { value: "On-Hold", text: "Hold" },
          { value: "Rejected", text: "Reject" },
        ]);
        break;

      case "On-Hold":
        setDisable({ ...diableObj, status: false });
        setStatusOpt([
          { value: "In-Progress", text: "In-Progress" },
          { value: "Rejected", text: "Reject" },
        ]);
        break;

      default:
        break;
    }
  };

  const requesthist = () => {
    itrequest
      .getrequesthist({ id: props.issue.id })
      .then((res) => setRequest(res.datalist));
  };

  const handleCategoryChange = (elem) => {
    itrequest
      .subcatlist({ category: elem.value, sub_cat: "" })
      .then((res) => setSubCategories(res));
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let obj = {
      ...props.issue,
      datalist: [],
      sub_download_array: [],
      status: formData.get("update_status"),
      subcategory: formData.get("sub_category"),
      category: formData.get("category"),
      resolution: formData.get("comment"),
    };

    if (disable.files == false) {
      let fileObj = new FormData();
      fileObj.append("id", props.issue.id);

      filelist.map((item, i) => {
        fileObj.append(`files[${i}]`, item);
      });

      itrequest.uploadsubfiles(fileObj).then(() => console.log("uploaded"));
    }

    itrequest.updateissue(obj).then(() => {
      props.reset();
      props.handleClose();
    });
  };

  const handleChange = (value) => {
    if (value == null && value == "" && value == undefined)
      setDisableUpdate(true);
    else setDisableUpdate(false);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0].size);
    if (e.target.files[0].size <= 10000000) {
      setFilelist((p) => {
        return [...p, e.target.files[0]];
      });
    } else {
      toast.error("Please upload file less then or equals to 10MB");
    }
  };

  const removeFile = (i) => {
    setFilelist((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={(e) => handlesubmit(e)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="float-start pt-1 pl-2 lato-canvas-title">
            {props.issue.subject}
          </div>
          <div className="float-start ml-4">
            <span
              className={`outline-badge ${props?.issue?.status?.toLowerCase()}`}
            >
              {props.issue.status}
            </span>
          </div>
          <button
            className={`float-end lato-btn mr-1 ${
              disableUpdate ? "btn-update" : "btn-update-active"
            }`}
            disabled={disableUpdate}
          >
            Update Request
          </button>
        </div>
      }
      bodyContainer={
        <div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Request ID</label>
                <div className="lato-input">
                  IT{props.issue.level}
                  {props.issue.id}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Location</label>
                <div className="lato-input">{props.issue.building}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Location Type</label>
                <div className="lato-input"> not in record</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Request Time</label>
                <div className="lato-input">
                  {props.issue?.created_at?.substring(11, 19)}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div
                className={
                  disable.status ? "form-group opacity-25" : "form-group"
                }
              >
                <label htmlFor="feedback">Update Status</label>
                <div>
                  <Dropdown
                    keyName="update_status"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    disable={disable.status}
                    options={statusOpt}
                    defaultValue={props.issue.status}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div
                className={
                  disable.prority ? "form-group opacity-25" : "form-group"
                }
              >
                <label htmlFor="feedback">Request Prority</label>
                <div>
                  <Dropdown
                    keyName="external_status"
                    disable={disable.prority}
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[{ value: "select", text: "Select" }]}
                    // selected={data.log_type}
                    defaultValue={""}
                    // onChange={(e) => handleChange(e.target)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div
                className={
                  disable.category ? "form-group opacity-25" : "form-group"
                }
              >
                <label htmlFor="feedback">Category</label>
                <div>
                  <Dropdown
                    keyName="category"
                    disable={disable.category}
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[
                      { value: "select", text: "Select" },
                      ...props.category?.map((item, i) => {
                        return { value: item.category, text: item.category };
                      }),
                    ]}
                    defaultValue={props.issue.category}
                    onChange={(e) => handleCategoryChange(e.target)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div
                className={
                  disable.sub_category ? "form-group opacity-25" : "form-group"
                }
              >
                <label>Sub-Category</label>
                <div>
                  <Dropdown
                    keyName="sub_category"
                    disable={disable.sub_category}
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[
                      { value: "select", text: "Select" },
                      ...subCategories?.map((item, i) => {
                        return { value: item.sub_cat, text: item.sub_cat };
                      }),
                    ]}
                    // selected={props.issue.subcategory}
                    defaultValue={props.issue.subcategory}
                    // onChange={(e) => handleChange(e.target)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 row container-fluid m-0">
            <div
              className={disable.comment ? "opacity-25 col-sm-9" : "col-sm-9"}
            >
              <label>
                Comment
                <span className="text-danger">
                  {disable.comment ? "" : "*"}
                </span>{" "}
              </label>
              <div>
                <textarea
                  name="comment"
                  disabled={disable.comment}
                  placeholder="Type here..."
                  className="plain-input w-100"
                  onChange={(e) => handleChange(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="col-sm-3 lato-input">
              <FileUpload
                className={disable.files ? "opacity-25" : "opacity-100"}
                keyName="files"
                disable={disable.files}
                title={
                  <>
                    <i className="fas fa-plus mr-1"></i> Add File (max 10MB)
                  </>
                }
                onChange={(e) => handleFileChange(e)}
                multiple
              />
              {filelist?.map((elem, i) => {
                return (
                  <div style={{ color: "#21BFAE" }} key={i}>
                    {elem.name}
                    <i
                      className="fas fa-times-circle text-danger float-right mt-1"
                      onClick={() => removeFile(i)}
                    ></i>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Employee Name</label>
                <div className="lato-input">{props.issue.req_name}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Employee ID</label>
                <div className="lato-input">{props.issue?.requestor_id}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>E-mail</label>
                <div className="lato-input text-break">
                  {props.issue?.email}
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Sub-Category</label>
                <div className="lato-input">{props.issue.subcategory}</div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Department</label>
                <div className="lato-input">{props.issue?.department}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Job Role</label>
                <div className="lato-input">{props.issue.job_role}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Type</label>
                <div className="lato-input">{props.issue.type}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Request Created on</label>
                <div className="lato-input">
                  {moment(props.issue.created_at).format("D MMM YYYY")}
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Attached File</label>
                <div>
                  <span
                    className="wrap lato-input"
                    style={{ color: "#21bfae", maxWidth: "127px" }}
                  >
                    {props.issue.upload}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="form-group">
                <label>Description</label>
                <div className="lato-input">{props.issue.issue}</div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div>
            <Tabs
              defaultActiveKey="request"
              id="uncontrolled-tab-example"
              className="p-2"
            >
              <Tab
                eventKey="request"
                title={<span className="lato-sub-tab">Request History </span>}
                className="bdr-right"
              >
                <SimpleTable
                  loader={false}
                  key={`request`}
                  columns={[
                    {
                      key: "created_at",
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
                    { key: "action", label: "Status", width: "150" },
                    { key: "fullname", label: "User", width: "150" },
                    { key: "assignee", label: "Assignee", width: "150" },
                    { key: "comment", label: "Commment", width: "150" },
                  ]}
                  data={request}
                />
              </Tab>
              <Tab
                eventKey="notification"
                title={
                  <span className="lato-sub-tab"> Notification History </span>
                }
                className="bdr-right"
              >
                Notification History
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
  );
}

export default IssueDetail;
