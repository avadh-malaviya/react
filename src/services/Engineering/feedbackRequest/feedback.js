import { baseUrl } from "../../../config/app";
import Http from "../../../Http";

const feedback = {
  getcomplaintlist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/complaint/list", data)
        // Http.get("./../data/engineering/complainlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  gethistorylist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/guestservice/historylist", data)
        // Http.get("./../data/engineering/historylist.json")
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
  getCategoryList(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/complaint/categorylist", data)
        // Http.get("./../data/engineering/repairrequest_getcategory_list.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getComplaintDatalist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "list/complaint_datalist", data)
        // Http.get("./../data/engineering/complaint_datalist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateComplaint(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/complaint/senddept", data);
      Http.post(baseUrl + "frontend/complaint/changefeedbacktype", data);
      Http.post(baseUrl + "frontend/complaint/changefeedback", data);
      Http.post(baseUrl + "frontend/complaint/changeinitresponse", data);
      Http.post(baseUrl + "frontend/complaint/changeseverity", data);
      Http.post(baseUrl + "frontend/complaint/changelocation", data);
      Http.post(baseUrl + "frontend/complaint/changeincidentime", data);
      Http.post(baseUrl + "frontend/complaint/changefeedbacksource", data);
      Http.post(baseUrl + "frontend/complaint/changemaincategory", data);
      Http.post(baseUrl + "frontend/complaint/changemainsubcategory", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default feedback;
