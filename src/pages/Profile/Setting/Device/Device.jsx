import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import deviceService from "../../../../services/guestservice/settings/device/device";
import settingsService from "../../../../services/guestservice/settings/setting";
import { useAuthState } from "../../../../store/context";
import CreateDevice from "./create/CreateDevice";
import ViewDevice from "./view/ViewDevice";

function Devices(props) {
  const [deviceList, setDeviceList] = useState([]);
  const [mainLoader, setMainLoader] = useState(true);
  const [loader, setLoader] = useState(false);
  const [resetFlag, setResetFlag] = useState(0);
  const [resetNow, setResetNow] = useState(0);
  const [pageNo, setPage] = useState(0);
  const [recordStart, setRecordStart] = useState(1);
  const [length, setLength] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [showDevice, setShowDevice] = useState(false);
  const [deviceFlag, setDeviceFlag] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState({});
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
    setMainLoader(true);
    setPage(0);
    setDeviceList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "devices") {
      setResetFlag(0);
      getDeviceList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      status: "All",
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "sd.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "name",
      "columns[1][name]": "sd.name",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "function",
      "columns[2][name]": "sd.function",
      "columns[2][searchable]": false,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "sec_function",
      "columns[3][name]": "",
      "columns[3][searchable]": false,
      "columns[3][orderable]": false,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "type",
      "columns[4][name]": "sd.type",
      "columns[4][searchable]": true,
      "columns[4][orderable]": true,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "number",
      "columns[5][name]": "sd.number",
      "columns[5][searchable]": true,
      "columns[5][orderable]": true,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "device_status",
      "columns[6][name]": "device_status",
      "columns[6][searchable]": false,
      "columns[6][orderable]": true,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "columns[7][data]": "loc_name",
      "columns[7][name]": "lg.name",
      "columns[7][searchable]": false,
      "columns[7][orderable]": true,
      "columns[7][search][value]": "",
      "columns[7][search][regex]": false,
      "columns[8][data]": "sec_loc_name",
      "columns[8][name]": "lg2.name",
      "columns[8][searchable]": false,
      "columns[8][orderable]": true,
      "columns[8][search][value]": "",
      "columns[8][search][regex]": false,
      "columns[9][data]": "cb_name",
      "columns[9][name]": "cb.name",
      "columns[9][searchable]": false,
      "columns[9][orderable]": true,
      "columns[9][search][value]": "",
      "columns[9][search][regex]": false,
      "columns[10][data]": "device_id",
      "columns[10][name]": "sd.device_id",
      "columns[10][searchable]": true,
      "columns[10][orderable]": true,
      "columns[10][search][value]": "",
      "columns[10][search][regex]": false,
      "columns[11][data]": "device_user",
      "columns[11][name]": "sd.device_user",
      "columns[11][searchable]": true,
      "columns[11][orderable]": true,
      "columns[11][search][value]": "",
      "columns[11][search][regex]": false,
      "columns[12][data]": "device_model",
      "columns[12][name]": "sd.device_model",
      "columns[12][searchable]": true,
      "columns[12][orderable]": true,
      "columns[12][search][value]": "",
      "columns[12][search][regex]": false,
      "columns[13][data]": "device_api_level",
      "columns[13][name]": "sd.device_api_level",
      "columns[13][searchable]": true,
      "columns[13][orderable]": true,
      "columns[13][search][value]": "",
      "columns[13][search][regex]": false,
      "columns[14][data]": "device_os",
      "columns[14][name]": "sd.device_os",
      "columns[14][searchable]": true,
      "columns[14][orderable]": true,
      "columns[14][search][value]": "",
      "columns[14][search][regex]": false,
      "columns[15][data]": "device_manufacturer",
      "columns[15][name]": "sd.device_manufacturer",
      "columns[15][searchable]": true,
      "columns[15][orderable]": true,
      "columns[15][search][value]": "",
      "columns[15][search][regex]": false,
      "columns[16][data]": "device_version_release_model",
      "columns[16][name]": "sd.device_version_release_model",
      "columns[16][searchable]": true,
      "columns[16][orderable]": true,
      "columns[16][search][value]": "",
      "columns[16][search][regex]": false,
      "columns[17][data]": "edit",
      "columns[17][name]": "",
      "columns[17][searchable]": false,
      "columns[17][orderable]": false,
      "columns[17][search][value]": "",
      "columns[17][search][regex]": false,
      "columns[18][data]": "delete",
      "columns[18][name]": "",
      "columns[18][searchable]": false,
      "columns[18][orderable]": false,
      "columns[18][search][value]": "",
      "columns[18][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": props.search == null ? "" : searchText,
      "search[regex]": false,
      _: 1653367452034,
    };
    return payload;
  };

  const getDeviceList = () => {
    let obj = {
      platform: "react",
      limit: length,
      offset: pageNo,
      status: ["Online", "Offline", "Disabled", "Active"],
    };
    settingsService
      .getdevicelist(obj)
      .then((res) => {
        setDeviceList((p) => [...p, ...res]);
        // setTotalRecords(res.recordsFiltered);
        setMainLoader(false);
        setLoader(false);
      })
      .catch(() => {
        toast.error("Fail to fetch the Device List");
        setMainLoader(false);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (
      pageNo !== 0 &&
      // deviceList.length < totalRecords &&
      props.tab == "devices"
    ) {
      setLoader(true);
      getDeviceList();
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

  const updateDevice = (data, flag = 0) => {
    console.log("device data", data);
    setDeviceDetails(data);
    if (flag == 1) setDeviceFlag(true);
    else {
      setShowDevice(true);
    }
  };

  const deleteDevice = () => {
    deviceService
      .deletedevice(deleteId)
      .then(() => {
        toast.success("Device deleted successfully");
        setResetNow((p) => p + 1);
        setDeleteFlag(false);
      })
      .catch(() => toast.error("Fail to delete Device"));
  };

  const trfToUpdate = () => {};

  return (
    <div className="setting-device-table bg-white">
      <ViewDevice
        show={showDevice}
        handleClose={() => setShowDevice(false)}
        data={deviceDetails}
        reset={() => setResetNow((p) => p + 1)}
        trfcall={() => setDeviceFlag(true)}
      />
      <CreateDevice
        show={deviceFlag}
        handleClose={() => setDeviceFlag(false)}
        data={deviceDetails}
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
            width: "100",
          },
          {
            key: "name",
            label: <TableHead title="Name" onClick={() => sortData(1)} />,
            width: "150",
          },
          {
            key: "function",
            label: (
              <TableHead
                title="Department Function"
                onClick={() => sortData(2)}
              />
            ),
            width: "200",
          },
          {
            key: "sec_function",
            label: "Second Department Function",
            width: "200",
          },
          {
            key: "type",
            label: <TableHead title="Type" onClick={() => sortData(4)} />,
            width: "100",
          },
          {
            key: "number",
            label: <TableHead title="Number" onClick={() => sortData(5)} />,
            width: "150",
          },
          {
            key: "device_status",
            label: <TableHead title="Status" onClick={() => sortData(6)} />,
            width: "100",
          },
          {
            key: "loc_name",
            label: (
              <TableHead title="Location Group" onClick={() => sortData(7)} />
            ),
            width: "200",
          },
          {
            key: "cb_name",
            label: <TableHead title="Building" onClick={() => sortData(8)} />,
            width: "200",
          },
          {
            key: "device_id",
            label: <TableHead title="Device Id" onClick={() => sortData(10)} />,
            width: "150",
          },
          {
            key: "",
            label: "Edit",
            width: "20",
            template: ({ data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/update-green.svg"
                }
                onClick={() => updateDevice(data, 1)}
              />
            ),
          },
          {
            key: "id",
            label: "Delete",
            width: "20",
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
          {
            key: "",
            label: "Expand",
            width: "20",
            template: ({ data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/expand-grey.svg"
                }
                onClick={() => updateDevice(data)}
              />
            ),
          },
        ]}
        data={deviceList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteDevice}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default Devices;
