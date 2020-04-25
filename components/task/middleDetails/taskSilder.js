import React from "react";
import stylesheet from "styles/components/task/middleDetails/taskSilder.scss";
import ChildList from "./childList";
import CoopList from "./coopList";
import FileList from "./fileList";
import MoneyEnd from "../../moneyEnd";
import { getTeamInfoWithMoney } from "../../../core/utils/util";
import _ from "lodash";
/**
 * @taskId       (string)
 * @description （必填）任务Id
 *
 * @taskState    (string)
 * @description （必填）"1","2","3","4","5","6","7","8","9" 任务状态（不为1/8/9时可添加成果文件 按时完成  逾期完成 提前完成 ）
 *
 * @createPermission (boolea)
 * @description     （必填)创建权限
 *
 * @count           （必填)子任务总数
 *                  （必填)协作任务总数
 *                  （必填)成果文件总数
 */
export default class TaskSilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // taskId: "", //任务Id，夫组件传过来
      // projectId: "", //项目Id
      taskInfo: {}, //任务详情信息
      showChild: false, //向上展开，向下箭头展示闭合
      showFlie: false, //向上箭头表示展开，向下箭头展示闭合
      showCoop: false, //向上箭头表示展开，向下箭头展示闭合
      versionAlert: false
      // childListLoading: false,
      // coopListLoading: false,
      // filesListLoading: false,

      // childList: [],
      // coopList: [],
      // fileList: []
    };
  }
  componentDidUpdate = () => {
    // console.log(document.getElementById("fixedHeads").clientHeight, 2);
    // this.props.initTop(document.getElementById("fixedHeads").clientHeight);
  };
  componentDidMount = () => {
    // this.props.initTop(document.getElementById("fixedHeads").clientHeight);
    // const {
    //   taskInfo,
    //   childList,
    //   coopList,
    //   fileList,
    //   childListLoading,
    //   coopListLoading,
    //   filesListLoading
    // } = this.props;
    // if (taskInfo) {
    //   this.setState({
    //     taskInfo: taskInfo,
    //     childList: childList,
    //     coopList: coopList,
    //     fileList: fileList,
    //     childListLoading: childListLoading,
    //     coopListLoading: coopListLoading,
    //     filesListLoading: filesListLoading
    //   });
    // }
  };
  componentWillMount = () => { };
  componentWillReceiveProps(nextProps, nextState) {
    // const { showChild, showCoop, showFlie } = this.state;
    // if (nextProps.taskInfo && nextProps.taskInfo.id) {
    //   if (showChild && nextProps.taskSilderChange == "") {
    //     this.getChildTaskList(nextProps.taskIDDD);
    //   }
    //   if (showCoop && nextProps.taskSilderChange == "") {
    //     this.getCoopTaskList(nextProps.taskIDDD);
    //   }
    //   if (showFlie && nextProps.taskSilderChange == "") {
    //     this.getFileList(nextProps.taskIDDD);
    //   }
    // }
  }
  // 展示对应的子任务/前序任务/成果文件组件
  showSlider = type => {
    const { showChild, showFlie, showCoop, taskInfo } = this.state;
    if (type == "child") {
      this.setState({ showChild: !showChild });
      if (!showChild) {
        // this.getChildTaskList(this.props.taskIDDD);
      }
    } else if (type == "coop") {
      if (
        getTeamInfoWithMoney("版本名称") === "专业版" ||
        getTeamInfoWithMoney("版本名称") === "试用版" ||
        getTeamInfoWithMoney("版本名称") === ""
      ) {
        this.setState({ showCoop: !showCoop });
      } else {
        this.setState({ versionAlert: true });
      }
    } else {
      this.setState({ showFlie: !showFlie });
      if (!showFlie) {
        // this.getFileList(this.props.taskIDDD);
      }
    }
  };
  render() {
    const {
      showChild,
      showFlie,
      showCoop,
      versionAlert,
      // childList,
      // coopList,
      // fileList,
      // childListLoading,
      // coopListLoading,
      // filesListLoading,
      taskId,
      projectId
    } = this.state;
    const {
      taskState,
      createPermission,
      taskInfo,
      childList,
      coopList,
      fileList,
      childListLoading,
      coopListLoading,
      filesListLoading
    } = this.props;

    return (
      <div className="slider">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="sliderBtn">
          <div
            className="childTask"
            onClick={() => {
              this.showSlider("child");
            }}
          >
            {showChild ? (
              <i
                className="iconfont icon-up"
                style={{ color: showChild ? "#1890ff" : "", fontSize: 12 }}
              />
            ) : (
                <i
                  className="iconfont icon-down"
                  style={{ color: showChild ? "#1890ff" : "", fontSize: 12 }}
                />
              )}
            <span style={{ color: showChild ? "#1890ff" : "" }}>
              子任务（{taskInfo.childSuccess && taskInfo.childSuccess}/
              {taskInfo.childCount && taskInfo.childCount}）
            </span>
          </div>
          <div className="borderDash" />
          <div
            className="coopTask"
            onClick={() => {
              this.showSlider("coop");
            }}
          >
            {getTeamInfoWithMoney("版本名称") === "专业版" ? (
              showCoop ? (
                <i
                  className="iconfont icon-up"
                  style={{ color: showCoop ? "#1890ff" : "", fontSize: 12 }}
                />
              ) : (
                  <i
                    className="iconfont icon-down"
                    style={{ color: showCoop ? "#1890ff" : "", fontSize: 12 }}
                  />
                )
            ) : (
                <svg className="check pro-icon zuanshi" aria-hidden="true">
                  <use xlinkHref={"#pro-myfg-zuanshi"} />
                </svg>
              )}

            <span style={{ color: showCoop ? "#1890ff" : "" }}>
              协作任务（{taskInfo.coopTaskCount && taskInfo.coopTaskCount}）
            </span>
          </div>
          <div className="borderDash" />
          <div
            className="fileTask"
            onClick={() => {
              this.showSlider("file");
            }}
          >
            {showFlie ? (
              //       <Icon type="down" style={{ color: showFlie ? "#1890ff" : "" }} />
              <i
                className="iconfont icon-up"
                style={{ color: showFlie ? "#1890ff" : "", fontSize: 12 }}
              />
            ) : (
                //       <Icon type="up"  />
                <i
                  className="iconfont icon-down"
                  style={{ color: showFlie ? "#1890ff" : "", fontSize: 12 }}
                />
              )}
            <span style={{ color: showFlie ? "#1890ff" : "" }}>
              成果文件（
              {fileList.frontFileList &&
                fileList.taskinfoFiles &&
                fileList.frontFileList.length + fileList.taskinfoFiles.length}
              ）
            </span>
          </div>
        </div>
        <div className="sliderCon">
          {showChild ? (
            <ChildList
              childList={childList}
              childListLoading={childListLoading}
              createPermission={taskInfo.createPermission}
              taskInfo={taskInfo}
              updataTaskChildList={taskId => {
                if (this.props.getListCallback) {
                  this.props.getListCallback(taskId);
                }
              }}
              updataTaskDetailByIdCallBack={(taskId, proId) => {
                if (this.props.getTaskDetailByIdCallBack) {
                  this.props.getTaskDetailByIdCallBack(taskId, proId);
                }
              }}
              moneyEnd={() => {
                if (this.props.moneyEnd) {
                  this.props.moneyEnd();
                }
              }}
            />
          ) : (
              ""
            )}

          {showCoop ? (
            <CoopList
              coopList={coopList}
              coopListLoading={coopListLoading}
              taskInfo={taskInfo}
              updataCoopList={taskId => {
                if (this.props.getListCallback) {
                  this.props.getListCallback(taskId);
                }
              }}
              updataTaskDetailByIdCallBack={(taskId, proId) => {
                if (this.props.getTaskDetailByIdCallBack) {
                  this.props.getTaskDetailByIdCallBack(taskId, proId);
                }
              }}
            />
          ) : (
              ""
            )}

          {showFlie ? (
            <FileList
              filesList={fileList}
              filesListLoading={filesListLoading}
              updataTaskDetailByIdCallBack={(taskId, proId) => {
                if (this.props.getTaskDetailByIdCallBack) {
                  this.props.getTaskDetailByIdCallBack(taskId, proId);
                }
              }}
              taskState={taskState}
              taskInfo={taskInfo}
              updataFileList={taskId => {
                this.props.getListCallback(taskId);
              }}
            />
          ) : (
              ""
            )}
          {versionAlert ? (
            <MoneyEnd
              alertText={getTeamInfoWithMoney("专业版提示")}
              closeCallBack={() => {
                this.setState({ versionAlert: false });
              }}
            />
          ) : (
              ""
            )}
        </div>
      </div>
    );
  }
}
