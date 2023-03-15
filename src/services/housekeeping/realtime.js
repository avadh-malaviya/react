import Http from "../../Http";
import { baseUrl } from "../../config/app";

const realtimeService = {
  reactTest() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "react/api/reacttest")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  listHskpstatus() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/hskpstatus")
      // Http.get("./../data/housekeeping/realtime/hskpstatus.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gethskpstatusbyfloor(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/hskp/gethskpstatusbyfloor", data)
      // Http.get("./../data/housekeeping/realtime/gethskpstatusbyfloor.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  roomcleaningstatelist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/roomcleaningstatelist")
      // Http.get("./../data/housekeeping/realtime/roomcleaningstatelist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  schedulelist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/schedulelist")
      // Http.get("./../data/housekeeping/realtime/schedulelist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updatecleaningstate(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/hskp/updatecleaningstate", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateroomschedule(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/hskp/updateroomschedule", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updaterushclean(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/hskp/updaterushclean", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getroomhistory(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/hskp/getroomhistory", data)
      // Http.get("./../data/housekeeping/realtime/getroomhistory.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
};
export default realtimeService;
