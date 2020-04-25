import React from "react";
import { Radio, InputNumber, Checkbox, Select, DatePicker } from "antd";
import stylesheet from "styles/components/task/loopTask.scss";
import moment from "moment";
const Option = Select.Option;
export default class LoopTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeList: [
        {
          type: "1",
          name: "按天"
        },
        {
          type: "2",
          name: "按周"
        },
        {
          type: "3",
          name: "按月"
        }
      ],
      weekList: [
        { checked: 0, week: "周一", weeknum: "1" },
        { checked: 0, week: "周二", weeknum: "2" },
        { checked: 0, week: "周三", weeknum: "3" },
        { checked: 0, week: "周四", weeknum: "4" },
        { checked: 0, week: "周五", weeknum: "5" },
        { checked: 0, week: "周六", weeknum: "6" },
        { checked: 0, week: "周日", weeknum: "7" }
      ]
    };
  }
  componentWillReceiveProps = nextProp => {
    const { weekList } = this.state;

    if (nextProp.taskCreateVals.weekDay) {
      let arr =
        nextProp.taskCreateVals.weekDay && nextProp.taskCreateVals.weekDay;
      arr.map(item => {
        weekList.map(items => {
          if (items.weeknum === item) {
            items.checked = 1;
          }
        });
      });
      this.setState({ weekList });
    }
  };
  componentDidMount() {
    const { weekList } = this.state;
    if (this.props.taskCreateVals.weekDay) {
      let arr =
        this.props.taskCreateVals.weekDay && this.props.taskCreateVals.weekDay;
      arr.map(item => {
        weekList.map(items => {
          if (items.weeknum === item) {
            items.checked = 1;
          }
        });
      });
      this.setState({ weekList });
    }
  }

  render() {
    const { typeList, weekList } = this.state;
    return (
      <div className="loopBox">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="loopHeader">
          <div className="btn">
            <span className="title">重复规则</span>
          </div>
        </div>
        <div className="loopContent">
          <div className="loopTop">
            {typeList &&
              typeList.map((item, index) => {
                return (
                  <Radio
                    disabled={true}
                    className="list-radio"
                    checked={item.type == this.props.taskCreateVals.repeatType}
                    key={`planselect` + index}
                  >
                    {item.name}
                  </Radio>
                );
              })}
          </div>
          <div className="loopCenter">
            {this.props.taskCreateVals.repeatType == "1" && (
              <div>
                <span>每 </span>
                <InputNumber
                  value={this.props.taskCreateVals.day}
                  disabled={true}
                />
                <span> 天</span>
              </div>
            )}
            {this.props.taskCreateVals.repeatType == "2" && (
              <div className="week">
                <div className="iput">
                  <span>每 </span>
                  <InputNumber
                    value={this.props.taskCreateVals.week}
                    disabled={true}
                  />
                  <span> 周</span>
                </div>
                <ul className="Num">
                  {weekList.map((item, i) => {
                    return (
                      <li
                        key={i}
                        className={item.checked ? "selectedBlack" : ""}
                      >
                        {item.week.substr(1, 1)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {this.props.taskCreateVals.repeatType == "3" && (
              <div>
                <span>每 </span>
                <InputNumber
                  value={this.props.taskCreateVals.month}
                  disabled={true}
                />
                <span> 月 </span>
                <Select
                  defaultValue={this.props.taskCreateVals.monthDay}
                  disabled={true}
                >
                  <Option
                    value={this.props.taskCreateVals.monthDay}
                    key={this.props.taskCreateVals.monthDay}
                  >
                    {this.props.taskCreateVals.monthDay}
                  </Option>
                </Select>
              </div>
            )}
          </div>
          <div className="loopTimeBox">
            <span>从 </span>
            <DatePicker
              format="YYYY/MM/DD"
              allowClear={false}
              value={moment(this.props.taskCreateVals.nextExecutionTimeString)}
              disabled={true}
            />
            <span> 开始执行</span>
          </div>
          <div className="loopChecxBox">
            <Checkbox
              checked={
                this.props.taskCreateVals.isWeekend &&
                this.props.taskCreateVals.isWeekend === "1"
                  ? true
                  : false
              }
              disabled={true}
            >
              跳过周六、周日
            </Checkbox>
          </div>
          <div className="loopBottom">
            {this.props.taskCreateVals.repeatType == 1 && (
              <span>
                *该任务将于每
                {this.props.taskCreateVals.day === 1
                  ? ""
                  : this.props.taskCreateVals.day}
                天自动重复创建。
                {this.props.taskCreateVals.skipWeekend
                  ? "如遇周六、周日则顺延至下周一执行。"
                  : ""}
                如需修改规则，可在 设置-自动化规则 中修改。
              </span>
            )}
            {this.props.taskCreateVals.repeatType == 2 && (
              <span>
                *该任务将于每
                {this.props.taskCreateVals.week === 1
                  ? ""
                  : this.props.taskCreateVals.week}
                周的
                {weekList.map(item => {
                  return item.checked ? item.week + "、" : "";
                })}
                自动重复创建。 如需修改规则，可在 设置-自动化规则 中修改。
              </span>
            )}
            {this.props.taskCreateVals.repeatType == 3 && (
              <span>
                *该任务将于每
                {this.props.taskCreateVals.month === "1"
                  ? ""
                  : this.props.taskCreateVals.month}
                个月
                {this.props.taskCreateVals.monthDay}日自动重复创建。
                {this.props.taskCreateVals.skipWeekend
                  ? "如遇周六、周日则顺延至下周一执行。"
                  : ""}
                如需修改规则，可在 设置-自动化规则 中修改。
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
