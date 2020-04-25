import React from "react";
import { Icon, Select, Input, message, Modal, Popover, Popconfirm } from "antd";

import stylesheet from "styles/components/tagManage.scss";
import NullView from "../../components/nullView";
import {
  getStringTagColor,
  getTagColorByColorCode,
  getTeamInfoWithMoney
} from "../../core/utils/util";

import {
  getLabelList,
  addLabel,
  updateLabel,
  updateLabelParent,
  deleteLabel,
  addProjectType,
  addPersonLabel,
  findLabelByAdimn
} from "../../core/service/tag.service";
import { Spin } from "antd";
/*****
 * type:1      //个人标签
 * type:2      //公共标签
 * type:3      //项目分类
 * closedCallBack()     //关闭弹层回调
 * title:''            //弹框标题显示
 * isEdit:        //是否可编辑
 * canEdit:      //是否是管理员
 * *****/
export default class tagManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }
  componentWillMount() {
    this.getPersonLabelNew();
    this.getPublicTag();

    if (
      getTeamInfoWithMoney("版本名称") === "基础版" ||
      getTeamInfoWithMoney("版本名称") === "免费版"
    ) {
      this.setState({ isEdit: false });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getPersonLabelNew();
    this.getPublicTag();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //获取公共标签
  getPublicTag() {
    this.setState({ publicTagLoading: true });
    getLabelList(data => {
      if (data.err) {
        return false;
      }
      this.setState({
        colorList: data.colorList,
        tagList: data.labels,
        publicTagLoading: false
      });
    });
  }
  //获取个人标签
  getPersonLabelNew() {
    const { canEdit } = this.props;
    let isAdimn = canEdit === "1" ? 1 : 0;
    findLabelByAdimn(isAdimn, data => {
      this.setState({
        colorList: data.colorList,
        parentList: data.labels,
        pidd: data.labels[0].id
      });
    });
  }
  changeColor(e) {
    this.setState({ selectColor: e });
  }
  //编辑标签颜色
  updateLabelColor(e, mainTag) {
    if (mainTag) {
      let parms = {
        labelname: mainTag.labelname,
        id: mainTag.id,
        color: e,
        parent: { id: mainTag.id }
      };
      updateLabel(parms, data => {
        if (data.err) {
          return false;
        }
        if (data) {
          message.success("修改成功");
          if (this.props.type == "3") {
            this.getProjectManage();
          } else if (this.props.type == "2") {
            this.getPublicTag();
            this.getPersonLabelNew();
          }
          this.setState({
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
  labelDelete(e, id) {
    e.stopPropagation();
    e.preventDefault();
    deleteLabel(id, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        message.success("操作成功");
        this.setState({ delLabels: [] });
      }
      if (this.props.type == "3") {
        this.getProjectManage();
      } else if (this.props.type == "2") {
        this.getPublicTag();
        this.getPersonLabelNew();
      }
    });
  }
  //点击返回一级标签的下标
  labelClick(id) {
    const { tagList } = this.state;
    for (let i = 0; i < tagList.length; i++) {
      let item = tagList[i];
      if (item.id == id) {
        this.setState({ tagIndex: i, tagIndexPer: i });
        break;
      }
    }
  }
  //点击二级标签返回二级标签
  labelTwoClick(pid, id, index) {
    const { tagList, indexList, parentList, labelIndex } = this.state;
    var that = this;
    if (this.props.type == "1") {
      for (let i = 0; i < parentList.length; i++) {
        let item = parentList[i];
        if (item.id == id) {
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
    } else {
      for (let j = 0; j < tagList.length; j++) {
        let tag = tagList[j];
        if (tag.id == pid) {
          this.setState({ labelIndex: j });
        }
      }
      for (var i = 0; i < tagList[labelIndex].parentList.length; i++) {
        const label = tagList[labelIndex].parentList[i];
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
  labelEdit(id, name, labNo, color, parentid) {
    if (name && name.length > 16) {
      message.error("标签长度不能大于16个字符");
      return;
    }
    if (
      (labNo == "one" &&
        (name == this.state.oneLabelOldName || name == null)) ||
      (labNo == "two" && (name == null || name == this.state.twoLabelOldName))
    ) {
      this.setState({
        oneEditIndex: null,
        twoEditIndex: null,
        oneLabelEditName: null,
        twoLabelEditName: null
      });
    } else {
      let data = {
        labelname: name,
        id: id,
        color: color,
        parent: { id: parentid }
      };
      updateLabel(data, data => {
        if (data.err) {
          return false;
        }
        if (this.props.type == "3") {
          this.getProjectManage();
        } else if (this.props.type == "2") {
          this.getPublicTag();
        }
        message.success("修改成功");
        this.setState({
          oneEditIndex: null,
          twoEditIndex: null,
          oneLabelEditName: null,
          twoLabelEditName: null
        });
      });
    }
  }
  //添加标签
  submitLabel(e, tag) {
    e.stopPropagation();
    e.preventDefault();
    const {
      tagList,
      selectColor,
      labelIndex,
      greateLabelName,
      greateLabelTwoName
    } = this.state;
    if (tag == "一级" && greateLabelTwoName && greateLabelTwoName.length > 16) {
      message.error("一级标签长度不能大于16个字符");
      return;
    }
    if (tag == "二级" && greateLabelName && greateLabelName.length > 16) {
      message.error("二级标签长度不能大于16个字符");
      return;
    }

    if (tag == "一级") {
      let name = greateLabelTwoName;
      let data = { labelname: name, color: selectColor };
      if (this.props.type == "3") {
        addProjectType(data, "", res => {
          if (res.err) {
            return false;
          }
          if (res) {
            message.success("添加成功");
            this.setState({ greateLabelTwoName: "" });
          }
          this.getProjectManage();
        });
      } else if (this.props.type == "2") {
        addLabel(data, "", res => {
          if (res.err) {
            return false;
          }
          if (res) {
            message.success("添加成功");
            this.setState({ greateLabelTwoName: "" });
          }
          this.getPublicTag();
        });
      }
      this.setState({ exitShow: false });
    } else if (tag == "二级") {
      let pid = tagList[labelIndex].id;
      let name = greateLabelName;
      let data = { labelname: name, color: "" };
      if (this.props.type == "3") {
        addProjectType(data, pid, res => {
          if (res.err) {
            return false;
          }
          if (res) {
            this.setState({ greateLabelTwoName: "" });
            message.success("添加成功");
          }
          this.getProjectManage();
        });
      } else if (this.props.type == "2") {
        addLabel(data, pid, res => {
          if (res.err) {
            return false;
          }
          if (res) {
            this.setState({ greateLabelTwoName: "" });
            message.success("添加成功");
          }
          this.getPublicTag();
        });
      }
    }
  }
  //添加个人标签
  addPerson(e) {
    const { pidd, greateLabelName } = this.state;
    let name = greateLabelName;

    addPersonLabel(name, pidd, res => {
      if (res.err) {
        return false;
      }
      if (res) {
        message.success("添加成功");
      }
      this.getPersonLabelNew();
    });
    this.setState({ addsecondShowPer: false });
  }
  //添加标签方法
  addLabel(e, tag, type) {
    if (type === "c") {
      if (!e.target.value) {
        message.info("请输入标签名称");
        return;
      }
      this.addPerson(e);
    } else {
      this.submitLabel(e, tag);
    }
  }
  //移动标签
  moveProjectTag(id, pid) {
    updateLabelParent(id, pid, data => {
      if (data.err) {
        return false;
      }
      let updateTagList = [];
      if (data.labels.length > 0) {
        data.labels.map((item, i) => {
          if (item.type === "2") {
            updateTagList.push(item);
          }
          this.setState({ tagList: updateTagList });
        });
        this.getPersonLabelNew();
      }
    });
  }
  drag(ev) {
    ev.dataTransfer.setData("object", ev.target.id);
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("object");
    // ev.target.appendChild(document.getElementById(data));
  }
  render() {
    const {
      colorList,
      tagList,
      exitShow,
      tagIndex,
      parentList,
      projectManageLoading,
      publicTagLoading,
      personTagLoading,
      addsecondShow,
      addsecondShowPer,
      labelIndex,
      tagTwoIndex,
      greateLabelName,
      greateLabelTwoName,
      twoEditShow,
      isEdit,
      childTagId
    } = this.state;
    const that = this;
    return (
      <Modal
        title={this.props.title}
        visible={true}
        onCancel={() => {
          this.props.closedCallBack();
        }}
        maskClosable={false}
        width={800}
        wrapClassName="tagManageModal"
        footer={null}
      >
        <div
          className="manageBox"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            this.setState({ exitShow: false });
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Spin
            spinning={
              projectManageLoading || publicTagLoading || personTagLoading
            }
          />

          <div className="tagListBox">
            {tagList && tagList.length > 0 ? (
              tagList.map((item, i) => {
                return (
                  <div className="tagList" key={item.id}>
                    <div className="tagTop">
                      {this.props.canEdit === "1" ? (
                        <Popover
                          content={
                            <Input
                              className="addGroupName"
                              defaultValue={item.labelname}
                              onPressEnter={() => {
                                this.labelEdit(
                                  item.id,
                                  this.state.oneLabelEditName,
                                  "one",
                                  item.color,
                                  item.id
                                );

                                this.setState({ oneEditShow: false });
                              }}
                              onBlur={() => {
                                this.labelEdit(
                                  item.id,
                                  this.state.oneLabelEditName,
                                  "one",
                                  item.color,
                                  item.id
                                );
                                this.setState({ oneEditShow: false });
                              }}
                              onChange={e => {
                                that.setState({
                                  oneLabelEditName: e.target.value
                                });
                              }}
                            />
                          }
                          trigger="click"
                        >
                          <div
                            className="tagName"
                            onClick={() => {
                              this.setState({
                                oneEditIndex: i,
                                oneEditShow: true
                              });
                            }}
                          >
                            {item.labelname}
                          </div>
                        </Popover>
                      ) : (
                          <div className="tagName">{item.labelname}</div>
                        )}
                      <div className="colorSelect">
                        {this.props.canEdit === "1" ? (
                          <Popover
                            content={
                              colorList && colorList.length > 0
                                ? colorList.map((color, value) => {
                                  return (
                                    <span value={color.value} key={color.id}>
                                      <div
                                        className={
                                          "selTagColor " +
                                          getTagColorByColorCode(
                                            "2",
                                            color.value
                                          )
                                        }
                                        onClick={e => {
                                          this.updateLabelColor(
                                            color.value,
                                            item
                                          );
                                        }}
                                      />
                                    </span>
                                  );
                                })
                                : ""
                            }
                            placement="topLeft"
                          >
                            <div
                              className={
                                "selectCard " +
                                getTagColorByColorCode("2", item.color)
                              }
                            />
                          </Popover>
                        ) : (
                            <div
                              className="selectCard"
                              style={{
                                backgroundColor: getStringTagColor(item)
                                  ? "#" + getStringTagColor(item).substring(1)
                                  : ""
                              }}
                            />
                          )}
                      </div>
                      {item.labelname !== "" &&
                        this.props.canEdit === "1" ? (
                          <Popconfirm
                            title="是否删除该分组以及分组下的所有标签？"
                            onConfirm={e => {
                              this.labelDelete(e, item.id);
                            }}
                            okText="删除"
                            cancelText="取消"
                            placement="topRight"
                          >
                            <i className="iconfont icon-icon_huabanfuben5" />
                          </Popconfirm>
                        ) : (
                          ""
                        )}
                    </div>

                    <div className="tagBottom">
                      <ul
                        id={"tag" + i}
                        onDrop={e => {
                          this.drop(e);
                          this.moveProjectTag(childTagId, item.id);
                        }}
                        onDragOver={e => {
                          this.allowDrop(e);
                        }}
                      >
                        {item.parentList && item.parentList.length > 0
                          ? item.parentList.map((tim, index) => {
                            return (
                              <li
                                key={tim.id}
                                draggable={
                                  this.props.canEdit === "1" ? true : false
                                }
                                id={i + "childTag" + index}
                                onDragStart={e => {
                                  this.drag(e);
                                  this.setState({ childTagId: tim.id });
                                }}
                              >
                                {tagIndex == i &&
                                  tagTwoIndex == index &&
                                  twoEditShow &&
                                  this.props.canEdit === "1" ? (
                                    <Input
                                      className="exitName"
                                      defaultValue={tim.labelname}
                                      autoFocus
                                      onPressEnter={() => {
                                        that.labelEdit(
                                          tim.id,
                                          that.state.twoLabelEditName,
                                          "two",
                                          item.color,
                                          item.id
                                        );
                                        this.setState({ twoEditShow: false });
                                      }}
                                      placeholder={tim.labelname}
                                      onChange={e => {
                                        that.setState({
                                          twoLabelEditName: e.target.value
                                        });
                                      }}
                                      onBlur={() => {
                                        that.labelEdit(
                                          tim.id,
                                          that.state.twoLabelEditName,
                                          "two",
                                          item.color,
                                          item.id
                                        );
                                        this.setState({ twoEditShow: false });
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        position: "relative",
                                        height: 22
                                      }}
                                    >
                                      <span
                                        className={
                                          "labelName textMore " +
                                          getTagColorByColorCode(
                                            "1",
                                            item.color
                                          )
                                        }
                                        onClick={() => {
                                          this.setState({
                                            tagTwoIndex: index
                                          });
                                          this.labelClick(item.id);
                                          this.labelTwoClick(
                                            item.id,
                                            tim.id,
                                            index
                                          );
                                          this.setState({
                                            twoEditShow: true
                                          });
                                        }}
                                      >
                                        {tim.labelname}
                                      </span>
                                      {this.props.canEdit === "1" ? (
                                        <Icon
                                          type="close"
                                          className="tagIcon"
                                          onClick={e => {
                                            this.labelDelete(e, tim.id);
                                          }}
                                        />
                                      ) : (
                                          ""
                                        )}
                                    </div>
                                  )}
                              </li>
                            );
                          })
                          : ""}
                        {labelIndex == i && addsecondShow ? (
                          <li>
                            <Input
                              className="secondInput"
                              onBlur={e => {
                                this.setState({ addsecondShow: false });
                                this.addLabel(e, "二级", "a");
                                this.setState({ greateLabelName: "" });
                              }}
                              value={greateLabelName}
                              autoFocus
                              onPressEnter={e => {
                                this.setState({ addsecondShow: false });
                                this.addLabel(e, "二级", "a");
                                this.setState({ greateLabelName: "" });
                              }}
                              onChange={e => {
                                this.setState({
                                  greateLabelName: e.target.value
                                });
                              }}
                            />
                          </li>
                        ) : (
                            ""
                          )}
                        {this.props.canEdit === "1" && isEdit ? (
                          <li
                            className="addSecond"
                            onClick={() => {
                              this.setState({
                                addsecondShow: true,
                                labelIndex: i
                              });
                            }}
                          >
                            添加新标签
                          </li>
                        ) : (
                            ""
                          )}
                      </ul>
                    </div>
                  </div>
                );
              })
            ) : (
                <NullView />
              )}
            <div className="addTagTitle-row">
              <div
                className="addTagTitle"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.setState({ exitShow: true });
                }}
              >
                {this.props.canEdit === "1" && isEdit ? (
                  <Popover
                    content={
                      <Input
                        placeholder="输入分组名"
                        className="addGroupName"
                        onBlur={e => {
                          this.submitLabel(e, "一级");
                        }}
                        onPressEnter={e => {
                          this.submitLabel(e, "一级");
                        }}
                        value={greateLabelTwoName}
                        onChange={e => {
                          this.setState({ greateLabelTwoName: e.target.value });
                        }}
                      />
                    }
                    trigger="click"
                    visible={exitShow}
                  >
                    <span className="add">添加分组</span>
                  </Popover>
                ) : isEdit ? (
                  <span>以上为公共任务标签，仅管理员可编辑</span>
                ) : (
                      <span>专业版可添加分组和标签</span>
                    )}
              </div>
            </div>
            {parentList
              ? parentList.map((item, i) => {
                return (
                  <div className="tagList" key={item.id}>
                    <div className="tagTop">
                      <div className="tagName">{item.labelname}</div>
                      <div className="colorSelect">
                        <Popover
                          content={
                            colorList && colorList.length > 0
                              ? colorList.map((color, value) => {
                                return (
                                  <span key={color.id}>
                                    <div
                                      className={
                                        "selTagColor " +
                                        getTagColorByColorCode(
                                          "2",
                                          color.value
                                        )
                                      }
                                      onClick={e => {
                                        this.updateLabelColor(
                                          color.value,
                                          item
                                        );
                                      }}
                                    />
                                  </span>
                                );
                              })
                              : ""
                          }
                          placement="topLeft"
                        >
                          <div
                            key={i}
                            className={
                              "selectCard " +
                              getTagColorByColorCode("2", item.color)
                            }
                          />
                        </Popover>
                      </div>
                    </div>
                    <div className="tagBottom">
                      <ul
                        id={"tag" + i}
                        onDrop={e => {
                          this.drop(e);
                          this.moveProjectTag(childTagId, item.id);
                        }}
                      // onDragOver={e => {
                      //   this.allowDrop(e);
                      // }}
                      >
                        {item.parentList && item.parentList.length > 0
                          ? item.parentList.map((tim, index) => {
                            return (
                              <li
                                key={tim.id}
                                draggable={
                                  this.props.canEdit === "1" ? true : false
                                }
                                id={i + "childTag" + index}
                                onDragStart={e => {
                                  this.drag(e);
                                  this.setState({ childTagId: tim.id });
                                }}
                              >
                                <div
                                  style={{
                                    position: "relative",
                                    height: 22
                                  }}
                                >
                                  <span
                                    className={
                                      "labelName textMore  " +
                                      getTagColorByColorCode(
                                        "1",
                                        item.color
                                      )
                                    }
                                    onClick={() => {
                                      this.setState({
                                        tagTwoIndexPer: index
                                      });
                                      this.labelClick(item.id);
                                      this.labelTwoClick(
                                        item.id,
                                        tim.id,
                                        index
                                      );
                                    }}
                                  >
                                    {tim.labelname}
                                  </span>
                                  <Icon
                                    type="close"
                                    className="tagIcon"
                                    onClick={e => {
                                      this.labelDelete(e, tim.id);
                                    }}
                                  />
                                </div>
                              </li>
                            );
                          })
                          : ""}
                        {labelIndex == i && addsecondShowPer ? (
                          <li>
                            <Input
                              className="secondInput"
                              onBlur={e => {
                                this.setState({ addsecondShowPer: false });
                                this.addLabel(e, "二级", "c");
                                this.setState({ greateLabelName: "" });
                              }}
                              value={greateLabelName}
                              autoFocus
                              onPressEnter={e => {
                                this.setState({ addsecondShowPer: false });
                                this.addPerson(e, "二级", "c");
                                this.setState({ greateLabelName: "" });
                              }}
                              onChange={e => {
                                this.setState({
                                  greateLabelName: e.target.value
                                });
                              }}
                            />
                          </li>
                        ) : (
                            ""
                          )}
                        {isEdit ? (
                          <li
                            className="addSecond"
                            onClick={() => {
                              this.setState({
                                addsecondShowPer: true,
                                labelIndex: i
                              });
                            }}
                          >
                            <span>添加新标签</span>
                          </li>
                        ) : (
                            ""
                          )}
                      </ul>
                    </div>
                  </div>
                );
              })
              : ""}
          </div>
        </div>
      </Modal>
    );
  }
}
