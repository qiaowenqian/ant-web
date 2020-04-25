import React from "react";
import {
  Icon,
  Popover,
  Tooltip,
  Spin,
  message,
  Menu,
  Modal,
  Button,
  Upload,
  Checkbox,
  Steps
} from "antd";
import FreeLimitModal from "../../common/freeLimitModal";
import TaskCreate from "../../CreatTask";
import {
  urgeTaskByIdMore,
  getLimtTask
} from "../../../core/service/task.service";
import { listScroll, getTeamInfoWithMoney } from "../../../core/utils/util";
import {
  getImportLog,
  getExportMenuData
} from "../../../core/service/file.service";
import moment from "moment";
import { setColorState } from "../../../core/utils/util";
import stylesheet from "styles/components/task/middleDetails/childList.scss";
import { baseURI, visitUrl } from "../../../core/api/HttpClient";
import { updateImportExcelByProject } from "../../../core/service/project.service";
const downUrl = baseURI + "/CommonExcel/downLoadTaskTest?projectId=";
const upUrl =
  baseURI +
  "/CommonExcel/doImpExcel?configBeanName=antExcelDrExcelConfig&projectId=";
const Step = Steps.Step;
/**
 *
 *    chiildList:[] 子任务列表数据
 *    createPermission:  创建权限
 *    childListLoading: 列表加载状态
 *    taskState: "1","2","3","4","5","6","7","8","9" 任务状态（不为1/8/9时可添加成果文件 按时完成  逾期完成 提前完成 ）
 *    updataTaskDetailByIdCallBack() 根据子任务的id重新获取子任务的任务详情
 */

export default class ChildList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: false, //免费版限制
      childList: [],
      childCuibanTask: [], //可催办的子任务数组
      createChildTask: false, // 弹出创建子任务的弹窗
      limitVisible: false, // 弹出免费版限制弹框
      taskInfo: {}, // 任务详情数据
      freeUser: true, // 免费用户
      // ----------导出
      exportExcelShow: false,
      exportData: [],
      exportLoading: false,
      exportCountLoading: false,
      //----------导入
      importExcelShow: false,
      importExcelUpdating: false,
      importName: "",
      importUpLoading: false,
      importAlert: "导入到最上级任务中",
      importStep: 0,
      importErrNowPage: 1,
      importErrAllPage: 0,
      importErrLoading: false,
      importErrLog: [],
      importSuccess: 0,
      errorCount: 0,
      importErr: 0,
      joinProject: false
    };
  }
  componentWillMount = () => {
    if (getTeamInfoWithMoney("版本名称") === "免费版") {
      this.freeTaskLimit();
    }
  };
  componentDidMount = () => {
    if (this.props.childList) {
      this.setState({
        childList: JSON.parse(JSON.stringify(this.props.childList))
      });
    }
    if (this.props.taskInfo) {
      this.setState({
        taskInfo: JSON.parse(JSON.stringify(this.props.taskInfo))
      });
    }
    // console.log(this.props.taskInfo, "12this.props.taskInfo");
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.childList) {
      this.setState({ childList: nextProps.childList });
    }
    if (nextProps.taskInfo) {
      this.setState({ taskInfo: nextProps.taskInfo });
    }
  };
  //免费版用户创建任务限制
  freeTaskLimit = () => {
    getLimtTask(data => {
      if (data.err) {
        return false;
      }
      this.setState({
        freeUser: data.isCreate
      });
    });
  };
  updateImportExcel(importErr) {
    // if(importErr == 0){
    const { joinProject } = this.state;
    this.setState({ importExcelUpdating: true });
    const { taskInfo } = this.state;
    let taskDetailsId = taskInfo.id;
    let projectId = taskInfo.project.id;
    updateImportExcelByProject(projectId, taskDetailsId, joinProject, res => {
      if (res.err) {
        return false;
      }
      message.success("导入成功");
      this.setState({ importExcelShow: false, importExcelUpdating: false });
      this.props.updataTaskChildList(taskInfo.id);
      this.props.updataTaskDetailByIdCallBack(taskInfo.id, taskInfo.project.id);
    });
    // }else{
    //     message.error('导入模板中包含错误内容，请修改后导入');
    // }
  }
  //导入子任务
  importExcel() {
    const {
      importExcelShow,
      importName,
      selectedTaskName,
      importExcelUpdating,
      importUpLoading,
      importStep,
      importErrLog,
      importSuccess,
      importErr,
      errorCount,
      importErrLoading,
      importErrAllPage,
      importErrNowPage,
      joinProject,
      taskInfo
    } = this.state;
    const that = this;
    let taskDetailsId = taskInfo.id;
    let projectId = taskInfo.project.id;
    let url = upUrl + projectId;
    let { importAlert } = this.state;
    if (importName === "导入子任务") {
      url = upUrl + projectId + "&taskinfoId=" + taskDetailsId;
      importAlert = "导入到“" + selectedTaskName + "”任务中";
    } else {
      importAlert = "导入到最上级任务中";
    }
    const props = {
      action: url,
      showUploadList: false,
      onChange(info) {
        if (info.file.status === "uploading" && importExcelShow) {
          that.setState({ importUpLoading: true });
        }
        if (info.file.status === "done" && importExcelShow) {
          if (info.file.response && info.file.response.success) {
            that.setState({ importUpLoading: false, importStep: 1 });
            that.getImportErrLog(projectId, 1);
          } else {
            message.info(info.file.response.errmsg);
            that.setState({ importUpLoading: false });
          }
        } else if (info.file.status === "error" && importExcelShow) {
          message.error(`${info.file.name} 文件导入失败`);
          that.setState({
            importUpLoading: false,
            importAlert: "文件导入失败"
          });
        }
      }
    };
    return (
      <Modal
        title={importName}
        visible={importExcelShow}
        width={800}
        onCancel={() => {
          this.setState({ importExcelShow: false });
        }}
        footer={[
          <Button
            key="quxiao"
            onClick={() => {
              this.setState({ importExcelShow: false, importUpLoading: false });
            }}
          >
            取消
          </Button>,
          importStep === 1 && (
            <Button
              key="back"
              onClick={() => {
                this.setState({ importStep: 0 });
              }}
            >
              上一步
            </Button>
          ),
          importStep === 1 && (
            <Button
              key="submit"
              type={errorCount != importErr ? "" : "primary"}
              disabled={importExcelUpdating || errorCount != importErr}
              onClick={() => {
                this.updateImportExcel(importErr);
              }}
            >
              {importExcelUpdating ? <Icon type="loading" /> : ""}提交
            </Button>
          )
        ]}
      >
        <Steps current={importStep}>
          <Step title="上传数据" />
          <Step title="验证数据并完成" />
        </Steps>
        {importStep === 0 ? (
          <div className="importStyle">
            <div className="p">{importAlert}</div>
            <Upload {...props}>
              <Button type="primary">
                {importUpLoading ? (
                  <Icon type="loading" />
                ) : (
                  <Icon type="upload" />
                )}{" "}
                {importUpLoading ? "正在上传" : "上传表格"}
              </Button>
            </Upload>
          </div>
        ) : (
          <div className="importStyle">
            <p>
              任务数据校验正确：<span>{importSuccess}</span>格式错误：
              <span>{importErr}</span>，其中可忽略错误：
              <span>{errorCount}</span>{" "}
              {errorCount == importErr
                ? "继续提交将忽略部分错误数据"
                : "请根据错误提示修改后重新导入"}
            </p>
            <div className="rowBox head">
              <div className="one">任务名称</div>
              <div className="two">所在行</div>
              <div className="three">数据校验</div>
              <div className="four">错误原因</div>
            </div>
            <div
              className="listBox"
              onScroll={e => {
                this.importExcelErrLogScroll(e);
              }}
            >
              {importErrLog && importErrLog.length > 0
                ? importErrLog.map(item => {
                    return (
                      <div className="rowBox" key={item.id}>
                        <div className="one">{item.taskname}</div>
                        <div className="two">{item.indexNumber}</div>
                        <div className="three">
                          {item.whether === "0" ? (
                            <Icon type="check" style={{ color: "#3a9d09" }} />
                          ) : (
                            <Icon type="close" style={{ color: "#e10215" }} />
                          )}
                        </div>
                        <div className="four">{item.errlog}</div>
                      </div>
                    );
                  })
                : ""}
              {!importErrLoading && importErrNowPage < importErrAllPage ? (
                <div className="moreLoadingRow">下拉加载更多</div>
              ) : (
                ""
              )}
              {!importErrLoading &&
              (importErrNowPage > importErrAllPage ||
                importErrNowPage === importErrAllPage) ? (
                <div className="moreLoadingRow">
                  可导入{importSuccess}个任务
                </div>
              ) : (
                ""
              )}
              {importErrLoading ? (
                <div className="moreLoadingRow">
                  <Icon type="loading" className="loadingIcon" />
                  正在加载更多
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
        {importStep !== 0 && taskInfo.isManager ? (
          <div className="gzrChecbox">
            <Checkbox
              checked={joinProject}
              onChange={() => {
                this.setState({ joinProject: !joinProject });
              }}
            >
              关注人加入项目成员
            </Checkbox>
          </div>
        ) : (
          ""
        )}
        {importStep === 0 && (
          <a
            href={visitUrl + "/exceltemplate/template.xlsx"}
            download
            target="_blank"
            className="importBut"
          >
            <i className="icon iconfont icon-microsoftexcel" />
            下载模板.xlsx
          </a>
        )}
      </Modal>
    );
  }
  importExcelErrLogScroll(e) {
    const { importErrNowPage, importErrAllPage, taskInfo } = this.state;
    let projectId = taskInfo.project.id;
    const isOnBottom = listScroll(e);
    if (isOnBottom && importErrNowPage < importErrAllPage) {
      this.getImportErrLog(projectId, importErrNowPage + 1);
    }
  }
  getImportErrLog(projectId, pageNo) {
    if (pageNo > 1) {
      this.setState({ importErrLoading: true });
    }
    getImportLog(projectId, pageNo, res => {
      if (res.err) {
        this.setState({ importUpLoading: false });
        return false;
      }
      if (res.pageNo === 1) {
        this.setState({
          importErrLog: res.list,
          importSuccess: res.successCount,
          importErr: res.failCount,
          errorCount: res.errorCount
        });
      } else {
        let list = JSON.parse(JSON.stringify(this.state.importErrLog));
        if (res && res.list && res.list.length > 0) {
          res.list.map(item => {
            list.push(item);
          });
        }
        this.setState({ importErrLog: list });
      }
      this.setState({
        importErrLoading: false,
        importErrNowPage: res.pageNo,
        importErrAllPage: res.last
      });
    });
  }
  // 催办子任务
  urgeChildTask = arrId => {
    const { taskInfo } = this.state;
    console.log(taskInfo.id);

    urgeTaskByIdMore(
      "",
      arrId,
      taskInfo.id,
      1,
      data => {
        if (data.err) {
          return false;
        }
        message.success("催办成功");
      },
      false
    );
  };
  exportClick(domId) {
    this.setState({ exportLoading: true });
    setTimeout(() => {
      this.setState({ exportLoading: false });
    }, 8000);
    document.getElementById(domId).click();
  }
  exportExcel() {
    let {
      exportData,
      exportExcelShow,
      exportLoading,
      taskInfo,
      exportCountLoading
    } = this.state;
    let taskDetailsId = taskInfo.id;
    let projectId = taskInfo.project.id;
    return (
      <Modal
        title="导出任务"
        visible={exportExcelShow}
        width={800}
        onCancel={() => {
          this.setState({ exportExcelShow: false });
        }}
        footer={[]}
      >
        <Spin spinning={exportLoading} size="large">
          <div className="importStyle">
            <div className="rowBox head">
              <div className="one">任务序号</div>
              <div className="two">数量</div>
              <div className="three">操作</div>
            </div>
            <div className="listBox">
              {exportCountLoading ? <Spin /> : ""}
              {exportData && exportData.length > 0
                ? exportData.map((item, i) => {
                    return (
                      <div className="rowBox" key={"exportData" + i}>
                        <div className="one">
                          {item.startTask.fullRank +
                            "---------" +
                            item.endTask.fullRank}
                        </div>
                        <div className="two">{item.moreSize}</div>
                        <div className="three">
                          <Button
                            type="primary"
                            onClick={() => {
                              this.exportClick("exportTask" + i);
                            }}
                          >
                            导出任务
                          </Button>
                        </div>
                        <a
                          href={
                            downUrl +
                            projectId +
                            "&parentId=" +
                            taskDetailsId +
                            "&start=" +
                            item.startCount
                          }
                          download
                          target="_blank"
                          id={"exportTask" + i}
                        />
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
  getExportData() {
    let { taskInfo } = this.state;
    let taskDetailsId = taskInfo.id;
    let projectId = taskInfo.project.id;
    this.setState({
      exportExcelShow: true,
      exportData: [],
      exportCountLoading: true
    });
    getExportMenuData(projectId, taskDetailsId, data => {
      if (data.exportCount == 0) {
        message.info("该项目没有要导出的任务！");
      } else {
        let exportData = data.exportData;
        this.setState({ exportData: exportData });
      }
      this.setState({ exportCountLoading: false });
    });
  }
  render() {
    const {
      childList,
      createChildTask,
      freeUser,
      taskInfo,
      limitVisible,

      exportExcelShow,
      importExcelShow
    } = this.state;
    const { childListLoading } = this.props;
    let arrTask = [];
    if (childList && childList.length > 0) {
      childList.map(item => {
        if (item.state == "0" || item.state == "2") {
          arrTask.push(item.id);
        }
      });
    }
    return (
      <div className="childList">
        {importExcelShow ? this.importExcel() : ""}
        {exportExcelShow ? this.exportExcel() : ""}
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="list">
          <ul className="list animated slideInDown" key="swtich_zrw">
            <Spin spinning={childListLoading} />
            <li className="listTop">
              <div className="titTxt">{"子任务"}</div>
              {taskInfo.state !== "4" &&
              taskInfo.state !== "9" &&
              taskInfo.state !== "8" &&
              taskInfo.state !== "1" ? (
                taskInfo.createPermission ? (
                  <i
                    // type="plus-circle"
                    className="iconfont icon-add"
                    style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    onClick={() => {
                      if (freeUser) {
                        this.setState({ createChildTask: true });
                      } else {
                        this.setState({ limitVisible: true });
                      }
                    }}
                  />
                ) : (
                  <Tooltip
                    placement="top"
                    title={`您在该项⽬中没有创建任务的权限`}
                    overlayClassName="createOverlayClass"
                    trigger="hover"
                  >
                    <i
                      className="iconfont icon-add"
                      style={{ color: "#bdbdbd", fontSize: 18, marginLeft: 10 }}
                    />
                  </Tooltip>
                )
              ) : (
                ""
              )}
              <Popover
                placement="left"
                title={null}
                overlayClassName="popverStyle"
                trigger="click"
                content={
                  <Menu>
                    {childList.length > 0 && arrTask.length > 0 ? (
                      <Menu.Item
                        onClick={() => {
                          this.urgeChildTask(arrTask);
                        }}
                        className="more"
                      >
                        全部催办
                      </Menu.Item>
                    ) : (
                      <Menu.Item className="mores">全部催办</Menu.Item>
                    )}
                    {getTeamInfoWithMoney("是否可用") ? (
                      taskInfo.state !== "4" &&
                      taskInfo.state !== "9" &&
                      taskInfo.state !== "8" &&
                      taskInfo.state !== "1" ? (
                        taskInfo.createPermission ? (
                          <Menu.Item
                            icon={
                              getTeamInfoWithMoney("版本名称") === "专业版"
                                ? "login"
                                : ""
                            }
                            className="more"
                            onClick={() => {
                              this.setState({
                                importExcelShow: true,
                                importStep: 0,
                                importName: "导入子任务",
                                selectedTaskName: taskInfo.name
                              });
                            }}
                          >
                            {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                              <svg
                                className="pro-icon zuanshi"
                                aria-hidden="true"
                              >
                                <use xlinkHref={"#pro-myfg-zuanshi"} />
                              </svg>
                            ) : (
                              ""
                            )}
                            导入子任务
                          </Menu.Item>
                        ) : (
                          <Menu.Item
                            icon={
                              getTeamInfoWithMoney("版本名称") === "专业版"
                                ? "login"
                                : ""
                            }
                            className="more noquanxian"
                          >
                            {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                              <svg
                                className="pro-icon zuanshi"
                                aria-hidden="true"
                              >
                                <use xlinkHref={"#pro-myfg-zuanshi"} />
                              </svg>
                            ) : (
                              ""
                            )}
                            导入子任务
                          </Menu.Item>
                        )
                      ) : (
                        <Menu.Item className="mores">
                          {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                            <svg
                              className="pro-icon zuanshi"
                              aria-hidden="true"
                            >
                              <use xlinkHref={"#pro-myfg-zuanshi"} />
                            </svg>
                          ) : (
                            ""
                          )}
                          导入子任务
                        </Menu.Item>
                      )
                    ) : (
                      <Menu.Item
                        className="more"
                        onClick={() => {
                          if (this.props.moneyEnd) {
                            this.props.moneyEnd();
                          }
                        }}
                      >
                        <svg className="pro-icon zuanshi" aria-hidden="true">
                          <use xlinkHref={"#pro-myfg-zuanshi"} />
                        </svg>
                        导入子任务
                      </Menu.Item>
                    )}
                  </Menu>
                }
              >
                <i className="iconfont icon-more"> </i>
              </Popover>
            </li>
            {childList &&
              childList.map(item => {
                return (
                  <li
                    key={"zrw" + item.id}
                    className="listContent"
                    onClick={() => {
                      if (this.props.updataTaskDetailByIdCallBack) {
                        this.props.updataTaskChildList(item.id);
                        this.props.updataTaskDetailByIdCallBack(
                          item.id,
                          taskInfo.project.id
                        );
                      }
                    }}
                  >
                    <div
                      className="triangle_border"
                      style={setColorState(item.state)}
                    />
                    <div className="taskName">
                      <span>{item.taskname}</span>
                    </div>
                    {/* {stateColor(item.stateName, "type")} */}
                    <div className="taskPerson">
                      {item.userResponse ? (
                        <Tooltip
                          placement="top"
                          title={item.userResponse && item.userResponse.name}
                        >
                          {item.userResponse && item.userResponse.name}
                        </Tooltip>
                      ) : (
                        "未指派"
                      )}
                    </div>
                    <div className="taskDate">
                      {item.planEndTime
                        ? item.state != "1"
                          ? moment(item.planEndTime).format("YYYY/MM/DD")
                          : moment(item.realityEndTime).format("YYYY/MM/DD")
                        : ""}
                    </div>
                    <div className="taskUrge">
                      {item.state == "0" || item.state == "2" ? (
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            this.urgeChildTask([item.id]);
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
          </ul>
        </div>
        {limitVisible ? (
          <FreeLimitModal
            closeFreeModalCallBack={() => {
              this.setState({ limitVisible: false });
            }}
          />
        ) : (
          ""
        )}
        {createChildTask ? (
          <TaskCreate
            task={{
              id: taskInfo && taskInfo.id,
              projectId: taskInfo.project && taskInfo.project.id
            }}
            successCallBack={() => {
              this.setState({ createChildTask: false });
              if (this.props.updataTaskChildList) {
                this.props.updataTaskChildList(taskInfo.id);
                this.props.updataTaskDetailByIdCallBack(
                  taskInfo.id,
                  taskInfo.project.id
                );
              }
            }}
            closedCallBack={() => {
              this.setState({ createChildTask: false });
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
