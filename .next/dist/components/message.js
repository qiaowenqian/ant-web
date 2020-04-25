"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _row = require("antd/lib/row");

var _row2 = _interopRequireDefault(_row);

var _col = require("antd/lib/col");

var _col2 = _interopRequireDefault(_col);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _spin = require("antd/lib/spin");

var _spin2 = _interopRequireDefault(_spin);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _stringify = require("next\\node_modules\\babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBidirectionalInfiniteScroll = require("react-bidirectional-infinite-scroll");

var _reactBidirectionalInfiniteScroll2 = _interopRequireDefault(_reactBidirectionalInfiniteScroll);

var _index = require("next\\dist\\lib\\router\\index.js");

var _index2 = _interopRequireDefault(_index);

var _message = require("../styles/components/message.scss");

var _message2 = _interopRequireDefault(_message);

var _message3 = require("../core/service/message.service");

var _util = require("../core/utils/util");

var _nullView = require("../components/nullView");

var _nullView2 = _interopRequireDefault(_nullView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\message.js";

var confirm = _modal2.default.confirm;
/*********
 * closeCallBack()(必填)  //关闭回调
 * messageCountOnChange()(必填) // 返回未读数量
 *
 * ********/

var Message = function (_React$Component) {
  (0, _inherits3.default)(Message, _React$Component);

  function Message(props) {
    (0, _classCallCheck3.default)(this, Message);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Message.__proto__ || (0, _getPrototypeOf2.default)(Message)).call(this, props));

    _this2.confirm = function () {
      _this2.setState({ last: 1, read: "1" });
      _this2.props.closeCallBack();
    };

    _this2.state = {
      messData: [],
      page: 1, //当前页数
      last: 0, //总页数
      loading: false,
      messageListMoreLoading: false,
      taskDetailLoading: false,
      messageCount: 0, //未读数量
      finally: "none",
      topIcon: "none",
      read: 1,
      isRead: true, //已读
      selectIds: [],
      selectAllType: "0"
    };
    return _this2;
  }

  (0, _createClass3.default)(Message, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getMessage();
    }
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
    key: "getMessage",
    value: function getMessage() {
      var _this3 = this;

      var pageNow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (pageNow === 1) {
        this.setState({ loading: true });
      } else {
        this.setState({ messageListMoreLoading: true });
      }
      if (!pageNow) {
        pageNow = 1;
      }
      (0, _message3.findReadMessage)(pageNow, function (data) {
        if (data.err) {
          return false;
        }
        if (data) {
          if (data.list) {
            if (data.page === 1) {
              _this3.setState({
                messData: data.list,
                messageCount: data.messageCount,
                messageRedCount: data.messageRedCount,
                page: data.page,
                last: data.last
              });
              _this3.props.messageCountOnChange(data.messageCount);
            } else {
              var newPage = JSON.parse((0, _stringify2.default)(_this3.state.messData));
              data.list.map(function (item, i) {
                var key = item.id;
                newPage.push(item);
              });
              _this3.setState({ messData: newPage });
            }
            _this3.setState({ page: data.page, last: data.last });
          }
        } else {
          _this3.setState({ messData: [], page: 1, last: 0 });
        }
        _this3.setState({ loading: false, messageListMoreLoading: false });
      });
    }

    // 未读全部改为已读

  }, {
    key: "readAll",
    value: function readAll() {
      var that = this;
      confirm({
        title: "您确定要全部已读？",
        okText: "确定",
        cancelText: "取消",
        onOk: function onOk() {
          (0, _message3.updateAllRead)(function (data) {
            if (data.err) {
              return false;
            }
            that.setState({
              messData: data.list,
              last: data.last,
              messageCount: data.messageCount,
              messageRedCount: data.messageRedCount
            });
            that.props.messageCountOnChange(data.messageCount);
          });
        },
        onCancel: function onCancel() {}
      });
    }
    //跳转任务详情与未读改为已读

  }, {
    key: "read",
    value: function read(item) {
      var _this4 = this;

      var messageCount = this.state.messageCount;

      var ids = [];
      ids.push(item.id);
      (0, _message3.updateRead)(ids, function (data) {
        if (data.err) {
          return false;
        }
        _this4.setState({ messageCount: data.messageCount });
        _this4.props.messageCountOnChange(data.messageCount);
        _this4.props.closeCallBack();
        _index2.default.push("/pc_projectDetails?id=" + item.projectId + "&taskId=" + item.taskinfoId);
      });
    }
  }, {
    key: "renderMess",
    value: function renderMess() {
      var _this = this;
      var _state = this.state,
          messData = _state.messData,
          selectIds = _state.selectIds,
          read = _state.read,
          messageCount = _state.messageCount;

      var nullData = { alertTxtIcon: "frown-o" };
      var data = messData && messData.length > 0 ? messData.map(function (item, index) {
        var content = {};
        try {
          content = JSON.parse(item.description);
        } catch (error) {
          content = { 描述: item.description, 操作者: item.createBy.name };
        }
        var arr = [];
        for (var o in content) {
          arr.push(_react2.default.createElement("span", { className: "tit", style: { display: "block" }, key: o, __source: {
              fileName: _jsxFileName,
              lineNumber: 147
            }
          }, _react2.default.createElement("span", { className: "cont", __source: {
              fileName: _jsxFileName,
              lineNumber: 148
            }
          }, " ", o, " : "), o == "讨论内容" ? _react2.default.createElement("div", {
            className: "cont",
            dangerouslySetInnerHTML: { __html: content[o] },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 150
            }
          }) : _react2.default.createElement("div", { className: "cont", __source: {
              fileName: _jsxFileName,
              lineNumber: 155
            }
          }, content[o])));
        }
        return _react2.default.createElement("li", { key: index, __source: {
            fileName: _jsxFileName,
            lineNumber: 161
          }
        }, _react2.default.createElement("div", { className: "mess", __source: {
            fileName: _jsxFileName,
            lineNumber: 162
          }
        }, _react2.default.createElement("div", { className: "messBox", __source: {
            fileName: _jsxFileName,
            lineNumber: 163
          }
        }, item.type != "b" ? _react2.default.createElement(_popover2.default, { placement: "right", content: "\u70B9\u51FB\u67E5\u770B\u4EFB\u52A1\u8BE6\u60C5", __source: {
            fileName: _jsxFileName,
            lineNumber: 165
          }
        }, item.subject.indexOf("批量修改") === -1 ? _react2.default.createElement("div", {
          className: "tit-size",
          style: { cursor: "pointer" },
          onClick: function onClick() {
            _this.read(item);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 167
          }
        }, _react2.default.createElement("span", { className: "subject", __source: {
            fileName: _jsxFileName,
            lineNumber: 174
          }
        }, item.subject), _react2.default.createElement("span", { className: "time tit", __source: {
            fileName: _jsxFileName,
            lineNumber: 175
          }
        }, item.createDate)) : _react2.default.createElement("div", { className: "tit-size", style: { cursor: "pointer" }, __source: {
            fileName: _jsxFileName,
            lineNumber: 178
          }
        }, _react2.default.createElement("span", { className: "subject", __source: {
            fileName: _jsxFileName,
            lineNumber: 179
          }
        }, item.subject), _react2.default.createElement("span", { className: "time tit", __source: {
            fileName: _jsxFileName,
            lineNumber: 180
          }
        }, item.createDate))) : _react2.default.createElement(_popover2.default, { placement: "right", content: "\u70B9\u51FB\u67E5\u770B\u9879\u76EE\u8BE6\u60C5", __source: {
            fileName: _jsxFileName,
            lineNumber: 185
          }
        }, item.subject.indexOf("批量修改") === -1 ? _react2.default.createElement("div", {
          className: "tit-size",
          style: { cursor: "pointer" },
          onClick: function onClick() {
            _this.read(item);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 187
          }
        }, _react2.default.createElement("span", { className: "subject", __source: {
            fileName: _jsxFileName,
            lineNumber: 194
          }
        }, item.subject), _react2.default.createElement("span", { className: "time tit", __source: {
            fileName: _jsxFileName,
            lineNumber: 195
          }
        }, item.createDate)) : _react2.default.createElement("div", { className: "tit-size", style: { cursor: "pointer" }, __source: {
            fileName: _jsxFileName,
            lineNumber: 198
          }
        }, _react2.default.createElement("span", { className: "subject", __source: {
            fileName: _jsxFileName,
            lineNumber: 199
          }
        }, item.subject), _react2.default.createElement("span", { className: "time tit", __source: {
            fileName: _jsxFileName,
            lineNumber: 200
          }
        }, item.createDate))), _react2.default.createElement("div", { className: "msg-content", __source: {
            fileName: _jsxFileName,
            lineNumber: 205
          }
        }, arr), _react2.default.createElement("div", { className: item.read == "0" ? "read readRed" : "read", __source: {
            fileName: _jsxFileName,
            lineNumber: 206
          }
        }))), _react2.default.createElement("div", { className: "clear", __source: {
            fileName: _jsxFileName,
            lineNumber: 209
          }
        }));
      }) : _react2.default.createElement(_nullView2.default, { data: nullData, __source: {
          fileName: _jsxFileName,
          lineNumber: 214
        }
      });
      return data;
    }

    /*
     * 滚动到底部
     * */
    /*scrollLoad(){
    let {page, last} = this.state;
    if (page < last) {
    	page++;
    	this.setState({ messageListMoreLoading: true, page , finally: 'block'});
    	this.getMessage(page);
    } else {
    	if(last>1){
    		this.setState({ finally: 'block' });
    	}
    }
    }*/

  }, {
    key: "scrollBottom",

    //下拉加载
    value: function scrollBottom(e) {
      var onBottom = (0, _util.listScroll)(e);
      var _state2 = this.state,
          page = _state2.page,
          last = _state2.last;

      if (onBottom && page < last) {
        this.getMessage(page + 1);
      }
    }
    //删除已读

  }, {
    key: "delBath",
    value: function delBath() {
      var _state3 = this.state,
          selectIds = _state3.selectIds,
          read = _state3.read;

      var that = this;
      confirm({
        title: "您确定要清除已读？",
        okText: "确定",
        cancelText: "取消",
        onOk: function onOk() {
          (0, _message3.deleteBath)(selectIds, 1, function (data) {
            if (data.err) {
              return false;
            }
            that.setState({
              messData: data.list,
              last: data.last,
              messageCount: data.messageCount,
              messageRedCount: data.messageRedCount,
              selectAllType: "0"
            });
          });
        },
        onCancel: function onCancel() {}
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _state4 = this.state,
          messageCount = _state4.messageCount,
          loading = _state4.loading,
          messageListMoreLoading = _state4.messageListMoreLoading,
          read = _state4.read,
          page = _state4.page,
          last = _state4.last;

      return _react2.default.createElement(_modal2.default, {
        visible: true,
        title: "\u6D88\u606F\u901A\u77E5",
        onOk: this.confirm,
        onCancel: this.confirm,
        maskClosable: false,
        afterClose: this.confirm,
        className: "mes_min",
        wrapClassName: "messageModal",
        footer: [_react2.default.createElement(_button2.default, {
          key: "back",
          size: "large",
          onClick: function onClick() {
            _this5.delBath();
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 292
          }
        }, "\u6E05\u9664\u5DF2\u8BFB"), _react2.default.createElement(_button2.default, {
          key: "submit",
          type: "primary",
          size: "large",
          onClick: function onClick() {
            _this5.readAll();
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 301
          }
        }, "\u4E00\u952E\u5DF2\u8BFB")],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 282
        }
      }, _react2.default.createElement("div", { className: "mes_box", __source: {
          fileName: _jsxFileName,
          lineNumber: 313
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _message2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 314
        }
      }), messageCount > 0 ? _react2.default.createElement("div", { className: read == "1" ? "tag tag-red" : "tag", __source: {
          fileName: _jsxFileName,
          lineNumber: 316
        }
      }, messageCount > 99 ? "99+" : messageCount) : null, _react2.default.createElement("div", {
        className: "message",
        onScroll: function onScroll(e) {
          _this5.scrollBottom(e);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 320
        }
      }, _react2.default.createElement("div", { className: "box", __source: {
          fileName: _jsxFileName,
          lineNumber: 326
        }
      }, _react2.default.createElement(_row2.default, { className: "content", __source: {
          fileName: _jsxFileName,
          lineNumber: 327
        }
      }, _react2.default.createElement(_col2.default, { span: 20, __source: {
          fileName: _jsxFileName,
          lineNumber: 328
        }
      }, _react2.default.createElement("ul", { className: "right", __source: {
          fileName: _jsxFileName,
          lineNumber: 329
        }
      }, _react2.default.createElement(_spin2.default, { size: "large", spinning: loading, __source: {
          fileName: _jsxFileName,
          lineNumber: 330
        }
      }), this.renderMess(), !messageListMoreLoading && page < last ? _react2.default.createElement("div", { className: "finally", __source: {
          fileName: _jsxFileName,
          lineNumber: 333
        }
      }, "\u4E0B\u62C9\u52A0\u8F7D\u66F4\u591A") : "", !messageListMoreLoading && page === last ? _react2.default.createElement("div", { className: "finally", __source: {
          fileName: _jsxFileName,
          lineNumber: 338
        }
      }, "\u5DF2\u7ECF\u5230\u5E95\u55BD") : "", messageListMoreLoading ? _react2.default.createElement("div", { className: "finally", __source: {
          fileName: _jsxFileName,
          lineNumber: 343
        }
      }, _react2.default.createElement(_icon2.default, { type: "loading", className: "loadingIcon", __source: {
          fileName: _jsxFileName,
          lineNumber: 344
        }
      }), "\u6B63\u5728\u52A0\u8F7D\u66F4\u591A") : "")))))));
    }
  }]);

  return Message;
}(_react2.default.Component);

exports.default = Message;