import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import settingsService from "../../../../services/guestservice/settings/setting";
import { useAuthState } from "../../../../store/context";
import SimpleTable from "../../../../common/SimpleTable";
import Loader from "../../../../common/Loader";
import TableHead from "../../../../common/TableHead";
import CreateTask from "./create/CreateTask";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import taskService from "../../../../services/guestservice/settings/task/task";

function Task(props) {
  const [taskList, setTaskList] = useState([]);
  const [pageNo, setPage] = useState(0);
  const [recordStart, setRecordStart] = useState(1);
  const [length, setLength] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loader, setLoader] = useState(false);
  const [TaskFlag, setTaskFlag] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [mainLoader, setMainLoader] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [resetFlag, setResetFlag] = useState(0);
  const [resetNow, setResetNow] = useState(0);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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

  useEffect(async () => {
    setDeleteId(null);
    setMainLoader(true);
    setPage(0);
    setTaskList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "tasks") {
      setResetFlag(0);
      getTaskList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "tl.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "tgname",
      "columns[1][name]": "tg.name",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "task",
      "columns[2][name]": "tl.task",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "chkstatus",
      "columns[3][name]": "tl.chkstatus",
      "columns[3][searchable]": true,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "lang",
      "columns[4][name]": "",
      "columns[4][searchable]": false,
      "columns[4][orderable]": false,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "edit",
      "columns[5][name]": "",
      "columns[5][searchable]": false,
      "columns[5][orderable]": false,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "delete",
      "columns[6][name]": "",
      "columns[6][searchable]": false,
      "columns[6][orderable]": false,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": props.search == null ? "" : searchText,
      "search[regex]": false,
      _: 1653036662751,
    };
    return payload;
  };

  const getTaskList = () => {
    console.log("tasklist");
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
      .gettasklist(getPayload())
      .then((res) => {
        setTaskList((p) => [...p, ...res.data]);
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
      taskList.length < totalRecords &&
      props.tab == "tasks"
    ) {
      setLoader(true);
      getTaskList();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + length);
    }
  };

  const updateTask = (data) => {
    console.log("called data", data);
    setTaskDetails(data);
    setTaskFlag(true);
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

  const deleteTask = () => {
    taskService
      .deletetaskrow(deleteId)
      .then(() => toast.success("task deleted successfully"))
      .catch(() => toast.error("Fail to delete task"));
    setResetNow((p) => p + 1);
    setDeleteFlag(false);
  };

  return (
    <div className="setting-task-table bg-white">
      <CreateTask
        show={TaskFlag}
        handleClose={() => setTaskFlag(false)}
        data={taskDetails}
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
            key: "tgname",
            label: (
              <TableHead title="Task Group Name" onClick={() => sortData(1)} />
            ),
            width: "150",
          },
          {
            key: "task",
            label: <TableHead title="Task Name" onClick={() => sortData(2)} />,
            width: "150",
          },
          {
            key: "status",
            label: <TableHead title="Status" onClick={() => sortData(3)} />,
            width: "150",
            template: ({ children }) => (
              <>
                {children[0] == 1 ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Deactive</span>
                )}
              </>
            ),
          },
          { key: "lang", label: "Language", width: "150" },
          {
            key: "",
            label: "Edit",
            width: "100",
            template: ({ data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/update-green.svg"
                }
                onClick={() => updateTask(data)}
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
                  setDeleteId(children[0]);
                  setDeleteFlag(true);
                }}
              />
            ),
          },
        ]}
        data={taskList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteTask}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default Task;
