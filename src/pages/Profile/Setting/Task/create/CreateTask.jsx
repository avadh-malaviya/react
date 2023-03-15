import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import Select from "react-select";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import InputField from "../../../../../common/FormElements/InputField";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import { useEffect } from "react";
import { toast } from "react-toastify";
import taskService from "../../../../../services/guestservice/settings/task/task";

function CreateTask(props) {
  const [disable, setDisable] = useState(true);
  const [active, setActive] = useState(0);
  const [taskGrpOpt, setTaskGrpOpt] = useState([]);
  const [taskCategoryOpt, setTaskCategoryOpt] = useState([]);
  const [taskLangOpt, setTaskLangOpt] = useState([]);
  const [byGuest, setByGuest] = useState("");
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (props.show) {
      if (props.data == null) resetValue();
      else {
        setDisable(false);
        setActive(props.data.status);
        if (props.data.cost == 0) setByGuest("None");
        else setByGuest("Amenities");
      }
      taskGroupOptions();
      taskCategoryOptions();
      getTaskLang();
    }
  }, [props.show]);

  useEffect(() => {
    if (props.show && taskGrpOpt.length > 0 && props.data != null) {
      reset({
        cost: props.data.cost,
        task_name: props.data.task,
        task_group: taskGrpOpt.filter(
          (item) => item.label == props.data.tgname
        )[0].value,
        task_category: props.data.category_id,
        language: props.data.lang,
        by_guest: props.data.cost == 0 ? "None" : "Amenities",
      });
    }
  }, [taskGrpOpt]);

  const resetValue = () => {
    setDisable(true);
    setActive(0);
    reset({
      cost: 0,
      task_category: 0,
      language: [],
      by_guest: "None",
      task_name: "",
    });
  };

  const taskGroupOptions = () => {
    taskService
      .gettaskgrouplist({ taskgroup: "" })
      .then((res) =>
        setTaskGrpOpt(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("Faild to fetch task group options"));
  };

  const taskCategoryOptions = () => {
    taskService
      .gettaskcategorylist({ taskgroup: "" })
      .then((res) =>
        setTaskCategoryOpt(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("Faild to fetch task group options"));
  };

  const getTaskLang = () => {
    taskService
      .getsettinguserlanglist()
      .then((res) =>
        setTaskLangOpt(
          res?.map((item) => {
            return { value: item.name, label: item.name };
          })
        )
      )
      .catch(() => toast.error("Faild to fetch task group options"));
  };

  // const taskgroupopt = taskGrpOpt?.map((item) => {
  //   return { value: item.id, label: item.name };
  // });

  // const taskcategoryopt = taskCategoryOpt?.map((item) => {
  //   return { value: item.id, label: item.name };
  // });

  const byGuestOpt = [
    { value: "None", label: "None" },
    { value: "Amenities", label: "Amenities" },
  ];

  const createNewTask = (data) => {
    let obj = {
      category_id: data.task_category,
      cost: data.cost,
      lang: data.language,
      status: active == 1,
      taskgroup_id: data.task_group,
      tasklist_name: data.task_name,
      type_id: data.by_guest,
    };
    if (props.data == null) {
      obj["id"] = -1;
      console.log("Create Task Data =>", obj);
      taskService
        .createlist(obj)
        .then(() => {
          toast.success("Task created successfully");
        })
        .catch(() => toast.error("Failed to create task"));
    } else {
      obj["id"] = props.data?.id;
      obj["lang"] = typeof obj.lang == "string" ? [] : obj.lang;
      taskService
        .updateTask(obj, props.data?.id)
        .then(() => {
          toast.success("Task updated successfully");
        })
        .catch(() => toast.error("Failed to update task"));
    }
    props.reset();
    props.handleClose();
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewTask)}
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
              {props.data == null ? "Add New Task" : "Edit Task"}
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
            {props.data == null ? "Save" : "Update"}
          </button>
        </div>
      }
      bodyContainer={
        <div className="setting-taskdetail-content" style={{ height: "400px" }}>
          <div className="blank-container"></div>
          <div className="container-fluid row m-0 p-2">
            {taskGrpOpt.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="task_group"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("task_group") }}
                        styles={floatLabel.bgWhite}
                        options={taskGrpOpt}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : taskGrpOpt.filter(
                                (item) => item.label == props.data.tgname
                              )
                        }
                        placeholder="Task Group"
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
            {taskCategoryOpt.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="task_category"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("task_category") }}
                        styles={floatLabel.bgWhite}
                        options={taskCategoryOpt}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : taskCategoryOpt.filter(
                                (item) => item.value == props.data.category_id
                              )
                        }
                        placeholder="Task Category"
                        onChange={(val) => {
                          onChange(val.value);
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
                keyName="task_name"
                label="Task Name"
                validation={{ ...register("task_name") }}
              />
            </div>
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="by_guest"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("by_guest") }}
                      styles={floatLabel.bgWhite}
                      options={byGuestOpt}
                      defaultValue={
                        props?.data == null
                          ? [byGuestOpt[0]]
                          : props?.data?.cost == 0
                          ? [byGuestOpt[0]]
                          : [byGuestOpt[1]]
                      }
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Type"
                      onChange={(val) => {
                        onChange(val.value);
                        setByGuest(val.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col-md-3 p-1">
              <Controller
                control={control}
                name="language"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{ ...register("language") }}
                      styles={floatLabel.bgWhite}
                      options={taskLangOpt}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      defaultValue={
                        props.data == null
                          ? ""
                          : taskLangOpt.filter(
                              (item) => item.value == props.data.lang
                            )
                      }
                      placeholder="Language"
                      onChange={(val) => onChange(val.value)}
                    />
                  </>
                )}
              />
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Active</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Yes"
                    value={1}
                    name="active"
                    selected={active}
                    onChange={() => setActive(1)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="No"
                    value={0}
                    name="active"
                    selected={active}
                    onChange={() => setActive(0)}
                  />
                </div>
              </div>
            </div>
            {byGuest == "Amenities" ? (
              <div className="col-md-3 p-1">
                <InputField
                  keyName="cost"
                  label="Cost"
                  validation={{ ...register("cost") }}
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

export default CreateTask;
