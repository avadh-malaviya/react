import React, { useEffect, useState } from "react";
import { Col, DropdownButton, Row, Dropdown } from "react-bootstrap";
import SubHeader from "../../common/SubHeader";
import guestService from "../../services/guest";
import Timer from "./Includes/Timer";
import { useAuthState } from "../../store/context";
import SimpleTable from "../../common/SimpleTable";
import TaskDetail from "./Includes/TaskDetail";
import "../../css/guestservice-switch.scss";
import Header from "../../common/Header";
import CommentModal from "./Includes/CommentModal";
import GuestFilter from "./Includes/GuestFilter";
import Loader from "../../common/Loader";
import { ToastContainer, toast } from "react-toastify";
import CreateGuest from "./Includes/Create/CreateGuest";
import dateTime from "../../helper/dateTime";
import CreateDepartment from "./Includes/Create/CreateDepartment";
import departmentService from "../../services/department";
import moment from "moment";
import { Link } from "react-router-dom";

function Profile() {
  const {
    user: { property_id, id, wholename },
  } = useAuthState();
  const [ticketlist, setTicketlist] = useState([]);
  const [show, setShow] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [task, setTask] = useState({});
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loader, setLoader] = useState(false);
  const [mainLoader, setMainLoader] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [searchoption, setSearchoption] = useState("");
  const [create, setCreate] = useState(false);
  const [createDepartment, setCreateDepartment] = useState(false);
  const [ticketNo, setTicketNo] = useState({ guest: 0 });
  const [calendarFlag, setCalendarFlag] = useState(0);
  const [flagCall, setFlagCall] = useState(false);
  const [stafflist, setStafflist] = useState([]);
  const [selectedDep, setSelectedDep] = useState();
  const [locationlist, setLocationlist] = useState([]);

  const statusFlag = (array) => {
    var arr = [];
    array.map((elem, i) => {
      switch (elem.status_id) {
        case 0:
          if (elem.feedback_flag == 1 && !elem.feedback_closed_flag)
            arr = [...arr, { ...elem, status_flag: "Feedback" }];
          else arr = [...arr, { ...elem, status_flag: "Complete" }];
          break;
        case 1:
          if (elem.queued_flag == 1) {
            arr = [...arr, { ...elem, status_flag: "Open" }];
            break;
          } else if (elem.running == 1)
            arr = [...arr, { ...elem, status_flag: "Open" }];
          else arr = [...arr, { ...elem, status_flag: "Hold" }];
          break;
        case 2:
          if (elem.running == 1)
            arr = [...arr, { ...elem, status_flag: "Escalated" }];
          else arr = [...arr, { ...elem, status_flag: "Escalated Hold" }];
          break;
        case 3:
          if (elem.closed_flag == 1)
            arr = [...arr, { ...elem, status_flag: "Closed" }];
          else if (elem.feedback_flag == 1 && !elem.feedback_closed_flag)
            arr = [...arr, { ...elem, status_flag: "Feedback" }];
          else arr = [...arr, { ...elem, status_flag: "Timeout" }];
          break;
        case 4:
          arr = [...arr, { ...elem, status_flag: "Canceled" }];
          break;
        case 5:
          arr = [...arr, { ...elem, status_flag: "Scheduled" }];
          break;
        case 6:
          arr = [...arr, { ...elem, status_flag: "Unassigned" }];
          break;
        case 7:
          arr = [...arr, { ...elem, status_flag: "Closed" }];
          break;
        default:
          break;
      }
    });

    let finalArr = [];
    arr.map((elem, i) => {
      switch (elem.ack) {
        case 0:
          finalArr = [...finalArr, { ...elem, ack_img: "Resend" }];
          break;
        case 1:
          finalArr = [...finalArr, { ...elem, ack_img: "Sent" }];
          break;
        case 2:
          finalArr = [...finalArr, { ...elem, ack_img: "Delivered" }];
          break;
        case 3:
          finalArr = [...finalArr, { ...elem, ack_img: "Read" }];
          break;
        default:
          break;
      }
    });
    return finalArr;
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, []);

  useEffect(() => {
    if (calendarFlag != 0) {
      setTicketlist([]);
      setPage(0);
      setFlagCall((p) => !p);
      setMainLoader(true);
    }
  }, [calendarFlag]);

  useEffect(() => {
    fetchStaffList();
    if (calendarFlag == 0) filterList().then((res) => getticketList(res));
    else getticketList();
  }, [flagCall]);

  const fetchStaffList = () => {
    guestService
      .getstafflist({ value: "", property_id: property_id })
      .then((res) =>
        setStafflist(() =>
          res.filter((item) => {
            if (item.active_status == 1 && item.online_status == 1) {
              if (item.mobile_login == 1 || item.web_login == 1) return true;
              else return false;
            } else {
              return false;
            }
          })
        )
      );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getticketList = (filter = {}) => {
    const data = {
      page: pageNo,
      pagesize: 20,
      field: "id",
      sort: "desc",
      filtername: calendarFlag == 0 ? filter.profile : filterData.profile,
      property_id: property_id,
      attendant: 1,
      lang: 0,
      searchoption: searchoption,
    };
    guestService
      .getticketlist(data)
      .then((res) => {
        setTotalRecords(res.totalcount);
        setTicketlist((c) => [...c, ...statusFlag(res.ticketlist)]);
        setLoader(false);
        setMainLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const filterList = () => {
    return guestService
      .filterlist({
        attendant: 1,
        property_id: property_id,
      })
      .then((res) => {
        setFilterData(res);
        return res;
      });
  };

  const onTaskClick = (data) => {
    console.log("task", data);
    setTask(data);
    setShow(true);
  };

  const taskCompleted = (data) => {
    let obj = {
      comment: "",
      log_type: "Completed",
      running: data.running,
      status_id: 0,
      task_id: data.id,
      max_time: data.max_time,
      original_status_id: data.status_id,
      user_id: data.dispatcher,
    };
    guestService
      .changetask(obj)
      .then(() => closeCommentModel())
      .catch(() => toast.error("Fail to update task"));
  };

  const taskCancle = (data) => {
    setTask(data);
    setModalShow(true);
  };

  React.useEffect(() => {
    if (pageNo !== 0 && ticketlist.length < totalRecords) {
      setLoader(true);
      getticketList();
      // filterList()
      //   .then((res) => getticketList(res))
      //   .catch(() => {
      //     setLoader(false);
      //     toast.error("Something went wrong");
      //   });
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + 20);
    }
  };

  const applyFilters = async (data) => {
    let obj = { profile: data };
    setFilterData((p) => {
      return { ...p, ...obj };
    });
    // setMainLoader(true);
    // setTicketlist([]);
    // setPage(0);
    // await updateState();
    closeCommentModel();
    setShowFilter(false);
    // getticketList(obj);
  };

  const onSearchChange = (e) => {
    if (e.key === "Enter") {
      setMainLoader(true);
      closeCommentModel();
    }
  };

  const closeCommentModel = async () => {
    setCalendarFlag((p) => p + 1);
    setModalShow(false);
  };

  const handleCreate = (e) => {
    guestService
      .maxticketno()
      .then((res) => setTicketNo({ guest: res.max_ticket_no }));
    setCreate(true);
  };

  const handleCreateDepartment = (e) => {
    guestService.maxticketno().then((res) => {
      setCreateDepartment(true);
      setTicketNo({ guest: res.max_ticket_no });
    });
  };

  const trfDepartment = async (data) => {
    if (Array.isArray(data)) {
      console.log("data comes", data);
      var result = await locationlist.filter(function (o1) {
        return data.some(function (o2) {
          return o1.room_id === o2.room_id && o1.type == "Room"; // return the ones with equal id
        });
      });
      console.log("result of filter", result);
      await setSelectedDep(result);
      setCreateDepartment(true);
    } else {
      let arr = await locationlist.filter(
        (item) => item.room_id == data && item.type == "Room"
      );
      await setSelectedDep(arr);
      setCreateDepartment(true);
    }
  };

  const getLocation = () => {
    departmentService
      .getlocationlist({
        location: "",
        property_id: property_id,
      })
      .then((res) => setLocationlist(res))
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const resendMessage = (data) => {
    if (data.status_flag == "Canceled" || data.ack_img !== "Resend") {
      return;
    } else {
      let req = data.quantity + " X " + data.task_name;
      let obj = data;
      obj["currentTime"] = moment().format("YYYY-MM-DD HH:mm:ss");
      obj["action_disable_flag"] = false;
      obj["active"] = false;
      obj["requested_name"] = `Request for ${req}`;
      obj["status"] =
        data.status_flag == "Complete" ? "Completed" : data.status_flag;
      obj["ticket_item_name"] = req;
      obj["ticket_no"] = data.typenum;
      obj["user_name"] = wholename;
      guestService
        .resendmessage(obj)
        .then(() => toast.success("notification has been resend successfully"))
        .catch(() => toast.error("Fail to resend notification"));
    }
  };

  const showScheduleData = async (elem) => {
    if (elem.target.checked) {
      await setFilterData((p) => {
        let obj = p;
        obj["profile"]["status_id"] = "[5]";
        return obj;
      });
      closeCommentModel();
    } else {
      await filterList();
      closeCommentModel();
    }
  };

  return (
    <>
      <ToastContainer />
      <GuestFilter
        show={showFilter}
        handleClose={() => setShowFilter(false)}
        apply={(data) => applyFilters(data)}
        filters={filterData}
      />
      <TaskDetail
        show={show}
        handleClose={() => setShow(false)}
        task={task}
        reset={() => closeCommentModel()}
        stafflist={stafflist}
      />
      <CreateDepartment
        show={createDepartment}
        handleClose={() => setCreateDepartment(false)}
        ticketno={ticketNo.guest}
        reset={() => closeCommentModel()}
        stafflist={stafflist}
        selected={selectedDep}
        locationlist={locationlist}
      />
      <CreateGuest
        show={create}
        handleClose={() => setCreate(false)}
        ticketno={ticketNo.guest}
        reset={() => closeCommentModel()}
        stafflist={stafflist}
        trfCall={(data) => trfDepartment(data)}
      />
      <Header
        title="House keeping"
        action={
          <>
            <DropdownButton
              id="dropdown-basic-button"
              className="mr-5 lato-action"
              title="Create New"
            >
              <Dropdown.Item onClick={() => handleCreate(0)}>
                <img
                  src={
                    process.env.PUBLIC_URL + "/images/dropdown/guest-icon.svg"
                  }
                  className="pr-1"
                  width="18px"
                />
                <span className="lato-label"> Guest request </span>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCreateDepartment(0)}>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/images/dropdown/department-icon.svg"
                  }
                  className="pr-1"
                  width="18px"
                />
                <span className="lato-label"> Department request </span>
              </Dropdown.Item>
              <Dropdown.Item>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/images/dropdown/complaint-icon.svg"
                  }
                  className="pr-1"
                  width="18px"
                />
                <span className="lato-label"> Complaint Request </span>
              </Dropdown.Item>
              <Dropdown.Item>
                <img
                  src={
                    process.env.PUBLIC_URL + "/images/dropdown/task-icon.svg"
                  }
                  className="pr-1"
                  width="18px"
                />
                <span className="lato-label"> Manage Task </span>
              </Dropdown.Item>
            </DropdownButton>
          </>
        }
      />
      <SubHeader
        title={`Guest Services`}
        background="white"
        actions={
          <>
            <Link
              to="/guests/logbook/settings"
              className="col-auto text-decoration-none text-dark bdr-right pr-4"
            >
              <Row className="align-items-center justify-content-md-end lato-action">
                <div className="col-auto p-0">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/general-icons/setting-icon.svg"
                    }
                    className="mb-1"
                  />
                </div>
                <div className="col-auto"> Setting </div>
              </Row>
            </Link>
            <div className="col-auto pl-4">
              <Row className="align-items-center justify-content-md-end lato-action">
                <div className="col-auto"> Show Scheduled </div>
                <div className="col-auto">
                  <label className="switch m-0">
                    <input type="checkbox" onChange={showScheduleData} />
                    <span className="custom-slider round"></span>
                  </label>
                </div>
              </Row>
            </div>
          </>
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
                value={searchoption}
                // defaultValue={""}
                onKeyDown={onSearchChange}
                onChange={(e) => setSearchoption(e.target.value)}
                style={{ border: "hidden", background: "#F4F4F4" }}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  style={{ border: "hidden", background: "#F4F4F4" }}
                  onClick={() => setShowFilter(true)}
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
      <div className="guest-service-table">
        <SimpleTable
          loader={mainLoader}
          key={`guest_service`}
          // onTrClick={onTaskClick}
          columns={[
            {
              key: "typenum",
              label: "ID",
              width: "80",
              onTdClick: onTaskClick,
            },
            {
              key: "created_time",
              label: "Date & Time",
              width: "150",
              onTdClick: onTaskClick,
              template: ({ children }) => (
                <div>{dateTime(children[0]).dateMonthYearTime}</div>
              ),
            },
            {
              key: "priority_name",
              label: "Priority",
              width: "50",
              onTdClick: onTaskClick,
              template: ({ children }) => {
                return (
                  <span
                    className={`fill-badge mt-1 ${children[0].toLowerCase()}`}
                  >
                    {children[0]}
                  </span>
                );
              },
            },
            {
              key: "lgm_name",
              label: "Location",
              width: "150",
              onTdClick: onTaskClick,
              template: ({ children }) => (
                <div className="wrap mt-1">{children}</div>
              ),
            },
            {
              key: "guest_name",
              label: "Guest",
              width: "150",
              onTdClick: onTaskClick,
              template: ({ children }) => (
                <div className="wrap mt-1">{children}</div>
              ),
            },
            {
              key: ["task_name", "quantity"],
              label: "Task",
              width: "150",
              style: { cursor: "pointer" },
              onTdClick: onTaskClick,
              template: ({ children }) => {
                return (
                  <div className="wrap">
                    {" "}
                    {children[1]}x {children[0]}
                  </div>
                );
              },
            },
            {
              key: "dept_short_code",
              label: "Department",
              width: "100",
              onTdClick: onTaskClick,
            },
            {
              key: "status_flag",
              label: "Status",
              width: "50",
              onTdClick: onTaskClick,
              template: ({ children }) => (
                <span
                  className={`outline-badge mt-1 ${children[0].toLowerCase()}`}
                >
                  {children[0]}
                </span>
              ),
            },
            {
              key: "wholename",
              label: "Staff",
              width: "150",
              onTdClick: onTaskClick,
            },
            {
              key: ["max_time", "status_flag"],
              label: "Duration",
              width: "100",
              onTdClick: onTaskClick,
              template: ({ children, data }) => (
                <Timer info={data} sec={children[0]} status={children[1]} />
              ),
            },
            {
              key: "ack_img",
              label: "Action",
              width: "100",
              template: ({ children, data }) => (
                <div>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${children[0]}.png`}
                    title={children[0]}
                    width="24px"
                    className="mr-2"
                    onClick={() => resendMessage(data)}
                  />
                  {data?.status_flag == "Canceled" ||
                  data?.status_flag == "Timeout" ||
                  data?.status_flag == "Complete" ||
                  data?.status_flag == "Feedback" ? (
                    ""
                  ) : (
                    <>
                      {data?.status_flag == "Hold" ||
                      data?.status_flag == "Escalated Hold" ? (
                        ""
                      ) : (
                        <i
                          className="fas fa-check btn-correct"
                          onClick={() => taskCompleted(data)}
                        ></i>
                      )}{" "}
                      <i
                        className="fas fa-times btn-cancle"
                        onClick={() => taskCancle(data)}
                      ></i>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          data={ticketlist}
        />
      </div>
      <CommentModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        save={closeCommentModel}
        task={task}
      />
      {loader ? <Loader /> : ""}
    </>
  );
}

export default Profile;
