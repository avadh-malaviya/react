import Multiselect from "multiselect-react-dropdown";
import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import ListService from "../../../../../services/list";
import Select from "react-select";
import { useAuthState } from "../../../../../store/context";
import shiftService from "../../../../../services/guestservice/settings/shift/shift";
import { arrayToString, stringToArray } from "../../../../../helper/helper";

function CreateShift(props) {
  const [disable, setDisable] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [userList, setUserList] = useState([]);
  const [deptFun, setDeptFun] = useState([]);
  const [taskGroup, setTaskGroup] = useState([]);
  const [building, setBuilding] = useState([]);
  const [locationGrp, setLocationGrp] = useState([]);

  // State for the selected values
  const [selUsername, setSelUsername] = useState([]);
  const [selDeptFun, setSelDeptFun] = useState([]);
  const [selSecDeptFun, setSelSecDeptFun] = useState([]);
  const [selLocGrp, setSelLocGrp] = useState([]);
  const [selSecLocGrp, setSelSecLocGrp] = useState([]);
  const [selBuilding, setSelBuilding] = useState([]);
  const [selTaskGrp, setSelTaskGrp] = useState([]);
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

  useEffect(() => {
    if (props.tab == "shifts") {
      if (!props.show) {
        getUserList();
        getDeptFunList();
        getTaskGroupList();
        getLocationGrpList();
        getBuildingList();
      } else {
        if (props.data == null) resetValue();
        else formValues(props.data);
      }
    }
  }, [props.show, props.tab]);

  const resetValue = () => {
    setSelUsername([]);
    setSelDeptFun([]);
    setSelSecDeptFun([]);
    setSelLocGrp([]);
    setSelSecLocGrp([]);
    setSelBuilding([]);
    setSelTaskGrp([]);
  };

  const getUserList = () => {
    ListService.getuserlist({})
      .then((res) =>
        setUserList(
          res.map((item) => {
            return { value: item.id, label: item.wholename };
          })
        )
      )
      .catch(() => toast.error("Fail to fetch the user list"));
  };

  const getDeptFunList = () => {
    ListService.getdepartmentfunction({})
      .then((res) => setDeptFun(res))
      .catch(() => toast.error("Fail to fetch the department function list"));
  };

  const getTaskGroupList = () => {
    ListService.gettaskgrouplist({})
      .then((res) => setTaskGroup(res))
      .catch(() => toast.error("Fail to fetch the Task Group list"));
  };

  const getLocationGrpList = () => {
    ListService.getlocationgroups({})
      .then((res) => setLocationGrp(res))
      .catch(() => toast.error("Fail to fetch the location group list"));
  };

  const getBuildingList = () => {
    ListService.getbuildinglist({})
      .then((res) => setBuilding(res))
      .catch(() => toast.error("Fail to fetch the building list"));
  };

  const formValues = (data) => {
    setSelUsername(userList.filter((item) => item.value == data.user_id));

    if (data.dept_func_ids != null)
      setSelDeptFun(stringToArray(data.dept_func_ids, deptFun, "id"));
    else setSelDeptFun([]);

    if (data.sec_dept_func_ids != null)
      setSelSecDeptFun(stringToArray(data.sec_dept_func_ids, deptFun, "id"));
    else setSelSecDeptFun([]);

    if (data.location_group_ids != null)
      setSelLocGrp(stringToArray(data.location_group_ids, locationGrp, "id"));
    else setSelLocGrp([]);

    if (data.sec_location_group_ids != null)
      setSelSecLocGrp(
        stringToArray(data.sec_location_group_ids, locationGrp, "id")
      );
    else setSelSecLocGrp([]);

    if (data.building_ids != null)
      setSelBuilding(stringToArray(data.building_ids, building, "id"));
    else setSelBuilding([]);

    if (data.task_group_ids != null)
      setSelTaskGrp(stringToArray(data.task_group_ids, taskGroup, "id"));
    else setSelTaskGrp([]);
  };

  const prepareObj = (data) => {
    console.log("username =>", selUsername);
    let obj = {
      building_ids: arrayToString(selBuilding, "id"),
      dept_func_ids: arrayToString(selDeptFun, "id"),
      id: props.data == null ? -1 : props.data.id,
      location_group_ids: arrayToString(selLocGrp, "id"),
      sec_dept_func_ids: arrayToString(selSecDeptFun, "id"),
      sec_location_group_ids: arrayToString(selSecLocGrp, "id"),
      task_group_ids: arrayToString(selTaskGrp, "id"),
      user_id: selUsername.length == 0 ? id : selUsername[0].value,
    };
    return obj;
  };

  const createNewShift = (data) => {
    setSaveLoader(true);
    if (props.data == null)
      shiftService
        .createshift(prepareObj(data))
        .then(() => {
          setSaveLoader(false);
          toast.success("shift created successfully");
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("fail to create the shift");
          setSaveLoader(false);
        });
    else
      shiftService
        .updateshift(prepareObj(data), props.data.id)
        .then(() => {
          toast.success("shift updated successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("fil to update shift");
          setSaveLoader(false);
        });
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewShift)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/edit-task.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null ? "Add New Shift" : "Edit Shift"}
            </div>
          </div>
          <button
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
        <div className="setting-shiftdetail-content" style={{ height: "80vh" }}>
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
                      options={userList}
                      value={selUsername}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Username"
                      onChange={(val) => {
                        onChange(val.value);
                        setSelUsername([val]);
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
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            <div className="col p-1">
              <Multiselect
                customCloseIcon={<i className="fas fa-times ml-2"></i>}
                displayValue="function"
                placeholder="Secondary Department Function"
                options={deptFun}
                selectedValues={selSecDeptFun}
                onSelect={(list) => setSelSecDeptFun(list)}
                onRemove={(list) => setSelSecDeptFun(list)}
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
                placeholder="Task Group"
                options={taskGroup}
                selectedValues={selTaskGrp}
                onSelect={(list) => setSelTaskGrp(list)}
                onRemove={(list) => setSelTaskGrp(list)}
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
                options={locationGrp}
                selectedValues={selLocGrp}
                onSelect={(list) => setSelLocGrp(list)}
                onRemove={(list) => setSelLocGrp(list)}
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
                placeholder="Secondary Location Group"
                options={locationGrp}
                selectedValues={selSecLocGrp}
                onSelect={(list) => setSelSecLocGrp(list)}
                onRemove={(list) => setSelSecLocGrp(list)}
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
                // ref={holdNotifyUser}
                style={floatLabel.multiSelect}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

export default CreateShift;
