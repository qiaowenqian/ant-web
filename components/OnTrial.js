import React from "react";
import { Modal, Button } from "antd";
import Storage from "../core/utils/storage";
import stylesheet from "styles/components/OnTrial.scss";
import { probationOrder, updateStopTime } from "../core/service/user.service";

/*
 * （必填）closeCallBack()         // 关闭回调
 * （选填）canClosed:true,         // 是否可关闭 默认可关闭
 */

export default class OnTrial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      user: {}
    };
  }

  componentWillMount() {
    const user = Storage.get("user");
    this.setState({ user: user });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { user, visible } = this.state;
    return (
      <Modal
        visible={visible}
        width={404}
        closable={false}
        footer={null}
        mask={true}
        className="OnTrial"
        maskClosable={false}
        style={{ top: 139, height: "550px" }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="myClose">
          <span
            className="noreminder"
            onClick={() => {
              this.props.closeCallBack();
              updateStopTime(user.antIsvCorpSuite.corpid, data => {
                console.log(data);
                this.props.setUser(data);
                Storage.set("user", data);
              });
            }}
          >
            不再提醒
          </span>
          <i
            className="icon-guanbi iconfont"
            onClick={() => {
              this.props.closeCallBack();
              sessionStorage.setItem("OnTrialModel", "1");
            }}
          />
        </div>
        <img src="../static/react-static/pcvip/imgs/trial.png" />
        <Button
          onClick={() => {
            console.log(user);

            probationOrder(user.antIsvCorpSuite.corpid, data => {
              console.log(data);
              Storage.set("user", data);
              location.reload();
            });
          }}
        >
          立即试用
        </Button>
      </Modal>
    );
  }
}
