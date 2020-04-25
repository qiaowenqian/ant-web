import React from "react";
import _ from "lodash";
import { Button } from "antd";
import { getTeamInfoWithMoney } from "../../../core/utils/util";
import stylesheet from "styles/components/project/moreSetting/index.scss";
import Copy from "./copyProjectModal";
import File from "./projectFile";
import Storage from "../../../core/utils/storage";
export default class MoreSetting extends React.Component {
  constructor() {
    super();
    this.state = { copyShow: false, FileShow: false, flleType: true };
  }
  componentWillMount() {
    if (this.props.projectCreateInfo) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo
      });
    }
  }
  componentDidMount = () => {
    let flleTypes = Storage.getLocal("actType");
    if (flleTypes && flleTypes[0] === "5") {
      this.setState({ flleType: false });
    } else {
      this.setState({ flleType: true });
    }
  };
  componentWillReceiveProps(nextProps) {
    let _this = this;
    if (
      nextProps.projectCreateInfo &&
      !_.isEqual(nextProps.projectCreateInfo, _this.props.projectCreateInfo)
    ) {
      this.setState({
        projectCreateInfo: nextProps.projectCreateInfo
      });
    }
  }
  render() {
    const { projectCreateInfo, copyShow, FileShow, flleType } = this.state;
    return (
      <div className="moreSetting">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {/* <section>
          <div className="top_title">
            <span>导入任务</span>
            <span className="top_title_info">
              将现有的工作任务通过 Excel 导入到项目中
            </span>
          </div>
          <div className="top_content">
            <Button disabled={!projectCreateInfo.jurisdiction}>导入</Button>
          </div>
        </section> */}
        <section>
          <div className="top_title">
            <span>导出任务</span>
            <span className="top_title_info">
              将项目内的任务导出为 Excel 制作报表
            </span>
          </div>
          <div className="top_content">
            {getTeamInfoWithMoney("是否可用") ? (
              <Button
                onClick={() => {
                  this.props.getExportData();
                }}
                style={{
                  width: 80,
                  height: 30
                }}
              >
                {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                  <svg className="pro-icon zuanshi" aria-hidden="true">
                    <use xlinkHref={"#pro-myfg-zuanshi"} />
                  </svg>
                ) : (
                  ""
                )}
                导出
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (this.props.moneyEnd) {
                    this.props.moneyEnd();
                  }
                }}
                style={{
                  width: 80,
                  height: 30
                }}
              >
                <svg className="pro-icon zuanshi" aria-hidden="true">
                  <use xlinkHref={"#pro-myfg-zuanshi"} />
                </svg>
                导出
              </Button>
            )}
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>复制项目</span>
            <span className="top_title_info">通过复制来快速创建一个项目</span>
          </div>
          <div className="top_content">
            {getTeamInfoWithMoney("是否可用") ? (
              <Button
                onClick={() => {
                  this.setState({ copyShow: true });
                }}
                disabled={!projectCreateInfo.jurisdiction}
                style={{
                  width: 80,
                  height: 30
                }}
              >
                {getTeamInfoWithMoney("版本名称") !== "专业版" ? (
                  <svg className="pro-icon zuanshi" aria-hidden="true">
                    <use xlinkHref={"#pro-myfg-zuanshi"} />
                  </svg>
                ) : (
                  ""
                )}
                复制
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (this.props.moneyEnd) {
                    this.props.moneyEnd();
                  }
                }}
                style={{
                  width: 80,
                  height: 30
                }}
              >
                <svg className="pro-icon zuanshi" aria-hidden="true">
                  <use xlinkHref={"#pro-myfg-zuanshi"} />
                </svg>
                复制
              </Button>
            )}
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>归档项目</span>
            <span className="top_title_info">
              如项目已完成或需要隐藏，可归档项目
            </span>
          </div>
          <div className="top_content">
            {!flleType ? (
              <Button
                style={{
                  width: 80,
                  height: 30,
                  padding: 0
                }}
                disabled={!projectCreateInfo.jurisdiction}
                onClick={() => {
                  this.setState({ FileShow: true });
                }}
              >
                取消归档
              </Button>
            ) : (
              <Button
                style={{
                  width: 80,
                  height: 30
                }}
                disabled={!projectCreateInfo.jurisdiction}
                onClick={() => {
                  this.setState({ FileShow: true });
                }}
                // autoInsertSpaceInButton={false}
              >
                <span />
                归档
              </Button>
            )}
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>删除项目</span>
            <span className="top_title_info">
              删除后保留30天，专业版可在"设置-回收站"中还原
            </span>
          </div>
          <div className="top_content">
            <Button
              type="danger"
              disabled={!projectCreateInfo.jurisdiction}
              onClick={() => {
                this.props.handleDelete();
              }}
              style={{
                width: 80,
                height: 30
              }}
            >
              <span />
              删除
            </Button>
          </div>
        </section>
        <Copy
          copyShow={copyShow}
          copyProject={this.props}
          handleCancel={() => {
            this.props.handleCancel();
          }}
          closedCallBack={() => {
            this.setState({ copyShow: false });
          }}
        />
        <File
          FileShow={FileShow}
          fileProjectId={this.props.projectCreateInfo.id}
          handleCancel={() => {
            this.props.handleCancel();
          }}
          closedCallBack={() => {
            this.setState({ FileShow: false });
          }}
        />
      </div>
    );
  }
}
