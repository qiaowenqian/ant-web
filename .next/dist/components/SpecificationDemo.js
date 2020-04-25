'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _modal = require('antd/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'D:\\work\\pc-new\\components\\SpecificationDemo.js';


/*
 （选填） closeCallBack()    // 关闭回调
 */

var SpecificationDemo = function (_React$Component) {
    (0, _inherits3.default)(SpecificationDemo, _React$Component);

    function SpecificationDemo(props) {
        (0, _classCallCheck3.default)(this, SpecificationDemo);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SpecificationDemo.__proto__ || (0, _getPrototypeOf2.default)(SpecificationDemo)).call(this, props));

        _this.state = {
            visible: true
        };
        return _this;
    }

    (0, _createClass3.default)(SpecificationDemo, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.setState = function (state, callback) {
                return;
            };
        }
    }, {
        key: 'closeModal',
        value: function closeModal() {
            if (this.props.closeCallBack) {
                this.props.closeCallBack();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var visible = this.state.visible;

            return _react2.default.createElement(_modal2.default, {
                visible: visible,
                width: 1000,
                closable: true,
                onCancel: function onCancel() {
                    _this2.closeModal();
                },
                footer: null,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27
                }
            }, _react2.default.createElement('img', { src: '../static/react-static/pcvip/imgs/shouquan.gif', style: { width: 960 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 34
                }
            }));
        }
    }]);

    return SpecificationDemo;
}(_react2.default.Component);

exports.default = SpecificationDemo;