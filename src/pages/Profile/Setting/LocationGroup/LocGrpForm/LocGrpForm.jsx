import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import InputField from "../../../../../common/FormElements/InputField";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import locationGrpService from "../../../../../services/guestservice/settings/locationgroup/locationgroup";
import ListService from "../../../../../services/list";

function LocGrpForm(props) {
  const [clientList, setClientList] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const resetObj = {
    client: "",
    description: "",
    group_name: "",
  };

  useEffect(() => {
    getClietList();
  }, []);

  useEffect(() => {
    if (props.show) {
      setSaveLoader(false);
      if (props.data == null) reset(resetObj);
      else
        reset({
          client: props.data.client_id,
          description: props.data.description,
          group_name: props.data.name,
        });
    }
  }, [props.show]);

  const getClietList = () => {
    ListService.getclientlist()
      .then((res) =>
        setClientList(
          res.map((item) => {
            return { value: item.id, label: item.name };
          })
        )
      )
      .catch(() => toast.error("fail to fetch cliet list"));
  };

  const prepareObj = (data) => {
    let obj = {
      client_id: data.client,
      description: data.description,
      id: props.data == null ? -1 : props.data.id,
      name: data.group_name,
    };
    return obj;
  };

  const createNewLocGrp = (data) => {
    setSaveLoader(true);
    console.log("create location group data", prepareObj(data));
    if (props.data == null) {
      locationGrpService
        .createlocationgrp(prepareObj(data))
        .then(() => {
          toast.success("Location group create successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("Fail to creaet Location group");
          setSaveLoader(false);
        });
    } else {
      locationGrpService
        .updatelocgrp(prepareObj(data), props.data.id)
        .then(() => {
          toast.success("Location group updated successfully");
          setSaveLoader(false);
          props.reset();
          props.handleClose();
        })
        .catch(() => {
          toast.error("Fail to update Location group");
          setSaveLoader(false);
        });
    }
  };

  return (
    <ModalOffcanvas
      {...props}
      handlesubmit={handleSubmit(createNewLocGrp)}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/location.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              {props.data == null
                ? "Add New Location Group"
                : "Edit Location Group"}
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
            {clientList.length > 0 ? (
              <div className="col p-1 pt-2">
                <Controller
                  control={control}
                  name="client"
                  render={({ field: { onChange } }) => (
                    <>
                      <Select
                        inputRef={{
                          ...register("client", { required: true }),
                        }}
                        styles={floatLabel.bgWhite}
                        options={clientList}
                        components={{
                          ValueContainer: CustomValueContainer,
                        }}
                        defaultValue={
                          props.data == null
                            ? ""
                            : clientList.filter(
                                (item) => item.value == props.data.client_id
                              )
                        }
                        placeholder="Client"
                        onChange={(val) => {
                          onChange(val.value);
                        }}
                      />
                    </>
                  )}
                />
                {errors.client && (
                  <p className="text-danger pl-1 m-0 lato-error">
                    Please select client
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
            <div className="col p-1 pt-2">
              <InputField
                keyName="group_name"
                label="Group Name"
                validation={{ ...register("group_name", { required: true }) }}
              />
            </div>
            <div className="col-md-6 p-1 pt-2">
              <InputField
                keyName="description"
                label="Description"
                validation={{ ...register("description", { required: true }) }}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

export default LocGrpForm;
