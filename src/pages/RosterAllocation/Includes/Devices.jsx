import React, { useEffect, useState, useCallback, useContext } from "react";
import SubHeader from "../../../common/SubHeader";
import SimpleTable from "../../../common/SimpleTable";
import userService from "../../../services/users";

import ButtonCheckBox from "../../../common/FormElements/ButtonCheckBox";
import Dropdown from "../../../common/FormElements/Dropdown";
import Switcher from "../../../common/FormElements/Switcher";
import rosterService from "../../../services/housekeeping/roster";
import { useAuthState } from "../../../store/context";
import PlanButton from "../../../common/PlanButton";
import { ToastContainer, toast } from "react-toastify";
import { RosterContext } from "./RosterContext";
import ClearAllModal from "./ClearAllModal";
import RoomTransferModal from "./RoomTransferModal";

function Devices(props) {
  const {property_id, dept_id, role, setRole, roles, funcs, func, setFunc, mainLoader, setMainLoader, mode, setMode, select, setSelect, devices, setDevices, change, setChange, rosters, setRosters, reload, setReload} = useContext(RosterContext);
  const [active, setActive] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalTransferShow, setModalTransferShow] = useState(false);

  const getDeviceList = useCallback(async () => {
    await //
    // jsonRosterService
    rosterService
      .hskpdevicelist({
        property_id: property_id,
        dept_id: dept_id,
        dept_func: parseInt(func),
        active_flag: active ? 1 : 0,
      })
      .then((response) => {
        console.log("response", response);
        if (response != null) {
          setDevices(response?.device_list);
        }
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  }, [role, func, property_id, dept_id, active]);

  const getRosters = useCallback(async () => {
    if(select !== null) {
      await //
      // jsonRosterService
      rosterService
        .getrosters({
          filter:{},
          dept_func_id:parseInt(func),
          device_id:select,
          property_id:property_id
        })
        .then((response) => {
          console.log("getRosters", response);
          if (response != null) {
            let datalist = response?.datalist;
            setDevices(devices.map((device) => {
              if(datalist?.device === device.id) {
                device.locations = datalist?.locations ? datalist?.locations : [];
              }
              return device
            }))
            setRosters({...rosters, [select]: datalist});
          }
        })
        .catch((error) => {
          setMainLoader(false);
          toast.error("Something went wrong");
        });
    }
  }, [role, func, property_id, dept_id, active, select, devices, rosters]);

  // JobRole

  // active
  const activeChange = (e) => setActive(e.target.checked);

  // select
  const onSelect = (e) => {
    console.log('select', select)
    if(select !== undefined && select !== null) {
      setChange(true);
    } else {
      toast.error("Select any one");
    }
  };

  // change
  const onChange = (e) => {
    setChange(false);
    setSelect(null)
  };

  useEffect(() => {
    getDeviceList();
  }, [role, func, mode, active])

  useEffect(() => {
    getRosters();
  }, [change, reload]);

  //
  return (
    <>
      <ToastContainer />
      <SimpleTable
        subHeaderTitleWidth={6}
        subHeaderActions={<>{change ?
          <div style={{textAlign: 'end'}}>
            <PlanButton color="green" className="pt-0 pb-0" type='fill' onClick={() => setModalTransferShow(true)}>Transfer</PlanButton>
            <PlanButton color="red" className="pt-0 pb-0 ml-2" type='fill' onClick={()=>setModalShow(true)}>Clear All</PlanButton>
          </div>
        : <></>}
        </>}
        loader={mainLoader}
        title="Devices"
        key={`devices`}
        columns={[
          {
            key: "name",
            label: "User",
            width: "150",
            isActive: true,
            className: "user",
          },
          { key: "room_count", label: "Room Assigned", width: "150" },
          {
            key: "total_credits",
            label: "Credit Allocated",
            width: "150",
            spaceBefore: true,
            spaceAfter: true,
            spaceIconAfter: true,
            icon: <i className="allocate-bar"></i>,
          },
          {
            key: "location_list",
            label: "",
            template: ({ children }) => (
              <>
                {children &&
                  children.length > 0 &&
                  children.map((label) => <>{label?.map((a) => <label className="room-label">{a}</label>)}</>)}
              </>
            ),
          },
        ].concat( change ? [
          {
            key: "id",
            label: '',
            width: "100",
            name: 'change',
            template: ({ children }) => (
              <>
                {children &&
                  children.length > 0 &&
                  children.map((label) => {
                    return <PlanButton className="pt-0 pb-0" color="red" onClick={onChange}>Change</PlanButton>
                  })}
              </>
            ),
          }
        ] : [
          {
            key: "id",
            label: <PlanButton className="pt-0 pb-0" onClick={onSelect}>Select</PlanButton>,
            width: "100",
            radiobox: true,
            name: 'select',
            onChange: (e) => setSelect(e.target.value)
          }
        ]) }
        data={change ? devices.filter((device)=> device.id === parseInt(select)) : devices}
        actions={change === false ? [
          <div className="form-group">
            <label htmlFor="mode" className="ml-2">
              Mode
            </label>
            <div className="row">
              <ButtonCheckBox
                label="User Based"
                value="userBased"
                name="mode"
                selected={mode}
                onChange={setMode.bind(this, "userBased")}
              />
              <ButtonCheckBox
                label="Device Based"
                value="deviceBased"
                name="mode"
                selected={mode}
                onChange={setMode.bind(this, "deviceBased")}
              />
            </div>
          </div>,
          <div className="form-group">
            {mode === 'deviceBased' ? <>
            <label htmlFor="mode">Function</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={funcs}
              selected={func}
              defaultValue={0}
              onChange={(e) => setFunc(e.target.value)}
            /></>:<>
            <label htmlFor="mode">Job Role</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={roles}
              selected={role}
              defaultValue={0}
              onChange={(e) => setRole(e.target.value)}
            /></>}
          </div>,

          <div className="form-group">
            <label></label>
            <Switcher
              className="col-lg-6"
              name="activeonly"
              placeholder="Active Only"
              checked={active}
              defaultValue={false}
              onChange={activeChange}
            />
          </div>,

          <label> Or </label>,

          <div className="form-group">
            <label htmlFor="mode">Group (optional)</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={[
                { text: "Select group", value: "" },
                { text: "group 1", value: "group-1" },
              ]}
              defaultValue={""}
            />
          </div>,
        ]:[]}
        cardBodyPadding="8px 16px"
        className="roster-allocation"
      />
      <ClearAllModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <RoomTransferModal
        show={modalTransferShow}
        onHide={() => setModalTransferShow(false)}
      />

    </>
  );
}
export default Devices;
