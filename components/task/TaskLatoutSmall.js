import React, { Component } from "react";
import stylesheet from "styles/components/task/TaskLatoutSmall.scss";
import { setColorTaskState } from "../../core/utils/util";
import TaskSilder from "../task/middleDetails/taskSilder"; //中间部分的组件
import { Dropdown, Modal, Menu, Input, Button, Tooltip, message, Spin, DatePicker, Icon, Popconfirm, Upload } from "antd";
import _ from "lodash";
import TagComponent from "../newtag";
import Discuss from "../task/discuss";
import Storage from "../../core/utils/storage";
import DiscussPublish from "./discuss/publish";
import locale from "antd/lib/date-picker/locale/zh_CN";
import { baseURI } from "../../core/api/HttpClient";
import dingJS from "../../core/utils/dingJSApi";
import moment from "moment";
import { getTaskDetailsDataById, cancelAttentionWitchTask, addAttentionWitchTask, updateTaskById, updateTaskStateByCode, deleteTaskById, urgeSonTaskByTaskId, claimTaskById, getSonTask, setMilestoneWithTask, urgeTaskById, getAtSelectUser, getChildTaskById, getCoopTaskById, getTaskFilesById } from "../../core/service/task.service";
import { updateImgsInService } from "../../core/service/file.service";
import { stringToText, pasteImg, onlyNumber, createFileIcon, beforeUpload, isIosSystem } from "../../core/utils/util";
const { TextArea } = Input;
const confirm = Modal.confirm;

class TaskLatoutSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveShow: false,
      animateClass: "",
      taskInfoCopy: {},
      taskInfo: {},
      isManager: false, //是不是项目管理员或者负责人
      dict_lev: [], // 重要程度 字典
      detailTxtEdit: true,
      addaccessory: true, //添加附件按钮
      uploadList_desc: [],
      titleHeight: 0,
      jurisdiction: false, //可以编辑的状态
      taskInfoLoading: false,
      createPermission: false, //是否可以创建子任务
      deletePermission: false, //是否可以删除
      taskId: "", //任务Id，夫组件传过来
      projectId: "", //项目Id,
      projectAll: {},
      isSmall: false,
      tags: [], //标签数组
      publishObj: {
        newTalkReplyUserId: "", //新建讨论人
        newTalkDesc: "", //讨论描述
        newTalkFiles: [], //讨论文件
        newTalkPromptTxt: "请输入讨论内容", //讨论内容
        people: { id: "", nickname: "" }
      },
      taskCompleteModalShow: false,
      taskCompletDesc: "",
      taskCompletLoading: false,
      taskCompletFiles: [],
      uploadList_state: [],
      limitVisible: false,
      versionShow: false,
      taskCheckModalShow: false,
      taskCheckModalTitle: "",
      taskCheckDesc: "",
      taskCheckLoading_x: false,
      taskCheckLoading_v: false,
      user: {},
      sonTaskinfoList: [], //未完成的子任务
      taskMoveShow: false, //移动任务弹窗
      taskCopyShow: false, //复制任务弹窗
      packUp: false,
      taskSilderChange: "",
      onFocussssss: false,
      peopleAllList: [],
      LimitTextLength: 0,
      childListLoading: false,
      childList: [],
      fileList: [],
      filesListLoading: false,
      UrgeShow: false, //显示  +++催办
      urgeTaskDesc: "",
      coopList: [],
      coopListLoading: false,
      isIos: false,
      terminationRestartTaskShow: false, // 重启终止Modal 显示
      terResTaskDesc: "",
      modeTime: true,
      isDealDates: true,
      beginTimeShow: true,
      relityBegTime: null,
      TIMESHOW: false,
    };
  }
  componentWillMount = () => {
    const { taskId, projectId } = this.props
    this.getTaskDetail(taskId, projectId, data => { this.initGetPeopleList(data.project) })
    this.getChildTaskList(taskId)
    this.getFileList(taskId)
    this.getCoopTaskList(taskId)
  };

  componentDidMount() {
    let user = Storage.get("user");
    this.setState({ user: user, isIos: isIosSystem() });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.taskDetailShow) { this.setState({ saveShow: false }) }
    if (nextProps.taskId !== this.props.taskId) {
      this.setState({
        taskSilderChange: "",
        saveShow: false,
        publishObj: {
          newTalkReplyUserId: "", //新建讨论人
          newTalkDesc: "", //讨论描述
          newTalkFiles: [], //讨论文件
          newTalkPromptTxt: "请输入讨论内容", //讨论内容
          people: { id: "", nickname: "" }
        }
      })
      this.getTaskDetail(nextProps.taskId, nextProps.projectId, data => { this.initGetPeopleList(data.project) })
      this.getChildTaskList(nextProps.taskId);
      this.getFileList(nextProps.taskId);
      this.getCoopTaskList(nextProps.taskId);
    }
  }
  componentDidUpdate() {
    document.getElementById("scrollWrap").scrollTop = 0;
    const fixedHeadEle = this.refs.fixedHead.clientHeight;
    const scrollEle = this.refs.scrollEle;
    if (fixedHeadEle && scrollEle) { scrollEle.style.top = fixedHeadEle + "px"; }
  }
  getChildTaskList = id => {
    this.setState({ childListLoading: true })
    getChildTaskById(id, data => {
      if (data.err) { return false }
      this.setState({ childList: data, childListLoading: false })
    }, false)
  }

  //获取协作任务列表
  getCoopTaskList = id => {
    this.setState({ coopListLoading: true })
    getCoopTaskById(id, data => {
      if (data.err) { return false }
      this.setState({ coopList: data, coopListLoading: false })
    }, false)
  }
  //获取成果文件列表
  getFileList = id => {
    this.setState({ filesListLoading: true })
    getTaskFilesById(id, data => {
      if (data.err) { return false }
      this.setState({ fileList: data, filesListLoading: false })
    }, false)
  }

  checkIsEdit = () => {
    const { taskInfo, taskInfoCopy } = this.state
    if (!_.isEqual(taskInfo, taskInfoCopy)) { return true }
    return false
  }
  urgeChildTasks() {
    urgeSonTaskByTaskId(this.state.taskInfo.id, data => {
      if (data.err) { return false }
      message.success("催办成功！")
    }, this.props.isSmall)
  }

  getTaskDetail = (taskId, proId, callback) => {
    this.setState({ taskInfoLoading: true })
    if (taskId) {
      getTaskDetailsDataById(taskId, proId, this.props.hideOkTask,
        data => {
          if (data.err) { return false }
          let { taskInfo } = this.state
          if (data && data.antTaskinfo && data.antTaskinfo.state && (data.antTaskinfo.state == 0 || data.antTaskinfo.state == 3)) {
            this.setState({ jurisdiction: true })
          } else {
            this.setState({ jurisdiction: false })
          }
          taskInfo.id = data.antTaskinfo.id && data.antTaskinfo.id;
          taskInfo.project = { id: data.project.id && data.project.id, name: data.project.proname && data.project.proname }
          taskInfo.name = data.antTaskinfo.taskname && data.antTaskinfo.taskname;
          taskInfo.proname = data.project.proname && data.project.proname;
          let numberS = "";
          if (data.antTaskinfo.taskinfoNumber) { numberS = data.antTaskinfo.taskinfoNumber.numberS + "." }
          taskInfo.number = numberS + data.antTaskinfo.rank && data.antTaskinfo.rank;
          taskInfo.state = data.antTaskinfo.stateName && data.antTaskinfo.stateName; //任务状态
          taskInfo.stateButton = data.antTaskinfo.stateButton && data.antTaskinfo.stateButton;
          taskInfo.flowButton = data.antTaskinfo.flowButton && data.antTaskinfo.flowButton;
          taskInfo.beginButton = data.antTaskinfo.beginButton;
          taskInfo.attention = data.antTaskinfo.collect ? true : false;
          taskInfo.bread = data.parentList;
          taskInfo.desc = data.antTaskinfo && data.antTaskinfo.description;
          taskInfo.descFiles = JSON.parse(JSON.stringify(data.taskinfoFiles));
          let descImgs = stringToText(data.antTaskinfo.description, "img");
          descImgs.map((item, i) => { taskInfo.descFiles.push({ fileUrlAbsolute: item, id: "descStrImg" + i, name: "descStrImg" + i }) })
          taskInfo.tags = []
          data.label.map((item, i) => { taskInfo.tags.push({ id: item.label.id, name: item.label.labelname, color: item.label.color, type: item.label.type, recordId: item.id }) })
          taskInfo.fzr = data.antTaskinfo.userResponse ? data.antTaskinfo.userResponse : ""
          taskInfo.qrr = data.antTaskinfo.userFlow ? data.antTaskinfo.userFlow : "";
          taskInfo.realityEndTime = data.antTaskinfo.realityEndTime ? data.antTaskinfo.realityEndTime : null;// realityEndTime 实际完成时间
          taskInfo.planEndTime = data.antTaskinfo.planEndTime ? data.antTaskinfo.planEndTime : null;//  planEndTime 计划完成时间 
          taskInfo.planBeginTime = data.antTaskinfo.planBeginTime ? data.antTaskinfo.planBeginTime : null; //planBeginTime计划开始时间
          if (data.antTaskinfo.planBeginTime && (data.antTaskinfo.planBeginTime.indexOf("23:59:59") !== -1 || data.antTaskinfo.planBeginTime.indexOf("00:00:03") !== -1)) {
            this.setState({ beginTimeShow: true })
          } else {
            this.setState({ beginTimeShow: false })
          }
          taskInfo.realityBeginTime = data.antTaskinfo.realityBeginTime ? data.antTaskinfo.realityBeginTime : null;// realityBeginTime 实际开始时间
          taskInfo.workTime = data.antTaskinfo.workTime;
          taskInfo.taskMoney = data.antTaskinfo.flowConten;
          taskInfo.lev = data.antTaskinfo.coefficienttype;
          taskInfo.childCount = data.antTaskinfo.childCount;
          taskInfo.childSuccess = data.antTaskinfo.childSuccess;
          taskInfo.coopTaskCount = data.taskrRelationCount;
          taskInfo.filesCount = data.filesCount;
          taskInfo.talk = data.leaveList;
          taskInfo.parentIds = data.antTaskinfo.parentIds;
          taskInfo.parentId = data.antTaskinfo.parent ? data.antTaskinfo.parent.id : "0";
          taskInfo.projectJurisdiction = data.project.jurisdiction;
          taskInfo.zpf = data.antTaskinfo.userAssigned;//增加指派人
          taskInfo.cjr = data.antTaskinfo.createBy;//增加任务创建人
          const collectList = []; //关注人
          if (data.collectList) { data.collectList.map(item => { collectList.push(item.user) }) }
          taskInfo.collectListAll = data.collectList;
          taskInfo.collectList = collectList;
          taskInfo.modifyPermission = data.modifyPermission; //修改权限
          taskInfo.deletePermission = data.deletePermission; //删除权限
          taskInfo.createPermission = data.createPermission; //创建权限
          taskInfo.isManager = data.project && data.project.jurisdiction; //是否是项目负责人或管理员
          taskInfo.milestone = data.antTaskinfo.milestone; //设置里程碑
          taskInfo.projectAll = data.project;
          this.setState({ taskInfo: taskInfo }, () => { if (callback) { callback(data) } });
          this.setUploadListWithDescFile(taskInfo)
          this.setState({ isDealDates: taskInfo.planEndTime && taskInfo.planEndTime.indexOf("23:59:59") > -1 ? true : false });
          let taskInfoCopy = JSON.parse(JSON.stringify(taskInfo));
          this.setState({ taskInfoCopy: taskInfoCopy });
          const dict_lev = data.coefficienttype;
          this.setState({ dict_lev: dict_lev });
          this.setState({ taskInfoLoading: false });
        }, this.props.isSmall);
    }
  };

  valChange = (type, val) => {
    let { taskInfo } = this.state;
    if (type === "fzr") {
      taskInfo.fzr.userid = val;
      taskInfo.fzr.name = "";
      taskInfo.fzr.photo = "";
    } else if (type === "qrr") {
      taskInfo.qrr.userid = val;
      taskInfo.qrr.name = "";
      taskInfo.qrr.photo = "";
    } else {
      taskInfo[type] = val;
    }
    this.setState({ taskInfo: taskInfo, taskSilderChange: "change" });
    this.valOnChange(type);
  };

  valOnChange = type => {
    const { taskInfo, taskInfoCopy } = this.state;
    if (taskInfo[type] !== taskInfoCopy[type]) {
      this.handleShowSave();
    }
  };
  upDataListInfo = () => {
    const { taskInfo } = this.state;
    let _this = this;
    this.getTaskDetail(taskInfo.id, this.props.projectId, data => {
      _this.setState({ saveShow: false });
      const task = {
        id: data.antTaskinfo.id,
        name: data.antTaskinfo.taskname,
        proname: data.project.proname,
        tags: taskInfo.tags,
        fzr: data.antTaskinfo.userResponse ? data.antTaskinfo.userResponse : "",
        qrr: data.antTaskinfo.userFlow ? data.antTaskinfo.userFlow : "",
        planEndTime: data.antTaskinfo.planEndTime
          ? data.antTaskinfo.planEndTime
          : "",
        realityEndTime: data.antTaskinfo.realityEndTime
          ? data.antTaskinfo.realityEndTime
          : "",
        state: data.antTaskinfo.stateName,
        childSuccess: data.antTaskinfo.childSuccess,
        childCount: data.antTaskinfo.childCount
      };
      _this.props.updatedTaskCallBack(task);
    });
  };
  // 保存任务
  save = () => {
    const { taskInfo } = this.state;
    let tag = [];
    taskInfo.tags.map((item, i) => {
      tag.push({ label: { id: item.id, labelname: item.name, color: item.color, type: item.type }, rtype: "c" })
    })
    let newTask = {
      id: taskInfo.id,
      taskname: taskInfo.name,
      proname: taskInfo.proname,
      description: taskInfo.desc,
      labelrelations: tag,
      userResponse: { userid: taskInfo.fzr.userid ? taskInfo.fzr.userid : taskInfo.fzr.emplId },
      userFlow: { userid: taskInfo.qrr.userid ? taskInfo.qrr.userid : taskInfo.qrr.emplId },
      flowConten: taskInfo.taskMoney === "" ? 0 : taskInfo.taskMoney,
      workTime: taskInfo.workTime === "" ? 0 : taskInfo.workTime,
      coefficienttype: taskInfo.lev,
      fileList: taskInfo.descFiles,
      jurisdiction: taskInfo.isManager,
      projectId: taskInfo.project.id
    };
    if (taskInfo.planEndTime) {
      if (taskInfo.planEndTime.length > 10 && taskInfo.planEndTime.indexOf("00:00") !== -1) {
        newTask.planEndTimeString = taskInfo.planEndTime.slice(0, 10) + " 00:00:02"
      } else {
        newTask.planEndTimeString = taskInfo.planEndTime
      }
    } else {
      newTask.planEndTimeString = "DELL"
    }
    if (taskInfo.planBeginTime) {
      if (taskInfo.planBeginTime.length > 10 && taskInfo.planBeginTime.indexOf("00:00") !== -1) {
        newTask.planBeginTimeString = taskInfo.planBeginTime.slice(0, 10) + " 00:00:02"
      } else {
        newTask.planBeginTimeString = taskInfo.planBeginTime
      }
    } else {
      newTask.planBeginTimeString = "DELL"
    }
    updateTaskById(newTask, data => {
      if (data.err) { return false }
      this.upDataListInfo()
    },
      this.props.isSmall
    );
  };
  //取消保存
  handleCancel = () => {
    let { taskInfo, taskInfoCopy } = this.state;
    taskInfo = JSON.parse(JSON.stringify(taskInfoCopy));
    this.setState({ taskInfo: taskInfo, saveShow: false, taskSilderChange: "" })
    this.setUploadListWithDescFile(taskInfo)
  };
  tagChange = tag => {
    let { taskInfo, saveShow } = this.state;
    let oldTags = taskInfo.tags;
    let tags = [];
    let showFlag = true;
    tag.map(item => { tags.push(item) })
    if (oldTags && oldTags.length == tags.length) {
      tags.map(item => {
        let bb = true;
        oldTags.map(it => { if (it.id == item.id) { bb = false } })
        if (bb) { showFlag = false }
      })
    }
    if (tags.length === 0 && oldTags.length === 0) { showFlag = false }
    taskInfo.tags = tags;
    if (showFlag) {
      if (saveShow) {
        this.setState({ taskInfo: taskInfo })
      } else {
        this.setState({ animateClass: "animated_05s slideInDown2_7", taskInfo: taskInfo, saveShow: true })
        const _this = this;
        setTimeout(function () { _this.setState({ animateClass: "" }) }, 500)
      }
    } else {
      this.setState({ taskInfo: taskInfo })
    }
  };

  handleShowSave = () => {
    const { saveShow } = this.state;
    if (saveShow) return false;
    this.setState({ saveShow: true, animateClass: "animated_05s slideInDown2_7" })
    const _this = this;
    setTimeout(function () { _this.setState({ animateClass: "" }) }, 500)
  };
  //面包屑显示方式，超过11个字显示省略号
  subTaskNameBread = name => {
    return name && name.taskname ? name.taskname && name.taskname.length > 11 ? name.taskname.substring(0, 5) + "..." +
      name.taskname.substring(name.taskname.length - 5, name.taskname.length) : name.taskname : "";
  };
  //关注任务
  attentionClick = () => {
    let { taskInfo } = this.state;
    if (taskInfo.attention) {
      cancelAttentionWitchTask(taskInfo.id, data => {
        if (data.err) { return false }
        message.success("取消成功");
        const task = { id: taskInfo.id, attention: false }
        this.props.updatedTaskCallBack(task);
        taskInfo.attention = false;
        let user = Storage.get("user");
        taskInfo.collectList.map((ite, i) => {
          if (ite.id === user.id) {
            taskInfo.collectList.splice(i, 1);
            return false;
          }
        });
        this.setState({ taskInfo: taskInfo });
      }, this.props.isSmall)
    } else {
      addAttentionWitchTask(taskInfo.id, data => {
        if (data.err) { return false }
        message.success("关注成功");
        const task = { id: taskInfo.id, attention: true };
        this.props.updatedTaskCallBack(task);
        taskInfo.attention = true;
        let user = Storage.get("user");
        taskInfo.ollectList.push(user);
        this.setState({ taskInfo: taskInfo });
      }, this.props.isSmall);
    }
  };
  writeContent = item => {
    this.setState({
      publishObj: {
        newTalkReplyUserId: item.createBy.id,
        newTalkDesc: "",
        newTalkFiles: [],
        newTalkPromptTxt: "@" + item.createBy.name,
        people: { id: item.createBy.id, name: item.createBy.name }
      }
    });
  };
  //钉钉选人组件
  selUser(title, jurisdiction) {
    if (!jurisdiction) { return }
    let selectedUsers = [];
    let { taskInfo } = this.state;
    const that = this;
    dingJS.selectUser(selectedUsers, "请选择" + title, data => {
      const user = data[0];
      if (title === "负责人") {
        if (user.emplId !== taskInfo.fzr.userid) {
          user.photo = data[0].avatar;
          taskInfo.fzr = { ...user };
          that.setState({ taskInfo: taskInfo });
          that.setState({ saveShow: true });
        }
      } else if (title === "确认人") {
        if (user.emplId !== taskInfo.qrr.userid) {
          user.photo = data[0].avatar;
          taskInfo.qrr = { ...user };
          that.setState({ taskInfo: taskInfo });
          that.setState({ saveShow: true });
        }
      }
    }, false, this.props.isSmall)
  }
  //粘贴图片显示在下边
  setUploadListWithDescFile = taskInfo => {
    if (!taskInfo) { taskInfo = this.state.taskInfo }
    let uploadList_desc = []
    taskInfo.descFiles.map((item, i) => {
      if (!item.type) {
        uploadList_desc.push({ uid: item.id, name: item.fileName ? item.fileName : item.name, status: "done", url: item.fileUrlAbsolute, typeSet: item.fileName ? "DescFile" : "DescStrFile" });
      }
    })
    this.setState({ uploadList_desc: uploadList_desc });
  };
  //任务描述图片
  uploadListOnChange_desc = list => {
    this.setState({ uploadList_desc: list.fileList });
    let { taskInfo } = this.state;
    if (list.file.status === "done") {
      taskInfo.descFiles.push({ id: list.file.response.data.id, uid: list.file.uid })
      this.setState({ taskInfo: taskInfo, saveShow: true });
    } else if (list.file.status === "removed") {
      switch (list.file.typeSet) {
        case "DescFile":
          taskInfo.descFiles.map((item, i) => {
            if (item.id === list.file.uid) {
              taskInfo.descFiles[i].type = "DELL";
              this.setState({ taskInfo: taskInfo, saveShow: true });
              return false;
            }
          });
          break;
        default:
          taskInfo.descFiles.map((item, i) => {
            if (item.id === list.file.uid) {
              taskInfo.descFiles.splice(i, 1);
              this.setState({ taskInfo: taskInfo, saveShow: true });
              return false;
            }
          });
          break;
      }
    }
  };
  // 钉钉图片预览方法
  handlePreview = (type, file) => {
    const files = { fileUrlAbsolute: file.url || file.thumbUrl };
    const { taskInfo, uploadList_state } = this.state;
    const urlList = [];
    switch (type) {
      case "desc":
        if (taskInfo.descFiles.length > 0) {
          taskInfo.descFiles.map(item => { urlList.push(item.fileUrlAbsolute) });
        }
        dingJS.previewImages(files, "", urlList);
        break;
      case "finish":
        if (uploadList_state.length > 0) {
          uploadList_state.map(item => { urlList.push(item.fileUrlAbsolute) });
        }
        dingJS.previewImages(files, "", urlList);
        break;
    }
  };
  //粘贴图片方法
  pasteingImg = (type, e) => {
    pasteImg(e, url => {
      updateImgsInService(
        url,
        data => {
          if (data.err) {
            return false;
          }
          const fileObj = data;
          if (type === "描述附件") {
            fileObj.type = "";
            let { taskInfo } = this.state;
            taskInfo.descFiles.push(fileObj);
            this.setUploadListWithDescFile(taskInfo);
            this.setState({ saveShow: true, taskInfo: taskInfo });
          } else if (type === "标记完成") {
            fileObj.type = "";
            fileObj.uid = fileObj.id;
            fileObj.name = fileObj.fileName;
            fileObj.status = "done";
            fileObj.thumbUrl = fileObj.fileUrlAbsolute;
            fileObj.url = fileObj.fileUrlAbsolute;
            let { taskCompletFiles } = this.state;
            taskCompletFiles.push(fileObj);
            this.setState({
              taskCompletFiles: taskCompletFiles,
              uploadList_state: taskCompletFiles
            });
          }
        },
        this.props.isSmall
      );
    });
  };
  // 删除附件方法
  dellDescFileById = id => {
    let { taskInfo } = this.state;
    taskInfo.descFiles.map((item, i) => {
      if (item.fileId === id) {
        taskInfo.descFiles[i].type = "DELL";
        this.setState({ taskInfo: taskInfo });
        this.setState({ saveShow: true });
        return false;
      }
    });
  };
  //认领任务
  claimTask = () => {
    claimTaskById(
      [this.state.taskInfo.id],
      data => {
        if (data.err) { return false }
        message.success("认领成功！");
        this.getTaskDetail(this.state.taskInfo.id, this.props.projectId);
      }, this.props.isSmall)
    this.upDataListInfo();
  };
  //标记完成
  completTask = () => {
    let taskId = this.state.taskInfo.id;
    getSonTask(taskId, res => {
      if (res.err) { return false }
      if (res.isSonTask == "true") {
        this.setState({ childTaskModalShow: true, sonTaskinfoList: res.antTaskinfoList, taskCompletFiles: [] })
      } else {
        const { taskInfo } = this.state;
        if (taskInfo.planBeginTime == null || moment(taskInfo.planBeginTime) > moment()) {
          this.setState({ relityBegTime: moment().add(-parseInt(taskInfo.workTime), "day").add(-((taskInfo.workTime - parseInt(taskInfo.workTime)) * 24), "H") })
        } else {
          this.setState({ relityBegTime: moment(taskInfo.planBeginTime) })
        }
        this.setState({ taskCompleteModalShow: true, taskCompletDesc: "", taskCompletFiles: [] })
      }
      this.getFileList(this.state.taskInfo.id);
    }, this.props.isSmall)
  };
  //完成子任务并继续
  complateChildTasks = () => {
    const { sonTaskinfoList } = this.state;
    var ids = [];
    sonTaskinfoList.forEach(element => {
      ids.push(element.id);
    });
    let upStateCode = {
      id: this.state.taskInfo.id,
      projectId: this.props.projectId,
      state: "1", // 0重启 1完成 1审核通过 0驳回 4终止
      taskSignRemarks: "", // 审核说明 完成说明
      taskIds: ids
    };
    updateTaskStateByCode(
      upStateCode,
      data => {
        if (data.err) {
          return false;
        }
        this.getTaskDetail(this.state.taskInfo.id, this.props.projectId);
      },
      this.props.isSmall
    );
  };
  updateImg(type) {
    dingJS.uploadImage(res => {
      const data = res.data;
      if (type === "描述附件") {
        let { taskInfo } = this.state;
        let descFiles = taskInfo.descFiles ? taskInfo.descFiles : [];
        data.map((item, i) => {
          descFiles.push(item);
        });
        taskInfo.descFiles = descFiles;
        this.setState({
          taskInfo: taskInfo,
          saveShow: true,
          LimitTextLength: 0,
          TIMESHOW: false
        });
      } else if (type === "成果文件") {
        let { filesList, taskInfo } = this.state;
        data.map((item, i) => {
          filesList.taskinfoFiles.push(item);
        });
        this.setState({ filesList: filesList });
        updateDingFileService(
          taskInfo.id,
          "3",
          data,
          resData => {
            if (resData.err) {
              return false;
            }
            this.getTaskDetail(taskInfo.id, this.props.projectId);
          },
          this.props.isSmall
        );
      } else if (type === "讨论附件") {
        let { newTalkFiles } = this.state;
        data.map((item, i) => {
          newTalkFiles.push(item);
        });
        this.setState({ newTalkFiles: newTalkFiles, LimitTextLength: 0 });
      } else if (type === "标记完成") {
        let { taskCompletFiles } = this.state;
        data.map((item, i) => {
          taskCompletFiles.push(item);
        });
        this.setState({ taskCompletFiles: taskCompletFiles });
      }
    }, true);
  }
  setTask(type, state, txt = "") {
    if (type === "删除任务") {
      this.setState({ taskInfoLoading: true });
      deleteTaskById(
        this.state.taskInfo.id,
        this.props.projectId,
        data => {
          if (data.err) {
            return false;
          }
          message.success(type + "成功！");
          this.setState({ taskInfoLoading: false });
          this.props.closeCallBack();
          if (this.props.updatedTaskCallBack) {
            const { state, parentId, id } = this.state.taskInfo;
            this.props.updatedTaskCallBack({
              id: id,
              delTask: true,
              parentId: parentId,
              state: state
            });
          }
        },
        this.props.isSmall
      );
    } else {
      let taskCompletFiles = [];
      this.state.taskCompletFiles.map(item => {
        if (item.response) {
          taskCompletFiles.push(item.response.data);
        } else {
          taskCompletFiles.push(item);
        }
      });
      let upStateCode = {
        id: this.state.taskInfo.id,
        projectId: this.props.projectId,
        state: state, // 0重启 1完成 1审核通过 0驳回 4终止
        taskSignRemarks: txt, // 审核说明 完成说明
        fileList: taskCompletFiles,
        realityBeginTimeString: moment(this.state.relityBegTime).format("YYYY-MM-DD HH:mm:ss")
      };
      this.setState({ taskInfoLoading: true });
      updateTaskStateByCode(
        upStateCode,
        data => {
          if (data.err) {
            return false;
          }
          this.upDataListInfo();
          message.success(type + "成功！");
          this.getTaskDetail(this.state.taskInfo.id, this.props.projectId);
          if (type === "标记完成") {
            this.setState({
              taskCompleteModalShow: false,
              taskCompletLoading: false
            });
          } else if (type === "任务驳回" || type === "任务通过") {
            this.setState({
              taskCheckModalShow: false,
              taskCheckLoading_x: false,
              taskCheckLoading_v: false
            });
          }
          this.setState({ taskCompletFiles: [] });
        },
        this.props.isSmall
      );
      this.setState({ taskInfoLoading: false, uploadList_state: [] });
    }
  }
  showConfirm(type, state, msg) {
    const that = this;
    confirm({
      title: msg,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        that.setTask(type, state);
      },
      onCancel() { }
    });
  }
  //终止或者重启任务
  terminationRestartTask = (stateTask, dec) => {
    let upStateCode = {
      id: this.state.taskInfo.id,
      projectId: this.props.projectId,
      state:
        stateTask === "4" || stateTask === "1" || stateTask === "8" ? "0" : "4", // 0重启 1完成 1审核通过 0驳回 4终止
      taskSignRemarks: dec // 审核说明 完成说明
    };
    updateTaskStateByCode(
      upStateCode,
      data => {
        if (data.err) {
          return false;
        }
        this.getTaskDetail(this.state.taskInfo.id, this.props.projectId);
        this.setState({ terResTaskDesc: "" });
        this.upDataListInfo();
      },
      this.props.isSmall
    );
  };
  //催办

  urgeTask = type => {
    const { urgeTaskDesc } = this.state;
    let ids = [];
    let urgeType = "";
    if (type === "本任务") {
      ids = [this.state.taskInfo.id];
    }
    urgeTaskById(
      urgeTaskDesc,
      ids,
      this.state.taskInfo.id,
      urgeType,
      data => {
        if (data.err) {
          return false;
        }
        message.success("催办成功！");
        this.setState({
          UrgeShow: false,
          LimitTextLength: 0,
          urgeTaskDesc: ""
        });
      },
      this.props.isSmall
    );
  };
  // 设置里程碑
  milestone = (e, type, taskId) => {
    const { taskInfo } = this.state;
    e.stopPropagation();
    e.preventDefault();
    if (type === "设置") {
      setMilestoneWithTask(taskId, data => {
        if (data.err) {
          return false;
        }
        if (data) {
          message.success("设置里程碑成功！");
          taskInfo.milestone = "1";
          this.setState({ taskInfo: taskInfo });
          const task = {
            id: taskId,
            milestone: "1"
          };
          this.props.updatedTaskCallBack(task);
          this.getTaskDetail(taskId, this.props.projectId);
          //设置成功后任务列表刷新操作
          // this.props.taskAttentionCallBack({ id: taskId, milestone: "1" });
        }
      });
    } else {
      setMilestoneWithTask(taskId, data => {
        if (data.err) {
          return false;
        }
        if (data) {
          taskInfo.milestone = "0";
          this.setState({ taskInfo: taskInfo });
          message.success("取消里程碑成功！");
          const task = {
            id: taskId,
            milestone: "0"
          };
          this.props.updatedTaskCallBack(task);
          this.getTaskDetail(taskId, this.props.projectId);

          // this.props.taskAttentionCallBack({ id: taskId, milestone: "0" });
        }
      });
    }
  };

  //返回时间 是否可以修改时间
  returnTimeVal = val => {
    if (
      val.state === "1" ||
      val.state === "8" ||
      val.state === "9" ||
      val.state === "2" ||
      val.state === "4"
    ) {
      return true;
    } else {
      return false;
    }
  };

  //返回时间 显示截止时间 还是完成时间
  returnTimeVals = val => {
    if (val.state === "1" || val.state === "8" || val.state === "9") {
      return false; //显示完成时间
    } else {
      return true;
    }
  };
  toggleMoneyInfo() {
    this.setState({ taskMoveShow: true });
  }
  handleMouseOut(ev) {
    const { isFocus } = this.state;
    var oEvent = ev || event;
    var reltg = oEvent.fromElement || oEvent.relatedTarget;
    //其中oEvent.fromElement兼容IE，chrome
    //oEvent.relatedTarget;兼容FF。
    if (reltg && !reltg.isEqualNode(ev.target)) {
      reltg = reltg.parentNode;
    }

    if (reltg && reltg.className) {
      if (
        reltg.className == "taskTag" ||
        reltg.className == "scroll-wrap" ||
        reltg.className == "bgc" ||
        reltg.className == "item" ||
        reltg.className == "wrap"
      ) {
        if (!isFocus) {
          this.setState({
            addaccessory: false,
            taskSilderChange: "change"
          });
        }
      }
    }
  }
  initGetPeopleList() {
    const { taskInfo } = this.state;
    let bodyJson = taskInfo.projectAll;
    if (bodyJson) {
      bodyJson.searchvalue = "";
      getAtSelectUser(bodyJson, data => {
        this.setState({ peopleAllList: data }, () => { });
      });
    }
  }

  // 完成上传文件
  uploadListOnChange_updateState(list) {
    this.setState({ uploadList_state: list.fileList });
    let { taskCompletFiles } = this.state;

    if (list.file.status === "done") {
      taskCompletFiles.push(list.file.response.data);
      this.setState({ taskCompletFiles: taskCompletFiles });
    } else if (list.file.status === "removed") {
      taskCompletFiles.map((item, i) => {
        if (item.id === list.file.uid) {
          taskCompletFiles = taskCompletFiles.splice(i, 1);
          this.setState({
            taskCompletFiles: taskCompletFiles,
            uploadList_state: taskCompletFiles
          });
          return false;
        }
      });
    }
  }
  DingTaskRespone = () => {
    const { taskInfo } = this.state;
    let usersid = [];
    if (taskInfo.state === "2") {
      usersid.push(taskInfo.qrr.userid);
    } else {
      usersid.push(taskInfo.fzr.userid);
    }
    dingJS.DingMessage(
      usersid,
      taskInfo.number,
      taskInfo.name,
      taskInfo.proname
    );
  };
  //删除成果文件

  dellTaskOkFile(id) {
    let { taskCompletFiles } = this.state;
    taskCompletFiles.map((item, i) => {
      if (item.fileId === id) {
        taskCompletFiles.splice(i, 1);
        this.setState({ taskCompletFiles: taskCompletFiles });
        return false;
      }
    });
  }
  modeChange2 = (date, mode) => {
    if (mode === "time") {
      this.setState({ beginTimeShow: false });
    }
  };
  dateChange2 = (date, dataStr) => {
    if (dataStr === "") {
      this.setState({ beginTimeShow: true });
    }
    this.valChange("planBeginTime", dataStr);
  };
  dateChange3 = (date, dataStr) => {
    this.setState({ relityBegTime: dataStr })
  };
  //不可选的开始时间Date，在截止时间存在的情况下 必须大于截止时间
  disabledDateStart = current => {
    const { taskInfo } = this.state
    // console.log("截止时间为:", taskInfo.planEndTime);
    return current > moment(taskInfo.planEndTime)
  };
  //不可选的截止时间Date
  disabledDateEnd = current => {
    const { taskInfo } = this.state;
    if (taskInfo.planBeginTime) { return current <= moment(taskInfo.planBeginTime); }
  };
  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) { result.push(i); }
    return result;
  }
  //不可选开始时间的Time
  disabledDateStartTime = () => {
    const { taskInfo } = this.state;
    let endTime = moment(taskInfo.planEndTime).format("YYYY-MM-DD");
    let startTime = moment(taskInfo.planBeginTime).format("YYYY-MM-DD");
    if (taskInfo.planEndTime !== "" && taskInfo.planEndTime !== null && taskInfo.planEndTime.length > 10 && moment(endTime).isSame(startTime) //开始时间和截止时间是否是同一天
    ) { return { disabledHours: () => this.range(0, 24).splice(parseInt(moment(taskInfo.planEndTime).format("H")), 24) } }
  };
  //不可选截止时间Time
  disabledDateEndTime = () => {
    const { taskInfo } = this.state;
    let endTime = moment(taskInfo.planEndTime).format("YYYY-MM-DD");
    let startTime = moment(taskInfo.planBeginTime).format("YYYY-MM-DD");
    if (taskInfo.planBeginTime !== "" && taskInfo.planBeginTime !== null && taskInfo.planBeginTime.length > 10 && moment(endTime).isSame(startTime) //开始时间和截止时间是否是同一天
    ) {
      return { disabledHours: () => this.range(0, 24).splice(0, parseInt(moment(taskInfo.planBeginTime).format("H")) + 1) };
    }
  };
  render() {
    const {
      saveShow, animateClass, taskInfo, jurisdiction, taskInfoLoading, publishObj, detailTxtEdit, uploadList_desc, addaccessory, taskCompleteModalShow,
      taskCompletLoading, taskCompletDesc, taskCheckModalTitle, taskCheckModalShow, taskCheckDesc, childTaskModalShow, sonTaskinfoList, user, taskCheckLoading_x,
      taskCheckLoading_v, packUp, peopleAllList, uploadList_state, childList, childListLoading, coopList, coopListLoading, fileList, filesListLoading,
      taskCompletFiles, isIos, terminationRestartTaskShow, terResTaskDesc, isDealDates, urgeTaskDesc, UrgeShow, LimitTextLength, beginTimeShow, relityBegTime, TIMESHOW
    } = this.state;
    let datadetail = null;
    let isDealDate = false;
    if (this.returnTimeVals(taskInfo)) {
      //完成时间
      datadetail = taskInfo.planEndTime ? taskInfo.planEndTime && taskInfo.planEndTime.indexOf("23:59:59") > -1 ? taskInfo.planEndTime.split(" ")[0] + " 00:00:00" : taskInfo.planEndTime : null;
      isDealDate = taskInfo.planEndTime && taskInfo.planEndTime.indexOf("23:59:59") > -1 ? true : false;
    } else {
      datadetail = taskInfo.realityEndTime ? taskInfo.realityEndTime : null;
    }
    //展示开始时间还是真实开始时间
    let startTimeDetail = null;
    if (this.returnTimeVals(taskInfo)) {
      startTimeDetail = taskInfo.planBeginTime ? taskInfo.planBeginTime && taskInfo.planBeginTime.indexOf("23:59:59") > -1 ? taskInfo.planBeginTime.split(" ")[0] : taskInfo.planBeginTime : null;
    } else {
      startTimeDetail = taskInfo.realityBeginTime ? taskInfo.realityBeginTime : null;//真实开始时间
    }
    let goButton = "";
    let goButtonAnd = "";
    if (!taskInfo.fzr && taskInfo.state != "4") {
      goButton = (
        <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.claimTask() }}>认领任务 </Button>
      );
    } else if (taskInfo.stateButton) {
      goButton = (
        <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.completTask() }}>标记完成</Button>
      );
    } else if (taskInfo.flowButton) {
      goButtonAnd = (
        <Button style={{ marginRight: "10px" }} onClick={() => { this.setState({ taskCheckModalShow: true, taskCheckDesc: "", taskCheckModalTitle: "驳回任务", taskCompletFiles: [] }) }}>驳回</Button>
      );
      goButton = (
        <Button type="primary" onClick={() => { this.setState({ taskCheckModalShow: true, taskCheckDesc: "", taskCheckModalTitle: "确认完成", taskCompletFiles: [] }) }} style={{ marginRight: "10px" }}>确认完成 </Button>
      );
    } else if (taskInfo.state != "1" && taskInfo.state != "4" && taskInfo.state != "8" && taskInfo.state != "9") {
      goButton = (
        <div className="dingHover">
          <Button type="primary" onClick={() => { this.setState({ UrgeShow: true }) }} style={{ marginRight: "10px", width: 86 }} >催办</Button>
          <span className="ding" onClick={() => { this.DingTaskRespone() }}> DING一下 </span>
        </div>
      );
    }
    if (taskInfo.state == "2" && taskInfo.fzr && taskInfo.fzr.userid === user.userid) {
      goButtonAnd = (
        <Button onClick={() => { this.setTask("任务撤回", "0", "") }} style={{ marginRight: "10px" }}>撤回</Button>
      );
    }
    return (
      <div className="wrap">
        <Spin spinning={taskInfoLoading} />
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {saveShow && (
          <div className={saveShow ? `save-btn ${animateClass}` : "save-btn animated_Out"}>
            <div className="btn quxiao" onClick={this.handleCancel}>取消</div>
            <Button type="primary" className="btn" onClick={() => { this.save() }}>保存 </Button>
          </div>
        )}
        <Modal
          title="标记完成"
          visible={taskCompleteModalShow}
          onCancel={e => { this.setState({ taskCompleteModalShow: false }) }}
          wrapClassName="completeClass"
          footer={[
            <div>
              <div className="completeTime">
                <div className="beginTime">任务开始于：</div>
                <DatePicker
                  allowClear={false}
                  showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                  value={moment(relityBegTime)}
                  format={"YYYY-MM-DD HH:mm"}
                  locale={locale}
                  open={TIMESHOW}
                  onChange={this.dateChange3}
                  onOk={() => { this.setState({ TIMESHOW: false }); }}
                  disabledDate={this.disabledDateStart}
                  disabledTime={this.disabledDateStartTime}
                />
                <span className="timeChange" onClick={() => { this.setState({ TIMESHOW: true }) }} >修改</span>
              </div>
              <Button key="back" onClick={() => { this.setState({ taskCompleteModalShow: false, TIMESHOW: false }) }}>取消</Button>
              <Button key="submit" type="primary" loading={taskCompletLoading}
                onClick={() => { this.setTask("标记完成", "1", taskCompletDesc); this.setState({ taskCompletLoading: true, TIMESHOW: false }) }}
              >
                确定
            </Button>
            </div>
          ]}
        >
          <TextArea
            placeholder="完成说明"
            autosize={{ minRows: 2, maxRows: 6 }}
            value={taskCompletDesc}
            onFocus={() => { this.setState({ TIMESHOW: false }) }}
            onChange={e => { this.setState({ taskCompletDesc: e.target.value, TIMESHOW: false }) }}
            style={{ margin: "0 0 10px 0" }}
          />
          <div className="clearfix">
            <Upload
              action={baseURI + "/files/upload"}
              listType="picture-card"
              fileList={uploadList_state}
              onPreview={file => this.handlePreview("finish", file)}
              multiple={true}
              onChange={val => { if (beforeUpload(val.file)) { this.uploadListOnChange_updateState(val) } }}
            >
            </Upload>
          </div>
          <h4 className="filesTit">
            附件
            <Icon className="add" type="paper-clip" onClick={() => { this.updateImg("标记完成") }} />
          </h4>
          <ul className="accessory">
            {taskCompletFiles.map((item, i) => {
              if (item.fileId) {
                return (
                  <li key={item.fileId}>
                    <div className="fileIcon"> {createFileIcon(item.fileType)}</div>
                    <span className="textMore" onClick={() => { dingJS.previewImage(item) }}>{item.fileName}</span>
                    <div className="delte" style={{ right: 30 }}>
                      <Popconfirm
                        title={`是否要删除"${item.fileName}"`}
                        onConfirm={() => { this.dellTaskOkFile(item.fileId) }}
                        okText="删除"
                        cancelText="取消"
                      >
                        <Icon type="delete" />
                      </Popconfirm>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </Modal>
        <Modal
          title={taskInfo.state === "4" || taskInfo.state === "1" || taskInfo.state === "8" ? "重启任务" : "终止任务"}
          visible={terminationRestartTaskShow}
          onCancel={e => { this.setState({ terminationRestartTaskShow: false }) }}
          footer={[
            <Button key="back" onClick={e => { this.setState({ terminationRestartTaskShow: false }) }}>
              取消
            </Button>,
            <Button type="primary" onClick={e => {
              this.terminationRestartTask(taskInfo.state, terResTaskDesc);
              this.setState({ terminationRestartTaskShow: false });
            }}
            >
              {taskInfo.state === "4" || taskInfo.state === "1" || taskInfo.state === "8" ? "重启" : "终止"}
            </Button>
          ]}
        >
          <TextArea
            style={{ margin: "0 0 10px 0" }}
            placeholder={taskInfo.state === "4" || taskInfo.state === "1" || taskInfo.state === "8" ? "重启原因" : "终止原因"}
            value={terResTaskDesc}
            autosize={{ minRows: 2, maxRows: 6 }}
            onChange={e => { this.setState({ terResTaskDesc: e.target.value }) }}
          />
        </Modal>
        <Modal
          title="催办任务"
          wrapClassName="completeClass"
          visible={UrgeShow}
          onCancel={e => { this.setState({ UrgeShow: false, LimitTextLength: 0 }) }}
          footer={[
            <Button key="back" onClick={e => { this.setState({ UrgeShow: false, LimitTextLength: 0 }) }}>
              取消
            </Button>,
            <Button type="primary" key="backed" onClick={e => { this.urgeTask() }} >催办</Button>
          ]}
        >
          <TextArea
            placeholder="催办内容"
            maxLength="200"
            value={urgeTaskDesc}
            autosize={{ minRows: 2, maxRows: 7 }}
            onChange={e => {
              this.setState({ urgeTaskDesc: e.target.value, LimitTextLength: e.target.value.length })
            }}
          />
          <div className="maxText">
            <span>{LimitTextLength}</span>/<pan>200</pan>
          </div>
        </Modal>
        <Modal
          title={taskCheckModalTitle}
          visible={taskCheckModalShow}
          onCancel={e => { this.setState({ taskCheckModalShow: false }) }}
          footer={[
            <Button
              key="quxiao" onClick={() => { this.setState({ taskCheckModalShow: false }) }}
            >
              取消
            </Button>,
            taskCheckModalTitle === "驳回任务" ? (
              <Button
                key="back"
                type="primary"
                loading={taskCheckLoading_x}
                onClick={() => {
                  this.setTask("任务驳回", "0", taskCheckDesc);
                  this.setState({ taskCheckLoading: true });
                }}
              >
                驳回
              </Button>
            ) : (
                ""
              ),
            taskCheckModalTitle === "确认完成" ? (
              <Button key="submit"
                type="primary"
                loading={taskCheckLoading_v}
                onClick={() => {
                  this.setTask("任务通过", "1", taskCheckDesc);
                  this.setState({ taskCheckLoading: true });
                }}
              >
                通过
              </Button>
            ) : ("")
          ]}
        >
          <TextArea
            style={{ margin: "0 0 10px 0" }}
            placeholder={taskCheckModalTitle === "驳回任务" ? "驳回原因" : "完成说明"}
            value={taskCheckDesc}
            autosize={{ minRows: 2, maxRows: 6 }}
            onChange={e => { this.setState({ taskCheckDesc: e.target.value }) }}
          />
          <div className="clearfix">
            <Upload
              action={baseURI + "/files/upload"}
              listType="picture-card"
              fileList={uploadList_state}
              onPreview={file => this.handlePreview("finish", file)}
              multiple={true}
              onChange={val => {
                if (beforeUpload(val.file)) { this.uploadListOnChange_updateState(val) }
              }}
            >
            </Upload>
          </div>
          <h4 className="filesTit">
            附件
            <Icon className="add" type="paper-clip" onClick={() => { this.updateImg("标记完成") }} />
          </h4>
          <ul className="accessory">
            {taskCompletFiles.map((item, i) => {
              if (item.fileId) {
                return (
                  <li key={item.fileId}>
                    <div className="fileIcon"> {createFileIcon(item.fileType)}</div>
                    <span className="textMore" onClick={() => { dingJS.previewImage(item) }}>{item.fileName}</span>
                    <div className="delte" style={{ right: 30 }}>
                      <Popconfirm
                        title={`是否要删除"${item.fileName}"`}
                        onConfirm={() => { this.dellTaskOkFile(item.fileId) }}
                        okText="删除"
                        cancelText="取消"
                      >
                        <Icon type="delete" />
                      </Popconfirm>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </Modal>
        {/*包含未完成的子任务*/}
        <Modal
          title="包含未完成的子任务"
          visible={childTaskModalShow}
          onCancel={e => { this.setState({ childTaskModalShow: false }) }}
          footer={[
            <Button
              key="back"
              onClick={e => {
                this.setState({ childTaskModalShow: false });
              }}
            >
              取消
            </Button>,
            <Button
              type="primary"
              loading={this.state.childTaskLoading}
              onClick={e => {
                this.urgeChildTasks();
                this.setState({ childTaskModalShow: false });
              }}
            >
              催办子任务
            </Button>,
            <Button
              type="primary1"
              loading={this.state.childTaskLoading}
              onClick={() => {
                this.complateChildTasks();
                const { taskInfo } = this.state;
                if (taskInfo.planBeginTime == null || moment(taskInfo.planBeginTime) > moment()) {
                  this.setState({ relityBegTime: moment().add(-parseInt(taskInfo.workTime), "day").add(-((taskInfo.workTime - parseInt(taskInfo.workTime)) * 24), "H") })
                } else {
                  this.setState({ relityBegTime: moment(taskInfo.planBeginTime) })
                }
                this.setState({
                  childTaskModalShow: false,
                  taskCompleteModalShow: true
                });
              }}
            >
              完成子任务，并继续
            </Button>
          ]}
        >
          <div className="childTaskModal">
            <h3> 共有 <span style={{ color: "#f77575" }}>  {sonTaskinfoList ? sonTaskinfoList.length : "0"} </span> 条未完成的子任务</h3>
            <div>
              {sonTaskinfoList && sonTaskinfoList.length > 0 ? sonTaskinfoList.map((item, i) => {
                return (
                  <p className="taskList" key={item.id}>
                    <span className="taskWbs">  {item.taskinfoNumber.numberS ? item.taskinfoNumber.numberS + "." + item.rank : item.rank} </span>
                    <font className="taskName">{item.taskname}</font>
                  </p>
                );
              })
                : ""}
            </div>
          </div>
        </Modal>
        <div className="fixed-head" ref="fixedHead">
          <div className="crumbs clearfloat" ref="crumbs">
            <div className="crumb-wrap">
              <div className="breadList" style={{ color: "#64b5f6" }}>
                <a
                  style={{ textDecoration: "none" }}
                  href={`dingtalk://dingtalkclient/action/openapp?corpid=${user.antIsvCorpSuite && user.antIsvCorpSuite.corpid && user.antIsvCorpSuite.corpid}&container_type=work_platform&app_id=4298`}>
                  打开控制台
                </a>
              </div>
            </div>
          </div>
          <div className="task-title" ref="title">
            <div className="task-status"
              style={{ top: setColorTaskState(taskInfo.state).Color.top, left: setColorTaskState(taskInfo.state).Color.left }}
            >
              {setColorTaskState(taskInfo.state).name}
            </div>
            <div
              className="triangle_border"
              style={{ borderColor: setColorTaskState(taskInfo.state).Color.borderColor }}
            />
            <div className="left">
              <span>#{taskInfo.number}</span>
              {jurisdiction ? (
                taskInfo.modifyPermission ? (
                  <TextArea
                    className="titleBox"
                    placeholder="请输入标题"
                    autosize
                    value={taskInfo.name}
                    maxLength="50"
                    style={{ backgroundColor: "#fff", color: "#212121", resize: "none" }}
                    onChange={e => { this.valChange("name", e.target.value.replace("\n", "")) }}
                  />
                ) : (
                    <Tooltip placement="top" title={`您没有修改这条任务的权限`} overlayClassName="createOverlayClass">
                      <TextArea
                        className="titleBox"
                        placeholder="请输入标题"
                        value={taskInfo.name}
                        disabled
                        style={{ backgroundColor: "#fff", color: "#212121", resize: "none" }}
                      />
                    </Tooltip>
                  )
              ) : (
                  <div className="show">{taskInfo.name}</div>
                )}
            </div>
            <div className="right">
              <div className="btn" style={{ display: "flex" }}>
                {goButtonAnd}
                {goButton}
              </div>
            </div>
          </div>
        </div>

        <div ref="scrollEle" id="scrollWrap" className="scroll-wrap">
          <div ref="heightCenter">
            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i className="icon-user iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys">负责人</span>
                </div>
                <div className="right">
                  {jurisdiction ? (
                    taskInfo.modifyPermission ? (
                      <div className="person">
                        {taskInfo.fzr && taskInfo.fzr.photo && taskInfo.fzr.photo !== "" ? (
                          <img src={taskInfo.fzr && taskInfo.fzr.photo} />
                        ) : taskInfo.fzr.name ? (
                          <div className="noPhoto"> {taskInfo.fzr.name.substr(0, 1)}</div>
                        ) : (
                              <svg className="download" aria-hidden="true">
                                <use xlinkHref="#icon-file-avatar" />
                              </svg>
                            )}
                        {taskInfo.fzr && taskInfo.fzr.name ? (
                          <span onClick={() => {
                            this.selUser("负责人", jurisdiction && taskInfo.modifyPermission);
                          }}
                          >
                            {taskInfo.fzr.name}
                          </span>
                        ) : (
                            <span
                              onClick={() => {
                                this.selUser("负责人", jurisdiction && taskInfo.modifyPermission);
                              }}
                              style={{ color: "#bdbdbd" }}
                            >
                              选择
                          </span>
                          )}
                        {taskInfo.fzr && taskInfo.fzr.name ? (
                          <div className="delPerson">
                            <Icon
                              type="close-circle"
                              onClick={e => { e.stopPropagation(); e.preventDefault(); this.valChange("fzr", "DELL"); }}
                            />
                          </div>
                        ) : ("")}
                      </div>
                    ) : (
                        <Tooltip
                          placement="top"
                          title={`您没有修改这条任务的权限`}
                          overlayClassName="createOverlayClass"
                          trigger="hover"
                        >
                          <div className="person" style={{ width: 140 }}>
                            {taskInfo.fzr && taskInfo.fzr.photo ? (
                              <img src={taskInfo.fzr && taskInfo.fzr.photo} />
                            ) : taskInfo.fzr && taskInfo.fzr.name ? (
                              <div className="noPhoto">
                                {taskInfo.fzr.name.substr(0, 1)}
                              </div>
                            ) : (
                                  <svg className="download" aria-hidden="true">
                                    <use xlinkHref="#icon-file-avatar" />
                                  </svg>
                                )}
                            {taskInfo.fzr && taskInfo.fzr.name ? (
                              <span>{taskInfo.fzr.name}</span>
                            ) : (
                                <span style={{ color: "#bdbdbd" }}>选择</span>
                              )}
                          </div>
                        </Tooltip>
                      )
                  ) : (
                      <div className="person">
                        {taskInfo.fzr && taskInfo.fzr.photo ? (
                          <img src={taskInfo.fzr && taskInfo.fzr.photo} />
                        ) : taskInfo.fzr && taskInfo.fzr.name ? (
                          <div className="noPhoto">
                            {taskInfo.fzr.name.substr(0, 1)}
                          </div>
                        ) : (
                              <svg className="download" aria-hidden="true">
                                <use xlinkHref="#icon-file-avatar" />
                              </svg>
                            )}
                        {taskInfo.fzr && taskInfo.fzr.name ? (
                          <span>{taskInfo.fzr.name}</span>
                        ) : (
                            <span style={{ color: "#bdbdbd" }}>选择</span>
                          )}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="task-info">
              <div className="item" ref="confirm">
                <div className="left">
                  <i className="icon-checker iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys">确认人</span>
                </div>
                <div className="right">
                  {jurisdiction ? (
                    taskInfo.modifyPermission ? (
                      <div className="person">
                        {taskInfo.qrr && taskInfo.qrr.photo ? (
                          <img src={taskInfo.qrr && taskInfo.qrr.photo} />
                        ) : taskInfo.qrr && taskInfo.qrr.name ? (
                          <div className="noPhoto">
                            {taskInfo.qrr.name.substr(0, 1)}
                          </div>
                        ) : (
                              <svg className="download" aria-hidden="true">
                                <use xlinkHref="#icon-file-avatar" />
                              </svg>
                            )}
                        <span
                          style={taskInfo.qrr && taskInfo.qrr.name ? { color: "#424242" } : { color: "#bdbdbd" }}
                          onClick={() => { this.selUser("确认人", jurisdiction && taskInfo.modifyPermission) }}
                        >
                          {taskInfo.qrr && taskInfo.qrr.name ? taskInfo.qrr.name : "选择"}
                        </span>
                        {taskInfo.qrr.name ? (
                          <div className="delPerson">
                            <Icon type="close-circle"
                              onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.valChange("qrr", "DELL");
                              }}
                            />
                          </div>
                        ) : (
                            ""
                          )}
                      </div>
                    ) : (
                        <Tooltip
                          placement="top"
                          title={`您没有修改这条任务的权限`}
                          overlayClassName="createOverlayClass"
                          trigger="hover"
                        >
                          <div className="person" style={{ width: 140 }}>
                            {taskInfo.qrr && taskInfo.qrr.photo ? (
                              <img src={taskInfo.qrr && taskInfo.qrr.photo} />
                            ) : taskInfo.qrr && taskInfo.qrr.name ? (
                              <div className="noPhoto">
                                {taskInfo.qrr.name.substr(0, 1)}
                              </div>
                            ) : (
                                  <svg className="download" aria-hidden="true">
                                    <use xlinkHref="#icon-file-avatar" />
                                  </svg>
                                )}
                            <span
                              style={taskInfo.qrr && taskInfo.qrr.name ? { color: "#424242" } : { color: "#bdbdbd" }}
                            >
                              {taskInfo.qrr && taskInfo.qrr.name ? taskInfo.qrr.name : "选择"}
                            </span>
                          </div>
                        </Tooltip>
                      )
                  ) : taskInfo.qrr ? (
                    <div className="person">
                      {taskInfo.qrr && taskInfo.qrr.photo ? (
                        <img src={taskInfo.qrr && taskInfo.qrr.photo} />
                      ) : taskInfo.qrr && taskInfo.qrr.name ? (
                        <div className="noPhoto">
                          {taskInfo.qrr.name.substr(0, 1)}
                        </div>
                      ) : (
                            <svg className="download" aria-hidden="true">
                              <use xlinkHref="#icon-file-avatar" />
                            </svg>
                          )}
                      <span style={taskInfo.qrr && taskInfo.qrr.name ? { color: "#424242" } : { color: "#bdbdbd" }} className={!taskInfo.qrr ? "empty" : ""} >
                        {taskInfo.qrr ? taskInfo.qrr.name : "选择"}
                      </span>
                    </div>
                  ) : (<span style={{ fontSize: 14, color: "#bdbdbd" }}>  未设置 </span>)}
                </div>
              </div>
            </div>

            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i className="icon-calendar1 iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys ">开始时间</span>
                </div>
                <div className="right">
                  {taskInfo.modifyPermission ? (
                    <DatePicker
                      disabled={this.returnTimeVal(taskInfo)}
                      value={startTimeDetail ? moment(startTimeDetail) : null}
                      onPanelChange={this.modeChange2}
                      onChange={this.dateChange2}
                      placeholder={this.returnTimeVal(taskInfo) ? "未设置" : "设置开始时间"}
                      format={beginTimeShow ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                      className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : beginTimeShow ? "timePicker showTime" : "timePicker"}
                      locale={locale}
                      suffixIcon={null}
                      showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                      disabledDate={this.disabledDateStart}
                      disabledTime={this.disabledDateStartTime}
                    />
                  ) : (
                      <Tooltip placement="top" title={`您没有修改这条任务的权限`} overlayClassName="createOverlayClass" trigger="hover">
                        <div style={{ fontSize: 14, width: 140 }}>
                          {this.returnTimeVals(taskInfo) ? (taskInfo.planBeginTime ? (taskInfo.planBeginTime.substring(0, taskInfo.planBeginTime.length - 3)
                          ) : (<span style={{ color: "#bdbdbd" }}> 选择开始时间  </span>)) : taskInfo.realityBeginTime ? (
                            taskInfo.realityBeginTime.substring(0, taskInfo.realityBeginTime.length - 3)
                          ) : (<span style={{ color: "#bdbdbd" }}>选择开始时间</span>)}
                        </div>
                      </Tooltip>
                    )}
                </div>
              </div>
            </div>

            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i className="icon-calendar1 iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys ">  {taskInfo.state === "1" || taskInfo.state === "8" || taskInfo.state === "9" ? "完成时间" : "截止时间"}</span>
                </div>
                <div className="right">
                  {taskInfo.modifyPermission ? (
                    <DatePicker
                      className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : "timePicker "}
                      onPanelChange={(val, mode) => {
                        if (mode === "time") {
                          this.setState({ modeTime: false, isDealDates: false })
                        } else {
                          this.setState({ modeTime: true })
                        }
                      }}
                      locale={locale}
                      format={isDealDates ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                      suffixIcon={null}
                      placeholder="选择截止时间"
                      disabled={this.returnTimeVal(taskInfo)}
                      value={datadetail ? moment(datadetail) : null}
                      showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                      onChange={(data, strData) => {
                        if (strData == "") {
                          this.setState({ isDealDates: true })
                        }
                        this.valChange("planEndTime", strData)
                      }}
                      disabledDate={this.disabledDateEnd}
                      disabledTime={this.disabledDateEndTime}
                    />
                  ) : (
                      <Tooltip placement="top" title={`您没有修改这条任务的权限`} overlayClassName="createOverlayClass" trigger="hover">
                        <div style={{ fontSize: 14, width: 140 }}>
                          {this.returnTimeVals(taskInfo) ? (taskInfo.planBeginTime ? (taskInfo.planBeginTime.substring(0, taskInfo.planBeginTime.length - 3)
                          ) : (<span style={{ color: "#bdbdbd" }}> 选择截止时间  </span>)) : taskInfo.realityBeginTime ? (
                            taskInfo.realityBeginTime.substring(0, taskInfo.realityBeginTime.length - 3)
                          ) : (<span style={{ color: "#bdbdbd" }}>选择截止时间</span>)}
                        </div>
                      </Tooltip>
                    )}
                </div>
              </div>
            </div>
            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i className="icon-target1 iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys">任务绩效</span>
                </div>
                <div className="right" style={{ height: 32 }}>
                  {taskInfo.modifyPermission ||
                    (taskInfo.qrr && taskInfo.qrr.id === user && user.id) ? (
                      taskInfo.state !== "4" ? (
                        <Input
                          style={{ border: "none", width: "140px", height: 24, color: "#424242" }}
                          value={taskInfo.taskMoney ? taskInfo.taskMoney : ""}
                          onChange={e => {
                            onlyNumber(e.target);
                            this.valChange("taskMoney", e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"));
                          }}
                        />
                      ) : (
                          <Input
                            style={{ border: "none", width: "140px", height: 24, color: "#424242", backgroundColor: "#fff" }}
                            placeholder="未设置"
                            value={taskInfo.taskMoney ? taskInfo.taskMoney : ""}
                            disabled={true}
                          />
                        )
                    ) : (
                      <Tooltip placement="top" title={`您没有修改这条任务的权限`} overlayClassName="createOverlayClass" trigger="hover" >
                        <Input
                          style={{ border: "none", width: "140px", height: 24, color: "#424242", backgroundColor: "#fff" }}
                          value={taskInfo.taskMoney ? taskInfo.taskMoney : ""}
                          placeholder="未设置"
                          disabled={true}
                        />
                      </Tooltip>
                    )}
                </div>
              </div>
            </div>
            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i className="icon-timer iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify justifys">计划工期</span>
                </div>
                <div className="right">
                  <div className="valBox">
                    <div className="val">
                      {jurisdiction ? (
                        taskInfo.modifyPermission ? (
                          <Input
                            style={{ height: 24, fontSize: 14, color: "#424242" }}
                            value={taskInfo.workTime ? taskInfo.workTime : ""}
                            placeholder="未设置"
                            onChange={e => {
                              onlyNumber(e.target);
                              this.valChange("workTime", e.target.value);
                            }}
                          />
                        ) : (
                            <Tooltip
                              placement="top"
                              title={`您没有修改这条任务的权限`}
                              overlayClassName="createOverlayClass"
                              trigger="hover"
                            >
                              <div style={{ fontSize: 14, color: "#424242" }}>
                                {taskInfo.workTime ? taskInfo.workTime : "未设置"}
                              </div>
                            </Tooltip>
                          )
                      ) : (
                          <div style={{ fontSize: 14, color: "#424242" }}>
                            {taskInfo.workTime ? taskInfo.workTime : "未设置"}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={packUp ? "taskTag packUpNone" : "taskTag"}>
              <div className="item">
                <div className="left">
                  <i className="icon-biaoqian iconfont" style={{ top: isIos ? "6px" : "9px" }} />
                  <span className="justify  justifys">任务标签</span>
                </div>
                <div className="right">
                  {jurisdiction ? (
                    taskInfo.modifyPermission ? (
                      <TagComponent
                        tagSelecteds={taskInfo.tags}
                        canAdd={true}
                        canEdit={true}
                        tagChangeCallBack={val => {
                          this.tagChange(val);
                          this.setState({ taskSilderChange: "change" });
                          this.handleShowSave();
                        }}
                        renderAddElement={() => {
                          return <span style={{ display: "none" }} />;
                        }}
                        maxHeight="300px"
                      />
                    ) : (
                        <Tooltip
                          placement="top"
                          title={`您没有修改这条任务的权限`}
                          overlayClassName="createOverlayClass"
                          trigger="hover"
                        >
                          {taskInfo &&
                            taskInfo.tags &&
                            taskInfo.tags.length > 0 ? (
                              <TagComponent
                                maxHeight="300px"
                                tagSelecteds={taskInfo.tags}
                                tagChangeCallBack={() => { }}
                                canAdd={false}
                                canEdit={false}
                              />
                            ) : (
                              <div className="valBox" style={{ lineHeight: "35px" }} >
                                <span style={{ fontSize: "14px", color: "#bdbdbd" }} > 未设置</span>
                              </div>
                            )}
                        </Tooltip>
                      )
                  ) : taskInfo && taskInfo.tags && taskInfo.tags.length > 0 ? (
                    <TagComponent
                      maxHeight="300px"
                      tagSelecteds={taskInfo.tags}
                      tagChangeCallBack={() => { }}
                      canAdd={false}
                      canEdit={false}
                    />
                  ) : (
                        <div className="valBox" style={{ lineHeight: "35px" }}>
                          <span style={{ fontSize: "14px", color: "#bdbdbd" }}> 未设置 </span>
                        </div>
                      )}
                </div>
              </div>
            </div>
            {/* 任务描述 */}
            <div className="taskDesc">
              <div className="item">
                <div className="left">
                  <i className="icon-note iconfont" style={{ top: isIos ? "0px" : "3px" }} />
                  <span className="justify  justifys">任务描述</span>
                </div>
                <div className="right">
                  {jurisdiction ? (
                    taskInfo.modifyPermission ? (
                      <div className="taskSolids">
                        <TextArea
                          className="textAreaStyle"
                          placeholder="请输入任务描述（tips：截图可Ctr+V快速上传~）"
                          autosize={{ minRows: 3, maxRows: 6 }}
                          style={{ resize: "none", backgroundColor: "#fff", padding: "4px 0 0 6px", color: "#424242" }}
                          onPaste={e => { this.pasteingImg("描述附件", e) }}
                          onChange={e => { this.valChange("desc", e.target.value) }}
                          value={taskInfo.desc}
                          onFocus={() => {
                            this.setState({ addaccessory: true, detailTxtEdit: true, isFocus: true, taskSilderChange: "change", onFocussssss: true });
                          }}
                          onBlur={() => {
                            this.setState({ isFocus: false, onFocussssss: false, taskSilderChange: "change" });
                          }}
                        />
                        <div className="clearfix">
                          <Upload
                            action={baseURI + "/files/upload"}
                            listType="picture-card"
                            fileList={uploadList_desc}
                            multiple={true}
                            onPreview={file => {
                              this.handlePreview("desc", file);
                            }}
                            onChange={val => {
                              if (beforeUpload(val.file)) {
                                this.uploadListOnChange_desc(val);
                              }
                            }}
                          />
                        </div>
                        {/* 附件不可编辑 */}
                        {jurisdiction &&
                          detailTxtEdit &&
                          addaccessory &&
                          taskInfo.modifyPermission && (
                            <div className="filesTit" onClick={() => { this.updateImg("描述附件") }} >
                              <i className="icon-md-attach iconfont" style={{ top: isIos ? "2px" : "3px", position: "relative", fontSize: 16 }} />
                              添加附件...
                            </div>
                          )}
                      </div>
                    ) : (
                        <Tooltip
                          placement="top"
                          title={`您没有修改这条任务的权限`}
                          overlayClassName="createOverlayClass"
                        >
                          <div className="taskSolids">
                            {taskInfo.desc ? (
                              <TextArea
                                className="textAreaStyle"
                                autosize={{ minRows: 3, maxRows: 6 }}
                                value={taskInfo.desc}
                                disabled={true}
                                style={{ resize: "none", backgroundColor: "#fff", padding: "4px 0 0 6px", color: "#424242" }}
                              />
                            ) : uploadList_desc.length == 0 ? (
                              <TextArea
                                className="textAreaStyle"
                                autosize={{ minRows: 3, maxRows: 6 }}
                                value={"未填写任务描述"}
                                disabled={true}
                                style={{ resize: "none", backgroundColor: "#fff", color: "#bdbdbd", fontSize: 14, padding: "4px 0 0 6px" }}
                              />
                            ) : (
                                  ""
                                )}
                            {uploadList_desc.length !== 0 ? (
                              <div className="clearfix disableList">
                                <Upload
                                  action={baseURI + "/files/upload"}
                                  listType="picture-card"
                                  fileList={uploadList_desc}
                                  disabled={true}
                                />
                              </div>
                            ) : (
                                ""
                              )}
                          </div>
                        </Tooltip>
                      )
                  ) : (
                      <div className="taskSolids">
                        {taskInfo.desc ? (
                          <TextArea
                            className="textAreaStyle"
                            autosize={{ minRows: 3, maxRows: 6 }}
                            value={taskInfo.desc}
                            disabled={true}
                            style={{ resize: "none", backgroundColor: "#fff", padding: "4px 0 0 6px", color: "#424242", padding: "4px 0 0 6px" }}
                          />
                        ) : uploadList_desc.length == 0 ? (
                          <TextArea
                            className="textAreaStyle"
                            autosize={{ minRows: 3, maxRows: 6 }}
                            value={"未填写任务描述"}
                            disabled={true}
                            style={{ resize: "none", backgroundColor: "#fff", color: "#bdbdbd", fontSize: 14, padding: "4px 0 0 6px" }}
                          />
                        ) : (
                              ""
                            )}
                        {uploadList_desc.length !== 0 ? (
                          <div className="clearfix disableList">
                            <Upload action={baseURI + "/files/upload"} listType="picture-card" fileList={uploadList_desc} disabled={true} />
                          </div>
                        ) : (
                            ""
                          )}
                      </div>
                    )}
                  <ul className="accessory">
                    {taskInfo.descFiles && taskInfo.descFiles.map((item, i) => {
                      if (item.fileId && item.type !== "DELL") {
                        return (
                          <li key={item.fileId} onClick={() => { dingJS.previewImage(item) }} >
                            <div className="fileIcon"> {createFileIcon(item.fileType)}</div>
                            <span>{item.fileName}</span>
                            {detailTxtEdit && jurisdiction && taskInfo.modifyPermission ? (
                              <Popconfirm
                                title={`是否要删除"${item.fileName}"`}
                                onConfirm={e => { this.dellDescFileById(item.fileId) }}
                                okText="删除"
                                cancelText="取消"
                              >
                                <div className="delte" onClick={e => { e.stopPropagation() }} > <Icon type="delete" /> </div>
                              </Popconfirm>
                            ) : (
                                ""
                              )}
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bgc" style={{ marginTop: 20 }} />
            <div className="center">
              <TaskSilder
                taskInfo={taskInfo}
                childList={childList}
                childListLoading={childListLoading}
                coopList={coopList}
                coopListLoading={coopListLoading}
                fileList={fileList}
                filesListLoading={filesListLoading}
                getListCallback={id => {
                  this.getChildTaskList(id);
                  this.getCoopTaskList(id);
                  this.getFileList(id);
                }}
                getTaskDetailByIdCallBack={(childTaskId, proId) => {
                  this.getTaskDetail(childTaskId, proId);
                }}
                moneyEnd={() => {
                  if (this.props.moneyEnd) {
                    this.props.moneyEnd();
                  }
                }}
              />
            </div>
          </div>
          <div className="bgc" ref="fiexdBgc" />

          <div className="foot" style={{ marginBottom: "70px" }}>
            <Discuss
              taskInfo={taskInfo}
              writeContent={val => { this.writeContent(val) }}
              getTaskDetail={(taskId, proId) => { this.getTaskDetail(taskId, proId) }}
            />
          </div>
        </div>
        <DiscussPublish
          ref="discuss"
          taskInfo={taskInfo}
          publishObj={publishObj}
          peopleAllList={peopleAllList}
          getTaskDetail={(taskId, proId) => {
            this.setState({
              publishObj: {
                newTalkReplyUserId: "", //新建讨论人
                newTalkDesc: "", //讨论描述
                newTalkFiles: [], //讨论文件
                newTalkPromptTxt: "请输入讨论内容", //讨论内容
                people: { id: "", nickname: "" }
              }
            });
            this.getTaskDetail(taskId, proId);
          }}
        />
      </div>
    );
  }
}
export default TaskLatoutSmall;
