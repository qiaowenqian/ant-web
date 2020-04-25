import React from "react";
import { Input, Button, Upload, DatePicker, Select, message, Modal, Breadcrumb, Popconfirm, Popover, Tooltip, InputNumber } from "antd";
import moment from "moment";
import { createTask, getTaskBreadById, createTaskCycele } from "../core/service/task.service";
import { getProListByJurisdiction } from "../core/service/project.service";
import { updateImgsInService } from "../core/service/file.service";
import { pasteImg, onlyNumber, beforeUpload, listScroll, getByteLen, createFileIcon, getTeamInfoWithMoney } from "../core/utils/util";
import stylesheet from "styles/components/CreatTask.scss";
import { baseURI } from "../core/api/HttpClient";
import dingJS from "../core/utils/dingJSApi";
import Storage from "../core/utils/storage";
import TagComponent from "../components/newtag";
import LoopTask from "../components/task/loopTask";
import RemindTask from "../components/task/remindTask";
const { TextArea } = Input;
const Option = Select.Option;
let changeNum = 0;

export default class CreateTask extends React.Component {
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
        startTime: "",
        yjgq: "1",
        rwjx: "",
        zycd: "0",
        filesList: [],
        tags: [],
        collectUser: []
      },
      previewImage: "",
      uploadList_desc: [],
      projectListData: [], // 项目列表存放
      projectListLoading: false,
      projectListMoreLoading: false,
      projectListNowPage: 1,
      projectListAllPage: 0,
      breadShow: false, // 是否渲染面包屑
      breadList: [],
      taskNameLength: 0,
      taskPlanDate: "",
      taskPlanTime: "",
      createLoading: false,
      dateOrTime: true, //展示年月日还是年月日时分
      dateOrTime2: true, //展示年月日还是年月日时分
      LoopTaskShow: false,
      remindTaskShow: false, //  任务提醒组件
      taskType: "",
      rule: {},
      limitAttention: false,
      limitArr: [], // 关注人列表
      resLength: 0,
      verName: "",
      endOpen: false,
      notification: [], //提醒规则
      notificationCoby: []
    };
  }
  componentWillMount() {
    if (this.props.task) {
      let { taskInfo } = this.state
      taskInfo.parentId = this.props.task.id ? this.props.task.id : ""
      taskInfo.objId.id = this.props.task.projectId
      this.setState({ taskInfo: taskInfo, breadShow: true })
      this.getTaskBread()
    } else {
      this.setState({ breadShow: false })
    }
    let user = Storage.get("user")
    let { taskInfo } = this.state
    taskInfo.fzr = user
    this.setState({ taskInfo: taskInfo, verName: getTeamInfoWithMoney("版本名称") })
  }
  // 获取项目列表
  getProjectList = (pageNo = 1, proname) => {
    if (pageNo === 1) {
      this.setState({ projectListLoading: true })
    } else {
      this.setState({ projectListMoreLoading: true })
    }
    getProListByJurisdiction("10", pageNo, data => {
      if (data.err) { return false }
      if (data.pageNo === 1) {
        this.setState({ projectListData: data.list ? data.list : [] })
      } else {
        let projectListData = JSON.parse(JSON.stringify(this.state.projectListData))
        data.list && data.list.map(item => { projectListData.push(item) })
        this.setState({ projectListData: projectListData })
      }
      let { taskInfo } = this.state
      this.setState({
        taskInfo: taskInfo,
        projectListNowPage: data.pageNo,
        projectListAllPage: data.last,
        projectListLoading: false,
        projectListMoreLoading: false
      });
    }, proname)
  }
  //项目列表下拉加载
  scrollBottom = e => {
    const { projectListNowPage, projectListAllPage, projectListMoreLoading } = this.state
    const isOnButtom = listScroll(e)
    if ((isOnButtom === true || isOnButtom === undefined) && projectListNowPage < projectListAllPage && !projectListMoreLoading) {
      this.getProjectList(projectListNowPage + 1)
    }
  };
  //创建循环任务
  createTaskRule = rule => {
    if (rule === "cancel") {
      this.setState({ rule: {}, LoopTaskShow: false, taskType: "" })
    } else {
      rule.nextExecutionTimeString = moment(rule.nextExecutionTimeString).format("YYYY-MM-DD")
      if (rule.weekDay) { rule.weekDay = rule.weekDay.join(",") }
      if (rule.day) { rule.day = rule.day.toString() }
      if (rule.week) { rule.week = rule.week.toString() }
      if (rule.month) { rule.month = rule.month.toString() }
      if (rule.monthDay) { rule.monthDay = rule.monthDay.toString() }
      rule.isWeekend = rule.isWeekend
      this.setState({ taskType: "cycle", rule: rule, LoopTaskShow: false })
    }
  };
  //设置提醒规则
  setTaskRemind = rem => { this.setState({ notification: rem, notificationCoby: JSON.parse(JSON.stringify(rem)), remindTaskShow: false }) }
  // 创建任务
  createTaskData = () => {
    const { taskInfo, taskType, rule, breadList, notification } = this.state
    this.setState({ createLoading: true },
      () => {
        let updateData = { taskname: taskInfo.name }
        if (taskInfo.desc !== "") { updateData.description = taskInfo.desc }
        if (taskInfo.fzr.userid !== "") { updateData.userResponse = {}; updateData.userResponse.userid = taskInfo.fzr.userid; }
        if (taskInfo.shr.userid !== "") { updateData.userFlow = {}; updateData.userFlow.userid = taskInfo.shr.userid; }
        if (taskInfo.wcrq !== "") { updateData.planEndTimeString = taskInfo.wcrq.length == 10 ? taskInfo.wcrq + " 00:00:00" : taskInfo.wcrq.indexOf("00:00") !== -1 ? taskInfo.wcrq + ":02" : taskInfo.wcrq }
        //开始时间如果没有具体时分，则传给后台的参数+00:00:00 如果有时间且时间为00:00则传给后台参数为00:00:02 其他传格式为YYYY-MM-DD HH:mm
        if (taskInfo.startTime !== "") { updateData.planBeginTimeString = taskInfo.startTime.length == 10 ? taskInfo.startTime + " 00:00:03" : taskInfo.startTime.indexOf("00:00") !== -1 ? taskInfo.startTime + ":02" : taskInfo.startTime }
        if (taskInfo.yjgq !== "") { updateData.workTime = taskInfo.yjgq }
        if (taskInfo.rwjx !== "") { updateData.flowConten = taskInfo.rwjx }
        if (taskInfo.zycd !== "") { updateData.coefficienttype = taskInfo.zycd }
        if (taskInfo.filesList.length > 0) { updateData.fileList = taskInfo.filesList }
        updateData.attstr03 = JSON.stringify(notification);
        let projectId = "";
        if (taskInfo.objId.id) { projectId = taskInfo.objId.id; } else if (taskInfo.objId.name) {
          updateData.proname = taskInfo.objId.name;
        }
        if (taskInfo.tags && taskInfo.tags.length > 0) { updateData.labels = taskInfo.tags }
        if (taskInfo.collectUser && taskInfo.collectUser.length > 0) {
          let gzruserids = [];
          taskInfo.collectUser.map(item => { gzruserids.push(item.userid) })
          updateData.collectUserList = gzruserids
        }
        updateData.joinProject = false;
        if (taskType === "cycle") {
          if (breadList && breadList.length > 0 && breadList[breadList.length - 1].parentIds) {
            updateData.parentIds = breadList[breadList.length - 1].parentIds + "," + breadList[breadList.length - 1].id;
            updateData.parent = { id: breadList[breadList.length - 1].id };
          } else {
            updateData.parent = { id: "0" }; updateData.parentIds = "0";
          }
          let cycleDate = Object.assign(updateData, rule);
          createTaskCycele(projectId, cycleDate, res => {
            if (res.err) { this.setState({ createLoading: false }); return false }
            message.success("创建成功！");
            this.setState({ createLoading: false });
            this.props.closedCallBack();
            if (this.props.successCallBack) { this.props.successCallBack(taskInfo.parentId, taskInfo.objId.id) }
          })
        } else {
          createTask(projectId, taskInfo.parentId, updateData, res => {
            if (res.err) { this.setState({ createLoading: false }); return false }
            message.success("创建成功！")
            this.setState({ createLoading: false })
            this.props.closedCallBack()
            if (this.props.successCallBack) { this.props.successCallBack(taskInfo.parentId, taskInfo.objId.id) }
          })
        }
      }
    )
  }

  //获取面包屑
  getTaskBread = () => {
    getTaskBreadById(this.props.task.projectId, this.props.task.id, res => {
      if (res.err) { return false }
      this.setState({ breadList: res.parentList })
    })
  }
  //编辑创建任务的表单
  editVal = (val, type, editorTxtNull) => {
    let { taskInfo, projectListData, taskNameLength } = this.state
    // 判断所选择的项目是否是已经有的项目，如果没有，则自动新建项目
    if (type === "objId") {
      if (projectListData && projectListData.filter(value => value.proname === val).length === 0) {
        let { taskInfo } = this.state
        taskInfo[type] = { id: "", name: val }
        this.setState({ taskInfo: taskInfo })
      } else {
        let { taskInfo } = this.state
        projectListData.map((item, i) => {
          if (item.proname === val) {
            taskInfo[type] = { id: item.id }
            this.setState({ taskInfo: taskInfo })
            return false
          }
        })
      }
    } else if (type == "name") {
      taskInfo[type] = val
      taskNameLength = getByteLen(val.slice(0, 50))
      this.setState({ taskNameLength: taskNameLength })
    } else if (type == "desc") {
      let txt = val
      if (editorTxtNull) { txt = "" }
      taskInfo[type] = txt
    } else { taskInfo[type] = val }
    this.setState({ taskInfo: taskInfo });
  };
  //移除负责人 确认人
  remove = type => {
    const { taskInfo } = this.state
    for (var key in taskInfo[type]) { delete taskInfo[type][key] }
    this.setState({ taskInfo: taskInfo })
  };
  //选人
  selUser = title => {
    let selectedUsers = []
    let { taskInfo } = this.state
    let multiple = false
    if (title === "负责人") { selectedUsers.push(taskInfo.fzr) }
    else if (title === "确认人") { selectedUsers.push(taskInfo.shr) }
    else if (title == "关注人") { multiple = true; const gzr = taskInfo.collectUser; selectedUsers = gzr; }
    const that = this;
    dingJS.selectUser(selectedUsers, "请选择" + title,
      data => {
        if (!data) { return false }
        const user = data[0]
        if (!user) { return false }
        if (title === "负责人") {
          if (data[0].emplId !== taskInfo.fzr.userid) {
            taskInfo.fzr = { userid: data[0].emplId, name: data[0].name, photo: data[0].avatar }
            that.setState({ taskInfo: taskInfo })
          }
        } else if (title === "确认人") {
          if (data[0].emplId !== taskInfo.shr.userid) {
            taskInfo.shr = { userid: data[0].emplId, name: data[0].name, photo: data[0].avatar }
            that.setState({ taskInfo: taskInfo })
          }
        } else if (title === "关注人") {
          let gzr = []
          data.map(item => {
            gzr.push({ userid: item.emplId, name: item.name, photo: item.avatar })
          })
          if (data && data.length > 20) {
            that.setState({ limitArr: gzr, limitAttention: true, resLength: data.length })
          } else {
            taskInfo.collectUser = gzr;
            that.setState({ limitArr: gzr, resLength: data.length })
          }
        }
      },
      multiple
    );
  };
  //选择标签
  tagChange = tag => {
    let { taskInfo } = this.state
    let tags = []
    tag.map(item => { item.labelname = item.name; tags.push(item) })
    taskInfo.tags = tags
    this.setState({ taskInfo: taskInfo })
  }
  //切换日期时间面板改变时间展示格式，，mode 为 time 时 展示 年月日 时分， 为date时展示　年月日
  //截止时间切换展示 时间格式方法
  modeChange = (date, mode) => {
    if (mode === "time") { this.setState({ dateOrTime: false }) }
  };
  //开始时间切换展示 时间格式方法
  modeChange2 = (date, mode) => {
    if (mode === "time") { this.setState({ dateOrTime2: false }) }
  }
  //截止时间改变
  dateChange = (date, dataStr) => {
    const { taskInfo } = this.state
    //点击清除时间是恢复为YYYY-MM-DD
    if (dataStr === "") { this.setState({ dateOrTime: true }) }
    taskInfo.wcrq = dataStr
    let begin = ""
    let end = ""
    if (taskInfo.wcrq.length <= 10) {
      end = taskInfo.wcrq + " 23:59"
    } else {
      end = taskInfo.wcrq
    }
    if (taskInfo.startTime.length <= 10) {
      begin = taskInfo.startTime + " 00:00"
    } else {
      begin = taskInfo.startTime
    }
    if (taskInfo.startTime !== "" && changeNum == 0 && dataStr !== "") {
      if ((moment(end).diff(moment(begin), "second") / (24 * 60 * 60)).toFixed(2) == 0) {
        taskInfo.yjgq = Math.floor((moment(end).diff(moment(begin), "second") / (24 * 60 * 60))) / 100
      } else {
        taskInfo.yjgq = (moment(end).diff(moment(begin), "second") / (24 * 60 * 60)).toFixed(2);
      }
    }
    this.setState({ taskInfo: taskInfo })
  };
  //开始时间改变
  dateChange2 = (date, dataStr) => {
    console.log(dataStr, "123");

    const { taskInfo } = this.state
    if (dataStr === "") { this.setState({ dateOrTime2: true }) }
    taskInfo.startTime = dataStr
    let begin = ""
    let end = ""
    if (taskInfo.wcrq.length <= 10) {
      end = taskInfo.wcrq + " 23:59"
    } else {
      end = taskInfo.wcrq
    }
    if (taskInfo.startTime.length <= 10) {
      begin = taskInfo.startTime + " 00:00"
    } else {
      begin = taskInfo.startTime
    }
    if (taskInfo.wcrq !== "" && changeNum == 0 && dataStr !== "") {
      if ((moment(end).diff(moment(begin), "second") / (24 * 60 * 60)).toFixed(2) == 0) {
        taskInfo.yjgq = Math.floor((moment(end).diff(moment(begin), "second") / (24 * 60 * 60))) / 100
      } else {
        taskInfo.yjgq = (moment(end).diff(moment(begin), "second") / (24 * 60 * 60)).toFixed(2);
      }
    }
    this.setState({ taskInfo: taskInfo })
  };
  //Ctrl+V 粘贴图片是的处理方法
  pasteingImg = e => {
    pasteImg(e, url => {
      updateImgsInService(url, data => {
        if (data.err) { return false }
        const fileObj = data
        fileObj.type = ""
        fileObj.uid = fileObj.id
        let { taskInfo } = this.state
        taskInfo.filesList.push(fileObj)
        this.setState({ taskInfo: taskInfo })
        let { uploadList_desc } = this.state
        uploadList_desc.push({ uid: fileObj.id, name: fileObj.fileName, status: "done", url: fileObj.fileUrlAbsolute })
        this.setState({ uploadList_desc: uploadList_desc })
      })
    })
  }
  // 上传附件 钉钉组件
  updataFile = () => {
    let { taskInfo } = this.state
    dingJS.uploadImage(result => {
      const data = result.data;
      if (data && data.length > 0) {
        data.map((item, i) => { taskInfo.filesList.push(item) })
        this.setState({ taskInfo: taskInfo })
      }
    }, true)
  }
  // 上传/删除图片 本地组件
  uploadListOnChange_desc(list) {
    this.setState({ uploadList_desc: list.fileList })
    const { taskInfo } = this.state
    if (list.file.status === "done") {
      taskInfo.filesList.push({ id: list.file.response.data.id, uid: list.file.uid })
      this.setState({ taskInfo: taskInfo })
    } else if (list.file.status === "removed") {
      const { taskInfo } = this.state
      taskInfo.filesList.map((item, i) => {
        if (item.uid === list.file.uid) { taskInfo.filesList.splice(i, 1); this.setState({ taskInfo: taskInfo }); return false }
      })
    }
  }
  // 删除上传附件 钉钉组件
  dellDescFileById = id => {
    let { taskInfo } = this.state
    taskInfo.filesList.map((item, i) => {
      if ((item.fileId && item.fileId === id) || (item.id && item.id === id)) {
        taskInfo.filesList.splice(i, 1)
        this.setState({ taskInfo: taskInfo })
        return false
      }
    })
  }
  // 删除关注人
  removeCollectUser = user => {
    let { taskInfo } = this.state
    let oldGzr = taskInfo.collectUser
    let newGzr = []
    if (oldGzr && oldGzr.length > 0) { oldGzr.map(item => { if (item.userid != user.userid) { newGzr.push(item) } }) }
    taskInfo.collectUser = newGzr
    this.setState({ taskInfo: taskInfo })
  }
  //不可选的开始时间Date，在截止时间存在的情况下 必须大于截止时间
  disabledDateStart = current => {
    return current > moment(this.state.taskInfo.wcrq)
  }
  //不可选的截止时间Date
  disabledDateEnd = current => {
    if (this.state.taskInfo.startTime) { return current <= moment(this.state.taskInfo.startTime) }
  }
  range(start, end) {
    const result = []
    for (let i = start; i < end; i++) { result.push(i) }
    return result
  }
  //不可选开始时间的Time
  disabledDateStartTime = () => {
    const { taskInfo } = this.state
    let endTime = moment(taskInfo.wcrq).format("YYYY-MM-DD")
    let startTime = moment(taskInfo.startTime).format("YYYY-MM-DD")
    if (taskInfo.wcrq !== "" && taskInfo.wcrq.length > 10 && moment(endTime).isSame(startTime)) { //开始时间和截止时间是否是同一天
      return { disabledHours: () => this.range(0, 24).splice(parseInt(moment(taskInfo.wcrq).format("H")), 24) }
    }
  }
  //不可选截止时间Time
  disabledDateEndTime = () => {
    const { taskInfo } = this.state
    let endTime = moment(taskInfo.wcrq).format("YYYY-MM-DD")
    let startTime = moment(taskInfo.startTime).format("YYYY-MM-DD")
    if (taskInfo.startTime !== "" && taskInfo.startTime.length > 10 && moment(endTime).isSame(startTime)) { //开始时间和截止时间是否是同一天
      return { disabledHours: () => this.range(0, 24).splice(0, parseInt(moment(taskInfo.startTime).format("H")) + 1) }
    }
  }
  render() {
    const {
      taskInfo, uploadList_desc, breadShow, taskNameLength, projectListNowPage, projectListAllPage,
      projectListData, breadList, projectListMoreLoading, createLoading, dateOrTime, dateOrTime2, notificationCoby,
      LoopTaskShow, remindTaskShow, rule, limitAttention, resLength, limitArr, taskType, verName, notification
    } = this.state
    let create = true
    if (taskInfo.objId.id && breadShow && taskInfo.name) { create = false }
    else if ((taskInfo.objId.name || taskInfo.objId.id) && !breadShow && taskInfo.name) { create = false }
    const projectList = projectListData.map((item, i) => {
      return (
        <Option key={item.proname} disabled={item.create === "false" ? true : false} >
          {item.create === "false" ? (
            <div>{item.proname && item.proname} <span className="createFalse">没有创建权限</span> </div>
          ) : (item.proname && item.proname)}
        </Option>
      )
    })
    const loopContent = (
      <LoopTask creatTaskRule={rule => { this.createTaskRule(rule) }} showBtn={"2"} clear={true} taskCreateVals={rule} />
    )
    const remindContent = (
      <RemindTask taskRemindVals={notification} setRemind={remind => { this.setTaskRemind(remind) }} />
    )
    return (
      <div>
        <Modal
          title={<div onClick={() => { this.setState({ remindTaskShow: false, LoopTaskShow: false, notification: JSON.parse(JSON.stringify(notificationCoby)) }) }} >创建任务</div>}
          closable={false}
          visible={true}
          maskClosable={false}
          wrapClassName="taskCreatModal"
          width={700}
          onCancel={() => { this.props.closedCallBack() }}
          footer={[
            <div onClick={() => { this.setState({ remindTaskShow: false, LoopTaskShow: false, notification: JSON.parse(JSON.stringify(notificationCoby)) }) }} >
              <Button key="back" type="back" onClick={() => { this.props.closedCallBack(); changeNum = 0 }} >取消</Button>
              <Button key="submit" type={create || createLoading ? "" : "primary"} disabled={create || createLoading}
                className={create || createLoading ? "button_create" : ""}
                onClick={() => { this.createTaskData(); changeNum = 0 }}
              >
                创建
              </Button>
            </div>
          ]}
        >
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Tooltip
            trigger="hover"
            title={verName === "基础版" || verName === "免费版" || verName === "试用版" || verName === "" ? "重复规则(专业版功能)" : "重复规则"}
          >
            <div className="topIcon" id="box">
              <Popover content={loopContent} overlayClassName="loopPopover" title="" trigger="click" visible={LoopTaskShow && notification.length == 0} placement="bottom" getPopupContainer={() => document.getElementById("box")}>
                <i className="iconfont icon-xunhuan xuanhuan"
                  onClick={() => {
                    if (verName == "基础版" || verName === "免费版") { } else { this.setState({ LoopTaskShow: !LoopTaskShow, remindTaskShow: false }) }
                  }}
                />
                {taskType === "cycle" ? <i className="iconfont icon-check1 haveSort" /> : ""}
                {(verName === "基础版" || verName === "免费版" || verName === "" || verName === "试用版") && taskType !== "cycle" ?
                  <img src="../static/react-static/pcvip/imgs/icon_zuanshi.jpg" className="imgOrz" /> : ""}
              </Popover>
            </div>
          </Tooltip>
          <Tooltip trigger="hover" title="任务提醒">
            <div className="topIcon2" id="box1" style={notification.length > 0 ? { borderColor: "#64b5f6" } : {}} >
              <Popover content={remindContent} overlayClassName="loopPopover1" title="" trigger="click" visible={remindTaskShow && rule.repeat !== -1} placement="bottom" getPopupContainer={() => document.getElementById("box1")}>
                <i className="iconfont icon-huabanfuben xuanhuan" style={notification.length > 0 ? { color: "#64b5f6" } : {}}
                  onClick={() => { this.setState({ remindTaskShow: !remindTaskShow, LoopTaskShow: false, notification: JSON.parse(JSON.stringify(notificationCoby)) }) }}
                />
              </Popover>
            </div>
          </Tooltip>
          <div className="createModal" onClick={() => { this.setState({ LoopTaskShow: false, remindTaskShow: false, notification: JSON.parse(JSON.stringify(notificationCoby)) }) }}>
            <div className="modalTop">
              {breadShow && breadList.length > 0 &&
                <div className="bread">
                  {breadList[0].taskname && <span className="projectBread">所属项目：</span>}
                  <Breadcrumb>
                    <Breadcrumb.Item className="breadOne"> {breadList[0].taskname} </Breadcrumb.Item>
                    {breadList.length > 1 && breadList.map((item, i) => {
                      if (i > 0) { return (<Breadcrumb.Item className="breadTwo" key={item.id}> {item.taskname} </Breadcrumb.Item>) }
                    })}
                  </Breadcrumb>
                </div>
              }
              {!breadShow && (
                <div className="proSelect">
                  <span>所属项目：</span>
                  <div className="rightInput">
                    <Select
                      style={{ width: "100%" }}
                      onChange={value => { this.editVal(value, "objId"); this.getProjectList(1, value); }}
                      mode="combobox"
                      placeholder="点击选择，支持名称搜索"
                      optionFilterProp="children"
                      onFocus={() => { this.getProjectList() }}
                      onPopupScroll={e => { this.scrollBottom(e) }}
                    >
                      {projectList}
                      {!projectListMoreLoading && projectListNowPage === projectListAllPage ? <Option value="disabled" disabled> 已经到底喽 </Option> : ""}
                      {!projectListMoreLoading && projectListNowPage < projectListAllPage ? <Option value="disabled" disabled>下拉加载更多 </Option> : ""}
                      {projectListMoreLoading ? <Option value="disabled" disabled> 正在加载更多</Option> : ""}
                    </Select>
                  </div>
                </div>
              )}
              <div className="proSelect">
                <span>任务名称：</span>
                <div className="rightInput">
                  <Input placeholder="建议不超过50个字" className="input" autoFocus={true} value={taskInfo.name.slice(0, 50)}
                    onChange={e => { this.editVal(e.target.value, "name") }}
                  />
                  <div className="titnum"><span className="titlength">{taskNameLength}</span>/50<span>[+]</span></div>
                </div>
              </div>
              <div className="personSelect">
                <div className="left">
                  <span>负责人：</span>
                  <div className="person">
                    {taskInfo.fzr && taskInfo.fzr.photo && taskInfo.fzr.photo !== "" ? (
                      <img src={taskInfo.fzr && taskInfo.fzr.photo} onClick={() => { this.selUser("负责人") }} />
                    ) : taskInfo.fzr.name ? (
                      <div className="noPhoto" onClick={() => { this.selUser("负责人") }} >
                        {taskInfo.fzr.name.substr(0, 1)}
                      </div>
                    ) : (
                          <svg className="download" aria-hidden="true" onClick={() => { this.selUser("负责人") }}>
                            <use xlinkHref="#icon-file-avatar" />
                          </svg>
                        )}
                    {taskInfo.fzr && taskInfo.fzr.name ? (
                      <span onClick={() => { this.selUser("负责人") }} >
                        {taskInfo.fzr.name}
                        {taskInfo.fzr && taskInfo.fzr.name && (
                          <i className="iconfont icon-clears delPerson" onClick={e => { e.stopPropagation(); e.preventDefault(); this.remove("fzr", taskInfo.fzr.userid); }} />
                        )}
                      </span>
                    ) : (<span onClick={() => { this.selUser("负责人") }}> 选择</span>)}
                  </div>
                </div>
                <div className="center">
                  <span>确认人：</span>
                  <div className="person">
                    {taskInfo.shr && taskInfo.shr.photo && taskInfo.shr.photo !== "" ? (
                      <img src={taskInfo.shr && taskInfo.shr.photo} onClick={() => { this.selUser("确认人") }} />
                    ) : taskInfo.shr.name ? (
                      <div className="noPhoto" onClick={() => { this.selUser("确认人") }}>
                        {taskInfo.shr.name.substr(0, 1)}
                      </div>
                    ) : (<svg className="download" aria-hidden="true" onClick={() => { this.selUser("确认人") }} > <use xlinkHref="#icon-file-avatar" /></svg>)}
                    {taskInfo.shr && taskInfo.shr.name ? (<span onClick={() => { this.selUser("确认人") }}  >
                      {taskInfo.shr.name}
                      {taskInfo.shr && taskInfo.shr.name && (
                        <i className="iconfont icon-clears delPerson" onClick={e => { e.stopPropagation(); e.preventDefault(); this.remove("shr", taskInfo.shr.userid); }} />
                      )}
                    </span>
                    ) : (<span onClick={() => { this.selUser("确认人"); }}>选择 </span>)}
                  </div>
                </div>
                <div className="right">
                  <span>任务绩效：</span>
                  <div className="taskNum">
                    <Input className="inputNumber" placeholder="0" value={taskInfo.rwjx}
                      onChange={e => {
                        onlyNumber(e.target); this.editVal(e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"), "rwjx")
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="timeSelect">
                <div className="left">
                  <span className="ML">时间：</span>
                  <DatePicker
                    showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                    format={dateOrTime2 ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm"}
                    onPanelChange={this.modeChange2}
                    onChange={this.dateChange2}
                    className={dateOrTime2 ? "showTime start" : "start"}
                    placeholder="设置开始时间"
                    disabledTime={this.disabledDateStartTime}
                    disabledDate={this.disabledDateStart}
                  />
                  <span style={{ marginRight: 10, color: "#bdbdbd" }}>-</span>
                  <DatePicker
                    showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                    format={dateOrTime ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm"}
                    onPanelChange={this.modeChange}
                    onChange={this.dateChange}
                    className={dateOrTime ? "showTime end" : "end"}
                    placeholder="设置截止时间"
                    disabledTime={this.disabledDateEndTime}
                    disabledDate={this.disabledDateEnd}
                  />
                </div>
                <div className="center">
                  <span>计划工期：</span>
                  <div className="taskNum">
                    <InputNumber
                      className="inputNumber"
                      defaultValue={1.00}
                      min={0}
                      precision={2}
                      value={taskInfo.yjgq}
                      formatter={value => `${value}天`}
                      parser={value => value.replace("天", '')}
                      onChange={e => { changeNum = 1; this.editVal(e, "yjgq") }}
                    />
                  </div>
                </div>
              </div>
              <div className="tagSelect">
                <div className="tit">标签：</div>
                <div className="tagbox">
                  <TagComponent
                    tagSelecteds={taskInfo.tags}
                    canAdd={true}
                    canEdit={true}
                    tagChangeCallBack={val => { this.tagChange(val) }}
                    maxHeight="300px"
                    renderAddElement={() => { return <span className="addNewTag">添加新标签</span> }}
                  />
                </div>
              </div>
              <div className="desSelect">
                <span>任务描述：</span>
                <div className="textAreaBox">
                  <TextArea
                    placeholder="关于任务的简要描述"
                    autosize={{ minRows: 2, maxRows: 2 }}
                    onPaste={e => { this.pasteingImg(e) }}
                    onChange={(e, txtNull) => { this.editVal(e.target.value, "desc", txtNull) }}
                    value={taskInfo.desc}
                  />
                  {uploadList_desc.length !== 0 && (
                    <div className="clearfix borderLR">
                      <Upload
                        action={baseURI + "/files/upload"}
                        listType="picture-card"
                        fileList={uploadList_desc}
                        onPreview={this.handlePreview}
                        multiple={true}
                        onChange={val => { if (beforeUpload(val.file)) { this.uploadListOnChange_desc(val) } }}
                      />
                    </div>
                  )}
                  <div className="filesTit" onClick={() => { this.updataFile() }} > <i className="icon-md-attach iconfont" /> 添加附件...</div>
                </div>
              </div>
              <div className="fileBox">
                <ul className="fileList">
                  {taskInfo.filesList && taskInfo.filesList.map((item, i) => {
                    if (item.fileId && item.type !== "DELL") {
                      return (
                        <li key={item.fileId} onClick={() => { dingJS.previewImage(item) }}>
                          <div className="fileIcon"> {createFileIcon(item.fileType)} </div>
                          <span>{item.fileName}</span>
                          <Popconfirm
                            title={`是否要删除"${item.fileName}"`}
                            onConfirm={e => { this.dellDescFileById(item.fileId) }}
                            okText="删除" cancelText="取消"
                          >
                            <div className="delte" onClick={e => { e.stopPropagation() }} >
                              <i className="iconfont icon-icon_huabanfuben5" />
                            </div>
                          </Popconfirm>
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
              <div className="followSelect">
                <span>关注人：</span>
                <Popconfirm
                  title={`您刚刚选择了${resLength}个人，是否要全部添加为关注人？`}
                  visible={limitAttention}
                  onConfirm={() => { taskInfo.collectUser = limitArr; this.setState({ taskInfo: taskInfo, limitAttention: false }) }}
                  onCancel={() => { taskInfo.collectUser = []; this.setState({ limitAttention: false, taskInfo: taskInfo }) }}
                  okText={"添加"} cancelText={"取消"}
                >
                  <i className="iconfont icon-add1 adddddd" style={{ color: "#bdbdbd" }} onClick={() => { this.selUser("关注人") }} />
                </Popconfirm>
                <div className="followBox">
                  {taskInfo.collectUser && taskInfo.collectUser.length > 0 ? taskInfo.collectUser.map(item => {
                    return (
                      <div className="userBox">
                        <div className="userSel">
                          <div className="userName">
                            {item.photo && item.photo !== "" ? (<img src={item.photo} />) : (<div className="nophoto"> {item.name && item.name.substr(0, 1)} </div>)}
                          </div>
                          <div className="nickName"> {item.name && item.name.slice(0, 3)} </div>
                          <div className="userCen" onClick={() => this.removeCollectUser(item)} > 点击移除 </div>
                        </div>
                      </div>
                    )
                  }) : ""}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
