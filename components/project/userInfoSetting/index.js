import React from "react";
import { Input, Popover, Tabs } from "antd";
const { TextArea } = Input;
import stylesheet from "styles/components/project/UserInfoSetting/index.scss";
import IconSetting from "components/project/userInfoSetting/iconsetting";
import TagComponent from "components/tag";
import _ from "lodash";
import { isIosSystem } from "../../../core/utils/util";
/**
 * @name
 * @description 维护人员基本信息
 * @callback handleProjectInfoChange (必填) 删除标签 返回标签列表
 */
export default class UserInfoSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxlength: 50,
      currentLength: 0,
      projectCreateInfo: {},
      textWarning: false,
      visible: false
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
  //成功回调方法
  handleProjectInfoChange(index) {
    const { projectCreateInfo } = this.state;
    let taglist = projectCreateInfo.proSelectedTags;
    let labellist = projectCreateInfo.labelIds;
    taglist.splice(index, 1);
    labellist.splice(index, 1);
    projectCreateInfo.labelIds = labellist;
    projectCreateInfo.proSelectedTags = taglist;
    this.setState({
      projectCreateInfo: projectCreateInfo
    });
    this.props.handleProjectInfoChange(projectCreateInfo);
  }
  //更新项目名称
  changeProjectName(name) {
    const { projectCreateInfo } = this.state;
    let nameLength = name.trim().length;
    if (nameLength >= 40) {
      this.setState({
        currentLength: nameLength,
        textWarning: true
      });
    } else {
      this.setState({
        currentLength: nameLength,
        textWarning: false
      });
    }
    projectCreateInfo.proname = name;
    this.setState({
      projectCreateInfo: projectCreateInfo
    });

    this.props.handleProjectInfoChange(projectCreateInfo, "chang");
  }
  //更新项目描述
  changeProjectMark(description) {
    const { projectCreateInfo } = this.state;
    projectCreateInfo.proremark = description;
    this.setState({
      projectCreateInfo: projectCreateInfo
    });
    this.props.handleProjectInfoChange(projectCreateInfo);
  }
  iconcontent() {}
  handleReturnImage(projectCreateInfo) {
    this.setState({
      projectCreateInfo: projectCreateInfo
      //       visible: false
    });
  }
  addLabel() {}
  tagChangeCallBack(val) {
    const { projectCreateInfo } = this.state;
    let taglist = [];
    let labellist = [];
    val.map(item => {
      taglist.push({
        id: item.id,
        name: item.labelname,
        type: "2",
        color: item.color
      });

      labellist.push(item.id);
    });
    projectCreateInfo.proSelectedTags = val;
    projectCreateInfo.labelIds = labellist;
    this.setState({ projectCreateInfo: projectCreateInfo });
    this.props.handleProjectInfoChange(projectCreateInfo);
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  render() {
    const {
      currentLength,
      maxlength,
      projectCreateInfo,
      textWarning,
      visible
    } = this.state;
    let reg = /^https/;
    let reg2 = /^http/;
    return (
      <div className="userInfoSetting">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <section>
          <div className="top_title">
            <span>项目名称</span>
            {projectCreateInfo.jurisdiction ? (
              <span className="project_icon">
                <span>项目图标</span>
                <Popover
                  placement="bottom"
                  trigger="click"
                  visible={visible}
                  onVisibleChange={this.handleVisibleChange}
                  content={
                    <IconSetting
                      projectCreateInfo={projectCreateInfo}
                      handleReturnImage={res => {
                        this.handleReturnImage(res);
                      }}
                    />
                  }
                  //   trigger="hover"
                >
                  {projectCreateInfo.attstr04 &&
                  (reg.test(projectCreateInfo.attstr04) ||
                    reg2.test(projectCreateInfo.attstr04)) ? (
                    <div className="project_icon_avater">
                      <img
                        src={projectCreateInfo.attstr04}
                        className="project_icon_avater_img"
                      />
                    </div>
                  ) : (
                    <div className="project_icon_avater">
                      {projectCreateInfo.attstr04 === "#pro-myfg-1020" ||
                      projectCreateInfo.attstr04 === "" ? (
                        <div className="nullIcon">
                          <i
                            className={
                              isIosSystem()
                                ? "iconfont icon-project"
                                : "iconfont icon-project windowIconProject"
                            }
                          />
                        </div>
                      ) : (
                        <svg
                          className="project_icon_avater_img"
                          aria-hidden="true"
                        >
                          <use xlinkHref={projectCreateInfo.attstr04} />
                        </svg>
                      )}
                    </div>
                  )}
                </Popover>
              </span>
            ) : (
              <span className="project_icon">
                项目图标
                {projectCreateInfo.attstr04 &&
                (reg.test(projectCreateInfo.attstr04) ||
                  reg2.test(projectCreateInfo.attstr04)) ? (
                  <div className="project_icon_avater">
                    <img
                      src={projectCreateInfo.attstr04}
                      className="project_icon_avater_img"
                    />
                  </div>
                ) : (
                  <div className="project_icon_avater">
                    {/* <svg className="project_icon_avater_img" aria-hidden="true">
                          <use xlinkHref={projectCreateInfo.attstr04} />
                        </svg> */}
                    {projectCreateInfo.attstr04 === "#pro-myfg-1020" ||
                    projectCreateInfo.attstr04 === "" ? (
                      <div className="nullIcon">
                        <i
                          className={
                            isIosSystem()
                              ? "iconfont icon-project"
                              : "iconfont icon-project windowIconProject"
                          }
                        />
                      </div>
                    ) : (
                      <svg
                        className="project_icon_avater_img"
                        aria-hidden="true"
                      >
                        <use xlinkHref={projectCreateInfo.attstr04} />
                      </svg>
                    )}
                  </div>
                )}
              </span>
            )}
          </div>
          <div className="top_content">
            <div className="top_content_input_box">
              <Input
                placeholder="精简的项目名称有助于筛选"
                className="top_content_input"
                onChange={e => {
                  this.changeProjectName(e.target.value);
                }}
                value={projectCreateInfo && projectCreateInfo.proname}
                maxLength="50"
                disabled={!projectCreateInfo.jurisdiction}
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
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>项目简介</span>
          </div>
          <div className="top_content">
            <TextArea
              className="top_content_area"
              placeholder="关于项目的简要介绍"
              onChange={e => {
                this.changeProjectMark(e.target.value);
              }}
              value={projectCreateInfo && projectCreateInfo.proremark}
              disabled={!projectCreateInfo.jurisdiction}
            />
          </div>
        </section>
        <section>
          <TagComponent
            isProjectTypes={true}
            poverPosition="topLeft"
            tagSelecteds={projectCreateInfo.proSelectedTags}
            tagChangeCallBack={val => {
              this.tagChangeCallBack(val);
            }}
            showTitle={true}
            titleText="分类标签"
            checkedType="1"
            labelSize="70"
            canEdit={projectCreateInfo.jurisdiction}
            showTagTilte={true}
          />
        </section>
      </div>
    );
  }
}
