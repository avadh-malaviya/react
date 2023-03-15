import React, { useEffect, useState } from "react";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import settingsService from "../../../../services/guestservice/settings/setting";
import { toast } from "react-toastify";
import CreateDeptFun from "./create/CreateDeptFun";
import deptFunService from "../../../../services/guestservice/settings/department/deptfun";

function DepartmentFunction(props) {
  const [deptFunList, setDeptFunList] = useState([]);
  const [mainLoader, setMainLoader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [resetFlag, setResetFlag] = useState(0);
  const [resetNow, setResetNow] = useState(0);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [pageNo, setPage] = useState(0);
  const [recordStart, setRecordStart] = useState(1);
  const [length, setLength] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deptFunFlag, setDeptFunFlag] = useState(false);
  const [deptFunDetails, setDeptFunDetails] = useState({});
  const sortClickDefault = {
    click: 0,
    key: null,
  };
  const sortDefault = {
    sort: "asc",
    key: null,
  };
  const [sortField, setSortField] = useState(sortDefault);
  const [sortClick, setSortClick] = useState(sortClickDefault); // using value from previous state
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDeleteId(null);
    setMainLoader(true);
    setPage(0);
    setDeptFunList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
    setEditLoader(false);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "department_function") {
      setResetFlag(0);
      getdepartmentList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "df.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "department",
      "columns[1][name]": "cd.department",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "function",
      "columns[2][name]": "df.function",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "short_code",
      "columns[3][name]": "df.short_code",
      "columns[3][searchable]": true,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "description",
      "columns[4][name]": "df.description",
      "columns[4][searchable]": true,
      "columns[4][orderable]": true,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "device",
      "columns[5][name]": "df.gs_device",
      "columns[5][searchable]": true,
      "columns[5][orderable]": true,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "all_dept_setting",
      "columns[6][name]": "df.all_dept_setting",
      "columns[6][searchable]": true,
      "columns[6][orderable]": true,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "columns[7][data]": "escalation_setting",
      "columns[7][name]": "df.escalation_setting",
      "columns[7][searchable]": true,
      "columns[7][orderable]": true,
      "columns[7][search][value]": "",
      "columns[7][search][regex]": false,
      "columns[8][data]": "hskp_role",
      "columns[8][name]": "df.hskp_role",
      "columns[8][searchable]": true,
      "columns[8][orderable]": true,
      "columns[8][search][value]": "",
      "columns[8][search][regex]": false,
      "columns[9][data]": "edit",
      "columns[9][name]": "",
      "columns[9][searchable]": false,
      "columns[9][orderable]": false,
      "columns[9][search][value]": "",
      "columns[9][search][regex]": false,
      "columns[10][data]": "delete",
      "columns[10][name]": "",
      "columns[10][searchable]": false,
      "columns[10][orderable]": false,
      "columns[10][search][value]": "",
      "columns[10][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": props.search == null ? "" : searchText,
      "search[regex]": false,
      _: 1653275378420,
    };
    return payload;
  };

  const getdepartmentList = () => {
    let obj = {
      platform: "react",
      limit: length,
      offset: pageNo,
    };
    settingsService
      .getdeptfunlist(obj)
      .then((res) => {
        setDeptFunList((p) => [...p, ...res]);
        // setTotalRecords(res.recordsFiltered);
        setMainLoader(false);
        setLoader(false);
      })
      .catch(() => {
        toast.error("Faild to fetch tasks list");
        setMainLoader(false);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (
      pageNo !== 0 &&
      // deptFunList.length < totalRecords &&
      props.tab == "department_function"
    ) {
      setLoader(true);
      getdepartmentList();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + length);
    }
  };

  const sortData = (key) => {
    setSortClick((pObj) => {
      let newObj = pObj;
      if (pObj["click"] == 1) {
        setSortField({ sort: "desc", key: key });
        newObj["key"] = key;
        newObj["click"] = 0;
        return newObj;
      } else {
        setSortField({ sort: "asc", key: key });
        newObj["key"] = key;
        newObj["click"] = 1;
        return newObj;
      }
    });
  };

  const updateDeptFun = (data) => {
    setEditLoader(true);
    deptFunService.getdepartmentfun(data.id).then((res) => {
      console.log("deptFun Data ==>>", res);
      setDeptFunDetails(res);
      setDeptFunFlag(true);
      setEditLoader(false);
    });
  };

  const deleteDeptFun = () => {
    deptFunService
      .deletedeptfunrow(deleteId)
      .then(() => {
        toast.success("Department Function deleted successfully");
        setResetNow((p) => p + 1);
        setDeleteFlag(false);
      })
      .catch(() => toast.error("Fail to delete Department Function"));
  };

  return (
    <div className="setting-deptfun-table bg-white">
      <CreateDeptFun
        show={deptFunFlag}
        handleClose={() => setDeptFunFlag(false)}
        data={deptFunDetails}
        reset={() => setResetNow((p) => p + 1)}
      />
      <SimpleTable
        loader={mainLoader}
        key={`request`}
        columns={[
          {
            key: "id",
            label: <TableHead title="ID" onClick={() => sortData(0)} />,
            width: "40",
          },
          {
            key: "department",
            label: <TableHead title="Department" onClick={() => sortData(1)} />,
            width: "150",
          },
          {
            key: "function",
            label: <TableHead title="Function" onClick={() => sortData(2)} />,
            width: "200",
          },
          {
            key: "short_code",
            label: <TableHead title="Short code" onClick={() => sortData(3)} />,
            width: "200",
          },
          {
            key: "description",
            label: (
              <TableHead title="Description" onClick={() => sortData(4)} />
            ),
            width: "200",
          },
          {
            key: "device",
            label: (
              <TableHead title="Device Settings" onClick={() => sortData(5)} />
            ),
            width: "150",
          },
          {
            key: "all_dept_setting",
            label: (
              <TableHead
                title="All Dept. Settings"
                onClick={() => sortData(6)}
              />
            ),
            width: "150",
            template: ({ children }) => (children[0] == 0 ? "No" : "Yes"),
          },
          {
            key: "escalation_setting",
            label: (
              <TableHead
                title="Escalation Settings"
                onClick={() => sortData(7)}
              />
            ),
            width: "150",
            template: ({ children }) => (children[0] == 0 ? "No" : "Yes"),
          },
          {
            key: "hskp_role",
            label: <TableHead title="HSKP Role" onClick={() => sortData(8)} />,
            width: "150",
          },
          {
            key: "",
            label: "Edit",
            width: "50",
            template: ({ data }) => (
              <>
                {" "}
                {editLoader ? (
                  <img
                    src={process.env.PUBLIC_URL + "/images/loader.gif"}
                    style={{ width: "15px" }}
                  />
                ) : (
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/general-icons/update-green.svg"
                    }
                    onClick={() => updateDeptFun(data)}
                  />
                )}
              </>
            ),
          },
          {
            key: "id",
            label: "Delete",
            width: "50",
            template: ({ children }) => (
              <img
                src={
                  process.env.PUBLIC_URL + "/images/general-icons/bin-red.svg"
                }
                onClick={() => {
                  setDeleteId(children[0]);
                  setDeleteFlag(true);
                }}
              />
            ),
          },
        ]}
        data={deptFunList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteDeptFun}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default DepartmentFunction;
