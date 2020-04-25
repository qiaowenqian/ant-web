import React from "react";
import { Button, Icon } from "antd";
import _ from "lodash";
import stylesheet from "styles/components/project/rightBottomButton/index.scss";
export default class RightBottomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelText: "取消",
      okText: "保存",
      delectText: "删除",
      projectCreateInfo: null,
      saveLoading: false,
      saveButton: true
    };
  }
  componentWillMount() {
    const { okText } = this.state;
    if (this.props.okTxt !== okText) {
      this.setState({
        okText: this.props.okTxt
      });
    }
    if (this.props.projectCreateInfo) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo
      });
    }
    if (this.props.saveLoading != undefined && this.props.saveLoading != "") {
      this.setState({
        saveLoading: this.props.saveLoading
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { okText } = this.state;
    if (nextProps.okTxt !== okText) {
      this.setState({
        okText: nextProps.okTxt
      });
    }
    if (!_.isEqual(nextProps.projectCreateInfo, this.props.projectCreateInfo)) {
      this.setState({
        projectCreateInfo: nextProps.projectCreateInfo
      });
    }
    if (nextProps.saveLoading != undefined && nextProps.saveLoading != "") {
      this.setState({
        saveLoading: nextProps.saveLoading
      });
    }
  }

  render() {
    const {
      cancelText,
      okText,
      projectCreateInfo,
      saveLoading,
      saveButton
    } = this.state;
    return (
      <div className="rightBottomButton">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="rightBottomButtonRight">
          <Button
            onClick={() => {
              this.props.handleCancel(false);
            }}
            style={{
              width: 80,
              height: 30
            }}
          >
            {cancelText}
          </Button>
          {projectCreateInfo && !projectCreateInfo.jurisdiction ? (
            ""
          ) : (
            <Button
              type={projectCreateInfo.proname ? "primary" : ""}
              onClick={() => {
                this.setState({ saveButton: false });
                this.props.handleOk("handleOk");
              }}
              disabled={
                (projectCreateInfo.proname && saveButton) || saveLoading
                  ? false
                  : true
              }
              style={{
                width: 80,
                height: 30
              }}
            >
              {/* {saveLoading ? <Icon type="loading" /> : ""} */}
              {okText}
            </Button>
          )}
        </div>
        <span className="buttonGroupInfo">仅项目负责人与管理员可修改</span>
      </div>
    );
  }
}
