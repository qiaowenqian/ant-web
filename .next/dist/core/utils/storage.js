'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _stringify = require('next\\node_modules\\babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Storage = function (_React$Component) {
	(0, _inherits3.default)(Storage, _React$Component);

	function Storage() {
		(0, _classCallCheck3.default)(this, Storage);

		return (0, _possibleConstructorReturn3.default)(this, (Storage.__proto__ || (0, _getPrototypeOf2.default)(Storage)).apply(this, arguments));
	}

	(0, _createClass3.default)(Storage, null, [{
		key: 'setSession',
		value: function setSession(key, value) {
			// cookie过期时间 1天
			var curDate = new Date();
			var expire = new Date(new Date(curDate).getTime() + 3 * 24 * 60 * 60 * 1000);
			_reactCookie2.default.save(key, value, { path: '/', expires: expire });
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			if (key && _reactCookie2.default) {
				_reactCookie2.default.save(key, value, { path: '/', maxAge: 1297000 });
			}
		}
	}, {
		key: 'get',
		value: function get(key) {
			if (key && _reactCookie2.default) {
				var cookieData = _reactCookie2.default.load(key);
				return cookieData ? cookieData : '';
			}
		}
	}, {
		key: 'setLocal',
		value: function setLocal(key, value) {
			try {
				localStorage.setItem(key, (0, _stringify2.default)(value));
			} catch (e) {
				localStorage.setItem(key, value);
			}
		}
	}, {
		key: 'getLocal',
		value: function getLocal(key) {
			if (key) {
				try {
					return JSON.parse(localStorage.getItem(key));
				} catch (e) {
					return localStorage.getItem(key);
				}
			}
		}
	}, {
		key: 'remove',
		value: function remove(key) {
			_reactCookie2.default.remove(key, { path: '/' });
		}
	}]);

	return Storage;
}(_react2.default.Component);

exports.default = Storage;