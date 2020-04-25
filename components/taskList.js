import React from "react";
import { Checkbox, message } from "antd";
import stylesheet from "../styles/components/taskList.scss";
import { addAttentionWitchTask, cancelAttentionWitchTask, setMilestoneWithTask, batchUpdata } from "../core/service/task.service";
import { stateColor, getTagColorByColorCode, stateColorWithTime } from "../core/utils/util";
import moment from "moment";
/*
 * （必填）taskList:[]                // 任务列表数据
 * （必填）taskClickCallBack()        // 点击单个任务的回调函数 传参是任务ID
 * （选填）hideOpt:[]                 // 要隐藏的选项，比如 'user'代表不显示负责人,'project'代表不显示项目名称
 * （必填）taskAttentionCallBack()    // 关注/取消关注 之后的回调
 * （必填）taskCheckedShow:false      // 是否显示复选框
 * （必填）checkingTaskCallBack()     // 返回所有复选的任务ID ['id编号']
 * （必填）checkTaskIds:[]            // 选中的所有任务ID
 * （选填）hideOkTask：false          // 隐藏已完成的，默认不隐藏
 * （选填）hideTaskBox:false          // 隐藏任务包，默认不隐藏
 * （选填）hideTaskIds:[]             // 要隐藏的任务ID
 */
export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { taskList: [], hideOpt: [], actTaskId: "", taskCheckedShow: false, checkTaskIds: [], checkTaskNames: [] }
  }

  componentWillMount() {
    if (this.props.taskList) { this.setState({ taskList: this.props.taskList }) }
    if (this.props.hideOpt) { this.setState({ hideOpt: this.props.hideOpt }) }
    if (this.props.taskCheckedShow === true || this.props.taskCheckedShow === false) {
      this.setState({ taskCheckedShow: this.props.taskCheckedShow })
    }
    if (this.props.checkTaskIds) { this.setState({ checkTaskIds: this.props.checkTaskIds }) }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskList) { this.setState({ taskList: nextProps.taskList }) }
    if (nextProps.hideOpt) { this.setState({ hideOpt: nextProps.hideOpt }) }
    if (nextProps.taskCheckedShow === true || nextProps.taskCheckedShow === false) {
      this.setState({ taskCheckedShow: nextProps.taskCheckedShow });
    }
    if (nextProps.checkTaskIds) { this.setState({ checkTaskIds: nextProps.checkTaskIds }) }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => { return }
  }

  attention(e, type, taskId) {
    e.stopPropagation()
    e.preventDefault()
    if (type === "关注") {
      addAttentionWitchTask(taskId, data => {
        if (data.err) { return false }
        if (data) {
          message.success("关注成功！")
          this.props.taskAttentionCallBack({ id: taskId, attention: true });
        } else { message.error("关注失败！") }
      });
    } else {
      cancelAttentionWitchTask(taskId, data => {
        if (data.err) { return false }
        if (data) {
          message.success("取消成功！");
          this.props.taskAttentionCallBack({ id: taskId, attention: false });
        } else { message.error("取消失败！") }
      })
    }
  }

  milestone(e, type, taskId) {
    e.stopPropagation();
    e.preventDefault();
    if (type === "设置") {
      setMilestoneWithTask(taskId, data => {
        if (data.err) { return false }
        if (data) {
          message.success("设置里程碑成功！");
          this.props.taskAttentionCallBack({ id: taskId, milestone: "1" });
        }
      });
    } else {
      setMilestoneWithTask(taskId, data => {
        if (data.err) { return false }
        if (data) {
          message.success("取消里程碑成功！");
          this.props.taskAttentionCallBack({ id: taskId, milestone: "0" });
        }
      });
    }
  }

  checking(id, i, porId, taskInfo) {
    let { checkTaskIds, checkTaskNames } = this.state;
    const isChecked = this.refs[`box${i}`].props.checked;
    const disabled = this.refs[`box${i}`].props.disabled;
    if (!disabled) {
      batchUpdata({ project: { id: porId }, taskinfo: { id: id } }, data => {
        if (data && data.modifyPermission) {
          if (disabled) return;
          if (!isChecked) {
            checkTaskIds.push(id);
          } else {
            checkTaskIds.splice(checkTaskIds.indexOf(id), 1);
          }
          this.setState({ checkTaskIds: checkTaskIds });
          this.props.checkingTaskCallBack(checkTaskIds, checkTaskNames);
        } else {
          message.warning(`您没有修改这条任务的权限`);
        }
      });
    }
  }
  returnTime = (taskInfo) => {
    if (taskInfo.stateName == "7") {
      if (moment().diff(moment(taskInfo.planEndTime), 'days') == 0) {
        return taskInfo.planEndTime ? taskInfo.planEndTime.slice(0, 10) : "未设置"
      } else {
        return `逾期${moment().diff(moment(taskInfo.planEndTime), 'days')}天`
      }
    } else if (taskInfo.stateName == "8") {
      if (moment().diff(moment(taskInfo.planEndTime), 'days') == 0) {
        return taskInfo.realityEndTime ? taskInfo.realityEndTime.slice(0, 10) : "未设置"
      } else {
        return `逾期${moment().diff(moment(taskInfo.planEndTime), 'days')}天`
      }
    } else if (taskInfo.stateName == "9") {
      if (moment(taskInfo.planEndTime).diff(moment(), 'days') == 0) {
        return taskInfo.realityEndTime ? taskInfo.realityEndTime.slice(0, 10) : "未设置"
      } else {
        return `提前${moment(taskInfo.planEndTime).diff(moment(), 'days')}天`
      }
    } else {
      if (taskInfo.stateName == "1" || taskInfo.stateName == "8" || taskInfo.stateName == "9") {
        return taskInfo.realityEndTime ? taskInfo.realityEndTime.slice(0, 10) : "未设置"
      } else {
        return taskInfo.planEndTime ? taskInfo.planEndTime.slice(0, 10) : "未设置"
      }
    }
  }
  render() {
    const { taskList, hideOpt, actTaskId, taskCheckedShow, checkTaskIds } = this.state;
    const { hideTaskBox, hideOkTask, hideTaskIds } = this.props;
    return (
      <div className="cpet_taskList">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {taskList &&
          taskList.map((item, i) => {
            if (hideTaskIds.indexOf(item.taskinfo.id) == -1) {
              let isShow = true;
              if (
                item.taskinfo.childCount > 0 &&
                item.taskinfo.childCount !== item.taskinfo.childSuccess &&
                hideTaskBox
              ) {
                isShow = false;
              }
              if (isShow) {
                return (
                  <div
                    className={item.taskinfo.id === actTaskId ? "taskList_row act" : "taskList_row"}
                    key={"cs" + i}
                    onClick={() => {
                      if (taskCheckedShow) { this.checking(item.taskinfo.id, i, item.project.id, item) }
                    }}
                  >
                    {taskCheckedShow ? (
                      <div className="cBox">
                        <Checkbox
                          className="ccBox"
                          ref={`box${i}`}
                          checked={checkTaskIds.indexOf(item.taskinfo.id) !== -1 ? true : false}
                          disabled={item.taskinfo.state === "1" || item.taskinfo.state === "4" || item.taskinfo.state === "2" ? true : false}
                        />
                      </div>
                    ) : ("")}
                    <div
                      className="taskList_left"
                      style={{ left: taskCheckedShow ? "40px" : "" }}
                      onClick={() => {
                        if (!taskCheckedShow) {
                          this.setState({ actTaskId: item.taskinfo.id });
                          this.props.taskClickCallBack(item.taskinfo.id, item.project.id);
                        }
                      }}
                    >
                      <div
                        style={{ width: "72px", height: "16px", position: "absolute ", left: "-16px", top: "12px" }}
                      >
                        {stateColor(item.taskinfo.stateName, "state")}
                      </div>
                      <div className="tit_row">
                        <span>
                          {item.taskinfo.taskinfoNumber &&
                            item.taskinfo.taskinfoNumber.numberS
                            ? item.taskinfo.taskinfoNumber.numberS + "."
                            : ""}
                          {item.taskinfo.rank}
                        </span>
                        <div className="taskName textMore">
                          {item.taskinfo.taskname}
                        </div>
                        <div className="tasklabs">
                          {item.labels &&
                            item.labels.map(lab => {
                              return (
                                <span
                                  key={lab.id}
                                  className={getTagColorByColorCode("1", lab.color)}
                                  style={{ minWidth: 64, maxWidth: 172 }}
                                >
                                  {lab.labelname && lab.labelname}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                      <div className="core_row">
                        <i className="icon iconfont icon-shijian" />
                        <span
                          className="textMore"
                          style={{ color: stateColorWithTime(item.taskinfo.stateName, item.taskinfo.planEndTime) }}
                        >
                          {this.returnTime(item.taskinfo)}
                        </span>
                        {hideOpt.indexOf("user") === -1 ? (
                          <i className="icon iconfont icon-ren2" />
                        ) : (
                            ""
                          )}
                        {hideOpt.indexOf("user") === -1 ? (
                          <span>
                            {item.taskinfo.userResponse
                              ? item.taskinfo.userResponse.name === undefined
                                ? "未指派"
                                : item.taskinfo.userResponse.name
                              : "未指派"}
                          </span>
                        ) : (
                            ""
                          )}
                        {item.taskinfo.state === "2" && (
                          <i className="icon iconfont icon-shenheren1" />
                        )}
                        {item.taskinfo.state === "2" && (
                          <span>
                            {item.taskinfo.userFlow
                              ? item.taskinfo.userFlow.name
                              : "未指派"}
                          </span>
                        )}
                        {hideOpt.indexOf("project") === -1 ? (
                          <i className="icon iconfont icon-xiangmuneirong" />
                        ) : (
                            ""
                          )}
                        {hideOpt.indexOf("project") === -1 ? (
                          <span className="textMore">
                            {item.project.proname}
                          </span>
                        ) : (
                            ""
                          )}
                        <i
                          className="icon iconfont icon-lvzhou_fenzhichangsuo"
                          style={{ fontSize: "12px" }}
                        />
                        <span>
                          {item.taskinfo.childSuccess}/
                          {item.taskinfo.childCount}
                        </span>
                        <i className="icon iconfont icon-discuss" />
                        <span>{item.taskinfo.leaveCount}</span>
                      </div>
                    </div>
                    <div className="taskList_right">
                      {item.taskinfo.milestone === "1" ? (
                        <i
                          className="iconfont icon-flaged"
                          style={{
                            color: "#64b5f6",
                            fontSize: 18
                          }}
                          onClick={e => {
                            this.milestone(e, "取消", item.taskinfo.id);
                          }}
                        />
                      ) : (
                          <i
                            className="iconfont icon-flag"
                            style={{
                              color: "#bdbdbd",
                              fontSize: 18
                            }}
                            onClick={e => {
                              this.milestone(e, "设置", item.taskinfo.id);
                            }}
                          />
                        )}
                      {item.taskinfo.collect ? (
                        <i
                          className="iconfont icon-stared"
                          // style={{ color: "rgb(255, 167, 38)", fontSize: 20 }}
                          onClick={e => {
                            this.attention(e, "取消关注", item.taskinfo.id);
                          }}
                        />
                      ) : (
                          <i
                            className="iconfont icon-star"
                            // style={{ color: "#bdbdbd", fontSize: 20 }}
                            onClick={e => {
                              this.attention(e, "关注", item.taskinfo.id);
                            }}
                          />
                        )}
                    </div>
                  </div>
                );
              }
            }
          })}
      </div>
    );
  }
}
