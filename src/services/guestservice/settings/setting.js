import Http from "../../../Http";
import { baseUrl } from "../../../config/app";

const settingsService = {
  gettasklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/tasklist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/taskindex", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getsettinglocationgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.post(
        baseUrl + "frontend/guestservice/getsettinglocationgrouplist",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdevicelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/deviceindex", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getshiftlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/shift", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdeptfunlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/deptfuncindex", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getescalationlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        // baseUrl + "backoffice/guestservice/wizard/escalation/selectitem",
        baseUrl + "backoffice/guestservice/wizard/escalationindex",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getuserlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/userindex", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/property/wizard/locationindex", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationgrplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl + "backoffice/guestservice/wizard/locationgroupindex",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default settingsService;
