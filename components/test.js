import React from "react";
import stylesheet from "styles/views/test.scss";
import _ from "lodash";

export default class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      measureKeys: ["daiqr", "jinxz", "daizp"], //堆叠类型
      originalData: [],
      colorSet: {
        //堆叠类型颜色
        daiqr: "#81d4fa55",
        jinxz: "#a5d6a755",
        daizp: "#ce93d855"
      },
      transposeCoord: true,
      chart: null,
      ischange: false,
      refnamer: "",
      tag: 0
    };
  }
  componentWillMount() {
    this.setState({
      originalData: this.props.originalData,
      transposeCoord: this.props.transposeCoord,
      refnamer: this.props.refnamer
    });
  }
  componentDidMount() {
    const { originalData } = this.state;
    this.chartDraw(originalData);
    this.changeMove();
  }

  componentWillReceiveProps(nextProps) {
    const _this = this;
    // console.log(33333, nextProps.originalData);
    // console.log(
    //   2222,
    //   _.isEqual(this.props.originalData, nextProps.originalData)
    // );
    if (!_.isEqual(this.props.originalData, nextProps.originalData)) {
      this.setState({ originalData: nextProps.originalData }, () => {
        // const ds = new DataSet({
        //   state: {
        //     ischange: false
        //   }
        // });
        // let dv = ds
        //   .createView()
        //   .source(nextProps.originalData)
        //   .transform({
        //     type: "fold",
        //     fields: _this.state.measureKeys,
        //     key: "key",
        //     value: "value"
        //   });
        this.dv = this.ds
          .createView()
          .source(nextProps.originalData)
          .transform({
            type: "fold",
            fields: _this.state.measureKeys,
            key: "key",
            value: "value"
          });
        this.chart.guide().clear();
        this.drawText();
        // this.ds.setState("ischange", new Date());
        this.chart.changeData(this.dv);

        //       this.chartDraw();
        // this.chart.changeData(nextProps.originalData);
        // this.chart.guide().clear();
        // this.drawText();
      });
    }
    //     originalData.push({
    //       total: 4752 + new Date(),
    //       id: "1cb758224ee84dc494906cd4b3b5794b" + 2 * originalData.length,
    //       daiqr: 1 + 2 * originalData.length,
    //       jinxz: 73 + 2 * originalData.length,
    //       proName: "导出测试" + 2 * originalData.length,
    //       daizp: 4679 + 2 * originalData.length,
    //       dzpyq: 2051 + 2 * originalData.length,
    //       dqryq: 0 + 2 * originalData.length,
    //       jxzyq: 23 + 2 * originalData.length
    //     });

    //     this.chart.clear();
    //     this.chart.source;
  }

  chartDraw() {
    const { ischange, refnamer, transposeCoord, originalData } = this.state;
    // console.log(originalData, "originalData");

    // 计算每个柱子的占比
    let _this = this;
    this.ds = new DataSet({
      state: {
        ischange: "aa"
      }
    });
    this.dv = _this.ds
      .createView()
      .source(originalData)
      .transform({
        type: "fold",
        fields: _this.state.measureKeys,
        key: "key",
        value: "value"
      });

    // 初始化图表实例
    _this.chart = new G2.Chart({
      container: refnamer,
      forceFit: true,
      padding: [0, 0, 0, 0],
      height: 200
      //       width: 390
      //       height: window.innerHeight
    });

    _this.chart.source(_this.dv, {
      percent: {
        min: 0,
        formatter: function formatter(val) {
          return (val * 100).toFixed(2) + "%";
        }
      }
    });

    // 是否水平翻转
    // 改这个参数看效果！

    if (transposeCoord) {
      _this.chart.coord().transpose();
    }
    //不显示坐标轴
    _this.chart.axis(false);
    //不现实标签分类
    _this.chart.legend(false);
    //绘制堆叠图
    _this.chart
      .intervalStack()
      .position(transposeCoord ? "id*value" : "user_id*value")
      .size(34)
      .color("key", function(value) {
        return _this.state.colorSet[value];
      });

    _this.chart.tooltip(true, {
      showTitle: false // 默认标题不显示
    });
    // _this.chart.tooltip("month*tem");
    //数据处理文字显示状态
    _this.drawText();
    //绘制图表
    _this.chart.render();
  }
  drawText() {
    const { transposeCoord, originalData } = this.state;
    let _this = this;
    originalData.map(function(obj) {
      if (transposeCoord) {
        _this.chart.guide().text({
          position: [obj.id, "min"],
          content: !transposeCoord
            ? obj.name.split("").join("\n")
            : obj.proName,
          style: {
            textAlign: !transposeCoord ? "start" : "middle",
            textBaseline: !transposeCoord ? "bottom" : "middle"
          },
          offsetY: !transposeCoord ? -8 : 0,
          offsetX: !transposeCoord ? -5 : 0
        });
      } else {
        _this.chart.guide().text({
          position: [obj.user_id, "min"],
          content: !transposeCoord
            ? obj.name.split("").join("\n")
            : obj.proName,
          style: {
            textAlign: !transposeCoord ? "start" : "middle",
            textBaseline: !transposeCoord ? "bottom" : "middle"
          },
          offsetY: !transposeCoord ? -8 : 0,
          offsetX: !transposeCoord ? -5 : 0
        });
      }
      // _this.chart.guide().text({
      //   position: [obj.user_id, "min"],
      //   content: !transposeCoord ? obj.name.split("").join("\n") : obj.proName,
      //   style: {
      //     textAlign: !transposeCoord ? "start" : "middle",
      //     textBaseline: !transposeCoord ? "bottom" : "middle"
      //   },
      //   offsetY: !transposeCoord ? -8 : 0,
      //   offsetX: !transposeCoord ? -5 : 0
      // });
    });
  }

  changeMove() {
    let _this = this;
    const titleSet = {
      jinxz: "进行中：",
      daiqr: "待确认：",
      yiwc: "待确认：",
      daizp: "待指派：",
      dzpyq: "逾期：",
      dqryq: "逾期：",
      jxzyq: "逾期："
    };
    _this.chart.on("tooltip:change", function(ev) {
      const items = ev.items; // tooltip显示的项
      const origin = items[0]; // 将一条数据改成多条数据
      //       console.log(origin, "origin");
      //       console.log(items, "items");
      const dzpyq = origin.point._origin.dzpyq;
      const jxzyq = origin.point._origin.jxzyq;
      const dqryq = origin.point._origin.dqryq;
      items.map((item, index) => {
        item.name = titleSet[item.name];
        return item;
      });
      items.splice(
        1,
        0,
        Object.assign({}, origin, {
          name: "逾期：",
          value: dzpyq,
          color: "#fff"
        })
      );
      items.splice(
        3,
        0,
        Object.assign({}, origin, {
          name: "逾期：",
          value: jxzyq,
          color: "#fff"
        })
      );
      items.splice(
        5,
        0,
        Object.assign({}, origin, {
          name: "逾期：",
          value: dqryq,
          color: "#fff"
        })
      );
    });
  }
  render() {
    const { refnamer } = this.state;
    return (
      <div
        className="chart-wrapper"
        id={refnamer}
        style={{ height: "206px", width: "100%" }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      </div>
    );
  }
}
