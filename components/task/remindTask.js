import React from "react";
import { Select } from "antd";
import stylesheet from "styles/components/task/remindTask.scss";
import { diff } from "../../core/utils/util";
const Option = Select.Option;
//taskRemindVals 提醒数组
export default class Remindtask extends React.Component {
  constructor(props) {
    super(props);
    this.state = { remind: [] };
  }
  componentWillMount = () => {
    // this.props.taskRemindVals; //arr:[]//  传过来的提醒数组
    if (this.props.taskRemindVals) { this.setState({ remind: this.props.taskRemindVals }) }
  };
  componentWillReceiveProps = nextProp => {
    // nextProp.taskRemindVals; // arr:[]  传过来的提醒数组
    if (nextProp.taskRemindVals) { this.setState({ remind: nextProp.taskRemindVals }) }
  };
  componentDidMount() { }
  //添加提醒
  addRemind = () => {
    const { remind } = this.state;
    if (remind.length < 5) {
      remind.push({
        taskTime: "start",
        advance: "0",
        time: "00:00",
        id: Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
      })
    }
    this.setState({ remind })
  };
  //删除提醒
  delRemind = index => {
    const { remind } = this.state
    remind.splice(index, 1)
    this.setState({ remind })
  };
  //保存提醒
  saveRemind = () => {
    const { remind } = this.state
    this.props.setRemind(remind)
  };
  //第一个选项改变的方法
  taskTimeChange = (taskTimeValue, id) => {
    const { remind } = this.state
    remind.map(item => { if (item.id === id) { item.taskTime = taskTimeValue } })
    this.setState({ remind })
  };
  //第2个选项改变的方法advanceChange
  advanceChange = (advanceValue, id) => {
    const { remind } = this.state;
    remind.map(item => { if (item.id === id) { item.advance = advanceValue } })
    this.setState({ remind });
  };
  //第三个选项改变的方法timeChange
  timeChange = (timeValue, id) => {
    const { remind } = this.state
    remind.map(item => { if (item.id === id) { item.time = timeValue } })
    this.setState({ remind });
  };
  render() {
    const { remind } = this.state;
    return (
      <div className="remindBox">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="loopHeader1">
          <div className="btn">
            <span className="title">任务提醒</span>
            {/* <span
              className={Object.keys(this.props.taskRemindVals).length === 0 ? "ssssssssss" : "determines"}
              onClick={() => { this.setState({ remind: [] }); this.props.setRemind([]); }}
            >
              清除
            </span> */}
            <span className="determine" onClick={this.saveRemind}>
              保存
            </span>
          </div>
        </div>
        <div className="remindTip">
          <span>自定义任务的提醒时间</span>
          <span className="addTip" onClick={() => { this.addRemind() }} >
            <i className="iconfont icon-add" style={remind.length == 5 ? { color: "#bdbdbd" } : {}} />
          </span>
        </div>
        <div className="RemSelectBox">
          {remind.map((item, index) => {
            return (
              <div className="RemSelectContent" key={item.id}>
                <Select
                  defaultValue={item.taskTime}
                  onChange={value => { this.taskTimeChange(value, item.id) }}
                  style={{ width: 106 }}
                >
                  <Option value="start">任务开始</Option>
                  <Option value="end">任务截止</Option>
                </Select>
                <Select
                  defaultValue={item.advance}
                  onChange={value => { this.advanceChange(value, item.id) }}
                  style={{ width: 90 }}
                >
                  <Option value="0">当天</Option>
                  <Option value="1">前1天</Option>
                  <Option value="2">前2天</Option>
                  <Option value="3">前3天</Option>
                  <Option value="4">前4天</Option>
                  <Option value="5">前5天</Option>
                  <Option value="6">前6天</Option>
                  <Option value="7">前7天</Option>
                  <Option value="8">前8天</Option>
                  <Option value="9">前9天</Option>
                  <Option value="10">前10天</Option>
                  <Option value="11">前11天</Option>
                  <Option value="12">前12天</Option>
                  <Option value="13">前13天</Option>
                  <Option value="14">前14天</Option>
                  <Option value="15">前15天</Option>
                </Select>
                <Select
                  defaultValue={item.time}
                  onChange={value => { this.timeChange(value, item.id) }}
                  style={{ width: 88 }}
                >
                  <Option value="00:00">00:00</Option>
                  <Option value="01:00">01:00</Option>
                  <Option value="02:00">02:00</Option>
                  <Option value="03:00">03:00</Option>
                  <Option value="04:00">04:00</Option>
                  <Option value="05:00">05:00</Option>
                  <Option value="06:00">06:00</Option>
                  <Option value="07:00">07:00</Option>
                  <Option value="08:00">08:00</Option>
                  <Option value="09:00">09:00</Option>
                  <Option value="10:00">10:00</Option>
                  <Option value="11:00">11:00</Option>
                  <Option value="12:00">12:00</Option>
                  <Option value="13:00">13:00</Option>
                  <Option value="14:00">14:00</Option>
                  <Option value="15:00">15:00</Option>
                  <Option value="16:00">16:00</Option>
                  <Option value="17:00">17:00</Option>
                  <Option value="18:00">18:00</Option>
                  <Option value="19:00">19:00</Option>
                  <Option value="20:00">20:00</Option>
                  <Option value="21:00">21:00</Option>
                  <Option value="22:00">22:00</Option>
                  <Option value="23:00">23:00</Option>
                </Select>
                <span className="delTip" onClick={() => { this.delRemind(index) }} >
                  <i className="iconfont icon-icon_huabanfuben5" />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
