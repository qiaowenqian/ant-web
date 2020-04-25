import React, { Component } from "react";
import stylesheet from "styles/components/task/taskDetail.scss";
import Router from "next/router";
import { setColorTaskState } from "../../core/utils/util";
import TaskSilder from "../task/middleDetails/taskSilder"; //中间部分的组件
import TaskMove from "../../components/taskMove"; //移动任务组件
import TaskCopy from "../../components/taskCopy"; //复制任务组件
import LoopTask from "./loopTask";
import LoopTaskRead from "./loopTaskRead";
import RemindTask from "./remindTask";
import { Dropdown, Modal, Menu, Input, Button, Tooltip, message, Spin, DatePicker, Popconfirm, Upload, Popover, InputNumber } from "antd";
import _ from "lodash";
import TagComponent from "../newtag";
import Discuss from "../task/discuss";
import Storage from "../../core/utils/storage";
import DiscussPublish from "./discuss/publish";
import locale from "antd/lib/date-picker/locale/zh_CN";
import { baseURI } from "../../core/api/HttpClient";
import dingJS from "../../core/utils/dingJSApi";
import moment, { fn } from "moment";
import {
  getTaskDetailsDataById, cancelAttentionWitchTask, addAttentionWitchTask, updateTaskById, updateTaskStateByCode,
  deleteTaskById, urgeSonTaskByTaskId, claimTaskById, getSonTask, setMilestoneWithTask, urgeTaskById, getAtSelectUser,
  getChildTaskById, getCoopTaskById, getTaskFilesById, createTaskCycele
} from "../../core/service/task.service";
import { updateImgsInService } from "../../core/service/file.service";
import { stringToText, pasteImg, onlyNumber, createFileIcon, beforeUpload, getTeamInfoWithMoney, isIosSystem, diff } from "../../core/utils/util";
const confirm = Modal.confirm;
const { TextArea } = Input;
class TaskLayout extends Component {
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
      // modifyPermission: false, //是否可以修改
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
      taskSilderChange: "",
      onFocussssss: false,
      peopleAllList: [],

      //-----
      childListLoading: false,
      childList: [],

      fileList: [],
      filesListLoading: false,

      coopList: [],
      coopListLoading: false,
      isIos: false,
      terminationRestartTaskShow: false, // 重启终止Modal 显示
      UrgeShow: false, //显示  +++催办
      terResTaskDesc: "",
      urgeTaskDesc: "",
      modeTime: false,
      isDealDates: true,
      beginTimeShow: true,
      textareaLike: true,
      LimitTextLength: 0, //限制标记完成时候输入的内容长度。。。。。。
      rule: {},
      LoopTaskShow: false,
      remindShow: false, //提醒
      taskType: "",
      isMember: true,
      verName: "",
      TIMESHOW: false,
      remindArr: [], // 自定义提醒的数组
      remindArrCoby: [],
      relityBegTime: null,
      InputNumberFoc: false,
      timeLineShow: false
    };
  }
  componentWillMount = () => {
    //组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
    const { taskId, projectId } = this.props;
    this.setState({
      verName: getTeamInfoWithMoney("版本名称")
    });
    this.getTaskDetail(taskId, projectId, data => {
      this.initGetPeopleList(data.project);
      this.getChildTaskList(taskId);
      this.getFileList(taskId);
      this.getCoopTaskList(taskId);
    });
  };

  componentDidMount() {
    //    组件渲染之后调用，只调用一次。
    let user = Storage.get("user");
    this.setState({ user: user, isIos: isIosSystem() });
  }

  componentWillReceiveProps(nextProps) {
    //组件初始化时不调用，组件接受新的props时调用。
    if (nextProps.createChildTaskLists) {
      this.getChildTaskList(nextProps.taskId);
      this.getTaskDetail(nextProps.taskId, nextProps.projectId);
    }
    if (!nextProps.taskDetailShow) {
      this.setState({
        saveShow: false,
        LoopTaskShow: false,
        remindShow: false
      });
    }
    if (nextProps.taskId !== this.props.taskId) {
      this.setState({
        taskSilderChange: "",
        saveShow: false,
        LoopTaskShow: false,
        remindShow: false,
        publishObj: {
          newTalkReplyUserId: "", //新建讨论人
          newTalkDesc: "", //讨论描述
          newTalkFiles: [], //讨论文件
          newTalkPromptTxt: "请输入讨论内容", //讨论内容
          people: {
            id: "",
            nickname: ""
          }
        }
      });
      this.getTaskDetail(nextProps.taskId, nextProps.projectId, data => {
        this.initGetPeopleList(data.project);
      });
      if (nextProps.taskId !== "") {
        this.getChildTaskList(nextProps.taskId);
        this.getFileList(nextProps.taskId);
        this.getCoopTaskList(nextProps.taskId);
      }
    }
  }
  componentDidUpdate() {
    //组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
    if (this.state.publishObj.newTalkReplyUserId === "") {
      document.getElementById("scrollWrap").scrollTop = 0;
    }
    const _this = this;
    const fixedHeadEle = this.refs.fixedHead.clientHeight;
    const scrollEle = this.refs.scrollEle;
    const heightCenter = this.refs.heightCenter.clientHeight;
    const fiexdBgc = this.refs.fiexdBgc;
    const discuss = this.refs.discuss;
    if (fixedHeadEle && scrollEle && discuss) {
      scrollEle.style.paddingBottom =
        discuss.refs.fixedBottom.clientHeight + "px";
      if (this.refs.fixedHead.clientHeight >= 160) {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      } else {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      }
    }
    document.getElementById("scrollWrap").addEventListener(
      "scroll",
      e => {
        let scrollTop = e.target.scrollTop;
        _this.scrollAnimate(scrollTop, heightCenter, fiexdBgc);
      },
      false
    );
  }
  // 获取子任务列表数据
  getChildTaskList = id => {
    this.setState({ childListLoading: true });
    getChildTaskById(
      id,
      data => {
        if (data.err) {
          return false;
        }
        this.setState({ childList: data });
        this.setState({ childListLoading: false });
      },
      false
    );
  };

  //获取协作任务列表
  getCoopTaskList = id => {
    this.setState({ coopListLoading: true });
    getCoopTaskById(
      id,
      data => {
        if (data.err) { return false; }
        this.setState({ coopList: data });
        this.setState({ coopListLoading: false });
      },
      false
    );
  };
  //获取成果文件列表
  getFileList = id => {
    this.setState({ filesListLoading: true });
    getTaskFilesById(
      id,
      data => {
        if (data.err) {
          return false;
        }
        this.setState({ fileList: data });
        this.setState({ filesListLoading: false });
      },
      false
    );
  };

  checkIsEdit = () => {
    const { taskInfo, taskInfoCopy } = this.state;
    if (!_.isEqual(taskInfo, taskInfoCopy)) {
      return true;
    }
    return false;
  };
  urgeChildTasks() {
    urgeSonTaskByTaskId(
      this.state.taskInfo.id,
      data => {
        if (data.err) {
          return false;
        }
        message.success("催办成功！");
      },
      this.props.isSmall
    );
  }
  //任务详情获取------------------
  getTaskDetail = (taskId, proId, callback) => {
    this.setState({ taskInfoLoading: true });
    if (taskId) {
      getTaskDetailsDataById(
        taskId,
        proId,
        this.props.hideOkTask,
        data => {
          if (data.err) {
            return false;
          }
          let { taskInfo, remindArr } = this.state;
          // ----------------------------------------------------------------------------------------------------------------
          if (data.antTaskinfo.state == 0 || data.antTaskinfo.state == 3) {
            // 0未完成  1正常完成  2待确认  3未指派  4已终止 8逾期完成 9提前完成
            //根据任务状态判断是否可编辑
            this.setState({ jurisdiction: true });
          } else {
            this.setState({ jurisdiction: false });
          }
          taskInfo.id = data.antTaskinfo.id;
          taskInfo.project = {
            id: data.project.id,
            name: data.project.proname
          };
          taskInfo.name = data.antTaskinfo.taskname;
          taskInfo.proname = data.project.proname;
          let numberS = "";
          if (data.antTaskinfo.taskinfoNumber) {
            numberS = data.antTaskinfo.taskinfoNumber.numberS + ".";
          }
          taskInfo.number = numberS + data.antTaskinfo.rank;
          taskInfo.state = data.antTaskinfo.stateName; //任务状态
          taskInfo.stateButton = data.antTaskinfo.stateButton;
          taskInfo.flowButton = data.antTaskinfo.flowButton;
          taskInfo.beginButton = data.antTaskinfo.beginButton;
          taskInfo.attention = data.antTaskinfo.collect ? true : false;
          taskInfo.bread = data.parentList;
          taskInfo.desc = data.antTaskinfo && data.antTaskinfo.description;
          taskInfo.descFiles = JSON.parse(JSON.stringify(data.taskinfoFiles));
          let descImgs = stringToText(data.antTaskinfo.description, "img");
          descImgs.map((item, i) => {
            taskInfo.descFiles.push({ fileUrlAbsolute: item, id: "descStrImg" + i, name: "descStrImg" + i });
          });
          taskInfo.tags = [];
          data.label.map((item, i) => {
            taskInfo.tags.push({
              id: item.label.id,
              name: item.label.labelname,
              color: item.label.color,
              type: item.label.type,
              recordId: item.id
            });
          });
          taskInfo.fzr = data.antTaskinfo.userResponse
            ? data.antTaskinfo.userResponse
            : "";
          taskInfo.qrr = data.antTaskinfo.userFlow
            ? data.antTaskinfo.userFlow
            : "";
          taskInfo.realityEndTime = data.antTaskinfo.realityEndTime // realityEndTime 实际完成时间
            ? data.antTaskinfo.realityEndTime
            : null;
          taskInfo.realityBeginTime = data.antTaskinfo.realityBeginTime // realityBeginTime 实际开始时间
            ? data.antTaskinfo.realityBeginTime
            : null;

          taskInfo.planEndTime = data.antTaskinfo.planEndTime //  planEndTime 计划完成时间
            ? data.antTaskinfo.planEndTime
            : null;
          taskInfo.planBeginTime = data.antTaskinfo.planBeginTime //  planEndTime 计划完成时间
            ? data.antTaskinfo.planBeginTime
            : null;
          if (data.antTaskinfo.planBeginTime == undefined || data.antTaskinfo.planBeginTime && (data.antTaskinfo.planBeginTime.indexOf("23:59:59") !== -1 || data.antTaskinfo.planBeginTime.indexOf("00:00:03") !== -1)) {
            this.setState({ beginTimeShow: true })
          } else {
            this.setState({ beginTimeShow: false })
          }
          taskInfo.workTime = data.antTaskinfo.workTime;
          taskInfo.taskMoney = data.antTaskinfo.flowConten;
          taskInfo.lev = data.antTaskinfo.coefficienttype;
          taskInfo.childCount = data.antTaskinfo.childCount;
          taskInfo.childSuccess = data.antTaskinfo.childSuccess;
          taskInfo.coopTaskCount = data.taskrRelationCount;
          taskInfo.filesCount = data.filesCount;
          taskInfo.talk = data.leaveList;
          taskInfo.parentIds = data.antTaskinfo.parentIds;
          taskInfo.parentId = data.antTaskinfo.parent
            ? data.antTaskinfo.parent.id
            : "0";
          taskInfo.cycParent =
            data.antTaskinfo.parent && data.antTaskinfo.parent;
          taskInfo.projectJurisdiction =
            data.project && data.project.jurisdiction;
          //增加指派人
          taskInfo.zpf = data.antTaskinfo.userAssigned;
          //增加任务创建人
          taskInfo.cjr = data.antTaskinfo.createBy;

          //关注人
          const collectList = [];
          if (data.collectList) {
            data.collectList.map(item => {
              collectList.push(item.user);
            });
          }
          taskInfo.collectListAll = data.collectList;
          taskInfo.collectList = collectList;
          taskInfo.modifyPermission = data.modifyPermission; //修改权限
          taskInfo.deletePermission = data.deletePermission; //删除权限
          taskInfo.createPermission = data.createPermission; //创建权限
          taskInfo.isResponse = data.isResponse ? data.isResponse : false; //任务负责人
          taskInfo.isManager = data.project && data.project.jurisdiction; //是否是项目负责人或管理员
          taskInfo.milestone = data.antTaskinfo.milestone; //设置里程碑
          taskInfo.projectAll = data.project;
          taskInfo.isMember = data.isMember;
          taskInfo.isCycle = data.antTaskinfo.attstr01 && data.antTaskinfo.attstr01; //是否创建了循环任务标示
          const { rule } = this.state;
          if (
            data.antCyclicTaskinfo &&
            data.antTaskinfo.attstr01 &&
            data.antTaskinfo.attstr01 === "1"
          ) {
            if (data.antCyclicTaskinfo.day) {
              rule.repeatType = "1";
              rule.nextExecutionTimeString = moment(
                data.antCyclicTaskinfo.nextExecutionTime
              ).format("YYYY-MM-DD");
              rule.repeat = -1;
              rule.day = data.antCyclicTaskinfo.day;
              rule.isWeekend =
                data.antCyclicTaskinfo.isWeekend === "0" ? false : true;
            }
            if (data.antCyclicTaskinfo.week) {
              rule.nextExecutionTimeString = moment(
                data.antCyclicTaskinfo.nextExecutionTime
              ).format("YYYY-MM-DD");
              rule.repeat = -1;
              rule.week = data.antCyclicTaskinfo.week;
              rule.weekDay = data.antCyclicTaskinfo.weekDay.split(",");
              rule.weekRepeat = data.antCyclicTaskinfo.weekRepeat;
              rule.repeatType = "2";
            }
            if (data.antCyclicTaskinfo.month) {
              rule.repeatType = "3";
              rule.nextExecutionTimeString = moment(
                data.antCyclicTaskinfo.nextExecutionTime
              ).format("YYYY-MM-DD");
              rule.repeat = -1;
              rule.month = data.antCyclicTaskinfo.month;
              rule.monthDay = data.antCyclicTaskinfo.monthDay;
              rule.isWeekend =
                data.antCyclicTaskinfo.isWeekend === "0" ? false : true;
            }
            this.setState({ rule: rule });
          } else {
            rule.repeatType = "1";
            rule.nextExecutionTimeString = moment();
            rule.repeat = -1;
            rule.day = "1";
            rule.isWeekend = false;
            this.setState({ rule: rule });
          }
          this.setState(
            {
              taskInfo: taskInfo,
              remindArr: data.antTaskinfo.attstr03 ? JSON.parse(data.antTaskinfo.attstr03) : [],
            }, () => {
              if (callback) {
                callback(data);
              }
            }
          );
          //任务详信息到这就算都取出来了 接下来就是渲染数据了
          // ----------------------------------------------------------------------------------------------------------------
          this.setUploadListWithDescFile(taskInfo);
          let taskInfoCopy = JSON.parse(JSON.stringify(taskInfo));
          let remindArrCoby = JSON.parse(JSON.stringify(data.antTaskinfo.attstr03 ? JSON.parse(data.antTaskinfo.attstr03) : []));
          const dict_lev = data.coefficienttype;
          this.setState({
            remindArrCoby: remindArrCoby,
            taskInfoCopy: taskInfoCopy,
            dict_lev: dict_lev,
            taskInfoLoading: false
          });
          this.setState({ isDealDates: taskInfo.planEndTime == null || taskInfo.planEndTime.indexOf("23:59:59") > -1 ? true : false });
        },
        this.props.isSmall
      );
    }
  };

  scrollAnimate = (scrollTop, titleHeight) => {
    let endtimeEle = this.refs.endtime;
    let confirmEle = this.refs.confirm;
    let topBgc = this.refs.topBgc;
    if (scrollTop > titleHeight + 17) {
      topBgc.style.display = "block";
      endtimeEle.style.display = "flex";
      confirmEle.style.display = "none";
    } else {
      topBgc.style.display = "none";
      endtimeEle.style.display = "none";
      confirmEle.style.display = "flex";
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
  //识别URL正则匹配，www http: https:
  regUrl = taskInfo => {
    let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|%)+)/g;
    if (taskInfo.desc === "") {
      return taskInfo.state === "0" ||
        taskInfo.state === "7" ||
        taskInfo.state === "3"
        ? "<div style=color:#bdbdbd>请输入任务描述（tips：截图可Ctr+V快速上传~）</div>"
        : "<div style=color:#bdbdbd>未填写任务描述</div>";
    } else {
      let a = taskInfo.desc
        .replace(reg, "<a href='$1$2' target='_Blank'>$1$2</a>")
        .replace(/\n/g, "<br />");
      return a;
    }
  };
  valOnChange = type => {
    const fixedHeadEle = this.refs.fixedHead.clientHeight;
    const scrollEle = this.refs.scrollEle;
    const discuss = this.refs.discuss;
    if (fixedHeadEle && scrollEle && discuss) {
      scrollEle.style.paddingBottom =
        discuss.refs.fixedBottom.clientHeight + "px";
      if (fixedHeadEle >= 160) {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      } else {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      }
    }
    const { taskInfo, taskInfoCopy } = this.state;
    if (taskInfo[type] !== taskInfoCopy[type]) {
      this.handleShowSave();
    }
  };

  //对比？？？？？
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
    this.setState({ textareaLike: true });
    let tag = [];
    taskInfo.tags.map((item, i) => {
      tag.push({
        label: { id: item.id, labelname: item.name, color: item.color, type: item.type },
        rtype: "c"
      });
    });
    let newTask = {
      id: taskInfo.id,
      taskname: taskInfo.name,
      proname: taskInfo.proname,
      description: taskInfo.desc,
      labelrelations: tag,
      userResponse: {
        userid: taskInfo.fzr.userid ? taskInfo.fzr.userid : taskInfo.fzr.emplId
      },
      userFlow: {
        userid: taskInfo.qrr.userid ? taskInfo.qrr.userid : taskInfo.qrr.emplId
      },
      flowConten: taskInfo.taskMoney === "" ? 0 : taskInfo.taskMoney,
      workTime: taskInfo.workTime === "" ? 0 : taskInfo.workTime,
      coefficienttype: taskInfo.lev,
      fileList: taskInfo.descFiles,
      jurisdiction: taskInfo.isManager,
      projectId: taskInfo.project.id,
      attstr03: JSON.stringify(this.state.remindArr)
    };
    if (taskInfo.planEndTime) {
      if (taskInfo.planEndTime.length > 10 && taskInfo.planEndTime.slice(10, 16).indexOf("00:00") !== -1) {
        newTask.planEndTimeString = taskInfo.planEndTime.slice(0, 10) + " 00:00:02"
      } else {
        newTask.planEndTimeString = taskInfo.planEndTime
      }
    } else {
      newTask.planEndTimeString = "DELL"
    }
    if (taskInfo.planBeginTime) {
      if (taskInfo.planBeginTime.length > 10 && taskInfo.planBeginTime.slice(10, 16).indexOf("00:00") !== -1 && taskInfo.planBeginTime.indexOf("00:00:03") == -1) {
        newTask.planBeginTimeString = taskInfo.planBeginTime.slice(0, 10) + " 00:00:02"
      } else if (taskInfo.planBeginTime.length == 10) {
        newTask.planBeginTimeString = taskInfo.planBeginTime.slice(0, 10) + " 00:00:03"
      } else {
        newTask.planBeginTimeString = taskInfo.planBeginTime
      }
    } else {
      newTask.planBeginTimeString = "DELL"
    }
    updateTaskById(
      newTask,
      data => {
        if (data.err) {
          return false;
        }
        this.upDataListInfo();
      },
      this.props.isSmall
    );
  };
  //取消保存
  handleCancel = () => {
    let { taskInfo, taskInfoCopy } = this.state;
    taskInfo = JSON.parse(JSON.stringify(taskInfoCopy));
    this.setState({
      taskInfo: taskInfo,
      saveShow: false,
      taskSilderChange: ""
    });
    this.setUploadListWithDescFile(taskInfo);
  };
  tagChange = tag => {
    let { taskInfo, saveShow } = this.state;
    let oldTags = taskInfo.tags;
    let tags = [];
    let showFlag = true;
    tag.map(item => {
      tags.push(item);
    });
    if (oldTags && oldTags.length == tags.length) {
      tags.map(item => {
        let bb = true;
        oldTags.map(it => {
          if (it.id == item.id) {
            bb = false;
          }
        });
        if (bb) {
          showFlag = false;
        }
      });
    }
    if (tags.length === 0 && oldTags.length === 0) {
      showFlag = false;
    }
    taskInfo.tags = tags;
    if (showFlag) {
      if (saveShow) {
        // this.setState({
        //   animateClass: "animated_05s slideInDown2_7",
        //   saveShow: false
        // });
        this.setState({
          taskInfo: taskInfo
        });
      } else {
        this.setState({
          animateClass: "animated_05s slideInDown2_7",
          taskInfo: taskInfo,
          saveShow: true
        });
        const _this = this;
        setTimeout(function () {
          _this.setState({ animateClass: "" });
        }, 500);
      }
    } else {
      this.setState({
        taskInfo: taskInfo
      });
    }
  };

  handleShowSave = () => {
    const { saveShow } = this.state;
    if (saveShow) return false;
    this.setState({
      saveShow: true,
      animateClass: "animated_05s slideInDown2_7"
    });
    const _this = this;
    setTimeout(function () {
      _this.setState({ animateClass: "" });
    }, 500);
  };

  handleScroll = e => {
    const _this = this;
    const fixedHeadEle = this.refs.fixedHead.clientHeight;
    const scrollEle = this.refs.scrollEle;
    const heightCenter = this.refs.heightCenter.clientHeight;
    const fiexdBgc = this.refs.fiexdBgc;
    const discuss = this.refs.discuss;
    if (fixedHeadEle && scrollEle && discuss) {
      scrollEle.style.paddingBottom =
        discuss.refs.fixedBottom.clientHeight + "px";
      if (this.refs.fixedHead.clientHeight >= 160) {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      } else {
        scrollEle.style.top = fixedHeadEle - 2 + "px";
      }
    }
    document.getElementById("scrollWrap").addEventListener(
      "scroll",
      e => {
        let scrollTop = e.target.scrollTop;
        _this.scrollAnimate(scrollTop, heightCenter, fiexdBgc, fixedHeadEle);
      },
      false
    );
  };

  //面包屑显示方式，超过11个字显示省略号
  subTaskNameBread = name => {
    return name && name.taskname
      ? name.taskname && name.taskname.length > 11
        ? name.taskname.substring(0, 5) +
        "..." +
        name.taskname.substring(
          name.taskname.length - 5,
          name.taskname.length
        )
        : name.taskname
      : "";
  };

  //关注任务
  attentionClick = () => {
    let { taskInfo } = this.state;
    if (taskInfo.attention) {
      cancelAttentionWitchTask(
        taskInfo.id,
        data => {
          if (data.err) {
            return false;
          }
          message.success("取消成功");
          const task = {
            id: taskInfo.id,
            attention: false
          };
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
        },
        this.props.isSmall
      );
    } else {
      addAttentionWitchTask(
        taskInfo.id,
        data => {
          if (data.err) {
            return false;
          }
          message.success("关注成功");
          const task = {
            id: taskInfo.id,
            attention: true
          };
          this.props.updatedTaskCallBack(task);

          taskInfo.attention = true;

          let user = Storage.get("user");
          taskInfo.collectList.push(user);

          this.setState({ taskInfo: taskInfo });
        },
        this.props.isSmall
      );
    }
  };

  writeContent = item => {
    this.setState({
      publishObj: {
        newTalkReplyUserId: item.createBy.id,
        newTalkDesc: "",
        newTalkFiles: [],
        newTalkPromptTxt: "@" + item.createBy.name,
        people: {
          id: item.createBy.id,
          name: item.createBy.name
        }
      }
    });
    // this.refs.scrollEle.scrollTop = top;
  };
  //钉钉选人组件
  selUser(title, jurisdiction) {
    if (!jurisdiction) {
      return;
    }
    let selectedUsers = [];
    let { taskInfo } = this.state;
    if (title === "负责人") {
      // selectedUsers.push(taskInfo.fzr);
    } else if (title === "确认人") {
      // selectedUsers.push(taskInfo.qrr);
    }
    const that = this;
    dingJS.selectUser(
      selectedUsers,
      "请选择" + title,
      data => {
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
      },
      false,
      this.props.isSmall
    );
  }
  //粘贴图片显示在下边
  setUploadListWithDescFile = taskInfo => {
    if (!taskInfo) {
      taskInfo = this.state.taskInfo;
    }
    let uploadList_desc = [];
    taskInfo.descFiles.map((item, i) => {
      if (!item.type) {
        uploadList_desc.push({
          uid: item.id,
          name: item.fileName ? item.fileName : item.name,
          status: "done",
          url: item.fileUrlAbsolute,
          typeSet: item.fileName ? "DescFile" : "DescStrFile"
        });
      }
    });
    this.setState({ uploadList_desc: uploadList_desc });
  };
  //任务描述图片
  uploadListOnChange_desc = list => {
    this.setState({ uploadList_desc: list.fileList });
    let { taskInfo } = this.state;
    if (list.file.status === "done") {
      taskInfo.descFiles.push({
        id: list.file.response.data.id,
        uid: list.file.uid
      });
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
          taskInfo.descFiles.map(item => {
            urlList.push(item.fileUrlAbsolute);
          });
        }
        dingJS.previewImages(files, "", urlList);
        break;
      case "finish":
        if (uploadList_state.length > 0) {
          uploadList_state.map(item => {
            urlList.push(item.fileUrlAbsolute);
          });
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
  dellDescFileById = obj => {
    let { taskInfo } = this.state;
    if (obj.id) {
      taskInfo.descFiles.map((item, i) => {
        if (item.fileId === obj.fileId) {
          taskInfo.descFiles[i].type = "DELL";

          this.setState({ taskInfo: taskInfo, saveShow: true });
          return false;
        }
      });
    } else {
      taskInfo.descFiles.map((item, i) => {
        if (item.fileId === obj.fileId) {
          taskInfo.descFiles.splice(i, 1);
          this.setState({ taskInfo: taskInfo, saveShow: true });
          return false;
        }
      });
    }
  };
  //认领任务
  claimTask = () => {
    claimTaskById(
      [this.state.taskInfo.id],
      data => {
        if (data.err) {
          return false;
        }
        message.success("认领成功！");
        this.getTaskDetail(
          this.state.taskInfo.id,
          this.props.projectId,
          data => {
            this.upDataListInfo();
          }
        );
      },
      this.props.isSmall
    );
  };
  //标记完成
  completTask = () => {
    let taskId = this.state.taskInfo.id;
    getSonTask(
      taskId,
      res => {
        if (res.err) { return false }
        if (res.isSonTask == "true") {
          this.setState({
            childTaskModalShow: true,
            sonTaskinfoList: res.antTaskinfoList,
            taskCompletFiles: [],
            LimitTextLength: 0
          });
        } else {
          const { taskInfo } = this.state;
          if (taskInfo.planBeginTime == null || moment(taskInfo.planBeginTime) > moment()) {
            this.setState({ relityBegTime: moment().add(-parseInt(taskInfo.workTime), "day").add(-((taskInfo.workTime - parseInt(taskInfo.workTime)) * 24), "H") })
          } else {
            if (taskInfo.planBeginTime.indexOf("23:59:59") !== -1) {
              this.setState({ relityBegTime: taskInfo.planBeginTime.slice(0, 10) + " 00:00" })
            } else {
              this.setState({ relityBegTime: moment(taskInfo.planBeginTime) })
            }
          }
          this.setState({
            taskCompleteModalShow: true,
            taskCompletDesc: "",
            taskCompletFiles: [],
            LimitTextLength: 0
          });
        }
        this.getFileList(this.state.taskInfo.id);
      },
      this.props.isSmall
    );
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
          if (data.err) { return false }
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
      okText: "删除",
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
        stateTask === "4" ||
          stateTask === "1" ||
          stateTask === "8" ||
          stateTask === "9"
          ? "0"
          : "4", // 0重启 1完成 1审核通过 0驳回 4终止
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
        this.getTaskDetail(this.state.taskInfo.id, this.props.projectId);
        this.setState({
          UrgeShow: false,
          LimitTextLength: 0,
          urgeTaskDesc: ""
        });
      },
      this.props.isSmall
    );
  };
  //Ding任务的当前责任人
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
      taskInfo.proname,
      taskInfo.id
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
      return true; //不可编辑状态
    } else {
      return false; //可编辑状态
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
  initGetPeopleList() {
    const { taskInfo } = this.state;
    let bodyJson = taskInfo.projectAll;
    if (bodyJson) {
      bodyJson.searchvalue = "";
      getAtSelectUser(bodyJson, data => {
        this.setState({ peopleAllList: data }, () => {
          const fixedHeadEle = this.refs.fixedHead.clientHeight;
          const scrollEle = this.refs.scrollEle;
          const discuss = this.refs.discuss;
          if (fixedHeadEle && scrollEle && discuss) {
            scrollEle.style.paddingBottom =
              discuss.refs.fixedBottom.clientHeight + "px";
            if (fixedHeadEle >= 160) {
              scrollEle.style.top = fixedHeadEle - 2 + "px";
            } else {
              scrollEle.style.top = fixedHeadEle - 2 + "px";
            }
          }
        });
      });
    }
  }
  //点击子任务协作任务列表时，重新计算滚动区域的Top值
  topValueInite = () => {
    let _this = this;
    setTimeout(function () {
      const fixedHeadEle = _this.refs.fixedHead.clientHeight;
      const scrollEle = _this.refs.scrollEle;
      const discuss = _this.refs.discuss;
      if (fixedHeadEle && scrollEle && discuss) {
        scrollEle.style.paddingBottom =
          discuss.refs.fixedBottom.clientHeight + "px";
        if (fixedHeadEle >= 160) {
          scrollEle.style.top = fixedHeadEle - 2 + "px";
        } else {
          scrollEle.style.top = fixedHeadEle - 2 + "px";
        }
      }
    }, 1000);
  };
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
  // 创建循环任务
  createTaskData = () => {
    const { taskInfo, taskType, rule } = this.state;
    let tag = [];
    taskInfo.tags.map(item => {
      tag.push({
        label: {
          id: item.id,
          labelname: item.name,
          color: item.color,
          type: item.type
        },
        rtype: "c"
      });
    });
    let collectUser = [];
    taskInfo.collectList &&
      taskInfo.collectList.length > 0 &&
      taskInfo.collectList.map(item => {
        collectUser.push(item.userid);
      });
    /*创建循环任务的参数*/
    let updateData = {
      taskname: taskInfo.name, // 任务名字
      taskId: taskInfo.id, //任务id
      proname: taskInfo.proname, //项目名字
      projectId: taskInfo.project.id, //项目Id
      userResponse: {
        //负责人
        userid: taskInfo.fzr.userid ? taskInfo.fzr.userid : taskInfo.fzr.emplId
      },
      userFlow: {
        //确认人
        userid: taskInfo.qrr.userid ? taskInfo.qrr.userid : taskInfo.qrr.emplId
      },
      // planEndTimeString: taskInfo.planEndTime ? taskInfo.planEndTime : "", //截止时间
      flowConten: taskInfo.taskMoney === "" ? 0 : taskInfo.taskMoney, //任务绩效
      workTime: taskInfo.workTime === "" ? 0 : taskInfo.workTime, //计划工期
      coefficienttype: taskInfo.lev, //优先级
      labelrelations: tag, //任务标签
      description: taskInfo.desc, //任务描述
      fileList: taskInfo.descFiles, //描述文件
      collectUserList: collectUser
    };
    if (taskInfo.planEndTime) {
      if (taskInfo.planEndTime.length > 10 && taskInfo.planEndTime.slice(10, 16).indexOf("00:00") !== -1) {
        updateData.planEndTimeString = taskInfo.planEndTime.slice(0, 10) + " 00:00:02"
      } else {
        updateData.planEndTimeString = taskInfo.planEndTime
      }
    } else {
      updateData.planEndTimeString = "DELL"
    }
    if (taskInfo.planBeginTime) {
      if (taskInfo.planBeginTime.length > 10 && taskInfo.planBeginTime.slice(10, 16).indexOf("00:00") !== -1 && taskInfo.planBeginTime.indexOf("00:00:03") == -1) {
        updateData.planBeginTimeString = taskInfo.planBeginTime.slice(0, 10) + " 00:00:02"
      } else if (taskInfo.planBeginTime.length == 10) {
        updateData.planBeginTimeString = taskInfo.planBeginTime.slice(0, 10) + " 00:00:03"
      } else {
        updateData.planBeginTimeString = taskInfo.planBeginTime
      }
    } else {
      updateData.planBeginTimeString = "DELL"
    }
    if (taskType === "cycle") {
      updateData.parent = taskInfo.cycParent;
      updateData.parentIds = taskInfo.parentIds ? taskInfo.parentIds : "0";
      let cycleDate = Object.assign(updateData, rule);
      createTaskCycele(taskInfo.project.id, cycleDate, res => {
        if (res.err) {
          return false;
        }
        taskInfo.isCycle = "1";
        this.setState({ taskInfo: taskInfo });
        message.success("创建成功！");
      });
    }
  };
  //创建循环任务
  createTaskRule = rule => {
    if (rule === "cancel") {
      this.setState({
        rule: {},
        LoopTaskShow: false,
        taskType: ""
      });
    } else {
      rule.nextExecutionTimeString = moment(
        rule.nextExecutionTimeString
      ).format("YYYY-MM-DD");
      if (rule.weekDay) {
        rule.weekDay = rule.weekDay.join(",");
      }
      if (rule.day) {
        rule.day = rule.day.toString();
        rule.repeatType = "1";
      }
      if (rule.week) {
        rule.repeatType = "2";
        rule.week = rule.week.toString();
      }
      if (rule.month) {
        rule.repeatType = "3";
        rule.month = rule.month.toString();
      }
      if (rule.monthDay) {
        rule.monthDay = rule.monthDay.toString();
      }
      rule.isWeekend = rule.isWeekend && rule.isWeekend;
      this.setState(
        {
          taskType: "cycle",
          rule: rule,
          LoopTaskShow: false
        },
        () => {
          this.createTaskData();
        }
      );
    }
  };
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
  //修改自定义提醒
  setTaskRemind = remind => {
    this.setState({ remindArr: remind, remindShow: false }, () => {
      this.save();
    });
  };

  // TODO:有关开始时间的限制问题
  //不可选的开始时间Date，在截止时间存在的情况下 必须大于截止时间
  disabledDateStart = current => {
    const { taskInfo } = this.state
    // console.log("截止时间为:", taskInfo.planEndTime);
    return current > moment(taskInfo.planEndTime).endOf("day")
  };
  //不可选的截止时间Date
  disabledDateEnd = current => {
    const { taskInfo } = this.state;
    if (taskInfo.planBeginTime) { return current < moment(taskInfo.planBeginTime).startOf("day"); }
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
  disMinutes = () => {
    if (moment(this.state.relityBegTime).hours() == moment().hours()) {
      return this.range(0, 60).splice(moment().minutes(), 60)
    } else {
      return [61, 100]
    }
  }
  formatterChange = (val) => {
    const { InputNumberFoc } = this.state;
    return InputNumberFoc ? `${val}天` : `${val}`
  }
  //判断计划开始时间 实际开始时间 计划完成时间  实际完成时间的大小方法
  componentTime = (TimeType) => {
    const { taskInfo } = this.state;
    if (TimeType == "begin") {
      if (taskInfo.planBeginTime && taskInfo.realityBeginTime && moment(taskInfo.realityBeginTime).isBefore(taskInfo.planBeginTime)) {
        return true
      } else {
        return false
      }
    } else if (TimeType == "End") {
      if (taskInfo.planEndTime && taskInfo.realityEndTime && moment(taskInfo.realityEndTime).isBefore(taskInfo.planEndTime)) {
        return true
      } else {
        return false
      }
    }
  }
  render() {
    //react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行。此时就不能更改state了。
    const { InputNumberFoc, saveShow, animateClass, taskInfo, jurisdiction, isSmall, taskInfoLoading, publishObj, dict_lev,
      detailTxtEdit, uploadList_desc, addaccessory, taskCompleteModalShow, taskCompletLoading, taskCompletDesc,
      taskCheckModalTitle, taskCheckModalShow, taskCheckDesc, childTaskModalShow, sonTaskinfoList, user, taskMoveShow,
      taskCopyShow, taskCheckLoading_x, taskCheckLoading_v, peopleAllList, uploadList_state, childList, childListLoading,
      coopList, coopListLoading, fileList, filesListLoading, taskCompletFiles, isIos, terminationRestartTaskShow, // 重启终止Modal显示
      terResTaskDesc, modeTime, isDealDates, beginTimeShow, textareaLike, LimitTextLength, rule, LoopTaskShow, remindShow,
      taskType, UrgeShow, urgeTaskDesc, verName, TIMESHOW, remindArr, remindArrCoby, relityBegTime, timeLineShow
    } = this.state;
    let datadetail = null;
    if (this.returnTimeVals(taskInfo)) {
      datadetail = taskInfo.planEndTime
        ? taskInfo.planEndTime && taskInfo.planEndTime.indexOf("23:59:59") > -1
          ? taskInfo.planEndTime.split(" ")[0] + " 00:00:00"
          : taskInfo.planEndTime
        : null;
    } else {
      datadetail = taskInfo.realityEndTime ? taskInfo.realityEndTime : null;
    }
    //展示开始时间还是真实开始时间
    let startTimeDetail = null;
    if (this.returnTimeVals(taskInfo)) {
      startTimeDetail = taskInfo.planBeginTime
        ? taskInfo.planBeginTime &&
          taskInfo.planBeginTime.indexOf("23:59:59") > -1
          ? taskInfo.planBeginTime.split(" ")[0]
          : taskInfo.planBeginTime
        : null;
    } else {
      //真实开始时间
      startTimeDetail = taskInfo.realityBeginTime ? taskInfo.realityBeginTime : null;
    }
    const loopContent = (
      <LoopTask
        creatTaskRule={rule => {
          this.createTaskRule(rule);
        }}
        taskCreateVals={rule}
        showBtn={taskInfo.isCycle}
        clear={false}
      />
    );
    const loopTaskRead = <LoopTaskRead taskCreateVals={rule} />;
    const remindContent = (
      <RemindTask
        clear={true}
        changeRemind={"taskLatout"}
        taskRemindVals={remindArr}
        setRemind={remind => {
          this.setTaskRemind(remind);
        }}
      />
    );
    const timeLineContent = (
      <div className="timeLineBox">
        <div className="beginTop" style={this.componentTime("begin") ? { left: 68 } : {}}>
          计划开始 <span>{taskInfo.planBeginTime && taskInfo.planBeginTime.slice(0, 16)}</span>
          <div className="myArrowBeginTop"></div>
        </div>
        <div className="beginBottom" style={this.componentTime("begin") ? { left: 17 } : {}}>
          实际开始 <span>{taskInfo.realityBeginTime && taskInfo.realityBeginTime.slice(0, 16)}</span>
          <div className="myArrowBeginBottom"></div>
        </div>
        <div className="EndTop" style={this.componentTime("End") ? { right: 17 } : {}}>
          计划完成 <span>{taskInfo.planEndTime && taskInfo.planEndTime.slice(0, 16)}</span>
          <div className="myArrowEndTop"></div>
        </div>
        <div className="EndBottom" style={this.componentTime("End") ? { right: 68 } : {}}>
          实际完成 <span>{taskInfo.realityEndTime && taskInfo.realityEndTime.slice(0, 16)}</span>
          <div className="myArrowEndBottom"></div>
        </div>
        <div className="line">
          <span className="beginStart"></span>
          <span className="realityStart"></span>
          <span className="planEnd"></span>
          <span className="realityEnd"></span>
        </div>
      </div>
    )
    const menu = (
      <Menu>
        {/* 首先判断issmall,之后判断版本名称，如果不是专业版，不用考虑判断权限，
        直接显示弹窗，如果是专业版，以是否到期为判断条件，如果未到期，判断权限 */}
        {!isSmall && (
          <Menu.Item>
            {taskInfo.modifyPermission ? (
              <a
                onClick={() => {
                  this.setState({ taskMoveShow: true });
                }}
              >
                移动任务
              </a>
            ) : (
                <Tooltip
                  placement="left"
                  title={`您没有修改这条任务的权限`}
                  overlayClassName="createOverlayClass"
                >
                  <a>移动任务</a>
                </Tooltip>
              )}
          </Menu.Item>
        )}
        {!isSmall && (
          <Menu.Item>
            <a
              onClick={() => {
                this.setState({ taskCopyShow: true });
              }}
            >
              复制任务
            </a>
          </Menu.Item>
        )}
        {!isSmall && (
          <Menu.Item>
            {taskInfo.deletePermission ? (
              <a
                onClick={() => {
                  this.showConfirm(
                    "删除任务",
                    "",
                    taskInfo.coopTaskCount > 0
                      ? '当前任务与其他任务存在前后序关联，删除后将自动解除。任务删除后保留30天，专业版可在"设置 - 回收站"中还原，确认删除？'
                      : '任务删除后保留30天，专业版可在"设置 - 回收站"中还原，确认删除？'
                  );
                }}
              >
                删除任务
              </a>
            ) : (
                <Tooltip
                  placement="left"
                  title={`您没有删除这条任务的权限`}
                  overlayClassName="createOverlayClass"
                >
                  <a>删除任务</a>
                </Tooltip>
              )}
          </Menu.Item>
        )}

        <Menu.Item>
          {taskInfo.modifyPermission ? (
            <a
              onClick={() => {
                this.setState({ terminationRestartTaskShow: true });
              }}
            >
              {taskInfo.state === "4" ||
                taskInfo.state === "1" ||
                taskInfo.state === "9" ||
                taskInfo.state === "8"
                ? "重启任务"
                : "终止任务"}
            </a>
          ) : (
              <Tooltip
                placement="left"
                title={`您没有修改这条任务的权限`}
                overlayClassName="createOverlayClass"
              >
                <a>
                  {taskInfo.state === "4" ||
                    taskInfo.state === "1" ||
                    taskInfo.state === "9" ||
                    taskInfo.state === "8"
                    ? "重启任务"
                    : "终止任务"}
                </a>
              </Tooltip>
            )}
        </Menu.Item>
      </Menu>
    );
    let levTxt = "未设置";
    const levOpt = (
      <Menu>
        {dict_lev.map(item => {
          if (item.value === taskInfo.lev) {
            levTxt = item.label;
          }
          return (
            <Menu.Item
              key={item.value}
              value={item.value}
              style={{ textAlign: "center" }}
            >
              <a
                onClick={() => {
                  this.valChange("lev", item.value);
                }}
              >
                {item.label}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    let goButton = "";
    let goButtonAnd = "";
    if (!taskInfo.fzr && taskInfo.state != "4") {
      goButton = (
        <Button
          type="primary"
          style={{
            marginRight: "10px"
          }}
          onClick={() => {
            this.claimTask();
          }}
          className={saveShow ? "compented" : ""}
          disabled={saveShow ? true : false}
        >
          认领任务
        </Button>
      );
    } else if (taskInfo.stateButton) {
      goButton = (
        <Button
          type="primary"
          style={{
            marginRight: "10px"
          }}
          onClick={() => {
            this.completTask();
            this.setState({ LimitTextLength: 0 });
          }}
          className={saveShow ? "compented" : ""}
          disabled={saveShow ? true : false}
          key="bioajiwanc"
        >
          标记完成
        </Button>
      );
    } else if (taskInfo.flowButton) {
      goButtonAnd = (
        <Button
          style={{
            marginRight: "10px"
          }}
          key="bohui"
          onClick={() => {
            this.setState({
              taskCheckModalShow: true,
              taskCheckDesc: "",
              taskCheckModalTitle: "驳回任务",
              taskCompletFiles: [],
              LimitTextLength: 0
            });
          }}
          className={saveShow ? "compented" : ""}
          disabled={saveShow ? true : false}
        >
          驳回
        </Button>
      );
      goButton = (
        <Button
          type="primary"
          onClick={() => {
            this.setState({
              taskCheckModalShow: true,
              taskCheckDesc: "",
              taskCheckModalTitle: "确认完成",
              taskCompletFiles: [],
              LimitTextLength: 0
            });
          }}
          style={{
            marginRight: "10px"
          }}
          className={saveShow ? "compented" : ""}
          disabled={saveShow ? true : false}
        >
          确认完成
        </Button>
      );
    } else if (
      taskInfo.state != "1" &&
      taskInfo.state != "4" &&
      taskInfo.state != "8" &&
      taskInfo.state != "9"
    ) {
      goButton = (
        <div className="dingHover">
          <Button
            type="primary"
            onClick={() => {
              this.setState({ UrgeShow: true });
            }}
            style={{
              marginRight: "10px",
              width: 86
            }}
            className={saveShow ? "compented" : ""}
            disabled={saveShow ? true : false}
          >
            催办
          </Button>
          <span
            className="ding"
            onClick={() => {
              this.DingTaskRespone();
            }}
          >
            DING一下
          </span>
        </div>
      );
    }
    if (
      taskInfo.state == "2" &&
      taskInfo.fzr &&
      taskInfo.fzr.userid === user.userid
    ) {
      goButtonAnd = (
        <Button
          onClick={() => {
            this.setTask("任务撤回", "0", "");
            this.setState({ LimitTextLength: 0 });
          }}
          style={{
            marginRight: "10px"
          }}
        >
          撤回
        </Button>
      );
    }
    return (
      <div
        className="wrap"
        onClick={e => {
          e.stopPropagation();
          this.setState({ LoopTaskShow: false, remindArr: JSON.parse(JSON.stringify(remindArrCoby)), remindShow: false });
        }}
      >
        <Spin spinning={taskInfoLoading} />
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {/*标记完成*/}
        {saveShow && (
          <div
            className={
              saveShow ? `save-btn ${animateClass}` : "save-btn animated_Out"
            }
          >
            <div className="saveText">
              您可在编辑完成后点击右侧按钮进行统一保存
            </div>
            <div className="btn quxiao" onClick={this.handleCancel}>
              取消
            </div>
            <Button
              type="primary"
              className="btn"
              onClick={() => {
                this.save();
              }}
            >
              保存
            </Button>
          </div>
        )}

        <Modal
          title={<div onClick={() => { this.setState({ TIMESHOW: false }) }}>标记完成</div>}
          visible={taskCompleteModalShow}
          wrapClassName="completeClass"
          onCancel={e => {
            this.setState({ taskCompleteModalShow: false, TIMESHOW: false });
          }}
          maskClosable={false}
          footer={[
            <div>
              <div className="completeTime">
                <div className="beginTime">任务开始于：</div>
                <DatePicker
                  allowClear={false}
                  showTime={{
                    format: "HH:mm",
                    defaultValue: moment("00:00", "HH:mm")
                  }}
                  value={moment(relityBegTime)}
                  format={"YYYY-MM-DD HH:mm"}
                  locale={locale}
                  open={TIMESHOW && taskCompleteModalShow}
                  onChange={this.dateChange3}
                  onOk={() => {
                    this.setState({ TIMESHOW: false });
                  }}
                  showToday={false}
                  disabledDate={(current) => { return current > moment().endOf("day") }}
                  disabledTime={() => {
                    if (moment().format("YYYY-MM-DD") == moment(relityBegTime).format("YYYY-MM-DD")) {
                      return {
                        disabledHours: () => this.range(0, 24).splice(moment().hour() + 1, 24),
                        disabledMinutes: () => this.disMinutes()
                      }
                    }
                  }}
                />
                <span
                  className="timeChange"
                  onClick={() => {
                    this.setState({ TIMESHOW: true });
                  }}
                >
                  修改
                </span>
              </div>
              <Button key="backCom" onClick={() => { this.setState({ taskCompleteModalShow: false, TIMESHOW: false }) }}>取消</Button>
              <Button key="submitCom" type="primary"
                loading={taskCompletLoading}
                onClick={() => {
                  this.setTask("标记完成", "1", taskCompletDesc);
                  this.setState({ taskCompletLoading: true, LimitTextLength: 0, TIMESHOW: false });
                }}
              >确定</Button>
            </div>
          ]}
        >
          <TextArea
            placeholder="完成说明"
            autosize={{ minRows: 3, maxRows: 7 }}
            value={taskCompletDesc}
            maxLength="200"
            key="messgeCom"
            onFocus={() => { this.setState({ TIMESHOW: false }) }}
            onChange={e => { this.setState({ taskCompletDesc: e.target.value, TIMESHOW: false, LimitTextLength: e.target.value.length }) }}
          />
          <div className="maxText">
            <span>{LimitTextLength}</span>/<pan>200</pan>
          </div>
          <div className="clearfix">
            <Upload
              action={baseURI + "/files/upload"}
              listType="picture-card"
              fileList={uploadList_state}
              onPreview={file => this.handlePreview("finish", file)}
              multiple={true}
              onChange={val => {
                if (beforeUpload(val.file)) {
                  this.uploadListOnChange_updateState(val);
                }
              }}
            />
          </div>
          <h4
            className="filesTit"
            onClick={() => {
              this.updateImg("标记完成");
            }}
          >
            <i
              className="icon-md-attach iconfont"
              style={{
                top: isIos ? "2px" : "3px",
                position: "relative",
                fontSize: 16
              }}
            />
            添加附件...
          </h4>
          <ul className="comAccessory">
            {taskCompletFiles.map((item, i) => {
              if (item.fileId) {
                return (
                  <li key={item.fileId && item.fileId}>
                    <div className="fileIcon">
                      {createFileIcon(item.fileType)}
                    </div>
                    <span
                      className="textMore tooLong"
                      onClick={() => {
                        dingJS.previewImage(item);
                      }}
                    >
                      {item.fileName}
                    </span>
                    <div className="delte" style={{ right: 30 }}>
                      <Popconfirm
                        title={`是否要删除"${item.fileName}"`}
                        onConfirm={() => { this.dellTaskOkFile(item.fileId) }}
                        okText="删除"
                        cancelText="取消"
                      >
                        <i className="iconfont icon-icon_huabanfuben5" />
                      </Popconfirm>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </Modal>

        {/* {重启终止任务} */}
        <Modal
          title={
            taskInfo.state === "4" ||
              taskInfo.state === "1" ||
              taskInfo.state === "9" ||
              taskInfo.state === "8"
              ? "重启任务"
              : "终止任务"
          }
          wrapClassName="completeClass"
          visible={terminationRestartTaskShow}
          onCancel={e => {
            this.setState({
              terminationRestartTaskShow: false,
              LimitTextLength: 0
            });
          }}
          footer={[
            <Button
              key="back"
              onClick={e => {
                this.setState({
                  terminationRestartTaskShow: false,
                  LimitTextLength: 0
                });
              }}
            >
              取消
            </Button>,
            <Button
              type="primary"
              key="backed"
              onClick={e => {
                this.terminationRestartTask(taskInfo.state, terResTaskDesc);
                this.setState({
                  terminationRestartTaskShow: false,
                  LimitTextLength: 0
                });
              }}
            >
              {taskInfo.state === "4" ||
                taskInfo.state === "1" ||
                taskInfo.state === "9" ||
                taskInfo.state === "8"
                ? "重启"
                : "终止"}
            </Button>
          ]}
        >
          <TextArea
            // style={{ margin: "0 0 10px 0" }}
            placeholder={
              taskInfo.state === "4" ||
                taskInfo.state === "1" ||
                taskInfo.state === "9" ||
                taskInfo.state === "8"
                ? "重启原因"
                : "终止原因"
            }
            maxLength="200"
            value={terResTaskDesc}
            autosize={{ minRows: 2, maxRows: 7 }}
            onChange={e => {
              this.setState({
                terResTaskDesc: e.target.value,
                LimitTextLength: e.target.value.length
              });
            }}
          />
          <div className="maxText">
            <span>{LimitTextLength}</span>/<pan>200</pan>
          </div>
        </Modal>
        {/* 催办任务 */}
        <Modal
          title="催办任务"
          wrapClassName="completeClass"
          visible={UrgeShow}
          onCancel={e => {
            this.setState({ UrgeShow: false, LimitTextLength: 0 });
          }}
          footer={[
            <Button
              key="back"
              onClick={e => {
                this.setState({ UrgeShow: false, LimitTextLength: 0 });
              }}
            >
              取消
            </Button>,
            <Button
              type="primary"
              key="backed"
              onClick={e => {
                this.urgeTask();
              }}
            >
              催办
            </Button>
          ]}
        >
          <TextArea
            placeholder="催办内容"
            maxLength="200"
            value={urgeTaskDesc}
            autosize={{ minRows: 2, maxRows: 7 }}
            onChange={e => {
              this.setState({
                urgeTaskDesc: e.target.value,
                LimitTextLength: e.target.value.length
              });
            }}
          />
          <div className="maxText">
            <span>{LimitTextLength}</span>/<pan>200</pan>
          </div>
        </Modal>
        {/*审核任务*/}
        <Modal
          title={taskCheckModalTitle}
          visible={taskCheckModalShow}
          onCancel={e => {
            this.setState({ taskCheckModalShow: false });
          }}
          wrapClassName="completeClass"
          footer={[
            <Button
              key="quxiao"
              onClick={() => {
                this.setState({
                  taskCheckModalShow: false,
                  LimitTextLength: 0
                });
              }}
            >
              取消
            </Button>,
            taskCheckModalTitle === "驳回任务" ? (
              <Button
                key="back"
                type="primary"
                loading={taskCheckLoading_x}
                disabled={taskCheckLoading_x}
                onClick={() => {
                  this.setTask("任务驳回", "0", taskCheckDesc);
                  this.setState({
                    taskCheckLoading_x: true,
                    LimitTextLength: 0
                  });
                }}
              >
                驳回
              </Button>
            ) : (
                ""
              ),
            taskCheckModalTitle === "确认完成" ? (
              <Button
                key="submit"
                type="primary"
                loading={taskCheckLoading_v}
                onClick={() => {
                  this.setTask("任务通过", "1", taskCheckDesc);
                  this.setState({
                    taskCheckLoading_v: true,
                    LimitTextLength: 0
                  });
                }}
              >
                通过
              </Button>
            ) : (
                ""
              )
          ]}
        >
          <TextArea
            // style={{ margin: "0 0 10px 0" }}
            placeholder={
              taskCheckModalTitle === "驳回任务" ? "驳回原因" : "完成说明"
            }
            value={taskCheckDesc}
            autosize={{ minRows: 3, maxRows: 7 }}
            maxLength="200"
            onChange={e => {
              this.setState({
                taskCheckDesc: e.target.value,
                LimitTextLength: e.target.value.length
              });
            }}
          />
          <div className="maxText">
            <span>{LimitTextLength}</span>/<pan>200</pan>
          </div>
          <div className="clearfix">
            <Upload
              action={baseURI + "/files/upload"}
              listType="picture-card"
              fileList={uploadList_state}
              onPreview={file => this.handlePreview("finish", file)}
              multiple={true}
              onChange={val => {
                if (beforeUpload(val.file)) {
                  this.uploadListOnChange_updateState(val);
                }
              }}
            />
          </div>
          <h4
            className="filesTit"
            onClick={() => {
              this.updateImg("标记完成");
            }}
          >
            <i
              className="icon-md-attach iconfont"
              style={{
                top: isIos ? "2px" : "3px",
                position: "relative",
                fontSize: 16
              }}
            />
            添加附件...
          </h4>
          <ul className="comAccessory">
            {taskCompletFiles.map((item, i) => {
              if (item.fileId) {
                return (
                  <li key={item.fileId}>
                    <div className="fileIcon">
                      {createFileIcon(item.fileType)}
                    </div>
                    <span
                      className="textMore tooLong"
                      onClick={() => {
                        dingJS.previewImage(item);
                      }}
                    >
                      {item.fileName}
                    </span>
                    <div className="delte" style={{ right: 30 }}>
                      <Popconfirm
                        title={`是否要删除"${item.fileName}"`}
                        onConfirm={() => {
                          this.dellTaskOkFile(item.fileId);
                        }}
                        // onCancel={() => {}}
                        okText="删除"
                        cancelText="取消"
                      >
                        <i className="iconfont icon-icon_huabanfuben5" />
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
          onCancel={e => {
            this.setState({ childTaskModalShow: false });
          }}
          wrapClassName="completeClass"
          footer={[
            <Button
              key="back"
              onClick={e => {
                this.setState({
                  childTaskModalShow: false,
                  LimitTextLength: 0
                });
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
                  if (taskInfo.planBeginTime.indexOf("23:59:59") !== -1) {
                    this.setState({ relityBegTime: taskInfo.planBeginTime.slice(0, 10) + " 00:00" })
                  } else {
                    this.setState({ relityBegTime: moment(taskInfo.planBeginTime) })
                  }
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
            <h3>
              共有
              <span style={{ color: "#f77575" }}>
                {sonTaskinfoList ? sonTaskinfoList.length : "0"}
              </span>
              条未完成的子任务
            </h3>
            <div>
              {sonTaskinfoList && sonTaskinfoList.length > 0
                ? sonTaskinfoList.map((item, i) => {
                  return (
                    <p className="taskList" key={item.id}>
                      <span className="taskWbs">
                        {item.taskinfoNumber.numberS
                          ? item.taskinfoNumber.numberS + "." + item.rank
                          : item.rank}
                      </span>
                      <font className="taskName">{item.taskname}</font>
                    </p>
                  );
                })
                : ""}
            </div>
          </div>
        </Modal>
        <div className="fixed-head" ref="fixedHead" id="fixedHeads">
          <div className="crumbs clearfloat" ref="crumbs">
            <div className="crumb-wrap">
              <Tooltip
                placement="bottom"
                title={
                  taskInfo.bread &&
                  taskInfo.bread[0].taskname.length > 11 &&
                  taskInfo.bread[0].taskname
                }
                overlayClassName="createOverlayClass"
                trigger="hover"
                onClick={() => {
                  if (taskInfo.isMember) {
                    Router.push("/pc_projectDetails?id=" + taskInfo.project.id);
                  }
                }}
              >
                <div className={taskInfo.isMember ? "breadList" : "breadLists"}>
                  {this.subTaskNameBread(taskInfo.bread && taskInfo.bread[0])}
                </div>
              </Tooltip>
              {taskInfo.bread && taskInfo.bread.length > 1 && (
                <span className="space">/</span>
              )}
              {taskInfo.bread &&
                taskInfo.bread.map((item, i) => {
                  if (i !== 0) {
                    return (
                      <div key={item.id} className="breadList">
                        <span
                          className="taskName"
                          onClick={() => {
                            this.getTaskDetail(item.id, this.props.projectId);
                            this.getChildTaskList(item.id);
                            this.getFileList(item.id);
                            this.getCoopTaskList(item.id);
                          }}
                        >
                          <Tooltip
                            placement="bottom"
                            title={
                              item.taskname &&
                              item.taskname.length > 11 &&
                              item.taskname
                            }
                            trigger="hover"
                            overlayClassName="createOverlayClass"
                          >
                            {this.subTaskNameBread(item)}
                          </Tooltip>
                        </span>
                        <span className="space">/</span>
                      </div>
                    );
                  }
                })}
            </div>
            <div className="btn-wrap">
              <Tooltip placement="bottom" title={"任务提醒"} trigger="hover">
                <Popover
                  content={remindContent}
                  overlayClassName="loopPopover1"
                  title=""
                  trigger="click"
                  visible={remindShow && this.props.taskDetailShow && this.props.closeed && !this.returnTimeVal(taskInfo) && taskInfo.modifyPermission}
                  placement="bottomRight"
                  arrowPointAtCenter={true}
                  autoAdjustOverflow
                >
                  <li
                    className="remindClass"
                    style={remindArr.length > 0 ? { borderColor: "#64b5f6" } : {}}
                    onClick={e => {
                      e.stopPropagation();
                      this.props.closeedCal();
                      this.setState({ remindShow: !remindShow, remindArr: JSON.parse(JSON.stringify(remindArrCoby)), LoopTaskShow: false });
                    }}
                  >
                    <i
                      style={remindArr.length > 0 ? { color: "#64b5f6" } : {}}
                      className="icon-huabanfuben iconfont"
                    />
                  </li>
                </Popover>
              </Tooltip>
              <Tooltip
                placement="bottom"
                title={
                  verName === "基础版" ||
                    verName === "免费版" ||
                    verName === "" ||
                    verName === "试用版"
                    ? "重复规则(专业版功能)"
                    : "重复规则"
                }
                trigger="hover"
              >
                <Popover
                  content={
                    (taskInfo.isCycle && taskInfo.isCycle === "1") ||
                      taskInfo.isCycle === "2"
                      ? loopTaskRead
                      : loopContent
                  }
                  overlayClassName="loopPopover"
                  title=""
                  trigger="click"
                  visible={
                    LoopTaskShow &&
                    this.props.taskDetailShow &&
                    this.props.closeed
                  }
                  placement="bottomRight"
                  // getPopupContainer={() => document.getElementById("repeatBox")}
                  arrowPointAtCenter={true}
                  autoAdjustOverflow
                >
                  {(taskInfo.isCycle && taskInfo.isCycle === "1") ||
                    taskInfo.isCycle === "2" ? (
                      <li
                        className={
                          taskInfo.isCycle === "1" || taskInfo.isCycle === "2"
                            ? "milestone"
                            : ""
                        }
                        onClick={e => {
                          e.stopPropagation();

                          if (verName === "基础版" || verName === "免费版") {
                          } else {
                            this.props.closeedCal();
                            this.setState({
                              LoopTaskShow: !LoopTaskShow,
                              remindArr: JSON.parse(JSON.stringify(remindArrCoby)),
                              remindShow: false,

                            });
                          }
                        }}
                        style={{ lineHeight: isIos ? "30px" : "26px" }}
                      >
                        <i className="milestone icon-xunhuan iconfont" />
                      </li>
                    ) : (
                      <li
                        onClick={e => {
                          e.stopPropagation();
                          if (verName === "基础版" || verName === "免费版") {
                          } else {
                            if (verName === "基础版" || verName === "免费版") {
                            } else {
                              this.props.closeedCal();
                              this.setState({
                                LoopTaskShow: !LoopTaskShow,
                                remindArr: JSON.parse(JSON.stringify(remindArrCoby)),
                                remindShow: false,
                              });
                            }
                          }
                        }}
                        style={{
                          lineHeight: isIos ? "30px" : "26px",
                          color: "#757575"
                        }}
                      >
                        <i className="icon-xunhuan iconfont" />
                        {verName === "基础版" ||
                          verName === "免费版" ||
                          verName === "" ||
                          verName === "试用版" ? (
                            <img
                              src="../static/react-static/pcvip/imgs/icon_zuanshi.jpg"
                              className="imgOrz"
                            />
                          ) : (
                            ""
                          )}
                      </li>
                    )}
                </Popover>
              </Tooltip>
              <Tooltip
                placement="bottom"
                title={taskInfo.milestone === "1" ? "取消里程碑" : "设置里程碑"}
                trigger="hover"
              >
                {taskInfo.milestone === "1" ? (
                  <li
                    className={taskInfo.milestone === "1" ? "milestone" : ""}
                    onClick={e => {
                      this.milestone(e, "取消", taskInfo.id);
                    }}
                    style={{ lineHeight: isIos ? "30px" : "26px" }}
                  >
                    <i className="milestone icon-flaged iconfont" />
                  </li>
                ) : (
                    <li
                      onClick={e => {
                        this.milestone(e, "设置", taskInfo.id);
                      }}
                      style={{
                        lineHeight: isIos ? "30px" : "26px",
                        color: "#757575"
                      }}
                    >
                      <i className="icon-flag iconfont" />
                    </li>
                  )}
              </Tooltip>

              <Tooltip
                placement="bottom"
                title={taskInfo.attention ? "取消关注" : "关注任务"}
                trigger="hover"
              >
                <li
                  className={taskInfo.attention ? "attention" : ""}
                  style={{
                    lineHeight: isIos ? "30px" : "26px",
                    color: "#757575"
                  }}
                  onClick={() => {
                    this.attentionClick();
                  }}
                >
                  <i
                    className={
                      taskInfo.attention
                        ? "attention icon-stared iconfont"
                        : "icon-star iconfont"
                    }
                  />
                </li>
              </Tooltip>
              <Dropdown
                overlay={menu}
                placement={"bottomRight"}
                trigger={["click"]}
              >
                <li
                  style={{
                    lineHeight: isIos ? "30px" : "26px",
                    color: "#757575"
                  }}
                >
                  <i className="icon-more1 iconfont " />
                </li>
              </Dropdown>
            </div>
          </div>
          <div className="task-title" ref="title">
            <div
              className="task-status"
              style={{
                top: setColorTaskState(taskInfo.state).Color.top,
                left: setColorTaskState(taskInfo.state).Color.left
              }}
            >
              {setColorTaskState(taskInfo.state).name}
            </div>
            <div
              className="triangle_border"
              style={{
                borderColor: setColorTaskState(taskInfo.state).Color.borderColor
              }}
            />
            <div className="left">
              <span>#{taskInfo.number}</span>
              {jurisdiction ? (
                taskInfo.modifyPermission ? (
                  <TextArea
                    className="titleBox"
                    placeholder="请输入标题"
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={taskInfo.name}
                    maxLength="50"
                    style={{
                      backgroundColor: "#fff",
                      color: "#212121",
                      resize: "none"
                    }}
                    onChange={e => {
                      this.valChange("name", e.target.value.replace("\n", ""));
                    }}
                  />
                ) : (
                    <Tooltip
                      placement="top"
                      title={`您没有修改这条任务的权限`}
                      overlayClassName="createOverlayClass"
                    >
                      <TextArea
                        className="titleBox"
                        placeholder="请输入标题"
                        autosize={{ minRows: 1, maxRows: 2 }}
                        value={taskInfo.name}
                        disabled
                        style={{
                          backgroundColor: "#fff",
                          color: "#212121",
                          resize: "none"
                        }}
                      />
                    </Tooltip>
                  )
              ) : (
                  <TextArea
                    className="titleBox"
                    placeholder="请输入标题"
                    autosize={{ minRows: 1, maxRows: 2 }}
                    value={taskInfo.name}
                    disabled
                    style={{
                      backgroundColor: "#fff",
                      color: "#212121",
                      resize: "none"
                    }}
                  />
                  // <div className="show">{taskInfo.name}</div>
                )}
            </div>
            <div className="right">
              <div
                className="btn"
                style={{
                  display: "flex"
                }}
              >
                {goButtonAnd}
                {goButton}
              </div>
            </div>
          </div>
          <div className="task-info">
            <div className="item">
              <div className="left">
                <i
                  className="icon-user iconfont"
                  style={{ top: isIos ? "0px" : "3px" }}
                />
                <span className="justify justifys">负责人</span>
              </div>
              <div className="right">
                {jurisdiction ? (
                  taskInfo.modifyPermission ? (
                    <div className="person">
                      {taskInfo.fzr &&
                        taskInfo.fzr.photo &&
                        taskInfo.fzr.photo !== "" ? (
                          <img
                            src={taskInfo.fzr && taskInfo.fzr.photo}
                            onClick={() => {
                              this.selUser(
                                "负责人",
                                jurisdiction && taskInfo.modifyPermission
                              );
                            }}
                          />
                        ) : taskInfo.fzr.name ? (
                          <div
                            className="noPhoto"
                            onClick={() => {
                              this.selUser(
                                "负责人",
                                jurisdiction && taskInfo.modifyPermission
                              );
                            }}
                          >
                            {taskInfo.fzr.name.substr(0, 1)}
                          </div>
                        ) : (
                            <svg
                              className="download"
                              aria-hidden="true"
                              onClick={() => {
                                this.selUser(
                                  "负责人",
                                  jurisdiction && taskInfo.modifyPermission
                                );
                              }}
                            >
                              <use xlinkHref="#icon-file-avatar" />
                            </svg>
                          )}
                      {taskInfo.fzr && taskInfo.fzr.name ? (
                        <span
                          onClick={() => {
                            this.selUser(
                              "负责人",
                              jurisdiction && taskInfo.modifyPermission
                            );
                          }}
                          style={{ minWidth: 60 }}
                        >
                          {taskInfo.fzr.name}
                          {taskInfo.fzr && taskInfo.fzr.name ? (
                            <i
                              className="iconfont icon-clears delPerson"
                              onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.valChange("fzr", "DELL");
                              }}
                            />
                          ) : (
                              ""
                            )}
                        </span>
                      ) : (
                          <span
                            onClick={() => {
                              this.selUser(
                                "负责人",
                                jurisdiction && taskInfo.modifyPermission
                              );
                            }}
                            style={{ color: "#bdbdbd" }}
                          >
                            选择
                        </span>
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
                            <span style={{ minWidth: 60 }}>
                              {taskInfo.fzr.name}
                            </span>
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
                        <span style={{ minWidth: 60 }}>{taskInfo.fzr.name}</span>
                      ) : (
                          <span style={{ color: "#bdbdbd" }}>选择</span>
                        )}
                    </div>
                  )}
              </div>
            </div>
            <div className="item" ref="confirm">
              <div className="left">
                <i
                  className="icon-checker iconfont"
                  style={{ top: isIos ? "0px" : "3px" }}
                />
                <span className="justify justifys">确认人</span>
              </div>
              <div className="right">
                {jurisdiction ? (
                  taskInfo.modifyPermission ? (
                    <div className="person">
                      {taskInfo.qrr && taskInfo.qrr.photo ? (
                        <img
                          src={taskInfo.qrr && taskInfo.qrr.photo}
                          onClick={() => {
                            this.selUser(
                              "确认人",
                              jurisdiction && taskInfo.modifyPermission
                            );
                          }}
                        />
                      ) : taskInfo.qrr && taskInfo.qrr.name ? (
                        <div
                          className="noPhoto"
                          onClick={() => {
                            this.selUser(
                              "确认人",
                              jurisdiction && taskInfo.modifyPermission
                            );
                          }}
                        >
                          {taskInfo.qrr.name.substr(0, 1)}
                        </div>
                      ) : (
                            <svg
                              className="download"
                              aria-hidden="true"
                              onClick={() => {
                                this.selUser(
                                  "确认人",
                                  jurisdiction && taskInfo.modifyPermission
                                );
                              }}
                            >
                              <use xlinkHref="#icon-file-avatar" />
                            </svg>
                          )}
                      {/* <span
                        style={
                          taskInfo.qrr && taskInfo.qrr.name
                            ? { color: "#424242", minWidth: 60 }
                            : { color: "#bdbdbd", minWidth: 60 }
                        }
                        onClick={() => {
                          this.selUser(
                            "确认人",
                            jurisdiction && taskInfo.modifyPermission
                          );
                        }}
                      > */}
                      {taskInfo.qrr && taskInfo.qrr.name ? (
                        <span
                          style={{ minWidth: 60 }}
                          onClick={() => {
                            this.selUser(
                              "确认人",
                              jurisdiction && taskInfo.modifyPermission
                            );
                          }}
                        >
                          {taskInfo.qrr.name}
                          {taskInfo.qrr && taskInfo.qrr.name ? (
                            <i
                              className="iconfont icon-clears delPerson"
                              onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.valChange("qrr", "DELL");
                              }}
                            />
                          ) : (
                              ""
                            )}
                        </span>
                      ) : (
                          <span
                            style={{ color: "#bdbdbd" }}
                            onClick={() => {
                              this.selUser(
                                "确认人",
                                jurisdiction && taskInfo.modifyPermission
                              );
                            }}
                          >
                            选择
                        </span>
                        )}
                      {/* </span> */}
                      {/* {taskInfo.qrr.name ? (
                        <div className="delPerson">
                          <i
                            className="iconfont icon-clears"
                            onClick={e => {
                              e.stopPropagation();
                              e.preventDefault();
                              this.valChange("qrr", "DELL");
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )} */}
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
                            style={
                              taskInfo.qrr && taskInfo.qrr.name
                                ? { color: "#424242", minWidth: 60 }
                                : { color: "#bdbdbd", minWidth: 60 }
                            }
                          >
                            {taskInfo.qrr && taskInfo.qrr.name
                              ? taskInfo.qrr.name
                              : "选择"}
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
                    <span
                      style={
                        taskInfo.qrr && taskInfo.qrr.name
                          ? { color: "#424242", minWidth: 60 }
                          : { color: "#bdbdbd", minWidth: 60 }
                      }
                      className={!taskInfo.qrr ? "empty" : ""}
                    >
                      {taskInfo.qrr ? taskInfo.qrr.name : "选择"}
                    </span>
                  </div>
                ) : (
                      <span style={{ fontSize: 14, color: "#bdbdbd" }}>未设置</span>
                    )}
              </div>
            </div>
            <div ref="endtime" className="item none">
              <div className="left">
                <i
                  className="icon-calendar1 iconfont"
                  style={{ top: isIos ? "0px" : "3px" }}
                />
                <span className="justify justifys">
                  {taskInfo.state === "1" ||
                    taskInfo.state === "8" ||
                    taskInfo.state === "9"
                    ? "完成时间"
                    : "截止时间"}
                </span>
              </div>
              <div className="right">
                {taskInfo.modifyPermission ? (
                  <DatePicker
                    className={
                      this.returnTimeVal(taskInfo)
                        ? "timePicker disabledTime"
                        : "timePicker "
                    }
                    onPanelChange={(val, mode) => {
                      this.valChange(
                        "planEndTime",
                        moment(val).format("YYYY-MM-DD")
                      );
                      if (mode === "time") {
                        this.setState({ modeTime: false, isDealDates: false });
                      } else {
                        this.setState({ modeTime: true });
                      }
                    }}
                    locale={locale}
                    format={isDealDates ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                    suffixIcon={null}
                    placeholder="选择截止时间"
                    disabled={this.returnTimeVal(taskInfo)}
                    value={datadetail ? moment(datadetail) : null}
                    showTime={{
                      format: "HH:mm",
                      defaultValue: moment("00:00", "HH:mm")
                    }}
                    onChange={(data, strData) => {
                      if (strData == "") {
                        this.setState({ isDealDates: true })
                      }
                      this.valChange("planEndTime", strData);
                    }}
                  />
                ) : (
                    <Tooltip
                      placement="top"
                      title={`您没有修改这条任务的权限`}
                      overlayClassName="createOverlayClass"
                      trigger="hover"
                    >
                      <div style={{ fontSize: 14, width: 140, display: "inline-block" }}>
                        {this.returnTimeVals(taskInfo) ? taskInfo.planEndTime ? moment(taskInfo.planEndTime).format("YYYY-MM-DD HH:mm") :
                          <span style={{ color: "#bdbdbd" }}>选择截止时间</span> :
                          taskInfo.realityEndTime ? moment(taskInfo.realityEndTime).format("YYYY-MM-DD HH:mm") :
                            <span style={{ color: "#bdbdbd" }}>选择截止时间</span>}
                      </div>
                    </Tooltip>
                  )}
              </div>
            </div>
          </div>
          <div className="topBgc" ref="topBgc" />
        </div>

        <div
          ref="scrollEle"
          id="scrollWrap"
          className="scroll-wrap"
          onScroll={this.handleScroll.bind(this)}
          onClick={e => {
            e.stopPropagation();
            this.setState({ LoopTaskShow: false, remindArr: JSON.parse(JSON.stringify(remindArrCoby)), remindShow: false, });

          }}
        >
          <div ref="heightCenter">
            <div className="task-info">
              <div className="item" style={{ width: "100%" }}>
                <div className="left">
                  <i
                    className="icon-calendar1 iconfont"
                    style={{ top: isIos ? "0px" : "3px" }}
                  />
                  <span className="justify justifys "> 时间</span>
                </div>
                <div className="right">
                  {taskInfo.modifyPermission ? (
                    this.returnTimeVals(taskInfo) ?
                      <div>
                        <DatePicker
                          disabled={this.returnTimeVal(taskInfo)}
                          value={startTimeDetail ? moment(startTimeDetail) : null}
                          onPanelChange={this.modeChange2}
                          onChange={this.dateChange2}
                          placeholder={this.returnTimeVal(taskInfo) ? "未设置" : "设置开始时间"}
                          format={!this.returnTimeVals(taskInfo) ? "YYYY-MM-DD HH:mm" : beginTimeShow ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                          className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : beginTimeShow ? "timePicker showTime" : "timePicker"}
                          locale={locale}
                          suffixIcon={null}
                          showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                          disabledDate={this.disabledDateStart}
                          disabledTime={this.disabledDateStartTime}
                        />
                        <span style={{ marginRight: 10 }}>-</span>
                        <DatePicker
                          className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : isDealDates ? "timePicker showTime" : "timePicker"}
                          locale={locale}
                          onPanelChange={(val, mode) => {
                            this.valChange("planEndTime", moment(val).format("YYYY-MM-DD"));
                            if (mode === "time") {
                              this.setState({ modeTime: false, isDealDates: false });
                            } else {
                              this.setState({ modeTime: true });
                            }
                          }}
                          format={!this.returnTimeVals(taskInfo) ? "YYYY-MM-DD HH:mm" : isDealDates ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                          suffixIcon={null}
                          placeholder="选择截止时间"
                          disabled={this.returnTimeVal(taskInfo)}
                          value={datadetail ? moment(datadetail) : null}
                          showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                          onChange={(data, strData) => {
                            if (strData == "") {
                              this.setState({ isDealDates: true })
                            }
                            this.valChange("planEndTime", strData);
                          }}
                          disabledDate={this.disabledDateEnd}
                          disabledTime={this.disabledDateEndTime}
                        />
                      </div>
                      : <div>
                        <Popover content={timeLineContent} title={null} trigger="hover" overlayClassName="myPopover">
                          <span>
                            <DatePicker
                              disabled={this.returnTimeVal(taskInfo)}
                              value={startTimeDetail ? moment(startTimeDetail) : null}
                              onPanelChange={this.modeChange2}
                              onChange={this.dateChange2}
                              placeholder={this.returnTimeVal(taskInfo) ? "未设置" : "设置开始时间"}
                              format={!this.returnTimeVals(taskInfo) ? "YYYY-MM-DD HH:mm" : beginTimeShow ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                              className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : beginTimeShow ? "timePicker showTime" : "timePicker"}
                              locale={locale}
                              suffixIcon={null}
                              showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                              disabledDate={this.disabledDateStart}
                              disabledTime={this.disabledDateStartTime}
                            />
                            <span style={{ marginRight: 10 }}>-</span>
                            <DatePicker
                              className={this.returnTimeVal(taskInfo) ? "timePicker disabledTime" : isDealDates ? "timePicker showTime" : "timePicker"}
                              locale={locale}
                              onPanelChange={(val, mode) => {
                                this.valChange("planEndTime", moment(val).format("YYYY-MM-DD"));
                                if (mode === "time") {
                                  this.setState({ modeTime: false, isDealDates: false });
                                } else {
                                  this.setState({ modeTime: true });
                                }
                              }}
                              format={!this.returnTimeVals(taskInfo) ? "YYYY-MM-DD HH:mm" : isDealDates ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                              suffixIcon={null}
                              placeholder="选择截止时间"
                              disabled={this.returnTimeVal(taskInfo)}
                              value={datadetail ? moment(datadetail) : null}
                              showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                              onChange={(data, strData) => {
                                if (strData == "") {
                                  this.setState({ isDealDates: true })
                                }
                                this.valChange("planEndTime", strData);
                              }}
                              disabledDate={this.disabledDateEnd}
                              disabledTime={this.disabledDateEndTime}
                            />
                          </span>
                        </Popover>
                      </div>
                  ) : (
                      <Tooltip
                        placement="top"
                        title={`您没有修改这条任务的权限`}
                        overlayClassName="createOverlayClass"
                        trigger="hover"
                      >
                        <div style={{ fontSize: 14, width: 140, display: "inline-block" }}>
                          {this.returnTimeVals(taskInfo) ? taskInfo.planBeginTime ? moment(taskInfo.planBeginTime).format("YYYY-MM-DD HH:mm") :
                            <span style={{ color: "#bdbdbd" }}>选择开始时间</span> :
                            taskInfo.realityBeginTime ? moment(taskInfo.realityBeginTime).format("YYYY-MM-DD HH:mm") :
                              <span style={{ color: "#bdbdbd" }}>选择开始时间</span>}
                        </div>
                        <span style={{ marginRight: 10 }}>-</span>
                        <div style={{ fontSize: 14, width: 140, display: "inline-block" }}>
                          {this.returnTimeVals(taskInfo) ? taskInfo.planEndTime ? moment(taskInfo.planEndTime).format("YYYY-MM-DD HH:mm") :
                            <span style={{ color: "#bdbdbd" }}>选择截止时间</span> :
                            taskInfo.realityEndTime ? moment(taskInfo.realityEndTime).format("YYYY-MM-DD HH:mm") :
                              <span style={{ color: "#bdbdbd" }}>选择截止时间</span>}
                        </div>
                      </Tooltip>
                    )}
                </div>
              </div>
            </div>
            <div className="task-info">
              <div className="item">
                <div className="left">
                  <i
                    className="icon-timer iconfont"
                    style={{ top: isIos ? "0px" : "3px" }}
                  />
                  <span className="justify justifys">计划工期</span>
                </div>
                <div className="right">
                  <div className="valBox">
                    <div className="val">
                      {jurisdiction ? (
                        taskInfo.modifyPermission ? (
                          // <Input
                          //   style={{ height: 24, fontSize: 14, color: "#424242" }}
                          //   value={taskInfo.workTime ? taskInfo.workTime : ""}
                          //   placeholder="未设置"
                          //   onChange={e => {
                          //     onlyNumber(e.target);
                          //     this.valChange("workTime", e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"));
                          //   }}
                          // />
                          <InputNumber
                            style={{ border: "none", width: "140px", height: 24, color: "#424242" }}
                            defaultValue={1.00}
                            className="inputNumber"
                            min={0}
                            precision={2}
                            value={taskInfo.workTime}
                            formatter={value => this.formatterChange(value)}
                            parser={value => value.replace("天", '')}
                            onChange={e => { this.valChange("workTime", e) }}
                            onFocus={() => { this.setState({ InputNumberFoc: true }) }}
                            onBlur={() => { this.setState({ InputNumberFoc: false }) }}
                          />
                        ) : (
                            <Tooltip
                              placement="top"
                              title={`您没有修改这条任务的权限`}
                              overlayClassName="createOverlayClass"
                              trigger="hover"
                            >
                              <div style={{ fontSize: 14, color: "#424242" }}>
                                {taskInfo.workTime ? (
                                  taskInfo.workTime
                                ) : (
                                    <span style={{ color: "#bdbdbd" }}>未设置</span>
                                  )}
                              </div>
                            </Tooltip>
                          )
                      ) : (
                          <div style={{ fontSize: 14, color: "#424242" }}>
                            {taskInfo.workTime ? (
                              taskInfo.workTime
                            ) : (
                                <span style={{ color: "#bdbdbd" }}>未设置</span>
                              )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="left">
                  <i
                    className="icon-target1 iconfont"
                    style={{ top: isIos ? "0px" : "3px" }}
                  />
                  <span className="justify justifys">任务绩效</span>
                </div>
                <div className="right" style={{ height: 32 }}>
                  {taskInfo.modifyPermission ||
                    (taskInfo.qrr && taskInfo.qrr.id === user && user.id) ? (
                      taskInfo.state !== "4" ? (
                        <Input
                          style={{ border: "none", width: "140px", height: 24, color: "#424242" }}
                          value={taskInfo.taskMoney ? taskInfo.taskMoney : ""}
                          placeholder="未设置"
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
                      <Tooltip
                        placement="top"
                        title={`您没有修改这条任务的权限`}
                        overlayClassName="createOverlayClass"
                        trigger="click"
                      >
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
              {/* <div className="item">
                <div className="left">
                  <i
                    className="icon-level iconfont"
                    style={{ top: isIos ? "0px" : "3px" }}
                  />
                  <span className="justify justifys">优先级</span>
                </div>
                <div className="right">
                  <div className="valBox">
                    {jurisdiction ? (
                      taskInfo.modifyPermission ? (
                        <Dropdown trigger={["click"]} overlay={levOpt}>
                          {levTxt !== "未设置" ? (
                            <div style={{ fontSize: 14 }}>{levTxt}</div>
                          ) : (
                              <div style={{ color: "#bdbdbd", fontSize: 14 }}>
                                未设置
                            </div>
                            )}
                        </Dropdown>
                      ) : (
                          <Tooltip
                            placement="top"
                            title={`您没有修改这条任务的权限`}
                            overlayClassName="createOverlayClass"
                            trigger="hover"
                          >
                            {levTxt !== "未设置" ? (
                              <div style={{ fontSize: 14 }}>{levTxt}</div>
                            ) : (
                                <div style={{ color: "#bdbdbd", fontSize: 14 }}>
                                  未设置
                            </div>
                              )}
                          </Tooltip>
                        )
                    ) : levTxt !== "未设置" ? (
                      <div style={{ fontSize: 14 }}>{levTxt}</div>
                    ) : (
                          <div style={{ color: "#bdbdbd", fontSize: 14 }}>
                            未设置
                      </div>
                        )}
                  </div>
                </div>
              </div> */}
            </div>

            <div className="taskTag">
              <div className="item">
                <div className="left">
                  <i
                    className="icon-biaoqian iconfont"
                    style={{ top: isIos ? "6px" : "9px" }}
                  />
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
                          return (
                            <span
                              style={{
                                margin: "3px 5px 0 0px",
                                fontSize: "12px",
                                border: "1px solid #eee",
                                height: "22px",
                                float: "left",
                                padding: "0 !important",
                                position: "relative",
                                width: "70px",
                                lineHeight: "22px",
                                textAlign: "center",
                                color: "#bdbdbd",
                                borderRadius: "2px"
                              }}
                            >
                              添加新标签
                            </span>
                          );
                        }}
                        maxHeight="300px"
                        isSmall={this.props.isSmall}
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
                              <div
                                className="valBox"
                                style={{ lineHeight: "35px" }}
                              >
                                <span
                                  style={{
                                    fontSize: "14px",
                                    color: "#bdbdbd",
                                    marginLeft: 3
                                  }}
                                >
                                  未设置
                            </span>
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
                          <span style={{ fontSize: "14px", color: "#bdbdbd" }}>
                            未设置
                      </span>
                        </div>
                      )}
                </div>
              </div>
            </div>
            {/* 任务描述 */}
            <div className="taskDesc">
              <div className="item">
                <div className="left">
                  <i
                    className="icon-note iconfont"
                    style={{ top: isIos ? "0px" : "3px" }}
                  />
                  <span className="justify  justifys">任务描述</span>
                </div>
                <div className="right">
                  {jurisdiction ? (
                    taskInfo.modifyPermission ? (
                      <div className="taskSolids">
                        {!textareaLike ? (
                          <TextArea
                            className="textAreaStyle"
                            placeholder="请输入任务描述（tips：截图可Ctr+V快速上传~）"
                            autosize={{ minRows: 2, maxRows: 6 }}
                            onPaste={e => {
                              this.pasteingImg("描述附件", e);
                            }}
                            onChange={e => {
                              this.valChange("desc", e.target.value);
                            }}
                            value={taskInfo.desc}
                            autoFocus
                            onFocus={() => {
                              this.setState({
                                addaccessory: true,
                                detailTxtEdit: true,
                                isFocus: true,
                                taskSilderChange: "change",
                                onFocussssss: true
                              });
                            }}
                            onBlur={() => {
                              this.setState({
                                isFocus: false,
                                onFocussssss: false,
                                taskSilderChange: "change",
                                textareaLike: true
                              });
                            }}
                          />
                        ) : (
                            <div
                              className="textTextArea"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({ textareaLike: false });
                              }}
                              dangerouslySetInnerHTML={{
                                __html: this.regUrl(taskInfo)
                              }}
                            />
                          )}
                        {uploadList_desc.length === 0 ? (
                          ""
                        ) : (
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
                          )}

                        {jurisdiction &&
                          detailTxtEdit &&
                          addaccessory &&
                          taskInfo.modifyPermission && (
                            <div
                              className="filesTit"
                              onClick={() => {
                                this.updateImg("描述附件");
                              }}
                            >
                              <i
                                className="icon-md-attach iconfont"
                                style={{
                                  top: isIos ? "2px" : "3px",
                                  position: "relative",
                                  fontSize: 16
                                }}
                              />
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
                              <div
                                className="textTextArea"
                                dangerouslySetInnerHTML={{
                                  __html: this.regUrl(taskInfo)
                                }}
                              />
                            ) : (
                                <TextArea
                                  className="textAreaStyle"
                                  autosize={{ minRows: 3, maxRows: 6 }}
                                  value={"未填写任务描述"}
                                  style={{ color: "#bdbdbd" }}
                                  disabled={true}
                                />
                              )}
                            {uploadList_desc.length === 0 ? (
                              ""
                            ) : (
                                <div className="clearfix disableList">
                                  <Upload
                                    action={baseURI + "/files/upload"}
                                    listType="picture-card"
                                    onPreview={file => { this.handlePreview("desc", file) }}
                                    fileList={uploadList_desc}
                                    disabled={true}
                                  />
                                </div>
                              )}
                          </div>
                        </Tooltip>
                      )
                  ) : (
                      <div className="taskSolids">
                        {taskInfo.desc ? (
                          <div
                            className="textTextArea"
                            dangerouslySetInnerHTML={{
                              __html: this.regUrl(taskInfo)
                            }}
                          />
                        ) : (
                            <TextArea
                              className="textAreaStyle"
                              autosize={{ minRows: 3, maxRows: 6 }}
                              value={"未填写任务描述"}
                              style={{ color: "#bdbdbd" }}
                              disabled={true}
                            />
                          )}
                        {uploadList_desc.length === 0 ? (
                          ""
                        ) : (
                            <div className="clearfix disableList">
                              <Upload
                                action={baseURI + "/files/upload"}
                                listType="picture-card"
                                onPreview={file => { this.handlePreview("desc", file) }}
                                fileList={uploadList_desc}
                                disabled={true}
                              />
                            </div>
                          )}
                      </div>
                    )}
                  {/* 图片 */}
                  {/* 附件预览 */}
                  <ul className="accessory">
                    {taskInfo.descFiles &&
                      taskInfo.descFiles.map((item, i) => {
                        if (item.fileId && item.type !== "DELL") {
                          return (
                            <li
                              key={item.fileId}
                              onClick={() => {
                                dingJS.previewImage(item);
                              }}
                            >
                              <div className="fileIcon">
                                {createFileIcon(item.fileType)}
                              </div>
                              <span className="textMore tooLong">
                                {item.fileName}
                              </span>
                              {detailTxtEdit &&
                                jurisdiction &&
                                taskInfo.modifyPermission ? (
                                  <Popconfirm
                                    title={`是否要删除"${item.fileName}"`}
                                    onConfirm={e => {
                                      this.dellDescFileById(item);
                                    }}
                                    okText="删除"
                                    cancelText="取消"
                                  >
                                    <div
                                      className="delte"
                                      onClick={e => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <i className="iconfont icon-icon_huabanfuben5" />
                                    </div>
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
                  this.topValueInite();
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
              writeContent={val => {
                this.writeContent(val);
              }}
              getTaskDetail={(taskId, proId) => {
                this.getTaskDetail(taskId, proId);
              }}
              SetTaskCollect={data => {
                // this.getTaskDetail(taskId, proId);
                //关注人
                let collectList = [];
                if (data) {
                  data.map(item => {
                    collectList.push(item.user);
                  });
                }
                taskInfo.collectListAll = data;
                taskInfo.collectList = collectList;
                this.setState({
                  taskInfo: taskInfo
                });
              }}
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
                people: {
                  id: "",
                  nickname: ""
                }
              }
            });
            this.getTaskDetail(taskId, proId);
          }}
        />
        {/*移动任务*/}
        {taskMoveShow ? (
          <TaskMove
            task={{
              id: taskInfo.id,
              name: taskInfo.name,
              projectId: taskInfo.project.id,
              projectName: taskInfo.project.name
            }}
            closedCallback={() => {
              this.setState({ taskMoveShow: false });
            }}
            successCallBack={moveObj => {
              if (this.props.updatedTaskCallBack) {
                this.getTaskDetail(taskInfo.id, taskInfo.project.id);
                this.props.updatedTaskCallBack(moveObj);
              }
            }}
          />
        ) : (
            ""
          )}
        {/*复制任务*/}
        {taskCopyShow ? (
          <TaskCopy
            task={{
              id: taskInfo.id,
              name: taskInfo.name,
              parentId: "0",
              projectId: taskInfo.project.id,
              projectName: taskInfo.project.name,
              childCount: taskInfo.childCount,
              coopTaskCount: taskInfo.coopTaskCount
            }}
            closedCallback={() => {
              this.setState({ taskCopyShow: false });
            }}
            successCallBack={copyObj => {
              if (this.props.updatedTaskCallBack) {
                this.props.updatedTaskCallBack(copyObj);
              }
            }}
          />
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default TaskLayout;
