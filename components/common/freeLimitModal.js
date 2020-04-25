import React from "react";
import { Icon, Button, Modal, Popover } from "antd";
import stylesheet from "styles/components/common/freeLimitModal.scss";
import { getTeamInfoWithMoney } from "../../core/utils/util";
export default class FreeLimitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      versionShow: false
    };
  }
  render() {
    const { versionShow, visible } = this.state;
    return (
      <Modal
        visible={visible}
        footer={null}
        width={versionShow ? 850 : 520}
        closable={!versionShow}
        onCancel={() => {
          this.props.closeFreeModalCallBack();
        }}
        mask={true}
        maskClosable={false}
        wrapClassName="freeLimitModal"
        style={versionShow ? {} : { top: 260, height: "400px" }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {versionShow ? (
          <div>
            <Icon
              type="close"
              className="closeIcon"
              onClick={() => {
                this.setState({ versionShow: false });
              }}
            />
            <div className="img">
              <img src="../../static/react-static/pcvip/imgs/versionTable229.png?t=2.1" />
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className="writeBox"
          style={versionShow ? { display: "none" } : {}}
        >
          <p>
            <span className="limitMesg">用量信息</span>
            <span
              onClick={() => {
                this.setState({ versionShow: true });
              }}
              className="versionMeg"
            >
              版本介绍
            </span>
          </p>
          <div className="myBorder" />
          <div className="text">
            <p>
              您正在使用的是<b> 蚂蚁分工免费版</b>，免费版每月可创建
              <b> 200 </b>条任务，本月任务用量已达版本上限。
            </p>
            <p>
              如您的团队项目和任务数量较多，可升级为经济实惠的
              <b> 蚂蚁分工基础版</b>
              ，基础版不限使用人数、不限项目数量、不限任务数量。
            </p>
            <p>
              我们更建议您升级到功能强大的<b> 蚂蚁分工专业版</b>
              ，专业版具有批量任务操作、甘特图、多维度数据统计图表等专业功能，助您提高协同工作效率、提升项目管理水平。
            </p>
          </div>
          <div className="renew">
            <Popover
              content={
                <div>
                  {getTeamInfoWithMoney("是否钉钉订单") ? (
                    <div>
                      <img
                        src="../static/react-static/pcvip/imgs/ewmDing.png"
                        style={{
                          width: "200px",
                          height: "230px",
                          margin: "10px 0px 0 10px"
                        }}
                      />
                      <img
                        src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                        style={{
                          width: "200px",
                          height: "230px",
                          margin: "10px 10px 0 40px"
                        }}
                      />
                    </div>
                  ) : (
                    <img
                      src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                      style={{
                        width: "200px",
                        height: "230px",
                        margin: "10px 10px 0px 10px"
                      }}
                    />
                  )}
                </div>
              }
              placement="top"
              trigger="hover"
            >
              <Button
                type="primary"
                style={{ marginRight: "20px", height: "30px" }}
              >
                升级专业版
              </Button>
            </Popover>
            <Popover
              content={
                <div>
                  {getTeamInfoWithMoney("是否钉钉订单") ? (
                    <div>
                      <img
                        src="../static/react-static/pcvip/imgs/ewmDing.png"
                        style={{
                          width: "200px",
                          height: "230px",
                          margin: "10px 0px 0 10px"
                        }}
                      />
                      <img
                        src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                        style={{
                          width: "200px",
                          height: "230px",
                          margin: "10px 10px 0 40px"
                        }}
                      />
                    </div>
                  ) : (
                    <img
                      src="../static/react-static/pcvip/imgs/ewmMaYi.png"
                      style={{
                        width: "200px",
                        height: "230px",
                        margin: "10px 10px 0px 10px"
                      }}
                    />
                  )}
                </div>
              }
              placement="top"
              trigger="hover"
            >
              <Button type="primary" style={{ height: "30px" }}>
                升级基础版
              </Button>
            </Popover>
          </div>
        </div>
      </Modal>
    );
  }
}
