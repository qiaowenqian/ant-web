import React from "react";
import { Radio, InputNumber, Checkbox, Select, message, DatePicker } from "antd";
import stylesheet from "styles/components/task/loopTask.scss";
import moment from "moment";
const Option = Select.Option;
/*
 （选填） closeCallBack()    // 关闭回调 type:"day",按天循环 type:"week",按周循环 type:"day",按天循环
 */
export default class LoopTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repeat: -1, //无限循环
      typeList: [{ type: "1", name: "按天" }, { type: "2", name: "按周" }, { type: "3", name: "按月" }],
      nextExecutionTimeString: null,
      orangalExecutionTimeString: null,
      repeatType: "1", //重复类型  1天 2周 3月份,
      dayCount: 1, //每？天，
      weekCount: 1, //每？周,
      monthCount: 1, //每？月
      monthDays: 1, //每？月-日,
      weekList: [
        { checked: 1, week: "周一", weeknum: 1 },
        { checked: 1, week: "周二", weeknum: 2 },
        { checked: 1, week: "周三", weeknum: 3 },
        { checked: 1, week: "周四", weeknum: 4 },
        { checked: 1, week: "周五", weeknum: 5 },
        { checked: 0, week: "周六", weeknum: 6 },
        { checked: 0, week: "周日", weeknum: 7 }
      ],
      weekRepeat: 1,
      skipWeekend: false, //默认不跳过周末
      selectedList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    };
  }
  componentWillMount() {
    this.setState({ nextExecutionTimeString: moment(), orangalExecutionTimeString: moment() });
  }
  componentWillReceiveProps = nextProp => { };
  componentDidMount() {
    if (this.props.taskCreateVals && this.props.taskCreateVals.repeatType) { this.initData() }
  }
  initData() {
    const { repeatType } = this.state;
    this.setState(
      {
        isSure: false,
        typeList: [{ type: "1", name: "按天" }, { type: "2", name: "按周" }, { type: "3", name: "按月" }],
        nextExecutionTimeString: moment(),
        orangalExecutionTimeString: moment(),
        dayCount: 1, //每？天，
        weekCount: 2, //每？周,
        weekList: [
          { checked: 1, week: "周一", weeknum: 1 },
          { checked: 1, week: "周二", weeknum: 2 },
          { checked: 1, week: "周三", weeknum: 3 },
          { checked: 1, week: "周四", weeknum: 4 },
          { checked: 1, week: "周五", weeknum: 5 },
          { checked: 0, week: "周六", weeknum: 6 },
          { checked: 0, week: "周日", weeknum: 7 }
        ],
        monthDays: 1,
        skipWeekend: false, //默认不跳过周末
        monthCount: 1 //每？月
      }, () => {
        const { weekList } = this.state;
        if (repeatType == "1") {
          this.setState({
            orangalExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString,
            dayCount: this.props.taskCreateVals.day,
            repeat: this.props.taskCreateVals.repeat, //-1表示无限循环
            skipWeekend: this.props.taskCreateVals.isWeekend, //	是否跳过周六周日  0不跳过 1跳过
            nextExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString //	下次执行时间
          });
        } else if (repeatType == "2") {
          weekList && weekList.map(item => { item.checked = 0 })
          this.props.taskCreateVals.weekDay && this.props.taskCreateVals.weekDay.map(item2 => { weekList[item2 - 1].checked = 1 })
          this.setState({
            orangalExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString,
            repeat: this.props.taskCreateVals.repeat,
            weekCount: this.props.taskCreateVals.week,
            weekDay: this.props.taskCreateVals.weekDay,
            weekRepeat: this.props.taskCreateVals.weekRepeat,
            nextExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString //	下次执行时间
          });
        } else if (repeatType == "3") {
          this.setState({
            orangalExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString,
            repeat: this.props.taskCreateVals.repeat,
            monthDays: this.props.taskCreateVals.monthDay,
            monthCount: this.props.taskCreateVals.month,
            skipWeekend: this.props.taskCreateVals.isWeekend,
            nextExecutionTimeString: this.props.taskCreateVals.nextExecutionTimeString //	下次执行时间
          });
        } else {
          this.setState({
            repeatType: "1",
            orangalExecutionTimeString: moment(),
            dayCount: "1",
            repeat: -1, //-1表示无限循环
            skipWeekend: false, //	是否跳过周六周日  0不跳过 1跳过
            nextExecutionTimeString: moment() //	下次执行时间
          });
        }
      }
    );
  }
  updatanextExecutionTimeString() {
    const { repeatType } = this.state;
    if (repeatType == "1") {
      this.setState({ nextExecutionTimeString: this.computedDay() });
    } else if (repeatType == "2") {
      this.setState({ nextExecutionTimeString: this.computedWeekDay() });
    } else if (repeatType == "3") {
      this.setState({ nextExecutionTimeString: this.computedMonth() });
    }
  }
  getNumOfWeek() {
    const { skipWeekend, orangalExecutionTimeString } = this.state;
    let newTime = new Date(orangalExecutionTimeString);
    if (skipWeekend) {
      if (moment(newTime).format("d") == 6) { return 2 }
      else if (moment(newTime).format("d") == 0) { return 1 }
      else { return 0 }
    } else { return 0 }
  }
  computedDay() {
    const { orangalExecutionTimeString } = this.state;
    if (this.getNumOfWeek() == "1") {
      return moment(orangalExecutionTimeString).add(1, "day");
    } else if (this.getNumOfWeek() == "2") {
      return moment(orangalExecutionTimeString).add(2, "day");
    } else {
      return moment(orangalExecutionTimeString);
    }
  }
  computedWeekDay() {
    const { weekList, orangalExecutionTimeString } = this.state;
    let nowWeekday = moment(orangalExecutionTimeString).format("d");
    let arr = weekList.filter(itemweek => itemweek.checked);
    let initnum = 0;
    // 默认不在规则之内
    let falg = true; //
    // //判断是否都比当前星期数小1 3
    //判断当前日期是否再规则之内
    try {
      arr.forEach((item, index) => {
        if (nowWeekday < item.weeknum) {
          initnum = item.weeknum - nowWeekday;
          this.setState({ weekRepeat: index + 1 })
          falg = false;
          throw new Error(JSON.stringify({ initnum, falg }));
        }
        if (nowWeekday == item.weeknum) {
          this.setState({ weekRepeat: index + 1 })
          falg = false;
          throw new Error(JSON.stringify({ initnum, falg }));
        }
      });
    } catch (error) {
      console.log("initnum1" + error);
    }
    // //如果都比当前星期数小，那么下次生效间隔就是7减当前星期数
    if (falg) {
      initnum = 7 + (arr[0].weeknum - nowWeekday);
      this.setState({ weekRepeat: 1 });
    }
    return moment(orangalExecutionTimeString).add(initnum, "day");
  }
  checkMonthDay(newDate) {
    const { monthDays } = this.state;
    let month = newDate.month();
    let lastDayMonth = newDate.endOf("month").date();
    if (lastDayMonth >= monthDays) {
      return newDate.date(monthDays);
    } else {
      newDate = newDate.month(month + 1);
      this.checkMonthDay(newDate, monthDays);
    }
  }
  computedMonth() {
    const { monthDays, orangalExecutionTimeString } = this.state;
    let currentDate = moment(orangalExecutionTimeString).date();
    let currentMonth = moment(orangalExecutionTimeString).month();
    let newDate = "";
    if (monthDays == 31) {
      newDate = moment(orangalExecutionTimeString).month(currentMonth).endOf("month");
    } else {
      if (currentDate > monthDays) {
        newDate = this.checkMonthDay(moment(orangalExecutionTimeString).month(currentMonth + 1));
      } else if (currentDate == monthDays) {
        newDate = moment(orangalExecutionTimeString);
      } else {
        newDate = this.checkMonthDay(moment(orangalExecutionTimeString).month(currentMonth));
      }
    }
    if (this.getNumOfWeek(moment(newDate), "day") == "1") {
      newDate = newDate.add(1, "day");
    } else if (this.getNumOfWeek(moment(newDate), "day") == "2") {
      newDate = newDate.add(2, "day");
    }
    return newDate;
  }
  //更改状态并重置相关状态
  changeRadio = type => {
    if (type == "1") {
      this.setState({
        monthCount: 1,
        weekCount: 1,
        weekList: [
          { checked: 1, week: "周一", weeknum: 1 },
          { checked: 1, week: "周二", weeknum: 2 },
          { checked: 1, week: "周三", weeknum: 3 },
          { checked: 1, week: "周四", weeknum: 4 },
          { checked: 1, week: "周五", weeknum: 5 },
          { checked: 0, week: "周六", weeknum: 6 },
          { checked: 0, week: "周日", weeknum: 7 }
        ],
        weekRepeat: 1
      });
    } else if (type == "2") {
      this.setState({ dayCount: 1, monthCount: 1, weekRepeat: 0 });
    } else if (type == "3") {
      this.setState({
        dayCount: 1,
        weekCount: 1,
        weekList: [
          { checked: 1, week: "周一", weeknum: 1 },
          { checked: 1, week: "周二", weeknum: 2 },
          { checked: 1, week: "周三", weeknum: 3 },
          { checked: 1, week: "周四", weeknum: 4 },
          { checked: 1, week: "周五", weeknum: 5 },
          { checked: 0, week: "周六", weeknum: 6 },
          { checked: 0, week: "周日", weeknum: 7 }
        ],
        weekRepeat: 1
      });
    }
    this.setState({ repeatType: type, skipWeekend: false }, () => { this.updatanextExecutionTimeString() })
  };
  //更改天的计划规则
  onChangeDay = val => {
    this.setState({ dayCount: val === "" || val == null ? 1 : val }, () => { this.updatanextExecutionTimeString() })
  };
  //更改周的计划

  onChangeWeek = val => {
    this.setState({ weekCount: val === "" || val == null ? 1 : val }, () => { this.updatanextExecutionTimeString() })
  };
  //更改月份
  onChangeCount = val => {
    this.setState({ monthCount: val === "" || val == null ? 1 : val }, () => { this.updatanextExecutionTimeString() });
  };
  changeState = () => { this.saveData() };
  saveData() {
    const { dayCount, weekCount, weekList, monthCount, monthDays, skipWeekend, nextExecutionTimeString, repeatType, weekRepeat } = this.state;
    let arr = [];
    weekList.filter(item => item.checked).map(item2 => { arr.push(item2.weeknum) });
    let obj = {};
    if (repeatType == "1") {
      obj = {
        repeat: -1, //-1表示无限循环
        day: dayCount, //	天数 1表示每天循环，大于1表示没几天执行一次
        isWeekend: skipWeekend ? 1 : 0, //	是否跳过周六周日  0不跳过 1跳过
        nextExecutionTimeString: nextExecutionTimeString //	下次执行时间
      };
    } else if (repeatType == "2") {
      obj = {
        repeat: -1, //-1表示无限循环
        week: weekCount, //	1表示每周执行 大于1表示没几周执行一次
        weekDay: arr, //	这周周一 周二 周三执行  1, 2, 3
        nextExecutionTimeString: nextExecutionTimeString, //	下次执行时间
        weekRepeat: weekRepeat,
        isWeekend: 0 //	是否跳过周六周日  0不跳过 1跳过
      };
    } else if (repeatType == "3") {
      obj = {
        repeat: -1, //-1表示无限循环
        month: monthCount, //	月份  1表示每月执行，大于1表示每个几月执行
        monthDay: monthDays, //	本月 1号2号3号执行  1, 2, 3
        isWeekend: skipWeekend ? 1 : 0, //	是否跳过周六周日  0不跳过 1跳过
        nextExecutionTimeString: nextExecutionTimeString //	下次执行时间
      };
    }
    this.props.creatTaskRule(obj);
  }
  changeSkipWeek = () => {
    const { skipWeekend, repeatType } = this.state;
    if (repeatType) {
      this.setState({ skipWeekend: !skipWeekend }, () => { this.updatanextExecutionTimeString() });
    }
  };
  selectWeek(itemobj, i) {
    const { weekList } = this.state;
    if (weekList.filter(item => item.checked).length > 1) {
      weekList[i].checked = !weekList[i].checked;
    } else {
      if (itemobj.checked) {
        message.info("请选择至少一天");
      } else {
        weekList[i].checked = !weekList[i].checked;
      }
    }
    this.setState({ weekList }, () => { this.updatanextExecutionTimeString() })
  }
  onChangeMonthDays = val => {
    this.setState({ monthDays: val }, () => { this.updatanextExecutionTimeString() })
  };
  render() {
    const { repeatType, typeList, dayCount, weekCount, weekList, monthCount, monthDays, selectedList, nextExecutionTimeString, skipWeekend } = this.state;
    return (
      <div className="loopBox">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="loopHeader">
          <div className="btn">
            <span className="title">重复规则</span>
            <span
              className={Object.keys(this.props.taskCreateVals).length === 0 ? "ssssssssss" : "determines"}
              onClick={() => {
                this.setState({ repeatType: "1", dayCount: 1, nextExecutionTimeString: moment(), orangalExecutionTimeString: moment() })
                this.props.creatTaskRule("cancel");
              }}
            >
              {this.props.clear && this.props.clear ? "清除" : ""}
            </span>
            <span
              className="determine"
              style={this.props.clear && this.props.clear ? {} : { marginLeft: 55 }}
              onClick={this.changeState}
            >
              保存
            </span>
          </div>
        </div>
        <div className="loopContent">
          <div className="loopTop">
            {typeList && typeList.map((item, index) => {
              return (
                <Radio
                  disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false}
                  className="list-radio"
                  onChange={() => this.changeRadio(item.type)}
                  checked={item.type == repeatType}
                  key={`planselect` + index}
                >
                  {item.name}
                </Radio>
              );
            })}
          </div>
          <div className="loopCenter">
            {repeatType == "1" && (
              <div>
                <span>每 </span>
                <InputNumber min={1} max={31} value={dayCount} onChange={this.onChangeDay} disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false} />
                <span> 天</span>
              </div>
            )}
            {repeatType == "2" && (
              <div className="week">
                <div className="iput">
                  <span>每 </span>
                  <InputNumber value={weekCount} onChange={this.onChangeWeek} min={1} max={4} disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false} />
                  <span> 周</span>
                </div>
                <ul className="Num">
                  {weekList.map((item, i) => {
                    return (
                      <li
                        key={i}
                        className={item.checked ? "selected" : ""}
                        onClick={() => {
                          if (this.props.showBtn && this.props.showBtn === "1") {
                          } else {
                            this.selectWeek(item, i);
                          }
                        }}
                      >
                        {item.week.substr(1, 1)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {repeatType == "3" && (
              <div>
                <span>每 </span>
                <InputNumber
                  min={1}
                  max={12}
                  value={monthCount}
                  onChange={this.onChangeCount}
                  disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false}
                />
                <span> 月 </span>
                <Select
                  defaultValue={monthDays}
                  onChange={this.onChangeMonthDays}
                  disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false}
                >
                  {selectedList.map(item => {
                    return (<Option value={item} key={item}> {item === 31 ? "最后一日" : item + "日"} </Option>)
                  })}
                </Select>
              </div>
            )}
          </div>
          <div className="loopTimeBox">
            <span>从 </span>
            {nextExecutionTimeString && (
              <DatePicker
                format="YYYY/MM/DD"
                allowClear={false}
                value={moment(nextExecutionTimeString)}
                disabledDate={current => { return current && current < moment().add(-1, "day") }}
                disabled={this.props.showBtn && this.props.showBtn === "1" ? true : false}
                onChange={date => {
                  this.setState(
                    { orangalExecutionTimeString: moment(date) },
                    () => { this.updatanextExecutionTimeString(); }
                  );
                }}
              />
            )}
            <span>开始执行</span>
          </div>
          <div className="loopChecxBox">
            <Checkbox
              checked={repeatType === "2" ? false : skipWeekend}
              disabled={repeatType === "2" || (this.props.showBtn && this.props.showBtn === "1") ? true : false}
              onChange={this.changeSkipWeek}
            >
              跳过周六、周日{skipWeekend}
            </Checkbox>
          </div>
          <div className="loopBottom">
            {repeatType == 1 && (
              <span> *该任务将于每 {dayCount === 1 || dayCount === "1" ? "" : dayCount} 天自动重复创建。 {skipWeekend ? "如遇周六、周日则顺延至下周一执行。" : ""}如需修改规则，可在 设置-自动化规则 中修改。</span>
            )}
            {repeatType == 2 && (
              <span>*该任务将于每{weekCount === 1 || weekCount === "1" ? "" : weekCount}周的{weekList.map(item => { return item.checked ? item.week + "、" : ""; })}自动重复创建。 如需修改规则，可在 设置-自动化规则 中修改。</span>
            )}
            {repeatType == 3 && (
              <span>*该任务将于每{monthCount === 1 || monthCount === "1" ? "" : monthCount}月{monthDays === 31 ? "最后一" : monthDays}日自动重复创建。{skipWeekend ? "如遇周六、周日则顺延至下周一执行。" : ""}如需修改规则，可在 设置-自动化规则 中修改。</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
