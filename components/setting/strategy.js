import React from "react";
import { Collapse, Select, Popconfirm, Input, Checkbox, InputNumber, Radio, DatePicker, message, Button, Empty, Upload } from "antd";
import stylesheet from "styles/components/setting/strategy.scss";
import TagComponent from "../newtag";
import { findCyclicTaskList, updateMoreIndex, deleteCycleTaskinfo } from "../../core/service/task.service";
import { isIosSystem, onlyNumber, oneOf, createFileIcon } from "../../core/utils/util";
import { baseURI } from "../../core/api/HttpClient";
import dingJS from "../../core/utils/dingJSApi";
import moment from "moment";
const { TextArea } = Input;
const Panel = Collapse.Panel;
const Option = Select.Option;
const RadioGroup = Radio.Group;
export default class Strategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthDays: 1,
      weekRepeat: 1,
      //-------
      skipWeekend: false, //默认不跳过周末
      orangalExecutionTimeString: null,
      nextExecutionTimeString: null,
      isIos: true,
      rule: true,
      activeKeys: "",
      weekList: [
        { checked: 0, week: "周一", weeknum: 1 },
        { checked: 0, week: "周二", weeknum: 2 },
        { checked: 0, week: "周三", weeknum: 3 },
        { checked: 0, week: "周四", weeknum: 4 },
        { checked: 0, week: "周五", weeknum: 5 },
        { checked: 0, week: "周六", weeknum: 6 },
        { checked: 0, week: "周日", weeknum: 7 }
      ],
      selectedList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
      ],
      dateOrTime: true, //展示年月日还是年月日时分
      dateOrTime1: true, //展示年月日还是年月日时分
      list: [],
      Originallist: [],
      taskModifyState: true, //修改了任务保存按钮可点，否则不可点
      ruleModifyState: true, //修改了任务保存按钮可点，否则不可点

      limitAttention: false,
      limitArr: [], // 关注人列表
      resLength: 0,
      search: "", //搜索任务
      orz: null,
      Version: false
    };
  }
  componentWillMount = () => { this.getCycleTaskList() }

  componentDidMount() { this.setState({ isIos: isIosSystem() }) }

  getCycleTaskList = (search = "") => {
    findCyclicTaskList(search, taskList => {
      if (taskList.error) { return false }
      if (taskList && taskList.length > 0) {
        taskList.map(item => {
          if (item.day) {
            item.type = "day";
            item.typeOrz = "day";
            item.rule = `每${item.day === "1" ? "" : item.day}天${item.isWeekend === "1" ? "-跳过周六周日" : ""}`;
            item.month = "1";
            item.monthDay = "1";
            item.week = "1";
            item.weekDay = "1,2,3,4,5";
          } else if (item.week) {
            item.type = "week";
            item.typeOrz = "week";
            item.orzWeekTime = item.nextExecutionTime;
            item.rule = `每${item.week === "1" ? "" : item.week}周-${this.Arabia_To_SimplifiedChinese(item.weekDay)}`;
            item.month = "1";
            item.monthDay = "1";
            item.day = "1";
          } else if (item.month) {
            item.day = "1";
            item.type = "month";
            item.typeOrz = "month";
            item.week = "1";
            item.weekDay = "1,2,3,4,5";
            item.rule = `每${item.month === "1" ? "" : item.month}月-${item.monthDay}日 ${item.isWeekend === "1" ? "-跳过周六周日" : ""}`;
          }
          item.nextOrzTime = item.nextExecutionTime;
          item.orzTaskName = item.taskname && item.taskname;
          item.labels && item.labels.map(item => { item.name = item.labelname });
          item.taskNameLength = item.taskname && item.taskname.length;
          if (item.fileList === undefined) { item.fileList = [] }
          if (item.userResponse == undefined) { item.userResponse = {} }
          if (item.userFlow == undefined) { item.userFlow = {} }
          // if ((item.planEndTime && item.planEndTime.indexOf("23:59:59") !== -1) || item.planEndTime == undefined) {
          //   item.dateOrTime = true
          // }
          // if (item.planBeginTime && (item.planBeginTime.indexOf("23:59:59") !== -1) || item.planBeginTime == undefined || item.planBeginTime.indexOf("00:00:03") !== -1) {
          //   item.dateOrTime1 = true
          // }
        });
      }
      let Originallist = JSON.parse(JSON.stringify(taskList));
      this.setState({ list: taskList, Originallist: Originallist });
    });
  };
  Arabia_To_SimplifiedChinese = num => {
    let week = [];
    num.split(",").map(item => {
      if (item === "1") {
        week.push("周一");
      } else if (item === "2") {
        week.push("周二");
      } else if (item === "3") {
        week.push("周三");
      } else if (item === "4") {
        week.push("周四");
      } else if (item === "5") {
        week.push("周五");
      } else if (item === "6") {
        week.push("周六");
      } else if (item === "7") {
        week.push("周日");
      }
    });
    return week.join("、");
  };
  onChangeType = (e, id, type) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.type = e.target.value;
        if (item.typeOrz !== item.type) {
          this.setState({
            orangalExecutionTimeString: moment(),
            orz: moment()
          });
          item.isWeekend = "0";
          item.nextExecutionTime = moment();
        } else {
          item.nextExecutionTime = item.nextOrzTime;
          this.setState({
            orangalExecutionTimeString: moment(item.nextExecutionTime)
          });
        }
      }
    });
    this.setState({ list, ruleModifyState: false }, () => {
      this.updatanextExecutionTimeString(id, e.target.value);
    }
    );
  };
  computedMonth(lastTime) {
    const { monthDays } = this.state;
    let currentDate = moment(lastTime).date();
    let currentMonth = moment(lastTime).month();
    let newDate = "";
    if (monthDays == 31) {
      newDate = moment(lastTime).month(currentMonth).endOf("month")
    } else {
      if (currentDate > monthDays) {
        newDate = this.checkMonthDay(moment(lastTime).month(currentMonth + 1));
      } else if (currentDate == monthDays) {
        newDate = moment(lastTime);
      } else {
        newDate = this.checkMonthDay(moment(lastTime).month(currentMonth));
      }
    }
    if (this.getNumOfWeek(moment(newDate), "day") == "1") {
      newDate = newDate.add(1, "day");
    } else if (this.getNumOfWeek(moment(newDate), "day") == "2") {
      newDate = newDate.add(2, "day");
    }
    return newDate;
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

  //选择周
  onChangeWeekList(itemobj, i, id, type) {
    const { list } = this.state;
    list.map(item => {
      if (id === item.id) {
        if (itemobj.indexOf(`${i + 1}`) !== -1 && itemobj.length > 1) {
          itemobj.splice(itemobj.findIndex(items => items === `${i + 1}`), 1);
        } else {
          itemobj.push(`${i + 1}`);
        }
        item.weekDay = itemobj.sort().toString();
      }
      this.setState({ list, ruleModifyState: false }, () => {
        this.updatanextExecutionTimeString(id, type);
      });
    });
  }

  //天数改变
  onChangeDay = (value, id, type, lastTime) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.day = value;
        item.isWeekend = "0";
        if (lastTime) {
          item.nextExecutionTime = moment(item.lastExecutionTime).add(value, "day")
          this.updatanextExecutionTimeString(id, type);
        }
      }
    });
    this.setState({ list, ruleModifyState: false }, () => { });
  };
  // 周数改变
  onChangeWeek = (value, id) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.week = value;
        if (item.lastExecutionTime) {
          this.computedWeekDayLastTime(item.weekDay.split(","), item.lastExecutionTime, item);
        }
      }
    });
    this.setState({ list, ruleModifyState: false });
  };

  /**
   *
   * @param {时间} time
   * @param {*数组的差值} diffArr
   * @param {*id} id
   * @param {*本周第几次} weekRepeatNum
   * @param {*没几周} week
   * @param {*最开始的本周第集次} indexWeekNum
   * @param {*是不是初始化时间} falg
   */
  computeWeekAuthor(lastTime, diffArr, id, weekRepeatNum, week, initRepeat, repeatTimes) {
    //首先获取最后一次执行时间是周几
    const { list } = this.state;
    let initnum = 0;
    let nowDay = moment(new Date(moment().format("YYYY/MM/DD") + " 00:00:00"));
    // flag判断本周有没有过
    if (diffArr[weekRepeatNum] * 1 < 0) {
      initnum = diffArr[weekRepeatNum] + week * repeatTimes * 7;
    } else {
      initnum = diffArr[weekRepeatNum] + (week * repeatTimes - 1) * 7;
    }

    let newTime = moment(lastTime).add(initnum, "day");
    if (newTime.diff(nowDay, "day") > 0) {
      list.map(item => {
        if (item.id === id) {
          item.nextExecutionTime = newTime;
          item.weekRepeat = weekRepeatNum;
        }
      });
      this.setState({ list });
    } else {
      weekRepeatNum = weekRepeatNum + 1;

      //此处是为了将所有的星期第一次的时间都算出来
      if (weekRepeatNum >= diffArr.length) {
        weekRepeatNum = 0;
      }
      if (weekRepeatNum == initRepeat) {
        repeatTimes = repeatTimes + 1;
      }
      //如果是第一次就要初始化一下如果走完一轮之后直接加周就行了不用再
      this.computeWeekAuthor(lastTime, diffArr, id, weekRepeatNum, week, initRepeat, repeatTimes);
    }
  }
  computedWeekDayLastTime(orangaWeekList, lastTime, weekItemObj) {
    let nowWeekday = moment(lastTime).format("d");
    let id = weekItemObj.id;
    let week = weekItemObj.week;
    let weekRepeatNum = 0;
    let initRepeat = 0;
    let diffArr = [];
    try {
      orangaWeekList.map(item => {
        let differ = item - nowWeekday;
        diffArr.push(differ);
      });
      orangaWeekList.forEach((item, index) => {
        if (nowWeekday <= item) {
          weekRepeatNum = index;
          initRepeat = index;
          throw new Error("计算周时间");
        }
      });
    } catch (error) {
      console.log(error);
    }
    if (week) {
      return this.computeWeekAuthor(lastTime, diffArr, id, weekRepeatNum, week, initRepeat, 1);
    }
  }
  //月的天数改变
  onChangeMonthDay = (value, id, type) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.monthDay = value;
        if (item.typeOrz !== item.type) {
          this.setState({ orangalExecutionTimeString: moment() })
        } else {
          this.setState({ orangalExecutionTimeString: moment(item.nextExecutionTime) })
        }
      }
    });
    this.setState({ list, monthDays: value, ruleModifyState: false }, () => {
      this.updatanextExecutionTimeString(id, type);
    });
  };
  //月数改变
  onChangeMonth = (value, id) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.month = value;
        item.monthDay = moment(item.nextExecutionTime).format("D");
        item.nextExecutionTime = moment(item.orzNextTime).add(value, "month");
      }
    });
    this.setState({ list, ruleModifyState: false }, () => { });
  };
  addMonth = (value, id) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id && item.lastExecutionTime) {
        item.monthDay = "1";
        item.nextExecutionTime = moment(item.orzNextTime).add(value, "month");
        item.lastExecutionTime = moment(item.orzNextTime).add(value, "month");
      }
    });
    this.setState({ list });
  };
  //跳过周六周日改变
  onChangeSkipWeek = (checked, id, type, data) => {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        item.isWeekend = checked ? "1" : "0";
        this.setState({ list, skipWeekend: checked, orangalExecutionTimeString: moment(data), ruleModifyState: false }, () => {
          this.updatanextExecutionTimeString(id, type);
        }
        );
      }
    });
  };
  //删除循环任务列表
  delCycleList = (id, index) => {
    const { list } = this.state;
    list.map((item, i) => {
      if (item.id === id) {
        deleteCycleTaskinfo(item.id, item.projectId, data => { });
        list.splice(index, 1);
        message.success("删除成功");
      }
    });
    this.setState({ list });
  };
  //修改任务信息
  editTaskInfo = (value, type, id) => {
    const { list } = this.state;
    if (type === "name") {
      list.map(item => {
        if (item.id === id && value.length <= 50) {
          item.taskname = value;
        }
      });
    } else if (type === "rwjx") {
      list.map(item => {
        if (item.id === id) {
          item.flowConten = value;
        }
      });
    } else if (type === "yjgq") {
      list.map(item => {
        if (item.id === id) {
          item.workTime = value;
        }
      });
    } else if (type === "zycd") {
      list.map(item => {
        if (item.id === id) {
          item.coefficienttype = value;
        }
      });
    } else if (type === "desc") {
      list.map(item => {
        if (item.id === id) {
          item.description = value;
        }
      });
    }
    list.map(item => {
      if (item.id === id) {
      }
    });
    this.setState({ list, taskModifyState: false });
  };
  //选人  //选人
  selUser = (title, id, gzrArr) => {
    let selectedUsers = [];
    let { list } = this.state;
    let multiple = false;
    if (title == "关注人") {
      multiple = true;
      const gzr = [];
      gzrArr &&
        gzrArr.map(user => {
          gzr.push(user);
        });
      selectedUsers = gzr;
    }
    const that = this;
    dingJS.selectUser(
      selectedUsers,
      "请选择" + title,
      data => {
        if (!data) {
          return false;
        }
        const user = data[0];
        if (!user) {
          return false;
        }
        if (title === "负责人") {
          list.map(item => {
            if (item.id === id) {
              item.userResponse.userid = data[0].emplId;
              item.userResponse.name = data[0].name;
              item.userResponse.photo = data[0].avatar;
            }
          });
          that.setState({ list, taskModifyState: false });
        } else if (title === "确认人") {
          list.map(item => {
            if (item.id === id) {
              item.userFlow.userid = data[0].emplId;
              item.userFlow.name = data[0].name;
              item.userFlow.photo = data[0].avatar;
            }
          });
          that.setState({ list, taskModifyState: false });
        } else if (title === "关注人") {
          list &&
            list.map(item => {
              if (item.id === id) {
                let gzr = [];
                data.map(items => {
                  gzr.push({
                    userid: items.emplId,
                    name: items.name,
                    photo: items.avatar
                  });
                });
                if (data && data.length > 20) {
                  that.setState({
                    limitAttention: true,
                    resLength: data.length,
                    limitArr: gzr,
                    taskModifyState: false
                  });
                } else {
                  this.addCollectList(gzr, id);
                }
              }
            });
        }
      },
      multiple
    );
  };

  // 添加关注人
  addCollectList = (List, id) => {
    const { list } = this.state;
    list.map(item => {
      if (id === item.id) {
        item.collectList = List;
      }
    });
    this.setState({ list, taskModifyState: false });
  };
  //加入项目成员
  confirmPopconfirm = id => {
    const { list, limitArr } = this.state;
    list.map(item => {
      if (id === item.id) {
        item.collectList = limitArr;
      }
    });
    this.setState({
      list,
      limitAttention: false
    });
  };
  //不加入项目成员
  canclePopconfirmSecond = () => {
    const { list } = this.state;
    list.map(item => {
      if (id === item.id) {
        item.collectList = limitArr;
      }
    });
    this.setState({
      list,
      limitAttention: false
    });
  };
  //移除负责人 确认人
  remove = (type, id) => {
    const { list } = this.state;
    if (type === "fzr") {
      list.map(item => {
        if (item.id === id) {
          item.userResponse = { userid: "DELL" };
        }
      });
    } else if (type === "shr") {
      list.map(item => {
        if (item.id === id) {
          item.userFlow = { userid: "DELL" };
        }
      });
    }
    this.setState({ list, taskModifyState: false });
  };
  //选择标签
  tagChange = (tag, id) => {
    const { list } = this.state;
    list.map(itemList => {
      if (itemList.id === id) {
        itemList.labels = [];
        itemList.labels = tag;
      }
    });
    this.setState({ list, taskModifyState: false });
  };
  // 删除上传附件 钉钉组件
  dellDescFileById = (fileId, taskId) => {
    let { list } = this.state;
    list.map(item => {
      if (item.id === taskId) {
        item.fileList.map((itemList, i) => {
          if (
            (itemList.fileId && itemList.fileId === fileId) ||
            (itemList.id && itemList.id === fileId)
          ) {
            // item.fileList.splice(i, 1);
            item.fileList[i].type = "DELL";
            this.setState({ list, taskModifyState: false });
            return false;
          }
        });
      }
    });
  };
  saveTaskInfo = id => {
    const { list, weekRepeat } = this.state;
    let updata = {}; //修改参数
    let tagRelation = []; //标签处理数组，添加一个rtype：c
    let userIdList = []; //关注人数组处理只传Id
    list.map(item => {
      if (item.id === id) {
        updata.repeat = -1; //无限循环
        updata.id = item.id; //id
        updata.taskname =
          item.taskname.length === 0 ? item.orzTaskName : item.taskname; //任务名
        updata.proname = item.proname; //项目名
        updata.projectId = item.projectId; //项目ID
        updata.nextExecutionTimeString = moment(item.nextExecutionTime).format(
          "YYYY-MM-DD"
        );
        //nextExecutionTime 下次执行时间
        //-------以上必须传的参数
        updata.coefficienttype = item.coefficienttype; //优先级
        updata.description = item.description;
        updata.fileList = item.fileList;
        item.collectList &&
          item.collectList.map(item => {
            userIdList.push(item.userid);
          });
        item.labels &&
          item.labels.map(tag => {
            tagRelation.push({
              label: {
                id: tag.id,
                labelname: tag.name,
                color: tag.color,
                type: tag.type
              },
              rtype: "c"
            });
          });
        updata.collectUserList = userIdList;

        updata.labelrelations = tagRelation;

        updata.flowConten = item.flowConten; //任务绩效
        updata.userFlow = {};
        updata.userResponse = {};
        updata.userFlow.userid = item.userFlow.userid; //确认人
        updata.userResponse.userid = item.userResponse.userid; //负责人
        updata.workTime = item.workTime; //计划工期planBeginTime
        if (item.planEndTime) {
          updata.planEndTimeString = moment(item.planEndTime).format(
            "YYYY-MM-DD HH:mm"
          ); //截止时间
        } else {
          updata.planEndTimeString = "DELL";
        }
        if (item.planBeginTime) {
          updata.planBeginTimeString = moment(item.planBeginTimeString).format("YYYY-MM-DD HH:mm");
        } else {
          updata.planBeginTimeString = "DELL";
        }
        if (item.type === "day") {
          //按天循环
          updata.day = item.day; //每几天循环一次
          updata.isWeekend = item.isWeekend; //是否跳过周末
        }
        if (item.type === "week") {
          //按周循环
          updata.weekRepeat = weekRepeat;
          updata.week = item.week; //每几周循环一次
          updata.weekDay = item.weekDay; //每周的周几循环
          updata.isWeekend = 0; //是否跳过周末
        }
        if (item.type === "month") {
          //按月循环
          updata.monthDay = item.monthDay.toString(); //每月的几号循环
          updata.month = item.month; //每几个月循环一次
          updata.isWeekend = item.isWeekend; //是否跳过周末
        }
      }
    });

    updateMoreIndex(updata, data => {
      let Originallist = JSON.parse(JSON.stringify(list));
      this.setState({
        activeKeys: "",
        Originallist: Originallist,
        ruleModifyState: true,
        taskModifyState: true
      });
      this.getCycleTaskList();
      message.success("修改成功");
    });
  };

  cancalRule = (id, index) => {
    const { Originallist, list } = this.state;
    list.map(item => {
      if (item.id === id) {
        this.setState({
          activeKeys: "",
          list: JSON.parse(JSON.stringify(Originallist)),
          taskModifyState: true,
          ruleModifyState: true
        });
      }
    });
  };
  orzTime = id => {
    const { list } = this.state;
    list.map(item => {
      if (id === item.id && item.type === "month") {
        this.setState({
          orz: item.nextExecutionTime
        });
      } else if (id === item.id && item.type === "week") {
        this.setState({
          orz: item.nextExecutionTime
        });
      }
    });
  };
  changeTaskOrRule = (type, id) => {
    const { activeKeys } = this.state;
    if (activeKeys === "") {
      if (type === "修改任务") {
        this.setState({ rule: false, activeKeys: id.toString() });
      } else if (type === "修改规则") {
        this.setState({ rule: true, activeKeys: id.toString() });
      }
    } else if (activeKeys !== id) {
      if (type === "修改任务") {
        this.setState({ rule: false, activeKeys: id.toString() });
      } else if (type === "修改规则") {
        this.setState({ rule: true, activeKeys: id.toString() });
      }
    } else {
      this.setState({ activeKeys: "" });
    }
  };
  // //判断是不是周末的方法
  getNumOfWeek(nextTime) {
    const { skipWeekend, orangalExecutionTimeString } = this.state;
    let newTime = new Date(orangalExecutionTimeString);
    if (skipWeekend) {
      if (moment(nextTime).format("d") == 6) {
        return "2";
      } else if (moment(nextTime).format("d") == 0) {
        return "1";
      } else {
        return "0";
      }
    } else {
      return "0";
    }
  }
  // //更新开始执行时间
  updatanextExecutionTimeString(id, type) {
    const { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        if (type == "day") {
          item.nextExecutionTime = this.computedDay(
            item.lastExecutionTime,
            item.day,
            item.nextExecutionTime,
            item.isWeekend
          );
        } else if (type == "week") {
          if (item.lastExecutionTime) {
            this.computedWeekDayLastTime(
              item.weekDay.split(","),
              item.nextExecutionTime,
              item
            );
          } else {
            item.nextExecutionTime = this.computedWeekDay(
              item.weekDay.split(",")
            );
          }
        } else if (type == "month") {
          item.nextExecutionTime = this.computedMonth(item.nextExecutionTime);
        }
      }
    });
    this.setState({ list });
  }
  //计算按天执行的时间规范
  computedDay(lastTime, valueDay, nextTime, isWeek) {
    if (this.getNumOfWeek(nextTime) == "1") {
      return moment(nextTime).add(1, "day");
    } else if (this.getNumOfWeek(nextTime) == "2") {
      return moment(nextTime).add(2, "day");
    } else {
      return moment(nextTime);
    }
    // }
  }
  //计算按周执行的时间规范
  computedWeekDay(orangaWeekList) {
    const { orz } = this.state;
    let nowWeekday = moment(orz).format("d");
    let initnum = 0;
    // 默认不在规则之内
    let falg = true; //
    // //判断是否都比当前星期数小1 3
    //判断当前日期是否再规则之内
    try {
      orangaWeekList.forEach((item, index) => {
        if (nowWeekday < item) {
          initnum = item - nowWeekday;
          this.setState({ weekRepeat: index + 1 });
          falg = false;
          throw new Error(JSON.stringify({ initnum, falg }));
        }
        if (nowWeekday == item) {
          this.setState({ weekRepeat: index + 1 });
          falg = false;
          throw new Error(JSON.stringify({ initnum, falg }));
        }
      });
    } catch (error) {
      console.log("initnum1" + error);
    }
    // //如果都比当前星期数小，那么下次生效间隔就是7减当前星期数
    if (falg) {
      initnum = 7 + (orangaWeekList[0] - nowWeekday);
      this.setState({ weekRepeat: 1 });
    }
    return moment(orz).add(initnum, "day");
  }
  // 上传附件 钉钉组件
  updataFile = id => {
    let { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        dingJS.uploadImage(result => {
          const data = result.data;
          if (data && data.length > 0) {
            data.map(items => {
              item.fileList.push(items);
            });
            this.setState({ list, taskModifyState: false });
          }
        }, true);
      }
    });
  };
  // 删除关注人
  removeCollectUser = (user, id) => {
    let { list } = this.state;
    list.map(item => {
      if (item.id === id) {
        let oldGzr = item.collectList;
        let newGzr = [];
        if (oldGzr && oldGzr.length > 0) {
          oldGzr.map(items => {
            if (items.userid !== user.userid) {
              newGzr.push(items);
            }
          });
          item.collectList = newGzr;
        }
      }
    });
    this.setState({ list, taskModifyState: false });
  };
  // dateChange = (date, dataStr, id) => {
  //   const { list } = this.state;
  //   list.map(item => {
  //     if (item.id === id) {
  //       if (dataStr === "") {
  //         item.dateOrTime = true;
  //       }
  //       //垃圾逻辑
  //       if (dataStr.length === 10) {
  //         item.planEndTime = dataStr + " 00:00:00";
  //       } else {
  //         item.planEndTime = dataStr;
  //       }
  //     }
  //   });
  //   this.setState({ list, taskModifyState: false });
  // };
  // //切换日期时间面板改变时间展示格式，，mode 为 time 时 展示 年月日 时分， 为date时展示年月日
  // modeChange = (date, mode, id) => {
  //   const { list } = this.state;
  //   list &&
  //     list.map(item => {
  //       if (item.id === id) {
  //         if (mode === "time") {
  //           item.dateOrTime = false;
  //         }
  //       }
  //     });
  //   this.setState({ list, taskModifyState: false });
  // };
  // dateChange1 = (date, dataStr, id) => {
  //   const { list } = this.state;
  //   list.map(item => {
  //     if (item.id === id) {
  //       if (dataStr === "") {
  //         item.dateOrTime1 = true;
  //       }
  //       //垃圾逻辑
  //       if (dataStr.length === 10) {
  //         item.planBeginTime = dataStr + " 00:00:00";
  //       } else {
  //         item.planBeginTime = dataStr;
  //       }
  //     }
  //   });
  //   this.setState({ list, taskModifyState: false });
  // };
  // //切换日期时间面板改变时间展示格式，，mode 为 time 时 展示 年月日 时分， 为date时展示年月日
  // modeChange1 = (date, mode, id) => {
  //   const { list } = this.state;
  //   list &&
  //     list.map(item => {
  //       if (item.id === id) {
  //         if (mode === "time") {
  //           item.dateOrTime1 = false;
  //         }
  //       }
  //     });
  //   this.setState({ list, taskModifyState: false });
  // };
  closeModal() {
    this.props.closedCallBack();
  }
  // pasteingImg = e => {
  //   pasteImg(e, url => {
  //     console.log(url);

  //     updateImgsInService(url, data => {
  //       if (data.err) {
  //         return false;
  //       }
  //       const fileObj = data;
  //       fileObj.type = "";
  //       fileObj.uid = fileObj.id;
  //       let { taskInfo } = this.state;
  //       taskInfo.filesList.push(fileObj);
  //       this.setState({ taskInfo: taskInfo });

  //       // 处理给上传控件
  //       let { uploadList_desc } = this.state;
  //       uploadList_desc.push({
  //         uid: fileObj.id,
  //         name: fileObj.fileName,
  //         status: "done",
  //         url: fileObj.fileUrlAbsolute
  //       });
  //       this.setState({ uploadList_desc: uploadList_desc });
  //     });
  //   });
  // };
  render() {
    const { isIos, list, rule, activeKeys, weekList, selectedList, taskModifyState, ruleModifyState, resLength, limitAttention, search } = this.state;
    let suffixDom = (
      <i className="iconfont icon-clears" onClick={() => { this.setState({ search: "" }); this.getCycleTaskList(""); }} />
    );
    return (
      <div className="strategyModal">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className="top">
          <div className="topContent">
            <Input className="inputStyle"
              prefix={<i className={isIos ? "iconfont icon-search" : "iconfont icon-search window-search"} />}
              value={search}
              onChange={e => {
                if (e.target.value === "") {
                  this.setState({ search: "" }, () => { this.getCycleTaskList("") });
                } else {
                  this.setState({ search: e.target.value });
                }
              }}
              onPressEnter={e => { this.getCycleTaskList(this.state.search) }}
              suffix={this.state.search === "" ? "" : suffixDom}
              placeholder="任务名称"
            />
            <div className="title">自动化规则(共{list && list.length}条)</div>
          </div>
        </div>

        <div className="tableBox">
          <div className="tableHeader">
            <div className="taskname">任务名</div>
            <div className="userName">负责人</div>
            <div className="times">已重复次数</div>
            <div className="rule">规则</div>
          </div>
          <div className={activeKeys === "" ? "tableContent" : "tableContent tableContentActive"} >
            <Collapse bordered={false} accordion={true} activeKey={activeKeys}>
              {list && list.length > 0 && list.map((item, index) => {
                return (
                  <Panel
                    key={item.id}
                    showArrow={false}
                    header={
                      <div className="headerDom">
                        <div className="name">
                          <div className="taskName"> {item.taskname && item.taskname}</div>
                          <div className="projectName"> <i className="iconfont icon-project " /> {item.proname} </div>
                        </div>
                        <div className="username"> {item.userResponse && item.userResponse.name ? item.userResponse.name : "未指派"} </div>
                        <div className="num"> {item.cycles && item.cycles}次</div>
                        <div className="order">{item.rule}</div>
                        <div className="operation">
                          <span onClick={e => { e.stopPropagation(); this.changeTaskOrRule("修改任务", item.id); }} >修改任务</span>
                          <span onClick={e => { e.stopPropagation(); this.changeTaskOrRule("修改规则", item.id); this.orzTime(item.id); }} > 修改规则  </span>
                          <Popconfirm title={`是否要删除"${item.taskname}"`} onConfirm={e => { this.delCycleList(item.id, index) }} okText="删除" cancelText="取消"  >
                            <span onClick={e => { e.stopPropagation(); }} className="del">删除</span>
                          </Popconfirm>
                        </div>
                      </div>
                    }
                  >
                    {rule ? (
                      <div className="ruleBox">
                        <div className="rule">
                          <div className="loopTop">
                            <RadioGroup onChange={e => { this.onChangeType(e, item.id, item.type) }} value={item.type} >
                              <Radio value={"day"}>按天</Radio>
                              <Radio value={"week"}>按周</Radio>
                              <Radio value={"month"}>按月</Radio>
                            </RadioGroup>
                          </div>
                          <div className="loopCenter">
                            {item.type === "day" ? (
                              <div className="day">
                                <span>每 </span>
                                <InputNumber
                                  value={item.day ? item.day : 1}
                                  min={1}
                                  max={30}
                                  onChange={value => { this.onChangeDay(value, item.id, item.type, item.lastExecutionTime); }}
                                />
                                <span> 天</span>
                              </div>
                            ) : ("")}
                            {item.type === "week" ? (
                              <div className="week">
                                <div className="iput">
                                  <span>每 </span>
                                  <InputNumber
                                    value={item.week ? item.week : 1}
                                    min={1}
                                    max={4}
                                    onChange={value => { this.onChangeWeek(value, item.id); }}
                                  />
                                  <span> 周</span>
                                </div>
                                <ul className="Num">
                                  {weekList.map((list, i) => {
                                    return (
                                      <li
                                        key={i}
                                        className={oneOf(list.weeknum, item.weekDay.split(",")) ? "selected" : ""}
                                        onClick={() => { this.onChangeWeekList(item.weekDay.split(","), i, item.id, item.type); }}
                                      >
                                        {list.week.substr(1, 1)}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : ("")}
                            {item.type === "month" ? (
                              <div className="month">
                                <span>每 </span>
                                <InputNumber
                                  min={1}
                                  max={12}
                                  value={item.month ? item.month : 1}
                                  onChange={value => { this.onChangeMonth(value, item.id) }}
                                />
                                <span> 月 </span>
                                <Select value={item.monthDay} onChange={e => { this.onChangeMonthDay(e, item.id, item.type); }}  >
                                  {selectedList.map(items => {
                                    return (<Option value={items} key={items}>  {items === "31" ? "最后一日" : items + "日"}  </Option>);
                                  })}
                                </Select>
                              </div>
                            ) : ("")}
                          </div>
                          <div className="loopTimeBox">
                            <span className="textss">{item.cycles === "0" ? "从" : "下一次从"} </span>
                            {item.nextExecutionTime && (
                              <DatePicker
                                format="YYYY/MM/DD"
                                allowClear={false}
                                value={moment(item.nextExecutionTime)}
                                disabledDate={current => { return (current && current < moment().add(-1, "day")) }}
                                onChange={date => {
                                  item.nextExecutionTime = date;
                                  this.setState(
                                    { orangalExecutionTimeString: moment(date), orz: moment(date), monthDays: parseInt(item.monthDay), ruleModifyState: false },
                                    () => { this.updatanextExecutionTimeString(item.id, item.type) }
                                  );
                                }}
                              />
                            )}
                            <span className="textsss"> 开始执行</span>
                          </div>
                          <div className="loopChecxBox">
                            <Checkbox
                              checked={item.isWeekend === "0" || item.type === "week" ? false : true}
                              disabled={item.type === "week"}
                              onChange={e => { this.onChangeSkipWeek(e.target.checked, item.id, item.type, item.nextExecutionTime); }}
                            >
                              跳过周六、周日
                              </Checkbox>
                          </div>

                          <div className="loopBottom">
                            {item.type === "day" && (
                              <span> *该任务将于每 {item.day === 1 || item.day === "1" ? "" : item.day} 天自动重复创建。{item.isWeekend === "1" ? "如遇周六、周日则顺延至下周一执行。" : ""}修改后按新规则执行。</span>
                            )}
                            {item.type === "week" && (
                              <span>*该任务将于每{item.week === 1 || item.week === "1" ? "" : item.week}周的{this.Arabia_To_SimplifiedChinese(item.weekDay)}自动重复创建。修改后按新规则执行。</span>
                            )}
                            {item.type === "month" && (
                              <span>*该任务将于每{item.month === 1 || item.month === "1" ? "" : item.month}月的{item.monthDay === 31 ? "最后一" : item.monthDay}日自动重复创建。{item.isWeekend === "1" ? "如遇周六、周日则顺延至下周一执行。" : ""}修改后按新规则执行。</span>
                            )}
                            <div className="btn">
                              <Button onClick={() => { this.cancalRule(item.id, index) }} className="cancel"> 取消 </Button>
                              <Button onClick={() => { this.saveTaskInfo(item.id); }} className="determine" disabled={ruleModifyState} type={ruleModifyState ? "" : "primary"} >保存</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className="taskBox">
                          <div className="proSelect">
                            <span><span style={{ marginRight: 11, color: "#ffa031", fontSize: 14 }} >*</span>任务名称</span>
                            <div className="rightInput">
                              <Input
                                placeholder="建议不超过50个字"
                                className="input"
                                value={item.taskname}
                                onChange={e => { this.editTaskInfo(e.target.value, "name", item.id); }}
                              />
                              <div className="titnum">
                                <span className="titlength">{item.taskname.length}</span>/50
                              </div>
                            </div>
                          </div>
                          <div className="personSelect">
                            <div className="left">
                              <span className="fzr">
                                <i className="icon-user iconfont" />
                                <i />负<i />责<i />人
                              </span>
                              <div className="person">
                                {item.userResponse && item.userResponse.photo && item.userResponse.photo !== "" ? (
                                  <img src={item.userResponse && item.userResponse.photo} onClick={() => { this.selUser("负责人", item.id) }} />
                                ) : item.userResponse && item.userResponse.name ? (
                                  <div className="noPhoto" onClick={() => { this.selUser("负责人", item.id); }}>
                                    {item.userResponse.name.substr(0, 1)}
                                  </div>
                                ) : (
                                      <svg
                                        className="download"
                                        aria-hidden="true"
                                        onClick={() => { this.selUser("负责人", item.id); }}
                                      >
                                        <use xlinkHref="#icon-file-avatar" />
                                      </svg>
                                    )}
                                {item.userResponse && item.userResponse.name ? (
                                  <span
                                    onClick={() => { this.selUser("负责人", item.id); }}
                                  >
                                    {item.userResponse.name}
                                    {item.userResponse && item.userResponse.name && (
                                      <i className="iconfont icon-clears delPerson"
                                        onClick={e => { e.stopPropagation(); e.preventDefault(); this.remove("fzr", item.id); }}
                                      />
                                    )}
                                  </span>
                                ) : (<span onClick={() => { this.selUser("负责人", item.id) }} >选择</span>)}
                              </div>
                            </div>
                            <div className="center">
                              <span>
                                <i className="icon-checker iconfont" />
                                <i />确 <i />认 <i />人
                              </span>
                              <div className="person">
                                {item.userFlow && item.userFlow.photo && item.userFlow.photo !== "" ? (
                                  <img
                                    src={item.userFlow && item.userFlow.photo}
                                    onClick={() => { this.selUser("确认人", item.id) }}
                                  />
                                ) : item.userFlow && item.userFlow.name ? (
                                  <div
                                    className="noPhoto"
                                    onClick={() => { this.selUser("确认人", item.id) }}
                                  >
                                    {item.userFlow.name.substr(0, 1)}
                                  </div>
                                ) : (
                                      <svg
                                        className="download"
                                        aria-hidden="true"
                                        onClick={() => { this.selUser("确认人", item.id) }}
                                      >
                                        <use xlinkHref="#icon-file-avatar" />
                                      </svg>
                                    )}
                                {item.userFlow && item.userFlow.name ? (
                                  <span
                                    onClick={() => { this.selUser("确认人", item.id) }}
                                  >
                                    {item.userFlow.name}
                                    {item.userFlow && item.userFlow.name && (
                                      <i
                                        className="iconfont icon-clears delPerson"
                                        onClick={e => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          this.remove("shr", item.id);
                                        }}
                                      />
                                    )}
                                  </span>
                                ) : (
                                    <span onClick={() => { this.selUser("确认人", item.id) }} >选择</span>
                                  )}
                              </div>
                            </div>
                            <div className="right">
                              <span>
                                <i className="icon-target1 iconfont" />
                                任务绩效
                              </span>
                              <div className="taskNum">
                                <Input
                                  className="inputNumber"
                                  value={item.flowConten}
                                  onChange={e => {
                                    onlyNumber(e.target);
                                    this.editTaskInfo(e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"), "rwjx", item.id);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="timeSelect">
                            <div className="left">
                              <span>
                                <i className="icon-calendar1 iconfont" />
                                时<i className="tt" />间
                                </span>
                              {/* <DatePicker
                                value={item.planBeginTime ? moment(item.planBeginTime) : null}
                                showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                                format={item.dateOrTime1 ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm"}
                                onPanelChange={(date, mode) => { this.modeChange1(date, mode, item.id) }}
                                onChange={(date, dataStr) => { this.dateChange1(date, dataStr, item.id) }}
                                className={item.dateOrTime1 ? "showTime start" : "start"}
                              />
                              <span style={{ marginRight: 10, color: "#bdbdbd", width: 10 }}>-</span>
                              <DatePicker
                                value={item.planEndTime ? moment(item.planEndTime) : null}
                                showTime={{ format: "HH:mm", defaultValue: moment("00:00", "HH:mm") }}
                                format={item.dateOrTime ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm"}
                                onPanelChange={(date, mode) => { this.modeChange(date, mode, item.id) }}
                                onChange={(date, dataStr) => { this.dateChange(date, dataStr, item.id) }}
                                className={item.dateOrTime ? "showTime end" : "end"}
                              /> */}
                              <div style={{ color: "#bdbdbd", display: "inline-block" }}>起止时间会根据重复规则和工期自动计算</div>
                            </div>
                            <div className="center">
                              <span>
                                <i className="icon-timer iconfont" />
                                计划工期
                              </span>
                              <div className="taskNum">
                                <Input
                                  className="inputNumber"
                                  placeholder="请输入"
                                  value={item.workTime}
                                  onChange={e => {
                                    onlyNumber(e.target);
                                    this.editTaskInfo(e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"), "yjgq", item.id);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="tagSelect">
                            <div className="tit">
                              <i className="icon-biaoqian iconfont" />
                              任务标签
                            </div>
                            <div className="tagbox">
                              <TagComponent
                                tagSelecteds={item.labels}
                                canAdd={true}
                                canEdit={true}
                                tagChangeCallBack={val => { this.tagChange(val, item.id); }}
                                maxHeight="300px"
                                renderAddElement={() => { return (<span className="addNewTag"> 添加新标签</span>) }}
                              />
                            </div>
                          </div>
                          <div className="desSelect">
                            <i className="icon-note iconfont" />
                            <span>
                              描<i />述
                            </span>
                            <div className="textAreaBox">
                              <TextArea
                                placeholder="关于任务的简要描述"
                                autosize={{ minRows: 2, maxRows: 2 }}
                                onPaste={e => {
                                  // this.pasteingImg("描述附件", e);
                                }}
                                onChange={e => { this.editTaskInfo(e.target.value, "desc", item.id); }}
                                value={item.description && item.description}
                              />
                              {item.fileList.length !== 0 && (
                                <div className="clearfix">
                                  <Upload
                                    action={baseURI + "/files/upload"}
                                    listType="picture-card"
                                    // fileList={item.fileList}
                                    onPreview={this.handlePreview}
                                    multiple={true}
                                    onChange={val => { if (beforeUpload(val.file)) { this.uploadListOnChange_desc(val); } }}
                                  />
                                </div>
                              )}
                              <div
                                className="filesTit"
                                onClick={() => { this.updataFile(item.id) }}
                              >
                                <i className="icon-md-attach iconfont" />
                                添加附件...
                              </div>
                            </div>
                          </div>
                          <div className="fileBox">
                            <ul className="fileList">
                              {item.fileList && item.fileList.map((items, i) => {
                                if (items.fileId && items.type !== "DELL") {
                                  return (
                                    <li key={items.fileId} onClick={() => { dingJS.previewImage(items) }}>
                                      <div className="fileIcon">{createFileIcon(items.fileType)} </div>
                                      <span>{items.fileName}</span>
                                      <Popconfirm
                                        title={`是否要删除"${items.fileName}"`}
                                        onConfirm={e => { this.dellDescFileById(items.fileId, item.id) }}
                                        okText="删除"
                                        cancelText="取消"
                                      >
                                        <div className="delte" onClick={e => { e.stopPropagation() }}><i className="iconfont icon-icon_huabanfuben5" /></div>
                                      </Popconfirm>
                                    </li>
                                  );
                                }
                              })}
                            </ul>
                          </div>
                          <div className="followSelect">
                            <span>
                              <i className="icon-star2 iconfont" />
                              <i />关<i />注<i />人
                            </span>
                            <Popconfirm
                              title={`您刚刚选择了${resLength}个人，是否要全部添加为关注人？`}
                              visible={limitAttention}
                              onConfirm={() => { this.confirmPopconfirm(item.id) }}
                              onCancel={() => { this.setState({ limitAttention: false }) }}
                              okText={"添加"}
                              cancelText={"取消"}
                            >
                              <i
                                className="iconfont icon-add1 adddddd"
                                onClick={() => { this.selUser("关注人", item.id, item.collectList) }}
                              />
                            </Popconfirm>
                            <div className="followBox">
                              {item.collectList && item.collectList.length > 0
                                ? item.collectList.map(userlist => {
                                  return (
                                    <div className="userBox">
                                      <div className="userSel">
                                        <div className="userName">
                                          {userlist && userlist.photo && userlist.photo !== "" ? (
                                            <img src={userlist.photo} />
                                          ) : (
                                              <div className="nophoto">{userlist.name && userlist.name.substr(0, 1)}</div>
                                            )}
                                        </div>
                                        <div className="nickName">{userlist.name && userlist.name.slice(0, 3)}</div>
                                        {item.auth && (
                                          <div className="userCen" onClick={() => this.removeCollectUser(userlist, item.id)}>点击移除</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }) : ""}
                            </div>
                          </div>
                          <div className="saveNewTak">
                            <Button className="save" onClick={() => { this.saveTaskInfo(item.id) }}
                              disabled={taskModifyState || (item.taskname.length === 0 ? true : false)}
                              type={taskModifyState || (item.taskname.length === 0 ? true : false) ? "" : "primary"}
                            >
                              保存
                            </Button>
                            <Button className="cancel" onClick={() => { this.cancalRule(item.id) }} > 取消 </Button>
                          </div>
                        </div>
                      )}
                  </Panel>
                );
              })}
            </Collapse>
            {list && list.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />) : ("")}
          </div>
        </div>
      </div>
    );
  }
}
