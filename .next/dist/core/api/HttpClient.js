"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.baseURI = exports.visitUrl = undefined;

var _stringify = require("next\\node_modules\\babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require("next\\node_modules\\babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("next\\dist\\lib\\router\\index.js");

var _index2 = _interopRequireDefault(_index);

var _FetchFn = require("./FetchFn");

var _FetchFn2 = _interopRequireDefault(_FetchFn);

var _storage = require("../utils/storage");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var visitUrl = exports.visitUrl = "http://localhost:3001";
var baseURI = exports.baseURI = visitUrl + "/antvip/ant-cgi";

var flag = true;
var isISV = false;
var version = "2.1.2";

var HttpClient = function (_React$Component) {
  (0, _inherits3.default)(HttpClient, _React$Component);

  function HttpClient() {
    (0, _classCallCheck3.default)(this, HttpClient);

    return (0, _possibleConstructorReturn3.default)(this, (HttpClient.__proto__ || (0, _getPrototypeOf2.default)(HttpClient)).apply(this, arguments));
  }

  (0, _createClass3.default)(HttpClient, null, [{
    key: "getVersion",
    value: function getVersion() {
      return version;
    }
  }, {
    key: "cutCorp",
    value: function cutCorp(isSamall, fn) {
      var corpidMsg = _storage2.default.get("corpIdMsg");
      var corpidWork = _storage2.default.get("corpIdWork");
      var corpid = _storage2.default.get("corpId");
      if (corpidWork && corpid != corpidWork && !isSamall) {
        var opt = {
          type: "post",
          url: baseURI + "/user/cutCorp?corpid=" + corpidWork,
          data: {}
        };
        _FetchFn2.default.fetchFn(opt, function (list) {
          _storage2.default.set("corpIdWork", list);
          _storage2.default.set("corpId", list);
          if (fn) {
            fn();
          }
        }, function (err) {
          console.log(err);
        });
      } else if (corpidMsg && corpid != corpidMsg && isSamall) {
        var _opt = {
          type: "post",
          url: baseURI + "/user/cutCorp?corpid=" + corpidMsg,
          data: {}
        };
        _FetchFn2.default.fetchFn(_opt, function (list) {
          _storage2.default.set("corpIdMsg", list);
          _storage2.default.set("corpId", list);
          if (fn) {
            fn();
          }
        }, function (err) {
          console.log(err);
        });
      } else {
        if (fn) {
          fn();
        }
      }
    }
  }, {
    key: "AjaxGet",
    value: function AjaxGet(url, cb, err) {
      var opt = {
        type: "get",
        url: baseURI + url
      };
      _FetchFn2.default.fetchFn(opt, cb, err);
    }
  }, {
    key: "AjaxPost",
    value: function AjaxPost(url, data, cb, isSamall) {
      var _this2 = this;

      this.cutCorp(isSamall, function () {
        var opt = {
          type: "post",
          url: baseURI + url,
          data: data
        };
        _FetchFn2.default.fetchFn(opt, cb, function (err) {
          console.log(err, "**********AjaxPost**err***********");
          if (err == "404") {
            console.log(_storage2.default, "**********AjaxPost**Storage***********");
            var corpId = _storage2.default.get("corpId");
            console.log(corpId, "**********AjaxPost**corpId***********");
            _this2.httpPostError(corpId).then(function () {
              console.log(corpId, "**********httpPostError**corpId***********");
              _FetchFn2.default.fetchFn(opt, cb, function (err) {
                _index2.default.push("/pc_login");
              });
            }, function () {
              //再次请求失败后 从新登陆
              _index2.default.push("/pc_login");
            });
          }
        });
      });
    }
    //登陆失败再次登陆

  }, {
    key: "httpPostError",
    value: function httpPostError(corpId) {
      var p = new _promise2.default(function (resolve, reject) {
        //做一些异步操作
        DingTalkPC.runtime.permission.requestAuthCode({
          corpId: corpId,
          onSuccess: function onSuccess(result) {
            var opt = {
              type: "post",
              url: baseURI + "/user/dingtalkCodeLogin?code=" + result.code + "&corpid=" + corpId,
              data: ""
            };
            _FetchFn2.default.fetchFn(opt, function (data) {
              console.log(data, "httpPostError");
              _storage2.default.set("user", (0, _stringify2.default)(data.data));
              resolve();
            }, function (err) {
              console.log(err, "---------------getLoginCode-error------");
              reject(err);
              //Router.push('/pc_login')
            });
          },
          onFail: function onFail(err) {
            console.log(err, "---------------getAgainLogin-error------");
            reject(err);
          }
        });
      });
      return p;
    }
  }, {
    key: "AjaxPostSync",
    value: function AjaxPostSync(url, data, cb, isSamall) {
      this.cutCorp(isSamall, function () {
        if (flag) {
          flag = false;
          setTimeout(function () {
            flag = true;
          }, 1000);
          var opt = {
            type: "post",
            url: baseURI + url,
            data: data
          };
          _FetchFn2.default.fetchFn(opt, cb, function (err) {
            console.log(err);
          });
        }
      });
    }
  }]);

  return HttpClient;
}(_react2.default.Component);

exports.default = HttpClient;