import stylesheet from "../../../styles/components/task/discuss/index.scss";
import React from "react";
import { Icon, Tooltip, Timeline, Popover, message, Popconfirm } from "antd";
import _ from "lodash";
import moment from "moment";
import Storage from "../../../core/utils/storage.js";
import dingJS from "../../../core/utils/dingJSApi";
import {
  arrItemSort,
  createFileIcon,
  isIosSystem
} from "../../../core/utils/util.js";
import {
  deleteTalkById,
  attentionUsers
} from "../../../core/service/task.service";
let atRegRuler = /\!\#\$(\@([\u4E00-\u9FA5A-Za-z0-9\S]+)\$\#\$([\u4E00-\u9FA5A-Za-z0-9]+))\$\#\:/gi;
export default class Discuss extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLog: 1, //是否显示日志
      leaveList: [], //日志列表
      collectList: [], //关注人列表
      taskInfo: null, //数据信息
      user: {}, //登陆人信息
      newTalkReplyUserId: "", //新建讨论人
      newTalkDesc: "", //讨论描述
      newTalkFiles: [], //讨论文件
      newTalkPromptTxt: "请输入讨论内容", //讨论内容
      uploadList_talk: [],
      suggestions: [],
      showAiteList: false,
      state: false,
      butDisabled: false, //提交按钮拦截
      taskCompletFiles: [], //上传完成的附件列表
      limitAttention: false, // 限制关注人数目
      limitArr: [], // 关注人列表
      resLength: 0,
      joinProject: false
    };
  }
  componentWillMount() {
    if (this.props && this.props.taskInfo) {
      this.setState({
        taskInfo: this.props.taskInfo,
        leaveList: this.props.taskInfo.talk,
        collectList: this.props.taskInfo.collectList
      });
    }
  }
  componentDidMount() {
    let user = Storage.get("user");
    this.setState({ isIos: isIosSystem(), user: user });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.taskInfo) {
      this.setState({
        taskInfo: nextProps.taskInfo,
        leaveList: nextProps.taskInfo.talk,
        collectList: nextProps.taskInfo.collectList,
        showLog: 1
      });
    }
  }
  writeContent(item) {
    this.props.writeContent(item);
  }
  renderTopSection(itemObj) {
    const { user } = this.state;
    if (itemObj.type == "1") {
      let descriptionx = "";
      //判断是不是新详情之前的历史数据
      if (itemObj.operationType) {
        //操作说明 如果是新的数据格式，当显示文件之前先判断用没有文件，没有则显示，有则不显示
        descriptionx = itemObj.operationType ? itemObj.operationType : "";
      } else {
        descriptionx =
          itemObj.description &&
          itemObj.description
            .split("\n")
            .join("&nbsp;")
            .split("/r")
            .join("<br>");
      }

      return (
        <div className="topSection">
          <span className="nickName" style={{ fontSize: "12px" }}>
            {itemObj.createBy.name}
          </span>
          <span
            className="stateDesc margin_left_8 textMore"
            style={{ fontSize: "12px" }}
            dangerouslySetInnerHTML={{ __html: descriptionx }}
          />
        </div>
      );
    } else {
      return (
        <div className="topSection">
          <span
            className="nickName"
            onClick={() => {
              this.writeContent(itemObj);
            }}
          >
            {itemObj.createBy.name}
          </span>
          {user.id !== itemObj.createBy.id ? (
            <span
              className="aite margin_left_8 pointer"
              style={{ height: "20px" }}
              onClick={() => {
                this.writeContent(itemObj);
              }}
            >
              @
            </span>
          ) : (
              ""
            )}
          {user.id === itemObj.createBy.id ? (
            <Popconfirm
              title="是否要删除这条讨论？"
              onConfirm={() => {
                this.deleteTalk(itemObj.id);
              }}
              okText="删除"
              cancelText="取消"
            >
              <i className="iconfont icon-icon_huabanfuben5 margin_left_16 pointer deletehover" />
            </Popconfirm>
          ) : (
              ""
            )}
        </div>
      );
    }
  }
  deleteTalk(id) {
    const { taskInfo } = this.state;
    const that = this;
    deleteTalkById(
      id,
      data => {
        if (data && data.err) {
          return false;
        }
        message.success("删除成功！");
        that.props.getTaskDetail(taskInfo.id, taskInfo.project.id);
      },
      that.props.isSmall
    );
  }
  renderMarkSection(itemObj) {
    const itemPlus =
      itemObj.description &&
      itemObj.description
        .split("\n")
        .join("&nbsp;")
        .split("/r")
        .join("<br>");
    let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|%)+)/g;
    let itemPlus2 =
      itemObj.description &&
      itemObj.description
        .replace(
          atRegRuler,
          "<span className='markLeft' style='color: rgba(255, 167, 38, 1);font - size: 14px;text - align: left;'>@" +
          "$2" +
          "</span>"
        )
        .split("\n")
        .join("<br>")
        .replace(reg, "<a href='$1$2' target='_Blank'>$1$2</a>")
        .replace(/\n/g, "<br />");

    return itemObj.type != "1" ? (
      itemObj.reply && itemObj.reply.id ? (
        <div className="markSection">
          <div className="markInfo">
            <span className="markLeft" style={{ display: "inline-block" }}>
              @{itemObj.reply.name}
            </span>
            <span
              className="markDesc"
              dangerouslySetInnerHTML={{ __html: itemPlus }}
              style={{ display: "inline-block" }}
            />
          </div>
        </div>
      ) : (
          itemPlus2 && (
            <div className="markSection">
              <div className="markInfo">
                <div
                  className="markDesc"
                  style={{ lineHeight: "18px" }}
                  dangerouslySetInnerHTML={{ __html: itemPlus2 }}
                />
              </div>
            </div>
          )
        )
    ) : (
        ""
      );
  }
  renderFileSection(itemObj) {
    return (
      itemObj.files &&
      itemObj.files.length > 0 && (
        <div className="fileSection">
          {itemObj.files.map(item => {
            return (
              <div
                className="fileItem"
                key={item.id}
                onClick={() => {
                  dingJS.previewImage(item);
                }}
              >
                {createFileIcon(item.fileType)}
                <div
                  className="fileInfo pointer textMore"
                  style={{ display: "inline-block" }}
                >
                  {item.fileName}
                </div>
              </div>
            );
          })}
        </div>
      )
    );
  }
  //渲染日志
  renderCenterSection(itemObj) {
    const { showLog } = this.state;
    let color = "#BDBDBD";
    if (itemObj.type == "1") {
      //日志
      let descriptionx = "";
      if (itemObj.operationType) {
        //如果有历史值
        if (itemObj.now) {
          //判断有没有现在的值
          if (itemObj.now && itemObj.now.indexOf("00:00") > -1) {
            itemObj.now = moment(itemObj.now).format("YYYY-MM-DD");
          }
          descriptionx = itemObj.now;
        }

        if (itemObj.original != undefined && itemObj.original != "") {
          if (itemObj.original && itemObj.original.indexOf("23:59:59") > -1) {
            itemObj.original = moment(itemObj.original).format("YYYY-MM-DD");
          }
          descriptionx = `从 ${
            itemObj.original ? itemObj.original : ""
            } 修改为 ${itemObj.now ? itemObj.now : ""} `;
        }
        if (itemObj.fileName) {
          if (!itemObj.files || (itemObj.files && itemObj.files.length <= 0)) {
            descriptionx = descriptionx + itemObj.fileName;
          }
        }
        if (
          itemObj.operationType.indexOf("确认了任务") > -1 ||
          itemObj.operationType.indexOf("驳回了任务") > -1 ||
          itemObj.operationType.indexOf("标记完成了任务") > -1
        ) {
          color = "#000";
        }
        let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|%)+)/g;
        descriptionx =
          descriptionx &&
          descriptionx
            .split("\n")
            .join("<br />")
            .replace(
              reg,
              "<a href='$1$2' target='_Blank' style='font-size:14px'>$1$2</a>"
            )
            .replace(/\n/g, "<br />");
      }

      return (
        descriptionx && (
          <div className="centerSection">
            <div
              className="infomation"
              style={{ fontSize: "12px", color: color, lineHeight: "14px" }}
              dangerouslySetInnerHTML={{ __html: descriptionx }}
            />
          </div>
        )
      );
    } else {
      return "";
    }
  }
  openUserInfoPage(userid) {
    const { user } = this.state;
    dingJS.GetUserDetailInfoPage(
      userid,
      user.antIsvCorpSuite.corpid,
      function () {
        console.log("opensucees");
      },
      function (err) {
        console.log(err);
      }
    );
  }
  iconStyleAndColor(typeinfo) {
    let styleObj = {
      style: {
        fontSize: "12px",
        lineHeight: "22px",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#bdbdbd"
      },
      className: "iconfont icon-edit iconfont24"
    };
    if (!typeinfo) {
      return styleObj;
    } else {
      if (typeinfo && typeinfo.indexOf("创建了任务") > -1) {
        styleObj = {
          style: {
            fontSize: "12px",
            lineHeight: "22px",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(255,171,145)"
          },
          className: "iconfont icon-add2 iconfont24"
        };
      } else if (typeinfo && typeinfo.indexOf("确认了任务") > -1) {
        styleObj = {
          style: {
            fontSize: "12px",
            lineHeight: "22px",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(120,144,156)"
          },
          className: "iconfont icon-double-check iconfont24"
        };
      } else if (typeinfo && typeinfo.indexOf("标记完成了任务") > -1) {
        styleObj = {
          style: {
            fontSize: "12px",
            lineHeight: "22px",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(120,144,156)"
          },
          className: "iconfont icon-check iconfont24"
        };
      }
      return styleObj;
    }
  }
  renderDot(itemObj) {
    const { isIos } = this.state;
    if (itemObj.type != "1") {
      return itemObj.createBy.photo ? (
        <img
          src={itemObj.createBy.photo}
          style={{
            fontSize: "30px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer"
          }}
          onClick={() => {
            this.openUserInfoPage(itemObj.createBy.userid);
          }}
        />
      ) : (
          <div
            style={{
              fontSize: "14px",
              lineHeight: "30px",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "inline-block",
              cursor: "pointer",
              background: "#ef9a9a",
              color: "#fff",
              fontSize: "12px",
              borderRadius: "50%",
              textAlign: "center"
            }}
            onClick={() => {
              this.openUserInfoPage(itemObj.createBy.userid);
            }}
          >
            {itemObj.createBy.name && itemObj.createBy.name.substr(0, 1)}
          </div>
        );
    } else {
      return (
        <div style={this.iconStyleAndColor(itemObj.operationType).style}>
          <i
            className={this.iconStyleAndColor(itemObj.operationType).className}
            style={{
              height: "22px",
              fontSize: "12px",
              display: "inline-block",
              color: "#fff",
              marginTop: isIos ? "" : "3px"
            }}
          />
        </div>
      );
    }
  }
  renderEachLeave(itemObj, indexnum) {
    const { showLog } = this.state;
    if (
      !showLog &&
      itemObj.type == "1" &&
      !(
        itemObj.operationType &&
        (itemObj.operationType.indexOf("确认了任务") > -1 ||
          itemObj.operationType.indexOf("驳回了任务") > -1 ||
          itemObj.operationType.indexOf("标记完成了任务") > -1)
      )
    ) {
      return "";
    } else {
      return (
        <div
          className="discussMain"
          onClick={e => {
            e.stopPropagation();
          }}
          key={indexnum}
        >
          <div className="timeLineList">
            <Timeline.Item dot={this.renderDot(itemObj)}>
              {/* 左侧时间 */}
              <div className="timeLeft" style={{ top: "3px" }}>
                <div className="time pointer">
                  {moment(itemObj.createDate).format("HH:mm")}
                </div>
                <div className="date pointer">
                  {moment(itemObj.createDate).format("MM/DD")}
                </div>
              </div>
              <div className="timeRight">
                {/* 内容头部 */}
                {this.renderTopSection(itemObj)}
                {/* 内容回复 renderMarkSection 渲染的都是讨论形式的顶部*/}

                {this.renderMarkSection(itemObj)}
                {/* 内容描述  渲染的都是日志和讨论的部分*/}
                {this.renderCenterSection(itemObj)}
                {/* 成果文件 */}
                {this.renderFileSection(itemObj)}
              </div>
            </Timeline.Item>
          </div>
        </div>
      );
    }
  }
  renderTimeLine() {
    const { leaveList } = this.state;
    return (
      <Timeline style={{ margin: "12px 0 0 0" }}>
        {leaveList &&
          arrItemSort(leaveList, "createDate", 1, 1).map((itemObj, index) => {
            return this.renderEachLeave(itemObj, index);
          })}
      </Timeline>
    );
  }

  renderHead() {
    const {
      showLog,
      collectList,
      taskInfo,
      isIos,
      limitAttention,
      limitArr,
      joinProject,
      resLength
    } = this.state;
    let newList = [];
    let AllList = [];
    if (collectList) {
      newList = _.cloneDeep(collectList);
    }

    if (taskInfo.qrr && taskInfo.qrr.name) {
      newList.splice(0, 0, taskInfo.qrr);
    }
    // if (taskInfo.zpf) {
    //   newList.splice(0, 0, taskInfo.zpf);
    // }

    if (taskInfo.fzr && taskInfo.fzr.name) {
      newList.splice(0, 0, taskInfo.fzr);
    }
    if (taskInfo.cjr && taskInfo.cjr.name) {
      newList.splice(0, 0, taskInfo.cjr);
    }

    let objinit = {};
    let newArr = [];
    newList.map((item, i) => {
      if (!objinit[newList[i].id] && objinit[newList[i].name] !== item.name) {
        //如果能查找到，证明数组元素重复了
        objinit[newList[i].id] = 1;
        newArr.push(newList[i]);
      }
    });
    if (newArr && newArr.length > 12) {
      AllList = _.cloneDeep(newArr);
      newArr.splice(12);
    }

    // let objinit = {};
    // let newArr = [];
    // newList.map((item, i) => {
    //   if (!objinit[newList[i].id] && objinit[newList[i].name] !== item.name) {
    //     //如果能查找到，证明数组元素重复了
    //     objinit[newList[i].id] = 1;
    //     newArr.push(newList[i]);
    //   }
    // });
    return (
      <div
        className="discussHead"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="userlist">
          {/* {this.renderAttention()} */}
          {newArr &&
            newArr.map((item, index) => {
              let topindex = index + 1;
              let leftIndex = 20 * index + "px";
              return (
                <Tooltip placement="top" title={item.name} key={item.id}>
                  {item.photo ? (
                    <Popover
                      content={this.renderAttention()}
                      title={null}
                      placement="topRight"
                      trigger="click"
                    >
                      <img
                        className="useritem pointer"
                        alt={item.name}
                        src={item.photo}
                        style={{ index: topindex, left: leftIndex }}
                      />
                    </Popover>
                  ) : (
                      <Popover
                        content={this.renderAttention()}
                        title={null}
                        placement="topRight"
                        trigger="click"
                      >
                        <div
                          className="useritem2 pointer"
                          style={{
                            index: topindex,
                            left: leftIndex,
                            fontSize: "12px",
                            textAlign: "center"
                          }}
                        >
                          {item.name && item.name.substr(0, 1)}
                        </div>
                      </Popover>
                    )}
                </Tooltip>
              );
            })}
          {AllList && AllList.length > 12 && (
            <Tooltip placement="top" title={AllList && AllList.length + "人"}>
              <Popover
                content={this.renderAttention()}
                title={null}
                placement="topRight"
                trigger="click"
              >
                <div
                  className="number_mask useritem pointer"
                  style={{
                    left: "245px"
                  }}
                >
                  <Icon type="ellipsis" />
                </div>
              </Popover>
            </Tooltip>
          )}
          {this.props.taskInfo.isMember ? (
            <Tooltip placement="top" title={"添加关注人"}>
              <Popconfirm
                title={
                  joinProject
                    ? "是否将刚刚添加的关注人加入项目成员？"
                    : `您刚刚选择了${resLength}个人，是否要全部添加为关注人？`
                }
                visible={limitAttention || joinProject}
                onConfirm={() => {
                  if (joinProject) {
                    this.confirmPopconfirmSecond();
                  } else {
                    this.confirmPopconfirm();
                  }
                }}
                onCancel={() => {
                  if (joinProject) {
                    this.canclePopconfirmSecond();
                  } else {
                    this.setState({ limitAttention: false });
                  }
                }}
                okText={joinProject ? "加入" : "添加"}
                cancelText={joinProject ? "不加入" : "取消"}
              >
                <i
                  className="useritem-add useritem pointer icon-add1 iconfont"
                  style={{
                    fontSize: 24,
                    top: isIos ? "" : "6px",
                    color: "#bdbdbd",
                    left:
                      AllList && AllList.length > 12
                        ? "270px"
                        : newArr && newArr.length > 0
                          ? newArr.length * 20 + 5 + "px"
                          : 0
                  }}
                  onClick={() => {
                    this.addAttention();
                  }}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
              ""
            )}
        </div>
        <div
          className="righttxt"
          onClick={e => {
            // this.changeLogShow();
            e.stopPropagation();
            this.setState({ showLog: !showLog });
          }}
        >
          {showLog ? "隐藏日志" : "显示日志"}
        </div>
      </div>
    );
  }
  renderAttention() {
    const { taskInfo, user } = this.state;

    return (
      <div className="attentionBox">
        {taskInfo.cjr && taskInfo.cjr.name && (
          <div className="attentionItem">
            <div className="attentionLeft">创建人</div>
            <div className="attentionRight">
              <Tooltip
                placement="top"
                title={taskInfo.cjr && taskInfo.cjr.name}
              >
                <div
                  className="person_item_box person_candelete"
                  // key={item.user.userid + "csy"}
                  style={{ position: "relative" }}
                >
                  {taskInfo.cjr && taskInfo.cjr.photo ? (
                    <img
                      className="personIcon"
                      src={taskInfo.cjr && taskInfo.cjr.photo}
                    />
                  ) : (
                      <div className="personIcon">
                        {taskInfo.cjr &&
                          taskInfo.cjr.name &&
                          taskInfo.cjr.name.substr(0, 1)}
                      </div>
                    )}
                  <span className="person_name textMore">
                    {taskInfo.cjr && taskInfo.cjr.name}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
        )}
        {taskInfo.fzr && taskInfo.fzr.name && (
          <div className="attentionItem">
            <div className="attentionLeft">负责人</div>
            <div className="attentionRight">
              <Tooltip
                placement="top"
                title={taskInfo.fzr && taskInfo.fzr.name}
              >
                <div
                  className="person_item_box person_candelete"
                  style={{ position: "relative" }}
                >
                  {taskInfo.fzr && taskInfo.fzr.photo ? (
                    <img
                      className="personIcon"
                      src={taskInfo.fzr && taskInfo.fzr.photo}
                    />
                  ) : (
                      <div className="personIcon">
                        {taskInfo.fzr &&
                          taskInfo.fzr.name &&
                          taskInfo.fzr.name.substr(0, 1)}
                      </div>
                    )}
                  <span className="person_name textMore">
                    {taskInfo.fzr && taskInfo.fzr.name}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
        )}
        {taskInfo.qrr && taskInfo.qrr.name && (
          <div className="attentionItem">
            <div className="attentionLeft">确认人</div>
            <div className="attentionRight">
              <Tooltip
                placement="top"
                title={taskInfo.qrr && taskInfo.qrr.name}
              >
                <div
                  className="person_item_box person_candelete"
                  style={{ position: "relative" }}
                >
                  {taskInfo.qrr && taskInfo.qrr.photo ? (
                    <img
                      className="personIcon"
                      src={taskInfo.qrr && taskInfo.qrr.photo}
                    />
                  ) : (
                      <div className="personIcon">
                        {taskInfo.qrr &&
                          taskInfo.qrr.name &&
                          taskInfo.qrr.name.substr(0, 1)}
                      </div>
                    )}
                  <span className="person_name textMore">
                    {taskInfo.qrr && taskInfo.qrr.name}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
        )}

        {taskInfo.collectListAll && taskInfo.collectListAll.length > 0 && (
          <div className="attentionItem">
            <div className="attentionLeft">关注人</div>
            <div className="attentionRight">
              {taskInfo.collectListAll &&
                taskInfo.collectListAll.map((item, index) => {
                  return (
                    <Tooltip placement="top" title={item.user.name && item.user.name} key={index}>
                      <div
                        className="person_item_box person_candelete"
                        key={item.user && item.user.id + "gzr"}
                        style={{ position: "relative" }}
                      >
                        {item.user && item.user.photo ? (
                          <img className="personIcon" src={item.user.photo} />
                        ) : (
                            <div className="personIcon">
                              {item.user.name && item.user.name.substr(0, 1)}
                            </div>
                          )}
                        <span className="person_name textMore">
                          {item.user.name}
                        </span>
                        {item.user.id == user.id ||
                          user.id == item.createBy.id ? (
                            <a
                              className="labelCen"
                              onClick={() => {
                                this.updateCollectUsers(item.user.id);
                              }}
                            >
                              移除人员
                          </a>
                          ) : (
                            ""
                          )}
                      </div>
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }
  addAttention() {
    const { taskInfo } = this.state;
    let selectUser = taskInfo.collectList ? taskInfo.collectList : [];
    dingJS.selectUser(
      [],
      "邀请关注",
      res => {
        if (res) {
          let selected = [];
          selectUser.map(item => {
            selected.push(item.userid);
          });
          res.map(item => {
            selected.push(item.emplId);
          });
          console.log(selected, "关注人ids");
          console.log(res, "这是res");

          if (res && res.length > 20) {
            this.setState({
              limitAttention: true,
              limitArr: selected,
              resLength: res.length
            });
          } else {
            if (this.props.taskInfo.isManager) {
              this.setState({
                joinProject: true,
                limitArr: selected,
                resLength: res.length
              });
            } else {
              attentionUsers(
                taskInfo.id,
                selected,
                false,
                data => {
                  if (data.err) {
                    return false;
                  }
                  message.success("设置关注人成功！");
                  this.props.SetTaskCollect(data);
                },
                this.props.isSmall
              );
            }
          }
        }
      },
      true,
      this.props.isSmall
    );
  }
  LimitAttentiom = () => {
    const { taskInfo, limitArr } = this.state;
    attentionUsers(
      taskInfo.id,
      limitArr,
      data => {
        if (data.err) {
          return false;
        }
        message.success("设置关注人成功！");
        this.props.SetTaskCollect(data);
      },
      this.props.isSmall
    );
  };

  confirmPopconfirm = () => {
    const { taskInfo, limitArr, joinProject } = this.state;
    if (this.props.taskInfo.isManager) {
      this.setState({ joinProject: true, limitAttention: false });
    } else {
      attentionUsers(taskInfo.id, limitArr, false, data => {
        if (data.err) {
          return false;
        }
        if (data) {
          this.setState({ limitAttention: false });
          message.success("设置关注人成功！");
          this.props.SetTaskCollect(data);
        }
      });
    }
  };
  //加入项目成员
  confirmPopconfirmSecond = () => {
    const { taskInfo, limitArr, joinProject } = this.state;
    attentionUsers(taskInfo.id, limitArr, joinProject, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        this.setState({ joinProject: false });
        message.success("设置关注人成功！");
        this.props.SetTaskCollect(data);
      }
    });
  };
  //不加入项目成员
  canclePopconfirmSecond = () => {
    const { taskInfo, limitArr } = this.state;
    attentionUsers(taskInfo.id, limitArr, false, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        this.setState({ joinProject: false });
        message.success("设置关注人成功！");
        this.props.SetTaskCollect(data);
      }
    });
  };
  updateCollectUsers(id) {
    const { taskInfo } = this.state;
    const userids = [];

    taskInfo.collectList.map((item, i) => {
      if (item.id !== id) {
        userids.push(item.userid);
      }
    });
    attentionUsers(
      taskInfo.id,
      userids,
      false,
      data => {
        if (data.err) {
          return false;
        }
        message.success("删除关注人成功！");
        this.props.getTaskDetail(taskInfo.id, taskInfo.project.id);
      },
      this.props.isSmall
    );
  }
  render() {
    return (
      <div className="myfg_discuss" onClick={e => e.stopPropagation()}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {this.renderHead()}
        {this.renderTimeLine()}
      </div>
    );
  }
}
