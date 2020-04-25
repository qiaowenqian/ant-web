import React from "react";
import { Icon, Tooltip, Modal, message, Popconfirm } from "antd";
import stylesheet from "styles/components/task/middleDetails/fileList.scss";
import dingJS from "../../../core/utils/dingJSApi";
import { createFileIcon } from "../../../core/utils/util";
import {
  deleteFileById,
  updateImgsInService,
  updateDingFileService
} from "../../../core/service/file.service";
import moment from "moment";
const confirm = Modal.confirm;

/**
 *  taskState: "1","2","3","4","5","6","7","8","9" 任务状态（不为1/8/9时可添加成果文件 按时完成  逾期完成 提前完成 ）
 *  modifyPermission:  是否有权限添加成果文件  true 有权限  false 没有权限
 *  isResponse: 是否是管理员 true 可添加 false 不可添加
 *
 *  filesList: {}  文件列表  filesList.taskinfoFiles 成果文件列表 filesList.frontFileList 前序成果问价列表
 *
 */

export default class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filesList: {
        taskinfoFiles: [], //成果文件
        frontFileList: [] //前序成果文件
      },
      taskInfo: {} //任务详情数据
    };
  }
  componentDidMount = () => {
    // const { filesList, taskInfo } = this.state;
    // if (this.props.filesList) {
    //   filesList.taskinfoFiles = this.props.filesList.taskinfoFiles;
    //   filesList.frontFileList = this.props.filesList.frontFileList;
    //   this.setState({
    //     filesList: filesList
    //   });
    // }
    // if (this.props.taskInfo) {
    //   this.setState({
    //     // taskInfo: taskInfo
    //   });
    // }
  };

  componentWillReceiveProps = nextProps => {
    // const { filesList } = this.state;
    // if (nextProps.filesList) {
    //   filesList.taskinfoFiles = nextProps.filesList.taskinfoFiles;
    //   filesList.frontFileList = nextProps.filesList.frontFileList;
    //   this.setState({ filesList: nextProps.filesList });
    // }
    // if (nextProps.taskInfo) {
    //   // this.setState({ taskInfo: nextProps.taskInfo });
    // }
  };
  //上传成果文件
  updateImg = () => {
    dingJS.uploadImage(res => {
      const data = res.data;
      const that = this;
      let { filesList, taskInfo } = this.props;
      // data.map((item, i) => {
      //   filesList.taskinfoFiles.push(item);
      // });
      // this.setState({ filesList: filesList });
      updateDingFileService(
        taskInfo.id,
        "3",
        data,
        resData => {
          if (resData.err) {
            return false;
          }
          that.props.updataFileList(taskInfo.id);
          that.props.updataTaskDetailByIdCallBack(
            taskInfo.id,
            taskInfo.project.id
          );
        },
        that.props.isSmall
      );
    }, true);
  };
  //删除成果文件
  deleteFile = id => {
    const { taskInfo } = this.props;

    const that = this;
    deleteFileById(
      id,
      data => {
        if (data.err) {
          return false;
        }
        message.success("删除成功！");
        that.props.updataFileList(taskInfo.id);
        that.props.updataTaskDetailByIdCallBack(
          taskInfo.id,
          taskInfo.project.id
        );
      },
      that.props.isSmall
    );
    // confirm({
    //   title: "您是否确认删除此文件？",
    //   okText: "确定",
    //   cancelText: "取消",
    //   onOk() {
    //     deleteFileById(
    //       id,
    //       data => {
    //         if (data.err) {
    //           return false;
    //         }
    //         message.success("删除成功！");
    //         that.props.updataFileList(taskInfo.id);
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
  render() {
    const { filesList, taskInfo } = this.props;
    return (
      <div className="fileList">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="list">
          <ul className="list animated slideInDown" key="swtich_zrw">
            <li className="listTop">
              <div className="titTxt">{"成果文件"}</div>
              {taskInfo &&
                taskInfo.state &&
                (taskInfo.state == "9" ||
                  taskInfo.state == "8" ||
                  taskInfo.state == "4" ||
                  taskInfo.state == "1") ? (
                  ""
                ) : (
                  <div className="circleColor">
                    {taskInfo.isResponse || taskInfo.modifyPermission ? (
                      <i
                        // type="plus-circle"
                        className="iconfont icon-add"
                        style={{ cursor: "pointer", color: "#bdbdbd", fontSize: 18 }}
                        onClick={() => {
                          this.updateImg("成果文件");
                        }}
                      />
                    ) : (
                        ""
                      )}
                  </div>
                )}
            </li>
            {filesList &&
              filesList.taskinfoFiles &&
              filesList.taskinfoFiles.map(item => {
                return (
                  <li
                    key={"taskfile" + item.id}
                    className="listContent"
                    onClick={() => {
                      dingJS.previewImage(item);
                    }}
                  >
                    <div className="fileIcon">
                      {createFileIcon(item.fileType)}
                    </div>
                    <div className="taskName">
                      <span>{item.fileName}</span>
                    </div>
                    <div className="taskPerson">
                      <Tooltip
                        placement="top"
                        title={item.createBy && item.createBy.name}
                      >
                        {item.createBy && item.createBy.name}
                      </Tooltip>
                    </div>
                    <div className="taskDate">
                      {moment(item.updateDate).format("YYYY/MM/DD")}
                    </div>
                    {taskInfo.state == "1" ||
                      taskInfo.state == "8" ||
                      taskInfo.state == "9" ? (
                        ""
                      ) : taskInfo.modifyPermission ? (
                        <Popconfirm
                          title={`是否要删除"${item.fileName}"`}
                          onConfirm={() => {
                            this.deleteFile(item.id);
                          }}
                          okText="删除"
                          cancelText="取消"
                        >
                          <div
                            className="delte"
                            onClick={e => {
                              e.stopPropagation();
                              // this.deleteFile(item.id);
                            }}
                          >
                            删除
                        </div>
                        </Popconfirm>
                      ) : (
                          ""
                        )}
                  </li>
                );
              })}
            <li className="listTop listBottom">
              <div className="titTxt">前序成果文件</div>
            </li>
            {filesList &&
              filesList.frontFileList &&
              filesList.frontFileList.map(item => {
                return (
                  <li
                    key={"frontfile" + item.id}
                    className="listContent"
                    onClick={() => {
                      dingJS.previewImage(item);
                    }}
                  >
                    <div className="fileIcon">
                      {createFileIcon(item.fileType)}
                    </div>
                    <div className="taskName">
                      <span className="nameWbs">{item.taskNum}</span>
                      <span>{" - " + item.fileName}</span>
                    </div>
                    <div className="taskPerson">
                      <Tooltip
                        placement="top"
                        title={item.createBy && item.createBy.name}
                      >
                        {item.createBy && item.createBy.name}
                      </Tooltip>
                    </div>
                    <div className="taskDate">
                      {moment(item.updateDate).format("YYYY/MM/DD")}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}
