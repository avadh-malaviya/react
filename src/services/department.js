import Http from "../Http";
import { baseUrl } from "../config/app";

const departmentService = {
  forward(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/forward", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/guestservice/locationlist", data)
        // Http.get("./../data/guestservice/filterlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getquicktasklist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl +
          "frontend/guestservice/quicktasklist?type=2&property_id=" +
          data
      )
        // Http.get("./../data/guestservice/quicktasklist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default departmentService;
