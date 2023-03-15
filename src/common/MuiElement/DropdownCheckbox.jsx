import React, { useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { styled, makeStyles } from "@material-ui/core/styles";

const StyledFormLabel = styled(InputLabel)({
  color: "grey",
  zIndex: "1",
  "&.MuiInputLabel-formControl": {
    top: "-13px",
    left: "10px",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "500 !important",
    fontSize: "13px",
  },
  "&.MuiInputLabel-shrink": {
    transform: "translate(0, 7px) scale(0.90)",
    color: "#878798",
    backgroundColor: "white",
  },
});

const StyledSelect = styled(Select)({
  background: "tranperant",
  marginTop: "0px !important",
  width: "100%",
  zIndex: "2",
  "& .MuiSelect-root": {
    paddingLeft: "10px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

function DropdownCheckbox({
  title = "",
  options = [],
  labelKey = "",
  onChange = (e) => {},
  movecall = (e) => {},
  ...props
}) {
  // styling code

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: 0,
      width: "100%",
      border: "2px solid #f1f1f1",
      borderRadius: "5px",
    },
    // custom: {
    //   position: "realtive",
    // },
    listCustomStyle: {
      paddingTop: "5px",
    },
    selectOptions: {
      "& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover":
        {
          backgroundColor: "transparent",
        },
      "& .MuiList-root": {
        paddingTop: "0px",
        "& .MuiMenuItem-root": {
          borderBottom: "2px solid #f1f1f1",
          "& .MuiTypography-root": {
            fontFamily: "Lato !important",
            fontStyle: "normal",
            fontWeight: "500 !important",
            fontSize: "13px !important",
          },
        },
      },
    },
  }));

  // const options = [
  //   "Oliver Hansen",
  //   "Van Henry",
  //   "April Tucker",
  //   "Ralph Hubbard",
  //   "Omar Alexander",
  //   "Carlos Abbott",
  //   "Miriam Wagner",
  //   "Bradley Wilkerson",
  //   "Virginia Andrews",
  //   "Kelly Snyder",
  // ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        border: "2px solid #f1f1f1",
        boxShadow: "none",
        borderRadius: "0px 0px 5px 5px",
      },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  // main code begins from here

  const classes = useStyles();
  MenuProps.PaperProps.className = classes.selectOptions;
  const [selected, setSelected] = React.useState([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  useEffect(() => {
    setSelected([]);
  }, [options]);

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(
        selected.length === options.length
          ? []
          : options.map((item) => item[labelKey])
      );
      onChange(
        selected.length === options.length
          ? []
          : options.map((item) => item[labelKey])
      );
      return;
    }
    onChange(value);
    setSelected(value);
  };

  return (
    <FormControl className={classes.formControl}>
      <StyledFormLabel
        id="demo-mutiple-checkbox-label"
        className={classes.labelStyle}
      >
        {title}
      </StyledFormLabel>
      <StyledSelect
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={selected}
        IconComponent={() => " "}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {/* className={classes.custom} */}
        <MenuItem value="all">
          <div className="d-flex">
            <ListItemText
              // classes={{ primary: classes.selectAllText }}
              className={classes.listCustomStyle}
              primary="Select All"
            />
            <Checkbox
              checked={isAllSelected}
              checkedIcon={
                <img
                  src={process.env.PUBLIC_URL + "/images/green-checkmark.svg"}
                  style={{ width: "17px" }}
                />
              }
              icon={
                <img
                  src={process.env.PUBLIC_URL + "/images/darkgreybox.svg"}
                  style={{ width: "16px" }}
                />
              }
            />
          </div>
          <div className="w-100 text-end lato-tbody">
            <span
              onClick={(e) => {
                e.stopPropagation();
                movecall(selected);
              }}
            >
              <span className="mr-2 color-green">Move Selected</span>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/general-icons/arrow-right.svg"
                }
              />
            </span>
          </div>
        </MenuItem>
        {options.map((item, i) => (
          <MenuItem key={i} value={item[labelKey]}>
            <ListItemText primary={item[labelKey]} />
            <Checkbox
              checked={selected.indexOf(item[labelKey]) > -1}
              checkedIcon={
                <img
                  src={process.env.PUBLIC_URL + "/images/green-checkmark.svg"}
                  style={{ width: "17px" }}
                />
              }
              icon={
                <img
                  src={process.env.PUBLIC_URL + "/images/darkgreybox.svg"}
                  style={{ width: "16px" }}
                />
              }
            />
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
}

export default DropdownCheckbox;
