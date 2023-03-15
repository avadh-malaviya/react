import React, { useEffect, useState } from "react";
// import testService from "../services/test";
import axios from "axios";
import { baseUrl } from "../config/app";
import Header from "../common/Header";

function Test(props) {
  useEffect(() => {
    let headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authentication: "Basic MTo1ZWU4NjhhOTU1ODNm",
    };
    fetch(baseUrl + "react/api/reacttest", {
      headers,
    }).then((res) => {
      console.log(res);
    });
    axios.post(baseUrl + "react/api/reacttest", {}, headers);
    // testService.check('post','api/reactgetcompareflag', data);
  }, []);
  return (
    <>
      <Header />
      Dashboard
    </>
  );
}

export default Test;
