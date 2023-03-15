import React, { useState } from "react";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";
import InputField from "../../../../../common/FormElements/InputField";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import { toast } from "react-toastify";
import FileUpload from "../../../../../common/FormElements/FileUpload";
import SimpleTable from "../../../../../common/SimpleTable";
import deviceService from "../../../../../services/guestservice/settings/device/device";
import { useEffect } from "react";
import ListService from "../../../../../services/list";

function CreateDevice(props) {
  const [disable, setDisable] = useState(false);
  const [enablePriority, setEnablePriority] = useState(0);
  const [filelist, setFilelist] = useState([]);
  const [enable, setEnable] = useState(2);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [deptFun, setDeptFun] = useState([]);
  const [locationGroup, setLocationGroup] = useState([]);
  const [building, setBuilding] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // State for the selected values
  const [selType, setSelType] = useState([]);
  const [selDeptFun, setSelDeptFun] = useState([]);
  const [selSecDeptFun, setSelSecDeptFun] = useState([]);
  const [selLocGrp, setSelLocGrp] = useState([]);
  const [selSecLocGrp, setSelSecLocGrp] = useState([]);
  const [selBuilding, setSelBuilding] = useState([]);
  const [selDeviceId, setSelDeviceId] = useState([]);

  useEffect(() => {
    if (props.tab == "devices") {
      if (props.show) {
        if (props.data == null) resetValues();
        else formValues(props.data);
      } else {
        getDeviceId();
        getDeviceList();
        getDeptFun();
        getLocationGroup();
        getBuilding();
      }
    }
  }, [props.show, props.tab]);

  const resetValues = () => {
    setSelType([{ value: "Mobile", label: "Mobile" }]);
    setSelDeptFun([]);
    setSelSecDeptFun([]);
    setSelLocGrp([]);
    setSelSecLocGrp([]);
    setSelBuilding([]);
    setSelDeviceId([]);
    setSaveLoader(false);
    reset({
      device_id: 0,
      name: "",
      number: "",
      type: "Mobile",
    });
  };

  const getDeviceList = () => {
    deviceService.getdevicelist({ val: "" }).then((res) => setDeviceList(res));
  };

  const getDeviceId = () => {
    ListService.getdevicesidlist().then((res) =>
      setDeviceId(
        res.map((item) => {
          return { value: item.device_id, label: item.device_id };
        })
      )
    );
  };

  const getDeptFun = () => {
    ListService.getdepartmentfunction().then((res) => setDeptFun(res));
  };

  const getLocationGroup = () => {
    ListService.getlocationgroups().then((res) => setLocationGroup(res));
  };

  const getBuilding = () => {
    ListService.getbuildinglist().then((res) => setBuilding(res));
  };

  const handleFileChange = (e) => {
    console.log("file", e.target.files[0]);
    if (e.target.files[0].type == "text/csv") {
      setFilelist((p) => {
        return [...p, e.target.files[0]];
      });
    } else {
      toast.error("Please upload .csv file");
    }
  };

  const removeFile = (i) => {
    setFilelist((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
  };

  const arrayToString = (arr, key) => {
    let strArr = [];
    arr.map((item) => strArr.push(item[key]));
    return strArr.toString();
  };

  const stringToArray = (str, arr, key) => {
    let val = str.split(",");
    let selectedArr = arr.filter(function (o1) {
      return val.some(function (o2) {
        return o1[key] == o2;
      });
    });
    return selectedArr;
  };

  const formValues = (data) => {
    console.log("form values", data);
    setEnable(data.enabled == 1 ? 3 : 2);
    setEnablePriority(data.priority_flag == 1 ? 1 : 0);
    setSelType(typeOpt.filter((item) => item.value == data.type));
    if (data.dept_func_array_id != null && data.dept_func_array_id != "") {
      setSelDeptFun(stringToArray(data.dept_func_array_id, deptFun, "id"));
    } else setSelDeptFun([]);
    if (data.sec_dept_func != null && data.sec_dept_func != "") {
      setSelSecDeptFun(stringToArray(data.sec_dept_func, deptFun, "id"));
    } else setSelSecDeptFun([]);
    if (data.loc_grp_array_id != null && data.loc_grp_array_id != "") {
      setSelLocGrp(stringToArray(data.loc_grp_array_id, locationGroup, "id"));
    } else setSelLocGrp([]);
    if (data.sec_loc_grp_id != null && data.sec_loc_grp_id != "") {
      setSelSecLocGrp(stringToArray(data.sec_loc_grp_id, locationGroup, "id"));
    } else setSelSecLocGrp([]);
    if (data.building_ids != null && data.building_ids != "") {
      console.log("data.building_ids", data.building_ids);
      setSelBuilding(stringToArray(data.building_ids, building, "id"));
    } else setSelBuilding([]);

    setSelDeviceId(deviceId.filter((item) => item.value == data.device_id));

    reset({
      device_id: data.device_id,
      name: data.name,
      number: data.number,
      type: data.type,
    });
  };

  const createNewDevice = (data) => {
    setSaveLoader(true);
    if (props.data == null) {
      deviceService
        .storedevice(prepareObj(data))
        .then(() => {
          toast.success("device created successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("fail to create device");
        });
    } else {
      deviceService
        .updatedevice(prepareObj(data), props.data.id)
        .then(() => {
          toast.success("device updated successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("fail to update device");
        });
    }
    if (filelist.length > 0)
      filelist.map((item, i) => {
        let formData = new FormData();
        formData.append("myfile", item);
        deviceService.uploadFile(formData);
      });
  };

  const prepareObj = (data) => {
    let obj = {
      bldg_id: "",
      building_ids: arrayToString(selBuilding, "id"),
      dept_func: 0,
      dept_func_array_id: arrayToString(selDeptFun, "id"),
      device_api_level: "",
      device_id: data.device_id,
      device_manufacturer: "",
      device_model: "",
      device_name: "",
      device_os: "",
      device_user: "",
      device_version_release_model: "",
      enabled: enable == 3,
      id: props.data == null ? -1 : props.data.id,
      last_log_in: null,
      loc_grp_array_id: arrayToString(selLocGrp, "id"),
      loc_grp_id: null,
      name: data.name,
      number: data.number,
      priority_flag: enablePriority,
      sec_dept_func: arrayToString(selSecDeptFun, "id"),
      sec_loc_grp_id: arrayToString(selSecLocGrp, "id"),
      type: data.type,
    };
    return obj;
  };

  const typeOpt = [
    { value: "Mobile", label: "Mobile" },
    { value: "Landline", label: "Landline" },
  ];

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewDevice)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/device.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null ? "Add New Device" : "Edit Device"}
            </div>
          </div>
          <button
            //   onClick={handleSubmit}
            className={
              disable
                ? "float-end btn-update mr-1 lato-btn"
                : "float-end btn-update-active mr-1 lato-btn"
            }
            disabled={disable}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                alt="loader"
                width="15px"
              />
            ) : props.data == null ? (
              "Save"
            ) : (
              "Update"
            )}
          </button>
        </div>
      }
      bodyContainer={
        <div className="setting-taskdetail-content" style={{ height: "100vh" }}>
          <div className="blank-container"></div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="copy_setting"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("copy_setting") }}
                      styles={floatLabel.bgWhite}
                      options={deviceList.map((item, i) => {
                        return { value: i, label: item.name };
                      })}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      // defaultValue={
                      //   props.data == null
                      //     ? ""
                      //     : taskGrpOpt.filter(
                      //         (item) => item.label == props.data.tgname
                      //       )
                      // }
                      placeholder="Copy From Setting"
                      onChange={(val) => {
                        onChange(val.value);
                        formValues(deviceList[val.value]);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="col p-1 pt-2">
              <InputField
                keyName="name"
                label="Name"
                validation={{ ...register("name") }}
              />
            </div>
            <div className="col p-1 pt-2">
              <InputField
                keyName="number"
                label="Number"
                validation={{ ...register("number") }}
              />
            </div>
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("type") }}
                      styles={floatLabel.bgWhite}
                      options={typeOpt}
                      value={selType}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Type"
                      onChange={(val) => {
                        onChange(val.value);
                        setSelType([val]);
                      }}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="function"
                placeholder="Department Function"
                options={deptFun}
                selectedValues={selDeptFun}
                onSelect={(list) => setSelDeptFun(list)}
                onRemove={(list) => setSelDeptFun(list)}
                //   selectedValues={
                //     props.data == null
                //       ? []
                //       : stringToArray(
                //           props.data?.hold_job_role_ids,
                //           jobRole,
                //           "id"
                //         )
                //   }
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="function"
                placeholder="Secondary Department Function"
                options={deptFun}
                selectedValues={selSecDeptFun}
                onSelect={(list) => setSelSecDeptFun(list)}
                onRemove={(list) => setSelSecDeptFun(list)}
                //   selectedValues={
                //     props.data == null
                //       ? []
                //       : stringToArray(
                //           props.data?.hold_job_role_ids,
                //           jobRole,
                //           "id"
                //         )
                //   }
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="name"
                placeholder="Location Group"
                options={locationGroup}
                selectedValues={selLocGrp}
                onSelect={(list) => setSelLocGrp(list)}
                onRemove={(list) => setSelLocGrp(list)}
                //   selectedValues={
                //     props.data == null
                //       ? []
                //       : stringToArray(
                //           props.data?.hold_job_role_ids,
                //           jobRole,
                //           "id"
                //         )
                //   }
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="name"
                placeholder="Secondary Location Group"
                options={locationGroup}
                selectedValues={selSecLocGrp}
                onSelect={(list) => setSelSecLocGrp(list)}
                onRemove={(list) => setSelSecLocGrp(list)}
                //   selectedValues={
                //     props.data == null
                //       ? []
                //       : stringToArray(
                //           props.data?.hold_job_role_ids,
                //           jobRole,
                //           "id"
                //         )
                //   }
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="name"
                placeholder="Building"
                options={building}
                selectedValues={selBuilding}
                onSelect={(list) => setSelBuilding(list)}
                onRemove={(list) => setSelBuilding(list)}
                //   selectedValues={
                //     props.data == null
                //       ? []
                //       : stringToArray(
                //           props.data?.hold_job_role_ids,
                //           jobRole,
                //           "id"
                //         )
                //   }
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
            <div className="col p-1">
              <Controller
                control={control}
                name="device_id"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("device_id") }}
                      styles={floatLabel.bgWhite}
                      options={deviceId}
                      value={selDeviceId}
                      //   defaultValue={
                      //     props?.data == null
                      //       ? [byGuestOpt[0]]
                      //       : props?.data?.cost == 0
                      //       ? [byGuestOpt[0]]
                      //       : [byGuestOpt[1]]
                      //   }
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Device ID"
                      onChange={(val) => {
                        onChange(val.value);
                        setSelDeviceId(val);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Enable Priority</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={1}
                    name="enable_priority"
                    selected={enablePriority}
                    onChange={() => setEnablePriority(1)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={0}
                    name="enable_priority"
                    selected={enablePriority}
                    onChange={() => setEnablePriority(0)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Enable</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={3}
                    name="priority"
                    selected={enable}
                    onChange={() => setEnable(3)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={2}
                    name="priority"
                    selected={enable}
                    onChange={() => setEnable(2)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 pl-2 bdr-bottom">
            <div className="form-group">
              <img
                src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                alt="service"
                style={{ width: "20px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">Attach Files</span>
            </div>
          </div>
          <div className="container-fluid m-0 pl-2">
            <div className="row p-2 m-0 align-items-center">
              <FileUpload
                keyName="files"
                style={{}}
                className="btn-update lato-submit col-2 p-2 text-center"
                title="Upload File"
                onChange={(e) => handleFileChange(e)}
                multiple
              />
              <label className="col ml-3">*Upload .csv file is allowed</label>
            </div>
          </div>
          <div className="blank-container"></div>
          <div className="container-fluid m-0 pl-2">
            <div className="form-group">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/queue-grey.svg"
                }
                alt="service"
                style={{ width: "20px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">Queue List</span>
            </div>
          </div>
          <SimpleTable
            loader={false}
            key={`filelist`}
            columns={[
              { key: "name", label: "Name", width: "150" },
              {
                key: "size",
                label: "Size",
                width: "150",
                template: ({ children }) => (
                  <div>{(children[0] / 1000).toFixed(2)} kb</div>
                ),
              },
              { key: "", label: "Progress", width: "150" },
              { key: "", label: "Status", width: "150" },
              {
                key: "",
                label: "Action",
                width: "150",
                template: ({ ind }) => (
                  <>
                    {/* <span className="lato-btn outline-badge green mr-2">Upload</span> */}
                    <span
                      className="lato-btn outline-badge cursor-pointer red"
                      onClick={() => removeFile(ind)}
                    >
                      Remove
                    </span>
                  </>
                ),
              },
            ]}
            data={filelist}
          />
        </div>
      }
    />
  );
}

export default CreateDevice;
