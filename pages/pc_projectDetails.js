import React from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import {
  Layout,
  Button,
  Spin,
  Icon,
  Modal,
  Steps,
  Upload,
  message,
  Select,
  Checkbox,
  Tooltip,
  Tabs,
  Input
} from "antd";
import Router from "next/router";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import ContentLeftList from "../components/common/contentLeftList"; //左侧列表
import { initStore } from "../store";
import stylesheet from "styles/views/projectDetails.scss";
import Head from "../components/header";
import TaskTree from "../components/taskTree";
import {
  getProjectTaskListById,
  downLoadTaskTest,
  updateImportExcelByProject
} from "../core/service/project.service";
import { getLimtTask } from "../core/service/task.service"; // 免费版 获取任务限制
import TaskDetails from "../components/task/TaskLayout";
import MoreTaskEdit from "../components/moreTaskEdit";
import ProjectChart from "../components/projectChart";
import ProjectFiles from "../components/projectFiles";
import {
  listScroll,
  getTeamInfoWithMoney,
  isIosSystem
} from "../core/utils/util";
import * as projectAction from "../core/actions/project";
import ProjectPlusGantt from "../components/ProjectPlusGantt";
import ProjectCreate from "../components/project/projectSetting";
import dingJS from "../core/utils/dingJSApi";
import { baseURI, visitUrl } from "../core/api/HttpClient";
import MoneyEnd from "../components/moneyEnd";
import { getImportLog, getExportMenuData } from "../core/service/file.service";
import TaskCreate from "../components/CreatTask";
import AsynExportTask from "../components/AsynExportTask";
import Storage from "../core/utils/storage";

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const Step = Steps.Step;

const upUrl =
  baseURI +
  "/CommonExcel/doImpExcel?configBeanName=antExcelDrExcelConfig&projectId=";

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPage: "a",
      projectId: "",
      hideOkTask: false,

      treeList: [],
      treeListNowPage: 1,
      treeListAllPage: 0,
      treeListLoading: false,
      treeListMoreLoading: false,
      notCheckIds: [],

      taskDetailsId: "",
      selectedTaskName: "",
      taskDetailsProId: "",
      taskDetailsParentId: "",
      taskDetailsState: "",
      taskDetailsShow: false,
      animateClass: "",

      moreEdit: false,
      checkedIds: [],

      searchProType: "1",
      projectList: [],
      projectName: "",
      jurisdiction: "",
      projectTaskCount: 0,
      projectListLoading: false,
      projectListMoreLoading: false,
      projectListNowPage: 1,
      projectListAllPage: 0,

      projectSearchDivOnTop: false,

      ProjectCreateShow: "",

      moneyEnd: false,
      joinProject: false,
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

      exportExcelShow: false,
      exportData: [],
      exportLoading: false,
      exportCountLoading: false,

      taskCreateShow: false,
      taskCreateProject: {},
      projectMax: 0,
      available: true,
      availablePro: "",
      taskMax: 0,
      visible: false,
      versionShow: false,
      projecModel: "",
      //       modifyPermission: false,
      createPermission: true, //是否拥有创建权限
      moveSort: true, // 是否展示移动Icon
      createChildTaskLists: false,
      isLast: "0", //   是否是最后一页
      searchContent: "", //搜索文件内容
      focus: false,
      showSearch: "",
      searchTaskText: "",
      reduxProject: {},
      taskOrProject: true,
      isIos: true,
      closeed: true
    };
  }

  componentWillMount() {
    if (this.props.url.query.taskId) {
      this.setState({
        taskDetailsId: this.props.url.query.taskId,
        taskDetailsShow: true
      });
    }
    if (this.props.url.query.id) {
      const projectId = this.props.url.query.id;
      this.setState({ projectId: projectId, taskDetailsProId: projectId });
    }
    if (this.props.projectSearchVal.type) {
      this.setState({ searchProType: this.props.projectSearchVal.type });
    }
  }

  componentDidMount() {
    if (Storage.get("user")) {
      this.animateAdd();
      dingJS.authDingJsApi();
      if (getTeamInfoWithMoney("版本名称") === "免费版") {
        this.getLimtProject();
      }
      const { projectId } = this.state;
      const hideOkTaskLocation = Storage.getLocal("hideOkTask");
      this.setState({ isIos: isIosSystem() });
      if (window.localStorage && window.localStorage.hideOkTask) {
        this.setState(
          {
            hideOkTask: hideOkTaskLocation ? hideOkTaskLocation : false
          },
          () => {
            this.getProTaskList(1, projectId);
          }
        );
      } else {
        this.getProTaskList(1, projectId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url.query.taskId) {
      this.setState({
        taskDetailsId: nextProps.url.query.taskId,
        taskDetailsShow: true
      });
      this.animateAdd();
    }

    if (nextProps.url.query.id) {
      const projectId = nextProps.url.query.id;
      this.setState({ projectId: projectId, taskDetailsProId: projectId });
      this.getProTaskList(1, projectId);
    }
    if (nextProps.projectSearchVal.type) {
      this.setState({ searchProType: nextProps.projectSearchVal.type });
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  //获取限制
  getLimtProject() {
    getLimtTask(data => {
      if (data.err) {
        return false;
      }
      this.setState({
        taskMax: data.projectMax,
        available: data.success
      });
    });
  }
  //根据排序方式和分组去获取项目列表

  //免费版任务限制
  freeTaskLimit(projecModel) {
    const { available } = this.state;
    if (getTeamInfoWithMoney("版本名称") === "免费版") {
      this.getLimtProject();
      if (!available) {
        this.setState({ visible: true });
        if (projecModel === "创建项目") {
          this.setState({ projecModel: "创建项目" });
        }
        if (projecModel === "创建任务") {
          this.setState({ projecModel: "创建任务" });
        }
      }
    }
  }
  getProTaskList(pageNo, projectId, hideOkTask = "", search) {
    if (!pageNo) {
      pageNo = 1;
    }
    if (!projectId) {
      projectId = this.state.projectId;
    }
    if (hideOkTask === "" || hideOkTask === undefined) {
      hideOkTask = this.state.hideOkTask;
    }
    if (pageNo === 1) {
      this.setState({ treeListLoading: true });
    } else {
      this.setState({ treeListMoreLoading: true });
    }
    getProjectTaskListById(
      projectId,
      "",
      "",
      pageNo,
      data => {
        if (!data) {
          return false;
        }
        if (data.err) {
          return false;
        }
        let { treeList, notCheckIds } = this.state;
        if (pageNo === 1) {
          treeList = [];
          notCheckIds = [];
        }
        if (
          data.taskPage &&
          data.taskPage.list &&
          data.taskPage.list.length > 0
        ) {
          data.taskPage.list.map((item, i) => {
            treeList.push({
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
                : "",
              childCount: item.taskinfo.child,
              childIngCount: item.taskinfo.childCount,
              childSuccess: item.taskinfo.childSuccess,
              talkCount: item.taskinfo.leaveCount,
              loading: false,
              labels: item.labels
            });
            if (
              item.taskinfo.state === "1" ||
              item.taskinfo.state === "4" ||
              item.taskinfo.state === "2"
            ) {
              notCheckIds.push(item.taskinfo.id);
            }
          });
        }
        if (data.count && data.count.project) {
          this.setState({
            projectName: data.count.project.proname,
            projectTaskCount: data.count.count ? data.count.count : 0,
            jurisdiction: data.count.project.jurisdiction
          });
        }
        this.setState({
          createPermission: data.createPermission,
          //   modifyPermission: data.modifyPermission,
          moveSort: true,
          treeList: treeList,
          notCheckIds: notCheckIds,
          treeListNowPage: data.taskPage ? data.taskPage.pageNo : 1,
          treeListAllPage: data.taskPage ? data.taskPage.last : 1,
          isLast: data.taskPage ? data.taskPage.isLast : "1"
        });
        this.setState({ treeListMoreLoading: false, treeListLoading: false });
      },
      hideOkTask,
      search
    );
  }
  createChildTask(pro, task) {
    let { treeList } = this.state;
    const loop = list => {
      list.forEach((item, i) => {
        /* 处理删除，删除非一级的时候 根据父ID，重新刷父ID的任务列表 */
        if (task && item.taskId === pro) {
          getProjectTaskListById(task, pro, "", 1, data => {
            console.log(data, "返回对应的子任务");
            if (data.err) {
              return false;
            }
            const childList = [];
            if (data.taskPage.list) {
              data.taskPage.list.map((ite, i) => {
                childList.push({
                  rankMove: ite.taskinfo.rank,
                  projectId: ite.project.id,
                  parentId: ite.taskinfo.parent.id,
                  taskId: ite.taskinfo.id,
                  name: ite.taskinfo.taskname,
                  state: ite.taskinfo.stateName,
                  number:
                    (ite.taskinfo.taskinfoNumber
                      ? ite.taskinfo.taskinfoNumber.numberS + "."
                      : "") + ite.taskinfo.rank,
                  tags: [],
                  attention: ite.taskinfo.collect ? true : false,
                  milestone: ite.taskinfo.milestone === "1" ? "1" : "0",
                  fzr: ite.taskinfo.userResponse
                    ? ite.taskinfo.userResponse.name
                    : "未指派",
                  qrr: ite.taskinfo.userFlow
                    ? ite.taskinfo.userFlow.name
                    : "未指派",
                  endDate: ite.taskinfo.planEndTime
                    ? ite.taskinfo.planEndTime
                    : "未设置",
                  endDate_real: ite.taskinfo.realityEndTime
                    ? ite.taskinfo.realityEndTime
                    : "未设置",
                  childCount: ite.taskinfo.child,
                  childIngCount: ite.taskinfo.childCount,
                  childSuccess: ite.taskinfo.childSuccess,
                  talkCount: ite.taskinfo.leaveCount,
                  openChild: false,
                  loading: false,
                  labels: ite.labels
                });
              });
            }
            list[i].childList = childList;
            list[i].childCount = list[i].childCount + 1;
            if (
              task.state === "1" ||
              task.state === "8" ||
              task.state === "9"
            ) {
              list[i].childSuccess = list[i].childSuccess + 1;
            }
            this.setState({ treeList: treeList });
          });
          return false;
        }

        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }

        if (task.id && item.taskId === task.id) {
          if (task.name && item.name !== task.name) {
            const taskSet = { id: task.id, name: task.name };
            this.setDataByArgs(treeList, taskSet, ["name"]);
          }
          if (task.state && item.state !== task.state) {
            const taskSet = { id: task.id, state: task.state };
            this.setDataByArgs(treeList, taskSet, ["state"]);
          }
          if (
            task.planEndTime !== undefined &&
            item.endDate !== task.planEndTime
          ) {
            const taskSet = { id: task.id, endDate: task.planEndTime };
            this.setDataByArgs(treeList, taskSet, ["endDate"]);
          }
          if (
            task.realityEndTime !== undefined &&
            item.endDate !== task.realityEndTime
          ) {
            const taskSet = { id: task.id, endDate_real: task.realityEndTime };
            this.setDataByArgs(treeList, taskSet, ["endDate_real"]);
          }
          if (task.attention === true || task.attention === false) {
            const taskSet = { id: task.id, attention: task.attention };
            this.setDataByArgs(treeList, taskSet, ["attention"]);
          }
          if (task.milestone === "1" || task.milestone === "0") {
            const taskSet = { id: task.id, milestone: task.milestone };
            this.setDataByArgs(treeList, taskSet, ["milestone"]);
          }
          if (task.fzr) {
            const taskSet = { id: task.id, fzr: task.fzr };
            this.setDataByArgs(treeList, taskSet, ["fzr"]);
          } else if (task.fzr === "") {
            const taskSet = { id: task.id, fzr: "" };
            this.setDataByArgs(treeList, taskSet, ["fzr"]);
          }
          if (
            task.childSuccess > 0 ||
            task.childSuccess == 0 ||
            task.childCount > 0 ||
            task.childCount == 0
          ) {
            const taskSet = {
              id: task.id,
              childSuccess: task.childSuccess,
              childCount: task.childCount
            };
            this.setDataByArgs(treeList, taskSet, [
              "childSuccess",
              "childCount"
            ]);
          }
          if (task.talkCount > 0 || task.talkCount === 0) {
            const taskSet = { id: task.id, talkCount: task.talkCount };
            this.setDataByArgs(treeList, taskSet, ["talkCount"]);
          }
          if (task.tags) {
            const taskSet = { id: task.id, labels: [] };
            task.tags.map(lab => {
              taskSet.labels.push({
                id: lab.id,
                labelname: lab.name,
                type: "1",
                color: lab.color
              });
            });
            this.setDataByArgs(treeList, taskSet, ["labels"]);
          }
          return false;
        }
      });
    };
    loop(treeList);
  }
  treeBoxScroll(e) {
    const { treeListNowPage, treeListAllPage, isLast } = this.state;
    const isOnBottom = listScroll(e);
    this.setState({ moveSort: this.state.moveSort });
    if (isOnBottom && isLast === "0") {
      this.getProTaskList(treeListNowPage + 1);
    }
  }

  projectOnClick(id) {
    this.cancelMoreEdit();
    this.setState({ taskDetailsShow: false, taskDetailsId: "" });
    Router.push("/pc_projectDetails?id=" + id);
  }

  switchPage(name) {
    this.setState({ moveSort: true });
    if (name === "a") {
      this.setState({ switchPage: name });
    } else {
      if (!getTeamInfoWithMoney("是否可用")) {
        this.setState({ moneyEnd: true });
      } else {
        this.setState({ switchPage: name });
      }
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

  importExcelErrLogScroll(e) {
    const { importErrNowPage, importErrAllPage, projectId } = this.state;
    const isOnBottom = listScroll(e);
    if (isOnBottom && importErrNowPage < importErrAllPage) {
      this.getImportErrLog(projectId, importErrNowPage + 1);
    }
  }

  updateImportExcel(importErr) {
    const { joinProject } = this.state;
    this.setState({ importExcelUpdating: true });
    const { projectId, taskDetailsId } = this.state;

    updateImportExcelByProject(projectId, taskDetailsId, joinProject, res => {
      if (res.err) {
        return false;
      }
      message.success("导入成功");
      this.setState({ importExcelShow: false, importExcelUpdating: false });
      this.getProTaskList(1, projectId);
    });
  }

  importExcel() {
    const {
      importExcelShow,
      importName,
      projectId,
      taskDetailsId,
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
      projectTaskCount,
      isIos,
      joinProject,
      jurisdiction
    } = this.state;
    const that = this;
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
        {importStep !== 0 && jurisdiction == "true" ? (
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

  treeListOnChange(newTreeList) {
    let notCheckIds = [];
    const loop = list => {
      list.forEach((item, i) => {
        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }
        if (
          item.state === "1" ||
          item.state === "4" ||
          item.state === "2" ||
          item.state === "9" ||
          item.state === "8"
        ) {
          notCheckIds.push(item.taskId);
        }
      });
    };
    loop(newTreeList);
    this.setState({ notCheckIds: notCheckIds });
  }

  setDataByArgs(treeList, task, args) {
    const loop = list => {
      list.forEach((item, i) => {
        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }
        if (item.taskId == task.id) {
          if (args && args.length > 0) {
            args.map(argName => {
              item[argName] = task[argName];
            });
          }
          return false;
        }
      });
    };
    loop(treeList);
    this.setState({ treeList: treeList });
  }

  taskMove(moveObj) {
    let { treeList, projectId, hideOkTask } = this.state;
    let nowTask = {};
    const loop = (list, loopType) => {
      list.forEach((item, i) => {
        if (item.childList && item.childList.length > 0) {
          loop(item.childList, loopType);
        }
        if (
          loopType === "moveToPid" &&
          (item.taskId === moveObj.moveToParentId ||
            item.taskId === moveObj.copyToParentId)
        ) {
          // 到达的父任务
          if (
            nowTask.state === "1" ||
            nowTask.state === "8" ||
            nowTask.state === "9"
          ) {
            item.childSuccess = item.childSuccess + 1;
          }
          let childrenList = [];
          getProjectTaskListById(
            projectId,
            item.taskId,
            "",
            1,
            data => {
              if (data.err) {
                return false;
              }
              if (data.taskPage.list) {
                data.taskPage.list.map((ite, i) => {
                  childrenList.push({
                    rankMove: ite.taskinfo.rank,
                    projectId: ite.project.id,
                    parentId: ite.taskinfo.parent.id,
                    taskId: ite.taskinfo.id,
                    name: ite.taskinfo.taskname,
                    state: ite.taskinfo.stateName,
                    number:
                      (ite.taskinfo.taskinfoNumber
                        ? ite.taskinfo.taskinfoNumber.numberS + "."
                        : "") + ite.taskinfo.rank,
                    tags: [],
                    attention: ite.taskinfo.collect ? true : false,
                    milestone: ite.taskinfo.milestone === "1" ? "1" : "0",
                    fzr: ite.taskinfo.userResponse
                      ? ite.taskinfo.userResponse.name
                      : "未指派",
                    qrr: ite.taskinfo.userFlow
                      ? ite.taskinfo.userFlow.name
                      : "未指派",
                    endDate: ite.taskinfo.planEndTime
                      ? ite.taskinfo.planEndTime
                      : "未设置",
                    endDate_real: ite.taskinfo.realityEndTime
                      ? ite.taskinfo.realityEndTime
                      : "未设置",
                    childCount: ite.taskinfo.child,
                    childIngCount: ite.taskinfo.childCount,
                    childSuccess: ite.taskinfo.childSuccess,
                    talkCount: ite.taskinfo.leaveCount,
                    openChild: false,
                    loading: false,
                    labels: ite.labels
                  });
                });
                const taskSet = {
                  id: item.taskId,
                  childCount: item.childCount + 1,
                  childSuccess: item.childSuccess,
                  childList: childrenList
                };
                this.setDataByArgs(treeList, taskSet, [
                  "childCount",
                  "childSuccess",
                  "childList"
                ]);
              }
            },
            hideOkTask
          );
          return false;
        }
        if (loopType === "moveNowPid" && item.taskId === nowTask.parentId) {
          // 离开的父任务

          if (
            nowTask.state === "1" ||
            nowTask.state === "8" ||
            nowTask.state === "9"
          ) {
            item.childSuccess = item.childSuccess - 1;
          }
          let childrenList = [];
          getProjectTaskListById(
            projectId,
            item.taskId,
            "",
            1,
            data => {
              if (data.err) {
                return false;
              }
              if (data.taskPage.list) {
                data.taskPage.list.map((ite, i) => {
                  childrenList.push({
                    rankMove: ite.taskinfo.rank,
                    projectId: ite.project.id,
                    parentId: ite.taskinfo.parent.id,
                    taskId: ite.taskinfo.id,
                    name: ite.taskinfo.taskname,
                    state: ite.taskinfo.stateName,
                    number:
                      (ite.taskinfo.taskinfoNumber
                        ? ite.taskinfo.taskinfoNumber.numberS + "."
                        : "") + ite.taskinfo.rank,
                    tags: [],
                    attention: ite.taskinfo.collect ? true : false,
                    milestone: ite.taskinfo.milestone === "1" ? "1" : "0",
                    fzr: ite.taskinfo.userResponse
                      ? ite.taskinfo.userResponse.name
                      : "未指派",
                    qrr: ite.taskinfo.userFlow
                      ? ite.taskinfo.userFlow.name
                      : "未指派",
                    endDate: ite.taskinfo.planEndTime
                      ? ite.taskinfo.planEndTime
                      : "未设置",
                    endDate_real: ite.taskinfo.realityEndTime
                      ? ite.taskinfo.realityEndTime
                      : "未设置",
                    childCount: ite.taskinfo.child,
                    childIngCount: ite.taskinfo.childCount,
                    childSuccess: ite.taskinfo.childSuccess,
                    talkCount: ite.taskinfo.leaveCount,
                    openChild: false,
                    loading: false,
                    labels: ite.labels
                  });
                });
              }
              const taskSet = {
                id: item.taskId,
                childCount: item.childCount - 1,
                childSuccess: item.childSuccess,
                childList: childrenList
              };
              this.setDataByArgs(treeList, taskSet, [
                "childCount",
                "childSuccess",
                "childList"
              ]);
            },
            hideOkTask
          );
          return false;
        }
        if (
          loopType === "task" &&
          (item.taskId === moveObj.moveTaskId ||
            item.taskId === moveObj.taskCopyId)
        ) {
          nowTask = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
    };

    loop(treeList, "task");
    if (nowTask.parentId === "0") {
      getProjectTaskListById(
        projectId,
        "0",
        "",
        1,
        data => {
          if (data.err) {
            return false;
          }
          let list = [];
          if (data.taskPage.list) {
            data.taskPage.list.map((ite, i) => {
              list.push({
                rankMove: ite.taskinfo.rank,
                projectId: ite.project.id,
                parentId: ite.taskinfo.parent.id,
                taskId: ite.taskinfo.id,
                name: ite.taskinfo.taskname,
                state: ite.taskinfo.stateName,
                number:
                  (ite.taskinfo.taskinfoNumber
                    ? ite.taskinfo.taskinfoNumber.numberS + "."
                    : "") + ite.taskinfo.rank,
                tags: [],
                attention: ite.taskinfo.collect ? true : false,
                milestone: ite.taskinfo.milestone === "1" ? "1" : "0",
                fzr: ite.taskinfo.userResponse
                  ? ite.taskinfo.userResponse.name
                  : "未指派",
                qrr: ite.taskinfo.userFlow
                  ? ite.taskinfo.userFlow.name
                  : "未指派",
                endDate: ite.taskinfo.planEndTime
                  ? ite.taskinfo.planEndTime
                  : "未设置",
                endDate_real: ite.taskinfo.realityEndTime
                  ? ite.taskinfo.realityEndTime
                  : "未设置",
                childCount: ite.taskinfo.child,
                childIngCount: ite.taskinfo.childCount,
                childSuccess: ite.taskinfo.childSuccess,
                talkCount: ite.taskinfo.leaveCount,
                openChild: false,
                loading: false,
                labels: ite.labels
              });
            });
          }
          this.setState({ treeList: list });
        },
        hideOkTask
      );
    } else {
      if (moveObj.moveTaskId) {
        loop(treeList, "moveNowPid");
        loop(treeList, "moveToPid");
      } else {
        loop(treeList, "moveToPid");
      }
    }
  }

  updateTask(task) {
    /* 处理移动/复制任务 */
    if (task.moveTaskId || task.taskCopyId) {
      this.taskMove(task);
      return false;
    }
    /* 处理删除，删除第一级的时候 直接重新刷新树列表的第一页 */
    if (task.parentId === "0" && task.delTask) {
      this.getProTaskList(1);
      return false;
    }

    let { treeList, projectId } = this.state;
    const loop = list => {
      list.forEach((item, i) => {
        /* 处理删除，删除非一级的时候 根据父ID，重新刷父ID的任务列表 */
        if (task.id && item.taskId === task.parentId && task.delTask) {
          getProjectTaskListById(projectId, task.parentId, "", 1, data => {
            if (data.err) {
              return false;
            }
            const childList = [];
            if (data.taskPage.list) {
              data.taskPage.list.map((ite, i) => {
                childList.push({
                  rankMove: ite.taskinfo.rank,
                  projectId: ite.project.id,
                  parentId: ite.taskinfo.parent.id,
                  taskId: ite.taskinfo.id,
                  name: ite.taskinfo.taskname,
                  state: ite.taskinfo.stateName,
                  number:
                    (ite.taskinfo.taskinfoNumber
                      ? ite.taskinfo.taskinfoNumber.numberS + "."
                      : "") + ite.taskinfo.rank,
                  tags: [],
                  attention: ite.taskinfo.collect ? true : false,
                  milestone: ite.taskinfo.milestone === "1" ? "1" : "0",
                  fzr: ite.taskinfo.userResponse
                    ? ite.taskinfo.userResponse.name
                    : "未指派",
                  qrr: ite.taskinfo.userFlow
                    ? ite.taskinfo.userFlow.name
                    : "未指派",
                  endDate: ite.taskinfo.planEndTime
                    ? ite.taskinfo.planEndTime
                    : "未设置",
                  endDate_real: ite.taskinfo.realityEndTime
                    ? ite.taskinfo.realityEndTime
                    : "未设置",
                  childCount: ite.taskinfo.child,
                  childIngCount: ite.taskinfo.childCount,
                  childSuccess: ite.taskinfo.childSuccess,
                  talkCount: ite.taskinfo.leaveCount,
                  openChild: false,
                  loading: false,
                  labels: ite.labels
                });
              });
            }
            list[i].childList = childList;
            list[i].childCount = list[i].childCount - 1;
            if (
              task.state === "1" ||
              task.state === "8" ||
              task.state === "9"
            ) {
              list[i].childSuccess = list[i].childSuccess - 1;
            }
            this.setState({ treeList: treeList });
          });
          return false;
        }

        if (item.childList && item.childList.length > 0) {
          loop(item.childList);
        }

        if (task.id && item.taskId === task.id) {
          if (task.name && item.name !== task.name) {
            const taskSet = { id: task.id, name: task.name };
            this.setDataByArgs(treeList, taskSet, ["name"]);
          }
          if (task.state && item.state !== task.state) {
            const taskSet = { id: task.id, state: task.state };
            this.setDataByArgs(treeList, taskSet, ["state"]);
          }
          if (
            task.planEndTime !== undefined &&
            item.endDate !== task.planEndTime
          ) {
            const taskSet = { id: task.id, endDate: task.planEndTime };
            this.setDataByArgs(treeList, taskSet, ["endDate"]);
          }
          if (
            task.realityEndTime !== undefined &&
            item.endDate !== task.realityEndTime
          ) {
            const taskSet = { id: task.id, endDate_real: task.realityEndTime };
            this.setDataByArgs(treeList, taskSet, ["endDate_real"]);
          }
          if (task.attention === true || task.attention === false) {
            const taskSet = { id: task.id, attention: task.attention };
            this.setDataByArgs(treeList, taskSet, ["attention"]);
          }
          if (task.milestone === "1" || task.milestone === "0") {
            const taskSet = { id: task.id, milestone: task.milestone };
            this.setDataByArgs(treeList, taskSet, ["milestone"]);
          }

          if (task.fzr) {
            const taskSet = { id: task.id, fzr: task.fzr.name };
            this.setDataByArgs(treeList, taskSet, ["fzr"]);
          } else if (task.fzr === "") {
            const taskSet = { id: task.id, fzr: "" };
            this.setDataByArgs(treeList, taskSet, ["fzr"]);
          }
          if (
            task.childSuccess > 0 ||
            task.childSuccess == 0 ||
            task.childCount > 0 ||
            task.childCount == 0
          ) {
            const taskSet = {
              id: task.id,
              childSuccess: task.childSuccess,
              childCount: task.childCount
            };
            this.setDataByArgs(treeList, taskSet, [
              "childSuccess",
              "childCount"
            ]);
          }
          if (task.talkCount > 0 || task.talkCount === 0) {
            const taskSet = { id: task.id, talkCount: task.talkCount };
            this.setDataByArgs(treeList, taskSet, ["talkCount"]);
          }
          if (task.tags) {
            const taskSet = { id: task.id, labels: [] };
            task.tags.map(lab => {
              taskSet.labels.push({
                id: lab.id,
                labelname: lab.name,
                type: "1",
                color: lab.color
              });
            });
            this.setDataByArgs(treeList, taskSet, ["labels"]);
          }
          return false;
        }
      });
    };
    loop(treeList);
  }

  projectEditCallBack(options) {
    if (options === "刷新") {
      this.refs.projectDetail.refeshList(true);
    } else {
      this.refs.projectDetail.refeshList(false, options);
    }
    this.setState({
      ProjectCreateShow: false,
      // createPermission: options.createPermission
      projectName: options.proname && options.proname
    });
  }

  exportClick(startCount, taskIds) {
    let { projectId } = this.state;
    downLoadTaskTest(projectId, startCount, taskIds, data => {
      if (data.err) { return false }
      this.setState({ exportExcelShow: false, exportCountLoading: false });
      message.success("导出文件将通过钉钉工作通知发送给您，请注意查收");
    });
  }

  // exportExcel() {
  //   let { exportData, exportExcelShow, exportCountLoading } = this.state;
  //   return (
  //     <Modal
  //       title="导出任务"
  //       visible={exportExcelShow}
  //       width={800}
  //       onCancel={() => {
  //         this.setState({ exportExcelShow: false });
  //       }}
  //       footer={[]}
  //     >
  //       {/* <Spin spinning={exportLoading} size="large"> */}
  //       <div className="importStyle">
  //         <div className="rowBox head">
  //           <div className="one">任务序号</div>
  //           <div className="two">数量</div>
  //           <div className="three">操作</div>
  //         </div>
  //         <div className="listBox">
  //           {exportCountLoading ? <Spin /> : ""}
  //           {exportData && exportData.length > 0
  //             ? exportData.map((item, i) => {
  //               return (
  //                 <div className="rowBox" key={"exportData" + i}>
  //                   <div className="one">
  //                     {item.startTask.fullRank +
  //                       "---------" +
  //                       item.endTask.fullRank}
  //                   </div>
  //                   <div className="two">{item.moreSize}</div>
  //                   <div className="three">
  //                     <Button
  //                       type="primary"
  //                       onClick={() => {
  //                         this.exportClick(item.startCount);
  //                       }}
  //                     >
  //                       导出任务
  //                       </Button>
  //                   </div>
  //                 </div>
  //               );
  //             })
  //             : ""}
  //         </div>
  //       </div>
  //       {/* </Spin> */}
  //     </Modal>
  //   );
  // }

  getExportData() {
    let { projectId, taskDetailsId } = this.state;
    this.setState({ exportData: [], exportCountLoading: true });
    getExportMenuData(projectId, taskDetailsId, data => {
      if (data.exportCount == 0) {
        message.info("该项目没有要导出的任务！");
      } else {
        let exportData = data.exportData;
        this.setState({ exportData: exportData, exportExcelShow: true });
      }
      this.setState({ exportCountLoading: false });
    });
  }

  cancelMoreEdit() {
    this.setState({ moreEdit: false, checkedIds: [] });
  }

  animateAdd() {
    this.setState({ animateClass: "animated_05s fadeInRightBig" });
    const _this = this;
    setTimeout(function () {
      _this.setState({ animateClass: "" });
    }, 500);
  }
  headMenuIcon() {
    const { projectSearchDivOnTop } = this.state;
    this.setState({ projectSearchDivOnTop: !projectSearchDivOnTop });
  }

  render() {
    const {
      available,
      switchPage,
      treeList,
      moneyEnd,
      projectName,
      notCheckIds,
      projectTaskCount,
      projectId,
      jurisdiction,
      hideOkTask,
      importExcelShow,
      exportExcelShow,
      taskCreateShow,
      animateClass,
      ProjectCreateShow,
      projectSearchDivOnTop,
      taskDetailsShow,
      taskDetailsId,
      taskDetailsState,
      taskDetailsProId,
      moreEdit,
      checkedIds,
      treeListMoreLoading,
      treeListLoading,
      searchProType,
      createPermission,
      moveSort,
      createChildTaskLists,
      isLast,
      searchContent,
      showSearch,
      focus,
      searchTaskText,
      isIos,
      closeed
      //       modifyPermission
    } = this.state;
    let suffixDom =
      searchContent !== "" ? (
        <i
          className="iconfont icon-clears"
          onClick={() => {
            this.setState({
              showSearch: "",
              searchContent: ""
            });
          }}
        />
      ) : (
          ""
        );
    let suffixTask =
      searchTaskText !== "" ? (
        <i
          className="iconfont icon-clears"
          onClick={() => {
            this.setState({
              searchTaskText: ""
            });
            this.getProTaskList(1, projectId, "", "");
          }}
        />
      ) : (
          ""
        );
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout>
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Head
            closeRule={() => {
              this.setState({ closeed: false });
            }}
            iconOnClickCallBack={() => {
              this.headMenuIcon();
            }}
          />
          {taskDetailsShow ? (
            <div className={"taskDetailsBox " + animateClass}>
              <TaskDetails
                taskId={taskDetailsId}
                projectId={taskDetailsProId}
                createChildTaskLists={createChildTaskLists}
                hideOkTask={hideOkTask}
                closeed={closeed}
                closeedCal={() => {
                  this.setState({ closeed: true });
                }}
                taskDetailShow={this.state.taskDetailsShow}
                closeCallBack={() => {
                  this.setState({ taskDetailsShow: false, taskDetailsId: "" });
                }}
                updatedTaskCallBack={val => {
                  if (switchPage === "a") {
                    if (val === "刷新" || (val.type && val.type === "1")) {
                      this.getProTaskList();
                    } else {
                      this.updateTask(val);
                    }
                  }
                }}
              />
            </div>
          ) : (
              ""
            )}
          <Content>
            <div className="opet_projectDetails">
              {taskCreateShow === "创建任务" && (
                <TaskCreate
                  task={{ projectId: projectId }}
                  successCallBack={() => {
                    this.getProTaskList(1, projectId);
                  }}
                  closedCallBack={() => {
                    this.setState({ taskCreateShow: "" });
                  }}
                />
              )}
              {taskCreateShow === "创建子任务" && (
                <TaskCreate
                  task={{ id: taskDetailsId, projectId: projectId }}
                  successCallBack={(proid, taskid) => {
                    // this.setState({ createChildTaskLists: true });
                    this.createChildTask(proid, taskid);
                  }}
                  closedCallBack={() => {
                    this.setState({ taskCreateShow: "" });
                  }}
                />
              )}
              {ProjectCreateShow === "创建项目" ? (
                <ProjectCreate
                  updateOkCallback={val => {
                    this.projectEditCallBack(val);
                  }}
                  hidemore={true}
                  closedCallBack={() => {
                    this.setState({ ProjectCreateShow: false });
                  }}
                />
              ) : (
                  ""
                )}
              {ProjectCreateShow === "编辑项目" ? (
                <ProjectCreate
                  updateOkCallback={val => {
                    this.projectEditCallBack(val);
                  }}
                  getExportData={() => {
                    this.getExportData();
                  }}
                  projectId={projectId}
                  closedCallBack={() => {
                    this.setState({ ProjectCreateShow: false });
                  }}
                  moneyEnd={() => {
                    this.setState({ moneyEnd: true });
                  }}
                />
              ) : (
                  ""
                )}
              {moneyEnd ? (
                <MoneyEnd
                  alertText={getTeamInfoWithMoney("专业版提示")}
                  closeCallBack={() => {
                    this.setState({ moneyEnd: false });
                  }}
                />
              ) : (
                  ""
                )}
              {importExcelShow ? this.importExcel() : ""}
              {exportExcelShow ?
                <AsynExportTask
                  task={{ id: taskDetailsId, projectId: projectId, projectName: projectName, name: projectName }}
                  closedCallback={() => { this.setState({ exportExcelShow: false }); }}
                  successCallback={(idArr) => {
                    this.exportClick(0, idArr)
                    // this.props.updataCoopList(taskInfo.id && taskInfo.id);
                    // this.props.updataTaskDetailByIdCallBack(
                    //   taskInfo.id,
                    //   taskInfo.project.id
                    // );
                  }}
                /> : ""}
              <ContentLeftList
                ref="projectDetail"
                projectId={projectId}
                searchProType={searchProType}
                projectSearchDivOnTop={projectSearchDivOnTop}
                projectOnClick={res => {
                  this.projectOnClick(res);
                }}
              />

              <div
                className="pro_cont_top"
                onClick={e => {
                  if (switchPage !== "b") {
                    this.setState({
                      taskDetailsShow: false,
                      taskDetailsId: ""
                    });
                  }
                }}
              >
                <div className="title">
                  <label>{projectName}</label>
                  <span>共计{projectTaskCount}个任务</span>
                </div>
                <i
                  className={
                    isIos
                      ? "proSet iconfont icon-setting"
                      : "proSet iconfont icon-setting windowSetting"
                  }
                  onClick={() => {
                    this.cancelMoreEdit();
                    this.setState({ ProjectCreateShow: "编辑项目" });
                  }}
                />
                <Tabs
                  defaultActiveKey={switchPage}
                  onChange={e => {
                    this.cancelMoreEdit();
                    this.switchPage(e);
                  }}
                >
                  <TabPane tab="任务列表" key="a" />
                  <TabPane
                    tab={
                      <span>
                        {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                          <svg
                            className="pro-icon zuanshi svgIcon"
                            aria-hidden="true"
                          >
                            <use xlinkHref={"#pro-myfg-zuanshi"} />
                          </svg>
                        ) : (
                            ""
                          )}
                        任务文件
                      </span>
                    }
                    key="b"
                  />
                  <TabPane
                    tab={
                      <span>
                        {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                          <svg
                            className="pro-icon zuanshi svgIcon"
                            aria-hidden="true"
                          >
                            <use xlinkHref={"#pro-myfg-zuanshi"} />
                          </svg>
                        ) : (
                            ""
                          )}
                        数据统计
                      </span>
                    }
                    key="c"
                  />
                  <TabPane
                    tab={
                      <span>
                        {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                          <svg
                            className="pro-icon zuanshi svgIcon"
                            aria-hidden="true"
                          >
                            <use xlinkHref={"#pro-myfg-zuanshi"} />
                          </svg>
                        ) : (
                            ""
                          )}
                        甘特图
                      </span>
                    }
                    key="d"
                  />
                </Tabs>
                <div className="filesSearch">
                  {switchPage === "b" ? (
                    <Input
                      className={
                        focus ? "longInput inputStyle" : "smallInput inputStyle"
                      }
                      prefix={
                        <i
                          className={
                            isIos
                              ? "iconfont icon-search"
                              : "iconfont icon-search windowSearch"
                          }
                        />
                      }
                      suffix={suffixDom}
                      placeholder="搜索文件"
                      value={showSearch}
                      onFocus={() => {
                        this.setState({ focus: true });
                      }}
                      onBlur={() => {
                        this.setState({ focus: false });
                      }}
                      onChange={e => {
                        this.setState({ showSearch: e.target.value });
                      }}
                      onPressEnter={e => {
                        this.setState({
                          searchContent: e.target.value,
                          showSearch: e.target.value
                        });
                      }}
                    />
                  ) : (
                      ""
                    )}
                  {switchPage === "a" ? (
                    <Input
                      className={
                        focus ? "longInput inputStyle" : "smallInput inputStyle"
                      }
                      prefix={
                        <i
                          className={
                            isIos
                              ? "iconfont icon-search"
                              : "iconfont icon-search windowSearch"
                          }
                        />
                      }
                      suffix={suffixTask}
                      placeholder="搜索任务"
                      value={searchTaskText}
                      onFocus={() => {
                        this.setState({ focus: true });
                      }}
                      onBlur={() => {
                        this.setState({ focus: false });
                      }}
                      onChange={e => {
                        this.setState({ searchTaskText: e.target.value });
                      }}
                      onPressEnter={e => {
                        this.getProTaskList(1, projectId, "", e.target.value);
                      }}
                    />
                  ) : (
                      ""
                    )}
                </div>
              </div>
              {switchPage === "a" ? (
                <div
                  className="pro_buts"
                  onClick={() => {
                    this.setState({
                      taskDetailsShow: false,
                      taskDetailsId: ""
                    });
                  }}
                >
                  {!available && !moreEdit && !taskDetailsId ? (
                    <Button
                      // icon="plus-circle-o"
                      className="taskCreat"
                      type="primary"
                      onClick={() => {
                        this.freeTaskLimit("创建任务");
                      }}
                    >
                      创建任务
                    </Button>
                  ) : (
                      !moreEdit &&
                      !taskDetailsId &&
                      (createPermission ? (
                        <Button
                          type="primary"
                          // icon="plus-circle-o"
                          className="taskCreat"
                          onClick={() => {
                            this.setState({ taskCreateShow: "创建任务" });
                          }}
                        >
                          创建任务
                      </Button>
                      ) : (
                          <Tooltip
                            placement="top"
                            title={`您在该项⽬中没有创建任务的权限`}
                            overlayClassName="createOverlayClass"
                          >
                            <Button type="primary" className="taskCreat">
                              创建任务
                        </Button>
                          </Tooltip>
                        ))
                    )}
                  {!available && !moreEdit && taskDetailsId ? (
                    <Button
                      // icon="plus-circle-o"
                      className="taskCreat"
                      type="primary"
                      onClick={() => {
                        this.freeTaskLimit("创建任务");
                      }}
                    >
                      创建子任务
                    </Button>
                  ) : (
                      !moreEdit &&
                      taskDetailsId &&
                      (createPermission ? (
                        <Button
                          type="primary"
                          // icon="plus-circle-o"
                          className="taskCreat"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.setState({ taskCreateShow: "创建子任务" });
                          }}
                          disabled={
                            taskDetailsState == "1" ||
                            taskDetailsState == "8" ||
                            taskDetailsState == "9" ||
                            taskDetailsState == "4"
                          }
                        >
                          创建子任务
                      </Button>
                      ) : (
                          <Tooltip
                            placement="top"
                            title={"您在该项⽬中没有创建任务的权限"}
                            overlayClassName="createOverlayClass"
                          >
                            <Button type="primary">创建子任务</Button>
                          </Tooltip>
                        ))
                    )}
                  {!moreEdit &&
                    !taskDetailsId &&
                    getTeamInfoWithMoney("是否可用") &&
                    (createPermission ? (
                      <Button
                        className="exportTask"
                        onClick={() => {
                          this.setState({
                            importExcelShow: true,
                            importStep: 0,
                            importName: "导入任务"
                          });
                        }}
                      >
                        {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                          <svg className="pro-icon zuanshi" aria-hidden="true">
                            <use xlinkHref={"#pro-myfg-zuanshi"} />
                          </svg>
                        ) : (
                            ""
                          )}
                        导入任务
                      </Button>
                    ) : (
                        <Tooltip
                          placement="top"
                          title={`您在该项⽬中没有创建任务的权限`}
                          overlayClassName="createOverlayClass"
                        >
                          <Button className="exportTask">
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
                            导入任务
                        </Button>
                        </Tooltip>
                      ))}
                  {!moreEdit &&
                    !taskDetailsId &&
                    !getTeamInfoWithMoney("是否可用") && (
                      <Button
                        onClick={() => {
                          this.setState({ moneyEnd: true });
                        }}
                        className="exportTask"
                      >
                        <svg className="pro-icon zuanshi" aria-hidden="true">
                          <use xlinkHref={"#pro-myfg-zuanshi"} />
                        </svg>
                        导入任务
                      </Button>
                    )}

                  {!moreEdit &&
                    taskDetailsId &&
                    getTeamInfoWithMoney("是否可用") &&
                    (createPermission ? (
                      <Button
                        className="exportTask"
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          this.setState({
                            importExcelShow: true,
                            importStep: 0,
                            importName: "导入子任务"
                          });
                        }}
                        disabled={
                          taskDetailsState == "1" ||
                          taskDetailsState == "8" ||
                          taskDetailsState == "9" ||
                          taskDetailsState == "4"
                        }
                      >
                        {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                          <svg className="pro-icon zuanshi" aria-hidden="true">
                            <use xlinkHref={"#pro-myfg-zuanshi"} />
                          </svg>
                        ) : (
                            ""
                          )}
                        导入子任务
                      </Button>
                    ) : (
                        <Tooltip
                          placement="top"
                          title={"您在该项⽬中没有创建任务的权限"}
                          overlayClassName="createOverlayClass"
                        >
                          <Button className="exportTask">
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
                        </Button>
                        </Tooltip>
                      ))}
                  {!moreEdit &&
                    taskDetailsId &&
                    !getTeamInfoWithMoney("是否可用") && (
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          this.setState({ moneyEnd: true });
                        }}
                        disabled={
                          taskDetailsState == "1" ||
                          taskDetailsState == "8" ||
                          taskDetailsState == "9" ||
                          taskDetailsState == "4"
                        }
                        className="exportTask"
                      >
                        <svg className="pro-icon zuanshi" aria-hidden="true">
                          <use xlinkHref={"#pro-myfg-zuanshi"} />
                        </svg>
                        导入子任务
                      </Button>
                    )}

                  {getTeamInfoWithMoney("是否可用") && (
                    <Button
                      onClick={() => {
                        this.setState({ moreEdit: !moreEdit });
                      }}
                      className={moreEdit ? "moreEdit bule" : "moreEdit"}
                    >
                      {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                        <svg className="pro-icon zuanshi" aria-hidden="true">
                          <use xlinkHref={"#pro-myfg-zuanshi"} />
                        </svg>
                      ) : (
                          <i className="icon iconfont icon-select iconStyle" />
                        )}
                      批量修改
                    </Button>
                  )}
                  {!getTeamInfoWithMoney("是否可用") && (
                    <Button
                      onClick={() => {
                        this.setState({ moneyEnd: true });
                      }}
                      className="moreEdit"
                    >
                      <svg className="pro-icon zuanshi" aria-hidden="true">
                        <use xlinkHref={"#pro-myfg-zuanshi"} />
                      </svg>
                      批量修改
                    </Button>
                  )}
                  {moreEdit ? (
                    <MoreTaskEdit
                      editType="标签"
                      checkTaskIds={checkedIds}
                      updateCallBack={() => {
                        this.getProTaskList();
                      }}
                      className="tag"
                    />
                  ) : (
                      ""
                    )}
                  {moreEdit ? (
                    <MoreTaskEdit
                      editType="负责人"
                      checkTaskIds={checkedIds}
                      updateCallBack={() => {
                        this.getProTaskList();
                      }}
                    />
                  ) : (
                      ""
                    )}
                  {moreEdit ? (
                    <MoreTaskEdit
                      editType="确认人"
                      checkTaskIds={checkedIds}
                      updateCallBack={() => {
                        this.getProTaskList();
                      }}
                    />
                  ) : (
                      ""
                    )}
                  {moreEdit && (
                    <MoreTaskEdit
                      editType="关注人"
                      checkTaskIds={checkedIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  )}
                  {moreEdit && (
                    <Select
                      placeholder="更多修改"
                      className="more"
                      value={"更多修改"}
                    >
                      <Option value="more6">
                        <MoreTaskEdit
                          editType="开始时间"
                          checkTaskIds={checkedIds}
                          updateCallBack={() => {
                            this.getProTaskList();
                          }}
                        />
                      </Option>
                      <Option value="more1">
                        <MoreTaskEdit
                          editType="截止时间"
                          checkTaskIds={checkedIds}
                          updateCallBack={() => {
                            this.getProTaskList();
                          }}
                        />
                      </Option>
                      <Option value="more2">
                        <MoreTaskEdit
                          editType="计划工期"
                          checkTaskIds={checkedIds}
                          updateCallBack={() => {
                            this.getProTaskList();
                          }}
                        />
                      </Option>
                      <Option value="more4">
                        <MoreTaskEdit
                          editType="任务绩效"
                          checkTaskIds={checkedIds}
                          updateCallBack={() => {
                            this.getProTaskList();
                          }}
                        />
                      </Option>
                      {/* <Option value="more3">
                        <MoreTaskEdit
                          editType="优先级"
                          checkTaskIds={checkedIds}
                          updateCallBack={() => {
                            this.getProTaskList();
                          }}
                        />
                      </Option> */}
                    </Select>
                  )}
                  <Checkbox
                    checked={hideOkTask}
                    onChange={e => {
                      this.setState({ hideOkTask: e.target.checked });
                      this.getProTaskList(1, "", e.target.checked);
                      Storage.setLocal("hideOkTask", e.target.checked);
                    }}
                  >
                    隐藏已完成
                  </Checkbox>
                  <Button
                    className="moveSort"
                    type={moveSort ? "" : "primary"}
                    onClick={() => {
                      this.setState({ moveSort: !moveSort });
                    }}
                  >
                    <i className="iconfont icon-move" />
                    手动排序
                  </Button>
                </div>
              ) : (
                  ""
                )}
              {switchPage === "a" ? (
                <div
                  className="pro_cont"
                  onScroll={e => {
                    this.treeBoxScroll(e);
                  }}
                  style={{ top: 154 }}
                  onClick={() => {
                    this.setState({
                      taskDetailsShow: false,
                      taskDetailsId: ""
                    });
                  }}
                >
                  <Spin spinning={treeListLoading} />
                  {treeList && treeList.length > 0 ? (
                    <TaskTree
                      treeList={treeList}
                      checkBoxShow={moreEdit}
                      checkedTaskIds={checkedIds}
                      addIconNone={true}
                      taskOnClickCallBack={(
                        taskId,
                        projectId,
                        parentId,
                        taskname,
                        taskState
                      ) => {
                        this.cancelMoreEdit();
                        this.setState({
                          taskDetailsId: taskId,
                          taskDetailsProId: projectId,
                          taskDetailsParentId: parentId,
                          selectedTaskName: taskname,
                          taskDetailsState: taskState
                        });
                        if (taskDetailsId === taskId) {
                          this.setState({
                            taskDetailsShow: false,
                            taskDetailsId: ""
                          });
                        } else {
                          if (!taskDetailsShow) {
                            this.setState({ taskDetailsShow: true });
                            this.animateAdd();
                          }
                        }
                      }}
                      moreEdit={moreEdit}
                      checkingCallBack={arr => {
                        this.setState({ checkedIds: arr });
                      }}
                      treeListOnChangeCallBack={val => {
                        this.treeListOnChange(val);
                      }}
                      notCheckIds={notCheckIds}
                      hideOkTask={hideOkTask}
                      projectname={projectName}
                      moveSort={moveSort}
                    />
                  ) : (
                      ""
                    )}
                  {!treeListMoreLoading && isLast === "0" ? (
                    <div className="moreLoadingRow">下拉加载更多</div>
                  ) : (
                      ""
                    )}
                  {treeListMoreLoading ? (
                    <div className="moreLoadingRow">
                      <Icon type="loading" className="loadingIcon" />
                      正在加载更多
                    </div>
                  ) : (
                      ""
                    )}
                  {!treeListMoreLoading && isLast === "1" ? (
                    <div className="moreLoadingRow">已经到底喽</div>
                  ) : (
                      ""
                    )}
                </div>
              ) : (
                  ""
                )}
              {switchPage === "c" ? (
                <div
                  className="pro_cont"
                  onClick={() => {
                    this.setState({
                      taskDetailsShow: false,
                      taskDetailsId: ""
                    });
                  }}
                >
                  {projectId ? (
                    <ProjectChart
                      projectId={projectId}
                      jurisdiction={jurisdiction}
                    />
                  ) : (
                      ""
                    )}
                </div>
              ) : (
                  ""
                )}
              {switchPage === "b" ? (
                <div className="pro_cont">
                  {projectId ? (
                    <ProjectFiles
                      projectId={projectId}
                      projectName={projectName}
                      searchContent={searchContent}
                    />
                  ) : (
                      ""
                    )}
                </div>
              ) : (
                  ""
                )}
              {switchPage === "d" ? (
                <div
                  className="pro_cont"
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  {projectId ? (
                    <ProjectPlusGantt
                      projectId={projectId}
                      taskOnClickCallBack={(taskId, projectId) => {
                        this.setState({
                          taskDetailsId: taskId,
                          taskDetailsProId: projectId
                        });
                        if (!taskDetailsShow) {
                          this.setState({ taskDetailsShow: true });
                          this.animateAdd();
                        }
                      }}
                    />
                  ) : (
                      ""
                    )}
                </div>
              ) : (
                  ""
                )}
            </div>
          </Content>
        </Layout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    projectSearchVal: state.project.projectSearchVal,
    listState: { ...state.project.listState }
  };
}
const mapDispatchToProps = dispatch => {
  return {
    setProjectSeachVal: bindActionCreators(
      projectAction.setProjectSeachVal,
      dispatch
    ),
    saveListState: bindActionCreators(projectAction.saveListState, dispatch)
  };
};
export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  ProjectDetails
);
