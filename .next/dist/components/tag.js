"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _popover = require("antd/lib/popover");

var _popover2 = _interopRequireDefault(_popover);

var _input = require("antd/lib/input");

var _input2 = _interopRequireDefault(_input);

var _spin = require("antd/lib/spin");

var _spin2 = _interopRequireDefault(_spin);

var _toConsumableArray2 = require("next\\node_modules\\babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _tag = require("../styles/components/tag.scss");

var _tag2 = _interopRequireDefault(_tag);

var _tag3 = require("../core/service/tag.service");

var _util = require("../core/utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\components\\tag.js";


/*
 * （必填）tagSelecteds:[{id:'',name:'',color:'',type:''}]      // 标签选中数据
 * （必填）tagChangeCallBack(val)                               // 选中标签发生改变回调 回传{id:'',name:'',type:'',color:''}
 * （选填）canAdd: false                                        // 是否可新增标签，默认为false 注意，为true的时候，回传的新增的值是没有id号的
 * （选填）maxHeight: '200px'                                   // 标签最大高 默认是350
 * （选填）isProjectTypes: false,                               // 是否是项目分类 如果是，则获取的是项目分类的数据
 * （选填）poverPosition: ''                                    // 浮层定位，默认bottom
 * （选填）canEdit: true                                        // 是否可编辑，默认可编辑
 * （选填）isSmall:false                                        // 是否是消息弹框
 * （选填）checkedType                                          // 选中之后的显示样式，默认实心
 * （选填）showTitle                                            //是否显示标题样式默认不显示
 * （选填）titleText                                            //标题名称，默认显示空
 * （选填) labelSize                                            //样式 选中后图标样式大小(默认100px)
 * （选填) isAddLast                                            //添加标签的符号位置
 */

var TagComponent = function (_React$Component) {
  (0, _inherits3.default)(TagComponent, _React$Component);

  function TagComponent(props) {
    (0, _classCallCheck3.default)(this, TagComponent);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TagComponent.__proto__ || (0, _getPrototypeOf2.default)(TagComponent)).call(this, props));

    _this.handleClose = function (removedTag) {
      var tags = _this.state.tags.filter(function (tag) {
        return tag.id !== removedTag.id;
      });
      _this.setState({ tags: tags });
      if (_this.props.tagChangeCallBack) {
        _this.props.tagChangeCallBack(tags);
      }
    };

    _this.showInput = function () {
      if (_this.state.canAdd) {
        _this.setState({ inputVisible: true }, function () {
          return _this.input.focus();
        });
      }
    };

    _this.handleInputChange = function (e) {
      _this.setState({ inputValue: e.target.value });
    };

    _this.handleInputConfirm = function () {
      var state = _this.state;
      var inputValue = state.inputValue;
      var tagList = state.tagList;
      var tags = state.tags;
      var isHas = false;
      tags.map(function (item, i) {
        if (item.name === inputValue) {
          isHas = true;
          return false;
        }
      });
      var color = "";
      tagList.map(function (item, i) {
        if (item.labelname === "个人标签") {
          return color = item.color;
        }
      });
      if (inputValue && !isHas) {
        tags = [].concat((0, _toConsumableArray3.default)(tags), [{ name: inputValue, color: color }]);
      }
      _this.setState({
        tags: tags,
        inputVisible: false,
        inputValue: ""
      });
      if (_this.props.tagChangeCallBack) {
        _this.props.tagChangeCallBack(tags);
      }
    };

    _this.saveInputRef = function (input) {
      return _this.input = input;
    };

    _this.state = {
      tags: [],
      inputVisible: false,
      inputValue: "",
      tagList: [],
      tagLoading: false,
      canAdd: false,
      canEdit: true,
      showTitle: false,
      titleText: "",
      labelSize: "70",
      isAddLast: false,
      checkedType: "1" //选中之后是空心还是实心
    };
    return _this;
  }

  (0, _createClass3.default)(TagComponent, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.tagSelecteds) {
        this.setState({ tags: this.props.tagSelecteds });
      }
      if (this.props.canAdd) {
        this.setState({ canAdd: this.props.canAdd });
      }
      if (this.props.canEdit === true || this.props.canEdit === false) {
        this.setState({ canEdit: this.props.canEdit });
      }
      if (this.props.checkedType) {
        this.setState({
          checkedType: this.props.checkedType
        });
      }
      if (this.props.titleText != "" && this.props.titleText != undefined) {
        this.setState({
          titleText: this.props.titleText
        });
      }
      if (this.props.showTitle) {
        this.setState({
          showTitle: this.props.showTitle
        });
      }
      if (this.props.labelSize) {
        this.setState({
          labelSize: this.props.labelSize
        });
      }
      if (this.props.isAddLast) {
        this.setState({
          isAddLast: this.props.isAddLast
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.tagSelecteds) {
        this.setState({ tags: nextProps.tagSelecteds });
      }
      if (nextProps.canAdd) {
        this.setState({ canAdd: nextProps.canAdd });
      }
      if (nextProps.canEdit === true || nextProps.canEdit === false) {
        this.setState({ canEdit: nextProps.canEdit });
      }
      if (this.props.checkedType) {
        this.setState({
          checkedType: this.props.checkedType
        });
      }
      if (nextProps.titleText != "" && nextProps.titleText != undefined) {
        this.setState({
          titleText: nextProps.titleText
        });
      }
      if (nextProps.showTitle != this.props.showTitle) {
        this.setState({
          showTitle: nextProps.showTitle
        });
      }
      if (nextProps.labelSize != this.props.labelSize) {
        this.setState({
          labelSize: nextProps.labelSize
        });
      }
      if (nextProps.isAddLast) {
        this.setState({
          isAddLast: nextProps.isAddLast
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "getData",
    value: function getData() {
      if (this.props.isProjectTypes) {
        this.getProjectTypesList();
      } else {
        this.getTagsList();
      }
    }
  }, {
    key: "getTagsList",
    value: function getTagsList() {
      var _this2 = this;

      if (this.state.tagList.length === 0) {
        this.setState({ tagLoading: true });
        (0, _tag3.getTagList)(function (data) {
          if (data.err) {
            return false;
          }
          _this2.setState({ tagList: data });
          _this2.setState({ tagLoading: false });
        }, this.props.isSmall);
      }
    }
  }, {
    key: "getProjectTypesList",
    value: function getProjectTypesList() {
      var _this3 = this;

      if (this.state.tagList.length === 0) {
        this.setState({ tagLoading: true });
        (0, _tag3.getProjectTypeList)(function (data) {
          if (data.err) {
            return false;
          }
          _this3.setState({ tagList: data.labels });
          _this3.setState({ tagLoading: false });
        }, this.props.isSmall);
      }
    }
  }, {
    key: "selectingTag",
    value: function selectingTag(tagObj, color, type) {
      var _this4 = this;

      var tags = this.state.tags;

      var isHas = false;
      tags.map(function (item, i) {
        if (item.name === tagObj.labelname) {
          isHas = true;
          item.type = type;
          tags.splice(i, 1);
          _this4.setState({ tags: tags });
          if (_this4.props.tagChangeCallBack) {
            _this4.props.tagChangeCallBack(tags);
          }

          return false;
        }
      });
      if (!isHas) {
        tags = [].concat((0, _toConsumableArray3.default)(tags), [{ id: tagObj.id, name: tagObj.labelname, type: type, color: color }]);
        this.setState({ tags: tags });
        if (this.props.tagChangeCallBack) {
          this.props.tagChangeCallBack(tags);
        }
      }
    }
  }, {
    key: "tagListRender",
    value: function tagListRender() {
      var _this5 = this;

      var _state = this.state,
          tagList = _state.tagList,
          tagLoading = _state.tagLoading,
          tags = _state.tags;

      if (tagList.length > 0) {
        var tagIds = [];
        tags.map(function (item) {
          tagIds.push(item.id);
        });
        return _react2.default.createElement("div", {
          className: "cpet_tag_list",
          style: { maxHeight: this.props.maxHeight },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 245
          }
        }, _react2.default.createElement(_spin2.default, { spinning: tagLoading, __source: {
            fileName: _jsxFileName,
            lineNumber: 249
          }
        }), tagList.map(function (item) {
          if (item.parentList && item.parentList.length > 0) {
            return _react2.default.createElement("div", { className: "tagDiv", key: item.id, __source: {
                fileName: _jsxFileName,
                lineNumber: 253
              }
            }, _react2.default.createElement("div", {
              className: "tagName textMore " + (0, _util.getTagTitColorByColorCode)(item.color),
              __source: {
                fileName: _jsxFileName,
                lineNumber: 254
              }
            }, item.labelname), _react2.default.createElement("ul", { className: "tagUl", __source: {
                fileName: _jsxFileName,
                lineNumber: 262
              }
            }, item.parentList.map(function (arr) {
              return _react2.default.createElement("li", {
                key: arr.id,
                onClick: function onClick() {
                  _this5.selectingTag(arr, item.color, arr.type);
                },
                className: tagIds.indexOf(arr.id) !== -1 ? "textMore " + (0, _util.getTagColorByColorCode)("1", item.color) : "textMore tagNull",
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 265
                }
              }, arr.labelname);
            })));
          }
        }));
      } else {
        if (this.props.isProjectTypes) {
          return "您还没有定义项目分类哦";
        } else {
          return "您还没有定义标签哦";
        }
      }
    }
  }, {
    key: "input",
    value: function input() {}
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _state2 = this.state,
          tags = _state2.tags,
          inputVisible = _state2.inputVisible,
          inputValue = _state2.inputValue,
          canEdit = _state2.canEdit,
          checkedType = _state2.checkedType,
          showTitle = _state2.showTitle,
          titleText = _state2.titleText,
          isAddLast = _state2.isAddLast;
      var poverPosition = this.props.poverPosition;

      var tagIds = [];
      tags.map(function (item) {
        tagIds.push(item.id);
      });
      return _react2.default.createElement("div", { className: "cpet_tag", __source: {
          fileName: _jsxFileName,
          lineNumber: 318
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _tag2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 319
        }
      }), inputVisible && _react2.default.createElement(_input2.default, {
        ref: this.saveInputRef,
        type: "text",
        size: "small",
        style: { width: 78, height: "21px", margin: "0 0 0 10px" },
        value: inputValue,
        onChange: this.handleInputChange,
        onBlur: this.handleInputConfirm,
        onPressEnter: this.handleInputConfirm,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 321
        }
      }), !inputVisible && canEdit ? showTitle ? _react2.default.createElement("div", { style: { fontSize: "16px", marginBottom: "10px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 335
        }
      }, _react2.default.createElement("span", { style: { float: "left" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 336
        }
      }, titleText), _react2.default.createElement(_popover2.default, {
        content: this.tagListRender(),
        placement: poverPosition ? poverPosition : "right",
        trigger: "click",
        overlayClassName: "addIconOverlay",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 337
        }
      }, _react2.default.createElement("i", {
        className: "iconfont icon-add2 addIcon",
        onMouseOver: function onMouseOver() {
          _this6.getData();
        },
        style: { margin: 0 },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 343
        }
      })), _react2.default.createElement("div", { className: "clearfix", __source: {
          fileName: _jsxFileName,
          lineNumber: 351
        }
      })) : isAddLast ? "" : _react2.default.createElement(_popover2.default, {
        content: this.tagListRender(),
        placement: poverPosition ? poverPosition : "right",
        trigger: "click",
        overlayClassName: "addIconOverlay",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 356
        }
      }, _react2.default.createElement("i", {
        className: "iconfont icon-add2 addIcon",
        onMouseOver: function onMouseOver() {
          _this6.getData();
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 362
        }
      })) : _react2.default.createElement("div", { style: { fontSize: "16px", marginBottom: "10px" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 371
        }
      }, _react2.default.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 372
        }
      }, titleText)), _react2.default.createElement("div", {
        className: "tagListBox",
        style: { paddingLeft: showTitle || isAddLast ? "0px" : "30px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 375
        }
      }, tags.map(function (tag, index) {
        var isLongTag = tag.name && tag.name.length > 20;
        var tagElem = _react2.default.createElement("div", {
          key: "tagid" + index,
          className: "ant-tag " + (tag.color ? (0, _util.getTagColorByColorCode)(checkedType, tag.color) : ""),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 382
          }
        }, _react2.default.createElement("div", {
          className: "labelName textMore",
          style: {
            width: tag.name && tag.name.length <= 3 ? 50 : 70
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 391
          }
        }, tag.name), canEdit ? _react2.default.createElement("span", {
          className: "labelCen",
          onClick: function onClick() {
            _this6.handleClose(tag);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 400
          }
        }, "\u70B9\u51FB\u79FB\u9664") : "");
        return tagElem;
      }), !inputVisible && canEdit && !showTitle && isAddLast ? _react2.default.createElement(_popover2.default, {
        content: this.tagListRender(),
        placement: poverPosition ? poverPosition : "right",
        trigger: "click",
        overlayClassName: "addIconOverlay",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 416
        }
      }, _react2.default.createElement(_icon2.default, {
        className: "iconfont icon-add2 addIcon",
        onMouseOver: function onMouseOver() {
          _this6.getData();
        },
        style: { marginLeft: "5px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 422
        }
      })) : ""));
    }
  }]);

  return TagComponent;
}(_react2.default.Component);

exports.default = TagComponent;