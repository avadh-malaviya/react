import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import locationService from "../../../../services/guestservice/settings/location/location";
import settingsService from "../../../../services/guestservice/settings/setting";
import LocationForm from "./form/LocationForm";

function Location(props) {
  const [locationList, setLocationList] = useState([]);
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
  const [locationFlag, setLocationFlag] = useState(false);
  const [locationDetails, setLocationDetails] = useState({});
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
    setLocationList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
    setEditLoader(false);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "location") {
      setResetFlag(0);
      getLocationList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "cf.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "name",
      "columns[1][name]": "sl.name",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "type",
      "columns[2][name]": "lt.type",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "cpname",
      "columns[3][name]": "cp.name",
      "columns[3][searchable]": true,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "cbname",
      "columns[4][name]": "cb.name",
      "columns[4][searchable]": true,
      "columns[4][orderable]": true,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "floor",
      "columns[5][name]": "cf.floor",
      "columns[5][searchable]": true,
      "columns[5][orderable]": true,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "columns[6][data]": "room",
      "columns[6][name]": "cr.room",
      "columns[6][searchable]": true,
      "columns[6][orderable]": true,
      "columns[6][search][value]": "",
      "columns[6][search][regex]": false,
      "columns[7][data]": "desc",
      "columns[7][name]": "sl.desc",
      "columns[7][searchable]": true,
      "columns[7][orderable]": true,
      "columns[7][search][value]": "",
      "columns[7][search][regex]": false,
      "columns[8][data]": "lenable",
      "columns[8][name]": "",
      "columns[8][searchable]": false,
      "columns[8][orderable]": false,
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
      _: 1653395468938,
    };
    return payload;
  };

  const getLocationList = () => {
    // getPayload()
    let obj = {
      platform: "react",
      limit: length,
      offset: pageNo,
    };
    settingsService
      .getlocationlist(obj)
      .then((res) => {
        setLocationList((p) => [...p, ...res]);
        // setTotalRecords(res.recordsFiltered);
        setMainLoader(false);
        setLoader(false);
      })
      .catch(() => {
        toast.error("Faild to fetch location list");
        setMainLoader(false);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (
      pageNo !== 0 &&
      // locationList.length < totalRecords &&
      props.tab == "location"
    ) {
      setLoader(true);
      getLocationList();
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

  const updateLocation = (data) => {
    console.log("location data", data);
    setLocationFlag(true);
    setLocationDetails(data);
  };

  const deleteLocation = () => {
    locationService
      .deletelocationrow(deleteId)
      .then(() => {
        setResetNow((p) => p + 1);
        toast.success("Location deleted successfully");
        setDeleteFlag(false);
      })
      .catch(() => toast.error("Fail to delete location"));
  };

  return (
    <div className="setting-location-table bg-white">
      <LocationForm
        show={locationFlag}
        handleClose={() => setLocationFlag(false)}
        data={locationDetails}
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
            key: "name",
            label: <TableHead title="Name" onClick={() => sortData(1)} />,
            width: "150",
          },
          {
            key: "type",
            label: <TableHead title="Type" onClick={() => sortData(2)} />,
            width: "200",
          },
          {
            key: "cpname",
            label: <TableHead title="Property" onClick={() => sortData(3)} />,
            width: "200",
          },
          {
            key: "cbname",
            label: <TableHead title="Building" onClick={() => sortData(4)} />,
            width: "200",
          },
          {
            key: "floor",
            label: <TableHead title="Floor" onClick={() => sortData(5)} />,
            width: "200",
          },
          {
            key: "room",
            label: <TableHead title="Room" onClick={() => sortData(6)} />,
            width: "200",
          },
          {
            key: "desc",
            label: (
              <TableHead title="Description" onClick={() => sortData(7)} />
            ),
            width: "200",
          },
          {
            key: "disable",
            label: "Disable",
            width: "50",
            template: ({ children }) => (
              <div className="row align-items-center">
                {/* <div className="col-auto lato-canvas-sub-title">
                  {children[0]}
                </div> */}
                <div className="col-auto pt-1">
                  <label className="custom-toggle m-0">
                    <input type="checkbox" checked={children[0] == 1} />
                    <span className="custom-slider round"></span>
                  </label>
                </div>
              </div>
            ),
          },
          {
            key: "",
            label: "Edit",
            width: "50",
            template: ({ data }) => (
              <>
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
                    onClick={() => updateLocation(data)}
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
        data={locationList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteLocation}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default Location;
