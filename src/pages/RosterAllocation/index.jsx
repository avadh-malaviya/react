import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Devices from "./Includes/Devices";
import rosterService from "../../services/housekeeping/roster";
import Locations from "./Includes/Locations";
import { useAuthState } from "../../store/context";
import { ToastContainer, toast } from "react-toastify";
import { RosterContext, themes } from "./Includes/RosterContext";

function RosterAllocation() {
  const [devices, setDevices] = useState([]);
  const [mainLoader, setMainLoader] = React.useState(true);
  const [mode, setMode] = useState("deviceBased");
  const [role, setRole] = useState(0);
  const [funcs, setFuncs] = useState();
  const [func, setFunc] = useState(0);
  const [roles, setRoles] = useState();
  const [select, setSelect] = useState();
  const [reload, setReload] = useState();
  const [change, setChange] = useState(false);
  const [rosters, setRosters] = useState({});
  const {
    user: { property_id, dept_id, property_list },
  } = useAuthState();

  useEffect(() => {
    getDeptFuncList();
    getRoleList();
  }, []);

  const getDeptFuncList = async () => {
    await //
    // jsonRosterService
    rosterService
      .hskpdeptfunclist({
        property_id: property_id,
        dept_id: dept_id,
        gs_device: 2,
      })
      .then((response) => {
        console.log("response", response);
        if (response != null) {
          setFuncs(
            [{ text: "None", value: "0" }].concat(
              response.map((role) => {
                return { text: role.function, value: role.dept_func_id };
              })
            )
          );
        }
        setMainLoader(false);
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getRoleList =  async () => {
    await //
    // jsonRosterService
    rosterService
      .hskpjobrolelist({
        property_id: property_id,
      })
      .then((response) => {
        console.log("response", response);
        if (response != null) {
          setRoles(
            [{ text: "None", value: "0" }].concat(
              response.map((role) => {
                return { text: role.function, value: role.dept_func_id };
              })
            )
          );
        }
        setMainLoader(false);
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });

  }
  return (
    <>
      <RosterContext.Provider value={{
        role:role,
        setRole: setRole,
        func,
        funcs,
        setFunc,
        setFuncs,
        rosters,
        setRosters,
        reload,
        setReload,
        roles:roles,
        property_id:property_id,
        dept_id:dept_id,
        mainLoader:mainLoader,
        setMainLoader:setMainLoader,
        mode:mode,
        setMode:setMode,
        select:select,
        setSelect:setSelect,
        devices:devices,
        setDevices:setDevices,
        change:change,
        setChange:setChange,
      }}>
        <Header
          title="House keeping: Roster allocation"
          backgroundColor="#557381"
        />
        <Devices />
        <Locations  />
      </RosterContext.Provider>
    </>
  );
}
export default RosterAllocation;
