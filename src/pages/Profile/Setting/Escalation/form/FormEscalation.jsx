import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { floatLabel } from "../../../../../config/float-label-dropdown";
import { CustomValueContainer } from "../../../../../helper/CustomValueContainer";
import Select from "react-select";
import { toast } from "react-toastify";
import InputField from "../../../../../common/FormElements/InputField";
import Multiselect from "multiselect-react-dropdown";
import ListService from "../../../../../services/list";
import { useEffect } from "react";

function FormEscalation(props) {
  const [selEscalation, setSelEscalation] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const notifyOpt = [{ text: "Email" }, { text: "SMS" }, { text: "Mobile" }];
  const [notifyType, setNotifyType] = useState([notifyOpt[0]]);
  const [selJobRole, setSelJobRole] = useState([]);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const resetObj = {
    duration: 10,
    job_role: 1,
    type: 0,
  };

  useEffect(() => {
    getJobRole();
    reset(resetObj);
  }, []);

  useEffect(() => {
    if (props.data == null) resetValue();
  }, [props.data]);

  const resetValue = () => {
    setSaveLoader(false);
    setSelEscalation([]);
  };

  const getJobRole = () => {
    ListService.getjobrolelist()
      .then((res) => {
        setJobRoles(res);
        setSelJobRole([res[0]]);
      })
      .catch(() => toast.error("fail to fetch job role"));
  };

  const addEscalation = (data) => {
    setSelEscalation((p) => {
      if (p.length == 5) {
        toast.error("maximum 5 level can be added under one head");
        return [...p];
      }
      return [
        ...p,
        {
          ...prepareObj({ ...data, level: p.length + 1 }),
        },
      ];
    });
    reset(resetObj);
    setNotifyType([notifyOpt[0]]);
  };

  const prepareObj = (data) => {
    let obj = {
      device_type: data.type,
      // escalation_group: 29,  // it's for the department id
      id: 0,
      // job_role: " Marketing Coordinator",
      job_role: selJobRole,
      job_role_id: data.job_role,
      level: data.level,
      max_time: data.duration,
      notify_list: notifyType,
      notify_type: "",
    };
    return obj;
  };

  const removeEscalation = (i) => {
    setSelEscalation((p) => {
      let arr = p;
      arr.splice(i, 1);
      return [...arr];
    });
  };

  const typeOpt = [
    { value: 0, label: "User" },
    { value: 1, label: "Device" },
    { value: 2, label: "Roster" },
  ];

  const createEscalation = () => {
    console.log("create escalation data =>", selEscalation);
  };

  return (
    <form onSubmit={handleSubmit(addEscalation)}>
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
            type="button"
            className={`float-end ${
              selEscalation.length == 0 || saveLoader
                ? "btn-update"
                : "btn-update-active"
            } mr-1 lato-btn`}
            onClick={createEscalation}
            disabled={selEscalation.length == 0 || saveLoader}
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
        <div className="col-md-4 p-1 pt-2">
          <InputField
            keyName="heading"
            label="Escalation Heading"
            validation={{ ...register("heading", { required: true }) }}
          />
        </div>
      </div>
      {/* selected selected Values */}
      {selEscalation.length > 0
        ? selEscalation.map((item, i) => {
            return (
              <>
                {console.log(item.level)}
                <div className="container-fluid row m-0 p-2 bdr-bottom">
                  <div className="col-md-2 p-1">
                    <Multiselect
                      customCloseIcon={<i className="fas fa-times ml-2"></i>}
                      displayValue="job_role"
                      placeholder="Job Role"
                      options={jobRoles}
                      selectedValues={item.job_role}
                      style={floatLabel.multiSelect}
                      disable={true}
                    />
                    {/* <Controller
                      control={control}
                      name="job_role"
                      render={({ field: { onChange } }) => (
                        <>
                          <Select
                            styles={floatLabel.bgWhite}
                            options={jobRoles}
                            value={jobRoles.filter(
                              (val) => val.value == item.job_role_id
                            )}
                            components={{
                              ValueContainer: CustomValueContainer,
                            }}
                            placeholder="Select Job Role"
                            onChange={(val) => onChange(val.value)}
                            isDisabled={true}
                          />
                        </>
                      )}
                    /> */}
                  </div>
                  <div className="col-md-2 p-1">
                    <Controller
                      control={control}
                      name="type"
                      render={({ field: { onChange } }) => (
                        <>
                          <Select
                            styles={floatLabel.bgWhite}
                            options={typeOpt}
                            value={typeOpt.filter(
                              (val) => val.value == item.device_type
                            )}
                            components={{
                              ValueContainer: CustomValueContainer,
                            }}
                            placeholder="Type"
                            onChange={(val) => onChange(val.value)}
                            isDisabled={true}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="col-sm-5 p-1">
                    <div className="col">
                      <Multiselect
                        customCloseIcon={<i className="fas fa-times ml-2"></i>}
                        displayValue="text"
                        placeholder="Notification Type"
                        options={notifyOpt}
                        selectedValues={item.notify_list}
                        style={floatLabel.multiSelect}
                        disable={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 p-1">
                    <InputField
                      keyName="duration"
                      label="Duration"
                      value={item.max_time}
                      disabled
                    />
                  </div>
                  <div className="col-md-1 p-1 text-center">
                    <button
                      type="button"
                      className="bg-white border-0"
                      onClick={() => removeEscalation(i)}
                    >
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/images/general-icons/minusbox.svg"
                        }
                        className="m-1"
                      />
                    </button>
                  </div>
                </div>
              </>
            );
          })
        : ""}
      <div className="container-fluid row m-0 p-2 bdr-bottom">
        {jobRoles.length > 0 ? (
          <div className="col-md-2 p-1">
            <Multiselect
              customCloseIcon={<i className="fas fa-times ml-2"></i>}
              displayValue="job_role"
              placeholder="Job Role"
              options={jobRoles}
              selectedValues={selJobRole}
              onSelect={(list) => setSelJobRole(list)}
              onRemove={(list) => setSelJobRole(list)}
              style={floatLabel.multiSelect}
            />
            {/* <Controller
              control={control}
              name="job_role"
              render={({ field: { onChange } }) => (
                <>
                  <Select
                    inputRef={{ ...register("job_role") }}
                    styles={floatLabel.bgWhite}
                    options={jobRoles}
                    defaultValue={[jobRoles[0]]}
                    components={{
                      ValueContainer: CustomValueContainer,
                    }}
                    placeholder="Select Job Role"
                    onChange={(val) => onChange(val.value)}
                  />
                </>
              )}
            /> */}
          </div>
        ) : (
          ""
        )}
        <div className="col-md-2 p-1">
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange } }) => (
              <>
                <Select
                  inputRef={{ ...register("type") }}
                  styles={floatLabel.bgWhite}
                  options={typeOpt}
                  defaultValue={[typeOpt[0]]}
                  components={{
                    ValueContainer: CustomValueContainer,
                  }}
                  placeholder="Type"
                  onChange={(val) => onChange(val.value)}
                />
              </>
            )}
          />
        </div>
        <div className="col-sm-5 p-1">
          <div className="col">
            <Multiselect
              customCloseIcon={<i className="fas fa-times ml-2"></i>}
              displayValue="text"
              placeholder="Notification Type"
              options={notifyOpt}
              selectedValues={notifyType}
              onSelect={(list) => setNotifyType(list)}
              onRemove={(list) => setNotifyType(list)}
              style={floatLabel.multiSelect}
            />
          </div>
        </div>
        <div className="col-md-2 p-1">
          <InputField
            type="number"
            keyName="duration"
            label="Duration"
            validation={{ ...register("duration") }}
          />
        </div>
        <div className="col-md-1 p-1 text-center">
          <button type="submit" className="bg-white border-0">
            <img
              src={process.env.PUBLIC_URL + "/images/general-icons/addbox.svg"}
              className="m-1"
              //   style={{ width: "50px" }}
            />
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormEscalation;
