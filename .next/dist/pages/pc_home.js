"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _button = require("antd/lib/button");

var _button2 = _interopRequireDefault(_button);

var _icon = require("antd/lib/icon");

var _icon2 = _interopRequireDefault(_icon);

var _spin = require("antd/lib/spin");

var _spin2 = _interopRequireDefault(_spin);

var _checkbox = require("antd/lib/checkbox");

var _checkbox2 = _interopRequireDefault(_checkbox);

var _modal = require("antd/lib/modal");

var _modal2 = _interopRequireDefault(_modal);

var _getPrototypeOf = require("next\\node_modules\\babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("next\\node_modules\\babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("next\\node_modules\\babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("next\\node_modules\\babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("next\\node_modules\\babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _select = require("antd/lib/select");

var _select2 = _interopRequireDefault(_select);

var _radio = require("antd/lib/radio");

var _radio2 = _interopRequireDefault(_radio);

var _layout = require("antd/lib/layout");

var _layout2 = _interopRequireDefault(_layout);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _echarts = require("echarts/lib/echarts");

var _echarts2 = _interopRequireDefault(_echarts);

require("echarts/lib/chart/pie");

var _home = require("../styles/views/home.scss");

var _home2 = _interopRequireDefault(_home);

var _header = require("../components/header");

var _header2 = _interopRequireDefault(_header);

var _user = require("../core/service/user.service");

var _project = require("../core/service/project.service");

var _storage = require("../core/utils/storage");

var _storage2 = _interopRequireDefault(_storage);

var _util = require("../core/utils/util");

var _moneyEnd = require("../components/moneyEnd");

var _moneyEnd2 = _interopRequireDefault(_moneyEnd);

var _nullView = require("../components/nullView");

var _nullView2 = _interopRequireDefault(_nullView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = "D:\\work\\pc-new\\pages\\pc_home.js?entry";


var Content = _layout2.default.Content;

var RadioButton = _radio2.default.Button;
var RadioGroup = _radio2.default.Group;
var Option = _select2.default.Option;

var Home = function (_React$Component) {
  (0, _inherits3.default)(Home, _React$Component);

  function Home(props) {
    (0, _classCallCheck3.default)(this, Home);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).call(this, props));

    _this.state = {
      userBusData: {},
      user: {},
      userBusLoading: false,

      userTaskDataLoading: false,
      userTaskDataDate: "all",
      userTaskChartText: [],

      userMoneyDataLoading: false,
      userMoneyDataDate: "all",
      userMoneyText: [],

      userMessageLoading: false,
      userMessageMoreLoading: false,
      userMessageList: [],
      userMessageNowPage: 1,
      userMessageLastPage: 0,

      projectListLoading: false,
      projectListMoreLoading: false,
      projectList: [],
      projectListAllPage: 0,
      projectListNowPage: 0,
      projectSelecteds: [],

      moneyEndShow: false
    };
    return _this;
  }

  (0, _createClass3.default)(Home, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var endthreeDaysShow = _storage2.default.get("endthreeDaysShow");
      var teamState = (0, _util.getTeamInfoWithMoney)();
      if (teamState === "已过期") {
        this.setState({ moneyEndShow: true });
      } else if (teamState !== "正常" && endthreeDaysShow !== "不提醒") {
        this.useStop(teamState);
      }

      var user = _storage2.default.get("user");
      if (user) {
        this.setState({ user: user });
        this.getUserBusData();
        this.userTaskChart("all");
        this.userMoneyData([], "all");
        this.userMessage(1);
        this.getProjectList();

        window.addEventListener("resize", this.resize.bind(this));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.resize);
      //重写组件的setState方法，直接返回空
      this.setState = function (state, callback) {
        return;
      };
    }
  }, {
    key: "resize",
    value: function resize() {
      this.userTaskChart("", "重绘");
      this.userMoneyData("", "", "重绘");
    }
  }, {
    key: "useStop",
    value: function useStop(msg) {
      _modal2.default.info({
        title: msg,
        okText: "知道了",
        content: _react2.default.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 107
          }
        }, _react2.default.createElement("p", { style: { margin: "0" }, __source: {
            fileName: _jsxFileName,
            lineNumber: 108
          }
        }, "\u8BF7\u63D0\u524D\u7EED\u8D39\uFF0C\u4EE5\u514D\u5F71\u54CD\u6B63\u5E38\u4F7F\u7528"), _react2.default.createElement("p", { style: { margin: "5px 0 0 0" }, __source: {
            fileName: _jsxFileName,
            lineNumber: 109
          }
        }, _react2.default.createElement(_checkbox2.default, {
          onChange: function onChange(e) {
            _storage2.default.set("endthreeDaysShow", e.target.checked ? "不提醒" : "提醒");
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 110
          }
        }, "\u4E0D\u518D\u63D0\u9192")))
      });
    }
  }, {
    key: "getProjectList",
    value: function getProjectList(pageNo) {
      var _this2 = this;

      if (!pageNo) {
        pageNo = 1;
      }
      if (pageNo === 1) {
        this.setState({ projectListLoading: true });
      } else {
        this.setState({ projectListMoreLoading: true });
      }
      (0, _project.getProListByType)("1", pageNo, function (data) {
        if (data.err) {
          return false;
        }
        if (data.pageNo === 1) {
          _this2.setState({ projectList: data.projects });
        } else {
          var projectList = _this2.state.projectList;
          data.projects.map(function (item) {
            if (projectList.filter(function (val) {
              return val.id === item.id;
            }).length === 0) {
              projectList.push(item);
            }
          });
          _this2.setState({ projectList: projectList });
        }
        _this2.setState({
          projectListAllPage: data.last,
          projectListNowPage: data.pageNo
        });
        _this2.setState({
          projectListLoading: false,
          projectListMoreLoading: false
        });
      });
    }
  }, {
    key: "getUserBusData",
    value: function getUserBusData() {
      var _this3 = this;

      this.setState({ userBusLoading: true });
      (0, _user.getUserBusinessStatistics)(function (res) {
        if (res.err) {
          return false;
        }
        _this3.setState({ userBusData: res, userBusLoading: false });
      });
    }
  }, {
    key: "userTaskChart",
    value: function userTaskChart(date, isDraw) {
      var _this4 = this;

      var userTaskChart = _echarts2.default.init(document.getElementById("userTaskChartBox"));
      if (isDraw === "重绘") {
        userTaskChart.resize();
        return false;
      }

      if (!date) {
        date = this.state.userTaskDataDate;
      } else if (date === "all") {
        date = "";
        this.setState({ userTaskDataDate: "all" });
      } else {
        this.setState({ userTaskDataDate: date });
      }
      this.setState({ userTaskDataLoading: true });
      (0, _user.getUserTaskChart)(date, function (res) {
        if (res.err) {
          return false;
        }
        var taskDatas = [];
        var userTaskChartText = [];
        res.map(function (item) {
          var color = "";
          var type = "";
          switch (item.type) {
            case "0":
              //我创建
              color = "#3ba0ff";
              type = "我创建";
              break;
            case "1":
              //我负责
              color = "#36cbcb";
              type = "我负责";
              break;
            case "2":
              //我确认
              color = "#975fe4";
              type = "我确认";
              break;
            case "3":
              //我指派
              color = "#f2637b";
              type = "我指派";
              break;
            case "4":
              //我关注
              color = "#fad337";
              type = "我关注";
              break;
          }
          taskDatas.push({
            value: item.allCount,
            name: type,
            itemStyle: {
              color: color
            }
          });
          userTaskChartText.push({
            all: item.allCount,
            bfb: item.percent,
            type: type,
            ywc: item.wcCount,
            color: color
          });
        });
        _this4.setState({ userTaskChartText: userTaskChartText });

        var userTaskChartOpt = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          // legend: {
          //     orient: 'vertical',
          //     x: 'left',
          //     data: ['我创建', '我负责', '我确认', '我指派', '我关注']
          // },
          series: [{
            name: "我的任务",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: taskDatas
          }]
        };
        userTaskChart.setOption(userTaskChartOpt);
        _this4.setState({ userTaskDataLoading: false });
      });
    }
  }, {
    key: "userMoneyData",
    value: function userMoneyData(projectIds, date, isDraw) {
      var _this5 = this;

      var userTaskChart = _echarts2.default.init(document.getElementById("userMoneyChartBox"));
      if (isDraw === "重绘") {
        userTaskChart.resize();
        return false;
      }

      this.setState({ userMoneyDataLoading: true });
      if (!projectIds) {
        projectIds = this.state.projectSelecteds;
      }
      if (!date) {
        date = this.state.userMoneyDataDate;
      }
      if (date === "all") {
        date = "";
        this.setState({ userMoneyDataDate: "all" });
      } else {
        this.setState({ userMoneyDataDate: date });
      }
      (0, _user.getUserMoneyChart)(projectIds, date, function (res) {
        if (res.err) {
          return false;
        }
        var taskDatas = [{
          value: res.createTsak.performance,
          name: "创建任务",
          itemStyle: {
            color: "#3ba0ff"
          },
          bfb: res.createTsak.percentage
        }, {
          value: res.assignTask.performance,
          name: "指派任务",
          itemStyle: {
            color: "#f2637b"
          },
          bfb: res.assignTask.percentage
        }, {
          value: res.confirmTask.performance,
          name: "确认任务",
          itemStyle: {
            color: "#975fe4"
          },
          bfb: res.confirmTask.percentage
        }, {
          value: res.normalTask.performance,
          name: "正常完成",
          itemStyle: {
            color: "#4dcb73"
          },
          bfb: res.normalTask.percentage
        }, {
          value: res.advanceTask.performance,
          name: "逾期完成",
          itemStyle: {
            color: "#fad337"
          },
          bfb: res.advanceTask.percentage
        }, {
          value: res.overdueTask.performance,
          name: "提前完成",
          itemStyle: {
            color: "#36cbcb"
          },
          bfb: res.overdueTask.percentage
        }];

        _this5.setState({ userMoneyText: taskDatas });

        var userTaskChartOpt = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          // legend: {
          //     orient: 'vertical',
          //     x: 'left',
          //     data: ['创建任务', '指派任务', '确认任务', '正常完成', '逾期完成', '提前完成']
          // },
          series: [{
            name: "我的绩效",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: taskDatas
          }]
        };
        userTaskChart.setOption(userTaskChartOpt);
        _this5.setState({ userMoneyDataLoading: false });
      });
    }
  }, {
    key: "userMessage",
    value: function userMessage(pageNo) {
      var _this6 = this;

      if (pageNo === 1) {
        this.setState({ userMessageLoading: true });
      } else {
        this.setState({ userMessageMoreLoading: true });
      }
      (0, _user.getMessageByUser)(pageNo, function (res) {
        if (res.err) {
          return false;
        }
        if (res.page === 1) {
          _this6.setState({ userMessageList: res.list });
        } else {
          var userMessageList = _this6.state.userMessageList;

          res.list.map(function (item) {
            if (userMessageList.filter(function (val) {
              return val.id === item.id;
            }).length === 0) {
              userMessageList.push(item);
            }
          });
          _this6.setState({ userMessageList: userMessageList });
        }
        _this6.setState({
          userMessageNowPage: res.page,
          userMessageLastPage: res.last
        });
        _this6.setState({
          userMessageLoading: false,
          userMessageMoreLoading: false
        });
      });
    }
  }, {
    key: "messageScroll",
    value: function messageScroll(e) {
      var _state = this.state,
          userMessageLastPage = _state.userMessageLastPage,
          userMessageNowPage = _state.userMessageNowPage;

      var isOnbottom = (0, _util.listScroll)(e);
      if (isOnbottom && userMessageNowPage < userMessageLastPage) {
        this.userMessage(userMessageNowPage + 1);
      }
    }
  }, {
    key: "scrollOnBottom",
    value: function scrollOnBottom(e) {
      var isOnButtom = (0, _util.listScroll)(e);
      var _state2 = this.state,
          projectListAllPage = _state2.projectListAllPage,
          projectListNowPage = _state2.projectListNowPage;

      if (isOnButtom && projectListNowPage < projectListAllPage) {
        this.getProjectList(projectListNowPage + 1);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _state3 = this.state,
          userBusData = _state3.userBusData,
          user = _state3.user,
          moneyEndShow = _state3.moneyEndShow,
          userTaskChartText = _state3.userTaskChartText,
          userMoneyText = _state3.userMoneyText,
          userMessageMoreLoading = _state3.userMessageMoreLoading,
          projectListMoreLoading = _state3.projectListMoreLoading,
          projectSelecteds = _state3.projectSelecteds,
          projectListLoading = _state3.projectListLoading,
          userBusLoading = _state3.userBusLoading,
          projectListNowPage = _state3.projectListNowPage,
          projectListAllPage = _state3.projectListAllPage,
          userMessageLastPage = _state3.userMessageLastPage,
          projectList = _state3.projectList,
          userMoneyDataDate = _state3.userMoneyDataDate,
          userTaskDataDate = _state3.userTaskDataDate,
          userMessageNowPage = _state3.userMessageNowPage,
          userTaskDataLoading = _state3.userTaskDataLoading,
          userMoneyDataLoading = _state3.userMoneyDataLoading,
          userMessageLoading = _state3.userMessageLoading,
          userMessageList = _state3.userMessageList;

      var data = { alertTxtIcon: "frown-o" };
      var select_pro_data = [];
      projectList.map(function (item, i) {
        select_pro_data.push(_react2.default.createElement(Option, { key: item.id, __source: {
            fileName: _jsxFileName,
            lineNumber: 477
          }
        }, item.proname));
      });
      return _react2.default.createElement(_layout2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 480
        }
      }, _react2.default.createElement("style", { dangerouslySetInnerHTML: { __html: _home2.default }, __source: {
          fileName: _jsxFileName,
          lineNumber: 481
        }
      }), moneyEndShow && _react2.default.createElement(_moneyEnd2.default, { canClosed: false, __source: {
          fileName: _jsxFileName,
          lineNumber: 482
        }
      }), _react2.default.createElement(_header2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 483
        }
      }), _react2.default.createElement(Content, { className: "homePage", __source: {
          fileName: _jsxFileName,
          lineNumber: 484
        }
      }, _react2.default.createElement("div", { className: "homePage_top", __source: {
          fileName: _jsxFileName,
          lineNumber: 485
        }
      }, _react2.default.createElement(_spin2.default, { spinning: userBusLoading, __source: {
          fileName: _jsxFileName,
          lineNumber: 486
        }
      }), user.photo ? _react2.default.createElement("img", { className: "img", src: user.photo, __source: {
          fileName: _jsxFileName,
          lineNumber: 488
        }
      }) : _react2.default.createElement("div", { className: "user", __source: {
          fileName: _jsxFileName,
          lineNumber: 490
        }
      }, user.nickname ? user.nickname : ""), _react2.default.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 492
        }
      }, "\u4F60\u597D\uFF0C", user.name ? user.name : "", "\uFF01\u795D\u4F60\u5F00\u5FC3\u5FEB\u4E50\u6BCF\u4E00\u5929\uFF01"), _react2.default.createElement("div", { className: "titBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 493
        }
      }, _react2.default.createElement("div", { className: "min", __source: {
          fileName: _jsxFileName,
          lineNumber: 494
        }
      }, "\u53C2\u4E0E\u9879\u76EE"), _react2.default.createElement("div", { className: "max", __source: {
          fileName: _jsxFileName,
          lineNumber: 495
        }
      }, userBusData.projectCount ? userBusData.projectCount : 0)), _react2.default.createElement("div", { className: "line", __source: {
          fileName: _jsxFileName,
          lineNumber: 499
        }
      }), _react2.default.createElement("div", { className: "titBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 500
        }
      }, _react2.default.createElement("div", { className: "min", __source: {
          fileName: _jsxFileName,
          lineNumber: 501
        }
      }, "\u4EFB\u52A1\u6570"), _react2.default.createElement("div", { className: "max", __source: {
          fileName: _jsxFileName,
          lineNumber: 502
        }
      }, userBusData.unTask ? userBusData.unTask : 0, "/", userBusData.totalTask ? userBusData.totalTask : 0)), _react2.default.createElement("div", { className: "line", __source: {
          fileName: _jsxFileName,
          lineNumber: 507
        }
      }), _react2.default.createElement("div", { className: "titBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 508
        }
      }, _react2.default.createElement("div", { className: "min", __source: {
          fileName: _jsxFileName,
          lineNumber: 509
        }
      }, "\u7EE9\u6548\u7EDF\u8BA1"), _react2.default.createElement("div", { className: "max", __source: {
          fileName: _jsxFileName,
          lineNumber: 510
        }
      }, userBusData.allConten ? userBusData.allConten : 0))), _react2.default.createElement("div", { className: "homePage_bottom", __source: {
          fileName: _jsxFileName,
          lineNumber: 515
        }
      }, _react2.default.createElement("div", { className: "homePage_bottom_left", __source: {
          fileName: _jsxFileName,
          lineNumber: 516
        }
      }, _react2.default.createElement("div", { className: "tit_row", style: { flex: "0 0 auto" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 517
        }
      }, _react2.default.createElement("div", { className: "label", __source: {
          fileName: _jsxFileName,
          lineNumber: 518
        }
      }, "\u901A\u77E5"), _react2.default.createElement(_icon2.default, {
        type: "sync",
        onClick: function onClick() {
          _this7.userMessage(1);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 519
        }
      })), _react2.default.createElement("div", {
        className: "dy_row_box",
        onScroll: function onScroll(e) {
          _this7.messageScroll(e);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 527
        }
      }, _react2.default.createElement(_spin2.default, { spinning: userMessageLoading, __source: {
          fileName: _jsxFileName,
          lineNumber: 533
        }
      }), userMessageList && userMessageList.length > 0 ? userMessageList.map(function (item) {
        var content = {};
        try {
          content = JSON.parse(item.description);
        } catch (error) {
          content = { 描述: item.description };
        }
        var arr = [];
        for (var o in content) {
          arr.push(_react2.default.createElement("span", { style: { display: "inline-block" }, key: o, __source: {
              fileName: _jsxFileName,
              lineNumber: 545
            }
          }, o == "讨论内容" ? _react2.default.createElement("div", {
            dangerouslySetInnerHTML: { __html: content[o] },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 547
            }
          }) : _react2.default.createElement("div", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 551
            }
          }, content[o])));
        }
        return _react2.default.createElement("div", { className: "dy_row", key: item.id, __source: {
            fileName: _jsxFileName,
            lineNumber: 557
          }
        }, _react2.default.createElement("div", { className: "user", __source: {
            fileName: _jsxFileName,
            lineNumber: 558
          }
        }, item.createBy.name), _react2.default.createElement("div", { className: "cont", __source: {
            fileName: _jsxFileName,
            lineNumber: 559
          }
        }, _react2.default.createElement("div", { className: "dyText", __source: {
            fileName: _jsxFileName,
            lineNumber: 560
          }
        }, item.subject, " ", _react2.default.createElement("span", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 561
          }
        }, arr[0])), _react2.default.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 563
          }
        }, item.createDate)));
      }) : _react2.default.createElement(_nullView2.default, { data: data, __source: {
          fileName: _jsxFileName,
          lineNumber: 569
        }
      }), !userMessageMoreLoading && userMessageNowPage < userMessageLastPage ? _react2.default.createElement("div", { className: "moreLoadingRow", __source: {
          fileName: _jsxFileName,
          lineNumber: 573
        }
      }, "\u4E0B\u62C9\u52A0\u8F7D\u66F4\u591A") : "", userMessageMoreLoading ? _react2.default.createElement("div", { className: "moreLoadingRow", __source: {
          fileName: _jsxFileName,
          lineNumber: 578
        }
      }, _react2.default.createElement(_icon2.default, { type: "loading", className: "loadingIcon", __source: {
          fileName: _jsxFileName,
          lineNumber: 579
        }
      }), "\u6B63\u5728\u52A0\u8F7D\u4E2D") : "", !userMessageMoreLoading && userMessageNowPage === userMessageLastPage ? _react2.default.createElement("div", { className: "moreLoadingRow", __source: {
          fileName: _jsxFileName,
          lineNumber: 587
        }
      }, userMessageList && userMessageList.length > 0 ? "已经到底喽" : "") : "")), _react2.default.createElement("div", { className: "homePage_bottom_right", __source: {
          fileName: _jsxFileName,
          lineNumber: 597
        }
      }, _react2.default.createElement("div", { className: "topBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 598
        }
      }, _react2.default.createElement("div", { className: "box", __source: {
          fileName: _jsxFileName,
          lineNumber: 599
        }
      }, _react2.default.createElement("div", { className: "tit_row", __source: {
          fileName: _jsxFileName,
          lineNumber: 600
        }
      }, _react2.default.createElement("div", { className: "label", __source: {
          fileName: _jsxFileName,
          lineNumber: 601
        }
      }, "\u6211\u7684\u4EFB\u52A1"), _react2.default.createElement(RadioGroup, {
        value: userTaskDataDate,
        size: "small",
        onChange: function onChange(e) {
          _this7.userTaskChart(e.target.value);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 602
        }
      }, _react2.default.createElement(RadioButton, { value: "all", __source: {
          fileName: _jsxFileName,
          lineNumber: 609
        }
      }, "\u5168\u90E8"), _react2.default.createElement(RadioButton, { value: "month", __source: {
          fileName: _jsxFileName,
          lineNumber: 610
        }
      }, "\u672C\u6708"), _react2.default.createElement(RadioButton, { value: "week", __source: {
          fileName: _jsxFileName,
          lineNumber: 611
        }
      }, "\u672C\u5468"))), _react2.default.createElement("div", { className: "cont_box", __source: {
          fileName: _jsxFileName,
          lineNumber: 614
        }
      }, _react2.default.createElement(_spin2.default, { spinning: userTaskDataLoading, __source: {
          fileName: _jsxFileName,
          lineNumber: 615
        }
      }), _react2.default.createElement("div", { className: "div", id: "userTaskChartBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 616
        }
      }), _react2.default.createElement("div", {
        className: "div",
        style: {
          display: "flex",
          justifyContent: "center",
          flexDirection: "column"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 617
        }
      }, userTaskChartText.map(function (item, i) {
        return _react2.default.createElement("div", { className: "li", key: i + "userTaskChartText", __source: {
            fileName: _jsxFileName,
            lineNumber: 627
          }
        }, _react2.default.createElement("div", {
          className: "dian",
          style: { background: item.color },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 628
          }
        }), _react2.default.createElement("div", { className: "charType", __source: {
            fileName: _jsxFileName,
            lineNumber: 632
          }
        }, item.type), _react2.default.createElement("div", { className: "baifenbi", __source: {
            fileName: _jsxFileName,
            lineNumber: 633
          }
        }, item.bfb), _react2.default.createElement("div", { className: "dataVal", __source: {
            fileName: _jsxFileName,
            lineNumber: 634
          }
        }, _react2.default.createElement("b", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 635
          }
        }, item.ywc), "/", item.all));
      }))))), _react2.default.createElement("div", { className: "bottomBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 644
        }
      }, _react2.default.createElement("div", { className: "box", __source: {
          fileName: _jsxFileName,
          lineNumber: 645
        }
      }, _react2.default.createElement("div", { className: "tit_row", __source: {
          fileName: _jsxFileName,
          lineNumber: 646
        }
      }, _react2.default.createElement("div", { className: "label", __source: {
          fileName: _jsxFileName,
          lineNumber: 647
        }
      }, "\u6211\u7684\u7EE9\u6548"), _react2.default.createElement(RadioGroup, {
        value: userMoneyDataDate,
        size: "small",
        onChange: function onChange(e) {
          _this7.userMoneyData("", e.target.value);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 648
        }
      }, _react2.default.createElement(RadioButton, { value: "all", __source: {
          fileName: _jsxFileName,
          lineNumber: 655
        }
      }, "\u5168\u90E8"), _react2.default.createElement(RadioButton, { value: "month", __source: {
          fileName: _jsxFileName,
          lineNumber: 656
        }
      }, "\u672C\u6708"), _react2.default.createElement(RadioButton, { value: "week", __source: {
          fileName: _jsxFileName,
          lineNumber: 657
        }
      }, "\u672C\u5468"))), _react2.default.createElement("div", {
        style: {
          flex: "0 0 auto",
          textAlign: "right",
          padding: "15px",
          display: "flex"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 660
        }
      }, projectListLoading ? _react2.default.createElement("span", {
        style: {
          margin: "5px 0 0 0",
          flex: "1",
          display: "block",
          textAlign: "left"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 669
        }
      }, _react2.default.createElement(_icon2.default, { type: "loading", __source: {
          fileName: _jsxFileName,
          lineNumber: 677
        }
      }), _react2.default.createElement("span", {
        style: { margin: "0 0 0 10px", fontSize: "12px" },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 678
        }
      }, "\u9879\u76EE\u52A0\u8F7D\u4E2D")) : _react2.default.createElement("div", { style: { flex: "1" }, __source: {
          fileName: _jsxFileName,
          lineNumber: 685
        }
      }, _react2.default.createElement(_select2.default, {
        mode: "multiple",
        style: { width: "100%", maxWidth: "450px" },
        placeholder: "\u8BF7\u9009\u62E9\u9879\u76EE",
        value: projectSelecteds,
        onChange: function onChange(val) {
          _this7.setState({ projectSelecteds: val });
        },
        onPopupScroll: function onPopupScroll(e) {
          _this7.scrollOnBottom(e);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 686
        }
      }, select_pro_data, !projectListMoreLoading && projectListNowPage === projectListAllPage ? _react2.default.createElement(Option, { value: "disabled", disabled: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 701
        }
      }, "\u5DF2\u7ECF\u5230\u5E95\u55BD") : "", !projectListMoreLoading && projectListNowPage < projectListAllPage ? _react2.default.createElement(Option, { value: "disabled", disabled: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 709
        }
      }, "\u4E0B\u62C9\u52A0\u8F7D\u66F4\u591A") : "")), _react2.default.createElement(_button2.default, {
        style: { flex: "0 0 auto", margin: "0 0 0 7px" },
        onClick: function onClick() {
          _this7.userMoneyData();
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 718
        }
      }, "\u786E\u5B9A"), _react2.default.createElement(_button2.default, {
        style: { flex: "0 0 auto", margin: "0 0 0 7px" },
        type: "dashed",
        onClick: function onClick() {
          _this7.setState({ projectSelecteds: [] });
          _this7.userMoneyData([]);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 726
        }
      }, "\u5168\u90E8\u9879\u76EE")), _react2.default.createElement("div", { className: "cont_box", __source: {
          fileName: _jsxFileName,
          lineNumber: 737
        }
      }, _react2.default.createElement(_spin2.default, { spinning: userMoneyDataLoading, __source: {
          fileName: _jsxFileName,
          lineNumber: 738
        }
      }), _react2.default.createElement("div", { className: "div", id: "userMoneyChartBox", __source: {
          fileName: _jsxFileName,
          lineNumber: 739
        }
      }), _react2.default.createElement("div", {
        className: "div",
        style: {
          display: "flex",
          justifyContent: "center",
          flexDirection: "column"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 740
        }
      }, userMoneyText.map(function (item, i) {
        return _react2.default.createElement("div", { className: "li", key: i + "userMoneyText", __source: {
            fileName: _jsxFileName,
            lineNumber: 750
          }
        }, _react2.default.createElement("div", {
          className: "dian",
          style: { background: item.itemStyle.color },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 751
          }
        }), _react2.default.createElement("div", { className: "charType", __source: {
            fileName: _jsxFileName,
            lineNumber: 755
          }
        }, item.name), _react2.default.createElement("div", { className: "baifenbi", __source: {
            fileName: _jsxFileName,
            lineNumber: 756
          }
        }, item.bfb), _react2.default.createElement("div", { className: "dataVal", __source: {
            fileName: _jsxFileName,
            lineNumber: 757
          }
        }, Math.round(item.value * 100) / 100));
      })))))))));
    }
  }]);

  return Home;
}(_react2.default.Component);

exports.default = Home;