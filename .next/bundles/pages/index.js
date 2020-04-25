
          window.__NEXT_REGISTER_PAGE('/', function() {
            var comp = module.exports =
webpackJsonp([5],{

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__resourceQuery) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getPrototypeOf = __webpack_require__(32);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(16);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(17);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(34);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(33);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(81);

var _index2 = _interopRequireDefault(_index);

var _storage = __webpack_require__(558);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'D:\\work\\pc-new\\pages\\index.js?entry';


var Index = function (_React$Component) {
  (0, _inherits3.default)(Index, _React$Component);

  function Index() {
    (0, _classCallCheck3.default)(this, Index);

    return (0, _possibleConstructorReturn3.default)(this, (Index.__proto__ || (0, _getPrototypeOf2.default)(Index)).apply(this, arguments));
  }

  (0, _createClass3.default)(Index, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var token = _storage2.default.get('tokenUser');
      var loginName = _storage2.default.get('loginName');
      if (typeof token != 'undefined' && typeof loginName != 'undefined') {
        _index2.default.push('/pc_home');
      } else {
        _index2.default.push('/pc_login');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 15
        }
      });
    }
  }]);

  return Index;
}(_react2.default.Component);

exports.default = Index;

 ;(function register() { /* react-hot-loader/webpack */ if (true) { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "D:\\work\\pc-new\\pages\\index.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "D:\\work\\pc-new\\pages\\index.js"); } } })();
    (function (Component, route) {
      if (false) return
      if (false) return

      var qs = __webpack_require__(85)
      var params = qs.parse(__resourceQuery.slice(1))
      if (params.entry == null) return

      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(module.exports.default || module.exports, "/")
  
/* WEBPACK VAR INJECTION */}.call(exports, "?entry"))

/***/ }),

/***/ 558:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _stringify = __webpack_require__(556);

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = __webpack_require__(32);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(16);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(17);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(34);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(33);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _reactCookie = __webpack_require__(557);

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

 ;(function register() { /* react-hot-loader/webpack */ if (true) { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "D:\\work\\pc-new\\core\\utils\\storage.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "D:\\work\\pc-new\\core\\utils\\storage.js"); } } })();

/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(552);


/***/ })

},[559]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlc1xccGFnZXNcXGluZGV4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXM/ZDlkOTU2NSIsIndlYnBhY2s6Ly8vLi9jb3JlL3V0aWxzL3N0b3JhZ2UuanM/ZDlkOTU2NSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUm91dGVyIGZyb20gJ25leHQvcm91dGVyJ1xuaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi4vY29yZS91dGlscy9zdG9yYWdlJ1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB0b2tlbiA9IFN0b3JhZ2UuZ2V0KCd0b2tlblVzZXInKTtcbiAgICBjb25zdCBsb2dpbk5hbWUgPSBTdG9yYWdlLmdldCgnbG9naW5OYW1lJyk7XG4gICAgaWYgKHR5cGVvZiAodG9rZW4pICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiAobG9naW5OYW1lKSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgUm91dGVyLnB1c2goJy9wY19ob21lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJvdXRlci5wdXNoKCcvcGNfbG9naW4nKTtcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoPGRpdj48L2Rpdj4pXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhZ2VzP2VudHJ5IiwiXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNvb2tpZSBmcm9tICdyZWFjdC1jb29raWUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdHN0YXRpYyBzZXRTZXNzaW9uKGtleSwgdmFsdWUpIHtcclxuXHRcdC8vIGNvb2tpZei/h+acn+aXtumXtCAx5aSpXHJcblx0XHRjb25zdCBjdXJEYXRlID0gbmV3IERhdGUoKTsgICBcclxuXHRcdGxldCBleHBpcmUgPSBuZXcgRGF0ZShuZXcgRGF0ZShjdXJEYXRlKS5nZXRUaW1lKCkgKyAzKjI0KjYwKjYwKjEwMDApO1xyXG5cdFx0Y29va2llLnNhdmUoa2V5LCB2YWx1ZSwgeyBwYXRoOiAnLycgLGV4cGlyZXM6ZXhwaXJlfSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgc2V0KGtleSwgdmFsdWUpIHtcclxuXHRcdGlmKGtleSAmJiBjb29raWUpe1xyXG5cdFx0XHRjb29raWUuc2F2ZShrZXksIHZhbHVlLCB7IHBhdGg6ICcvJyAsbWF4QWdlOjEyOTcwMDB9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQoa2V5KSB7XHJcblx0XHRpZihrZXkgJiYgY29va2llKXtcclxuXHRcdFx0bGV0IGNvb2tpZURhdGEgPSBjb29raWUubG9hZChrZXkpO1xyXG5cdFx0XHRyZXR1cm4gY29va2llRGF0YT9jb29raWVEYXRhOicnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIHNldExvY2FsKGtleSwgdmFsdWUpIHtcclxuXHRcdHRyeSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSxKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRMb2NhbChrZXkpIHtcclxuXHRcdGlmKGtleSl7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcblx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyByZW1vdmUoa2V5KSB7XHJcblx0XHRjb29raWUucmVtb3ZlKGtleSwgeyBwYXRoOiAnLycgfSk7XHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29yZS91dGlscy9zdG9yYWdlLmpzIl0sIm1hcHBpbmdzIjoiO0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFFQTs7OztBQUVBOzs7QUFBQTtBQUNBO0FBREE7QUFBQTs7Ozs7QUFYQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRUE7QUFFQTtBQUFBO0FBQ0E7QUFDQTs7OztBQUdBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7OztBQUVBO0FBRUE7QUFBQTtBQURBO0FBR0E7QUFJQTs7OztBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBREE7QUFHQTtBQUVBO0FBQ0E7Ozs7QUFFQTtBQUNBOzs7OztBQTNDQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7Ozs7OztBIiwic291cmNlUm9vdCI6IiJ9
            return { page: comp.default }
          })
        