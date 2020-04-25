"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _document = require("next\\dist\\server\\document.js");

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\pages\\_document.js?entry";


var _default = function (_Document) {
  (0, _inherits3.default)(_default, _Document);

  function _default() {
    (0, _classCallCheck3.default)(this, _default);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_default.__proto__ || (0, _getPrototypeOf2.default)(_default)).call(this));

    _this.state = {
      page: '<!--[if lte IE 9]><script >document.getElementById("body").removeChild(document.getElementById("body").children[0])</script><style type="text/css">body > div:nth-child(1){height:0;}body > div:nth-child(2){height: 100%;}#ie6-warning{width:100%;height:100%;background:#ffffe1;padding:5px 0;font-size:12px;text-align: center;}#ie6-warning p{width:960px;margin:0 auto;}</style><div id="ie6-warning"><p>本页面采用HTML5+CSS3，您正在使用老版本 Internet Explorer ，在本页面的显示效果可能有差异。建议您升级到 <a href="http://www.microsoft.com/china/windows/internet-explorer/" target="_blank">Internet Explorer 10</a> 或以下浏览器：<br><a href="http://www.mozillaonline.com/"><img src="img/Firefox.png" style="height: 80px;width: 80px;" >Firefox</a><a href="http://rj.baidu.com/soft/detail/11843.html?ald"><img src="img/google.png" style="height: 80px;width: 80px;">Chrome</a><a href="http://rj.baidu.com/soft/detail/12966.html?ald"><img src="img/safari.png" style="height: 80px;width: 80px;">Safari</a><a href="http://www.operachina.com/"><img src="img/china.png" style="height: 80px;width: 80px;">Opera</a></p></div><![endif]-->'
    };
    return _this;
  }

  (0, _createClass3.default)(_default, [{
    key: "render",
    value: function render() {
      var page = this.state.page;

      return _react2.default.createElement("html", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 14
        }
      }, _react2.default.createElement(_document.Head, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 15
        }
      }, _react2.default.createElement("title", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 16
        }
      }, "\u8682\u8681\u5206\u5DE5"), _react2.default.createElement("meta", { charset: "utf-8", __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      }), _react2.default.createElement("meta", { "http-equiv": "X-UA-Compatible", content: "chrome=1", __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      }), _react2.default.createElement("meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge", __source: {
          fileName: _jsxFileName,
          lineNumber: 19
        }
      }), _react2.default.createElement("meta", { name: "renderer", content: "webkit", __source: {
          fileName: _jsxFileName,
          lineNumber: 20
        }
      }), _react2.default.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1", __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        }
      }), _react2.default.createElement("meta", {
        name: "keywords",
        content: "\u8682\u8681\uFF0C\u8682\u8681\u5206\u5DE5\uFF0C\u534F\u4F5C\u8F6F\u4EF6\uFF0C\u4EFB\u52A1\u7BA1\u7406\uFF0C\u9879\u76EE\u7BA1\u7406\uFF0C\u65E5\u7A0B\u7BA1\u7406\uFF0C\u6587\u6863\u7BA1\u7406\uFF0C\u79FB\u52A8\u529E\u516C\uFF0C\u4E91\u529E\u516C",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 22
        }
      }), _react2.default.createElement("meta", {
        name: "description",
        content: "\u8682\u8681\u5206\u5DE5\u662F\u4E00\u6B3E\u5DF2\u5206\u89E3\u548C\u534F\u540C\u4E3A\u57FA\u7840\uFF0C\u5B9E\u73B0\u590D\u6742\u9879\u76EE\u7684\u4E92\u8054\u7F51\u534F\u540C\u4E0E\u4EA4\u6613\u7684\u534F\u540C\u529E\u516C\u8F6F\u4EF6",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      }), _react2.default.createElement("meta", { name: "format-detection", content: "telephone=no, email=no", __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      }), _react2.default.createElement("meta", {
        name: "viewport",
        content: "width=device-width,height=device-height, user-scalable=no,initial-scale=1, minimum-scale=1, maximum-scale=1,target-densitydpi=device-dpi",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      }), _react2.default.createElement("link", {
        rel: "shortcut icon",
        href: "https://static.dingtalk.com/media/lALPBY0V4pWb8b_MyMzI_200_200.png",
        type: "image/x-icon",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 36
        }
      }), _react2.default.createElement("link", {
        rel: "stylesheet",
        type: "text/css",
        id: "J-theme-link",
        href: "../static/react-static/pcvip/css/common.css?t=3.0.6",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        }
      }), _react2.default.createElement("link", {
        rel: "stylesheet",
        type: "text/css",
        href: "../static/react-static/pcvip/fonts/iconfont.css?t=3.0.6",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      }), _react2.default.createElement("link", {
        rel: "stylesheet",
        href: "../static/react-static/pcvip/css/antd.min.css?t=3.0.6",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56
        }
      }), _react2.default.createElement("script", { src: "https://g.alicdn.com/dingding/dingtalk-pc-api/2.7.0/index.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        }
      }), _react2.default.createElement("link", {
        href: "/static/react-static/pcvip/plusGantt/miniui/themes/default/miniui.css?t=3.0.5",
        rel: "stylesheet",
        type: "text/css",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 64
        }
      })), _react2.default.createElement("body", { id: "body", style: { margin: 0 }, ondragstart: "return false", __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        }
      }, _react2.default.createElement(_document.Main, { style: { height: "100%" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 71
        }
      }), _react2.default.createElement(_document.NextScript, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        }
      }), _react2.default.createElement("div", { dangerouslySetInnerHTML: { __html: page }, __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        }
      }), _react2.default.createElement("div", { id: "file_img", __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      })), _react2.default.createElement("script", { src: "https://at.alicdn.com/t/font_941116_agkj4yfwxuq.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        }
      }), _react2.default.createElement("script", { src: "https://at.alicdn.com/t/font_899240_8jdk69z8ze8.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 79
        }
      }), _react2.default.createElement("script", { src: "https://at.alicdn.com/t/font_941116_m81azptz6x.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 81
        }
      }), _react2.default.createElement("script", {
        defer: true,
        src: "/static/react-static/pcvip/plusGantt/jquery-1.8.1.min.js",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 84
        }
      }), _react2.default.createElement("script", {
        defer: true,
        src: "/static/react-static/pcvip/plusGantt/miniui/miniui.js",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        }
      }), _react2.default.createElement("script", {
        defer: true,
        src: "/static/react-static/pcvip/plusGantt/plusgantt/GanttMenu.js",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 92
        }
      }), _react2.default.createElement("script", {
        defer: true,
        src: "/static/react-static/pcvip/plusGantt/plusgantt/GanttSchedule.js",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 96
        }
      }), _react2.default.createElement("script", {
        defer: true,
        src: "/static/react-static/pcvip/plusGantt/plusgantt/GanttService.js",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 100
        }
      }), _react2.default.createElement("script", { src: "https://gw.alipayobjects.com/os/antv/pkg/_antv.g2-3.4.1/dist/g2.min.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 106
        }
      }), _react2.default.createElement("script", { src: "https://gw.alipayobjects.com/os/antv/assets/data-set/0.8.3/data-set.min.js", __source: {
          fileName: _jsxFileName,
          lineNumber: 107
        }
      }));
    }
  }]);

  return _default;
}(_document2.default);

exports.default = _default;