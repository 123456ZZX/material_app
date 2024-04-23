<template>
  <div class="main">
    <fm-nav-bar title="压力分析" left-arrow @click-left="$router.go(-1)" />
    <div class="myTab">
        <div class="tabArea">
            <div class="selectArea">
                <div class="item" :class="selectTab == '周' ? 'activeTab' : ''" @click="changeTab('周')">周</div>
                <div class="item" :class="selectTab == '月' ? 'activeTab' : ''" @click="changeTab('月')">月</div>
                <div class="item" :class="selectTab == '年' ? 'activeTab' : ''" @click="changeTab('年')">年</div>
            </div>
        </div>
    </div>
    <div class="container">
        <div>
            <div class="selectPipe">
                <fm-dropdown-menu>
                    <fm-dropdown-item @change="selectStation" v-model="deviceKey" :options="pressureStation" />
                </fm-dropdown-menu>
            </div>
            <div class="chartCard">
                <div class="header">
                    <img :src="require('@/assets/img/dispatchCenter/矩形.png')" width="4" class="icon" />
                    <div class="title">压力合格率</div>
                </div>
                <fm-divider />
                <div class="chart-body" id="passRateChart" />
            </div>
            <div class="chartCard">
                <div class="header">
                    <img :src="require('@/assets/img/dispatchCenter/矩形.png')" width="4" class="icon" />
                    <div class="title">压力振幅</div>
                </div>
                <fm-divider />
                <div class="chart-body" id="amplitudeChart" />
            </div>
            <div class="chartCard">
                <div class="header">
                    <img :src="require('@/assets/img/dispatchCenter/矩形.png')" width="4" class="icon" />
                    <div class="title">压力报警次数</div>
                </div>
                <fm-divider />
                <div class="chart-body" id="warnNumChart" />
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import * as apis from './api';
import * as echarts from "echarts";
import { Toast } from 'fawkes-mobile-lib';
import _cloneDeep from "lodash/cloneDeep";
const chartList = {
    passRateChart: null,
    warnNumChart: null,
    amplitudeChart: null
}
const chartSetting = {
    passRateChart: {
        legend: '合格率',
        unit: '%'
    },
    warnNumChart: {
        legend: '报警次数',
        unit: '次'
    },
    amplitudeChart: {
        legend: '振幅',
        unit: 'Mpa'
    }
}
export default {
    name: 'pressureDetail',
    data() {
        return {
            pressureStation: [],
            selectTab: '月',
            deviceKey: '',
            passRateChartList: [],
            amplitudeChartList: [],
            warnNumChartList: [],
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    bottom: 18,
                    top: 30
                },
                legend: {
                    data: [],
                    right: 10,
                    top: 0
                },

                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: ''
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        symbol: 'emptyCircle',
                        name: ''
                    }
                ]
            }
        }
    },
    created() {
        this.deviceKey = this.$route.query.deviceInfo.deviceKey
        this.pressureStation = this.$route.query.pressureStation.map(it => {
            return {
                text: it.deviceName,
                value: it.deviceKey
            }
        })
        this.getPressureData()
        this.$nextTick(() => {
            Object.keys(chartList).forEach(it => {
                this.initChart(it)
            })
        })
    },
    methods: {
        selectStation(val) {
            this.deviceKey = val
            this.getPressureData()
        },
        changeTab(tab) {
            this.selectTab = tab
            this.getPressureData()
        },
        initChart(name) {
            if (chartList[name] != null && chartList[name] != undefined) {
                chartList[name].dispose()
            } 
            chartList[name] = echarts.init(document.getElementById(name))
            let option = _cloneDeep(this.option)
            option && chartList[name].setOption(option, true)
        },
        getPressureData() {
            let toast = Toast.loading({
                message: '加载中',
                duration: 0,
                forbidClick: true,
                overlay: true,
                loadingType: 'spinner'
            })
            let params = {
                dateType: this.selectTab == '周' ? 'week' : this.selectTab == '月' ? 'month' : this.selectTab == '年' ? 'year' : '',
                facilityKey: this.deviceKey,
                type: '压力'
            }
            apis.getPressure(params).then(res => {
                if (res.status && res.data) {
                    this.dateList = res.data.map(it => it.date.slice(0, 10))
                    this.amplitudeChartList = res.data.map(it => it.amplitude)
                    this.warnNumChartList = res.data.map(it => it.warnNum)
                    this.passRateChartList = res.data.map(it => it.passRate)
                } else {
                    toast.clear()
                    Toast.error({
                        message: '加载失败',
                        duration: 1500
                    })
                }
            }).then(() => {
                Object.keys(chartList).forEach(it => {
                    this.option.legend.data[0] = chartSetting[it].legend
                    this.option.yAxis.name = chartSetting[it].unit
                    this.option.xAxis.data = this.dateList
                    this.option.series[0].name = chartSetting[it].legend
                    this.option.series[0].data = this[it + 'List']
                    this.initChart(it)
                })
                toast.clear()
            }).catch(err => {
                toast.clear()
                Toast.error({
                    message: 'err' + err,
                    duration: 2000
                })
            })
        }
    }
}
</script>

<style scoped lang="less">
/deep/.fm-dropdown-menu__bar {
    height: 56px;
    box-shadow: none;
}
/deep/.fm-divider {
    margin: 16px 0 8px;
}
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}
/deep/.fm-hairline--bottom::after {
    border-bottom-width: 0;
}
.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .myTab {
        width: calc(100% - 60px);
        height: 90px;
        background: #FFFFFF;
        padding: 30px;
        .tabArea {
            width: 100%;
            height: 100%;
            background: #F5F5F5;
            border-radius: 40px;
            display: flex;
            .selectArea {
                width: calc(100% - 16px);
                height: calc(100% - 16px);
                margin: 8px;
                border-radius: 40px;
                display: flex;
                justify-content: space-between;
                .item {
                    width: 33%;
                    height: 100%;
                    text-align: center;
                    font-size: 32px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    line-height: 74px;
                }
                .activeTab {
                    background: #FFFFFF;
                    font-weight: 500 !important;
                    color: #1B67D8 !important;
                    border-radius: 40px;
                }
            }
        }
    }
    .container {
      height: calc(100% - 216px);
      width: calc(100% - 60px);
      padding: 30px 30px 0 30px;
      background: #F5F7F9;
      display: flex;
      flex-direction: column;
      overflow: scroll;
      .selectPipe {
        width: calc(100% - 60px);
        height: 58px;
        border-radius: 16px;
        background: #FFFFFF;
        padding: 25px 30px;
        margin-bottom: 24px;
        text-align: center;
        .deviceName {
            height: 37px;
            font-size: 28px;
            font-family: MicrosoftYaHei;
            color: #555555;
            line-height: 37px;
            margin: 12px 0;
        }
      }
      .chartCard {
        width: 100%;
        height: 450px;
        background: #FFFFFF;
        border-radius: 16px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        .header {
            width: 100%;
            height: 77px;
            padding: 30px 0 0 0;
            display: flex;
            .icon {
                margin: auto 0;
            }
            .title {
                height: 50px;
                font-size: 36px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #191919;
                line-height: 50px;
                margin: auto 16px;
            }
        }
        .chart-body {
            height: calc(100% - 128px);
            width: calc(100% - 36px);
            padding: 0 18px 18px;
        }
      }
    }
}
</style>