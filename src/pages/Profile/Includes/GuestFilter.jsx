import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Calendar from "../../../common/Calendar";
import FilledCheckBox from "../../../common/FormElements/FilledCheckBox";
import ModalOffcanvas from "../../../common/Modals/ModalOffcanvas";
import * as status from "../../../common/TaskActions/FilterStatus";
import guestService from "../../../services/guest";
import { useAuthState } from "../../../store/context";

function GuestFilter(props) {
  const [startDate, setStartDate] = useState(moment().subtract(5, "days"));
  const [endDate, setEndDate] = useState(moment());
  const [filterList, setFilterList] = useState({});
  const [disable, setDisable] = useState(false);
  const {
    user: { property_id, id },
  } = useAuthState();

  useEffect(() => {
    if (props.show) {
      setDisable(false);
      setFilterList(props.filters);
    }
  }, [props.show]);

  const arrayToStr = (arr) => {
    return `[${arr.toString()}]`;
  };

  const handleSubmit = (event) => {
    setDisable(true);
    event.preventDefault();
    let formData = new FormData(event.target);
    let obj = {
      department_id: arrayToStr(formData.getAll("department_id")),
      end_date: endDate.format("YYYY-MM-DD"),
      priority: arrayToStr(formData.getAll("priority")),
      start_date: startDate.format("YYYY-MM-DD"),
      status_id: arrayToStr(formData.getAll("status_id")),
      ticket: formData.get("ticket"),
      type_id: arrayToStr(formData.getAll("type_id")),
      user_id: id,
    };
    console.log("filter obj =>", obj);
    guestService
      .storetasklistprofile(obj)
      .then((res) => {
        props.apply(res[0]);
      })
      .catch(() => {
        setDisable(false);
        toast.error("Fail to set filters");
      });
  };

  const handleCheckboxChange = (e) => {
    setFilterList((p) => {
      let obj = p.profile;
      switch (e.target.name) {
        case "department_id":
          obj["department_id"] = handleString(
            e.target.checked,
            obj.department_id,
            e.target.value
          );
          break;
        case "priority":
          obj["priority"] = handleString(
            e.target.checked,
            obj.priority,
            e.target.value
          );
          break;
        case "status_id":
          obj["status_id"] = handleString(
            e.target.checked,
            obj.status_id,
            e.target.value
          );
          break;
        case "ticket":
          obj["ticket"] = e.target.value;
          break;
        case "type_id":
          obj["type_id"] = handleString(
            e.target.checked,
            obj.type_id,
            e.target.value
          );
          break;
        default:
          break;
      }
      return { ...p, profile: { ...obj } };
    });
  };

  const handleString = (flag, str, val) => {
    if (flag) {
      if (str.includes(val)) {
        return str;
      } else {
        var arr = str.slice(1, str.length - 1).split(",");
        arr.push(val);
        return arrayToStr(arr);
      }
    } else {
      if (str.includes(val)) {
        let arr = str.slice(1, str.length - 1).split(",");
        arr.splice(arr.indexOf(val), 1);
        return arrayToStr(arr);
      } else {
        return str;
      }
    }
  };

  const resetFilter = () => {
    console.log("props.filters ====>", props.filters);
    guestService
      .filterlist({
        attendant: 1,
        property_id: property_id,
      })
      .then((res) => setFilterList(res));
  };

  return (
    <ModalOffcanvas
      {...props}
      closeBtn={false}
      handlesubmit={(e) => handleSubmit(e)}
      className="custom-width"
      headerContainer={
        <div className="w-100">
          <button
            type="submit"
            disabled={disable}
            className="btn-update-active lato-filter-action float-right"
          >
            Apply
          </button>
          <div
            className="lato-filter-action float-right mt-1 row align-items-center mr-2"
            style={{ cursor: "pointer" }}
            onClick={resetFilter}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/remove-filter.svg`}
              className="col-auto p-0"
            />
            <span className="text-danger col-auto"> Remove All </span>
          </div>
          <div className="float-left lato-title mt-1">Filters</div>
        </div>
      }
      bodyContainer={
        <>
          <div className="pl-3 pr-3">
            <FilledCheckBox
              type="radio"
              name="ticket"
              value="Custom Days"
              checked={filterList?.profile?.ticket == "Custom Days"}
              className="w-100 bdr-bottom"
              onChange={handleCheckboxChange}
              label={
                <Calendar
                  startDate={startDate}
                  endDate={endDate}
                  start={(date) => setStartDate(date)}
                  end={(date) => setEndDate(date)}
                >
                  <span>
                    <span className="bg-light radius-6 pt-2 pb-2 pl-3 pr-3 mr-2">
                      {startDate.format("DD-MM-YYYY")}
                    </span>
                    :
                    <span className="bg-light radius-6 pt-2 pb-2 pl-3 pr-3 ml-2">
                      {endDate.format("DD-MM-YYYY")}
                    </span>
                  </span>
                </Calendar>
              }
            />
            <FilledCheckBox
              type="radio"
              name="ticket"
              value="Last 24 Hours"
              checked={filterList?.profile?.ticket == "Last 24 Hours"}
              className="w-100 bdr-bottom"
              label="Last 24 Hours"
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              type="radio"
              name="ticket"
              value="Tickets created by me"
              checked={filterList?.profile?.ticket == "Tickets created by me"}
              label="Tickets created by me"
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="lato-filter-head p-3 bdr-bottom bdr-top">Status</div>
          <div className="pl-3 pr-3">
            <FilledCheckBox
              name="status_id"
              value="0"
              checked={filterList?.profile?.status_id?.includes("0")}
              className="w-100 bdr-bottom"
              label={status.STATUS_COMPLETED}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="1"
              checked={filterList?.profile?.status_id?.includes("1")}
              className="w-100 bdr-bottom"
              label={status.STATUS_OPEN}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="2"
              checked={filterList?.profile?.status_id?.includes("2")}
              className="w-100 bdr-bottom"
              label={status.STATUS_ESCALATED}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="3"
              checked={filterList?.profile?.status_id?.includes("3")}
              className="w-100 bdr-bottom"
              label={status.STATUS_TIMEOUT}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="4"
              checked={filterList?.profile?.status_id?.includes("4")}
              className="w-100 bdr-bottom"
              label={status.STATUS_CANCELED}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="5"
              checked={filterList?.profile?.status_id?.includes("5")}
              className="w-100 bdr-bottom"
              label={status.STATUS_SCHEDULED}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="6"
              checked={filterList?.profile?.status_id?.includes("6")}
              className="w-100 bdr-bottom"
              label={status.STATUS_UNASSIGNED}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="status_id"
              value="7"
              checked={filterList?.profile?.status_id?.includes("7")}
              label={status.STATUS_CLOSED}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="lato-filter-head p-3 bdr-bottom bdr-top">
            Priority
          </div>
          <div className="pl-3 pr-3">
            {filterList?.priority?.map((item, i) => (
              <FilledCheckBox
                name="priority"
                value={item.id}
                checked={filterList?.profile?.priority.includes(item.id)}
                className={`${
                  filterList?.priority?.length == i + 1 ? "" : "bdr-bottom"
                } w-100`}
                label={item.priority}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="lato-filter-head p-3 bdr-bottom bdr-top">
            Department
          </div>
          <div className="pl-3 pr-3">
            {filterList?.department?.map((item, i) => (
              <FilledCheckBox
                name="department_id"
                value={item.id}
                checked={filterList?.profile?.department_id.includes(item.id)}
                className={`${
                  filterList?.department?.length == i + 1 ? "" : "bdr-bottom"
                } w-100`}
                label={item.department}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="lato-filter-head p-3 bdr-bottom bdr-top">
            Ticket Type
          </div>
          <div className="pl-3 pr-3 bdr-bottom">
            <FilledCheckBox
              name="type_id"
              value="1"
              checked={filterList?.profile?.type_id?.includes(1)}
              className="w-100 bdr-bottom"
              label={status.STATUS_GUEST}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="type_id"
              value="2"
              checked={filterList?.profile?.type_id?.includes(2)}
              className="w-100 bdr-bottom"
              label={status.STATUS_DEPARTMENT}
              onChange={handleCheckboxChange}
            />
            <FilledCheckBox
              name="type_id"
              value="4"
              checked={filterList?.profile?.type_id?.includes(4)}
              label={status.STATUS_TASK}
              onChange={handleCheckboxChange}
            />
          </div>
        </>
      }
    />
  );
}

export default GuestFilter;
