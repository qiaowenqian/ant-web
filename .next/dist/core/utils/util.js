"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listScroll = listScroll;
exports.throttle = throttle;
exports.dateToString = dateToString;
exports.dateToStringNo = dateToStringNo;
exports.stringToText = stringToText;
exports.clearTag = clearTag;
exports.htmlStringDellImgByUrl = htmlStringDellImgByUrl;
exports.pasteImg = pasteImg;
exports.stateColor = stateColor;
exports.setColorTaskState = setColorTaskState;
exports.setColorState = setColorState;
exports.stateColorWithTime = stateColorWithTime;
exports.getQueryString = getQueryString;
exports.getTagTitColorByColorCode = getTagTitColorByColorCode;
exports.getTagColorByColorCode = getTagColorByColorCode;
exports.getStringTagColor = getStringTagColor;
exports.getTeamInfoWithMoney = getTeamInfoWithMoney;
exports.onlyNumber = onlyNumber;
exports.isLoadingErr = isLoadingErr;
exports.beforeUpload = beforeUpload;
exports.getByteLen = getByteLen;
exports.isOwnAccount = isOwnAccount;
exports.oneOf = oneOf;
exports.FormatSize = FormatSize;
exports.arrItemSort = arrItemSort;
exports.createFileIcon = createFileIcon;
exports.isIosSystem = isIosSystem;
exports.formatDate = formatDate;
exports.mistiming = mistiming;
exports.countDate = countDate;
exports.timeForMat = timeForMat;
exports.yesterday = yesterday;
exports.sevenDays = sevenDays;
exports.thirtyDays = thirtyDays;
exports.isObjEmpty = isObjEmpty;

var _keys = require("next\\node_modules\\babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _log = require("next\\node_modules\\babel-runtime/core-js/math/log2");

var _log2 = _interopRequireDefault(_log);

var _message2 = require("antd/lib/message");

var _message3 = _interopRequireDefault(_message2);

var _from = require("next\\node_modules\\babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _storage = require("./storage");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\core\\utils\\util.js";


// 下拉加载
var flag = true;
function listScroll(e) {
  var scrollTop = Math.ceil(Math.round(e.target.scrollTop));
  var clientHeight = Math.ceil(Math.round(e.target.clientHeight));
  var scrollHeight = Math.ceil(Math.round(e.target.scrollHeight));
  if (scrollTop + clientHeight == scrollHeight || scrollTop + clientHeight == scrollHeight - 1 || scrollTop + clientHeight == scrollHeight + 1) {
    if (flag) {
      flag = false;
      setTimeout(function () {
        flag = true;
      }, 1000);
      return true; // 滑到底了
    }
  } else {
    return false; // 没滑到底
  }
}

function throttle(func, wait, mustRun) {
  var timeout,
      startTime = new Date();

  return function () {
    var context = this,
        args = arguments,
        curTime = new Date();

    clearTimeout(timeout);
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= mustRun) {
      func.apply(context, args);
      startTime = curTime;
      // 没达到触发间隔，重新设定定时器
    } else {
      timeout = setTimeout(func, wait);
    }
  };
}

// 日期转字符串
function dateToString(date, type) {
  var year = date.getFullYear();
  var month = add0(date.getMonth() + 1);
  var day = add0(date.getDate());
  var hour = add0(date.getHours());
  var minute = add0(date.getMinutes());
  var second = add0(date.getSeconds());
  if (type === "datetime") {
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  } else if (type === "date") {
    return year + "-" + month + "-" + day;
  }
}
function add0(No) {
  if (No < 10 && No > 0) {
    return "0" + No;
  } else {
    return No;
  }
}

//日期转字符没有---------
function dateToStringNo(date) {
  var year = date.getFullYear();
  var month = add0(date.getMonth() + 1);
  var day = add0(date.getDate());
  var hour = add0(date.getHours());
  var minute = add0(date.getMinutes());
  return "" + year + month + day + hour + minute;
}

// html5字符串转DOM元素
function stringToText(string, returnType) {
  if (string) {
    string.replace(/<!--.*-->/g, "");
    var dom = document.createElement("div");
    dom.innerHTML = string;
    clearTag(dom, "style");
    clearTag(dom, "xml");
    clearTag(dom, "script");
    if (returnType === "innerText") {
      var text = dom.innerText;
      return text; //.replace(/\n/g, '');
    } else if (returnType === "img") {
      var imgs = dom.querySelectorAll("img");
      var imgList = [];
      for (var i = 0; i < imgs.length; i++) {
        imgList.push(imgs[i].src);
      }
      return imgList;
    }
  } else {
    if (returnType === "img") {
      return [];
    } else if (returnType === "innerText") {
      return "";
    }
  }
}
function clearTag(element, tagName) {
  var elems = element.querySelectorAll(tagName);
  (0, _from2.default)(elems).forEach(function (e) {
    return e.parentNode.removeChild(e);
  });
}

// html5字符串 删除对应的IMG
function htmlStringDellImgByUrl(string, url) {
  var dom = document.createElement("div");
  dom.innerHTML = string;
  var img = dom.querySelector("img[src=\"" + url + "\"]");
  //dom.removeChild(img);
  var p = img.parentNode;
  p.removeChild(img);
  return dom.innerHTML;
}

// 粘贴图片 返回图片地址
function pasteImg(e, callback) {
  if (!(e.clipboardData && e.clipboardData.items)) {
    return "";
  }
  for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
    var item = e.clipboardData.items[i];
    if (item.kind === "file") {
      var f = item.getAsFile();
      var reader = new FileReader();
      reader.onload = function (e) {
        callback(e.target.result);
      };
      reader.readAsDataURL(f);
    }
  }
}

// 设置状态样式
function stateColor(stateId, className) {
  // 0未完成  1正常完成  2待确认  3未指派  4已终止 8逾期完成 9提前完成
  var classname = "";
  var name = "";
  if (stateId === "0") {
    classname = className + " state_jxz";
    name = "进行中";
  } else if (stateId === "1") {
    classname = className + " state_ywc";
    name = "按时完成";
  } else if (stateId === "2") {
    classname = className + " state_dqr";
    name = "待确认";
  } else if (stateId === "3") {
    classname = className + " state_wzp";
    name = "未指派";
  } else if (stateId === "4") {
    classname = className + " state_yzz";
    name = "已终止";
  } else if (stateId === "7") {
    classname = className + " state_yyq";
    name = "已逾期";
  } else if (stateId === "8") {
    classname = className + " state_yqwc";
    name = "逾期完成";
  } else if (stateId === "9") {
    classname = className + " state_tqwc";
    name = "提前完成";
  }
  return _react2.default.createElement("div", { className: classname, __source: {
      fileName: _jsxFileName,
      lineNumber: 170
    }
  }, name);
}
//  设置任务详情的绶带
function setColorTaskState(stateId) {
  // 0未完成  1正常完成  2待确认  3未指派  4已终止 8逾期完成 9提前完成
  var taskState = {
    name: "",
    Color: ""
  };
  if (stateId === "0") {
    taskState = {
      name: "进行中",
      Color: {
        borderColor: "#78c06e transparent transparent transparent",
        top: "6px",
        left: "-3px"
      }
    };
  } else if (stateId === "1") {
    taskState = {
      name: "按时完成",
      Color: {
        borderColor: "#5e97f6  transparent transparent transparent",
        top: "7px",
        left: "-7px"
      }
    };
  } else if (stateId === "2") {
    taskState = {
      name: "待确认",
      Color: {
        borderColor: "#5ec9f6 transparent transparent transparent",
        top: "6px",
        left: "-3px"
      }
    };
  } else if (stateId === "3") {
    taskState = {
      name: "未指派",
      Color: {
        borderColor: "#9a89b9 transparent transparent transparent",
        top: "6px",
        left: "-3px"
      }
    };
  } else if (stateId === "4") {
    taskState = {
      name: "已终止",
      Color: {
        borderColor: "#999999 transparent transparent transparent",
        top: "6px",
        left: "-3px"
      }
    };
  } else if (stateId === "7") {
    taskState = {
      name: "已逾期",
      Color: {
        borderColor: "#ff943e transparent transparent transparent",
        top: "6px",
        left: "-3px"
      }
    };
  } else if (stateId === "8") {
    taskState = {
      name: "逾期完成",
      Color: {
        borderColor: "#5c6bc0 transparent transparent transparent",
        top: "8px",
        left: "-8px"
      }
    };
  } else if (stateId === "9") {
    taskState = {
      name: "提前完成",
      Color: {
        borderColor: "#38adff transparent transparent transparent",
        top: "8px",
        left: "-8px"
      }
    };
  }
  return taskState;
}
//  复制移动的列表上标
function setColorState(stateId) {
  // 0未完成  1正常完成  2待确认  3未指派  4已终止 8逾期完成 9提前完成
  var style = {};
  if (stateId === "0") {
    style = { borderColor: "#78c06e transparent transparent transparent" };
  } else if (stateId === "1") {
    style = { borderColor: "#5e97f6 transparent transparent transparent" };
  } else if (stateId === "2") {
    style = { borderColor: "#5ec9f6 transparent transparent transparent" };
  } else if (stateId === "3") {
    style = { borderColor: "#9a89b9 transparent transparent transparent" };
  } else if (stateId === "4") {
    style = { borderColor: "#999999 transparent transparent transparent" };
  } else if (stateId === "7") {
    style = { borderColor: "#ff943e transparent transparent transparent" };
  } else if (stateId === "8") {
    style = { borderColor: "#5c6bc0 transparent transparent transparent" };
  } else if (stateId === "9") {
    style = { borderColor: "#38adff transparent transparent transparent" };
  }
  return style;
}
// //  复制移动的列表上标
// export function setColorState(stateId) {
//   // 0未完成  1正常完成  2待确认  3未指派  4已终止 8逾期完成 9提前完成
//   let style = {};
//   if (stateId === "0") {
//     style = { borderColor: "#78c06e transparent transparent transparent" };
//   } else if (stateId === "1") {
//     style = { borderColor: "#5e97f6 transparent transparent transparent" };
//   } else if (stateId === "2") {
//     style = { borderColor: "#5ec9f6 transparent transparent transparent" };
//   } else if (stateId === "3") {
//     style = { borderColor: "#9a89b9 transparent transparent transparent" };
//   } else if (stateId === "4") {
//     style = { borderColor: "#999999 transparent transparent transparent" };
//   } else if (stateId === "7") {
//     style = { borderColor: "#6c6 transparent transparent transparent" };
//   } else if (stateId === "8") {
//     style = { borderColor: "#5e97f6 transparent transparent transparent" };
//   } else if (stateId === "9") {
//     style = { borderColor: "#5e97f6 transparent transparent transparent" };
//   }
//   return style;
// }
// 设置状态样式
function stateColorWithTime(stateId, endTime) {
  // 0未完成  1正常完成  2待确认  3未指派  4已终止 7已逾期 8逾期完成 9提前完成
  var color = "";
  if (stateId === "7") {
    color = "#f95a60";
  } else if ((stateId === "0" || stateId === "2" || stateId === "3") && endTime) {
    var endDate = new Date(endTime);
    var now = new Date();
    if (endDate.toDateString() === now.toDateString() || endDate < now) {
      color = "#f95a60";
    }
  }
  return color;
}

// 免登 里面处理字符的，原来的复制过来的
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 根据颜色代码返回样式名字 标签组名
function getTagTitColorByColorCode(colorCode) {
  var code = "";
  switch (colorCode) {
    case "fdbb78":
      code = "tag_tit01_fdbb78";
      break;
    case "f29b76":
      code = "tag_tit02_f29b76";
      break;
    case "75ccff":
      code = "tag_tit03_75ccff";
      break;
    case "89c997":
      code = "tag_tit04_89c997";
      break;
    case "c8c4fc":
      code = "tag_tit05_c8c4fc";
      break;
    case "f5222d":
      code = "tag_tit06_F5222D";
      break;
    case "795548":
      code = "tag_tit07_795548";
      break;
    case "666666":
      code = "tag_tit08_666666";
      break;
    default:
      code = "tag_tit01_fdbb78";
      break;
  }
  return code;
}

// 根据颜色代码返回样式名字   /* type: 2 公共标签，1个人标签 */
function getTagColorByColorCode(type, colorCode) {
  var code = "";
  switch (colorCode) {
    case "fdbb78":
      code = type === "1" ? "tag_my01_fdbb78" : "tag_all01_fdbb78";
      break;
    case "f29b76":
      code = type === "1" ? "tag_my02_f29b76" : "tag_all02_f29b76";
      break;
    case "75ccff":
      code = type === "1" ? "tag_my03_75ccff" : "tag_all03_75ccff";
      break;
    case "89c997":
      code = type === "1" ? "tag_my04_89c997" : "tag_all04_89c997";
      break;
    case "c8c4fc":
      code = type === "1" ? "tag_my05_c8c4fc" : "tag_all05_c8c4fc";
      break;
    case "f5222d":
      code = type === "1" ? "tag_my06_f5222d" : "tag_all06_f5222d";
      break;
    case "795548":
      code = type === "1" ? "tag_my07_795548" : "tag_all07_795548";
      break;
    case "666666":
      code = type === "1" ? "tag_my08_666666" : "tag_all08_666666";
      break;
    default:
      code = type === "1" ? "tag_my01_fdbb78" : "tag_all01_fdbb78";
      break;
  }
  return code;
}

//返回标签分类颜色
function getStringTagColor(item) {
  if (item && item.color) {
    return "#" + item.color;
  }
  var color = "#7265e6";
  if (item && item.id) {
    if (item.type != "1") {
      if (item) {
        var pids = item.id.charAt(item.id.length - 1);
        if (isNaN(pids)) {
          color = "#fdbb78";
        } else {
          if (parseInt(pids) > 4) {
            color = "#c8c4fc";
          } else {
            color = "#89c997";
          }
        }
      } else {
        color = "#75ccff";
      }
    }
  }
  return color;
}

// 版本到期判断
function getTeamInfoWithMoney(type) {
  var user = _storage2.default.get("user");
  var data = {
    buyUserCount: 100,
    synUserCount: 100,
    buyDate: "2017-08-30",
    endDate: "2018-08-30",
    remainderDays: 100,
    buyVersion: "MFB",
    ordercreatesource: "",
    orderId: ""
  };
  //   let data = null;
  if (user && user.antIsvCorpSuite) {
    data = user.antIsvCorpSuite;
  } else {
    return "初始化隐藏";
  }
  /*const data = {
        buyUserCount:100,
        synUserCount:910,
        buyDate:'2017-08-30',
        endDate:'2018-08-30',
        remainderDays:10,
        buyVersion:'JCB',
        ordercreatesource:''
    };*/
  var returnTxt = "";
  var returnTxt1 = "";

  /*
   * buyUserCount: 购买人数
   * synUserCount: syn同步人数
   * endDate: 到期日期
   * buyDate: 购买日期
   * remainderDays: 剩余天数
   * buyVersion: 购买版本
   * ordercreatesource: 订单渠道 DRP钉钉订单 非DRP就是运营订单
   */

  switch (type) {
    case "是否钉钉订单":
      returnTxt = new Date(data.createDate).getTime() - new Date("2018-10-12").getTime() < 0 ? false : true;
      break;
    case "购买日期":
      returnTxt = data.buyDate;
      break;
    case "到期日期":
      returnTxt = data.endDate;
      break;
    case "是否超限":
      // 表示人数是否超限
      if (data.synUserCount > data.buyUserCount) {
        returnTxt = [true, data.buyUserCount, data.synUserCount];
      } else {
        returnTxt = [false, data.buyUserCount, data.synUserCount];
      }
      break;
    case "是否可用":
      // 表示高级功能是否可用
      switch (data.buyVersion) {
        case "SYB":
          returnTxt = true;
          break;
        case "JCB":
          returnTxt = false;
          break;
        case "ZYB":
          returnTxt = true;
          break;
        case "MFB":
          returnTxt = false;
          break;
      }
      break;
    case "版本名称":
      switch (data.buyVersion) {
        case "SYB":
          returnTxt = "试用版";
          break;
        case "JCB":
          returnTxt = "基础版";
          break;
        case "ZYB":
          returnTxt = "专业版";
          break;
        case "MFB":
          returnTxt = "免费版";
          break;
      }
      break;
    case "剩余天数":
      returnTxt = data.remainderDays;
      break;
    case "专业版提示":
      returnTxt = ["专业版功能", "图表化项目管理、批量便捷操作、多维度数据统计、WBS文件系统等都为蚂蚁分工专业版功能，同时还有更多高级功能将陆续开放。"];
      break;
    case "续费提示":
      var name = "";
      switch (data.buyVersion) {
        case "SYB":
          name = "试用版";
          break;
        case "JCB":
          name = "基础版";
          break;
        case "ZYB":
          name = "专业版";
          break;
        case "MFB":
          name = "免费版";
          break;
      }
      if (data.buyVersion === "ZYB") {
        returnTxt = ["续费升级", "\u60A8\u516C\u53F8\u5F53\u524D\u4F7F\u7528\u7684\u662F&nbsp;<b>\u8682\u8681\u5206\u5DE5" + name + "</b>\uFF0C\u6388\u6743\u6709\u6548\u671F\u622A\u6B62\u4E8E&nbsp;<b>" + data.endDate + "</b>&nbsp;\u65E5\uFF1B\u6700\u5927\u53EF\u6388\u6743\u4EBA\u6570\u4E3A&nbsp;<b>" + data.buyUserCount + "</b>&nbsp;\u4EBA\uFF0C\u76EE\u524D\u5DF2\u6388\u6743&nbsp;<b>" + data.synUserCount + "</b>&nbsp;\u4EBA\u3002"];
      } else if (data.buyVersion === "JCB") {
        returnTxt = ["续费升级", "\u60A8\u516C\u53F8\u5F53\u524D\u4F7F\u7528\u7684\u662F&nbsp;<b>\u8682\u8681\u5206\u5DE5" + name + "</b>\uFF0C\u6388\u6743\u6709\u6548\u671F\u622A\u6B62\u4E8E&nbsp;<b>" + data.endDate + "</b>&nbsp;\u65E5\uFF1B\u60A8\u53EF\u4EE5\u63D0\u524D\u7EED\u8D39\u6216\u5347\u7EA7\u5230\u529F\u80FD\u66F4\u4E3A\u5F3A\u5927\u7684\u4E13\u4E1A\u7248\u3002"];
      } else if (data.buyVersion === "SYB") {
        returnTxt = ["续费升级", "\u60A8\u516C\u53F8\u5F53\u524D\u4F7F\u7528\u7684\u662F&nbsp;<b>\u8682\u8681\u5206\u5DE5" + name + "</b>\uFF0C\u6388\u6743\u6709\u6548\u671F\u622A\u6B62\u4E8E&nbsp;<b>" + data.endDate + "</b>&nbsp;\u65E5\uFF1B\u60A8\u53EF\u63D0\u524D\u4ED8\u8D39\u5347\u7EA7\u5230\u7ECF\u6D4E\u5B9E\u60E0\u7684\u57FA\u7840\u7248\u6216\u529F\u80FD\u5F3A\u5927\u7684\u4E13\u4E1A\u7248\u3002"];
      } else if (data.buyVersion === "MFB") {
        returnTxt = ["续费升级", "<div class='free'>\u60A8\u516C\u53F8\u5F53\u524D\u4F7F\u7528\u7684\u662F&nbsp;<b>\u8682\u8681\u5206\u5DE5\u514D\u8D39\u7248</b>\uFF0C\u514D\u8D39\u7248\u5305\u542B\u4EFB\u52A1\u534F\u4F5C\u7684\u5B8C\u6574\u529F\u80FD\uFF0C\u53EF\u8F7B\u5EA6\u7528 \u4E8E\u65E5\u5E38\u5DE5\u4F5C\u4E2D\u4EFB\u52A1\u7684\u6709\u5E8F\u6307\u6D3E\u548C\u8DDF\u8FDB\u3002</div>\n                    <div class='basics'>\u5982\u60A8\u7684\u56E2\u961F\u9879\u76EE\u548C\u4EFB\u52A1\u6570\u91CF\u8F83\u591A\uFF0C\u53EF\u5347\u7EA7\u4E3A\u7ECF\u6D4E\u5B9E\u60E0\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248</b>\uFF0C\u57FA\u7840\u7248\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002</div>\n                     \u6211\u4EEC\u66F4\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u529F\u80FD\u5F3A\u5927\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248</b>\uFF0C\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u63D0\u5347\u9879\u76EE\u7BA1\u7406\u6C34\u5E73\u3002", data.buyVersion];
      }
      break;
    case "人数超限提示":
      returnTxt = ["使用人数超限", "\u60A8\u516C\u53F8\u7BA1\u7406\u5458\u6388\u6743\u7684\u4F7F\u7528\u4EBA\u6570\u5DF2\u7ECF\u8D85\u51FA\u4E86\u7248\u672C\u4E0A\u9650\uFF0C\u5F53\u524D\u7248\u672C\u6700\u5927\u53EF\u6388\u6743\u4EBA\u6570\u4E3A&nbsp;<b>" + data.buyUserCount + "</b>&nbsp;\u4EBA\uFF0C\u76EE\u524D\u5DF2\u6388\u6743&nbsp;<b>" + data.synUserCount + "</b>&nbsp;\u4EBA\u3002\u8BF7\u7BA1\u7406\u5458\u53CA\u65F6\u5728\u9489\u9489\u540E\u53F0\u8FDB\u884C\u56E2\u961F\u7684\u6388\u6743\u7BA1\u7406\uFF0C\u6216\u5347\u7EA7\u5230\u53EF\u5BB9\u7EB3\u66F4\u591A\u4EBA\u5458\u7684\u89C4\u683C\u3002"];
      break;
    case "人数超限提示":
      returnTxt = ["使用人数超限", "\u60A8\u516C\u53F8\u7BA1\u7406\u5458\u6388\u6743\u7684\u4F7F\u7528\u4EBA\u6570\u5DF2\u7ECF\u8D85\u51FA\u4E86\u7248\u672C\u4E0A\u9650\uFF0C\u5F53\u524D\u7248\u672C\u6700\u5927\u53EF\u6388\u6743\u4EBA\u6570\u4E3A&nbsp;<b>" + data.buyUserCount + "</b>&nbsp;\u4EBA\uFF0C\u76EE\u524D\u5DF2\u6388\u6743&nbsp;<b>" + data.synUserCount + "</b>&nbsp;\u4EBA\u3002\u8BF7\u7BA1\u7406\u5458\u53CA\u65F6\u5728\u9489\u9489\u540E\u53F0\u8FDB\u884C\u56E2\u961F\u7684\u6388\u6743\u7BA1\u7406\uFF0C\u6216\u5347\u7EA7\u5230\u53EF\u5BB9\u7EB3\u66F4\u591A\u4EBA\u5458\u7684\u89C4\u683C\u3002"];
      break;
    case "即将到期提示":
      if (data.buyVersion === "ZYB") {
        returnTxt = ["专业版即将到期", "\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u8D2D\u4E70\u7684\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248\u5C06\u5728&nbsp;<b>" + (data.remainderDays == 0 ? "明天" : data.remainderDays + "天后") + "</b>&nbsp;\u5230\u671F\uFF0C\u4E3A\u4E86\u4E0D\u5F71\u54CD\u60A8\u516C\u53F8\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C\u8BF7\u60A8\u63D0\u524D\u8FDB\u884C\u7EED\u8D39\u6216\u8D2D\u4E70\u5176\u4ED6\u89C4\u683C\u3002"];
      } else if (data.buyVersion === "JCB") {
        returnTxt = ["基础版即将到期", "\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u5F00\u59CB\u4F7F\u7528\u7684\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248\u5C06\u5728&nbsp;<b>" + (data.remainderDays == 0 ? "明天" : data.remainderDays + "天后") + "</b>&nbsp;\u5230\u671F\uFF0C\u4E3A\u4E86\u4E0D\u5F71\u54CD\u60A8\u516C\u53F8\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C\u8BF7\u60A8\u63D0\u524D\u8FDB\u884C\u7EED\u8D39\u6216\u5347\u7EA7\u5230\u529F\u80FD\u66F4\u52A0\u5168\u9762\u7684\u4E13\u4E1A\u7248\u3002\n                    "];
      } else if (data.buyVersion === "SYB") {
        returnTxt = ["试用即将到期", "<div class='free'>\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u5F00\u59CB\u8BD5\u7528\u7684\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248\u5C06\u5728&nbsp;<b>" + (data.remainderDays == 0 ? "明天" : data.remainderDays + "天后") + "</b>&nbsp;\u5230\u671F\uFF0C\u8BF7\u53CA\u65F6\u8D2D\u4E70\u5347\u7EA7\u3002</div>\n                    <div class='basics'>\u5982\u60A8\u9700\u8981\u8F7B\u91CF\u5316\u7684\u4EFB\u52A1\u534F\u540C\uFF0C\u53EF\u8D2D\u4E70\u7ECF\u6D4E\u5B9E\u60E0\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248</b>\uFF0C\u57FA\u7840\u7248\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002</div>\n                    \u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u529F\u80FD\u5F3A\u5927\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248</b>\uFF0C\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u91CF\u5316\u5458\u5DE5\u7EE9\u6548\u3001\u63D0\u5347\u9879\u76EE\u7BA1\u7406\u3002\n                    "];
      }
      break;
    case "已到期提示":
      if (data.buyVersion === "ZYB") {
        returnTxt = ["专业版已到期", "\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u8D2D\u4E70\u7684\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248\u5DF2\u7ECF\u5230\u671F\uFF0C\u611F\u8C22\u60A8\u7684\u652F\u6301\u548C\u4FE1\u4EFB\uFF0C\u8BF7\u60A8\u53CA\u65F6\u7EED\u8D39\u6216\u8D2D\u4E70\u5176\u4ED6\u89C4\u683C\u3002"];
      } else if (data.buyVersion === "JCB") {
        returnTxt = ["基础版已到期", "\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u8D2D\u4E70\u7684\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248\u5DF2\u7ECF\u5230\u671F\uFF0C\u611F\u8C22\u60A8\u7684\u652F\u6301\u548C\u4FE1\u4EFB,\u8BF7\u60A8\u53CA\u65F6\u7EED\u8D39\u6216\u5347\u7EA7\u5230\u529F\u80FD\u66F4\u52A0\u5168\u9762\u7684\u4E13\u4E1A\u7248\u3002"];
      } else if (data.buyVersion === "SYB" && new Date(data.createDate).getTime() - new Date("2018-10-12").getTime() < 0) {
        returnTxt = ["蚂蚁分工", "<div class='free'><b>\u8682\u8681\u5206\u5DE5\u514D\u8D39\u7248</b>\uFF0C\u514D\u8D39\u7248\u5305\u542B\u4EFB\u52A1\u534F\u4F5C\u7684\u5B8C\u6574\u529F\u80FD\uFF0C\u53EF\u8F7B\u5EA6\u7528\u4E8E\u65E5\u5E38\u5DE5\u4F5C\u4E2D\u4EFB\u52A1\u7684\u6709\u5E8F\u4E4B\u6307\u6D3E\u548C\u8DDF\u8FDB\u3002</div>\n                    <div class='basics'><b>\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248</b>\uFF0C\u7ECF\u6D4E\u5B9E\u60E0\u7684\u57FA\u7840\u7248\u5728\u6EE1\u8DB3\u4EFB\u52A1\u534F\u4F5C\u529F\u80FD\u7684\u540C\u65F6\uFF0C\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002</div>\n                    <div><b>\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248</b>\uFF0C\u529F\u80FD\u5F3A\u5927\u7684\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u91CF\u5316\u5458\u5DE5\u7EE9\u6548\u3001\u63D0\u5347\u9879\u76EE\u7BA1\u7406\u3002</div>\n                    "];
      } else if (data.buyVersion === "SYB" && new Date(data.createDate).getTime() - new Date("2018-10-12").getTime() >= 0) {
        returnTxt = ["试用已到期", "<div class='free'>\u60A8\u516C\u53F8\u4E8E&nbsp;<b>" + data.buyDate + "</b>&nbsp;\u5F00\u59CB\u4F53\u9A8C\u8BD5\u7528\u7684\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248\u5DF2\u5230\u671F\uFF0C\u8BF7\u53CA\u65F6\u8D2D\u4E70\u5347\u7EA7\u3002</div>\n                    <div class='basics'>\u5982\u60A8\u9700\u8981\u8F7B\u91CF\u5316\u7684\u4EFB\u52A1\u534F\u540C\uFF0C\u53EF\u8D2D\u4E70\u7ECF\u6D4E\u5B9E\u60E0\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248</b>\uFF0C\u57FA\u7840\u7248\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002</div>\n                    \u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u529F\u80FD\u5F3A\u5927\u7684&nbsp;<b>\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248</b>\uFF0C\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u91CF\u5316\u5458\u5DE5\u7EE9\u6548\u3001\u63D0\u5347\u9879\u76EE\u7BA1\u7406\u3002\n                    "];
      }
      break;
  }
  return returnTxt;
}

// 只允许输入正整数和浮点数
function onlyNumber(obj) {
  obj.value = obj.value.replace(/[^\d\.]/g, "").replace(".", "a").replace(/\./g, "").replace("a", ".");
  if (obj.value[0] === ".") {
    obj.value = "0" + obj.value;
  }
}

// 网络错误提示
function isLoadingErr() {
  return "网络错误，请重试";
}

// 本地上传 图片大小和格式限制
function beforeUpload(file) {
  var isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/bmp" || file.type === "image/gif" || !file.type;
  if (!isJPG) {
    _message3.default.error("只能上传图片（jpg,png,bmp,gif）!");
  }
  var isLt2M = file.size / 1024 / 1024 < 2 || !file.size;
  if (!isLt2M) {
    _message3.default.error("图片不能大于2M!");
  }
  return isJPG && isLt2M;
}

// 返回中文字符长度
function getByteLen(val) {
  if (val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      a.match(/[^\x00-\xff]/gi);
      len += 2;
    }
    return Math.round(len / 2);
  } else {
    return 0;
  }
}
/**
 * @description 用userid判断是否是登陆者自己本人
 * @param {string 必填} userid 需要比较的userid
 * @param {string 必填} corpid 需要比较的corpid
 * @returns {boolean}
 */
function isOwnAccount() {
  var userid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var corpid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  var user = _storage2.default.get("user");
  if (user == null || userid == undefined) {
    console.log("未能从storage中获取到user数据");
    return false;
  }
  if (!(userid != "" && userid == user.userid && corpid != "" && corpid == user.antIsvCorpSuite.corpid)) {
    console.log("isNotOwnAccount");
    return true;
  } else {
    console.log("isOwnAccount");
  }
}

/**
 * @description参数是否是其中之一
 * @param {*string} value
 * @param {*array} validList
 * @returns {*boolean}
 */
function oneOf(value, validList) {
  for (var i = 0; i < validList.length; i++) {
    if (value == validList[i]) {
      return true;
    }
  }
  return false;
}
function oneOfIcon(value, validList) {
  for (var i = 0; i < validList.length; i++) {
    if (value == validList[i]) {
      return true;
    }
  }
  return false;
}
/**
 *@description 文件大小进行格式化,
 * @param {*文件大小 B} filesize
 * @returns {*文件大小格式化} 如果小于1kb返回<1KB,如果小于1M,向下取整，返回整数KB,如果大于1M返回两位小数，类似1.31M
 */
function FormatSize(fileSize) {
  if (fileSize < 1024) {
    return "<1KB";
  } else {
    var arrUnit = ["B", "KB", "M", "G", "T", "P"];
    var powerIndex = (0, _log2.default)(fileSize) / 10;
    powerIndex = Math.floor(powerIndex);
    // index should in the unit range!
    var len = arrUnit.length;
    powerIndex = powerIndex < len ? powerIndex : len - 1;
    var sizeFormatted = fileSize / Math.pow(2, powerIndex * 10);
    if (powerIndex == "1") {
      sizeFormatted = Math.floor(sizeFormatted);
    } else {
      sizeFormatted = sizeFormatted.toFixed(2);
    }

    return sizeFormatted + " " + arrUnit[powerIndex];
  }
}

/**
 * js数组排序 支持数字和字符串
 * @param params
 * @param arrObj   obj     必填  数组对象
 * @param keyName  string  必填  要排序的属性名称
 * @param type     int     选填  默认type:0 正顺  type:1反顺
 * @description
 *  使用示例：
      var temp = [
        {"name":"zjf","score":50,"age":10},
        {"name":"lyy","score":90,"age":5},
        {"name":"zzx","score":90,"age":12}
      ];
      //根据age排序
      var temp1 = arrItemSort(temp,"age",1);
 */
function arrItemSort(arrObj, keyName) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var isDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  //这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
  //表示把对象复制给另一个对象，两者间互不影响
  if (!arrObj) {
    return [];
  }
  var tempArrObj = arrObj.slice(0);
  var compare = function compare(keyName, type) {
    return function (obj1, obj2) {
      var val1 = obj1[keyName];
      var val2 = obj2[keyName];
      if (isDate) {
        val1 = new Date(obj1[keyName]).getTime();
        val2 = new Date(obj2[keyName]).getTime();
      }
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      //如果值为空的，放在最后
      if (val1 == null && val2 == null) {
        return 0;
      } else if (val1 == null && val2 != null) {
        return type == 1 ? -1 : 1;
      } else if (val2 == null && val1 != null) {
        return type == 1 ? 1 : -1;
      }
      //排序
      if (val1 < val2) {
        return type == 1 ? 1 : -1;
      } else if (val1 > val2) {
        return type == 1 ? -1 : 1;
      } else {
        return 0;
      }
    };
  };
  return tempArrObj.sort(compare(keyName, type));
}
// 根据文件类型 返回 文件图标
function createFileIcon(fileType) {
  var initfileType = new String(fileType);
  if (initfileType.length > 1) {
    initfileType = initfileType.substr(0, 1) + initfileType.substr(1);
  } else {
    initfileType = initfileType;
  }
  var audioArr = ["wav", "mp3", "au", "aif", "aiff", "ram", "wma", "mmf", "amr", "aac", "flac"];
  var radioArr = ["avi", "mov", "asf", "wmv", "navi", "3gp", "ra", "ram", "mkv", "flv", "f4v", "rmvb", "webm", "mp4"];
  var imageArr = ["jpg", "png", "jpeg", "bmp", "pcx", "tif", "tga", "exif", "fpx", "svg", "cdr", "pcd", "dxf", "ufo", "esp", "ai", "hdri", "raw", "wmf", "flic", "emp", "ico"];
  var excelArr = ["xlsx", "xls"];
  var wordArr = ["doc", "docx"];
  var nomalArr = ["pdf", "rar", "psd", "txt", "zip", "word"];
  var pptX = ["ppt", "pptx"];
  if (oneOfIcon(fileType, audioArr)) {
    fileType = "audio";
  } else if (oneOfIcon(fileType, radioArr)) {
    fileType = "radio";
  } else if (oneOfIcon(fileType, excelArr)) {
    fileType = "excel";
  } else if (oneOfIcon(fileType, wordArr)) {
    fileType = "word";
  } else if (oneOfIcon(fileType, imageArr)) {
    fileType = "image";
  } else if (oneOfIcon(fileType, nomalArr)) {} else if (oneOfIcon(fileType, pptX)) {
    fileType = "ppt";
  } else {
    fileType = "others";
  }
  //此处要做判断，看是什么类型
  //     let fileTypeClass = `iconfont icon-file-${fileType} fileIcon`;
  var fileTypeClass = "#icon-file-" + fileType;
  if (fileType === "others") {
    return _react2.default.createElement("div", { className: "download downloadOthers", __source: {
        fileName: _jsxFileName,
        lineNumber: 944
      }
    }, _react2.default.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 945
      }
    }, initfileType.substr(0, 1)));
  } else {
    return _react2.default.createElement("svg", { className: "download", "aria-hidden": "true", __source: {
        fileName: _jsxFileName,
        lineNumber: 950
      }
    }, _react2.default.createElement("use", { xlinkHref: fileTypeClass, __source: {
        fileName: _jsxFileName,
        lineNumber: 951
      }
    }));
  }
}
function isIosSystem() {
  var UserAgent = navigator && navigator.userAgent && navigator.userAgent.toLowerCase();
  // let sys = {
  //   windowSys: /windows nt/.test(UserAgent),
  //   appleSys: /mac os/.test(UserAgent)
  // };
  if (/mac os/.test(UserAgent)) {
    return true;
  } else {
    return false;
  }
}
// 计算屏幕根字大小
/*export function setHtmlFontSize(){
    //document.documentElement.style.fontSize = window.screen.width / 100 + 'px';
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 100 + 'px';
}*/

function formatDate(val) {
  // 格式化时间
  var start = new Date(val);
  var y = start.getFullYear();
  var m = start.getMonth() + 1 > 10 ? start.getMonth() + 1 : "0" + (start.getMonth() + 1);
  var d = start.getDate() > 10 ? start.getDate() : "0" + start.getDate();
  return y + "-" + m + "-" + d;
}

function mistiming(sDate1, sDate2) {
  // 计算开始和结束的时间差
  var aDate = void 0,
      oDate1 = void 0,
      oDate2 = void 0,
      iDays = void 0;
  aDate = sDate1.split("-");
  oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
  aDate = sDate2.split("-");
  oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays + 1;
}

function countDate(start, end) {
  // 判断开始和结束之间的时间差是否在90天内
  var days = mistiming(start, end);
  var stateT = days > 90 ? Boolean(0) : Boolean(1);
  return {
    state: stateT,
    day: days
  };
}
function timeForMat(count) {
  // 拼接时间
  var time1 = new Date();
  time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
  var Y1 = time1.getFullYear();
  var M1 = time1.getMonth() + 1 > 10 ? time1.getMonth() + 1 : "0" + (time1.getMonth() + 1);
  var D1 = time1.getDate() > 10 ? time1.getDate() : "0" + time1.getDate();
  var timer1 = Y1 + "-" + M1 + "-" + D1; // 当前时间
  var time2 = new Date();
  time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
  var Y2 = time2.getFullYear();
  var M2 = time2.getMonth() + 1 > 10 ? time2.getMonth() + 1 : "0" + (time2.getMonth() + 1);
  var D2 = time2.getDate() > 10 ? time2.getDate() : "0" + time2.getDate();
  var timer2 = Y2 + "-" + M2 + "-" + D2; // 之前的7天或者30天
  return {
    t1: timer1,
    t2: timer2
  };
}

function yesterday(start, end) {
  // 校验是不是选择的昨天
  var timer = timeForMat(1);
  return timer;
}

function sevenDays() {
  // 获取最近7天
  var timer = timeForMat(7);
  return timer;
}

function thirtyDays() {
  // 获取最近30天
  var timer = timeForMat(30);
  return timer;
}
function isObjEmpty(e) {
  var arr = (0, _keys2.default)(e);
  if (arr.length == 0) {
    return true;
    console.log("空");
  } else {
    return false;
    console.log("非空");
  }
}