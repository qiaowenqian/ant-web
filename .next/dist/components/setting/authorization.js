"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

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

var _authorization = require("../../styles/components/setting/authorization.scss");

var _authorization2 = _interopRequireDefault(_authorization);

var _util = require("../../core/utils/util");

var _storage = require("../../core/utils/storage");

var _storage2 = _interopRequireDefault(_storage);

var _task = require("../../core/service/task.service");

var _SpecificationDemo = require("../../components/SpecificationDemo");

var _SpecificationDemo2 = _interopRequireDefault(_SpecificationDemo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\setting\\authorization.js";


var authorization = function (_React$Component) {
  (0, _inherits3.default)(authorization, _React$Component);

  function authorization(props) {
    (0, _classCallCheck3.default)(this, authorization);

    var _this = (0, _possibleConstructorReturn3.default)(this, (authorization.__proto__ || (0, _getPrototypeOf2.default)(authorization)).call(this, props));

    _this.state = {
      versionShow: false,
      synUserCount: 0,
      buyUserCount: 0,
      endDate: "",
      limitNum: 0,
      gifShouquan: false
    };
    return _this;
  }

  (0, _createClass3.default)(authorization, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      var user = _storage2.default.get("user");
      this.setState({
        buyUserCount: user && user.antIsvCorpSuite && user.antIsvCorpSuite.buyUserCount,
        synUserCount: user && user.antIsvCorpSuite && user.antIsvCorpSuite.synUserCount,
        endDate: user && user.antIsvCorpSuite && user.antIsvCorpSuite.endDate
      });
      if ((0, _util.getTeamInfoWithMoney)("版本名称") === "免费版") {
        (0, _task.getLimtTask)(function (data) {
          _this2.setState({ limitNum: data.projectMax });
        });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.props.closedCallBack();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          versionShow = _state.versionShow,
          synUserCount = _state.synUserCount,
          buyUserCount = _state.buyUserCount,
          endDate = _state.endDate,
          limitNum = _state.limitNum,
          gifShouquan = _state.gifShouquan;

      var alertText = [(0, _util.getTeamInfoWithMoney)("版本名称") === "专业版" ? "\u60A8\u6B63\u5728\u4F7F\u7528<b> \u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248</b>\uFF0C\u6388\u6743\u6709\u6548\u671F\u622A\u6B62\u4E8E<b>" + endDate + " </b>\u3002\u6700\u5927\u53EF\u6388\u6743\u4EBA\u6570\u4E3A<b> " + buyUserCount + " </b>\u4EBA\uFF0C\u76EE\u524D\u5DF2\u6388\u6743 <b>" + synUserCount + " </b>\u4EBA\u3002\u60A8\u53EF\u63D0\u524D\u8FDB\u884C\u7EED\u8D39\u6216\u5347\u7EA7\u5230\u53EF\u5BB9\u7EB3\u66F4\u591A\u4EBA\u5458\u7684\u89C4\u683C\u3002" : (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? "\u60A8\u6B63\u5728\u4F7F\u7528<b> \u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248</b>\uFF0C\u6388\u6743\u6709\u6548\u671F\u622A\u6B62\u4E8E<b>" + endDate + " </b> \u3002\u60A8\u53EF\u63D0\u524D\u7EED\u8D39\u6216\u5347\u7EA7\u5230\u529F\u80FD\u66F4\u4E3A\u5F3A\u5927\u7684\u4E13\u4E1A\u7248\u3002" : (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? "\u60A8\u6B63\u5728<b> \u8BD5\u7528 </b>\u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248\uFF0C\u8BD5\u7528\u622A\u6B62\u4E8E<b>" + endDate + " </b> \uFF1B\u60A8\u53EF\u63D0\u524D\u4ED8\u8D39\u5347\u7EA7 \u5230\u7ECF\u6D4E\u5B9E\u60E0\u7684\u57FA\u7840\u7248\u6216\u529F\u80FD\u5F3A\u5927\u7684\u4E13\u4E1A\u7248\u3002" : (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" ? "<div class='free'>\u60A8\u6B63\u5728\u4F7F\u7528\u7684\u662F<b> \u8682\u8681\u5206\u5DE5\u514D\u8D39\u7248 </b>\uFF0C\u514D\u8D39\u7248\u5305\u542B\u4EFB\u52A1\u534F\u4F5C\u7684\u5B8C\u6574\u529F\u80FD\uFF0C\u53EF\u8F7B\u5EA6\u7528\n            \u4E8E\u65E5\u5E38\u5DE5\u4F5C\u4E2D\u4EFB\u52A1\u7684\u6709\u5E8F\u6307\u6D3E\u548C\u8DDF\u8FDB\u3002\u514D\u8D39\u7248\u6BCF\u6708\u53EF\u521B\u5EFA 200 \u6761\u4EFB\u52A1\uFF0C\u672C\u6708\u5DF2\n            \u7ECF\u521B\u5EFA " + limitNum + " \u6761\u4EFB\u52A1\uFF0C\u8FD8\u53EF\u521B\u5EFA" + (200 - limitNum) + " \u6761\u4EFB\u52A1\u3002</div>\n        \n            <div class='basic'>\u5982\u60A8\u7684\u56E2\u961F\u9879\u76EE\u548C\u4EFB\u52A1\u6570\u91CF\u8F83\u591A\uFF0C\u53EF\u5347\u7EA7\u4E3A\u7ECF\u6D4E\u5B9E\u60E0\u7684<b> \u8682\u8681\u5206\u5DE5\u57FA\u7840\u7248 </b>\uFF0C\u57FA\u7840\n            \u7248\u4E0D\u9650\u4F7F\u7528\u4EBA\u6570\u3001\u4E0D\u9650\u9879\u76EE\u6570\u91CF\u3001\u4E0D\u9650\u4EFB\u52A1\u6570\u91CF\u3002</div>\n        \n            div>\u6211\u4EEC\u66F4\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u529F\u80FD\u5F3A\u5927\u7684<b> \u8682\u8681\u5206\u5DE5\u4E13\u4E1A\u7248 </b>\uFF0C\u4E13\u4E1A\u7248\u5177\u6709\u6279\u91CF\u4EFB\u52A1\u64CD\u4F5C\u3001\n            \u7518\u7279\u56FE\u3001\u591A\u7EF4\u5EA6\u6570\u636E\u7EDF\u8BA1\u56FE\u8868\u7B49\u4E13\u4E1A\u529F\u80FD\uFF0C\u52A9\u60A8\u63D0\u9AD8\u534F\u540C\u5DE5\u4F5C\u6548\u7387\u3001\u63D0\u5347\u9879\u76EE\u3002\n            \u7BA1\u7406\u6C34\u5E73\u3002</div>" : ""];
      return _react2.default.createElement(_modal2.default, {
        visible: true,
        closable: true,
        onCancel: function onCancel() {
          _this3.closeModal();
        },
        width: versionShow ? 850 : 520,
        footer: null,
        mask: true,
        style: versionShow ? {} : { top: 260, height: "400px" },
        maskClosable: false,
        wrapClassName: "authorization",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _authorization2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 85
        }
      }), versionShow ? _react2.default.createElement("div", { className: "imgBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        }
      }, _react2.default.createElement("div", { className: "img", __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        }
      }, _react2.default.createElement("img", { src: "../static/react-static/pcvip/imgs/versionTable229.png?t=2.1", __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        }
      }))) : "", gifShouquan ? _react2.default.createElement(_SpecificationDemo2.default, {
        closeCallBack: function closeCallBack() {
          _this3.setState({ gifShouquan: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 96
        }
      }) : "", _react2.default.createElement("div", {
        className: "writeBox",
        style: versionShow ? { display: "none" } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }, _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 109
        }
      }, _react2.default.createElement("span", { className: "name", __source: {
          fileName: _jsxFileName,
          lineNumber: 110
        }
      }, "\u6388\u6743\u4FE1\u606F"), _react2.default.createElement("span", {
        onClick: function onClick() {
          _this3.setState({ versionShow: true });
        },
        className: "version",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 111
        }
      }, "\u7248\u672C\u4ECB\u7ECD")), _react2.default.createElement("div", { className: "myBorder", __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        }
      }), _react2.default.createElement("div", {
        className: "text",
        dangerouslySetInnerHTML: { __html: alertText },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 121
        }
      }), _react2.default.createElement("div", { className: "renew", __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        }
      }, (0, _util.getTeamInfoWithMoney)("版本名称") === "专业版" ? _react2.default.createElement("div", { className: "bottomButton", __source: {
          fileName: _jsxFileName,
          lineNumber: 127
        }
      }, _react2.default.createElement("span", {
        className: "shouquan",
        onClick: function onClick() {
          _this3.setState({ gifShouquan: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 128
        }
      }, "\u5982\u4F55\u7BA1\u7406\u6388\u6743\uFF1F"), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 138
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 140
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 141
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
            lineNumber: 149
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
            lineNumber: 159
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 136
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 173
        }
      }, "\u5347\u7EA7\u89C4\u683C"))) : (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 181
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 183
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 184
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
            lineNumber: 192
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
            lineNumber: 202
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 179
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 216
        }
      }, "\u7EED\u8D39\u5347\u7EA7")) : (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" ? _react2.default.createElement("div", { className: "bottomButton", __source: {
          fileName: _jsxFileName,
          lineNumber: 221
        }
      }, _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 224
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 226
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 227
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
            lineNumber: 235
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
            lineNumber: 245
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 222
        }
      }, _react2.default.createElement(_button2.default, {
        type: "primary",
        style: { marginRight: "20px", height: "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 259
        }
      }, "\u5347\u7EA7\u4E13\u4E1A\u7248")), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 268
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 270
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 271
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
            lineNumber: 279
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
            lineNumber: 289
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 266
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 303
        }
      }, "\u5347\u7EA7\u57FA\u7840\u7248"))) : (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" ? _react2.default.createElement("div", { className: "bottomButton", __source: {
          fileName: _jsxFileName,
          lineNumber: 309
        }
      }, _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 312
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 314
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 315
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
            lineNumber: 323
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
            lineNumber: 333
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 310
        }
      }, _react2.default.createElement(_button2.default, {
        type: "primary",
        style: { marginRight: "20px", height: "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 347
        }
      }, "\u5347\u7EA7\u4E13\u4E1A\u7248")), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 356
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 358
          }
        }, _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmDing.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 0 0 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 359
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
            lineNumber: 367
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
            lineNumber: 377
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 354
        }
      }, _react2.default.createElement(_button2.default, {
        type: "primary",
        style: { marginRight: "20px", height: "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 391
        }
      }, "\u5347\u7EA7\u57FA\u7840\u7248")), _react2.default.createElement("span", {
        onClick: function onClick() {
          _this3.closeModal();
        },
        style: {
          color: "#BDBDBD",
          cursor: "pointer"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 398
        }
      }, "\u7EE7\u7EED\u4F7F\u7528\u514D\u8D39\u7248", _react2.default.createElement(_icon2.default, { type: "right", __source: {
          fileName: _jsxFileName,
          lineNumber: 408
        }
      }))) : "")));
    }
  }]);

  return authorization;
}(_react2.default.Component);

exports.default = authorization;