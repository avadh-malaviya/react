import { baseUrl } from "../../../config/app";
import Http from "../../../Http";

const workorderService = {
  getworkorderlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/workorderlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getworkorderdetail(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/getworkorderdetail", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getworkorderhistorylist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/getworkorderhistorylist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deleteworkorderhistory(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/deleteworkorderhistory", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getworkorderstafflist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/getworkorderstafflist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getpartlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/eng/partlist?part_name=&property_id=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getchecklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/getchecklist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createworkorder(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/createworkorder", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateworkorder(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/updateworkorder", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  uploadfilestoworkorder(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/uploadfilestoworkorder", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  changestatus(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/changestatus", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletefilefromworkorder(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/deletefilefromworkorder", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default workorderService;
