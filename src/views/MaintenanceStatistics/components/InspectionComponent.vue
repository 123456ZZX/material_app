<template>
  <div class="commonComponents">
    <ChangeBizDate :dateType="dateType" @dateChange="dateChange" />
    <div class="topCard">
      <div v-for="card in cardDataConfig" :key="card.text" class="cardItemContainer">
        <div class="cardItemTop">
          <span class="cardItemContentNum">{{ card.contentNum }}</span>
          <span class="cardItemContentUnit">{{ card.unit }}</span>
        </div>
        <span class="cardItemText">{{ card.text }}</span>
      </div>
    </div>
    <div class="centerAndBottomCard">
      <div class="topTitle">
        <div class="leftTitle">
          <img src="../imgs/carImg.png" alt="" />
          <span>车巡统计</span>
        </div>
        <div></div>
      </div>
      <div id="inspection_chartId_1" class="chartStyle"></div>
    </div>
    <div class="centerAndBottomCard">
      <div class="topTitle">
        <div class="leftTitle">
          <img src="../imgs/mapImg.png" alt="" />
          <span>关键点巡检</span>
        </div>
        <SelectComponent
          :selectData="inspTypeList"
          :selValue="selValue"
          color="white"
          @getValue="getValue"
        >
        </SelectComponent>
      </div>
      <div id="inspection_chartId_2" class="chartStyle"></div>
    </div>
  </div>
</template>

<script>
import * as Api from '../api.js'
import ChangeBizDate from './ChangeBizDate.vue' // 日期选择组件
import SelectComponent from './SelectComponent.vue' // 下拉选择框
// 图表
import * as echarts from 'echarts'
import _cloneDeep from 'lodash/cloneDeep'
import { chartOption } from './chartOption.js'
export default {
  name: 'InspectionComponent',
  components: {
    ChangeBizDate,
    SelectComponent,
  },
  data() {
    return {
      dateType: '日',
      netWorkDate: '',
      inspData: [], // 巡检统计数据
      cardDataConfig: [
        {
          text: '在线人数',
          contentNum: '',
          unit: '人',
          field: 'AAAAAAAAAA',
        },
        {
          text: '车巡里程',
          contentNum: '',
          unit: 'km',
          field: 'BBBBBBBBBB',
        },
        {
          text: '车巡覆盖率',
          contentNum: '',
          unit: '%',
          field: 'CCCCCCCCCC',
        },
        {
          text: '供水阀门',
          contentNum: '',
          unit: '个',
          field: 'DDDDDDDDDD',
        },
        {
          text: '雨水排放口',
          contentNum: '',
          unit: '个',
          field: 'EEEEEEEEEE',
        },
        {
          text: '污水接驳井',
          contentNum: '',
          unit: '个',
          field: 'FFFFFFFFF',
        },
        {
          text: '再生水排放口',
          contentNum: '',
          unit: '个',
          field: 'GGGGGGGGGG',
        },
      ],
      selValue: '供水阀门',
      inspTypeList: [
        { type: 1, name: '供水阀门', value: '供水阀门' },
        { type: 1, name: '雨水排放口', value: '雨水排放口' },
        { type: 1, name: '污水接驳井', value: '污水接驳井' },
        { type: 1, name: '再生水排放口', value: '再生水排放口' },
      ],
      inspTypeData: {}, // 关键点巡检数据
      myChart_1: null,
      myChart_2: null,
    }
  },
  mounted() {
    this.netWorkDate = this.$dayjs().format('YYYY-MM-DD')
    this.allDataRequest() // 请求所有数据
  },
  methods: {
    // 时间组件日期切换事件，用于控制本组件网络请求日期 netWorkDate 字段
    dateChange(changeType) {
      // console.log(changeType) // subtract or addition
      if (changeType === 'subtract') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).subtract(1, 'day').format('YYYY-MM-DD')
      } else if (changeType === 'addition') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).add(1, 'day').format('YYYY-MM-DD')
      }
      console.log('网络请求用的日期', this.netWorkDate)
      this.allDataRequest() // 请求所有数据
    },
    // 请求所有数据
    allDataRequest() {
      let params = {
        startTime: this.netWorkDate + ' 00:00:00',
        endTime: this.netWorkDate + ' 23:59:59',
      }
      // 在线人数
      Api.onlineNum(params).then((res) => {
        if (res.status) {
          console.log('在线人数', res)
          this.cardDataConfig[0].contentNum =
            (res?.data?.online || 0) + '/' + (res?.data?.total || 0)
        }
      })
      // 巡检统计
      Api.getInspDis(params).then((res) => {
        if (res.status && res.data) {
          console.log('巡检统计', res)
          this.cardDataConfig[1].contentNum = res.data['车巡'].toFixed(2)
          this.cardDataConfig[2].contentNum = res.data['车巡覆盖率'].toFixed(2)
        }
      })
      // 组团巡检统计
      Api.getTableData(params).then((res) => {
        if (res.data.length > 0) {
          console.log('组团巡检统计', res)
          this.inspData = res.data
          // 1.统计供水阀门、雨水排放口、污水接驳井、再生水排放口数量
          // 统计各类设施数量
          const facilityTypes = ['supplyNum', 'rainNum', 'pollutedNum', 'recycleNum']
          const facilityCounts = facilityTypes.map((type) =>
            this.inspData.reduce((acc, item) => acc + (item[type] || 0), 0)
          )
          // 更新卡片数据
          for (let i = 0; i < facilityTypes.length; i++) {
            this.cardDataConfig[i + 3].contentNum = facilityCounts[i]
          }

          // 2.1 车巡统计（里程（km）、覆盖率（%））
          let cloneOption_1 = _cloneDeep(chartOption)
          cloneOption_1.legend.data = ['里程', '覆盖率']
          cloneOption_1.xAxis.data = this.inspData.map((item) => item.gridName)
          cloneOption_1.yAxis[0].name = '里程(km)'
          cloneOption_1.yAxis[1].name = '覆盖率(%)'
          cloneOption_1.series[0].name = cloneOption_1.legend.data[0]
          cloneOption_1.series[1].name = cloneOption_1.legend.data[1]
          // series赋值
          cloneOption_1.series[0].data = this.inspData.map((item) => {
            let carInsp = []
            carInsp = item.inspDistances.filter((item) => item.taskType === '车巡')
            if (carInsp.length > 0) {
              return carInsp[0].distance
            } else {
              return 0
            }
          })
          cloneOption_1.series[1].data = this.inspData.map((item) => item.coverage)
          this.initChartData(this.myChart_1, cloneOption_1, 'inspection_chartId_1')

          // 2.2 关键点巡检（供水阀门、雨水排放口、污水接驳井、再生水排放口数量）
          this.inspTypeList.forEach((item) => {
            this.inspTypeData[item.value] = {
              data: [],
            }
          })
          this.inspTypeData['供水阀门'].data = this.inspData.map((item) => item.supplyNum || 0)
          this.inspTypeData['雨水排放口'].data = this.inspData.map((item) => item.rainNum || 0)
          this.inspTypeData['污水接驳井'].data = this.inspData.map((item) => item.pollutedNum || 0)
          this.inspTypeData['再生水排放口'].data = this.inspData.map((item) => item.recycleNum || 0)
          console.log('关键点巡检统计', _cloneDeep(this.inspTypeData))
          this.renderChart() // 渲染关键点巡检图表
        }
      })
    },
    getValue(type, name, value) {
      console.log(type, name, value)
      this.selValue = value
      this.renderChart() // 渲染关键点巡检图表
    },
    // 渲染关键点巡检图表
    renderChart() {
      let cloneOption_2 = _cloneDeep(chartOption)
      cloneOption_2.legend.data = []
      cloneOption_2.xAxis.data = this.inspData.map((item) => item.gridName)
      cloneOption_2.yAxis[0].name = '数量(个)'
      delete cloneOption_2.yAxis[1] // 删除第二个y轴
      cloneOption_2.series[0].name = ''
      delete cloneOption_2.series[1] // 删除第二个series
      // series赋值
      cloneOption_2.series[0].data = this.inspTypeData[this.selValue].data
      console.log(this.inspTypeData[this.selValue].data)
      this.initChartData(this.myChart_2, cloneOption_2, 'inspection_chartId_2')
    },
    // 初始化图表
    initChartData(myChart, chartOption, ChartId) {
      if (myChart) myChart.dispose()
      let chartDom = document.getElementById(ChartId)
      myChart = echarts.init(chartDom)
      let option = _cloneDeep(chartOption)
      option && myChart.setOption(option, true)
    },
  },
}
</script>

<style lang="scss" scoped>
.commonComponents {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px 30px 100px;
  overflow-y: scroll;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f4f6f8;
  transition: all 0.5s;

  .topCard {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 24px;
    width: 100%;
    height: 300px;
    overflow: scroll;
    padding: 10px;
    border-radius: 16px;
    background: #ffffff;

    .cardItemContainer {
      width: calc(33% - 10px);
      height: calc(50% - 10px);
      margin: 5px;
      border-radius: 16px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;

      .cardItemTop {
        display: flex;
        justify-content: center;
        align-items: baseline;
        font-size: 38px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #1b67d8;

        .cardItemContentUnit {
          margin-left: 2px;
          font-size: 28px;
          font-weight: 400;
        }
      }

      .cardItemText {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
      }
    }
  }

  .centerAndBottomCard {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    width: 100%;
    height: 470px;
    border-radius: 16px;
    background: #ffffff;

    .topTitle {
      box-sizing: border-box;
      width: 100%;
      margin-top: 40px;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      font-size: 34px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;

      .leftTitle {
        display: flex;
        align-items: center;

        img {
          width: 48px;
          height: 48px;
          margin-right: 16px;
        }
      }
    }

    .chartStyle {
      width: 98%;
      height: calc(100% - 100px);
    }
  }
}
</style>
