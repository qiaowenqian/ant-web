import React from "react";
import { InputNumber, Slider } from "antd";
import stylesheet from "styles/components/project/performance/index.scss";
/**
 * @description 处理绩效统计弹窗页面
 * @callback handleProjectInfoChange
 * @param  projectCreateInfo
 * { antPrefType : {
      createPerf: createTask,
      assignPerf: appointedTask,
      confirmPerf: confirmationTask,
      overDiscount: 100 - overdueVal,
      finishTqPerf: 100 + advanceVal,
      finishPerf: finishTaskVal
    },jurisdiction:false}
 *@callback handleProjectInfoChange 返回projectCreateInfo对象
 */
export default class Performance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createTask: 0, //创建
      appointedTask: 0, //指派
      confirmationTask: 0, //确认
      overdueVal: 0, //逾期
      advanceVal: 100, //提前
      finishTaskVal: 100, //完成
      projectCreateInfo: {}
    };
  }
  componentWillMount() {
    if (
      this.props.projectCreateInfo &&
      this.props.projectCreateInfo.antPrefType
    ) {
      this.setState({
        projectCreateInfo: this.props.projectCreateInfo,
        createTask: _.toNumber(
          this.props.projectCreateInfo.antPrefType.createPerf
        ),
        appointedTask: _.toNumber(
          this.props.projectCreateInfo.antPrefType.assignPerf
        ),
        confirmationTask: _.toNumber(
          this.props.projectCreateInfo.antPrefType.confirmPerf
        ),
        overdueVal: _.toNumber(
          100 - this.props.projectCreateInfo.antPrefType.overDiscount
        ),
        advanceVal: _.toNumber(
          this.props.projectCreateInfo.antPrefType.finishTqPerf - 100
        ),
        finishTaskVal: _.toNumber(
          this.props.projectCreateInfo.antPrefType.finishPerf
        )
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    let _this = this;
    if (
      nextProps.projectCreateInfo &&
      nextProps.projectCreateInfo.antPrefType &&
      !_.isEqual(nextProps.projectCreateInfo, _this.props.projectCreateInfo)
    ) {
      this.setState({
        projectCreateInfo: nextProps.projectCreateInfo,
        createTask: _.toNumber(
          nextProps.projectCreateInfo.antPrefType.createPerf
        ),
        appointedTask: _.toNumber(
          nextProps.projectCreateInfo.antPrefType.assignPerf
        ),
        confirmationTask: _.toNumber(
          nextProps.projectCreateInfo.antPrefType.confirmPerf
        ),
        overdueVal: _.toNumber(
          100 - nextProps.projectCreateInfo.antPrefType.overDiscount
        ),
        advanceVal: _.toNumber(
          nextProps.projectCreateInfo.antPrefType.finishTqPerf - 100
        ),
        finishTaskVal: _.toNumber(
          nextProps.projectCreateInfo.antPrefType.finishPerf
        )
      });
    }
  }
  componentDidMount() { }
  //成功回调方法
  createTaskValChange(val, name) {
    const {
      createTask,
      appointedTask,
      confirmationTask,
      finishTaskVal
    } = this.state;
    if (createTask < 0) {
      this.setState({ createTask: 0 });
    }
    if (appointedTask < 0) {
      this.setState({ appointedTask: 0 });
    }
    if (confirmationTask < 0) {
      this.setState({ confirmationTask: 0 });
    }
    if (finishTaskVal < 0) {
      this.setState({ finishTaskVal: 0 });
    }
    if (name === "create") {
      this.setState({ createTask: val });
      if (createTask < val) {
        if (finishTaskVal > 0) {
          this.setState({
            finishTaskVal: 100 - val - confirmationTask - appointedTask
          });
        } else if (finishTaskVal === 0 && confirmationTask > 0) {
          this.setState({
            confirmationTask: 100 - val - appointedTask
          });
        } else if (finishTaskVal === 0 && confirmationTask === 0) {
          this.setState({
            appointedTask: 100 - val
          });
        }
      } else if (createTask > val) {
        this.setState({
          finishTaskVal: 100 - val - appointedTask - confirmationTask
        });
      }
    } else if (name === "appointed") {
      this.setState({ appointedTask: val });
      if (appointedTask < val) {
        if (finishTaskVal > 0) {
          this.setState({
            finishTaskVal: 100 - val - createTask - confirmationTask
          });
        } else if (finishTaskVal === 0 && confirmationTask > 0) {
          this.setState({
            confirmationTask: 100 - val - createTask
          });
        } else if (finishTaskVal === 0 && confirmationTask === 0) {
          this.setState({
            createTask: 100 - val
          });
        }
      } else if (appointedTask > val) {
        this.setState({
          finishTaskVal: 100 - val - createTask - confirmationTask
        });
      }
    } else if (name === "confirmation") {
      this.setState({ confirmationTask: val });
      if (confirmationTask < val) {
        if (finishTaskVal > 0) {
          this.setState({
            finishTaskVal: 100 - val - createTask - appointedTask
          });
        } else if (finishTaskVal === 0 && appointedTask > 0) {
          this.setState({
            appointedTask: 100 - val - createTask
          });
        } else if (finishTaskVal === 0 && appointedTask === 0) {
          this.setState({
            createTask: 100 - val
          });
        }
      } else if (confirmationTask > val) {
        this.setState({
          finishTaskVal: 100 - val - appointedTask - createTask
        });
      }
    } else if (name === "finish") {
      this.setState({ finishTaskVal: val });
      if (finishTaskVal < val) {
        if (createTask > 0) {
          this.setState({
            createTask: 100 - val - confirmationTask - appointedTask
          });
        } else if (createTask === 0 && appointedTask > 0) {
          this.setState({ appointedTask: 100 - val - confirmationTask });
        } else if (createTask === 0 && appointedTask === 0) {
          this.setState({ confirmationTask: 100 - val });
        }
      } else if (finishTaskVal > val) {
        this.setState({
          confirmationTask: 100 - val - appointedTask - createTask
        });
      }
    }
    setTimeout(() => {
      this.upData();
    });
  }
  upData() {
    const {
      createTask,
      appointedTask,
      confirmationTask,
      advanceVal,
      overdueVal,
      finishTaskVal,
      projectCreateInfo
    } = this.state;
    let newantprefType = Object.assign({}, projectCreateInfo.antPrefType, {
      createPerf: createTask,
      assignPerf: appointedTask,
      confirmPerf: confirmationTask,
      overDiscount: 100 - overdueVal,
      finishTqPerf: 100 + advanceVal * 1,
      finishPerf: finishTaskVal
    });
    projectCreateInfo.antPrefType = newantprefType;
    this.props.handleProjectInfoChange(projectCreateInfo);
  }
  render() {
    const {
      createTask,
      appointedTask,
      confirmationTask,
      overdueVal,
      advanceVal,
      finishTaskVal,
      projectCreateInfo
    } = this.state;
    return (
      <div className="Performance">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="calculationModel-lists">
          <span className="title">创建任务：</span>

          <Slider
            min={0}
            max={100}
            onChange={value => {
              this.createTaskValChange(value, "create");
            }}
            value={typeof createTask === "number" ? createTask : 0}
            style={{ width: 255 }}
            disabled={!projectCreateInfo.jurisdiction}
          />
          <InputNumber
            min={0}
            precision={2}
            max={100}
            style={{ marginLeft: 16, height: 24 }}
            value={createTask}
            formatter={value => `${value}%`}
            onChange={value => {
              this.createTaskValChange(value, "create");
            }}
            disabled={!projectCreateInfo.jurisdiction}
          />
        </div>
        <div className="calculationModel-lists">
          <span className="title">指派任务：</span>
          <Slider
            min={0}
            max={100}
            onChange={value => {
              this.createTaskValChange(value, "appointed");
            }}
            value={typeof appointedTask === "number" ? appointedTask : 0}
            style={{ width: 255 }}
            disabled={!projectCreateInfo.jurisdiction}
          />
          <InputNumber
            min={0}
            precision={2}
            max={100}
            style={{ marginLeft: 16, height: 24 }}
            value={appointedTask}
            formatter={value => `${value}%`}
            onChange={value => {
              this.createTaskValChange(value, "appointed");
            }}
            disabled={!projectCreateInfo.jurisdiction}
          />
        </div>
        <div className="calculationModel-lists">
          <span className="title">确认任务：</span>

          <Slider
            min={0}
            max={100}
            onChange={value => {
              this.createTaskValChange(value, "confirmation");
            }}
            value={typeof confirmationTask === "number" ? confirmationTask : 0}
            style={{ width: 255 }}
            disabled={!projectCreateInfo.jurisdiction}
          />
          <InputNumber
            min={0}
            precision={2}
            max={100}
            style={{ marginLeft: 16, height: 24 }}
            value={confirmationTask}
            formatter={value => `${value}%`}
            onChange={value => {
              this.createTaskValChange(value, "confirmation");
            }}
            disabled={!projectCreateInfo.jurisdiction}
          />
        </div>
        <div className="calculationModel-line" />
        <div className="calculationModel-lists">
          <span className="title">完成任务：</span>
          <Slider
            min={0}
            max={100}
            onChange={value => {
              this.createTaskValChange(value, "finish");
            }}
            value={typeof finishTaskVal === "number" ? finishTaskVal : 0}
            style={{ width: 255 }}
            disabled={!projectCreateInfo.jurisdiction}
          />
          <InputNumber
            min={0}
            precision={2}
            max={100}
            style={{ marginLeft: 16, height: 24 }}
            value={finishTaskVal}
            formatter={value => `${value}%`}
            onChange={value => {
              this.createTaskValChange(value, "finish");
            }}
            disabled={!projectCreateInfo.jurisdiction}
          />
        </div>
        <div className="calculationModel-lists overdueColor">
          <div className="overdueTotalBox">
            <span className="title">逾期扣除：</span>
            <div className="overdueTotal">
              <InputNumber
                min={0}
                precision={2}
                max={999}
                style={{ height: 24 }}
                value={overdueVal}
                formatter={value => `${value}%`}
                onChange={value => {
                  this.setState({ overdueVal: value }, () => {
                    this.upData();
                  });
                }}
                disabled={!projectCreateInfo.jurisdiction}
              />
            </div>
          </div>

          <div className="overdueTotalBox">
            <span className="titleBottom">提前奖励：</span>
            <div className="overdueTotal">
              <InputNumber
                min={0}
                precision={2}
                max={999}
                style={{ height: 24 }}
                value={advanceVal}
                formatter={value => `${value}%`}
                onChange={value => {
                  this.setState({ advanceVal: value }, () => {
                    this.upData();
                  });

                }}
                disabled={!projectCreateInfo.jurisdiction}
              />
            </div>
          </div>
        </div>
        <div className="calculationModel-lines" />
        <div className="calculationModel-lists">
          <p>
            *计算说明：若一个任务的绩效为100，根据上面设置各个操作所占的绩效比例，创建任务计
            {createTask * 1}绩效， 指派任务计{appointedTask * 1}绩效，确认任务计
            {confirmationTask * 1}绩效，正常完成任务计{finishTaskVal * 1}绩效。
            如任务逾期完成,则扣除正常绩效的{overdueVal * 1}%，计
            {((100 - overdueVal) * finishTaskVal * 0.01).toFixed(2)}
            绩效；如任务提前完成，则奖励正常绩效的{advanceVal * 1}%,计
            {((100 + advanceVal * 1) * finishTaskVal * 0.01).toFixed(2)}绩效。
          </p>
        </div>
      </div>
    );
  }
}
