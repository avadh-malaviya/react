import Http from "../Http";
import { baseUrl } from "../config/app";

const exportService = {
  repairRequest(data) {
    return this.downloadExcel(
      baseUrl + "frontend/eng/exportrepairrequest",
      data,
      "Workrequest"
    );
  },

  exportworkorder(data) {
    return this.downloadExcel(
      baseUrl + "frontend/eng/exportworkorder",
      data,
      "Workorder"
    );
  },

  exportTask(data = {}) {
    return this.downloadExcel(
      baseUrl + "/backoffice/property/wizard/audittask_excelreport?",
      data,
      "Task"
    );
  },

  exportDeptFun(data) {
    return this.downloadExcel(
      baseUrl + "/backoffice/property/wizard/auditdeptfunc_excelreport?",
      data,
      "Department_function"
    );
  },

  exportDevice(data) {
    return this.downloadExcel(
      baseUrl + "/backoffice/property/wizard/auditdevice_excelreport?",
      data,
      "Device"
    );
  },

  exportUsers(data) {
    return this.downloadExcel(
      baseUrl + "/backoffice/property/wizard/audituser_excelreport?",
      data,
      "Users"
    );
  },

  async downloadExcel(uri, data, name) {
    const url = new URL(uri);
    url.search = new URLSearchParams(data);
    await fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = data.start_date
          ? `${name}_Report_${data.start_date}_${data.end_date}.xlsx`
          : name + ".xlsx";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
  },
};
export default exportService;
