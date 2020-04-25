import React from "react";
import { Spin, Modal, Menu, List, Popconfirm } from "antd";
import {
  projectrecycled,
  restoreProject,
  removeCompletely
} from "../../core/service/project.service";
import {
  taskRecycled,
  restoreTaskinfo,
  removeTask
} from "../../core/service/task.service";
import stylesheet from "styles/components/setting/recycle.scss";
import { getTeamInfoWithMoney } from "../../core/utils/util";
import InfiniteScroll from "react-infinite-scroller";

export default class Recycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showItem: "task",
      projectList: [],
      taskList: [],
      taskListNowPage: 1,
      isLast: 0,
      loading: false,
      hasMore: true,
      pageNow: 1,
      taskListLoading: false
    };
  }
  componentWillMount() {
    this.getRecycledProjectList();
    this.getRecycledTaskList(1);
  }
  componentWillReceiveProps(nextProps) { }
  componentWillUnmount() { }
  componentDidMount = () => { };
  //---------------
  // 获取已删除的Task列表
  getRecycledTaskList = pageNo => {
    taskRecycled(20, pageNo, data => {
      if (data.err) {
        return false;
      }
      this.setState({ loading: true });
      if (data.pageNo === 1) {
        this.setState({
          taskList: data.taskinfos,
          pageNow: data.pageNo,
          taskListLoading: false,
          isLast: data.isLast,
          loading: false
        });
      } else {
        let taskList = this.state.taskList;
        taskList = taskList.concat(data.taskinfos);
        this.setState({
          taskList,
          loading: false,
          pageNow: data.pageNo,
          taskListLoading: false,
          isLast: data.isLast
        });
      }
    });
  };
  //恢复任务
  recoveryTask = id => {
    const { taskList } = this.state;
    taskList.map((item, i) => {
      if (item.id === id) {
        taskList.splice(i, 1);
      }
    });
    restoreTaskinfo(id, data => {
      console.log(data);
    });
    this.setState({ taskList: taskList });
    // console.log(item);
  };
  //删除Task
  deleTask = id => {
    const { taskList } = this.state;
    taskList.map((item, i) => {
      if (item.id === id) {
        taskList.splice(i, 1);
      }
    });
    removeTask(id, data => {
      console.log(data);
      this.setState({ taskList: taskList });
    });
  };

  //------------------------
  // 获取已删除的项目列表
  getRecycledProjectList = () => {
    projectrecycled(data => {
      if (data) {
        this.setState({ projectList: data });
        // console.log(data);
      }
    });
  };

  //恢复项目
  recoveryProject = id => {
    const { projectList } = this.state;
    projectList.map((item, i) => {
      if (item.id === id) {
        projectList.splice(i, 1);
      }
    });
    restoreProject(id, data => {
      console.log(data);
    });
    this.setState({ projectList: projectList });
  };
  //删除项目
  deleProject = id => {
    const { projectList } = this.state;
    projectList.map((item, i) => {
      if (item.id === id) {
        projectList.splice(i, 1);
      }
    });
    removeCompletely(id, data => {
      console.log(data);
    });
    this.setState({ projectList: projectList });
  };

  closeModal() {
    this.props.closedCallBack();
  }

  handleInfiniteOnLoad = () => {
    const { pageNow, isLast } = this.state;
    console.log("还没滚动到底部就加载6666");
    if (isLast === 0) {
      this.getRecycledTaskList(pageNow + 1);
    }
  };
  render() {
    const {
      showItem,
      taskList,
      projectList,
      loading,
      hasMore,
      taskListLoading
    } = this.state;

    return (
      <Modal
        title={"回收站"}
        visible={true}
        closable={true}
        width={800}
        onCancel={() => {
          this.closeModal();
        }}
        footer={null}
        mask={true}
        maskClosable={false}
        wrapClassName="recycleModal"
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Spin spinning={loading} />
        <div className="recycleBox">
          <Menu
            style={{
              width: 110,
              flexShrink: 2,
              height: 400,
              borderRight: "1px solid #f5f5f5"
            }}
            defaultSelectedKeys={["task"]}
            mode="inline"
          >
            <Menu.Item
              key="task"
              onClick={() => {
                this.setState({ showItem: "task" });
              }}
              className="taskBorder"
            >
              <i className="iconfont icon-alltasks" />
              任务
            </Menu.Item>
            <Menu.Item
              key="project"
              onClick={() => {
                this.setState({ showItem: "project" });
              }}
              className="projectBorder"
            >
              <i className="iconfont icon-project" />
              项目
            </Menu.Item>
          </Menu>
          <div className="title">
            <div className="name">名称</div>
            {/* <div className="delPeple">删除人</div> */}
            <div className="delTime">删除时间</div>
          </div>
          <div className="recycleContent">
            {showItem === "task" ? (
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!this.state.loading && this.state.hasMore}
                useWindow={false}
              >
                <List
                  header={null}
                  footer={null}
                  bordered={false}
                  dataSource={taskList}
                  renderItem={item => (
                    <List.Item>
                      <div className="itemName">
                        <div className="taskname">{item.taskname}</div>
                        <div className="proname">
                          <i className="iconfont icon-project smallIcon" />
                          {item.proname}
                        </div>
                      </div>
                      <div className="delPeole">
                        {/* <div className="name">{item.name}</div> */}
                        <Popconfirm
                          title={`是否还原任务"${item.taskname}"`}
                          okText="还原"
                          cancelText="取消"
                          onConfirm={() => {
                            this.recoveryTask(item.id);
                          }}
                        >
                          {getTeamInfoWithMoney("版本名称") === "免费版" ||
                            getTeamInfoWithMoney("版本名称") === "基础版" ? (
                              ""
                            ) : (
                              <div className="recoveryTask">还原任务</div>
                            )}
                        </Popconfirm>
                      </div>
                      <div className="delTimes">
                        {getTeamInfoWithMoney("版本名称") === "免费版" ||
                          getTeamInfoWithMoney("版本名称") === "基础版" ? (
                            <div className="times">
                              {item.updateDate.substring(0, 10)}
                            </div>
                          ) : (
                            <div className="time">
                              {item.updateDate.substring(0, 10)}
                            </div>
                          )}
                        <Popconfirm
                          title={`是否删除任务"${item.taskname}"`}
                          okText="删除"
                          cancelText="取消"
                          onConfirm={() => {
                            this.deleTask(item.id);
                          }}
                        >
                          {getTeamInfoWithMoney("版本名称") === "免费版" ||
                            getTeamInfoWithMoney("版本名称") === "基础版" ? (
                              ""
                            ) : (
                              <div className="thoroughly">彻底删除</div>
                            )}
                        </Popconfirm>
                        {/* <div className="thoroughly">彻底删除</div> */}
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            ) : (
                <div className="projectdel">
                  <List
                    header={null}
                    footer={null}
                    bordered={false}
                    dataSource={projectList}
                    renderItem={item => (
                      <List.Item>
                        <div className="itemName">
                          <div className="proname">{item.proname}</div>
                          {/* <div className="proname">{item.proname}</div> */}
                        </div>
                        <div className="delPeole">
                          {/* <div className="name">{item.proname}</div> */}
                          <Popconfirm
                            title={`是否还原项目"${item.proname}"`}
                            okText="还原"
                            cancelText="取消"
                            onConfirm={() => {
                              this.recoveryProject(item.id);
                            }}
                          >
                            {getTeamInfoWithMoney("版本名称") === "免费版" ||
                              getTeamInfoWithMoney("版本名称") === "基础版" ? (
                                ""
                              ) : (
                                <div className="recoveryProject">还原项目</div>
                              )}
                          </Popconfirm>
                        </div>
                        <div className="delTimes">
                          {getTeamInfoWithMoney("版本名称") === "免费版" ||
                            getTeamInfoWithMoney("版本名称") === "基础版" ? (
                              <div className="times">
                                {item.updateDate.substring(0, 10)}
                              </div>
                            ) : (
                              <div className="time">
                                {item.updateDate.substring(0, 10)}
                              </div>
                            )}
                          <Popconfirm
                            title={`是否删除项目"${item.proname}"`}
                            okText="删除"
                            cancelText="取消"
                            onConfirm={() => {
                              this.deleProject(item.id);
                            }}
                          >
                            {getTeamInfoWithMoney("版本名称") === "免费版" ||
                              getTeamInfoWithMoney("版本名称") === "基础版" ? (
                                ""
                              ) : (
                                <div className="thoroughly">彻底删除</div>
                              )}
                          </Popconfirm>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )}
          </div>
        </div>
        {getTeamInfoWithMoney("版本名称") === "免费版" ||
          getTeamInfoWithMoney("版本名称") === "" ||
          getTeamInfoWithMoney("版本名称") === "试用版" ||
          getTeamInfoWithMoney("版本名称") === "基础版" ? (
            <div className="tootlie">*专业版可进行还原或彻底删除</div>
          ) : (
            ""
          )}
      </Modal>
    );
  }
}
