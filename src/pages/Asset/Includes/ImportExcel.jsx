import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import FileUpload from "../../../common/FormElements/FileUpload";
import { baseUrl } from "../../../config/app";
import { getBase64 } from "../../../helper/helper";
import equipmentService from "../../../services/Engineering/equipmentRequest/equipment";

function ImportExcel(props) {
  const [filelist, setFilelist] = useState(null);

  useEffect(() => {
    setFilelist(null);
  }, [props.show]);

  const handleFileChange = (e) => {
    if (
      e.target.files[0].type ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      setFilelist(e.target.files[0]);
    else toast.error("Please upload excel file with .xlsx extention");
  };

  const createEquipment = () => {
    if (filelist != null) {
      let obj = {
        exceltype: filelist.type,
        name: filelist.name,
      };
      getBase64(filelist)
        .then((res) => {
          obj["src"] = res;
          equipmentService
            .importexcel(obj)
            .then(() => {
              toast.success("file imported successfully");
              props.onHide();
            })
            .catch(() => toast.error("Fail to add equipment"));
        })
        .catch(() => toast.error("error in convertion to base64"));
    } else {
      toast.error("Please upload file");
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Upload Excel for Equipment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <FileUpload
              keyName="files"
              style={{}}
              className="mt-2 btn-update lato-submit col-3 p-3 text-center"
              title="Upload File"
              onChange={(e) => handleFileChange(e)}
              multiple
            />
            <span className="ml-4">{filelist?.name && filelist?.name}</span>
            <br />
            <a href={baseUrl + "/uploads/equip/sample.xlsx"}>
              Click to download sample templete
            </a>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            className="btn-green"
            onClick={createEquipment}
            disabled={filelist == null}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ImportExcel;
