import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Calendar from "../../../common/Calendar";
import Dropdown from "../../../common/FormElements/Dropdown";
import Header from "../../../common/Header";
import SimpleTable from "../../../common/SimpleTable";
import SubHeader from "../../../common/SubHeader";
import dateTime from "../../../helper/dateTime";
import feedback from "../../../services/Engineering/feedbackRequest/feedback";
import FeedbackDetail from "./Includes/FeedbackDetail";
import { useAuthState } from "../../../store/context";
import exportService from "../../../services/export";
import moment from "moment";
import Loader from "../../../common/Loader";
import { ToastContainer, toast } from "react-toastify";
import ListService from "../../../services/list";

function Feedback(props) {
  const [complainlist, setComplainlist] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [mainLoader, setMainLoader] = useState(true);
  const [startDate, setStartDate] = useState(moment().subtract(1, "years"));
  const [endDate, setEndDate] = useState(moment());
  const [show, setShow] = useState(false);
  const [list, setList] = useState({});
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchtext, setSearchtext] = useState("");
  const {
    user: { id, property_id, dept_id, job_role_id },
  } = useAuthState();
  const [calendarFlag, setCalendarFlag] = useState(0);
  const [flagCall, setFlagCall] = useState(false);

  useEffect(() => {
    if (calendarFlag != 0) {
      setComplainlist([]);
      setPage(0);
      setMainLoader(true);
      setFlagCall((p) => !p);
    }
  }, [calendarFlag]);

  useEffect(() => {
    getcomplainlist();
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

  const getCategoryList = () => {
    feedback
      .getCategoryList({
        dept_id: dept_id,
      })
      .then((res) => (res ? setCategories(res?.content) : res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getStaffGroupList = () => {
    feedback
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
    feedback
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

  const getcomplainlist = () => {
    let obj = {
      end_date: endDate.format("YYYY-MM-DD"),
      field: "id",
      filter_value: "",
      page: pageNo,
      pagesize: 20,
      property_id: property_id,
      sort: "desc",
      start_date: startDate.format("YYYY-MM-DD"),
      searchtext,
    };
    feedback
      .getcomplaintlist(obj)
      .then((res) => {
        setTotalRecords(res.totalcount);
        setComplainlist((p) => [...p, ...res.datalist]);
        setLoader(false);
        setMainLoader(false);
      })
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const onListClick = (data) => {
    console.log("list", data);
    setList(data);
    setShow(true);
  };

  React.useEffect(() => {
    if (pageNo != 0 && complainlist.length < totalRecords) {
      setLoader(true);
      getcomplainlist();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + 20);
    }
  };

  const onExportExcel = () => {
    setMainLoader(true);
    var request = {};
    // request.searchoption = $scope.searchoption;
    request.searchtext = searchtext;
    request.property_id = property_id;
    request.dispatcher = id;
    request.dept_id = dept_id;
    request.job_role_id = job_role_id;

    request.start_date = "2016-01-01";
    request.end_date = "2016-01-01";

    // request.start_date = startDate.format('YYYY-MM-DD'); // '2016-01-01';
    // request.end_date = endDate.format('YYYY-MM-DD');//  '2016-01-01';

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

  const onSearchChange = (e) => {
    if (e.key === "Enter") {
      setLoader(true);
      setPage(0);
      getcomplainlist();
    }
  };

  return (
    <>
      <ToastContainer />
      <FeedbackDetail
        show={show}
        handleClose={() => setShow(false)}
        list={list}
        department={departments}
        locations={locations}
        category={categories}
        reset={() => setCalendarFlag((p) => p + 1)}
      />
      <Header
        title="Feedback"
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
        title={`Feedback List`}
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
              start={setStartDate}
              end={setEndDate}
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
                className="form-control lato-input form-control-sm"
                placeholder="Search"
                name="search"
                value={searchtext}
                defaultValue={""}
                onKeyDown={onSearchChange}
                onChange={(e) => setSearchtext(e.target.value)}
                style={{ border: "hidden", background: "#F4F4F4" }}
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
          </>
        }
      />
      <SimpleTable
        loader={mainLoader}
        key={`feedback_list`}
        onTrClick={onListClick}
        columns={[
          {
            key: "id",
            label: "ID",
            width: "100",
            template: ({ children }) => (
              <span>
                F{children[0]?.length > 4 ? children[0] : "0" + children[0]}
              </span>
            ),
          },
          {
            key: ["status", "final_status"],
            label: "Status",
            width: "100",
            template: ({ children }) => {
              return (
                <>
                  <span
                    className={`fill-badge mt-1 ${children[0].toLowerCase()}`}
                  >
                    {children[0]}
                  </span>
                  <span
                    className={`outline-badge mt-1 ${children[1]?.toLowerCase()}`}
                  >
                    {children[1]}
                  </span>
                </>
              );
            },
          },
          {
            key: "lgm_name",
            label: "Location",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "guest_name",
            label: "Guest Name",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "created_at",
            label: "Created",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">
                {dateTime(children).dateMonthYear}
              </div>
            ),
          },
          {
            key: "wholename",
            label: "Created By",
            width: "150",
          },
          {
            key: "selected_ids",
            label: "Department",
            width: "150",
            template: ({ children }) => (
              <div className="mt-1">
                {children[0].map((item, i) =>
                  i == children[0].length - 1
                    ? item.short_code
                    : item.short_code + ", "
                )}
              </div>
            ),
          },
          {
            key: "comment",
            label: "Feedback",
            width: "150",
            template: ({ children }) => (
              <div className="wrap" style={{ maxWidth: "550px" }}>
                {children[0]}
              </div>
            ),
          },
        ]}
        data={complainlist}
      />
      {loader ? <Loader /> : ""}
    </>
  );
}

export default Feedback;
