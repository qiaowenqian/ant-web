"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _list = require("antd/lib/list");

var _list2 = _interopRequireDefault(_list);

var _popconfirm = require("antd/lib/popconfirm");

var _popconfirm2 = _interopRequireDefault(_popconfirm);

var _menu = require("antd/lib/menu");

var _menu2 = _interopRequireDefault(_menu);

var _spin = require("antd/lib/spin");

var _spin2 = _interopRequireDefault(_spin);

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

var _project = require("../../core/service/project.service");

var _task = require("../../core/service/task.service");

var _recycle = require("../../styles/components/setting/recycle.scss");

var _recycle2 = _interopRequireDefault(_recycle);

var _util = require("../../core/utils/util");

var _reactInfiniteScroller = require("react-infinite-scroller");

var _reactInfiniteScroller2 = _interopRequireDefault(_reactInfiniteScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\setting\\recycle.js";


var Recycle = function (_React$Component) {
  (0, _inherits3.default)(Recycle, _React$Component);

  function Recycle(props) {
    (0, _classCallCheck3.default)(this, Recycle);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Recycle.__proto__ || (0, _getPrototypeOf2.default)(Recycle)).call(this, props));

    _this.componentDidMount = function () {};

    _this.getRecycledTaskList = function (pageNo) {
      (0, _task.taskRecycled)(20, pageNo, function (data) {
        if (data.err) {
          return false;
        }
        _this.setState({ loading: true });
        if (data.pageNo === 1) {
          _this.setState({
            taskList: data.taskinfos,
            pageNow: data.pageNo,
            taskListLoading: false,
            isLast: data.isLast,
            loading: false
          });
        } else {
          var taskList = _this.state.taskList;
          taskList = taskList.concat(data.taskinfos);
          _this.setState({
            taskList: taskList,
            loading: false,
            pageNow: data.pageNo,
            taskListLoading: false,
            isLast: data.isLast
          });
        }
      });
    };

    _this.recoveryTask = function (id) {
      var taskList = _this.state.taskList;

      taskList.map(function (item, i) {
        if (item.id === id) {
          taskList.splice(i, 1);
        }
      });
      (0, _task.restoreTaskinfo)(id, function (data) {
        console.log(data);
      });
      _this.setState({ taskList: taskList });
      // console.log(item);
    };

    _this.deleTask = function (id) {
      var taskList = _this.state.taskList;

      taskList.map(function (item, i) {
        if (item.id === id) {
          taskList.splice(i, 1);
        }
      });
      (0, _task.removeTask)(id, function (data) {
        console.log(data);
        _this.setState({ taskList: taskList });
      });
    };

    _this.getRecycledProjectList = function () {
      (0, _project.projectrecycled)(function (data) {
        if (data) {
          _this.setState({ projectList: data });
          // console.log(data);
        }
      });
    };

    _this.recoveryProject = function (id) {
      var projectList = _this.state.projectList;

      projectList.map(function (item, i) {
        if (item.id === id) {
          projectList.splice(i, 1);
        }
      });
      (0, _project.restoreProject)(id, function (data) {
        console.log(data);
      });
      _this.setState({ projectList: projectList });
    };

    _this.deleProject = function (id) {
      var projectList = _this.state.projectList;

      projectList.map(function (item, i) {
        if (item.id === id) {
          projectList.splice(i, 1);
        }
      });
      (0, _project.removeCompletely)(id, function (data) {
        console.log(data);
      });
      _this.setState({ projectList: projectList });
    };

    _this.handleInfiniteOnLoad = function () {
      var _this$state = _this.state,
          pageNow = _this$state.pageNow,
          isLast = _this$state.isLast;

      console.log("还没滚动到底部就加载6666");
      if (isLast === 0) {
        _this.getRecycledTaskList(pageNow + 1);
      }
    };

    _this.state = {
      showItem: "task",
      projectList: [],
      taskList: [],
      taskListNowPage: 1,
      isLast: 0,
      loading: false,
      hasMore: true,
      pageNow: 1,
      taskListLoading: false
    };
    return _this;
  }

  (0, _createClass3.default)(Recycle, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getRecycledProjectList();
      this.getRecycledTaskList(1);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
    //---------------
    // 获取已删除的Task列表

    //恢复任务

    //删除Task


    //------------------------
    // 获取已删除的项目列表


    //恢复项目

    //删除项目

  }, {
    key: "closeModal",
    value: function closeModal() {
      this.props.closedCallBack();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          showItem = _state.showItem,
          taskList = _state.taskList,
          projectList = _state.projectList,
          loading = _state.loading,
          hasMore = _state.hasMore,
          taskListLoading = _state.taskListLoading;

      return _react2.default.createElement(_modal2.default, {
        title: "回收站",
        visible: true,
        closable: true,
        width: 800,
        onCancel: function onCancel() {
          _this2.closeModal();
        },
        footer: null,
        mask: true,
        maskClosable: false,
        wrapClassName: "recycleModal",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 156
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _recycle2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 169
        }
      }), _react2.default.createElement(_spin2.default, { spinning: loading, __source: {
          fileName: _jsxFileName,
          lineNumber: 170
        }
      }), _react2.default.createElement("div", { className: "recycleBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 171
        }
      }, _react2.default.createElement(_menu2.default, {
        style: {
          width: 110,
          flexShrink: 2,
          height: 400,
          borderRight: "1px solid #f5f5f5"
        },
        defaultSelectedKeys: ["task"],
        mode: "inline",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 172
        }
      }, _react2.default.createElement(_menu2.default.Item, {
        key: "task",
        onClick: function onClick() {
          _this2.setState({ showItem: "task" });
        },
        className: "taskBorder",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 182
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-alltasks", __source: {
          fileName: _jsxFileName,
          lineNumber: 189
        }
      }), "\u4EFB\u52A1"), _react2.default.createElement(_menu2.default.Item, {
        key: "project",
        onClick: function onClick() {
          _this2.setState({ showItem: "project" });
        },
        className: "projectBorder",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 192
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-project", __source: {
          fileName: _jsxFileName,
          lineNumber: 199
        }
      }), "\u9879\u76EE")), _react2.default.createElement("div", { className: "title", __source: {
          fileName: _jsxFileName,
          lineNumber: 203
        }
      }, _react2.default.createElement("div", { className: "name", __source: {
          fileName: _jsxFileName,
          lineNumber: 204
        }
      }, "\u540D\u79F0"), _react2.default.createElement("div", { className: "delTime", __source: {
          fileName: _jsxFileName,
          lineNumber: 206
        }
      }, "\u5220\u9664\u65F6\u95F4")), _react2.default.createElement("div", { className: "recycleContent", __source: {
          fileName: _jsxFileName,
          lineNumber: 208
        }
      }, showItem === "task" ? _react2.default.createElement(_reactInfiniteScroller2.default, {
        initialLoad: false,
        pageStart: 0,
        loadMore: this.handleInfiniteOnLoad,
        hasMore: !this.state.loading && this.state.hasMore,
        useWindow: false,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 210
        }
      }, _react2.default.createElement(_list2.default, {
        header: null,
        footer: null,
        bordered: false,
        dataSource: taskList,
        renderItem: function renderItem(item) {
          return _react2.default.createElement(_list2.default.Item, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 223
            }
          }, _react2.default.createElement("div", { className: "itemName", __source: {
              fileName: _jsxFileName,
              lineNumber: 224
            }
          }, _react2.default.createElement("div", { className: "taskname", __source: {
              fileName: _jsxFileName,
              lineNumber: 225
            }
          }, item.taskname), _react2.default.createElement("div", { className: "proname", __source: {
              fileName: _jsxFileName,
              lineNumber: 226
            }
          }, _react2.default.createElement("i", { className: "iconfont icon-project smallIcon", __source: {
              fileName: _jsxFileName,
              lineNumber: 227
            }
          }), item.proname)), _react2.default.createElement("div", { className: "delPeole", __source: {
              fileName: _jsxFileName,
              lineNumber: 231
            }
          }, _react2.default.createElement(_popconfirm2.default, {
            title: "\u662F\u5426\u8FD8\u539F\u4EFB\u52A1\"" + item.taskname + "\"",
            okText: "\u8FD8\u539F",
            cancelText: "\u53D6\u6D88",
            onConfirm: function onConfirm() {
              _this2.recoveryTask(item.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 233
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? "" : _react2.default.createElement("div", { className: "recoveryTask", __source: {
              fileName: _jsxFileName,
              lineNumber: 245
            }
          }, "\u8FD8\u539F\u4EFB\u52A1"))), _react2.default.createElement("div", { className: "delTimes", __source: {
              fileName: _jsxFileName,
              lineNumber: 249
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? _react2.default.createElement("div", { className: "times", __source: {
              fileName: _jsxFileName,
              lineNumber: 252
            }
          }, item.updateDate.substring(0, 10)) : _react2.default.createElement("div", { className: "time", __source: {
              fileName: _jsxFileName,
              lineNumber: 256
            }
          }, item.updateDate.substring(0, 10)), _react2.default.createElement(_popconfirm2.default, {
            title: "\u662F\u5426\u5220\u9664\u4EFB\u52A1\"" + item.taskname + "\"",
            okText: "\u5220\u9664",
            cancelText: "\u53D6\u6D88",
            onConfirm: function onConfirm() {
              _this2.deleTask(item.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 260
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? "" : _react2.default.createElement("div", { className: "thoroughly", __source: {
              fileName: _jsxFileName,
              lineNumber: 272
            }
          }, "\u5F7B\u5E95\u5220\u9664"))));
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 217
        }
      })) : _react2.default.createElement("div", { className: "projectdel", __source: {
          fileName: _jsxFileName,
          lineNumber: 282
        }
      }, _react2.default.createElement(_list2.default, {
        header: null,
        footer: null,
        bordered: false,
        dataSource: projectList,
        renderItem: function renderItem(item) {
          return _react2.default.createElement(_list2.default.Item, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 289
            }
          }, _react2.default.createElement("div", { className: "itemName", __source: {
              fileName: _jsxFileName,
              lineNumber: 290
            }
          }, _react2.default.createElement("div", { className: "proname", __source: {
              fileName: _jsxFileName,
              lineNumber: 291
            }
          }, item.proname)), _react2.default.createElement("div", { className: "delPeole", __source: {
              fileName: _jsxFileName,
              lineNumber: 294
            }
          }, _react2.default.createElement(_popconfirm2.default, {
            title: "\u662F\u5426\u8FD8\u539F\u9879\u76EE\"" + item.proname + "\"",
            okText: "\u8FD8\u539F",
            cancelText: "\u53D6\u6D88",
            onConfirm: function onConfirm() {
              _this2.recoveryProject(item.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 296
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? "" : _react2.default.createElement("div", { className: "recoveryProject", __source: {
              fileName: _jsxFileName,
              lineNumber: 308
            }
          }, "\u8FD8\u539F\u9879\u76EE"))), _react2.default.createElement("div", { className: "delTimes", __source: {
              fileName: _jsxFileName,
              lineNumber: 312
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? _react2.default.createElement("div", { className: "times", __source: {
              fileName: _jsxFileName,
              lineNumber: 315
            }
          }, item.updateDate.substring(0, 10)) : _react2.default.createElement("div", { className: "time", __source: {
              fileName: _jsxFileName,
              lineNumber: 319
            }
          }, item.updateDate.substring(0, 10)), _react2.default.createElement(_popconfirm2.default, {
            title: "\u662F\u5426\u5220\u9664\u9879\u76EE\"" + item.proname + "\"",
            okText: "\u5220\u9664",
            cancelText: "\u53D6\u6D88",
            onConfirm: function onConfirm() {
              _this2.deleProject(item.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 323
            }
          }, (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? "" : _react2.default.createElement("div", { className: "thoroughly", __source: {
              fileName: _jsxFileName,
              lineNumber: 335
            }
          }, "\u5F7B\u5E95\u5220\u9664"))));
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 283
        }
      })))), (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" ? _react2.default.createElement("div", { className: "tootlie", __source: {
          fileName: _jsxFileName,
          lineNumber: 348
        }
      }, "*\u4E13\u4E1A\u7248\u53EF\u8FDB\u884C\u8FD8\u539F\u6216\u5F7B\u5E95\u5220\u9664") : "");
    }
  }]);

  return Recycle;
}(_react2.default.Component);

exports.default = Recycle;