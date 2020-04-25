import React from "react";
import { Modal, Steps, Select, Icon, Spin, Button, Checkbox, Input, message } from "antd";
import stylesheet from "styles/components/taskCopy.scss";
import { getProjectTaskListById, getProListByJurisdiction } from "../core/service/project.service";
import { copyTask } from "../core/service/task.service";
import { listScroll, getTeamInfoWithMoney } from "../core/utils/util";
import TaskTree from "./taskTree";
const Step = Steps.Step;
const { Option } = Select;
/*
 * （必填）closedCallback()                                                   // 关闭回调
 * （必填）task:{id:'',name:'',parentId:'',projectId:'',projectName:''}       // 任务数据
 * （选填）successCallBack()                                                  // 复制成功后的回调
 */
export default class TaskCopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      projectListLoading: false,
      projectListMoreLoading: false,
      projectList: [],
      projectListAllPage: 0,
      projectListNowPage: 0,
      treeList: [],
      treeList: [],
      treeListNowPage: 1,
      treeListAllPage: 0,
      treeListLoading: false,
      treeListMoreLoading: false,
      taskCopySet: {
        id: "",
        name: "",
        child: "1",
        endTime: "1",
        fzr: "1",
        qrr: "1",
        collect1: "1",
        loop: "1",
        lev: "1",
        money: "1",
        worktime: "1",
        parentId: "",
        projectId: "",
        projectName: "",
        copyFlag: "", //子任务统一前缀
        beginTime: "1",//开始时间 
      },
      taskCopyLoading: false,
      createPermission: false,
      checkedFales: false,
      search: "",
      textWarning: false, //警告字数限制
      maxlength: 50, //  字数限制
      addIconNone: true, //不显示加号图标
      currentLength: 0, //当前0个字
      currentChildLength: 0, //当前0个字
      childNum: true, // 是否有子任务
      coopTaskNum: true, //是否有协作任务
      isLast: "0",
      isLastTreeList: "0" // 是否是最后一页 0不是 1 是
    };
  }

  componentWillMount() {
    this.getProjectList(1);
    if (this.props.task) {
      let { taskCopySet } = this.state;
      let { task } = this.props;
      if (task.childCount === 0) {
        this.setState({ childNum: false });
      }
      if (task.coopTaskCount === 0) {
        this.setState({ coopTaskNum: false });
      }
      taskCopySet.id = this.props.task.id;
      taskCopySet.name = this.props.task.name;
      taskCopySet.parentId = this.props.task.parentId;
      taskCopySet.projectId = this.props.task.projectId;
      taskCopySet.projectName = this.props.task.projectName;
      this.setState({ taskCopySet: taskCopySet });
      this.getProTaskList(1, this.props.task.projectId);
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getProjectList(pageNo, proname) {
    if (!pageNo) {
      pageNo = 1;
    }
    if (pageNo === 1) {
      this.setState({ projectListLoading: true });
    } else {
      this.setState({ projectListMoreLoading: true });
    }
    getProListByJurisdiction("10", pageNo, data => {
      if (data.err) {
        return false;
      }
      if (data.pageNo === 1) {
        this.setState({ projectList: data.list });
      } else {
        const projectList = this.state.projectList;
        data.list.map(item => {
          if (projectList.filter(val => val.id === item.id).length === 0) { projectList.push(item); }
        });
        this.setState({ projectList: projectList });
      }
      this.setState({ projectListAllPage: data.last, projectListNowPage: data.pageNo, projectListLoading: false, projectListMoreLoading: false });
    }, proname);
  }

  getProTaskList(pageNo, projectId, search) {
    if (!pageNo) { pageNo = 1 }
    if (!projectId) { projectId = this.state.taskCopySet.projectId }
    if (pageNo === 1) {
      this.setState({ treeListLoading: true });
    } else {
      this.setState({ treeListMoreLoading: true });
    }
    getProjectTaskListById(projectId, "", "", pageNo, data => {
      if (data.err) { return false }
      let { treeList } = this.state;
      if (pageNo === 1) { treeList = [] }
      if (data.taskPage.list) {
        data.taskPage.list.map((item, i) => {
          treeList.push({
            projectId: item.project.id,
            parentId: item.taskinfo.parent.id,
            taskId: item.taskinfo.id,
            name: item.taskinfo.taskname,
            state: item.taskinfo.stateName,
            number: (item.taskinfo.taskinfoNumber ? item.taskinfo.taskinfoNumber.numberS + "." : "") + item.taskinfo.rank,
            tags: [],
            attention: item.taskinfo.collect ? true : false,
            fzr: item.taskinfo.userResponse ? item.taskinfo.userResponse.name : "未指定",
            endDate: item.taskinfo.planEndTime,
            childCount: item.taskinfo.child,
            childIngCount: item.taskinfo.childCount,
            childSuccess: item.taskinfo.childSuccess,
            talkCount: item.taskinfo.leaveCount,
            loading: false
          });
        });
      }
      this.setState({
        treeList: treeList,
        treeListNowPage: data.taskPage.pageNo,
        treeListAllPage: data.taskPage.last,
        createPermission: data.createPermission,
        isLastTreeList: data.taskPage.isLast
      });
      this.setState({ treeListMoreLoading: false, treeListLoading: false });
    }, "", search
    );
  }

  onOk() {
    let { step, createPermission } = this.state;
    if (step === 0) {
      this.setState({ step: 1 });
    } else if (step === 1) {
      if (createPermission) {
        const { taskCopySet } = this.state;
        this.setState({ taskCopyLoading: true });
        copyTask(taskCopySet, data => {
          if (data.err) { return false }
          message.success("复制成功！");
          this.props.closedCallback();
          this.setState({ taskCopyLoading: false });
          if (this.props.successCallBack) {
            this.props.successCallBack({ taskCopyId: taskCopySet.id, copyToParentId: taskCopySet.parentId, type: "1" });
          }
        });
      } else {
        message.warning(`您在选择的目标项目中没有创建任务的权限`);
      }
    }
  }

  scrollOnBottom(type, e) {
    const isOnButtom = listScroll(e);
    if (type === "project") {
      const { projectListAllPage, projectListNowPage, isLast } = this.state;
      if ((isOnButtom === true || isOnButtom === undefined) && projectListNowPage < projectListAllPage) {
        this.getProjectList(projectListNowPage + 1);
      }
    } else if (type === "taskTree") {
      const { treeListNowPage, isLastTreeList } = this.state;
      if ((isOnButtom === true || isOnButtom === undefined) && isLastTreeList === "0") {
        this.getProTaskList(treeListNowPage + 1);
      }
    }
  }

  valChange(type, val, checkedType) {
    //判断字数限制
    if (type === "name") {
      let nameLength = val.trim().length;
      if (nameLength === 0) {
        this.setState({ taskCopyLoading: true })
      } else {
        this.setState({ taskCopyLoading: false })

      }
      if (nameLength >= 40) {
        this.setState({ currentLength: nameLength, textWarning: true });
      } else {
        this.setState({ currentLength: nameLength, textWarning: false });
      }
    }
    //判断其他
    if (type !== "name" && type !== "parentId" && type !== "projectId" && type !== "copyFlag") {
      if (val) { val = "1"; } else { val = ""; }
    }
    let { taskCopySet } = this.state;
    let { task } = this.props;
    taskCopySet[type] = val;
    this.setState({ taskCopySet: taskCopySet });
    if (checkedType === "checkedType" && val !== task.projectId) {
      taskCopySet.loop = "";
      this.setState({ taskCopySet: taskCopySet, checkedFales: true });
    } else if (checkedType === "checkedType" && val === task.projectId) {
      this.setState({ checkedFales: false });
    }
  }

  render() {
    const { step, projectList, taskCopySet, projectListNowPage, taskCopyLoading, projectListAllPage, projectListMoreLoading,
      projectListLoading, treeList, treeListMoreLoading, treeListLoading, search, addIconNone, currentLength,
      textWarning, maxlength, childNum, coopTaskNum, isLastTreeList
    } = this.state;
    let selectedPro = taskCopySet.projectName;
    if (projectList && projectList.filter(val => val.id === taskCopySet.projectId).length === 0) {
      selectedPro = taskCopySet.projectName;
    }
    const select_pro_data = [];
    projectList && projectList.map((item, i) => {
      select_pro_data.push(
        <Option key={item.id} value={item.id} disabled={item.create === "false" ? true : false} >
          {item.create === "false" ? (
            <div> {item.proname} <span className="createFalse">没有创建权限</span> </div>
          ) : (item.proname)}
        </Option>
      )
    })
    const suffix =
      search !== "" ? (
        <Icon
          style={{ color: "#bdbdbd" }}
          type="close-circle"
          onClick={() => {
            this.setState({ search: "", addIconNone: true }); this.getProTaskList(1, taskCopySet.projectId, "");
          }}
        />
      ) : null;
    return (
      <Modal
        title={step == "0" ? "选择复制内容" : "选择复制位置"}
        visible={true}
        width={800}
        style={{ minWidth: "800px" }}
        maskClosable={false}
        onCancel={() => { this.props.closedCallback() }}
        wrapClassName="taskMoveModal"
        footer={null}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {step === 0 ? (
          <div className="step2">
            <dvi className="searchBox">
              <span>任务名称</span>
              <Input
                value={taskCopySet.name}
                onChange={e => { this.valChange("name", e.target.value) }}
                maxLength="50"
              />
              {textWarning ? (
                <div className="searchBoxMax">
                  <span>{currentLength}</span>
                  <span>/</span>
                  <span className="maxlength">{maxlength}</span>
                </div>
              ) : (
                  ""
                )}
            </dvi>
            <div className="labelBox">
              <span className="copyContent">复制内容</span>
              <div className="checksBoxOne checksBox">
                <Checkbox checked={taskCopySet.fzr ? true : false} onChange={e => { this.valChange("fzr", e.target.checked) }}>负责人</Checkbox>
                <Checkbox checked={taskCopySet.qrr ? true : false} onChange={e => { this.valChange("qrr", e.target.checked) }} style={{ marginLeft: 100 }}>确认人</Checkbox>
                <Checkbox checked={taskCopySet.collect1 ? true : false} onChange={e => { this.valChange("collect1", e.target.checked) }} style={{ marginLeft: 100 }}>关注人</Checkbox>
              </div>
              <div className="checksBox">
                <Checkbox checked={taskCopySet.beginTime ? true : false} onChange={e => { this.valChange("beginTime", e.target.checked) }}>开始时间</Checkbox>
                <Checkbox checked={taskCopySet.endTime ? true : false} onChange={e => { this.valChange("endTime", e.target.checked) }} style={{ marginLeft: 86 }}>截止时间</Checkbox>
                <Checkbox checked={taskCopySet.worktime ? true : false} onChange={e => { this.valChange("worktime", e.target.checked) }} style={{ marginLeft: 86 }}>计划工期</Checkbox>
              </div>
              <div className="checksBox">
                <Checkbox checked={taskCopySet.money ? true : false} onChange={e => { this.valChange("money", e.target.checked) }} >任务绩效</Checkbox>
              </div>
              {childNum ? (
                <div className="checksBox">
                  <Checkbox checked={taskCopySet.child ? true : false} onChange={e => { this.valChange("child", e.target.checked) }}>子任务</Checkbox>
                  {taskCopySet.child === "" ? (
                    ""
                  ) : (
                      <div className="childTaks">
                        <span>子任务统一前缀</span>
                        <Input
                          value={taskCopySet.copyFlag}
                          onChange={e => { this.valChange("copyFlag", e.target.value) }}
                          maxLength={10}
                        />
                      </div>
                    )}
                </div>
              ) : (
                  <div className="checksBox">
                    <Checkbox checked={false} disabled={true}>子任务</Checkbox>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,.25)" }}>该任务没有子任务 </span>
                  </div>
                )}
              {coopTaskNum ? (
                <div className="checksBox">
                  <Checkbox checked={taskCopySet.loop ? true : false} onChange={e => { this.valChange("loop", e.target.checked) }}>协作关系</Checkbox>
                </div>
              ) : (
                  <div className="checksBox">
                    <Checkbox checked={false} onChange={e => { this.valChange("loop", e.target.checked) }} disabled={true}>协作关系 <span style={{ float: "right", fontSize: 12 }}>该任务没有前后序任务</span></Checkbox>
                  </div>
                )}
            </div>
            <div className="buttomButton" style={{ position: "absolute", bottom: "20px", right: "20px" }} >
              <Button key="next" type="primary" disabled={taskCopyLoading} onClick={() => { this.onOk() }}>下一步</Button>
              <Button key="cancel" onClick={() => { this.props.closedCallback() }}>取消</Button>
            </div>
          </div>
        ) : (
            <div className="step1">
              {projectListLoading && false ? (
                <span style={{ margin: "5px 0 10px 0", flex: "0 0 auto", display: "block", textAlign: "left" }}>
                  <Icon type="loading" />
                  <span style={{ margin: "0 0 0 10px", fontSize: "12px" }}>项目加载中</span>
                </span>
              ) : (
                  <div>
                    <Select
                      style={{ width: "50%" }}
                      showSearch
                      placeholder={selectedPro}
                      optionFilterProp="children"
                      onChange={val => {
                        this.valChange("projectId", val, "checkedType");
                        this.setState({ addIconNone: true, search: "" });
                        this.getProTaskList(1, val, "");
                      }}
                      onSearch={val => { this.getProjectList(1, val) }}
                      notFoundContent="没有找到匹配的项目"
                      onFocus={() => { this.getProjectList(1, "") }}
                      onPopupScroll={e => { this.scrollOnBottom("project", e) }}
                      disabled={getTeamInfoWithMoney("是否可用") ? false : true}
                    >
                      {select_pro_data}
                      {!projectListMoreLoading &&
                        projectListNowPage === projectListAllPage ? (
                          <Option value="disabled" disabled>已经是最后一页喽 </Option>
                        ) : ("")}
                      {!projectListMoreLoading &&
                        projectListNowPage < projectListAllPage ? (
                          <Option value="disabled" disabled>下拉加载更多</Option>
                        ) : ("")}
                    </Select>
                    <Input
                      prefix={<i className="iconfont icon-search" style={{ fontSize: "16px", color: "#08c", height: "16px", color: "#bdbdbd", lineHeight: "normal" }} />}
                      className="noBorder"
                      suffix={suffix}
                      placeholder="搜索任务名称"
                      value={search}
                      onChange={e => { this.setState({ search: e.target.value }) }}
                      onPressEnter={e => {
                        this.getProTaskList(1, taskCopySet.projectId, search);
                        this.setState({ addIconNone: false });
                      }}
                    />
                  </div>
                )}
              <div
                className="taskTree"
                onScroll={e => { this.scrollOnBottom("taskTree", e) }}
              >
                <Spin spinning={treeListLoading} />
                {treeList.length > 0 ? (
                  <TaskTree
                    taskMoveTree={true}
                    treeList={treeList}
                    taskLiConcise={true}
                    addIconNone={addIconNone}
                    taskOnClickCallBack={(taskId, projectId) => {
                      this.setState({ taskCopyLoading: false });
                      this.valChange("parentId", taskId);
                    }}
                    treeListOnChangeCallBack={val => {
                      this.setState({ treeList: val });
                    }}
                  />
                ) : (
                    ""
                  )}
                {!treeListMoreLoading && isLastTreeList === "0" ? <div className="moreLoadingRow">下拉加载更多</div> : ""}
                {treeListMoreLoading ? <div className="moreLoadingRow"><Icon type="loading" className="loadingIcon" /> 正在加载更多</div> : ""}
                {!treeListMoreLoading && isLastTreeList === "1" ? <div className="moreLoadingRow">已经是最后一页喽</div> : ""}
              </div>
              <div className="buttomButton">
                {getTeamInfoWithMoney("版本名称") == "专业版" ?
                  <span style={{ position: "relative", top: 20, color: "#bdbdbd", fontSize: 12 }}>
                    {taskCopySet.projectId == this.props.task.projectId || this.props.task.coopTaskCount == 0 ? "" : "跨项目复制无法复制协作关系"}
                  </span> : <span style={{ position: "relative", top: 20, color: "#bdbdbd", fontSize: 12 }}>*专业版可跨项目移动</span>
                }
                <Button key="next" type="primary" disabled={taskCopyLoading} onClick={() => { this.onOk() }}>复制</Button>
                <Button key="prev" onClick={() => { this.setState({ step: 0 }) }}>上一步</Button>
              </div>
            </div>
          )}
      </Modal>
    );
  }
}
