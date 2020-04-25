import React from "react";
import { Tabs } from "antd";
import stylesheet from "styles/components/project/UserInfoSetting/iconsetting.scss";
import Avatar from "components/project/userInfoSetting/uploadAvatar";
import _ from "lodash";
const TabPane = Tabs.TabPane;
const iconList = [
  "1000",
  "1001",
  "1002",
  //   "1003",
  //   "1004",
  "1005",
  "1006",
  "1007",
  "1008",
  "1009",
  "1010",
  "1011",
  "1012",
  "1013",
  //   "1014",
  "1015",
  "1016",
  "1017"
  //   "1018",
  //   "1019",
  //   "1020"
];
export default class IconSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCreateInfo: {}
    };
  }
  componentWillMount() {
    if (this.props.projectCreateInfo) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo
      });
    }
  }
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
  callback() {}
  onChoosePic(value) {
    const { projectCreateInfo } = this.state;
    projectCreateInfo.attstr04 = value;
    this.setState(
      {
        projectCreateInfo: projectCreateInfo
      },
      () => {
        this.props.handleReturnImage(projectCreateInfo);
      }
    );
  }
  render() {
    const { projectCreateInfo } = this.state;
    const content = (
      <div className="svnGroup">
        {iconList && iconList.length > 0
          ? iconList.map((item, i) => {
              return (
                <span
                  key={item}
                  onClick={e => {
                    this.onChoosePic("#pro-myfg-" + item);
                  }}
                >
                  <svg className="pro-icon" aria-hidden="true">
                    <use xlinkHref={"#pro-myfg-" + item} />
                  </svg>
                </span>
              );
            })
          : ""}
      </div>
    );
    return (
      <div id="iconSettingComponents">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Tabs
          onChange={() => {
            this.callback();
          }}
          type="card"
        >
          <TabPane tab="自定义" key="2">
            <Avatar
              attstr04={projectCreateInfo.attstr04}
              onChoosePic={val => this.onChoosePic(val)}
            />
          </TabPane>
          <TabPane tab="系统图标" key="1">
            {content}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
