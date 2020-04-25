import React from "react";

import TaskLatoutSmall from "../components/task/TaskLatoutSmall";
import stylesheet from "styles/views/dingMessage.scss";
import dingJS from "../core/utils/dingJSApi";
import Storage from "../core/utils/storage";
export default class DingMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (Storage.get("user")) {
      dingJS.authDingJsApi();
    }
  }

  render() {
    const { taskId, projectId } = this.props.url.query;
    return (
      <div className="dingmessage">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <TaskLatoutSmall
          taskId={taskId}
          projectId={projectId}
          closeCallBack={() => {}}
          updatedTaskCallBack={() => {}}
          isSmall={true}
        />
      </div>
    );
  }
}
