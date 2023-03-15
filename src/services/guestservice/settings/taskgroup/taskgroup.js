import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const taskGroupService = {
  getdeptfunclist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/deptfunclist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getusergrouplist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/usergrouplist")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  // this api is pending to replace with the backoffice api
  getsettingjobrolelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/getsettingjobrolelist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  addtaskgroup(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/task", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  edittaskgroup(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/guestservice/wizard/task/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletetaskgrouprow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/task/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default taskGroupService;
