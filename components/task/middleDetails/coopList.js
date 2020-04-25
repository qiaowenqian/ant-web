import React from "react";
import {  Tooltip, Spin, Modal, message, Popconfirm } from "antd";
import stylesheet from "styles/components/task/middleDetails/coopList.scss";
import TaskAddWithCoop from "../../taskAddWithCoop";
import moment from "moment";
import {
  deleteCoopTaskById,
  urgeTaskByIdMore
} from "../../../core/service/task.service";
import { setColorState } from "../../../core/utils/util";
const confirm = Modal.confirm;
/**
 * coopList:{nextTaskinfo[], frontTaskinfo[] }  frontTaskinfo 前序任务列表 nextTaskinfo 后续任务数组
 * modifyPermission: true 有权限  false 没有权限
 * isSmall: 是否是小窗口
 * taskState: "1","2","3",""4"","5","6","7","8","9" 任务状态（不为1/8/9时可添加成果文件 按时完成  逾期完成 提前完成 ）
 * taskInfo:{ }  任务详情信息 包涵taskId  projectId 等
 */

export default class CoopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coopList: {
        frontTaskinfo: [], //前序任务列表
        nextTaskinfo: [] //后序任务列表
      }, //协作任务数组
      available: false,
      createTask: false, //创建任务 是否显示
      coopAddType: [],
      addCoopTaskShow: false, //   前后续任务组件
      modifyPermission: true, // 权限

      taskInfo: {} //报存下来任务详情的数据
    };
  }
  componentDidMount() {
    // const { coopList, taskInfo } = this.state;
    // if (this.props.coopList) {
    //   //       debugger;
    //   coopList.frontTaskinfo = this.props.coopList.frontTaskinfo;
    //   coopList.nextTaskinfo = this.props.coopList.nextTaskinfo;
    //   this.setState({
    //     coopList: coopList
    //   });
    // }
    // if (this.props.taskInfo) {
    //   this.setState({
    //     taskInfo: taskInfo
    //   });
    // }
  }

  componentWillReceiveProps = nextProps => {
    const { coopList } = this.state;
    if (nextProps.coopList) {
      coopList.frontTaskinfo = nextProps.coopList.frontTaskinfo;
      coopList.nextTaskinfo = nextProps.coopList.nextTaskinfo;
      this.setState({ childList: nextProps.childList });
    }
    // if (nextProps.taskInfo) {
    //   this.setState({ taskInfo: nextProps.taskInfo });
    // }
  };
  //过滤掉不可选的协作任务ID

  // let returnIds = [];
  // const { coopList, taskInfo } = this.state;
  // if (taskInfo) {
  //   returnIds.push(taskInfo.id);
  //   let parentIds = taskInfo.parentIds;
  //   if (parentIds) {
  //     let parentIdArr = parentIds.split(",");
  //     parentIdArr.map(item => {
  //       if (item && item != "0") {
  //         returnIds.push(item);
  //       }
  //     });
  //   }
  // }
  // if (coopList) {
  //   const { frontTaskinfo, nextTaskinfo } = coopList;
  //   if (frontTaskinfo && frontTaskinfo.length > 0) {
  //     frontTaskinfo.map(item => {
  //       returnIds.push(item.antTaskrelation.id);
  //     });
  //   }
  //   if (nextTaskinfo && nextTaskinfo.length > 0) {
  //     nextTaskinfo.map(item => {
  //       returnIds.push(item.antTaskrelation.id);
  //     });
  //   }
  // }
  // return returnIds;
  getNotCheckIdsCoop = () => {
    let returnIds = [];
    const { coopList, taskInfo } = this.props;
    if (taskInfo && taskInfo.id) {
      returnIds.push(taskInfo.id);
      let parentIds = taskInfo.parentIds;
      if (parentIds) {
        let parentIdArr = parentIds.split(",");
        parentIdArr &&
          parentIdArr.map(item => {
            if (item && item !== "0") {
              returnIds.push(item);
            }
          });
      }
    }
    if (coopList) {
      const { frontTaskinfo, nextTaskinfo } = coopList;
      if (frontTaskinfo && frontTaskinfo.length > 0) {
        frontTaskinfo &&
          frontTaskinfo.map(item => {
            returnIds.push(item.antTaskrelation.id);
          });
      }
      if (nextTaskinfo && nextTaskinfo.length > 0) {
        nextTaskinfo &&
          nextTaskinfo.map(item => {
            returnIds.push(item.antTaskrelation.id);
          });
      }
    }
    return returnIds;
  };
  //删除协作任务
  deleteCoopTask = id => {
    const that = this;
    const { taskInfo } = this.props;
    deleteCoopTaskById(
      id,
      taskInfo.id,
      data => {
        if (data.err) {
          return false;
        }
        message.success("删除成功！");
        that.props.updataCoopList(taskInfo.id, taskInfo.project.id);
        that.props.updataTaskDetailByIdCallBack(
          taskInfo.id,
          taskInfo.project.id
        );
      },
      that.props.isSmall
    );
    // confirm({
    //   title: "您是否确认移除此协作任务？",
    //   okText: "确定",
    //   cancelText: "取消",
    //   onOk() {
    //     deleteCoopTaskById(
    //       id,
    //       taskInfo.id,
    //       data => {
    //         if (data.err) {
    //           return false;
    //         }
    //         message.success("删除成功！");
    //         that.props.updataCoopList(taskInfo.id, taskInfo.project.id);
    //         that.props.updataTaskDetailByIdCallBack(
    //           taskInfo.id,
    //           taskInfo.project.id
    //         );
    //       },
    //       that.props.isSmall
    //     );
    //   },
    //   onCancel() {}
    // });
  };
  //催办协作任务
  urgeChildTask = arrId => {
    const { taskId } = this.props;
    urgeTaskByIdMore(
      arrId,
      taskId,
      2,
      data => {
        if (data.err) {
          return false;
        }
        message.success("催办成功");
      },
      this.props.isSmall
    );
  };
  render() {
    const {
      addCoopTaskShow,
      modifyPermission,
      // taskInfo,
      coopAddType
    } = this.state;
    const { coopList, coopListLoading, taskInfo } = this.props;
    let notCheckIds = this.getNotCheckIdsCoop(); // 不可选的协作任务Id数组
    return (
      <div className="coopList">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="list">
          <ul className="list animated slideInDown" key="swtich_zrw">
            <Spin spinning={coopListLoading} />
            <li className="listTop">
              <div className="titTxt">{"前序任务"}</div>
              {taskInfo.modifyPermission ? (
                taskInfo.state === "4" ? (
                  ""
                ) : (
                  <i
                    // type="plus-circle"
                    className="iconfont icon-add"
                    style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    onClick={() => {
                      this.setState({
                        coopAddType: "前序任务",
                        addCoopTaskShow: true
                      });
                    }}
                  />
                )
              ) : (
                <Tooltip
                  placement="top"
                  title={`您没有修改这条任务的权限`}
                  overlayClassName="createOverlayClass"
                  trigger="hover"
                >
                  {taskInfo.state === "4" ? (
                    ""
                  ) : (
                    <i
                      className="iconfont icon-add"
                      style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    />
                  )}
                </Tooltip>
              )}
            </li>
            {coopList &&
              coopList.frontTaskinfo &&
              coopList.frontTaskinfo.map(item => {
                return (
                  <li
                    key={"frontTaskinfo" + item.id}
                    className="listContent"
                    onClick={() => {
                      if (
                        this.props.updataTaskDetailByIdCallBack &&
                        taskInfo.isMember
                      ) {
                        this.props.updataCoopList(item.antTaskrelation.id);
                        this.props.updataTaskDetailByIdCallBack(
                          item.antTaskrelation.id,
                          taskInfo.project.id
                        );
                      }
                    }}
                  >
                    <div
                      className="triangle_border"
                      style={setColorState(item.antTaskrelation.stateName)}
                    />
                    <div className="taskName">
                      <span className="nameWbs">
                        {item.antTaskrelation.taskinfoNumber &&
                        item.antTaskrelation.taskinfoNumber.numberS
                          ? item.antTaskrelation.taskinfoNumber.numberS +
                            "." +
                            item.antTaskrelation.rank
                          : item.antTaskrelation.rank}
                      </span>
                      <span
                      // onClick={() => {
                      //   if (this.props.updataTaskDetailByIdCallBack) {
                      //     this.props.updataCoopList(item.antTaskrelation.id);
                      //     this.props.updataTaskDetailByIdCallBack(
                      //       item.antTaskrelation.id,
                      //       taskInfo.project.id
                      //     );
                      //   }
                      // }}
                      >
                        {" - " + item.antTaskrelation.taskname}
                      </span>
                    </div>
                    {/* {stateColor(item.stateName, "type")} */}
                    <div className="taskPerson">
                      {item.antTaskrelation.userResponse ? (
                        <Tooltip
                          placement="top"
                          title={
                            item.antTaskrelation.userResponse &&
                            item.antTaskrelation.userResponse.name
                          }
                        >
                          {item.antTaskrelation.userResponse &&
                            item.antTaskrelation.userResponse.name}
                        </Tooltip>
                      ) : (
                        "未指派"
                      )}
                    </div>
                    <div className="taskDate">
                      {item.antTaskrelation.planEndTime
                        ? moment(item.antTaskrelation.planEndTime).format(
                            "YYYY/MM/DD"
                          )
                        : ""}
                    </div>
                    {taskInfo.modifyPermission ? (
                      <Popconfirm
                        title={`确认移除此协作任务?`}
                        onConfirm={() => {
                          this.deleteCoopTask(item.id);
                        }}
                        okText="移除"
                        cancelText="取消"
                      >
                        <div
                          className="delte"
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          移除
                        </div>
                      </Popconfirm>
                    ) : (
                      ""
                    )}

                    <div className="taskUrge">
                      {item.antTaskrelation.state == "0" ||
                      item.antTaskrelation.state == "2" ? (
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            this.urgeChildTask([item.antTaskrelation.id]);
                          }}
                        >
                          催办
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                );
              })}
            <li className="listTop listBottom">
              <div className="titTxt">{"后序任务"}</div>
              {taskInfo.modifyPermission ? (
                taskInfo.state === "4" ? (
                  ""
                ) : (
                  <i
                    className="iconfont icon-add"
                    style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    onClick={() => {
                      this.setState({
                        coopAddType: "后序任务",
                        addCoopTaskShow: true
                      });
                    }}
                  />
                )
              ) : (
                <Tooltip
                  placement="top"
                  title={`您没有修改这条任务的权限`}
                  overlayClassName="createOverlayClass"
                  trigger="hover"
                >
                  {taskInfo.state === "4" ? (
                    ""
                  ) : (
                    <i
                      className="iconfont icon-add"
                      style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    />
                  )}
                </Tooltip>
              )}
            </li>
            {coopList &&
              coopList.nextTaskinfo &&
              coopList.nextTaskinfo.map(item => {
                return (
                  <li
                    key={"nextTaskinfo" + item.id}
                    className={
                      taskInfo.isMember ? "listContent" : "listContents"
                    }
                    onClick={() => {
                      if (
                        this.props.updataTaskDetailByIdCallBack &&
                        taskInfo.isMember
                      ) {
                        this.props.updataCoopList(item.antTaskrelation.id);
                        this.props.updataTaskDetailByIdCallBack(
                          item.antTaskrelation.id,
                          taskInfo.project.id
                        );
                      }
                    }}
                  >
                    <div
                      className="triangle_border"
                      style={setColorState(item.antTaskrelation.stateName)}
                    />
                    <div className="taskName">
                      <span className="nameWbs">
                        {item.antTaskrelation.taskinfoNumber &&
                        item.antTaskrelation.taskinfoNumber.numberS
                          ? item.antTaskrelation.taskinfoNumber.numberS +
                            "." +
                            item.antTaskrelation.rank
                          : item.antTaskrelation.rank}
                      </span>
                      <span>{" - " + item.antTaskrelation.taskname}</span>
                    </div>
                    {/* {stateColor(item.stateName, "type")} */}
                    <div className="taskPerson">
                      {item.antTaskrelation.userResponse ? (
                        <Tooltip
                          placement="top"
                          title={
                            item.antTaskrelation.userResponse &&
                            item.antTaskrelation.userResponse.name
                          }
                        >
                          {item.antTaskrelation.userResponse &&
                            item.antTaskrelation.userResponse.name}
                        </Tooltip>
                      ) : (
                        "未指派"
                      )}
                    </div>
                    <div className="taskDate">
                      {item.antTaskrelation.planEndTime
                        ? moment(item.antTaskrelation.planEndTime).format(
                            "YYYY/MM/DD"
                          )
                        : ""}
                    </div>
                    <div className="taskUrge">
                      {(item.antTaskrelation.state == "0" ||
                        item.antTaskrelation.state == "2") &&
                      taskInfo.isMember ? (
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            this.urgeChildTask([item.antTaskrelation.id]);
                          }}
                        >
                          催办
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {taskInfo.modifyPermission ? (
                      <Popconfirm
                        title={`确认移除此协作任务?`}
                        onConfirm={() => {
                          this.deleteCoopTask(item.id);
                        }}
                        okText="移除"
                        cancelText="取消"
                      >
                        <div
                          className="delte"
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          移除
                        </div>
                      </Popconfirm>
                    ) : (
                      ""
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        {/*前后续任务添加*/}
        {addCoopTaskShow ? (
          <TaskAddWithCoop
            task={{
              id: taskInfo.id && taskInfo.id,
              projectId: taskInfo.project && taskInfo.project.id,
              projectName: taskInfo.proname && taskInfo.proname,
              name: taskInfo.name && taskInfo.name
            }}
            title={coopAddType}
            notCheckIds={notCheckIds}
            closedCallback={() => {
              this.setState({ addCoopTaskShow: false });
            }}
            successCallback={() => {
              this.props.updataCoopList(taskInfo.id && taskInfo.id);
              this.props.updataTaskDetailByIdCallBack(
                taskInfo.id,
                taskInfo.project.id
              );
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
