import React from "react";
import stylesheet from "styles/components/project/moreSetting/copyProject.scss";
import { copyProject } from "../../../core/service/project.service";
import dingJS from "../../../core/utils/dingJSApi";

import { Modal, Button, Input, message } from "antd";

export default class copyProjectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      projectName: "",
      textWarning: false,
      maxlength: 50,
      currentLength: 0,
      copyButton: false
    };
  }
  componentDidMount = () => {
    let projectCharge = this.props.copyProject.projectCreateInfo.memberofpros;
    let projectName = this.props.copyProject.projectCreateInfo.proname;
    if (projectCharge && projectCharge.length > 0) {
      projectCharge =
        projectCharge && projectCharge.filter(val => val.rtype == "2");
    }
    this.setState({
      userInfo: projectCharge && projectCharge[0].user,
      projectName: projectName
    });
  };
  getNickNameByName = name => {
    let str = name.replace(/[^\u4e00-\u9fa5]/gi, "");
    let nickname = str.substr(0, 1);
    return nickname;
  };
  changeProjectName = name => {
    if (name.length >= 40) {
      this.setState({
        currentLength: name.length,
        textWarning: true,
        copyButton: false
      });
    } else {
      this.setState({
        currentLength: name.length,
        textWarning: false,
        copyButton: false
      });
    }
    this.setState({ projectName: name });
  };
  //项目负责人筛选
  deleteUser = title => {};
  //选人
  selUser = title => {
    const { userInfo } = this.state;
    const that = this;
    dingJS.selectUser(
      [],
      "请选择" + title,
      data => {
        console.log("钉钉返回的人" + data);
        if (!data) {
          return false;
        }
        const user = data[0];
        if (!user) {
          return false;
        }
        if (title === "负责人") {
          if (user.emplId !== userInfo.userid) {
            userInfo.userid = user.emplId;
            userInfo.name = user.name;
            userInfo.photo = user.avatar;
            that.setState({ userInfo: userInfo });
          }
        }
      },
      false
    );
  };
  render() {
    const { copyShow } = this.props;
    const {
      userInfo,
      projectName,
      textWarning,
      maxlength,
      currentLength,
      copyButton
    } = this.state;
    return (
      <Modal
        title="复制项目"
        visible={copyShow}
        width={520}
        footer={null}
        mask={false}
        maskClosable={false}
        wrapClassName="copyModal"
        onCancel={() => {
          this.props.closedCallBack();
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="copyProjectName">
          <div className="name">新项目名称</div>
          <Input
            placeholder="精简的项目名称有助于筛选"
            className="top_content_input"
            onChange={e => {
              this.changeProjectName(e.target.value);
            }}
            value={projectName && projectName}
            maxLength="50"
          />
          {textWarning ? (
            <div className="top_content_input_after">
              <span>{currentLength}</span>
              <span>/</span>
              <span className="maxlength">{maxlength}</span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="copyProjectPeople">
          <span className="selectTitle">项目负责人</span>
          {userInfo.userid && (
            <div className="userBox">
              <div
                className="userSel"
                onClick={() => {
                  this.selUser("负责人");
                }}
              >
                <div className="userName">
                  {userInfo.photo !== "" ? (
                    <img src={userInfo.photo} />
                  ) : (
                    <div className="noPhoto">
                      {this.getNickNameByName(userInfo.name)}
                    </div>
                  )}
                </div>
                <span>{userInfo.name && userInfo.name.slice(0, 3)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="fileBtn">
          <Button
            disabled={copyButton}
            onClick={() => {
              this.props.closedCallBack();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            disabled={copyButton}
            loading={copyButton}
            onClick={() => {
              this.setState({ copyButton: true });
              copyProject(
                this.props.copyProject.projectCreateInfo.id,
                userInfo,
                this.props.copyProject.projectCreateInfo.antPrefType,
                projectName,
                data => {
                  if (data.err) {
                    return;
                  } else {
                    message.success("复制成功");
                    this.props.handleCancel();
                  }
                }
              );
            }}
          >
            复制
          </Button>
        </div>
      </Modal>
    );
  }
}
