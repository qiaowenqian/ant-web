import React from "react";
import { Input, Icon, Popover, Spin, message } from "antd";

import stylesheet from "../styles/components/tag.scss";
import {
  getTagList,
  getProjectTypeList,
  addPersonLabel,
  findLabelByAdimn
} from "../core/service/tag.service";
import {
  getTagColorByColorCode,
  getTagTitColorByColorCode
} from "../core/utils/util";
// import { getMessageCount } from "../core/service/message.service";
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
 * （选填) labelSize                                            //样式 选中后图标样式大小(默认100px)

 */

export default class TagComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      prpoverShow: false,
      showInputAdd: true,
      pid: "",
      checkedType: "1" //选中之后是空心还是实心
    };
  }

  componentWillMount() {
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
    this.getLabelByAdimn();
  }
  getLabelByAdimn() {
    findLabelByAdimn("", data => {
      this.setState({
        pid: data.labels && data.labels.length > 0 && data.labels[0].id
      });
    });
  }
  hideInput(e) {
    var ele = e.target || e.relatedTarget;
    //     console.log(e.target.parentNode, "e.target.parentNode");
    let className = e.target.parentNode
      ? e.target.parentNode.className
      : ele.className;
    if (ele.className == "ant-popover-inner-content") {
      className = "ant-popover-inner-content";
    }
    if (ele.className == "taskTag" || ele.className == "labelCen") {
      className = "taskTag";
    }
    const arr = [
      "ant-popover-inner-content",
      "tagDiv",
      "tagUl",
      // "taskTag",
      "ant-popover-open",
      "addIconOverlay",
      "cpet_tag_list"
    ];
    if (arr.indexOf(className) > -1) {
      return;
    }
    this.setState({
      inputVisible: false,
      prpoverShow: false,
      showInputAdd: true
    });
  }

  componentDidMount() {
    document.body.addEventListener("click", this.hideInput.bind(this));
  }

  componentWillReceiveProps(nextProps) {
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
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    //     document.body.removeEventListener(this.hideInput);
  }

  getData() {
    if (this.props.isProjectTypes) {
      this.getProjectTypesList();
    } else {
      this.getTagsList();
    }
  }

  getTagsList() {
    //     if (this.state.tagList.length === 0) {
    this.setState({ tagLoading: true });
    getTagList(data => {
      if (data.err) {
        return false;
      }
      this.setState({ tagList: data });
      this.setState({ tagLoading: false });
    }, this.props.isSmall);
    //     }
  }

  getProjectTypesList() {
    if (this.state.tagList.length === 0) {
      this.setState({ tagLoading: true });
      getProjectTypeList(data => {
        if (data.err) {
          return false;
        }
        this.setState({ tagList: data.labels });
        this.setState({ tagLoading: false });
      }, this.props.isSmall);
    }
  }

  handleClose = (removedTag, index) => {
    //     const tags = this.state.tags.filter(tag => tag.id !== removedTag.id);
    const { tags } = this.state;
    tags.splice(index, 1);
    this.setState({ tags: tags });
    if (this.props.tagChangeCallBack) {
      this.props.tagChangeCallBack(tags);
    }
  };

  showInput = () => {
    if (this.state.canAdd) {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    //value=1
    const state = this.state;
    const inputValue = state.inputValue;
    const tagList = state.tagList;
    let tags = state.tags;
    let isHas = false;

    tags.map((item, i) => {
      if (item.name === inputValue) {
        isHas = true;
        return false;
      }
    });
    let color = "";
    tagList.map((item, i) => {
      if (item.labelname === "个人标签") {
        return (color = item.color);
      }
    });
    if (inputValue && !isHas) {
      this.addPerson(inputValue, data => {
        data &&
          data.labels &&
          data.labels.map(item => {
            if (inputValue == item.labelname) {
              tags = [
                ...tags,
                { name: item.labelname, color: color, id: item.id, type: 1 }
              ];
            }
          });
        if (this.props.tagChangeCallBack) {
          this.props.tagChangeCallBack(tags);
        }
        this.setState({
          tags,
          //       inputVisible: false,
          inputValue: ""
          //       showInputAdd: true,
        });
        if (this.props.tagChangeCallBack) {
          this.props.tagChangeCallBack(tags);
        }
      });
    }
    //没有内容则不保存
    // else {
    //   this.setState({
    //     tags,
    //     //       inputVisible: false,
    //     inputValue: ""
    //     //       showInputAdd: true,
    //   });
    //   if (this.props.tagChangeCallBack) {
    //     this.props.tagChangeCallBack(tags);
    //   }
    // }
  };

  //添加个人标签
  addPerson(name, callback) {
    const { pid } = this.state;
    addPersonLabel(name, pid, res => {
      if (res.err) {
        return false;
      }
      if (res) {
        message.success("添加成功");
        callback(res);

        this.getTagsList();
      }
    });
  }

  selectingTag(tagObj, color, type) {
    let { tags } = this.state;
    let isHas = false;
    tags.map((item, i) => {
      if (item.name === tagObj.labelname) {
        isHas = true;
        item.type = type;
        tags.splice(i, 1);
        this.setState({ tags: tags });
        if (this.props.tagChangeCallBack) {
          this.props.tagChangeCallBack(tags);
        }
        return false;
      }
    });
    if (!isHas) {
      tags = [
        ...tags,
        { id: tagObj.id, name: tagObj.labelname, type: type, color: color }
      ];
      this.setState({ tags: tags });
      if (this.props.tagChangeCallBack) {
        this.props.tagChangeCallBack(tags);
      }
    }
  }

  tagListRender() {
    const { tagList, tagLoading, tags } = this.state;
    if (tagList.length > 0) {
      let tagIds = [];
      tags.map(item => {
        tagIds.push(item.id);
      });
      return (
        <div
          className="cpet_tag_list"
          style={{ maxHeight: this.props.maxHeight }}
        >
          <Spin spinning={tagLoading} />
          {tagList &&
            tagList.length > 0 &&
            tagList.map(item => {
              if (item.parentList && item.parentList.length > 0) {
                return (
                  <div className="tagDiv" key={item.id}>
                    <div
                      className={
                        "tagName textMore " +
                        getTagTitColorByColorCode(item.color)
                      }
                    >
                      {item.labelname}
                    </div>
                    <ul className="tagUl">
                      {item.parentList.map(arr => {
                        return (
                          <li
                            key={arr.id}
                            onClick={() => {
                              this.selectingTag(arr, item.color, arr.type);
                            }}
                            className={
                              tagIds.indexOf(arr.id) !== -1
                                ? "textMore " +
                                  getTagColorByColorCode("1", item.color)
                                : "textMore tagNull"
                            }
                          >
                            {arr.labelname}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              }
            })}
        </div>
      );
    } else {
      if (this.props.isProjectTypes) {
        return "您还没有定义项目分类哦";
      } else {
        return "您还没有定义标签哦";
      }
    }
  }

  saveInputRef = input => (this.input = input);

  input() {
    // console.log("1");
  }
  renderAddElement() {
    const { canEdit, canAdd, showInputAdd } = this.state;
    if (this.props.renderAddElement) {
      return canAdd && showInputAdd ? (
        <span
          // onMouseOver={() => {
          //   this.getData();
          // }}
          onClick={() => {
            this.getData();
            if ((canEdit, canAdd)) {
              this.setState({
                inputVisible: true,
                showInputAdd: false,
                prpoverShow: true
              });
            }
          }}
        >
          {this.props.renderAddElement()}
        </span>
      ) : (
        ""
      );
    } else {
      return (
        <Icon
          type="plus"
          onMouseOver={() => {
            this.getData();
          }}
          className="addIcon"
          style={{ margin: 0 }}
          onClick={() => {
            if ((canEdit, canAdd)) {
              this.setState({
                inputVisible: true,
                showInputAdd: false,
                prpoverShow: true
              });
            }
          }}
        />
      );
    }
  }
  render() {
    const {
      tags,
      inputVisible,
      inputValue,
      canEdit,
      checkedType,
      showTitle,
      titleText,
      prpoverShow
    } = this.state;
    const { poverPosition } = this.props;
    let tagIds = [];
    tags.map(item => {
      tagIds.push(item.id);
    });
    return (
      <div className="cpet_tag">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />

        <div
          className="tagListBox"
          style={{
            paddingLeft: "0px",
            display: "inline-block"
          }}
        >
          {canEdit && (
            <Popover
              content={this.tagListRender()}
              placement={poverPosition ? poverPosition : "left"}
              //       trigger="click"
              visible={prpoverShow}
              overlayClassName="addIconOverlay"
            >
              {this.renderAddElement()}
            </Popover>
          )}
          {inputVisible && canEdit && (
            <Input
              //     ref={this.saveInputRef}
              ref={function(input) {
                if (input != null) {
                  input.focus();
                }
              }}
              type="text"
              size="small"
              style={{
                width: 70,
                height: 22,
                margin: "3px 5px 0 0px",
                borderRadius: 2,
                padding: 0
              }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {/* {console.log(tags)} */}
          {tags.map((tag, index) => {
            const isLongTag = tag.name && tag.name.length > 20;
            const tagElem = (
              <div
                key={"tagid" + index}
                style={{ margin: "3px 5px 0 0" }}
                className={
                  "ant-tag " +
                  (tag.color
                    ? getTagColorByColorCode(checkedType, tag.color)
                    : "")
                }
              >
                <div
                  className="labelName textMore"
                  style={{
                    minWidth: 64,
                    maxWidth: 172,
                    padding: " 1px 4px",
                    fontSize: "12px"
                  }}
                >
                  {tag.name}
                </div>
                {canEdit ? (
                  <span
                    className="labelCen"
                    onClick={() => {
                      this.handleClose(tag, index);
                    }}
                  >
                    点击移除
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
            return tagElem;
          })}
        </div>
      </div>
    );
  }
}
