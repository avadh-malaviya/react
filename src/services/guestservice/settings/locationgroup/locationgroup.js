import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const locationGrpService = {
  //   getroomlist(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.get(baseUrl + "backoffice/property/wizard/roomlist/assist", data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
  createlocationgrp(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/location", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/location/list", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  postlocation(data) {
    return new Promise((resolve, reject) => {
      Http.post(
        baseUrl + "backoffice/guestservice/wizard/location/postlocation",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletelocationgrprow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/location/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updatelocgrp(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/guestservice/wizard/location/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};

export default locationGrpService;
