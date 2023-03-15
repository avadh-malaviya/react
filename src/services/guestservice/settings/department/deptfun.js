import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const deptFunService = {
  getdepartmentlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/admin/wizard/departmentlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdepartmentfun(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/departfunc/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createdeptfun(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/departfunc", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletedeptfunrow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/departfunc/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updatedeptfun(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(
        baseUrl + "backoffice/guestservice/wizard/departfunc/" + id,
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};

export default deptFunService;
