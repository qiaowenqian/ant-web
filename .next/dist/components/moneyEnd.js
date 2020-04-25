"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

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

var _moneyEnd = require("../styles/components/moneyEnd.scss");

var _moneyEnd2 = _interopRequireDefault(_moneyEnd);

var _util = require("../core/utils/util");

var _FreeEdition = require("./FreeEdition");

var _FreeEdition2 = _interopRequireDefault(_FreeEdition);

var _SpecificationDemo = require("../components/SpecificationDemo");

var _SpecificationDemo2 = _interopRequireDefault(_SpecificationDemo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\moneyEnd.js";


/*
 * （必填）closeCallBack()         // 关闭回调
 * （选填）canClosed:true,         // 是否可关闭 默认可关闭
 */

var MoneyEnd = function (_React$Component) {
  (0, _inherits3.default)(MoneyEnd, _React$Component);

  function MoneyEnd(props) {
    (0, _classCallCheck3.default)(this, MoneyEnd);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MoneyEnd.__proto__ || (0, _getPrototypeOf2.default)(MoneyEnd)).call(this, props));

    _this.state = {
      versionShow: false,
      free: false,
      visible: true,
      demo: false
    };
    return _this;
  }

  (0, _createClass3.default)(MoneyEnd, [{
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "freeEdition",
    value: function freeEdition() {
      this.setState({ free: true });
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      if (this.state.free || this.state.versionShow) {
        this.setState({ free: false, versionShow: false });
      } else {
        if (this.props.closeCallBack) {
          this.props.closeCallBack();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          alertText = _props.alertText,
          canClosed = _props.canClosed;
      var _state = this.state,
          versionShow = _state.versionShow,
          free = _state.free,
          visible = _state.visible,
          demo = _state.demo;

      if (canClosed === undefined) {
        canClosed = true;
      }
      return _react2.default.createElement(_modal2.default, {
        visible: visible,
        width: free ? 650 : versionShow ? 850 : 520,
        closable: canClosed,
        onCancel: function onCancel() {
          _this2.closeModal();
        },
        footer: null,
        mask: true,
        className: "moneyEnd",
        maskClosable: false,
        style: free ? {} : versionShow ? {} : { top: 260, height: "400px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 53
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _moneyEnd2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 66
        }
      }), free ? _react2.default.createElement(_FreeEdition2.default, {
        closedCallBack: function closedCallBack() {
          _this2.setState({ free: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 68
        }
      }) : "", versionShow ? _react2.default.createElement("div", { className: "imgBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        }
      }, !canClosed ? _react2.default.createElement(_icon2.default, {
        type: "close",
        onClick: function onClick() {
          _this2.setState({ versionShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 80
        }
      }) : "", _react2.default.createElement("div", { className: "img", __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        }
      }, _react2.default.createElement("img", { src: "../static/react-static/pcvip/imgs/versionTable229.png?t=2.1", __source: {
          fileName: _jsxFileName,
          lineNumber: 90
        }
      }))) : "", demo ? _react2.default.createElement(_SpecificationDemo2.default, {
        closeCallBack: function closeCallBack() {
          _this2.setState({ demo: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 98
        }
      }) : "", _react2.default.createElement("div", {
        className: "writeBox",
        style: free || versionShow ? { display: "none" } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 106
        }
      }, _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 110
        }
      }, alertText[0], _react2.default.createElement("span", {
        onClick: function onClick() {
          _this2.setState({ versionShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 112
        }
      }, "\u7248\u672C\u4ECB\u7ECD")), _react2.default.createElement("div", { className: "myBorder", __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        }
      }), _react2.default.createElement("div", {
        className: "text",
        dangerouslySetInnerHTML: { __html: alertText[1] },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 121
        }
      }), _react2.default.createElement("div", { className: "renew", __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        }
      }, (0, _util.getTeamInfoWithMoney)("版本名称") === "试用版" && alertText[0] !== "使用人数超限" || alertText[2] === "MFB" ? _react2.default.createElement("div", { className: "bottomButton", __source: {
          fileName: _jsxFileName,
          lineNumber: 129
        }
      }, _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 132
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 134
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
            lineNumber: 135
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
            lineNumber: 143
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
            lineNumber: 153
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 130
        }
      }, _react2.default.createElement(_button2.default, {
        type: "primary",
        style: { marginRight: "20px", height: "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 167
        }
      }, "\u5347\u7EA7\u4E13\u4E1A\u7248")), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 176
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 178
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
            lineNumber: 179
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
            lineNumber: 187
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
            lineNumber: 197
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 174
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 211
        }
      }, "\u5347\u7EA7\u57FA\u7840\u7248")), alertText[2] === "MFB" ? _react2.default.createElement("span", {
        onClick: function onClick() {
          _this2.props.closeCallBack();
        },
        style: {
          color: "#BDBDBD",
          cursor: "pointer",
          marginLeft: "20px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 216
        }
      }, "\u7EE7\u7EED\u4F7F\u7528\u514D\u8D39\u7248", _react2.default.createElement(_icon2.default, { type: "right", __source: {
          fileName: _jsxFileName,
          lineNumber: 227
        }
      })) : !(0, _util.getTeamInfoWithMoney)("是否钉钉订单") && (0, _util.getTeamInfoWithMoney)("剩余天数") < 0 ? _react2.default.createElement("span", {
        onClick: function onClick() {
          _this2.freeEdition();
        },
        style: {
          color: "#BDBDBD",
          cursor: "pointer",
          marginLeft: "20px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 231
        }
      }, "\u4F7F\u7528\u514D\u8D39\u7248", _react2.default.createElement(_icon2.default, { type: "right", __source: {
          fileName: _jsxFileName,
          lineNumber: 242
        }
      })) : "") : alertText[0] === "使用人数超限" ? _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 249
        }
      }, _react2.default.createElement("span", {
        className: "shouquan",
        onClick: function onClick() {
          _this2.setState({ demo: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 250
        }
      }, "\u5982\u4F55\u7BA1\u7406\u6388\u6743\uFF1F"), _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 260
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 262
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
            lineNumber: 263
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
            lineNumber: 271
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
            lineNumber: 281
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 258
        }
      }, _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 295
        }
      }, "\u5347\u7EA7\u89C4\u683C"))) : _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 303
          }
        }, (0, _util.getTeamInfoWithMoney)("是否钉钉订单") ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 305
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
            lineNumber: 306
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
            lineNumber: 314
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
            lineNumber: 324
          }
        })),
        placement: "top",
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 301
        }
      }, alertText[0] === "专业版功能" ? _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 339
        }
      }, "\u5347\u7EA7\u4E13\u4E1A\u7248") : _react2.default.createElement(_button2.default, { type: "primary", style: { height: "30px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 343
        }
      }, "\u7EED\u8D39\u5347\u7EA7")))));
    }
  }]);

  return MoneyEnd;
}(_react2.default.Component);

exports.default = MoneyEnd;