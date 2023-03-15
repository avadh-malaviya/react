export const zeroPad = function (num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const secondsToHms = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 9 ? h : "0" + h;
  var mDisplay = m > 9 ? m : "0" + m;
  var sDisplay = s > 9 ? s : "0" + s;
  return hDisplay + " : " + mDisplay + " : " + sDisplay;
};

export const arrayToString = (arr, key) => {
  let strArr = [];
  arr.map((item) => strArr.push(item[key]));
  return strArr.toString();
};

export const stringToArray = (str, arr, key) => {
  let val = str.split(",");
  let selectedArr = arr.filter(function (o1) {
    return val.some(function (o2) {
      return o1[key] == o2;
    });
  });
  return selectedArr;
};
