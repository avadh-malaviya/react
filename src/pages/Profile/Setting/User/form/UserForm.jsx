import Multiselect from "multiselect-react-dropdown";
import React, { useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import InputField from "../../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import userService from "../../../../../services/guestservice/settings/user/user";
import { useAuthState } from "../../../../../store/context";
import { useEffect } from "react";
import ListService from "../../../../../services/list";
import { toast } from "react-toastify";
import {
  arrayToString,
  getBase64,
  stringToArray,
} from "../../../../../helper/helper";
import FileUpload from "../../../../../common/FormElements/FileUpload";
import SimpleTable from "../../../../../common/SimpleTable";

function UserForm(props) {
  const [multiPropertyList, setMultiPropertyList] = useState([]);
  const [history, setHistory] = useState([]);
  const [tableLoader, setTableLoader] = useState(true);
  const [userGroup, setUserGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [building, setBuilding] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [shiftGroup, setShiftGroup] = useState([]);
  const [userLang, setUserLang] = useState([]);
  const [lock, setLock] = useState(0);
  const [casualStaff, setCasualStaff] = useState(3);
  const [filelist, setFilelist] = useState("");
  const [disable, setDisable] = useState(5);
  const [online, setOnline] = useState(7);
  const [saveLoader, setSaveLoader] = useState(false);
  const [check, setCheck] = useState({
    timeout: 0,
  });

  // selected value State
  const [selBuilding, setSelBuilding] = useState([]);
  const [selUserGrp, setSelUserGrp] = useState([]);

  const {
    user: { property_id, id, client_id },
  } = useAuthState();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const resetObj = {
    property: "",
    after_work: "Mobile",
    business_hours: "Mobile",
    language: 0,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "",
    ivr_code: "",
    employee_id: "",
    login_pin: "",
  };

  // component called 2

  useEffect(() => {
    if (props.tab == "users") apiCalls();
  }, [props.tab]);

  // component called 3

  useEffect(() => {
    if (props.show) {
      if (props.data == null) resetValues();
      else formValue();
    }
  }, [props.show]);

  const apiCalls = () => {
    getMultiProperty();
    getUserGroup();
    getBuildingList();
    getUserLang();
  };

  const resetValues = () => {
    setFilelist("");
    setSelBuilding([]);
    setSelUserGrp([]);
    setDepartment([]);
    setBuilding([]);
    setJobRole([]);
    setTableLoader(false);
    reset(resetObj);
  };

  const formValue = () => {
    getDepartment();
    getShiftGroup(props.data.dept_id);
    getJobRole(props.data.property_id);
    setTableLoader(true);
    getHistory();
    getImage();
    reset({
      after_work: props.data.contact_pref_nbus,
      business_hours: props.data.contact_pref_bus,
      language: props.data.lang_id,
      first_name: props.data.first_name,
      last_name: props.data.last_name,
      username: props.data.username,
      email: props.data.email,
      mobile: props.data.mobile,
      ivr_code: props.data.ivr_password,
      employee_id: props.data.employee_id,
      login_pin: props.data.login_pin,
      property: props.data.property_id,
      department: props.data.dept_id,
      job_role: props.data.job_role_id,
    });
    setSelBuilding(stringToArray(props.data.building_ids, building, "id"));
    if (props.data.usergroup != null)
      setSelUserGrp(stringToArray(props.data.usergroup, userGroup, "name"));
    setOnline(props.data.online_status == 1 ? 6 : 7);
    setCasualStaff(props.data.casual_staff == "N" ? 3 : 2);
  };

  const getHistory = () => {
    userService
      .gethistory(props.data.id)
      .then((res) => {
        setTableLoader(false);
        setHistory(res);
      })
      .catch(() => {
        setTableLoader(false);
        toast.error("Fail to fetch history");
      });
  };

  const getImage = () => {
    userService
      .getuserimage({ image_url: props.data.picture })
      .then((res) =>
        setFilelist({
          base64: res,
          name: props.data.username + "." + res.split(";")[0].split("/")[1],
        })
      )
      .catch(() => {
        toast.error("Fail to fetch user image");
        setFilelist("");
      });
  };

  const getUserGroup = () => {
    ListService.getusergrouplist()
      .then((res) => setUserGroup(res))
      .catch(() => toast.error("fail to fetch the use group record"));
  };

  const getMultiProperty = () => {
    userService
      .getmultipropertylist({ client_id: client_id })
      .then((res) =>
        setMultiPropertyList(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("fail to fetch the multiproperty"));
  };

  const getBuildingList = (prop_id = property_id) => {
    userService
      .getbuildlist({ property_id: prop_id })
      .then((res) => setBuilding(res))
      .catch(() => toast.error("fail to fetch the building list"));
  };

  const getJobRole = (prop_id) => {
    userService
      .getjobrolelist({ property_id: prop_id, job_role: "" })
      .then((res) =>
        setJobRole(
          res.map((item) => {
            return { value: item.id, label: item.job_role };
          })
        )
      )
      .catch(() => toast.error("fail to fetch the job role"));
  };

  const getDepartment = () => {
    let obj = {
      building_ids: arrayToString(selBuilding, "id"),
      department: "",
    };
    if (props.data != null) obj["building_ids"] = props.data.building_ids;
    userService
      .getdepartmentlist(obj)
      .then((res) =>
        setDepartment(
          res.map((item) => {
            return { value: item.id, label: item.department };
          })
        )
      )
      .catch(() => toast.error("fail to fetch department list"));
  };

  const getUserLang = () => {
    ListService.getuserlanglist().then((res) => {
      if (res.length == 0) setUserLang([{ value: 0, label: "English" }]);
      else
        setUserLang(
          res.map((item) => {
            return { value: item.id, label: item.lang };
          })
        );
    });
  };

  const getShiftGroup = (id) => {
    ListService.getshiftgrouplist({ dept_id: id })
      .then((res) =>
        setShiftGroup(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("fail to fetch department list"));
  };

  // component called 4

  useEffect(() => {
    if (check.timeout) clearTimeout(check.timeout);
    if (selBuilding.length > 0) {
      setCheck({
        timeout: setTimeout(async () => {
          getDepartment();
        }, 2000),
      });
    }
  }, [selBuilding]);

  const prepareObj = (data) => {
    let obj = {
      access_code: props.data == null ? null : props.data.access_code,
      agent_id: 0,
      building_ids: arrayToString(selBuilding, "id"),
      casual_staff: casualStaff == 3 ? "N" : "Y",
      contact_pref_bus: data.business_hours,
      contact_pref_nbus: data.after_work,
      dept_id: data.department,
      email: data.email,
      employee_id: data.employee_id,
      first_name: data.first_name,
      id: props.data == null ? -1 : props.data.id,
      ivr_password: data.ivr_code,
      job_role_id: data.job_role,
      lang_id: data.language,
      last_name: data.last_name,
      lock: lock == 0 ? "No" : "Yes",
      login_pin: data.login_pin,
      mobile: data.mobile,
      password: props.data == null ? "" : props.data.password,
      picture: props.data == null ? "" : filelist.name,
      // picture_name: typeof filelist == "string" ? "" : filelist.name,
      // picture_src: typeof filelist == "string" ? "" : filelist.base64,
      shift_id: data.shift_group,
      usergroup_ids: selUserGrp?.map((item) => item.id),
      username: data.username,
    };
    if (typeof filelist != "string") {
      obj["picture_name"] = filelist.name;
      obj["picture_src"] = filelist.base64;
    }
    if (props.data != null) {
      obj["usergroup"] = props.data.usergroup;
      obj["access_token"] = props.data.access_token;
      obj["active_status"] = props.data.active_status;
      obj["callaccountingnoti_status"] = props.data.callaccountingnoti_status;
      obj["created_at"] = props.data.created_at;
      obj["deleted"] = props.data.deleted;
      obj["already_deleted"] = 0;
      obj["deleted_comment"] = props.data.deleted_comment;
      obj["device_id"] = props.data.device_id;
      obj["first_send"] = props.data.first_send;
      obj["fcm_key"] = props.data.fcm_key;
      obj["last_log_in"] = props.data.last_log_in;
      obj["max_read_no"] = props.data.max_read_no;
      obj["online_status"] = online == 6 ? 1 : 0;
      obj["online_label"] = online == 6 ? "Yes" : "No";
      obj["mobile_login"] = props.data.mobile_login;
      obj["multimode_pref"] = props.data.multimode_pref;
      obj["notify_status"] = props.data.notify_status;
      obj["sound_name"] = props.data.sound_name;
      obj["sound_on"] = props.data.sound_on;
      obj["sound_title"] = props.data.sound_title;
      obj["unread"] = props.data.unread;
      obj["wakeupnoti_status"] = props.data.wakeupnoti_status;
      obj["web_login"] = props.data.web_login;
    }
    return obj;
  };

  const handleCall = (data) => {
    if (selBuilding.length == 0) return toast.error("Please select building");
    setSaveLoader(true);
    if (props.data == null) createNewUser(data);
    else updateUser(data);
  };

  const createNewUser = (data) => {
    userService
      .createuser(prepareObj(data))
      .then((res) => {
        setSaveLoader(false);
        if (res.code == 200) {
          toast.success("user created successfully");
          props.reset();
          props.handleClose();
        } else {
          if (res.code == 400)
            toast.error(
              "Username already exists. Please use a different username."
            );
          else if (res.code == 401)
            toast.error("Duplicate PIN. Please use a different PIN.");
          else if (res.code == 402)
            toast.error(
              `Duplicate IVR Code. Please use a different IVR Code. ${res.message}`
            );
          else toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error("Fail to create new user");
        setSaveLoader(false);
      });
  };

  const updateUser = (data) => {
    userService
      .updateuser(prepareObj(data), props.data.id)
      .then((res) => {
        setSaveLoader(false);
        if (res.code == 200) {
          toast.success("user updated successfully");
          props.reset();
          props.handleClose();
        } else {
          if (res.code == 401) {
            toast.error("Duplicate PIN. Please use a different PIN.");
          } else toast.error(res.message);
        }
      })
      .catch(() => {
        toast.error("Fail to update user");
        setSaveLoader(false);
      });
    console.log("update user");
  };

  const handleFileChange = (e) => {
    if (e.target.files[0].size <= 10000000) {
      getBase64(e.target.files[0]).then((res) =>
        setFilelist({ base64: res, name: e.target.files[0].name })
      );
    } else {
      toast.error("Please upload file less then or equals to 10MB");
    }
  };

  const commonOpt = [
    { value: "e-mail", label: "e-mail" },
    { value: "SMS", label: "SMS" },
    { value: "Mobile", label: "Mobile" },
  ];

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(handleCall)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/folder.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null ? "Add New User" : "Edit User"}
            </div>
          </div>
          <button className="float-end btn-update-active mr-1 lato-btn">
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
        <>
          <div
            className={
              props.data == null
                ? "setting-userdetail-form"
                : "setting-userdetail-content"
            }
          >
            {console.log("userForm component called")}
            <div className="blank-container"></div>
            <div className="container-fluid row m-0 p-2">
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="property"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{
                          ...register("property", { required: true }),
                        }}
                        styles={floatLabel.bgWhite}
                        options={multiPropertyList}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : multiPropertyList.filter(
                                (item) => item.value == props.data.property_id
                              )
                        }
                        placeholder="Property"
                        onChange={(val) => {
                          getBuildingList(val.value);
                          onChange(val.value);
                          getJobRole(val.value);
                        }}
                      />
                    </>
                  )}
                />
                {errors.property && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please select property
                  </p>
                )}
              </div>
              <div className="col-md-6 p-1 pt-2">
                <Multiselect
                  customCloseIcon={<i className="fas fa-times ml-2"></i>}
                  style={floatLabel.multiSelect}
                  displayValue="name"
                  placeholder="Building"
                  options={building}
                  selectedValues={selBuilding}
                  onSelect={(list) => setSelBuilding(list)}
                  onRemove={(list) => setSelBuilding(list)}
                />
              </div>
              <div className="col p-1 pt-2">
                <InputField
                  keyName="first_name"
                  label="First Name"
                  validation={{ ...register("first_name", { required: true }) }}
                />
                {errors.first_name && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please insert first name
                  </p>
                )}
              </div>
            </div>
            <div className="container-fluid row m-0 p-2 pt-0">
              <div className="col p-1">
                <InputField
                  keyName="last_name"
                  label="Last Name"
                  validation={{ ...register("last_name", { required: true }) }}
                />
                {errors.last_name && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please insert last name
                  </p>
                )}
              </div>
              <div className="col p-1">
                <InputField
                  keyName="username"
                  label="Username"
                  validation={{
                    ...register("username", {
                      required: true,
                      pattern: /^[A-Za-z0-9]*$/,
                    }),
                  }}
                  disabled={props.data != null}
                />
                {errors.username && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    {errors.username.type == "pattern"
                      ? "Special characters are not allowed"
                      : "Please insert username"}
                  </p>
                )}
              </div>
              {props.data == null || department.length > 0 ? (
                <div className="col p-1">
                  <Controller
                    control={control}
                    name="department"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{
                            ...register("department", { required: true }),
                          }}
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
                            getShiftGroup(val.value);
                          }}
                        />
                      </>
                    )}
                  />
                  {errors.department && (
                    <p className="text-danger pl-1 m-0 lato-error">
                      Please select building to select department
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}
              {props.data == null || jobRole.length > 0 ? (
                <div className="col p-1">
                  <Controller
                    control={control}
                    name="job_role"
                    render={({ field: { onChange } }) => (
                      <>
                        <Select
                          inputRef={{
                            ...register("job_role", { required: true }),
                          }}
                          styles={floatLabel.bgWhite}
                          options={jobRole}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          defaultValue={
                            props.data == null
                              ? ""
                              : jobRole.filter(
                                  (item) => item.value == props.data.job_role_id
                                )
                          }
                          placeholder="Job Role"
                          onChange={(val) => onChange(val.value)}
                        />
                      </>
                    )}
                  />
                  {errors.job_role && (
                    <p className="text-danger pl-1 m-0 lato-error">
                      Please select job role
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="container-fluid row m-0 p-2 pt-0">
              <div className="col p-1">
                <Controller
                  control={control}
                  name="shift_group"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{
                          ...register("shift_group", { required: true }),
                        }}
                        styles={floatLabel.bgWhite}
                        options={shiftGroup}
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
                        placeholder="Shift Group"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
                {errors.shift_group && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please select shift group
                  </p>
                )}
              </div>
              <div className="col p-1">
                <InputField
                  keyName="email"
                  label="Email"
                  validation={{ ...register("email") }}
                />
              </div>
              <div className="col p-1">
                <InputField
                  keyName="mobile"
                  label="Mobile"
                  validation={{ ...register("mobile") }}
                />
              </div>
              <div className="col-md-3 p-0 position-relative">
                <div className="pl-3 pr-3">
                  <label className="checkbox-label">Lock</label>
                  <div className="row pt-1">
                    <ButtonCheckBox
                      containerType="simple"
                      className="col m-1 lato-dropdown"
                      label="Yes"
                      value={1}
                      name="active"
                      selected={lock}
                      onChange={() => setLock(1)}
                    />
                    <ButtonCheckBox
                      containerType="simple"
                      className="col m-1 lato-dropdown"
                      label="No"
                      value={0}
                      name="active"
                      selected={lock}
                      onChange={() => setLock(0)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid row m-0 p-2 pt-0">
              <div className="col p-1">
                <InputField
                  keyName="ivr_code"
                  label="IVR Code"
                  validation={{ ...register("ivr_code") }}
                />
              </div>
              <div className="col p-1">
                <InputField
                  type="number"
                  keyName="employee_id"
                  label="Employee ID"
                  validation={{ ...register("employee_id") }}
                  min={0}
                />
              </div>
              <div className="col p-1">
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("language") }}
                        styles={floatLabel.bgWhite}
                        options={userLang}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : userLang.filter(
                                (item) => item.value == props.data.lang_id
                              )
                        }
                        placeholder="Language"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
              <div className="col p-1">
                <InputField
                  keyName="login_pin"
                  label="Login Pin"
                  validation={{ ...register("login_pin") }}
                />
              </div>
            </div>
            <div className="container-fluid row m-0 p-2 pt-0">
              <div className="col p-1">
                <Multiselect
                  customCloseIcon={<i className="fas fa-times ml-2"></i>}
                  style={floatLabel.multiSelect}
                  displayValue="name"
                  placeholder="User Group"
                  options={userGroup}
                  selectedValues={selUserGrp}
                  onSelect={(list) => setSelUserGrp(list)}
                  onRemove={(list) => setSelUserGrp(list)}
                />
              </div>
              <div className="col p-1">
                <Controller
                  control={control}
                  name="business_hours"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("business_hours") }}
                        styles={floatLabel.bgWhite}
                        options={commonOpt}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? [commonOpt[0]]
                            : commonOpt.filter(
                                (item) =>
                                  item.label == props.data.contact_pref_bus
                              )
                        }
                        placeholder="Business Hours"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
              <div className="col p-1">
                <Controller
                  control={control}
                  name="after_work"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("after_work") }}
                        styles={floatLabel.bgWhite}
                        options={commonOpt}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? [commonOpt[0]]
                            : commonOpt.filter(
                                (item) =>
                                  item.label == props.data.contact_pref_nbus
                              )
                        }
                        placeholder="After Work"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
              <div className="col-md-3 p-0 position-relative">
                <div className="pl-3 pr-3">
                  <label className="checkbox-label">Casual Staff</label>
                  <div className="row pt-1">
                    <ButtonCheckBox
                      containerType="simple"
                      className="col m-1 lato-dropdown"
                      label="Yes"
                      value={2}
                      name="casual_staff"
                      selected={casualStaff}
                      onChange={() => setCasualStaff(2)}
                    />
                    <ButtonCheckBox
                      containerType="simple"
                      className="col m-1 lato-dropdown"
                      label="No"
                      value={3}
                      name="casual_staff"
                      selected={casualStaff}
                      onChange={() => setCasualStaff(3)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {props.data == null ? (
              ""
            ) : (
              <div className="container-fluid row m-0 p-2 pt-0">
                <div className="col-md-3 p-0 position-relative">
                  <div className="pl-3 pr-3">
                    <label className="checkbox-label">Disable</label>
                    <div className="row pt-1">
                      <ButtonCheckBox
                        containerType="simple"
                        className="col m-1 lato-dropdown"
                        label="Yes"
                        value={4}
                        name="disable"
                        selected={disable}
                        onChange={() => setDisable(4)}
                      />
                      <ButtonCheckBox
                        containerType="simple"
                        className="col m-1 lato-dropdown"
                        label="No"
                        value={5}
                        name="disable"
                        selected={disable}
                        onChange={() => setDisable(5)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 p-0 position-relative">
                  <div className="pl-3 pr-3">
                    <label className="checkbox-label">Online</label>
                    <div className="row pt-1">
                      <ButtonCheckBox
                        containerType="simple"
                        className="col m-1 lato-dropdown"
                        label="Yes"
                        value={6}
                        name="online"
                        selected={online}
                        onChange={() => setOnline(6)}
                      />
                      <ButtonCheckBox
                        containerType="simple"
                        className="col m-1 lato-dropdown"
                        label="No"
                        value={7}
                        name="online"
                        selected={online}
                        onChange={() => setOnline(7)}
                      />
                    </div>
                  </div>
                </div>
                {disable == 4 ? (
                  <div className="col p-1">
                    <InputField
                      keyName="comment"
                      label="Comment"
                      validation={{ ...register("comment") }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
            <div className="blank-container"></div>
            <div className="container-fluid row m-0 p-0 bdr-bottom">
              <div className="form-group">
                <img
                  src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                  alt="service"
                  style={{ width: "20px" }}
                />
                <span className="ml-4 lato-canvas-sub-title">
                  Add Profile Photo
                </span>
              </div>
            </div>
            <div className="container-fluid row m-0 p-2 pt-0 pb-0">
              <div className="row p-2 m-0 align-items-center">
                <FileUpload
                  keyName="files"
                  style={{}}
                  className="btn-update lato-submit col-2 p-2 text-center"
                  title="Upload File"
                  onChange={(e) => handleFileChange(e)}
                />
                <label className="col ml-3">
                  *Upload .jpg,.jpeg,.pdf,.msg and .eml file with maximum size
                  of 10MB is allowed
                </label>
              </div>
              {filelist ? (
                <div
                  style={{ color: "#21BFAE" }}
                  className="col-auto image-container mt-2 p-1"
                >
                  <img src={filelist.base64} alt="" className="display-image" />
                  <i
                    className="fas fa-times-circle text-danger img-delete float-right"
                    onClick={() => setFilelist("")}
                  ></i>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="setting-userdetail-table">
            {props.data == null ? (
              ""
            ) : (
              <>
                <div className="blank-container"></div>
                <div className="container-fluid row m-0 p-0">
                  <div className="form-group">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/images/form-icons/history.svg"
                      }
                      alt="service"
                      style={{ width: "20px" }}
                    />
                    <span className="ml-4 lato-canvas-sub-title">History</span>
                  </div>
                </div>
                <SimpleTable
                  className="activity-history"
                  loader={tableLoader}
                  key={`location`}
                  columns={[
                    { key: "created_at", label: "Date & Time" },
                    { key: "action", label: "Action" },
                    { key: "detail", label: "Comment" },
                    { key: "username", label: "User" },
                  ]}
                  data={history}
                />
              </>
            )}
          </div>
        </>
      }
    />
  );
}

export default UserForm;
