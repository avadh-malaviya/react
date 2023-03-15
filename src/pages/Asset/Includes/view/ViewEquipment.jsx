import React, { useState } from "react";
import { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import FileUpload from "../../../../common/FormElements/FileUpload";
import { baseUrl } from "../../../../config/app";
import dateTime from "../../../../helper/dateTime";
import equipmentService from "../../../../services/Engineering/equipmentRequest/equipment";

function ViewEquipment(props) {
  const [filelist, setFilelist] = useState([]);

  useEffect(() => {
    oldFileList();
  }, [props.equipment]);

  const removeFile = (i) => {
    equipmentService.equipmentinfiledel({ id: i }).then(() => {
      toast.success("File deleted successfully");
      oldFileList();
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0].size <= 10000000) {
      let obj = new FormData();
      obj.append("equip_id", props.equipment.id);
      obj.append("files[0]", e.target.files[0]);
      obj.append("filename", "testing");
      obj.append("filename", "testing");
      equipmentService.createequipfile(obj).then(() => {
        oldFileList();
        toast.success("File uploaded successfully");
      });
    } else {
      toast.error("Please upload file less then or equals to 10MB");
    }
  };

  const oldFileList = () => {
    if (props.equipment.id) {
      let obj = { equip_id: props?.equipment?.id };
      equipmentService
        .getequipmentinformlist(obj)
        .then((res) => setFilelist(res.filelist));
    }
  };

  return (
    <div>
      <div className="row container-fluid m-0 p-2">
        <div className="col-sm-3 bdr-right pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/hastag-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Equipment ID</label>
              <div className="lato-input">{props.equipment.equip_id}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 bdr-right pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/barcode-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Serial/Bar code</label>
              <div className="lato-input">{props.equipment.barcode}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 bdr-right pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/category-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Department</label>
              <div className="lato-input">{props.equipment.department}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/location-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Primary location</label>
              <div className="lato-input">{props.equipment.location_name}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="blank-container"></div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/warning-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Critical Flag</label>
              <div className="lato-input">
                {props.equipment.critical_flag == 0 ? "No" : "Yes"}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/external-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>External Maintance</label>
              <div className="lato-input">
                {props.equipment.external_maintenance == 0 ? "No" : "Yes"}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/clock-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Life</label>
              <div className="lato-input">
                {props.equipment.life + " " + props.equipment.life_unit}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/location-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Secondary Location</label>
              <div className="lato-input">
                {props.equipment.sec_location_name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/modelbox-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Model </label>
              <div className="lato-input">{props.equipment.model}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/coins-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Purchase Cost</label>
              <div className="lato-input">
                $ {props.equipment.purchase_cost}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/calendar-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Purchase Date</label>
              <div className="lato-input">
                {dateTime(props.equipment.purchase_date).dateMonthYear}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/camera-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Asset Group</label>
              <div className="lato-input">
                {props.equipment?.equipment_group?.map((item, i) => {
                  if (i + 1 == props.equipment.equipment_group.length)
                    return item.name;
                  else return item.name + ",";
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/calendar-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Warranty Starts </label>
              <div className="lato-input">
                {dateTime(props.equipment.warranty_start).dateMonthYear}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/calendar-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Warranty Ends</label>
              <div className="lato-input">
                {dateTime(props.equipment.warranty_end).dateMonthYear}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/calendar-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Maintenance Date</label>
              <div className="lato-input">
                {dateTime(props.equipment.maintenance_date).dateMonthYear}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/camera-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Part Group</label>
              <div className="lato-input">
                {props.equipment?.part_group?.map((item, i) => {
                  if (i + 1 == props.equipment.part_group.length)
                    return item.name;
                  else return item.name + ",";
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/factory-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Manufacturer</label>
              <div className="lato-input">{props.equipment.manufacture}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 pl-3 bdr-right">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/box-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Supplier</label>
              <div className="lato-input">{props.equipment.supplier}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="col-sm-12 pl-3">
          <div className="form-group row align-items-start">
            <div className="col-auto">
              <img
                src={`${process.env.PUBLIC_URL}/images/form-icons/note-icon.svg`}
              />
            </div>
            <div className="col-auto p-0">
              <label>Description</label>
              <div className="lato-input">{props.equipment.description}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row container-fluid m-0 p-2 bdr-bottom">
        <div className="form-group pl-3">
          <label>Photos</label>
          {props.equipment.image_url != "/uploads/equip/default.png" ? (
            <div
              style={{ color: "#21BFAE" }}
              className="col-auto image-container mt-2 pl-1 pr-1"
            >
              <img
                src={baseUrl + props.equipment.image_url}
                alt=""
                className="display-image"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="blank-container"></div>
      <div>
        <Tabs defaultActiveKey="request" id="uncontrolled-tab-example">
          <Tab
            eventKey="request"
            title={<span className="lato-sub-tab">Work History </span>}
            className="bdr-right"
          ></Tab>
          <Tab
            eventKey="notification"
            title={<span className="lato-sub-tab"> Files </span>}
            className="bdr-right"
          >
            <div className="row p-2 container-fluid m-0">
              <div className="form-group row pt-0">
                {filelist?.map((elem, i) => {
                  return (
                    <div
                      style={{ color: "#21BFAE" }}
                      key={i}
                      className="col-auto image-container mt-2 pl-1 pr-1"
                    >
                      <img
                        src={baseUrl + elem.path}
                        alt=""
                        className="display-image"
                      />
                      <i
                        className="fas fa-times-circle text-danger img-delete float-right"
                        onClick={() => removeFile(elem.id)}
                      ></i>
                    </div>
                  );
                })}
                <div className="col-auto image-container mt-2 pl-1 pr-1">
                  <FileUpload
                    keyName="files"
                    className="file-upload-btn"
                    title={
                      <>
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/images/upload-image-icon.svg"
                          }
                          alt="service"
                          style={{ width: "40px" }}
                        />
                        <div className="mt-3 lato-input">Upload Image</div>
                      </>
                    }
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="chat"
            title={<span className="lato-sub-tab">Work Order</span>}
          ></Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewEquipment;
