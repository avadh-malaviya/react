import React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import Select, { components } from "react-select";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Icon from "@material-ui/core/Icon";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import FileUpload from "../../../../../common/FormElements/FileUpload";
import { toast } from "react-toastify";
import { useEffect } from "react";
import SimpleTable from "../../../../../common/SimpleTable";
import workorderService from "../../../../../services/Engineering/workorder/workorder";
import { useAuthState } from "../../../../../store/context";
import dateTime from "../../../../../helper/dateTime";

function CreateOrder(props) {
  const [disableSave, setDisableSave] = useState(true);
  const [stateone, setStateone] = useState(false);
  const [statetwo, setStatetwo] = useState(true);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [filelist, setFilelist] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [checklistFile, setChecklistFile] = useState({});
  const [checkList, setCheckList] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [equipId, setEquipId] = useState("");
  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
    getValues,
  } = useForm();
  const {
    user: { id, property_id, dept_id, job_role_id },
  } = useAuthState();

  useEffect(() => {
    if (props.show) resetValues();
  }, [props.show]);

  const resetValues = () => {
    reset({
      heading: "",
      priority: "Low",
      type: "Repairs",
      asset: null,
      staff: undefined,
      description: "",
    });
    setEquipId("");
    setSelectedStaff([]);
    setFilelist([]);
    setChecklistFile({});
    setScheduleDate(new Date());
    setStatetwo(true);
    setStateone(false);
    setDisableSave(true);
    setSaveLoader(false);
  };

  const handleFileChange = (e) => {
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

  const addStaff = () => {
    if (getValues("staff") != undefined) {
      setSelectedStaff((p) => {
        console.log(p);
        let i = getValues("staff");
        let arr = p.filter((item) => item.id == props.stafflist[i].id);
        if (arr.length == 0) return [...p, props.stafflist[i]];
        else return [...p];
      });
    } else {
      toast.error("Please select staff");
    }
  };

  const getCheckList = () => {
    // it is uncalled beacuse there is no ui dropdown is available in figma
    let equipId = props.equipments[getValues("asset")].id;
    let obj = {
      name: getValues("heading"),
      equipment_id: equipId == undefined ? "" : equipId,
      work_order_type: getValues("type") == undefined ? "" : getValues("type"),
      location_id:
        getValues("location") == undefined ? "" : getValues("location"),
    };
    workorderService.getchecklist(obj).then((res) => setCheckList(res));
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
    let obj = {};

    obj["equip_id"] = equipId;
    obj["equipment_id"] = props.equipments[data.asset]?.id
      ? props.equipments[data.asset]?.id
      : null;
    obj["equipment_name"] = props.equipments[data.asset]?.name
      ? props.equipments[data.asset]?.name
      : "";
    obj["frequency_unit"] = "Days";
    obj["location_id"] = data.location;
    obj["location_name"] = "12";
    obj["location_type"] = "Floor";
    obj["name"] = data.heading;
    obj["part_group"] = [];
    obj["priority"] = data.priority;
    obj["property_id"] = property_id;
    obj["schedule_date"] = dateTime(scheduleDate).yyyy_mm_dd_tt;
    obj["staff_group"] = prepareStaffArr(selectedStaff);
    obj["user_id"] = id;
    obj["work_order_type"] = data.type;
    obj["description"] = data.description;

    return obj;
  };

  const createOrder = (data) => {
    setDisableSave(true);
    setSaveLoader(true);
    workorderService.createworkorder(prepareObj(data)).then(() => {
      toast.success("work order created successfully");
      setSaveLoader(false);
      props.reset();
      props.handleClose();
    });
  };

  const handleFeildChange = (e) => {
    if (e.label) {
      if (getValues("heading").length > 0) setDisableSave(false);
      else setDisableSave(true);
    } else {
      if (getValues("location") != undefined) setDisableSave(false);
      else setDisableSave(true);
    }
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createOrder)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={
                process.env.PUBLIC_URL + "/images/create-new-guest-service.svg"
              }
              className="ml-2"
              style={{ width: "40px" }}
            />
            <div className="col-auto mb-0 lato-canvas-title">
              Create New Work Order
            </div>
          </div>
          <button
            className={`float-end lato-btn mr-1 ${
              disableSave ? "btn-update" : "btn-update-active"
            }`}
            disabled={disableSave}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                alt="loader"
                width="20px"
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      }
      bodyContainer={
        <div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 p-2 bdr-bottom">
            <div className="pt-0">
              <img
                src={process.env.PUBLIC_URL + "/images/work-information.svg"}
                alt="service"
                style={{ width: "16px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">
                Work Information
              </span>
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-2">
              <InputField
                keyName="heading"
                label="Heading"
                validation={{ ...register("heading", { required: true }) }}
                onChange={(e) => handleFeildChange(e.target)}
              />
              {errors?.heading && (
                <p className="text-danger export-excel">Please enter Heading</p>
              )}
            </div>
            <div className="col p-2">
              <Controller
                control={control}
                name="asset"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("asset") }}
                      styles={floatLabel.bgWhite}
                      options={props.equipments?.map((item, i) => {
                        return { value: i, label: item.name };
                      })}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Asset"
                      onChange={(val) => {
                        onChange(val.value);
                        setEquipId(props.equipments[val.value].equip_id);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="col p-2">
              <InputField
                keyName="asset_id"
                label="Asset ID"
                value={equipId}
                disabled
              />
            </div>
            <div className="col p-2">
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("location", { required: true }) }}
                      styles={floatLabel.bgWhite}
                      options={props.locations?.map((item, i) => {
                        return {
                          value: item.id,
                          label: item.name + " - " + item.type,
                        };
                      })}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Location"
                      onChange={(val) => {
                        onChange(val.value);
                        handleFeildChange(val);
                      }}
                    />
                  </>
                )}
              />
              {errors?.location && (
                <p className="text-danger export-excel">
                  Please select Location
                </p>
              )}
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 p-2 bdr-bottom">
            <div className="pt-0">
              <img
                src={process.env.PUBLIC_URL + "/images/more-details.svg"}
                alt="service"
                style={{ width: "16px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">More Details</span>
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col-md-3 p-2">
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("type") }}
                      styles={{
                        ...floatLabel.bgWhite,
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: "uset",
                        }),
                      }}
                      options={[
                        { value: "Repairs", label: "Repairs" },
                        { value: "Requests", label: "Requests" },
                        { value: "Preventive", label: "Preventive" },
                        { value: "Upgrade", label: "Upgrade" },
                        { value: "New", label: "New" },
                      ]}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Type"
                      defaultValue={{ value: "Repairs", label: "Repairs" }}
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            <div className="col-md-3 p-2">
              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("priority") }}
                      styles={{
                        ...floatLabel.bgWhite,
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: "uset",
                        }),
                      }}
                      options={[
                        { value: "Low", label: "Low" },
                        { value: "Medium", label: "Medium" },
                        { value: "High", label: "High" },
                        { value: "Urgent", label: "Urgent" },
                      ]}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Priority"
                      defaultValue={{ value: "Low", label: "Low" }}
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            <div className="col-md-3 p-2">
              <div className="label-float" style={{ padding: "3px" }}>
                <label className={scheduleDate == null ? "" : "floatup"}>
                  Schedule Date
                </label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    InputProps={{ readOnly: true }}
                    value={scheduleDate}
                    onChange={(date) => setScheduleDate(date)}
                    format="dd/MM/yyyy hh:mm a"
                    keyboardIcon={
                      <Icon>
                        <img
                          src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                          width="18px"
                        />
                      </Icon>
                    }
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-2">
              <InputField
                keyName="description"
                label="Description"
                validation={{ ...register("description") }}
              />
            </div>
          </div>
          {selectedStaff?.length > 0 ? (
            <SimpleTable
              loader={false}
              key={`staff`}
              columns={[
                { key: "autoindexing", label: "No.", width: "50" },
                { key: "name", label: "Staff", width: "150" },
                { key: "type", label: "Type", width: "150" },
                { key: "cost", label: "Cost", width: "150" },
                {
                  key: "asa",
                  label: "Action",
                  width: "150",
                  template: ({ ind }) => (
                    <div
                      onClick={() =>
                        setSelectedStaff((p) => {
                          let arr = p;
                          arr.splice(ind, 1);
                          return [...arr];
                        })
                      }
                    >
                      <span className="outline-badge red">Remove</span>
                    </div>
                  ),
                },
              ]}
              data={selectedStaff}
            />
          ) : (
            ""
          )}
          <div className="container-fluid row m-0 p-2">
            <div className="col-12 p-2">
              <Controller
                control={control}
                name="staff"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("staff") }}
                      styles={floatLabel.bgWhite}
                      options={props.stafflist?.map((item, i) => {
                        return { value: i, label: item.name };
                      })}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Add Staff"
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            <div
              className="color-green lato-sub-td"
              style={{ padding: "0px 0px 0px 20px", cursor: "pointer" }}
              onClick={addStaff}
            >
              Add Another
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col-12 p-2">
              <Controller
                control={control}
                name="part_list"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("part_list") }}
                      styles={{
                        ...floatLabel.bgWhite,
                      }}
                      //   options={locations?.map((item) => {
                      //     return { value: item.id, label: item.name };
                      //   })}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Add Part"
                      //   defaultValue={
                      //     props?.detail?.location_name
                      //       ? {
                      //           value: props?.detail?.location_group_member_id,
                      //           label: props?.detail?.location_name,
                      //         }
                      //       : ""
                      //   }
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            <div
              className="color-green lato-sub-td"
              style={{ padding: "0px 0px 10px 20px", cursor: "pointer" }}
            >
              Add Another
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 p-2 bdr-bottom">
            <div className="pt-0">
              <img
                src={process.env.PUBLIC_URL + "/images/checklist-icon.svg"}
                alt="service"
                style={{ width: "16px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">Checklist</span>
            </div>
          </div>
          <div className="container-fluid row m-0 p-2 bdr-bottom">
            <div className="col p-2">
              <InputField keyName="description" label="Description" />
            </div>
            <div className="col p-2 row m-0 align-items-center">
              <ButtonCheckBox
                containerType="darkgrey"
                className="col-auto"
                // style={{ width: "100px" }}
                label="Yes"
                value={true}
                name="stateone"
                selected={stateone}
                onClick={() => setStateone((p) => !p)}
              />
              <ButtonCheckBox
                containerType="darkgrey"
                className="col-auto"
                // style={{ width: "100px" }}
                label="Yes"
                value={false}
                name="statetwo"
                selected={statetwo}
                onClick={() => setStatetwo((p) => !p)}
              />
              <FileUpload
                keyName="files"
                style={{}}
                className="btn-update lato-submit col-4 p-2 ml-2 text-center"
                title="Upload File"
                onChange={(e) => setChecklistFile(e.target.files[0])}
                multiple
              />
            </div>
          </div>
          <div className="container-fluid m-0 p-2">
            <div
              className="color-green lato-sub-td"
              style={{ padding: "0px 0px 0px 20px", cursor: "pointer" }}
            >
              Add Another
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 p-2 bdr-bottom">
            <div className="pt-0">
              <img
                src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                alt="service"
                style={{ width: "16px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">Attach Files</span>
            </div>
          </div>
          <div className="container-fluid m-0 p-2">
            <div
              className={`form-group row m-0 ${
                filelist.length == 0 ? "d-none" : ""
              }`}
            >
              {filelist?.map((elem, i) => {
                return (
                  <div
                    style={{ color: "#21BFAE" }}
                    key={i}
                    className="col-auto image-container p-0 m-2"
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
            </div>
            <div className="row p-3 m-0 align-items-center">
              <FileUpload
                keyName="attach_files"
                className="btn-update lato-btn col-2 p-2 text-center"
                title="Upload File"
                onChange={(e) => handleFileChange(e)}
                multiple
              />
              <label className="col ml-3">
                *Upload .jpg,.jpeg,.pdf,.msg and .eml file with maximum size of
                10MB is allowed
              </label>
            </div>
          </div>
        </div>
      }
    />
  );
}
export default CreateOrder;
