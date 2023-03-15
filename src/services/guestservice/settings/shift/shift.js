import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const shiftService = {
  //   getsettinguserlanglist(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.get(baseUrl + "frontend/guestservice/getsettinguserlanglist", data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
  createshift(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/shift", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deleteshiftrow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/shift/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateshift(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/guestservice/wizard/shift/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default shiftService;
