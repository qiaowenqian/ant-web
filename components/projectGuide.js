import React from "react";
import { Modal } from "antd";
import stylesheet from "styles/components/projectGuide.scss";
import Storage from "../core/utils/storage";
export default class projectGuide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible1: true,
      visible2: false,
      visible3: false
    };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  closeModal() {
    if (this.props.closeCallBack) {
      this.props.closeCallBack();
    }
  }
  render() {
    const { visible1, visible2, visible3 } = this.state;
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Modal
          visible={visible1}
          // width={1000}
          wrapClassName="projectGuideModal1"
          closable={false}
          onCancel={() => {
            this.closeModal();
          }}
          footer={null}
          mask={true}
        >
          <div>
            <div className="num">
              <i className="iconfont icon-project poxuqiu" />
              <span>全部项目</span>
              <span className="nums">82</span>
            </div>
            <div className="num">
              <i className="iconfont icon-users1 poxuqiu" />
              <span>我参与的</span>
              <span className="nums">20</span>
            </div>
            <div className="num">
              <i className="iconfont icon-user poxuqiu" />

              <span>我负责的</span>
              <span className="nums">13</span>
            </div>
            <div className="num">
              <i className="iconfont icon-star poxuqiu" />

              <span>我关注的</span>
              <span className="nums">25</span>
            </div>
            <div className="num">
              <i className="iconfont icon-archive poxuqiu" />
              <span>已归档项目</span>
              <span className="nums">10</span>
            </div>
          </div>
          <div className="tip">
            <div className="sanjiao" />
            <span>项目分组</span>搬到这里了，增加了“<span>已归档项目</span>”分组
          </div>
          <div className="projectBtn">
            <span
              className="nextStep"
              onClick={() => {
                this.setState({ visible1: false, visible2: true });
              }}
            >
              下一步
            </span>
          </div>
        </Modal>
        <Modal
          visible={visible2}
          wrapClassName="projectGuideModal2"
          closable={false}
          onCancel={() => {
            this.closeModal();
          }}
          footer={null}
          mask={true}
        >
          <div className="btn2">
            <i className="icon iconfont icon-filter2 iconStyle" />
            筛选排序
          </div>
          <div className="tip">
            <div className="sanjiao" />
            <span>项目分类筛选</span>搬到了这里了，增加了更多筛选条件和排序功能
          </div>
          <div className="projectBtn">
            <span
              className="nextStep"
              onClick={() => {
                if (!this.props.projecSort) {
                  this.props.projecSortChange();
                }
                this.setState({ visible2: false, visible3: true });
              }}
            >
              下一步
            </span>
          </div>
        </Modal>
        <Modal
          visible={visible3}
          wrapClassName="projectGuideModal3"
          closable={false}
          onCancel={() => {
            this.closeModal();
          }}
          footer={null}
          mask={true}
        >
          <div>
            <i className="iconfont icon-pin" />
          </div>
          <div className="tip">
            <div className="sanjiao" />
            需要的时候可以点这里让“筛选排序”<span>常驻显示</span>
          </div>
          <div className="projectBtn">
            <span
              className="nextStep"
              onClick={() => {
                this.setState({
                  visible1: false,
                  visible2: false,
                  visible3: false
                });
                Storage.setLocal("Version", false);
              }}
            >
              关闭
            </span>
          </div>
        </Modal>
      </div>
    );
  }
}
