import React, { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import room from "./../../config/room";
import roomStyles from "../../config/room-styles";
import TableContent from "./TableContent";
import FormModal from "./ManualFormModal";
import SubHeader from "../../common/SubHeader";
import realtimeService from "../../services/housekeeping/realtime";
import defaultFilter from "../../config/default-filter";
import { useAuthState } from "../../store/context";
import { Col, Form, Row } from "react-bootstrap";
import Header from "../../common/Header";
import MainLoader from "../../common/MainLoader";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "../../common/FormElements/Dropdown";
import { ListOptions } from "../../common/TaskActions/GetActions";

const Dashboard = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [scheduleList, setScheduleList] = React.useState([]);
  const {
    user: { property_id },
  } = useAuthState();
  const [room, setRoom] = React.useState([]);
  const [searchval, setSearch] = React.useState("");
  const [statusTag, setStatusTag] = React.useState("");
  const [roomTypes, setRoomTypes] = React.useState([]);
  const [roomType, setRoomType] = React.useState("All");
  const [staffs, setStaffs] = React.useState([]);
  const [staff, setStaff] = React.useState("All");
  const [check, setCheck] = React.useState({
    timeout: 0,
  });
  const [mainLoader, setMainLoader] = React.useState(true);

  const bindRoomCount = (data) => {
    let cleaning_room_count = data?.cleaning_room_count;

    let newroom = [];
    room.forEach((el, index) => {
      newroom[index] = {
        ...el,
        count: cleaning_room_count[index].count,
        header_name: cleaning_room_count[index].status_name,
      };
    });

    setRoom(newroom);
    setMainLoader(false);
  };

  const extractRoomTypes = (data) => {
    let datalist = data?.datalist;
    let roomtypes = ["All"];
    let roomstaffs = ["All"];
    datalist.forEach((dataitem) =>
      dataitem?.room_list?.forEach((room) => {
        roomtypes[room?.type_id] = room?.type;
        roomstaffs[room?.assigne_id] = room?.assigne_to;
      })
    );
    setRoomTypes(ListOptions(roomtypes));
    setStaffs(ListOptions(roomstaffs));
  };

  const fetchData = (data) => {
    return new Promise((resolve, reject) => {
      realtimeService
        .gethskpstatusbyfloor({
          property_id: property_id,
          filter: {
            ...defaultFilter,
            search_room: data?.search_room,
            status_tags: data?.status_tags ? [data?.status_tags] : [],
          },
        })
        .then((res) => {
          bindRoomCount(res);
          extractRoomTypes(res);
          resolve(res);
        })
        .catch((error) => {
          setMainLoader(false);
          toast.error("Something went wrong");
          reject(error);
        });
    });
  };

  const guestData = () => {
    realtimeService.listHskpstatus().catch(() => {
      toast.error("Something went wrong");
      setMainLoader(false);
    });
    realtimeService
      .roomcleaningstatelist()
      .then((res) => {
        // console.log("res ++++", res);
        res = res.sort(function (a, b) {
          return a.attendant_order - b.attendant_order;
        });
        // console.log("after sort res", res);
        setRoom(res);
      })
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getScheduleList = () => {
    realtimeService
      .schedulelist()
      .then((res) => setScheduleList(["Not Applicable", ...res]));
  };

  useEffect(() => {
    getScheduleList();
    guestData();
  }, []);

  const searchRoom = (elem) => {
    if (elem.key === "Enter") {
      elem.preventDefault();
      return setSearch(elem.target.value);
    }
    if (check.timeout) clearTimeout(check.timeout);
    setCheck({ timeout: setTimeout(() => setSearch(elem.target.value), 2000) });
  };

  return (
    <>
      <ToastContainer />
      <Header title="House keeping: Real Time" />
      <div className="dashboard realtime-dashboard">
        <FormModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          scheduleList={scheduleList}
        />
        <SubHeader
          title={`Live Room Status`}
          actions={
            <>
              <div
                className="col-xl-3 drop-btn lato-dropdown"
                style={{ width: "204px" }}
              >
                <span className="mr-1 color-blue">Status:</span>
                <select
                  name="status"
                  onChange={(e) => setStatusTag(e.target.value)}
                  className="selectdrop"
                >
                  <option>All</option>
                  {room?.map((item, i) => {
                    return (
                      <option value={i} key={i}>
                        {item.status_name}
                      </option>
                    );
                  })}
                </select>
                <i className="fas fa-angle-down float-right pt-1 color-blue"></i>
              </div>
              <div
                className="col-xl-3 drop-btn ml-2 lato-dropdown"
                style={{ width: "204px" }}
              >
                <span className="mr-1 color-blue">Staff:</span>
                <Dropdown
                  options={staffs}
                  selected={staff}
                  name="staff"
                  className="selectdrop"
                  onChange={(e) => setStaff(e.target.value)}
                />
                <i className="fas fa-angle-down float-right pt-1 color-blue"></i>
              </div>
              <div
                className="col-xl-5 drop-btn ml-2 lato-dropdown"
                style={{ width: "318px" }}
              >
                <span className="mr-1 color-blue">Room Type:</span>
                <Dropdown
                  options={roomTypes}
                  selected={roomType}
                  name="room_type"
                  className="selectdrop"
                  onChange={(e) => setRoomType(e.target.value)}
                />
                <i className="fas fa-angle-down float-right pt-1 color-blue"></i>
              </div>
            </>
          }
          search={
            <>
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    type="button"
                    className="btn btn-sm btn-default"
                    style={{
                      border: "hidden",
                      background: "white",
                      borderRadius: "6px 0px 0px 6px",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/images/search-icon.svg"}
                      className="mb-1"
                      // width="125%"
                    />
                  </button>
                </div>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  style={{ border: "hidden" }}
                  onKeyPress={(e) => searchRoom(e)}
                  onChange={(e) => searchRoom(e)}
                />
              </div>
            </>
          }
        />
        <Tabs>
          <TabList className="p-0 m-0">
            <Row className="w-100 m-0">
              {room &&
                room.length > 0 &&
                room.map((item, index) => {
                  let style = roomStyles[item.header_name];
                  // console.log("style", style !== undefined);
                  if (style === undefined) return <></>;
                  return (
                    <Tab
                      key={index}
                      style={{ display: "block" }}
                      className="col-xl col-lg-2 col-sm-3 col-6"
                    >
                      <Row className={style.class}>
                        <Col className="text-right m-1 p-1">
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              `/images/room-icons/${style.icon}`
                            }
                            alt={item.header_name}
                            width={style.room === "Dnd" ? "30%" : "50%"}
                            className="pt-1"
                          />
                        </Col>
                        <Col className="m-1 p-1">
                          <div className="h2"> {item?.count || 0} </div>
                          <div> {item.header_name} </div>
                        </Col>
                      </Row>
                    </Tab>
                  );
                })}
            </Row>
          </TabList>
          {room &&
            room.length > 0 &&
            room.map((item, index) => {
              let style = roomStyles[item.status_name];
              if (style === undefined) return <></>;
              return (
                <TabPanel key={index}>
                  <TableContent
                    searchRoom={searchval}
                    status_tag={statusTag}
                    status_arr={room}
                    fetchData={fetchData}
                    roomType={roomType}
                    staff={staff}
                    {...style}
                  />
                </TabPanel>
              );
            })}
        </Tabs>
      </div>
      {mainLoader ? <MainLoader /> : ""}
    </>
  );
};
export default Dashboard;
