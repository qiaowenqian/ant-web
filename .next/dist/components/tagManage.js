"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _popconfirm = require("antd/lib/popconfirm");

var _popconfirm2 = _interopRequireDefault(_popconfirm);

var _defineProperty2 = require("next\\node_modules\\babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _input = require("antd/lib/input");

var _input2 = _interopRequireDefault(_input);

var _spin = require("antd/lib/spin");

var _spin2 = _interopRequireDefault(_spin);

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

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tagManage = require("../styles/components/tagManage.scss");

var _tagManage2 = _interopRequireDefault(_tagManage);

var _nullView = require("../components/nullView");

var _nullView2 = _interopRequireDefault(_nullView);

var _util = require("../core/utils/util");

var _tag = require("../core/service/tag.service");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\tagManage.js";


var confirm = _modal2.default.confirm;
/*****
 * type:1      //个人标签
 * type:2      //公共标签
 * type:3      //项目分类
 * closedCallBack()     //关闭弹层回调
 * title:''            //弹框标题显示
 * isEdit:        //是否可编辑
 * canEdit:      //是否是管理员
 * *****/

var tagManage = function (_React$Component) {
  (0, _inherits3.default)(tagManage, _React$Component);

  function tagManage(props) {
    (0, _classCallCheck3.default)(this, tagManage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (tagManage.__proto__ || (0, _getPrototypeOf2.default)(tagManage)).call(this, props));

    _this.state = {
      exitShow: false, //添加标签分类是否显示
      addsecondShow: false, //添加二级标签是否显示
      colorList: [],
      tagList: [],
      tagIndex: "-1",
      tagTwoIndex: "0",
      labelIndex: "0",
      selectColor: "75ccff",
      greateLabelName: "",
      greateLabelTwoName: "",
      parentList: [],
      indexList: [],
      pid: "",
      twoEditShow: false,
      oneEditShow: false,
      deleteShow: false,
      projectManageLoading: false,
      publicTagLoading: false,
      personTagLoading: false,
      oneEditIndex: null,
      oneLabelOldName: null,
      twoLabelOldName: null,
      oneLabelEditName: null,
      twoLabelEditName: null,
      oneDeleteIconIndex: null,
      addLabelName: "", //新增分组名
      isEdit: true,
      childTagId: ""
    };
    return _this;
  }

  (0, _createClass3.default)(tagManage, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.type == "3") {
        this.getProjectManage();
      } else if (this.props.type == "2") {
        this.getPublicTag();
        // this.getPersonLabel();
      } else if (this.props.type == "1") {
        this.getPersonLabel();
      }
      if ((0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版") {
        this.setState({ isEdit: false });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.type == "3") {
        this.getProjectManage();
      } else if (nextProps.type == "2") {
        this.getPublicTag();
        // this.getPersonLabel();
      } else if (nextProps.type == "1") {
        this.getPersonLabel();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }

    //获取项目分类

  }, {
    key: "getProjectManage",
    value: function getProjectManage() {
      var _this2 = this;

      this.setState({ projectManageLoading: true });
      (0, _tag.getProjectTypeList)(function (data) {
        if (data.err) {
          return false;
        }
        _this2.setState({
          colorList: data.colorList,
          tagList: data.labels,
          projectManageLoading: false
        });
      });
    }
    //获取公共标签

  }, {
    key: "getPublicTag",
    value: function getPublicTag() {
      var _this3 = this;

      this.setState({ publicTagLoading: true });
      (0, _tag.getLabelList)(function (data) {
        if (data.err) {
          return false;
        }
        _this3.setState({
          colorList: data.colorList,
          tagList: data.labels,
          publicTagLoading: false
        });
      });
    }
    //获取个人标签和任务标签

  }, {
    key: "getPersonLabel",
    value: function getPersonLabel() {
      var _this4 = this;

      this.setState({ personTagLoading: true });
      (0, _tag.getTagList)(function (data) {
        if (data.err) {
          return false;
        }
        if (data) {
          _this4.setState({
            personTagLoading: false,
            tagList: data,
            publicTagLoading: false
          });
        }
      });
    }
  }, {
    key: "changeColor",
    value: function changeColor(e) {
      this.setState({ selectColor: e });
    }
    //编辑标签颜色

  }, {
    key: "updateLabelColor",
    value: function updateLabelColor(e, mainTag) {
      var _this5 = this;

      if (mainTag) {
        var parms = {
          labelname: mainTag.labelname,
          id: mainTag.id,
          color: e,
          parent: { id: mainTag.id }
        };
        (0, _tag.updateLabel)(parms, function (data) {
          if (data.err) {
            return false;
          }
          if (data) {
            _message3.default.success("修改成功");
            if (_this5.props.type == "3") {
              _this5.getProjectManage();
            } else if (_this5.props.type == "2") {
              _this5.getPublicTag();
            }
            _this5.setState({
              oneEditIndex: null,
              twoEditIndex: null,
              oneLabelEditName: null,
              twoLabelEditName: null
            });
          }
        });
      }
    }
    //删除标签或删除项目分类

  }, {
    key: "labelDelete",
    value: function labelDelete(e, id) {
      var _this6 = this;

      e.stopPropagation();
      e.preventDefault();
      (0, _tag.deleteLabel)(id, function (data) {
        if (data.err) {
          return false;
        }
        if (data) {
          _message3.default.success("操作成功");
          _this6.setState({ delLabels: [] });
        }
        if (_this6.props.type == "3") {
          _this6.getProjectManage();
        } else if (_this6.props.type == "2") {
          _this6.getPublicTag();
        } else if (_this6.props.type == "1") {
          _this6.getPersonLabel();
        }
      });
    }
    //点击返回一级标签的下标

  }, {
    key: "labelClick",
    value: function labelClick(id) {
      var tagList = this.state.tagList;

      for (var i = 0; i < tagList.length; i++) {
        var item = tagList[i];
        if (item.id == id) {
          this.setState({ tagIndex: i });
          break;
        }
      }
    }
    //点击二级标签返回二级标签

  }, {
    key: "labelTwoClick",
    value: function labelTwoClick(pid, id, index) {
      var _state = this.state,
          tagList = _state.tagList,
          indexList = _state.indexList,
          parentList = _state.parentList,
          labelIndex = _state.labelIndex;

      var that = this;
      if (this.props.type == "1") {
        for (var _i = 0; _i < parentList.length; _i++) {
          var item = parentList[_i];
          if (item.id == id) {
            that.setState({ tagTwoIndex: _i });
            if (indexList.indexOf(index) !== -1) {
              indexList.splice(indexList.indexOf(index), 1);
            } else {
              indexList.push(index);
            }
            this.setState({ indexList: indexList });
            break;
          }
        }
      } else {
        for (var j = 0; j < tagList.length; j++) {
          var tag = tagList[j];
          if (tag.id == pid) {
            this.setState({ labelIndex: j });
          }
        }
        for (var i = 0; i < tagList[labelIndex].parentList.length; i++) {
          var label = tagList[labelIndex].parentList[i];
          if (label.id == id) {
            that.setState({ tagTwoIndex: i });
            if (indexList.indexOf(index) !== -1) {
              indexList.splice(indexList.indexOf(index), 1);
            } else {
              indexList.push(index);
            }
            this.setState({ indexList: indexList });
            break;
          }
        }
      }
    }
    // 编辑标签

  }, {
    key: "labelEdit",
    value: function labelEdit(id, name, labNo, color, parentid) {
      var _this7 = this;

      if (name && name.length > 16) {
        _message3.default.error("标签长度不能大于16个字符");
        return;
      }
      if (labNo == "one" && (name == this.state.oneLabelOldName || name == null) || labNo == "two" && (name == null || name == this.state.twoLabelOldName)) {
        this.setState({
          oneEditIndex: null,
          twoEditIndex: null,
          oneLabelEditName: null,
          twoLabelEditName: null
        });
      } else {
        var data = {
          labelname: name,
          id: id,
          color: color,
          parent: { id: parentid }
        };
        (0, _tag.updateLabel)(data, function (data) {
          if (data.err) {
            return false;
          }
          if (_this7.props.type == "3") {
            _this7.getProjectManage();
          } else if (_this7.props.type == "2") {
            _this7.getPublicTag();
          } else if (_this7.props.type == "1") {
            _this7.getPersonLabel();
          }
          _message3.default.success("修改成功");
          _this7.setState({
            oneEditIndex: null,
            twoEditIndex: null,
            oneLabelEditName: null,
            twoLabelEditName: null
          });
        });
      }
    }
    //添加标签

  }, {
    key: "submitLabel",
    value: function submitLabel(e, tag) {
      var _this8 = this;

      e.stopPropagation();
      e.preventDefault();
      var _state2 = this.state,
          tagList = _state2.tagList,
          selectColor = _state2.selectColor,
          labelIndex = _state2.labelIndex,
          greateLabelName = _state2.greateLabelName,
          greateLabelTwoName = _state2.greateLabelTwoName;

      if (tag == "一级" && greateLabelTwoName && greateLabelTwoName.length > 16) {
        _message3.default.error("一级标签长度不能大于16个字符");
        return;
      }
      if (tag == "二级" && greateLabelName && greateLabelName.length > 16) {
        _message3.default.error("二级标签长度不能大于16个字符");
        return;
      }

      if (tag == "一级") {
        var name = greateLabelTwoName;
        var data = { labelname: name, color: selectColor };
        if (this.props.type == "3") {
          (0, _tag.addProjectType)(data, "", function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _message3.default.success("添加成功");
              _this8.setState({ greateLabelTwoName: "" });
            }
            _this8.getProjectManage();
          });
        } else if (this.props.type == "2") {
          (0, _tag.addLabel)(data, "", function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _message3.default.success("添加成功");
            }
            _this8.getPublicTag();
          });
        }
        this.setState({ exitShow: false });
      } else if (tag == "二级") {
        var pid = tagList[labelIndex].id;
        var _name = greateLabelName;
        var _data = { labelname: _name, color: "" };
        if (this.props.type == "3") {
          (0, _tag.addProjectType)(_data, pid, function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _message3.default.success("添加成功");
            }
            _this8.getProjectManage();
          });
        } else if (this.props.type == "2") {
          (0, _tag.addLabel)(_data, pid, function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _message3.default.success("添加成功");
            }
            _this8.getPublicTag();
          });
        }
      }
    }
    //添加个人标签

  }, {
    key: "addPerson",
    value: function addPerson(e) {
      var _this9 = this;

      var _state3 = this.state,
          pid = _state3.pid,
          greateLabelName = _state3.greateLabelName;

      var name = greateLabelName;
      (0, _tag.addPersonLabel)(name, pid, function (res) {
        if (res.err) {
          return false;
        }
        if (res) {
          _message3.default.success("添加成功");
        }
        _this9.getPersonLabel();
      });
      this.setState({ addsecondShow: false });
    }
    //添加标签方法

  }, {
    key: "addLabel",
    value: function addLabel(e, tag) {
      if (this.props.type == "1") {
        if (!e.target.value) {
          _message3.default.info("请输入标签名称");
          return;
        }
        this.addPerson(e);
      } else {
        this.submitLabel(e, tag);
      }
    }
    //提示弹框

  }, {
    key: "showConfirm",
    value: function showConfirm(title, e, id) {
      var that = this;
      confirm({
        title: title,
        onOk: function onOk() {
          that.labelDelete(e, id);
        },
        onCancel: function onCancel() {}
      });
    }
    //移动标签

  }, {
    key: "moveProjectTag",
    value: function moveProjectTag(id, pid) {
      var _this10 = this;

      (0, _tag.updateLabelParent)(id, pid, function (data) {
        if (data.err) {
          return false;
        }
        var updateTagList = [];
        if (data.labels.length > 0) {
          data.labels.map(function (item, i) {
            if (item.type === "3") {
              updateTagList.push(item);
            }
            _this10.setState({ tagList: updateTagList });
          });
        }
      });
    }
  }, {
    key: "drag",
    value: function drag(ev) {
      ev.dataTransfer.setData("object", ev.target.id);
    }
  }, {
    key: "allowDrop",
    value: function allowDrop(ev) {
      ev.preventDefault();
    }
  }, {
    key: "drop",
    value: function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("object");
      // ev.target.appendChild(document.getElementById(data));
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      var _state4 = this.state,
          colorList = _state4.colorList,
          tagList = _state4.tagList,
          exitShow = _state4.exitShow,
          tagIndex = _state4.tagIndex,
          projectManageLoading = _state4.projectManageLoading,
          publicTagLoading = _state4.publicTagLoading,
          personTagLoading = _state4.personTagLoading,
          addsecondShow = _state4.addsecondShow,
          labelIndex = _state4.labelIndex,
          tagTwoIndex = _state4.tagTwoIndex,
          oneEditIndex = _state4.oneEditIndex,
          greateLabelName = _state4.greateLabelName,
          greateLabelTwoName = _state4.greateLabelTwoName,
          twoEditShow = _state4.twoEditShow,
          oneEditShow = _state4.oneEditShow,
          isEdit = _state4.isEdit,
          childTagId = _state4.childTagId;

      var that = this;
      return _react2.default.createElement(_modal2.default, {
        title: this.props.title,
        visible: true,
        onCancel: function onCancel() {
          _this11.props.closedCallBack();
        },
        width: 800,
        wrapClassName: "tagManageModal",
        footer: null,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 455
        }
      }, _react2.default.createElement("div", {
        className: "manageBox",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          _this11.setState({ exitShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 465
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _tagManage2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 473
        }
      }), _react2.default.createElement(_spin2.default, {
        spinning: projectManageLoading || publicTagLoading || personTagLoading,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 474
        }
      }), _react2.default.createElement("div", { className: "tagListBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 479
        }
      }, tagList && tagList.length > 0 ? tagList.map(function (item, i) {
        var _React$createElement;

        return _react2.default.createElement("div", { className: "tagList", key: item.id, __source: {
            fileName: _jsxFileName,
            lineNumber: 483
          }
        }, _react2.default.createElement("div", { className: "tagTop", __source: {
            fileName: _jsxFileName,
            lineNumber: 484
          }
        }, oneEditIndex == i && oneEditShow && false ? _react2.default.createElement(_input2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 486
          }
        }) : _this11.props.canEdit === "1" ? _react2.default.createElement(_popover2.default, {
          content: _react2.default.createElement(_input2.default, {
            className: "addGroupName",
            defaultValue: item.labelname,
            onPressEnter: function onPressEnter() {
              _this11.labelEdit(item.id, _this11.state.oneLabelEditName, "one", item.color, item.id);
              _this11.setState({ oneEditShow: false });
            },
            onBlur: function onBlur() {
              _this11.labelEdit(item.id, _this11.state.oneLabelEditName, "one", item.color, item.id);
              _this11.setState({ oneEditShow: false });
            },
            onChange: function onChange(e) {
              that.setState({
                oneLabelEditName: e.target.value
              });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 490
            }
          }),
          trigger: "click",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 488
          }
        }, _react2.default.createElement("div", {
          className: "tagName",
          onClick: function onClick() {
            _this11.setState({
              oneEditIndex: i,
              oneEditShow: true
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 522
          }
        }, item.labelname)) : _react2.default.createElement("div", { className: "tagName", __source: {
            fileName: _jsxFileName,
            lineNumber: 535
          }
        }, item.labelname), _react2.default.createElement("div", { className: "colorSelect", __source: {
            fileName: _jsxFileName,
            lineNumber: 537
          }
        }, _this11.props.canEdit === "1" ? _react2.default.createElement(_popover2.default, {
          content: colorList && colorList.length > 0 ? colorList.map(function (color, value) {
            return _react2.default.createElement("span", { key: color.id, __source: {
                fileName: _jsxFileName,
                lineNumber: 544
              }
            }, _react2.default.createElement("div", {
              className: "selTagColor " + (0, _util.getTagColorByColorCode)("2", color.value),
              onClick: function onClick(e) {
                _this11.updateLabelColor(color.value, item);
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 545
              }
            }));
          }) : "",
          placement: "topLeft",
          trigger: "click",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 539
          }
        }, _react2.default.createElement("div", {
          className: "selectCard " + (0, _util.getTagColorByColorCode)("2", item.color),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 568
          }
        })) : _react2.default.createElement("div", (_React$createElement = {
          className: "selectCard"
        }, (0, _defineProperty3.default)(_React$createElement, "className", "selectCard " + (0, _util.getTagColorByColorCode)("2", item.color)), (0, _defineProperty3.default)(_React$createElement, "__source", {
          fileName: _jsxFileName,
          lineNumber: 576
        }), _React$createElement))), item.labelname !== "" && _this11.props.canEdit === "1" ? _react2.default.createElement(_popconfirm2.default, {
          title: "\u662F\u5426\u5220\u9664\u8BE5\u5206\u7EC4\u4EE5\u53CA\u5206\u7EC4\u4E0B\u7684\u6240\u6709\u6807\u7B7E\uFF1F",
          onConfirm: function onConfirm(e) {
            _this11.labelDelete(e, item.id);
          },
          okText: "\u5220\u9664",
          cancelText: "\u53D6\u6D88",
          placement: "topRight",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 587
          }
        }, _react2.default.createElement("i", { className: "iconfont icon-icon_huabanfuben5", __source: {
            fileName: _jsxFileName,
            lineNumber: 596
          }
        })) : ""), _react2.default.createElement("div", { className: "tagBottom", __source: {
            fileName: _jsxFileName,
            lineNumber: 602
          }
        }, _react2.default.createElement("ul", {
          id: "tag" + i,
          onDrop: function onDrop(e) {
            _this11.drop(e);
            _this11.moveProjectTag(childTagId, item.id);
          },
          onDragOver: function onDragOver(e) {
            _this11.allowDrop(e);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 603
          }
        }, item.parentList && item.parentList.length > 0 ? item.parentList.map(function (tim, index) {
          return _react2.default.createElement("li", {
            key: tim.id,
            draggable: _this11.props.canEdit === "1" ? true : false,
            id: i + "childTag" + index,
            onDragStart: function onDragStart(e) {
              _this11.drag(e);
              _this11.setState({ childTagId: tim.id });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 616
            }
          }, tagIndex == i && tagTwoIndex == index && twoEditShow ? _react2.default.createElement(_input2.default, {
            className: "exitName",
            defaultValue: tim.labelname,
            autoFocus: true,
            onPressEnter: function onPressEnter() {
              that.labelEdit(tim.id, that.state.twoLabelEditName, "two", item.color, item.id);
              _this11.setState({ twoEditShow: false });
            },
            placeholder: tim.labelname,
            onChange: function onChange(e) {
              that.setState({
                twoLabelEditName: e.target.value
              });
            },
            onBlur: function onBlur() {
              that.labelEdit(tim.id, that.state.twoLabelEditName, "two", item.color, item.id);
              _this11.setState({ twoEditShow: false });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 632
            }
          }) : _react2.default.createElement("div", {
            style: {
              position: "relative",
              height: 22
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 664
            }
          }, _react2.default.createElement("span", {
            className: "labelName textMore " + (0, _util.getTagColorByColorCode)("1", item.color),
            onClick: function onClick() {
              _this11.setState({
                tagTwoIndex: index
              });
              _this11.labelClick(item.id);
              _this11.labelTwoClick(item.id, tim.id, index);
              {
                _this11.props.canEdit === "1" ? _this11.setState({
                  twoEditShow: true
                }) : "";
              }
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 670
            }
          }, tim.labelname), _this11.props.canEdit === "1" ? _react2.default.createElement(_icon2.default, {
            type: "close",
            className: "tagIcon",
            onClick: function onClick(e) {
              _this11.labelDelete(e, tim.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 700
            }
          }) : ""));
        }) : "", labelIndex == i && addsecondShow ? _react2.default.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 717
          }
        }, _react2.default.createElement(_input2.default, {
          className: "secondInput",
          onBlur: function onBlur(e) {
            _this11.setState({ addsecondShow: false });
            _this11.addLabel(e, "二级");
            _this11.setState({ greateLabelName: "" });
          },
          value: greateLabelName,
          autoFocus: true,
          onPressEnter: function onPressEnter(e) {
            _this11.setState({ addsecondShow: false });
            _this11.addLabel(e, "二级");
            _this11.setState({ greateLabelName: "" });
          },
          onChange: function onChange(e) {
            _this11.setState({
              greateLabelName: e.target.value
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 718
          }
        })) : "", _this11.props.canEdit === "1" && isEdit ? _react2.default.createElement("li", {
          className: "addSecond",
          onClick: function onClick() {
            _this11.setState({
              addsecondShow: true,
              labelIndex: i
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 743
          }
        }, "\u6DFB\u52A0\u65B0\u6807\u7B7E") : "")));
      }) : _react2.default.createElement(_nullView2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 763
        }
      })), _react2.default.createElement("div", { className: "addTagTitle-row", __source: {
          fileName: _jsxFileName,
          lineNumber: 767
        }
      }, _react2.default.createElement("div", {
        className: "addTagTitle",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          _this11.setState({ exitShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 768
        }
      }, this.props.canEdit === "1" && isEdit ? _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement(_input2.default, {
          placeholder: "\u8F93\u5165\u5206\u7EC4\u540D",
          className: "addGroupName",
          onPressEnter: function onPressEnter(e) {
            _this11.submitLabel(e, "一级");
          },
          onBlur: function onBlur(e) {
            _this11.submitLabel(e, "一级");
          },
          value: greateLabelTwoName,
          onChange: function onChange(e) {
            _this11.setState({ greateLabelTwoName: e.target.value });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 779
          }
        }),
        trigger: "click",
        visible: exitShow,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 777
        }
      }, _react2.default.createElement("span", { className: "add", __source: {
          fileName: _jsxFileName,
          lineNumber: 797
        }
      }, "\u6DFB\u52A0\u5206\u7EC4")) : isEdit ? _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 800
        }
      }, "\u4EC5\u7BA1\u7406\u5458\u53EF\u4EE5\u7F16\u8F91") : _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 802
        }
      }, "\u4E13\u4E1A\u7248\u53EF\u6DFB\u52A0\u5206\u7EC4\u548C\u6807\u7B7E")))));
    }
  }]);

  return tagManage;
}(_react2.default.Component);

exports.default = tagManage;