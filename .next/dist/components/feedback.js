"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _input = require("antd/lib/input");

var _input2 = _interopRequireDefault(_input);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _message2 = require("antd/lib/message");

var _message3 = _interopRequireDefault(_message2);

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

var _feedback = require("../styles/components/feedback.scss");

var _feedback2 = _interopRequireDefault(_feedback);

var _feedback3 = require("../core/service/feedback.service");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\feedback.js";


var Feedback = function (_React$Component) {
  (0, _inherits3.default)(Feedback, _React$Component);

  function Feedback(props) {
    (0, _classCallCheck3.default)(this, Feedback);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Feedback.__proto__ || (0, _getPrototypeOf2.default)(Feedback)).call(this, props));

    _this.confirm = function () {
      _this.setState({ feedbackShow: false, mail: "", remarks: "" });
      _this.props.closeCallBack();
    };

    _this.ok = function () {
      var _this$state = _this.state,
          remarks = _this$state.remarks,
          mail = _this$state.mail;

      if (!remarks || remarks.trim().length < 1) {
        _message3.default.error("请输入您的建议或疑问");
      } else if (!mail) {
        _message3.default.error("请输入您的联系方式，如手机号");
      } else {
        _this.saveFeedback();
      }
    };

    _this.state = {
      loading: false,
      remarks: "", //反馈描述
      mail: "", //联系邮箱
      feedbackShow: false,
      versionShow: false
    };
    return _this;
  }

  (0, _createClass3.default)(Feedback, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.feedbackShow === true || this.props.feedbackShow === false) {
        this.setState({ feedbackShow: this.props.feedbackShow });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.feedbackShow === true || nextProps.feedbackShow === false) {
        this.setState({ feedbackShow: nextProps.feedbackShow });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "saveFeedback",
    value: function saveFeedback() {
      var _this2 = this;

      var _state = this.state,
          remarks = _state.remarks,
          mail = _state.mail,
          feedbackShow = _state.feedbackShow;

      (0, _feedback3.saveFeedback)(remarks, mail, function (data) {
        if (data.err) {
          return false;
        }
        if (data) {
          _message3.default.success("感谢您提出的宝贵意见");
          _this2.setState({ mail: "", remarks: "" });
          _this2.props.closeCallBack();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _state2 = this.state,
          remarks = _state2.remarks,
          mail = _state2.mail,
          loading = _state2.loading,
          feedbackShow = _state2.feedbackShow;

      return _react2.default.createElement(_modal2.default, {
        visible: feedbackShow,
        width: 520,
        onOk: this.ok,
        onCancel: this.confirm,
        maskClosable: false,
        afterClose: this.confirm,
        footer: null,
        className: "feedback_min",
        wrapClassName: "feedModel",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 63
        }
      }, _react2.default.createElement("div", { className: "feedback_box", __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _feedback2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        }
      }), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }, "\u8054\u7CFB\u670D\u52A1\u5546", _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement("img", {
          src: "../static/react-static/pcvip/imgs/ewmMaYi.png",
          style: {
            width: "200px",
            height: "230px",
            margin: "10px 10px 0px 10px"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 80
          }
        }),
        trigger: "click",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        }
      }, _react2.default.createElement("span", {
        onClick: function onClick() {
          _this3.setState({ versionShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 91
        }
      }, "\u5728\u7EBF\u5BA2\u670D"))), _react2.default.createElement("div", { className: "myBorder", __source: {
          fileName: _jsxFileName,
          lineNumber: 100
        }
      }), _react2.default.createElement("div", { className: "box", __source: {
          fileName: _jsxFileName,
          lineNumber: 102
        }
      }, _react2.default.createElement("span", { className: "title", __source: {
          fileName: _jsxFileName,
          lineNumber: 103
        }
      }, "\u53CD\u9988\u5185\u5BB9\uFF1A"), _react2.default.createElement("span", { className: "count", __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        }
      }, _react2.default.createElement("textarea", {
        className: "textar",
        rows: 4,
        placeholder: "\u60A8\u5728\u4F7F\u7528\u8682\u8681\u5206\u5DE5\u7684\u8FC7\u7A0B\u4E2D\uFF0C\u6709\u4EFB\u4F55\u7684\u5EFA\u8BAE\u6216\u7591\u95EE\uFF0C\u90FD\u53EF\u4EE5\u968F\u65F6\u63D0\u4EA4\u7ED9\u6211\u4EEC",
        value: remarks,
        onChange: function onChange(e) {
          _this3.setState({ remarks: e.target.value });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }))), _react2.default.createElement("div", { className: "box", __source: {
          fileName: _jsxFileName,
          lineNumber: 116
        }
      }, _react2.default.createElement("span", { className: "titleContain", __source: {
          fileName: _jsxFileName,
          lineNumber: 117
        }
      }, "\u8054\u7CFB\u65B9\u5F0F\uFF1A"), _react2.default.createElement("span", { className: "count", __source: {
          fileName: _jsxFileName,
          lineNumber: 118
        }
      }, _react2.default.createElement(_input2.default, {
        placeholder: "\u60A8\u7684\u8054\u7CFB\u65B9\u5F0F\uFF0C\u5982\u624B\u673A\u53F7",
        value: mail,
        onChange: function onChange(e) {
          _this3.setState({ mail: e.target.value });
        },
        maxLength: 30,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 119
        }
      }))), _react2.default.createElement("div", { className: "info", __source: {
          fileName: _jsxFileName,
          lineNumber: 129
        }
      }, "\u7535\u8BDD\uFF1A 029-85798790", _react2.default.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 131
        }
      }), "\u90AE\u7BB1\uFF1A 1001@antbim.com", _react2.default.createElement("div", { className: "btnBottom", __source: {
          fileName: _jsxFileName,
          lineNumber: 133
        }
      }, _react2.default.createElement(_button2.default, { key: "back", size: "large", onClick: this.confirm, __source: {
          fileName: _jsxFileName,
          lineNumber: 134
        }
      }, "\u5173\u95ED"), _react2.default.createElement(_button2.default, {
        key: "submit",
        type: "primary",
        size: "large",
        loading: loading,
        onClick: this.ok,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 137
        }
      }, "\u63D0\u4EA4")))));
    }
  }]);

  return Feedback;
}(_react2.default.Component);

exports.default = Feedback;