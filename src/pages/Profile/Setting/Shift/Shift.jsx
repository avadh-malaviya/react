import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import settingsService from "../../../../services/guestservice/settings/setting";
import shiftService from "../../../../services/guestservice/settings/shift/shift";
import { useAuthState } from "../../../../store/context";
import CreateShift from "./create/CreateShift";

function Shift(props) {
  const [shiftList, setShiftList] = useState([]);
  const [mainLoader, setMainLoader] = useState(false);
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
  const [shiftFlag, setShiftFlag] = useState(false);
  const [shiftDetails, setShiftDetails] = useState(false);
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
  const {
    user: { property_id, id, wholename },
  } = useAuthState();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDeleteId(null);
    setMainLoader(true);
    setPage(0);
    setShiftList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "shifts") {
      setResetFlag(0);
      getShiftList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "su.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "wholename",
      "columns[1][name]": "cu.first_name",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "dept_func_list",
      "columns[2][name]": "df.function",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "task_group_list",
      "columns[3][name]": "su.task_group_list",
      "columns[3][searchable]": false,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "location_group_list",
      "columns[4][name]": "su.location_group_list",
      "columns[4][searchable]": false,
      "columns[4][orderable]": true,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "building_list",
      "columns[5][name]": "su.building_list",
      "columns[5][searchable]": false,
      "columns[5][orderable]": true,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "edit",
      "columns[6][name]": "",
      "columns[6][searchable]": false,
      "columns[6][orderable]": false,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "columns[7][data]": "delete",
      "columns[7][name]": "",
      "columns[7][searchable]": false,
      "columns[7][orderable]": false,
      "columns[7][search][value]": "",
      "columns[7][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": props.search == null ? "" : searchText,
      "search[regex]": false,
      _: 1653125202559,
    };
    return payload;
  };

  const getShiftList = () => {
    settingsService
      .getshiftlist(getPayload())
      .then((res) => {
        setShiftList((p) => [...p, ...res.data]);
        setTotalRecords(res.recordsFiltered);
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
      shiftList.length < totalRecords &&
      props.tab == "shifts"
    ) {
      setLoader(true);
      getShiftList();
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

  const deleteShift = () => {
    shiftService
      .deleteshiftrow(deleteId)
      .then(() => {
        toast.success("shift has been deleted successfully");
        setResetNow((p) => p + 1);
        setDeleteFlag(false);
      })
      .catch(() => toast.error("Failt to delete the shift"));
  };

  const updateShift = (data) => {
    console.log("shift data =>", data);
    setShiftFlag(true);
    setShiftDetails(data);
  };

  return (
    <div className="setting-shift-table bg-white">
      <CreateShift
        show={shiftFlag}
        handleClose={() => setShiftFlag(false)}
        data={shiftDetails}
        reset={() => setResetNow((p) => p + 1)}
        tab={props.tab}
      />
      <SimpleTable
        loader={mainLoader}
        key={`request`}
        columns={[
          {
            key: "id",
            label: <TableHead title="ID" onClick={() => sortData(0)} />,
            width: "70",
          },
          {
            key: "wholename",
            label: <TableHead title="Name" onClick={() => sortData(1)} />,
            width: "150",
          },
          {
            key: "dept_func_list",
            label: (
              <TableHead
                title="Department Function"
                onClick={() => sortData(2)}
              />
            ),
            width: "200",
          },
          {
            key: "task_group_list",
            label: <TableHead title="Task Group" onClick={() => sortData(3)} />,
            width: "200",
          },
          {
            key: "location_group_list",
            label: <TableHead title="Location" onClick={() => sortData(4)} />,
            width: "200",
          },
          {
            key: "building_list",
            label: <TableHead title="Building" onClick={() => sortData(5)} />,
            width: "200",
          },
          {
            key: "",
            label: "Edit",
            width: "50",
            template: ({ data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/update-green.svg"
                }
                onClick={() => updateShift(data)}
              />
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
        data={shiftList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteShift}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}
export default Shift;
