"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _popconfirm = require("antd/lib/popconfirm");

var _popconfirm2 = _interopRequireDefault(_popconfirm);

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tagManage = require("../../styles/components/tagManage.scss");

var _tagManage2 = _interopRequireDefault(_tagManage);

var _nullView = require("../../components/nullView");

var _nullView2 = _interopRequireDefault(_nullView);

var _util = require("../../core/utils/util");

var _tag = require("../../core/service/tag.service");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\common\\tagManageTask.js";


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
      addsecondShowPer: false,
      colorList: [],
      tagList: [],
      tagIndex: "-1",
      tagIndexPer: "-1",
      tagTwoIndex: "0",
      tagTwoIndexPer: "0",
      labelIndex: "0",
      selectColor: "75ccff",
      greateLabelName: "",
      greateLabelNamePer: "",
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
      pidd: "",
      childTagId: ""
    };
    return _this;
  }

  (0, _createClass3.default)(tagManage, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getPersonLabelNew();
      this.getPublicTag();

      if ((0, _util.getTeamInfoWithMoney)("版本名称") === "基础版" || (0, _util.getTeamInfoWithMoney)("版本名称") === "免费版") {
        this.setState({ isEdit: false });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.getPersonLabelNew();
      this.getPublicTag();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }

    //获取公共标签

  }, {
    key: "getPublicTag",
    value: function getPublicTag() {
      var _this2 = this;

      this.setState({ publicTagLoading: true });
      (0, _tag.getLabelList)(function (data) {
        if (data.err) {
          return false;
        }
        _this2.setState({
          colorList: data.colorList,
          tagList: data.labels,
          publicTagLoading: false
        });
      });
    }
    //获取个人标签

  }, {
    key: "getPersonLabelNew",
    value: function getPersonLabelNew() {
      var _this3 = this;

      var canEdit = this.props.canEdit;

      var isAdimn = canEdit === "1" ? 1 : 0;
      (0, _tag.findLabelByAdimn)(isAdimn, function (data) {
        _this3.setState({
          colorList: data.colorList,
          parentList: data.labels,
          pidd: data.labels[0].id
        });
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
      var _this4 = this;

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
            if (_this4.props.type == "3") {
              _this4.getProjectManage();
            } else if (_this4.props.type == "2") {
              _this4.getPublicTag();
              _this4.getPersonLabelNew();
            }
            _this4.setState({
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
      var _this5 = this;

      e.stopPropagation();
      e.preventDefault();
      (0, _tag.deleteLabel)(id, function (data) {
        if (data.err) {
          return false;
        }
        if (data) {
          _message3.default.success("操作成功");
          _this5.setState({ delLabels: [] });
        }
        if (_this5.props.type == "3") {
          _this5.getProjectManage();
        } else if (_this5.props.type == "2") {
          _this5.getPublicTag();
          _this5.getPersonLabelNew();
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
          this.setState({ tagIndex: i, tagIndexPer: i });
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
            that.setState({ tagTwoIndex: _i, tagTwoIndexPer: _i });
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
            that.setState({ tagTwoIndex: i, tagTwoIndexPer: i });
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
      var _this6 = this;

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
          if (_this6.props.type == "3") {
            _this6.getProjectManage();
          } else if (_this6.props.type == "2") {
            _this6.getPublicTag();
          }
          _message3.default.success("修改成功");
          _this6.setState({
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
      var _this7 = this;

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
              _this7.setState({ greateLabelTwoName: "" });
            }
            _this7.getProjectManage();
          });
        } else if (this.props.type == "2") {
          (0, _tag.addLabel)(data, "", function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _message3.default.success("添加成功");
              _this7.setState({ greateLabelTwoName: "" });
            }
            _this7.getPublicTag();
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
              _this7.setState({ greateLabelTwoName: "" });
              _message3.default.success("添加成功");
            }
            _this7.getProjectManage();
          });
        } else if (this.props.type == "2") {
          (0, _tag.addLabel)(_data, pid, function (res) {
            if (res.err) {
              return false;
            }
            if (res) {
              _this7.setState({ greateLabelTwoName: "" });
              _message3.default.success("添加成功");
            }
            _this7.getPublicTag();
          });
        }
      }
    }
    //添加个人标签

  }, {
    key: "addPerson",
    value: function addPerson(e) {
      var _this8 = this;

      var _state3 = this.state,
          pidd = _state3.pidd,
          greateLabelName = _state3.greateLabelName;

      var name = greateLabelName;

      (0, _tag.addPersonLabel)(name, pidd, function (res) {
        if (res.err) {
          return false;
        }
        if (res) {
          _message3.default.success("添加成功");
        }
        _this8.getPersonLabelNew();
      });
      this.setState({ addsecondShowPer: false });
    }
    //添加标签方法

  }, {
    key: "addLabel",
    value: function addLabel(e, tag, type) {
      if (type === "c") {
        if (!e.target.value) {
          _message3.default.info("请输入标签名称");
          return;
        }
        this.addPerson(e);
      } else {
        this.submitLabel(e, tag);
      }
    }
    //移动标签

  }, {
    key: "moveProjectTag",
    value: function moveProjectTag(id, pid) {
      var _this9 = this;

      (0, _tag.updateLabelParent)(id, pid, function (data) {
        if (data.err) {
          return false;
        }
        var updateTagList = [];
        if (data.labels.length > 0) {
          data.labels.map(function (item, i) {
            if (item.type === "2") {
              updateTagList.push(item);
            }
            _this9.setState({ tagList: updateTagList });
          });
          _this9.getPersonLabelNew();
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
      var _this10 = this;

      var _state4 = this.state,
          colorList = _state4.colorList,
          tagList = _state4.tagList,
          exitShow = _state4.exitShow,
          tagIndex = _state4.tagIndex,
          parentList = _state4.parentList,
          projectManageLoading = _state4.projectManageLoading,
          publicTagLoading = _state4.publicTagLoading,
          personTagLoading = _state4.personTagLoading,
          addsecondShow = _state4.addsecondShow,
          addsecondShowPer = _state4.addsecondShowPer,
          labelIndex = _state4.labelIndex,
          tagTwoIndex = _state4.tagTwoIndex,
          greateLabelName = _state4.greateLabelName,
          greateLabelTwoName = _state4.greateLabelTwoName,
          twoEditShow = _state4.twoEditShow,
          isEdit = _state4.isEdit,
          childTagId = _state4.childTagId;

      var that = this;
      return _react2.default.createElement(_modal2.default, {
        title: this.props.title,
        visible: true,
        onCancel: function onCancel() {
          _this10.props.closedCallBack();
        },
        maskClosable: false,
        width: 800,
        wrapClassName: "tagManageModal",
        footer: null,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 421
        }
      }, _react2.default.createElement("div", {
        className: "manageBox",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          _this10.setState({ exitShow: false });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 432
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _tagManage2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 440
        }
      }), _react2.default.createElement(_spin2.default, {
        spinning: projectManageLoading || publicTagLoading || personTagLoading,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 441
        }
      }), _react2.default.createElement("div", { className: "tagListBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 447
        }
      }, tagList && tagList.length > 0 ? tagList.map(function (item, i) {
        return _react2.default.createElement("div", { className: "tagList", key: item.id, __source: {
            fileName: _jsxFileName,
            lineNumber: 451
          }
        }, _react2.default.createElement("div", { className: "tagTop", __source: {
            fileName: _jsxFileName,
            lineNumber: 452
          }
        }, _this10.props.canEdit === "1" ? _react2.default.createElement(_popover2.default, {
          content: _react2.default.createElement(_input2.default, {
            className: "addGroupName",
            defaultValue: item.labelname,
            onPressEnter: function onPressEnter() {
              _this10.labelEdit(item.id, _this10.state.oneLabelEditName, "one", item.color, item.id);

              _this10.setState({ oneEditShow: false });
            },
            onBlur: function onBlur() {
              _this10.labelEdit(item.id, _this10.state.oneLabelEditName, "one", item.color, item.id);
              _this10.setState({ oneEditShow: false });
            },
            onChange: function onChange(e) {
              that.setState({
                oneLabelEditName: e.target.value
              });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 456
            }
          }),
          trigger: "click",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 454
          }
        }, _react2.default.createElement("div", {
          className: "tagName",
          onClick: function onClick() {
            _this10.setState({
              oneEditIndex: i,
              oneEditShow: true
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 489
          }
        }, item.labelname)) : _react2.default.createElement("div", { className: "tagName", __source: {
            fileName: _jsxFileName,
            lineNumber: 502
          }
        }, item.labelname), _react2.default.createElement("div", { className: "colorSelect", __source: {
            fileName: _jsxFileName,
            lineNumber: 504
          }
        }, _this10.props.canEdit === "1" ? _react2.default.createElement(_popover2.default, {
          content: colorList && colorList.length > 0 ? colorList.map(function (color, value) {
            return _react2.default.createElement("span", { value: color.value, key: color.id, __source: {
                fileName: _jsxFileName,
                lineNumber: 511
              }
            }, _react2.default.createElement("div", {
              className: "selTagColor " + (0, _util.getTagColorByColorCode)("2", color.value),
              onClick: function onClick(e) {
                _this10.updateLabelColor(color.value, item);
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 512
              }
            }));
          }) : "",
          placement: "topLeft",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 506
          }
        }, _react2.default.createElement("div", {
          className: "selectCard " + (0, _util.getTagColorByColorCode)("2", item.color),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 534
          }
        })) : _react2.default.createElement("div", {
          className: "selectCard",
          style: {
            backgroundColor: (0, _util.getStringTagColor)(item) ? "#" + (0, _util.getStringTagColor)(item).substring(1) : ""
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 542
          }
        })), item.labelname !== "" && _this10.props.canEdit === "1" ? _react2.default.createElement(_popconfirm2.default, {
          title: "\u662F\u5426\u5220\u9664\u8BE5\u5206\u7EC4\u4EE5\u53CA\u5206\u7EC4\u4E0B\u7684\u6240\u6709\u6807\u7B7E\uFF1F",
          onConfirm: function onConfirm(e) {
            _this10.labelDelete(e, item.id);
          },
          okText: "\u5220\u9664",
          cancelText: "\u53D6\u6D88",
          placement: "topRight",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 554
          }
        }, _react2.default.createElement("i", { className: "iconfont icon-icon_huabanfuben5", __source: {
            fileName: _jsxFileName,
            lineNumber: 563
          }
        })) : ""), _react2.default.createElement("div", { className: "tagBottom", __source: {
            fileName: _jsxFileName,
            lineNumber: 570
          }
        }, _react2.default.createElement("ul", {
          id: "tag" + i,
          onDrop: function onDrop(e) {
            _this10.drop(e);
            _this10.moveProjectTag(childTagId, item.id);
          },
          onDragOver: function onDragOver(e) {
            _this10.allowDrop(e);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 571
          }
        }, item.parentList && item.parentList.length > 0 ? item.parentList.map(function (tim, index) {
          return _react2.default.createElement("li", {
            key: tim.id,
            draggable: _this10.props.canEdit === "1" ? true : false,
            id: i + "childTag" + index,
            onDragStart: function onDragStart(e) {
              _this10.drag(e);
              _this10.setState({ childTagId: tim.id });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 584
            }
          }, tagIndex == i && tagTwoIndex == index && twoEditShow && _this10.props.canEdit === "1" ? _react2.default.createElement(_input2.default, {
            className: "exitName",
            defaultValue: tim.labelname,
            autoFocus: true,
            onPressEnter: function onPressEnter() {
              that.labelEdit(tim.id, that.state.twoLabelEditName, "two", item.color, item.id);
              _this10.setState({ twoEditShow: false });
            },
            placeholder: tim.labelname,
            onChange: function onChange(e) {
              that.setState({
                twoLabelEditName: e.target.value
              });
            },
            onBlur: function onBlur() {
              that.labelEdit(tim.id, that.state.twoLabelEditName, "two", item.color, item.id);
              _this10.setState({ twoEditShow: false });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 599
            }
          }) : _react2.default.createElement("div", {
            style: {
              position: "relative",
              height: 22
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 631
            }
          }, _react2.default.createElement("span", {
            className: "labelName textMore " + (0, _util.getTagColorByColorCode)("1", item.color),
            onClick: function onClick() {
              _this10.setState({
                tagTwoIndex: index
              });
              _this10.labelClick(item.id);
              _this10.labelTwoClick(item.id, tim.id, index);
              _this10.setState({
                twoEditShow: true
              });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 637
            }
          }, tim.labelname), _this10.props.canEdit === "1" ? _react2.default.createElement(_icon2.default, {
            type: "close",
            className: "tagIcon",
            onClick: function onClick(e) {
              _this10.labelDelete(e, tim.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 663
            }
          }) : ""));
        }) : "", labelIndex == i && addsecondShow ? _react2.default.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 680
          }
        }, _react2.default.createElement(_input2.default, {
          className: "secondInput",
          onBlur: function onBlur(e) {
            _this10.setState({ addsecondShow: false });
            _this10.addLabel(e, "二级", "a");
            _this10.setState({ greateLabelName: "" });
          },
          value: greateLabelName,
          autoFocus: true,
          onPressEnter: function onPressEnter(e) {
            _this10.setState({ addsecondShow: false });
            _this10.addLabel(e, "二级", "a");
            _this10.setState({ greateLabelName: "" });
          },
          onChange: function onChange(e) {
            _this10.setState({
              greateLabelName: e.target.value
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 681
          }
        })) : "", _this10.props.canEdit === "1" && isEdit ? _react2.default.createElement("li", {
          className: "addSecond",
          onClick: function onClick() {
            _this10.setState({
              addsecondShow: true,
              labelIndex: i
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 706
          }
        }, "\u6DFB\u52A0\u65B0\u6807\u7B7E") : "")));
      }) : _react2.default.createElement(_nullView2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 726
        }
      }), _react2.default.createElement("div", { className: "addTagTitle-row", __source: {
          fileName: _jsxFileName,
          lineNumber: 728
        }
      }, _react2.default.createElement("div", {
        className: "addTagTitle",
        onClick: function onClick(e) {
          e.stopPropagation();
          e.preventDefault();
          _this10.setState({ exitShow: true });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 729
        }
      }, this.props.canEdit === "1" && isEdit ? _react2.default.createElement(_popover2.default, {
        content: _react2.default.createElement(_input2.default, {
          placeholder: "\u8F93\u5165\u5206\u7EC4\u540D",
          className: "addGroupName",
          onBlur: function onBlur(e) {
            _this10.submitLabel(e, "一级");
          },
          onPressEnter: function onPressEnter(e) {
            _this10.submitLabel(e, "一级");
          },
          value: greateLabelTwoName,
          onChange: function onChange(e) {
            _this10.setState({ greateLabelTwoName: e.target.value });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 740
          }
        }),
        trigger: "click",
        visible: exitShow,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 738
        }
      }, _react2.default.createElement("span", { className: "add", __source: {
          fileName: _jsxFileName,
          lineNumber: 758
        }
      }, "\u6DFB\u52A0\u5206\u7EC4")) : isEdit ? _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 761
        }
      }, "\u4EE5\u4E0A\u4E3A\u516C\u5171\u4EFB\u52A1\u6807\u7B7E\uFF0C\u4EC5\u7BA1\u7406\u5458\u53EF\u7F16\u8F91") : _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 763
        }
      }, "\u4E13\u4E1A\u7248\u53EF\u6DFB\u52A0\u5206\u7EC4\u548C\u6807\u7B7E"))), parentList ? parentList.map(function (item, i) {
        return _react2.default.createElement("div", { className: "tagList", key: item.id, __source: {
            fileName: _jsxFileName,
            lineNumber: 770
          }
        }, _react2.default.createElement("div", { className: "tagTop", __source: {
            fileName: _jsxFileName,
            lineNumber: 771
          }
        }, _react2.default.createElement("div", { className: "tagName", __source: {
            fileName: _jsxFileName,
            lineNumber: 772
          }
        }, item.labelname), _react2.default.createElement("div", { className: "colorSelect", __source: {
            fileName: _jsxFileName,
            lineNumber: 773
          }
        }, _react2.default.createElement(_popover2.default, {
          content: colorList && colorList.length > 0 ? colorList.map(function (color, value) {
            return _react2.default.createElement("span", { key: color.id, __source: {
                fileName: _jsxFileName,
                lineNumber: 779
              }
            }, _react2.default.createElement("div", {
              className: "selTagColor " + (0, _util.getTagColorByColorCode)("2", color.value),
              onClick: function onClick(e) {
                _this10.updateLabelColor(color.value, item);
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 780
              }
            }));
          }) : "",
          placement: "topLeft",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 774
          }
        }, _react2.default.createElement("div", {
          key: i,
          className: "selectCard " + (0, _util.getTagColorByColorCode)("2", item.color),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 802
          }
        })))), _react2.default.createElement("div", { className: "tagBottom", __source: {
            fileName: _jsxFileName,
            lineNumber: 812
          }
        }, _react2.default.createElement("ul", {
          id: "tag" + i,
          onDrop: function onDrop(e) {
            _this10.drop(e);
            _this10.moveProjectTag(childTagId, item.id);
          }
          // onDragOver={e => {
          //   this.allowDrop(e);
          // }}
          , __source: {
            fileName: _jsxFileName,
            lineNumber: 813
          }
        }, item.parentList && item.parentList.length > 0 ? item.parentList.map(function (tim, index) {
          return _react2.default.createElement("li", {
            key: tim.id,
            draggable: _this10.props.canEdit === "1" ? true : false,
            id: i + "childTag" + index,
            onDragStart: function onDragStart(e) {
              _this10.drag(e);
              _this10.setState({ childTagId: tim.id });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 826
            }
          }, _react2.default.createElement("div", {
            style: {
              position: "relative",
              height: 22
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 837
            }
          }, _react2.default.createElement("span", {
            className: "labelName textMore  " + (0, _util.getTagColorByColorCode)("1", item.color),
            onClick: function onClick() {
              _this10.setState({
                tagTwoIndexPer: index
              });
              _this10.labelClick(item.id);
              _this10.labelTwoClick(item.id, tim.id, index);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 843
            }
          }, tim.labelname), _react2.default.createElement(_icon2.default, {
            type: "close",
            className: "tagIcon",
            onClick: function onClick(e) {
              _this10.labelDelete(e, tim.id);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 865
            }
          })));
        }) : "", labelIndex == i && addsecondShowPer ? _react2.default.createElement("li", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 878
          }
        }, _react2.default.createElement(_input2.default, {
          className: "secondInput",
          onBlur: function onBlur(e) {
            _this10.setState({ addsecondShowPer: false });
            _this10.addLabel(e, "二级", "c");
            _this10.setState({ greateLabelName: "" });
          },
          value: greateLabelName,
          autoFocus: true,
          onPressEnter: function onPressEnter(e) {
            _this10.setState({ addsecondShowPer: false });
            _this10.addPerson(e, "二级", "c");
            _this10.setState({ greateLabelName: "" });
          },
          onChange: function onChange(e) {
            _this10.setState({
              greateLabelName: e.target.value
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 879
          }
        })) : "", isEdit ? _react2.default.createElement("li", {
          className: "addSecond",
          onClick: function onClick() {
            _this10.setState({
              addsecondShowPer: true,
              labelIndex: i
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 904
          }
        }, _react2.default.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 913
          }
        }, "\u6DFB\u52A0\u65B0\u6807\u7B7E")) : "")));
      }) : "")));
    }
  }]);

  return tagManage;
}(_react2.default.Component);

exports.default = tagManage;