import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const deviceService = {
  uploadFile(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/device/upload", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
    // Payload = {
    //    myfile : (binaryfile)
    // }
  },
  getdevicelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "backoffice/guestservice/wizard/devicelist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  storedevice(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "backoffice/guestservice/wizard/device/storeng", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deletedevice(data) {
    return new Promise((resolve, reject) => {
      Http.delete(baseUrl + "backoffice/guestservice/wizard/device/" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updatedevice(data, id) {
    return new Promise((resolve, reject) => {
      Http.put(baseUrl + "backoffice/guestservice/wizard/device/" + id, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default deviceService;
