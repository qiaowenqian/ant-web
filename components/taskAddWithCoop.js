import React from "react";
import { Modal, Input, Icon, Spin, Button, message, Select } from "antd";
import stylesheet from "styles/components/taskCopy.scss";
import { getProjectTaskListById, getProListByJurisdiction } from "../core/service/project.service";
import { addPrevCoopTaskByTaskId, addNextCoopTaskByTaskId } from "../core/service/task.service";
import { listScroll } from "../core/utils/util";
import TaskTree from "./taskTree";
const { Option } = Select;
/*
 * （必填）closedCallback()                                                   // 关闭回调
 * （必填）task:{id:'',projectId:''}                                          // 任务数据
 * （必填）successCallback()                                                  // 添加成功刷新页面
 */
export default class TaskAddWithCoop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeList: [],
      projectList: [],
      treeListNowPage: 1,
      treeListAllPage: 0,
      treeListLoading: false,
      treeListMoreLoading: false,
      taskMoveSet: { id: "", name: "", parentId: "", projectId: "", type: ""},
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
      taskMoveSet.projectName = this.props.task.projectName;
      this.setState({ taskMoveSet: taskMoveSet });
      this.setState({ taskId: this.props.task.id });
      this.getProTaskList(1, this.props.task.projectId);
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getProjectList(pageNo) {
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
          if (projectList.filter(val => val.id === item.id).length === 0) {
            projectList.push(item);
          }
        });
        this.setState({ projectList: projectList });
      }
      this.setState({
        projectListAllPage: data.last,
        projectListNowPage: data.pageNo
      });
      this.setState({
        projectListLoading: false,
        projectListMoreLoading: false
      });
    });
  }
  getProTaskList(pageNo, projectId, search) {
    if (!pageNo) {
      pageNo = 1;
    }
    if (!projectId) {
      projectId = this.props.task.projectId;
    }
    if (pageNo === 1) {
      this.setState({ treeListLoading: true });
    } else {
      this.setState({ treeListMoreLoading: true });
    }
    getProjectTaskListById(
      projectId,
      "",
      "",
      pageNo,
      data => {
        if (data.err) {
          return false;
        }
        let treeList = [];
        if (pageNo > 1) {
          treeList = this.state.treeList;
        }
        if (data.taskPage.list) {
          data.taskPage.list.map((item, i) => {
            treeList.push({
              projectId: item.project.id,
              parentId: item.taskinfo.parent.id,
              taskId: item.taskinfo.id,
              name: item.taskinfo.taskname,
              state: item.taskinfo.stateName,
              number:
                (item.taskinfo.taskinfoNumber
                  ? item.taskinfo.taskinfoNumber.numberS + "."
                  : "") + item.taskinfo.rank,
              tags: [],
              attention: item.taskinfo.collect ? true : false,
              fzr: item.taskinfo.userResponse
                ? item.taskinfo.userResponse.name
                : "未指派",
              endDate: item.taskinfo.planEndTime,
              childCount: item.taskinfo.childCount,
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
          isLast: data.taskPage.isLast
        });
        this.setState({ treeListMoreLoading: false, treeListLoading: false });
      },
      "",
      search
    );
  }

  onOk() {
    const { title } = this.props;
    const { taskId, coopTaskIds } = this.state;

    if (!coopTaskIds || coopTaskIds.length <= 0) {
      message.warning("请选择" + title + "！");
      return;
    }
    if (title === "前序任务") {
      addPrevCoopTaskByTaskId(taskId, coopTaskIds, data => {
        if (data.err) {
          return false;
        }
        message.success("添加前序任务成功！");
        this.props.successCallback();
        this.props.closedCallback();
      });
    } else if (title === "后序任务") {
      addNextCoopTaskByTaskId(taskId, coopTaskIds, data => {
        if (data.err) {
          return false;
        }
        message.success("添加后序任务成功！");
        this.props.successCallback();
        this.props.closedCallback();
      });
    }
  }

  scrollOnBottom(e) {
    const isOnButtom = listScroll(e);
    const { treeListAllPage, treeListNowPage, isLast } = this.state;
    if (isOnButtom && isLast === "0") {
      this.getProTaskList(treeListNowPage + 1);
    }
  }

  render() {
    const {
      treeList,
      projectList,
      treeListMoreLoading,
      treeListLoading,
      treeListAllPage,
      treeListNowPage,
      coopTaskIds,
      taskMoveSet,
      projectListNowPage,
      projectListAllPage,
      projectListMoreLoading,
      search,
      addIconNone,
      isLast
    } = this.state;
    let selectedPro = taskMoveSet.projectId;
    const suffix =
      search !== "" ? (
        <Icon
          type="close-circle"
          onClick={() => {
            this.setState({ search: "", addIconNone: true }),
              this.getProTaskList(1, taskMoveSet.projectId, "");
          }}
        />
      ) : null;
    if (
      projectList.filter(val => val.id === taskMoveSet.projectId).length === 0
    ) {
      selectedPro = taskMoveSet.projectName;
    }
    const select_pro_data = [];
    projectList.map((item, i) => {
      select_pro_data.push(
        <Option
          key={item.id}
          value={item.id}
          disabled={item.create === "false" ? true : false}
        >
          {item.create === "false" ? (
            <div>
              {item.proname}
              <span className="createFalse">没有创建权限</span>
            </div>
          ) : (
              item.proname
            )}
        </Option>
      );
    });
    return (
      <Modal
        title="选择任务"
        visible={true}
        width={800}
        maskClosable={false}
        style={{ minWidth: "800px" }}
        onCancel={() => {
          this.props.closedCallback();
        }}
        wrapClassName="taskMoveModal"
        footer={null}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="step3">
          <div>
            <Select
              showSearch
              placeholder={selectedPro}
              optionFilterProp="children"
              onChange={val => {
                let { taskMoveSet } = this.state;
                taskMoveSet.projectId = val;
                this.setState({
                  taskMoveSet: taskMoveSet,
                  addIconNone: true,
                  search: ""
                });
                this.getProTaskList(1, val);
              }}
              disabled
              notFoundContent="没有找到匹配的项目"
              value={
                selectedPro !== taskMoveSet.projectId
                  ? undefined
                  : taskMoveSet.projectId
              }
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onPopupScroll={e => {
                this.scrollOnBottom("project", e);
              }}
              style={{ width: "50%" }}
            >
              {select_pro_data}
              {!projectListMoreLoading &&
                projectListNowPage === projectListAllPage ? (
                  <Option value="disabled" disabled>
                    已经是最后一页喽
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
            </Select>
            <Input
              // style={{width: 200,
              //         transition: "width .35s linear",
              //         height: 32,
              //         position: "absolute",
              //         right: 50}}
              prefix={
                <i
                  className="iconfont icon-search"
                  style={{
                    fontSize: "16px",
                    color: "#08c",
                    height: "16px",
                    color: "#bdbdbd",
                    lineHeight: "normal"
                  }}
                />
              }
              suffix={suffix}
              className="noBorder"
              placeholder="搜索任务名称"
              value={search}
              onChange={e => {
                this.setState({ search: e.target.value });
              }}
              onPressEnter={e => {
                this.getProTaskList(1, taskMoveSet.projectId, search);
                this.setState({ addIconNone: false });
              }}
            />
          </div>
          <div
            className="taskTree"
            onScroll={e => {
              this.scrollOnBottom(e);
            }}
          >
            <Spin spinning={treeListLoading} />
            {treeList.length > 0 ? (
              <TaskTree
                treeList={treeList ? treeList : []}
                checkedTaskIds={coopTaskIds ? coopTaskIds : []}
                taskLiConcise={true}
                checkBoxShow={true}
                moreEdit={true}
                taskAdd={true}
                addIconNone={addIconNone}
                notCheckIds={
                  this.props.notCheckIds ? this.props.notCheckIds : []
                }
                treeListOnChangeCallBack={val => {
                  this.setState({ treeList: val });
                }}
                checkingCallBack={val => {
                  this.setState({ coopTaskIds: val });
                }}
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
            <Button
              key="next"
              type="primary"
              onClick={() => {
                this.onOk();
              }}
            >
              确定
            </Button>
            <Button
              key="cancel"
              onClick={() => {
                this.props.closedCallback();
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
