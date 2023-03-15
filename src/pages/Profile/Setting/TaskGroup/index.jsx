import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import dateTime from "../../../../helper/dateTime";
import { secondsToHms } from "../../../../helper/helper";
import settingsService from "../../../../services/guestservice/settings/setting";
import taskGroupService from "../../../../services/guestservice/settings/taskgroup/taskgroup";
import { useAuthState } from "../../../../store/context";
import CreateTaskGroup from "./create/CreateTaskGroup";

function TaskGroup(props) {
  const [groupTaskList, setGroupTaskList] = useState([]);
  const [taskGrpDetail, setTaskGrpDetail] = useState({});
  const [pageNo, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loader, setLoader] = useState(false);
  const [mainLoader, setMainLoader] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [resetFlag, setResetFlag] = useState(0);
  const [resetNow, setResetNow] = useState(0);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [taskGroupFlag, setTaskGroupFlag] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [length, setLength] = useState(25);
  const sortClickDefault = {
    click: 1,
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

  useEffect(async () => {
    console.log("hey from useEffect");
    setDeleteId(null);
    setMainLoader(true);
    setPage(0);
    setGroupTaskList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "tasks_group") {
      setResetFlag(0);
      getGroupTaskList();
    }
  }, [resetFlag, props.tab]);

  const payloadObj = () => {
    setDrawCount((p) => p + 1);
    let payload = {
      draw: drawCount,
      "columns[0][data]": "id",
      "columns[0][name]": "tg.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "function",
      "columns[1][name]": "df.function",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "name",
      "columns[2][name]": "tg.name",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "ugname",
      "columns[3][name]": "tg.name",
      "columns[3][searchable]": true,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "max_time",
      "columns[4][name]": "tg.max_time",
      "columns[4][searchable]": true,
      "columns[4][orderable]": true,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "request_reminder",
      "columns[5][name]": "tg.request_reminder",
      "columns[5][searchable]": true,
      "columns[5][orderable]": true,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "escalation",
      "columns[6][name]": "tg.escalation",
      "columns[6][searchable]": true,
      "columns[6][orderable]": true,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "columns[7][data]": "by_guest_flag",
      "columns[7][name]": "tg.by_guest_flag",
      "columns[7][searchable]": true,
      "columns[7][orderable]": true,
      "columns[7][search][value]": "",
      "columns[7][search][regex]": false,
      "columns[8][data]": "edit",
      "columns[8][name]": "",
      "columns[8][searchable]": false,
      "columns[8][orderable]": false,
      "columns[8][search][value]": "",
      "columns[8][search][regex]": false,
      "columns[9][data]": "delete",
      "columns[9][name]": "",
      "columns[9][searchable]": false,
      "columns[9][orderable]": false,
      "columns[9][search][value]": props.search == null ? "" : searchText,
      "columns[9][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": "",
      "search[regex]": false,
      plateform: "react",
      _: 1653043474665,
    };
    return payload;
  };

  const getGroupTaskList = () => {
    // let obj = {
    //   page: pageNo,
    //   pagesize: 25,
    //   property_id: property_id,
    //   searchText: props.search == null ? "" : searchText,
    //   sort: sortField.sort,
    //   user_id: id,
    // };
    // if (sortField.key != null) obj["field"] = sortField.key;
    settingsService
      .gettaskgrouplist({ platform: "react", limit: length, offset: pageNo })
      .then((res) => {
        console.log("testing ===>", res);
        // setGroupTaskList((p) => [...p, ...res.data]);
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
      groupTaskList.length < totalRecords &&
      props.tab == "tasks_group"
    ) {
      setLoader(true);
      getGroupTaskList();
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

  const updateTaskGroup = (data) => {
    console.log("Task Group Details", data);
    setTaskGrpDetail(data);
    setTaskGroupFlag(true);
  };

  const deleteTaskGroup = () => {
    taskGroupService
      .deletetaskgrouprow(deleteId)
      .then(() => toast.success("task group deleted successfully"))
      .catch(() => toast.error("Fail to delete task group"));
    setResetNow((p) => p + 1);
    setDeleteFlag(false);
  };
  return (
    <div className="setting-task-table bg-white">
      <CreateTaskGroup
        show={taskGroupFlag}
        handleClose={() => setTaskGroupFlag(false)}
        data={taskGrpDetail}
        reset={() => setResetNow((p) => p + 1)}
      />

      <SimpleTable
        loader={mainLoader}
        key={`request`}
        columns={[
          {
            key: "id",
            label: <TableHead title="ID" onClick={() => sortData(0)} />,
            width: "100",
          },
          {
            key: "function",
            label: (
              <TableHead
                title="Department Function"
                onClick={() => sortData(1)}
              />
            ),
            width: "150",
          },
          {
            key: "name",
            label: <TableHead title="Group Name" onClick={() => sortData(2)} />,
            width: "150",
          },
          {
            key: "ugname",
            label: (
              <TableHead title="User Group Name" onClick={() => sortData(3)} />
            ),
            width: "150",
          },
          {
            key: "max_time",
            label: <TableHead title="Duration" onClick={() => sortData(4)} />,
            width: "150",
            template: ({ children }) => (
              <span>{secondsToHms(children[0])}</span>
            ),
          },
          {
            key: "request_reminder",
            label: (
              <TableHead title="Request Reminder" onClick={() => sortData(5)} />
            ),
            width: "150",
          },
          {
            key: "escalation",
            label: <TableHead title="Escalate" onClick={() => sortData(6)} />,
            width: "150",
          },
          {
            key: "by_guest_flag",
            label: <TableHead title="By Guest" onClick={() => sortData(7)} />,
            width: "150",
          },
          {
            key: "",
            label: "Edit",
            width: "100",
            template: ({ children, data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/update-green.svg"
                }
                onClick={() => updateTaskGroup(data)}
              />
            ),
          },
          {
            key: "id",
            label: "Delete",
            width: "100",
            template: ({ children }) => (
              <img
                src={
                  process.env.PUBLIC_URL + "/images/general-icons/bin-red.svg"
                }
                onClick={() => {
                  setDeleteFlag(true);
                  setDeleteId(children[0]);
                }}
              />
            ),
          },
        ]}
        data={groupTaskList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteTaskGroup}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default TaskGroup;
