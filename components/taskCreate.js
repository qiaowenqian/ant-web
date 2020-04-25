import React from "react";
import {
  Icon,
  Input,
  Button,
  Upload,
  DatePicker,
  Select,
  message,
  Modal,
  Breadcrumb,
  TimePicker,
  Popconfirm
} from "antd";
import moment from "moment";

import { createTask, getTaskBreadById } from "../core/service/task.service";
import { getProListByJurisdiction } from "../core/service/project.service";
import { updateImgsInService } from "../core/service/file.service";
import {
  pasteImg,
  onlyNumber,
  beforeUpload,
  listScroll,
  getByteLen
} from "../core/utils/util";
import stylesheet from "styles/components/taskCreate.scss";
import { baseURI } from "../core/api/HttpClient";
import dingJS from "../core/utils/dingJSApi";
import Storage from "../core/utils/storage";
import TagComponent from "../components/tag";
const { TextArea } = Input;
const Option = Select.Option;

/*
 * task:{id:'',projectId:''}                // 任务 有传的话 表示是创建子任务 （选填）
 * closedCallBack()                         // 关闭回调（必填）
 * successCallBack()                        // 创建成功回调 （选填）
 */

export default class taskCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInfo: {
        objId: { id: "", name: "" },
        parentId: "",
        name: "",
        desc: "", // 编辑器 填写的描述内容
        fzr: { id: "", name: "", userid: "" },
        shr: { id: "", name: "", userid: "" },
        wcrq: "",
        yjgq: "1",
        rwjx: "",
        zycd: "0",
        filesList: [],
        tags: [],
        collectUser: []
      },
      showMore: "", // 更多按钮

      previewVisible: false, // 本地放大图片
      previewImage: "",

      uploadList_desc: [],
      projectListData: [], // 项目列表存放
      projectListLoading: false,
      projectListMoreLoading: false,
      projectListNowPage: 1,
      projectListAllPage: 0,

      breadShow: false, // 是否渲染面包屑
      breadList: [],
      descDetailsShow: false,

      taskNameLength: 0,
      taskPlanDate: "",
      taskPlanTime: "",
      createLoading: false,
      limitAttention: false,
      limitArr: [], // 关注人列表
      joinProject: false,
      resLength: 0
    };
  }

  componentWillMount() {
    if (this.props.task) {
      this.setState({ breadShow: true });
      let { taskInfo } = this.state;
      taskInfo.parentId = this.props.task.id ? this.props.task.id : "";
      taskInfo.objId.id = this.props.task.projectId;
      this.setState({ taskInfo: taskInfo });
      this.getTaskBread();
    } else {
      this.setState({ breadShow: false });
    }
    let user = Storage.get("user");
    let { taskInfo } = this.state;
    taskInfo.fzr = user;
    this.setState({ taskInfo: taskInfo });
  }

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {
    let showMore = Storage.getLocal("showMoreAdddTask");
    if (showMore) {
      this.setState({ showMore: showMore });
    } else {
      this.setState({ showMore: "a" });
    }
    this.setState({ taskPlanTime: this.state.taskPlanTime });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getTaskBread() {
    getTaskBreadById(this.props.task.projectId, this.props.task.id, res => {
      if (res.err) {
        return false;
      }
      this.setState({ breadList: res.parentList });
    });
  }

  // 是否显示更多
  moreShow() {
    let { showMore } = this.state;
    if (showMore == "b") {
      this.setState({ showMore: "b" });
    } else {
      this.setState({ showMore: "a" });
    }
  }
  // 显示图片
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  // 删除人员
  remove(type, id) {
    const { taskInfo } = this.state;
    for (var key in taskInfo[type]) {
      delete taskInfo[type][key];
    }
    this.setState({ taskInfo: taskInfo });
  }

  // 删除关注人
  removeCollectUser(user) {
    let { taskInfo } = this.state;
    let oldGzr = taskInfo.collectUser;
    let newGzr = [];
    if (oldGzr && oldGzr.length > 0) {
      oldGzr.map(item => {
        if (item.userid != user.userid) {
          newGzr.push(item);
        }
      });
    }
    taskInfo.collectUser = newGzr;
    this.setState({ taskInfo: taskInfo });
  }

  // 编辑对应的值
  editVal(val, type, editorTxtNull) {
    let { taskInfo, projectListData, taskNameLength } = this.state;
    // 判断所选择的项目是否是已经有的项目，如果没有，则自动新建项目
    if (type === "objId") {
      if (
        projectListData &&
        projectListData.filter(value => value.proname === val).length === 0
      ) {
        let { taskInfo } = this.state;
        taskInfo[type] = { id: "", name: val };
        this.setState({ taskInfo: taskInfo });
      } else {
        let { taskInfo } = this.state;
        projectListData.map((item, i) => {
          if (item.proname === val) {
            taskInfo[type] = { id: item.id };
            this.setState({ taskInfo: taskInfo });
            return false;
          }
        });
      }
    } else if (type == "name") {
      taskInfo[type] = val;
      taskNameLength = getByteLen(val.slice(0, 50));
      this.setState({ taskNameLength: taskNameLength });
    } else if (type == "desc") {
      let txt = val;
      if (editorTxtNull) {
        txt = "";
      }
      taskInfo[type] = txt;
    } else {
      taskInfo[type] = val;
    }
    this.setState({ taskInfo: taskInfo });
  }

  // 获取项目列表
  projectList(pageNo = 1, proname) {
    if (pageNo === 1) {
      this.setState({ projectListLoading: true });
    } else {
      this.setState({ projectListMoreLoading: true });
    }
    getProListByJurisdiction(
      "10",
      pageNo,
      data => {
        if (data.err) {
          return false;
        }
        if (data.pageNo === 1) {
          this.setState({ projectListData: data.list ? data.list : [] });
        } else {
          let projectListData = JSON.parse(
            JSON.stringify(this.state.projectListData)
          );
          data.list &&
            data.list.map(item => {
              projectListData.push(item);
            });
          this.setState({
            projectListData: projectListData
          });
        }
        let { taskInfo } = this.state;
        this.setState({
          taskInfo: taskInfo,
          projectListNowPage: data.pageNo,
          projectListAllPage: data.last,
          projectListLoading: false,
          projectListMoreLoading: false
        });
        // this.setState({});
      },
      proname
    );
  }
  //项目列表下拉加载
  scrollBottom(e) {
    const {
      projectListNowPage,
      projectListAllPage,
      projectListMoreLoading
    } = this.state;
    const isOnButtom = listScroll(e);
    if (
      (isOnButtom === true || isOnButtom === undefined) &&
      projectListNowPage < projectListAllPage &&
      !projectListMoreLoading
    ) {
      this.projectList(projectListNowPage + 1);
    }
  }
  // 创建任务
  createTaskData() {
    const { taskInfo } = this.state;
    this.setState(
      {
        createLoading: true
      },
      () => {
        let updateData = { taskname: taskInfo.name };
        if (taskInfo.desc !== "") {
          updateData.description = taskInfo.desc;
        }
        if (taskInfo.fzr.userid !== "") {
          updateData.userResponse = {};
          updateData.userResponse.userid = taskInfo.fzr.userid;
        }
        if (taskInfo.shr.userid !== "") {
          updateData.userFlow = {};
          updateData.userFlow.userid = taskInfo.shr.userid;
        }
        if (taskInfo.wcrq !== "") {
          updateData.planEndTimeString = taskInfo.wcrq;
        }
        if (taskInfo.yjgq !== "") {
          updateData.workTime = taskInfo.yjgq;
        }
        if (taskInfo.rwjx !== "") {
          updateData.flowConten = taskInfo.rwjx;
        }
        if (taskInfo.zycd !== "") {
          updateData.coefficienttype = taskInfo.zycd;
        }
        if (taskInfo.filesList.length > 0) {
          updateData.fileList = taskInfo.filesList;
        }
        let projectId = "";
        if (taskInfo.objId.id) {
          projectId = taskInfo.objId.id;
        } else if (taskInfo.objId.name) {
          updateData.proname = taskInfo.objId.name;
        }
        let labels = [];
        if (taskInfo.tags && taskInfo.tags.length > 0) {
          updateData.labels = taskInfo.tags;
        }
        if (taskInfo.collectUser && taskInfo.collectUser.length > 0) {
          let gzruserids = [];
          taskInfo.collectUser.map(item => {
            gzruserids.push(item.userid);
          });
          updateData.collectUserList = gzruserids;
        }
        updateData.joinProject = taskInfo.joinProject;
        createTask(projectId, taskInfo.parentId, updateData, res => {
          if (res.err) {
            this.setState({
              createLoading: false
            });
            return false;
          }
          message.success("创建成功！");
          this.setState({
            createLoading: false
          });
          this.props.closedCallBack();
          if (this.props.successCallBack) {
            this.props.successCallBack(taskInfo.parentId, taskInfo.objId.id);
          }
        });
      }
    );
  }

  // 选人
  selUser(title) {
    title = title;
    let selectedUsers = [];
    let { taskInfo } = this.state;
    let multiple = false;
    if (title === "负责人") {
      selectedUsers.push(taskInfo.fzr);
    } else if (title === "确认人") {
      selectedUsers.push(taskInfo.shr);
    } else if (title == "关注人") {
      multiple = true;
      const gzr = taskInfo.collectUser;
      selectedUsers = gzr;
    }
    const that = this;
    dingJS.selectUser(
      selectedUsers,
      "请选择" + title,
      data => {
        //console.log("钉钉返回的人员有：",data)
        if (!data) {
          return false;
        }
        const user = data[0];
        if (!user) {
          return false;
        }
        if (title === "负责人") {
          if (data[0].emplId !== taskInfo.fzr.userid) {
            taskInfo.fzr = { userid: data[0].emplId, name: data[0].name };
            that.setState({ taskInfo: taskInfo });
          }
        } else if (title === "确认人") {
          if (data[0].emplId !== taskInfo.shr.userid) {
            taskInfo.shr = { userid: data[0].emplId, name: data[0].name };
            that.setState({ taskInfo: taskInfo });
          }
        } else if (title === "关注人") {
          let gzr = [];
          data.map(item => {
            gzr.push({ userid: item.emplId, name: item.name });
          });
          if (data && data.length > 20) {
            // taskInfo.collectUser = gzr;
            that.setState({
              // taskInfo: taskInfo,
              limitArr: gzr,
              limitAttention: true,
              resLength: data.length
            });
          } else {
            taskInfo.collectUser = gzr;
            that.setState({
              // taskInfo: taskInfo,
              // joinProject: true,
              limitArr: gzr,
              resLength: data.length
            });
          }
        }
      },
      multiple
    );
  }
  //加入项目成员
  confirmPopconfirmSecond = () => {
    const { taskInfo } = this.state;
    taskInfo.joinProject = false;
    this.setState({
      taskInfo: taskInfo,
      joinProject: false,
      limitAttention: false
    });
  };
  //不加入项目成员
  canclePopconfirmSecond = () => {
    const { taskInfo } = this.state;
    this.setState({
      taskInfo: taskInfo,
      joinProject: false,
      limitAttention: false
    });
  };
  // 删除上传附件 钉钉组件
  dellDescFileById(id) {
    let { taskInfo } = this.state;
    taskInfo.filesList.map((item, i) => {
      if ((item.fileId && item.fileId === id) || (item.id && item.id === id)) {
        taskInfo.filesList.splice(i, 1);
        this.setState({ taskInfo: taskInfo });
        return false;
      }
    });
  }

  // 上传附件 钉钉组件
  updataFile() {
    let { taskInfo } = this.state;
    dingJS.uploadImage(result => {
      const data = result.data;
      if (data && data.length > 0) {
        data.map((item, i) => {
          taskInfo.filesList.push(item);
        });
        this.setState({ taskInfo: taskInfo });
      }
    }, true);
  }

  // 上传/删除图片 本地组件
  uploadListOnChange_desc(list) {
    this.setState({ uploadList_desc: list.fileList });
    const { taskInfo } = this.state;
    if (list.file.status === "done") {
      taskInfo.filesList.push({
        id: list.file.response.data.id,
        uid: list.file.uid
      });
      this.setState({ taskInfo: taskInfo });
    } else if (list.file.status === "removed") {
      const { taskInfo } = this.state;
      taskInfo.filesList.map((item, i) => {
        if (item.uid === list.file.uid) {
          taskInfo.filesList.splice(i, 1);
          this.setState({ taskInfo: taskInfo });
          return false;
        }
      });
    }
  }

  // 粘贴图片 本地
  pasteingImg(e) {
    pasteImg(e, url => {
      updateImgsInService(url, data => {
        if (data.err) {
          return false;
        }
        const fileObj = data;
        fileObj.type = "";
        fileObj.uid = fileObj.id;
        let { taskInfo } = this.state;
        taskInfo.filesList.push(fileObj);
        this.setState({ taskInfo: taskInfo });

        // 处理给上传控件
        let { uploadList_desc } = this.state;
        uploadList_desc.push({
          uid: fileObj.id,
          name: fileObj.fileName,
          status: "done",
          url: fileObj.fileUrlAbsolute
        });
        this.setState({ uploadList_desc: uploadList_desc });
      });
    });
  }

  changeQuickType(e) {
    this.setState({ showMore: e });
    Storage.setLocal("showMoreAdddTask", e);
  }

  tagChange(tag) {
    let { taskInfo } = this.state;
    let tags = [];
    tag.map(item => {
      item.labelname = item.name;
      tags.push(item);
    });
    taskInfo.tags = tags;
    this.setState({ taskInfo: taskInfo });
  }
  dateTimeChange(date, time) {
    const { taskInfo } = this.state;
    if (date === "") {
      time = "";
    } else if (time === "") {
      taskInfo.wcrq = date + " 00:00:00";
      time = "";
    } else if (time == "00:00") {
      taskInfo.wcrq = date + " " + time + ":02";
    } else {
      taskInfo.wcrq = date + " " + time + ":00";
    }
    this.setState({
      taskInfo: taskInfo,
      taskPlanDate: date,
      taskPlanTime: time
    });
  }
  timePlanChange() {
    const { taskPlanDate } = this.state;
    if (taskPlanDate === "") {
      message.info("请选择日期");
    }
  }
  clearTime(time) {
    const { taskPlanTime, taskInfo, taskPlanDate } = this.state;
    taskInfo.wcrq = taskPlanDate + " 00:00:00";
    this.state.taskPlanTime = time;
    this.setState({ taskInfo: taskInfo });
  }
  render() {
    const {
      showMore,
      taskInfo,
      uploadList_desc,
      breadShow,
      taskNameLength,
      previewVisible,
      previewImage,
      projectListNowPage,
      projectListAllPage,
      projectListData,
      taskPlanDate,
      taskPlanTime,
      breadList,
      descDetailsShow,
      projectListLoading,
      projectListMoreLoading,
      createLoading,
      limitAttention,
      resLength,
      joinProject,
      limitArr
    } = this.state;
    const projectList = projectListData.map((item, i) => {
      return (
        <Option
          key={item.id}
          value={item.proname && item.proname}
          disabled={item.create === "false" ? true : false}
        >
          {/* {item.proname} */}
          {item.create === "false" ? (
            <div>
              {item.proname && item.proname}
              <span className="createFalse">没有创建权限</span>
            </div>
          ) : (
            item.proname && item.proname
          )}
        </Option>
      );
    });
    const that = this;

    let create = true;
    if (taskInfo.objId.id && breadShow && taskInfo.name) {
      create = false;
    } else if (
      (taskInfo.objId.name || taskInfo.objId.id) &&
      !breadShow &&
      taskInfo.name
    ) {
      create = false;
    }
    let newDate = new Date();
    let newYear = newDate.getFullYear();
    let newMonth = newDate.getMonth() + 1;
    let newDay = newDate.getDate();
    let newHours = newDate.getHours();
    let newMinutes = newDate.getMinutes();
    let newDateTime = newYear + "-" + newMonth + "-" + newDay;
    let newDateTimes = newHours + ":" + newMinutes;
    return (
      <Modal
        title="创建任务"
        visible={true}
        width={620}
        maskClosable={false}
        wrapClassName="taskCreatModal"
        onCancel={() => {
          this.props.closedCallBack();
        }}
        footer={[
          <Button
            key="back"
            type="back"
            onClick={() => {
              this.props.closedCallBack();
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            //     create=false &&createLoading=false
            disabled={create || createLoading}
            className={create || createLoading ? "button_create" : ""}
            onClick={() => {
              this.createTaskData();
            }}
          >
            创建
          </Button>
        ]}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="createModal">
          <div className="switch">
            <div className="ant-radio-group ant-radio-group-outline">
              <label
                onClick={() => {
                  this.changeQuickType("a");
                }}
                className={
                  showMore == "a"
                    ? "ant-radio-button-wrapper ant-radio-button-wrapper-checked"
                    : "ant-radio-button-wrapper"
                }
              >
                <span>快速</span>
              </label>
              <label
                onClick={() => {
                  this.changeQuickType("b");
                }}
                className={
                  showMore == "b"
                    ? "ant-radio-button-wrapper ant-radio-button-wrapper-checked"
                    : "ant-radio-button-wrapper"
                }
              >
                <span>完整</span>
              </label>
            </div>
          </div>
          <div className="modalTop">
            {breadShow && breadList.length > 0 ? (
              <div className="bread">
                {breadList[0].taskname !== "" ? (
                  <span className="projectBread">所属项目：</span>
                ) : (
                  ""
                )}
                <Breadcrumb>
                  <Breadcrumb.Item className="breadOne">
                    {breadList[0].taskname}
                  </Breadcrumb.Item>
                  {breadList.length > 1 &&
                    breadList.map((item, i) => {
                      if (i > 0) {
                        return (
                          <Breadcrumb.Item className="breadTwo" key={item.id}>
                            {item.taskname}
                          </Breadcrumb.Item>
                        );
                      }
                    })}
                </Breadcrumb>
              </div>
            ) : (
              ""
            )}
            {!breadShow && (
              <div className="proname create">
                <span>所属项目：</span>
                <div className="rightDesc">
                  <Select
                    style={{ width: "100%" }}
                    onChange={value => {
                      this.editVal(value, "objId");
                      this.projectList(1, value);
                    }}
                    mode="combobox"
                    placeholder="请选择所属项目"
                    onFocus={() => {
                      this.projectList();
                    }}
                    onPopupScroll={e => {
                      this.scrollBottom(e);
                    }}
                  >
                    {projectList}
                    {!projectListMoreLoading &&
                    projectListNowPage === projectListAllPage ? (
                      <Option value="disabled" disabled>
                        已经到底喽
                      </Option>
                    ) : (
                      ""
                    )}
                    {!projectListMoreLoading &&
                    projectListNowPage < projectListAllPage ? (
                      <Option value="disabled" disabled>
                        下拉加载更多
                      </Option>
                    ) : (
                      ""
                    )}
                    {projectListMoreLoading ? (
                      <Option value="disabled" disabled>
                        <Icon type="loading" style={{ margin: "0 7px 0 0" }} />
                        正在加载更多
                      </Option>
                    ) : (
                      ""
                    )}
                  </Select>
                </div>
              </div>
            )}
            <div className="taskname create">
              <span>任务名称：</span>
              <div className="rightDescTask">
                <Input
                  placeholder="建议不超过50个字"
                  className="input"
                  autoFocus={true}
                  value={taskInfo.name.slice(0, 50)}
                  onChange={e => {
                    this.editVal(e.target.value, "name");
                  }}
                />
                <div className="titnum">
                  <span className="titlength">{taskNameLength}</span>/50
                </div>
              </div>
            </div>
            <div className={showMore == "b" ? "taskDesc create" : "noCreate"}>
              <span>描述：</span>
              <div className="rightDesc taskDiv">
                <TextArea
                  placeholder="请输入任务描述（tips：截图可Ctr+V快速上传~）"
                  autosize={{ minRows: 1, maxRows: 6 }}
                  value={taskInfo.desc}
                  onChange={(e, txtNull) => {
                    this.editVal(e.target.value, "desc", txtNull);
                  }}
                  onPaste={e => {
                    this.pasteingImg(e);
                  }}
                  onFocus={() => {
                    this.setState({ descDetailsShow: true });
                  }}
                />
                <div
                  className={
                    descDetailsShow ? "clearfix" : " clearfix noclearfix"
                  }
                >
                  <Upload
                    action={baseURI + "/files/upload"}
                    listType="picture-card"
                    fileList={uploadList_desc}
                    onPreview={this.handlePreview}
                    multiple={true}
                    onChange={val => {
                      if (beforeUpload(val.file)) {
                        this.uploadListOnChange_desc(val);
                      }
                    }}
                  >
                    {/* {uploadButton} */}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={() => {
                      this.setState({ previewVisible: false });
                    }}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
                {descDetailsShow ? (
                  <div className="fileTitle">
                    附件
                    <i
                      // type="paper-clip"
                      className="iconfont icon-md-attach clip"
                      // className="clip"
                      onClick={() => {
                        this.updataFile();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {descDetailsShow
                  ? taskInfo.filesList &&
                    taskInfo.filesList.length > 0 && (
                      <div className="fileList">
                        {taskInfo.filesList.map((item, i) => {
                          if (item.fileId) {
                            return (
                              <div className="file" key={item.fileId}>
                                <p>{item.fileType}</p>
                                <div className="fileName textMore">
                                  {item.fileName}
                                </div>
                                <div className="icon">
                                  <i
                                    // type="download"iconfont icon-download
                                    className="iconfont icon-download"
                                    onClick={() => dingJS.previewImage(item)}
                                  />
                                  <i
                                    // type="delete"
                                    className="iconfont icon-icon_huabanfuben5"
                                    onClick={() => {
                                      this.dellDescFileById(item.fileId);
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )
                  : ""}
              </div>
            </div>
            {showMore == "b" ? (
              <div className="tagList">
                <i className="icon iconfont icon-biaoqian1 icon" />
                <div className="tit">标签</div>
                <div
                  className="valBox"
                  style={{ margin: "0", padding: "0 10px 0 0" }}
                >
                  <TagComponent
                    tagSelecteds={taskInfo.tags}
                    canAdd={true}
                    canEdit={true}
                    tagChangeCallBack={val => {
                      this.tagChange(val);
                    }}
                    maxHeight="300px"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {showMore == "a" ? (
              <div className="modalMore">
                <div className="moreList">
                  <i className="iconfont icon-fuzeren1" />
                  <span>负责人</span>
                  <div
                    className="inputBox"
                    onClick={() => {
                      this.selUser("负责人");
                    }}
                  >
                    {taskInfo.fzr.userid ? (
                      <div className="person">
                        <span>{taskInfo.fzr.name}</span>
                        <svg
                          aria-hidden="true"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            that.remove("fzr", taskInfo.fzr.userid);
                          }}
                          className="close"
                        >
                          <use xlinkHref="#pro-myfg-yichu" />
                        </svg>
                      </div>
                    ) : (
                      "请选择"
                    )}
                  </div>
                </div>
                <div className="moreList">
                  <i className="iconfont icon-riqi1" />
                  <span>截止时间</span>
                  <div className="inputBox dateTimeBox">
                    <div
                      className="dateBox"
                      style={
                        taskPlanDate !== ""
                          ? { color: "rgba(0,0,0,.65)" }
                          : { color: "transparent" }
                      }
                    >
                      <DatePicker
                        placeholder="请选择日期"
                        className="date"
                        value={
                          taskPlanDate !== ""
                            ? moment(taskPlanDate, "YYYY-MM-DD")
                            : moment(newDateTime, "YYYY-MM-DD")
                        }
                        onChange={(date, dateString) => {
                          this.dateTimeChange(dateString, taskPlanTime);
                        }}
                        format="YYYY-MM-DD"
                      />
                      {taskPlanDate !== "" ? (
                        ""
                      ) : (
                        <span className="placeHolder">请选择日期</span>
                      )}
                    </div>
                    <div
                      className="timeBox"
                      onClick={() => {
                        this.timePlanChange();
                      }}
                      style={
                        taskPlanTime !== ""
                          ? { color: "rgba(0,0,0,.65)" }
                          : { color: "transparent" }
                      }
                    >
                      <TimePicker
                        placeholder="时间"
                        className="date"
                        value={
                          taskPlanTime !== ""
                            ? moment(taskPlanTime, "HH:mm")
                            : moment(newDateTimes, "HH:mm")
                        }
                        disabled={taskPlanDate === "" ? true : false}
                        onChange={(date, dateString) => {
                          this.dateTimeChange(taskPlanDate, dateString);
                        }}
                        format="HH:mm"
                      />
                      {taskPlanTime !== "" ? (
                        ""
                      ) : (
                        <span
                          className="placeHolder"
                          style={taskPlanDate === "" ? { zIndex: "30" } : {}}
                        >
                          时间
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {showMore == "b" ? (
            <div className="modalMore">
              <div className="leftBox">
                <div className="moreList">
                  <i className="iconfont icon-fuzeren1" />
                  <span>负责人</span>
                  <div
                    className="inputBox"
                    onClick={() => {
                      this.selUser("负责人");
                    }}
                  >
                    {taskInfo.fzr.userid ? (
                      <div className="person">
                        <span>{taskInfo.fzr.name}</span>
                        <svg
                          aria-hidden="true"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            that.remove("fzr", taskInfo.fzr.userid);
                          }}
                          className="close"
                        >
                          <use xlinkHref="#pro-myfg-yichu" />
                        </svg>
                      </div>
                    ) : (
                      "请选择"
                    )}
                  </div>
                </div>
                <div className="moreList">
                  <i className="iconfont icon-riqi1" />
                  <span>截止时间</span>
                  <div className="inputBox dateTimeBox">
                    <div
                      className="dateBox"
                      style={
                        taskPlanDate !== ""
                          ? { color: "rgba(0,0,0,.65)" }
                          : { color: "transparent" }
                      }
                    >
                      <DatePicker
                        placeholder="请选择日期"
                        className="date"
                        value={
                          taskPlanDate !== ""
                            ? moment(taskPlanDate, "YYYY-MM-DD")
                            : moment(newDateTime, "YYYY-MM-DD")
                        }
                        onChange={(date, dateString) => {
                          this.dateTimeChange(dateString, taskPlanTime);
                        }}
                        format="YYYY-MM-DD"
                      />
                      {taskPlanDate !== "" ? (
                        ""
                      ) : (
                        <span className="placeHolder">请选择日期</span>
                      )}
                    </div>
                    <div
                      className="timeBox"
                      onClick={() => {
                        this.timePlanChange();
                      }}
                      style={
                        taskPlanTime !== ""
                          ? { color: "rgba(0,0,0,.65)" }
                          : { color: "transparent" }
                      }
                    >
                      <TimePicker
                        placeholder="时间"
                        className="date"
                        value={
                          taskPlanTime !== ""
                            ? moment(taskPlanTime, "HH:mm")
                            : moment(newDateTimes, "HH:mm")
                        }
                        disabled={taskPlanDate === "" ? true : false}
                        onChange={(date, dateString) => {
                          this.dateTimeChange(taskPlanDate, dateString);
                        }}
                        format="HH:mm"
                      />
                      {taskPlanTime !== "" ? (
                        ""
                      ) : (
                        <span
                          className="placeHolder"
                          style={taskPlanDate === "" ? { zIndex: "30" } : {}}
                        >
                          时间
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="moreList">
                  <i className="iconfont icon-yujigongqi" />
                  <span>计划工期</span>
                  <div className="inputBox">
                    <Input
                      className="inputNumber"
                      placeholder="请输入"
                      value={taskInfo.yjgq}
                      onChange={e => {
                        onlyNumber(e.target);
                        this.editVal(e.target.value, "yjgq");
                      }}
                    />
                    <span className="day">天</span>
                  </div>
                </div>
              </div>
              <div className="rightBox">
                <div className="moreList">
                  <i className="iconfont icon-shenheren1" />
                  <span>确认人</span>
                  <div
                    className="inputBox"
                    onClick={() => {
                      this.selUser("确认人");
                    }}
                  >
                    {taskInfo.shr.userid ? (
                      <div className="person">
                        <span>{taskInfo.shr.name}</span>
                        <svg
                          aria-hidden="true"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            that.remove("shr", taskInfo.shr.userid);
                          }}
                          className="close"
                        >
                          <use xlinkHref="#pro-myfg-yichu" />
                        </svg>
                      </div>
                    ) : (
                      "请选择"
                    )}
                  </div>
                </div>
                <div className="moreList">
                  <i className="iconfont icon-jixiao" />
                  <span>任务绩效</span>
                  <div className="inputBox">
                    <Input
                      className="inputNumber"
                      placeholder="请输入数字"
                      onChange={e => {
                        onlyNumber(e.target);
                        this.editVal(e.target.value, "rwjx");
                      }}
                    />
                  </div>
                </div>
                <div className="moreList">
                  <i className="iconfont icon-youxianji" />
                  <span>优先级</span>
                  <div className="inputBox">
                    <Select
                      defaultValue="请选择"
                      className={taskInfo.zycd == "0" ? "selectNo" : "select"}
                      value={taskInfo.zycd}
                      onChange={value => {
                        this.editVal(value, "zycd");
                      }}
                    >
                      <Option value="0">请选择</Option>
                      <Option value="3">高</Option>
                      <Option value="2">中</Option>
                      <Option value="1">低</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {showMore == "b" ? (
            <div className="modalMore">
              <div className="listMore">
                <i className="iconfont icon-fuzeren1" />
                <span>关注人</span>
                <div className="gzrMore">
                  <div className="plusBox">
                    <Popconfirm
                      title={`您刚刚选择了${resLength}个人，是否要全部添加为关注人？`}
                      visible={limitAttention}
                      onConfirm={() => {
                        taskInfo.collectUser = limitArr;
                        this.setState({
                          taskInfo: taskInfo
                        });
                        this.confirmPopconfirmSecond();
                      }}
                      onCancel={() => {
                        taskInfo.collectUser = [];
                        this.setState({
                          limitAttention: false,
                          taskInfo: taskInfo
                        });
                      }}
                      okText={joinProject ? "加入" : "添加"}
                      cancelText={joinProject ? "不加入" : "取消"}
                    >
                      <i
                        className="iconfont icon-add2"
                        style={{ color: "#bdbdbd" }}
                        onClick={() => {
                          this.selUser("关注人");
                        }}
                      />
                    </Popconfirm>
                  </div>
                  {taskInfo.collectUser && taskInfo.collectUser.length > 0
                    ? taskInfo.collectUser.map(item => {
                        return (
                          <div className="person">
                            <span>{item.name}</span>
                            <svg
                              aria-hidden="true"
                              onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                that.removeCollectUser(item);
                              }}
                              className="close"
                            >
                              <use xlinkHref="#pro-myfg-yichu" />
                            </svg>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    );
  }
}
