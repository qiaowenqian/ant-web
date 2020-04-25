import React from "react";
import { Tabs, Radio, DatePicker, Tag, Tooltip } from "antd";
import stylesheet from "styles/components/projectSort.scss";
import dingJS from "../core/utils/dingJSApi";
import Storage from "../core/utils/storage";
import moment from "moment";

import { getTagColorByColorCode } from "../core/utils/util";
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

export default class ProjectSort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: ["month", "month"],
      permanent: false //       常驻显示true 取消常驻 false
    };
  }
  componentDidMount = () => {
    const permanentBool = Storage.getLocal("permanentProject");
    if (permanentBool) {
      this.setState({ permanent: true });
    } else {
      this.setState({ permanent: false });
    }
  };
  componentWillReceiveProps = nextProps => {};
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getNickNameByName = name => {
    // let str = name.replace(/[^\u4e00-\u9fa5]/gi, "");
    let nickname = name.substr(0, 1);
    return nickname;
  };
  //项目负责人筛选
  deleteUser = (arr, i) => {
    let { labelIds, sortVal, time } = this.props;
    arr.map((item, index) => {
      if (index === i) arr.splice(i, 1);
    });
    this.props.getProjectListCallBack(sortVal, arr, time, labelIds);
  };
  //选人
  selUser = title => {
    let { userInfo, sortVal, time, labelIds } = this.props;
    const that = this;
    let selectId = [];
    userInfo.map(item => {
      selectId.push(item.id);
    });
    dingJS.selectUser(
      [],
      "请选择" + title,
      data => {
        console.log("钉钉返回的人" + data);
        if (!data) {
          return false;
        }
        let responsibles = userInfo;
        data &&
          data.map(item => {
            responsibles.push({
              name: item.name,
              photo: item.avatar,
              userid: item.emplId
            });
          });
        if (title === "负责人") {
          that.props.getProjectListCallBack(
            sortVal,
            this.reduceArr(responsibles),
            time,
            labelIds
          );
        }
      },
      true,
      false,
      5
    );
  };
  //数组去重方法
  reduceArr = arr => {
    let hash = {};
    const newArr = arr.reduce((item, next) => {
      hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
      return item;
    }, []);
    return newArr;
  };
  //筛选
  sortProject = e => {
    const { userInfo, createDate, labelIds } = this.props;
    Storage.setLocal("sortVal", e.target.value);
    this.props.getProjectListCallBack(
      e.target.value,
      userInfo,
      createDate,
      labelIds
    );
  };

  selectingTag = (id, color, name) => {
    let { labelIds, sortVal, userInfo, createDate } = this.props;
    const length = labelIds.filter(val => val.id === id).length;
    if (length === 0) {
      labelIds.push({
        id: id,
        color: color,
        name: name,
        type: "2"
      });
    } else {
      let newLabels = [];
      labelIds &&
        labelIds.map((val, i) => {
          if (val.id !== id) {
            newLabels.push(val);
          }
        });
      labelIds = newLabels;
    }
    this.props.getProjectListCallBack(sortVal, userInfo, createDate, labelIds);
  };

  handlePanelChange = (value, mode) => {
    this.props.createDateChange(value);
    this.setState({
      mode: [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1]
      ]
    });
  };
  createDateChange = value => {
    let { labelIds, sortVal, userInfo } = this.props;
    this.props.getProjectListCallBack(sortVal, userInfo, value, labelIds);
  };
  render() {
    const {
      userInfo,
      sortVal,
      createDate,
      typeList,
      labelIds,
      projectCount,
      projecSort,
      countNum
    } = this.props;
    const { mode, permanent } = this.state;

    return (
      <div
        className={
          countNum === 0
            ? "ProjecSortNone"
            : projecSort
            ? "projectSortDrawer animated_03s fadeInRightBig "
            : "projectSortDrawer fadeInRightBigOut animated_Out"
        }
        ref="ReactDomReng"
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Tooltip
          placement="topRight"
          title={permanent ? "取消常驻" : "常驻显示"}
        >
          {permanent ? (
            <i
              className="iconfont icon-pin sortShow"
              onClick={() => {
                Storage.setLocal("permanentProject", false);
                this.setState({ permanent: false });
                this.props.setPermanent(false);
              }}
            />
          ) : (
            <i
              className="iconfont icon-pin sortNoShow"
              onClick={() => {
                Storage.setLocal("permanentProject", true);
                this.setState({ permanent: true });
                this.props.setPermanent(true);
              }}
            />
          )}
        </Tooltip>

        <Tabs defaultActiveKey="1">
          <TabPane tab="筛选" key="1">
            <div className="selectType">
              <div className="selectTitle">
                负责人
                {userInfo && userInfo.length !== 0 ? (
                  <i
                    className="iconfont icon-add2 "
                    onClick={() => {
                      this.selUser("负责人");
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              {userInfo && userInfo.length !== 0 ? (
                userInfo.map((item, i) => {
                  return (
                    <div className="userBox">
                      <div className="userSel">
                        <div className="userName">
                          {item.photo !== "" ? (
                            <img src={item.photo} />
                          ) : (
                            <div className="noPhoto">
                              {this.getNickNameByName(item.name)}
                            </div>
                          )}
                        </div>
                        <div className="nickName">
                          {item.name && item.name.slice(0, 3)}
                        </div>
                        <div
                          className="userCen"
                          onClick={() => {
                            this.deleteUser(userInfo, i);
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
                  不限
                </div>
              )}
            </div>
            <div className="creatTime">
              <span className="selectTitle">创建时间</span>
              <div className="creatTimeBox">
                <RangePicker
                  placeholder={["不限", ""]}
                  format="YYYY-MM"
                  value={createDate}
                  mode={mode}
                  separator=""
                  dropdownClassName="myrangepicker"
                  getCalendarContainer={() => {
                    return this.refs.ReactDomReng;
                  }}
                  onChange={value => {
                    // this.setState({ value });
                    this.props.createDateChange(value);
                    this.props.getProjectListCallBack(
                      sortVal,
                      userInfo,
                      value,
                      labelIds
                    );
                  }}
                  showTime
                  onOk={this.createDateChange}
                  onPanelChange={this.handlePanelChange}
                />
              </div>
            </div>
            <div className="scorlTag scrollbar">
              {typeList &&
                typeList.map((item, i) => {
                  if (item.parentList && item.parentList.length > 0) {
                    return (
                      <div className="project-filter-item" key={item.id}>
                        <div className="title textMore">
                          <div
                            className={
                              "yuandian " +
                              getTagColorByColorCode("2", item.color)
                            }
                          />
                          {item.labelname}
                        </div>
                        {item.parentList && item.parentList.length > 0 ? (
                          <div className="ct">
                            {item.parentList.map(val => {
                              return (
                                <Tag
                                  key={val.id}
                                  className={
                                    "textMore " +
                                    (labelIds.filter(v => v.id === val.id)
                                      .length > 0
                                      ? getTagColorByColorCode("1", item.color)
                                      : "tagNull")
                                  }
                                  onClick={() => {
                                    this.selectingTag(
                                      val.id,
                                      item.color,
                                      val.labelname
                                    );
                                  }}
                                >
                                  {val.labelname}
                                </Tag>
                              );
                            })}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  }
                })}
            </div>
          </TabPane>
          <TabPane tab="排序" key="2">
            <RadioGroup
              className="sort"
              onChange={this.sortProject}
              value={sortVal}
            >
              <Radio value={"DESC"}>按创建时间最晚</Radio>
              <Radio value={"ASC"}>按创建时间最早</Radio>
              <Radio value={"name"}>按项目名称A-Z</Radio>
            </RadioGroup>
          </TabPane>
        </Tabs>

        <div className="sortBottom">
          {createDate.length > 0 ||
          userInfo.length > 0 ||
          labelIds.length > 0 ? (
            <span
              onClick={() => {
                this.props.getProjectListCallBack(sortVal, [], [], []);
                this.props.createDateChange([]);
              }}
              className="clearAll"
            >
              清除筛选
            </span>
          ) : (
            ""
          )}
          <span className="totals">共{projectCount}个项目</span>
        </div>
      </div>
    );
  }
}
