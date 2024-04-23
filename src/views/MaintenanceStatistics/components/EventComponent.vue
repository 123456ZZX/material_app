<template>
  <div class="commonComponents">
    <ChangeBizDate :dateType="dateType" @dateChange="dateChange" />
    <div class="topCard">
      <div v-for="card in cardDataConfig" :key="card.text" class="cardItemContainer">
        <div class="cardItemTop">
          <span class="cardItemContentNum">{{ card.counts }}</span>
          <span class="cardItemContentUnit">{{ card.unit }}</span>
        </div>
        <span class="cardItemText">{{ card.text }}</span>
      </div>
    </div>
    <div class="centerAndBottomCard">
      <div class="topTitle">
        <div class="leftTitle">
          <img src="../imgs/docImg.png" alt="" />
          <span>工单总数</span>
        </div>
        <div></div>
      </div>
      <div id="event_chartId_1" class="chartStyle"></div>
    </div>
    <div class="centerAndBottomCard">
      <div class="topTitle">
        <div class="leftTitle">
          <img src="../imgs/ordImg.png" alt="" />
          <span>工单分析</span>
        </div>
      </div>
      <div id="event_chartId_2" class="chartStyle"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as Api from '../api.js'
import ChangeBizDate from './ChangeBizDate.vue' // 日期选择组件
// 图表
import * as echarts from 'echarts'
import _cloneDeep from 'lodash/cloneDeep'
import { chartOption } from './chartOption.js'
export default {
  name: 'EventComponent',
  components: {
    ChangeBizDate,
  },
  data() {
    return {
      dateType: '月',
      netWorkDate: '',
      cardDataConfig: [
        {
          text: '总数',
          counts: '',
          unit: '',
          field: 'createTicket',
        },
        {
          text: '已办结',
          counts: '',
          unit: '',
          field: 'finishTicket',
        },
        {
          text: '办结率',
          counts: '',
          unit: '%',
          field: 'finishTicketRate',
        },
        {
          text: '退回次数',
          counts: '',
          unit: '',
          field: 'return',
        },
        {
          text: '延期次数',
          counts: '',
          unit: '',
          field: 'delay',
        },
        {
          text: '异常次数',
          counts: '',
          unit: '',
          field: 'operations',
        },
      ],
      myChart_1: null,
      myChart_2: null,
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      header: {},
    }
  },
  computed: {
    dataParams() {
      return {
        dateType: 'day',
        dateRangeType: 'dayRange',
        dateUnit: 'dayRange',
        startTime: this.$dayjs(this.netWorkDate).startOf('month').format('YYYY-MM-DD'), // 月初
        endTime: this.$dayjs(this.netWorkDate).endOf('month').format('YYYY-MM-DD'), // 月末
        typeList: ['defect', 'abnormal_inform', 'gwyxzysq', 'dispatch_repair', 'jlgd'],
      }
    },
  },
  mounted() {
    this.netWorkDate = this.$dayjs().format('YYYY-MM')
    this.getWpgToken() // 获取威派格工单token
  },
  methods: {
    // 获取威派格工单token
    getWpgToken() {
      // 获取header，查询工单用
      axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
        method: 'post',
        params: {
          token: this.accessToken,
        },
        headers: {
          Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
        },
      }).then((res) => {
        if (res.status == 200) {
          this.formToken = res.data.resultData.token
          this.header = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.formToken,
          }
          console.log('获取威派格工单header', this.header)
          this.getAllCardData() // 获取所有数据
        }
      })
    },
    // 时间组件日期切换事件，用于控制本组件网络请求日期 netWorkDate 字段
    dateChange(changeType) {
      // console.log(changeType) // subtract or addition
      if (changeType === 'subtract') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).subtract(1, 'month').format('YYYY-MM')
      } else if (changeType === 'addition') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).add(1, 'month').format('YYYY-MM')
      }
      console.log('网络请求用的日期', this.netWorkDate)
      this.getAllCardData() // 获取所有数据
    },
    // 获取所有数据
    getAllCardData() {
      console.log('获取所有数据参数', this.dataParams)
      // 1. 获取工单统计数据
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/outworkapi/ticketBaseAnalysis/baseAnalysis',
        method: 'post',
        data: this.dataParams,
        headers: this.header,
      }).then((res) => {
        console.log('获取工单统计数据', res)
        if (res?.data?.resultData.length > 0) {
          let resCardData = res.data.resultData
          this.cardDataConfig.forEach((item) => {
            resCardData.forEach((cardItem) => {
              // 如果字段相同
              if (item.field === cardItem.countsType) {
                item.counts = cardItem.counts
              }
            })
          })
        } else {
          // 如果没有数据，清空卡片数据
          this.cardDataConfig.forEach((item) => {
            item.counts = '---'
          })
        }
        // console.log('工单卡片数据赋值', _cloneDeep(this.cardDataConfig))
      })

      // 2. 获取工单总数图表数据
      let typeList = [
        'defect:缺陷工单',
        'dispatch_repair:维修工单',
        'jlgd:检漏工单',
        'abnormal_inform:问题上报',
        'gwyxzysq:有限空间作业',
      ]
      Promise.all(
        typeList.map((item) => {
          return axios({
            url:
              process.env.VUE_APP_THIRD_REQUEST_URL +
              '/main/outworkapi/ticketInfo/selectTicketInfoPage',
            method: 'post',
            data: {
              createTimeStart: this.dataParams.startTime + ' 00:00:00',
              createTimeEnd: this.dataParams.endTime + ' 23:59:59',
              typeList: [item.split(':')[0]], // 工单类型
              page: {
                current: 1,
                size: 1,
              },
              // ticketNo: null,
              // title: null,
              // address: null,
              // keyword: '',
              // agingStatus: '',
              // ticketStatus: '',
              // stepStatus: '',
              // priority: '',
              // sysCode: 'outwork',
              // sysCodeList: [],
              // coorganized: '',
              // userIdList: [],
              // createByList: [],
            },
            headers: this.header,
          })
        })
      ).then((resArr) => {
        console.log('获取工单总数图表数据', resArr) // resArr是一个数组，数组里面是每个接口的返回值
        let cloneChartOption_1 = _cloneDeep(chartOption)
        cloneChartOption_1.legend.data = []
        cloneChartOption_1.xAxis.data = typeList.map((item) => {
          return item.split(':')[1]
        })
        cloneChartOption_1.yAxis[0].name = '(个)'
        delete cloneChartOption_1.yAxis[1] // 删除第二个y轴
        cloneChartOption_1.series[0].name = ''
        delete cloneChartOption_1.series[1] // 删除第二个series
        if (resArr.length > 0) {
          resArr.forEach((item1, index1) => {
            typeList.forEach((item2, index2) => {
              if (index1 === index2 && item1?.data?.resultData) {
                cloneChartOption_1.series[0].data.push(item1?.data?.resultData?.total || 0)
              } else if (index1 === index2 && !item1?.data?.resultData) {
                cloneChartOption_1.series[0].data.push(0)
              }
            })
          })
        }
        this.initChartData(this.myChart_1, cloneChartOption_1, 'event_chartId_1')
      })

      // 3. 获取工单分析图表数据
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/outworkapi/ticketBaseAnalysis/newTicketLineChart',
        method: 'post',
        data: this.dataParams,
        headers: this.header,
      }).then((res) => {
        console.log('获取工单分析图表数据', res)
        let cloneChartOption_2 = _cloneDeep(chartOption)
        if (res?.data?.success && res?.data?.resultData?.handleData.length > 0) {
          let resChartData = res.data.resultData
          cloneChartOption_2.legend.data = resChartData.handleData.map((item) => {
            return item.dataTag === 'newTikcet'
              ? '新增工单'
              : item.dataTag === 'finishTikcetRate'
              ? '办结率'
              : ''
          })
          cloneChartOption_2.xAxis.data = resChartData.xAxis
          cloneChartOption_2.yAxis[0].name = '(个)'
          cloneChartOption_2.yAxis[1].name = '办结率(%)'
          cloneChartOption_2.series[0].name = cloneChartOption_2.legend.data[0]
          cloneChartOption_2.series[0].barWidth = 5 // 柱状图宽度
          cloneChartOption_2.series[1].name = cloneChartOption_2.legend.data[1]
          // series赋值
          cloneChartOption_2.series[0].data = resChartData.handleData[0].yAxis
          cloneChartOption_2.series[1].data = resChartData.handleData[1].yAxis
          this.initChartData(this.myChart_2, cloneChartOption_2, 'event_chartId_2')
        }
      })
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
  left: 200%;
  background-color: #F4F6F8;
  transition: all 0.5s;

  .topCard {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 24px;
    width: 100%;
    height: 300px;
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
