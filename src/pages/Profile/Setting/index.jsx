import React, { useState } from "react";
import { useEffect } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../../common/Header";
import SubHeader from "../../../common/SubHeader";
import exportService from "../../../services/export";
import { useAuthState } from "../../../store/context";
import CreateDeptFun from "./Department/create/CreateDeptFun";
import DepartmentFunction from "./Department/DepartmentFunction";
import CreateDevice from "./Device/create/CreateDevice";
import Devices from "./Device/Device";
import Escalation from "./Escalation/Escalation";
import LocationForm from "./Location/form/LocationForm";
import Location from "./Location/Location";
import LocationGroup from "./LocationGroup/LocationGroup";
import LocGrpForm from "./LocationGroup/LocGrpForm/LocGrpForm";
import CreateShift from "./Shift/create/CreateShift";
import Shift from "./Shift/Shift";
import Task from "./Task";
import CreateTask from "./Task/create/CreateTask";
import TaskGroup from "./TaskGroup";
import CreateTaskGroup from "./TaskGroup/create/CreateTaskGroup";
import UserForm from "./User/form/UserForm";
import Users from "./User/Users";

function GuestServiceSettings(props) {
  const [searchoption, setSearchoption] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");
  const [exportLoader, setExportLoader] = useState(false);

  // state of canvas Flag ------------------------------
  const [TaskFlag, setTaskFlag] = useState(false);
  const [taskGroupFlag, setTaskGroupFlag] = useState(false);
  const [deviceFlag, setDeviceFlag] = useState(false);
  const [shiftsFlag, setShiftsFlag] = useState(false);
  const [deptFunFlag, setDeptFunFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [locationFlag, setLocationFlag] = useState(false);
  const [locationGrpFlag, setLocationGrpFlag] = useState(false);

  // state of search Flag ------------------------------
  const [taskSearch, setTaskSearch] = useState(false);
  const [taskGroupSearch, setTaskGroupSearch] = useState(false);
  const [deviceSearch, setDeviceSearch] = useState(false);
  const [shiftsSearch, setShiftsSearch] = useState(false);
  const [DeptFunSearch, setDeptFunSearch] = useState(false);
  const [userSearch, setUserSearch] = useState(false);
  const [locationSearch, setLocationSearch] = useState(false);
  const [locationGrpSearch, setLocationGrpSearch] = useState(false);
  const {
    user: { property_id, id, wholename },
  } = useAuthState();

  const onSearchChange = async (e) => {
    if (e.key === "Enter") {
      console.log("search called", e.target.value);
      setSearchoption(e.target.value);
      searchNow();
    } else {
      setTaskSearch(false);
      setTaskGroupSearch(false);
      setShiftsSearch(false);
      setDeptFunSearch(false);
      setUserSearch(false);
      setLocationSearch(false);
      await setLocationGrpSearch(false);
    }
  };

  const searchNow = () => {
    switch (activeTab) {
      case "tasks":
        setTaskSearch(true);
        break;
      case "tasks_group":
        setTaskGroupSearch(true);
        break;
      case "department_function":
        setDeptFunSearch(true);
        break;
      case "escalation":
        break;
      case "shifts":
        setShiftsSearch(true);
        break;
      case "devices":
        setDeviceSearch(true);
        break;
      case "users":
        setUserSearch(true);
        break;
      case "location":
        setLocationSearch(true);
        break;
      case "location_group":
        setLocationGrpSearch(true);
        break;

      default:
        break;
    }
  };

  const createNew = () => {
    switch (activeTab) {
      case "tasks":
        setTaskFlag(true);
        break;
      case "tasks_group":
        setTaskGroupFlag(true);
        break;
      case "department_function":
        setDeptFunFlag(true);
        break;
      case "escalation":
        break;
      case "shifts":
        setShiftsFlag(true);
        break;
      case "devices":
        setDeviceFlag(true);
        break;
      case "users":
        setUserFlag(true);
        break;
      case "location":
        setLocationFlag(true);
        break;
      case "location_group":
        setLocationGrpFlag(true);
        break;

      default:
        break;
    }
  };

  const exportExcel = () => {
    setExportLoader(true);
    switch (activeTab) {
      case "tasks":
        exportService
          .exportTask({ excel_type: "excel" })
          .then(() => setExportLoader(false))
          .catch(() => {
            toast.error("fail to export excel");
            setExportLoader(false);
          });
        break;
      case "department_function":
        exportService
          .exportDeptFun({})
          .then(() => setExportLoader(false))
          .catch(() => {
            toast.error("fail to export excel");
            setExportLoader(false);
          });
        break;
      case "devices":
        exportService
          .exportDevice({})
          .then(() => setExportLoader(false))
          .catch(() => {
            toast.error("fail to export excel");
            setExportLoader(false);
          });
        break;
      case "users":
        exportService
          .exportUsers({ excel_type: "excel" })
          .then(() => setExportLoader(false))
          .catch(() => {
            toast.error("fail to export excel");
            setExportLoader(false);
          });
        break;

      default:
        break;
    }
  };

  const resetNow = () => {
    setSearchoption("");
    searchNow();
  };

  return (
    <>
      <ToastContainer />
      <CreateTask
        show={TaskFlag}
        handleClose={() => setTaskFlag(false)}
        data={null}
        reset={resetNow}
      />
      <CreateTaskGroup
        show={taskGroupFlag}
        handleClose={() => setTaskGroupFlag(false)}
        data={null}
        reset={resetNow}
      />
      <CreateDevice
        show={deviceFlag}
        handleClose={() => setDeviceFlag(false)}
        data={null}
        reset={resetNow}
        tab={activeTab}
      />
      <CreateShift
        show={shiftsFlag}
        handleClose={() => setShiftsFlag(false)}
        data={null}
        reset={resetNow}
        tab={activeTab}
      />
      <CreateDeptFun
        show={deptFunFlag}
        handleClose={() => setDeptFunFlag(false)}
        data={null}
        reset={resetNow}
      />
      <UserForm
        show={userFlag}
        handleClose={() => setUserFlag(false)}
        data={null}
        reset={resetNow}
        tab={activeTab}
      />
      <LocationForm
        show={locationFlag}
        handleClose={() => setLocationFlag(false)}
        data={null}
        reset={resetNow}
      />
      <LocGrpForm
        show={locationGrpFlag}
        handleClose={() => setLocationGrpFlag(false)}
        data={null}
        reset={resetNow}
      />
      <Header
        title="House keeping"
        action={
          <Row className="mt-2 pt-1 text-white lato-header-action">
            <div className="col-auto row align-items-center mr-3">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/support-white.svg"
                }
                className="col-auto p-0"
              />
              <span className="col-auto"> Support </span>
            </div>
            {/* <div className="col-auto row align-items-center mr-3">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/screen-white.svg"
                }
                className="col-auto p-0"
              />
              <span className="col-auto"> Front Ofice </span>
            </div> */}
            {/* <div className="col-auto row align-items-center mr-3">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/logout-white.svg"
                }
                className="col-auto p-0"
              />
              <span className="col-auto"> Logout </span>
            </div> */}
            <div className="col-auto mr-4 pl-0">{wholename}</div>
          </Row>
        }
      />
      <SubHeader
        title={
          <Row>
            <Link to="/guests/logbook" className="col-auto">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/arrow-left.svg"
                }
              />
            </Link>
            <span className="col-auto">Guest Services Settings</span>{" "}
          </Row>
        }
        background="white"
        actions={
          activeTab == "escalation" ? (
            ""
          ) : (
            <>
              {activeTab == "tasks_group" ||
              activeTab == "shifts" ||
              activeTab == "location" ||
              activeTab == "location_group" ? (
                ""
              ) : (
                <button
                  type="button"
                  className="col-auto row align-items-center lato-btn btn-update-active mr-4"
                  onClick={exportExcel}
                >
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/general-icons/export-white.svg"
                    }
                    className="col-auto p-0"
                    style={{ width: "10px" }}
                  />
                  {exportLoader ? (
                    <img
                      src={process.env.PUBLIC_URL + "/images/loader.gif"}
                      style={{ width: "43px" }}
                    />
                  ) : (
                    <span className="col-auto pl-2 pr-0">Export File</span>
                  )}
                </button>
              )}
              <button
                type="button"
                className="col-auto row align-items-center lato-btn btn-update-active mr-1"
                onClick={createNew}
              >
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/images/general-icons/plus-white.svg"
                  }
                  className="col-auto p-0"
                  style={{ width: "10px" }}
                />
                <span className="col-auto pl-2 pr-0">Add New</span>
              </button>
            </>
          )
        }
        search={
          <>
            <div className="input-group export-excel">
              <div className="input-group-prepend">
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  style={{ border: "hidden", background: "#F4F4F4" }}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/images/search-icon.svg"}
                    className="mb-1"
                    alt={"search"}
                    // width="125%"
                  />
                </button>
              </div>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
                name="search"
                // value={searchoption}
                // defaultValue={""}
                onKeyDown={onSearchChange}
                // onChange={(e) => setSearchoption(e.target.value)}
                style={{ border: "hidden", background: "#F4F4F4" }}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  style={{ border: "hidden", background: "#F4F4F4" }}
                  //   onClick={() => setShowFilter(true)}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/images/filter-icon.svg"}
                    alt=""
                  />
                </button>
              </div>
            </div>
          </>
        }
      />
      <div className="guestservice-settings">
        <Tabs defaultActiveKey="tasks" onSelect={(e) => setActiveTab(e)}>
          <Tab
            eventKey="tasks"
            title={<span className="lato-sub-tab">Tasks</span>}
          >
            {activeTab == "tasks" ? (
              <Task search={taskSearch ? searchoption : null} tab={activeTab} />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="tasks_group"
            title={<span className="lato-sub-tab">Tasks Group</span>}
          >
            {activeTab == "tasks_group" ? (
              <TaskGroup
                search={taskGroupSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="department_function"
            title={<span className="lato-sub-tab">Department Function</span>}
          >
            {activeTab == "department_function" ? (
              <DepartmentFunction
                search={DeptFunSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="escalation"
            title={<span className="lato-sub-tab">Escalation</span>}
          >
            {activeTab == "escalation" ? <Escalation tab={activeTab} /> : ""}
          </Tab>
          <Tab
            eventKey="shifts"
            title={<span className="lato-sub-tab">Shifts</span>}
          >
            {activeTab == "shifts" ? (
              <Shift
                search={shiftsSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="devices"
            title={<span className="lato-sub-tab">Devices</span>}
          >
            {activeTab == "devices" ? (
              <Devices
                search={deviceSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="users"
            title={<span className="lato-sub-tab">Users</span>}
          >
            {activeTab == "users" ? (
              <Users
                search={userSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="location"
            title={<span className="lato-sub-tab">Location</span>}
          >
            {activeTab == "location" ? (
              <Location
                search={locationSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
          <Tab
            eventKey="location_group"
            title={<span className="lato-sub-tab">Location Group</span>}
          >
            {activeTab == "location_group" ? (
              <LocationGroup
                search={locationGrpSearch ? searchoption : null}
                tab={activeTab}
              />
            ) : (
              ""
            )}
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default GuestServiceSettings;
