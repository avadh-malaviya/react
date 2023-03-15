import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmBox from "../../../common/Modals/ConfirmBox";
import ModalOffcanvas from "../../../common/Modals/ModalOffcanvas";
import equipmentService from "../../../services/Engineering/equipmentRequest/equipment";
import CreateEquipment from "./create/CreateEquipment";
import ViewEquipment from "./view/ViewEquipment";

function EquipmentDetail(props) {
  const [loader, setLoader] = useState(false);
  const [editflag, setEditflag] = useState(false);
  const [createflag, setCreateflag] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [formdata, setFormdata] = useState({});
  const methods = useForm();

  useEffect(() => {
    setLoader(false);
    setEditflag(false);
    if (props.create) setCreateflag(true);
    else setCreateflag(false);
  }, [props.show, props.create]);

  const showCreate = (e) => {
    e.preventDefault();
    setCreateflag(true);
  };

  const removeEquip = () => {
    equipmentService.equipmentdelete({ id: props.equipment.id }).then(() => {
      toast.success("record successfully deleted");
      setDeleteFlag(false);
      props.reset();
      props.handleClose();
    });
  };

  const makeCall = (data) => {
    setLoader(true);
    setFormdata(data);
    setSubmitFlag(true);
  };

  const resetData = () => {
    setLoader(false);
    setSubmitFlag(false);
    setCreateflag(false);
    setFormdata({});
    props.reset();
    props.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <ModalOffcanvas
        {...props}
        handlesubmit={methods.handleSubmit(makeCall)}
        headerContainer={
          <div style={{ flexBasis: "98%" }}>
            {createflag ? (
              <div className="row align-items-center float-start">
                <img
                  src={process.env.PUBLIC_URL + "/images/attached-files.svg"}
                  className="ml-2"
                  style={{ width: "40px" }}
                />
                <div className="col-auto lato-canvas-title mb-0">
                  Add New Equipment
                </div>
              </div>
            ) : (
              <>
                <div className="float-start pt-1 pl-2 lato-canvas-title">
                  {props.equipment.name}
                </div>
                <div className="float-start ml-4">
                  <span
                    className={`fill-badge ${props?.equipment?.status?.toLowerCase()}`}
                  >
                    {props.equipment.status}
                  </span>
                </div>
              </>
            )}
            {createflag || editflag ? (
              <button
                disabled={loader}
                type="submit"
                className={`float-end mr-1 lato-btn btn-update-active ${
                  loader ? "opacity-50" : ""
                }`}
              >
                {loader ? (
                  <img
                    src={process.env.PUBLIC_URL + "/images/loader.gif"}
                    alt="loader"
                    width="25px"
                  />
                ) : (
                  "Save"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={showCreate}
                className="float-end mr-1 lato-btn btn-update"
              >
                Create Work Order
              </button>
            )}
            {editflag || createflag ? (
              ""
            ) : (
              <>
                <button
                  type="button"
                  className="float-end btn-delete"
                  onClick={() => setDeleteFlag(true)}
                >
                  Remove Item
                </button>
                <button
                  type="button"
                  className="float-end btn-delete"
                  onClick={() => setEditflag(true)}
                >
                  Edit Item
                </button>
              </>
            )}
          </div>
        }
        bodyContainer={
          editflag ? (
            <CreateEquipment
              detail={props.equipment}
              submitflag={submitFlag}
              reset={resetData}
              data={formdata}
              create={createflag}
            />
          ) : createflag ? (
            <CreateEquipment
              detail={null}
              submitflag={submitFlag}
              reset={resetData}
              data={formdata}
              create={createflag}
            />
          ) : (
            <ViewEquipment equipment={props.equipment} />
          )
        }
      />
      <ConfirmBox
        show={deleteFlag}
        onHide={() => setDeleteFlag(false)}
        ondelete={removeEquip}
      />
    </FormProvider>
  );
}

export default EquipmentDetail;
