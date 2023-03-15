import React, { useState } from "react";
import Dropdown from "../../../../../common/FormElements/Dropdown";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import SimpleTable from "../../../../../common/SimpleTable";
import Select from "react-select";
import dropdownStyle from "../../../../../config/dropdownStyle";
import dateTime from "../../../../../helper/dateTime";
import { useEffect } from "react";
import workorderService from "../../../../../services/Engineering/workorder/workorder";
import { Tab, Tabs } from "react-bootstrap";
import { Controller, get, useForm } from "react-hook-form";
import "../../../../../css/pages/workorder.scss";
import FileUpload from "../../../../../common/FormElements/FileUpload";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { toast } from "react-toastify";
import { useAuthState } from "../../../../../store/context";
import { baseUrl } from "../../../../../config/app";
import ConfirmBox from "../../../../../common/Modals/ConfirmBox";

function UpdateOrder(props) {
  const [disableUpdate, setdisableUpdate] = useState(false);
  const [workHistory, setWorkHistory] = useState([]);
  const [workStaff, setWorkStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [filelist, setFilelist] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [equipId, setEquipId] = useState("");
  const [loader, setLoader] = useState(true);
  const [saveLoader, setSaveLoader] = useState(false);
  const [changeFlag, setChangeFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteValue, setDeleteValue] = useState({});
  const disableOtp = {
    name: false,
    asset_name: false,
    type: false,
    priority: false,
    description: false,
    estimated: false,
    status: false,
  };
  const [disable, setDisable] = useState(disableOtp);
  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
    getValues,
  } = useForm();
  const {
    user: { id, property_id },
  } = useAuthState();

  useEffect(() => {
    if (props.show) {
      resetValues();
    } else {
      setSelectedStaff([]);
    }
  }, [props.show]);

  const resetValues = () => {
    disableFields();
    let val = equipmentOption.filter(
      (item) => item.label == props.order.equipment_name
    );
    setFilelist(props.order.filelist);
    reset({
      asset_id: props.order.equipment_id,
      comment: props.order.description,
      description: props.order.description,
      equipment_name: val[0]?.value ? val[0]?.value : "",
      estimated_duration: props.order.estimated_duration,
      location: props.order.location_id,
      name: props.order.name,
      staff: undefined,
      type: props.order.work_order_type,
      priority: props.order.priority,
    });
    let arr = props.equipments.filter(
      (item) => item.id == props.order.equipment_id
    );
    setEquipId(arr[0]?.equip_id);
    setSelectedDate({
      created_date: new Date(props.order.created_date),
      start_date: new Date(props.order.purpose_start_date),
      schedule_date: new Date(props.order.schedule_date),
      due_date: new Date(props.order.due_date),
    });
    setSelectedStaff(
      props.stafflist.filter(function (o1) {
        return props.order.staff_group.some(function (o2) {
          return o1.id === o2.staff_id; // return the ones with equal id
        });
      })
    );
    fetchWorkHistory();
    fetchWorkStaflist();
    setDeleteValue({});
  };

  const disableFields = () => {
    const obj = {
      ...disableOtp,
      name: true,
      asset_name: true,
      type: true,
      description: true,
    };
    switch (props.order.status) {
      case "Pending":
        setDisable(disableOtp);
        break;
      case "In Progress":
        setDisable(obj);
        break;
      case "On Hold":
        setDisable(obj);
        break;
      case "Completed":
        setDisable({
          ...obj,
          estimated: true,
          status: true,
        });
        break;

      default:
        break;
    }
  };

  const fetchWorkHistory = () => {
    workorderService
      .getworkorderhistorylist({ id: props.order.id })
      .then((res) => {
        setWorkHistory(res.content);
        setLoader(false);
      });
  };

  const fetchWorkStaflist = () => {
    workorderService
      .getworkorderstafflist({ workorder_id: props.order.id })
      .then((res) => setWorkStaff(res.datalist));
  };

  const equipmentOption = props.equipments?.map((item, i) => {
    return { value: i, label: item.name };
  });

  const locationOption = props.locations?.map((item, i) => {
    return { value: item.id, label: item.name + " - " + item.type };
  });

  const addStaff = () => {
    if (getValues("staff") != undefined) {
      setSelectedStaff((p) => {
        let i = getValues("staff");
        let arr = p.filter((item) => item.id == props.stafflist[i].id);
        if (arr.length == 0) return [...p, props.stafflist[i]];
        else return [...p];
      });
    } else {
      toast.error("Please select staff");
    }
  };

  const removeStaff = (i) => {
    setSelectedStaff((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0].size <= 10000000) {
      let formData = new FormData();
      formData.append("id", props.order.id);
      formData.append("user_id", id);
      formData.append(`files[0]`, e.target.files[0]);
      workorderService
        .uploadfilestoworkorder(formData)
        .then((res) => {
          toast.success("file uploaded successfully");
          setFilelist((p) => {
            return [...p, res.content[0]];
          });
        })
        .catch(() => toast.error("failed to upload files"));
    } else {
      toast.error("Please upload file less then or equals to 10MB");
    }
  };

  const removeFile = (i, id) => {
    workorderService.deletefilefromworkorder({ id: id }).then(() => {
      toast.success("file deleted sucessfully");
      setFilelist((p) => {
        let arr = p;
        arr.splice(i, 1);
        return [...arr];
      }).catch(() => toast.error("failed to delete file"));
    });
  };

  const handleDateChange = (date, value) => {
    setSelectedDate((p) => {
      let obj = p;
      obj[value] = date;
      return { ...obj };
    });
  };

  const handleInputChange = (e) => {
    if (e.value.length > 0) setdisableUpdate(false);
    else setdisableUpdate(true);
  };

  const prepareStaffArr = (val) => {
    let arr = val.map((item) => {
      let obj = item;

      obj["staff_id"] = item.id;
      obj["staff_cost"] = item.cost;
      obj["staff_name"] = item.name;
      obj["staff_type"] = item.type;

      delete obj.id;
      delete obj.cost;
      delete obj.name;
      delete obj.type;
      delete obj.label;
      delete obj.active_status;

      return obj;
    });
    return arr;
  };

  const prepareObj = (data) => {
    let obj = {
      ...props.order,
      requestor_name: "",
      staff_id: 0,
      staff_name: "",
      staff_type: "",
    };

    delete obj.picture;
    delete obj.age_days;
    delete obj.assignee;
    delete obj.ref_id;

    obj["eq_id"] = equipId;
    obj["name"] = data.name;
    obj["equipment_id"] = props.equipments[data.equipment_name]?.id;
    // obj["location_id"] = data.location;
    obj["description"] = data.comment;
    obj["staff_group"] = prepareStaffArr(selectedStaff);
    // obj["created_date"] = dateTime(selectedDate.created_date).yyyy_mm_dd_tt;
    // obj["due_date"] = dateTime(selectedDate.due_date).yyyy_mm_dd_tt;
    // obj["purpose_start_date"] = dateTime(selectedDate.start_date).yyyy_mm_dd_tt;
    obj["schedule_date"] = dateTime(selectedDate.schedule_date).yyyy_mm_dd_tt;
    obj["work_order_type"] = data.type;
    obj["priority"] = data.priority;
    obj["estimated_duration"] = data.estimated_duration;
    obj["status"] = data.status ? data.status : props.order.status;

    return obj;
  };

  const updateOrder = (data) => {
    setdisableUpdate(true);
    setSaveLoader(true);
    workorderService
      .updateworkorder(prepareObj(data))
      .then(() => {
        toast.success("work order updated successfully");
        setdisableUpdate(false);
        setSaveLoader(false);
        props.reset();
        props.handleClose();
      })
      .catch(() => toast.error("fail to update request"));

    if (changeFlag) {
      workorderService
        .changestatus(prepareObj(data))
        .catch(() => toast.error("fail to change status"));
    }
  };

  const passValue = (data, i) => {
    setDeleteValue({ data: data, i: i });
    setDeleteFlag(true);
  };

  const removehistory = () => {
    workorderService
      .deleteworkorderhistory({ ...deleteValue.data })
      .then(() => {
        setWorkHistory((p) => {
          let arr = p;
          arr.splice(deleteValue.i, 1);
          return [...arr];
        });
        toast.success("record deleted successfully");
        setDeleteFlag(false);
      })
      .catch(() => toast.error("fail to delete history"));
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(updateOrder)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="float-start pt-1 pl-2 lato-canvas-title">
            {props.order?.ticket_id}
          </div>
          <div className="float-start ml-4">
            <span
              className={`outline-badge mr-1 ${props.order?.work_order_type?.toLowerCase()}`}
            >
              {props.order?.work_order_type}
            </span>
            <span
              className={`fill-badge ${props.order?.priority?.toLowerCase()}`}
            >
              {props.order?.priority}
            </span>
          </div>
          <button
            type="submit"
            className={`float-end lato-btn mr-1 ${
              disableUpdate ? "btn-update" : "btn-update-active"
            }`}
            disabled={disableUpdate}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                alt="loader"
                width="15px"
              />
            ) : (
              "Update Request"
            )}
          </button>
        </div>
      }
      bodyContainer={
        <div className="order-canvas-body">
          <div className="row container-fluid m-0 p-2">
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label className="hashtag-icon">Name</label>
                <div>
                  <input
                    type="text"
                    name="name"
                    className="plain-input"
                    disabled={disable.name}
                    {...register("name", { required: true })}
                    onChange={(e) => handleInputChange(e.target)}
                  />
                  {errors?.name && (
                    <p className="text-danger export-excel">
                      Please enter name
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label className="camera-icon">Asset Name</label>
                <div>
                  <Controller
                    control={control}
                    name="equipment_name"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{ ...register("equipment_name") }}
                          styles={dropdownStyle}
                          options={equipmentOption}
                          placeholder="select"
                          defaultValue={equipmentOption.filter(
                            (item) => item.label == props.order.equipment_name
                          )}
                          isDisabled={disable.asset_name}
                          onChange={(val) => {
                            onChange(val.value);
                            setEquipId(props.equipments[val.value].equip_id);
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right">
              <div className="form-group">
                <label className="hashtag-icon">Asset ID</label>
                <input
                  type="text"
                  name="asset_id"
                  className="plain-input"
                  value={equipId}
                  {...register("asset_id")}
                  disabled
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label className="location-icon">Location</label>
                <div className="lato-input">
                  {/* <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{ ...register("location") }}
                          styles={{
                            ...dropdownStyle,
                            dropdownIndicator: (provided) => ({
                              ...provided,
                              display: "none",
                            }),
                          }}
                          options={locationOption}
                          placeholder="select"
                          defaultValue={locationOption.filter(
                            (item) => item.value == props.order.location_id
                          )}
                          onChange={(val) => onChange(val.value)}
                        />
                      </>
                    )}
                  /> */}
                  {props.order.location_name +
                    " - " +
                    props.order.location_type}
                </div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="row container-fluid m-0 p-2 bdr-bottom">
            <div className="col-sm-9 bdr-right">
              <div className="form-group">
                <label className="note-icon">Comment</label>
                <div>
                  <input
                    type="text"
                    name="comment"
                    className="plain-input w-100 bg-light p-2"
                    disabled={disable.description}
                    // defaultValue={props.order.description}
                    {...register("comment")}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3 pl-3">
              <div className="form-group">
                <label className="update-icon">Update Status</label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("status") }}
                        styles={dropdownStyle}
                        options={[
                          { value: "Pending", label: "Pending" },
                          { value: "In Progress", label: "In Progress" },
                          { value: "On Hold", label: "On Hold" },
                          { value: "Completed", label: "Completed" },
                        ]}
                        isSearchable={false}
                        isDisabled={disable.status}
                        defaultValue={[
                          {
                            value: props.order.status,
                            label: props.order.status,
                          },
                        ]}
                        placeholder="select"
                        onChange={(val) => {
                          onChange(val.value);
                          setChangeFlag(true);
                        }}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="row container-fluid m-0 p-2 bdr-bottom">
            <div className="col-sm-3 pl-3 bdr-right">
              <div className="form-group">
                <label className="request-type-icon">Type</label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("type") }}
                        styles={dropdownStyle}
                        options={[
                          { value: "Repairs", label: "Repairs" },
                          { value: "Requests", label: "Requests" },
                          { value: "Preventive", label: "Preventive" },
                          { value: "Upgrade", label: "Upgrade" },
                          { value: "New", label: "New" },
                        ]}
                        isSearchable={false}
                        isDisabled={disable.type}
                        defaultValue={[
                          {
                            value: props.order.work_order_type,
                            label: props.order.work_order_type,
                          },
                        ]}
                        placeholder="select"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-sm-3 pl-3 bdr-right">
              <div className="form-group">
                <label className="priority-icon">Priority</label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("priority") }}
                        styles={dropdownStyle}
                        options={[
                          { value: "Low", label: "Low" },
                          { value: "Medium", label: "Medium" },
                          { value: "High", label: "High" },
                          { value: "Urgent", label: "Urgent" },
                        ]}
                        isSearchable={false}
                        isDisabled={disable.priority}
                        defaultValue={[
                          {
                            value: props.order.priority,
                            label: props.order.priority,
                          },
                        ]}
                        placeholder="select"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          {selectedStaff?.length > 0 ? (
            <>
              <SimpleTable
                loader={false}
                key={`staff`}
                columns={[
                  { key: "name", label: "Staff", width: "150" },
                  { key: "type", label: "Type", width: "150" },
                  { key: "cost", label: "Cost", width: "150" },
                  {
                    key: "asa",
                    label: "Action",
                    width: "150",
                    template: ({ ind }) => (
                      <div>
                        <span
                          className="cursor-pointer outline-badge red"
                          onClick={() => removeStaff(ind)}
                        >
                          Remove
                        </span>
                      </div>
                    ),
                  },
                ]}
                data={selectedStaff}
              />
            </>
          ) : (
            ""
          )}
          <div className="row container-fluid m-0 p-2">
            <div className="col-sm-12 pl-3">
              <div className="form-group">
                <label className="staff-icon">Staff</label>
                <Controller
                  control={control}
                  name="staff"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("staff") }}
                        styles={dropdownStyle}
                        options={props.stafflist?.map((item, i) => {
                          return { label: item.name, value: i };
                        })}
                        isSearchable={true}
                        placeholder="select"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <div
            className="color-green bdr-top bdr-bottom cursor-pointer lato-sub-td"
            style={{ padding: "10px 0px 10px 20px" }}
            onClick={addStaff}
          >
            Add Another
          </div>
          {/* {selectedPartGroup?.length > 0 ? (
            <>
              <SimpleTable
                loader={false}
                key={`staff`}
                columns={[
                  { key: "name", label: "Staff", width: "150" },
                  { key: "type", label: "Type", width: "150" },
                  { key: "cost", label: "Cost", width: "150" },
                  {
                    key: "asa",
                    label: "Action",
                    width: "150",
                    template: ({ ind }) => (
                      <div>
                        <span
                          className="cursor-pointer outline-badge hold"
                          onClick={() => removePartGroup(ind)}
                        >
                          Remove
                        </span>
                      </div>
                    ),
                  },
                ]}
                data={selectedPartGroup}
              />
            </>
          ) : (
            ""
          )} */}
          <div className="row container-fluid m-0 p-2">
            <div className="col-sm-12 pl-3">
              <div className="form-group">
                <label className="staff-icon">Part Group</label>
                <Controller
                  control={control}
                  name="part_group"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("part_group") }}
                        styles={dropdownStyle}
                        options={[]}
                        isSearchable={true}
                        placeholder="select"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <div
            className="color-green bdr-top lato-sub-td"
            style={{ padding: "10px 0px 10px 20px", cursor: "pointer" }}
            // onClick={addPartGroup}
          >
            Add Another
          </div>
          <div className="blank-container"></div>
          <div className="row container-fluid m-0 p-2 bdr-bottom">
            <div className="col-sm-3 bdr-right pl-3">
              <div className="form-group">
                <label className="calendar-icon">Created Date</label>
                <div className="lato-input">
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      clearable
                      InputProps={{ readOnly: true }}
                      value={selectedDate?.created_date}
                      onChange={(date) =>
                        handleDateChange(date, "created_date")
                      }
                    />
                  </MuiPickersUtilsProvider> */}
                  {dateTime(props.order.created_date).dateMonthYear}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right pl-3">
              <div className="form-group">
                <label className="calendar-icon">Start Date</label>
                <div className="lato-input">
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      clearable
                      InputProps={{ readOnly: true }}
                      value={selectedDate?.start_date}
                      onChange={(date) => handleDateChange(date, "start_date")}
                    />
                  </MuiPickersUtilsProvider> */}
                  {dateTime(props.order.purpose_start_date).dateMonthYear}
                </div>
              </div>
            </div>
            <div className="col-sm-3 bdr-right pl-3">
              <div className="form-group">
                <label className="calendar-icon">Schedule Date</label>
                <div className="lato-input">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      clearable
                      InputProps={{ readOnly: true }}
                      value={selectedDate?.schedule_date}
                      onChange={(date) =>
                        handleDateChange(date, "schedule_date")
                      }
                    />
                  </MuiPickersUtilsProvider>
                  {/* {dateTime(props.order.schedule_date).dateMonthYear} */}
                </div>
              </div>
            </div>
            <div className="col-sm-3 pl-3">
              <div className="form-group">
                <label className="calendar-icon">Due Date</label>
                <div className="lato-input">
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      clearable
                      InputProps={{ readOnly: true }}
                      value={selectedDate?.due_date}
                      onChange={(date) => handleDateChange(date, "due_date")}
                    />
                  </MuiPickersUtilsProvider> */}
                  {dateTime(props.order.due_date).dateMonthYear}
                </div>
              </div>
            </div>
          </div>
          <div className="row container-fluid m-0 p-2">
            <div className="col-sm-3 bdr-right pl-3">
              <div className="form-group">
                <label className="clock-icon">Estimated Time</label>
                <div>
                  <input
                    type="number"
                    name="estimated_duration"
                    className="plain-input"
                    disabled={disable.estimated}
                    defaultValue={props.order.estimated_duration}
                    {...register("estimated_duration")}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-9 pl-3">
              <div className="form-group">
                <label className="note-icon">Description</label>
                <div>
                  <input
                    type="text"
                    name="description"
                    className="plain-input"
                    defaultValue={props.order.description}
                    {...register("description")}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="p-3 container-fluid m-0 bdr-bottom">
            <img
              src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
              alt="service"
              style={{ width: "34px" }}
            />
            <span className="ml-4 lato-sub-head">Attached files</span>
          </div>
          <div className="row p-2 container-fluid m-0">
            {filelist?.map((elem, i) => {
              return (
                <>
                  {elem?.path?.length > 0 ? (
                    <section
                      style={{ color: "#21BFAE" }}
                      key={i}
                      className="col-auto image-container mt-2 pl-1 pr-2"
                    >
                      <img
                        src={baseUrl + elem.path}
                        alt=""
                        className="display-image"
                      />
                      <i
                        className="fas fa-times-circle text-danger img-delete float-right"
                        onClick={() => removeFile(i, elem.id)}
                      ></i>
                    </section>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
            <section className="col-auto image-container mt-2 mb-2 pl-2 pr-2">
              <FileUpload
                keyName="files"
                className="file-upload-btn"
                title={
                  <>
                    <img
                      src={
                        process.env.PUBLIC_URL + "/images/upload-image-icon.svg"
                      }
                      alt="service"
                      style={{ width: "40px" }}
                    />
                    <section className="mt-3 lato-input">Upload Image</section>
                  </>
                }
                onChange={(e) => handleFileChange(e)}
                multiple
              />
            </section>
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
                title={<span className="lato-sub-tab">Update History </span>}
                className="bdr-right"
              >
                <SimpleTable
                  loader={loader}
                  key={`history`}
                  columns={[
                    {
                      key: "setdate",
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
                    { key: "status", label: "Status", width: "150" },
                    { key: "log_kind", label: "Type", width: "150" },
                    { key: "description", label: "Commment", width: "150" },
                    { key: "method", label: "Method", width: "100" },
                    {
                      key: "action",
                      label: "Action",
                      width: "80",
                      template: ({ data, ind }) => (
                        <div>
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/red-minus-circle.svg"
                            }
                            alt="service"
                            onClick={() => passValue(data, ind)}
                          />
                        </div>
                      ),
                    },
                  ]}
                  data={workHistory}
                />
              </Tab>
              <Tab
                eventKey="staff"
                title={<span className="lato-sub-tab">Staff</span>}
              >
                <SimpleTable
                  loader={loader}
                  key={`staff`}
                  columns={[
                    { key: "user_name", label: "Staff", width: "150" },
                    { key: "status", label: "Status", width: "150" },
                    { key: "staff_cost", label: "Cost", width: "150" },
                  ]}
                  data={workStaff}
                />
              </Tab>
            </Tabs>
          </div>
          <ConfirmBox
            show={deleteFlag}
            onHide={() => setDeleteFlag(false)}
            ondelete={removehistory}
          />
        </div>
      }
    />
  );
}

export default UpdateOrder;
