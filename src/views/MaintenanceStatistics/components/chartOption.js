export const chartOption = {
  grid: {
    top: '20%',
    bottom: '13%',
    left: '10%',
    right: '13%',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: {
        show: true,
      },
    },
  },
  legend: {
    data: ['', ''],
    top: '5%',
    textStyle: {
      color: '#000',
    },
  },
  xAxis: {
    data: [],
    axisLine: {
      show: false,
      lineStyle: {
        color: '#000',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#999',
      },
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '',
      nameTextStyle: {
        color: '#999',
      },
      splitLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#000',
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#999',
        },
      },
    },
    {
      type: 'value',
      name: '',
      nameTextStyle: {
        color: '#999',
      },
      position: 'right',
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        formatter: '{value} %',
        textStyle: {
          color: '#999',
        },
      },
    },
  ],
  series: [
    {
      name: '',
      data: [],
      type: 'bar',
      yAxisIndex: 0,
      barWidth: 15,
      itemStyle: {
        color: '#2479F1',
        // normal: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: '#00FFE3'
        //     },
        //     {
        //       offset: 1,
        //       color: '#4693EC'
        //     }
        //   ])
        // }
      },
    },
    {
      name: '',
      data: [],
      type: 'line',
      yAxisIndex: 1,
      smooth: false, // 平滑曲线显示
      showAllSymbol: true, // 显示所有图形
      // symbol: 'circle', // 标记的图形为实心圆
      symbolSize: 5, // 标记的大小
      itemStyle: {
        color: '#86DB94', // 折线拐点标志的样式
      },
      lineStyle: {
        color: '#86DB94',
      },
      // areaStyle: {
      //   color: 'rgba(5,140,255, 0.2)'
      // },
    },
  ],
}
