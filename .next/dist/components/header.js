"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dropdown = require("antd/lib/dropdown");

var _dropdown2 = _interopRequireDefault(_dropdown);

var _message2 = require("antd/lib/message");

var _message3 = _interopRequireDefault(_message2);

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _menu = require("antd/lib/menu");

var _menu2 = _interopRequireDefault(_menu);

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

var _layout = require("antd/lib/layout");

var _layout2 = _interopRequireDefault(_layout);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("next\\dist\\lib\\router\\index.js");

var _index2 = _interopRequireDefault(_index);

var _nprogress = require("nprogress");

var _nprogress2 = _interopRequireDefault(_nprogress);

var _header = require("../styles/components/header.scss");

var _header2 = _interopRequireDefault(_header);

var _message4 = require("../components/message");

var _message5 = _interopRequireDefault(_message4);

var _taskCreate = require("../components/taskCreate");

var _taskCreate2 = _interopRequireDefault(_taskCreate);

var _message6 = require("../core/service/message.service");

var _task = require("../core/service/task.service");

var _storage = require("../core/utils/storage");

var _storage2 = _interopRequireDefault(_storage);

var _feedback = require("./feedback");

var _feedback2 = _interopRequireDefault(_feedback);

var _tagManage = require("./tagManage");

var _tagManage2 = _interopRequireDefault(_tagManage);

var _tagManageTask = require("./common/tagManageTask");

var _tagManageTask2 = _interopRequireDefault(_tagManageTask);

var _moneyEnd = require("../components/moneyEnd");

var _moneyEnd2 = _interopRequireDefault(_moneyEnd);

var _authorization = require("../components/setting/authorization");

var _authorization2 = _interopRequireDefault(_authorization);

var _recycle = require("../components/setting/recycle");

var _recycle2 = _interopRequireDefault(_recycle);

var _util = require("../core/utils/util");

var _versionUpdate = require("../components/versionUpdate");

var _versionUpdate2 = _interopRequireDefault(_versionUpdate);

var _versionUpgrades = require("../components/versionUpgrades");

var _versionUpgrades2 = _interopRequireDefault(_versionUpgrades);

var _versionUpOther = require("../components/versionUpOther");

var _versionUpOther2 = _interopRequireDefault(_versionUpOther);

var _versionRecycle = require("../components/versionRecycle");

var _versionRecycle2 = _interopRequireDefault(_versionRecycle);

var _versionSort = require("./versionSort");

var _versionSort2 = _interopRequireDefault(_versionSort);

var _versionFile = require("./versionFile");

var _versionFile2 = _interopRequireDefault(_versionFile);

var _HttpClient = require("../core/api/HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\header.js";

_index2.default.onRouteChangeStart = function (url) {
  _nprogress2.default.start();
};
_index2.default.onRouteChangeComplete = function () {
  return _nprogress2.default.done();
};
_index2.default.onRouteChangeError = function () {
  return _nprogress2.default.done();
};

var Header = _layout2.default.Header;

/*
 * （选填）menuShow：false         // 顶部菜单小图标是否显示
 * （选填）menuClickCallBack(val)  // 点击对应菜单的回调
 * （选填）iconOnClickCallBack()   // 点击顶部小图标的回调
 */

var Head = function (_React$Component) {
  (0, _inherits3.default)(Head, _React$Component);

  function Head(props) {
    (0, _classCallCheck3.default)(this, Head);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Head.__proto__ || (0, _getPrototypeOf2.default)(Head)).call(this, props));

    _this.state = {
      act: "/home",
      menuShow: false,
      messageShow: false,
      createShow: false,
      messageCount: 0,
      user: {},
      isAysc: "",
      feedShow: false, //意见反馈弹框是否显示
      projectManage: false, //项目分类管理是否显示
      publicManage: false,
      personManage: false,

      teamMoneyEnd: false,
      versionAlert: false,
      versionUpdateShow: false,
      taskMax: 0,
      available: true,
      demo: false,
      visible: false,
      versionShow: false,
      authoriShow: false,
      settingGif: false,
      sortGif: false,
      VersionFileGif: false,
      recycleGif: false,
      recycleshow: false,
      isIos: true
    };
    return _this;
  }

  (0, _createClass3.default)(Head, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getMsgCount();
      var user = _storage2.default.get("user");
      this.setState({ user: user });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var lastVersionNum = _storage2.default.getLocal("lastVersionNum");
      var currentVer = _HttpClient2.default.getVersion();
      this.setState({ isIos: (0, _util.isIosSystem)() });
      if (lastVersionNum === null || lastVersionNum != currentVer) {
        this.setState({ versionUpdateShow: true });
        _storage2.default.setLocal("lastVersionNum", currentVer);
      } else {
        this.setState({ versionUpdateShow: false });
      }
      if ((0, _util.getTeamInfoWithMoney)("版本名称") === "免费版") {
        this.getLimt();
      }
      var that = this;
      window.addEventListener("resize", function (e) {
        if (document.documentElement.clientWidth > 1250) {
          that.setState({ menuShow: false });
        }
      });

      this.menuAct();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.menuAct();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "getLimt",
    value: function getLimt() {
      var _this2 = this;

      (0, _task.getLimtTask)(function (data) {
        if (data.err) {
          return false;
        }
        _this2.setState({
          taskMax: data.projectMax,
          available: data.success
        });
      });
    }

    //免费版任务限制

  }, {
    key: "freeTaskLimit",
    value: function freeTaskLimit() {
      var available = this.state.available;

      if ((0, _util.getTeamInfoWithMoney)("版本名称") === "免费版") {
        this.getLimt();
        if (!available) {
          this.setState({ visible: true });
        }
      }
    }
  }, {
    key: "menuAct",
    value: function menuAct() {
      var url = _index2.default.router.pathname;
      this.setState({ act: url });
    }
  }, {
    key: "getMsgCount",
    value: function getMsgCount() {
      var _this3 = this;

      (0, _message6.getMessageCount)(function (res) {
        if (res.err) {
          return false;
        }
        _this3.setState({
          messageCount: res.messageCount,
          isAysc: res.tiem ? res.tiem.isAdmin : ""
        });
      });
    }
  }, {
    key: "menuSwitch",
    value: function menuSwitch() {
      var act = this.state.act;

      if (act.indexOf("/pc_task") !== -1) {
        // if (this.state.menuShow) {
        //   this.setState({ menuShow: false });
        // } else {
        //   this.setState({ menuShow: true });
        // }
        this.props.iconOnClickCallBack();
      } else if (act.indexOf("/pc_projectDetails") !== -1) {
        this.props.iconOnClickCallBack();
      } else if (act.indexOf("/pc_dynamicNew") !== -1) {
        this.props.iconOnClickCallBack();
      } else if (act.indexOf("/pc_census") !== -1) {
        this.props.iconOnClickCallBack();
      } else if (act.indexOf("/pc_project") !== -1) {
        this.props.iconOnClickCallBack();
      }
    }
  }, {
    key: "demoShowTest",
    value: function demoShowTest(e) {
      this.setState({ demo: e });
    }
  }, {
    key: "settingGif",
    value: function settingGif(e) {
      this.setState({ settingGif: e });
    }
  }, {
    key: "sortGif",
    value: function sortGif(e) {
      this.setState({ sortGif: e });
    }
  }, {
    key: "recycleGif",
    value: function recycleGif(e) {
      this.setState({ recycleGif: e });
    }
  }, {
    key: "VersionFile",
    value: function VersionFile(e) {
      this.setState({ VersionFileGif: e });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _state = this.state,
          visible = _state.visible,
          versionShow = _state.versionShow,
          demo = _state.demo,
          act = _state.act,
          messageShow = _state.messageShow,
          user = _state.user,
          createShow = _state.createShow,
          messageCount = _state.messageCount,
          feedShow = _state.feedShow,
          projectManage = _state.projectManage,
          publicManage = _state.publicManage,
          versionAlert = _state.versionAlert,
          isAysc = _state.isAysc,
          versionUpdateShow = _state.versionUpdateShow,
          teamMoneyEnd = _state.teamMoneyEnd,
          authoriShow = _state.authoriShow,
          settingGif = _state.settingGif,
          sortGif = _state.sortGif,
          recycleGif = _state.recycleGif,
          recycleshow = _state.recycleshow,
          VersionFileGif = _state.VersionFileGif,
          isIos = _state.isIos;

      var menu = _react2.default.createElement(_menu2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 221
        }
      }, _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 222
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _this4.setState({ authoriShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 223
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-authority", __source: {
          fileName: _jsxFileName,
          lineNumber: 229
        }
      }), "\u6388\u6743\u4FE1\u606F")), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 233
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _this4.setState({ projectManage: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 234
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-label1", __source: {
          fileName: _jsxFileName,
          lineNumber: 240
        }
      }), "\u9879\u76EE\u5206\u7C7B\u7BA1\u7406")), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 244
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _this4.setState({ publicManage: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 245
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-label", __source: {
          fileName: _jsxFileName,
          lineNumber: 251
        }
      }), "\u4EFB\u52A1\u6807\u7B7E\u7BA1\u7406")), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 256
        }
      }, _react2.default.createElement("a", {
        onClick: function onClick() {
          _this4.setState({ recycleshow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 257
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-recycle", __source: {
          fileName: _jsxFileName,
          lineNumber: 262
        }
      }), "\u56DE\u6536\u7AD9")), _react2.default.createElement(_menu2.default.Divider, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 266
        }
      }), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 267
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _this4.setState({ versionUpdateShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 268
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-2", __source: {
          fileName: _jsxFileName,
          lineNumber: 274
        }
      }), "\u7248\u672C\u8BF4\u660E")), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 278
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _index2.default.push("/pc_guide");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 279
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-touchhandgesture", __source: {
          fileName: _jsxFileName,
          lineNumber: 285
        }
      }), "\u529F\u80FD\u5F15\u5BFC")), _react2.default.createElement(_menu2.default.Item, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 289
        }
      }, _react2.default.createElement("a", {
        className: "Acenter",
        onClick: function onClick() {
          _this4.setState({ feedShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 290
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-mail", __source: {
          fileName: _jsxFileName,
          lineNumber: 296
        }
      }), "\u8054\u7CFB\u670D\u52A1\u5546")));
      var selectKey = this.props.selectKey;

      if (selectKey === "") {
        selectKey = "all";
      }
      return _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 307
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _header2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 308
        }
      }), _react2.default.createElement(Header, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 309
        }
      }, versionUpdateShow ? _react2.default.createElement(_versionUpdate2.default, {
        demoShowTest: function demoShowTest(demo) {
          return _this4.demoShowTest(demo);
        },
        settingGif: function settingGif(_settingGif) {
          return _this4.settingGif(_settingGif);
        },
        sortGif: function sortGif(_sortGif) {
          return _this4.sortGif(_sortGif);
        },
        VersionFile: function VersionFile(VersionFileGif) {
          return _this4.VersionFile(VersionFileGif);
        },
        recycleGif: function recycleGif(_recycleGif) {
          return _this4.recycleGif(_recycleGif);
        },
        versionUpdateShow: versionUpdateShow,
        closeCallBack: function closeCallBack() {
          _this4.setState({ versionUpdateShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 311
        }
      }) : "", recycleshow ? _react2.default.createElement(_recycle2.default, {
        closedCallBack: function closedCallBack() {
          _this4.setState({ recycleshow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 326
        }
      }) : "", demo ? _react2.default.createElement(_versionUpgrades2.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ demo: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 335
        }
      }) : "", settingGif ? _react2.default.createElement(_versionUpOther2.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ settingGif: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 344
        }
      }) : "", recycleGif ? _react2.default.createElement(_versionRecycle2.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ recycleGif: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 353
        }
      }) : "", sortGif ? _react2.default.createElement(_versionSort2.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ sortGif: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 362
        }
      }) : "", VersionFileGif ? _react2.default.createElement(_versionFile2.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ VersionFileGif: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 371
        }
      }) : "", createShow ? _react2.default.createElement(_taskCreate2.default, {
        closedCallBack: function closedCallBack() {
          _this4.setState({ createShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 380
        }
      }) : "", teamMoneyEnd && _react2.default.createElement(_moneyEnd2.default, {
        alertText: (0, _util.getTeamInfoWithMoney)("续费提示"),
        closeCallBack: function closeCallBack() {
          _this4.setState({ teamMoneyEnd: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 389
        }
      }), versionAlert && _react2.default.createElement(_moneyEnd2.default, {
        alertText: (0, _util.getTeamInfoWithMoney)("专业版提示"),
        closeCallBack: function closeCallBack() {
          _this4.setState({ versionAlert: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 397
        }
      }), _react2.default.createElement(_modal2.default, {
        visible: visible,
        onCancel: function onCancel() {
          _this4.setState({ visible: false });
        },
        footer: null,
        width: versionShow ? 850 : 520,
        closable: !versionShow,
        mask: true,
        className: "limitModel",
        maskClosable: false,
        wrapClassName: "limitModel",
        style: versionShow ? {} : { top: 260, height: "400px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 404
        }
      }, versionShow ? _react2.default.createElement("div", { className: "imgBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 419
        }
      }, _react2.default.createElement(_icon2.default, {
        type: "close",
        onClick: function onClick() {
          _this4.setState({ versionShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 421
        }
      }), _react2.default.createElement("div", { className: "img", __source: {
          fileName: _jsxFileName,
          lineNumber: 427
        }
      }, _react2.default.createElement("img", { src: "../static/react-static/pcvip/imgs/versionTable229.png?t=2.1", __source: {
          fileName: _jsxFileName,
          lineNumber: 428
        }
      }))) : "", _react2.default.createElement("div", {
        className: "writeBox",
        style: versionShow ? { display: "none" } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 434
        }
      }, _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 438
        }
      }, _react2.default.createElement("span", { className: "limitMesg", __source: {
          fileName: _jsxFileName,
          lineNumber: 439
        }
      }, "\u7528\u91CF\u4FE1\u606F"), _react2.default.createElement("span", {
        onClick: function onClick() {
          _this4.setState({ versionShow: true });
        },
        className: "versionMeg",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 440
        }
      }, "\u7248\u672C\u4ECB\u7ECD")), _react2.default.createElement("div", { className: "myBorder", __source: {
          fileName: _jsxFileName,
          lineNumber: 449
        }
      }), _react2.default.createElement("div", { className: "text", __source: {
          fileName: _jsxFileName,
          lineNumber: 450
        }
      }, _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 451
        }
      }, "\u60A8\u6B63\u5728\u4F7F\u7528\u7684\u662F", _react2.default.createElement("b", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 452
        }
      }, " \u8682\u8681\u5206\u5DE5\u514D\u8D39\u7248"), "\uFF0C\u514D\u8D39\u7248\u6BCF\u6708\u53EF\u521B\u5EFA", _react2.default.createElement("b", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 453
        }
      }, " 200 "), "\u6761\u4EFB\u52A1\uFF0C\u672C\u6708\u4EFB\u52A1\u7528\u91CF\u5DF2\u8FBE\u7248\u672C\u4E0A\u9650\u3002"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 455
        }
      }, "\u5982\u60A8\u7684\u56E2\u961F\u9879\u76EE\u548C\u4EFB\u52A1\u6570\u91CF\u8F83\u591A\uFF0C\u53EF\u5347\u7EA7\u4E3A\u7ECF\u6D4E\u5B9E\u60E0\u7684", _react2.default.createElement("b", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 457
        }
      }, " \u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248"), "\uFF0C\u57FA\u7840\u7248\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 460
        }
      }, "\u6211\u4EEC\u66F4\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u529F\u80FD\u5F3A\u5927\u7684", _react2.default.createElement("b", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 461
        }
      }, " \u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248"), "\uFF0C\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u63D0\u5347\u9879\u76EE\u7BA1\u7406\u6C34\u5E73\u3002")), _react2.default.createElement("div", { className: "renew", __source: {
          fileName: _jsxFileName,
          lineNumber: 465
        }
      }, _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 468
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 470
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0px 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 471
          }
        }), _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmMaYi.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 10px 0 40px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 479
          }
        })) : _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmMaYi.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 10px 0px 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 489
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 466
        }
      }, _react2.default.createElement(_button2.default, {
        type: "primary",
        style: { marginRight: "20px", height: "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 503
        }
      }, "\u5347\u7EA7\u4E13\u4E1A\u7248")), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 512
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 514
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0px 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 515
          }
        }), _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmMaYi.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 10px 0 40px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 523
          }
        })) : _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmMaYi.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 10px 0px 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 533
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 510
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 547
        }
      }, "\u5347\u7EA7\u57FA\u7840\u7248"))))), _react2.default.createElement("div", { className: "headerBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 554
        }
      }, _react2.default.createElement("div", { className: "headerLeft", __source: {
          fileName: _jsxFileName,
          lineNumber: 555
        }
      }, user && user.antIsvCorpSuite.corpid === "dinga8f7deb1c55b020c35c2f4657eb6378f" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 559
        }
      }, act.indexOf("/pc_task") !== -1 || act.indexOf("/pc_projectDetails") !== -1 || act.indexOf("/pc_dynamicNew") !== -1 || act.indexOf("/pc_census") !== -1 || act.indexOf("/pc_project") !== -1 ? _react2.default.createElement(_icon2.default, {
        type: "menu-unfold",
        className: "barIcon",
        onClick: function onClick() {
          _this4.menuSwitch();
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 565
        }
      }) : "", _react2.default.createElement("div", { className: "lyTitle", __source: {
          fileName: _jsxFileName,
          lineNumber: 575
        }
      }, _react2.default.createElement("div", { className: "title", __source: {
          fileName: _jsxFileName,
          lineNumber: 576
        }
      }, _react2.default.createElement("div", { className: "imgBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 577
        }
      }, _react2.default.createElement("img", { src: "../static/react-static/pcvip/imgs/shihua.jpg", __source: {
          fileName: _jsxFileName,
          lineNumber: 578
        }
      })), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 580
        }
      }, "\u70BC\u6CB9\u5206\u90E8\u7A7F\u900F\u5F0F\u7BA1\u7406\u5E73\u53F0")), _react2.default.createElement("div", { className: "enName", __source: {
          fileName: _jsxFileName,
          lineNumber: 582
        }
      }, "Management Platform"))) : _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 586
        }
      }, act.indexOf("/pc_task") !== -1 || act.indexOf("/pc_projectDetails") !== -1 || act.indexOf("/pc_dynamicNew") !== -1 || act.indexOf("/pc_census") !== -1 || act.indexOf("/pc_project") !== -1 ? _react2.default.createElement(_icon2.default, {
        type: "menu-unfold",
        className: "barIcon",
        onClick: function onClick() {
          _this4.menuSwitch();
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 592
        }
      }) : "", _react2.default.createElement("div", { className: "ant-dropdown-link", __source: {
          fileName: _jsxFileName,
          lineNumber: 602
        }
      }, _react2.default.createElement("div", { className: "title", __source: {
          fileName: _jsxFileName,
          lineNumber: 603
        }
      }, "\u8682\u8681\u5206\u5DE5", _react2.default.createElement("span", {
        className: "spanicon",
        style: (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" ? {
          top: (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" || (0, _util.getTeamInfoWithMoney)("版本名称") !== "试用版" && (0, _util.getTeamInfoWithMoney)("剩余天数") < 16 && (0, _util.getTeamInfoWithMoney)("版本名称") !== "免费版" ? "-2px" : "8px"
        } : (0, _util.getTeamInfoWithMoney)("版本名称") === "专业版" ? {
          top: (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" || (0, _util.getTeamInfoWithMoney)("版本名称") !== "试用版" && (0, _util.getTeamInfoWithMoney)("剩余天数") < 16 && (0, _util.getTeamInfoWithMoney)("版本名称") !== "免费版" ? "-2px" : "8px"
        } : (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? {
          top: (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" || (0, _util.getTeamInfoWithMoney)("版本名称") !== "试用版" && (0, _util.getTeamInfoWithMoney)("剩余天数") < 16 && (0, _util.getTeamInfoWithMoney)("版本名称") !== "免费版" ? "-2px" : "8px"
        } : (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? {
          top: (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" || (0, _util.getTeamInfoWithMoney)("版本名称") !== "试用版" && (0, _util.getTeamInfoWithMoney)("剩余天数") < 16 && (0, _util.getTeamInfoWithMoney)("版本名称") !== "免费版" ? "-2px" : "8px"
        } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 605
        }
      }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 664
        }
      }, _react2.default.createElement("span", {
        className: isIos ? "titleImg freeTitle" : "titleImg freeTitles",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 665
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-star1", __source: {
          fileName: _jsxFileName,
          lineNumber: 672
        }
      })), _react2.default.createElement("p", { className: "free", __source: {
          fileName: _jsxFileName,
          lineNumber: 674
        }
      }, "\u514D\u8D39\u7248")) : (0, _util.getTeamInfoWithMoney)("版本名称") === "专业版" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 677
        }
      }, _react2.default.createElement("span", { className: isIos ? "titleImg" : "titleImgs", __source: {
          fileName: _jsxFileName,
          lineNumber: 678
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-diamond", __source: {
          fileName: _jsxFileName,
          lineNumber: 679
        }
      })), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 681
        }
      }, "\u4E13\u4E1A\u7248")) : (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 684
        }
      }, _react2.default.createElement("span", {
        className: isIos ? "titleImg bascTitle" : "titleImg bascTitles",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 685
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-triangle", __source: {
          fileName: _jsxFileName,
          lineNumber: 692
        }
      })), _react2.default.createElement("p", { className: "basc", __source: {
          fileName: _jsxFileName,
          lineNumber: 694
        }
      }, "\u57FA\u7840\u7248")) : (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 697
        }
      }, _react2.default.createElement("span", {
        className: isIos ? "titleImg text" : "titleImg text",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 698
        }
      }, "\u8BD5"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 705
        }
      }, "\u4E13\u4E1A\u7248")) : ""), (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" || (0, _util.getTeamInfoWithMoney)("版本名称") !== "试用版" && (0, _util.getTeamInfoWithMoney)("剩余天数") < 16 && (0, _util.getTeamInfoWithMoney)("版本名称") !== "免费版" ? _react2.default.createElement("div", { className: "p", __source: {
          fileName: _jsxFileName,
          lineNumber: 715
        }
      }, "\u5269\u4F59\xA0", _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 717
        }
      }, (0, _util.getTeamInfoWithMoney)("剩余天数") < 0 ? 0 : (0, _util.getTeamInfoWithMoney)("剩余天数")), "\xA0\u5929") : "")))), _react2.default.createElement("div", { className: "headerCenter", __source: {
          fileName: _jsxFileName,
          lineNumber: 732
        }
      }, _react2.default.createElement("ul", { className: "header-menu", __source: {
          fileName: _jsxFileName,
          lineNumber: 733
        }
      }, _react2.default.createElement("li", {
        className: act.indexOf("/pc_task") !== -1 ? "act" : "",
        onClick: function onClick() {
          _index2.default.push("/pc_task");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 734
        }
      }, "\u4EFB\u52A1"), _react2.default.createElement("li", {
        className: act.indexOf("/pc_project") !== -1 ? "act" : "",
        onClick: function onClick() {
          _index2.default.push("/pc_project");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 742
        }
      }, "\u9879\u76EE"), _react2.default.createElement("li", {
        className: act.indexOf("/pc_census") !== -1 || act.indexOf("/pc_basic_statistics") !== -1 ? "act" : "",
        onClick: function onClick() {
          if ((0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版") {
            _index2.default.push("/pc_basic_statistics");
          } else {
            isAysc === "1" || (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? _index2.default.push("/pc_census") : _message3.default.warning("跨项目统计功能仅团队管理员可用", 2);
          }
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 750
        }
      }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? _react2.default.createElement("span", {
        style: { position: "absolute", top: -3, marginLeft: -20 },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 774
        }
      }, _react2.default.createElement("svg", { className: "pro-icon zuanshi", "aria-hidden": "true", __source: {
          fileName: _jsxFileName,
          lineNumber: 777
        }
      }, _react2.default.createElement("use", { xlinkHref: "#pro-myfg-zuanshi", __source: {
          fileName: _jsxFileName,
          lineNumber: 778
        }
      }))) : "", "\u7EDF\u8BA1"), _react2.default.createElement("li", {
        className: act.indexOf("/pc_dynamicNew") !== -1 ? "act" : "",
        onClick: function onClick() {
          _index2.default.push("/pc_dynamicNew");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 786
        }
      }, "\u52A8\u6001"))), _react2.default.createElement("div", { className: "headerRight", __source: {
          fileName: _jsxFileName,
          lineNumber: 796
        }
      }, _react2.default.createElement("div", { style: { minWidth: 230 }, __source: {
          fileName: _jsxFileName,
          lineNumber: 797
        }
      }, _react2.default.createElement("div", {
        className: "setup",
        onClick: function onClick() {
          _this4.setState({ messageShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 798
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 804
        }
      }, "\u901A\u77E5(", messageCount > 100 ? "99+" : messageCount, ")")), _react2.default.createElement("div", {
        className: "setup",
        onClick: function onClick() {
          _index2.default.push("/pc_help");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 806
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 812
        }
      }, "\u5E2E\u52A9")), _react2.default.createElement(_dropdown2.default, {
        overlay: menu,
        trigger: ["click"],
        placement: "topCenter",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 814
        }
      }, _react2.default.createElement("div", { className: "setup", __source: {
          fileName: _jsxFileName,
          lineNumber: 819
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 820
        }
      }, "\u8BBE\u7F6E"))), _react2.default.createElement("div", { className: "menu_down", __source: {
          fileName: _jsxFileName,
          lineNumber: 823
        }
      }, user.photo ? _react2.default.createElement("img", { className: "img", src: user.photo, __source: {
          fileName: _jsxFileName,
          lineNumber: 825
        }
      }) : _react2.default.createElement("div", { className: "user", __source: {
          fileName: _jsxFileName,
          lineNumber: 827
        }
      }, user.nickname)))), messageShow ? _react2.default.createElement(_message5.default, {
        closeCallBack: function closeCallBack() {
          _this4.setState({ messageShow: false });
        },
        messageCountOnChange: function messageCountOnChange(val) {
          _this4.setState({ messageCount: val });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 833
        }
      }) : "", feedShow ? _react2.default.createElement(_feedback2.default, {
        feedbackShow: feedShow,
        closeCallBack: function closeCallBack() {
          _this4.setState({ feedShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 845
        }
      }) : "", projectManage ? _react2.default.createElement(_tagManage2.default, {
        type: "3",
        title: "\u9879\u76EE\u6807\u7B7E\u7BA1\u7406",
        closedCallBack: function closedCallBack() {
          _this4.setState({ projectManage: false });
        },
        canEdit: isAysc,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 855
        }
      }) : "", publicManage ? _react2.default.createElement(_tagManageTask2.default, {
        type: "2",
        title: "\u4EFB\u52A1\u6807\u7B7E\u7BA1\u7406",
        canEdit: isAysc,
        closedCallBack: function closedCallBack() {
          _this4.setState({ publicManage: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 867
        }
      }) : "", authoriShow ? _react2.default.createElement(_authorization2.default, {
        closedCallBack: function closedCallBack() {
          _this4.setState({ authoriShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 879
        }
      }) : "")));
    }
  }]);

  return Head;
}(_react2.default.Component);

exports.default = Head;