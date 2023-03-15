import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FileUpload from "../../../../common/FormElements/FileUpload";
import InputField from "../../../../common/FormElements/InputField";
import Icon from "@material-ui/core/Icon";
import { useEffect } from "react";
import ListService from "../../../../services/list";
import { toast } from "react-toastify";
import equipmentService from "../../../../services/Engineering/equipmentRequest/equipment";
import Select, { components } from "react-select";
import { useAuthState } from "../../../../store/context";
import Multiselect from "multiselect-react-dropdown";
import { useFormContext } from "react-hook-form";
import dateTime from "../../../../helper/dateTime";
import { CustomValueContainer } from "../../../../helper/CustomValueContainer";
import { floatLabel } from "../../../../config/float-label-dropdown";
import { getBase64 } from "../../../../helper/helper";

function CreateEquipment(props) {
  const [filelist, setFilelist] = useState("");
  const [departments, setDepartments] = useState([]);
  const [maintenancelist, setMaintenancelist] = useState([]);
  const [partgrouplist, setPartgrouplist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuslist, setStatuslist] = useState([]);
  const [supplierlist, setSupplierlist] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    purchase_date: new Date(),
    warranty_start: new Date(),
    warranty_end: new Date(),
  });
  const [isOpen, setIsOpen] = useState(false);
  const {
    user: { id, property_id },
  } = useAuthState();
  const asset_group = useRef();
  const part_group = useRef();
  const {
    control,
    formState: { errors },
    register,
    reset,
  } = useFormContext();
  const resetObj = {
    equipment_name: "",
    equipment_id: "",
    bar_code: "",
    department: "",
    primary_location: "",
    life: "",
    secondary_location: "",
    model: "",
    purchase_cost: "",
    manufacturer: "",
    supplier: "",
    description: "",
    critical_flag: false,
    external_flag: false,
  };

  useEffect(() => {
    getDepartments();
    getMaintenancelist();
    getPartgrouplist();
    getGrouplist();
    getLocations();
    getStatuslist();
    getSupplierslist();
    resetValues();
  }, [props.detail]);

  const resetValues = () => {
    if (props.detail === null) {
      reset(resetObj);
    } else {
      reset({
        equipment_name: props.detail.name,
        equipment_id: props.detail.equip_id,
        bar_code: props.detail.barcode,
        department: props?.detail?.dept_id,
        primary_location: props.detail.location_group_member_id,
        life: props.detail.life,
        secondary_location: props.detail.sec_loc_id,
        model: props.detail.model,
        purchase_cost: props.detail.purchase_cost,
        manufacturer: props.detail.manufacture,
        supplier: props.detail.supplier_id,
        description: props.detail.description,
        critical_flag: props.detail.critical_flag == 1,
        external_flag: props.detail.external_maintenance == 1,
        status: props.detail.status_id,
        life_unit: props.detail.life_unit,
      });
      getOldImage();
      setSelectedDate({
        purchase_date: new Date(props.detail.purchase_date),
        warranty_start: new Date(props.detail.warranty_start),
        warranty_end: new Date(props.detail.warranty_end),
      });
    }
  };

  const getOldImage = () => {
    if (props?.detail?.image_url != "/uploads/equip/default.png")
      equipmentService
        .getimage(props.detail.image_url)
        .then((res) => setFilelist(res));
  };

  useEffect(() => {
    if (props.submitflag) makeCall();
  }, [props.submitflag]);

  const getDepartments = () => {
    ListService.departmentList().then((res) => setDepartments(res));
  };

  const getMaintenancelist = () => {
    equipmentService
      .getmaintenancelist("")
      .then((res) => setMaintenancelist(res));
  };

  const getPartgrouplist = () => {
    equipmentService
      .getequipmentpartgrouplist("")
      .then((res) => setPartgrouplist(res));
  };

  const getGrouplist = () => {
    equipmentService.getgrouplist("").then((res) => setGrouplist(res));
  };

  const getLocations = () => {
    ListService.getlocationlist(property_id).then((res) => setLocations(res));
  };

  const getStatuslist = () => {
    ListService.equipstatuslist().then((res) => setStatuslist(res));
  };

  const getSupplierslist = () => {
    equipmentService.getsupplierlist("").then((res) => setSupplierlist(res));
  };

  const makeCall = () => {
    let obj = prepareObj(props.data);
    if (props.create)
      equipmentService.createequipment(obj).then((res) => {
        if (res.length == 0) toast.error("equipment already created");
        else toast.success("equipment created successfully");
        props.reset();
      });
    else
      equipmentService.updateequipment(obj).then((res) => {
        if (res.length == 0) toast.error("equipment already updated");
        else toast.success("equipment updated successfully");
        props.reset();
      });
  };

  const prepareObj = (data) => {
    if (props.create)
      var obj = {
        location_name: 11,
        location_type: "Floor",
        department: "Concierge",
        group_name: "rdfcr",
        part_group_id: 5,
        part_group_name: "fvf",
        sec_location_name: 11,
        sec_location_type: "Floor",
        supplier: "dferdf",
      };
    else var obj = { ...props.detail };
    obj["barcode"] = data.bar_code;
    obj["critical_flag"] = data.critical_flag;
    obj["dept_id"] = data.department;
    obj["description"] = data.description;
    obj["equip_id"] = data.equipment_id;
    obj["equipment_group"] = asset_group.current?.state?.selectedValues?.map(
      (item) => {
        return { equip_group_id: item.id, name: item.name };
      }
    );
    obj["external_maintenance"] = data.external_flag;
    obj["image_src"] = filelist;
    obj["image_url"] =
      filelist.length > 0
        ? dateTime().timestamp + "." + filelist?.split(";")[0].split("/")[1]
        : "";
    obj["life"] = data.life;
    obj["life_unit"] = data.life_unit;
    obj["location_group_member_id"] = data.primary_location;
    obj["manufacture"] = data.manufacturer;
    obj["model"] = data.model;
    obj["name"] = data.equipment_name;
    obj["part_group"] = part_group.current?.state?.selectedValues?.map(
      (item) => {
        return { part_group_id: item.id, name: item.name, type: item.type };
      }
    );
    obj["property_id"] = property_id;
    obj["purchase_cost"] = data.purchase_cost;
    obj["purchase_date"] = selectedDate.purchase_date;
    obj["sec_loc_id"] = data.secondary_location;
    obj["status_id"] = data.status == undefined ? 2 : data.status;
    obj["supplier_id"] = data.supplier;
    obj["warranty_end"] = selectedDate.warranty_end;
    obj["warranty_start"] = selectedDate.warranty_start;
    obj["external_maintenance_id"] = data.maintenance_company;
    return obj;
  };

  const handleDateChange = (date, value) => {
    setSelectedDate((p) => {
      let obj = p;
      obj[value] = date;
      return { ...obj };
    });
  };
  return (
    <div>
      <div className="blank-container"></div>
      <div className="container-fluid row m-0 p-2">
        <div className="col p-2">
          <InputField
            keyName="equipment_name"
            label="Equipment Name"
            validation={{
              ...register("equipment_name", { required: true }),
            }}
          />
          {errors?.equipment_name && (
            <p className="text-danger export-excel">
              Please enter equipment name
            </p>
          )}
        </div>
        <div className="col p-2">
          <InputField
            keyName="equipment_id"
            label="Equipment ID"
            validation={{
              ...register("equipment_id", { required: true }),
            }}
          />
          {errors?.equipment_id && (
            <p className="text-danger export-excel">
              Please enter equipment id
            </p>
          )}
        </div>
        <div className="col p-2">
          <InputField
            keyName="bar_code"
            label="Serial/Bar code"
            validation={{ ...register("bar_code") }}
          />
        </div>
        <div className="col p-2">
          <Controller
            control={control}
            name="department"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("department") }}
                  styles={floatLabel.bgWhite}
                  options={departments.map((item) => {
                    return { value: item.id, label: item.department };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Department"
                  defaultValue={
                    props?.detail?.department
                      ? {
                          value: props?.detail?.dept_id,
                          label: props?.detail?.department,
                        }
                      : ""
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="container-fluid row m-0 p-2">
        <div className="col-md-3 p-2">
          <Controller
            control={control}
            name="primary_location"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("primary_location") }}
                  styles={floatLabel.bgWhite}
                  options={locations?.map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Primary Location"
                  defaultValue={
                    props?.detail?.location_name
                      ? {
                          value: props?.detail?.location_group_member_id,
                          label: props?.detail?.location_name,
                        }
                      : ""
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="blank-container"></div>
      <div className="container-fluid row m-0 p-2">
        <div className="col p-2 row align-items-center">
          <div
            className="col-auto lato-canvas-content"
            style={{ color: "#878798" }}
          >
            Critical Flag
          </div>
          <div className="col-auto pb-1">
            <label className="custom-toggle m-0">
              <input type="checkbox" {...register("critical_flag")} />
              <span className="custom-slider round"></span>
            </label>
          </div>
        </div>
        <div className="col p-2 row align-items-center">
          <div
            className="col-auto lato-canvas-content"
            style={{ color: "#878798" }}
          >
            External Maintenance
          </div>
          <div className="col-auto pb-1">
            <label className="custom-toggle m-0">
              <input type="checkbox" {...register("external_flag")} />
              <span className="custom-slider round"></span>
            </label>
          </div>
        </div>
        <div className="col-md-3 p-2">
          <InputField
            keyName="life"
            label="Life"
            validation={{ ...register("life") }}
          />
        </div>
        <div className="col-md-3 p-2">
          <Controller
            control={control}
            name="life_unit"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("life_unit") }}
                  styles={floatLabel.bgWhite}
                  options={[
                    { value: "days", label: "days" },
                    { value: "months", label: "months" },
                    { value: "years", label: "years" },
                  ]}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Life unit"
                  defaultValue={
                    props?.detail?.life_unit
                      ? {
                          value: props?.detail?.life_unit,
                          label: props?.detail?.life_unit,
                        }
                      : { value: "days", label: "days" }
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="container-fluid row m-0 p-2">
        <div className="col-md-3 p-2">
          <Controller
            control={control}
            name="secondary_location"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("secondary_location") }}
                  styles={floatLabel.bgWhite}
                  options={locations?.map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Secondary Location"
                  defaultValue={
                    props?.detail?.sec_location_name
                      ? {
                          value: props?.detail?.sec_loc_id,
                          label: props?.detail?.sec_location_name,
                        }
                      : ""
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
        <div className="col p-2">
          <InputField
            keyName="model"
            label="Model"
            validation={{ ...register("model") }}
          />
        </div>
        <div className="col p-2">
          <InputField
            type="number"
            keyName="purchase_cost"
            label="Purchase Cost"
            validation={{ ...register("purchase_cost") }}
          />
        </div>
        <div className="col p-2">
          <Multiselect
            customCloseIcon={<i className="fas fa-times ml-2"></i>}
            displayValue="name"
            placeholder="Asset Group"
            options={grouplist}
            selectedValues={
              props.detail?.equipment_group ? props.detail.equipment_group : []
            }
            ref={asset_group}
            style={{
              searchBox: {
                border: "2px solid #f1f1f1",
              },
              chips: {
                background: "#0B8376",
                borderRadius: "5px",
              },
              highlightOption: {
                background: "#0B8376",
              },
              highlight: {
                background: "#0B8376",
              },
            }}
          />
        </div>
      </div>
      <div className="container-fluid row m-0 p-2">
        <div className="col p-2">
          <div className="label-float" style={{ padding: "3px" }}>
            <label
              className={selectedDate.purchase_date == null ? "" : "floatup"}
            >
              Purchase Date
            </label>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                InputProps={{ readOnly: true }}
                value={selectedDate?.purchase_date}
                onChange={(date) => handleDateChange(date, "purchase_date")}
                format="dd/MM/yyyy"
                keyboardIcon={
                  <Icon>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                      width="18px"
                    />
                  </Icon>
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div className="col p-2">
          <div className="label-float" style={{ padding: "3px" }}>
            <label
              className={selectedDate.warranty_start == null ? "" : "floatup"}
            >
              Warranty Starts
            </label>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                InputProps={{ readOnly: true }}
                value={selectedDate?.warranty_start}
                onChange={(date) => handleDateChange(date, "warranty_start")}
                format="dd/MM/yyyy"
                keyboardIcon={
                  <Icon>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                      width="18px"
                    />
                  </Icon>
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div className="col p-2">
          <div className="label-float" style={{ padding: "3px" }}>
            <label
              className={selectedDate.warranty_end == null ? "" : "floatup"}
            >
              Warranty Ends
            </label>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                InputProps={{ readOnly: true }}
                value={selectedDate?.warranty_end}
                onChange={(date) => handleDateChange(date, "warranty_end")}
                format="dd/MM/yyyy"
                keyboardIcon={
                  <Icon>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/grey-calendar.svg`}
                      width="18px"
                    />
                  </Icon>
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div className="col p-2">
          <Multiselect
            customCloseIcon={<i className="fas fa-times ml-2"></i>}
            displayValue="name"
            placeholder="Part Group"
            options={partgrouplist}
            selectedValues={
              props.detail?.part_group ? props.detail.part_group : []
            }
            ref={part_group}
            style={{
              searchBox: {
                border: "2px solid #f1f1f1",
              },
              chips: {
                background: "#0B8376",
                borderRadius: "5px",
              },
              highlightOption: {
                background: "#0B8376",
              },
              highlight: {
                background: "#0B8376",
              },
            }}
          />
        </div>
      </div>
      <div className="container-fluid row m-0 p-2">
        <div className="col p-2">
          <InputField
            keyName="manufacturer"
            label="Manufacturer"
            validation={{ ...register("manufacturer") }}
          />
        </div>
        <div className="col p-2">
          <Controller
            control={control}
            name="supplier"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("supplier") }}
                  styles={floatLabel.bgWhite}
                  options={supplierlist?.map((item) => {
                    return { value: item.id, label: item.supplier };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Supplier"
                  defaultValue={
                    props?.detail?.supplier
                      ? {
                          value: props?.detail?.supplier_id,
                          label: props?.detail?.supplier,
                        }
                      : ""
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
        <div className="col p-2">
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("status") }}
                  styles={floatLabel.bgWhite}
                  options={statuslist?.map((item) => {
                    return { value: item.id, label: item.status };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Status"
                  defaultValue={
                    props?.detail?.status
                      ? {
                          value: props?.detail?.status_id,
                          label: props?.detail?.status,
                        }
                      : { value: 2, label: "OK" }
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
        <div className="col p-2">
          <Controller
            control={control}
            name="maintenance_company"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("maintenance_company") }}
                  styles={floatLabel.bgWhite}
                  options={maintenancelist?.map((item) => {
                    return { value: item.id, label: item.external_maintenance };
                  })}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Maintenance Company"
                  defaultValue={
                    props?.detail?.external_maintenance_company
                      ? {
                          value: props?.detail?.external_maintenance_id,
                          label: props?.detail?.external_maintenance_company,
                        }
                      : ""
                  }
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="container-fluid row m-0 p-2">
        <div className="col-md-6 p-2">
          <InputField
            keyName="description"
            label="Description"
            validation={{ ...register("description") }}
          />
        </div>
      </div>
      <div className="blank-container"></div>
      <div className="container-fluid row m-0 p-2">
        <div className="pl-3 pb-3 pt-2">
          <label> Photos </label>
        </div>
        <div className="form-group row pt-0">
          {filelist ? (
            <div
              style={{ color: "#21BFAE" }}
              className="col-auto image-container mt-2 pl-1 pr-1"
            >
              <img src={filelist} alt="" className="display-image" />
              <i
                className="fas fa-times-circle text-danger img-delete float-right"
                onClick={() => setFilelist("")}
              ></i>
            </div>
          ) : (
            ""
          )}
          <div className="col-auto image-container mt-2 pl-1 pr-1">
            <FileUpload
              keyName="files"
              className="file-upload-btn"
              title={
                <>
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/upload-image-icon.svg"
                    }
                    alt="service"
                    style={{ width: "40px" }}
                  />
                  <div className="mt-3 lato-input">Upload Image</div>
                </>
              }
              onChange={(e) =>
                getBase64(e.target.files[0]).then((res) => setFilelist(res))
              }
            />
          </div>
        </div>
      </div>
      <div className="blank-container"></div>
    </div>
  );
}

export default CreateEquipment;
