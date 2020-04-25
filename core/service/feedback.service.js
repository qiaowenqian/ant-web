import HttpClient from "../api/HttpClient";

export function saveFeedback(remarks, mail, callback) {
  HttpClient.AjaxPost(
    "/feedback/save",
    { mail: mail, remarks: remarks },
    list => {
      callback(list);
    }
  );
}
//动态获取客服二维码
export function getQRCode(corpId, callback) {
  HttpClient.AjaxPost("/versionUpdate/getPicture", { corpid: corpId }, list => {
    callback(list);
  });
}
