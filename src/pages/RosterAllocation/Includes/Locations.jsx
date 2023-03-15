import React, { useContext, useEffect, useState } from "react";
import SubHeader from "../../../common/SubHeader";
import SimpleTable from "../../../common/SimpleTable";
import userService from "../../../services/users";

import ButtonCheckBox from "../../../common/FormElements/ButtonCheckBox";
import Dropdown from "../../../common/FormElements/Dropdown";
import Switcher from "../../../common/FormElements/Switcher";
import rosterService from "../../../services/housekeeping/roster";
import PlanButton from "../../../common/PlanButton";
import { ToastContainer, toast } from "react-toastify";
import RemarkModal from "./RemarkModal";
import { ROOM_STATUS_LIST, OCCUP_LIST  } from "./Consts";
import { RosterContext } from "./RosterContext";
import AssignedRoomModal from "./AssignedRoomModal";
import SimpleCheckbox from "../../../common/FormElements/InputCheckbox";
import Select, {components} from 'react-select';

function Locations(props) {
  const {property_id, dept_id, func, role, roles, mainLoader, setMainLoader, mode, select, change, devices, rosters, setRosters, setReload} = useContext(RosterContext);
  const [locations, setLocations] = useState([]);
  const [viewby, setViewby] = useState("floor");
  const [builds, setBuilds] = useState([]);
  const [build, setBuild] = useState();
  const [remarkRoom, setRemarkRoom] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [modalAssignedShow, setModalAssignedShow] = useState(false);
  const [assignes, setAssignes] = useState([]);
  const [occupfilter, setOccupfilter] = useState({
    occupied: false,
    vacant: false
  });
  const [filter, setFilter] = useState({
    unassigned: false,
    dirty: false,
    dueout: false,
    inspected: false,
    clean: false
  });
  const [suggestion, setSuggestion] = useState('');

  const [occupancy, setOccupancy] = useState('All');
  const [room, setRoom] = useState('All');
  const [floors, setFloors] = useState([]);
  const roomList = ROOM_STATUS_LIST;
  const occupancyList = OCCUP_LIST;

  useEffect(() => {
    if(occupancy === 'occupied') {
      setOccupfilter({occupied: true});
    } else if(occupancy === 'vacant') {
      setOccupfilter({vacant: true});
    } else{
      setOccupfilter({occupied: false, vacant: false});
    }
  }, [occupancy])

  useEffect(() => {
    switch(room) {
      case 'unassigned':
        setFilter({unassigned: true});
        break;
      case 'dirty':
        setFilter({dirty: true});
        break;
      case 'clean':
        setFilter({clean: true});
        break;
      case 'inspected':
        setFilter({inspected: true});
        break;
      case 'dueout':
        setFilter({dueout: true});
        break;
      default:
        break;

    }
  }, [room])

  useEffect(() => {
    console.log('change', change);
    console.log('suggestion', suggestion);
    if(change) {
      if(viewby === 'floor') {
        getFloorList();
      }else {
        // Prepare floor sugguestion list
        getFloorListByRoom();
      }
    } else {
      setLocations([]);
    }
  },[change, viewby, build, occupfilter, filter, suggestion]);


  useEffect(() => {
    getBuildList();
  }, []);

  useEffect(() => {
    console.log('rosters', rosters);
  },[rosters])

  const getBuildList = async () => {
    await rosterService
      .buildList({
        property_id: property_id,
      })
      .then((response) => {
        if (response != null) {
          setBuilds(
            [{ text: "All Building", value: "0" }].concat(
              response.map((build) => {
                return { text: build.name, value: build.id };
              })
            )
          );
        }
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };
  const getFloorList = async () => {
    if(viewby === 'floor') {
      await rosterService
      .getfloorlist({
        property_id,
        dept_id,
        dept_func_id: parseInt(func),
        job_role_id:0,
        building_id:build,
        filter,
        occupfilter,
        dispatcher:0,
        device_flag: mode === "deviceBased" ? 1 : 0,
      })
      .then((response) => {
        if (response != null) {
          const floors = response?.floor_list?.map((floor) => floor.id)

          console.log('floors',floors);

          getRoomListUnassign(floors)
        }
        setMainLoader(false);
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
    }
  };

  const getFloorListByRoom = async () => {
    await rosterService
      .floorList({
        property_id,
        building_id: build,
      })
      .then((response) => {
        if (response != null) {
          setFloors(response);
          getRoomListUnassign([])
        }
        setMainLoader(false);
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });

  }

  const getRoomListUnassign = (floors) => {
    return rosterService
      .getroomlistunassign(
      {
        property_id,
        dept_id,
        building_id:build,
        floors: viewby === 'floor' ? floors : floors.filter(floor => suggestion.map(sug => sug.value).indexOf(floor.id) !== -1 ),
        begin_date_time:"2022-04-09 00:00",
        room_category:"",
        dispatcher: 0,
        device_flag: mode === "deviceBased" ? 1 : 0,
        dept_func: parseInt(func),
        job_role_id: 0,
        exceptions_list: [],
        filter,
        occupfilter,
      })
      .then((response) => {
        if (response != null) {
          setLocations(response?.datalist ?? []);
        }
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const onRemark = (data, e) => {
    setRemarkRoom(data);
    setModalShow(true)
  }

  const onAssignes = (e) => {
    let value = e.target.value;
    if(e.target.checked) {
      setAssignes([...assignes, parseInt(value)] )
    } else {
      setAssignes(assignes.filter((assigne) => assigne === value) )
    }
  }

  const updateRosterDevice = () => {
    let selected = devices.find(r => r.id === parseInt(select)) ?? {};
    const { id, device_id, name, total_credits, supervisor_id } = selected
    if(selected) return rosterService
      .updaterosterdevice({
        // ...selected,
        assigned_list: assignes,
        casual_staff: {new_staff_name:null, id: null},
        dept_func_id: parseInt(func),
        device: select,
        device_id,
        device_flag: mode === "deviceBased" ? 1 : 0,
        dispatcher: 1,
        hskp_user_id:0,
        id,
        job_role_id: 0,
        property_id,
        retain_flag: 0,
        roster_name: name,
        supervisor_id,
        supr_device: {supervisor_id:0, supervisor: 'None'},
        td_list: [],
        total_credits,
        updated_by: 1,
      })
      .then((response) => {
        if (response != null) {
          // setLocations(response?.datalist ?? []);
          setModalAssignedShow(true);
          setReload(true);
        }
      })
      .catch((error) => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });

  };


  return (
    <>
      <ToastContainer />
      <SimpleTable
        loader={mainLoader}
        title="Location"
        key={`location`}
        columns={[
          { key: "room", label: "Room", width: "150" },
          { key: "floor", label: "Floor", width: "150" },
          { key: "pref", label: "Pref", width: "150" },
          { key: "adult", label: "Adult", width: "150" },
          { key: "chld", label: "Kids", width: "150" },
          { key: "credits", label: "Credits", width: "150" },
          { key: "room_type", label: "Type", width: "150" },
          { key: "room_status", label: "Status", width: "150" },
          { key: "cleaning", label: "Type", width: "150" },
          { key: "cleaning_state", label: "Cleaning", width: "150" },
          { key: "occupancy", label: "Occupancy", width: "150" },
          { key: "remark", label: "Remark", width: "150",
            template: ({ data }) => <label className="btn icon-remark" onClick={onRemark.bind(this, data)} data-id={data.id}></label>,
          },
          { key: "id", label: "", width: "150",
            template: ({ data }) => <label className="btn icon-minusbox" data-id={data.id}></label>, },
          { key: "id", label: "", width: "150", checkbox: true,
            template: ({ data }) => <SimpleCheckbox onChange={onRemark.bind(this, data)} checked={remarkRoom?.indexOf(data.id) !== -1} />,
          onChange: onAssignes },
        ]}
        data={locations}
        gridTemplateColumns={`20% 25% 27% 25% auto`}
        actions={[
          <div className="form-group">
            <label htmlFor="mode">Building</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={builds}
              selected={build}
              defaultValue={0}
              onChange={setBuild}
            />
          </div>,
          <div className="form-group">
            <label htmlFor="viewby" className="ml-2">
              View By
            </label>
            <div>
              <ButtonCheckBox
                label="Rooms"
                value="rooms"
                name="viewby"
                selected={viewby}
                onChange={setViewby.bind(this, "rooms")}
              />
              <ButtonCheckBox
                label="Floor"
                value="floor"
                name="viewby"
                selected={viewby}
                onChange={setViewby.bind(this, "floor")}
              />
            </div>
          </div>,

          <div className="form-group">
            <label htmlFor="mode">Room Status</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={roomList}
              selected={room}
              defaultValue={''}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>,
          <div className="form-group">
            <label htmlFor="mode">Occupancy</label>
            <Dropdown
              className="form-select form-control col-lg-8"
              options={occupancyList}
              selected={occupancy}
              defaultValue={0}
              onChange={(e) => setOccupancy(e.target.value)}
            />
          </div>,
        ]}
        searchbox=
        {<Select
          defaultValue={suggestion}
          options={floors ? floors.map(floor => { return {label: floor.floor_name, value: floor.id} }) : []}
          onChange={setSuggestion}
          isMulti={true}
          styles={{
            multiValueRemove: (base) => ({
              ...base,
              borderRadius: '10px',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderLeft: '0px',
            }),
            multiValue: (base) =>({
              ...base,
              background: 'rgba(29, 48, 217, 0.08)',
              color: '#21BFAE',
              border: `1px solid #1D30D9`,
              borderRadius: '10px',
            })
          }}
          components={{
            Control: ({ children, ...props }) => (
              <components.Control {...props} className={`input-group input-group-sm searchbox-container`}>
                <div className="input-group-prepend">
                    <button type="submit" className="btn">
                   <i className="fas fa-search"></i>
                 </button>
               </div>
                {children}
              </components.Control>
            )
          }}
        />}
        bulkbar={{title: 'Select Location', actions: [
          <PlanButton color="blue">Auto Assign(5)</PlanButton>,
          <PlanButton color="blue" onClick={updateRosterDevice}>Assign All <span className="icon-checkmark"></span> </PlanButton>
        ]}}
        cardBodyPadding="8px 16px"
        className="roster-allocation"
      />
      <RemarkModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        remarkRoom={remarkRoom}
      />
      <AssignedRoomModal
        show={modalAssignedShow}
        setAssignes={setAssignes}
        assignes={assignes}
        locations={locations}
        oldAssignes={rosters[select]?.location_list !== '' && rosters[select]?.location_list !== undefined ? JSON.parse(rosters[select]?.location_list) : []}
        updateRosterDevice={updateRosterDevice}
        onHide={() => {
          setModalAssignedShow(false);
        }}
      />
    </>
  );
}
export default Locations;
