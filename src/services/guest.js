import Http from "../Http";
import { baseUrl } from "../config/app";

const guestService = {
  reactstatistics() {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl +
          "guestservice/reactstatistics?period=Today&property_id=4&user_id=296"
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  reactgetgsdispatcherlist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "guestservice/reactgetgsdispatcherlist")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getticketlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/ticketlist", data)
        // Http.get("./../data/guestservice/ticketlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  tasklist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/tasklist", data)
        // Http.get("./../data/guestservice/ticketlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  prioritylist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/prioritylist", data)
        // Http.get("./../data/guestservice/ticketlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  filterlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/filterlist", data)
        // Http.get("./../data/guestservice/filterlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  messagelist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/messagelist", data)
        // Http.get("./../data/guestservice/messagelist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  notifylist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/notifylist", data)
        // Http.get("./../data/guestservice/notifylist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  changetask(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/changetask", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  changefeedback(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/changefeedback", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  maxticketno(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/maxticketno", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getguestname(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/guestname?room_id=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getquicktasklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl +
          "frontend/guestservice/quicktasklist?type=1&property_id=" +
          data
      )
        // Http.get("./../data/guestservice/quicktasklist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationgroup(data) {
    return new Promise((resolve, reject) => {
      Http.get(`${baseUrl}frontend/guestservice/locationgroup?room_id=${data}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskinfo(task_id, location_id) {
    return new Promise((resolve, reject) => {
      Http.get(
        `${baseUrl}frontend/guestservice/taskinfo?task_id=${task_id}&location_id=${location_id}`
      )
        // Http.get("./../data/guestservice/taskinfo.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createtasklist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/createtasklist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getguestdata(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/getguestdata", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskinfofromtask(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/taskinfofromtask", data)
        // Http.get("./../data/guestservice/taskinfo.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createtasklistnew(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/createtasklistnew", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getroomlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        `${baseUrl}frontend/guestservice/roomlist?room=&property_id=${data}`
      )
        // Http.get("./../data/guestservice/roomlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getalltasklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        `${baseUrl}frontend/guestservice/tasklist?task=&property_id=${data}&type=1`
      )
        // Http.get("./../data/guestservice/alltasklist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  uploadfiles(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/uploadfiles", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  storetasklistprofile(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/storetasklistprofile", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getstafflist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/stafflist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getsystemtasklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/systemtasklist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskinfowithassign(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/taskinfowithassign", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  resendmessage(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/resendmessage", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default guestService;
