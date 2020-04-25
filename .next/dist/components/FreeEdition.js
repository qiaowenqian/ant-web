'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _popover = require('antd/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

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

var _freeEdition = require('../styles/components/freeEdition.scss');

var _freeEdition2 = _interopRequireDefault(_freeEdition);

var _user = require('../core/service/user.service');

var _storage = require('../core/utils/storage');

var _storage2 = _interopRequireDefault(_storage);

var _util = require('../core/utils/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'D:\\work\\pc-new\\components\\FreeEdition.js';


/*
 * （必填）closedCallBack()         // 关闭回调
 * （选填）canClosed:true,         // 是否可关闭 默认可关闭
 */

var freeEdition = function (_React$Component) {
	(0, _inherits3.default)(freeEdition, _React$Component);

	function freeEdition(props) {
		(0, _classCallCheck3.default)(this, freeEdition);

		var _this = (0, _possibleConstructorReturn3.default)(this, (freeEdition.__proto__ || (0, _getPrototypeOf2.default)(freeEdition)).call(this, props));

		_this.state = {
			loading: false
		};
		return _this;
	}

	(0, _createClass3.default)(freeEdition, [{
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.setState = function (state, callback) {
				return;
			};
		}
	}, {
		key: 'freeEditionUse',
		value: function freeEditionUse() {
			this.setState({ loading: true });
			(0, _user.getFreeLimit)(function (data) {
				if (data.err) {
					return false;
				}
				_storage2.default.set('user', data);
				location.reload();
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement('div', { className: 'version', __source: {
					fileName: _jsxFileName,
					lineNumber: 37
				}
			}, _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: _freeEdition2.default }, __source: {
					fileName: _jsxFileName,
					lineNumber: 38
				}
			}), _react2.default.createElement('div', { className: 'edition', __source: {
					fileName: _jsxFileName,
					lineNumber: 39
				}
			}, _react2.default.createElement('div', { className: 'version2', __source: {
					fileName: _jsxFileName,
					lineNumber: 40
				}
			}, _react2.default.createElement('h3', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 41
				}
			}, '\u7248\u672C\u5BF9\u6BD4'), _react2.default.createElement(_icon2.default, { type: 'close', className: 'closeIcon', onClick: function onClick() {
					_this2.props.closedCallBack();
				}, __source: {
					fileName: _jsxFileName,
					lineNumber: 42
				}
			}), _react2.default.createElement('table', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 43
				}
			}, _react2.default.createElement('tbody', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 44
				}
			}, _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 46
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 47
				}
			}, '\u529F\u80FD'), _react2.default.createElement('td', { style: { color: '#199fd8' }, __source: {
					fileName: _jsxFileName,
					lineNumber: 48
				}
			}, '\u514D\u8D39\u7248'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 49
				}
			}, '\u57FA\u7840\u7248'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 50
				}
			}, '\u4E13\u4E1A\u7248')), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 52
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 53
				}
			}, '\u81EA\u52A8\u540C\u6B65\u9489\u9489\u7EC4\u7EC7\u67B6\u6784'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 55
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 55
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 56
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 56
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 57
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 57
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 59
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 60
				}
			}, '\u9489\u9489\u5B9E\u65F6\u5DE5\u4F5C\u901A\u77E5'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 61
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 61
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 62
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 62
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 63
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 63
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 65
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 66
				}
			}, '4W1H\u591A\u7EF4\u5EA6\u5B9A\u4E49\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 67
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 67
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 68
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 68
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 69
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 69
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 71
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 72
				}
			}, '\u65E0\u9650\u5206\u89E3\u5B50\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 73
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 73
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 74
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 74
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 75
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 75
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 77
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 78
				}
			}, '\u9489\u76D8\u5B58\u50A8\u5206\u7C7B\u4EFB\u52A1\u9644\u4EF6'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 79
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 79
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 80
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 80
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 81
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 81
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 83
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 84
				}
			}, '\u5173\u8054\u524D\u540E\u5DE5\u5E8F\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 85
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 86
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 87
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 87
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 89
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 90
				}
			}, '\u4EFB\u52A1\u5BFC\u5165\u5BFC\u51FA'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 91
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 92
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 93
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 93
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 95
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 96
				}
			}, '\u6279\u91CF\u4FEE\u6539\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 97
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 98
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 99
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 99
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 101
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 102
				}
			}, '\u8DE8\u9879\u76EE\u590D\u5236\u79FB\u52A8\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 103
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 104
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 105
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 105
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 107
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 108
				}
			}, 'WBS\u6761\u7406\u5316\u6C47\u603B\u6587\u4EF6'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 109
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 110
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 111
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 111
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 113
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 114
				}
			}, '\u7518\u7279\u56FE\u7BA1\u7406\u65F6\u95F4\u5E8F\u5217'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 115
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 116
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 117
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 117
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 119
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 120
				}
			}, '\u591A\u7EF4\u5EA6\u9879\u76EE\u6570\u636E\u7EDF\u8BA1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 121
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 122
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 123
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 123
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 125
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 126
				}
			}, '\u7CBE\u51C6\u5DE5\u4F5C\u52A8\u6001'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 127
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 127
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 128
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 128
				}
			})), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 129
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 129
				}
			}))), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 131
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 132
				}
			}, '\u591A\u7EF4\u5EA6\u7B5B\u9009\u8DDF\u8FDB\u4EFB\u52A1'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 133
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 134
				}
			}), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 135
				}
			}, _react2.default.createElement(_icon2.default, { type: 'check', __source: {
					fileName: _jsxFileName,
					lineNumber: 135
				}
			})))))), _react2.default.createElement('div', { className: 'version2 version3', __source: {
					fileName: _jsxFileName,
					lineNumber: 140
				}
			}, _react2.default.createElement('table', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 142
				}
			}, _react2.default.createElement('tbody', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 143
				}
			}, _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 145
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 146
				}
			}, '\u8D44\u6E90'), _react2.default.createElement('td', { style: { color: '#199fd8' }, __source: {
					fileName: _jsxFileName,
					lineNumber: 147
				}
			}, '\u514D\u8D39\u7248'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 148
				}
			}, '\u57FA\u7840\u7248'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 149
				}
			}, '\u4E13\u4E1A\u7248')), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 151
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 152
				}
			}, '\u56E2\u961F\u603B\u4EBA\u6570'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 153
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 154
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 155
				}
			}, '\u4E0D\u9650')), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 157
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 158
				}
			}, '\u5E94\u7528\u6388\u6743\u4EBA\u6570'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 159
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 160
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 161
				}
			}, '\u4E0D\u9650')), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 163
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 164
				}
			}, '\u9879\u76EE\u603B\u6570\u91CF'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 165
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 166
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 167
				}
			}, '\u4E0D\u9650')), _react2.default.createElement('tr', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 169
				}
			}, _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 170
				}
			}, '\u4EFB\u52A1\u603B\u6570\u91CF'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 171
				}
			}, '200\u6761/\u6708'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 172
				}
			}, '\u4E0D\u9650'), _react2.default.createElement('td', {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 173
				}
			}, '\u4E0D\u9650')))))), _react2.default.createElement('div', { className: 'enterFree', __source: {
					fileName: _jsxFileName,
					lineNumber: 180
				}
			}, _react2.default.createElement(_button2.default, {
				className: 'beginUse', type: 'primary',
				onClick: function onClick() {
					_this2.freeEditionUse();
				},
				loading: this.state.loading,
				__source: {
					fileName: _jsxFileName,
					lineNumber: 181
				}
			}, '\u5F00\u59CB\u4F7F\u7528'), _react2.default.createElement(_popover2.default, {
				content: _react2.default.createElement('img', { src: '../static/react-static/pcvip/imgs/ewmMaYi.png', style: { width: '200px', height: '200px' }, __source: {
						fileName: _jsxFileName,
						lineNumber: 188
					}
				}), placement: 'top', __source: {
					fileName: _jsxFileName,
					lineNumber: 186
				}
			}, _react2.default.createElement(_button2.default, {
				__source: {
					fileName: _jsxFileName,
					lineNumber: 190
				}
			}, '\u5347\u7EA7\u7248\u672C'))));
		}
	}]);

	return freeEdition;
}(_react2.default.Component);

exports.default = freeEdition;