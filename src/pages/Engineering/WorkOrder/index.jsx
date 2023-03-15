import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SubHeader from "../../../common/SubHeader";
import workrequest from "../../../services/Engineering/WorkRequest/workrequest";
import dateTime from "../../../helper/dateTime";
import Calendar from "../../../common/Calendar";
import Header from "../../../common/Header";
import { useAuthState } from "../../../store/context";
import Loader from "../../../common/Loader";
import { ToastContainer, toast } from "react-toastify";
import exportService from "../../../services/export";
import moment from "moment";
import ListService from "../../../services/list";
import workorderService from "../../../services/Engineering/workorder/workorder";
import Card from "./Includes/Card";
import UpdateOrder from "./Includes/update/UpdateOrder";
import CreateOrder from "./Includes/create/CreateOrder";

function WorkOrder(props) {
  const [pendinglist, setPendinglist] = useState([]);
  const [progresslist, setProgresslist] = useState([]);
  const [onHoldlist, setOnHoldlist] = useState([]);
  const [Completedlist, setCompletedlist] = useState([]);
  const [workorderlist, setWorkorderlist] = useState([]);
  const [show, setShow] = useState(false);
  const [order, setOrder] = useState({});
  const [filterObj, setFilterObj] = useState({});
  const [partList, setPartList] = useState([]);
  const [createFlag, setCreateFlag] = useState(false);
  const {
    user: { id, property_id },
  } = useAuthState();

  const [calendarFlag, setCalendarFlag] = useState(0);
  const [mainLoader, setMainLoader] = useState(true);
  const [staffs, setStaffs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(14, "days").subtract(1, "months")
  );
  const [endDate, setEndDate] = useState(moment());
  const [check, setCheck] = useState({
    timeout: 0,
  });
  const [searchtext, setSearch] = useState("");

  useEffect(() => {
    resetValue();
  }, [searchtext, calendarFlag]);

  const resetValue = () => {
    setPendinglist([]);
    setOnHoldlist([]);
    setProgresslist([]);
    setCompletedlist([]);
    setWorkorderlist([]);
    setMainLoader(true);
    getWorkOrderList();
    locationtotalList();
    equipmentList();
    getStaffGroupList();
    getPartList();
  };

  const getWorkOrderList = () => {
    let obj = {
      assignee_ids: "",
      dispatcher: id,
      end_date: endDate.format("YYYY-MM-DD"),
      equip_list: [],
      location_ids: "",
      priority: "All",
      property_id: property_id,
      searchtext: searchtext,
      start_date: startDate.format("YYYY-MM-DD"),
      work_order_type: "All",
      wr_ids: "",
    };
    setFilterObj(obj);
    workorderService
      .getworkorderlist(obj)
      .then((res) => handleResponse(res.datalist));
  };

  const handleResponse = (res) => {
    setMainLoader(false);
    setWorkorderlist(res);
    setPendinglist(() => {
      return res.filter((item) => {
        return item.status == "Pending";
      });
    });
    setOnHoldlist(() => {
      return res.filter((item) => {
        return item.status == "On Hold";
      });
    });
    setProgresslist(() => {
      return res.filter((item) => {
        return item.status == "In Progress";
      });
    });
    setCompletedlist(() => {
      return res.filter((item) => {
        return item.status == "Completed";
      });
    });
  };

  const locationtotalList = () => {
    ListService.locationtotallisteng({
      client_id: 4,
      user_id: id,
    })
      .then((res) => setLocations(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getStaffGroupList = () => {
    workrequest
      .getStaffGroupList({
        property_id,
        user_id: id,
      })
      .then((res) => setStaffs(res.content))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getPartList = () => {
    workorderService
      .getpartlist(property_id)
      .then((res) => {
        setPartList(res);
      })
      .catch(() => toast.error("fail to etch the partlist"));
  };

  const equipmentList = () => {
    ListService.equipmentList({
      property_id: property_id,
    })
      .then((res) => setEquipments(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const searchRequest = (elem) => {
    if (elem.key === "Enter") {
      elem.preventDefault();
      return setSearch(elem.target.value);
    }
    if (check.timeout) clearTimeout(check.timeout);
    setCheck({
      timeout: setTimeout(() => setSearch(elem.target.value), 2000),
    });
  };

  const handleTdClick = (data) => {
    if (data == undefined) return;
    else {
      setMainLoader(true);
      workorderService
        .getworkorderdetail({ id: data.id, property_id: property_id })
        .then((res) => {
          setOrder(res.content);
          setMainLoader(false);
          setShow(true);
        });
    }
  };

  const onExportExcel = () => {
    setMainLoader(true);
    var request = filterObj;
    // request.searchoption = $scope.searchoption;
    request["excel_type"] = "excel";
    exportService.exportworkorder(request).then(() => setMainLoader(false));
  };

  return (
    <>
      <ToastContainer />
      <CreateOrder
        show={createFlag}
        handleClose={() => setCreateFlag(false)}
        stafflist={staffs}
        partlist={partList}
        locations={locations}
        equipments={equipments}
        reset={() => setCalendarFlag((p) => p + 1)}
      />
      <UpdateOrder
        show={show}
        handleClose={() => setShow(false)}
        order={order}
        stafflist={staffs}
        partlist={partList}
        locations={locations}
        equipments={equipments}
        reset={() => setCalendarFlag((p) => p + 1)}
      />
      <Header
        title="Engineering"
        action={
          <div
            className="text-white lato-submit p-2 mt-1 mr-4"
            style={{ cursor: "pointer" }}
            onClick={() => setCreateFlag(true)}
          >
            Create New
          </div>
        }
      />
      <SubHeader
        title={`Work Order`}
        background="white"
        actions={
          <div>
            <div
              className="float-end export-excel btn-excle"
              onClick={onExportExcel}
            >
              <img
                className="mr-3"
                src={process.env.PUBLIC_URL + "/images/xls-icon.svg"}
                alt=""
              />
              <span> Export Excel </span>
            </div>
            <Calendar
              startDate={startDate}
              endDate={endDate}
              start={(date) => setStartDate(date)}
              end={(date) => setEndDate(date)}
              flag={(d) => setCalendarFlag(d)}
            >
              <img
                className="float-end mt-1 mr-4"
                src={process.env.PUBLIC_URL + "/images/calander.svg"}
                alt="calander"
              />
            </Calendar>
          </div>
        }
        search={
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
                  alt={`search`}
                />
              </button>
            </div>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search"
              style={{ border: "hidden", background: "#F4F4F4" }}
              onKeyPress={(e) => searchRequest(e)}
              onChange={(e) => searchRequest(e)}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-sm btn-default"
                style={{ border: "hidden", background: "#F4F4F4" }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/images/filter-icon.svg"}
                  alt=""
                />
              </button>
            </div>
          </div>
        }
      />
      <table className="w-100 work-order">
        <thead>
          <tr>
            <td className="pending-head w-25">Pending</td>
            <td className="progress-head w-25">In Progress</td>
            <td className="hold-head w-25">On Hold</td>
            <td className="completed-head w-25">Completed</td>
          </tr>
        </thead>
        {mainLoader ? (
          <tr className="mt-3">
            <td colSpan={4} className="p-4">
              <Loader />
            </td>
          </tr>
        ) : (
          <tbody>
            {workorderlist.map((item, i) => {
              return (
                <tr key={i}>
                  <td
                    onClick={() => handleTdClick(pendinglist[i])}
                    className={pendinglist[i] != undefined ? "has-data" : ""}
                  >
                    {pendinglist[i] != undefined ? (
                      <Card detail={pendinglist[i]} />
                    ) : (
                      ""
                    )}
                  </td>
                  <td
                    onClick={() => handleTdClick(progresslist[i])}
                    className={progresslist[i] != undefined ? "has-data" : ""}
                  >
                    {progresslist[i] != undefined ? (
                      <Card detail={progresslist[i]} />
                    ) : (
                      ""
                    )}
                  </td>
                  <td
                    onClick={() => handleTdClick(onHoldlist[i])}
                    className={onHoldlist[i] != undefined ? "has-data" : ""}
                  >
                    {onHoldlist[i] != undefined ? (
                      <Card detail={onHoldlist[i]} />
                    ) : (
                      ""
                    )}
                  </td>
                  <td
                    onClick={() => handleTdClick(Completedlist[i])}
                    className={Completedlist[i] != undefined ? "has-data" : ""}
                  >
                    {Completedlist[i] != undefined ? (
                      <Card detail={Completedlist[i]} />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </>
  );
}

export default WorkOrder;
