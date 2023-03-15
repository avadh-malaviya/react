import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Calendar from "../../common/Calendar";
import Dropdown from "../../common/FormElements/Dropdown";
import Header from "../../common/Header";
import Loader from "../../common/Loader";
import SimpleTable from "../../common/SimpleTable";
import SubHeader from "../../common/SubHeader";
import dateTime from "../../helper/dateTime";
import { zeroPad } from "../../helper/helper";
import equipmentService from "../../services/Engineering/equipmentRequest/equipment";
import { useAuthState } from "../../store/context";
import EquipmentDetail from "./Includes/EquipmentDetail";
import ImportExcel from "./Includes/ImportExcel";

function Asset() {
  const {
    user: { property_id, id },
  } = useAuthState();
  const [equipments, setEquipments] = useState([]);
  const [eqipDetail, setEqipDetail] = useState({});
  const [startDate, setStartDate] = useState(moment().subtract(14, "days"));
  const [endDate, setEndDate] = useState(moment());
  const [calendarFlag, setCalendarFlag] = useState(0);
  const [loader, setLoader] = useState(false);
  const [mainLoader, setMainLoader] = useState(true);
  const [show, setShow] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [create, setCreate] = useState(false);
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [check, setCheck] = React.useState({
    timeout: 0,
  });
  const [searchtext, setSearch] = React.useState("");

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(async () => {
    await setMainLoader(true);
    setPage(0);
    setEquipments([]);
    getEquipmentList();
  }, [calendarFlag, searchtext]);

  useEffect(() => {
    if (!show) setCreate(false);
  }, [show]);

  useEffect(() => {
    if (pageNo != 0 && equipments.length < totalRecords) {
      setLoader(true);
      getEquipmentList();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + 20);
    }
  };

  const getEquipmentList = () => {
    let obj = {
      department_ids: "",
      end_date: endDate.format("YYYY-MM-DD"),
      equip_group_ids: "",
      equip_ids: "",
      field: "id",
      location_ids: "",
      page: pageNo,
      pagesize: 20,
      property_id: property_id,
      sort: "desc",
      searchtext: searchtext,
      start_date: startDate.format("YYYY-MM-DD"),
      status_ids: "",
    };
    equipmentService
      .getequipmentlist(obj)
      .then((res) => {
        setEquipments((p) => [...p, ...res.datalist]);
        setTotalRecords(res.totalcount);
        setMainLoader(false);
        setLoader(false);
      })
      .catch(() => {
        setMainLoader(false);
        toast.error("Fail to fetch records");
      });
  };

  const onEquipmentClick = (data) => {
    console.log("equipment data", data);
    setEqipDetail(data);
    setShow(true);
  };

  const allocateflags = () => {
    setCreate(true);
    setShow(true);
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
      <EquipmentDetail
        show={show}
        handleClose={() => setShow(false)}
        equipment={eqipDetail}
        reset={() =>
          setCalendarFlag((p) => {
            setPage(0);
            return p + 1;
          })
        }
        create={create}
      />
      <Header
        title="Asset"
        action={
          <div
            className="text-white lato-submit p-2 mt-1 mr-4"
            style={{ cursor: "pointer" }}
            onClick={allocateflags}
          >
            Create New
          </div>
        }
      />
      <SubHeader
        title={`Asset List`}
        background="white"
        actions={
          <div>
            <div
              className="float-end export-excel btn-excle"
              onClick={() => setShowModel(true)}
            >
              <img
                className="mr-3"
                src={process.env.PUBLIC_URL + "/images/xls-icon.svg"}
                alt=""
              />
              <span> Import Excel </span>
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
        key={`asset_list`}
        onTrClick={onEquipmentClick}
        columns={[
          {
            key: "id",
            label: "ID",
            width: "100",
            template: ({ children }) => (
              <div>{"EQ" + zeroPad(children[0], 5)}</div>
            ),
          },
          { key: "name", label: "Equipment Name", width: "150" },
          { key: "supplier", label: "Supplier", width: "150" },
          { key: "location_name", label: "Location", width: "150" },
          { key: "department", label: "Department", width: "150" },
          {
            key: "purchase_date",
            label: "Purchase Date",
            width: "150",
            template: ({ children }) => (
              <div>{dateTime(children[0]).dateMonthYear}</div>
            ),
          },
          {
            key: "warranty_end",
            label: "Warranty Expires",
            width: "150",
            template: ({ children }) => (
              <div>{dateTime(children[0]).dateMonthYear}</div>
            ),
          },
          {
            key: "status",
            label: "Status",
            width: "100",
            template: ({ children }) => {
              return (
                <span
                  className={`fill-badge mt-1 ${children[0]?.toLowerCase()}`}
                >
                  {children[0]}
                </span>
              );
            },
          },
        ]}
        data={equipments}
      />
      <ImportExcel show={showModel} onHide={() => setShowModel(false)} />
      {loader ? <Loader /> : ""}
    </>
  );
}

export default Asset;
