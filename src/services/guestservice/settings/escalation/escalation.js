import Http from "../../../../Http";
import { baseUrl } from "../../../../config/app";

const escalationService = {
  //   getdepartmentlist(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.get(baseUrl + "backoffice/admin/wizard/departmentlist", data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
  //   getdepartmentfun(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.get(baseUrl + "backoffice/guestservice/wizard/departfunc/" + data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
  updateescalation(data) {
    // payload :--
    // device_type: 0
    // escalation_group: 27
    // id: 0
    // job_role: " Marketing Coordinator"
    // job_role_id: 141
    // level: 2
    // max_time: 600
    // notify_list: [{text: "Email"}]
    // 0: {text: "Email"}
    // notify_type: "Email"
    return new Promise((resolve, reject) => {
      Http.post(
        baseUrl + "backoffice/guestservice/wizard/escalation/updateinfo",
        data
      )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  //   deletedeptfunrow(data) {
  //     return new Promise((resolve, reject) => {
  //       Http.delete(baseUrl + "backoffice/guestservice/wizard/departfunc/" + data)
  //         .then((res) => resolve(res.data))
  //         .catch((err) => reject(err));
  //     });
  //   },
};

export default escalationService;
