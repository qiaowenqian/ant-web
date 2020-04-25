import React from "react";
import withRedux from "next-redux-wrapper";
import { bindActionCreators } from "redux";
import { initStore } from "../store";
import stylesheet from "styles/views/census.scss";
import Head from "../components/header";
import * as projectAction from "../core/actions/project";
import * as statisticsAction from "../core/actions/statistics";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import G2Test from "../components/test";
import G2Test2 from "../components/test2";
import G2Test3 from "../components/test3";
import {
  Layout,
  LocaleProvider,
  Radio,
  DatePicker,
  Popover,
  Spin,
  Tooltip
} from "antd";
import {
  downPendByProject,
  downPendByPerson,
  downNumByProject,
  downNumByPerson,
  downContentByProject,
  downContentByPerson,
  downByProject,
  down
} from "../core/service/project.service";
import {
  getProjectProgess,
  getTaskDistributedByState,
  getTaskDistributedByProject,
  getProjectListByTypeTag
} from "../core/service/project.service";
import RingChart from "../components/statistics/ringChart";
import ProjectProgressChart from "../components/statistics/projectProgressChart";
import ContentLeftList from "../components/common/contentLeftList"; //左侧列表
import NullView from "../components/nullView";
import moment from "moment";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { Content } = Layout;

class Census extends React.Component {
  constructor() {
    super();
    this.state = {
      showChart: "achiev",
      currentMonth: true,
      lastMonth: false,
      projectSearchDivOnTop: false,
      mousePos: null,
      showData: null,
      projectId: [],
      monthType: 0,
      attdate: [],
      maskType: "",
      stateChartDatas: [],
      projectChartDatas: [],
      projectProgressDatas: [],
      dates: [],
      dateType: "",
      type: "1",
      labelId: [],
      projectList: [],
      projectIds: [], //我参与的项目id
      pageLoading: true,
      chart1Loading: false,
      chart2Loading: false,
      chartProgressLoading: false,
      nullview: false,
      conditionData: false,
      conditionProjectIds: [],
      flag: true,
      personTaskPendListNew: [],
      projectTaskPendListNew: [],
      taskNumListNew: [],
      taskPersonListNew: [],
      performanceProNew: [],
      performancePerNew: [],
      totalDataNew: null,
      totalDataBottomNew: null
    };
  }
  componentWillMount() {
    this.getProjectList();
  }

  getMonthDays(myMonth) {
    let now = new Date();
    let nowYear = now.getYear();
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }
  dateCurrentChange(type) {
    let now = new Date();
    let nowMonth = now.getMonth();
    let nowYear = now.getFullYear();
    now.setDate(1);
    now.setMonth(now.getMonth() - 1);

    let lastMonth = now.getMonth();
    switch (type) {
      case "currentMonth":
        let monthStartDate = new Date(nowYear, nowMonth, 1);
        let monthEndDate = new Date(
          nowYear,
          nowMonth,
          this.getMonthDays(nowMonth)
        );
        return [moment(monthStartDate), moment(monthEndDate)];
        break;
      case "lastMonth":
        let oldStartDate = new Date(
          nowMonth === 0 ? nowYear - 1 : nowYear,
          lastMonth,
          1
        );
        let oldEndDate = new Date(
          nowMonth === 0 ? nowYear - 1 : nowYear,
          lastMonth,
          this.getMonthDays(lastMonth)
        );
        return [moment(oldStartDate), moment(oldEndDate)];
        break;
      default:
        return [];
        break;
    }
  }

  getProjectList() {
    const { type, labelId } = this.state;
    const {
      penProject,
      penPerson,
      taskNumList,
      taskPersonList,
      performancePro,
      performancePer,
      totalData,
      totalDataBottom
    } = this.props;

    getProjectListByTypeTag(type, labelId, data => {
      let proIds = [];
      if (data && data.projectList && data.projectList.length > 0) {
        data.projectList.map((item, i) => {
          proIds.push(item.id);
        });
        if (this.state.flag) {
          this.setState({ conditionProjectIds: proIds, flag: false });
        }
        if (
          type === "1" &&
          labelId.length === 0 &&
          this.props.stateChartVal &&
          this.props.stateChartVal.length > 0 &&
          this.props.projectChartVal &&
          this.props.projectChartVal.length > 0 &&
          this.props.projectProgessVal &&
          this.props.projectProgessVal.length > 0
        ) {
          console.log("reducer");
          this.setState({
            stateChartDatas: this.props.stateChartVal,
            projectChartDatas: this.props.projectChartVal,
            projectProgressDatas: this.props.projectProgessVal,
            projectIds: proIds,
            pageLoading: false,
            personTaskPendListNew: penPerson.taskPendList,
            projectTaskPendListNew: penProject.taskPendList,
            taskNumListNew: taskNumList,
            taskPersonListNew: taskPersonList,
            performanceProNew: performancePro,
            performancePerNew: performancePer,
            totalDataNew: totalData,
            totalDataBottomNew: totalDataBottom
          });
        } else {
          console.log("first");
          this.setState({ projectIds: proIds }, () => {
            this.getTaskState(proIds);
            this.getTaskProject(proIds);
            this.getProjectProgress(proIds, "", "", "1");
          });
          //上边六个数据
          this.props.getProjectStatistics(
            { projectIds: proIds },
            data => {
              this.setState({ pageLoading: false, totalDataNew: data });
            },
            true
          );
          //下边三个数据
          this.props.getLeftContent(
            { projectIds: proIds, type: 0 },
            response => {
              this.setState({ totalDataBottomNew: response.data });
            },
            true
          );
          this.props.getPendStatistics(
            { projectIds: proIds },
            list => {
              this.setState({
                personTaskPendListNew: list.taskPendList
              });
            },
            true
          ); //代办统计按人员
          this.props.getPendByProject(
            { projectIds: proIds },
            list => {
              this.setState({
                projectTaskPendListNew: list.taskPendList
              });
            },
            true
          ); //代办统计按项目
          this.props.getNumByProject(
            "0",
            proIds,
            "",
            "",
            list => {
              this.setState({
                taskNumListNew: list.taskNumList
              });
            },
            true
          ); //盗版
          this.props.getNumByPerson(
            "0",
            proIds,
            "",
            "",
            list => {
              this.setState({
                taskPersonListNew: list.taskNumList
              });
            },
            true
          ); //
          this.props.getContentByProject(
            "0",
            proIds,
            "",
            "",
            list => {
              this.setState({
                performanceProNew: list.taskContentList
              });
            },
            true
          );
          this.props.getContentByPerson(
            "0",
            proIds,
            "",
            "",
            list => {
              this.setState({
                performancePerNew: list.tasContentList
              });
            },
            true
          );
        }
      } else {
        this.setState({ pageLoading: false });
        this.setState({ nullview: true });
      }
    });
    this.setState({
      attdate: this.dateCurrentChange("currentMonth")
    });
  }

  // mousePosition = ev => {
  //   ev = ev || window.event;
  //   if (ev.pageX || ev.pageY) {
  //     return { x: ev.pageX, y: ev.pageY };
  //   }
  //   return {
  //     x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
  //     y: ev.clientY + document.body.scrollTop - document.body.clientTop
  //   };
  // };

  timeSelect = Month => {
    const { projectList, projectIds } = this.state;
    this.setState(
      {
        currentMonth: Month === "currentMonth" ? true : false,
        lastMonth: Month === "lastMonth" ? true : false,
        monthType: Month === "currentMonth" ? 0 : 1,
        attdate: this.dateCurrentChange(Month)
      },
      () => {
        const { monthType } = this.state;
        this.props.getLeftContent(
          {
            type: monthType,
            projectIds: projectList.length > 0 ? projectList : projectIds
          },
          response => {
            this.setState({ totalDataBottomNew: response.data });
          }
        );

        this.props.getNumByProject(
          monthType,
          projectList.length > 0 ? projectList : projectIds,
          "",
          "",
          list => {
            this.setState({
              taskNumListNew: list.taskNumList
            });
          }
        );

        this.props.getNumByPerson(
          monthType,
          projectList.length > 0 ? projectList : projectIds,
          "",
          "",
          list => {
            this.setState({
              taskPersonListNew: list.taskNumList
            });
          }
        );

        this.props.getContentByProject(
          monthType,
          projectList.length > 0 ? projectList : projectIds,
          "",
          "",
          list => {
            this.setState({
              performanceProNew: list.taskContentList
            });
          }
        );
        this.props.getContentByPerson(
          monthType,
          projectList.length > 0 ? projectList : projectIds,
          "",
          "",
          list => {
            this.setState({
              performancePerNew: list.tasContentList
            });
          }
        );
      }
    );
  };
  onChangeTime = (e, value) => {
    const { projectList, projectIds } = this.state;
    if (value[0] && value[1]) {
      this.setState({
        attdate: [moment(value[0]), moment(value[1])],
        currentMonth: false,
        lastMonth: false,
        monthType: ""
      });
      this.props.getLeftContent(
        {
          projectIds: projectIds,
          attdate01: value[0],
          attdate02: value[1]
        },
        response => {
          this.setState({ totalDataBottomNew: response.data });
        }
      );
    } else {
      this.setState({
        attdate: [],
        currentMonth: false,
        lastMonth: false,
        monthType: ""
      });
      this.props.getLeftContent(
        {
          projectIds: projectIds
        },
        response => {
          this.setState({ totalDataBottomNew: response.data });
        }
      );
    }

    this.props.getNumByProject(
      "",
      projectList.length > 0 ? projectList : projectIds,
      value[0],
      value[1],

      list => {
        this.setState({
          taskNumListNew: list.taskNumList
        });
      }
    );
    this.props.getNumByPerson(
      "",
      projectList.length > 0 ? projectList : projectIds,
      value[0],
      value[1],

      list => {
        this.setState({
          taskPersonListNew: list.taskNumList
        });
      }
    );

    this.props.getContentByProject(
      "",
      projectList.length > 0 ? projectList : projectIds,
      value[0],
      value[1],
      list => {
        this.setState({
          performanceProNew: list.taskContentList
        });
      }
    );
    this.props.getContentByPerson(
      "",
      projectList.length > 0 ? projectList : projectIds,
      value[0],
      value[1],
      list => {
        this.setState({
          performancePerNew: list.tasContentList
        });
      }
    );
  };
  headMenu() {
    const { projectSearchDivOnTop } = this.state;
    if (projectSearchDivOnTop) {
      this.setState({ projectSearchDivOnTop: false });
    } else {
      this.setState({ projectSearchDivOnTop: true });
    }
  }
  // showChartTask = e => {
  //   this.setState({
  //     showChart: e.target.value
  //   });
  // };
  //获取任务分布按任务状态数据
  getTaskState(projectIds) {
    const data = {
      projectIds: projectIds && projectIds
    };
    this.setState({ chart1Loading: true });
    getTaskDistributedByState(data, res => {
      if (res.err) {
        return false;
      }
      const { type, labelId } = this.state;
      if (res.data) {
        let stateDatas = [];
        stateDatas.push(
          {
            value: res.data.daizp,
            name: "待指派",
            itemStyle: {
              color: "#CE93D8",
              opacity: 0.52
            },
            key: res.data.dzpyq,
            icon: "circle"
          },
          {
            value: res.data.jinxz,
            name: "进行中",
            itemStyle: {
              color: "#A5d6A7",
              opacity: 0.52
            },
            key: res.data.jxzyq,
            icon: "circle"
          },
          {
            value: res.data.daiqr,
            name: "待确认",
            itemStyle: {
              color: "#81d4fa",
              opacity: 0.52
            },
            key: res.data.dqryq,
            icon: "circle"
          },
          {
            value: res.data.yiwc,
            name: "已完成",
            itemStyle: {
              color: "#b0bec5",
              opacity: 0.52
            },
            key: res.data.ywcyq,
            key1: res.data.tqwc,
            icon: "circle"
          },
          {
            value: res.data.yizz,
            name: "已终止",
            itemStyle: {
              color: "#eeeeee",
              opacity: 0.52
            },
            icon: "circle"
          }
        );
        if (
          type === "1" &&
          labelId.length === 0 &&
          this.props.stateChartVal.length === 0
        ) {
          this.props.setStateVal(stateDatas);
        }
        this.setState({ stateChartDatas: stateDatas });
      }
    });
    this.setState({ chart1Loading: false });
  }
  //获取任务分布按项目
  getTaskProject(projectIds) {
    const data = {
      projectIds: projectIds && projectIds
    };
    this.setState({ chart2Loading: true });
    getTaskDistributedByProject(data, res => {
      if (res.err) {
        return false;
      }
      const { type, labelId } = this.state;
      if (res.data && res.data.length > 0) {
        let projectDatas = [];
        res.data.map((item, i) => {
          projectDatas.push({
            value: item.allTask,
            name: item.proName,
            itemStyle: {
              opacity: 0.52
            },
            key: item.daizp,
            key1: item.jinxz,
            key2: item.daiqr,
            key3: item.yiwc,
            key4: item.yizz,
            icon: "circle"
          });
        });
        if (
          type === "1" &&
          labelId.length === 0 &&
          this.props.projectChartVal.length === 0
        ) {
          this.props.setProjectVal(projectDatas);
        }
        this.setState({ projectChartDatas: projectDatas });
      }
    });
    this.setState({ chart2Loading: false });
  }
  //获取项目进展数据
  getProjectProgress(projectIds, attdate01, attdate02, type) {
    const data = {
      projectIds: projectIds && projectIds,
      attdate01: attdate01 ? attdate01 : "",
      attdate02: attdate02 ? attdate02 : "",
      type: type ? type : ""
    };
    this.setState({ chartProgressLoading: true });
    getProjectProgess(data, res => {
      if (res.err) {
        return false;
      }
      const { type, labelId } = this.state;
      if (res.length > 0) {
        if (
          type === "1" &&
          labelId.length === 0 &&
          this.props.projectProgessVal.length === 0
        ) {
          this.props.setProjectProgessVal(res);
        }
      }

      if (res.length > 0) {
        let progressDatas = [];
        res.map((item, i) => {
          progressDatas.push(item);
        });
        this.setState({
          projectProgressDatas: progressDatas
        });
      } else {
        this.setState(
          {
            projectProgressDatas: res
          },
          () => {}
        );
      }
    });
    this.setState({ chartProgressLoading: false });
  }
  //处理选中日期
  dateChange(val) {
    const { dates, projectIds } = this.state;
    const dateData = [];
    if (val.length > 0) {
      val.map((item, i) => {
        dateData.push(item);
      });
      this.setState({ dates: dateData, conditionData: false }, () => {
        this.getProjectProgress(projectIds, val[0], val[1], "");
      });
    }
  }
  //处理项目进展类型
  typeChange(val) {
    const { projectIds } = this.state;
    this.setState({ dateType: val, conditionData: false }, () => {
      this.getProjectProgress(projectIds, "", "", val);
    });
  }
  renderChart() {
    const {
      taskNumList,
      taskPersonList,
      performancePro,
      performancePer
    } = this.props;
    const { showChart } = this.state;
    let chart1 = "";
    let chart2 = "";
    if (showChart == "achiev") {
      return {
        chart1: (
          <G2Test2
            originalData={taskNumList}
            refnamer="ccc"
            transposeCoord={true}
          />
        ),
        chart2: (
          <G2Test2
            originalData={taskPersonList}
            refnamer="ddd"
            transposeCoord={false}
          />
        )
      };
    } else if (showChart == "taskNum") {
      console.log(performancePro);
      return {
        chart1: (
          <G2Test3
            originalData={performancePro}
            refnamer="eee"
            transposeCoord={true}
          />
        ),
        chart2: (
          <G2Test3
            originalData={performancePer}
            refnamer="fff"
            transposeCoord={false}
          />
        )
      };
    }
  }
  projectListClick(list, menutype, tagId) {
    const { conditionProjectIds } = this.state;
    if (
      list.length !== conditionProjectIds.length ||
      menutype !== "1" ||
      tagId.length !== 0
    ) {
      this.setState({ conditionData: true });
    } else {
      this.setState({ conditionData: false });
    }
    this.setState(
      {
        projectList: list,
        nullview: false,
        attdate: this.dateCurrentChange("currentMonth"),
        projectIds: list,
        type: menutype,
        labelId: tagId,
        currentMonth: true,
        lastMonth: false,
        monthType: 0
      },
      () => {
        const projectIds = list;
        this.props.getProjectStatistics({ projectIds }, data => {
          this.setState({ totalDataNew: data });
        });
        this.props.getLeftContent(
          { projectIds: projectIds, type: 0 },
          response => {
            this.setState({ totalDataBottomNew: response.data });
          }
        );
        this.props.getPendByProject({ projectIds }, list => {
          this.setState({
            projectTaskPendListNew: list.taskPendList
          });
        }); //代办统计按人员
        this.props.getPendStatistics({ projectIds }, list => {
          this.setState({
            personTaskPendListNew: list.taskPendList
          });
        }); //代办统计按项目

        this.props.getNumByProject(0, projectIds, "", "", list => {
          this.setState({
            taskNumListNew: list.taskNumList
          });
        }); //
        this.props.getNumByPerson(0, projectIds, "", "", list => {
          this.setState({
            taskPersonListNew: list.taskNumList
          });
        }); //
        this.props.getContentByProject(0, projectIds, "", "", list => {
          this.setState({
            performanceProNew: list.taskContentList
          });
        });
        this.props.getContentByPerson(0, projectIds, "", "", list => {
          this.setState({
            performancePerNew: list.tasContentList
          });
        });
        this.getTaskState(projectIds);
        this.getTaskProject(projectIds);
        this.getProjectProgress(projectIds, "", "", "1");
      }
    );
  }
  downLoad() {
    const {
      showChart,
      projectList,
      monthType,
      attdate,
      projectIds
    } = this.state;

    if (showChart === "taskNum") {
      // if (monthType != "") {
      //   downNumByProject(
      //     projectList.length > 0 ? projectList : projectIds,
      //     monthType
      //   );
      //   return false;
      // }
      // if (attdate && attdate.length <= 0) {
      //   downNumByProject(projectList.length > 0 ? projectList : projectIds, 0);
      //   return false;
      // }
      downNumByProject(
        projectList.length > 0 ? projectList : projectIds,
        "",
        moment(attdate[0]).format("YYYY/MM/DD"),
        moment(attdate[1]).format("YYYY/MM/DD")
      );
    } else if (showChart === "achiev") {
      // if (monthType != "") {
      //   downContentByProject(
      //     projectList.length > 0 ? projectList : projectIds,
      //     monthType
      //   );
      //   return false;
      // }
      // if (attdate && attdate.length <= 0) {
      //   downContentByProject(
      //     projectList.length > 0 ? projectList : projectIds,
      //     0
      //   );
      //   return false;
      // }

      downContentByProject(
        projectList.length > 0 ? projectList : projectIds,
        "",
        moment(attdate[0]).format("YYYY/MM/DD"),
        moment(attdate[1]).format("YYYY/MM/DD")
      );
    }
  }
  downLoad1() {
    const {
      showChart,
      projectList,
      monthType,
      attdate,
      projectIds
    } = this.state;
    if (showChart === "taskNum") {
      // if (monthType != "") {
      //   downNumByPerson(
      //     projectList.length > 0 ? projectList : projectIds,
      //     monthType
      //   );
      //   return false;
      // }
      // if (attdate && attdate.length <= 0) {
      //   downNumByPerson(projectList.length > 0 ? projectList : projectIds, 0);
      //   return false;
      // }

      downNumByPerson(
        projectList.length > 0 ? projectList : projectIds,
        "",
        moment(attdate[0]).format("YYYY/MM/DD"),
        moment(attdate[1]).format("YYYY/MM/DD")
      );
    } else if (showChart === "achiev") {
      // if (monthType != "") {
      //   downContentByPerson(
      //     projectList.length > 0 ? projectList : projectIds,
      //     monthType
      //   );
      //   return false;
      // }
      // if (attdate && attdate.length <= 0) {
      //   downContentByPerson(
      //     projectList.length > 0 ? projectList : projectIds,
      //     0
      //   );
      //   return false;
      // }

      downContentByPerson(
        projectList.length > 0 ? projectList : projectIds,
        "",
        moment(attdate[0]).format("YYYY/MM/DD"),
        moment(attdate[1]).format("YYYY/MM/DD")
      );
    }
  }
  render() {
    const {
      lastMonth,
      projectIds,
      currentMonth,
      attdate,
      mousePos,
      showData,
      maskType,
      pageLoading,
      stateChartDatas,
      projectChartDatas,
      projectProgressDatas,
      projectSearchDivOnTop,
      projectList,
      chart1Loading,
      chart2Loading,
      chartProgressLoading,
      nullview,
      conditionData,
      personTaskPendListNew,
      projectTaskPendListNew,
      totalDataNew,
      totalDataBottomNew
    } = this.state;
    const { penProject, penPerson } = this.props;
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout>
          <Head
            menuShow={true}
            iconOnClickCallBack={() => {
              this.headMenu();
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />

          <Content>
            {pageLoading ? (
              <div style={{ textAlign: "center" }}>
                <Spin spinning={pageLoading} />
              </div>
            ) : (
              <div className="census">
                <div
                  className={
                    projectSearchDivOnTop
                      ? "screen pro_screen chart-left-fixed census_screen_fixed"
                      : "screen pro_screen census_screen"
                  }
                >
                  <ContentLeftList
                    ref="staticticsDetail"
                    pageType={1}
                    projectIds={projectIds}
                    projectSearchDivOnTop={projectSearchDivOnTop}
                    projectOnClick={(list, type, labelIds) => {
                      this.projectListClick(list, type, labelIds);
                    }}
                  />
                </div>
                {nullview ? (
                  <div className="censusContent">
                    <NullView style={{ marginTop: "100px" }} />
                  </div>
                ) : (
                  <div className="censusContent">
                    <div className="topBox">
                      <div className="boxTop clearfloat">
                        <div className="title">
                          <span className="titleName"> 任务统计</span>
                          <Popover
                            placement="left"
                            title={null}
                            overlayClassName="popverStyle"
                            content={
                              <div className="download">
                                <div
                                  onClick={() => {
                                    down(
                                      projectList.length > 0
                                        ? projectList
                                        : projectIds
                                    );
                                  }}
                                  className="downloadChild"
                                >
                                  导出任务分布
                                </div>
                                <div className="myBorder" />
                                <div
                                  onClick={() => {
                                    downByProject(
                                      projectList.length > 0
                                        ? projectList
                                        : projectIds
                                    );
                                  }}
                                  className="downloadChild"
                                >
                                  导出项目分布
                                </div>
                              </div>
                            }
                            trigger="click"
                            className="export"
                          >
                            <i className="iconfont icon-more"> </i>
                          </Popover>
                        </div>
                        <div className="barChartBoxToT">
                          <div className="countTop">
                            <div> 项目数</div>
                            <span>
                              {totalDataNew &&
                                totalDataNew.projectList &&
                                totalDataNew.projectList.projectNum}
                            </span>
                            <div> 参与人数</div>
                            {totalDataNew &&
                            totalDataNew.projectList &&
                            _.isNumber(totalDataNew.projectList.participate) &&
                            totalDataNew.projectList.participate < 10000 ? (
                              <span>
                                {totalDataNew &&
                                  totalDataNew.projectList.participate}
                              </span>
                            ) : (
                              <Tooltip
                                title={
                                  totalDataNew &&
                                  totalDataNew.projectList &&
                                  totalDataNew.projectList.participate
                                }
                              >
                                <span>9999+</span>
                              </Tooltip>
                            )}
                            <div> 综合进度</div>
                            <span>
                              {totalDataNew &&
                                totalDataNew.projectList &&
                                parseFloat(totalDataNew.projectList.progress)}
                              <span className="parseFloatStyle">%</span>
                            </span>
                          </div>
                          <div className="taskArea-content-project">
                            <div className="topChartBox">
                              <Spin spinning={chart1Loading} />
                              <RingChart
                                title={"任务分布"}
                                chartData={stateChartDatas}
                                ref="chart1"
                              />
                            </div>
                            <div className="projectArea">
                              <Spin spinning={chart2Loading} />
                              <RingChart
                                title={"项目分布"}
                                chartData={projectChartDatas}
                                colorType={"light"}
                                ref="chart2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="progressBox clearfloat">
                        <Spin spinning={chartProgressLoading} />
                        <ProjectProgressChart
                          title={"历史进展"}
                          ref="chart3"
                          chartProgress={projectProgressDatas}
                          timeMenuShow={true}
                          DatePickerShow={true}
                          calculationShow={conditionData}
                          progressDateChartCallBack={val => {
                            this.dateChange(val);
                          }}
                          progressTypeCallBack={val => {
                            this.typeChange(val);
                          }}
                        />
                      </div>
                    </div>
                    <div className="box clearfloat">
                      <div className="title">
                        <span className="titleName"> 待办统计</span>
                        <Popover
                          placement="left"
                          overlayClassName="popverStyle"
                          title={null}
                          content={
                            <div className="download">
                              <div
                                onClick={() => {
                                  downPendByProject(
                                    projectList.length > 0
                                      ? projectList
                                      : projectIds
                                  );
                                }}
                                className="downloadChild"
                              >
                                导出项目待办
                              </div>
                              <div className="myBorder" />
                              <div className="myBorder1" />
                              <div
                                onClick={() => {
                                  downPendByPerson(
                                    projectList.length > 0
                                      ? projectList
                                      : projectIds
                                  );
                                }}
                                className="downloadChild"
                              >
                                导出人员待办
                              </div>
                            </div>
                          }
                          trigger="click"
                          className="export"
                        >
                          <i className="iconfont icon-more"> </i>
                        </Popover>
                      </div>
                      <div
                        className="barChartBoxTop"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start"
                        }}
                      >
                        <div className="count" style={{ position: "relative" }}>
                          <div> 待完成任务</div>
                          <span>
                            {totalDataNew &&
                              totalDataNew.projectList &&
                              totalDataNew.projectList.pendNum}
                          </span>
                          <div> 逾期任务</div>
                          {totalDataNew &&
                          totalDataNew.projectList &&
                          _.isNumber(totalDataNew.projectList.overNum) &&
                          totalDataNew.projectList.overNum < 10000 ? (
                            <span>{totalDataNew.projectList.overNum}</span>
                          ) : (
                            <Tooltip
                              title={
                                totalDataNew &&
                                totalDataNew.projectList &&
                                totalDataNew.projectList.overNum
                              }
                            >
                              <span>9999+</span>
                            </Tooltip>
                          )}
                          <div> 逾期率</div>
                          <span>
                            {totalDataNew &&
                              totalDataNew.projectList &&
                              parseFloat(totalDataNew.projectList.overdue)}
                            <span className="parseFloatStyle">%</span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "82%",
                            justifyContent: "space-between"
                          }}
                        >
                          {penProject.taskPendList && (
                            //   this.renderPendingProjectChart(
                            //     penProject.taskPendList,
                            //     "proName"
                            //   )
                            <div
                              className="ho-barChat"
                              style={{ paddingLeft: "0", flexShrink: "2" }}
                            >
                              <div
                                style={{ padding: "17px 0", fontSize: "16px" }}
                              >
                                项目排行
                              </div>
                              <G2Test
                                originalData={penProject.taskPendList}
                                refnamer="aaa"
                                transposeCoord={true}
                              />
                            </div>
                          )}

                          {penPerson.taskPendList && (
                            //   this.renderPendingProjectChart(
                            //     penPerson.taskPendList
                            //   )
                            <div
                              className="ho-barChat"
                              style={{
                                position: "relative",
                                paddingLeft: "0",
                                flexShrink: "3"
                              }}
                            >
                              <div
                                style={{ padding: "17px 0", fontSize: "16px" }}
                              >
                                项目排行
                              </div>
                              <div>
                                <G2Test
                                  originalData={penPerson.taskPendList}
                                  refnamer="bbb"
                                  transposeCoord={false}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="box clearfloat">
                      <div className="title">
                        <span className="titleName"> 绩效统计</span>

                        <Popover
                          placement="left"
                          overlayClassName="popverStyle"
                          title={null}
                          content={
                            <div className="download">
                              <div
                                className="downloadChild"
                                onClick={() => {
                                  this.downLoad();
                                }}
                              >
                                导出项目绩效
                              </div>
                              <div className="myBorder" />
                              <div
                                className="downloadChild"
                                onClick={() => {
                                  this.downLoad1();
                                }}
                              >
                                导出人员绩效
                              </div>
                            </div>
                          }
                          trigger="click"
                          className="export"
                        >
                          <i className="iconfont icon-more"> </i>
                        </Popover>
                        <Radio.Group
                          className="group"
                          defaultValue="achiev"
                          buttonStyle="solid"
                          onChange={e => {
                            this.setState({
                              showChart: e.target.value
                            });
                          }}
                        >
                          <Radio.Button value="achiev">绩效值</Radio.Button>
                          <Radio.Button value="taskNum">任务数</Radio.Button>
                        </Radio.Group>

                        <RangePicker
                          className="timePickerSelect"
                          format="YYYY-MM-DD"
                          size="small"
                          value={attdate.length > 0 ? attdate : null}
                          onChange={(value, dateStrings) => {
                            this.onChangeTime(value, dateStrings);
                          }}
                        />
                        <div className="tabTime">
                          <ul>
                            <li
                              onClick={() => {
                                this.timeSelect("currentMonth");
                              }}
                            >
                              <span
                                className={currentMonth ? "textColor" : "text"}
                              >
                                本月
                              </span>
                            </li>
                            <li
                              onClick={() => {
                                this.timeSelect("lastMonth");
                              }}
                            >
                              <span
                                className={lastMonth ? "textColor" : "text"}
                              >
                                上月
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="barChartBoxTop"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start"
                        }}
                      >
                        <div className="count" style={{ position: "relative" }}>
                          <div> 完成任务</div>
                          <span>
                            {totalDataBottomNew && totalDataBottomNew.finishNum}
                          </span>
                          <div> 完成绩效</div>
                          {totalDataBottomNew &&
                          _.isNumber(totalDataBottomNew.finishConten) &&
                          totalDataBottomNew.finishConten < 10000 ? (
                            <span>{totalDataBottomNew.finishConten}</span>
                          ) : (
                            <Tooltip
                              title={
                                totalDataBottomNew &&
                                totalDataBottomNew.finishConten
                              }
                            >
                              <span>9999+</span>
                            </Tooltip>
                          )}
                          <div> 逾期完成率</div>
                          <span>
                            {totalDataBottomNew &&
                              parseFloat(totalDataBottomNew.overFinish)}
                            <span className="parseFloatStyle">%</span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "82%",
                            justifyContent: "space-between"
                          }}
                        >
                          <div
                            className="ho-barChat"
                            style={{ paddingLeft: "0", flexShrink: "2" }}
                          >
                            <div
                              style={{
                                padding: "17px 0",
                                fontSize: "16px"
                              }}
                            >
                              项目排行
                            </div>
                            {this.renderChart().chart1}
                          </div>

                          <div
                            className="ho-barChat"
                            style={{
                              position: "relative",
                              paddingLeft: "0",
                              flexShrink: "3"
                            }}
                          >
                            <div
                              style={{
                                padding: "17px 0",
                                fontSize: "16px"
                              }}
                            >
                              项目排行
                            </div>
                            <div>{this.renderChart().chart2}</div>
                          </div>
                        </div>
                      </div>
                      <div />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Content>
        </Layout>
      </LocaleProvider>
    );
  }
}
const mapStateToProps = state => {
  return {
    penPerson: state.statistics.taskPendList,
    penProject: state.statistics.barChartProList,

    stateChartVal: state.project.stateChartVal,
    projectChartVal: state.project.projectChartVal,
    projectProgessVal: state.project.projectProgessVal,
    projectList: state.statistics.projectList,
    totalData: state.statistics.totalData,
    totalDataBottom: state.statistics.totalDataBottom,

    taskNumList: state.statistics.taskNumList,
    taskPersonList: state.statistics.taskPersonList,
    performancePro: state.statistics.performancePro,
    performancePer: state.statistics.performancePer,

    taskPendChart: state.statistics.taskPendChart,
    NumByProjectChart: state.statistics.NumByProjectChart,
    NumByPersonChart: state.statistics.NumByPersonChart,
    ContentProjectChart: state.statistics.ContentProjectChart,
    ContentPersonChart: state.statistics.ContentPersonChart,
    headerData: state.statistics.headerData,
    projectListAll: state.statistics.projectListAll
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setStateVal: bindActionCreators(projectAction.setStateVal, dispatch),
    setProjectVal: bindActionCreators(projectAction.setProjectVal, dispatch),

    setProjectProgessVal: bindActionCreators(
      projectAction.setProjectProgessVal,
      dispatch
    ),
    getProjectListByTypeTag: bindActionCreators(
      statisticsAction.getProjectListByTypeTag,
      dispatch
    ),
    getProjectStatistics: bindActionCreators(
      statisticsAction.getProjectStatistics, // 获取头部和 任务分布统计数据
      dispatch
    ),
    getLeftContent: bindActionCreators(
      statisticsAction.getLeftContent, // 获取头部和 任务分布统计数据最后面三个
      dispatch
    ),
    getPendStatistics: bindActionCreators(
      statisticsAction.getPendStatistics, //代办统计按人员
      dispatch
    ),
    getNumByProject: bindActionCreators(
      statisticsAction.getNumByProject,
      dispatch
    ),
    getNumByPerson: bindActionCreators(
      statisticsAction.getNumByPerson,
      dispatch
    ),
    getContentByProject: bindActionCreators(
      statisticsAction.getContentByProject,
      dispatch
    ),
    getContentByPerson: bindActionCreators(
      statisticsAction.getContentByPerson,
      dispatch
    ),
    getPendByProject: bindActionCreators(
      statisticsAction.getPendByProject,
      dispatch
    ),
    getProjectList: bindActionCreators(
      statisticsAction.getProjectList,
      dispatch
    ),
    setHeaderData: bindActionCreators(statisticsAction.setHeaderData, dispatch)
  };
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  Census
);
