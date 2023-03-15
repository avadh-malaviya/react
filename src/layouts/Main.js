import React from "react";
import Header from "./main/Header";
import Sidebar from "./main/Sidebar";
import { Outlet } from "react-router-dom";

function Main(props) {
  return (
    <>
      {/* <Header /> */}
      <Sidebar />
      <div className="content-wrapper">
        {/* {props.children} */}
        <Outlet />
      </div>
    </>
  );
}

export default Main;
