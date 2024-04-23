import * as echarts from 'echarts/core'
import { LineChart, GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  GaugeChart
])
export const chartOption = {
  grid: [{
    left: 0,
    right: 0,
    top: 27,
    bottom: 0,
    textStyle: {
      color: "#000",
    },
    containLabel: true,
  }],
  xAxis: [{
    type: "category",
    data: [],
    axisTick: {
      show: false,
    },
    axisLabel: {
      //   interval: 0,
      formatter: function (value) {
        var ret = ""; //拼接加\n返回的类目项
        var maxLength = 8; //每项显示文字个数
        var valLength = value.length; //X轴类目项的文字个数
        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
        if (rowN > 1) {
          //如果类目项的文字大于5,
          for (var i = 0; i < rowN; i++) {
            var temp = ""; //每次截取的字符串
            var start = i * maxLength; //开始截取的位置
            var end = start + maxLength; //结束截取的位置
            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            temp = value.substring(start, end) + "\n";
            ret += temp; //凭借最终的字符串
          }
          return ret;
        } else {
          return value;
        }
      },
      fontWeight: 400,
      color: '#999999',
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular, PingFang SC',
    },
    axisLine: {
      lineStyle: {
        color: '#F5F5F5',
        width: 1,
      },
    },
  }],
  yAxis: [{
    name: "Mpa",
    type: "value",
    nameTextStyle: {
      fontWeight: 400,
      color: '#999999',
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular, PingFang SC',
    },
    splitLine: {
      //网格线
      lineStyle: {
        color: '#F5F5F5',
        width: 1,
      },
      show: true, //隐藏或显示
    },
    axisLine: {
      lineStyle: {
        color: '#F5F5F5',
        width: 1,
      },
    },
    axisLabel: {
      //显示刻度文字
      fontWeight: 400,
      color: '#999999',
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular, PingFang SC',
    },
  }],
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      // console.log(params);
      let str =
        params[0].name.slice(0, 8) + "   " + params[0].name.slice(8) + "<br />";
      params.forEach((item) => {
        str +=
          '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:' +
          item.color +
          '"></span>' +
          item.seriesName +
          " : " +
          item.data +
          "<br />";
      });
      return str;
    },
  },
  series: [
    {
      name: "最高值",
      color: "#FF3C3C",
      data: [260, 260, 260, 260, 260, 260, 260],
      type: "line",
      smooth: 0.1,
      symbol: "none",
      lineStyle: {
        type: "dashed",
        color: "#FF3C3C",
        width: 1,
      },
    },
    {
      name: "压力值",
      color: "#1B67D8",
      data: [],
      type: "line",
      lineStyle: {
        width: 2,
      },
      showSymbol: false,
      areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
          offset: 0,
          color: 'rgba(51, 154, 255, 0.15)',
          },
          {
          offset: 1,
          color: 'rgba(186, 221, 255, 0.05)',
          },
      ]),
      },
    },
    {
      name: "最低值",
      color: "#FF3C3C",
      data: [150, 150, 150, 150, 150, 150, 150],
      type: "line",
      smooth: 0.1,
      symbol: "none",
      lineStyle: {
        type: "dashed",
        color: "#FF3C3C",
        width: 1,
      },
    },
  ],
};
