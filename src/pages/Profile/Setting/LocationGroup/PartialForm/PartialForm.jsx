import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import DropdownCheckbox from "../../../../../common/MuiElement/DropdownCheckbox";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import locationGrpService from "../../../../../services/guestservice/settings/locationgroup/locationgroup";
import ListService from "../../../../../services/list";

function PartialForm(props) {
  const [saveLoader, setSaveLoader] = useState(false);
  const [locTypeList, setLocTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selLocationList, setSelLocationList] = useState([]);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    getLocationType();
    getLocationList(1, props.selid);
  }, []);

  useEffect(() => {
    getLocationList(1, props.selid);
  }, [props.selid]);

  const getLocationType = () => {
    ListService.getlocationgroups()
      .then((res) =>
        setLocTypeList(
          res.map((item, i) => {
            return { value: i + 1, label: item.name };
          })
        )
      )
      .catch(() => toast.error("Fail to fetch the location type list"));
  };

  const getLocationList = (id, ltg_id) => {
    let obj = {
      ltgroup_id: ltg_id, // selected group id
      type_id: id, // selected location type id
    };
    reset(obj);
    locationGrpService
      .getlocationlist(obj)
      .then((res) => {
        setLocationList(res[0]);
        setSelLocationList(res[1]);
      })
      .catch(() => toast.error("Fail to fetch the location list"));
  };

  const moveSelectedLoc = async (data) => {
    setSelLocationList((p) => {
      let selLoc = locationList.filter(function (o1, ind) {
        return data.some(function (o2, ind2) {
          return o1.name == o2; // return the ones with equal value
        });
      });
      return [...p, ...selLoc];
    });
    setLocationList((p) => {
      return p.filter((val) => !data.includes(val.name));
    });
  };

  const unSelect = (data) => {
    setLocationList((p) => {
      let selLoc = selLocationList.filter(function (o1, ind) {
        return data.some(function (o2, ind2) {
          return o1.name == o2; // return the ones with equal value
        });
      });
      return [...p, ...selLoc];
    });
    setSelLocationList((p) => {
      return p.filter((val) => !data.includes(val.name));
    });
  };

  const prepareObj = (data) => {
    let selIdObj = {};
    if (selLocationList.length > 0) {
      selLocationList.map((item, i) => (selIdObj[`${i}`] = item.id));
    }
    let obj = {
      ltgroup_id: data.ltgroup_id,
      select_id: selIdObj,
      type_id: data.type_id,
    };
    return obj;
  };

  const addLocation = (data) => {
    setSaveLoader(true);
    locationGrpService
      .postlocation(prepareObj(data))
      .then(() => {
        toast.success("location updated successfully");
        setSaveLoader(false);
      })
      .catch(() => {
        toast.error("Fail to update location");
        setSaveLoader(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(addLocation)}>
      <div className="p-2 bdr-bottom row m-0">
        <div className="row align-items-center col">
          <img
            src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
            className="col-auto"
            style={{ width: "50px" }}
          />
          <div className="lato-canvas-title col-auto mb-0">Add New</div>
        </div>
        <div className="col">
          <button
            className="float-end btn-update-active lato-btn"
            disabled={saveLoader}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                style={{ width: "15px" }}
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      <div className="container-fluid row m-0 p-2 bdr-bottom">
        {locTypeList.length > 0 ? (
          <div className="col p-1">
            <Controller
              control={control}
              name="loc_type"
              render={({ field: { onChange } }) => (
                <>
                  <Select
                    inputRef={{ ...register("loc_type") }}
                    styles={floatLabel.bgWhite}
                    options={locTypeList}
                    components={{
                      ValueContainer: CustomValueContainer,
                    }}
                    defaultValue={[locTypeList[0]]}
                    placeholder="Select Location Type"
                    onChange={(val) => {
                      onChange(val.value);
                      getLocationList(val.value);
                    }}
                  />
                </>
              )}
            />
          </div>
        ) : (
          ""
        )}
        <div className="col-md-4 p-1">
          <DropdownCheckbox
            title="Add Location"
            options={locationList}
            labelKey="name"
            // onChange={(e) => console.log("received the value", e)}
            movecall={(e) => moveSelectedLoc(e)}
          />
        </div>
        <div className="col p-1">
          <DropdownCheckbox
            title="Selected Location"
            options={selLocationList}
            labelKey="name"
            // onChange={(e) => console.log("received the value", e)}
            movecall={(e) => unSelect(e)}
          />
          {/* <Controller
            control={control}
            name="job_role"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  styles={floatLabel.bgWhite}
                  options={[]}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Select Location Type"
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          /> */}
        </div>
      </div>
    </form>
  );
}

export default PartialForm;
