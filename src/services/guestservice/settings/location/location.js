import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const locationService = {
  getroomlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/property/wizard/roomlist/assist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationtypelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/property/wizard/location_type", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createlocation(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/property/wizard/location", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletelocationrow(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/property/wizard/location/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updatelocation(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/property/wizard/location/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};

export default locationService;
