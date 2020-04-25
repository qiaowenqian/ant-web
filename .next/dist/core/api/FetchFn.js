"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _message2 = require("antd/lib/message");

var _message3 = _interopRequireDefault(_message2);

var _stringify = require("next\\node_modules\\babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("next\\node_modules\\babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("next\\node_modules\\babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("next\\node_modules\\babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("next\\node_modules\\babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("next\\node_modules\\babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

require("isomorphic-fetch");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FetchFn = function (_React$Component) {
  (0, _inherits3.default)(FetchFn, _React$Component);

  function FetchFn() {
    (0, _classCallCheck3.default)(this, FetchFn);

    return (0, _possibleConstructorReturn3.default)(this, (FetchFn.__proto__ || (0, _getPrototypeOf2.default)(FetchFn)).apply(this, arguments));
  }

  (0, _createClass3.default)(FetchFn, null, [{
    key: "fetchFn",
    value: function fetchFn(opt, cb, error) {
      var type = opt.type;

      var urls = [{
        url: "/statistics/downLoadTaskByStatus",
        fileName: "任务分布表"
      }, {
        url: "/statistics/downLoadTaskByProject",
        fileName: "项目分布表"
      },, {
        url: "/statistics/downLoadPendByProject",
        fileName: "项目待办统计表"
      }, {
        url: "/statistics/downLoadPendByPerson",
        fileName: "人员待办统计表"
      },, {
        url: "/statistics/downLoadNumByProject",
        fileName: "项目绩效统计表（按任务数）"
      },, {
        url: "/statistics/downLoadNumByPerson",
        fileName: "人员绩效统计表（按任务数）"
      }, {
        url: "/statistics/downLoadContentByProject",
        fileName: "项目绩效统计表（按绩效值）"
      }, {
        url: "/statistics/downLoadContentByPerson",
        fileName: "人员绩效统计表（按绩效值）"
      }];
      var option = { method: "get", credentials: "include" };
      option.headers = {
        Accept: "application/json,text/plain, */*",
        "Content-Type": "application/json; charset=utf-8"
      };
      if (type == "post") {
        option.method = "post";
        option.body = (0, _stringify2.default)(opt.data);
      }
      if (type == "file") {
        option.method = "post";
        option.body = opt.data;
      }
      var fileName = "";
      fetch(opt.url, option).then(function (response) {
        if (!response) {
          console.log("未返回response");
          return false;
        } else {
          if (!response.ok || response.url && response.url.indexOf("/antvip/dingtalk/test") != -1) {
            if (error) {
              error(response.statusText || response.status);
            } else {
              console.log(response.statusText || response.status);
            }
          } else {
            var data = void 0;
            var urlObj = urls.filter(function (item) {
              return item.url.indexOf(response.url.split("ant-cgi")[1]) > -1;
            });
            var time = (0, _util.dateToStringNo)(new Date());
            if (response.url && urlObj.length > 0 && urlObj[0].fileName) {
              fileName = urlObj[0].fileName + time + ".xlsx";
              data = response.blob();
            } else {
              data = response.json();
            }

            return data;
          }
        }
      }).then(function (json) {
        if (json.type == "application/x-msdownload") {
          var a = document.createElement("a");
          a.download = fileName;
          a.href = window.URL.createObjectURL(json);
          a.click();
          return;
        }
        if (json && json.success) {
          if (cb) {
            if (json.data) {
              cb(json.data);
            } else {
              cb(true);
            }
          }
        } else {
          if (json) {
            _message3.default.info(json.errmsg);
            cb({ err: true }); // 后台报错
          } else {
            cb({ err: true }); // 网络报错
          }
        }
      }).catch(function (ex) {
        if (ex.description == "无效字符") {
          if (error) {
            error(ex);
          } else {
            console.log("通信失败", ex);
          }
        }
        if (opt.type == "get") {
          if (error) {
            error(ex);
          } else {
            console.log("通信失败", ex);
          }
        } else {
          //message.info('网络好像断喽');
          console.log("通信失败", ex);
        }
      });
    }
  }]);

  return FetchFn;
}(_react2.default.Component);

exports.default = FetchFn;