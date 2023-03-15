import Http from "../Http";
import { baseUrl } from "../config/app";

const ListService = {
  departmentList() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/department")
        // Http.get("./../data/list/department.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  locationtotallisteng(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/locationtotallisteng", data)
        // Http.get("./../data/list/locationtotallisteng.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  equipmentList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/equipmentlist", data)
        // Http.get("./../data/list/equipmentlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  suppliersList() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/suppliers")
        // Http.get("./../data/list/suppliers.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  severitylistit() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/list/severitylistit")
        // Http.get("./../data/list/severitylistit.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  building() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/list/building")
        // Http.get("./../data/list/building.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  equipstatuslist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/equipstatuslist")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/locationlist?&property_id=" + data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getuserlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/userlist", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdevicesidlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/devices", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getdepartmentfunction(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/deptfunc", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getlocationgroups(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/locationgroups", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getbuildinglist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/building", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gettaskgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/taskgroup", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getjobrolelist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/jobrole", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getusergrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/usergroup", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getshiftgrouplist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/shiftgroup", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getuserlanglist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/userlang", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getpropertylist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/property", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getclientlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/client", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default ListService;
