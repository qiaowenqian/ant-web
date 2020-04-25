import React from "react";
import {
  Layout,
  Dropdown,
  Icon,
  Menu,
  Button,
  Popover,
  Modal,
  message,
  Drawer
} from "antd";
import Router from "next/router";
import NProgress from "nprogress";

import stylesheet from "styles/components/header.scss";
import Message from "../components/message";
import TaskCreate from "../components/taskCreate";
import { getMessageCount } from "../core/service/message.service";
import { getLimtTask } from "../core/service/task.service";
import Storage from "../core/utils/storage";
import Feedback from "./feedback";
import TagManage from "./tagManage";
import TagManageTask from "./common/tagManageTask";
import OnTrial from "./OnTrial";
import Authorization from "../components/setting/authorization";
import Recycle from "../components/setting/recycle";
import StrategyModal from "../components/setting/strategy";

import { getTeamInfoWithMoney, isIosSystem } from "../core/utils/util";
import VersionUpdate from "../components/versionUpdate";
import VersionUpgrades from "../components/versionUpgrades";
import VersionUpOther from "../components/versionUpOther";
import VersionRecycle from "../components/versionRecycle";
import VersionsortGif from "./versionSort";

import VersionCycle from "./versionCycle";
import VersionCycleRule from "./versionCycleRule";

import VersionFile from "./versionFile";
import HttpClient from "../core/api/HttpClient";
Router.onRouteChangeStart = url => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const { Header } = Layout;

/*
 * （选填）menuShow：false         // 顶部菜单小图标是否显示
 * （选填）menuClickCallBack(val)  // 点击对应菜单的回调
 * （选填）iconOnClickCallBack()   // 点击顶部小图标的回调
 */

export default class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      act: "/home",
      menuShow: false,
      messageShow: false,
      createShow: false,
      messageCount: 0,
      user: {},
      isAysc: "",
      feedShow: false, //意见反馈弹框是否显示
      projectManage: false, //项目分类管理是否显示
      publicManage: false,
      personManage: false,

      teamMoneyEnd: false,
      versionAlert: false,
      versionUpdateShow: false,
      taskMax: 0,
      available: true,
      demo: false,
      visible: false,
      versionShow: false,
      authoriShow: false,
      settingGif: false,
      sortGif: false,
      VersionFileGif: false,
      recycleGif: false,
      recycleshow: false,
      strategy: false, //计划策略
      isIos: true,

      cycle: false,
      cycleRule: false,
      OnTrialModel: false, //基础版用户再次试用
      noMoreShow: false
    };
  }

  componentWillMount() {
    this.getMsgCount();

    const user = Storage.get("user");
    this.setState({ user: user });
  }

  componentDidMount() {
    const { user } = this.state;
    if (
      user &&
      user.antIsvCorpSuite.probation &&
      sessionStorage.getItem("OnTrialModel") !== "1"
    ) {
      this.setState({ OnTrialModel: true });
    }
    const lastVersionNum = Storage.getLocal("lastVersionNum");
    const currentVer = HttpClient.getVersion();
    const noMoreShow = Storage.getLocal("noMoreShow");
    this.setState({ isIos: isIosSystem(), noMoreShow: noMoreShow });
    if (lastVersionNum === null || lastVersionNum != currentVer) {
      this.setState({ versionUpdateShow: true });
      Storage.setLocal("lastVersionNum", currentVer);
    } else {
      this.setState({ versionUpdateShow: false });
    }
    if (getTeamInfoWithMoney("版本名称") === "免费版") {
      this.getLimt();
    }
    const that = this;
    window.addEventListener("resize", e => {
      if (document.documentElement.clientWidth > 1250) {
        that.setState({ menuShow: false });
      }
    });

    this.menuAct();
  }

  componentWillReceiveProps() {
    this.menuAct();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getLimt() {
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
  menuAct() {
    const url = Router.router.pathname;
    this.setState({ act: url });
  }

  getMsgCount() {
    getMessageCount(res => {
      if (res.err) {
        return false;
      }
      this.setState({
        messageCount: res.messageCount,
        isAysc: res.tiem ? res.tiem.isAdmin : ""
      });
    });
  }

  menuSwitch() {
    const { act } = this.state;
    if (act.indexOf("/pc_task") !== -1) {
      // if (this.state.menuShow) {
      //   this.setState({ menuShow: false });
      // } else {
      //   this.setState({ menuShow: true });
      // }
      this.props.iconOnClickCallBack();
    } else if (act.indexOf("/pc_projectDetails") !== -1) {
      this.props.iconOnClickCallBack();
    } else if (act.indexOf("/pc_dynamicNew") !== -1) {
      this.props.iconOnClickCallBack();
    } else if (act.indexOf("/pc_census") !== -1) {
      this.props.iconOnClickCallBack();
    } else if (act.indexOf("/pc_project") !== -1) {
      this.props.iconOnClickCallBack();
    }
  }
  demoShowTest(e) {
    this.setState({ demo: e });
  }
  settingGif(e) {
    this.setState({ settingGif: e });
  }
  sortGif(e) {
    this.setState({ sortGif: e });
  }
  cycle(e) {
    this.setState({ cycle: e });
  }
  cycleRule(e) {
    this.setState({ cycleRule: e });
  }
  recycleGif(e) {
    this.setState({ recycleGif: e });
  }
  VersionFile(e) {
    this.setState({ VersionFileGif: e });
  }
  render() {
    const {
      visible,
      versionShow,
      demo,
      act,
      messageShow,
      user,
      createShow,
      messageCount,
      feedShow,
      projectManage,
      publicManage,
      versionAlert,
      isAysc,
      versionUpdateShow,
      teamMoneyEnd,
      authoriShow,
      settingGif,
      sortGif,
      recycleGif,
      recycleshow,
      VersionFileGif,
      isIos,
      strategy,
      cycle,
      cycleRule,
      OnTrialModel,
      noMoreShow
    } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              this.setState({ authoriShow: true });
            }}
          >
            <i className="iconfont icon-authority" />
            授权信息
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              this.setState({ projectManage: true });
            }}
          >
            <i className="iconfont icon-label1" />
            项目分类管理
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              this.setState({ publicManage: true });
            }}
          >
            <i className="iconfont icon-label" />
            任务标签管理
          </a>
        </Menu.Item>

        <Menu.Item>
          <a
            onClick={() => {
              this.setState({ recycleshow: true });
            }}
          >
            <i className="iconfont icon-recycle" />
            回收站
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              this.setState({ strategy: true });
            }}
          >
            <i className="iconfont icon-icon_zidonghua_huabanfuben" />
            自动化规则
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              this.setState({ versionUpdateShow: true });
            }}
          >
            <i className="iconfont icon-2" />
            版本说明
          </a>
        </Menu.Item>
        {/* <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              Router.push("/pc_guide");
            }}
          >
            <i className="iconfont icon-touchhandgesture" />
            功能引导
          </a>
        </Menu.Item> */}
        <Menu.Item>
          <a
            className="Acenter"
            onClick={() => {
              this.setState({ feedShow: true });
            }}
          >
            <i className="iconfont icon-mail" />
            联系服务商
          </a>
        </Menu.Item>
      </Menu>
    );
    let { selectKey } = this.props;
    if (selectKey === "") {
      selectKey = "all";
    }
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Header>
          {versionUpdateShow ? (
            <VersionUpdate
              demoShowTest={demo => this.demoShowTest(demo)}
              settingGif={settingGif => this.settingGif(settingGif)}
              sortGif={sortGif => this.sortGif(sortGif)}
              cycle={cycle => this.cycle(cycle)}
              cycleRule={cycleRule => this.cycleRule(cycleRule)}
              VersionFile={VersionFileGif => this.VersionFile(VersionFileGif)}
              recycleGif={recycleGif => this.recycleGif(recycleGif)}
              versionUpdateShow={versionUpdateShow}
              closeCallBack={() => {
                this.setState({ versionUpdateShow: false });
              }}
            />
          ) : (
            ""
          )}
          {recycleshow ? (
            <Recycle
              closedCallBack={() => {
                this.setState({ recycleshow: false });
              }}
            />
          ) : (
            ""
          )}
          {demo ? (
            <VersionUpgrades
              closeCallBack={() => {
                this.setState({ demo: false });
              }}
            />
          ) : (
            ""
          )}
          {settingGif ? (
            <VersionUpOther
              closeCallBack={() => {
                this.setState({ settingGif: false });
              }}
            />
          ) : (
            ""
          )}
          {recycleGif ? (
            <VersionRecycle
              closeCallBack={() => {
                this.setState({ recycleGif: false });
              }}
            />
          ) : (
            ""
          )}
          {sortGif ? (
            <VersionsortGif
              closeCallBack={() => {
                this.setState({ sortGif: false });
              }}
            />
          ) : (
            ""
          )}
          {cycle ? (
            <VersionCycle
              closeCallBack={() => {
                this.setState({ cycle: false });
              }}
            />
          ) : (
            ""
          )}
          {cycleRule ? (
            <VersionCycleRule
              closeCallBack={() => {
                this.setState({ cycleRule: false });
              }}
            />
          ) : (
            ""
          )}
          {VersionFileGif ? (
            <VersionFile
              closeCallBack={() => {
                this.setState({ VersionFileGif: false });
              }}
            />
          ) : (
            ""
          )}
          {createShow ? (
            <TaskCreate
              closedCallBack={() => {
                this.setState({ createShow: false });
              }}
            />
          ) : (
            ""
          )}
          {OnTrialModel && isAysc === "1" && (
            <OnTrial
              closeCallBack={() => {
                this.setState({ OnTrialModel: false });
              }}
              setUser={users => {
                this.setState({ user: users });
              }}
            />
          )}
          <Drawer
            title=""
            placement="top"
            className="drawerShow"
            closable={true}
            destroyOnClose={true}
            height={99 + "%"}
            zIndex={102}
            onClose={() => {
              this.setState({ strategy: false });
            }}
            visible={strategy}
          >
            <StrategyModal
              closedCallBack={() => {
                this.setState({ strategy: false });
              }}
            />
          </Drawer>
          <Modal
            visible={visible}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            footer={null}
            width={versionShow ? 850 : 520}
            closable={!versionShow}
            mask={true}
            className="limitModel"
            maskClosable={false}
            wrapClassName="limitModel"
            style={versionShow ? {} : { top: 260, height: "400px" }}
          >
            {versionShow ? (
              <div className="imgBox">
                {/* <p>基础版&专业版功能对比</p> */}
                <Icon
                  type="close"
                  onClick={() => {
                    this.setState({ versionShow: false });
                  }}
                />
                <div className="img">
                  <img src="../static/react-static/pcvip/imgs/versionTable229.png?t=2.1" />
                </div>
              </div>
            ) : (
              ""
            )}
            <div
              className="writeBox"
              style={versionShow ? { display: "none" } : {}}
            >
              <p>
                <span className="limitMesg">用量信息</span>
                <span
                  onClick={() => {
                    this.setState({ versionShow: true });
                  }}
                  className="versionMeg"
                >
                  版本介绍
                </span>
              </p>
              <div className="myBorder" />
              <div className="text">
                <p>
                  您正在使用的是<b> 蚂蚁分工免费版</b>，免费版每月可创建
                  <b> 200 </b>条任务，本月任务用量已达版本上限。
                </p>
                <p>
                  如您的团队项目和任务数量较多，可升级为经济实惠的
                  <b> 蚂蚁分工基础版</b>
                  ，基础版不限使用人数、不限项目数量、不限任务数量。
                </p>
                <p>
                  我们更建议您升级到功能强大的<b> 蚂蚁分工专业版</b>
                  ，专业版具有批量任务操作、甘特图、多维度数据统计图表等专业功能，助您提高协同工作效率、提升项目管理水平。
                </p>
              </div>
              <div className="renew">
                <Popover
                  content={
                    <div>
                      {getTeamInfoWithMoney("是否钉钉订单") ? (
                        <div>
                          <img
                            src="../static/react-static/pcvip/imgs/ewmDing.png"
                            style={{
                              width: "200px",
                              height: "230px",
                              margin: "10px 0px 0 10px"
                            }}
                          />
                          <img
                            src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                            style={{
                              width: "200px",
                              height: "230px",
                              margin: "10px 10px 0 40px"
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                          style={{
                            width: "200px",
                            height: "230px",
                            margin: "10px 10px 0px 10px"
                          }}
                        />
                      )}
                    </div>
                  }
                  placement="top"
                  trigger="click"
                >
                  <Button
                    type="primary"
                    style={{ marginRight: "20px", height: "30px" }}
                  >
                    升级专业版
                  </Button>
                </Popover>
                <Popover
                  content={
                    <div>
                      {getTeamInfoWithMoney("是否钉钉订单") ? (
                        <div>
                          <img
                            src="../static/react-static/pcvip/imgs/ewmDing.png"
                            style={{
                              width: "200px",
                              height: "230px",
                              margin: "10px 0px 0 10px"
                            }}
                          />
                          <img
                            src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                            style={{
                              width: "200px",
                              height: "230px",
                              margin: "10px 10px 0 40px"
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                          style={{
                            width: "200px",
                            height: "230px",
                            margin: "10px 10px 0px 10px"
                          }}
                        />
                      )}
                    </div>
                  }
                  placement="top"
                  trigger="click"
                >
                  <Button type="primary" style={{ height: "30px" }}>
                    升级基础版
                  </Button>
                </Popover>
              </div>
            </div>
          </Modal>
          <div
            className="headerBox"
            onClick={() => {
              if (this.props.closeRule) {
                this.props.closeRule();
              }
            }}
          >
            <div className="headerLeft">
              {user &&
              user.antIsvCorpSuite.corpid ===
                "dinga8f7deb1c55b020c35c2f4657eb6378f" ? (
                <div>
                  {act.indexOf("/pc_task") !== -1 ||
                  act.indexOf("/pc_projectDetails") !== -1 ||
                  act.indexOf("/pc_dynamicNew") !== -1 ||
                  act.indexOf("/pc_census") !== -1 ||
                  act.indexOf("/pc_project") !== -1 ? (
                    <Icon
                      type="menu-unfold"
                      className="barIcon"
                      onClick={() => {
                        this.menuSwitch();
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div className="lyTitle">
                    <div className="title">
                      <div className="imgBox">
                        <img src="../static/react-static/pcvip/imgs/shihua.jpg" />
                      </div>
                      <span>炼油分部穿透式管理平台</span>
                    </div>
                    <div className="enName">Management Platform</div>
                  </div>
                </div>
              ) : (
                <div>
                  {act.indexOf("/pc_task") !== -1 ||
                  act.indexOf("/pc_projectDetails") !== -1 ||
                  act.indexOf("/pc_dynamicNew") !== -1 ||
                  act.indexOf("/pc_census") !== -1 ||
                  act.indexOf("/pc_project") !== -1 ? (
                    <Icon
                      type="menu-unfold"
                      className="barIcon"
                      onClick={() => {
                        this.menuSwitch();
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div className="ant-dropdown-link">
                    <div className="title">
                      蚂蚁分工
                      <span
                        className="spanicon"
                        style={
                          getTeamInfoWithMoney("版本名称") === "免费版"
                            ? {
                                top:
                                  getTeamInfoWithMoney("版本名称") ===
                                    "试用版" ||
                                  (getTeamInfoWithMoney("版本名称") !==
                                    "试用版" &&
                                    getTeamInfoWithMoney("剩余天数") < 16 &&
                                    getTeamInfoWithMoney("版本名称") !==
                                      "免费版")
                                    ? "-2px"
                                    : "8px"
                              }
                            : getTeamInfoWithMoney("版本名称") === "专业版"
                            ? {
                                top:
                                  getTeamInfoWithMoney("版本名称") ===
                                    "试用版" ||
                                  (getTeamInfoWithMoney("版本名称") !==
                                    "试用版" &&
                                    getTeamInfoWithMoney("剩余天数") < 16 &&
                                    getTeamInfoWithMoney("版本名称") !==
                                      "免费版")
                                    ? "-2px"
                                    : "8px"
                              }
                            : getTeamInfoWithMoney("版本名称") === "基础版"
                            ? {
                                top:
                                  getTeamInfoWithMoney("版本名称") ===
                                    "试用版" ||
                                  (getTeamInfoWithMoney("版本名称") !==
                                    "试用版" &&
                                    getTeamInfoWithMoney("剩余天数") < 16 &&
                                    getTeamInfoWithMoney("版本名称") !==
                                      "免费版")
                                    ? "-2px"
                                    : "8px"
                              }
                            : getTeamInfoWithMoney("版本名称") === "试用版" ||
                              getTeamInfoWithMoney("版本名称") === ""
                            ? {
                                top:
                                  getTeamInfoWithMoney("版本名称") ===
                                    "试用版" ||
                                  (getTeamInfoWithMoney("版本名称") !==
                                    "试用版" &&
                                    getTeamInfoWithMoney("剩余天数") < 16 &&
                                    getTeamInfoWithMoney("版本名称") !==
                                      "免费版")
                                    ? "-2px"
                                    : "8px"
                              }
                            : {}
                        }
                      >
                        {getTeamInfoWithMoney("版本名称") === "免费版" ? (
                          <div>
                            <span
                              className={
                                isIos
                                  ? "titleImg freeTitle"
                                  : "titleImg freeTitles"
                              }
                            >
                              <i className="iconfont icon-star1" />
                            </span>
                            <p className="free">免费版</p>
                          </div>
                        ) : getTeamInfoWithMoney("版本名称") === "专业版" ? (
                          <div>
                            <span className={isIos ? "titleImg" : "titleImgs"}>
                              <i className="iconfont icon-diamond" />
                            </span>
                            <p>专业版</p>
                          </div>
                        ) : getTeamInfoWithMoney("版本名称") === "基础版" ? (
                          <div>
                            <span
                              className={
                                isIos
                                  ? "titleImg bascTitle"
                                  : "titleImg bascTitles"
                              }
                            >
                              <i className="iconfont icon-triangle" />
                            </span>
                            <p className="basc">基础版</p>
                          </div>
                        ) : getTeamInfoWithMoney("版本名称") === "试用版" ||
                          getTeamInfoWithMoney("版本名称") === "" ? (
                          <div>
                            <span
                              className={
                                isIos ? "titleImg text" : "titleImg text"
                              }
                            >
                              试
                            </span>
                            <p>专业版</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </span>
                      {getTeamInfoWithMoney("版本名称") === "试用版" ||
                      (getTeamInfoWithMoney("版本名称") !== "试用版" &&
                        getTeamInfoWithMoney("剩余天数") < 16 &&
                        getTeamInfoWithMoney("版本名称") !== "免费版") ? (
                        <div className="p">
                          剩余&nbsp;
                          <span>
                            {getTeamInfoWithMoney("剩余天数") < 0
                              ? 0
                              : getTeamInfoWithMoney("剩余天数")}
                          </span>
                          &nbsp;天
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="headerCenter">
              <ul className="header-menu">
                <li
                  className={act.indexOf("/pc_task") !== -1 ? "act" : ""}
                  onClick={() => {
                    Router.push("/pc_task");
                  }}
                >
                  任务
                </li>
                <li
                  className={act.indexOf("/pc_project") !== -1 ? "act" : ""}
                  onClick={() => {
                    Router.push("/pc_project");
                  }}
                >
                  项目
                </li>
                <li
                  className={
                    act.indexOf("/pc_census") !== -1 ||
                    act.indexOf("/pc_basic_statistics") !== -1
                      ? "act"
                      : ""
                  }
                  onClick={() => {
                    if (
                      getTeamInfoWithMoney("版本名称") === "免费版" ||
                      getTeamInfoWithMoney("版本名称") === "基础版"
                    ) {
                      Router.push("/pc_basic_statistics");
                    } else {
                      isAysc === "1" ||
                      getTeamInfoWithMoney("版本名称") === "试用版" ||
                      getTeamInfoWithMoney("版本名称") === ""
                        ? Router.push("/pc_census")
                        : message.warning("跨项目统计功能仅团队管理员可用", 2);
                    }
                  }}
                >
                  {getTeamInfoWithMoney("版本名称") === "免费版" ||
                  getTeamInfoWithMoney("版本名称") === "基础版" ||
                  getTeamInfoWithMoney("版本名称") === "" ||
                  getTeamInfoWithMoney("版本名称") === "试用版" ? (
                    <span
                      style={{ position: "absolute", top: -3, marginLeft: -20 }}
                    >
                      <svg className="pro-icon zuanshi" aria-hidden="true">
                        <use xlinkHref={"#pro-myfg-zuanshi"} />
                      </svg>
                    </span>
                  ) : (
                    ""
                  )}
                  统计
                </li>
                <li
                  className={act.indexOf("/pc_dynamicNew") !== -1 ? "act" : ""}
                  onClick={() => {
                    Router.push("/pc_dynamicNew");
                  }}
                >
                  动态
                </li>
              </ul>
            </div>
            <div className="headerRight">
              {getTeamInfoWithMoney("版本名称") === "基础版" &&
              user &&
              user.antIsvCorpSuite.probation &&
              isAysc === "1" ? (
                <div
                  className="ribbon"
                  onClick={() => {
                    this.setState({ OnTrialModel: true });
                  }}
                >
                  <div className="inset">
                    活<br />动
                  </div>
                  <div className="container">
                    <div className="left_corner" />
                    <div className="right_corner" />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div style={{ minWidth: 230 }}>
                <div
                  className="setup"
                  onClick={() => {
                    this.setState({ messageShow: true });
                  }}
                >
                  <span>通知({messageCount > 100 ? "99+" : messageCount})</span>
                </div>
                <div className="setup">
                  <span>
                    <a
                      href="https://www.yuque.com/klulz8"
                      style={{ color: "#fff" }}
                      target="_blank"
                    >
                      帮助
                    </a>
                  </span>
                </div>
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  placement="topCenter"
                >
                  <div className="setup">
                    <span>设置</span>
                  </div>
                </Dropdown>
                <div className="menu_down">
                  {user.photo ? (
                    <img className="img" src={user.photo} />
                  ) : (
                    <div className="user">{user.nickname}</div>
                  )}
                </div>
              </div>
            </div>
            {messageShow ? (
              <Message
                closeCallBack={() => {
                  this.setState({ messageShow: false });
                }}
                messageCountOnChange={val => {
                  this.setState({ messageCount: val });
                }}
              />
            ) : (
              ""
            )}
            {feedShow ? (
              <Feedback
                feedbackShow={feedShow}
                closeCallBack={() => {
                  this.setState({ feedShow: false });
                }}
              />
            ) : (
              ""
            )}
            {projectManage ? (
              <TagManage
                type="3"
                title="项目标签管理"
                closedCallBack={() => {
                  this.setState({ projectManage: false });
                }}
                canEdit={isAysc}
              />
            ) : (
              ""
            )}
            {publicManage ? (
              <TagManageTask
                type="2"
                title="任务标签管理"
                canEdit={isAysc}
                closedCallBack={() => {
                  this.setState({ publicManage: false });
                }}
              />
            ) : (
              ""
            )}
            {authoriShow ? (
              <Authorization
                closedCallBack={() => {
                  this.setState({ authoriShow: false });
                }}
              />
            ) : (
              ""
            )}
          </div>
        </Header>
      </div>
    );
  }
}
