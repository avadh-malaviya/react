import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import locationGrpService from "../../../../services/guestservice/settings/locationgroup/locationgroup";
import settingsService from "../../../../services/guestservice/settings/setting";
import LocGrpForm from "./LocGrpForm/LocGrpForm";
import PartialForm from "./PartialForm/PartialForm";

function LocationGroup(props) {
  const [locGrpList, setLocGrpList] = useState([]);
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
  const [locationGrpFlag, setLocationGrpFlag] = useState(false);
  const [locGrpDetails, setLocGrpDetails] = useState({});
  const [selRow, setSelRow] = useState(-1);
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
    setLocGrpList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
    setEditLoader(false);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "location_group") {
      setResetFlag(0);
      getLocationGrpList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    setRecordStart((p) => p + 1);
    let payload = {
      draw: recordStart,
      "columns[0][data]": "id",
      "columns[0][name]": "lg.id",
      "columns[0][searchable]": true,
      "columns[0][orderable]": true,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "ccname",
      "columns[1][name]": "cc.name",
      "columns[1][searchable]": true,
      "columns[1][orderable]": true,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      "columns[2][data]": "name",
      "columns[2][name]": "lg.name",
      "columns[2][searchable]": true,
      "columns[2][orderable]": true,
      "columns[2][search][value]": "",
      "columns[2][search][regex]": false,
      "columns[3][data]": "description",
      "columns[3][name]": "lg.description",
      "columns[3][searchable]": true,
      "columns[3][orderable]": true,
      "columns[3][search][value]": "",
      "columns[3][search][regex]": false,
      "columns[4][data]": "edit",
      "columns[4][name]": "",
      "columns[4][searchable]": false,
      "columns[4][orderable]": false,
      "columns[4][search][value]": "",
      "columns[4][search][regex]": false,
      "columns[5][data]": "delete",
      "columns[5][name]": "",
      "columns[5][searchable]": false,
      "columns[5][orderable]": false,
      "columns[5][search][value]": "",
      "columns[5][search][regex]": false,
      "order[0][column]": sortField.key != null ? sortField.key : 0,
      "order[0][dir]": sortField.sort,
      start: pageNo,
      length: length,
      "search[value]": props.search == null ? "" : searchText,
      "search[regex]": false,
      // platform: "react",
      // client_id: 4,
      _: 1653464002611,
    };
    return payload;
  };

  const getLocationGrpList = () => {
    let obj = { platform: "react", limit: length, offset: pageNo };
    settingsService // getPayload()
      .getlocationgrplist(obj)
      .then((res) => {
        if (pageNo == 0) setSelRow(res[0]?.id);
        setLocGrpList((p) => [...p, ...res]);
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
      locGrpList.length < totalRecords &&
      props.tab == "location_group"
    ) {
      setLoader(true);
      getLocationGrpList();
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

  const updateLocGrp = (data) => {
    console.log("location group data", data);
    setLocGrpDetails(data);
    setLocationGrpFlag(true);
  };

  const deleteLocGrp = () => {
    locationGrpService
      .deletelocationgrprow(deleteId)
      .then(() => {
        setResetNow((p) => p + 1);
        toast.success("location group deleted successfully");
        setDeleteFlag(false);
      })
      .catch(() => {
        toast.error("Fail to delete location group");
      });
  };

  const loadData = (data) => {
    console.log("data.id", data.id);
    setSelRow(data.id);
  };

  return (
    <div className="setting-locgrp-table bg-white">
      <LocGrpForm
        show={locationGrpFlag}
        handleClose={() => setLocationGrpFlag(false)}
        data={locGrpDetails}
        reset={() => setResetNow((p) => p + 1)}
      />
      {locGrpList.length > 0 ? <PartialForm selid={selRow} /> : ""}
      <SimpleTable
        loader={mainLoader}
        key={`request`}
        activetr={selRow}
        keycompareactive="id"
        columns={[
          {
            key: "id",
            label: <TableHead title="ID" onClick={() => sortData(0)} />,
            width: "40",
            onTdClick: loadData,
          },
          {
            key: "ccname",
            label: <TableHead title="Client" onClick={() => sortData(1)} />,
            width: "150",
            onTdClick: loadData,
          },
          {
            key: "name",
            label: (
              <TableHead
                title="Location Group Name"
                onClick={() => sortData(2)}
              />
            ),
            width: "200",
            onTdClick: loadData,
          },
          {
            key: "description",
            label: (
              <TableHead title="Description" onClick={() => sortData(3)} />
            ),
            width: "200",
            onTdClick: loadData,
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
                    onClick={() => updateLocGrp(data)}
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
        data={locGrpList}
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={deleteLocGrp}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default LocationGroup;
