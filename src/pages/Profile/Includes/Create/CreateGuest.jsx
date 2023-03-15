import Multiselect from "multiselect-react-dropdown";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ButtonCheckBox from "../../../../common/FormElements/ButtonCheckBox";
import Dropdown from "../../../../common/FormElements/Dropdown";
import FileUpload from "../../../../common/FormElements/FileUpload";
import InputField from "../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../common/Modals/ModalOffcanvas";
import dateTime from "../../../../helper/dateTime";
import guestService from "../../../../services/guest";
import { useAuthState } from "../../../../store/context";
import DateFnsUtils from "@date-io/date-fns";
import Icon from "@material-ui/core/Icon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { Controller, useForm } from "react-hook-form";
import SimpleTable from "../../../../common/SimpleTable";
import CurrentTime from "./CurrentTime";
import dropdownStyle from "../../../../config/dropdownStyle";
import Select, { createFilter } from "react-select";
import { floatLabel } from "../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../helper/CustomValueContainer";
import CreateQuickTaskModel from "./CreateQuickTaskModel";

function CreateGuest(props) {
  const [selectedroom, setSelectedroom] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [show, setShow] = useState(false);
  const [saveloader, setSaveloader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filelist, setFilelist] = useState([]);
  const [rooms, setrooms] = useState([]);
  const [quicktasklist, setQuicktasklist] = useState([]);
  const [allTasklist, setAllTasklist] = useState([]);
  const [guestInfo, setGuestInfo] = useState({});
  const [locationInfo, setLocationInfo] = useState({});
  const [proceed, setProceed] = useState(false);
  const [selectedEndDate, handleEndDateChange] = useState(null);
  const [selectedScheduleDate, handleScheduleDateChange] = useState(new Date());
  const [taskInfo, setTaskInfo] = useState({});
  const [showTaskInfoArr, setShowTaskInfoArr] = useState([]);
  const [manualTaskArr, setManualTaskArr] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [doubleclick, setDoubleclick] = useState(false);
  const [onlineStaff, setOnlineStaff] = useState([]);
  const {
    user: { id, property_id },
  } = useAuthState();
  const disObj = {
    until: true,
    end_date: true,
    schedule_date: true,
    save_btn: true,
    another_btn: true,
    feedback_flag: false,
  };
  const [disableFlag, setdisableFlag] = useState(disObj);
  const [check, setCheck] = useState({
    timeout: 0,
  });
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const resetTaskObj = {
    task: "select",
    staff: "",
    duration: "",
    department: "",
    function: "",
    priority: 1,
    quantity: "",
    schedule: false,
    until: false,
    repeat: false,
    note: "",
  };

  useEffect(() => {
    roomlist();
    getAllTask();
  }, []);

  useEffect(() => {
    setMultiSelect(false);
  }, [props.show]);

  const resetNewService = () => {
    setSelectedroom([]);
    setShowTaskInfoArr([]);
    setFilelist([]);
    setSaveloader(false);
    setTaskInfo({});
    reset(resetTaskObj);
    setManualTaskArr([]);
    setGuestInfo({});
    setProceed(false);
    setdisableFlag(disObj);
  };

  useEffect(() => {
    resetNewService();
  }, [multiSelect, props.show]);

  const removeFile = (i) => {
    setFilelist((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
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

  const roomlist = () => {
    guestService
      .getroomlist(property_id)
      .then((res) => setrooms(res))
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const getGuestname = (elem) => {
    setQuicktasklist([]);
    setLoader(true);
    setSelectedroom(elem.value);
    setProceed(true);
    // if (quicktasklist.length == 0)
    //   setdisableFlag((p) => {
    //     return { ...p, save_btn: true };
    //   });
    // else
    //   setdisableFlag((p) => {
    //     return { ...p, save_btn: false };
    //   });
    guestService.getguestname(elem.value).then((res) => {
      if (res.checkout_flag == "checkout") {
        setProceed(false);
        props.trfCall(elem.value);
        // toast.error(
        //   "guest has been chekout from the room please select other room"
        // );
      } else {
        setGuestInfo(res);
        quickTasklist();
        guestService
          .getlocationgroup(elem.value)
          .then((res) => setLocationInfo(res))
          .catch(() => {
            toast.error("Something went wrong");
          });
      }
    });
    // .catch(() => {
    //   toast.error("Something went wrong");
    // });
  };

  const quickTasklist = () => {
    guestService
      .getsystemtasklist({ property_id: property_id, user_id: id })
      .then((response) => {
        guestService
          .getquicktasklist(property_id)
          .then((res) => {
            setQuicktasklist([...response, ...res]);
            setLoader(false);
          })
          .catch(() => {
            setLoader(false);
            toast.error("Fail to get quicktask list");
          });
      })
      .catch(() => toast.error("Fail to get quicktask list"));
  };

  //-------------------------------- function to manage quick task checkbox-----------
  // const handleCheckboxChange = (elem, i) => {
  //   setSelectedtask((p) => {
  //     let obj = p;
  //     if (obj[elem.name] == i) {
  //       obj[elem.name] = "cancle";
  //       setTaskArr((p) => {
  //         let arr = p;
  //         let index = arr.indexOf(quicktasklist[i]);
  //         arr.splice(index, 1);
  //         if (arr.length == 0)
  //           setdisableFlag((p) => {
  //             return { ...p, save_btn: true };
  //           });
  //         else
  //           setdisableFlag((p) => {
  //             return { ...p, save_btn: false };
  //           });
  //         return [...arr];
  //       });
  //     } else {
  //       obj[elem.name] = i;
  //       setTaskArr((p) => [...p, quicktasklist[i]]);
  //       setdisableFlag((p) => {
  //         return { ...p, save_btn: false };
  //       });
  //     }
  //     return { ...obj };
  //   });
  // };

  useEffect(
    function () {
      if (selectedroom && selectedroom.length > 0) {
        console.log("selectedroom", selectedroom);
        getGuestData();
      }
    },
    [selectedroom]
  );

  const roomChange = (list, task) => {
    console.log("list.length", list);
    if (check.timeout) clearTimeout(check.timeout);
    if (list.length > 1) {
      setCheck({
        timeout: setTimeout(async () => {
          setSelectedroom(list);
          setQuicktasklist([]);
          setProceed(true);
          quickTasklist();
          setLoader(true);
          // getGuestData();
        }, 2000),
      });
    } else {
      setProceed(false);
      setdisableFlag((p) => {
        return { ...p, save_btn: true };
      });
    }
  };

  const getGuestData = () => {
    if (Array.isArray(selectedroom)) {
      let room_ids = selectedroom.map((item) => item.id);
      guestService.getguestdata({ room_ids: room_ids }).then((res) => {
        if (res.guests_checkout.length > 0) {
          setQuicktasklist([]);
          setProceed(false);
          setLoader(false);
          props.trfCall(res.guests_checkout);
          res.guests_checkout?.map((val) =>
            toast.error(
              `guest has been checkout from room ${val.location_group.name}`
            )
          );
        } else {
          setGuestInfo(res.guests_checkin);
        }
      });
    }
  };

  const checkCall = () => {
    setSaveloader(true);
    setdisableFlag((p) => {
      return { ...p, save_btn: true };
    });
    if (manualTaskArr.length == 0) createQuickTask();
    else createManualTask();
  };

  const createQuickTask = async (data = {}) => {
    if (multiSelect) {
      multiRoomQuickTask(data);
    } else {
      singleRoomQuickTask(data);
    }
  };

  const multiRoomQuickTask = (detail) => {
    setLoader(true);
    let obj = {
      location_groups: guestInfo.map((val, i) => {
        return {
          guest_id: val.guest_id,
          location_id: val.location_group.id,
          room_id: val.room_id,
          room_name: val.location_group.name,
        };
      }),
      task_id: currentTask.id,
    };
    guestService.gettaskinfofromtask(obj).then((res) => {
      let passArr = [
        prepareObj(
          { ...res, note: detail.comment, quantity: detail.quantity },
          currentTask.id
        ),
      ];
      guestService
        .createtasklistnew(passArr)
        .then((data) => {
          if (
            // data?.invalid_task_list !== undefined &&
            // typeof data?.invalid_task_list === "object"
            data.invalid_task_list?.length > 0
          ) {
            data?.invalid_task_list?.map((invalid_task) =>
              toast.error(invalid_task.message)
            );
          } else {
            toast.success("task created successfully");
          }
          props.reset();
          setSaveloader(false);
          setLoader(false);
          setGuestInfo([]);
          resetNewService();
          // props.handleClose();
        })
        .catch(() => toast.error("Fail to create new request"));
    });
  };

  const singleRoomQuickTask = (detail) => {
    setLoader(true);
    guestService
      .gettaskinfo(currentTask.id, locationInfo.id)
      .then((res) => {
        setTaskInfo(res);
        let passObj = [
          prepareObj(
            { ...res, note: detail.comment, quantity: detail.quantity },
            currentTask.id
          ),
        ];
        guestService
          .createtasklist(passObj)
          .then((data) => {
            if (data.invalid_task_list?.length > 0) {
              data.invalid_task_list.map((item) => toast.error(item.message));
              setSaveloader(false);
              resetNewService();
            } else {
              toast.success("task created successfully");
              props.reset();
              setSaveloader(false);
              setLoader(false);
              resetNewService();
              // props.handleClose();
            }
          })
          .catch(() => toast.error("Fail to create new request"));
      })
      .catch((res) => toast.error("Fail to fetch task details"));
  };

  const prepareObj = (data, task_id) => {
    let obj = {
      attendant: 1,
      created_time: dateTime().yyyy_mm_dd_tt,
      custom_message: data.note ? data.note : "",
      department_id: data.department?.id,
      dept_func: data.deptfunc?.id,
      end_date_time: "0000-00-00 00:00:00",
      feedback_flag: "",
      max_time: data.taskgroup.max_time,
      priority: "1",
      property_id: property_id,
      quantity: data.quantity ? data.quantity : 1,
      start_date_time: data.schedule
        ? selectedScheduleDate
        : dateTime().yyyy_mm_dd_tt,
      status_id: 1,
      task_list: task_id,
      type: 1,
    };
    if (multiSelect) {
      obj["info_list"] = guestInfo.map((val, i) => {
        return {
          dispatcher: data.location_groups[i].staff_list[0].id,
          guest_id: val.guest_id,
          location_id: val.location_group.id,
          room: val.room_id,
        };
      });
    } else {
      obj["location_id"] = locationInfo.id;
      obj["guest_id"] = guestInfo.guest_id;
      obj["dispatcher"] =
        data.staff_list.length > 0 ? data.staff_list[0]?.id : 0;
      obj["room"] = selectedroom;
    }
    if (!disableFlag.another_btn) {
      obj["repeat_flag"] = data.repeat;
      obj["repeat_end_date"] = selectedEndDate;
      obj["until_checkout_flag"] = data.until;
      obj["running"] = 1;
      obj["priority"] = data.priority != undefined ? data.priority : 1;
      obj["quantity"] = data.quantity;
      obj["custom_message"] = data.note ? data.note : "";
    }
    console.log("obj", obj);
    return obj;
  };

  const getAllTask = () => {
    guestService.getalltasklist(property_id).then((res) => setAllTasklist(res));
  };

  const handleManualTaskChange = (elem) => {
    console.log("called", elem);
    if (elem.value == "select") {
      reset(resetTaskObj);
      setdisableFlag((p) => {
        return { ...p, another_btn: true, save_btn: true };
      });
    } else {
      setdisableFlag((p) => {
        return { ...p, another_btn: false, save_btn: true };
      });
    }
    if (multiSelect) {
      let obj = {
        location_groups: guestInfo?.map((val, i) => {
          return {
            guest_id: val.guest_id,
            location_id: val.location_group.id,
            room_id: val.room_id,
            room_name: val.location_group.name,
          };
        }),
        task_id: allTasklist[elem.value].id,
      };
      guestService.gettaskinfofromtask(obj).then((res) => {
        if (res.location_groups[0]?.staff_list.length == 0)
          toast.error("No staff is assigned task will be escalated to manager");
        else setOnlineStaff(res.location_groups);
        reset({
          task: elem.value,
          duration: res.taskgroup.max_time / 60,
          department: res.department.department,
          function: res.deptfunc.function,
          priority: 1,
          quantity: 1,
          schedule: false,
          until: false,
          repeat: false,
        });
        setTaskInfo(res);
      });
    } else {
      guestService
        .gettaskinfo(allTasklist[elem.value].id, locationInfo.id)
        .then((res) => {
          if (res.staff_list.length == 0) {
            toast.error(
              "No staff is assigned task will be escalated to manager"
            );
          } else {
            setOnlineStaff(() =>
              res.staff_list.map((item) => {
                return { value: item.id, label: item.wholename };
              })
            );
          }
          reset({
            task: elem.value,
            staff: res.shift_group_members[0]?.wholename,
            duration: res.taskgroup.max_time / 60,
            department: res.department.department,
            function: res.deptfunc.function,
            priority: 1,
            quantity: 1,
            schedule: false,
            until: false,
            repeat: false,
          });
          setTaskInfo(res);
        })
        .catch(() => toast.error("Fail to get task info"));
    }
    // }
  };

  const handleManuallyCreate = (data) => {
    console.log("data", data);
    let tableObj = {
      heading: allTasklist[data.task].task,
      department: taskInfo.department.short_code,
      quantity: data.quantity,
    };
    console.log("tableObj", tableObj);
    let compareArr = showTaskInfoArr.map((item) => item.heading);

    if (compareArr.indexOf(tableObj.heading) == -1) {
      setShowTaskInfoArr((p) => [...p, tableObj]);
      let obj = {
        ...data,
        taskgroup: { max_time: data.duration * 60 },
        department: { id: taskInfo.department.id },
        deptfunc: { id: taskInfo.deptfunc.id },
        staff_list: taskInfo.staff_list
          ? taskInfo.staff_list.map((l) => l.id)
          : [], //  [{ id: taskInfo.staff_list[0].id }],
      };
      if (multiSelect) {
        taskInfo.location_groups.map((item, i) => {
          obj["location_groups"] = taskInfo.location_groups;
        });
      } else {
        obj["staff_list"] = [{ id: taskInfo.staff_list[0].id }];
      }
      setManualTaskArr((p) => {
        return [...p, prepareObj(obj, taskInfo.taskgroup.pivot.task_list_id)];
      });
    } else {
      toast.error("task already added");
    }
    reset(resetTaskObj);
    setdisableFlag((p) => {
      return { ...p, another_btn: true, save_btn: false };
    });
  };

  const createManualTask = () => {
    if (multiSelect) {
      guestService.createtasklistnew(manualTaskArr).then((data) => {
        if (
          // data?.invalid_task_list !== undefined &&
          // typeof data?.invalid_task_list === "object"
          data?.invalid_task_list?.length > 0
        ) {
          data?.invalid_task_list?.map((invalid_task) =>
            toast.error(invalid_task.message)
          );
        } else {
          toast.success("task created successfully");
        }
        props.reset();
        setSaveloader(false);
        setGuestInfo([]);
        resetNewService();
        // props.handleClose();
      });
    } else {
      guestService.createtasklist(manualTaskArr).then((res) => {
        if (res.invalid_task_list.length > 0) {
          res.invalid_task_list.map((val) => toast.error(val.message));
          if (res.invalid_task_list.length < showTaskInfoArr.length) {
            toast.success("task created successfully");
          }
        } else {
          toast.success("task created successfully");
        }
        props.reset();
        setSaveloader(false);
        resetNewService();
        // props.handleClose();
      });
    }
    if (filelist.length > 0) uploadfiles();
  };

  const uploadfiles = () => {
    let formData = new FormData();
    formData.append("id", props.ticketno + 1);
    filelist?.map((item, i) => {
      formData.append(`files[${i}]`, item);
    });
    guestService.uploadfiles(formData);
  };

  const removeManualTask = (i) => {
    setManualTaskArr((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
    setShowTaskInfoArr((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
  };

  const handleQuickTaskClick = async (e, task) => {
    console.log(e.detail);
    if (check.timeout) clearTimeout(check.timeout);
    if (e.detail === 1) {
      setCheck({
        timeout: setTimeout(async () => {
          if (doubleclick) {
            console.log("Double Click");
          } else {
            setCurrentTask(task);
            setShow(true);
          }
        }, 500),
      });
    }
    if (e.detail === 2) {
      await setCurrentTask(task); // task state is not updating
      setDoubleclick(true);
    }
  };

  useEffect(() => {
    setDoubleclick(false);
    if (doubleclick) createQuickTask({ comment: "", quantity: 1 });
  }, [doubleclick]);

  // const onlineStaff = props.stafflist?.map((item, i) => {
  //   return { label: item.wholename, value: item.id };
  // });

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(handleManuallyCreate)}
      headerContainer={
        <div>
          <div className="row align-items-center">
            <img
              src={
                process.env.PUBLIC_URL + "/images/create-new-guest-service.svg"
              }
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              Create New Guest Request - G{props.ticketno + 1}{" "}
            </div>
          </div>
        </div>
      }
      bodyContainer={
        <div className="create-guestservice">
          <div className="blank-container"></div>
          <div className="container-fluid m-0 p-2 bdr-bottom">
            <div className="form-group ">
              <img
                src={process.env.PUBLIC_URL + "/images/quick-task.svg"}
                alt="service"
                style={{ width: "20px" }}
              />
              <span className="ml-4 lato-canvas-sub-title">
                <CurrentTime />
              </span>
              <button
                type="button"
                onClick={checkCall}
                disabled={disableFlag.save_btn}
                className={`btn-update-active float-end lato-btn ${
                  disableFlag.save_btn ? "opacity-50" : ""
                }`}
              >
                {saveloader ? (
                  <img
                    src={process.env.PUBLIC_URL + "/images/loader.gif"}
                    alt="loader"
                    width="15px"
                  />
                ) : (
                  "Save"
                )}
              </button>
              <div className="row align-items-center float-end mr-4">
                <div className="col-auto lato-canvas-sub-title">
                  {" "}
                  Enable Feedback{" "}
                </div>
                <div className="col-auto pb-1">
                  <label className="custom-toggle m-0">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setdisableFlag((p) => {
                          return { ...p, feedback_flag: !p.feedback_flag };
                        })
                      }
                    />
                    <span className="custom-slider round"></span>
                  </label>
                </div>
              </div>
              <div className="row align-items-center float-xl-end mr-4">
                <div className="col-auto lato-canvas-sub-title">
                  {" "}
                  Multiple Location{" "}
                </div>
                <div className="col-auto pb-1">
                  <label className="custom-toggle m-0">
                    <input
                      type="checkbox"
                      checked={multiSelect}
                      onChange={() => setMultiSelect((p) => !p)}
                    />
                    <span className="custom-slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row container-fluid m-0 p-2  bdr-bottom">
            {/* <div className="col-md-3">
              <div className="form-group">
                <fieldset>
                  <legend>Request ID</legend>
                  <div className="lato-input" style={{ margin: "10px 15px" }}>
                    G{props.ticketno + 1}
                  </div>
                </fieldset>
              </div>
            </div> */}
            {/* <div className="col-md-3">
              <div className="form-group">
                <fieldset>
                  <legend>Request Time</legend>
                  <div className="lato-input" style={{ margin: "10px 15px" }}>
                    <CurrentTime />
                  </div>
                </fieldset>
              </div>
            </div> */}
            <div className="col-md-3">
              {multiSelect ? (
                <fieldset>
                  <legend className="lato-canvas-sub-title">Room</legend>
                  <Multiselect
                    customCloseIcon={<i className="fas fa-times ml-2"></i>}
                    displayValue="room"
                    options={rooms}
                    selectedValues={selectedroom}
                    onSelect={roomChange}
                    onRemove={roomChange}
                    style={{
                      searchBox: {
                        border: "none",
                        // margin: "0px 5px 5px 5px",
                      },
                      chips: {
                        background: "#0B8376",
                        borderRadius: "5px",
                        padding: "4px 6px",
                        fontSize: "12px",
                        lineHeight: "10px",
                      },
                      highlightOption: {
                        background: "#0B8376",
                      },
                      highlight: {
                        background: "#0B8376",
                      },
                    }}
                  />
                </fieldset>
              ) : (
                <div className="form-group">
                  <fieldset>
                    <legend className="lato-canvas-sub-title">Room</legend>
                    <Select
                      styles={{
                        ...dropdownStyle,
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: "none",
                        }),
                        container: (provided) => ({
                          ...provided,
                          border: "hidden",
                          background: "white",
                        }),
                      }}
                      defaultMenuIsOpen={true}
                      options={rooms?.map((item, i) => {
                        return { value: item.id, label: item.room };
                      })}
                      isSearchable={true}
                      placeholder="Select"
                      onChange={getGuestname}
                    />
                  </fieldset>
                </div>
              )}
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <fieldset>
                  <legend className="lato-canvas-sub-title">Guest Name</legend>
                  <div className="lato-input" style={{ margin: "5px 10px" }}>
                    {guestInfo?.guest_name ? (
                      guestInfo.guest_name
                    ) : (
                      <span className="text-white">.</span>
                    )}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          {proceed ? (
            <>
              {loader ? (
                <div className="text-center m-3">
                  <img
                    src={process.env.PUBLIC_URL + "/images/loader.gif"}
                    alt="loader"
                    width="30px"
                    className="mt-4"
                  />
                </div>
              ) : (
                <div className="row container-fluid m-0 p-2 row-cols-xxl-5 row-cols-md-3 row-cols-1 bdr-bottom">
                  {quicktasklist?.map((item, i) => {
                    return (
                      <div className="col row align-self-center m-0 p-2">
                        <div
                          className="col btn-quicktask text-center"
                          onClick={(e) => handleQuickTaskClick(e, item)}
                          task
                        >
                          {item.task}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="container-fluid m-0 p-2 bdr-bottom">
                <div className="form-group ">
                  <img
                    src={process.env.PUBLIC_URL + "/images/quick-task.svg"}
                    alt="service"
                    style={{ width: "20px" }}
                  />
                  <span className="ml-4 lato-canvas-sub-title">
                    Or add manually
                  </span>
                  <button
                    type="submit"
                    disabled={disableFlag.another_btn}
                    className={`btn-update-active lato-btn float-end ${
                      disableFlag.another_btn ? "opacity-50" : ""
                    }`}
                  >
                    Add Another
                  </button>
                </div>
              </div>
              <div className="container-fluid row m-0 p-2">
                <div className="col-md-6 p-1 pt-2">
                  <Controller
                    control={control}
                    name="task"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{ ...register("task") }}
                          filterOption={createFilter({ ignoreAccents: false })}
                          styles={floatLabel.bgWhite}
                          options={allTasklist?.map((item, i) => {
                            return { value: i, label: item.task };
                          })}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          placeholder="Task"
                          onChange={(val) => {
                            onChange(val.value);
                            handleManualTaskChange(val);
                          }}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="col p-1 pt-2">
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{ ...register("priority") }}
                          styles={floatLabel.bgWhite}
                          options={[
                            { value: 1, label: "Normal" },
                            { value: 2, label: "Medium" },
                            { value: 3, label: "High" },
                          ]}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          placeholder="Priority"
                          defaultValue={[{ value: 1, label: "Normal" }]}
                          onChange={(val) => onChange(val.value)}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="col p-1 pt-2">
                  <InputField
                    keyName="duration"
                    type="number"
                    label="Duration"
                    validation={{ ...register("duration") }}
                    min="1"
                  />
                </div>
                <div className="col p-1 pt-2">
                  <InputField
                    keyName="quantity"
                    type="number"
                    label="Quantity"
                    validation={{ ...register("quantity") }}
                    min="1"
                  />
                </div>
              </div>
              {multiSelect && taskInfo.location_groups?.length > 0 ? (
                <SimpleTable
                  loader={false}
                  key={`add_more`}
                  columns={[
                    {
                      key: "room_name",
                      label: "Location Name",
                      width: "150",
                    },
                    {
                      key: "staff_list",
                      label: "Staff",
                      // className: "text-start",
                      width: "150",
                      template: ({ children, ind }) => (
                        <div className="m-1">
                          <Controller
                            control={control}
                            name="staff"
                            render={({ field: { onChange } }) => (
                              <>
                                <Select
                                  inputRef={{ ...register("staff") }}
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  styles={floatLabel.bgWhite}
                                  options={
                                    onlineStaff?.length > 0
                                      ? onlineStaff[ind].staff_list?.map(
                                          (item) => {
                                            return {
                                              value: item.id,
                                              label: item.wholename,
                                            };
                                          }
                                        )
                                      : []
                                  }
                                  components={{
                                    ValueContainer: CustomValueContainer,
                                  }}
                                  defaultValue={
                                    onlineStaff.length > 0 && [
                                      onlineStaff[ind].staff_list?.map(
                                        (item, i) => {
                                          return {
                                            value: item.id,
                                            label: item.wholename,
                                          };
                                        }
                                      )[0],
                                    ]
                                  }
                                  placeholder="Staff"
                                  onChange={(val) => onChange(val.value)}
                                />
                              </>
                            )}
                          />
                        </div>
                      ),
                    },
                    {
                      key: "staff_list",
                      label: "Device",
                      // className: "text-center",
                      width: "150",
                      template: ({ children }) => (
                        <InputField
                          keyName="device"
                          label="Device"
                          disabled
                          validation={{ ...register("device") }}
                        />
                      ),
                    },
                  ]}
                  data={taskInfo.location_groups}
                />
              ) : (
                ""
              )}
              <div className="container-fluid row m-0 p-2">
                <div className="col-md-3 p-1">
                  <InputField
                    keyName="department"
                    label="Department"
                    validation={{ ...register("department") }}
                    disabled
                  />
                </div>
                <div className="col-md-3 p-1">
                  <InputField
                    keyName="function"
                    validation={{ ...register("function") }}
                    label="Function"
                    disabled
                  />
                </div>
                {multiSelect ? (
                  ""
                ) : (
                  <>
                    <div className="col p-1">
                      <Controller
                        control={control}
                        name="staff"
                        render={({ field: { onChange } }) => (
                          <>
                            <Select
                              inputRef={{ ...register("staff") }}
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              styles={floatLabel.bgWhite}
                              options={onlineStaff}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              defaultValue={onlineStaff[0]}
                              placeholder="Staff"
                              onChange={(val) => onChange(val.value)}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col p-1">
                      <InputField
                        keyName="device"
                        label="Device"
                        disabled
                        validation={{ ...register("device") }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="container-fluid row m-0 p-2">
                <div className="col-md-12 p-1">
                  <InputField
                    keyName="note"
                    validation={{ ...register("note") }}
                    label="Note"
                  />
                </div>
              </div>
              <div className="container-fluid m-0 p-2 pt-0">
                <div className="m-1 row p-2 align-items-center bdr-div">
                  <div className="col-md-4 bdr-right">
                    <div className="row align-items-center ml-3">
                      <div className="col-auto lato-canvas-content">
                        {" "}
                        Repeat{" "}
                      </div>
                      <div className="col-auto pb-1">
                        <label className="custom-toggle m-0">
                          <input
                            type="checkbox"
                            name="repeat"
                            {...register("repeat")}
                            onChange={() =>
                              setdisableFlag((p) => {
                                return {
                                  ...p,
                                  until: !p.until,
                                  end_date: !p.end_date,
                                };
                              })
                            }
                          />
                          <span className="custom-slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 bdr-right">
                    <div className="row align-items-center ml-3">
                      <div className="col-auto lato-canvas-content">
                        {" "}
                        Until Checkout{" "}
                      </div>
                      <div className="col-auto pb-1">
                        <label
                          className={`custom-toggle m-0 ${
                            disableFlag.until ? "opacity-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="until"
                            {...register("until")}
                            disabled={disableFlag.until}
                            onChange={() =>
                              setdisableFlag((p) => {
                                return {
                                  ...p,
                                  end_date: !p.end_date,
                                };
                              })
                            }
                          />
                          <span className="custom-slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row align-items-center ml-3">
                      <div className="col-md-3 p-0 lato-canvas-content">
                        {" "}
                        End Date{" "}
                      </div>
                      <div className="col-md-9 p-0">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            disabled={disableFlag.end_date}
                            placeholder="dd/mm/yyyy"
                            value={selectedEndDate}
                            onChange={(date) => handleEndDateChange(date)}
                            format="dd/MM/yyyy"
                            keyboardIcon={
                              <Icon>
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                                  className={
                                    disableFlag.end_date ? "opacity-50" : ""
                                  }
                                  style={{ width: "15px" }}
                                />
                              </Icon>
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-fluid m-0 p-2 pt-0">
                <div className="m-1 row p-2 align-items-center bdr-div">
                  <div className="col-md-4 bdr-right">
                    <div className="row align-items-center ml-3">
                      <div className="col-auto lato-canvas-content">
                        {" "}
                        Schedule{" "}
                      </div>
                      <div className="col-auto pb-1">
                        <label className="custom-toggle m-0">
                          <input
                            type="checkbox"
                            {...register("schedule")}
                            onChange={() =>
                              setdisableFlag((p) => {
                                return {
                                  ...p,
                                  schedule_date: !p.schedule_date,
                                };
                              })
                            }
                          />
                          <span className="custom-slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row align-items-center ml-3">
                      <div className="col-auto lato-canvas-content">
                        {" "}
                        Select Date{" "}
                      </div>
                      <div className="col-auto">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDateTimePicker
                            disabled={disableFlag.schedule_date}
                            value={selectedScheduleDate}
                            onChange={handleScheduleDateChange}
                            placeholder="dd/mm/yyyy hh:mm a"
                            format="dd/MM/yyyy hh:mm a"
                            minDate={new Date()}
                            keyboardIcon={
                              <Icon>
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                                  className={
                                    disableFlag.schedule_date
                                      ? "opacity-50"
                                      : ""
                                  }
                                  style={{ width: "15px" }}
                                />
                              </Icon>
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blank-container"></div>
              <div className="container-fluid m-0 p-2 bdr-bottom">
                <div className="form-group">
                  <img
                    src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                    alt="service"
                    style={{ width: "20px" }}
                  />
                  <span className="ml-4 lato-canvas-sub-title">
                    Attach Files
                  </span>
                </div>
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
                <div className="row p-2 m-0 align-items-center">
                  <FileUpload
                    keyName="files"
                    style={{}}
                    className="btn-update lato-submit col-2 p-2 text-center"
                    title="Upload File"
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                  <label className="col ml-3">
                    *Upload .jpg,.jpeg,.pdf,.msg and .eml file with maximum size
                    of 10MB is allowed
                  </label>
                </div>
              </div>{" "}
              <div className="blank-container"></div>
              <div className="container-fluid m-0 p-2">
                <div className="form-group">
                  <img
                    src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                    alt="service"
                    style={{ width: "20px" }}
                  />
                  <span className="ml-4 lato-canvas-sub-title">
                    Add More Tasks
                  </span>
                </div>
              </div>
              <div>
                <SimpleTable
                  loader={false}
                  key={`add_more`}
                  columns={[
                    { key: "heading", label: "Heading", width: "150" },
                    { key: "department", label: "Department", width: "150" },
                    { key: "quantity", label: "Quantity", width: "150" },
                    {
                      key: "Action",
                      label: "",
                      className: "text-center",
                      width: "50",
                      template: ({ ind }) => (
                        <div>
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/red-minus-circle.svg"
                            }
                            alt="service"
                            onClick={() => removeManualTask(ind)}
                          />
                        </div>
                      ),
                    },
                  ]}
                  data={showTaskInfoArr}
                />
              </div>
            </>
          ) : (
            <div style={{ height: "40vh", width: "100%" }}></div>
          )}
          <CreateQuickTaskModel
            show={show}
            onHide={() => setShow(false)}
            create={(data) => createQuickTask(data)}
          />
        </div>
      }
    />
  );
}

export default CreateGuest;
