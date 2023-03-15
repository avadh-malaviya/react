import { baseUrl } from "../../../config/app";
import Http from "../../../Http";

const equipmentService = {
  getequipmentlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/equipmentlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createequipfile(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/createequipfile", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  equipmentinfiledel(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/equipmentinfiledel", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getequipmentinformlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/equipmentinformlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getmaintenancelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/maintenancelist?name=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getequipmentpartgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(
        baseUrl +
          "frontend/equipment/equipmentpartgrouplist?part_group_name=" +
          data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/grouplist?group_name=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getsupplierlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/supplierlist?supplier=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createequipment(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/createequipment", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateequipment(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/updateequipment", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  equipmentdelete(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/equipmentdelete", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getimage(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/getimage?image_url=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  importexcel(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/equipment/importexcel", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default equipmentService;
