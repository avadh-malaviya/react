import { baseUrl } from "./../../../config/app";
import Http from "./../../../Http";

const workrequest = {
  repairrequestlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/repairrequestlist", data)
        // Http.get("./../data/engineering/repairrequestlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getCategoryList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/eng/repairrequest_getcategory_list", data)
        // Http.get("./../data/engineering/repairrequest_getcategory_list.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  equipmentIdList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/equipment/idlist", data)
        // Http.get("./../data/engineering/equipment-idlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getStaffGroupList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/eng/getstaffgrouplist", data)
        // Http.get("./../data/engineering/getstaffgrouplist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getSubCategoryList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/eng/repairrequest_getsubcategory_list", data)
        // Http.get("./../data/engineering/repairrequest_getsubcategory_list.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  updaterepairrequest(data, files) {
    Http.post(baseUrl + "frontend/eng/upload_repair_attach", files);
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/eng/updaterepairrequest", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default workrequest;
