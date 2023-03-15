import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import InputField from "../../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import deptFunService from "../../../../../services/guestservice/settings/department/deptfun";
import ListService from "../../../../../services/list";
import { useAuthState } from "../../../../../store/context";

function CreateDeptFun(props) {
  const [deptSettFlag, setDeptSettFlag] = useState(0);
  const [escalationSett, setEscalationSett] = useState(2);
  const [department, setDepartment] = useState([]);
  const [defaultAssignee, setDefaultAssignee] = useState([]);
  const [selDeviceSett, setSelDeviceSett] = useState(0);
  const [saveLoader, setSaveLoader] = useState(false);
  const {
    user: { dept_id },
  } = useAuthState();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (props.show) {
      getDepartment();
      getJobRole();
      if (props.data == null) resetValue();
      else formValue(props.data);
    }
  }, [props.show]);

  const resetValue = () => {
    setSaveLoader(false);
    setDeptSettFlag(0);
    setEscalationSett(2);
    reset({
      department: 0,
      function: "",
      short_code: "",
      device_setting: 0,
      description: "",
      hskp_role: "None",
      default_assignee: "",
    });
  };

  const formValue = (data) => {
    setDeptSettFlag(data.all_dept_setting == 0 ? 0 : 1);
    setEscalationSett(data.escalation_setting == 1 ? 3 : 2);
    reset({
      department: data.dept_id,
      function: data.function,
      short_code: data.short_code,
      device_setting: data.gs_device,
      description: data.description,
      hskp_role: data.hskp_role,
      default_assignee: data.job_role_id,
    });
    setSelDeviceSett(data.gs_device);
  };

  const getDepartment = () => {
    deptFunService.getdepartmentlist({ department: "" }).then((res) =>
      setDepartment(
        res.map((item) => {
          return { value: item.id, label: item.department };
        })
      )
    );
  };

  const getJobRole = () => {
    ListService.getjobrolelist({}).then((res) => {
      setDefaultAssignee(
        res.map((item) => {
          return { value: item.id, label: item.job_role };
        })
      );
    });
  };

  const prepareObj = (data) => {
    console.log("dept data", data);
    let obj = {
      all_dept_setting: deptSettFlag,
      dept_id: 1,
      dept_name: "Housekeeping",
      description: data.description,
      escalation_setting: escalationSett == 3 ? 1 : 0,
      function: data.function,
      gs_device: selDeviceSett,
      hskp_role: data.hskp_role,
      id: -1,
      short_code: data.short_code,
    };
    if (typeof data.default_assignee != "string") {
      obj["job_role_id"] = data.default_assignee;
      obj["job_role"] = defaultAssignee.filter(
        (item) => item.value == data.default_assignee
      )[0].label;
    }
    if (data.department != 0) {
      obj["dept_id"] = data.department;
      obj["dept_name"] = department.filter(
        (item) => item.value == data.department
      )[0].label;
    }
    return obj;
  };

  const createNewDeptFun = (data) => {
    setSaveLoader(true);
    if (props.data == null) {
      deptFunService
        .createdeptfun(prepareObj(data))
        .then(() => {
          toast.success("Department Function created successfully");
          props.reset();
          setSaveLoader(false);
          props.handleClose();
        })
        .catch(() => {
          toast.error("Failed to create Department Function");
          setSaveLoader(false);
        });
    } else {
      deptFunService
        .updatedeptfun(prepareObj(data), props.data.id)
        .then(() => {
          toast.success("Department Function updated successfully");
          props.reset();
          setSaveLoader(false);
          props.handleClose();
        })
        .catch(() => {
          toast.error("Fail to update the Department Function");
          setSaveLoader(false);
        });
    }
  };

  const deviceSettOpt = [
    { value: 0, label: "User" },
    { value: 1, label: "Device" },
    { value: 2, label: "Roster" },
  ];

  const hskpRoleOpt = [
    { value: "None", label: "None" },
    { value: "Attendant", label: "Attendant" },
    { value: "Supervisor", label: "Supervisor" },
  ];

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewDeptFun)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={
                process.env.PUBLIC_URL +
                `/images/${
                  props.data == null ? "attached-files" : "edit-task"
                }.svg`
              }
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null
                ? "Add New Department Function"
                : "Edit Department Function"}
            </div>
          </div>
          <button
            className="float-end btn-update-active mr-1 lato-btn"
            disabled={saveLoader}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                style={{ width: "15px" }}
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
        <div className="setting-taskdetail-content" style={{ height: "400px" }}>
          <div className="blank-container"></div>
          <div className="container-fluid row m-0 p-2">
            {department.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="department"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("department") }}
                        styles={floatLabel.bgWhite}
                        options={department}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : department.filter(
                                (item) => item.value == props.data.dept_id
                              )
                        }
                        placeholder="Department"
                        onChange={(val) => {
                          onChange(val.value);
                          //   setDisable(false);
                        }}
                      />
                    </>
                  )}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col p-1 pt-2">
              <InputField
                keyName="function"
                label="Function"
                validation={{ ...register("function") }}
              />
            </div>
            <div className="col p-1 pt-2">
              <InputField
                keyName="short_code"
                label="Short Code"
                validation={{ ...register("short_code") }}
              />
            </div>
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="device_setting"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("device_setting") }}
                      styles={floatLabel.bgWhite}
                      options={deviceSettOpt}
                      defaultValue={
                        props.data == null
                          ? [deviceSettOpt[0]]
                          : deviceSettOpt.filter(
                              (item) => item.value == props.data.gs_device
                            )
                      }
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Device Settings"
                      onChange={(val) => {
                        onChange(val.value);
                        setSelDeviceSett(val.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">All Department Setting</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={1}
                    name="dept_setting"
                    selected={deptSettFlag}
                    onChange={() => setDeptSettFlag(1)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={0}
                    name="dept_setting"
                    selected={deptSettFlag}
                    onChange={() => setDeptSettFlag(0)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Escalation Seting</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={3}
                    name="escalation_setting"
                    selected={escalationSett}
                    onChange={() => setEscalationSett(3)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={2}
                    name="escalation_setting"
                    selected={escalationSett}
                    onChange={() => setEscalationSett(2)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 p-1">
              <Controller
                control={control}
                name="hskp_role"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("hskp_role") }}
                      styles={floatLabel.bgWhite}
                      options={hskpRoleOpt}
                      defaultValue={
                        props.data == null
                          ? [hskpRoleOpt[0]]
                          : hskpRoleOpt.filter(
                              (item) => item.value == props.data.hskp_role
                            )
                      }
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Housekeeping Role"
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            {selDeviceSett == 0 && defaultAssignee.length > 0 ? (
              <div className="col p-1">
                <Controller
                  control={control}
                  name="default_assignee"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("default_assignee") }}
                        styles={floatLabel.bgWhite}
                        options={defaultAssignee}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : defaultAssignee.filter(
                                (item) => item.value == props.data.job_role_id
                              )
                        }
                        placeholder="Default Assignee"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col-md-6 p-1">
              <InputField
                keyName="description"
                label="Description"
                validation={{ ...register("description") }}
              />
            </div>
          </div>
          {props.data != null ? (
            <>
              <div className="blank-container"></div>
              <div className="container-fluid row m-0 p-0 bdr-bottom">
                <div className="form-group">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/form-icons/escalation.svg"
                    }
                    alt="service"
                    style={{ width: "20px" }}
                  />
                  <span className="ml-4 lato-canvas-sub-title">
                    Escalation Settings
                  </span>
                </div>
              </div>
              <div className="container-fluid row m-0 p-2 bdr-bottom">
                <div className="col-md-6 p-1">
                  <Controller
                    control={control}
                    name="escalation"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{ ...register("escalation") }}
                          styles={floatLabel.bgWhite}
                          options={[]}
                          // defaultValue={
                          //   props.data == null
                          //     ? [hskpRoleOpt[0]]
                          //     : hskpRoleOpt.filter(
                          //         (item) => item.value == props.data.hskp_role
                          //       )
                          // }
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          placeholder="Select Escalation Settings"
                          onChange={(val) => onChange(val.value)}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      }
    />
  );
}

export default CreateDeptFun;
