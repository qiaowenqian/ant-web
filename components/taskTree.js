import React from "react";
import { Icon, Checkbox, Spin, message, Tooltip } from "antd";

import stylesheet from "styles/components/taskTree.scss";
import { getProjectTaskListById } from "../core/service/project.service";
import {
  addAttentionWitchTask,
  cancelAttentionWitchTask,
  setMilestoneWithTask,
  batchUpdata,
  moveTaskList
} from "../core/service/task.service";
import {
  stateColor,
  getTagColorByColorCode,
  stateColorWithTime,
  setColorState
} from "../core/utils/util";
import moment from "moment";

import _ from "lodash";
/*
 *  (必填)treeList:[{}]                // 树列表数据 入参对象格式如下
    *  'projectId': '',
        'parentId': '',
        'taskId': '',
        'name': '',
        'state': '',
        'number': '',
        'tags': [],
        'attention': false,
        'milestone': false,
        'fzr': '',
        'qrr':'',
        'endDate': '',
        'childCount': 0,
        'childSuccess': 1,
        'talkCount': 3,
        'labels':[],
    （选填) taskOnClickCallBack(id)             // 点击单个任务的回掉
    （选填）checkBoxShow: false                 // 是否显示复选按钮
    （选填）checkingCallBack（['id1','id2']）   // 返回选中的任务ID列表
    （选填）checkedTaskIds: ['id1','id2']      // 选中的任务ID列表
    （选填）updateTask: {}                  // 要局部更新的值
    （选填）taskLiConcise: false                // 是否返回简洁的列表，简洁的只包含状态 名称等，单行显示
    （选填）notCheckIds:[]                     //不可选的
    （必填）treeListOnChangeCallBack(treeList) // 数据修改后的回调
    （选填）hideOkTask：false                    // 隐藏已完成
     (选填) taskMoveTree ：fasle              //是否是复制移动任务时调用的该组件 addIconNone
     (选填) taskAdd ：fasle              //是否是添加前后序任务的组件
     (选填) addIconNone ：fasle              //是否是添加前后序任务的组件

 */

export default class TaskTree extends React.Component {
  constructor(props) {
    super(props);
    this.index = "";
    this.index1 = "";
    this.state = {
      treeList: [],
      act: "",
      checkedTaskIds: [],
      taskLiConcise: false,
      notCheckIds: [],
      projectname: "",
      moveChildList: [],
      clickChange: true
      // taskMoveTree:false
    };
  }

  componentWillMount() {
    if (this.props.projectname) {
      this.setState({
        projectname: this.props.projectname
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectname != this.props.projectname) {
      this.setState({
        projectname: nextProps.projectname
      });
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  attention(task) {
    if (task.attention) {
      cancelAttentionWitchTask(task.taskId, data => {
        if (data.err) {
          return false;
        }
        message.success("取消关注成功！");
        task.attention = false;
        this.setDataByArgs(this.props.treeList, task, ["attention"]);
      });
    } else {
      addAttentionWitchTask(task.taskId, data => {
        if (data.err) {
          return false;
        }
        message.success("关注成功！");
        task.attention = true;
        this.setDataByArgs(this.props.treeList, task, ["attention"]);
      });
    }
  }

  milestone(task) {
    if (task.milestone === "1") {
      setMilestoneWithTask(task.taskId, data => {
        if (data.err) {
          return false;
        }
        message.success("取消里程碑成功！");
        task.milestone = "0";
        this.setDataByArgs(this.props.treeList, task, ["milestone"]);
      });
    } else {
      setMilestoneWithTask(task.taskId, data => {
        if (data.err) {
          return false;
        }
        message.success("设置里程碑成功！");
        task.milestone = "1";
        this.setDataByArgs(this.props.treeList, task, ["milestone"]);
      });
    }
  }

  checkingTask(id, porId, proname) {
    const { projectname } = this.state;
    const { checkedTaskIds } = this.props;
    const isChecked = this.refs[`box${id}`].props.checked;
    const disabled = this.refs[`box${id}`].props.disabled;
    if (!disabled) {
      batchUpdata({ project: { id: porId }, taskinfo: { id: id } }, data => {
        if (data && data.modifyPermission) {
          if (disabled) return;
          if (!isChecked) {
            checkedTaskIds.push(id);
          } else {
            const index = checkedTaskIds.indexOf(id);
            checkedTaskIds.splice(index, 1);
          }
          if (this.props.checkingCallBack) {
            this.props.checkingCallBack(checkedTaskIds);
          }
        } else {
          message.warning(`您在项目“${projectname}”中没有执行该操作的权限`);
        }
      });
    }
  }
  checkingTaskExport = (id) => {
    const { checkedTaskIds } = this.props;
    const isChecked = this.refs[`box${id}`].props.checked;
    const disabled = this.refs[`box${id}`].props.disabled;
    if (disabled) return;
    if (!isChecked) {
      checkedTaskIds.push(id);
    } else {
      const index = checkedTaskIds.indexOf(id);
      checkedTaskIds.splice(index, 1);
    }
    if (this.props.checkingCallBack) {
      this.props.checkingCallBack(checkedTaskIds);
    }

  }
  //数组位置交换
  swapArray(arr, index1, index2) {
    let arrlist = _.cloneDeep(arr);
    let arrlist_number1 = arrlist[index1].number;
    let arrlist_number2 = arrlist[index2].number;
    if (arr[index1].childList && arr[index1].childList.length > 0) {
      var leve = arr[index1].parentIds
        ? arr[index1].parentIds.length - 1
        : index2;
      var param =
        arrlist_number2.length == 1
          ? arrlist_number2
          : arrlist_number2.substring(0, leve);
      this.loopTaskNumber(arr[index1].childList, param);
    }
    if (arr[index2].childList && arr[index2].childList.length > 0) {
      var leve = arr[index2].parentIds
        ? arr[index2].parentIds.length - 1
        : index1;

      var param =
        arrlist_number1.length == 1
          ? arrlist_number1
          : arrlist_number1.substring(0, leve);
      this.loopTaskNumber(arr[index2].childList, param);
    }

    arr[index1].number = arrlist_number2;
    arr[index2].number = arrlist_number1;
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
  loopTaskNumber = (arr, number) => {
    arr.map((item, i) => {
      if (item.number) {
        item.number = number + "." + (i + 1);
      }
      if (item.childList && item.childList.length > 0) {
        this.loopTaskNumber(item.childList, item.number);
      }
      return item;
    });
    return arr;
  };
  //向上移动任务列表
  moveTaksListUp(task, moveI, moveList) {
    moveTaskList(
      {
        id: moveList[moveI].taskId
      },
      {
        id: moveList[moveI - 1].taskId
      },
      () => {
        task.loading = false;
        if (task.parentId === "0") {
          this.setDataByArgs(
            this.props.treeList,
            task.parentId,
            this.swapArray(moveList, moveI, moveI - 1)
          );
        } else {
          this.setChildList(
            this.props.treeList,
            task.parentId,
            this.swapArray(moveList, moveI, moveI - 1)
          );
        }
      }
    );
  }
  //向下移动任务列表
  moveTaksListDown(task, moveI, moveList) {
    moveTaskList(
      {
        id: moveList[moveI].taskId
      },
      {
        id: moveList[moveI + 1].taskId
      },
      () => {
        task.loading = false;
        if (task.parentId === "0") {
          this.setDataByArgs(
            this.props.treeList,
            task.parentId,
            this.swapArray(moveList, moveI, moveI + 1)
          );
        } else {
          this.setChildList(
            this.props.treeList,
            task.parentId,
            this.swapArray(moveList, moveI, moveI + 1)
          );
        }
      }
    );
  }
  returnTime = (taskInfo) => {
    if (taskInfo.state == "7") {
      if (moment().diff(moment(taskInfo.endDate), 'days') == 0) {
        return taskInfo.endDate ? taskInfo.endDate.slice(0, 10) : "未设置"
      } else {
        return `逾期${moment().diff(moment(taskInfo.endDate), 'days')}天`
      }
    } else if (taskInfo.state == "8") {
      if (moment().diff(moment(taskInfo.endDate), 'days') == 0) {
        return taskInfo.endDate_real ? taskInfo.endDate_real.slice(0, 10) : "未设置"
      } else {
        return `逾期${moment().diff(moment(taskInfo.endDate), 'days')}天`
      }
    } else if (taskInfo.state == "9") {
      if (moment(taskInfo.endDate).diff(moment(), 'days') == 0) {
        return taskInfo.endDate_real ? taskInfo.endDate_real.slice(0, 10) : "未设置"
      } else {
        return `提前${moment(taskInfo.endDate).diff(moment(), 'days')}天`
      }
    } else {
      if (taskInfo.state == "1" || taskInfo.state == "8" || taskInfo.state == "9") {
        return taskInfo.endDate_real ? taskInfo.endDate_real.slice(0, 10) : "未设置"
      } else {
        return taskInfo.endDate ? taskInfo.endDate.slice(0, 10) : "未设置"
      }
    }
  }
  returnTask(task, moveI, moveList) {
    const { act } = this.state;
    let {
      checkBoxShow,
      checkedTaskIds,
      taskLiConcise,
      notCheckIds,
      moreEdit,
      moveSort,
      taskMoveTree,
      taskAdd
    } = this.props;
    if (!notCheckIds) {
      notCheckIds = [];
    }
    let count = 0;
    return (
      <div
        className={task.taskId === act ? "taskList_row act" : "taskList_row"}
        style={taskLiConcise ? { height: "50px" } : {}}
        onClick={e => {
          if (e.target.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
          }
          if (moreEdit) {
            this.checkingTask(task.taskId, task.projectId);
            return;
          } else if (moreEdit == "exprot") {
            this.checkingTaskExport(task.taskId)
          }
        }}
      >
        {/*此冒泡阻止用于 点击空白处 关闭详情页的功能*/}
        {stateColor(task.state, "state")}
        {checkBoxShow ? (
          <div
            className="checkBox"
            style={taskLiConcise ? { margin: "0px 0 0 20px" } : {}}
          >
            <Checkbox
              ref={`box${task.taskId}`}
              checked={checkedTaskIds.indexOf(task.taskId) !== -1 ? true : false}
              disabled={notCheckIds.indexOf(task.taskId) !== -1 ? true : false}
            />
          </div>
        ) : (
            ""
          )}
        <div
          className="taskList_left"
          style={{ left: "25px" }}
          onClick={() => {
            if (moreEdit) {
              return;
            }
            count = count + 1;
            setTimeout(() => {
              if (count === 1) {
                if (this.props.taskOnClickCallBack) {
                  if (taskMoveTree) {
                    if (act == task.taskId) {
                      this.setState({ act: "" });
                      this.props.taskOnClickCallBack(
                        task.taskId,
                        task.projectId,
                        task.parentId,
                        task.name,
                        task.state
                      );
                    } else {
                      this.setState({ act: task.taskId });
                      this.props.taskOnClickCallBack(
                        task.taskId,
                        task.projectId,
                        task.parentId,
                        task.name,
                        task.state
                      );
                    }
                  } else {
                    this.setState({ act: task.taskId });
                    this.props.taskOnClickCallBack(
                      task.taskId,
                      task.projectId,
                      task.parentId,
                      task.name,
                      task.state
                    );
                  }
                }
              }
              if (count === 2) {
                if (task.childCount > 0) {
                  task.loading = true;
                  this.openChild(task);
                }
              }
              count = 0;
            }, 300);
          }}
        >
          <div className="tit_row">
            {taskMoveTree || taskAdd ? (
              <span className="Num" style={{ marginRight: 3 }}>
                {task.number + " -"}
              </span>
            ) : (
                <span>{task.number}</span>
              )}
            <div className="taskName textMore">{task.name}</div>
            {!taskLiConcise ? (
              <div className="tasklabs">
                {task.labels &&
                  task.labels.map(lab => {
                    return (
                      <span
                        key={lab.id}
                        className={getTagColorByColorCode("1", lab.color)}
                        // style={
                        //   lab.labelname && lab.labelname.length <= 3
                        //     ? { width: 50 }
                        //     : { width: 70 }
                        // }
                        style={{ minWidth: 64, maxWidth: 172 }}
                      >
                        {lab.labelname}
                      </span>
                    );
                  })}
              </div>
            ) : (
                <div className="userBox">
                  <i className="icon iconfont icon-ren2" />
                  <span>{task.fzr}</span>
                </div>
              )}
          </div>
          {!taskLiConcise ? (
            <div className="core_row">
              <i className="icon iconfont icon-shijian" />
              <span
                style={{ color: stateColorWithTime(task.state, task.endDate) }}
              >
                {this.returnTime(task)}
              </span>
              <i className="icon iconfont icon-ren2" />
              <span>{task.fzr ? task.fzr : "未指派"}</span>
              {task.state == "2" && (
                <i className="icon iconfont icon-shenheren1" />
              )}
              {task.state == "2" && (
                <span>{task.qrr ? task.qrr : "未指派"}</span>
              )}
              <i
                className="icon iconfont icon-lvzhou_fenzhichangsuo"
                style={{ fontSize: "12px" }}
              />
              <span>
                {task.childSuccess}/{task.childIngCount}
              </span>
              <i className="icon iconfont icon-discuss" />
              <span>{task.talkCount ? task.talkCount : 0}</span>
            </div>
          ) : (
              ""
            )}
        </div>
        {!taskLiConcise ? (
          <div className="taskList_right">
            {moveSort ? (
              <div>
                <i
                  className={
                    task.milestone === "1"
                      ? "iconfont icon-flaged"
                      : "iconfont icon-flag"
                  }
                  style={
                    task.milestone === "1"
                      ? { color: "#64b5f6", fontSize: 18 }
                      : { color: "#bdbdbd", fontSize: 18 }
                  }
                  onClick={() => {
                    this.milestone(task);
                  }}
                />
                <i
                  className={
                    task.attention
                      ? "iconfont icon-stared"
                      : "iconfont icon-star"
                  }
                  style={
                    task.attention
                      ? { color: "rgb(255, 167, 38)", fontSize: 20 }
                      : { color: "#bdbdbd", fontSize: 20 }
                  }
                  onClick={() => {
                    this.attention(task);
                  }}
                />
              </div>
            ) : (
                <div className="moveTaskList">
                  {moveList.length > 1 ? (
                    moveI === 0 ? (
                      <Tooltip title="下移">
                        <i
                          className="iconfont icon-movedown"
                          onClick={() => {
                            task.loading = true;
                            this.moveTaksListDown(task, moveI, moveList);
                          }}
                        />
                      </Tooltip>
                    ) : moveList.length - 1 === moveI ? (
                      <Tooltip title="上移">
                        <i
                          className="iconfont icon-moveup"
                          onClick={() => {
                            task.loading = true;
                            this.moveTaksListUp(task, moveI, moveList);
                          }}
                        />
                      </Tooltip>
                    ) : (
                          <span>
                            <Tooltip title="上移">
                              <i
                                className="iconfont icon-moveup"
                                onClick={() => {
                                  task.loading = true;
                                  this.moveTaksListUp(task, moveI, moveList);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="下移">
                              <i
                                className="iconfont icon-movedown"
                                onClick={() => {
                                  task.loading = true;
                                  this.moveTaksListDown(task, moveI, moveList);
                                }}
                              />
                            </Tooltip>
                          </span>
                        )
                  ) : (
                      ""
                    )}
                </div>
              )}
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }

  returnTree(list) {
    const { taskLiConcise, taskMoveTree, addIconNone, hideOkTask } = this.props;
    const { act } = this.state;
    let iconAdd = true;
    const el = list.map((item, i) => {
      return (
        <div key={"treeTask" + item.taskId} className={"tree_row"}>
          {taskMoveTree ? (
            <div
              className="triangle_border"
              style={setColorState(item.state)}
            />
          ) : (
              ""
            )}
          <div className="tree_icon">
            {item.childCount > 0 &&
              addIconNone &&
              !(hideOkTask && item.childCount === item.childSuccess) ? (
                <Icon
                  style={taskLiConcise ? { margin: "18px 0 0 0" } : {}}
                  type={item.openChild ? "minus-circle-o" : "plus-circle-o"}
                  onClick={() => {
                    item.loading = true;
                    this.openChild(item);
                  }}
                />
              ) : (
                <i
                  style={taskLiConcise ? { margin: "15px 0 0 0" } : {}}
                  className="icon iconfont icon-yuandianxiao"
                />
              )}
          </div>
          <div className="tree_task">
            <Spin spinning={item.loading} />
            {this.returnTask(item, i, list)}
            {item.openChild && item.childList && item.childList.length > 0
              ? this.returnTree(item.childList)
              : ""}
          </div>
        </div>
      );
    });
    return el;
  }

  openChild(task) {
    let { hideOkTask } = this.props;
    if (!hideOkTask) {
      hideOkTask = false;
    }
    if (task.openChild) {
      task.openChild = false;
      this.setDataByArgs(this.props.treeList, task, ["openChild"]);
      this.setChildList(this.props.treeList, task.taskId, []);
    } else {
      task.loading = true;
      task.openChild = true;
      this.setDataByArgs(this.props.treeList, task, ["loading", "openChild"]);

      getProjectTaskListById(
        task.projectId,
        task.taskId,
        "",
        1,
        data => {
          if (data.err) {
            return false;
          }
          if (data.taskPage.list) {
            const childList = [];
            data.taskPage.list.map((item, i) => {
              childList.push({
                rankMove: item.taskinfo.rank,
                projectId: item.project.id,
                parentId: item.taskinfo.parent.id,
                taskId: item.taskinfo.id,
                name: item.taskinfo.taskname,
                state: item.taskinfo.stateName,
                number:
                  (item.taskinfo.taskinfoNumber
                    ? item.taskinfo.taskinfoNumber.numberS + "."
                    : "") + item.taskinfo.rank,
                tags: [],
                attention: item.taskinfo.collect ? true : false,
                milestone: item.taskinfo.milestone === "1" ? "1" : "0",
                fzr: item.taskinfo.userResponse
                  ? item.taskinfo.userResponse.name
                  : "未指派",
                qrr: item.taskinfo.userFlow
                  ? item.taskinfo.userFlow.name
                  : "未指派",
                endDate: item.taskinfo.planEndTime
                  ? item.taskinfo.planEndTime
                  : "未设置",
                endDate_real: item.taskinfo.realityEndTime
                  ? item.taskinfo.realityEndTime
                  : "未设置",
                child: item.taskinfo.child,
                childCount: item.taskinfo.childCount,
                childIngCount: item.taskinfo.childCount,
                childSuccess: item.taskinfo.childSuccess,
                talkCount: item.taskinfo.leaveCount,
                openChild: false,
                loading: false,
                labels: item.labels,
                parentIds: item.taskinfo.parentIds
              });
            });
            this.setChildList(this.props.treeList, task.taskId, childList);
            this.setState({ moveChildList: childList });
          }
        },
        hideOkTask
      );
    }
  }

  setChildList(treeList, id, childList) {
    const loop = list => {
      list.forEach((item, i) => {
        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }
        if (item.taskId == id) {
          item.childList = childList;
          item.loading = false;
        }
      });
    };

    loop(treeList);
    this.props.treeListOnChangeCallBack(treeList);
  }

  setDataByArgs(treeList, task, args) {
    const loop = list => {
      list.forEach((item, i) => {
        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }
        if (item.taskId == task.id) {
          args.map(argName => {
            item[argName] = task[argName];
          });
          //item.loading = task.loading;
          //item.openChild = task.openChild;
        }
      });
    };
    loop(treeList);
    //this.setState({treeList:treeList});
    this.props.treeListOnChangeCallBack(treeList);
  }

  render() {
    const { treeList } = this.props;
    return (
      <div className="cpet_task_tree">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {this.returnTree(treeList)}
      </div>
    );
  }
}
