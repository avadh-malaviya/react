import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { Tab, Tabs } from "react-bootstrap";
import Dropdown from "../../../../common/FormElements/Dropdown";
import ModalOffcanvas from "../../../../common/Modals/ModalOffcanvas";
import workrequest from "../../../../services/Engineering/WorkRequest/workrequest";
import * as status from "../../../../common/Engineering/status";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import dateTime from "../../../../helper/dateTime";
import { toast } from "react-toastify";
import FileUpload from "../../../../common/FormElements/FileUpload";
import ButtonCheckBox from "../../../../common/FormElements/ButtonCheckBox";
import { useEffect } from "react";
import { baseUrl } from "../../../../config/app";
import moment from "moment";
import Select from "react-select";
import dropdownStyle from "../../../../config/dropdownStyle";

function RequestDetail(props) {
  const [subCategory, setSubCategory] = useState([]);
  const [defaultSubCategory, setDefaultSubCategory] = useState([]);
  const [selectedDate, handleDateChange] = useState(null);
  const [assignee, setAssignee] = useState(props.request.staff_groups);
  const [filelist, setFilelist] = useState([]);
  const [oldfilelist, setOldFilelist] = useState([]);
  const [supplyerFlag, setSupplyerFlag] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  useEffect(() => {
    setFilelist([]);
    setOldFilelist([]);
    setBtnLoader(false);
    handleDateChange(null);
    if (props.request.supplier_id != 0) setSupplyerFlag(true);
    else setSupplyerFlag(false);
    attachFiles();
    if (props.request.category_id) {
      handleCategoryChange({ value: props.request.category_id });
    }
  }, [props.request]);

  const attachFiles = () => {
    if (props.request.attach) {
      setOldFilelist(props.request.attach.split("&&"));
    }
  };

  const handleCategoryChange = (elem) => {
    workrequest.getSubCategoryList({ category_id: elem.value }).then((res) =>
      setSubCategory(() => {
        let selected = [];
        let arr = res.content.map((item, i) => {
          if (item.id == props.request.sub_category_id)
            selected.push({ label: item.name, value: item.id });
          return {
            label: item.name,
            value: item.id,
          };
        });
        setDefaultSubCategory(selected);
        return [...arr];
      })
    );
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    let formData = new FormData(e.target);
    let external_supplier = formData.get("external_supplier").split(",");
    let obj = {
      ...props.request,
      category: formData.get("category"),
      category_id: formData.get("category"),
      comment: formData.get("comment"),
      description: formData.get("description"),
      end_time: dateTime(props.request.end_date).time,
      equipment_name: formData.get("equipment"),
      isCreateWO: false,
      start_time: dateTime(props.request.start_date).time,
      sub_category: formData.get("sub_category"),
      sub_category_id: formData.get("sub_category"),
      thumbnails: [],
      requestor: "Ennovatech Admin",
      old_files: [],
      onlydate: "Invalid date",
      onlytime: "Invalid date",
      files: [],
      comment_list: [],
      browser_time: moment().format(),
      staff_groups: assignee,
      status_name: formData.get("update_status") ?? props.request.status_name,
      estimated_duration: formData.get("estimated_time"),
      schedule_date: selectedDate,
      location_id: formData.get("location"),
      supplier_flag: supplyerFlag,
    };

    let fileObj = new FormData();
    fileObj.append("id", props?.request?.id);

    filelist.map((item, i) => {
      fileObj.append(`files[${i}]`, item);
    });

    if (supplyerFlag) {
      if (formData.get("external_supplier").length == 0) {
        toast.error("Please select external supplier");
      } else {
        obj["supplier"] = external_supplier[1];
        obj["supplier_id"] = external_supplier[0];

        workrequest
          .updaterepairrequest(obj, fileObj)
          .then(() => {
            setBtnLoader(false);
            props.reset();
            props.handleClose();
          })
          .catch(() => toast.error("faild to update request"));
      }
    } else {
      workrequest
        .updaterepairrequest(obj, fileObj)
        .then(() => {
          setBtnLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => toast.error("faild to update request"));
    }
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

  const removeOldFile = (index) => {
    setOldFilelist((p) => {
      let arr = p;
      arr.splice(index, 1);
      return [...arr];
    });
  };

  const locationOptions = props.locations?.map((item, i) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const statusOptions =
    props.request.status_name == status.COMPLETED
      ? [
          { value: status.REOPEN, label: status.REOPEN },
          { value: status.COMPLETED, label: status.COMPLETED },
          { value: status.CLOSED, label: status.CLOSED },
        ]
      : [
          { value: status.PENDING, label: status.PENDING },
          { value: status.ASSIGNED, label: status.ASSIGNED },
          { value: status.PROGRESS, label: status.PROGRESS },
          { value: status.HOLD, label: status.HOLD },
          { value: status.COMPLETED, label: status.COMPLETED },
          { value: status.REJECTED, label: status.REJECTED },
          { value: status.APPROVED, label: status.APPROVED },
          { value: status.CLOSED, label: status.CLOSED },
        ];

  const supplierOptions = props.supplyer?.map((item, i) => {
    return {
      label: item.supplier,
      value: item.id + "," + item.supplier,
    };
  });

  const categoryOptions = props.category?.map((item, i) => {
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
            {props.request.category_name}
          </div>
          <div className="float-start ml-4">
            <span
              className={`fill-badge ${props?.request?.priority?.toLowerCase()}`}
            >
              {props.request.priority}
            </span>
            <span
              className={`outline-badge ${props?.request?.status_name?.toLowerCase()}`}
            >
              {props.request.status_name}
            </span>
          </div>
          <button
            // onClick={handleSubmit}
            className="float-end lato-btn btn-update-active mr-1"
            disabled={btnLoader}
          >
            {btnLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                alt="loader"
                width="20px"
              />
            ) : (
              "Update Request"
            )}
          </button>
        </div>
      }
      bodyContainer={
        <div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Request ID</label>
                <div className="lato-input">{props.request.ref_id}</div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
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
                      (option) => option.value === props.request.location_id
                    )}
                  />
                  {/* <select
                    name="location"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    defaultValue={props.request.location_id}
                    id="location"
                  >
                    <option value="">Select</option>
                    {props.locations?.map((item, i) => {
                      return <option value={item.id}> {item.name} </option>;
                    })}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Location Type</label>
                <div className="lato-input">{props.request.location_type}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label>Schedule Date</label>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      clearable
                      value={selectedDate}
                      onChange={handleDateChange}
                      placeholder="click to select"
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label htmlFor="feedback">Update Status</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={statusOptions}
                    isSearchable={false}
                    placeholder="Select"
                    name="update_status"
                    defaultValue={statusOptions?.filter(
                      (option) => option.value === props.request.status_name
                    )}
                    isDisabled={props.request.status_name == status.CLOSED}
                  />
                  {/* <Dropdown
                    keyName="update_status"
                    style={{ outline: "none" }}
                    className={`bg-light mt-1 p-2 w-100 ${
                      props.request.status_name == status.CLOSED
                        ? "opacity-25"
                        : "opacity-100"
                    }`}
                    disable={
                      props.request.status_name == status.CLOSED ? true : false
                    }
                    options={[
                      { value: "select", text: "Select" },
                      { value: status.PENDING, text: status.PENDING },
                      { value: status.ASSIGNED, text: status.ASSIGNED },
                      { value: status.PROGRESS, text: status.PROGRESS },
                      { value: status.HOLD, text: status.HOLD },
                      { value: status.COMPLETED, text: status.COMPLETED },
                      { value: status.REJECTED, text: status.REJECTED },
                      { value: status.APPROVED, text: status.APPROVED },
                      { value: status.CLOSED, text: status.CLOSED },
                    ]}
                    // selected={data.log_type}
                    defaultValue={props.request.status_name}
                    // onChange={(e) => handleChange(e.target)}
                  /> */}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label htmlFor="feedback">External Supplier</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={supplierOptions}
                    isSearchable={true}
                    placeholder="Select"
                    name="external_supplier"
                    defaultValue={supplierOptions?.filter(
                      (option) => option.label === props.request.supplier
                    )}
                  />
                  {/* <Dropdown
                    keyName="external_supplier"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[
                      { value: "select", text: "Select" },
                      ...props.supplyer?.map((item, i) => {
                        return {
                          value: item.id + "," + item.supplier,
                          text: item.supplier,
                        };
                      }),
                    ]}
                    // selected={data.log_type}
                    defaultValue={
                      props.request.supplier_id + "," + props.request.supplier
                    }
                    // onChange={(e) => handleChange(e.target)}
                  /> */}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label htmlFor="feedback">Request Type</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={[]}
                    isSearchable={false}
                    placeholder="Select"
                    name="request_type"
                  />
                  {/* <Dropdown
                    keyName="request_type"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[{ value: "select", text: "Select" }]}
                    // selected={data.log_type}
                    defaultValue={""}
                    // onChange={(e) => handleChange(e.target)}
                  /> */}
                </div>
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
                      (option) => option.value === props.request.category_id
                    )}
                    onChange={handleCategoryChange}
                  />
                  {/* <Dropdown
                    keyName="category"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={[
                      { value: "select", text: "Select" },
                      ...props.category?.map((item, i) => {
                        return { value: item.id, text: item.name };
                      }),
                    ]}
                    // selected={props.request.category_name}
                    defaultValue={props.request.category_id}
                    onChange={(e) => handleCategoryChange(e.target)}
                  /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Sub-Category</label>
                <div>
                  <Select
                    styles={dropdownStyle}
                    options={subCategory}
                    isSearchable={true}
                    placeholder="Select"
                    name="sub_category"
                    value={defaultSubCategory}
                    // defaultValue={subCategory?.filter(
                    //   (option) => option.value === props.request.sub_category_id
                    // )}
                    onChange={(e) => setDefaultSubCategory(e)}
                  />
                  {/* <Dropdown
                    keyName="sub_category"
                    style={{ outline: "none" }}
                    className="bg-light mt-1 p-2 w-100"
                    options={subCategory?.map((item, i) => {
                      return { value: item.id, text: item.name };
                    })}
                    // selected={props.request.sub_category_id}
                    defaultValue={props.request.sub_category_id}
                    // onChange={(e) => handleChange(e.target)}
                  /> */}
                </div>
              </div>
            </div>
            <div className="col-sm-6 bdr-right">
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <div>
                  <input
                    name="comment"
                    type="text"
                    // defaultValue={props.request.complete_comment}
                    className="plain-input"
                    placeholder="Type here.."
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group row m-0 mt-2">
                <ButtonCheckBox
                  containerType="darkgrey"
                  className="col"
                  style={{ width: "100px" }}
                  label="External Supplyer"
                  value={true}
                  name="supplyer"
                  selected={supplyerFlag}
                  onClick={() => setSupplyerFlag((p) => !p)}
                  // onChange={() => setSupplyerFlag((p) => !p)}
                />
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Equipment</label>
                <div>
                  <input
                    type="text"
                    name="equipment"
                    defaultValue={props.request.equip_name}
                    className="plain-input"
                    placeholder="Type here.."
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Equipment ID</label>
                <div className="lato-input">{props.request?.equip_id}</div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Description</label>
                <div>
                  <textarea
                    name="description"
                    placeholder="Type here..."
                    className="plain-input w-100"
                    defaultValue={props.request.comments}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0 bdr-bottom">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Assignee</label>
                <Multiselect
                  customCloseIcon={<i className="fas fa-times ml-2"></i>}
                  displayValue="name"
                  onSelect={(list, item) => setAssignee(list)}
                  onRemove={(list, item) => setAssignee(list)}
                  options={props.staffGroupList}
                  style={{
                    searchBox: {
                      border: "none",
                    },
                    chips: {
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
                  selectedValues={props.request?.staff_groups}
                />
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label>Estimated Time</label>
                <div>
                  <input
                    type="text"
                    name="estimated_time"
                    defaultValue={props.request.estimated_duration}
                    className="plain-input"
                    placeholder="Type here.."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row p-2 container-fluid m-0">
            <div className="form-group">
              <img
                src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                alt="service"
                style={{ width: "34px" }}
              />
              <span className="ml-4 lato-sub-head">Attached files</span>
            </div>
            <div className="row p-2 container-fluid m-0">
              <div className="form-group row">
                {oldfilelist?.map((elem, i) => {
                  return (
                    <div
                      style={{ color: "#21BFAE" }}
                      key={i}
                      className="col-auto image-container mt-2 pl-1 pr-1"
                    >
                      <img
                        src={baseUrl + elem}
                        alt=""
                        className="display-image"
                      />
                      <i
                        className="fas fa-times-circle text-danger img-delete float-right"
                        onClick={() => removeOldFile(i)}
                      ></i>
                    </div>
                  );
                })}
                {filelist?.map((elem, i) => {
                  return (
                    <div
                      style={{ color: "#21BFAE" }}
                      key={i}
                      className="col-auto image-container mt-2 pl-1 pr-1"
                    >
                      <img
                        src={URL.createObjectURL(elem)}
                        alt=""
                        className="display-image"
                      />
                      <i
                        className="fas fa-times-circle text-danger img-delete float-right"
                        onClick={() => removeFile(i)}
                      ></i>
                    </div>
                  );
                })}
                <div className="col-auto image-container mt-2 pl-1 pr-1">
                  <FileUpload
                    keyName="files"
                    className="file-upload-btn"
                    title={
                      <>
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/images/upload-image-icon.svg"
                          }
                          alt="service"
                          style={{ width: "40px" }}
                        />
                        <div className="mt-3 lato-input">Upload Image</div>
                      </>
                    }
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                </div>
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
              ></Tab>
              <Tab
                eventKey="notification"
                title={
                  <span className="lato-sub-tab"> Notification History </span>
                }
                className="bdr-right"
              ></Tab>
              <Tab
                eventKey="chat"
                title={<span className="lato-sub-tab">Chat</span>}
              ></Tab>
            </Tabs>
          </div>
        </div>
      }
    />
  );
}

export default RequestDetail;
