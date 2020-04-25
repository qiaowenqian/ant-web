"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _row = require("antd/lib/row");

var _row2 = _interopRequireDefault(_row);

var _col = require("antd/lib/col");

var _col2 = _interopRequireDefault(_col);

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

var _versionUpdate = require("../styles/components/versionUpdate.scss");

var _versionUpdate2 = _interopRequireDefault(_versionUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\versionUpdate.js";


/*
 （选填） closeCallBack()    // 关闭回调
 */

var MoneyEnd = function (_React$Component) {
  (0, _inherits3.default)(MoneyEnd, _React$Component);

  function MoneyEnd(props) {
    (0, _classCallCheck3.default)(this, MoneyEnd);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MoneyEnd.__proto__ || (0, _getPrototypeOf2.default)(MoneyEnd)).call(this, props));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(MoneyEnd, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      if (this.props.closeCallBack) {
        this.props.closeCallBack();
      } else {
        this.setState({ visible: false });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var versionUpdateShow = this.props.versionUpdateShow;

      return _react2.default.createElement(_modal2.default, {
        visible: versionUpdateShow,
        width: 800,
        closable: true,
        onCancel: function onCancel() {
          _this2.closeModal();
        },
        footer: null,
        mask: true,
        className: "upMask",
        wrapClassName: "versionModel",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _versionUpdate2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        }
      }), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNew", __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        }
      }, "2.3.0"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        }
      }, "2019.04.16")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        }
      }, _react2.default.createElement("span", { className: "dotBlue", __source: {
          fileName: _jsxFileName,
          lineNumber: 48
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      }, "\u9879\u76EE\u5F52\u6863\u53CA\u591A\u9879\u4F18\u5316", _react2.default.createElement("span", {
        className: "upGif",
        onClick: function onClick() {
          _this2.props.VersionFile(true);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        }
      }, "GIF")), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 60
        }
      }, "1\u3001\u589E\u52A0\u9879\u76EE\u5F52\u6863\u529F\u80FD", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        }
      }), "2\u3001\u9879\u76EE\u9875\u589E\u52A0\u7B5B\u9009\u548C\u6392\u5E8F\uFF0C\u4F18\u5316\u89C6\u89C9\u663E\u793A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 64
        }
      }), "3\u3001\u7B5B\u9009\u9879\u76EE\u540E\u7684\u6761\u4EF6\u548C\u4F4D\u7F6E\u4FEE\u6539\u4E3A\u5728\u8FD4\u56DE\u65F6\u4E0D\u6E05\u9664", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 66
        }
      }), "4\u3001\u7B5B\u9009\u6392\u5E8F\u7A97\u53E3\u589E\u52A0\u5E38\u9A7B\u529F\u80FD", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 68
        }
      }), "5\u3001\u5F00\u653E\u201C\u6211\u7684\u4EFB\u52A1\u201D\uFF0C\u53EF\u67E5\u770B\u4E0D\u5206\u65F6\u95F4\u6BB5\u7684\u76F8\u5173\u4EFB\u52A1", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        }
      }), "6\u3001\u8C03\u6574\u6807\u7B7E\u7BA1\u7406\u6743\u9650\uFF0C\u57FA\u7840\u7248\u53EF\u5BF9\u5DF2\u6709\u6807\u7B7E\u8FDB\u884C\u4FEE\u6539\u6216\u5220\u9664", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        }
      }), "7\u3001\u4EFB\u52A1\u4E2D\u7684\u4EBA\u5458\u7B5B\u9009\u652F\u6301\u9009\u62E9\u591A\u4EBA", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      }), "8\u3001\u4FEE\u590D\u590D\u5236\u9879\u76EE\u65F6\u54CD\u5E94\u7F13\u6162\u7684\u95EE\u9898", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }), "9\u3001\u4FEE\u590D\u5BCC\u6587\u672C\u683C\u5F0F\u5BFC\u81F4\u7684\u663E\u793A\u4E71\u7801\u95EE\u9898"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 81
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 82
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 83
        }
      }, "2.2.9"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 84
        }
      }, "2019.03.26")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 86
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        }
      }, "\u56DE\u6536\u7AD9\u529F\u80FD ", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("span", {
        className: "upGif",
        onClick: function onClick() {
          _this2.props.recycleGif(true);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 90
        }
      }, "GIF")), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 99
        }
      }, "1\u3001\u5728\u8BBE\u7F6E\u4E2D\u589E\u52A0\u4E86\u56DE\u6536\u7AD9\u5165\u53E3\uFF0C\u4E13\u4E1A\u7248\u53EF\u6062\u590D\u6700\u8FD130\u5929\u5220\u9664\u7684\u4EFB\u52A1\u548C\u9879\u76EE", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 101
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 102
        }
      }), "2\u3001\u5728\u9879\u76EE\u8BBE\u7F6E\u4E2D\u589E\u52A0\u4E86\u590D\u5236\u529F\u80FD\uFF0C\u4E13\u4E1A\u7248\u53EF\u901A\u8FC7\u590D\u5236\u5FEB\u901F\u521B\u5EFA\u9879\u76EE", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }), "3\u3001\u4FEE\u590D\u9879\u76EE\u6807\u7B7E\u4E0E\u4EFB\u52A1\u6807\u7B7E\u65E0\u6CD5\u540C\u540D\u7684\u95EE\u9898", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 107
        }
      }), "4\u3001\u4FEE\u590D\u4EFB\u52A1\u8BE6\u60C5\u4E2D\u70B9\u51FB@\u9875\u9762\u4F1A\u8FD4\u56DE\u9876\u90E8\u7684\u95EE\u9898"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 112
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 113
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 114
        }
      }, "2.2.8"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 115
        }
      }, "2019.03.15")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 117
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 118
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 119
        }
      }, "\u8C03\u6574\u4EFB\u52A1\u5206\u7EC4"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        }
      }, "1\u3001\u4EFB\u52A1\u5206\u7EC4\u65B0\u589E\u4ECA\u65E5\u4EFB\u52A1\u3001\u6700\u8FD17\u5929\u3001\u6700\u8FD130\u5929\uFF0C\u5173\u6CE8\u4E0D\u540C\u65F6\u6BB5\u8981\u505A\u7684\u4E8B\uFF0C\u56DE\u987E\u505A\u8FC7\u7684\u4E8B", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 122
        }
      }), "2\u3001\u5BFC\u5165\u4EFB\u52A1\u4E2D\u589E\u52A0\u5BFC\u5165\u5173\u6CE8\u4EBA\u7684\u529F\u80FD", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 124
        }
      }), "3\u3001\u4EFB\u52A1\u63CF\u8FF0\u548C\u8BA8\u8BBA\u4E2D\u53EF\u81EA\u52A8\u8BC6\u522B URL\uFF0C\u70B9\u51FB\u53EF\u76F4\u63A5\u6253\u5F00", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 126
        }
      }), "4\u3001\u4F18\u5316\u521B\u5EFA\u4EFB\u52A1\u65F6\u641C\u7D22\u9879\u76EE\u7684\u529F\u80FD", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 128
        }
      }), "5\u3001\u4FEE\u590D\u4E2A\u522B\u64CD\u4F5C\u7684\u4EFB\u52A1\u65E5\u5FD7\u8BB0\u5F55\u95EE\u9898", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 130
        }
      }), "6\u3001\u4FEE\u590D\u6DFB\u52A0\u5173\u6CE8\u4EBA\u901A\u77E5\u7F3A\u5931\u7684\u95EE\u9898"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 135
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 136
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 137
        }
      }, "2.2.7"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 138
        }
      }, "2019.03.01")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 140
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 141
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 142
        }
      }, "\u4EFB\u52A1\u8BE6\u60C5\u9875\u4F53\u9A8C\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 143
        }
      }, "1\u3001\u8C03\u6574\u9875\u9762\u6574\u4F53\u5E03\u5C40\u4E0E\u6392\u7248", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 145
        }
      }), "2\u3001\u4F18\u5316\u5B50\u4EFB\u52A1\u3001\u534F\u4F5C\u4EFB\u52A1\u7684\u4EA4\u4E92\u4F53\u9A8C", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 147
        }
      }), "3\u3001\u4F18\u5316\u9875\u9762\u5185\u7BA1\u7406\u9644\u4EF6\u7684\u4EA4\u4E92\u4F53\u9A8C", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 149
        }
      }), "4\u3001\u8BA8\u8BBA\u4E0E\u65E5\u5FD7\u8C03\u6574\u4E3A\u5012\u5E8F\u663E\u793A\uFF0C\u6700\u65B0\u7684\u5728\u524D", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 151
        }
      }), "5\u3001\u89C4\u8303\u65E5\u5FD7\u683C\u5F0F\uFF0C\u5B8C\u6574\u8BB0\u5F55\u4EFB\u52A1\u7684\u6BCF\u4E00\u6B21\u53D8\u5316", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 153
        }
      }), "6\u3001\u4F18\u5316\u53D1\u5E03\u8BA8\u8BBA\u7684\u4EA4\u4E92\u4F53\u9A8C", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 155
        }
      }), "7\u3001\u8BA8\u8BBA\u4E2D\u589E\u52A0@\u529F\u80FD\uFF0C\u53EF\u63D0\u9192\u6307\u5B9A\u4EBA\u5458"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 160
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 161
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 162
        }
      }, "2.2.6"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 163
        }
      }, "2019.01.25")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 165
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 166
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 167
        }
      }, "\u591A\u9879\u529F\u80FD\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 168
        }
      }, "1\u3001\u9879\u76EE\u5185\u589E\u52A0\u5BF9\u4EFB\u52A1\u7684\u624B\u52A8\u6392\u5E8F\u529F\u80FD", _react2.default.createElement("span", {
        className: "upGif",
        onClick: function onClick() {
          _this2.props.sortGif(true);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 170
        }
      }, "GIF"), _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 178
        }
      }), "2\u3001\u4F18\u5316\u79FB\u52A8\u4E0E\u590D\u5236\u4EFB\u52A1\u7684\u4EA4\u4E92\uFF0C\u9009\u62E9\u4EFB\u52A1\u65F6\u652F\u6301\u6309\u540D\u79F0\u641C\u7D22", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 180
        }
      }), "3\u3001\u590D\u5236\u4EFB\u52A1\u65F6\u53EF\u5BF9\u5B50\u4EFB\u52A1\u7EDF\u4E00\u6DFB\u52A0\u524D\u7F00", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 182
        }
      }), "4\u3001\u57FA\u7840\u7248\u53EF\u8FDB\u884C\u9879\u76EE\u5185\u7684\u4EFB\u52A1\u79FB\u52A8\u548C\u590D\u5236", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 184
        }
      }), "5\u3001\u4EFB\u52A1\u8BE6\u60C5\u4E2D\u534F\u4F5C\u4EFB\u52A1\u589E\u52A0WBS\u7F16\u53F7\u663E\u793A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 186
        }
      }), "6\u3001\u4FEE\u590D\u5DF2\u77E5bug"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 191
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 192
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 193
        }
      }, "2.2.5"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 194
        }
      }, "2019.01.10")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 196
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 197
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 198
        }
      }, "\u4EFB\u52A1\u64CD\u4F5C\u6743\u9650\u63A7\u5236\u4E0E\u591A\u9879\u4F18\u5316", _react2.default.createElement("span", {
        className: "upGif",
        onClick: function onClick() {
          _this2.props.settingGif(true);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 200
        }
      }, "GIF")), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 209
        }
      }, "\u57FA\u7840\u7248\u548C\u4E13\u4E1A\u7248\u5747\u53EF\u5728\u9879\u76EE\u8BBE\u7F6E\u4E2D\u5BF9\u4EFB\u52A1\u7684\u521B\u5EFA\u3001\u4FEE\u6539\u3001\u5220\u9664\u8FDB\u884C\u81EA\u5B9A\u4E49\u7684\u6743\u9650\u8BBE\u7F6E\uFF0C\u65B9\u4FBF\u5728\u4E0D\u540C\u9879\u76EE\u4E2D\u5BF9\u4EFB\u52A1\u8FDB\u884C\u66F4\u52A0\u7075\u6D3B\u7684\u7BA1\u7406\u3002\u672C\u6B21\u66F4\u65B0\u540C\u65F6\u5305\u542B\u4EE5\u4E0B\u529F\u80FD\u4F18\u5316\uFF1A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 211
        }
      }), "1\u3001\u4EFB\u52A1\u6A21\u5757\u4E2D\u53EF\u5FEB\u901F\u67E5\u770B\u4ECA\u65E5\u65B0\u589E\u3001\u4ECA\u65E5\u5B8C\u6210\u7684\u4EFB\u52A1", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 213
        }
      }), "2\u3001\u4EFB\u52A1\u5217\u8868\u589E\u52A0\u5BF9\u672A\u5B8C\u6210\u4EFB\u52A1\u7684\u6570\u5B57\u7EDF\u8BA1", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 215
        }
      }), "3\u3001\u4EFB\u52A1\u6A21\u5757\u53EF\u5FEB\u901F\u67E5\u770B\u903E\u671F\u4EFB\u52A1", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 217
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 218
        }
      }), "4\u3001\u7B5B\u9009\u6392\u5E8F\u589E\u52A0\u6309\u622A\u6B62\u65F6\u95F4\u7684\u6392\u5E8F", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 220
        }
      }), "5\u3001\u7B5B\u9009\u6392\u5E8F\u5BF9\u57FA\u7840\u7248\u5F00\u653E\u8D1F\u8D23\u4EBA\u7B5B\u9009", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 222
        }
      }), "6\u3001\u9879\u76EE\u56FE\u6807\u652F\u6301\u4E0A\u4F20\u81EA\u5B9A\u4E49\u56FE\u7247", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 224
        }
      }), "7\u3001\u6807\u7B7E\u7BA1\u7406\u4E2D\u652F\u6301\u5C06\u6807\u7B7E\u62D6\u62FD\u79FB\u52A8\u81F3\u5176\u4ED6\u5206\u7EC4", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 226
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 227
        }
      }), "8\u3001\u4F18\u5316\u5E94\u7528\u5185\u6587\u5B57\u7F29\u7565\u89C4\u5219", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 229
        }
      })))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 233
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 234
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 235
        }
      }, "2.2.3"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 236
        }
      }, "2019.01.05")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 238
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 239
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 240
        }
      }, "8\u9879\u4F53\u9A8C\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 241
        }
      }, "1\u3001\u4F18\u5316\u5E94\u7528\u7684\u52A0\u8F7D\u4E0E\u54CD\u5E94\u901F\u5EA6", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 243
        }
      }), "2\u3001\u4F18\u5316\u7248\u672C\u4ECB\u7ECD\u7684\u529F\u80FD\u5BF9\u6BD4\u6837\u5F0F", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 245
        }
      }), "3\u3001\u4F18\u5316\u5404\u4E2A\u7248\u672C\u7684\u6807\u8BC6\u663E\u793A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 247
        }
      }), "4\u3001\u5728\u5404\u4E2A\u5217\u8868\u5E95\u90E8\u589E\u52A0\u6761\u76EE\u6570\u663E\u793A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 249
        }
      }), "5\u3001\u8C03\u6574\u7EE9\u6548\u9ED8\u8BA4\u503C\uFF0C\u9002\u5E94\u5927\u90E8\u5206\u4F01\u4E1A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 251
        }
      }), "6\u3001\u4F18\u5316\u5BFC\u51FA\u8868\u683C\uFF0C\u589E\u52A0\u65F6\u95F4\u663E\u793A", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 253
        }
      }), "7\u3001\u4FEE\u590D\u6807\u8BB0\u5B8C\u6210\u65F6\u6587\u672C\u683C\u5F0F\u6D88\u5931\u7684\u95EE\u9898", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 255
        }
      }), "8\u3001\u9879\u76EE\u4ECB\u7ECD\u53BB\u6389\u5B57\u6570\u9650\u5236", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 257
        }
      })))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 261
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 262
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 263
        }
      }, "2.2.0"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 264
        }
      }, "2018.12.14")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 266
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 267
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 268
        }
      }, "\u8DE8\u9879\u76EE\u7EDF\u8BA1\u6A21\u5757\u4E0A\u7EBF", _react2.default.createElement("span", { className: "upVersion", __source: {
          fileName: _jsxFileName,
          lineNumber: 270
        }
      }, "\u4E13\u4E1A\u7248"), _react2.default.createElement("span", {
        className: "upGif",
        onClick: function onClick() {
          _this2.props.demoShowTest(true);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 271
        }
      }, "GIF")), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 280
        }
      }, "\u4E13\u4E1A\u7248\u7528\u6237\u5728\u7EDF\u8BA1\u6A21\u5757\u4E2D\u901A\u8FC7\u7B5B\u9009\u9879\u76EE\uFF0C\u53EF\u5FEB\u901F\u67E5\u770B\u591A\u4E2A\u9879\u76EE\u4E2D\u5F53\u524D\u7684\u4EFB\u52A1\u5206\u5E03\u4EE5\u53CA\u5F85\u529E\u6392\u884C\uFF0C\u4E5F\u53EF\u5FEB\u901F\u7EDF\u8BA1\u51FA\u4E0D\u540C\u65F6\u95F4\u6BB5\u5185\u5404\u9879\u76EE\u4E0E\u4EBA\u5458\u7684\u7EE9\u6548\u503C\u6392\u884C\uFF0C\u540C\u65F6\u652F\u6301\u5BFC\u51FA\u5404\u7C7B\u5B8C\u6574\u7684\u7EDF\u8BA1\u6570\u636E\u3002"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 285
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 286
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 287
        }
      }, "2.1.5"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 288
        }
      }, "2018.12.07")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 290
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 291
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 292
        }
      }, "10\u9879\u529F\u80FD\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 293
        }
      }, "\u65B0\u589E\uFF1A\u9879\u76EE\u8BE6\u60C5\u9875\u5DE6\u680F\u589E\u52A0\u641C\u7D22\u4E0E\u6807\u7B7E\u7B5B\u9009\uFF0C\u5207\u6362\u66F4\u52A0\u65B9\u4FBF\uFF1B\u9879\u76EE\u5185\u6587\u4EF6\u5217\u8868\u589E\u52A0\u6587\u4EF6\u683C\u5F0F\u56FE\u6807\uFF0C\u67E5\u9605\u66F4\u52A0\u76F4\u89C2\uFF1B\u70B9\u51FB\u8BA8\u8BBA\u533A\u548C\u52A8\u6001\u7684\u4EBA\u5458\u5934\u50CF\u53EF\u663E\u793A\u9489\u9489\u8D44\u6599\u7A97\u53E3\uFF0C\u6C9F\u901A\u66F4\u52A0\u5FEB\u6377\uFF1B\u8BBE\u7F6E\u4E2D\u589E\u52A0\u6388\u6743\u4FE1\u606F\uFF0C\u968F\u65F6\u67E5\u770B\u5F53\u524D\u7248\u672C\u4E0E\u72B6\u6001\u3002\u4F18\u5316\uFF1A\u7F16\u8F91\u4EFB\u52A1\u65F6\u4E0D\u518D\u906E\u6321\u8F93\u5165\u533A\uFF1B\u6279\u91CF\u4FEE\u6539\u65F6\u70B9\u4EFB\u52A1\u884C\u5373\u53EF\u9009\u4E2D\u548C\u53CD\u9009\uFF1B\u8BB0\u5FC6\u66F4\u591A\u7528\u6237\u4E60\u60EF\u5982\u201C\u9690\u85CF\u5DF2\u5B8C\u6210\u201D\u7B49\uFF1B\u8C03\u6574\u7EDF\u8BA1\u56FE\u8868\u7684\u914D\u8272\uFF1B\u5FAE\u8C03\u7EE9\u6548\u7CFB\u6570\u4F7F\u66F4\u7B26\u5408\u7528\u6237\u89C6\u89D2\uFF1B\u8C03\u6574\u8BBE\u7F6E\u9879\u83DC\u5355\u5C42\u6B21\u3002"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 298
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 299
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 300
        }
      }, "2.1.4"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 301
        }
      }, "2018.11.18")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 303
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 304
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 305
        }
      }, "\u4EFB\u52A1\u7684\u9AD8\u7EA7\u7B5B\u9009\u4E0E\u6392\u5E8F"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 306
        }
      }, "\u91CD\u65B0\u8BBE\u8BA1\u4EFB\u52A1\u5217\u8868\u7684\u7B5B\u9009\u529F\u80FD\uFF0C\u4E13\u4E1A\u7248\u652F\u6301\u540C\u65F6\u6309\u9879\u76EE\u3001\u6807\u7B7E\u3001\u8D1F\u8D23\u4EBA\u3001\u786E\u8BA4\u4EBA\u3001\u622A\u6B62\u65F6\u95F4\u3001\u4EFB\u52A1\u7EE9\u6548\u7B49\u591A\u4E2A\u6761\u4EF6\u7B5B\u9009\uFF0C\u65B0\u589E\u652F\u6301\u4E0D\u540C\u7684\u6392\u5E8F\u65B9\u5F0F\uFF0C\u7B5B\u9009\u4E0E\u6392\u5E8F\u90FD\u5177\u6709\u8BB0\u5FC6\u529F\u80FD\uFF0C\u8D8A\u7528\u8D8A\u987A\u624B\u3002\u4EFB\u52A1\u622A\u6B62\u65F6\u95F4\u7CBE\u786E\u5230\u5206\u949F\uFF0C\u903E\u671F\u4E4B\u524D\u53CA\u65F6\u63D0\u9192\u3002\u540C\u65F6\u4F18\u5316\u4E86\u4E0D\u540C\u7248\u672C\u7684\u5F15\u5BFC\u5F39\u7A97\u4EE5\u53CA\u66F4\u6709\u6761\u7406\u7684\u7248\u672C\u66F4\u65B0\u8BF4\u660E\u3002"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 311
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 312
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 313
        }
      }, "2.1.3"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 314
        }
      }, "2018.10.16")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 316
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 317
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 318
        }
      }, "8\u9879\u529F\u80FD\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 319
        }
      }, "\u65B0\u589E\uFF1A\u5BF9\u4E8E\u5DF2\u79BB\u804C\u6216\u672A\u6388\u6743\u4EBA\u5458\u7684\u7279\u6B8A\u663E\u793A\u3001\u79FB\u52A8\u7AEF\u7684\u4EFB\u52A1\u641C\u7D22\u529F\u80FD\uFF1B\u4F18\u5316\uFF1A\u52A8\u6001\u5217\u8868\u7B5B\u9009\u6761\u4EF6\u53D8\u66F4\u540E\u5217\u8868\u81EA\u52A8\u56DE\u5230\u9876\u90E8\u3001\u4EBA\u5458\u7EDF\u8BA1\u56FE\u653E\u5927\u540E\u7684\u663E\u793A\u6548\u679C\u3001\u5DF2\u5B8C\u6210\u4EFB\u52A1\u7981\u6B62\u5220\u9664\u6210\u679C\u6587\u4EF6\u3001\u5BFC\u5165\u4EFB\u52A1\u7684\u4EA4\u4E92\u4E0E\u6D41\u7A0B\uFF1B\u4FEE\u590D\uFF1A\u624B\u52A8\u6362\u884C\u6392\u7248\u5728\u4E24\u7AEF\u663E\u793A\u4E0D\u4E00\u6837\u7684\u95EE\u9898\u3001\u91CC\u7A0B\u7891\u65E0\u6CD5\u53D6\u6D88\u7684\u95EE\u9898\u3001\u4E2A\u522B\u60C5\u51B5\u5168\u90E8\u4EFB\u52A1\u4E0B\u663E\u793A\u4E0D\u5B8C\u6574\u7684\u95EE\u9898\u3002"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 324
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 325
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 326
        }
      }, "2.1.2"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 327
        }
      }, "2018.09.30")), _react2.default.createElement(_col2.default, { span: 20, className: "upName moreText", __source: {
          fileName: _jsxFileName,
          lineNumber: 329
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 330
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 331
        }
      }, "8\u9879\u529F\u80FD\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 332
        }
      }, "\u65B0\u589E\uFF1A\u7518\u7279\u56FE\u56FE\u4F8B\u3001\u5206\u6279\u6B21\u5BFC\u51FA\u3001\u7EE9\u6548\u8BA1\u7B97\u5408\u6CD5\u6821\u9A8C\u3001\u70B9\u51FB\u6BCF\u65E5\u901A\u77E5\u53EF\u76F4\u63A5\u8DF3\u8F6C\u5DE5\u4F5C\u53F0\uFF1B \u4F18\u5316\uFF1A\u52A8\u6001\u5217\u8868\u4E2D\u4EFB\u52A1\u8DF3\u8F6C\u903B\u8F91\u3001 \u5DF2\u5220\u9664\u4EFB\u52A1\u7684\u63D0\u793A\u9875\u9762\u3001\u9879\u76EE\u8FDB\u5C55\u56FE\u7ED8\u5236\uFF1B\u4FEE\u590D\uFF1A\u5B50\u4EFB\u52A1\u5217\u8868\u50AC\u529E\u7F3A\u5931\u7684\u95EE\u9898 \u3002"))), _react2.default.createElement(_row2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 340
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 341
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 342
        }
      }, "2.1.1"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 343
        }
      }, "2018.09.21")), _react2.default.createElement(_col2.default, { span: 20, className: "upName moreTextlast", __source: {
          fileName: _jsxFileName,
          lineNumber: 345
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 346
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 347
        }
      }, "\u52A8\u6001\u5217\u8868\u4F53\u9A8C\u4F18\u5316"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 348
        }
      }, "\u5728\u5217\u8868\u4E2D\u76F4\u63A5\u663E\u793A\u4EFB\u52A1\u56FE\u7247\u53CA\u8BA8\u8BBA\u5185\u5BB9\uFF0C\u67E5\u770B\u66F4\u76F4\u89C2\uFF1B\u8C03\u6574UI\u5E03\u5C40\uFF0C\u5C42\u6B21\u66F4\u6E05\u6670\uFF1B\u7B5B\u9009\u529F\u80FD\u4F18\u5316\uFF0C\u4F7F\u7528\u66F4\u987A\u624B\u3002\u540C\u65F6\u5B8C\u6210\u4E86\u591A\u9879\u529F\u80FD\u4F18\u5316\uFF0C\u5982\u4FEE\u590D\u4E86\u6587\u4EF6\u5217\u8868\u4E2D\u8FC7\u7A0B\u6587\u4EF6\u7684\u7F3A\u5931\u95EE\u9898\u3001\u6807\u7B7E\u7BA1\u7406\u64CD\u4F5C\u4F18\u5316\u3001\u4EFB\u52A1\u6587\u4EF6\u53CA\u901A\u77E5\u6DFB\u52A0\u4EFB\u52A1\u7F16\u53F7\u7684\u663E\u793A\u7B49\u3002"))), _react2.default.createElement(_row2.default, { className: "lastText", __source: {
          fileName: _jsxFileName,
          lineNumber: 353
        }
      }, _react2.default.createElement(_col2.default, { span: 4, className: "upDateTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 354
        }
      }, _react2.default.createElement("div", { className: "upDateTimeNum", __source: {
          fileName: _jsxFileName,
          lineNumber: 355
        }
      }, "2.1.0"), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 356
        }
      }, "2018.09.08")), _react2.default.createElement(_col2.default, { span: 20, className: "upName", __source: {
          fileName: _jsxFileName,
          lineNumber: 358
        }
      }, _react2.default.createElement("span", { className: "dotbdbdbd", __source: {
          fileName: _jsxFileName,
          lineNumber: 359
        }
      }), _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 360
        }
      }, "\u4E13\u4E1A\u7248\u6B63\u5F0F\u4E0A\u7EBF"), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 361
        }
      }, "\u9879\u76EE\u4E2D\u65B0\u589E\u7518\u7279\u56FE\u3001\u8FDB\u5C55\u8D8B\u52BF\u56FE\u3001\u4EFB\u52A1\u5206\u5E03\u56FE\u3001\u4EBA\u5458\u5F85\u529E\u7EDF\u8BA1\u56FE\u4EE5\u53CA\u4EBA\u5458\u7EE9\u6548\u7EDF\u8BA1\u56FE\uFF0C\u65B0\u589E\u4EBA\u5458\u5F85\u529E\u4E0E\u7EE9\u6548\u7684\u5BFC\u51FA\u7684\u529F\u80FD\u3002\u4EFB\u52A1\u4E2D\u65B0\u589E\u201C\u5168\u90E8\u4EFB\u52A1\u201D\u89C6\u56FE\uFF0C\u652F\u6301\u9AD8\u7EA7\u7B5B\u9009\u53CA\u6279\u91CF\u64CD\u4F5C\uFF1B\u65B0\u589E\u4EFB\u52A1\u7684\u590D\u5236\u4E0E\u79FB\u52A8\uFF0C\u652F\u6301\u8DE8\u9879\u76EE\u64CD\u4F5C\uFF1B\u65B0\u589E\u4EFB\u52A1\u5B8C\u6210\u540E\u7684\u64A4\u56DE\u529F\u80FD\uFF0C\u652F\u6301\u5728\u9A73\u56DE\u3001\u786E\u8BA4\u4EFB\u52A1\u65F6\u4E0A\u4F20\u6587\u4EF6\uFF1B\u65B0\u589E\u5FEB\u6377\u9690\u85CF\u5DF2\u5B8C\u6210\u4E0E\u4EFB\u52A1\u5305\u7684\u529F\u80FD\u3002"))));
    }
  }]);

  return MoneyEnd;
}(_react2.default.Component);

exports.default = MoneyEnd;