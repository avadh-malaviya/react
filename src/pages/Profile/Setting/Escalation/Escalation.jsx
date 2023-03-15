import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import SimpleTable from "../../../../common/SimpleTable";
import { secondsToHms } from "../../../../helper/helper";
import settingsService from "../../../../services/guestservice/settings/setting";
import ListService from "../../../../services/list";
import FormEscalation from "./form/FormEscalation";

function Escalation(props) {
  const [escalationList, setescalationList] = useState([]);
  const [currEscalation, setCurrEscalation] = useState([]);
  const [deptFun, setDeptFun] = useState([]);
  const [escalationDetails, setEscalationDetails] = useState(null);
  const [mainLoader, setMainLoader] = useState(true);
  const [pageNo, setPage] = useState(0);
  const [length, setLength] = useState(25);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    getDepatmentFunction();
    getEscalationList();
  }, []);

  const getDepatmentFunction = () => {
    ListService.getdepartmentfunction()
      .then((res) => setDeptFun(res))
      .catch(() => toast.error("Fail to fetch department function"));
  };

  const getEscalationList = () => {
    let obj = { platform: "react", limit: length, offset: pageNo };
    settingsService.getescalationlist(obj).then((res) => {
      setescalationList((p) => [...p, ...addTypeName(res)]);
      setLoader(false);
      setMainLoader(false);
    });
  };

  const addTypeName = (data) => {
    let arr = data.map((item) => {
      switch (item.device_type) {
        case 0:
          return { ...item, type_name: "User" };
        case 1:
          return { ...item, type_name: "Device" };
        case 2:
          return { ...item, type_name: "Roster" };
        default:
          break;
      }
    });
    return arr;
  };

  useEffect(() => {
    if (
      pageNo !== 0 &&
      // locationList.length < totalRecords && //change the states
      props.tab == "escalation"
    ) {
      setLoader(true);
      getEscalationList();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + length);
    }
  };

  return (
    <div className="setting-escalation-table bg-white">
      <div>
        <FormEscalation data={escalationDetails} />
        <div className="p-3 bdr-bottom lato-canvas-title">Escalation List</div>
      </div>
      <SimpleTable
        loader={mainLoader}
        key={`request`}
        columns={[
          { key: "id", label: "ID" },
          { key: "escalation_group_name", label: "Heading" },
          { key: "job_role", label: "Job Role" },
          { key: "type_name", label: "Type" },
          { key: "id", label: "Notification" },
          {
            key: "id",
            label: "Duration",
            template: ({ children }) => secondsToHms(children[0]),
          },
          {
            key: "",
            label: "Edit",
            template: ({ data }) => (
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/update-green.svg"
                }
                // onClick={() => updateTask(data)}
              />
            ),
          },
          {
            key: "id",
            label: "Delete",
            template: ({ children }) => (
              <img
                src={
                  process.env.PUBLIC_URL + "/images/general-icons/bin-red.svg"
                }
                // onClick={() => {
                //   setDeleteId(children[0]);
                //   setDeleteFlag(true);
                // }}
              />
            ),
          },
        ]}
        data={escalationList}
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default Escalation;
