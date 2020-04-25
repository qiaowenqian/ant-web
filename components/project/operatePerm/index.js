import React from "react";
import { Select, message } from "antd";
import stylesheet from "styles/components/project/operatePerm/index.scss";
import { oneOf } from "../../../core/utils/util";
import _ from "lodash";
const { OptGroup } = Select;
const Option = Select.Option;

/**
 * @name
 * @description 维护操作权限 0团队所有人 1项目负责人 2项目管理员 3项目成员 4任务创建人 5指派人 6负责人 7确认人
 * @description 数据：projectCreateInfo: {
        createPer: ["0"],
        modifyPer: ["0"],
        deletePer: ["0"],
        jurisdiction:false//此处的用来判断权限，是否能用，数据最少要有这四类
      }
 * @callback handleProjectInfoChange (必填)  返回projectCreateInfo对象
 */
export default class OperatePerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxlength: 50,
      currentLength: 0,
      textWarning: false,
      createList: [
        {
          value: "0",
          name: "团队所有人"
        },
        {
          value: "1",
          name: "项目负责人"
        },
        {
          value: "3",
          name: "项目成员"
        },
        {
          value: "2",
          name: "项目管理员"
        }
      ],

      editList: [
        {
          value: "0",
          name: "团队所有人"
        },
        {
          value: "1",
          name: "项目负责人"
        },
        {
          value: "3",
          name: "项目成员"
        },
        {
          value: "2",
          name: "项目管理员"
        },
        {
          value: "4",
          name: "任务创建人"
        },
        {
          value: "5",
          name: "任务指派人"
        },
        {
          value: "6",
          name: "任务负责人"
        },
        {
          value: "7",
          name: "任务确认人"
        }
      ],
      projectCreateInfo: {
        createPer: ["0"],
        modifyPer: ["0"],
        deletePer: ["0"]
      }
    };
  }
  componentWillMount() {
    if (this.props && this.props.projectCreateInfo) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo
      });
    }
    if (this.props.projectCreateInfo.opentype == "1") {
      this.setState({
        createList: [
          {
            value: "0",
            name: "团队所有人"
          },
          {
            value: "1",
            name: "项目负责人"
          },
          {
            value: "2",
            name: "项目管理员"
          },
          {
            value: "3",
            name: "项目成员"
          }
        ],

        editList: [
          {
            value: "0",
            name: "团队所有人"
          },
          {
            value: "1",
            name: "项目负责人"
          },
          {
            value: "3",
            name: "项目成员"
          },
          {
            value: "2",
            name: "项目管理员"
          },
          {
            value: "4",
            name: "任务创建人"
          },
          {
            value: "5",
            name: "任务指派人"
          },
          {
            value: "6",
            name: "任务负责人"
          },
          {
            value: "7",
            name: "任务确认人"
          }
        ]
      });
    } else {
      this.setState({
        createList: [
          {
            value: "1",
            name: "项目负责人"
          },
          {
            value: "2",
            name: "项目管理员"
          },
          {
            value: "3",
            name: "项目成员"
          }
        ],

        editList: [
          {
            value: "1",
            name: "项目负责人"
          },
          {
            value: "3",
            name: "项目成员"
          },
          {
            value: "2",
            name: "项目管理员"
          },
          {
            value: "4",
            name: "任务创建人"
          },
          {
            value: "5",
            name: "任务指派人"
          },
          {
            value: "6",
            name: "任务负责人"
          },
          {
            value: "7",
            name: "任务确认人"
          }
        ]
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.projectCreateInfo &&
      !_.isEqual(this.props.projectCreateInfo, nextProps.projectCreateInfo)
    ) {
      if (
        nextProps &&
        nextProps.projectCreateInfo &&
        nextProps.projectCreateInfo.opentype
      ) {
        this.setState({
          createList: [
            {
              value: "0",
              name: "团队所有人"
            },
            {
              value: "1",
              name: "项目负责人"
            },
            {
              value: "2",
              name: "项目管理员"
            },
            {
              value: "3",
              name: "项目成员"
            }
          ],

          editList: [
            {
              value: "0",
              name: "团队所有人"
            },
            {
              value: "1",
              name: "项目负责人"
            },
            {
              value: "3",
              name: "项目成员"
            },
            {
              value: "2",
              name: "项目管理员"
            },
            {
              value: "4",
              name: "任务创建人"
            },
            {
              value: "5",
              name: "任务指派人"
            },
            {
              value: "6",
              name: "任务负责人"
            },
            {
              value: "7",
              name: "任务确认人"
            }
          ]
        });
      } else {
        this.setState({
          createList: [
            {
              value: "1",
              name: "项目负责人"
            },

            {
              value: "2",
              name: "项目管理员"
            },
            {
              value: "3",
              name: "项目成员"
            }
          ],

          editList: [
            {
              value: "1",
              name: "项目负责人"
            },
            {
              value: "3",
              name: "项目成员"
            },
            {
              value: "2",
              name: "项目管理员"
            },
            {
              value: "4",
              name: "任务创建人"
            },
            {
              value: "5",
              name: "任务指派人"
            },
            {
              value: "6",
              name: "任务负责人"
            },
            {
              value: "7",
              name: "任务确认人"
            }
          ]
        });
      }
      this.setState({
        projectCreateInfo: nextProps.projectCreateInfo
      });
    }
  }
  componentDidMount() {}
  //成功回调方法
  handleSelectChange() {
    const { projectCreateInfo } = this.state;

    //     projectCreateInfo.createChecked = createChecked;
    //     projectCreateInfo.editChecked = editChecked;
    //     projectCreateInfo.deleteChecked = deleteChecked;
    //     this.setState({
    //       projectCreateInfo: projectCreateInfo
    //     });
    this.props.handleProjectInfoChange(projectCreateInfo);
  }
  handleCreateChange(value) {
    const { projectCreateInfo } = this.state;
    if (value.length <= 0) {
      message.warn("操作权限设置不能为空！");
      value = projectCreateInfo.createPer;
    } else if (value.length > 1) {
      if (oneOf("0", value)) {
        if (value && value[value.length - 1].toString() != "0") {
          value.map((item, index) => {
            if (item == 0) {
              value.splice(index, 1);
            }
          });
        } else {
          value = ["0"];
        }
      }
    }
    projectCreateInfo.createPer = value;
    this.setState(
      {
        projectCreateInfo: projectCreateInfo
      },
      () => {
        this.handleSelectChange();
      }
    );
  }
  handleEditChange(value) {
    const { projectCreateInfo } = this.state;
    if (value.length <= 0) {
      //       if (projectCreateInfo.opentype == "1") {
      //         value = ["0"];
      //       } else {
      //         value = ["1", "2", "3"];
      //       }
      message.warn("操作权限设置不能为空！");
      value = projectCreateInfo.modifyPer;
    } else if (value.length > 1) {
      if (value && value[value.length - 1].toString() != "0") {
        value.map((item, index) => {
          if (item == 0) {
            value.splice(index, 1);
          }
        });
      } else {
        value = ["0"];
      }
    }
    projectCreateInfo.modifyPer = value;
    //     if (projectCreateInfo.modifyPer.length == 0) {
    //       projectCreateInfo.modifyPer = [0];
    //     }
    this.setState(
      {
        projectCreateInfo: projectCreateInfo
      },
      () => {
        this.handleSelectChange();
      }
    );
  }
  handleDeleteChange(value) {
    const { projectCreateInfo } = this.state;
    if (value.length <= 0) {
      //       if (projectCreateInfo.opentype == "1") {
      //         value = ["1", "2"];
      //       } else {
      //         value = ["1", "2"];
      //       }
      message.warn("操作权限设置不能为空！");
      value = projectCreateInfo.deletePer;
    } else if (value.length > 1) {
      if (value && value[value.length - 1].toString() != "0") {
        value.map((item, index) => {
          if (item == 0) {
            value.splice(index, 1);
          }
        });
      } else {
        value = ["0"];
      }
    }
    projectCreateInfo.deletePer = value;
    //     if (projectCreateInfo.deletePer.length == 0) {
    //       projectCreateInfo.deletePer = [0];
    //     }
    this.setState(
      {
        projectCreateInfo: projectCreateInfo
      },
      () => {
        this.handleSelectChange();
      }
    );
  }
  render() {
    const { createList, editList, projectCreateInfo } = this.state;
    return (
      <div className="OpearatePerm">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <section>
          <div className="top_title">
            <span>创建任务</span>
            <span className="top_title_info">
              谁可以在项目内创建任务，包含任务的导入
            </span>
          </div>
          <div className="top_content">
            <Select
              mode="multiple"
              value={projectCreateInfo.createPer}
              style={{ width: "100%" }}
              onChange={value => {
                this.handleCreateChange(value);
              }}
              disabled={!projectCreateInfo.jurisdiction}
            >
              {createList.map((item, index) => {
                return (
                  <Option
                    key={"create" + index}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>修改任务</span>
            <span className="top_title_info">
              谁可以修改任务，包含任务的重启、移动与终止
            </span>
          </div>
          <div className="top_content">
            {projectCreateInfo.opentype == "1" ? (
              <Select
                value={projectCreateInfo.modifyPer}
                style={{ width: "100%" }}
                onChange={value => {
                  this.handleEditChange(value);
                }}
                mode="multiple"
                disabled={!projectCreateInfo.jurisdiction}
              >
                <Option value={"0"}>团队所有人</Option>
                <OptGroup label="项目人员">
                  <Option value={"1"} style={{ marginLeft: "10px" }}>
                    项目负责人
                  </Option>
                  <Option value={"2"} style={{ marginLeft: "10px" }}>
                    项目管理员
                  </Option>
                  <Option value={"3"} style={{ marginLeft: "10px" }}>
                    项目成员
                  </Option>
                </OptGroup>
                <OptGroup label="任务人员">
                  <Option value={"4"} style={{ marginLeft: "10px" }}>
                    任务创建人
                  </Option>
                  <Option value={"5"} style={{ marginLeft: "10px" }}>
                    任务指派人
                  </Option>
                  <Option value={"6"} style={{ marginLeft: "10px" }}>
                    任务负责人
                  </Option>
                  <Option value={"7"} style={{ marginLeft: "10px" }}>
                    任务确认人
                  </Option>
                </OptGroup>
              </Select>
            ) : (
              <Select
                value={projectCreateInfo.modifyPer}
                style={{ width: "100%" }}
                onChange={value => {
                  this.handleEditChange(value);
                }}
                mode="multiple"
                disabled={!projectCreateInfo.jurisdiction}
              >
                <OptGroup label="项目人员">
                  <Option value={"1"} style={{ marginLeft: "10px" }}>
                    项目负责人
                  </Option>
                  <Option value={"2"} style={{ marginLeft: "10px" }}>
                    项目管理员
                  </Option>
                  <Option value={"3"} style={{ marginLeft: "10px" }}>
                    项目成员
                  </Option>
                </OptGroup>
                <OptGroup label="任务人员">
                  <Option value={"4"} style={{ marginLeft: "10px" }}>
                    任务创建人
                  </Option>
                  <Option value={"5"} style={{ marginLeft: "10px" }}>
                    任务指派人
                  </Option>
                  <Option value={"6"} style={{ marginLeft: "10px" }}>
                    任务负责人
                  </Option>
                  <Option value={"7"} style={{ marginLeft: "10px" }}>
                    任务确认人
                  </Option>
                </OptGroup>
              </Select>
            )}
          </div>
        </section>
        <section>
          <div className="top_title">
            <span>删除任务</span>
            <span className="top_title_info">谁可以删除任务</span>
          </div>
          <div className="top_content">
            {projectCreateInfo.opentype == "1" ? (
              <Select
                value={projectCreateInfo.deletePer}
                style={{ width: "100%" }}
                onChange={value => {
                  this.handleDeleteChange(value);
                }}
                mode="multiple"
                disabled={!projectCreateInfo.jurisdiction}
              >
                <Option value={"0"}>团队所有人</Option>
                <OptGroup label="项目人员">
                  <Option value={"1"} style={{ marginLeft: "10px" }}>
                    项目负责人
                  </Option>
                  <Option value={"2"} style={{ marginLeft: "10px" }}>
                    项目管理员
                  </Option>
                  <Option value={"3"} style={{ marginLeft: "10px" }}>
                    项目成员
                  </Option>
                </OptGroup>
                <OptGroup label="任务人员">
                  <Option value={"4"} style={{ marginLeft: "10px" }}>
                    任务创建人
                  </Option>
                  <Option value={"5"} style={{ marginLeft: "10px" }}>
                    任务指派人
                  </Option>
                  <Option value={"6"} style={{ marginLeft: "10px" }}>
                    任务负责人
                  </Option>
                  <Option value={"7"} style={{ marginLeft: "10px" }}>
                    任务确认人
                  </Option>
                </OptGroup>
              </Select>
            ) : (
              <Select
                value={projectCreateInfo.deletePer}
                style={{ width: "100%" }}
                onChange={value => {
                  this.handleDeleteChange(value);
                }}
                mode="multiple"
                disabled={!projectCreateInfo.jurisdiction}
              >
                <OptGroup label="项目人员">
                  <Option value={"1"} style={{ marginLeft: "10px" }}>
                    项目负责人
                  </Option>
                  <Option value={"2"} style={{ marginLeft: "10px" }}>
                    项目管理员
                  </Option>
                  <Option value={"3"} style={{ marginLeft: "10px" }}>
                    项目成员
                  </Option>
                </OptGroup>
                <OptGroup label="任务人员">
                  <Option value={"4"} style={{ marginLeft: "10px" }}>
                    任务创建人
                  </Option>
                  <Option value={"5"} style={{ marginLeft: "10px" }}>
                    任务指派人
                  </Option>
                  <Option value={"6"} style={{ marginLeft: "10px" }}>
                    任务负责人
                  </Option>
                  <Option value={"7"} style={{ marginLeft: "10px" }}>
                    任务确认人
                  </Option>
                </OptGroup>
              </Select>
            )}
          </div>
        </section>
      </div>
    );
  }
}
