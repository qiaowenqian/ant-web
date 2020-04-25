import React from "react";
import { Button, Modal, message, Input, Radio, Spin, TimePicker, DatePicker, Popconfirm } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";

import stylesheet1 from "styles/components/moreTaskEdit.scss";
import stylesheet2 from "styles/components/tag.scss";
import { dateToString, getTagTitColorByColorCode, getTagColorByColorCode, onlyNumber } from "../core/utils/util";
import { updateMoreTaskData } from "../core/service/task.service";
import { getTagList } from "../core/service/tag.service";
import dingJS from "../core/utils/dingJSApi";

const RadioGroup = Radio.Group;
/*
 * （必填）editType：''             // 批量修改的字段类型 如：'标签' '计划工期'
 * （必填） checkTaskIds：[]        // 选中的taskID
 * （必填） updateCallBack()        // 批量修改成功回调
 */
export default class MoreTaskEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editType: "",
      checkTaskIds: [],
      modalShow: false,
      editVal: "",
      tagLoading: false,
      tagList: [],
      tagIds: [],
      taskDateTime: "",
      checkTaskNames: [],
      limitAttention: false,
      joinProject: false,
      resLength: 0,
      limitObj: {},
      failedShow: false,
      failedArr: []
    };
  }

  componentWillMount() {
    if (this.props.editType) {
      this.setState({ editType: this.props.editType });
      if (this.props.editType === "优先级") {
        this.setState({ editVal: 3 });
      } else if (this.props.editType === "完成时间") {
        this.setState({ editVal: dateToString(new Date(), "date") });
      } else if (this.props.editType === "标签") {
        this.getTagsList();
      } else if (
        this.props.editType === "任务绩效" ||
        this.props.editType === "计划工期"
      ) {
        this.setState({ editVal: "" });
      }
    }
    if (this.props.checkTaskIds) {
      this.setState({ checkTaskIds: this.props.checkTaskIds });
    }
    // if (this.props.checkTaskNames) {
    //   this.setState({ checkTaskNames: this.props.checkTaskNames });
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editType) {
      this.setState({ editType: nextProps.editType });
      if (nextProps.editType === "优先级") {
        this.setState({ editVal: 3 });
      } else if (nextProps.editType === "完成时间") {
        this.setState({ editVal: dateToString(new Date(), "date") });
      } else if (
        this.props.editType === "任务绩效" ||
        this.props.editType === "计划工期"
      ) {
        this.setState({ editVal: "" });
      }
    }
    if (nextProps.checkTaskIds) {
      this.setState({ checkTaskIds: nextProps.checkTaskIds });
    }
    // if (nextProps.checkTaskNames) {
    //   this.setState({ checkTaskNames: nextProps.checkTaskNames });
    // }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getTagsList() {
    this.setState({ tagLoading: true });
    getTagList(data => {
      if (data.err) { return false }
      this.setState({ tagList: data, tagLoading: false });
    });
  }

  valChange(type, val, valTime) {
    switch (type) {
      case "截止时间":
        let dateTime = "";
        if (valTime === "") {
          dateTime = val + " 00:00:00";
        } else if (valTime == "00:00") {
          dateTime = val + " " + valTime + ":02";
        } else {
          dateTime = val + " " + valTime + ":00";
        }
        this.setState({ editVal: dateTime, taskDateTime: val });
        break;
      case "开始时间":
        let dateTime1 = "";
        if (valTime === "") {
          dateTime1 = val + " 00:00:00";
        } else if (valTime == "00:00") {
          dateTime1 = val + " " + valTime + ":02";
        } else {
          dateTime1 = val + " " + valTime + ":00";
        }
        this.setState({ editVal: dateTime1, taskDateTime: val });
        break;
    }
  }
  onOk() {
    const { editType, editVal, checkTaskIds, tagIds } = this.state;
    let update = {};
    switch (editType) {
      case "开始时间":
        update.planBeginTimeString = editVal;
        break;
      case "截止时间":
        update.planEndTimeString = editVal;
        break;
      case "任务绩效":
        update.flowConten = editVal;
        break;
      case "计划工期":
        update.workTime = editVal;
        break;
      case "删除":
        update.delete = 1;
        break;
      case "优先级":
        update.coefficienttype = editVal;
        break;
      case "标签":
        update.selectTags = [];
        tagIds.map(item => {
          update.selectTags.push({
            id: item
          });
        });
        break;
    }
    update.taskinfoIds = checkTaskIds;
    updateMoreTaskData("", update, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        if (editType == "开始时间" || editType == "截止时间") {
          let failedArr = []
          data.map(item => {
            if (item.success && item.success == "1") {
              failedArr.push({ name: item.taskname, num: (item.taskinfoNumber ? item.taskinfoNumber.numberS + "." : "") + item.rank })
              this.setState({ failedShow: true, modalShow: false, failedArr: failedArr })
              return false
            } else {
              this.setState({ modalShow: false })
              update.taskinfoIds = [];
              return false
            }
          })
          !this.state.failedShow ? message.success("批量修改成功！") : ""
          return false
        } else {
          message.success("批量修改成功！");
          this.props.updateCallBack();
          this.setState({ modalShow: false });
          update.taskinfoIds = [];
        }

      }
    });
  }

  onModalShow(editType) {
    const { checkTaskIds } = this.state;
    if (checkTaskIds.length === 0) {
      message.info("请选择任务");
    } else {
      if (editType === "负责人" || editType === "确认人") {
        dingJS.selectUser(
          [],
          editType,
          users => {
            let update = {
              taskinfoIds: checkTaskIds
            };
            if (editType === "负责人") {
              update.userResponseId = users[0].emplId;
              update.userResponseName = users[0].name;
            } else if (editType === "确认人") {
              update.userFlowId = users[0].emplId;
              update.userFlowName = users[0].name;
            }
            updateMoreTaskData("", update, data => {
              if (data.err) {
                return false;
              }
              if (data) {
                // message.success("批量修改成功！");
                this.props.updateCallBack();
              }
            });
          },
          false
        );
      } else if (editType === "关注人") {
        dingJS.selectUser(
          [],
          editType,
          res => {
            let update = {
              taskinfoIds: checkTaskIds
            };
            if (res) {
              let selected = [];
              res.map(item => {
                selected.push(item.emplId);
              });
              update.collect = selected;
              if (res && res.length > 20) {
                this.setState({
                  limitAttention: true,
                  limitObj: update,
                  resLength: res.length
                });
              } else {
                this.setState({ limitObj: update }, () => {
                  this.confirmPopconfirmSecond();
                });
              }
            }
          },
          true
        );
      } else {
        this.setState({ modalShow: true });
      }
    }
  }

  selectingTag(tagObj, color, type) {
    const { tagIds } = this.state;
    const index = tagIds.indexOf(tagObj.id);
    if (index === -1) {
      tagIds.push(tagObj.id);
    } else {
      tagIds.splice(index, 1);
    }
    this.setState({ tagIds: tagIds });
  }
  // 第二个确定
  confirmPopconfirmSecond = () => {
    const { limitObj } = this.state;
    limitObj.joinProject = false;
    updateMoreTaskData("", limitObj, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        // message.success("批量修改成功！");
        this.setState({ limitAttention: false });
        this.props.updateCallBack();
      }
    });
  };
  render() {
    const { editType, modalShow, editVal, tagLoading, tagList, tagIds, taskDateTime,
      limitAttention, resLength, failedShow, joinProject, failedArr } = this.state;
    let content = "您还没有定义标签哦";
    let title = `您刚刚选择了${resLength}个人，是否要全部添加为关注人`;
    if (tagList.length > 0) {
      content = (
        <div className="cpet_tag_list" style={{ maxHeight: "100%" }}>
          <Spin spinning={tagLoading} />
          {tagList.map(item => {
            if (item.parentList && item.parentList.length > 0) {
              return (
                <div
                  className="tagDiv"
                  key={item.id}
                  style={{ maxWidth: "100%" }}
                >
                  <div
                    className={
                      "tagName " + getTagTitColorByColorCode(item.color)
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
                            this.selectingTag(arr, item.color, item.type);
                          }}
                          className={
                            tagIds.indexOf(arr.id) !== -1
                              ? getTagColorByColorCode("1", item.color) +
                              " textMore"
                              : " textMore"
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
    }
    return (
      <div style={{ display: "inline" }}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet1 }} />
        <style dangerouslySetInnerHTML={{ __html: stylesheet2 }} />
        <Modal
          title={editType}
          visible={modalShow}
          onCancel={() => {
            this.setState({ modalShow: false });
          }}
          wrapClassName="moreTaskEditModel"
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({ modalShow: false });
              }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={
                (tagIds.length === 0 && editType === "标签") ||
                  (!editVal && editType !== "标签" && editType !== "删除")
                  ? true
                  : false
              }
              onClick={() => {
                this.onOk();
              }}
            >
              确定
            </Button>
          ]}
        >
          {editType === "截止时间" ? (
            <div
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                display: "flex"
              }}
            >
              <div className="dateBox">
                <DatePicker
                  locale={zhCN}
                  format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  onChange={(date, dateString) => {
                    this.valChange("截止时间", dateString, "");
                  }}
                />
              </div>
              <div className="timeBox">
                <TimePicker
                  locale={zhCN}
                  placeholder="请选择时间"
                  disabled={taskDateTime === "" ? true : false}
                  onChange={(date, dateString) => {
                    this.valChange("截止时间", taskDateTime, dateString);
                  }}
                  format="HH:mm"
                />
              </div>
            </div>
          ) : (
              ""
            )}
          {editType === "开始时间" ? (
            <div
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                display: "flex"
              }}
            >
              <div className="dateBox">
                <DatePicker
                  locale={zhCN}
                  format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  onChange={(date, dateString) => {
                    this.valChange("开始时间", dateString, "");
                  }}
                />
              </div>
              <div className="timeBox">
                <TimePicker
                  locale={zhCN}
                  placeholder="请选择时间"
                  disabled={taskDateTime === "" ? true : false}
                  onChange={(date, dateString) => {
                    this.valChange("开始时间", taskDateTime, dateString);
                  }}
                  format="HH:mm"
                />
              </div>
            </div>
          ) : (
              ""
            )}
          {editType === "计划工期" || editType === "任务绩效" ? (
            <Input
              placeholder="请输入数字，允许小数"
              value={editVal}
              onChange={e => {
                onlyNumber(e.target);
                this.setState({ editVal: e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") });
              }}
            />
          ) : ("")}
          {editType === "优先级" ? (
            <RadioGroup
              value={editVal}
              onChange={e => {
                this.setState({ editVal: e.target.value });
              }}
            >
              <Radio value={3}>高</Radio>
              <Radio value={2}>中</Radio>
              <Radio value={1}>低</Radio>
            </RadioGroup>
          ) : (
              ""
            )}
          {/* {editType === "删除" ? (
            <div>
              {checkTaskNames &&
                checkTaskNames.map((item, i) => {
                  return (
                    <div key={i}>
                      <span>{item.taskRank}</span>
                      <span> - </span>
                      <span>{item.taskName}</span>
                    </div>
                  );
                })}
            </div>
          ) : (
            ""
          )} */}
          {editType === "标签" ? content : ""}
        </Modal>
        <Modal
          title="提示"
          visible={failedShow}
          onCancel={() => { this.setState({ failedShow: false }) }}
          wrapClassName="moreTaskEditModel"
          footer={[<Button key="submit" type="primary" onClick={() => {
            // message.success("批量修改成功！");
            this.setState({ failedShow: false })
            this.props.updateCallBack();
          }}> 确定</Button>]}>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>以下任务修改失败（开始时间不能晚于截止时间） </div>
          {failedArr.map((item, index) => {
            return (
              <div key={index}> <span>{item.num}</span><span> - </span><span>{item.name}</span></div>
            )
          })}
        </Modal>
        {editType === "标签" ||
          editType === "负责人" ||
          editType === "关注人" ||
          editType === "确认人" ? (
            <Popconfirm
              title={title}
              visible={editType === "关注人" && limitAttention}
              onConfirm={() => {
                this.confirmPopconfirmSecond();
              }}
              onCancel={() => {
                this.setState({ limitAttention: false });
              }}
              okText={joinProject ? "加入" : "确定"}
              cancelText={joinProject ? "不加入" : "取消"}
            >
              <Button
                style={{ fontSize: "13px" }}
                onClick={() => {
                  this.setState({ tagIds: [] });
                  this.onModalShow(editType);
                }}
              >
                {editType === "标签" || editType === "关注人" ? "添加" : "修改"}
                {editType}
              </Button>
            </Popconfirm>
          ) : (
            <div
              style={{ fontSize: "13px" }}
              onClick={() => {
                this.onModalShow(editType);
              }}
            >
              {editType}
            </div>
          )}
      </div>
    );
  }
}
