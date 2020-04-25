import React from "react";
import stylesheet from "styles/components/project/moreSetting/projectFile.scss";
import {
  saveFiling,
  cancelFiling
} from "../../../core/service/project.service";
import { Modal, Button, message } from "antd";
import Storage from "../../../core/utils/storage";

export default class projectFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flleType: true };
  }
  componentDidMount = () => {
    let flleTypes = Storage.getLocal("actType");
    if (flleTypes && flleTypes[0] === "5") {
      this.setState({ flleType: false });
    } else {
      this.setState({ flleType: true });
    }
  };
  componentWillMount = () => {};
  render() {
    const { FileShow } = this.props;
    const { flleType } = this.state;
    return (
      <Modal
        title={flleType ? "归档项目" : "取消归档"}
        visible={FileShow}
        width={520}
        footer={null}
        mask={true}
        maskClosable={false}
        wrapClassName="fileModal"
        onCancel={() => {
          this.props.closedCallBack();
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {flleType
          ? "归档后该项目可在'项目 - 已归档项目'中查看，归档的项目默认不纳入统计，需要时可随时取消归档并正常使用。"
          : "项目取消归档后，就可以正常使用了。"}

        <div className="fileBtn">
          <Button
            onClick={() => {
              this.props.closedCallBack();
            }}
          >
            {flleType ? "取消" : "保持归档"}
          </Button>
          {flleType ? (
            <Button
              type="primary"
              onClick={() => {
                saveFiling(this.props.fileProjectId, data => {
                  if (data.err) {
                    return;
                  } else {
                    message.success("归档成功");
                    this.props.handleCancel(true);
                  }
                });
              }}
            >
              归档
            </Button>
          ) : (
            <Button
              type="primary"
              className="guidang"
              onClick={() => {
                cancelFiling(this.props.fileProjectId, data => {
                  if (data.err) {
                    return;
                  } else {
                    message.success("取消归档成功");
                    this.props.handleCancel(false);
                  }
                });
              }}
            >
              取消归档
            </Button>
          )}
        </div>
      </Modal>
    );
  }
}
