import Multiselect from "multiselect-react-dropdown";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import InputField from "../../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import taskGroupService from "../../../../../services/guestservice/settings/taskgroup/taskgroup";
import { useAuthState } from "../../../../../store/context";

function CreateTaskGroup(props) {
  const [disable, setDisable] = useState(true);
  const [saveLoader, setSaveLoader] = useState(false);
  const [deptFun, setDeptFun] = useState([]);
  const [userGroup, setUserGroup] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [byGuest, setByGuest] = useState(0);
  const [escalation, setEscalation] = useState("No");
  const [freqNoti, setFreqNoti] = useState(5);
  const [holdNoti, setHoldNoti] = useState(7);
  const [unassign, setUnassign] = useState(9);
  const [addCost, setAddCost] = useState(11);
  const freqNotiUser = useRef();
  const holdNotifyUser = useRef();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const {
    user: { property_id, id, wholename },
  } = useAuthState();
  const resetObj = {
    dept_fun: 0,
    duration: 0,
    frequency: 0,
    hold_timeout: "",
    max_time: 0,
    period: 0,
    start_duration: 0,
    task_group: "",
    user_group: 0,
  };

  useEffect(() => {
    if (props.show) {
      departmentFunctionlist();
      userGrouplist();
      jobRoleList();
      if (props.data == null) {
        resetValues();
      } else {
        resetFormValue();
      }
    }
  }, [props.show]);

  const resetFormValue = () => {
    setSaveLoader(false);
    reset({
      dept_fun: props.data.dept_function,
      duration: props.data.max_time,
      frequency: props.data.frequency,
      hold_timeout: props.data.hold_timeout,
      max_time: props.data.max_time,
      period: props.data.period,
      start_duration: props.data.start_duration,
      task_group: props.data.name,
      user_group: props.data.user_group,
    });
    setDisable(false);
    setByGuest(props.data.by_guest_flag);
    setEscalation(props.data.escalation);
    setFreqNoti(props.data.frequency_notification_flag == 1 ? 4 : 5);
    setHoldNoti(props.data.hold_notification_flag == 1 ? 6 : 7);
    setUnassign(props.data.unassigne_flag == 1 ? 8 : 9);
  };

  const resetValues = () => {
    setSaveLoader(false);
    setDisable(true);
    setByGuest(0);
    setEscalation("No");
    setFreqNoti(5);
    setHoldNoti(7);
    setUnassign(9);
    reset(resetObj);
  };

  const departmentFunctionlist = () => {
    taskGroupService
      .getdeptfunclist({ deptfunc: "" })
      .then((res) =>
        setDeptFun(
          res.map((item) => {
            return { label: item.function, value: item.id };
          })
        )
      )
      .catch(() => toast.error("faild to fetch department function"));
  };

  const userGrouplist = () => {
    taskGroupService
      .getusergrouplist({ usergroup: "" })
      .then((res) =>
        setUserGroup(
          res.map((item) => {
            return { label: item.name, value: item.id };
          })
        )
      )
      .catch(() => toast.error("faild to fetch department function"));
  };

  const jobRoleList = () => {
    taskGroupService
      .getsettingjobrolelist({ user_id: id, property_id: property_id })
      .then((res) => setJobRole(res))
      .catch(() => toast.error("faild to fetch department function"));
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

  const createNewTaskGroup = (data) => {
    if (data.task_group == "")
      return toast.error("please enter task group name");
    setSaveLoader(true);
    if (props.data == null) {
      taskGroupService
        .addtaskgroup(prepareObj(data))
        .then(() => {
          toast.success("Task group created successfully");
          resetValues();
          props.reset();
        })
        .catch(() => {
          setSaveLoader(false);
          toast.error("Fail to create task group");
        });
    } else {
      taskGroupService
        .edittaskgroup(prepareObj(data), props.data.id)
        .then(() => {
          setSaveLoader(false);
          props.reset();
          props.handleClose();
          toast.success("Task group updated successfully");
        })
        .catch(() => {
          setSaveLoader(false);
          toast.success("Fail to updated Task group");
        });
    }
  };

  const prepareObj = (data) => {
    let frqRole = freqNotiUser.current?.state?.selectedValues;
    let holdRole = holdNotifyUser.current?.state?.selectedValues;
    let obj = {
      comment_flag: 0, // Unkonw Field
      escalation_group: 0, // Unkonw Field
      hold_reminder: "0", // Unkonw Field
      queue_flag: 0, // Unkonw Field
      reassign_flag: 0, // Unkonw Field
      reassign_job_role: "", // Unkonw Field
      self_start_flag: 0, // Unkonw Field
      cost_flag: addCost == 10 ? 1 : 0,
      by_guest_flag: byGuest,
      dept_function: data.dept_fun,
      escalation: escalation,
      frequency: data.frequency,
      frequency_job_role_ids:
        frqRole != undefined ? arrayToString(frqRole, "id") : "",
      frequency_notification_flag: freqNoti == 4 ? 1 : 0,
      hold_job_role_ids:
        holdRole != undefined ? arrayToString(holdRole, "id") : "",
      hold_notification_flag: holdNoti == 6 ? 1 : 0,
      hold_timeout: data.hold_timeout,
      max_time: data.max_time,
      name: data.task_group,
      period: data.period,
      request_reminder: data.request_reminder,
      start_duration: data.start_duration,
      unassigne_flag: unassign == 8 ? 1 : 0,
      user_group: data.user_group,
      id: props.data == null ? -1 : props.data.id,
    };
    return obj;
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewTaskGroup)}
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
                ? "Add New Task Group"
                : "Edit Task Group Settings"}
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
                width="25px"
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
        <div className="setting-taskgroup-content" style={{ height: "600px" }}>
          <div className="blank-container"></div>
          <div className="container-fluid row m-0 p-2">
            {deptFun.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="dept_fun"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("dept_fun") }}
                        styles={floatLabel.bgWhite}
                        options={deptFun}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : deptFun.filter(
                                (item) => item.value == props.data.dept_function
                              )
                        }
                        placeholder="Department Function"
                        onChange={(val) => {
                          onChange(val.value);
                          setDisable(false);
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
                keyName="task_group"
                label="Task Group"
                validation={{ ...register("task_group") }}
              />
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Selected By Guest</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={1}
                    name="by_guest"
                    selected={byGuest}
                    onChange={() => setByGuest(1)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={0}
                    name="by_guest"
                    selected={byGuest}
                    onChange={() => setByGuest(0)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Escalation</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={"Yes"}
                    name="escalation"
                    selected={escalation}
                    onChange={() => setEscalation("Yes")}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={"No"}
                    name="escalation"
                    selected={escalation}
                    onChange={() => setEscalation("No")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid row m-0 p-2 pt-0">
            {userGroup.length > 0 ? (
              <div className="col-md-3 p-1 pt-1">
                <Controller
                  control={control}
                  name="user_group"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("user_group") }}
                        styles={floatLabel.bgWhite}
                        options={userGroup}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : userGroup.filter(
                                (item) => item.value == props.data?.user_group
                              )
                        }
                        placeholder="User Group"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-md-3 p-1 pt-1">
              <InputField
                type="number"
                keyName="max_time"
                label="Duration"
                validation={{ ...register("max_time") }}
                min={0}
              />
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Hold Notification</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={6}
                    name="hold_noti"
                    selected={holdNoti}
                    onChange={() => setHoldNoti(6)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={7}
                    name="hold_noti"
                    selected={holdNoti}
                    onChange={() => setHoldNoti(7)}
                  />
                </div>
              </div>
            </div>
            {holdNoti == 6 ? (
              <div className="col-md-3 p-1 pt-1">
                <Multiselect
                  customCloseIcon={<i className="fas fa-times ml-2"></i>}
                  displayValue="job_role"
                  placeholder="Hold Notify User"
                  options={jobRole}
                  selectedValues={
                    props.data == null
                      ? []
                      : stringToArray(
                          props.data?.hold_job_role_ids,
                          jobRole,
                          "id"
                        )
                  }
                  ref={holdNotifyUser}
                  style={{
                    searchWrapper: {
                      padding: "4px",
                    },
                    searchBox: {
                      border: "2px solid #f1f1f1",
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
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="container-fluid row m-0 p-2 pt-0">
            <div className="col-md-3 p-1 pt-1">
              <InputField
                keyName="hold_timeout"
                type="number"
                label="Hold Timeout"
                validation={{ ...register("hold_timeout") }}
                min={0}
              />
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Add Cost</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={10}
                    name="add_cost"
                    selected={addCost}
                    onChange={() => setAddCost(10)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={11}
                    name="add_cost"
                    selected={addCost}
                    onChange={() => setAddCost(11)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 p-1 pt-1">
              <InputField
                keyName="request_reminder"
                label="Request Reminder"
                validation={{ ...register("request_reminder") }}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2 pt-0">
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Frequency Notification</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={4}
                    name="feq_noti"
                    selected={freqNoti}
                    onChange={() => setFreqNoti(4)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={5}
                    name="feq_noti"
                    selected={freqNoti}
                    onChange={() => setFreqNoti(5)}
                  />
                </div>
              </div>
            </div>
            {freqNoti == 4 ? (
              <>
                <div className="col p-1 pt-1">
                  <Multiselect
                    customCloseIcon={<i className="fas fa-times ml-2"></i>}
                    displayValue="job_role"
                    placeholder="Frequency Notify User"
                    options={jobRole}
                    selectedValues={
                      props.data == null
                        ? []
                        : stringToArray(
                            props.data?.frequency_job_role_ids,
                            jobRole,
                            "id"
                          )
                    }
                    ref={freqNotiUser}
                    style={{
                      searchWrapper: {
                        padding: "4px",
                      },
                      searchBox: {
                        border: "2px solid #f1f1f1",
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
                  />
                </div>
                <div className="col p-1 pt-1">
                  <InputField
                    type="number"
                    keyName="frequency"
                    label="Frequency"
                    validation={{ ...register("frequency") }}
                    min={0}
                  />
                </div>
                <div className="col p-1 pt-1">
                  <InputField
                    type="number"
                    keyName="period"
                    label="Period"
                    validation={{ ...register("period") }}
                    min={0}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="container-fluid row m-0 p-2 pt-0">
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Unassign</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={8}
                    name="hold_noti"
                    selected={unassign}
                    onChange={() => setUnassign(8)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={9}
                    name="hold_noti"
                    selected={unassign}
                    onChange={() => setUnassign(9)}
                  />
                </div>
              </div>
            </div>
            {unassign == 8 ? (
              <div className="col-md-3 p-1 pt-1">
                <InputField
                  keyName="start_duration"
                  label="Start Duration"
                  validation={{ ...register("start_duration") }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      }
    />
  );
}
export default CreateTaskGroup;
