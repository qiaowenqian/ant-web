import React from "react";
import { Radio, Popconfirm } from "antd";
const RadioGroup = Radio.Group;
import stylesheet from "styles/components/project/personnelAreas/index.scss";
const PersonList = ["项目负责人", "项目管理员", "项目成员"];
import dingJS from "core/utils/dingJSApi";
import _ from "lodash";
import Storage from "../../../core/utils/storage";
/**
 * @param  projectCreateInfo{
 *
 * }
 * @description
 * @callback
 */
function isEqual(arr1, arr2) {
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
}
export default class PersonnelAreas extends React.Component {
  constructor(_props) {
    super();
    this.state = {
      projectCreateInfo: null,
      PopconfirmShow: false,
      loginUserid: ""
    };
  }
  componentWillMount() {
    if (this.props.projectCreateInfo) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo
      });
    }
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.projectCreateInfo &&
      !_.isEqual(this.props.projectCreateInfo, nextProps.projectCreateInfo)
    ) {
      this.setState({
        projectCreateInfo: nextProps.projectCreateInfo
      });
    }
  }

  onChange = e => {
    const { projectCreateInfo } = this.state;
    if (e.target.value == 0) {
      //选择了项目内成员，先判断用户的选择是不是默认值在做改变
      if (isEqual(projectCreateInfo.createPer, ["0"])) {
        projectCreateInfo.createPer = ["1", "2", "3"];
      }
      if (isEqual(projectCreateInfo.modifyPer, ["0"])) {
        projectCreateInfo.modifyPer = ["1", "2", "3"];
      }
      if (isEqual(projectCreateInfo.deletePer, ["1", "2"])) {
        projectCreateInfo.deletePer = ["1", "2"];
      }
    } else {
      //选择了全部成员先判断用户的选择是不是默认值在做改变
      if (isEqual(projectCreateInfo.createPer, ["1", "2", "3"])) {
        projectCreateInfo.createPer = ["0"];
      }
      if (isEqual(projectCreateInfo.modifyPer, ["1", "2", "3"])) {
        projectCreateInfo.modifyPer = ["0"];
      }
      if (isEqual(projectCreateInfo.deletePer, ["1", "2"])) {
        projectCreateInfo.deletePer = ["1", "2"];
      }
    }
    projectCreateInfo.opentype = e.target.value;

    this.setState({
      projectCreateInfo: projectCreateInfo
    });
    this.props.handleProjectInfoChange(projectCreateInfo);
  };
  selUser(type, title, multiple) {
    // 0成员 1管理员 2负责人 负责人单选
    title = "请选择" + title;
    let { projectCreateInfo } = this.state;
    let selectUsers = [];
    let oldSelectUserIds = [];
    projectCreateInfo.memberofpros.map((item, _i) => {
      if (item.rtype === type && item.delete != "1") {
        selectUsers.push(item.user);
        oldSelectUserIds.push(item.user.userid);
      }
    });
    console.log("本来选中的人:", selectUsers);
    const that = this;
    dingJS.selectUser(
      selectUsers,
      title,
      users => {
        if (users && users.length > 0) {
          if (type == "2") {
            let bb = true;
            projectCreateInfo.memberofpros.map((item, _i) => {
              if (item.rtype == "2") {
                if (item.user.userid != users[0].emplId) {
                  item.delete = "1";
                } else {
                  item.delete = 0;
                  bb = false;
                }
              }
            });
            if (bb) {
              projectCreateInfo.memberofpros.push({
                user: {
                  userid: users[0].emplId,
                  name: users[0].name,
                  photo: users[0].avatar
                },
                rtype: "2"
              });
            }
            that.setState({ projectCreateInfo: projectCreateInfo });
            that.props.handleProjectInfoChange(projectCreateInfo);
          } else {
            let selectUserIds = [];
            if (users && users.length > 0) {
              users.map(item => {
                selectUserIds.push(item.emplId);
                if (oldSelectUserIds.indexOf(item.emplId) === -1) {
                  projectCreateInfo.memberofpros.push({
                    user: {
                      userid: item.emplId,
                      name: item.name,
                      photo: item.avatar
                    },
                    rtype: type
                  });
                  console.log(item, "添加的user");
                } else {
                  projectCreateInfo.memberofpros.map(it => {
                    if (
                      it.userid == item.emplId &&
                      type == it.rtype &&
                      it.delete == "1"
                    ) {
                      it.delete = "";
                      console.log(it, "删除后添加的user");
                    }
                  });
                }
              });
            }
            console.log(selectUserIds, "selectUserIds");
            projectCreateInfo.memberofpros.map(item => {
              if (
                selectUserIds.indexOf(item.user.userid) == -1 &&
                type == item.rtype
              ) {
                item.delete = "1";
                console.log(item, "要删除的user");
              }
            });
            that.setState({ projectCreateInfo: projectCreateInfo });
            that.props.handleProjectInfoChange(projectCreateInfo);
          }
        }
      },
      multiple
    );
  }
  editDel(id, rtype) {
    let { projectCreateInfo } = this.state;
    // 管理员 rtype = 1 成员 rtype = 0 负责人 rtype = 2
    let arr = [];
    projectCreateInfo.memberofpros.map((item, _index) => {
      if (item.rtype !== rtype && item.delete !== "1") {
        arr.push(item.user.userid);
      }
    });
    if (arr.indexOf(id) === -1) {
      projectCreateInfo.memberofpros.map((item, _index, _arr) => {
        if (item.user.userid === id) {
          item.PopconfirmShow = true;
        }
      });
      this.setState({ projectCreateInfo: projectCreateInfo });
    } else {
      projectCreateInfo.memberofpros.map((item, _index, _arr) => {
        if (item.user.userid === id && item.rtype === rtype) {
          item.delete = "1";
          return false;
        }
      });
      this.setState({ projectCreateInfo: projectCreateInfo });
      this.props.handleProjectInfoChange(projectCreateInfo);
    }
  }
  //确认移除
  confirmRemove = (id, rtype, index) => {
    let { projectCreateInfo } = this.state;
    projectCreateInfo.memberofpros.map(item => {
      if (item.user.userid === id && item.rtype === rtype) {
        item.delete = "1";
        return false;
      }
    });
    this.setState({ projectCreateInfo: projectCreateInfo });
    this.props.handleProjectInfoChange(projectCreateInfo);
  };
  //取消移除
  cancelRemove = id => {
    let { projectCreateInfo } = this.state;
    projectCreateInfo.memberofpros.map(item => {
      if (item.id === id) {
        item.PopconfirmShow = false;
      }
    });
    this.setState({ projectCreateInfo: projectCreateInfo });
  };
  renderPersonCount() {
    const { projectCreateInfo, loginUserid } = this.state;

    let fuzerenCount = 0;
    let guanliyuanCount = 0;
    let memberCount = 0;
    projectCreateInfo &&
      projectCreateInfo.memberofpros &&
      projectCreateInfo.memberofpros.map(item => {
        if (!item.delete) {
          if (item.rtype == 2) {
            fuzerenCount++;
          } else if (item.rtype == 1) {
            guanliyuanCount++;
          } else if (item.rtype == 0) {
            memberCount++;
          }
        }
      });
    return {
      fuzerenCount: fuzerenCount,
      guanliyuanCount: guanliyuanCount,
      memberCount: memberCount
    };
  }
  render() {
    const { projectCreateInfo, PopconfirmShow, loginUserid } = this.state;
    return (
      <div className="personnelAreas">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <section>
          <div className="top_title">
            <span>可见范围</span>
          </div>
          <div className="top_content">
            <RadioGroup
              onChange={this.onChange}
              value={projectCreateInfo.opentype}
              disabled={!projectCreateInfo.jurisdiction}
            >
              <Radio
                value={"1"}
                checked={projectCreateInfo.opentype == "1" ? true : false}
              >
                团队所有人
              </Radio>
              <Radio
                value={"0"}
                checked={projectCreateInfo.opentype == "0" ? true : false}
              >
                仅以下人员可见
              </Radio>
            </RadioGroup>
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>
              {PersonList[0]}
              <font>（{this.renderPersonCount().fuzerenCount}）</font>
            </span>
          </div>
          <div className="top_content">
            <div className="top_content_person_box">
              {projectCreateInfo.jurisdiction ? (
                <div
                  className="top_content_left"
                  style={{ marginTop: "6px", marginRight: "8px" }}
                >
                  <i
                    className="iconfont icon-add1"
                    style={{
                      fontSize: 21,
                      color: "#bdbdbd"
                    }}
                    onClick={() => {
                      if (projectCreateInfo.jurisdiction) {
                        this.selUser("2", "负责人", false);
                      }
                    }}
                  />
                </div>
              ) : (
                ""
              )}

              <div className="top_content_right">
                {projectCreateInfo.memberofpros.map(item => {
                  if (item.rtype === "2" && item.delete !== "1") {
                    return (
                      <div
                        className="person_item_box"
                        key={item.user.userid + "fzr"}
                      >
                        {item.user ? (
                          item.user.photo ? (
                            <img className="personIcon" src={item.user.photo} />
                          ) : (
                            <div className="personIcon">
                              {item.user &&
                                item.user.name &&
                                item.user.name.substr(0, 1)}
                            </div>
                          )
                        ) : (
                          ""
                        )}

                        <span className="person_name textMore">
                          {item.user.name}
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>
              {PersonList[1]}
              <font>（{this.renderPersonCount().guanliyuanCount}）</font>
            </span>
          </div>
          <div className="top_content">
            <div className="top_content_person_box">
              {projectCreateInfo.jurisdiction ? (
                <div
                  className="top_content_left"
                  style={{ marginTop: "6px", marginRight: "8px" }}
                >
                  <i
                    className="iconfont icon-add1"
                    style={{
                      fontSize: 21,
                      color: "#bdbdbd"
                    }}
                    onClick={() => {
                      if (projectCreateInfo.jurisdiction) {
                        this.selUser("1", "管理员", true);
                      }
                    }}
                  />
                </div>
              ) : (
                ""
              )}

              <div className="top_content_right">
                {projectCreateInfo.memberofpros.map((item, index) => {
                  if (item.rtype === "1" && item.delete !== "1") {
                    return (
                      <Popconfirm
                        title={
                          item.user.id === Storage.get("user").id
                            ? "移除后将不可见该项目及项目内所有任务"
                            : `移除后“${
                                item.user.name
                              }”将不可见该项目及项目内所有任务`
                        }
                        visible={
                          item.PopconfirmShow &&
                          item.PopconfirmShow &&
                          projectCreateInfo.opentype === "0"
                        }
                        onConfirm={() => {
                          this.confirmRemove(
                            item.user.userid,
                            item.rtype,
                            index
                          );
                        }}
                        onCancel={() => {
                          this.cancelRemove(item.id);
                        }}
                        okText={"移除"}
                        cancelText={"取消"}
                      >
                        <div
                          className={`person_item_box ${
                            projectCreateInfo.jurisdiction
                              ? "person_candelete"
                              : ""
                          }`}
                          key={item.user.userid + "fzr"}
                          style={{ position: "relative" }}
                        >
                          {item.user ? (
                            item.user.photo ? (
                              <img
                                className="personIcon"
                                src={item.user.photo}
                              />
                            ) : (
                              <div className="personIcon">
                                {item.user &&
                                  item.user.name &&
                                  item.user.name.substr(0, 1)}
                              </div>
                            )
                          ) : (
                            ""
                          )}
                          <span className="person_name textMore">
                            {item.user.name}
                          </span>
                          {projectCreateInfo.jurisdiction && (
                            <a
                              className="labelCen"
                              onClick={() => {
                                if (projectCreateInfo.opentype === "0") {
                                  this.editDel(item.user.userid, item.rtype);
                                } else {
                                  this.confirmRemove(
                                    item.user.userid,
                                    item.rtype
                                  );
                                }
                              }}
                            >
                              移除人员
                            </a>
                          )}
                        </div>
                      </Popconfirm>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>
              {PersonList[2]}
              <font>（{this.renderPersonCount().memberCount}）</font>
            </span>
          </div>
          <div className="top_content">
            <div className="top_content_person_box">
              {projectCreateInfo.jurisdiction ? (
                <div
                  className="top_content_left"
                  style={{ marginTop: "6px", marginRight: "8px" }}
                >
                  <i
                    className="iconfont icon-add1"
                    style={{
                      fontSize: 21,
                      color: "#bdbdbd"
                    }}
                    onClick={() => {
                      if (projectCreateInfo.jurisdiction) {
                        this.selUser("0", "成员", true);
                      }
                    }}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="top_content_right">
                {projectCreateInfo.memberofpros.map(item => {
                  if (item.rtype === "0" && item.delete !== "1") {
                    return (
                      <Popconfirm
                        title={
                          item.user.id === Storage.get("user").id
                            ? "移除后将不可见该项目及项目内所有任务"
                            : `移除后“${
                                item.user.name
                              }”将不可见该项目及项目内所有任务`
                        }
                        visible={
                          item.PopconfirmShow &&
                          item.PopconfirmShow &&
                          projectCreateInfo.opentype === "0"
                        }
                        onConfirm={() => {
                          this.confirmRemove(item.user.userid, item.rtype);
                        }}
                        onCancel={() => {
                          this.cancelRemove(item.id);
                        }}
                        okText={"移除"}
                        cancelText={"取消"}
                      >
                        <div
                          className={`person_item_box ${
                            projectCreateInfo.jurisdiction
                              ? "person_candelete"
                              : ""
                          }`}
                          key={item.user.userid + "cy"}
                          style={{ position: "relative" }}
                        >
                          {item.user ? (
                            item.user.photo ? (
                              <img
                                className="personIcon"
                                src={item.user.photo}
                              />
                            ) : (
                              <div className="personIcon">
                                {item.user &&
                                  item.user.name &&
                                  item.user.name.substr(0, 1)}
                              </div>
                            )
                          ) : (
                            ""
                          )}
                          <span className="person_name textMore">
                            {item.user.name}
                          </span>
                          {projectCreateInfo.jurisdiction && (
                            <a
                              className="labelCen"
                              onClick={() => {
                                if (projectCreateInfo.opentype === "0") {
                                  this.editDel(item.user.userid, item.rtype);
                                } else {
                                  this.confirmRemove(
                                    item.user.userid,
                                    item.rtype
                                  );
                                }
                              }}
                            >
                              移除人员
                            </a>
                          )}
                        </div>
                      </Popconfirm>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
