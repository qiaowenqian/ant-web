import React from "react";
import { Modal, Input, Icon, Spin, Button, Select } from "antd";
import stylesheet from "styles/components/taskCopy.scss";
import { getProjectTaskListById } from "../core/service/project.service";
import { listScroll } from "../core/utils/util";
import TaskTree from "./taskTree";
export default class AsynExportTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeList: [],
      treeListNowPage: 1,
      treeListLoading: false,
      treeListMoreLoading: false,
      taskMoveSet: { id: "", name: "", parentId: "", projectId: "", type: "" },
      coopTaskIds: [],
      taskId: "",
      search: "",
      addIconNone: true,
      isLast: "0"
    };
  }
  componentWillMount() {
    if (this.props.task) {
      let { taskMoveSet } = this.state;
      taskMoveSet.id = this.props.task.id;
      taskMoveSet.name = this.props.task.name;
      taskMoveSet.projectId = this.props.task.projectId;
      this.setState({ taskMoveSet: taskMoveSet, taskId: this.props.task.id });
      this.getProTaskList(1, this.props.task.projectId);
    }
  }

  getProTaskList(pageNo, projectId, search) {
    if (!pageNo) { pageNo = 1 }
    if (!projectId) { projectId = this.props.task.projectId }
    if (pageNo === 1) {
      this.setState({ treeListLoading: true });
    } else {
      this.setState({ treeListMoreLoading: true });
    }
    getProjectTaskListById(projectId, "", "", pageNo,
      data => {
        if (data.err) { return false }
        let treeList = [];
        if (pageNo > 1) { treeList = this.state.treeList }
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
              fzr: item.taskinfo.userResponse ? item.taskinfo.userResponse.name : "未指派",
              endDate: item.taskinfo.planEndTime,
              childCount: item.taskinfo.childCount,
              childSuccess: item.taskinfo.childSuccess,
              talkCount: item.taskinfo.leaveCount,
              loading: false,
              projectName: item.project.proname
            });
          });
        }
        this.setState({
          treeList: treeList, treeListNowPage: data.taskPage.pageNo, isLast: data.taskPage.isLast, treeListMoreLoading: false, treeListLoading: false
        })
      }, "", search)
  }
  onOk() {
    const { coopTaskIds } = this.state;
    this.props.successCallback(coopTaskIds)
  }
  scrollOnBottom(e) {
    const isOnButtom = listScroll(e);
    const { treeListNowPage, isLast } = this.state;
    if (isOnButtom && isLast === "0") { this.getProTaskList(treeListNowPage + 1); }
  }
  render() {
    const { treeList, treeListMoreLoading, treeListLoading, coopTaskIds, taskMoveSet, search, addIconNone, isLast } = this.state;
    const suffix = search !== "" ? (
      <Icon type="close-circle" onClick={() => { this.setState({ search: "", addIconNone: true }), this.getProTaskList(1, taskMoveSet.projectId, "") }} />
    ) : null;
    return (
      <Modal
        title="导出任务"
        visible={true}
        width={800}
        maskClosable={false}
        style={{ minWidth: "800px" }}
        onCancel={() => { this.props.closedCallback() }}
        wrapClassName="taskMoveModal"
        footer={null}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="step3">
          <div>
            <Select disabled notFoundContent="没有找到匹配的项目" value={treeList && treeList.length > 0 && treeList[0].projectName} style={{ width: "50%" }} />
            <Input
              prefix={
                <i className="iconfont icon-search" style={{ fontSize: "16px", color: "#08c", height: "16px", color: "#bdbdbd", lineHeight: "normal" }} />
              }
              suffix={suffix}
              className="noBorder"
              placeholder="搜索任务名称"
              value={search}
              onChange={e => { this.setState({ search: e.target.value }) }}
              onPressEnter={e => {
                this.getProTaskList(1, taskMoveSet.projectId, search);
                this.setState({ addIconNone: false });
              }}
            />
          </div>
          <div
            className="taskTree"
            onScroll={e => { this.scrollOnBottom(e) }}
          >
            <Spin spinning={treeListLoading} />
            {treeList.length > 0 ? (
              <TaskTree
                treeList={treeList ? treeList : []}
                checkedTaskIds={coopTaskIds ? coopTaskIds : []}
                taskLiConcise={true}
                checkBoxShow={true}
                moreEdit={"exprot"}
                taskAdd={true}
                addIconNone={addIconNone}
                notCheckIds={[]}
                treeListOnChangeCallBack={val => { this.setState({ treeList: val }) }}
                checkingCallBack={val => { this.setState({ coopTaskIds: val }) }}
              />
            ) : (
                ""
              )}
            {!treeListMoreLoading && isLast === "0" ? (
              <div className="moreLoadingRow">下拉加载更多</div>
            ) : (
                ""
              )}
            {treeListMoreLoading ? (
              <div className="moreLoadingRow">
                <Icon type="loading" className="loadingIcon" />
                正在加载更多
              </div>
            ) : (
                ""
              )}
            {!treeListMoreLoading && isLast === "1" ? (
              <div className="moreLoadingRow">已经是最后一页喽</div>
            ) : (
                ""
              )}
          </div>
          <div className="buttomButton">
            <Button key="next" type="primary" onClick={() => { this.onOk() }}>确定</Button>
            <Button key="cancel" onClick={() => { this.props.closedCallback() }}>取消</Button>
          </div>
        </div>
      </Modal>
    );
  }
}
