import React from "react";
import withRedux from "next-redux-wrapper";
import { bindActionCreators } from "redux";
import { initStore } from "../store";
import {
  Layout,
  Menu,
  Icon,
  Button,
  Checkbox,
  Select,
  Radio,
  Spin,
  DatePicker,
  Input,
  message,
  Modal,
  Tooltip
} from "antd";
import moment from "moment";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";

import stylesheet from "styles/views/task.scss";
import Head from "../components/header";
import TaskList from "../components/taskList";
import FreeLimitModal from "../components/common/freeLimitModal";

import TaskDetail from "../components/task/TaskLayout";
import MoreTaskEdit from "../components/moreTaskEdit";
import Tag from "../components/tag";
import TaskCreate from "../components/CreatTask";
import * as taskAction from "../core/actions/task";

import {
  getTaskListByCondition,
  getDictsByTypes,
  getLimtTask,
  getTaskListByConditionNew
} from "../core/service/task.service";
import { getProListByJurisdiction } from "../core/service/project.service";
import {
  listScroll,
  dateToString,
  getTeamInfoWithMoney,
  onlyNumber,
  isLoadingErr,
  isIosSystem
} from "../core/utils/util";
import Storage from "../core/utils/storage";
import dingJS from "../core/utils/dingJSApi";
import MoneyEnd from "../components/moneyEnd";
import NullView from "../components/nullView";
import VersionUpdate from "../components/versionUpdate";
import ProjectSelect from "../components/projectSelect";

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const dateFormat = "YYYY-MM-DD";
const confirm = Modal.confirm;

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.click = 0;
    this.state = {
      taskSearch: {
        // 任务查询
        group: "evolve",
        labelId: [],
        menuType: "today",
        panelId: ["0"],
        projectIds: [],
        search: "",
        planTimeSear: {
          start: "",
          end: ""
        },
        planBeginTimeSear: {
          start: "",
          end: ""
        },
        worktimeSear: {
          min: "",
          max: ""
        },
        flowContenSear: {
          min: "",
          max: ""
        },
        planTime: "",
        flowConten: "",
        taskPlanTime: "",
        taskPlanBeginTime: "",
        userResponses: [],
        userFlows: [],
        userCreates: [],
        userAssigns: [],
        userSear: {
          type: "0" /* 负责人0 确认人1 关注人2 指派人3 创建人4          */,
          userIds: []
        },
        sortType: "1",
        hidden: ""
      },
      selectedUsers: [],
      taskSearchStateAct: "10" /* 默认选中未完成 */,
      dicts: {} /* 字典数据 */,
      dictsLoading: false,

      taskListNowPage: 1, // 任务列表
      taskListAllPage: 0,
      taskList: [],
      taskCount: "", //当前任务数
      taskListLoading: false,
      taskListLoadingCount: 0,
      taskListMoreLoading: false,
      taskListHideOpt: [] /* 因为默认是选中我负责的，所以任务列表不显示负责人名字 */,
      showOkTask: false,
      showTaskBox: false,
      hideTaskIds: [],

      taskDetailShow: false, // 详情页
      animateClass: "",
      detailPageTaskId: "",
      detailPageProjectId: "",

      projectList: [], // 项目
      projectListNowPage: 1,
      projectListAllPage: 0,
      projectListLoading: false,
      projectListMoreLoading: false,
      projectSelecteds: [],

      tagSelecteds: [], // 标签
      tagComponentShow: false,

      topSearchOptions: [], // 顶部 自定义选项
      topSearchDownMenuShow: false,

      moreTaskEditShow: false,
      allSearchBoxShow: false,
      checkTaskIds: [],
      checkTaskNames: [], // 选中的任务的任务名

      taskCreateShow: false,
      taskSelectShow: false,
      moreSelectShow: false,
      allSearchChildShow: false,
      projectSelectShow: false,
      selectedProject: [], //项目

      taskFlowShow: false,
      taskWorkTime: false,
      workMin: "",
      workMax: "",
      flowMin: "",
      flowMax: "",
      value: 1,

      dateShow: false,
      weekShow: false,
      monthShow: false,
      rangePickerShow: false,

      dateStartShow: false,
      weekStartShow: false,
      monthStartShow: false,
      rangeStartPickerShow: false,

      versionAlert: false, // 是否显示专业版提示
      versionUpdateShow: false, // 是否显示版本更新说明
      buyDay15Show: false, // 是否显示15天到期提醒
      taskMax: 0,
      available: true,
      taskFlowBox: [],
      taskWorkBox: [],
      selectedFlow: [],
      selectedWork: [],
      noProjectShow: false,
      noTagShow: false,
      everyFlowShow: false,
      everyWorkShow: false,
      stopPlanTimeShow: false,
      flowIndex: "0",
      workIndex: "0",
      count: 0,
      saveValue: "",
      taskSelectCenShow: false,
      taskPlanTimeSel: false,
      visible: false,
      versionShow: false,
      pickerShow: false,
      focus: false,
      leftMenuShow: false,
      taskinfoNumdqr: 0, //顶部待确认数量,
      taskinfoNumdwc: 0, // 顶部待完成数量
      taskinfoNumdzp: 0, //顶部待指派数量

      taskinfoNumtqwc: 0, //顶部提前完成数量
      taskinfoNumzcwc: 0, //顶部按时完成数量
      taskinfoNumyqwc: 0, //顶部逾期完成数量
      taskinfoNumjrwc: 0, //顶部今日完成数量
      taskinfoNumjrxz: 0, //顶部今日新增数量
      taskinfoNumyqrw: 0, //顶部逾期任务数量
      //新增我的任务顶部数字显示
      myTaskAssigned: 0, //顶部我指派的
      myTaskCompleted: 0, //顶部我完成的
      myTaskConfirmed: 0, //顶部我确认的
      taskinfoNumComplete: false,
      isLast: "0", //是否是最后一页
      moneyEnd: false,
      count1: 0,
      //今日任务
      todayAssigned: 0,
      todayCompleted: 0,
      todayConfirmed: 0,
      todayMeAssigned: 0,
      todayMeCompleted: 0,
      todayMeConfirmed: 0,
      //最进七天
      weekAssigned: 0,
      weekCompleted: 0,
      weekConfirmed: 0,
      weekMeAssigned: 0,
      weekMeCompleted: 0,
      weekMeConfirmed: 0,
      //最近30天
      monthAssigned: 0,
      monthCompleted: 0,
      monthConfirmed: 0,
      monthMeAssigned: 0,
      monthMeCompleted: 0,
      monthMeConfirmed: 0,
      //
      sortShow: false,
      permanent: false, //       常驻显示true 取消常驻 false
      isIos: true,
      closeed: true
    };
  }

  componentWillMount() { }
  componentWillReceiveProps(nextProps) { }
  componentDidMount() {
    if (Storage.get("user")) {
      this.setState({ isIos: isIosSystem() });
      this.getDicts();
      this.getProjectList(1);
      const { taskSearch } = this.state;
      const saveSortValue = Storage.getLocal("saveSort");
      const showOkTask = Storage.getLocal("showOkTask");
      const showTaskBox = Storage.getLocal("showTaskBox");
      const leftMenuType = Storage.getLocal("leftMenuType");
      const topRadioType = Storage.getLocal("topRadioType");
      const nowData = new Date().toLocaleDateString(); // 获取当前时间年-月-日
      if (nowData === Storage.getLocal("nowTimes")) {
        taskSearch.sortType = saveSortValue;
        taskSearch.menuType = leftMenuType ? leftMenuType : taskSearch.menuType;
        taskSearch.panelId = topRadioType ? topRadioType : ["10"];
        if (
          leftMenuType === "today" ||
          leftMenuType === "lastWeek" ||
          leftMenuType === "lastMonth" ||
          leftMenuType === "mytask"
        ) {
          taskSearch.group = leftMenuType ? leftMenuType : taskSearch.menuType;
        }
        taskSearch.hidden = showOkTask ? "1" : "";
        if (topRadioType) {
          this.setState({
            taskSearch: taskSearch,
            saveValue: saveSortValue,
            showOkTask: showOkTask,
            showTaskBox: showTaskBox
            // taskSearchStateAct:
            //   topRadioType.length === 0 ? "all" : topRadioType[0]
          });
        }

        this.setState({
          taskSearchStateAct:
            topRadioType.length === 0 ? "all" : topRadioType[0]
        });
      } else {
        taskSearch.sortType = saveSortValue;
        taskSearch.menuType = "today";
        taskSearch.panelId = ["10"];
        taskSearch.group = "today";
        taskSearch.hidden = showOkTask ? "1" : "";
        if (topRadioType) {
          this.setState({
            taskSearch: taskSearch,
            saveValue: saveSortValue,
            showOkTask: showOkTask,
            showTaskBox: showTaskBox
          });
        }
        this.setState({ taskSearchStateAct: "10" });
      }
      this.setState({ count: 0, count1: 0 });
      this.returnValue(saveSortValue);
      this.getTopNum(taskSearch.menuType);
      this.getTaskList(1, 30, taskSearch);
      if (getTeamInfoWithMoney("版本名称") === "免费版") {
        this.getLimt();
      }
      const saveFlow = Storage.getLocal("saveTaskFlow");
      const saveWork = Storage.getLocal("saveTaskWork");
      this.setState({ taskFlowBox: saveFlow, taskWorkBox: saveWork });
      dingJS.authDingJsApi();
      let versionText = Storage.getLocal("versionName");
      if (getTeamInfoWithMoney("版本名称") === versionText) {
        this.getSearchOptByStorage();
      }
      const buyDay15AlertDate = Storage.getLocal("buyDay15AlertDate");
      if (
        buyDay15AlertDate !== dateToString(new Date(), "date") &&
        getTeamInfoWithMoney("剩余天数") < 16 &&
        getTeamInfoWithMoney("剩余天数") > -1
      ) {
        this.setState({ buyDay15Show: true });
      } else {
        this.setState({ buyDay15Show: false });
      }

      const versionUpdateShow = Storage.getLocal("versionUpdateShow");
      if (versionUpdateShow == true || versionUpdateShow == false) {
        this.setState({ versionUpdateShow: versionUpdateShow });
      } else {
        this.setState({ versionUpdateShow: true });
      }
      const permanentBool = Storage.getLocal("permanent");
      if (permanentBool) {
        this.setState({ count: 2, allSearchBoxShow: true, permanent: true });
      } else {
        this.setState({ count: 0, allSearchBoxShow: false, permanent: false });
      }
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getLimt() {
    getLimtTask(data => {
      if (!data) {
        return false;
      }
      if (data.err) {
        return false;
      }
      this.setState({
        taskMax: data.projectMax,
        available: data.success
      });
    });
  }
  //免费版任务限制
  freeTaskLimit() {
    const { available } = this.state;
    if (getTeamInfoWithMoney("版本名称") === "免费版") {
      this.getLimt();
      if (!available) {
        this.setState({ visible: true });
      }
    }
  }
  // 获取公共字典数据
  getDicts() {
    this.setState({ dictsLoading: true });
    const dictNames =
      "ant_taskinfo_flow,ant_taskinfo_state,ant_taskinfo_coefficienttype,ant_task_home_planTime,ant_task_home_workTime";
    getDictsByTypes(dictNames, data => {
      if (!data) {
        return false;
      }
      if (data.err) {
        return false;
      }
      this.setState({ dicts: data });
      this.setState({ dictsLoading: false });
    });
  }
  // 获取头部数据
  getTopNum = val => {
    getTaskListByConditionNew({ menuType: val }, data => {
      if (data.err) {
        return false;
      }
      if (data && data.Num) {
        this.setState({
          todayAssigned:
            data.Num && data.Num.todayAssigned ? data.Num.todayAssigned : 0,
          todayCompleted:
            data.Num && data.Num.todayCompleted ? data.Num.todayCompleted : 0,
          todayConfirmed:
            data.Num && data.Num.todayConfirmed ? data.Num.todayConfirmed : 0,
          todayMeAssigned:
            data.Num && data.Num.todayMeAssigned ? data.Num.todayMeAssigned : 0,
          todayMeCompleted:
            data.Num && data.Num.todayMeCompleted
              ? data.Num.todayMeCompleted
              : 0,
          todayMeConfirmed:
            data.Num && data.Num.todayMeConfirmed
              ? data.Num.todayMeConfirmed
              : 0,

          weekAssigned:
            data.Num && data.Num.weekAssigned ? data.Num.weekAssigned : 0,
          weekCompleted:
            data.Num && data.Num.weekCompleted ? data.Num.weekCompleted : 0,
          weekConfirmed:
            data.Num && data.Num.weekConfirmed ? data.Num.weekConfirmed : 0,
          weekMeAssigned:
            data.Num && data.Num.weekMeAssigned ? data.Num.weekMeAssigned : 0,
          weekMeCompleted:
            data.Num && data.Num.weekMeCompleted ? data.Num.weekMeCompleted : 0,
          weekMeConfirmed:
            data.Num && data.Num.weekMeConfirmed ? data.Num.weekMeConfirmed : 0,

          monthAssigned:
            data.Num && data.Num.monthAssigned ? data.Num.monthAssigned : 0,
          monthCompleted:
            data.Num && data.Num.monthCompleted ? data.Num.monthCompleted : 0,
          monthConfirmed:
            data.Num && data.Num.monthConfirmed ? data.Num.monthConfirmed : 0,

          monthMeAssigned:
            data.Num && data.Num.monthMeAssigned ? data.Num.monthMeAssigned : 0,
          monthMeCompleted:
            data.Num && data.Num.monthMeCompleted
              ? data.Num.monthMeCompleted
              : 0,
          monthMeConfirmed:
            data.Num && data.Num.monthMeConfirmed
              ? data.Num.monthMeConfirmed
              : 0,

          taskinfoNumdqr: data.Num && data.Num.dqr,
          taskinfoNumdwc: data.Num && data.Num.dwc,
          taskinfoNumdzp: data.Num && data.Num.dzp,

          taskinfoNumtqwc: data.Num && data.Num.tqwc,
          taskinfoNumzcwc: data.Num && data.Num.zcwc,
          taskinfoNumyqwc: data.Num && data.Num.yqwc,

          taskinfoNumjrwc: data.Num && data.Num.jrwc,
          taskinfoNumjrxz: data.Num && data.Num.jrxz,
          taskinfoNumyqrw: data.Num && data.Num.yqrw,

          myTaskAssigned: data.Num && data.Num.myTaskAssigned,
          myTaskCompleted: data.Num && data.Num.myTaskCompleted,
          myTaskConfirmed: data.Num && data.Num.myTaskConfirmed,
          taskinfoNumComplete: true
        });
      }
    });
  };
  // 获取缓存的自定义选项
  getSearchOptByStorage() {
    const storageOpt = Storage.getLocal("searchOpt");
    if (storageOpt) {
      this.setState({ topSearchOptions: storageOpt });
    }
  }

  getTaskList(pageNo, pageSize = 30, search) {
    this.setState({ hideTaskIds: [] });

    if (!pageNo) {
      pageNo = 1;
    }
    if (!search) {
      search = this.state.taskSearch;
    }
    if (pageNo === 1) {
      this.setState({ taskListLoading: true });
    } else {
      this.setState({ taskListMoreLoading: true });
    }
    if (search.menuType === "all") {
      search.menuType = "";
    }

    let userRes = [];
    let userFlo = [];
    let userCre = [];
    let userAss = [];
    let searchCopy = JSON.parse(JSON.stringify(search));
    searchCopy.userResponses &&
      searchCopy.userResponses.length > 0 &&
      searchCopy.userResponses.map(item => {
        userRes.push(item.userid);
      });
    searchCopy.userAssigns &&
      searchCopy.userAssigns.length > 0 &&
      searchCopy.userAssigns.map(item => {
        userAss.push(item.userid);
      });
    searchCopy.userCreates &&
      searchCopy.userCreates.length > 0 &&
      searchCopy.userCreates.map(item => {
        userCre.push(item.userid);
      });
    searchCopy.userFlows &&
      searchCopy.userFlows.length > 0 &&
      searchCopy.userFlows.map(item => {
        userFlo.push(item.userid);
      });
    searchCopy.userResponses = userRes;
    searchCopy.userFlows = userFlo;
    searchCopy.userCreates = userCre;
    searchCopy.userAssigns = userAss;
    getTaskListByCondition(pageNo, pageSize, searchCopy, data => {
      if (data && data.err) {
        this.setState({ taskListLoadingCount: "err" });
        this.setState({ taskListLoading: false, taskListMoreLoading: false });

        if (pageNo > 1) {
          message.error(isLoadingErr());
        }
        return false;
      }
      if (data.taskinfos) {
        if (data.taskinfos.pageNo === 1) {
          if (data.taskinfos.list) {
            this.setState({ taskList: data.taskinfos.list });
          } else {
            this.setState({ taskList: [] });
          }
        } else {
          let newPageTasks = JSON.parse(JSON.stringify(this.state.taskList));
          if (data.taskinfos.list) {
            data.taskinfos.list.map((item, i) => {
              newPageTasks.push(item);
            });
          }
          this.setState({ taskList: newPageTasks });
        }

        let taskCount = data.taskinfos.count ? data.taskinfos.count : "0";
        this.setState({
          taskListNowPage: data.taskinfos.pageNo,
          taskListAllPage: data.taskinfos.last,
          taskCount: taskCount,
          isLast: data.taskinfos.isLast
        });
      } else {
        this.setState({
          taskList: [],
          taskListNowPage: 1,
          taskListAllPage: 0,
          taskCount: "0",
          isLast: "1"
        });
      }
      this.setState({ taskListLoading: false, taskListMoreLoading: false });
      if (this.state.taskListLoadingCount === "err") {
        this.setState({ taskListLoadingCount: 1 });
      } else {
        this.setState({
          taskListLoadingCount: this.state.taskListLoadingCount + 1
        });
      }
    });
  }

  getProjectList(pageNo) {
    if (pageNo === 1) {
      this.setState({ projectListLoading: true });
    } else {
      this.setState({ projectListMoreLoading: true });
    }
    getProListByJurisdiction("1", pageNo, data => {
      if (data.err) {
        return false;
      }
      if (data.pageNo === 1) {
        this.setState({ projectList: data.projects });
      } else {
        let projectList = JSON.parse(JSON.stringify(this.state.projectList));
        data.projects &&
          data.projects.map(item => {
            projectList.push(item);
          });
        this.setState({ projectList: projectList });
      }
      this.setState({
        projectListAllPage: data.last,
        projectListNowPage: data.pageNo
      });
      this.setState({
        projectListLoading: false,
        projectListMoreLoading: false
      });
    });
  }

  projectSelectedOnChange(val) {
    this.setState({ projectSelecteds: val });
    let { taskSearch } = this.state;
    taskSearch.projectIds = val;
    this.setState({ taskSearch: taskSearch });
    if (taskSearch.menuType !== "") {
      this.getTaskList(1, 30, taskSearch);
      this.refs.bottomBox.scrollTop = 0;
    }
  }

  searchAllTask() {
    let { taskSearch } = this.state;
    this.getTaskList(1, 30, taskSearch);
  }

  // allChecked(e) {
  //   let checkTaskIds = [];
  //   let checkTaskNames = [];
  //   if (e.target.checked) {
  //     this.state.taskList &&
  //       this.state.taskList.map((item, i) => {
  //         if (
  //           item.taskinfo.state !== "1" &&
  //           item.taskinfo.state !== "4" &&
  //           item.taskinfo.state !== "2"
  //         ) {
  //           checkTaskIds.push(item.taskinfo.id);
  //           checkTaskNames.push({
  //             taskName: item.taskinfo.taskname,
  //             taskRank: item.taskinfo.rank
  //           });
  //         }
  //       });
  //   }
  //   this.setState({ checkTaskIds: checkTaskIds });
  // }

  selectedUsersOnchange(users) {
    this.setState({ selectedUsers: JSON.parse(JSON.stringify(users)) });
    let { taskSearch } = this.state;
    taskSearch.userSear.userIds = [];
    users &&
      users.map(item => {
        taskSearch.userSear.userIds.push(item.id);
      });
    this.setState({ taskSearch: taskSearch });
  }
  cancelMoreEdit() {
    this.setState({
      moreTaskEditShow: false,
      moreTaskEditShow: false,
      checkTaskIds: []
    });
  }
  moreTaskEdit() {
    const { moreTaskEditShow } = this.state;
    if (moreTaskEditShow) {
      this.setState({
        moreTaskEditShow: false,
        checkTaskIds: []
      });
    } else {
      this.setState({ moreTaskEditShow: true });
    }
  }
  //显示右上内容
  contentChange(val) {
    if (val == "today") {
      return (
        <div className="topTypeName">
          <span className="nameType">今日任务</span>
          <div className="borderRight">
            <div className="topName">待我完成</div>
            <div className="Num">{this.state.todayCompleted}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我确认</div>
            <div className="Num">{this.state.todayConfirmed}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我指派</div>
            <div className="Num">{this.state.todayAssigned}</div>
          </div>
        </div>
      );
    } else if (val == "lastWeek") {
      return (
        <div className="topTypeName">
          <span className="nameType">最近7天</span>
          <div className="borderRight">
            <div className="topName">待我完成</div>
            <div className="Num">{this.state.weekCompleted}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我确认</div>
            <div className="Num">{this.state.weekConfirmed}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我指派</div>
            <div className="Num">{this.state.weekAssigned}</div>
          </div>
        </div>
      );
    } else if (val == "lastMonth") {
      return (
        <div className="topTypeName">
          <span className="nameType">最近30天</span>
          <div className="borderRight">
            <div className="topName">待我完成</div>
            <div className="Num">{this.state.monthCompleted}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我确认</div>
            <div className="Num">{this.state.monthConfirmed}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我指派</div>
            <div className="Num">{this.state.monthAssigned}</div>
          </div>
        </div>
      );
    } else if (val == "my_succeed") {
      return (
        <div className="topTypeName">
          <span className="nameType">我确认的</span>
          <div className="borderRight">
            <div className="topName">待完成</div>
            <div className="Num">{this.state.taskinfoNumdwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待确认</div>
            <div className="Num">{this.state.taskinfoNumdqr}</div>
          </div>
        </div>
      );
    } else if (val == "my_attention") {
      return (
        <div className="topTypeName">
          <span className="nameType">我关注的</span>
          <div className="borderRight">
            <div className="topName">待完成</div>
            <div className="Num">{this.state.taskinfoNumdwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待确认</div>
            <div className="Num">{this.state.taskinfoNumdqr}</div>
          </div>
        </div>
      );
    } else if (val == "add_today") {
      return (
        <div className="topTypeName">
          <span className="nameType">今日新增</span>
          <div className="borderRight">
            <div className="topName">待指派</div>
            <div className="Num">{this.state.taskinfoNumdzp}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待完成</div>
            <div className="Num">{this.state.taskinfoNumdwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待确认</div>
            <div className="Num">{this.state.taskinfoNumdqr}</div>
          </div>
        </div>
      );
    } else if (val == "finish_today") {
      return (
        <div className="topTypeName">
          <span className="nameType">今日完成</span>
          <div className="borderRight">
            <div className="topName">提前完成</div>
            <div className="Num">{this.state.taskinfoNumtqwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">按时完成</div>
            <div className="Num">{this.state.taskinfoNumzcwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">逾期完成</div>
            <div className="Num">{this.state.taskinfoNumyqwc}</div>
          </div>
        </div>
      );
    } else if (val == "over_task") {
      return (
        <div className="topTypeName">
          <span className="nameType">逾期任务</span>
          <div className="borderRight">
            <div className="topName">待指派</div>
            <div className="Num">{this.state.taskinfoNumdzp}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待完成</div>
            <div className="Num">{this.state.taskinfoNumdwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待确认</div>
            <div className="Num">{this.state.taskinfoNumdqr}</div>
          </div>
        </div>
      );
    } else if (val == "") {
      return (
        <div className="topTypeName">
          <span className="nameType">全部任务</span>
          <div className="borderRight">
            <div className="topName">今日新增</div>
            <div className="Num">{this.state.taskinfoNumjrxz}</div>
          </div>
          <div className="borderRight">
            <div className="topName">今日完成</div>
            <div className="Num">{this.state.taskinfoNumjrwc}</div>
          </div>
          <div className="borderRight">
            <div className="topName">逾期任务</div>
            <div className="Num">{this.state.taskinfoNumyqrw}</div>
          </div>
        </div>
      );
    } else if (val == "mytask") {
      return (
        <div className="topTypeName">
          <span className="nameType">我的任务</span>
          <div className="borderRight">
            <div className="topName">待我完成</div>
            <div className="Num">{this.state.myTaskCompleted}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我确认</div>
            <div className="Num">{this.state.myTaskConfirmed}</div>
          </div>
          <div className="borderRight">
            <div className="topName">待我指派</div>
            <div className="Num">{this.state.myTaskAssigned}</div>
          </div>
        </div>
      );
    }
  }
  //数组去重方法
  reduceArr = arr => {
    let hash = {};
    const newArr = arr.reduce((item, next) => {
      hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
      return item;
    }, []);
    return newArr;
  };
  //选人
  selUser(title) {
    let selectedUsers = [];
    let { taskSearch } = this.state;
    const that = this;
    dingJS.selectUser(
      selectedUsers,
      "请选择" + title,
      data => {
        console.log("钉钉返回的人" + data);
        if (!data) {
          return false;
        }
        if (title === "负责人") {
          let leaderArr = JSON.parse(JSON.stringify(taskSearch.userResponses));
          data &&
            data.map(item => {
              leaderArr.push({
                userid: item.emplId,
                name: item.name,
                photo: item.avatar
              });
            });
          taskSearch.userResponses = that.reduceArr(leaderArr);
          that.setState({ taskSearch: taskSearch }, () => {
            that.getTaskList(1, 30, taskSearch);
          });
        } else if (title === "确认人") {
          let leaderArr2 = JSON.parse(JSON.stringify(taskSearch.userFlows));
          data &&
            data.map(item => {
              leaderArr2.push({
                userid: item.emplId,
                name: item.name,
                photo: item.avatar
              });
            });
          taskSearch.userFlows = that.reduceArr(leaderArr2);
          that.setState({ taskSearch: taskSearch }, () => {
            that.getTaskList(1, 30, taskSearch);
          });
        } else if (title === "创建人") {
          let leaderArr3 = JSON.parse(JSON.stringify(taskSearch.userCreates));
          data &&
            data.map(item => {
              leaderArr3.push({
                userid: item.emplId,
                name: item.name,
                photo: item.avatar
              });
            });
          taskSearch.userCreates = that.reduceArr(leaderArr3);
          that.setState({ taskSearch: taskSearch }, () => {
            that.getTaskList(1, 30, taskSearch);
          });
        } else if (title === "指派人") {
          let leaderArr4 = JSON.parse(JSON.stringify(taskSearch.userAssigns));
          data &&
            data.map(item => {
              leaderArr4.push({
                userid: item.emplId,
                name: item.name,
                photo: item.avatar
              });
            });
          taskSearch.userAssigns = that.reduceArr(leaderArr4);
          that.setState({ taskSearch: taskSearch }, () => {
            that.getTaskList(1, 30, taskSearch);
          });
        }
      },
      true,
      false
    );
    this.refs.bottomBox.scrollTop = 0;
  }
  deleteUser(title, arr, i) {
    const { taskSearch } = this.state;
    let that = this;
    if (title === "负责人") {
      arr.map((item, index) => {
        if (index === i) arr.splice(i, 1);
      });
      taskSearch.userResponses = arr;
      this.setState({ taskSearch: taskSearch }, () => {
        that.getTaskList(1, 30, taskSearch);
      });
    } else if (title === "确认人") {
      arr.map((item, index) => {
        if (index === i) arr.splice(i, 1);
      });
      taskSearch.userFlows = arr;
      this.setState({ taskSearch: taskSearch }, () => {
        that.getTaskList(1, 30, taskSearch);
      });
    } else if (title === "创建人") {
      // for (var key in taskSearch.userCreate) {
      //   delete taskSearch.userCreate[key];
      // }
      // this.setState({ taskSearch: taskSearch });
      arr.map((item, index) => {
        if (index === i) arr.splice(i, 1);
      });
      taskSearch.userCreates = arr;
      this.setState({ taskSearch: taskSearch }, () => {
        that.getTaskList(1, 30, taskSearch);
      });
    } else if (title === "指派人") {
      arr.map((item, index) => {
        if (index === i) arr.splice(i, 1);
      });
      taskSearch.userAssigns = arr;
      this.setState({ taskSearch: taskSearch }, () => {
        that.getTaskList(1, 30, taskSearch);
      });
      // for (var key in taskSearch.userAssign) {
      //   delete taskSearch.userAssign[key];
      // }
      // this.setState({ taskSearch: taskSearch });
    }
    this.refs.bottomBox.scrollTop = 0;
  }

  workSearch(type) {
    const {
      taskSearch,
      workMin,
      workMax,
      flowMin,
      flowMax,
      taskFlowBox,
      taskWorkBox
    } = this.state;
    switch (type) {
      case "flow":
        if (flowMin !== "" && flowMax !== "") {
          if (flowMin <= flowMax) {
            taskSearch.flowContenSear.min = flowMin;
            taskSearch.flowContenSear.max = flowMax;
          } else {
            taskSearch.flowContenSear.min = flowMax;
            taskSearch.flowContenSear.max = flowMin;
          }
          taskSearch.flowConten = "";
          let firstTaskFlow = [];
          if (taskFlowBox && taskFlowBox.length > 0) {
            taskFlowBox.push({
              min: flowMin,
              max: flowMax
            });
          } else {
            firstTaskFlow.push({
              min: flowMin,
              max: flowMax
            });
            this.setState({ taskFlowBox: firstTaskFlow });
          }
          if (taskFlowBox && taskFlowBox.length > 3) {
            let newTaskFlow = taskFlowBox.slice(
              taskFlowBox.length - 3,
              taskFlowBox.length
            );
            this.state.flowIndex = 2;
            this.setState({ taskFlowBox: newTaskFlow });
            Storage.setLocal("saveTaskFlow", newTaskFlow);
          } else if (
            taskFlowBox &&
            taskFlowBox.length > 1 &&
            taskFlowBox.length <= 3
          ) {
            if (taskFlowBox.length === 2) {
              this.state.flowIndex = 1;
            } else {
              this.state.flowIndex = 2;
            }
            Storage.setLocal("saveTaskFlow", taskFlowBox);
          } else {
            this.state.flowIndex = 0;
            Storage.setLocal("saveTaskFlow", firstTaskFlow);
          }
          this.setState({
            taskFlowShow: false,
            everyFlowShow: true,
            taskSearch: taskSearch,
            flowMin: "",
            flowMax: ""
          });
        } else {
          message.info("请输入任务绩效筛选范围！");
        }
        break;
      case "work":
        if (workMin !== "" && workMax !== "") {
          if (workMin <= workMax) {
            taskSearch.worktimeSear.min = workMin;
            taskSearch.worktimeSear.max = workMax;
          } else {
            taskSearch.worktimeSear.min = workMax;
            taskSearch.worktimeSear.max = workMin;
          }
          taskSearch.planTime = "";
          let firstTaskWork = [];
          if (taskWorkBox && taskWorkBox.length > 0) {
            taskWorkBox.push({
              min: workMin,
              max: workMax
            });
          } else {
            firstTaskWork.push({
              min: workMin,
              max: workMax
            });
            this.setState({ taskWorkBox: firstTaskWork });
          }
          if (taskWorkBox && taskWorkBox.length > 3) {
            let newTaskWork = taskWorkBox.slice(
              taskWorkBox.length - 3,
              taskWorkBox.length
            );
            this.state.workIndex = 2;
            this.setState({ taskWorkBox: newTaskWork });
            Storage.setLocal("saveTaskWork", newTaskWork);
          } else if (
            taskWorkBox &&
            taskWorkBox.length > 1 &&
            taskWorkBox.length <= 3
          ) {
            if (taskWorkBox.length === 2) {
              this.state.workIndex = 1;
            } else {
              this.state.workIndex = 2;
            }
            Storage.setLocal("saveTaskWork", taskWorkBox);
          } else {
            this.state.workIndex = 0;
            Storage.setLocal("saveTaskWork", firstTaskWork);
          }
          this.setState({
            taskWorkTime: false,
            everyWorkShow: true,
            taskSearch: taskSearch,
            workMin: "",
            workMax: ""
          });
        } else {
          message.info("请输入计划工期筛选范围");
        }
        break;
    }
    if (
      (flowMin !== "" && flowMax !== "") ||
      (workMin !== "" && workMax !== "")
    ) {
      this.getTaskList(1, 30, taskSearch);
      this.refs.bottomBox.scrollTop = 0;
    }
  }
  flowSearch(type, min, max) {
    this.findIndex(type, min, max);
    const {
      taskFlowBox,
      taskWorkBox,
      taskSearch,
      everyFlowShow,
      everyWorkShow,
      flowIndex,
      workIndex
    } = this.state;
    if (type == "flow") {
      if (taskFlowBox && taskFlowBox.length > 0) {
        taskFlowBox.map((ite, i) => {
          if (ite.min === min && ite.max === max) {
            if (everyFlowShow && flowIndex === i) {
              taskSearch.flowContenSear.min = "";
              taskSearch.flowContenSear.max = "";
              taskSearch.flowConten = "";
              this.setState({ everyFlowShow: false });
            } else {
              if (min <= max) {
                taskSearch.flowContenSear.min = min;
                taskSearch.flowContenSear.max = max;
              } else {
                taskSearch.flowContenSear.min = max;
                taskSearch.flowContenSear.max = min;
              }
              taskSearch.flowConten = "";
              this.setState({ everyFlowShow: true });
            }
            this.setState({ taskSearch: taskSearch });
          }
        });
      }
    } else if (type == "work") {
      if (taskWorkBox && taskWorkBox.length > 0) {
        taskWorkBox.map((tim, i) => {
          if (tim.min === min && tim.max === max) {
            if (everyWorkShow && workIndex === i) {
              taskSearch.worktimeSear.min = "";
              taskSearch.worktimeSear.max = "";
              taskSearch.planTime = "";
              this.setState({ everyWorkShow: false });
            } else {
              if (min <= max) {
                taskSearch.worktimeSear.min = min;
                taskSearch.worktimeSear.max = max;
              } else {
                taskSearch.worktimeSear.min = max;
                taskSearch.worktimeSear.max = min;
              }
              taskSearch.planTime = "";
              this.setState({ everyWorkShow: true });
            }
            this.setState({ taskSearch: taskSearch });
          }
        });
      }
    }
    this.getTaskList(1, 30, taskSearch);
  }
  taskFlow(type, tip, e) {
    if (type == "work") {
      if (tip == "min") {
        this.setState({ workMin: e.target.value });
      } else if (tip == "max") {
        this.setState({ workMax: e.target.value });
      }
    } else if (type == "flow") {
      if (tip == "min") {
        this.setState({ flowMin: e.target.value });
      } else if (tip == "max") {
        this.setState({ flowMax: e.target.value });
      }
    }
  }
  deleteProject(id) {
    const { selectedProject, taskSearch } = this.state;
    if (selectedProject && selectedProject.length > 0) {
      selectedProject.map((item, index) => {
        if (item.id === id) {
          selectedProject.splice(index, 1);
          taskSearch.projectIds.splice(index, 1);
        }
      });
      this.setState({ selectedProject: selectedProject });
    }
    this.getTaskList(1, 30, taskSearch);
    this.refs.bottomBox.scrollTop = 0;
  }
  deleteTag(id) {
    const { tagSelecteds, taskSearch } = this.state;
    if (tagSelecteds && tagSelecteds.length > 0) {
      tagSelecteds &&
        tagSelecteds.map((item, index) => {
          if (item.id === id) {
            tagSelecteds.splice(index, 1);
            taskSearch.labelId.splice(index, 1);
          }
        });
      this.setState({ tagSelecteds: tagSelecteds });
    }
    this.getTaskList(1, 30, taskSearch);
    this.refs.bottomBox.scrollTop = 0;
  }
  getNickNameByName(name) {
    // let str = name.replace(/[^\u4e00-\u9fa5]/gi, "");
    let nickname = name.substr(0, 1);
    return nickname;
  }
  valMenu(val) {
    if (val == "1") {
      this.setState({ allSearchChildShow: false });
    } else if (val == "2") {
      this.setState({ allSearchChildShow: true });
    }
  }
  sortTask(type) {
    const { taskSearch } = this.state;
    if (type === 1) {
      taskSearch.sortType = "1";
    } else if (type === 2) {
      taskSearch.sortType = "2";
    } else if (type === 3) {
      taskSearch.sortType = "3";
    } else if (type === 4) {
      taskSearch.sortType = "4";
    } else if (type === 5) {
      taskSearch.sortType = "5";
    } else if (type === 6) {
      taskSearch.sortType = "6";
    } else if (type === 9) {
      taskSearch.sortType = "9";
    } else if (type === 10) {
      taskSearch.sortType = "10";
    } else {
      taskSearch.sortType = null;
    }
    this.setState({ taskSearch: taskSearch, value: type });
    this.getTaskList(1, 30, taskSearch);
    this.refs.bottomBox.scrollTop = 0;
  }
  returnValue(val) {
    switch (val) {
      case "1":
        this.state.value = 1;
        this.setState({ value: this.state.value });
        break;
      case "2":
        this.state.value = 2;
        this.setState({ value: 2 });
        break;
      case "3":
        this.state.value = 3;
        this.setState({ value: 3 });
        break;
      case "4":
        this.state.value = 4;
        this.setState({ value: 4 });
        break;
    }
  }
  saveSort(val) {
    this.props.setTaskSortVal(val);
    Storage.setLocal("saveSort", val);
    message.success("保存成功");
    this.returnValue(val);
  }
  getWeek(date, days) {
    let newTime = date + days * 24 * 60 * 60 * 1000;
    newTime = new Date(newTime);
    let y = newTime.getFullYear();
    let m = newTime.getMonth() + 1;
    let d = newTime.getDate();
    if (m <= 9) {
      m = "0" + m;
    }
    if (d <= 9) {
      d = "0" + d;
    }
    let creatDate = y + "-" + m + "-" + d;
    return creatDate;
  }
  mGetDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = new Date(year, month, 0);
    return day.getDate();
  }
  getMonth(day) {
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let days = year + "-" + month + "-" + day;
    return days;
  }
  changeDateSort(type) {
    const {
      taskSearch,
      dateShow,
      weekShow,
      monthShow,
      dateStartShow,
      weekStartShow,
      monthStartShow
    } = this.state;
    let newDate = new Date();
    switch (type) {
      case "date":
        let start = dateToString(newDate, "date");
        let end = dateToString(newDate, "date");
        if (dateShow) {
          taskSearch.planTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ dateShow: false });
        } else {
          taskSearch.planTimeSear = {
            start: start + " 00:00:00",
            end: end + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ dateShow: true });
        }
        this.setState({
          weekShow: false,
          monthShow: false,
          rangePickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
      case "dateStart":
        if (dateStartShow) {
          taskSearch.planBeginTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ dateStartShow: false });
        } else {
          let start = dateToString(newDate, "date");
          let end = dateToString(newDate, "date");
          taskSearch.planBeginTimeSear = {
            start: start + " 00:00:00",
            end: end + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ dateStartShow: true });
        }
        this.setState({
          weekStartShow: false,
          monthStartShow: false,
          rangeStartPickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
      case "week":
        let newStart = newDate.valueOf();
        let startDate = this.getWeek(newStart, -(newDate.getDay() - 1));
        let endDate = this.getWeek(newStart, 7 - newDate.getDay());
        if (weekShow) {
          taskSearch.planTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ weekShow: false });
        } else {
          taskSearch.planTimeSear = {
            start: startDate + " 00:00:00",
            end: endDate + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ weekShow: true });
        }
        this.setState({
          dateShow: false,
          monthShow: false,
          rangePickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
      case "weekStart":
        if (weekStartShow) {
          taskSearch.planBeginTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ weekStartShow: false });
        } else {
          let newStart = newDate.valueOf();
          let startDate = this.getWeek(newStart, -(newDate.getDay() - 1));
          let endDate = this.getWeek(newStart, 7 - newDate.getDay());
          taskSearch.planBeginTimeSear = {
            start: startDate + " 00:00:00",
            end: endDate + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ weekStartShow: true });
        }
        this.setState({
          dateStartShow: false,
          monthStartShow: false,
          rangeStartPickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
      case "month":
        let startMonth = this.getMonth(1);
        let endMonth = this.getMonth(this.mGetDate());
        if (monthShow) {
          taskSearch.planTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ monthShow: false });
        } else {
          taskSearch.planTimeSear = {
            start: startMonth + " 00:00:00",
            end: endMonth + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ monthShow: true });
        }
        this.setState({
          dateShow: false,
          weekShow: false,
          rangePickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
      case "monthStart":
        if (monthStartShow) {
          taskSearch.planBeginTimeSear = {
            start: "",
            end: ""
          };
          this.setState({ monthStartShow: false });
        } else {
          let startMonth = this.getMonth(1);
          let endMonth = this.getMonth(this.mGetDate());
          taskSearch.planBeginTimeSear = {
            start: startMonth + " 00:00:00",
            end: endMonth + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
          this.setState({ monthStartShow: true });
        }
        this.setState({
          dateStartShow: false,
          weekStartShow: false,
          rangeStartPickerShow: false,
          taskPlanTimeSel: true,
          taskSearch: taskSearch
        });
        break;
    }
    this.getTaskList(1, 30, taskSearch);
  }
  clearSortType(type) {
    const { taskSearch } = this.state;
    let min = "";
    let max = "";
    switch (type) {
      case "stopDate":
        taskSearch.planTimeSear = {
          start: "",
          end: ""
        };
        if (taskSearch.taskPlanTime == "5") {
          taskSearch.taskPlanTime = "";
        } else {
          taskSearch.taskPlanTime = "5";
        }
        this.setState({
          dateShow: false,
          weekShow: false,
          monthShow: false,
          taskSearch: taskSearch
        });
        this.getTaskList(1, 30, taskSearch);
        break;
      case "stopDateStart":
        taskSearch.planBeginTimeSear = {
          start: "",
          end: ""
        };
        if (taskSearch.taskPlanBeginTime == "1") {
          taskSearch.taskPlanBeginTime = "";
        } else {
          taskSearch.taskPlanBeginTime = "1";
        }
        this.setState({
          dateStartShow: false,
          weekStartShow: false,
          monthStartShow: false,
          taskSearch: taskSearch
        }, () => {
          this.getTaskList(1, 30, taskSearch);
        });
        break;
      case "taskFlow":
        taskSearch.flowContenSear = {
          min: "",
          max: ""
        };
        if (taskSearch.flowConten == "4") {
          taskSearch.flowConten = "";
        } else {
          taskSearch.flowConten = "4";
        }
        this.setState({
          taskSearch: taskSearch,
          flowMin: min,
          flowMax: max,
          everyFlowShow: false
        });
        this.getTaskList(1, 30, taskSearch);
        break;
      case "planTime":
        taskSearch.worktimeSear = {
          min: "",
          max: ""
        };
        if (taskSearch.planTime == "4") {
          taskSearch.planTime = "";
        } else {
          taskSearch.planTime = "4";
        }
        this.setState({
          taskSearch: taskSearch,
          workMax: max,
          workMin: min,
          everyWorkShow: false
        });
        this.getTaskList(1, 30, taskSearch);
        break;
    }
  }
  searchSort() {
    const { allSearchBoxShow } = this.state;
    if (allSearchBoxShow) {
      this.setState({ allSearchBoxShow: false });
    } else {
      this.setState({ allSearchBoxShow: true });
    }
  }
  findIndex(type, min, max) {
    const { taskFlowBox, taskWorkBox } = this.state;
    if (type == "flow") {
      for (let i = 0; i < taskFlowBox.length; i++) {
        let item = taskFlowBox[i];
        if (item.min == min && item.max == max) {
          this.setState({ flowIndex: i });
          break;
        }
      }
    } else if (type == "work") {
      for (let i = 0; i < taskWorkBox.length; i++) {
        let item = taskWorkBox[i];
        if (item.min == min && item.max == max) {
          this.setState({ workIndex: i });
          break;
        }
      }
    }
  }
  clickButton() {
    const { count } = this.state;
    this.setState({ count: count + 1, sortShow: true });
    // let sortShow = Storage.getLocal("permanent") ? true : false;
  }
  taskSelectCen() {
    const { taskSelectCenShow } = this.state;
    if (taskSelectCenShow) {
      this.setState({ taskSelectCenShow: false });
    } else {
      this.setState({ taskSelectCenShow: true });
    }
  }
  backTaskSelected(item) {
    const { topSearchOptions } = this.state;
    if (
      getTeamInfoWithMoney("版本名称") === "专业版" ||
      getTeamInfoWithMoney("版本名称") === "试用版" ||
      getTeamInfoWithMoney("版本名称") === ""
    ) {
      if (
        item === "项目" ||
        item === "标签" ||
        item === "负责人" ||
        item === "截止日期"
      ) {
        return <Icon type="check" className="check" />;
      } else {
        if (topSearchOptions.indexOf(item) !== -1) {
          return (
            <Icon
              type="check"
              className="check"
              onClick={() => {
                this.valChange("searOptAdd", item);
              }}
            />
          );
        }
      }
    } else {
      if (item === "项目" || item === "标签") {
        return <Icon type="check" className="check" />;
      } else {
        if (topSearchOptions.indexOf(item) !== -1) {
          return (
            <Icon
              type="check"
              className="check"
              onClick={() => {
                this.valChange("searOptAdd", item);
              }}
            />
          );
        }
      }
    }
  }
  backItem(item) {
    if (
      getTeamInfoWithMoney("版本名称") === "专业版" ||
      getTeamInfoWithMoney("版本名称") === "试用版" ||
      getTeamInfoWithMoney("版本名称") === ""
    ) {
      if (
        item === "项目" ||
        item === "标签" ||
        item === "负责人" ||
        item === "截止日期"
      ) {
        return <span>{item}</span>;
      } else {
        return (
          <span
            onClick={() => {
              this.valChange("searOptAdd", item);
            }}
          >
            {item}
          </span>
        );
      }
    } else {
      if (item === "项目" || item === "标签") {
        return <span>{item}</span>;
      } else {
        return (
          <span
            onClick={() => {
              this.valChange("searOptAdd", item);
            }}
          >
            {item}
          </span>
        );
      }
    }
  }
  hideOkTaskHandle = () => {
    const { showOkTask, taskSearch } = this.state;
    this.setState({ showOkTask: !showOkTask });
    taskSearch.hidden = showOkTask ? "" : "1";
    this.getTaskList(1, 30, taskSearch);
    Storage.setLocal("showOkTask", !showOkTask);
  };
  //tab上的数字
  // tabNum = panelId => {
  //   const {
  //     todayAssigned,
  //     todayCompleted,
  //     todayConfirmed,
  //     todayMeAssigned,
  //     todayMeCompleted,
  //     todayMeConfirmed,
  //     //最进七天
  //     weekAssigned,
  //     weekCompleted,
  //     weekConfirmed,
  //     weekMeAssigned,
  //     weekMeCompleted,
  //     weekMeConfirmed,
  //     //最近30天
  //     monthAssigned,
  //     monthCompleted,
  //     monthConfirmed,
  //     monthMeAssigned,
  //     monthMeCompleted,
  //     monthMeConfirmed,
  //     taskSearch
  //   } = this.state;
  //   if (taskSearch.menuType === "today") {
  //     if (panelId === "10") {
  //       return <span>({todayCompleted})</span>;
  //     } else if (panelId === "11") {
  //       return <span>({todayConfirmed})</span>;
  //     } else if (panelId === "12") {
  //       return <span>({todayAssigned})</span>;
  //     } else if (panelId === "13") {
  //       return <span>({todayMeCompleted})</span>;
  //     } else if (panelId === "14") {
  //       return <span>({todayMeConfirmed})</span>;
  //     } else if (panelId === "15") {
  //       return <span>({todayMeAssigned})</span>;
  //     }
  //   } else if (taskSearch.menuType === "lastWeek") {
  //     if (panelId === "10") {
  //       return <span>({weekCompleted})</span>;
  //     } else if (panelId === "11") {
  //       return <span>({weekConfirmed})</span>;
  //     } else if (panelId === "12") {
  //       return <span>({weekAssigned})</span>;
  //     } else if (panelId === "13") {
  //       return <span>({weekMeCompleted})</span>;
  //     } else if (panelId === "14") {
  //       return <span>({weekMeConfirmed})</span>;
  //     } else if (panelId === "15") {
  //       return <span>({weekMeAssigned})</span>;
  //     }
  //   } else if (taskSearch.menuType === "lastMonth") {
  //     if (panelId === "10") {
  //       return <span>({monthCompleted})</span>;
  //     } else if (panelId === "11") {
  //       return <span>({monthConfirmed})</span>;
  //     } else if (panelId === "12") {
  //       return <span>({monthAssigned})</span>;
  //     } else if (panelId === "13") {
  //       return <span>({monthMeCompleted})</span>;
  //     } else if (panelId === "14") {
  //       return <span>({monthMeConfirmed})</span>;
  //     } else if (panelId === "15") {
  //       return <span>({monthMeAssigned})</span>;
  //     }
  //   }
  // };

  // 右边上部分 筛选内容渲染
  right_top_render() {
    const {
      taskSearch,
      taskCount,
      selectedProject,
      taskFlowShow,
      taskWorkTime,
      allSearchBoxShow,
      allSearchChildShow,
      moreSelectShow,
      showOkTask,
      showTaskBox,
      moreTaskEditShow,
      checkTaskIds,
      checkTaskNames,
      dictsLoading,
      taskSearchStateAct,
      tagSelecteds,
      topSearchOptions,
      dicts,
      workMin,
      workMax,
      flowMin,
      flowMax,
      taskPlanTimeSel,
      saveValue,
      dateShow,
      weekShow,
      monthShow,
      dateStartShow,
      weekStartShow,
      monthStartShow,
      rangePickerShow,
      rangeStartPickerShow,
      pickerShow,
      taskFlowBox,
      taskWorkBox,
      projectSelectShow,
      noProjectShow,
      noTagShow,
      everyFlowShow,
      everyWorkShow,
      flowIndex,
      workIndex,
      count,
      focus,
      taskList,
      sortShow,
      permanent,
      isIos
    } = this.state;
    let groupOptDict = [];
    if (dicts.antTaskinfoStateList) {
      groupOptDict = JSON.parse(JSON.stringify(dicts.antTaskinfoStateList));
      if (
        taskSearch.menuType === "today" ||
        taskSearch.menuType === "lastWeek" ||
        taskSearch.menuType === "lastMonth" ||
        taskSearch.menuType === "mytask"
      ) {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "5" &&
              val.value !== "6" &&
              val.value !== "7" &&
              val.value !== "8" &&
              val.value !== "9" &&
              val.value !== "4" &&
              val.value !== "1" &&
              val.value !== "0" &&
              val.value !== "2" &&
              val.value !== "3"
          );
      } else if (taskSearch.menuType === "my_attention") {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "5" &&
              val.value !== "6" &&
              val.value !== "7" &&
              val.value !== "8" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15" &&
              val.value !== "9"
          );
      } else if (taskSearch.menuType === "add_today") {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "7" &&
              val.value !== "8" &&
              val.value !== "9" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15"
          );
      } else if (taskSearch.menuType === "finish_today") {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "0" &&
              val.value !== "1" &&
              val.value !== "2" &&
              val.value !== "3" &&
              val.value !== "4" &&
              val.value !== "5" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15" &&
              val.value !== "6"
          );
      } else if (taskSearch.menuType === "over_task") {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "1" &&
              val.value !== "4" &&
              val.value !== "7" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15" &&
              val.value !== "8" &&
              val.value !== "9"
          );
      } else if (taskSearch.menuType === "" || taskSearch.menuType === "all") {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "5" &&
              val.value !== "6" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15" &&
              val.value !== "7" &&
              val.value !== "8" &&
              val.value !== "9"
          );
      } else {
        groupOptDict =
          groupOptDict &&
          groupOptDict.filter(
            val =>
              val.value !== "5" &&
              val.value !== "6" &&
              val.value !== "10" &&
              val.value !== "11" &&
              val.value !== "12" &&
              val.value !== "13" &&
              val.value !== "14" &&
              val.value !== "15" &&
              val.value !== "7" &&
              val.value !== "8" &&
              val.value !== "9"
          );
      }
    }

    if (
      taskSearch.menuType !== "today" &&
      taskSearch.menuType !== "lastWeek" &&
      taskSearch.menuType !== "lastMonth" &&
      taskSearch.menuType !== "mytask"
    ) {
      groupOptDict.unshift({ id: "groupOptAll", value: "all", label: "全部" });
    }
    const initTopSearchOpts =
      getTeamInfoWithMoney("版本名称") === "专业版" ||
        getTeamInfoWithMoney("版本名称") === "试用版" ||
        getTeamInfoWithMoney("版本名称") === ""
        ? ["开始时间", "任务绩效", "计划工期", "确认人", "创建人", "指派人"]
        : [
          "开始时间",
          "负责人",
          "截止日期",
          "任务绩效",
          "计划工期",
          "确认人",
          "创建人",
          "指派人"
        ]; // '项目', '标签','负责人','截止日期';
    let suffixDom = taskSearch.search ? (
      <i
        className="iconfont icon-clears"
        onClick={() => {
          let { taskSearch } = this.state;
          taskSearch.search = "";
          this.setState({ taskSearch: taskSearch });
          this.getTaskList(1, 30, taskSearch);
        }}
      />
    ) : (
        ""
      );
    // const permanenttttt = Storage.getLocal("leftMenuType") ? true : false;
    return (
      <div
        className="topBox"
        onClick={e => {
          e.preventDefault();
          if (this.refs.taskDetail.state.saveShow) {
            const _this = this;
            confirm({
              title: "放弃未保存的信息？",
              content: "已打开的任务中仍有未保存的信息",
              okText: "继续编辑",
              cancelText: "放弃",
              onOk() { },
              onCancel() {
                _this.setState({
                  taskDetailShow: false,
                  taskFlowShow: false,
                  taskWorkTime: false,
                  detailPageTaskId: ""
                });
              }
            });
          } else {
            this.setState({
              taskDetailShow: false,
              taskFlowShow: false,
              taskWorkTime: false,
              detailPageTaskId: ""
            });
          }
        }}
      >
        <div
          className="titRow"
          onClick={() => {
            if (!permanent) {
              this.setState({
                allSearchBoxShow: false
              });
            }
            this.setState({
              moreSelectShow: false,
              taskFlowShow: false,
              taskWorkTime: false
            });
          }}
        >
          <div className="h1Type">
            <div>{this.contentChange(taskSearch.menuType)}</div>
            <Input
              className={
                focus ? "longInput inputStyle" : "smallInput inputStyle"
              }
              prefix={
                <i
                  className={
                    isIos
                      ? "iconfont icon-search"
                      : "iconfont icon-search window-search"
                  }
                />
              }
              suffix={suffixDom}
              placeholder="任务搜索"
              value={taskSearch.search}
              onFocus={() => {
                this.setState({ focus: true });
                this.cancelMoreEdit();
              }}
              onBlur={() => {
                this.setState({ focus: false });
              }}
              onChange={e => {
                let { taskSearch } = this.state;
                taskSearch.search = e.target.value;
                this.setState({ taskSearch: taskSearch });
              }}
              onPressEnter={e => {
                this.getTaskList(1, 30, taskSearch);
              }}
            />
            <Button
              onClick={() => {
                if (getTeamInfoWithMoney("是否可用")) {
                  this.moreTaskEdit();
                } else {
                  this.setState({ versionAlert: true });
                }
              }}
              // type={moreTaskEditShow ? "primary" : ""}
              className={moreTaskEditShow ? "moreTaskEditShow" : "eidtButton"}
            >
              {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                <svg className="pro-icon zuanshi" aria-hidden="true">
                  <use xlinkHref={"#pro-myfg-zuanshi"} />
                </svg>
              ) : (
                  <i
                    className={
                      isIos
                        ? "iconfont icon-select iconStyle"
                        : "iconfont icon-select"
                    }
                  />
                )}
              批量修改
            </Button>
            <Button
              className="sortButton"
              onClick={e => {
                e.stopPropagation();
                e.stopPropagation();
                this.searchSort();
                this.clickButton();
              }}
            >
              <i className="icon iconfont icon-filter2 iconStyle" />
              {taskSearch.projectIds.length > 0 ||
                taskSearch.labelId.length > 0 ||
                taskSearch.planTimeSear.start !== "" ||
                taskSearch.planTimeSear.end !== "" ||
                taskSearch.planBeginTimeSear.end !== "" ||
                taskSearch.planBeginTimeSear.start !== "" ||
                taskSearch.worktimeSear.min !== "" ||
                taskSearch.worktimeSear.max !== "" ||
                taskSearch.flowContenSear.min !== "" ||
                taskSearch.flowContenSear.max !== "" ||
                (taskSearch.userResponses &&
                  taskSearch.userResponses.length !== 0) ||
                (taskSearch.userFlows && taskSearch.userFlows.length !== 0) ||
                (taskSearch.userCreates && taskSearch.userCreates.length !== 0) ||
                (taskSearch.userAssigns && taskSearch.userAssigns.length !== 0) ||
                taskSearch.planTime !== "" ||
                taskSearch.flowConten !== "" ||
                taskSearch.taskPlanBeginTime !== "" ||
                taskSearch.taskPlanTime !== "" ? (
                  <i className="iconfont icon-check1 haveSort" />
                ) : (
                  ""
                )}
              筛选排序
            </Button>
          </div>
        </div>
        <div
          className={
            count == 0
              ? "noTaskSelect"
              : allSearchBoxShow
                ? "taskSelect animated_03s fadeInRightBig"
                : "taskSelect animated_Out fadeInRightBigOut"
          }
          onClick={e => {
            e.stopPropagation();
            this.setState({
              taskSelectCenShow: false,
              pickerShow: true
            });
          }}
        >
          <div className="topMenu">
            <div
              className={allSearchChildShow ? "childMenu" : "childMenu blue"}
              onClick={() => {
                this.valMenu("1");
              }}
            >
              <span>筛选</span>
              <em />
            </div>
            <div
              className={allSearchChildShow ? "blue childMenu" : "childMenu"}
              onClick={() => {
                this.valMenu("2");
              }}
            >
              <span>排序</span>
              <em />
            </div>
            <div className="close">
              <Tooltip
                placement="topRight"
                title={permanent ? "取消常驻" : "常驻显示"}
              >
                {permanent ? (
                  <i
                    className="iconfont icon-pin permanent"
                    onClick={() => {
                      Storage.setLocal("permanent", false);
                      this.setState({ permanent: false });
                    }}
                  />
                ) : (
                    <i
                      className="iconfont icon-pin sortShow"
                      onClick={() => {
                        Storage.setLocal("permanent", true);
                        this.setState({ permanent: true });
                      }}
                    />
                  )}
              </Tooltip>
            </div>
          </div>
          {allSearchChildShow ? (
            <div className="selectContent">
              <div className="sortBox">
                <RadioGroup
                  onChange={e => {
                    this.sortTask(e.target.value);
                  }}
                  value={this.state.value}
                >
                  <Radio value={6}>综合排序</Radio>
                  <Radio value={1}>按更新时间最近</Radio>
                  <Radio value={9}>按开始时间最早</Radio>
                  <Radio value={10}>按开始时间最晚</Radio>
                  <Radio value={5}>按截止时间最早</Radio>
                  <Radio value={2}>按截止时间最晚</Radio>
                  <Radio value={3}>按创建时间最早</Radio>
                  <Radio value={4}>按创建时间最晚</Radio>
                </RadioGroup>
              </div>
              <div className="sortBottom">
                <i className="iconfont icon-save" />
                <span
                  onClick={() => {
                    this.saveSort(taskSearch.sortType);
                  }}
                >
                  保存为默认排序
                </span>
              </div>
            </div>
          ) : (
              <div
                className="selectContent"
                onClick={() => {
                  this.setState({ moreSelectShow: false });
                }}
              >
                <div
                  className="allSort"
                  style={
                    getTeamInfoWithMoney("版本名称") === "专业版" ||
                      getTeamInfoWithMoney("版本名称") === "" ||
                      getTeamInfoWithMoney("版本名称") === "试用版"
                      ? { overflowX: "hidden", overflowY: "auto" }
                      : {}
                  }
                >
                  <div>
                    <div className="selectType">
                      <h3>
                        项目
                      {selectedProject && selectedProject.length > 0 ? (
                          <i
                            className="iconfont icon-add2"
                            onClick={() => {
                              this.setState({ projectSelectShow: true });
                            }}
                          />
                        ) : (
                            ""
                          )}
                      </h3>
                      {selectedProject && selectedProject.length > 0 ? (
                        <div className="projectBox">
                          {selectedProject.map((item, i) => {
                            return (
                              <div key={item.id} className="textMore">
                                {item.name}
                                <div
                                  className="projectCen"
                                  onClick={() => {
                                    this.deleteProject(item.id);
                                  }}
                                >
                                  点击移除
                              </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                          <div
                            className="null"
                            onClick={() => {
                              this.setState({ projectSelectShow: true });
                            }}
                            onMouseOver={() => {
                              this.setState({ noProjectShow: true });
                            }}
                            onMouseOut={() => {
                              this.setState({ noProjectShow: false });
                            }}
                          >
                            <span>不限</span>
                          </div>
                        )}
                    </div>
                    <div className="selectType">
                      <h3>标签</h3>
                      <div
                        className={
                          taskSearch.labelId.length > 0
                            ? "myTag tagBox"
                            : "tagBox"
                        }
                      >
                        <Tag
                          tagSelecteds={tagSelecteds}
                          canAdd={true}
                          canEdit={true}
                          tagChangeCallBack={val => {
                            this.valChange("tagChange", val);
                          }}
                          maxHeight="300px"
                          isProjectTypes={false}
                        />
                        {tagSelecteds.length > 0 ? (
                          ""
                        ) : (
                            <div className="null">
                              <span>不限</span>
                            </div>
                          )}
                      </div>
                    </div>
                    {topSearchOptions.indexOf("负责人") !== -1 ||
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>
                            负责人
                        {taskSearch.userResponses &&
                              taskSearch.userResponses.length > 0 ? (
                                <i
                                  className="iconfont icon-add2 "
                                  onClick={() => {
                                    this.selUser("负责人");
                                  }}
                                />
                              ) : (
                                ""
                              )}
                          </h3>

                          {taskSearch.userResponses &&
                            taskSearch.userResponses.length > 0 ? (
                              taskSearch.userResponses.map((item, i) => {
                                return (
                                  <div className="userBox">
                                    <div className="userSel">
                                      <div className="userName">
                                        {item.photo && item.photo !== "" ? (
                                          <img src={item.photo} />
                                        ) : (
                                            <div className="nophoto">
                                              {this.getNickNameByName(
                                                item.name && item.name
                                              )}
                                            </div>
                                          )}
                                      </div>
                                      <div className="nickName">
                                        {item.name && item.name.slice(0, 3)}
                                      </div>
                                      <div
                                        className="userCen"
                                        onClick={() => {
                                          this.deleteUser(
                                            "负责人",
                                            taskSearch.userResponses,
                                            i
                                          );
                                        }}
                                      >
                                        点击移除
                                </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                className="null"
                                onClick={() => {
                                  this.selUser("负责人");
                                }}
                              >
                                <span>不限</span>
                              </div>
                            )}
                        </div>
                      ) : (
                        ""
                      )}
                    {getTeamInfoWithMoney("版本名称") === "专业版" ||
                      getTeamInfoWithMoney("版本名称") === "" ||
                      getTeamInfoWithMoney("版本名称") === "试用版" ? (
                        <div className="selectType">
                          <h3>截止时间</h3>
                          <div className="selectedList">
                            <ul>
                              <li
                                onClick={() => {
                                  this.clearSortType("stopDate");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                未设置
                            {taskSearch.planTimeSear.start === "" &&
                                  taskSearch.planTimeSear.end === "" &&
                                  taskSearch.taskPlanTime === "5" ? (
                                    <Icon type="check" className="check" />
                                  ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("date");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                截止今天
                            {dateShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("week");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                截止本周
                            {weekShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("month");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                截止本月
                            {monthShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li className="last">自定义</li>
                            </ul>
                          </div>
                          <div
                            className="dateBox"
                            onClick={e => {
                              e.stopPropagation();
                              this.setState({
                                rangePickerShow: true,
                                taskSelectCenShow: true
                              });
                            }}
                          >
                            {(taskSearch.planTimeSear.start ||
                              taskSearch.planTimeSear.end) &&
                              rangePickerShow ? (
                                <RangePicker
                                  value={[
                                    moment(taskSearch.planTimeSear.start, dateFormat),
                                    moment(taskSearch.planTimeSear.end, dateFormat)
                                  ]}
                                  onChange={val => {
                                    this.valChange("endTime", val);
                                  }}
                                  format={dateFormat}
                                />
                              ) : (
                                <RangePicker
                                  value={[]}
                                  onChange={val => {
                                    this.valChange("endTime", val);
                                  }}
                                  format={dateFormat}
                                />
                              )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    {/* 增加开始时间筛选 */}
                    {topSearchOptions.indexOf("开始时间") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>开始时间</h3>
                          <div className="selectedList">
                            <ul>
                              <li
                                onClick={() => {
                                  this.clearSortType("stopDateStart");
                                }}
                                style={{ cursor: "pointer", height: "24px", lineHeight: "24px" }}
                              >
                                未设置
                            {taskSearch.planBeginTimeSear.start === "" && taskSearch.planBeginTimeSear.end === "" && taskSearch.taskPlanBeginTime === "1" ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("dateStart");
                                }}
                                style={{ cursor: "pointer", height: "24px", lineHeight: "24px" }}
                              >
                                今天开始
                            {dateStartShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("weekStart");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                本周开始
                            {weekStartShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li
                                onClick={() => {
                                  this.changeDateSort("monthStart");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                本月开始
                            {monthStartShow && taskPlanTimeSel ? (
                                  <Icon type="check" className="check" />
                                ) : (
                                    ""
                                  )}
                              </li>
                              <li className="last">自定义</li>
                            </ul>
                          </div>
                          <div
                            className="dateBox"
                            onClick={e => {
                              e.stopPropagation();
                              this.setState({
                                rangeStartPickerShow: true,
                                taskSelectCenShow: true
                              });
                            }}
                          >
                            {(taskSearch.planBeginTimeSear.start ||
                              taskSearch.planBeginTimeSear.end) &&
                              rangeStartPickerShow ? (
                                <RangePicker
                                  value={[
                                    moment(taskSearch.planBeginTimeSear.start, dateFormat),
                                    moment(taskSearch.planBeginTimeSear.end, dateFormat)
                                  ]}
                                  onChange={val => {
                                    this.valChange("startTime", val);
                                  }}
                                  format={dateFormat}
                                />
                              ) : (
                                <RangePicker
                                  value={[]}
                                  onChange={val => {
                                    this.valChange("startTime", val);
                                  }}
                                  format={dateFormat}
                                />
                              )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    {/* 增加开始时间筛选 */}
                    {topSearchOptions.indexOf("任务绩效") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>任务绩效</h3>
                          <div className="selectedList">
                            <ul>
                              <li
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                                onClick={() => {
                                  this.clearSortType("taskFlow");
                                }}
                              >
                                未设置
                            {taskSearch.flowContenSear.min === "" &&
                                  taskSearch.flowContenSear.max === "" &&
                                  taskSearch.flowConten === "4" ? (
                                    <Icon type="check" className="check" />
                                  ) : (
                                    ""
                                  )}
                              </li>
                              {JSON.parse(JSON.stringify(taskFlowBox)) &&
                                JSON.parse(JSON.stringify(taskFlowBox)).length > 0
                                ? JSON.parse(JSON.stringify(taskFlowBox)).map(
                                  (item, i) => {
                                    return (
                                      <li
                                        key={i}
                                        onClick={() => {
                                          this.flowSearch(
                                            "flow",
                                            item.min,
                                            item.max
                                          );
                                        }}
                                      >
                                        {item.min}
                                        {item.min !== "" && item.max !== ""
                                          ? "-"
                                          : ""}
                                        {item.max}
                                        {flowIndex === i && everyFlowShow ? (
                                          <Icon type="check" className="check" />
                                        ) : (
                                            ""
                                          )}
                                      </li>
                                    );
                                  }
                                )
                                : ""}
                              <li
                                className="last"
                                onClick={e => {
                                  e.stopPropagation();
                                  this.setState({ taskFlowShow: true });
                                }}
                              >
                                自定义
                          </li>
                            </ul>
                          </div>
                          {taskFlowShow ? (
                            <div
                              className="workTime"
                              onClick={e => {
                                e.stopPropagation();
                              }}
                            >
                              <div className="title">
                                <Icon
                                  type="close"
                                  onClick={() => {
                                    this.setState({ taskFlowShow: false });
                                  }}
                                  className="close"
                                />
                                <div>自定义</div>
                                <Icon
                                  type="check"
                                  className="check"
                                  onClick={() => {
                                    this.workSearch("flow");
                                  }}
                                />
                              </div>
                              <div className="contentBox">
                                <div className="start">
                                  <Input
                                    placeholder="0"
                                    value={flowMin <= 10000 ? flowMin : ""}
                                    onChange={e => {
                                      onlyNumber(e.target);
                                      this.taskFlow("flow", "min", e);
                                    }}
                                  />
                                </div>
                                <span>-</span>
                                <div className="end">
                                  <Input
                                    placeholder="10000"
                                    value={flowMax <= 10000 ? flowMax : ""}
                                    onChange={e => {
                                      onlyNumber(e.target);
                                      this.taskFlow("flow", "max", e);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      ) : (
                        ""
                      )}
                    {topSearchOptions.indexOf("计划工期") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>计划工期</h3>
                          <div className="selectedList">
                            <ul>
                              <li
                                onClick={() => {
                                  this.clearSortType("planTime");
                                }}
                                style={{
                                  cursor: "pointer",
                                  height: "24px",
                                  lineHeight: "24px"
                                }}
                              >
                                未设置
                            {taskSearch.worktimeSear.min === "" &&
                                  taskSearch.worktimeSear.max === "" &&
                                  taskSearch.planTime === "4" ? (
                                    <Icon type="check" className="check" />
                                  ) : (
                                    ""
                                  )}
                              </li>
                              {JSON.parse(JSON.stringify(taskWorkBox)) &&
                                JSON.parse(JSON.stringify(taskWorkBox)).length > 0
                                ? JSON.parse(JSON.stringify(taskWorkBox)).map(
                                  (item, i) => {
                                    return (
                                      <li
                                        key={i}
                                        onClick={() => {
                                          this.flowSearch(
                                            "work",
                                            item.min,
                                            item.max
                                          );
                                        }}
                                      >
                                        {item.min}
                                        {item.min !== "" && item.max !== ""
                                          ? "-"
                                          : ""}
                                        {item.max}
                                        {workIndex === i && everyWorkShow ? (
                                          <Icon type="check" className="check" />
                                        ) : (
                                            ""
                                          )}
                                      </li>
                                    );
                                  }
                                )
                                : ""}
                              <li
                                className="last"
                                onClick={e => {
                                  e.stopPropagation();
                                  this.setState({ taskWorkTime: true });
                                }}
                              >
                                自定义
                          </li>
                            </ul>
                          </div>
                          {taskWorkTime ? (
                            <div
                              className="workTime"
                              onClick={e => {
                                e.stopPropagation();
                              }}
                            >
                              <div className="title">
                                <Icon
                                  type="close"
                                  onClick={() => {
                                    this.setState({ taskWorkTime: false });
                                  }}
                                  className="close"
                                />
                                <div>自定义</div>
                                <Icon
                                  type="check"
                                  className="check"
                                  onClick={() => {
                                    this.workSearch("work");
                                  }}
                                />
                              </div>
                              <div className="contentBox">
                                <div className="start">
                                  <Input
                                    placeholder="0"
                                    value={workMin <= 500 ? workMin : ""}
                                    onChange={e => {
                                      onlyNumber(e.target);
                                      this.taskFlow("work", "min", e);
                                    }}
                                  />
                                </div>
                                <span>-</span>
                                <div className="end">
                                  <Input
                                    placeholder="500"
                                    value={workMax <= 500 ? workMax : ""}
                                    onChange={e => {
                                      onlyNumber(e.target);
                                      this.taskFlow("work", "max", e);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      ) : (
                        ""
                      )}
                    {topSearchOptions.indexOf("确认人") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>
                            确认人
                        {taskSearch.userFlows &&
                              taskSearch.userFlows.length > 0 ? (
                                <i
                                  className="iconfont icon-add2 "
                                  onClick={() => {
                                    this.selUser("确认人");
                                  }}
                                />
                              ) : (
                                ""
                              )}
                          </h3>
                          {taskSearch.userFlows &&
                            taskSearch.userFlows.length > 0 ? (
                              taskSearch.userFlows.map((item, i) => {
                                return (
                                  <div className="userBox">
                                    <div className="userSel">
                                      <div className="userName">
                                        {item.photo && item.photo !== "" ? (
                                          <img src={item.photo} />
                                        ) : (
                                            <div className="nophoto">
                                              {this.getNickNameByName(
                                                item.name && item.name
                                              )}
                                            </div>
                                          )}
                                      </div>
                                      <span className="nickName">
                                        {item.name && item.name.slice(0, 3)}
                                      </span>
                                      <div
                                        className="userCen"
                                        onClick={() => {
                                          this.deleteUser(
                                            "确认人",
                                            taskSearch.userFlows,
                                            i
                                          );
                                        }}
                                      >
                                        点击移除
                                </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                className="null"
                                onClick={() => {
                                  this.selUser("确认人");
                                }}
                              >
                                {/* <span className="choose">选择确认人</span>
                          <span className="noChoose">未选确认人</span> */}
                                <span>不限</span>
                              </div>
                            )}
                        </div>
                      ) : (
                        ""
                      )}
                    {topSearchOptions.indexOf("创建人") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>
                            创建人
                        {taskSearch.userCreate &&
                              taskSearch.userCreate.length > 0 ? (
                                <i
                                  className="iconfont icon-add2 "
                                  onClick={() => {
                                    this.selUser("创建人");
                                  }}
                                />
                              ) : (
                                ""
                              )}
                          </h3>
                          {taskSearch.userCreates &&
                            taskSearch.userCreates.length > 0 ? (
                              taskSearch.userCreates.map((item, i) => {
                                return (
                                  <div className="userBox">
                                    <div className="userSel">
                                      <div className="userName">
                                        {item.photo && item.photo !== "" ? (
                                          <img src={item.photo} />
                                        ) : (
                                            <div className="nophoto">
                                              {this.getNickNameByName(
                                                item.name && item.name
                                              )}
                                            </div>
                                          )}
                                      </div>
                                      <span className="nickName">
                                        {item.name && item.name.slice(0, 3)}
                                      </span>
                                      <div
                                        className="userCen"
                                        onClick={() => {
                                          this.deleteUser(
                                            "创建人",
                                            taskSearch.userCreates,
                                            i
                                          );
                                        }}
                                      >
                                        点击移除
                                </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                className="null"
                                onClick={() => {
                                  this.selUser("创建人");
                                }}
                              >
                                <span>不限</span>
                                {/* <span className="choose">选择确认人</span>
                          <span className="noChoose">未选确认人</span> */}
                              </div>
                            )}
                          {/* {taskSearch.userCreate.userid ? (
                        <div className="userBox">
                          <div className="userSel">
                            <div className="userName">
                              {taskSearch.userCreate.photo !== "" ? (
                                <img src={taskSearch.userCreate.photo} />
                              ) : (
                                <font>
                                  {this.getNickNameByName(
                                    taskSearch.userCreate.name
                                  )}
                                </font>
                              )}
                            </div>
                            <span>
                              {taskSearch.userCreate.name.slice(0, 3)}
                            </span>
                            <div
                              className="userCen"
                              onClick={() => {
                                this.deleteUser("创建人");
                              }}
                            >
                              点击移除
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="null"
                          onClick={() => {
                            this.selUser("创建人");
                          }}
                        >
                          <span className="choose">选择创建人</span>
                          <span className="noChoose">未选创建人</span>
                        </div>
                      )} */}
                        </div>
                      ) : (
                        ""
                      )}
                    {topSearchOptions.indexOf("指派人") !== -1 &&
                      (getTeamInfoWithMoney("版本名称") === "专业版" ||
                        getTeamInfoWithMoney("版本名称") === "" ||
                        getTeamInfoWithMoney("版本名称") === "试用版") ? (
                        <div className="selectType">
                          <h3>
                            指派人
                        {taskSearch.userAssigns &&
                              taskSearch.userAssigns.length > 0 ? (
                                <i
                                  className="iconfont icon-add2 "
                                  onClick={() => {
                                    this.selUser("指派人");
                                  }}
                                />
                              ) : (
                                ""
                              )}
                          </h3>
                          {taskSearch.userAssigns &&
                            taskSearch.userAssigns.length > 0 ? (
                              taskSearch.userAssigns.map((item, i) => {
                                return (
                                  <div className="userBox">
                                    <div className="userSel">
                                      <div className="userName">
                                        {item.photo && item.photo !== "" ? (
                                          <img src={item.photo} />
                                        ) : (
                                            <div className="nophoto">
                                              {this.getNickNameByName(
                                                item.name && item.name
                                              )}
                                            </div>
                                          )}
                                      </div>
                                      <span className="nickName">
                                        {item.name && item.name.slice(0, 3)}
                                      </span>
                                      <div
                                        className="userCen"
                                        onClick={() => {
                                          this.deleteUser(
                                            "指派人",
                                            taskSearch.userAssigns,
                                            i
                                          );
                                        }}
                                      >
                                        点击移除
                                </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                className="null"
                                onClick={() => {
                                  this.selUser("指派人");
                                }}
                              >
                                <span>不限</span>
                                {/* <span className="choose">选择确认人</span>
                          <span className="noChoose">未选确认人</span> */}
                              </div>
                            )}
                          {/* {taskSearch.userAssign.userid ? (
                        <div className="userBox">
                          <div className="userSel">
                            <div className="userName">
                              {taskSearch.userAssign.photo !== "" ? (
                                <img src={taskSearch.userAssign.photo} />
                              ) : (
                                <font>
                                  {this.getNickNameByName(
                                    taskSearch.userAssign.name
                                  )}
                                </font>
                              )}
                            </div>
                            <span>
                              {taskSearch.userAssign.name.slice(0, 3)}
                            </span>
                            <div
                              className="userCen"
                              onClick={() => {
                                this.deleteUser("指派人");
                              }}
                            >
                              点击移除
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="null"
                          onClick={() => {
                            this.selUser("指派人");
                          }}
                        >
                          <span className="choose">选择指派人</span>
                          <span className="noChoose">未选指派人</span>
                        </div>
                      )} */}
                        </div>
                      ) : (
                        ""
                      )}
                  </div>
                  <div
                    className="selectBox"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <div className="mainOne">
                      <i className="icon iconfont icon-add" />
                      <span
                        onClick={() => {
                          this.setState({ moreSelectShow: true });
                        }}
                      >
                        添加筛选条件
                    </span>
                    </div>
                    {moreSelectShow ? (
                      <div className="addBox">
                        <div className="addTop">
                          <span>更多筛选</span>
                          <Icon
                            type="close"
                            className="closeMore"
                            onClick={() => {
                              this.setState({ moreSelectShow: false });
                            }}
                          />
                        </div>
                        <div className="addContent">
                          <ul>
                            {initTopSearchOpts &&
                              initTopSearchOpts.map((item, i) => {
                                return (
                                  <li key={"searOpt" + i}>
                                    {getTeamInfoWithMoney("版本名称") !== "" &&
                                      getTeamInfoWithMoney("版本名称") !==
                                      "专业版" &&
                                      getTeamInfoWithMoney("版本名称") !==
                                      "试用版" &&
                                      item !== "负责人" &&
                                      item !== "项目" &&
                                      item !== "标签" ? (
                                        <em
                                          onClick={() => {
                                            this.setState({ versionAlert: true });
                                          }}
                                        />
                                      ) : (
                                        ""
                                      )}
                                    {this.backItem(item)}
                                    {getTeamInfoWithMoney("版本名称") !==
                                      "专业版" &&
                                      getTeamInfoWithMoney("版本名称") !==
                                      "试用版" &&
                                      item !== "负责人" &&
                                      item !== "项目" &&
                                      item !== "标签" ? (
                                        <svg
                                          className="check pro-icon zuanshi"
                                          aria-hidden="true"
                                        >
                                          <use xlinkHref={"#pro-myfg-zuanshi"} />
                                        </svg>
                                      ) : (
                                        this.backTaskSelected(item)
                                      )}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    ) : (
                        ""
                      )}
                  </div>
                </div>
                <div className="clearBox">
                  {taskSearch.projectIds.length > 0 ||
                    taskSearch.labelId.length > 0 ||
                    taskSearch.planTimeSear.start !== "" ||
                    taskSearch.planTimeSear.end !== "" ||

                    taskSearch.planBeginTimeSear.start !== "" ||
                    taskSearch.planBeginTimeSear.end !== "" ||
                    taskSearch.worktimeSear.min !== "" ||
                    taskSearch.worktimeSear.max !== "" ||
                    taskSearch.flowContenSear.min !== "" ||
                    taskSearch.flowContenSear.max !== "" ||
                    (taskSearch.userResponses &&
                      taskSearch.userResponses.length !== 0) ||
                    (taskSearch.userFlows && taskSearch.userFlows.length !== 0) ||
                    (taskSearch.userCreates &&
                      taskSearch.userCreates.length !== 0) ||
                    (taskSearch.userAssigns &&
                      taskSearch.userAssigns.length !== 0) ||
                    taskSearch.planTime !== "" ||
                    taskSearch.flowConten !== "" ||
                    taskSearch.taskPlanBeginTime !== "" ||
                    taskSearch.taskPlanTime !== "" ? (
                      <span
                        className="clearSelect"
                        onClick={() => {
                          this.clearSearchByType("all");
                        }}
                      >
                        清除筛选
                  </span>
                    ) : (
                      ""
                    )}
                  <span className="taskNum">已筛选出{taskList.length}条</span>
                </div>
              </div>
            )}
        </div>

        <div
          className="listHeaderRow"
          className={
            count == 0
              ? "listHeaderRow"
              : allSearchBoxShow
                ? "listHeaderRow listHeaderRowSmall"
                : "listHeaderRow"
          }
        >
          {moreTaskEditShow ? (
            <div className="editHeader">
              {/* <Checkbox 
                checked={checkTaskIds.length === taskList.length ? true : false}
                onChange={e => {
                  this.allChecked(e);
                }}
              >
                全选
              </Checkbox> */}
              <span className="selectNum">已选择：{checkTaskIds.length}条</span>
              {/*<span>当前任务数：{taskCount}</span>*/}
              <div className="allBtnRow">
                <MoreTaskEdit
                  editType="标签"
                  checkTaskIds={checkTaskIds}
                  updateCallBack={() => {
                    this.getTaskList(1, 30);
                  }}
                />
                <MoreTaskEdit
                  editType="负责人"
                  checkTaskIds={checkTaskIds}
                  updateCallBack={() => {
                    this.getTaskList(1, 30);
                  }}
                />
                <MoreTaskEdit
                  editType="确认人"
                  checkTaskIds={checkTaskIds}
                  updateCallBack={() => {
                    this.getTaskList(1, 30);
                  }}
                />
                <MoreTaskEdit
                  editType="关注人"
                  checkTaskIds={checkTaskIds}
                  updateCallBack={() => {
                    this.getTaskList(1, 30);
                  }}
                />

                {/* <Button type="primary" style={{ float: 'right', margin: '0' }} onClick={() => { this.cancelMoreEdit() }}>取消</Button> */}
                <Select
                  placeholder="更多"
                  style={{ width: 100, fontSize: "13px", color: "#bdbdbd" }}
                  value={"更多修改"}
                >
                  <Option value="more6">
                    <MoreTaskEdit
                      editType="开始时间"
                      checkTaskIds={checkTaskIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option>
                  <Option value="more1">
                    <MoreTaskEdit
                      editType="截止时间"
                      checkTaskIds={checkTaskIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option>
                  <Option value="more2">
                    <MoreTaskEdit
                      editType="计划工期"
                      checkTaskIds={checkTaskIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option>
                  <Option value="more4">
                    <MoreTaskEdit
                      editType="任务绩效"
                      checkTaskIds={checkTaskIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option>
                  {/* <Option value="more3">
                    <MoreTaskEdit
                      editType="优先级"
                      checkTaskIds={checkTaskIds}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option> */}
                  {/* <Option value="more5">
                    <MoreTaskEdit
                      editType="删除"
                      checkTaskIds={checkTaskIds}
                      // checkTaskNames={checkTaskNames}
                      updateCallBack={() => {
                        this.getTaskList(1, 30);
                      }}
                    />
                  </Option> */}
                </Select>
              </div>
            </div>
          ) : (
              <div
                // className="listHeader"
                className={
                  count == 0
                    ? "listHeader"
                    : allSearchBoxShow
                      ? "listHeader listHeaderSmall"
                      : "listHeader"
                }
              >
                {dictsLoading && taskSearch.menuType !== "" ? (
                  <Icon
                    type="loading"
                    className="loadingIcon"
                    style={{ float: "right", margin: "5px 0 0 15px" }}
                  />
                ) : (
                    ""
                  )}
                <div className="radioGroup">
                  {/* <div className="rad radOne" /> */}

                  {groupOptDict.length > 0 &&
                    groupOptDict &&
                    groupOptDict.map((item, i) => {
                      return (
                        <div
                          className={
                            item.value === taskSearchStateAct ? "rad act" : "rad"
                          }
                          key={item.id}
                          onClick={() => {
                            this.valChange("topRadio", item.value);
                          }}
                        >
                          {item.label}
                          {/* {this.tabNum(item.value)} */}
                        </div>
                      );
                    })}
                  <div
                    className="checkBoxStyle1"
                    onClick={() => {
                      this.hideOkTaskHandle();
                      // this.setState({ showOkTask: !showOkTask });
                      // Storage.setLocal("showOkTask", !showOkTask);
                    }}
                  >
                    <Checkbox checked={showOkTask}>隐藏已完成</Checkbox>
                  </div>
                  <div
                    className="checkBoxStyle2"
                    onClick={() => {
                      this.setState({ showTaskBox: !showTaskBox });
                      Storage.setLocal("showTaskBox", !showTaskBox);
                    }}
                  >
                    <Checkbox checked={showTaskBox}>隐藏任务包</Checkbox>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  valChange(type, val) {
    let { taskSearch, topSearchOptions, taskListHideOpt, permanent } = this.state;
    let dataTime = new Date().toLocaleDateString();

    switch (type) {
      case "checkTask":
        const checkTaskIds = JSON.parse(JSON.stringify(val));
        this.setState({ checkTaskIds: checkTaskIds });
        break;
      case "leftMenu":
        this.cancelMoreEdit();
        Storage.setLocal("leftMenuType", val);
        Storage.setLocal("nowTimes", dataTime);
        if (val === "all") {
          taskSearch.group = "evolve"; // 只能按任务进展筛选
          taskListHideOpt = [];
          taskSearch.panelId = []; // 点击左侧全部按钮时，将panelId制空
          taskSearch.labelId = [];
          taskSearch.projectIds = [];
          taskSearch.menuType = "all";
          this.setState({ taskSearchStateAct: "all" });
          Storage.setLocal("topRadioType", []);
        } else {
          taskSearch.menuType = val;
          if (val === "mytask") {
            taskSearch.panelId = ["10"];
            taskSearch.menuType = "mytask";
            taskSearch.group = "mytask";
            this.setState({ taskSearchStateAct: "10" });
            Storage.setLocal("topRadioType", ["10"]);
          } else if (val === "today") {
            taskSearch.panelId = ["10"];
            taskSearch.menuType = "today";
            taskSearch.group = "today";
            this.setState({ taskSearchStateAct: "10" });
            Storage.setLocal("topRadioType", ["10"]);
          } else if (val === "lastWeek") {
            taskSearch.menuType = "lastWeek";
            taskSearch.panelId = ["10"];
            taskSearch.group = "lastWeek";
            this.setState({ taskSearchStateAct: "10" });
            Storage.setLocal("topRadioType", ["10"]);
          } else if (val === "lastMonth") {
            taskSearch.menuType = "lastMonth";
            taskSearch.panelId = ["10"];
            taskSearch.group = "lastMonth";
            this.setState({ taskSearchStateAct: "10" });
            Storage.setLocal("topRadioType", ["10"]);
          } else if (val === "my_attention") {
            taskSearch.group = "evolve";
            taskSearch.panelId = [];
            this.setState({ taskSearchStateAct: "all" });
            Storage.setLocal("topRadioType", [""]);
          } else if (val === "add_today") {
            taskSearch.group = "evolve";
            taskSearch.panelId = [];
            this.setState({ taskSearchStateAct: "all" });
            Storage.setLocal("topRadioType", []);
          } else if (val === "finish_today") {
            taskSearch.group = "evolve";
            taskSearch.panelId = [];
            this.setState({ taskSearchStateAct: "all" });
            Storage.setLocal("topRadioType", []);
          } else if (val === "over_task") {
            taskSearch.panelId = [];
            taskSearch.group = "evolve";
            this.setState({ taskSearchStateAct: "all" });
            Storage.setLocal("topRadioType", []);
          }
          // 清空除项目和标签以外的筛选值
          taskSearch.planTimeSear = {
            start: "",
            end: ""
          };
          // 清空除项目和标签以外的筛选值
          taskSearch.planBeginTimeSear = {
            start: "",
            end: ""
          };
          taskSearch.worktimeSear = {
            min: "",
            max: ""
          };
          taskSearch.flowContenSear = {
            min: "",
            max: ""
          };
          //------------------------
          // for (var key in taskSearch.userResponse) {
          //   delete taskSearch.userResponse[key];
          // }
          // for (var key in taskSearch.userFlow) {
          //   delete taskSearch.userFlow[key];
          // }
          // for (var key in taskSearch.userCreate) {
          //   delete taskSearch.userCreate[key];
          // }
          // for (var key in taskSearch.userAssign) {
          //   delete taskSearch.userAssign[key];
          // }
          taskSearch.userSear = {
            type: "0" /* 负责人0 确认人1 关注人2 指派人3 创建人4          */,
            userIds: []
          };
          //-------------------------
        }
        if (!permanent) {
          this.setState({ allSearchBoxShow: false });
        }
        this.setState({
          taskSearch: taskSearch,
          taskListHideOpt: taskListHideOpt,
          tagSelecteds: [],
          selectedProject: [],
          // allSearchBoxShow: false,
          stopPlanTimeShow: false
        });
        this.getTopNum(val);
        this.getTaskList(1, 30, taskSearch);
        this.refs.bottomBox.scrollTop = 0; //初始化滚动条
        break;
      /**
       * @parms以上是点击左侧菜单栏的判断逻辑
       */
      case "searGroupOpt":
        taskSearch.group = val;
        taskSearch.panelId = [];
        this.setState({ taskSearch: taskSearch, taskSearchStateAct: "all" });
        this.getTaskList(1, 30, taskSearch);
        this.refs.bottomBox.scrollTop = 0;
        break;
      case "startTime":
        let start1 = "";
        let end1 = "";
        if (val.length > 0) {
          start1 = dateToString(val[0]._d, "date");
          end1 = dateToString(val[1]._d, "date");
          taskSearch.planBeginTimeSear = {
            start: start1 + " 00:00:00",
            end: end1 + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
        } else {
          taskSearch.planBeginTimeSear = {
            start: "",
            end: ""
          };
        }
        this.setState({
          taskSearch: taskSearch,
          taskSelectCenShow: false,
          taskPlanTimeSel: false,
          dateShow: false,
          weekShow: false,
          monthShow: false,
          pickerShow: false
        });
        this.getTaskList(1, 30, taskSearch);
        break;
      case "endTime":
        let start = "";
        let end = "";
        if (val.length > 0) {
          start = dateToString(val[0]._d, "date");
          end = dateToString(val[1]._d, "date");
          taskSearch.planTimeSear = {
            start: start + " 00:00:00",
            end: end + " 23:59:59"
          };
          taskSearch.taskPlanTime = "";
          taskSearch.taskPlanBeginTime = "";
        } else {
          taskSearch.planTimeSear = {
            start: "",
            end: ""
          };
        }
        this.setState({
          taskSearch: taskSearch,
          taskSelectCenShow: false,
          taskPlanTimeSel: false,
          dateShow: false,
          weekShow: false,
          monthShow: false,
          pickerShow: false
        });
        this.getTaskList(1, 30, taskSearch);
        break;
      case "userType":
        taskSearch.userSear.type = val;
        this.setState({ taskSearch: taskSearch });
        break;
      case "topRadio":
        this.cancelMoreEdit();
        if (val === "all") {
          taskSearch.panelId = [];
          Storage.setLocal("topRadioType", []);
        } else {
          if (val === "5") {
            taskSearch.panelId = ["3"];
            Storage.setLocal("topRadioType", ["3"]);
          } else if (val === "6") {
            taskSearch.panelId = ["0"];
            Storage.setLocal("topRadioType", ["0"]);
          } else {
            taskSearch.panelId = [val];
            Storage.setLocal("topRadioType", [val]);
          }
        }
        this.setState({ taskSearch: taskSearch, taskSearchStateAct: val });
        this.getTaskList(1, 30, taskSearch);
        this.refs.bottomBox.scrollTop = 0;
        break;
      case "searOpt":
        topSearchOptions.splice(topSearchOptions.indexOf(val), 1);
        this.setState({ topSearchOptions: topSearchOptions });
        Storage.setLocal("searchOpt", topSearchOptions);
        Storage.setLocal("versionName", getTeamInfoWithMoney("版本名称"));
        this.clearSearchByType(val);
        break;
      case "searOptAdd":
        if (topSearchOptions.indexOf(val) === -1) {
          topSearchOptions.push(val);
        } else {
          topSearchOptions.splice(topSearchOptions.indexOf(val), 1);
        }
        this.setState({ topSearchOptions: topSearchOptions }, () => { });
        Storage.setLocal("searchOpt", topSearchOptions);
        if (getTeamInfoWithMoney("版本名称") == "") {
          Storage.setLocal("versionName", "试用版");
        } else {
          Storage.setLocal("versionName", getTeamInfoWithMoney("版本名称"));
        }
        break;
      case "tagChange":
        taskSearch.labelId = [];
        val &&
          val.map(item => {
            taskSearch.labelId.push(item.id);
          });
        this.setState({ tagSelecteds: val, taskSearch: taskSearch });
        this.getTaskList(1, 30, taskSearch);
        this.refs.bottomBox.scrollTop = 0;
        break;
    }
  }

  scrollOnBottom(type, e) {
    const isOnButtom = listScroll(e);
    switch (type) {
      case "projectList":
        const { projectListAllPage, projectListNowPage } = this.state;
        if (isOnButtom && projectListNowPage < projectListAllPage) {
          this.getProjectList(projectListNowPage + 1);
        }
        break;
      case "taskList":
        const { taskListAllPage, taskListNowPage, isLast } = this.state;
        if (isOnButtom && isLast == "0") {
          this.getTaskList(taskListNowPage + 1, 30);
        }
        break;
    }
  }

  taskClickCallBack(taskId, proId) {
    const { count1 } = this.state;
    this.setState({ detailPageTaskId: taskId, detailPageProjectId: proId });
    if (taskId === this.state.detailPageTaskId) {
      this.setState({
        taskDetailShow: false,
        animateClass: "animated_05s fadeInRightBig",
        detailPageTaskId: ""
      });
    } else {
      if (!this.state.taskDetailShow) {
        this.setState({
          animateClass: "animated_05s fadeInRightBig",
          taskDetailShow: true,
          count1: count1 + 1
        });
      }
    }
    const _this = this;
    setTimeout(function () {
      _this.setState({ animateClass: "" });
    }, 500);
  }

  clearSearchByType(type) {
    let { taskSearch } = this.state;
    const taskSearchInitVal = {
      group: taskSearch.group,
      labelId: [],
      menuType: taskSearch.menuType,
      panelId: taskSearch.panelId,
      projectIds: [],
      search: "",
      planTimeSear: {
        start: "",
        end: ""
      },
      planBeginTimeSear: {
        start: "",
        end: ""
      },
      worktimeSear: {
        min: "",
        max: ""
      },
      flowContenSear: {
        min: "",
        max: ""
      },
      planTime: "",
      flowConten: "",
      taskPlanTime: "",
      taskPlanBeginTime: "",
      userResponses: [],
      userFlows: [],
      userCreates: [],
      userAssigns: [],
      userSear: {
        type: "0",
        userIds: []
      },
      sortType: Storage.getLocal("saveSort")
    };
    this.returnValue(Storage.getLocal("saveSort"));
    switch (type) {
      case "all":
        taskSearch = taskSearchInitVal;
        this.setState({
          selectedProject: [],
          selectedUsers: [],
          dateShow: false,
          weekShow: false,
          monthShow: false,
          rangePickerShow: false,
          rangeStartPickerShow: false,
          everyFlowShow: false,
          everyWorkShow: false,
          dateStartShow: false,
          weekStartShow: false,
          monthStartShow: false,
        });
        this.setState({ tagSelecteds: [] });
        this.getTaskList(1, 30, taskSearchInitVal);
        break;
      case "项目":
        taskSearch.projectIds = [];
        this.setState({ projectSelecteds: [] });
        break;
      case "标签":
        taskSearch.labelId = [];
        this.setState({ tagSelecteds: [] });
        break;
      case "计划工期":
        taskSearch.worktimeSear = taskSearchInitVal.worktimeSear;
        break;
      case "任务绩效":
        taskSearch.flowContenSear = taskSearchInitVal.flowContenSear;
        break;
      case "截止日期":
        taskSearch.planTimeSear = taskSearchInitVal.planTimeSear;
        break;
      case "开始时间":
        taskSearch.planBeginTimeSear = taskSearchInitVal.planBeginTimeSear;
        break;
      case "负责人":
        taskSearch.userResponses = taskSearchInitVal.userResponse;
        break;
      case "确认人":
        taskSearch.userFlows = taskSearchInitVal.userFlow;
        break;
      case "创建人":
        taskSearch.userCreates = taskSearchInitVal.userCreate;
        break;
      case "指派人":
        taskSearch.userAssigns = taskSearchInitVal.userAssign;
        break;
    }
    this.setState({ taskSearch: taskSearch });
  }

  taskUpdate(task) {
    let { taskList, hideTaskIds, taskSearch } = this.state;
    taskList &&
      taskList.map((item, i) => {
        if (item.taskinfo.id === task.id) {
          if (task.delTask) {
            taskList.splice(i, 1);
            this.setState({ taskList: taskList });
            return false;
          }
          if (task.name) {
            taskList[i].taskinfo.taskname = task.name;
          }
          if (task.tags) {
            const labs = [];
            task.tags &&
              task.tags.map((lab, index) => {
                labs.push({
                  id: lab.id,
                  labelname: lab.name,
                  color: lab.color,
                  type: "1"
                });
              });
            taskList[i].labels = labs;
          }
          if (task.attention !== undefined) {
            taskList[i].taskinfo.collect = task.attention;
          }
          if (task.milestone !== undefined) {
            taskList[i].taskinfo.milestone = task.milestone;
          }
          if (task.planEndTime !== undefined) {
            taskList[i].taskinfo.planEndTime = task.planEndTime;
          }
          if (task.realityEndTime !== undefined) {
            taskList[i].taskinfo.realityEndTime = task.realityEndTime;
          }

          //子任务 讨论条数 更新
          // if (task.childSuccess >= 0 || task.childCount >= 0) {
          //   taskList[i].taskinfo.childSuccess = task.childSuccess;
          //   taskList[i].taskinfo.childCount = task.childCount;
          // }
          // if (task.talkCount > 0 || task.talkCount === 0) {
          //   taskList[i].taskinfo.leaveCount = task.talkCount;
          // }
          if (task.state) {
            // 更新数据
            this.getTopNum(
              taskSearch.menuType === "" ? "all" : taskSearch.menuType
            );
            taskList[i].taskinfo.stateName = task.state;
            // 按任务进展
            if (taskSearch.group === "evolve") {
              // 未完成
              if (taskSearch.panelId[0] === "0") {
                if (task.state !== "0" && task.state !== "7") {
                  this.hideTask(task, hideTaskIds);
                } else {
                  this.showTask(task, hideTaskIds);
                }
                // 待确认
              } else if (taskSearch.panelId[0] === "2") {
                if (task.state !== "2") {
                  this.hideTask(task, hideTaskIds);
                } else {
                  this.showTask(task, hideTaskIds);
                }
                // 已完成
              } else if (taskSearch.panelId[0] === "1") {
                if (
                  task.state !== "1" &&
                  task.state !== "8" &&
                  task.state !== "9"
                ) {
                  this.hideTask(task, hideTaskIds);
                } else {
                  this.showTask(task, hideTaskIds);
                }
                // 已终止
              } else if (taskSearch.panelId[0] === "4") {
                if (task.state !== "4") {
                  this.hideTask(task, hideTaskIds);
                } else {
                  this.showTask(task, hideTaskIds);
                }
                // 未指派
              } else if (taskSearch.panelId[0] === "3") {
                if (task.state !== "3") {
                  this.hideTask(task, hideTaskIds);
                } else {
                  this.showTask(task, hideTaskIds);
                }
              }
            }
          }
          // if (
          //   taskSearch.menuType === "today" &&
          //   taskSearch.panelId[0] === "10"
          // ) {
          //   if (
          //     task.state === "1" ||
          //     task.state === "8" ||
          //     task.state === "9"
          //   ) {
          //     this.hideTask(task, hideTaskIds);
          //   } else {
          //     this.showTask(task, hideTaskIds);
          //   }
          // }
          // 删除/修改负责人
          if (task.fzr || task.fzr === "") {
            if (taskList[i].taskinfo.userResponse) {
              taskList[i].taskinfo.userResponse.name = task.fzr.name;
            } else {
              taskList[i].taskinfo.userResponse = {};
              taskList[i].taskinfo.userResponse.name = task.fzr.name;
            }
            // if (taskSearch.menuType === "my_be") {
            //   // 我指派的
            //   if (task.fzr === "") {
            //     this.hideTask(task, hideTaskIds);
            //   } else {
            //     this.showTask(task, hideTaskIds);
            //   }
            // }
            // // 我负责的
            // if (taskSearch.menuType === "sub1") {
            //   if (task.fzr === "") {
            //     this.hideTask(task, hideTaskIds);
            //   } else if (
            //     taskList[i].taskinfo.userResponse &&
            //     task.fzr === taskList[i].taskinfo.userResponse.name
            //   ) {
            //     this.showTask(task, hideTaskIds);
            //   }
            // }
          }
          // 我确认的
          // if (
          //   taskSearch.menuType === "my_succeed" &&
          //   (task.qrr === "" ||
          //     (item.taskinfo.userFlow &&
          //       task.qrr !== undefined &&
          //       task.qrr !== item.taskinfo.userFlow.name))
          // ) {
          //   this.hideTask(task, hideTaskIds);
          // } else if (
          //   taskSearch.menuType === "my_succeed" &&
          //   item.taskinfo.userFlow &&
          //   task.qrr !== undefined &&
          //   task.qrr === item.taskinfo.userFlow.name
          // ) {
          //   this.showTask(task, hideTaskIds);
          // }
          // 我关注的
          if (
            taskSearch.menuType === "my_attention" &&
            task.attention === false
          ) {
            this.hideTask(task, hideTaskIds);
          } else if (
            taskSearch.menuType === "my_attention" &&
            task.attention === true
          ) {
            this.showTask(task, hideTaskIds);
          }
          return false;
        }
      });
    this.setState({ taskList: taskList });
  }

  showTask(task, hideTaskIds) {
    const index = hideTaskIds.indexOf(task.id);
    if (index !== -1) {
      hideTaskIds.splice(index, 1);
      this.setState({ hideTaskIds: hideTaskIds });
    }
  }

  hideTask(task, hideTaskIds) {
    hideTaskIds.push(task.id);
    this.setState({ hideTaskIds: hideTaskIds });
  }
  selectProject(val) {
    const { taskSearch } = this.state;
    let projectIds = [];
    val &&
      val.map(item => {
        projectIds.push(item.id);
      });
    taskSearch.projectIds = projectIds;
    this.setState({ taskSearch: taskSearch, selectedProject: val });
    this.getTaskList(1, 30, taskSearch);
    this.refs.bottomBox.scrollTop = 0;
  }
  headMenu() {
    const { leftMenuShow } = this.state;
    if (leftMenuShow) {
      this.setState({ leftMenuShow: false });
    } else {
      this.setState({ leftMenuShow: true });
    }
  }
  render() {
    const {
      visible,
      taskSelectCenShow,
      available,
      taskList,
      taskListLoading,
      projectSelectShow,
      selectedProject,
      versionUpdateShow,
      hideTaskIds,
      versionAlert,
      buyDay15Show,
      showOkTask,
      showTaskBox,
      taskListLoadingCount,
      detailPageTaskId,
      taskCreateShow,
      animateClass,
      detailPageProjectId,
      checkTaskIds,
      moreTaskEditShow,
      taskSearch,
      taskDetailShow,
      taskListHideOpt,
      taskListMoreLoading,
      leftMenuShow,
      isLast,
      moneyEnd,
      count1,
      allSearchBoxShow,
      count,
      isIos,
      closeed
    } = this.state;
    let actType = [];
    if (taskSearch.menuType === "") {
      actType = ["all"];
    } else {
      actType = [taskSearch.menuType];
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout>
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          {taskSelectCenShow ? (
            <div
              className="taskSelectCen"
              onClick={() => {
                this.setState({ taskSelectCenShow: false, pickerShow: true });
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
          <Head
            menuShow={true}
            closeRule={() => {
              this.setState({ closeed: false });
            }}
            iconOnClickCallBack={() => {
              this.headMenu();
            }}
          />
          {visible ? (
            <FreeLimitModal
              closeFreeModalCallBack={() => {
                this.setState({ visible: false });
              }}
            />
          ) : (
              ""
            )}
          <Content>
            <div
              className={
                count1 === 0
                  ? "taskDetailBoxRun1 "
                  : taskDetailShow
                    ? "taskDetailBox " + animateClass
                    : "taskDetailBoxRun animated_03s animated_Out fadeInRightBigOut"
              }
            >
              <TaskDetail
                ref="taskDetail"
                taskId={detailPageTaskId}
                projectId={detailPageProjectId}
                taskDetailShow={taskDetailShow}
                closeed={closeed}
                closeedCal={() => {
                  this.setState({ closeed: true });
                }}
                closeCallBack={() => {
                  this.setState({
                    taskDetailShow: false,
                    animateClass: "animated_Out fadeInRightBigOut"
                  });
                }}
                updatedTaskCallBack={val => {
                  if (val === "刷新" || val.taskCopyId || val.moveTaskId) {
                    this.getTaskList();
                  } else {
                    this.taskUpdate(val);
                  }
                }}
                moneyEnd={() => {
                  this.setState({ moneyEnd: true });
                }}
              />
            </div>
            {taskCreateShow ? (
              <TaskCreate
                closedCallBack={() => {
                  this.setState({ taskCreateShow: false });
                }}
                successCallBack={() => {
                  this.getTaskList(1, 30, this.state.taskSearch);
                  this.getTopNum(
                    this.state.taskSearch.menuType === ""
                      ? "all"
                      : this.state.taskSearch.menuType
                  );
                }}
              />
            ) : (
                ""
              )}
            {projectSelectShow ? (
              <ProjectSelect
                title={"选择项目"}
                closedCallBack={() => {
                  this.setState({ projectSelectShow: false });
                }}
                selectedProjects={selectedProject}
                selectedCallBack={val => {
                  this.selectProject(JSON.parse(JSON.stringify(val)));
                }}
              />
            ) : (
                ""
              )}
            {versionUpdateShow &&
              !buyDay15Show &&
              !getTeamInfoWithMoney("是否超限")[0] &&
              (getTeamInfoWithMoney("剩余天数") > 0 ||
                getTeamInfoWithMoney("剩余天数") === 0) ? (
                <VersionUpdate />
              ) : (
                ""
              )}
            {getTeamInfoWithMoney("是否超限")[0] ? (
              <MoneyEnd
                alertText={getTeamInfoWithMoney("人数超限提示")}
                canClosed={false}
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
            {getTeamInfoWithMoney("剩余天数") < 0 ? (
              <MoneyEnd
                alertText={getTeamInfoWithMoney("已到期提示")}
                canClosed={false}
              />
            ) : (
                ""
              )}
            {!getTeamInfoWithMoney("是否超限")[0] &&
              buyDay15Show &&
              getTeamInfoWithMoney("版本名称") !== "" ? (
                <MoneyEnd
                  alertText={getTeamInfoWithMoney("即将到期提示")}
                  closeCallBack={() => {
                    this.setState({ buyDay15Show: false });
                    Storage.setLocal(
                      "buyDay15AlertDate",
                      dateToString(new Date(), "date")
                    );
                  }}
                />
              ) : getTeamInfoWithMoney("版本名称") === "" &&
                buyDay15Show &&
                getTeamInfoWithMoney("剩余天数") === 1 ? (
                  <MoneyEnd
                    alertText={getTeamInfoWithMoney("即将到期提示")}
                    closeCallBack={() => {
                      this.setState({ buyDay15Show: false });
                      Storage.setLocal(
                        "buyDay15AlertDate",
                        dateToString(new Date(), "date")
                      );
                    }}
                  />
                ) : (
                  ""
                )}
            <Spin spinning={taskListLoading} />
            <div
              className={
                leftMenuShow ? " left_menu_fixed left_menu" : "left_menu "
              }
              onClick={() => {
                this.setState({
                  taskDetailShow: false,
                  moreSelectShow: false,
                  detailPageTaskId: ""
                });
              }}
            >
              {!available ? (
                <Button
                  size="large"
                  type="primary"
                  key="creat1"
                  onClick={() => {
                    this.freeTaskLimit();
                  }}
                >
                  <i
                    className={
                      isIos
                        ? "iconfont icon-add2 creatAdd"
                        : "iconfont icon-add2 windowCreatAdd"
                    }
                  />
                  创建任务
                </Button>
              ) : (
                  <Button
                    type="primary"
                    size="large"
                    key="creat2"
                    onClick={() => {
                      this.cancelMoreEdit();
                      this.setState({ taskCreateShow: true });
                    }}
                  >
                    <i
                      className={
                        isIos
                          ? "iconfont icon-add2 creatAdd"
                          : "iconfont icon-add2 windowCreatAdd"
                      }
                    />
                    创建任务
                </Button>
                )}
              <Menu
                defaultSelectedKeys={actType}
                selectedKeys={actType}
                // openKeys={["wdrw"]}
                mode="inline"
              >
                {/* <SubMenu
                  key="wdrw"
                  title={
                    ""
                    // <span className="myTaskIcon">
                    //   <i className="iconfont icon-mytasks" />
                    //   <span className="allTask">我的任务</span>
                    // </span>
                  }
                > */}
                <Menu.Item
                  key="mytask"
                  className="menuAll"
                  onClick={() => {
                    this.valChange("leftMenu", "mytask");
                  }}
                >
                  <span className="myTaskIcon">
                    <i className="iconfont icon-mytasks" />
                  </span>
                  <span className="allTask">我的任务</span>
                </Menu.Item>
                <Menu.Item
                  key="today"
                  onClick={() => {
                    this.valChange("leftMenu", "today");
                  }}
                >
                  <span className="allName">今日任务</span>
                </Menu.Item>
                <Menu.Item
                  key="lastWeek"
                  onClick={() => {
                    this.valChange("leftMenu", "lastWeek");
                  }}
                >
                  <span className="allName">最近7天</span>
                </Menu.Item>
                <Menu.Item
                  key="lastMonth"
                  onClick={() => {
                    this.valChange("leftMenu", "lastMonth");
                  }}
                >
                  <span className="allName">最近30天</span>
                </Menu.Item>
                <Menu.Item
                  key="all"
                  className="menuAll"
                  onClick={() => {
                    this.valChange("leftMenu", "all");
                  }}
                >
                  <span className="myTaskIcon">
                    <i className="iconfont icon-alltasks" />
                  </span>
                  <span className="allTask">全部任务</span>
                </Menu.Item>
                <Menu.Item
                  key="add_today"
                  onClick={() => {
                    this.valChange("leftMenu", "add_today");
                  }}
                >
                  <span className="allName">今日新增</span>
                </Menu.Item>
                <Menu.Item
                  key="finish_today"
                  className="horBorder"
                  onClick={() => {
                    this.valChange("leftMenu", "finish_today");
                  }}
                >
                  <span className="allName">今日完成</span>
                </Menu.Item>
                <Menu.Item
                  key="over_task"
                  onClick={() => {
                    if (getTeamInfoWithMoney("是否可用")) {
                      this.valChange("leftMenu", "over_task");
                    } else {
                      this.setState({ versionAlert: true });
                    }
                  }}
                >
                  {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                    <span style={{ position: "absolute", left: 45 }}>
                      <svg className="pro-icon zuanshi" aria-hidden="true">
                        <use xlinkHref={"#pro-myfg-zuanshi"} />
                      </svg>
                    </span>
                  ) : (
                      ""
                    )}
                  <span className="allName">逾期任务</span>
                </Menu.Item>
                <Menu.Item
                  key="my_attention"
                  className="menubottom"
                  onClick={() => {
                    this.valChange("leftMenu", "my_attention");
                  }}
                >
                  <span className="allName">我关注的</span>
                </Menu.Item>
                {/* </SubMenu> */}
              </Menu>
            </div>
            <div className="contBox">
              {this.right_top_render()}
              <div
                className={
                  count == 0
                    ? "bottomBox"
                    : allSearchBoxShow
                      ? "bottomBox bottomBoxSmall"
                      : "bottomBox"
                }
                onScroll={e => {
                  this.scrollOnBottom("taskList", e);
                }}
                ref="bottomBox"
              >
                {/* {console.log(taskList)} */}
                {taskList && taskList.length > 0 ? (
                  <TaskList
                    taskList={taskList}
                    hideOpt={taskListHideOpt}
                    taskClickCallBack={(taskId, proId) => {
                      if (this.click > 0) {
                        if (this.refs.taskDetail.state.saveShow) {
                          const _this = this;
                          confirm({
                            title: "放弃未保存的信息？",
                            content: "已打开的任务中仍有未保存的信息",
                            okText: "继续编辑",
                            cancelText: "放弃",
                            onOk() { },
                            onCancel() {
                              _this.cancelMoreEdit();
                              _this.taskClickCallBack(taskId, proId);
                            }
                          });
                        } else {
                          this.cancelMoreEdit();
                          this.taskClickCallBack(taskId, proId);
                        }
                      } else {
                        this.click = this.click + 1;
                        this.cancelMoreEdit();
                        this.taskClickCallBack(taskId, proId);
                      }
                    }}
                    taskAttentionCallBack={task => {
                      this.taskUpdate(task);
                    }}
                    taskCheckedShow={moreTaskEditShow}
                    checkTaskIds={checkTaskIds}
                    checkingTaskCallBack={(val, name) => {
                      this.valChange("checkTask", val);
                      // this.setState({ checkTaskNames: name });
                    }}
                    hideOkTask={showOkTask}
                    hideTaskBox={showTaskBox}
                    hideTaskIds={hideTaskIds}
                  />
                ) : (
                    ""
                  )}
                {taskList.length === 0 && taskListLoadingCount > 0 && (
                  <NullView />
                )}
                {taskList.length === 0 && taskListLoadingCount === "err" && (
                  <NullView
                    isLoadingErr={true}
                    restLoadingCallBack={() => {
                      this.getTaskList();
                    }}
                  />
                )}
                {!taskListMoreLoading &&
                  isLast === "0" &&
                  taskListLoadingCount !== "err" &&
                  taskList.length > 30 ? (
                    showOkTask && taskSearch.panelId[0] === "1" ? (
                      ""
                    ) : (
                        <div className="moreLoadingRow">下拉加载更多</div>
                      )
                  ) : (
                    ""
                  )}
                {!taskListMoreLoading &&
                  (isLast === "1" || taskList.length > 0) &&
                  taskListLoadingCount !== "err" &&
                  taskList.length !== 0 ? (
                    <div className="moreLoadingRow">
                      共
                    {showOkTask && showTaskBox
                        ? taskList &&
                        taskList.filter(
                          item =>
                            item.taskinfo.state !== "1" &&
                            item.taskinfo.state !== "4" &&
                            item.taskinfo.childCount ===
                            item.taskinfo.childSuccess
                        ).length
                        : showOkTask
                          ? taskList &&
                          taskList.filter(
                            item =>
                              item.taskinfo.state !== "1" &&
                              item.taskinfo.state !== "4"
                          ).length
                          : showTaskBox
                            ? taskList &&
                            taskList.filter(
                              item =>
                                item.taskinfo.childCount ===
                                item.taskinfo.childSuccess
                            ).length
                            : taskList.length}
                      个任务
                  </div>
                  ) : (
                    ""
                  )}
                {taskListMoreLoading ? (
                  <div className="moreLoadingRow">
                    <Icon type="loading" className="loadingIcon" />
                    正在加载更多
                  </div>
                ) : (
                    ""
                  )}
              </div>
            </div>
          </Content>
        </Layout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    taskSortVal: state.task.taskSortVal
  };
}
const mapDispatchToProps = dispatch => {
  return {
    setTaskSortVal: bindActionCreators(taskAction.setTaskSortVal, dispatch)
  };
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Task);
