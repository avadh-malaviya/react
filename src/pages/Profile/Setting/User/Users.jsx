import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../common/Loader";
import ConfirmBox from "../../../../common/Modals/ConfirmBox";
import SimpleTable from "../../../../common/SimpleTable";
import TableHead from "../../../../common/TableHead";
import { baseUrl } from "../../../../config/app";
import settingsService from "../../../../services/guestservice/settings/setting";
import userService from "../../../../services/guestservice/settings/user/user";
import { useAuthState } from "../../../../store/context";
import UserForm from "./form/UserForm";

function Users(props) {
  const [userList, setUserList] = useState([]);
  const [mainLoader, setMainLoader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [resetFlag, setResetFlag] = useState(0);
  const [resetNow, setResetNow] = useState(0);
  const [pageNo, setPage] = useState(0);
  const [recordStart, setRecordStart] = useState(1);
  const [length, setLength] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [userFlag, setUserFlag] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [resetPassword, setResetPassword] = useState(false);
  const sortClickDefault = {
    click: 0,
    key: null,
  };
  const sortDefault = {
    sort: "asc",
    key: null,
  };
  const [sortField, setSortField] = useState(sortDefault);
  const [sortClick, setSortClick] = useState(sortClickDefault); // using value from previous state
  const {
    user: { property_id, id, client_id },
  } = useAuthState();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMainLoader(true);
    setPage(0);
    setUserList([]);
    setSearchText(props.search);
    setResetFlag((p) => p + 1);
    setEditLoader(false);
  }, [props.search, sortField, resetNow]);

  useEffect(() => {
    if (resetFlag != 0 && props.tab == "users") {
      setResetFlag(0);
      getUserList();
    }
  }, [resetFlag, props.tab]);

  const getPayload = () => {
    return {
      platform: "react",
      client_id: client_id,
      user_id: id,
      limit: length,
      offset: pageNo,
    };
  };

  const getUserList = () => {
    settingsService
      .getuserlist(getPayload())
      .then((res) => {
        setUserList((p) => [...p, ...res]);
        // setTotalRecords(res.recordsFiltered);
        setMainLoader(false);
        setLoader(false);
      })
      .catch(() => {
        toast.error("Faild to fetch tasks list");
        setMainLoader(false);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (
      pageNo !== 0 &&
      // userList.length < totalRecords &&
      props.tab == "users"
    ) {
      setLoader(true);
      getUserList();
    }
  }, [pageNo]);

  const handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      setPage((p) => p + length);
    }
  };

  const sortData = (key) => {
    setSortClick((pObj) => {
      let newObj = pObj;
      if (pObj["click"] == 1) {
        setSortField({ sort: "desc", key: key });
        newObj["key"] = key;
        newObj["click"] = 0;
        return newObj;
      } else {
        setSortField({ sort: "asc", key: key });
        newObj["key"] = key;
        newObj["click"] = 1;
        return newObj;
      }
    });
  };

  const updateUser = (data) => {
    console.log("user data ==>", data);
    setUserDetails(data);
    setUserFlag(true);
  };

  const resetPassCall = (data) => {
    setUserDetails(data);
    setResetPassword(true);
  };

  const resetUser = () => {
    userService
      .resetpassword(userDetails.id + "-0")
      .then((res) => {
        setResetPassword(false);
        toast.success("New password is " + res.password);
      })
      .catch(() => toast.error("Fail to reset password"));
  };

  return (
    <div className="setting-user-table bg-white">
      <UserForm
        show={userFlag}
        handleClose={() => setUserFlag(false)}
        data={userDetails}
        reset={() => setResetNow((p) => p + 1)}
        tab={props.tab}
      />
      <SimpleTable
        loader={mainLoader}
        key={`request`}
        columns={[
          {
            key: "id",
            label: <TableHead title="ID" onClick={() => sortData(0)} />,
            width: "40",
          },
          {
            key: "picture",
            label: "Image",
            width: "150",
            template: ({ children }) => (
              <>
                {children[0].length > 0 ? (
                  <a
                    href={baseUrl + children[0]}
                    target="_blank"
                    className="color-green"
                  >
                    View Photo
                  </a>
                ) : (
                  "Not available"
                )}
              </>
            ),
          },
          {
            key: "cbname",
            label: "Building",
            width: "200",
          },
          {
            key: "first_name",
            label: <TableHead title="First Name" onClick={() => sortData(3)} />,
            width: "100",
          },
          {
            key: "last_name",
            label: <TableHead title="Last Name" onClick={() => sortData(4)} />,
            width: "100",
          },
          {
            key: "username",
            label: <TableHead title="User Name" onClick={() => sortData(5)} />,
            width: "100",
          },
          {
            key: "language",
            label: <TableHead title="Language" onClick={() => sortData(6)} />,
            width: "100",
          },
          {
            key: "usergroup",
            label: <TableHead title="User Group" onClick={() => sortData(7)} />,
            width: "150",
          },
          {
            key: "job_role",
            label: <TableHead title="Job Role" onClick={() => sortData(8)} />,
            width: "150",
          },
          {
            key: "ivr_password",
            label: (
              <TableHead title="IVR-Password" onClick={() => sortData(9)} />
            ),
            width: "150",
          },
          {
            key: "department",
            label: (
              <TableHead title="Department" onClick={() => sortData(10)} />
            ),
            width: "150",
          },
          {
            key: "mobile",
            label: <TableHead title="Mobile" onClick={() => sortData(11)} />,
            width: "150",
          },
          {
            key: "email",
            label: <TableHead title="Email" onClick={() => sortData(12)} />,
            width: "150",
          },
          {
            key: "disabled_label",
            label: <TableHead title="Disable" onClick={() => sortData(13)} />,
            width: "150",
          },
          {
            key: "online_label",
            label: <TableHead title="Online" onClick={() => sortData(14)} />,
            width: "150",
          },
          {
            key: "",
            label: "Action",
            width: "50",
            template: ({ data }) => (
              <>
                {editLoader ? (
                  <img
                    src={process.env.PUBLIC_URL + "/images/loader.gif"}
                    style={{ width: "15px" }}
                  />
                ) : (
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/general-icons/update-green.svg"
                    }
                    onClick={() => updateUser(data)}
                  />
                )}
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/images/general-icons/reset-green.svg"
                  }
                  className="ml-2"
                  onClick={() => resetPassCall(data)}
                />
              </>
            ),
          },
        ]}
        data={userList}
      />
      <ConfirmBox
        show={resetPassword}
        onHide={() => setResetPassword(false)}
        ondelete={resetUser}
        title="Reset Password"
        body={`Are you sure you want to reset ${userDetails.first_name}'s password?`}
        btn="Proceed"
      />
      {loader ? <Loader /> : ""}
    </div>
  );
}

export default Users;
