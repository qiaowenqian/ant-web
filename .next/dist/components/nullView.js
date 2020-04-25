'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _getPrototypeOf = require('next\\node_modules\\babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('next\\node_modules\\babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('next\\node_modules\\babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('next\\node_modules\\babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('next\\node_modules\\babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('next\\dist\\lib\\router\\index.js');

var _index2 = _interopRequireDefault(_index);

var _nullView = require('../styles/components/nullView.scss');

var _nullView2 = _interopRequireDefault(_nullView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'D:\\work\\pc-new\\components\\nullView.js';


/*
 * （选填）icon
 * （选填）butTxt
 * （选填）butUrl
 * （选填）showTit
 * （选填）showTxt
 * （选填）isLoadingErr:false,     // 是否是网络错误
 * （选填）restLoadingCallBack()   // 如果是网络错误，点击重试的回调
 */

var NullView = function (_React$Component) {
    (0, _inherits3.default)(NullView, _React$Component);

    function NullView(props) {
        (0, _classCallCheck3.default)(this, NullView);

        var _this = (0, _possibleConstructorReturn3.default)(this, (NullView.__proto__ || (0, _getPrototypeOf2.default)(NullView)).call(this, props));

        _this.state = {};
        return _this;
    }

    (0, _createClass3.default)(NullView, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.setState = function (state, callback) {
                return;
            };
        }
    }, {
        key: 'butClick',
        value: function butClick() {
            var butUrl = this.props.butUrl;

            if (butUrl) {
                _index2.default.push(butUrl);
            } else {
                this.props.restLoadingCallBack();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                icon = _props.icon,
                butTxt = _props.butTxt,
                butUrl = _props.butUrl,
                showTit = _props.showTit,
                showTxt = _props.showTxt,
                isLoadingErr = _props.isLoadingErr;

            if (isLoadingErr) {
                icon = 'ku';
                butTxt = '点击重试';
                showTit = '加载失败';
                showTxt = '你可以检查一下网络再试试哦';
            }
            if (!showTit) {
                showTit = '没有数据哦';
            }
            if (!icon) {
                icon = 'ku';
            }
            return _react2.default.createElement('div', { className: 'nullView', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 59
                }
            }, _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: _nullView2.default }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 60
                }
            }), _react2.default.createElement('div', { className: 'dataBox', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 61
                }
            }, _react2.default.createElement('div', { className: 'icon', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62
                }
            }, _react2.default.createElement('i', { className: "icon iconfont icon-" + icon, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62
                }
            })), _react2.default.createElement('div', { className: 'showTxt', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 63
                }
            }, showTit), _react2.default.createElement('div', { className: 'alertTxt', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 64
                }
            }, showTxt), butTxt || isLoadingErr ? _react2.default.createElement('div', { className: 'button', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66
                }
            }, _react2.default.createElement(_button2.default, { type: 'primary', onClick: function onClick() {
                    _this2.butClick();
                }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 67
                }
            }, butTxt)) : ''));
        }
    }]);

    return NullView;
}(_react2.default.Component);

exports.default = NullView;