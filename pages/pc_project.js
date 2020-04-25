import React from "react";
import { Layout, Spin, Tag, message, Progress, Input, Modal, Button, Menu, Empty } from "antd";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import { getExportMenuData } from "../core/service/file.service";
import { initStore } from "../store";
import stylesheet from "styles/views/project.scss";
import Head from "../components/header";
import * as projectAction from "../core/actions/project";
import { getProListByType, cancelAttentionWitchProject, addAttentionWitchProject, projectCount, downLoadTaskTest } from "../core/service/project.service";
import { getLimtTask } from "../core/service/task.service";
import { getProjectTypeList } from "../core/service/tag.service";
import { listScroll, getTagColorByColorCode, isLoadingErr, getTeamInfoWithMoney, isIosSystem } from "../core/utils/util";
import Router from "next/router";
import ProjecSort from "../components/projectSort";
import ProjectCreate from "../components/project/projectSetting";
import ProjectGuide from "../components/projectGuide";
import dingJS from "../core/utils/dingJSApi";
import MoneyEnd from "../components/moneyEnd";
import Storage from "../core/utils/storage";
import moment from "moment";
const { Content } = Layout;
const monthFormat = "YYYY-MM";
let back = 1;
class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      projectListNowPage: 1,
      projectListAllPage: 0,
      projectListLoading: false,
      projectListLoadingCount: 0,
      rtype: "1", // 默认选中 所有项目
      labelIds: [],
      searchTxt: "",
      projectListMoreLoading: false,
      typeList: [],
      projectCreateShow: "",
      projectId: "",
      searchOpen: true,
      moneyEnd: false,
      projectMax: 0,
      available: true,
      visible: false,
      versionShow: false,
      focus: false,
      projectCount: 0, // 项目总数
      exportExcelShow: false,
      exportData: [],
      exportLoading: false,
      exportCountLoading: false,
      userInfo: [],
      sortVal: "DESC", // 项目默认排序\
      timeVal: [],
      actType: ["1"], //默认全部项目
      defaultTagKey: [],
      projecSort: false,
      proCount: 0,
      monthCount: 0,
      leftMenuShow: false, //
      userIdsArr: [],
      samllPro: {},
      samllSamllPro: {},
      contentWidth: "", //中间区域宽度
      projectNum: {
        all: 0, //全部项目
        participate: 0, //我参与的
        archive: 0, //已归档项目
        collect: 0, //我关注的
        responses: 0 // 我负责的
      },
      Version: false,
      countNum: 0,
      projecSortBBBBBBBBB: false
    };
  }

  componentWillMount() { back = 1; }

  componentDidMount() {
    const that = this;
    const actType = Storage.getLocal("actType");
    const sortShow = Storage.getLocal("permanentProject");
    this.getProTypeList();
    this.getCountNum();
    dingJS.authDingJsApi();
    if (getTeamInfoWithMoney("版本名称") === "免费版") { this.getLimtProject(); }
    this.clickGoBack();
    this.setState({ actType: actType ? actType : ["1"], projectListLoading: true, isIos: isIosSystem() });
    this.setState({ contentWidth: that.refs.projectTop.clientWidth, projecSort: sortShow, projecSortBBBBBBBBB: sortShow }, () => {
      if (this.state.projecSort) {
        this.screenChange(this.state.contentWidth - 256);
      } else {
        this.screenChange(this.state.contentWidth);
      }
    }
    );
    setTimeout(function () {
      if (Storage.get("user") && back === 1) {
        const rtype = Storage.getLocal("rtype");
        const sortVal = Storage.getLocal("sortVal");
        const Version1 = Storage.getLocal("Version");
        console.log("从后台数据获取");
        that.setState({ rtype: rtype ? rtype : "1", sortVal: sortVal ? sortVal : "DESC", Version: Version1 === null ? true : Version1 });
        that.getProList(rtype ? rtype : "1", 1, [], "", sortVal ? sortVal : "DESC", [], "");
      } else {
        console.log("从Redux中取值");
        const rtype = Storage.getLocal("rtype");
        that.setState(
          {
            projectList: that.props.listState.listData, projectListLoading: false, labelIds: that.props.listState.labelList,
            rtype: rtype ? rtype : "1", timeVal: that.props.listState.timeArr, actType: that.props.listState.actTypes,
            userInfo: that.props.listState.userArr, userIdsArr: that.props.listState.userArrIds, projecSort: that.props.listState.sortShows
          }, () => { that.refs.projectTop.scrollTop = that.props.listState.scrollTop; }
        );
      }
    }, 300);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    this.setState = (state, callback) => {
      return;
    };
  }
  clickGoBack = go => {
    window.addEventListener("popstate",
      function (ev) { back = back + 1; }, false);
  };
  btnChange = widthVel => {
    if (this.state.projecSort) {
      if (widthVel > 1376) {
        this.setState({ samllPro: { width: "25%" } });
      } else if (widthVel <= 1376 && widthVel > 644) {
        this.setState({ samllPro: { width: "33.33%" } });
      } else if (widthVel < 644 && widthVel > 344) {
        this.setState({ samllPro: { width: "50%" } });
      }
    } else {
      if (widthVel > 1756) {
        this.setState({ samllPro: { width: "25%" } });
      } else if (widthVel <= 1756 && widthVel > 1156) {
        this.setState({ samllPro: { width: "33.33%" } });
      } else if (widthVel < 1156 && widthVel > 556) {
        this.setState({ samllPro: { width: "50%" } });
      }
    }
  };
  screenChange(widthVel) {
    let that = this;
    if (widthVel > 1500) {
      this.setState({ samllPro: { width: "25%" } });
    } else if (widthVel <= 1500 && widthVel > 900) {
      this.setState({ samllPro: { width: "33.33%" } });
    } else if (widthVel < 900 && widthVel > 500) {
      this.setState({ samllPro: { width: "50%" } });
    }
    window.addEventListener("resize", function () {
      if (that.refs.projectTop && that.refs.projectTop.clientWidth && that.refs.projectTop.clientWidth > 1500) {
        that.setState({ samllPro: { width: "25%" } });
      } else if (that.refs.projectTop && that.refs.projectTop.clientWidth && that.refs.projectTop.clientWidth <= 1500 && that.refs.projectTop.clientWidth > 900) {
        that.setState({ samllPro: { width: "33.33%" } });
      } else if (that.refs.projectTop && that.refs.projectTop.clientWidth && that.refs.projectTop.clientWidth <= 900 && that.refs.projectTop.clientWidth > 500) {
        that.setState({ samllPro: { width: "50%" } });
      }
    });
  }
  //获取全部项目数/我参与的/我负责的/我关注的/已归档项目数
  getCountNum = () => {
    projectCount(data => {
      if (data.err) { return }
      if (data) { this.setState({ projectNum: data && data }) }
    });
  };
  // 获取项目分类
  getProTypeList() {
    getProjectTypeList(data => {
      if (data.err) {
        return false;
      }
      let defaultActiveKeys = [];
      data.labels && data.labels.map((item, i) => { defaultActiveKeys.push(item.id) });
      this.setState({ typeList: data.labels, defaultTagKey: defaultActiveKeys });
    });
  }
  //获取限制
  getLimtProject() {
    getLimtTask(data => {
      if (data.err) {
        return false;
      }
      this.setState({ available: data.success, projectMax: data.projectMax });
    });
  }

  //免费版任务限制
  freeTaskLimit() {
    const { available } = this.state;
    if (getTeamInfoWithMoney("版本名称") === "免费版") {
      this.getLimtProject();
      if (!available) {
        this.setState({ visible: true });
      }
    }
  }
  // 获取项目列表
  getProList(type, pageNo, labelIds, searchTxt = "", orderBy = "DESC", userid = [], time = []) {
    if (!type) {
      type = this.state.rtype;
    }
    if (!pageNo) {
      pageNo = 1;
    }
    if (!labelIds) {
      labelIds = this.state.labelIds ? this.state.labelIds : [];
    }
    if (!searchTxt) {
      searchTxt = this.state.searchTxt;
    } else if (searchTxt === "空") {
      searchTxt = "";
    }
    let times = [];
    if (time.length !== 0) {
      times[0] = moment(time[0]).format(monthFormat);
      times[1] = moment(time[1]).format(monthFormat);
    }
    if (pageNo === 1) {
      this.setState({ projectListLoading: true });
    } else {
      this.setState({ projectListMoreLoading: true });
    }

    this.setState({ projectListLoading: true });
    const labs =
      labelIds &&
      labelIds.map(item => {
        return item.id;
      });
    getProListByType(
      type,
      pageNo,
      data => {
        if (data.err) {
          this.setState({ projectListLoadingCount: "err" });
          this.setState({
            projectListLoading: false,
            projectListMoreLoading: false
          });

          if (pageNo > 1) {
            message.error(isLoadingErr());
          }
          return false;
        }

        if (data.pageNo === 1) {
          if (data.projects) {
            this.setState({
              projectList: data.projects,
              projectCount: data.count
            });
          }
        } else {
          let newProjectList = JSON.parse(
            JSON.stringify(this.state.projectList)
          );
          data.projects &&
            data.projects.map((item, i) => {
              const idLength = newProjectList.filter(val => val.id === item.id);
              if (idLength.length === 0) {
                newProjectList.push(item);
              }
            });
          this.setState({
            projectList: newProjectList,
            projectCount: data.count
          });
        }

        this.setState({
          projectListAllPage: data.last,
          projectListNowPage: data.pageNo,
          projectListLoading: false,
          projectListMoreLoading: false,
          proCount: data.count,
          monthCount: data.month
        });
        if (this.state.projectListLoadingCount === "err") {
          this.setState({ projectListLoadingCount: 0 });
        } else {
          this.setState({
            projectListLoadingCount: this.state.projectListLoadingCount + 1
          });
        }
      },
      30,
      labs,
      searchTxt,
      orderBy,
      userid,
      times
    );
  }

  scrollOnBottom(e) {
    const {
      rtype,
      labelIds,
      searchTxt,
      sortVal,
      userInfo,
      timeVal,
      userIdsArr
    } = this.state;
    const isOnButtom = listScroll(e);

    const { projectListAllPage, projectListNowPage } = this.state;
    if (isOnButtom && projectListNowPage < projectListAllPage) {
      this.setState({ projectListMoreLoading: true });
      this.getProList(
        rtype,
        projectListNowPage + 1,
        labelIds,
        searchTxt,
        sortVal,
        userIdsArr,
        timeVal
      );
    }
  }

  // 取消&关注
  attention(type, proId) {
    const {
      rtype,
      labelIds,
      searchTxt,
      sortVal,
      userInfo,
      timeVal,
      userIdsArr
    } = this.state;
    if (type === "1") {
      cancelAttentionWitchProject(proId, data => {
        if (data.err) {
          return false;
        }
        message.success("取消成功");
        this.getCountNum();

        this.getProList(
          rtype,
          1,
          labelIds,
          searchTxt,
          sortVal,
          userIdsArr,
          timeVal
        );
      });
    } else {
      addAttentionWitchProject(proId, data => {
        if (data.err) {
          return false;
        }
        message.success("关注成功");
        this.getCountNum();

        this.getProList(
          rtype,
          1,
          labelIds,
          searchTxt,
          sortVal,
          userIdsArr,
          timeVal
        );
      });
    }
  }

  onChange(e) {
    const {
      labelIds,
      searchTxt,
      sortVal,
      userInfo,
      timeVal,
      userIdsArr
    } = this.state;
    let rType = e.target.value;
    this.setState({ rtype: rType });
    this.getProList(
      rType,
      1,
      labelIds,
      searchTxt,
      sortVal,
      userIdsArr,
      timeVal
    );
  }

  // 回调刷新数据
  updateOk(val) {
    if (val === "刷新") {
      this.getProList();
      this.getCountNum();
    } else {
      const { projectList } = this.state;
      if (projectList && projectList.length > 0) {
        projectList &&
          projectList.map((item, index) => {
            if (item.id === val.id) {
              item.attstr04 = val.attstr04;
              item.proname = val.proname;
              if (val.tags) {
                const tags = [];
                val.tags.map(tag => {
                  tags.push({
                    id: tag.id,
                    labelname: tag.name,
                    color: tag.color
                  });
                });
                item.labelList = tags;
              }
              this.setState({ projectList: projectList });
            }
          });
      }
    }
  }

  exportExcel() {
    let { exportData, exportExcelShow, exportCountLoading } = this.state;
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
        {/* <Spin spinning={exportLoading} size="large"> */}
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
                          this.exportClick(item.startCount);
                        }}
                      >
                        导出任务
                        </Button>
                    </div>
                  </div>
                );
              })
              : ""}
          </div>
        </div>
        {/* </Spin> */}
      </Modal>
    );
  }
  exportClick(startCount) {
    let { projectId } = this.state;
    downLoadTaskTest(projectId, startCount, data => {
      this.setState({ exportExcelShow: false, exportCountLoading: false });
      message.success("导出文件将通过钉钉工作通知发送给您，请注意查收");
    });
  }
  getExportData() {
    let { projectId, taskDetailsId } = this.state;
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

  getNickNameByName(name) {
    let str = name.replace(/[^\u4e00-\u9fa5]/gi, "");
    let nickname = str.substr(str.length - 2);
    return nickname;
  }

  actType = act => {
    this.refs.projectTop.scrollTop = 0;
    const {
      labelIds,
      searchTxt,
      sortVal,
      userInfo,
      timeVal,
      userIdsArr
    } = this.state;

    Storage.setLocal("actType", [act]);
    Storage.setLocal("rtype", act);
    this.setState({ actType: [act], rtype: act });
    this.getProList(act, 1, labelIds, searchTxt, sortVal, userIdsArr, timeVal);
  };
  //显示右上内容
  contentChange = val => {
    const { proCount, monthCount } = this.state;
    if (val == "1") {
      return (
        <div className="topTypeName">
          <span className="nameType">全部项目</span>
        </div>
      );
    } else if (val == "2") {
      return (
        <div className="topTypeName">
          <span className="nameType">我参与的</span>
        </div>
      );
    } else if (val == "3") {
      return (
        <div className="topTypeName">
          <span className="nameType">我关注的</span>
        </div>
      );
    } else if (val == "4") {
      return (
        <div className="topTypeName">
          <span className="nameType">我负责的</span>
        </div>
      );
    } else if (val == "5") {
      return (
        <div className="topTypeName">
          <span className="nameType">已归档项目</span>
        </div>
      );
    }
  };
  // leftMenu是否显示
  headMenu = () => {
    const { leftMenuShow } = this.state;
    if (leftMenuShow) {
      this.setState({ leftMenuShow: false });
    } else {
      this.setState({ leftMenuShow: true });
    }
  };

  render() {
    const {
      projectList,
      projectListLoading,
      projectId,
      projectCreateShow,
      moneyEnd,
      rtype,
      searchTxt,
      projectListNowPage,
      projectListAllPage,
      typeList,
      labelIds,
      projectCount,
      exportExcelShow,
      userInfo,
      sortVal,
      focus,
      actType,
      projecSort,
      timeVal,
      leftMenuShow,
      userIdsArr,
      projectNum,
      Version,
      countNum,
      isIos,
      projecSortBBBBBBBBB
    } = this.state;
    let reg = /^https/;
    let reg2 = /^http/;
    let suffixDom = searchTxt ? (
      <i
        className="iconfont icon-clears"
        onClick={() => {
          this.setState({ searchTxt: "" });
          this.getProList(
            rtype,
            1,
            labelIds,
            "空",
            sortVal,
            userIdsArr,
            timeVal
          );
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
            menuShow={true}
            iconOnClickCallBack={() => {
              this.headMenu();
            }}
          />
          <Content className="project">
            {Version ? (
              <ProjectGuide
                projecSort={projecSort}
                projecSortChange={() => {
                  this.setState({ projecSort: true });
                }}
              />
            ) : (
                ""
              )}
            <ProjecSort
              projecSort={projecSort}
              projectCount={projectCount}
              setPermanent={BBBBBB => {
                this.setState({
                  projecSortBBBBBBBBB: BBBBBB
                });
              }}
              createDate={timeVal}
              userInfo={userInfo}
              sortVal={sortVal}
              typeList={typeList}
              labelIds={labelIds}
              countNum={projecSort ? 1 : countNum}
              // rtype={rtype}
              createDateChange={time => {
                this.setState({
                  timeVal: time
                });
              }}
              getProjectListCallBack={(sort, ids, time, labelArr) => {
                let idArr = [];
                ids &&
                  ids.map(item => {
                    idArr.push(item.userid);
                  });
                this.setState({
                  userInfo: ids,
                  sortVal: sort,
                  // timeVal: time,
                  userIdsArr: idArr,
                  labelIds: labelArr
                });
                this.getProList(
                  rtype,
                  1,
                  labelArr,
                  searchTxt,
                  sort,
                  idArr,
                  time
                );
              }}
            />
            {/* {exportExcelShow ? this.exportExcel() : ""} */}
            {exportExcelShow ? this.exportExcel() : ""}
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

            <div
              className={
                leftMenuShow ? "left-menu left-menu-fixed" : "left-menu "
              }
            >
              <Button
                size="large"
                type="primary"
                className="creatProject"
                onClick={e => this.setState({ projectCreateShow: "创建项目" })}
              >
                <i
                  className={
                    isIos
                      ? "iconfont icon-add2 creatAdd"
                      : "iconfont icon-add2 windowCreatAdd"
                  }
                />
                创建项目
              </Button>
              <div className="groupName">
                <Menu
                  defaultSelectedKeys={["1"]}
                  selectedKeys={actType}
                  openKeys={["1"]}
                  mode="inline"
                >
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.actType("1");
                    }}
                  >
                    <i className="iconfont icon-project" />
                    <span>全部项目</span>
                    <div className="num">{projectNum.all}</div>
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      this.actType("2");
                    }}
                  >
                    <i className="iconfont icon-users1" />
                    <span>我参与的</span>
                    <div className="num">{projectNum.participate}</div>
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    onClick={() => {
                      this.actType("4");
                    }}
                  >
                    <i className="iconfont icon-user" />
                    <span>我负责的</span>
                    <div className="num">{projectNum.responses}</div>
                  </Menu.Item>
                  <Menu.Item
                    key="3"
                    onClick={() => {
                      this.actType("3");
                    }}
                  >
                    <i className="iconfont icon-star" />
                    <span>我关注的</span>
                    <div className="num">{projectNum.collect}</div>
                  </Menu.Item>
                  <Menu.Item
                    key="5"
                    onClick={() => {
                      this.actType("5");
                    }}
                  >
                    <i className="iconfont icon-archive" />
                    <span>已归档项目</span>
                    <div className="num">{projectNum.archive}</div>
                  </Menu.Item>
                </Menu>
              </div>
            </div>
            <div className="project-main">
              <div
                className="top-box"
                onClick={e => {
                  e.stopPropagation();
                  if (projecSort && !projecSortBBBBBBBBB) {
                    this.setState({ projecSort: false });
                    this.btnChange(this.refs.projectTop.clientWidth);
                  }
                }}
              >
                <div>{this.contentChange(actType[0])}</div>
                <Input
                  className={
                    focus ? "longInput inputStyle" : "smallInput inputStyle"
                  }
                  prefix={
                    <i
                      className={
                        isIos
                          ? "iconfont icon-search"
                          : "iconfont icon-search windowIconSearch"
                      }
                    />
                  }
                  placeholder="项目搜索"
                  value={searchTxt}
                  suffix={suffixDom}
                  onFocus={() => {
                    this.setState({ focus: true });
                  }}
                  onBlur={() => {
                    this.setState({ focus: false });
                  }}
                  onChange={e => {
                    let searchTxt = e.target.value;
                    this.setState({ searchTxt: searchTxt });
                    if (searchTxt === "") {
                      this.getProList(
                        rtype,
                        1,
                        labelIds,
                        "",
                        sortVal,
                        userInfo.userid
                      );
                    }
                  }}
                  onPressEnter={e => {
                    this.getProList(
                      rtype,
                      1,
                      labelIds,
                      e.target.value,
                      sortVal,
                      userInfo.userid
                    );
                  }}
                />

                <Button
                  className="sortButton"
                  onClick={e => {
                    e.stopPropagation();
                    this.setState({
                      projecSort: !projecSort,
                      countNum: countNum + 1
                    });
                    this.btnChange(this.refs.projectTop.clientWidth);
                  }}
                >
                  <i className="icon iconfont icon-filter2 iconStyle" />
                  {timeVal.length > 0 ||
                    userInfo.length > 0 ||
                    labelIds.length > 0 ? (
                      <i className="iconfont icon-check1 haveSort" />
                    ) : (
                      ""
                    )}
                  筛选排序
                </Button>
              </div>
              <div
                className={
                  projecSort
                    ? "project-main-ct projectMainCt"
                    : "project-main-ct"
                }
                onScroll={e => {
                  this.scrollOnBottom(e);
                }}
                ref="projectTop"
              >
                <Spin spinning={projectListLoading} />
                <div className="project-card">
                  {projectCreateShow === "创建项目" ? (
                    <ProjectCreate
                      updateOkCallback={val => this.updateOk(val)}
                      closedCallBack={() => {
                        this.setState({ projectCreateShow: false });
                      }}
                      hidemore={true}
                    />
                  ) : (
                      ""
                    )}
                  {projectCreateShow === "编辑项目" ? (
                    <ProjectCreate
                      projectId={projectId}
                      updateOkCallback={val => this.updateOk(val)}
                      closedCallBack={() => {
                        this.setState({ projectCreateShow: false });
                      }}
                      getExportData={() => {
                        this.getExportData();
                      }}
                      moneyEnd={() => {
                        this.setState({ moneyEnd: true });
                      }}
                    />
                  ) : (
                      ""
                    )}

                  {projectList &&
                    projectList.length > 0 &&
                    projectList.map((item, i) => {
                      return (
                        <div
                          className="card"
                          key={item.id}
                          style={this.state.samllPro}
                        >
                          <div
                            className="item"
                            onClick={() => {
                              this.props.saveListState({
                                scrollTop: this.refs.projectTop.scrollTop,
                                listData: projectList,
                                labelList: labelIds,
                                // NowPage: projectListNowPage,
                                // AllPage: projectListAllPage,
                                sortShows: projecSort,
                                actTypes: actType,
                                timeArr: timeVal,
                                userArr: userInfo,
                                userArrIds: userIdsArr
                              });
                              Router.push("/pc_projectDetails?id=" + item.id);
                            }}
                          >
                            <div className="iBox">
                              {rtype === "5" ? (
                                ""
                              ) : item.collect === "1" ? (
                                <i
                                  className="attention iconfont icon-stared"
                                  onClick={e => {
                                    e.stopPropagation();
                                    this.attention(item.collect, item.id);
                                  }}
                                />
                              ) : (
                                    <i
                                      className="attention iconfont icon-star"
                                      onClick={e => {
                                        e.stopPropagation();
                                        this.attention(item.collect, item.id);
                                      }}
                                    />
                                  )}
                            </div>
                            <div className={rtype === "5" ? "iBoxss" : "iBoxs"}>
                              <i
                                className="setting iconfont icon-setting"
                                onClick={e => {
                                  e.stopPropagation();
                                  this.setState({
                                    projectCreateShow: "编辑项目",
                                    projectId: item.id
                                  });
                                }}
                              />
                            </div>
                            <div className="title">
                              {item.attstr04 ? (
                                reg.test(item.attstr04) ||
                                  reg2.test(item.attstr04) ? (
                                    <img
                                      src={item.attstr04}
                                      className="pro-icon"
                                      style={{ borderRadius: "50%" }}
                                    />
                                  ) : item.attstr04 === "#pro-myfg-1020" ? (
                                    <div className="nullIcon">
                                      <i
                                        className={
                                          isIos
                                            ? "iconfont icon-project "
                                            : "iconfont icon-project windowIconProject"
                                        }
                                      />
                                    </div>
                                  ) : (
                                      <svg className="pro-icon" aria-hidden="true">
                                        <use xlinkHref={item.attstr04} />
                                      </svg>
                                    )
                              ) : (
                                  <div className="nullIcon">
                                    <i
                                      className={
                                        isIos
                                          ? "iconfont icon-project "
                                          : "iconfont icon-project windowIconProject"
                                      }
                                    />
                                  </div>
                                )}
                              <div className="name textMore">
                                {item.proname}
                              </div>
                            </div>
                            <div className="labelBox">
                              {item.labelList && item.labelList.length > 0 ? (
                                <div className="labels textMore">
                                  {item.labelList.map((ite, i) => {
                                    return (
                                      <Tag
                                        key={ite.id}
                                        className={
                                          "textMore " +
                                          getTagColorByColorCode("1", ite.color)
                                        }
                                        // style={
                                        //   ite.labelname.length <= 3
                                        //     ? { width: 50 }
                                        //     : { width: 70 }
                                        // }
                                        style={{ minWidth: 64, maxWidth: 172 }}
                                      >
                                        {ite.labelname}
                                      </Tag>
                                    );
                                  })}
                                  {/* {item.labelList && item.labelList.length > 3 ? (
                                  <Icon type="ellipsis" />
                                ) : (
                                  ""
                                )} */}
                                </div>
                              ) : (
                                  <div className="labels">
                                    <Tag className="nullTag">未分类</Tag>
                                  </div>
                                )}
                            </div>

                            <div className="preNum">
                              <span className="per">
                                {item.child === 0
                                  ? ""
                                  : Math.round(
                                    (item.ywcCount / item.child) * 100
                                  ) + "%"}
                              </span>
                              <span className="Num">
                                {" (" + item.ywcCount + " / "}
                              </span>
                              <span> {item.child + ")"}</span>
                            </div>
                            <div className="cont">
                              <Progress
                                type="line"
                                percent={parseInt(
                                  (item.ywcCount / item.child) * 100
                                )}
                                width={65}
                                showInfo={false}
                                strokeColor={
                                  item.ywcCount / item.child === 1
                                    ? "#64B5F6"
                                    : "#A5d6A7"
                                }
                                status={
                                  item.ywcCount / item.child === 1
                                    ? "normal"
                                    : "active"
                                }
                              />
                            </div>
                            <div className="taskUser">
                              {item.yyqCount === 0 ? (
                                <div className="taskNums">没有逾期任务</div>
                              ) : (
                                  <div className="taskNum">
                                    {item.yyqCount}个逾期任务
                                </div>
                                )}
                              <div className="taskname">
                                {item.user && item.user.name}
                              </div>
                              {item.user && item.user.photo !== "" ? (
                                <img src={item.user && item.user.photo} />
                              ) : (
                                  <div className="noPhoto">
                                    {item.user && item.user.name.substr(0, 1)}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {projectList && projectList.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                      ""
                    )}
                </div>
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
  Project
);
