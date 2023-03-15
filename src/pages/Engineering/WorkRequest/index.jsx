import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SimpleTable from "../../../common/SimpleTable";
import SubHeader from "../../../common/SubHeader";
import workrequest from "../../../services/Engineering/WorkRequest/workrequest";
import dateTime from "../../../helper/dateTime";
import Calendar from "../../../common/Calendar";
import RequestDetail from "./Includes/RequestDetail";
import Header from "../../../common/Header";
import Dropdown from "../../../common/FormElements/Dropdown";
import { useAuthState } from "../../../store/context";
import Loader from "../../../common/Loader";
import { ToastContainer, toast } from "react-toastify";
import exportService from "../../../services/export";
import moment from "moment";
import ListService from "../../../services/list";

function WorkRequest(props) {
  const [repairrequestlist, setRepairrequestlist] = useState([]);
  const [show, setShow] = useState(false);
  const [request, setRequest] = useState({});
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const {
    user: { id, property_id, dept_id, job_role_id },
  } = useAuthState();

  const [calendarFlag, setCalendarFlag] = React.useState(0);
  const [loader, setLoader] = React.useState(false);
  const [mainLoader, setMainLoader] = React.useState(true);
  const [staffs, setStaffs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(14, "days"));
  const [endDate, setEndDate] = useState(moment());
  const [flagCall, setFlagCall] = useState(false);
  const [check, setCheck] = React.useState({
    timeout: 0,
  });
  const [searchtext, setSearch] = React.useState("");

  useEffect(async () => {
    if (calendarFlag != 0) {
      await setMainLoader(true);
      setPage(0);
      setFlagCall((p) => !p);
      setRepairrequestlist([]);
    }
  }, [searchtext, calendarFlag]);

  useEffect(() => {
    getrepairrequestlist();
  }, [flagCall]);

  useEffect(() => {
    getStaffGroupList();
    getCategoryList();
    departmentList();
    locationtotalList();
    equipmentList();
    equipmentIdList();
    suppliersList();
    window.addEventListener("scroll", handleScroll);
  }, []);

  const getrepairrequestlist = () => {
    let obj = {
      assigne_ids: "",
      category_ids: [],
      dept_id: 2,
      dept_ids: [],
      dispatcher: 1,
      end_date: endDate.format("YYYY-MM-DD"),
      equip_ids: [],
      equipment_ids: [],
      field: "id",
      job_role_id: 1,
      location_ids: [],
      page: pageNo,
      pagesize: 20,
      property_id: property_id,
      searchtext: searchtext,
      sort: "desc",
      start_date: startDate.format("YYYY-MM-DD"),
      status_names: [],
    };
    workrequest
      .repairrequestlist(obj)
      .then((res) => {
        setTotalRecords(res.totalcount);
        setRepairrequestlist((p) => [...p, ...res.datalist]);
        setLoader(false);
        setMainLoader(false);
      })
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const onRequestClick = (data) => {
    console.log("request", data);
    setRequest(data);
    setShow(true);
  };

  React.useEffect(() => {
    if (pageNo != 0 && repairrequestlist.length < totalRecords) {
      setLoader(true);
      getrepairrequestlist();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + 1);
    }
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

  const getCategoryList = () => {
    workrequest
      .getCategoryList({
        user_id: id,
      })
      .then((res) => (res ? setCategories(res?.content) : res))
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
      .then((res) => (res ? setStaffs(res?.content) : res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const departmentList = () => {
    ListService.departmentList()
      .then((res) => setDepartments(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
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

  const equipmentIdList = () => {
    workrequest
      .equipmentIdList({
        property_id: property_id,
      })
      .then((res) => setEquipmentIds(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const suppliersList = () => {
    ListService.suppliersList()
      .then((res) => setSuppliers(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const onExportExcel = () => {
    setMainLoader(true);
    var request = {};
    // request.searchtext = $scope.searchtext;
    // request.searchtext = $scope.searchtext;
    request.property_id = property_id;
    request.dispatcher = id;
    request.dept_id = dept_id;
    request.job_role_id = job_role_id;

    // request.start_date = "2016-01-01";
    // request.end_date = "2016-01-01";

    request.start_date = startDate.format("YYYY-MM-DD"); // '2016-01-01';
    request.end_date = endDate.format("YYYY-MM-DD"); //  '2016-01-01';

    // request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
    // request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
    request.assigne_ids = staffs.map((item) => item.id).join(",");
    //    request.status_names = $scope.filter.status_names.map(item => item.name);

    // var status_tags = [];
    // for(var i = 0; i < $scope.filter.status_names.length; i++)
    //     status_tags.push($scope.filter.status_names[i].name);

    // request.status_names = JSON.stringify(status_tags);

    // $scope.filter.status_tags = JSON.stringify(status_tags);
    request.category_ids = categories.map((item) => item.id);
    request.dept_ids = departments.map((item) => item.id);
    request.location_ids = locations.map((item) => item.id);
    request.equipment_ids = equipments.map((item) => item.id);
    request.equip_ids = equipmentIds.map((item) => item.id);
    request.excel_type = "excel";

    // $window.location.href = '/frontend/eng/exportrepairrequest?' + $httpParamSerializer(request);
    return exportService
      .repairRequest(request)
      .then(() => setMainLoader(false));
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

  return (
    <>
      <ToastContainer />
      <RequestDetail
        show={show}
        handleClose={() => setShow(false)}
        request={request}
        category={categories}
        staffGroupList={staffs}
        locations={locations}
        supplyer={suppliers}
        reset={() => setCalendarFlag((p) => p + 1)}
      />
      <Header
        title="Engineering"
        action={
          <Dropdown
            style={{
              outline: "none",
              border: "hidden",
              background: "transparent",
            }}
            className="nav-link text-center lato-input text-light mt-1 mr-5 pb-2"
            optStyle={{ color: "black" }}
            options={[{ text: "Create New", value: "create" }]}
            selected={""}
            defaultValue={""}
            onChange={() => {}}
          />
        }
      />
      <SubHeader
        title={`Work Request`}
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
                  // width="125%"
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
      <SimpleTable
        loader={mainLoader}
        key={`guest_service`}
        onTrClick={onRequestClick}
        columns={[
          { key: "ref_id", label: "ID", width: "150" },
          {
            key: ["priority", "status_name"],
            label: "Priority & Status",
            width: "150",
            template: ({ children }) => {
              return (
                <>
                  <span
                    className={`fill-badge mt-1 ${children[0].toLowerCase()}`}
                  >
                    {children[0]}
                  </span>
                  <span
                    className={`outline-badge mt-1 ${children[1].toLowerCase()}`}
                  >
                    {children[1]}
                  </span>
                </>
              );
            },
          },
          {
            key: "location_name",
            label: "Location",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "equip_name",
            label: "Equipment",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "category_name",
            label: "Category",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          { key: "assignee_name", label: "Assignee", width: "150" },
          {
            key: "created_at",
            label: "Created",
            width: "150",
            template: ({ children }) => (
              <div>{dateTime(children).dateMonthYear}</div>
            ),
          },
          {
            key: "start_date",
            label: "Start",
            width: "150",
            template: ({ children }) => (
              <div>{dateTime(children).dateTime}</div>
            ),
          },
          {
            key: "end_date",
            label: "End",
            width: "150",
            template: ({ children }) =>
              children[0] != null ? (
                <div>{dateTime(children).dateTime}</div>
              ) : (
                "-"
              ),
          },
        ]}
        data={repairrequestlist}
      />
      {loader ? <Loader /> : ""}
    </>
  );
}

export default WorkRequest;
