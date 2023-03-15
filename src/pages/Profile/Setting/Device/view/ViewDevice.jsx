import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmBox from "../../../../../common/Modals/ConfirmBox";
import ModalOffcanvas from "../../../../../common/Modals/ModalOffcanvas";
import deviceService from "../../../../../services/guestservice/settings/device/device";

function ViewDevice(props) {
  const [deleteFlag, setDeleteFlag] = useState(false);

  const deleteDevice = () => {
    deviceService
      .deletedevice(props.data.id)
      .then(() => {
        toast.success("Device deleted successfully");
        setDeleteFlag(false);
        props.reset();
        props.handleClose();
      })
      .catch(() => toast.error("Fail to delete Device"));
  };

  const updateDevice = () => {
    props.handleClose();
    props.trfcall();
  };

  return (
    <ModalOffcanvas
      {...props}
      headerContainer={
        <div style={{ flexBasis: "98%" }}>
          <div className="row align-items-center float-start">
            <img
              src={process.env.PUBLIC_URL + "/images/device.svg"}
              className="ml-2 col-auto"
              style={{ width: "50px" }}
            />
            <div className="lato-canvas-title col-auto mb-0">
              Device Name here
            </div>
          </div>
          <img
            src={process.env.PUBLIC_URL + "/images/general-icons/bin-red.svg"}
            className="float-end m-1 ml-2"
            onClick={() => setDeleteFlag(true)}
          />
          <img
            src={
              process.env.PUBLIC_URL + "/images/general-icons/update-green.svg"
            }
            className="float-end m-1"
            onClick={updateDevice}
          />
        </div>
      }
      bodyContainer={
        <div className="guestservice-canvas">
          <div className="blank-container"></div>
          <div className="guestservice-devicedetail-content">
            <div className="row container-fluid m-0 p-2 bdr-bottom">
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="hashtag-icon">ID</label>
                  <div className="lato-input">{props.data.id}</div>
                </div>
              </div>
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="device2-icon">Name</label>
                  <div className="lato-input">{props.data.name}</div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="category-icon">Department Function</label>
                  <div className="lato-input">{props.data.function}</div>
                </div>
              </div>
            </div>
            <div className="row container-fluid m-0 p-2 bdr-bottom">
              <div className="col bdr-right">
                <div className="form-group">
                  <label className="category-icon">
                    Secondary Department Function
                  </label>
                  <div className="lato-input">{props.data.sec_function}</div>
                </div>
              </div>
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="category-icon">Type</label>
                  <div className="lato-input">{props.data.type}</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="hashtag-icon">Number</label>
                  <div className="lato-input">{props.data.number}</div>
                </div>
              </div>
            </div>
            <div className="row container-fluid m-0 p-2 bdr-bottom">
              <div className="col bdr-right">
                <div className="form-group">
                  <label className="location-icon">Location Group</label>
                  <div className="lato-input">{props.data.loc_name}</div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="location-icon">
                    Secondary Location Group
                  </label>
                  <div className="lato-input">{props.data.sec_loc_name}</div>
                </div>
              </div>
            </div>
            <div className="row container-fluid m-0 p-2 bdr-bottom">
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="building-icon">Building</label>
                  <div className="lato-input">{props.data.cb_name}</div>
                </div>
              </div>
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="device2-icon">Device ID</label>
                  <div className="lato-input">{props.data.device_id}</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="device2-icon">Device User</label>
                  <div className="lato-input">{props.data.device_user}</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="device2-icon">Device Name</label>
                  <div className="lato-input">{props.data.device_name}</div>
                </div>
              </div>
            </div>
            <div className="row container-fluid m-0 p-2 bdr-bottom">
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="device2-icon">Device API Level</label>
                  <div className="lato-input">
                    {props.data.device_api_level}
                  </div>
                </div>
              </div>
              <div className="col-sm-3 bdr-right">
                <div className="form-group">
                  <label className="device2-icon">OS</label>
                  <div className="lato-input">{props.data.device_os}</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="device2-icon">Device Manufacturer</label>
                  <div className="lato-input">
                    {props.data.device_manufacturer}
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="device2-icon">Device Model</label>
                  <div className="lato-input">{props.data.device_model}</div>
                </div>
              </div>
            </div>
          </div>
          <ConfirmBox
            show={deleteFlag}
            onHide={() => setDeleteFlag(false)}
            ondelete={deleteDevice}
          />
        </div>
      }
    />
  );
}

export default ViewDevice;
