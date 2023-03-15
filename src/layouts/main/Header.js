import React, { useState } from "react";
import Dropdown from "../../common/FormElements/Dropdown";
import authService from "../../services/auth";
import { useAuthDispatch } from "../../store/context";

function Header(props) {
  const [show, setShow] = useState(false);
  const dispatch = useAuthDispatch();
  const setToogleShow = () => {
    setShow((show) => !show);
  };
  const logout = (event) => {
    event.preventDefault();
    authService.logout(dispatch);
  };
  return (
    <>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item d-none d-sm-inline-block">
            <a href="/" className="nav-link">
              House keeping: Roster allocation
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Dropdown
              style={{
                outline: "none",
                border: "hidden",
                background: "transparent",
              }}
              className="nav-link text-center mr-3 pb-2"
              optStyle={{ color: "black" }}
              options={[
                { text: "Create New", value: "" },
                { text: "Guest Request", value: "" },
                { text: "Department Request", value: "" },
                { text: "Complaint Request", value: "" },
                { text: "Managed Task", value: "" },
              ]}
              selected={""}
              defaultValue={""}
              onChange={() => {}}
            />
          </li>
          <li className={`nav-item dropdown ${show ? "show" : ""}`}>
            <a
              className="nav-link"
              data-toggle="dropdown"
              href="#"
              onClick={setToogleShow}
            >
              <img
                src={process.env.PUBLIC_URL + "/images/usericon.png"}
                width={"28px"}
              />
            </a>
            <div
              className={`dropdown-menu dropdown-menu-right ${
                show ? "show" : ""
              }`}
            >
              <a href="#" className="dropdown-item" onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>{" "}
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
