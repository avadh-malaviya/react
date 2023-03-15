import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const userService = {
  getmultipropertylist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backend_api/multipropertylist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getbuildlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/property/wizard/buildlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdepartmentlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/departmentlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getjobrolelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/jobrole", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gethistory(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/user/gethistory/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getuserimage(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/user/getimage", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  resetpassword(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/user/wizard/user/resetpassword/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createuser(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/user/wizard/user", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  //   deletedeptfunrow(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.delete(baseUrl + "backoffice/guestservice/wizard/departfunc/" + data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
  updateuser(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "/backoffice/user/wizard/user/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};

export default userService;
