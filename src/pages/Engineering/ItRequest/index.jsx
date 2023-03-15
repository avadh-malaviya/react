import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Calendar from "../../../common/Calendar";
import Dropdown from "../../../common/FormElements/Dropdown";
import Header from "../../../common/Header";
import SimpleTable from "../../../common/SimpleTable";
import SubHeader from "../../../common/SubHeader";
import itrequest from "../../../services/Engineering/ItRequest/itrequest";
import IssueDetail from "./Includes/IssueDetail";
import { useAuthState } from "../../../store/context";
import Loader from "../../../common/Loader";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

function ItRequest(props) {
  const [issuelist, setIssuelist] = useState([]);
  const [show, setShow] = useState(false);
  const [issue, setIssue] = useState({});
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const {
    user: { property_id },
  } = useAuthState();
  const [startDate, setStartDate] = useState(moment().subtract(45, "days"));
  const [endDate, setEndDate] = useState(moment());
  const [loader, setLoader] = React.useState(false);
  const [mainLoader, setMainLoader] = React.useState(true);
  const [calendarFlag, setCalendarFlag] = React.useState(0);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [flagCall, setFlagCall] = useState(false);

  useEffect(() => {
    if (calendarFlag != 0) {
      setIssuelist([]);
      setPage(0);
      setFlagCall((p) => !p);
      setMainLoader(true);
    }
  }, [calendarFlag]);

  useEffect(() => {
    getissuelist();
  }, [flagCall]);

  useEffect(() => {
    getCategoryList();
    getStatusList();
    window.addEventListener("scroll", handleScroll);
  }, []);

  const getissuelist = () => {
    let obj = {
      building_id: 0,
      building_ids: [],
      category_ids: [],
      dept_id: 2,
      dept_ids: [],
      dispatcher: 1,
      end_date: endDate.format("YYYY-MM-DD"),
      field: "id",
      filter: "Total",
      job_role_id: 1,
      page: pageNo,
      pagesize: 20,
      property_id: property_id,
      searchoption: "Status",
      sort: "desc",
      start_date: startDate.format("YYYY-MM-DD"),
      status_ids: [],
      sub_cat_ids: [],
      type_ids: [],
      user_ids: [],
    };
    itrequest
      .getissuelist(obj)
      .then((res) => {
        setTotalRecords(res.totalcount);
        setIssuelist((p) => [...p, ...res.datalist]);
        setLoader(false);
        setMainLoader(false);
      })
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const onIssueClick = (data) => {
    console.log("request", data);
    setIssue(data);
    setShow(true);
  };

  React.useEffect(() => {
    if (pageNo != 0 && issuelist.length < totalRecords) {
      setLoader(true);
      getissuelist();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + 20);
    }
  };

  const getCategoryList = () => {
    itrequest
      .itCategory()
      .then((res) => setCategories(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  const getStatusList = () => {
    itrequest
      .statuslist()
      .then((res) => setStatus(res))
      .catch(() => {
        setMainLoader(false);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <ToastContainer />
      <IssueDetail
        show={show}
        handleClose={() => setShow(false)}
        issue={issue}
        category={categories}
        status={status}
        reset={() => setCalendarFlag((p) => p + 1)}
      />
      <Header
        title="IT"
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
        title={`IT Request`}
        background="white"
        actions={
          <div>
            <div className="float-end export-excel btn-excle">
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
                    // width="125%"
                  />
                </button>
              </div>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
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
        key={`guest_service`}
        onTrClick={onIssueClick}
        columns={[
          {
            key: ["id", "level"],
            label: "ID",
            width: "100",
            template: ({ children }) => {
              return (
                <span>
                  IT{children[1]}
                  {children[0]}
                </span>
              );
            },
          },
          {
            key: "status",
            label: "Status",
            width: "100",
            template: ({ children }) => {
              return (
                <span
                  className={`outline-badge mt-1 ${children[0]?.toLowerCase()}`}
                >
                  {children[0]}
                </span>
              );
            },
          },
          {
            key: "category",
            label: "Category",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "subject",
            label: "Subject",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          {
            key: "issue",
            label: "Type",
            width: "150",
            template: ({ children }) => (
              <div className="wrap mt-1">{children}</div>
            ),
          },
          { key: "req_name", label: "Employee", width: "150" },
          { key: "department", label: "Department", width: "150" },
          { key: "email", label: "Email", width: "150" },
          { key: "job_role", label: "Job Role", width: "150" },
        ]}
        data={issuelist}
      />
      {loader ? <Loader /> : ""}
    </>
  );
}

export default ItRequest;
