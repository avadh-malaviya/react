import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import Select from "react-select";
import InputField from "../../../../../common/FormElements/InputField";
import ButtonCheckBox from "../../../../../common/FormElements/ButtonCheckBox";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import { useEffect } from "react";
import ListService from "../../../../../services/list";
import { toast } from "react-toastify";
import userService from "../../../../../services/guestservice/settings/user/user";
import locationService from "../../../../../services/guestservice/settings/location/location";
import Loader from "../../../../../common/Loader";

function LocationForm(props) {
  const [disable, setDisable] = useState(false);
  const [status, setStatus] = useState(0);
  const [propertyList, setPropertyList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [floorList, setFlootList] = useState([]);
  const [locationTypeList, setLocationTypeList] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [selBuilding, setSelBuilding] = useState([]);
  const [selFloor, setSelFloor] = useState([]);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const resetObj = {
    name: "",
    description: "",
    type: 0,
    floor: "",
    building: "",
    property: "",
  };

  useEffect(() => {
    if (props.show) {
      getProperty();
      getLocatioType();
      if (props.data == null) resetValues();
      else formValue();
    }
  }, [props.show]);

  const formValue = () => {
    getBuildingList(props.data.property_id);
    getFloorList(props.data.building_id);
    setSaveLoader(false);
    reset({
      name: props.data.name,
      description: props.data.desc,
      type: props.data.type_id,
      floor: props.data.floor_id,
      building: props.data.building_id,
      property: props.data.property_id,
    });
  };

  const resetValues = () => {
    setSaveLoader(false);
    setBuildingList([]);
    setFlootList([]);
    setStatus(0);
    reset(resetObj);
  };

  const getProperty = () => {
    ListService.getpropertylist()
      .then((res) =>
        setPropertyList(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("fail to fetch property list"));
  };

  const getBuildingList = (prop_id) => {
    userService
      .getbuildlist({ property_id: prop_id })
      .then((res) => {
        let options = res.map((item) => {
          return { value: item.id, label: item.name };
        });
        setBuildingList(options);
        if (props.data != null)
          setSelBuilding(() =>
            options.filter((item) => item.value == props.data.building_id)
          );
      })
      .catch(() => toast.error("Fail to fetch the building list"));
  };

  const getFloorList = (buildid) => {
    locationService
      .getroomlist({ build_id: buildid })
      .then((res) => {
        let options = res.floor.map((item) => {
          return { value: item.id, label: item.floor };
        });
        setFlootList(options);

        if (props.data != null)
          setSelFloor(() =>
            options.filter((item) => item.value == props.data.floor_id)
          );
      })
      .catch(() => toast.error("Fail to fetch the floor list"));
  };

  const getLocatioType = () => {
    locationService
      .getlocationtypelist({ val: "" })
      .then((res) =>
        setLocationTypeList(
          res.map((item) => {
            return { value: item.id, label: item.type };
          })
        )
      )
      .catch(() => toast.error("Fail to fetch the location type list"));
  };

  const prepareObj = (data) => {
    let obj = {
      building_id: data.building,
      desc: data.description,
      disable: status,
      id: props.data == null ? -1 : props.data.id,
      name: data.name,
      property_id: data.property,
      floor: data.floor,
      room: props.data == null ? null : props.data.room,
      room_id: props.data == null ? 0 : parseInt(props.data.floor),
      type_id: data.type,
      type: "Floor",
    };
    return obj;
  };

  const createNewLocation = (data) => {
    setSaveLoader(true);
    console.log("create location data", prepareObj(data));
    if (props.data == null) {
      locationService
        .createlocation(prepareObj(data))
        .then(() => {
          toast.success("location create successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("fail to create location");
          setSaveLoader(false);
        });
    } else {
      let obj = prepareObj(data);
      obj["created_at"] = props.data.created_at;
      obj["updated_at"] = props.data.updated_at;
      obj["floor_id"] = parseInt(data.floor);
      obj["floor"] = props.data.floor;
      locationService
        .updatelocation(obj, props.data.id)
        .then(() => {
          toast.success("Location updated successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("Fail to update the location");
          setSaveLoader(false);
        });
    }
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewLocation)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/location.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null ? "Add New Location" : "Edit Location"}
            </div>
          </div>
          <button
            className="float-end btn-update-active mr-1 lato-btn"
            disabled={saveLoader}
          >
            {saveLoader ? (
              <img
                src={process.env.PUBLIC_URL + "/images/loader.gif"}
                style={{ width: "15px" }}
              />
            ) : props.data == null ? (
              "Save"
            ) : (
              "Update"
            )}
          </button>
        </div>
      }
      bodyContainer={
        <div className="setting-taskdetail-content" style={{ height: "400px" }}>
          <div className="blank-container"></div>
          <div className="container-fluid row m-0 p-2">
            {propertyList.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="property"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{
                          ...register("property", { required: true }),
                        }}
                        styles={floatLabel.bgWhite}
                        options={propertyList}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : propertyList.filter(
                                (item) => item.value == props.data.property_id
                              )
                        }
                        placeholder="Property"
                        onChange={(val) => {
                          onChange(val.value);
                          getBuildingList(val.value);
                        }}
                      />
                    </>
                  )}
                />
                {errors.property && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please select property
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="building"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{
                        ...register("building", { required: true }),
                      }}
                      styles={floatLabel.bgWhite}
                      options={buildingList}
                      value={selBuilding}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      // defaultValue={
                      //   props.data == null
                      //     ? ""
                      //     : buildingList.filter(
                      //         (item) => item.value == props.data.building_id
                      //       )
                      // }
                      placeholder="Building"
                      onChange={(val) => {
                        onChange(val.value);
                        getFloorList(val.value);
                        setSelBuilding([val]);
                      }}
                    />
                  </>
                )}
              />
              {errors.building && (
                <p className="text-danger pl-1 m-0 lato-error">
                  Please select building
                </p>
              )}
            </div>
            <div className="col p-1 pt-2">
              <Controller
                control={control}
                name="floor"
                render={({ field: { onChange } }) => (
                  <>
                    <Select
                      inputRef={{
                        ...register("floor", { required: true }),
                      }}
                      styles={floatLabel.bgWhite}
                      options={floorList}
                      value={selFloor}
                      // defaultValue={
                      //   props.data == null
                      //     ? ""
                      //     : floorList.filter(
                      //         (item) => item.value == props.data.floor_id
                      //       )
                      // }
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      placeholder="Floor"
                      onChange={(val) => {
                        onChange(val.value);
                        setSelFloor([val]);
                      }}
                    />
                  </>
                )}
              />
              {errors.floor && (
                <p className="text-danger pl-1 m-0 lato-error">
                  Please select building first to select floor
                </p>
              )}
            </div>
            <div className="col p-1 pt-2">
              <InputField
                keyName="name"
                label="Name"
                validation={{ ...register("name", { required: true }) }}
              />
              {errors.name && (
                <p className="text-danger pl-1 m-0 lato-error">
                  Please enter name
                </p>
              )}
            </div>
          </div>
          <div className="container-fluid row m-0 p-2">
            {locationTypeList.length > 0 ? (
              <div className="col-md-3 p-1">
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{ ...register("type") }}
                        styles={floatLabel.bgWhite}
                        options={locationTypeList}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : locationTypeList.filter(
                                (item) => item.value == props.data.type_id
                              )
                        }
                        placeholder="Type"
                        onChange={(val) => onChange(val.value)}
                      />
                    </>
                  )}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-md-6 p-1">
              <InputField
                keyName="description"
                label="Description"
                validation={{
                  ...register("description", { required: true }),
                }}
              />
              {errors.description && (
                <p className="text-danger pl-1 m-0 lato-error">
                  Please enter description
                </p>
              )}
            </div>
            <div className="col-md-3 p-0 position-relative">
              <div className="pl-3 pr-3">
                <label className="checkbox-label">Active</label>
                <div className="row pt-1">
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Enable"
                    value={1}
                    name="status"
                    selected={status}
                    onChange={() => setStatus(1)}
                  />
                  <ButtonCheckBox
                    containerType="simple"
                    className="col m-1 lato-dropdown"
                    label="Disable"
                    value={0}
                    name="status"
                    selected={status}
                    onChange={() => setStatus(0)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default LocationForm;
