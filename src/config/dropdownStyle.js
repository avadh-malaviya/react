export default {
  menu: (provided, state) => ({
    ...provided,
    // width: state.selectProps.width,
    zIndex: 5,
  }),

  control: (provided) => ({
    ...provided,
    background: "transparent",
    border: 0,
    boxShadow: "none",
    width: "inherit",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "13px",
    minHeight: "32px",
    height: "32px",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "black",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  //   singleValue: (provided) => ({
  //     ...provided,
  //     color: "white",
  //   }),

  container: (provided) => ({
    ...provided,
    border: "hidden",
    background: "#F8F8F8",
    width: "100%",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgb(11, 131, 118)" : "#F8F8F8",
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "13px",
    "&:hover": {
      backgroundColor: "rgb(11 131 118 / 17%)",
      color: "black",
    },
  }),
};
