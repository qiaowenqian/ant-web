import React from "react";
import { Modal, Input, Radio, message, Menu, Spin } from "antd";
import UserInfoSetting from "components/project/userInfoSetting/index";
import PersonelArea from "components/project/personnelAreas/index";
import OperatePerm from "components/project/operatePerm/index";
import stylesheet from "styles/components/project/projectSetting.scss";
import RightBottomButton from "components/project/rightBottomButton/index";
import Performance from "components/project/performance/index";
import MoreSetting from "components/project/moreSetting/index";
import {
  createProject,
  getProjectCreateInfoById,
  deleteProject
} from "../../core/service/project.service";
import Router from "next/router";
import Storage from "../../core/utils/storage";
const confirm = Modal.confirm;

/*
 * （选填） projectId:''                                          // 如果没传，就是新创建项目，如果传了，就是项目设置
 * （必填） updateOkCallback({id:'',name:'',icon:'',fzrName:''})  // 提交成功之后回调函数，返回项目数据
 * （必填） closedCallBack()                                      // 关闭回调
 */

export default class projectCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      projectId: "",
      MenuList: [
        {
          type: "iconfont icon-info",
          name: "基本信息",
          mark: "a"
        },
        {
          type: "iconfont icon-users",
          name: "人员范围",
          mark: "b"
        },
        {
          type: "iconfont icon-lock",
          name: "操作权限",
          mark: "c"
        },
        // {
        //   type: "iconfont icon-info",
        //   name: "默认值",
        //   mark: "d"
        // },
        {
          type: "iconfont icon-target",
          name: "绩效系数",
          mark: "e"
        },
        {
          type: "iconfont icon-more1",
          name: "更多选项",
          mark: "f"
        }
      ],
      hidemore: false, //用来区分是不是创建项目的
      // jurisdiction: false, //是否可以删除
      projectCreateInfo: {
        createPer: ["1", "2", "3"], // 创建任务权限  0团队所有人 1项目负责人 2项目管理员 3项目成员 4任务创建人 5指派人 6负责人 7确认人
        modifyPer: ["1", "2", "3"], // 编辑任务权限  0团队所有人 1项目负责人 2项目管理员 3项目成员 4任务创建人 5指派人 6负责人 7确认人
        deletePer: ["1", "2"], // 删除任务权限  0团队所有人 1项目负责人 2项目管理员 3项目成员 4任务创建人 5指派人 6负责人 7确认人
        proSelectedTags: [], //标签详情数据
        category: "0",
        id: "",
        memberofpros: [],
        opentype: "0",
        jurisdiction: false, //是否可以删除
        proname: "",
        proremark: "",
        attstr04: "#pro-myfg-1020", //项目图标
        labelIds: [] //[id,id] 项目分类id集合(数组)
      },
      antPrefType: {
        assignPerf: "0",
        confirmPerf: "0",
        createPerf: "0",
        delFlag: "0",
        finishPerf: "100",
        finishTqPerf: "100",
        overDiscount: "100"
      },
      activeNum: "a",
      modalTitleText: "项目设置",
      okTxt: "保存",
      saveLoading: false,
      initLoading: true
    };
  }
  componentWillMount() {
    if (this.props.projectId) {
      this.setState({
        projectId: this.props.projectId,
        modalTitleText: "项目设置",
        okTxt: "保存"
      });

      this.getProjectCreateInfo(this.props.projectId);
    } else {
      const user = Storage.get("user");
      let { projectCreateInfo } = this.state;
      projectCreateInfo.memberofpros = [
        {
          user: user,
          rtype: "2"
        }
        // {
        //   user: user,
        //   rtype: "1"
        // },
        // {
        //   user: user,
        //   rtype: "0"
        // }
      ];
      projectCreateInfo.jurisdiction = true;
      projectCreateInfo.antPrefType = {
        assignPerf: "0",
        confirmPerf: "0",
        createPerf: "0",
        delFlag: "0",
        finishPerf: "100.00",
        finishTqPerf: "100.00",
        overDiscount: "100"
      };
      this.setState({
        projectCreateInfo: projectCreateInfo,
        modalTitleText: "创建项目",
        okTxt: "创建",
        initLoading: false
      });
    }
    if (this.props.hidemore) {
      this.setState({
        MenuList: [
          {
            type: "iconfont icon-info",
            name: "基本信息",
            mark: "a"
          },
          {
            type: "iconfont icon-users",
            name: "人员范围",
            mark: "b"
          },
          {
            type: "iconfont icon-lock",
            name: "操作权限",
            mark: "c"
          },
          // {
          //   type: "iconfont icon-info",
          //   name: "默认值",
          //   mark: "d"
          // },
          {
            type: "iconfont icon-target",
            name: "绩效系数",
            mark: "e"
          }
        ],
        hidemore: true
      });
    }
  }
  handleOk = type => {
    this.projectUpate(type);
    const { projectCreateInfo } = this.state;
    //     this.props.updateOkCallback(projectCreateInfo);
  };
  handleDelete() {
    if (this.props.projectId) {
      this.dellProject();
    }
  }
  dellProject() {
    const { projectId } = this.state;
    //     this.setState({ svnGroupShow: false });
    const that = this;
    confirm({
      title: `确认删除"${this.state.projectCreateInfo.proname}"？`,
      content: "",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteProject(projectId, data => {
          if (data.err) {
            return false;
          }
          Router.push("/pc_project");

          message.success("删除成功！");
          that.props.closedCallBack();
          that.props.updateOkCallback("刷新");
        });
      },
      onCancel() {}
    });
  }
  handleCancel = t => {
    if (t) {
      this.props.updateOkCallback("刷新");
      this.props.closedCallBack();
    } else {
      this.props.closedCallBack();
    }
  };

  getProjectCreateInfo(id) {
    let _this = this;
    const { projectCreateInfo } = this.state;
    getProjectCreateInfoById(id, data => {
      if (data.err) {
        return false;
      }
      if (data) {
        projectCreateInfo.id = id;
        projectCreateInfo.proname = data.ant.proname;
        projectCreateInfo.proremark = data.ant.proremark;
        if (data.ant.attstr04 === "" || data.ant.attstr04 === undefined) {
          projectCreateInfo.attstr04 = "#pro-myfg-1020";
        } else {
          projectCreateInfo.attstr04 = data.ant.attstr04;
        }
        projectCreateInfo.opentype = data.ant.opentype;
        data.label.map((item, index) => {
          if (item.label) {
            projectCreateInfo.labelIds.push(item.label.id);
          }
        });
        // setUpButton 权限
        if (data.ant.setUpButton) {
          projectCreateInfo.jurisdiction = true;
        } else {
          projectCreateInfo.jurisdiction = false;
        }
        projectCreateInfo.memberofpros = data.users;

        const proSelectedTags = [];
        data.label.map(item => {
          proSelectedTags.push({
            id: item.label.id,
            name: item.label.labelname,
            type: "2",
            color: item.label.color
          });
        });
        projectCreateInfo.proSelectedTags = proSelectedTags;
        projectCreateInfo.createPer = data.ant.createPer;
        projectCreateInfo.modifyPer = data.ant.modifyPer;
        projectCreateInfo.deletePer = data.ant.deletePer;
        projectCreateInfo.antPrefType = data.antPrefType;
        _this.setState({
          projectCreateInfo: projectCreateInfo,
          initLoading: false
        });
      }
    });
  }
  handleProjectInfoChange(options, change) {
    this.setState({
      projectCreateInfo: options
    });
    // console.log(options, "options");
    // console.log(change, "43552345234");
    this.setState({ saveLoading: false });
  }
  getExportData() {
    if (this.props.getExportData) {
      this.props.getExportData();
    }
  }
  moneyEnd() {
    if (this.props.moneyEnd) {
      this.props.moneyEnd();
    }
  }
  projectUpate(type) {
    let _this = this;
    //     this.setState({ svnGroupShow: false });
    //     const { projectCreateInfo, proNameLength, proDescLength } = this.state;
    //     if (type === "opentype") {
    //       projectCreateInfo.opentype = e.target.value;
    //     }
    //     if (type === "proname") {
    //       projectCreateInfo.proname = e.target.value;
    //       let proNameLength = getByteLen(e.target.value.slice(0, 30));
    //       this.setState({ proNameLength: proNameLength });
    //     }
    //     if (type === "proremark") {
    //       projectCreateInfo.proremark = e.target.value;
    //       let proDescLength = getByteLen(e.target.value.slice(0, 200));
    //       this.setState({ proDescLength: proDescLength });
    //     }
    //     this.setState({ projectCreateInfo: projectCreateInfo });
    const { projectCreateInfo, projectId } = this.state;
    this.setState({ saveLoading: true });
    if (type === "handleOk") {
      createProject(projectCreateInfo, data => {
        // if (data.err) {
        //   this.setState({ saveLoading: false });
        //   return false;
        // }
        // const { projectId } = this.state;
        _this.setState({ saveLoading: false });
        if (projectId === "") {
          if (data.err) {
            _this.setState({ saveLoading: false });
            return;
          } else {
            message.success("创建成功！");
            _this.props.updateOkCallback("刷新");
          }
        } else {
          message.success("保存成功！");

          const pro = {
            id: projectCreateInfo.id,
            proname: projectCreateInfo.proname,
            attstr04: projectCreateInfo.attstr04,
            tags: projectCreateInfo.proSelectedTags,
            createPermission: data.createPre
            //     createPerf: projectCreateInfo.createPer,
            //     modifyPer: projectCreateInfo.modifyPer,
            //     deletePer: projectCreateInfo.deletePer
          };
          _this.props.updateOkCallback(pro);
        }

        _this.props.closedCallBack();
      });
    }
  }
  handleRightContent(projectCreateInfo) {
    const { activeNum } = this.state;
    switch (activeNum) {
      case "a":
        return (
          <UserInfoSetting
            projectCreateInfo={projectCreateInfo}
            handleProjectInfoChange={info => {
              this.handleProjectInfoChange(info);
            }}
          />
        );
        break;
      case "b":
        return (
          <PersonelArea
            projectCreateInfo={projectCreateInfo}
            handleProjectInfoChange={info => {
              this.handleProjectInfoChange(info);
            }}
          />
        );
        break;
      case "c":
        return (
          <OperatePerm
            projectCreateInfo={projectCreateInfo}
            handleProjectInfoChange={info => {
              this.handleProjectInfoChange(info);
            }}
          />
        );
        break;
      case "e":
        return (
          <Performance
            projectCreateInfo={projectCreateInfo}
            handleProjectInfoChange={info => {
              this.handleProjectInfoChange(info);
            }}
          />
        );
        break;
      case "f":
        return (
          <MoreSetting
            projectCreateInfo={projectCreateInfo}
            handleProjectInfoChange={info => {
              debugger;
              this.handleProjectInfoChange(info);
            }}
            handleCancel={() => {
              this.handleCancel(true);
            }}
            handleDelete={() => {
              this.handleDelete();
            }}
            getExportData={() => {
              this.getExportData();
            }}
            moneyEnd={() => {
              this.moneyEnd();
            }}
          />
        );
        break;
      default:
        break;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.projectId
      //       nextProps.projectId != this.props.projectId
    ) {
      if (nextProps.projectId == this.props.projectId) {
        return false;
      }
      this.setState({
        projectId: this.props.projectId,
        modalTitleText: "项目设置",
        okTxt: "保存"
      });

      this.getProjectCreateInfo(this.props.projectId);
    } else {
      const user = Storage.get("user");
      let { projectCreateInfo } = this.state;
      projectCreateInfo.memberofpros = [
        {
          user: user,
          rtype: "2"
        },
        {
          user: user,
          rtype: "1"
        },
        {
          user: user,
          rtype: "0"
        }
      ];
      projectCreateInfo.jurisdiction = true;
      projectCreateInfo.antPrefType = {
        assignPerf: "0.00",
        confirmPerf: "0.00",
        createPerf: "0.00",
        delFlag: "0",
        finishPerf: "100.00",
        finishTqPerf: "100.00",
        overDiscount: "100.00"
      };
      this.setState({
        projectCreateInfo: projectCreateInfo,
        modalTitleText: "创建项目",
        okTxt: "创建",
        initLoading: false
      });
    }
    if (nextProps.hidemore) {
      this.setState({
        MenuList: [
          {
            type: "iconfont icon-info",
            name: "基本信息",
            mark: "a"
          },
          {
            type: "iconfont icon-users",
            name: "人员范围",
            mark: "b"
          },
          {
            type: "iconfont icon-lock",
            name: "操作权限",
            mark: "c"
          },
          // {
          //   type: "iconfont icon-info",
          //   name: "默认值",
          //   mark: "d"
          // },
          {
            type: "iconfont icon-target",
            name: "绩效系数",
            mark: "e"
          }
        ]
      });
    }
  }
  render() {
    const {
      MenuList,
      modalTitleText,
      okTxt,
      projectCreateInfo,
      saveLoading,
      initLoading
    } = this.state;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Modal
          title={modalTitleText}
          className="project-create"
          destroyOnClose="true"
          visible={this.state.visible}
          width={600}
          height={522}
          onCancel={() => {
            this.handleCancel();
          }}
          footer={null}
          closable={false}
        >
          <div className="projectModalContent">
            {initLoading ? <Spin /> : ""}
            <Menu
              style={{ width: 110, flexShrink: 2 }}
              defaultSelectedKeys={["0"]}
            >
              {MenuList &&
                MenuList.map((item, index) => {
                  return (
                    <Menu.Item
                      key={index}
                      onClick={e => {
                        this.setState({ activeNum: item.mark });
                      }}
                    >
                      {/* <Icon type={item.type} /> */}

                      <i className={`${item.type}`} />
                      <span> {item.name}</span>
                    </Menu.Item>
                  );
                })}
            </Menu>
            <div className="modalcontentRight" style={{ flexShrink: 1 }}>
              <div className="rightTop">
                {this.handleRightContent(projectCreateInfo)}
              </div>

              <RightBottomButton
                handleCancel={e => {
                  this.handleCancel(e);
                }}
                handleOk={type => {
                  this.handleOk(type);
                }}
                handleDelete={() => {
                  this.handleDelete();
                }}
                okTxt={okTxt}
                saveLoading={saveLoading}
                projectCreateInfo={projectCreateInfo}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
