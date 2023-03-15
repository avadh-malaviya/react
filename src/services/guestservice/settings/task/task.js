import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const taskService = {
  gettaskgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl + "backoffice/guestservice/wizard/gettaskgrouplist",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskcategorylist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl + "backoffice/guestservice/wizard/gettaskcategorylist",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  // this api is pending to replace with the backoffice api
  getsettinguserlanglist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/getsettinguserlanglist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(
        baseUrl + "backoffice/guestservice/wizard/task/createlist",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  editsettingtask(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/editsettingtask", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletetaskrow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/tasklist/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateTask(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/guestservice/wizard/tasklist/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default taskService;
