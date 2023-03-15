import { baseUrl } from "../../../config/app";
import Http from "../../../Http";

const itrequest = {
  getissuelist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/it/issuelist", data)
        // Http.get("./../data/engineering/issuelist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  getrequesthist(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/it/requesthist", data)
        // Http.get("./../data/engineering/requesthist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  statuslist() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/it/statuslist")
        // Http.get("./../data/engineering/it/statuslist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  subcatlist(data) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/it/subcatlist", data)
        // Http.get("./../data/engineering/it/subcatlist.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  itCategory() {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + "frontend/it/it_category")
        // Http.get("./../data/engineering/it/it_category.json")
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  updateissue(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/it/updateissue", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  uploadsubfiles(data) {
    return new Promise((resolve, reject) => {
      Http.post(baseUrl + "frontend/it/uploadsubfiles", data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};
export default itrequest;
