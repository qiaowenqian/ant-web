"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _timePicker = require("antd/lib/time-picker");

var _timePicker2 = _interopRequireDefault(_timePicker);

var _datePicker = require("antd/lib/date-picker");

var _datePicker2 = _interopRequireDefault(_datePicker);

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _upload = require("antd/lib/upload");

var _upload2 = _interopRequireDefault(_upload);

var _breadcrumb = require("antd/lib/breadcrumb");

var _breadcrumb2 = _interopRequireDefault(_breadcrumb);

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _message2 = require("antd/lib/message");

var _message3 = _interopRequireDefault(_message2);

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

var _select = require("antd/lib/select");

var _select2 = _interopRequireDefault(_select);

var _input = require("antd/lib/input");

var _input2 = _interopRequireDefault(_input);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _task = require("../core/service/task.service");

var _project = require("../core/service/project.service");

var _file = require("../core/service/file.service");

var _util = require("../core/utils/util");

var _taskCreate = require("../styles/components/taskCreate.scss");

var _taskCreate2 = _interopRequireDefault(_taskCreate);

var _HttpClient = require("../core/api/HttpClient");

var _dingJSApi = require("../core/utils/dingJSApi");

var _dingJSApi2 = _interopRequireDefault(_dingJSApi);

var _storage = require("../core/utils/storage");

var _storage2 = _interopRequireDefault(_storage);

var _tag = require("../components/tag");

var _tag2 = _interopRequireDefault(_tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\taskCreate.js";

var TextArea = _input2.default.TextArea;

var Option = _select2.default.Option;

/*
 * task:{id:'',projectId:''}                // 任务 有传的话 表示是创建子任务 （选填）
 * closedCallBack()                         // 关闭回调（必填）
 * successCallBack()                        // 创建成功回调 （选填）
 */

var taskCreate = function (_React$Component) {
  (0, _inherits3.default)(taskCreate, _React$Component);

  function taskCreate(props) {
    (0, _classCallCheck3.default)(this, taskCreate);

    var _this = (0, _possibleConstructorReturn3.default)(this, (taskCreate.__proto__ || (0, _getPrototypeOf2.default)(taskCreate)).call(this, props));

    _this.handlePreview = function (file) {
      _this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
      });
    };

    _this.state = {
      taskInfo: {
        objId: { id: "", name: "" },
        parentId: "",
        name: "",
        desc: "", // 编辑器 填写的描述内容
        fzr: { id: "", name: "", userid: "" },
        shr: { id: "", name: "", userid: "" },
        wcrq: "",
        yjgq: "1",
        rwjx: "",
        zycd: "0",
        filesList: [],
        tags: [],
        collectUser: []
      },
      showMore: "", // 更多按钮

      previewVisible: false, // 本地放大图片
      previewImage: "",

      uploadList_desc: [],
      projectListData: [], // 项目列表存放
      projectListLoading: false,
      projectListMoreLoading: false,
      projectListNowPage: 1,
      projectListAllPage: 0,

      breadShow: false, // 是否渲染面包屑
      breadList: [],
      descDetailsShow: false,

      taskNameLength: 0,
      taskPlanDate: "",
      taskPlanTime: "",
      createLoading: false
    };
    return _this;
  }

  (0, _createClass3.default)(taskCreate, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.task) {
        this.setState({ breadShow: true });
        var _taskInfo = this.state.taskInfo;

        _taskInfo.parentId = this.props.task.id ? this.props.task.id : "";
        _taskInfo.objId.id = this.props.task.projectId;
        this.setState({ taskInfo: _taskInfo });
        this.getTaskBread();
      } else {
        this.setState({ breadShow: false });
      }
      var user = _storage2.default.get("user");
      var taskInfo = this.state.taskInfo;

      taskInfo.fzr = user;
      this.setState({ taskInfo: taskInfo });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var showMore = _storage2.default.getLocal("showMoreAdddTask");
      if (showMore) {
        this.setState({ showMore: showMore });
      } else {
        this.setState({ showMore: "a" });
      }
      this.setState({ taskPlanTime: this.state.taskPlanTime });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "getTaskBread",
    value: function getTaskBread() {
      var _this2 = this;

      (0, _task.getTaskBreadById)(this.props.task.projectId, this.props.task.id, function (res) {
        if (res.err) {
          return false;
        }
        _this2.setState({ breadList: res.parentList });
      });
    }

    // 是否显示更多

  }, {
    key: "moreShow",
    value: function moreShow() {
      var showMore = this.state.showMore;

      if (showMore == "b") {
        this.setState({ showMore: "b" });
      } else {
        this.setState({ showMore: "a" });
      }
    }
    // 显示图片

  }, {
    key: "remove",

    // 删除人员
    value: function remove(type, id) {
      var taskInfo = this.state.taskInfo;

      for (var key in taskInfo[type]) {
        delete taskInfo[type][key];
      }
      this.setState({ taskInfo: taskInfo });
    }

    // 删除关注人

  }, {
    key: "removeCollectUser",
    value: function removeCollectUser(user) {
      var taskInfo = this.state.taskInfo;

      var oldGzr = taskInfo.collectUser;
      var newGzr = [];
      if (oldGzr && oldGzr.length > 0) {
        oldGzr.map(function (item) {
          if (item.userid != user.userid) {
            newGzr.push(item);
          }
        });
      }
      taskInfo.collectUser = newGzr;
      this.setState({ taskInfo: taskInfo });
    }

    // 编辑对应的值

  }, {
    key: "editVal",
    value: function editVal(val, type, editorTxtNull) {
      var _this3 = this;

      var _state = this.state,
          taskInfo = _state.taskInfo,
          projectListData = _state.projectListData,
          taskNameLength = _state.taskNameLength;
      // 判断所选择的项目是否是已经有的项目，如果没有，则自动新建项目

      if (type === "objId") {
        if (projectListData && projectListData.filter(function (value) {
          return value.proname === val;
        }).length === 0) {
          var _taskInfo2 = this.state.taskInfo;

          _taskInfo2[type] = { id: "", name: val };
          this.setState({ taskInfo: _taskInfo2 });
        } else {
          var _taskInfo3 = this.state.taskInfo;

          projectListData.map(function (item, i) {
            if (item.proname === val) {
              _taskInfo3[type] = { id: item.id };
              _this3.setState({ taskInfo: _taskInfo3 });
              return false;
            }
          });
        }
      } else if (type == "name") {
        taskInfo[type] = val;
        taskNameLength = (0, _util.getByteLen)(val.slice(0, 50));
        this.setState({ taskNameLength: taskNameLength });
      } else if (type == "desc") {
        var txt = val;
        if (editorTxtNull) {
          txt = "";
        }
        taskInfo[type] = txt;
      } else {
        taskInfo[type] = val;
      }
      this.setState({ taskInfo: taskInfo });
    }

    // 获取项目列表

  }, {
    key: "projectList",
    value: function projectList() {
      var _this4 = this;

      var pageNo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var proname = arguments[1];

      if (pageNo === 1) {
        this.setState({ projectListLoading: true });
      } else {
        this.setState({ projectListMoreLoading: true });
      }
      (0, _project.getProListByJurisdiction)("10", pageNo, function (data) {
        if (data.err) {
          return false;
        }
        if (data.pageNo === 1) {
          _this4.setState({ projectListData: data.list ? data.list : [] });
        } else {
          var projectListData = JSON.parse((0, _stringify2.default)(_this4.state.projectListData));
          data.list && data.list.map(function (item) {
            projectListData.push(item);
          });
          _this4.setState({
            projectListData: projectListData
          });
        }
        var taskInfo = _this4.state.taskInfo;

        _this4.setState({
          taskInfo: taskInfo,
          projectListNowPage: data.pageNo,
          projectListAllPage: data.last,
          projectListLoading: false,
          projectListMoreLoading: false
        });
        // this.setState({});
      }, proname);
    }
    //项目列表下拉加载

  }, {
    key: "scrollBottom",
    value: function scrollBottom(e) {
      var _state2 = this.state,
          projectListNowPage = _state2.projectListNowPage,
          projectListAllPage = _state2.projectListAllPage,
          projectListMoreLoading = _state2.projectListMoreLoading;

      var isOnButtom = (0, _util.listScroll)(e);
      if ((isOnButtom === true || isOnButtom === undefined) && projectListNowPage < projectListAllPage && !projectListMoreLoading) {
        this.projectList(projectListNowPage + 1);
      }
    }
    // 创建任务

  }, {
    key: "createTaskData",
    value: function createTaskData() {
      var _this5 = this;

      var taskInfo = this.state.taskInfo;

      this.setState({
        createLoading: true
      }, function () {
        var updateData = { taskname: taskInfo.name };
        if (taskInfo.desc !== "") {
          updateData.description = taskInfo.desc;
        }
        if (taskInfo.fzr.userid !== "") {
          updateData.userResponse = {};
          updateData.userResponse.userid = taskInfo.fzr.userid;
        }
        if (taskInfo.shr.userid !== "") {
          updateData.userFlow = {};
          updateData.userFlow.userid = taskInfo.shr.userid;
        }
        if (taskInfo.wcrq !== "") {
          updateData.planEndTimeString = taskInfo.wcrq;
        }
        if (taskInfo.yjgq !== "") {
          updateData.workTime = taskInfo.yjgq;
        }
        if (taskInfo.rwjx !== "") {
          updateData.flowConten = taskInfo.rwjx;
        }
        if (taskInfo.zycd !== "") {
          updateData.coefficienttype = taskInfo.zycd;
        }
        if (taskInfo.filesList.length > 0) {
          updateData.fileList = taskInfo.filesList;
        }
        var projectId = "";
        if (taskInfo.objId.id) {
          projectId = taskInfo.objId.id;
        } else if (taskInfo.objId.name) {
          updateData.proname = taskInfo.objId.name;
        }
        var labels = [];
        if (taskInfo.tags && taskInfo.tags.length > 0) {
          updateData.labels = taskInfo.tags;
        }
        if (taskInfo.collectUser && taskInfo.collectUser.length > 0) {
          var gzruserids = [];
          taskInfo.collectUser.map(function (item) {
            gzruserids.push(item.userid);
          });
          updateData.collectUserList = gzruserids;
        }
        (0, _task.createTask)(projectId, taskInfo.parentId, updateData, function (res) {
          if (res.err) {
            _this5.setState({
              createLoading: false
            });
            return false;
          }
          _message3.default.success("创建成功！");
          _this5.setState({
            createLoading: false
          });
          _this5.props.closedCallBack();
          if (_this5.props.successCallBack) {
            _this5.props.successCallBack(taskInfo.parentId, taskInfo.objId.id);
          }
        });
      });
    }

    // 选人

  }, {
    key: "selUser",
    value: function selUser(title) {
      title = title;
      var selectedUsers = [];
      var taskInfo = this.state.taskInfo;

      var multiple = false;
      if (title === "负责人") {
        selectedUsers.push(taskInfo.fzr);
      } else if (title === "确认人") {
        selectedUsers.push(taskInfo.shr);
      } else if (title == "关注人") {
        multiple = true;
        var gzr = taskInfo.collectUser;
        selectedUsers = gzr;
      }
      var that = this;
      _dingJSApi2.default.selectUser(selectedUsers, "请选择" + title, function (data) {
        //console.log("钉钉返回的人员有：",data)
        if (!data) {
          return false;
        }
        var user = data[0];
        if (!user) {
          return false;
        }
        if (title === "负责人") {
          if (data[0].emplId !== taskInfo.fzr.userid) {
            taskInfo.fzr = { userid: data[0].emplId, name: data[0].name };
            that.setState({ taskInfo: taskInfo });
          }
          //console.log(taskInfo.fzr,'负责人');
        } else if (title === "确认人") {
          if (data[0].emplId !== taskInfo.shr.userid) {
            taskInfo.shr = { userid: data[0].emplId, name: data[0].name };
            that.setState({ taskInfo: taskInfo });
          }
        } else if (title === "关注人") {
          var _gzr = [];
          if (data) {
            data.map(function (item) {
              _gzr.push({ userid: item.emplId, name: item.name });
            });
          }
          taskInfo.collectUser = _gzr;
          that.setState({ taskInfo: taskInfo });
        }
      }, multiple);
    }

    // 删除上传附件 钉钉组件

  }, {
    key: "dellDescFileById",
    value: function dellDescFileById(id) {
      var _this6 = this;

      var taskInfo = this.state.taskInfo;

      taskInfo.filesList.map(function (item, i) {
        if (item.fileId && item.fileId === id || item.id && item.id === id) {
          taskInfo.filesList.splice(i, 1);
          _this6.setState({ taskInfo: taskInfo });
          return false;
        }
      });
    }

    // 上传附件 钉钉组件

  }, {
    key: "updataFile",
    value: function updataFile() {
      var _this7 = this;

      var taskInfo = this.state.taskInfo;

      _dingJSApi2.default.uploadImage(function (result) {
        var data = result.data;
        if (data && data.length > 0) {
          data.map(function (item, i) {
            taskInfo.filesList.push(item);
          });
          _this7.setState({ taskInfo: taskInfo });
        }
      }, true);
    }

    // 上传/删除图片 本地组件

  }, {
    key: "uploadListOnChange_desc",
    value: function uploadListOnChange_desc(list) {
      var _this8 = this;

      this.setState({ uploadList_desc: list.fileList });
      var taskInfo = this.state.taskInfo;

      if (list.file.status === "done") {
        taskInfo.filesList.push({
          id: list.file.response.data.id,
          uid: list.file.uid
        });
        this.setState({ taskInfo: taskInfo });
      } else if (list.file.status === "removed") {
        var _taskInfo4 = this.state.taskInfo;

        _taskInfo4.filesList.map(function (item, i) {
          if (item.uid === list.file.uid) {
            _taskInfo4.filesList.splice(i, 1);
            _this8.setState({ taskInfo: _taskInfo4 });
            return false;
          }
        });
      }
    }

    // 粘贴图片 本地

  }, {
    key: "pasteingImg",
    value: function pasteingImg(e) {
      var _this9 = this;

      (0, _util.pasteImg)(e, function (url) {
        (0, _file.updateImgsInService)(url, function (data) {
          if (data.err) {
            return false;
          }
          var fileObj = data;
          fileObj.type = "";
          fileObj.uid = fileObj.id;
          var taskInfo = _this9.state.taskInfo;

          taskInfo.filesList.push(fileObj);
          _this9.setState({ taskInfo: taskInfo });

          // 处理给上传控件
          var uploadList_desc = _this9.state.uploadList_desc;

          uploadList_desc.push({
            uid: fileObj.id,
            name: fileObj.fileName,
            status: "done",
            url: fileObj.fileUrlAbsolute
          });
          _this9.setState({ uploadList_desc: uploadList_desc });
        });
      });
    }
  }, {
    key: "changeQuickType",
    value: function changeQuickType(e) {
      this.setState({ showMore: e });
      _storage2.default.setLocal("showMoreAdddTask", e);
    }
  }, {
    key: "tagChange",
    value: function tagChange(tag) {
      var taskInfo = this.state.taskInfo;

      var tags = [];
      tag.map(function (item) {
        item.labelname = item.name;
        tags.push(item);
      });
      taskInfo.tags = tags;
      this.setState({ taskInfo: taskInfo });
    }
  }, {
    key: "dateTimeChange",
    value: function dateTimeChange(date, time) {
      var taskInfo = this.state.taskInfo;

      if (date === "") {
        time = "";
      } else if (time === "") {
        taskInfo.wcrq = date + " 00:00:00";
        time = "";
      } else if (time == "00:00") {
        taskInfo.wcrq = date + " " + time + ":02";
      } else {
        taskInfo.wcrq = date + " " + time + ":00";
      }
      this.setState({
        taskInfo: taskInfo,
        taskPlanDate: date,
        taskPlanTime: time
      });
    }
  }, {
    key: "timePlanChange",
    value: function timePlanChange() {
      var taskPlanDate = this.state.taskPlanDate;

      if (taskPlanDate === "") {
        _message3.default.info("请选择日期");
      }
    }
  }, {
    key: "clearTime",
    value: function clearTime(time) {
      var _state3 = this.state,
          taskPlanTime = _state3.taskPlanTime,
          taskInfo = _state3.taskInfo,
          taskPlanDate = _state3.taskPlanDate;

      taskInfo.wcrq = taskPlanDate + " 00:00:00";
      this.state.taskPlanTime = time;
      this.setState({ taskInfo: taskInfo });
    }
  }, {
    key: "render",
    value: function render() {
      var _this10 = this;

      var _state4 = this.state,
          showMore = _state4.showMore,
          taskInfo = _state4.taskInfo,
          uploadList_desc = _state4.uploadList_desc,
          breadShow = _state4.breadShow,
          taskNameLength = _state4.taskNameLength,
          previewVisible = _state4.previewVisible,
          previewImage = _state4.previewImage,
          projectListNowPage = _state4.projectListNowPage,
          projectListAllPage = _state4.projectListAllPage,
          projectListData = _state4.projectListData,
          taskPlanDate = _state4.taskPlanDate,
          taskPlanTime = _state4.taskPlanTime,
          breadList = _state4.breadList,
          descDetailsShow = _state4.descDetailsShow,
          projectListLoading = _state4.projectListLoading,
          projectListMoreLoading = _state4.projectListMoreLoading,
          createLoading = _state4.createLoading;

      var uploadButton = _react2.default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 529
        }
      }, _react2.default.createElement(_icon2.default, { type: "plus", __source: {
          fileName: _jsxFileName,
          lineNumber: 530
        }
      }), _react2.default.createElement("div", { className: "ant-upload-text", __source: {
          fileName: _jsxFileName,
          lineNumber: 531
        }
      }, "\u56FE\u7247"));
      var projectList = projectListData.map(function (item, i) {
        return _react2.default.createElement(Option, {
          key: item.id,
          value: item.proname && item.proname,
          disabled: item.create === "false" ? true : false,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 536
          }
        }, item.create === "false" ? _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 543
          }
        }, item.proname && item.proname, _react2.default.createElement("span", { className: "createFalse", __source: {
            fileName: _jsxFileName,
            lineNumber: 545
          }
        }, "\u6CA1\u6709\u521B\u5EFA\u6743\u9650")) : item.proname && item.proname);
      });
      var that = this;

      var create = true;
      if (taskInfo.objId.id && breadShow && taskInfo.name) {
        create = false;
      } else if ((taskInfo.objId.name || taskInfo.objId.id) && !breadShow && taskInfo.name) {
        create = false;
      }
      var newDate = new Date();
      var newYear = newDate.getFullYear();
      var newMonth = newDate.getMonth() + 1;
      var newDay = newDate.getDate();
      var newHours = newDate.getHours();
      var newMinutes = newDate.getMinutes();
      var newDateTime = newYear + "-" + newMonth + "-" + newDay;
      var newDateTimes = newHours + ":" + newMinutes;
      return _react2.default.createElement(_modal2.default, {
        title: "\u521B\u5EFA\u4EFB\u52A1",
        visible: true,
        width: 620,
        maskClosable: false,
        wrapClassName: "taskCreatModal",
        onCancel: function onCancel() {
          _this10.props.closedCallBack();
        },
        footer: [_react2.default.createElement(_button2.default, {
          key: "back",
          type: "back",
          onClick: function onClick() {
            _this10.props.closedCallBack();
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 584
          }
        }, "\u53D6\u6D88"), _react2.default.createElement(_button2.default, {
          key: "submit",
          type: "primary"
          //     create=false &&createLoading=false
          , disabled: create || createLoading,
          className: create || createLoading ? "button_create" : "",
          onClick: function onClick() {
            _this10.createTaskData();
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 593
          }
        }, "\u521B\u5EFA")],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 574
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _taskCreate2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 607
        }
      }), _react2.default.createElement("div", { className: "createModal", __source: {
          fileName: _jsxFileName,
          lineNumber: 608
        }
      }, _react2.default.createElement("div", { className: "switch", __source: {
          fileName: _jsxFileName,
          lineNumber: 609
        }
      }, _react2.default.createElement("div", { className: "ant-radio-group ant-radio-group-outline", __source: {
          fileName: _jsxFileName,
          lineNumber: 610
        }
      }, _react2.default.createElement("label", {
        onClick: function onClick() {
          _this10.changeQuickType("a");
        },
        className: showMore == "a" ? "ant-radio-button-wrapper ant-radio-button-wrapper-checked" : "ant-radio-button-wrapper",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 611
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 621
        }
      }, "\u5FEB\u901F")), _react2.default.createElement("label", {
        onClick: function onClick() {
          _this10.changeQuickType("b");
        },
        className: showMore == "b" ? "ant-radio-button-wrapper ant-radio-button-wrapper-checked" : "ant-radio-button-wrapper",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 623
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 633
        }
      }, "\u5B8C\u6574")))), _react2.default.createElement("div", { className: "modalTop", __source: {
          fileName: _jsxFileName,
          lineNumber: 637
        }
      }, breadShow && breadList.length > 0 ? _react2.default.createElement("div", { className: "bread", __source: {
          fileName: _jsxFileName,
          lineNumber: 639
        }
      }, breadList[0].taskname !== "" ? _react2.default.createElement("span", { className: "projectBread", __source: {
          fileName: _jsxFileName,
          lineNumber: 641
        }
      }, "\u6240\u5C5E\u9879\u76EE\uFF1A") : "", _react2.default.createElement(_breadcrumb2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 645
        }
      }, _react2.default.createElement(_breadcrumb2.default.Item, { className: "breadOne", __source: {
          fileName: _jsxFileName,
          lineNumber: 646
        }
      }, breadList[0].taskname), breadList.length > 1 && breadList.map(function (item, i) {
        if (i > 0) {
          return _react2.default.createElement(_breadcrumb2.default.Item, { className: "breadTwo", key: item.id, __source: {
              fileName: _jsxFileName,
              lineNumber: 653
            }
          }, item.taskname);
        }
      }))) : "", !breadShow && _react2.default.createElement("div", { className: "proname create", __source: {
          fileName: _jsxFileName,
          lineNumber: 665
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 666
        }
      }, "\u6240\u5C5E\u9879\u76EE\uFF1A"), _react2.default.createElement("div", { className: "rightDesc", __source: {
          fileName: _jsxFileName,
          lineNumber: 667
        }
      }, _react2.default.createElement(_select2.default, {
        style: { width: "100%" },
        onChange: function onChange(value) {
          _this10.editVal(value, "objId");
          _this10.projectList(1, value);
        },
        mode: "combobox",
        placeholder: "\u8BF7\u9009\u62E9\u6240\u5C5E\u9879\u76EE",
        onFocus: function onFocus() {
          _this10.projectList();
        },
        onPopupScroll: function onPopupScroll(e) {
          _this10.scrollBottom(e);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 668
        }
      }, projectList, !projectListMoreLoading && projectListNowPage === projectListAllPage ? _react2.default.createElement(Option, { value: "disabled", disabled: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 686
        }
      }, "\u5DF2\u7ECF\u5230\u5E95\u55BD") : "", !projectListMoreLoading && projectListNowPage < projectListAllPage ? _react2.default.createElement(Option, { value: "disabled", disabled: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 694
        }
      }, "\u4E0B\u62C9\u52A0\u8F7D\u66F4\u591A") : "", projectListMoreLoading ? _react2.default.createElement(Option, { value: "disabled", disabled: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 701
        }
      }, _react2.default.createElement(_icon2.default, { type: "loading", style: { margin: "0 7px 0 0" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 702
        }
      }), "\u6B63\u5728\u52A0\u8F7D\u66F4\u591A") : ""))), _react2.default.createElement("div", { className: "taskname create", __source: {
          fileName: _jsxFileName,
          lineNumber: 712
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 713
        }
      }, "\u4EFB\u52A1\u540D\u79F0\uFF1A"), _react2.default.createElement("div", { className: "rightDescTask", __source: {
          fileName: _jsxFileName,
          lineNumber: 714
        }
      }, _react2.default.createElement(_input2.default, {
        placeholder: "\u5EFA\u8BAE\u4E0D\u8D85\u8FC750\u4E2A\u5B57",
        className: "input",
        autoFocus: true,
        value: taskInfo.name.slice(0, 50),
        onChange: function onChange(e) {
          _this10.editVal(e.target.value, "name");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 715
        }
      }), _react2.default.createElement("div", { className: "titnum", __source: {
          fileName: _jsxFileName,
          lineNumber: 724
        }
      }, _react2.default.createElement("span", { className: "titlength", __source: {
          fileName: _jsxFileName,
          lineNumber: 725
        }
      }, taskNameLength), "/50"))), _react2.default.createElement("div", { className: showMore == "b" ? "taskDesc create" : "noCreate", __source: {
          fileName: _jsxFileName,
          lineNumber: 729
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 730
        }
      }, "\u63CF\u8FF0\uFF1A"), _react2.default.createElement("div", { className: "rightDesc taskDiv", __source: {
          fileName: _jsxFileName,
          lineNumber: 731
        }
      }, _react2.default.createElement(TextArea, {
        placeholder: "\u8BF7\u8F93\u5165\u4EFB\u52A1\u63CF\u8FF0\uFF08tips\uFF1A\u622A\u56FE\u53EFCtr+V\u5FEB\u901F\u4E0A\u4F20~\uFF09",
        autosize: { minRows: 1, maxRows: 6 },
        value: taskInfo.desc,
        onChange: function onChange(e, txtNull) {
          _this10.editVal(e.target.value, "desc", txtNull);
        },
        onPaste: function onPaste(e) {
          _this10.pasteingImg(e);
        },
        onFocus: function onFocus() {
          _this10.setState({ descDetailsShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 732
        }
      }), _react2.default.createElement("div", {
        className: descDetailsShow ? "clearfix" : " clearfix noclearfix",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 746
        }
      }, _react2.default.createElement(_upload2.default, {
        action: _HttpClient.baseURI + "/files/upload",
        listType: "picture-card",
        fileList: uploadList_desc,
        onPreview: this.handlePreview,
        multiple: true,
        onChange: function onChange(val) {
          if ((0, _util.beforeUpload)(val.file)) {
            _this10.uploadListOnChange_desc(val);
          }
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 751
        }
      }), _react2.default.createElement(_modal2.default, {
        visible: previewVisible,
        footer: null,
        onCancel: function onCancel() {
          _this10.setState({ previewVisible: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 765
        }
      }, _react2.default.createElement("img", {
        alt: "example",
        style: { width: "100%" },
        src: previewImage,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 772
        }
      }))), descDetailsShow ? _react2.default.createElement("div", { className: "fileTitle", __source: {
          fileName: _jsxFileName,
          lineNumber: 780
        }
      }, "\u9644\u4EF6", _react2.default.createElement("i", {
        // type="paper-clip"
        className: "iconfont icon-md-attach clip"
        // className="clip"
        , onClick: function onClick() {
          _this10.updataFile();
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 782
        }
      })) : "", descDetailsShow ? taskInfo.filesList && taskInfo.filesList.length > 0 && _react2.default.createElement("div", { className: "fileList", __source: {
          fileName: _jsxFileName,
          lineNumber: 797
        }
      }, taskInfo.filesList.map(function (item, i) {
        if (item.fileId) {
          return _react2.default.createElement("div", { className: "file", key: item.fileId, __source: {
              fileName: _jsxFileName,
              lineNumber: 801
            }
          }, _react2.default.createElement("p", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 802
            }
          }, item.fileType), _react2.default.createElement("div", { className: "fileName textMore", __source: {
              fileName: _jsxFileName,
              lineNumber: 803
            }
          }, item.fileName), _react2.default.createElement("div", { className: "icon", __source: {
              fileName: _jsxFileName,
              lineNumber: 806
            }
          }, _react2.default.createElement("i", {
            // type="download"iconfont icon-download
            className: "iconfont icon-download",
            onClick: function onClick() {
              return _dingJSApi2.default.previewImage(item);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 807
            }
          }), _react2.default.createElement("i", {
            // type="delete"
            className: "iconfont icon-icon_huabanfuben5",
            onClick: function onClick() {
              _this10.dellDescFileById(item.fileId);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 812
            }
          })));
        }
      })) : "")), showMore == "b" ? _react2.default.createElement("div", { className: "tagList", __source: {
          fileName: _jsxFileName,
          lineNumber: 830
        }
      }, _react2.default.createElement("i", { className: "icon iconfont icon-biaoqian1 icon", __source: {
          fileName: _jsxFileName,
          lineNumber: 831
        }
      }), _react2.default.createElement("div", { className: "tit", __source: {
          fileName: _jsxFileName,
          lineNumber: 832
        }
      }, "\u6807\u7B7E"), _react2.default.createElement("div", {
        className: "valBox",
        style: { margin: "0", padding: "0 10px 0 0" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 833
        }
      }, _react2.default.createElement(_tag2.default, {
        tagSelecteds: taskInfo.tags,
        canAdd: true,
        canEdit: true,
        tagChangeCallBack: function tagChangeCallBack(val) {
          _this10.tagChange(val);
        },
        maxHeight: "300px",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 837
        }
      }))) : "", showMore == "a" ? _react2.default.createElement("div", { className: "modalMore", __source: {
          fileName: _jsxFileName,
          lineNumber: 852
        }
      }, _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 853
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-fuzeren1", __source: {
          fileName: _jsxFileName,
          lineNumber: 854
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 855
        }
      }, "\u8D1F\u8D23\u4EBA"), _react2.default.createElement("div", {
        className: "inputBox",
        onClick: function onClick() {
          _this10.selUser("负责人");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 856
        }
      }, taskInfo.fzr.userid ? _react2.default.createElement("div", { className: "person", __source: {
          fileName: _jsxFileName,
          lineNumber: 863
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 864
        }
      }, taskInfo.fzr.name), _react2.default.createElement("svg", {
        "aria-hidden": "true",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          that.remove("fzr", taskInfo.fzr.userid);
        },
        className: "close",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 865
        }
      }, _react2.default.createElement("use", { xlinkHref: "#pro-myfg-yichu", __source: {
          fileName: _jsxFileName,
          lineNumber: 874
        }
      }))) : "请选择")), _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 882
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-riqi1", __source: {
          fileName: _jsxFileName,
          lineNumber: 883
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 884
        }
      }, "\u622A\u6B62\u65F6\u95F4"), _react2.default.createElement("div", { className: "inputBox dateTimeBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 885
        }
      }, _react2.default.createElement("div", {
        className: "dateBox",
        style: taskPlanDate !== "" ? { color: "rgba(0,0,0,.65)" } : { color: "transparent" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 886
        }
      }, _react2.default.createElement(_datePicker2.default, {
        placeholder: "\u8BF7\u9009\u62E9\u65E5\u671F",
        className: "date",
        value: taskPlanDate !== "" ? (0, _moment2.default)(taskPlanDate, "YYYY-MM-DD") : (0, _moment2.default)(newDateTime, "YYYY-MM-DD"),
        onChange: function onChange(date, dateString) {
          _this10.dateTimeChange(dateString, taskPlanTime);
        },
        format: "YYYY-MM-DD",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 894
        }
      }), taskPlanDate !== "" ? "" : _react2.default.createElement("span", { className: "placeHolder", __source: {
          fileName: _jsxFileName,
          lineNumber: 910
        }
      }, "\u8BF7\u9009\u62E9\u65E5\u671F")), _react2.default.createElement("div", {
        className: "timeBox",
        onClick: function onClick() {
          _this10.timePlanChange();
        },
        style: taskPlanTime !== "" ? { color: "rgba(0,0,0,.65)" } : { color: "transparent" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 913
        }
      }, _react2.default.createElement(_timePicker2.default, {
        placeholder: "\u65F6\u95F4",
        className: "date",
        value: taskPlanTime !== "" ? (0, _moment2.default)(taskPlanTime, "HH:mm") : (0, _moment2.default)(newDateTimes, "HH:mm"),
        disabled: taskPlanDate === "" ? true : false,
        onChange: function onChange(date, dateString) {
          _this10.dateTimeChange(taskPlanDate, dateString);
        },
        format: "HH:mm",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 924
        }
      }), taskPlanTime !== "" ? "" : _react2.default.createElement("span", {
        className: "placeHolder",
        style: taskPlanDate === "" ? { zIndex: "30" } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 941
        }
      }, "\u65F6\u95F4"))))) : ""), showMore == "b" ? _react2.default.createElement("div", { className: "modalMore", __source: {
          fileName: _jsxFileName,
          lineNumber: 957
        }
      }, _react2.default.createElement("div", { className: "leftBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 958
        }
      }, _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 959
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-fuzeren1", __source: {
          fileName: _jsxFileName,
          lineNumber: 960
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 961
        }
      }, "\u8D1F\u8D23\u4EBA"), _react2.default.createElement("div", {
        className: "inputBox",
        onClick: function onClick() {
          _this10.selUser("负责人");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 962
        }
      }, taskInfo.fzr.userid ? _react2.default.createElement("div", { className: "person", __source: {
          fileName: _jsxFileName,
          lineNumber: 969
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 970
        }
      }, taskInfo.fzr.name), _react2.default.createElement("svg", {
        "aria-hidden": "true",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          that.remove("fzr", taskInfo.fzr.userid);
        },
        className: "close",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 971
        }
      }, _react2.default.createElement("use", { xlinkHref: "#pro-myfg-yichu", __source: {
          fileName: _jsxFileName,
          lineNumber: 980
        }
      }))) : "请选择")), _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 988
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-riqi1", __source: {
          fileName: _jsxFileName,
          lineNumber: 989
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 990
        }
      }, "\u622A\u6B62\u65F6\u95F4"), _react2.default.createElement("div", { className: "inputBox dateTimeBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 991
        }
      }, _react2.default.createElement("div", {
        className: "dateBox",
        style: taskPlanDate !== "" ? { color: "rgba(0,0,0,.65)" } : { color: "transparent" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 992
        }
      }, _react2.default.createElement(_datePicker2.default, {
        placeholder: "\u8BF7\u9009\u62E9\u65E5\u671F",
        className: "date",
        value: taskPlanDate !== "" ? (0, _moment2.default)(taskPlanDate, "YYYY-MM-DD") : (0, _moment2.default)(newDateTime, "YYYY-MM-DD"),
        onChange: function onChange(date, dateString) {
          _this10.dateTimeChange(dateString, taskPlanTime);
        },
        format: "YYYY-MM-DD",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1000
        }
      }), taskPlanDate !== "" ? "" : _react2.default.createElement("span", { className: "placeHolder", __source: {
          fileName: _jsxFileName,
          lineNumber: 1016
        }
      }, "\u8BF7\u9009\u62E9\u65E5\u671F")), _react2.default.createElement("div", {
        className: "timeBox",
        onClick: function onClick() {
          _this10.timePlanChange();
        },
        style: taskPlanTime !== "" ? { color: "rgba(0,0,0,.65)" } : { color: "transparent" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1019
        }
      }, _react2.default.createElement(_timePicker2.default, {
        placeholder: "\u65F6\u95F4",
        className: "date",
        value: taskPlanTime !== "" ? (0, _moment2.default)(taskPlanTime, "HH:mm") : (0, _moment2.default)(newDateTimes, "HH:mm"),
        disabled: taskPlanDate === "" ? true : false,
        onChange: function onChange(date, dateString) {
          _this10.dateTimeChange(taskPlanDate, dateString);
        },
        format: "HH:mm",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1030
        }
      }), taskPlanTime !== "" ? "" : _react2.default.createElement("span", {
        className: "placeHolder",
        style: taskPlanDate === "" ? { zIndex: "30" } : {},
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1047
        }
      }, "\u65F6\u95F4")))), _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 1057
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-yujigongqi", __source: {
          fileName: _jsxFileName,
          lineNumber: 1058
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1059
        }
      }, "\u8BA1\u5212\u5DE5\u671F"), _react2.default.createElement("div", { className: "inputBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 1060
        }
      }, _react2.default.createElement(_input2.default, {
        className: "inputNumber",
        placeholder: "\u8BF7\u8F93\u5165",
        value: taskInfo.yjgq,
        onChange: function onChange(e) {
          (0, _util.onlyNumber)(e.target);
          _this10.editVal(e.target.value, "yjgq");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1061
        }
      }), _react2.default.createElement("span", { className: "day", __source: {
          fileName: _jsxFileName,
          lineNumber: 1070
        }
      }, "\u5929")))), _react2.default.createElement("div", { className: "rightBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 1074
        }
      }, _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 1075
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-shenheren1", __source: {
          fileName: _jsxFileName,
          lineNumber: 1076
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1077
        }
      }, "\u786E\u8BA4\u4EBA"), _react2.default.createElement("div", {
        className: "inputBox",
        onClick: function onClick() {
          _this10.selUser("确认人");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1078
        }
      }, taskInfo.shr.userid ? _react2.default.createElement("div", { className: "person", __source: {
          fileName: _jsxFileName,
          lineNumber: 1085
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1086
        }
      }, taskInfo.shr.name), _react2.default.createElement("svg", {
        "aria-hidden": "true",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          that.remove("shr", taskInfo.shr.userid);
        },
        className: "close",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1087
        }
      }, _react2.default.createElement("use", { xlinkHref: "#pro-myfg-yichu", __source: {
          fileName: _jsxFileName,
          lineNumber: 1096
        }
      }))) : "请选择")), _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 1104
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-jixiao", __source: {
          fileName: _jsxFileName,
          lineNumber: 1105
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1106
        }
      }, "\u4EFB\u52A1\u7EE9\u6548"), _react2.default.createElement("div", { className: "inputBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 1107
        }
      }, _react2.default.createElement(_input2.default, {
        className: "inputNumber",
        placeholder: "\u8BF7\u8F93\u5165\u6570\u5B57",
        onChange: function onChange(e) {
          (0, _util.onlyNumber)(e.target);
          _this10.editVal(e.target.value, "rwjx");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1108
        }
      }))), _react2.default.createElement("div", { className: "moreList", __source: {
          fileName: _jsxFileName,
          lineNumber: 1118
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-youxianji", __source: {
          fileName: _jsxFileName,
          lineNumber: 1119
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1120
        }
      }, "\u4F18\u5148\u7EA7"), _react2.default.createElement("div", { className: "inputBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 1121
        }
      }, _react2.default.createElement(_select2.default, {
        defaultValue: "\u8BF7\u9009\u62E9",
        className: taskInfo.zycd == "0" ? "selectNo" : "select",
        value: taskInfo.zycd,
        onChange: function onChange(value) {
          _this10.editVal(value, "zycd");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1122
        }
      }, _react2.default.createElement(Option, { value: "0", __source: {
          fileName: _jsxFileName,
          lineNumber: 1130
        }
      }, "\u8BF7\u9009\u62E9"), _react2.default.createElement(Option, { value: "3", __source: {
          fileName: _jsxFileName,
          lineNumber: 1131
        }
      }, "\u9AD8"), _react2.default.createElement(Option, { value: "2", __source: {
          fileName: _jsxFileName,
          lineNumber: 1132
        }
      }, "\u4E2D"), _react2.default.createElement(Option, { value: "1", __source: {
          fileName: _jsxFileName,
          lineNumber: 1133
        }
      }, "\u4F4E")))))) : "", showMore == "b" ? _react2.default.createElement("div", { className: "modalMore", __source: {
          fileName: _jsxFileName,
          lineNumber: 1143
        }
      }, _react2.default.createElement("div", { className: "listMore", __source: {
          fileName: _jsxFileName,
          lineNumber: 1144
        }
      }, _react2.default.createElement("i", { className: "iconfont icon-fuzeren1", __source: {
          fileName: _jsxFileName,
          lineNumber: 1145
        }
      }), _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1146
        }
      }, "\u5173\u6CE8\u4EBA"), _react2.default.createElement("div", { className: "gzrMore", __source: {
          fileName: _jsxFileName,
          lineNumber: 1147
        }
      }, _react2.default.createElement("div", { className: "plusBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 1148
        }
      }, _react2.default.createElement("i", {
        className: "iconfont icon-add2",
        style: { color: "#bdbdbd" },
        onClick: function onClick() {
          _this10.selUser("关注人");
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 1149
        }
      })), taskInfo.collectUser && taskInfo.collectUser.length > 0 ? taskInfo.collectUser.map(function (item) {
        return _react2.default.createElement("div", { className: "person", __source: {
            fileName: _jsxFileName,
            lineNumber: 1160
          }
        }, _react2.default.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 1161
          }
        }, item.name), _react2.default.createElement("svg", {
          "aria-hidden": "true",
          onClick: function onClick(e) {
            e.stopPropagation();
            e.preventDefault();
            that.removeCollectUser(item);
          },
          className: "close",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 1162
          }
        }, _react2.default.createElement("use", { xlinkHref: "#pro-myfg-yichu", __source: {
            fileName: _jsxFileName,
            lineNumber: 1171
          }
        })));
      }) : ""))) : ""));
    }
  }]);

  return taskCreate;
}(_react2.default.Component);

exports.default = taskCreate;