"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _storage = require("./storage");

var _storage2 = _interopRequireDefault(_storage);

var _HttpClient = require("../api/HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dingJS = function (_React$Component) {
  (0, _inherits3.default)(dingJS, _React$Component);

  function dingJS() {
    (0, _classCallCheck3.default)(this, dingJS);

    return (0, _possibleConstructorReturn3.default)(this, (dingJS.__proto__ || (0, _getPrototypeOf2.default)(dingJS)).apply(this, arguments));
  }

  (0, _createClass3.default)(dingJS, null, [{
    key: "selectUser",

    // 选人
    value: function selectUser() {
      var _selectUser = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var title = arguments[1];
      var _onSuccess = arguments[2];
      var multiple = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var isSmall = arguments[4];
      var maxNum = arguments[5];

      var users = [];
      if (_selectUser && _selectUser.length > 0) {
        _selectUser.map(function (item) {
          users.push(item.userid);
        });
      }
      var corpid = _storage2.default.get("corpIdWork");
      if (isSmall) {
        corpid = _storage2.default.get("corpIdMsg");
      }
      var _this = this;
      DingTalkPC.biz.contact.choose({
        startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
        multiple: multiple ? true : false, //是否多选： true多选 false单选； 默认true
        users: users, //默认选中的用户列表，userid；成功回调中应包含该信息
        disabledUsers: [], // 不能选中的用户列表，员工userid
        corpId: corpid, //企业id
        max: multiple ? maxNum === 5 ? 5 : 1000 : 1, //人数限制，当multiple为true才生效，可选范围1-1500
        limitTips: "", //超过人数限制的提示语可以用这个字段自定义
        isNeedSearch: true, // 是否需要搜索功能
        title: title, // 如果你需要修改选人页面的title，可以在这里赋值
        local: "true", // 是否显示本地联系人，默认false
        onSuccess: function onSuccess(data) {
          console.log(data, "*********selectUsered*********");
          var userId = data;
          _HttpClient2.default.AjaxPost("/user/isAuth", userId, function (result) {
            if (result.type == "0") {
              /* 反参格式
               * [{
               *    'emplId': '',
               *    'name': '',
               *    'avatar': '',
               * }]
               */
              if (result.users1 && result.users1.length > 0) {
                _onSuccess(data);
              }
            } else if (result.type == "1") {
              DingTalkPC.device.notification.confirm({
                message: result.message,
                title: "提示",
                buttonLabels: [result.label],
                onSuccess: function onSuccess(resultData) {
                  _onSuccess(result.users);
                },
                onFail: function onFail(err) {}
              });
            } else if (result.type == "2") {
              DingTalkPC.device.notification.confirm({
                message: result.message,
                title: "提示",
                buttonLabels: [result.label, "取消"],
                onSuccess: function onSuccess(result) {
                  if (result.buttonIndex == 0) {
                    _this.selectUser(_selectUser, title, _onSuccess, multiple, isSmall);
                  }
                },
                onFail: function onFail(err) {}
              });
            }
          }, isSmall);
        },
        onFail: function onFail(err) {
          console.log(err);
        }
      });
    }

    // 获取钉钉免登 code

  }, {
    key: "getLoginCode",
    value: function getLoginCode(corpid, success, fail) {
      DingTalkPC.runtime.permission.requestAuthCode({
        corpId: corpid,
        onSuccess: function onSuccess(result) {
          if (success) {
            success(result.code);
          }
        },
        onFail: function onFail(err) {
          if (fail) {
            fail(err);
          }
        }
      });
    }

    // 上传图片 multiple：是否上传多个，默认一次上传一个

  }, {
    key: "uploadImage",
    value: function uploadImage(_onSuccess2) {
      var multiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var isSmall = arguments[2];

      _HttpClient2.default.AjaxPost("/uploadAttachment/getUploadMethod", "", function (result) {
        var data = result;
        if (data.state) {
          DingTalkPC.biz.util.uploadImage({
            multiple: multiple, //是否多选，默认false
            max: 9, //最多可选个数
            onSuccess: function onSuccess(result) {
              if (_onSuccess2) _onSuccess2(result);
            },
            onFail: function onFail(err) {
              console.log(err, "---------uploadImage--------------");
              console.log(err);
            }
          });
        } else {
          //钉钉文件上传
          DingTalkPC.biz.util.uploadAttachment({
            image: {
              multiple: true,
              max: multiple ? 9 : 1,
              spaceId: data.spaceid + ""
            },
            space: {
              corpId: data.antIsvCorpSuite.corpid,
              spaceId: data.spaceid + "",
              max: multiple ? 9 : 1
            },
            file: { spaceId: data.spaceid + "", max: multiple ? 9 : 1 },
            types: ["photo", "file", "space"],
            onSuccess: function onSuccess(result) {
              console.log(result);
              if (_onSuccess2) {
                _onSuccess2(result);
                /*
                                * 反参格式
                                * {
                                    type:'', // 用户选择了哪种文件类型 ，image（图片）、file（手机文件）、space（钉盘文件）
                                    data: [
                                        {
                                        spaceId: "232323",
                                        fileId: "DzzzzzzNqZY",
                                        fileName: "审批流程.docx",
                                        fileSize: 1024,
                                        fileType: "docx"
                                        },
                                        {
                                        spaceId: "232323",
                                        fileId: "DzzzzzzNqZY",
                                        fileName: "审批流程1.pdf",
                                        fileSize: 1024,
                                        fileType: "pdf"
                                        },
                                        {
                                        spaceId: "232323",
                                        fileId: "DzzzzzzNqZY",
                                        fileName: "审批流程3.pptx",
                                        fileSize: 1024,
                                        fileType: "pptx"
                                        }
                                    ]
                            
                                }
                                */
              }
            },
            onFail: function onFail(err) {
              console.log(err);
            }
          });
        }
      }, isSmall);
    }

    // 预览图片

  }, {
    key: "previewImage",
    value: function previewImage(files, isSmall) {
      var corpid = _storage2.default.get("corpidWork");
      if (isSmall) {
        corpid = _storage2.default.get("corpidMsg");
      }
      console.log(files, "previewImagey");
      if (files.fileId) {
        _HttpClient2.default.AjaxPost("/uploadAttachment/authDingFilePreview", files, function (result) {
          DingTalkPC.biz.cspace.preview({
            corpId: corpid,
            spaceId: files.spaceId,
            fileId: files.fileId,
            fileName: files.fileName,
            fileSize: files.fileSize,
            fileType: files.fileType,
            onSuccess: function onSuccess() {
              //无，直接在弹窗页面显示文件详细信息
            },
            onFail: function onFail(err) {
              console.log(err);
            }
          });
        }, isSmall);
      } else {
        var date = [];

        var url = files.fileUrlAbsolute ? files.fileUrlAbsolute.replace(/\\/g, "/") : "";
        var suffixIndex = url.lastIndexOf(".");
        var suffix = url.substring(suffixIndex + 1).toUpperCase();
        if (suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF") {
          window.location.href = url;
          return;
        }
        if (date.length == 0) {
          date.push(url);
        }
        DingTalkPC.biz.util.previewImage({
          urls: date, //图片地址列表
          current: url, //当前显示的图片链接
          onSuccess: function onSuccess(result) {
            /**/
            console.log(result, "---------result----------------");
          },
          onFail: function onFail(err) {
            console.log(err, "---------err----------------");
          }
        });
      }
    }
    /**TODO:预览图片实现多个图片同时预览 */

  }, {
    key: "previewImages",
    value: function previewImages(files, isSmall, urlList) {
      var corpid = _storage2.default.get("corpidWork");
      if (isSmall) {
        corpid = _storage2.default.get("corpidMsg");
      }
      if (files.fileId) {
        _HttpClient2.default.AjaxPost("/uploadAttachment/authDingFilePreview", files, function (result) {
          DingTalkPC.biz.cspace.preview({
            corpId: corpid,
            spaceId: files.spaceId,
            fileId: files.fileId,
            fileName: files.fileName,
            fileSize: files.fileSize,
            fileType: files.fileType,
            onSuccess: function onSuccess() {
              //无，直接在弹窗页面显示文件详细信息
            },
            onFail: function onFail(err) {
              console.log(err);
            }
          });
        }, isSmall);
      } else {
        //       let date = [];
        var url = files.fileUrlAbsolute ? files.fileUrlAbsolute.replace(/\\/g, "/") : "";

        if (!url) {
          return false;
        }
        var suffixIndex = url.lastIndexOf(".");
        var suffix = url.substr(suffixIndex + 1).toUpperCase();
        if (suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF") {
          window.location.href = url;
          return;
        }
        //       if (date.length == 0) {
        //         date.push(url);
        //       }
        DingTalkPC.biz.util.previewImage({
          urls: urlList, //图片地址列表
          current: url, //当前显示的图片链接
          onSuccess: function onSuccess(result) {
            /**/
            console.log(result, "---------result----------------");
          },
          onFail: function onFail(err) {
            console.log(err, "---------err----------------");
          }
        });
      }
    }

    // 授权JsApi接口

  }, {
    key: "authDingJsApi",
    value: function authDingJsApi(onSuccess) {
      console.log(location.href);
      var urlData = encodeURIComponent(location.href.split("#")[0]);
      _HttpClient2.default.AjaxPost("/dingTalk/mobilejs?urlData=" + urlData, "", function (result) {
        var data = result;
        DingTalkPC.config({
          agentId: data.appid, // 必填，微应用ID
          corpId: data.corpid, //必填，企业ID
          timeStamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: ["biz.util.ut", "device.notification.confirm", "biz.contact.choose", "biz.util.uploadImage", "biz.util.previewImage", "biz.util.uploadAttachment",
          // "biz.util.open",
          "biz.cspace.preview", "biz.contact.complexPicker", "biz.util.open"
          // "biz.cspace.delete"
          ] // 必填，需要使用的jsapi列表，注意：不要带dd。
        });
        DingTalkPC.error(function (error) {
          console.log("dd errorPC: " + (0, _stringify2.default)(error));
          if (onSuccess) {
            onSuccess();
          }
        });
        DingTalkPC.ready(function () {
          if (onSuccess) {
            onSuccess();
          }
        });
      }, false);
    }
    /**
     *@description 查看人员的详细信息
     * @param {*必填 String} id 用户userId
     * @param {*必填 String} corpId 用户所在企业ID
     * @param {*非必填 function} successBack 成功回调
     * @param {*非必填 function} failBack 失败回调
     */

  }, {
    key: "GetUserDetailInfoPage",
    value: function GetUserDetailInfoPage() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var corpId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var successBack = arguments[2];
      var failBack = arguments[3];

      DingTalkPC.biz.util.open({
        name: "profile", //页面名称
        params: {
          id: id, // 用户userid
          corpId: corpId // 企业id
        },
        onSuccess: function onSuccess() {
          if (successBack && typeof successBack == "function") {
            successBack();
          }
        },
        onFail: function onFail(err) {
          if (failBack && typeof failBack == "function") {
            failBack(err);
          }
        }
      });
    }
    /**
     *
     * @param {文件空间Id} spaceId
     * @param {*目录空间Id} fileId
     */

  }, {
    key: "DeleteFileFromDingDing",
    value: function DeleteFileFromDingDing(spaceId, dentryId, successBack, failBack) {
      DingTalkPC.biz.cspace.delete({
        spaceId: spaceId,
        dentryId: dentryId,
        onSuccess: function onSuccess() {
          if (successBack && typeof successBack == "function") {
            successBack();
          }
        },
        onFail: function onFail(err) {
          if (failBack && typeof failBack == "function") {
            failBack(err);
          }
        }
      });
    }
  }]);

  return dingJS;
}(_react2.default.Component);

exports.default = dingJS;