export const floatLabel = {
  bgWhite: {
    menu: (provided, state) => ({
      ...provided,
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
      display: "none",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    container: (provided) => ({
      ...provided,
      border: "2px solid #f1f1f1",
      background: "white",
      borderRadius: "5px",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
      padding: "4px 8px",
    }),

    placeholder: (provided, state) => ({
      ...provided,
      background: "white",
      position: "absolute",
      top: state.hasValue || state.selectProps.inputValue ? -12 : "3px",
      transition: "top 0.2s, font-size 0.1s",
      fontWeight: 600,
      fontSize: (state.hasValue || state.selectProps.inputValue) && 12,
      color: "#878798",
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

    // multiValue: (provided) => ({
    //   ...provided,
    //   backgroundColor: "#0b8376",
    //   color: "white",
    //   borderRadius: "5px",
    //   margin: "3px",
    // }),

    // multiValueLabel: (provided) => ({
    //   ...provided,
    //   color: "white",
    // }),

    // multiValueRemove: (provided) => ({
    //   ...provided,
    //   "&:hover": {
    //     backgroundColor: "#0b8376",
    //     color: "white",
    //     borderRadius: "5px",
    //   },
    // }),

    // indicatorsContainer: (provided) => ({
    //   ...provided,
    //   display: "none",
    // }),
  },
  multiSelect: {
    searchBox: {
      border: "2px solid #f1f1f1",
      fontFamily: "Lato",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "13px",
      padding: "4px",
    },
    chips: {
      background: "#0B8376",
      borderRadius: "5px",
      marginBottom: "1px",
      padding: "2px 8px",
    },
    highlightOption: {
      background: "#0B8376",
    },
    highlight: {
      background: "#0B8376",
    },
  },
};
