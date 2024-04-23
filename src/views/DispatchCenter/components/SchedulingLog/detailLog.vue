<template>
    <div class="main">
        <fm-nav-bar title="日志详情" left-arrow @click-left="$router.go(-1)" />
        <!-- //要转化为图片的dom结构 -->
        <div id="html2pic" :class="toPic ? 'bg-maskBox' : 'bg-maskBox2'" ref="postContainer">
            <!-- //不能用background-image 改成img标签装背景图 -->

            <div class="main-content">
                <div class="cardLog">
                    <img style="width:5px;height:30px;float: left;margin-left: -10px;margin-top: 10px;"
                        src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                    <span class="title">日志信息</span>
                    <div class="rowInfo">
                        <span class="textLeft">日志名称</span>
                        <span class="textRight">{{ logInfo.logName }}</span>
                    </div>
                    <div class="rowInfo">
                        <span class="textLeft">日期</span>
                        <span class="textRight">{{ logInfo.logTime }}</span>
                    </div>
                    <div class="rowInfo">
                        <span class="textLeft">天气</span>
                        <span class="textRight">{{ logInfo.weather }}</span>
                    </div>
                </div>
                <!-- 调度明细 -->
                <div class="cardDetail">
                    <img style="width:5px;height:30px;float: left;margin-left: -10px;margin-top: 10px;"
                        src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                    <span class="title">调度明细</span>
                    <fm-tabs v-model="activeName" style="margin-left:-40px;">
                        <fm-tab :label="'水厂 ' + numWater" name="numWater">
                            <div class="table-container">
                                <table id="tableWater">
                                    <tr id="tableWaterTr1" name="pumpName">
                                        <th colspan="2">水厂</th>
                                    </tr>
                                    <tr id="tableWaterTr2" name="max">
                                        <th rowspan="5">供水压力（MPa）</th>
                                        <th>高</th>
                                    </tr>
                                    <tr id="tableWaterTr3" name="maxTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tableWaterTr4" name="min">
                                        <th>低</th>
                                    </tr>
                                    <tr id="tableWaterTr5" name="minTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tableWaterTr6" name="avg">
                                        <th>平均</th>
                                    </tr>
                                    <tr id="tableWaterTr7" name="power">
                                        <th>电耗</th>
                                        <th>Kwh</th>
                                    </tr>
                                    <tr id="tableWaterTr8" name="consumption">
                                        <th>单耗</th>
                                        <th>Kwh</th>
                                    </tr>
                                    <tr id="tableWaterTr9" name="level">
                                        <th>日供水量</th>
                                        <th>m&sup3;</th>
                                    </tr>
                                    <tr id="tableWaterTr10" name="tn">
                                        <th rowspan="3">水质</th>
                                        <th>总氮</th>
                                    </tr>
                                    <tr id="tableWaterTr11" name="ad">
                                        <th>余氯</th>
                                    </tr>
                                    <tr id="tableWaterTr12" name="tp">
                                        <th>浊度</th>
                                    </tr>
                                </table>
                                <table id="tableWaterRecycle">
                                    <tr id="tableWaterRecycle1" name="pumpName">
                                        <th colspan="2">水厂</th>
                                    </tr>
                                    <tr id="tableWaterRecycle2" name="max">
                                        <th rowspan="5">出水压力（MPa）</th>
                                        <th>高</th>
                                    </tr>
                                    <tr id="tableWaterRecycle3" name="maxTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tableWaterRecycle4" name="min">
                                        <th>低</th>
                                    </tr>
                                    <tr id="tableWaterRecycle5" name="minTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tableWaterRecycle6" name="avg">
                                        <th>平均</th>
                                    </tr>
                                    <tr id="tableWaterRecycle7" name="power">
                                        <th>电耗</th>
                                        <th>Kwh</th>
                                    </tr>
                                    <tr id="tableWaterRecycle8" name="consumption">
                                        <th>单耗</th>
                                        <th>Kwh</th>
                                    </tr>
                                    <tr id="tableWaterRecycle9" name="level">
                                        <th>日处理水量</th>
                                        <th>m&sup3;</th>
                                    </tr>
                                    <tr id="tableWaterRecycle10" name="tn">
                                        <th rowspan="3">水质</th>
                                        <th>总氮</th>
                                    </tr>
                                    <tr id="tableWaterRecycle11" name="ad">
                                        <th>氨氮</th>
                                    </tr>
                                    <tr id="tableWaterRecycle12" name="tp">
                                        <th>总磷</th>
                                    </tr>
                                </table>
                            </div>
                        </fm-tab>
                        <fm-tab :label="'泵站 ' + numPump" name="numPump">
                            <div class="table-container">
                                <table class="tablePump" v-for="(item, index) in tableDetailPump" :key="index">
                                    <tr>
                                        <th colspan="4">{{ item.pumpName }}</th>
                                    </tr>
                                    <tr>
                                        <th>时间</th>
                                        <th>设备</th>
                                        <th>动作</th>
                                        <th>动作时液位</th>
                                    </tr>
                                    <tr v-for="it in item.voList" :key="it" style="border: 0.2px solid #DDDDDD;">
                                        <td style="border: 0.2px solid #DDDDDD;">{{ it.time }}</td>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ it.deviceName }}</td>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ it.active }}</td>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ it.poolLevel }}</td>
                                    </tr>
                                    <tr>
                                        <th>总运行时间（h）</th>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ item.hour || "--" }}</td>
                                        <th>总运行次数（次）</th>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ item.num }}</td>
                                    </tr>
                                    <tr>
                                        <th>总故障次数（次）</th>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ item.warnNum }}</td>
                                        <th>进-出水量（m³）</th>
                                        <td style="border: 0.2px solid #DDDDDD;">{{ item.inWater }}-{{ item.outWater }}</td>
                                    </tr>
                                </table>
                            </div>
                        </fm-tab>
                        <fm-tab :label="'管网 ' + numPipe" name="numPipe">
                            <div class="table-container">
                                <table id="tablePipe">
                                    <tr id="tablePipeTr0" name="facilityName">
                                        <th colspan="2">监测指标</th>
                                    </tr>
                                    <tr id="tablePipeTr1" name="max">
                                        <th rowspan="5">管网压力（MPa）</th>
                                        <th>高</th>
                                    </tr>
                                    <tr id="tablePipeTr2" name="maxTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tablePipeTr3" name="min">
                                        <th>低</th>
                                    </tr>
                                    <tr id="tablePipeTr4" name="minTime">
                                        <th>时间</th>
                                    </tr>
                                    <tr id="tablePipeTr5" name="avg">
                                        <th>平均</th>
                                    </tr>
                                    <tr id="tablePipeTr6" name="passRate">
                                        <th>压力合格率</th>
                                        <th>%</th>
                                    </tr>
                                </table>
                            </div>
                        </fm-tab>
                    </fm-tabs>
                </div>
                <!-- 报警管理 handleStatus 1未处理、2已确认、3已延迟、4自动派单、5手动派单-->
                <div class="cardAlarm">
                    <img style="width:5px;height:30px;float: left;margin-left: -10px;margin-top: 10px;"
                        src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                    <span class="title">报警管理</span>
                    <div class="cardAlarmContent">
                        <div class="rowCard" v-for="(item, index) in tableAlarms" :key="index">
                            <div class="rowCardTitle">{{ item.index }} &nbsp; {{ item.belongSystem }} &nbsp;&nbsp;
                                <fm-tag :text-color="
                                    item.handleStatus == '2'
                                        ? '#40BB5A'
                                        : item.handleStatus == '4'
                                            ? '#6F62FF'
                                            : item.handleStatus == '5'
                                                ? '#00AFFF'
                                                : item.handleStatus == '1'
                                                    ? '#FF9429'
                                                    : item.handleStatus == '3'
                                                        ? '#DC143C'
                                                        : ''
                                " :color="
    item.handleStatus == '2'
        ? '#ebf8ee'
        : item.handleStatus == '4'
            ? '#f0efff'
            : item.handleStatus == '5'
                ? '#e5f7ff'
                : item.handleStatus == '1'
                    ? '#FF9429'
                    : item.handleStatus == '3'
                        ? '#DC143C'
                        : ''
">
                                    {{ item.handleStatus == '2'
                                            ? '已确认'
                                            : item.handleStatus == '4'
                                                ? '自动派单'
                                                : item.handleStatus == '5'
                                                    ? '手动派单'
                                                    : item.handleStatus == '1'
                                                        ? '未处理'
                                                        : item.handleStatus == '3'
                                                            ? '已延迟'
                                                            : ''
                                    }}
                                </fm-tag>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/监测.png" alt="">&nbsp;
                                <span class="text1">报警值/标准值： </span>
                                <span class="text2">
                                    {{ item.indexValue ? item.indexValue / 1000000 + 'MPa' : item.indexValue || '--'
                                    }}
                                    /
                                    {{ item.threshold ? item.threshold.split(",")[0] / 1000000 + "," +
                                            item.threshold.split(",")[1] / 1000000 + 'MPa' : item.threshold || '--'
                                    }}
                                </span>
                            </div>
                            <div class="row">
                                <img style="width:22px;height:24px;float: left;margin-left: 3px;"
                                    src="@assets/img/dispatchCenter/schedulingEvents/设备.png" alt="">&nbsp;
                                <span class="text1">所属设备： </span>
                                <span class="text2"> {{ item.deviceName }}</span>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/时间.png" alt="">&nbsp;
                                <span class="text1">报警时间： </span>
                                <span class="text2"> {{ item.createTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 调度事件 -->
                <div class="cardEvent">
                    <img style="width:5px;height:30px;float: left;margin-left: -10px;margin-top: 10px;"
                        src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                    <span class="title">调度事件</span>
                    <div class="cardEventContent">
                        <div class="con-div" v-for="(item, index) in tableList" :key="index">
                            <div class="top">
                                <div class="name">{{ item.ticketNo }}</div>
                                <div
                                    :class="item.status == 0 ? 'state c1' : item.status == 1 ? 'state c2' : item.status == 99 ? 'state c4' : 'state c3'">
                                    {{ item.state }}</div>
                            </div>
                            <div>
                                <div class="content">
                                    <span>事件类型&nbsp; </span>
                                    <span>&nbsp; {{ item.flawsName }}</span>
                                </div>
                                <div class="content">
                                    <span>现场情况&nbsp;</span>
                                    <span>&nbsp; {{ item.content }}</span>
                                </div>
                            </div>
                            <div class="under">
                                <div class="under-div"><i class="fm-icon fm-icon-contact"></i>{{ item.people }}</div>
                                <div class="under-div"><i class="fm-icon fm-icon-upgrade"></i>
                                    {{ item.deviceName[0] + '-' + item.deviceName[1] }}</div>
                                <div class="under-div"><i class="fm-icon fm-icon-underway-o"></i>{{ item.time }}</div>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- 调度指令 -->
                <div class="cardOrder">
                    <img style="width:5px;height:30px;float: left;margin-left: -10px;margin-top: 10px;"
                        src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                    <span class="title">调度指令</span>
                    <div class="cardOrderContent">
                        <div class="rowCard" v-for="(item, index) in tableCommands" :key="index">
                            <div class="rowCardTitle">{{ item.commandNumber }} &nbsp;&nbsp;
                                <fm-tag :text-color="
                                    item.commandStatus == '已完成'
                                        ? '#40BB5A'
                                        : item.commandStatus == '已发出'
                                            ? '#6F62FF'
                                            : item.commandStatus == '已接单'
                                                ? '#00AFFF'
                                                : item.commandStatus == '暂存'
                                                    ? '#1790fe'
                                                    : item.commandStatus == '已退单'
                                                        ? '#909399'
                                                        : ''
                                " :color="
    item.commandStatus == '已完成'
        ? '#ebf8ee'
        : item.commandStatus == '已发出'
            ? '#f0efff'
            : item.commandStatus == '已接单'
                ? '#e5f7ff'
                : item.commandStatus == '暂存'
                    ? '#e8f4ff'
                    : item.commandStatus == '已退单'
                        ? '#f4f4f5'
                        : ''
">
                                    {{ item.commandStatus }}
                                </fm-tag>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/监测.png" alt="">&nbsp;
                                <span class="text1">事件类型： </span>
                                <span class="text2"> {{ item.sendDepartment || '--' }}——>{{ item.receiveDepartment ||
                                        '--'
                                }}</span>
                            </div>
                            <div class="row">
                                <img style="width:22px;height:24px;float: left;margin-left: 3px;"
                                    src="@assets/img/dispatchCenter/schedulingEvents/设备.png" alt="">&nbsp;
                                <span class="text1">现场情况： </span>
                                <span class="text2">{{ item.detailedContent || '--' }}</span>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/人.png" alt="">&nbsp;
                                <span class="text1">发送人： </span>
                                <span class="text2"> {{ item.sendFullName }}</span>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/时间.png" alt="">&nbsp;
                                <span class="text1">发送时间： </span>
                                <span class="text2"> {{ item.sendTime }}</span>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/人.png" alt="">&nbsp;
                                <span class="text1">接收人： </span>
                                <span class="text2"> {{ item.receiveFullName }}</span>
                            </div>
                            <div class="row">
                                <img style="width:26px;height:26px;float: left"
                                    src="@assets/img/dispatchCenter/schedulingEvents/时间.png" alt="">&nbsp;
                                <span class="text1">接收时间： </span>
                                <span class="text2"> {{ item.receiveTime || '--' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div style="display: flex;justify-content: space-evenly;padding-top: 15px;background: #FFFFFF;">
            <fm-button style="width: 150px" round size="small" type="default" @click="toPic = true">&nbsp;取 消 &nbsp;
            </fm-button>
            <fm-button style="width: 150px" round size="small" type="primary" @click="readyToPic">&nbsp; 导 出 &nbsp;
            </fm-button>
        </div>
        <!-- //存放生成的图片 -->
        <!-- <div class="post" style="backgroundsize: 100%">
            <img id="post" src="#" />
        </div> -->
    </div>

</template>

<script>
import html2canvas from 'html2canvas';
import axios from 'axios'
import * as api from './api'
import { nextTick } from 'vue';
export default {
    name: "detailLog",
    data() {
        return {
            logInfo: {},
            activeName: "numWater",
            numWater: 0,
            tableDetailSupply: [],
            tableDetailRecycle: [],
            numPump: 0,
            tableDetailPump: [1, 2],
            numPipe: 0,
            tableDetailPipe: [],
            //事件
            accessToken: this.$storage.get('access_token'),
            formToken: '',
            header: {},
            tableData: [],// 获取事件列表
            tableList: [],//用于事件列表渲染
            // 报警记录
            tableAlarms: [],
            //调度指令
            tableCommands: [],
            toPic: false,
            // 调度明细
            // 表格
            isFirstPump: true,
            isFirstPipe: true,
        }
    },
    watch: {
        activeName: {
            handler(val) {
                console.log('activeName-val: ', val);
                if (val == 'numPump') {

                } else if (val == 'numPipe' && this.isFirstPipe) {
                    //nextTick  在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM
                    this.$nextTick(function () {
                        this.renderPipe()
                    })
                    this.isFirstPipe = false
                } else {

                }
            },
            immediate: true,
        }
    },
    mounted() {
        console.log(this.$route.query.item);
        this.logInfo = this.$route.query.item
        this.getWpgHeader()
        this.getTableAlarm()
        this.getTableCommand()

        this.getWater()
        this.getTablePump()
        this.getTablePipe()
    },
    created() {

    },
    methods: {
        //明细-水厂
        getWater() {
            let params = {
                date: this.logInfo.logTime
            }
            api.getTableWater(params).then(res => {
                this.tableDetailSupply = [res.data[1]];//供水厂
                console.log('tableDetailSupply: ', this.tableDetailSupply);
                this.tableDetailRecycle = [res.data[0]];//第一个对象是再生水厂
                console.log('tableDetailRecycle: ', this.tableDetailRecycle);
                this.numWater = Number(this.tableDetailSupply.length) + Number(this.tableDetailRecycle.length)
                this.renderWater()
            });
        },
        renderWater() {
            // 1.找到table标签
            var tableWater = document.getElementById("tableWater");
            // console.log('tableWater: ', tableWater);
            // // 2.创建一个tr节点
            // var trobj = document.createElement("tr");
            // // 3.创建一个td节点
            // var tdobj = document.createElement("td");
            // // 4.把td节点添加到tr里
            // trobj.appendChild(tdobj);
            // // 5.把tr节点添加到table里
            // tableWater.appendChild(trobj);
            var tableWaterTr = tableWater.getElementsByTagName('tr')
            // console.log('tableWaterTr:', tableWaterTr);

            this.tableDetailSupply.forEach((item, index) => {
                for (let i = 1; i <= tableWaterTr.length; i++) {
                    let id = 'tableWaterTr' + i
                    let trObj = document.getElementById(id)
                    // console.log('renderWater-trObj: ', trObj);

                    let tdobj = document.createElement("td");
                    tdobj.innerText = item[trObj.getAttribute('name')] || '--'
                    tdobj.setAttribute('style', 'min-width: 160px !important;border-bottom: 0.2px solid #DDDDDD;border-left: 0.2px solid #DDDDDD;');

                    trObj.appendChild(tdobj);
                }
            })
            var tableWaterRecycle = document.getElementById("tableWaterRecycle");
            var tableWaterRecycleTr = tableWaterRecycle.getElementsByTagName('tr')
            this.tableDetailRecycle.forEach((item, index) => {
                for (let i = 1; i <= tableWaterRecycleTr.length; i++) {
                    let id = 'tableWaterRecycle' + i
                    let trObj = document.getElementById(id)
                    // console.log('renderWater-tableWaterRecycle-trObj: ', trObj);

                    let tdobj = document.createElement("td");
                    tdobj.innerText = item[trObj.getAttribute('name')] || '--'
                    tdobj.setAttribute('style', 'min-width: 160px !important;border-bottom: 0.2px solid #DDDDDD;border-left: 0.2px solid #DDDDDD;');

                    trObj.appendChild(tdobj);
                }
            })
        },

        //调度明细-泵站
        getTablePump() {
            let params = {
                date: this.logInfo.logTime
            }
            api.getTablePump(params).then(res => {
                console.log('getTablePump-res: ', res);
                this.tableDetailPump = res.data
                this.numPump = this.tableDetailPump.length
                console.log('tableDetailPump: ', this.tableDetailPump);
            });
        },
        renderPump() {

        },
        //调度明细-管网
        getTablePipe() {
            let params = {
                date: this.logInfo.logTime
            }
            api.getTablePipe(params).then(res => {
                console.log('getTablePipe-res: ', res);
                this.tableDetailPipe = res.data;
                console.log('this.tableDetailPipe: ', this.tableDetailPipe);
                this.numPipe = this.tableDetailPipe.length
            });
        },
        renderPipe() {
            var tablePipe = document.getElementById("tablePipe");
            console.log('tablePipe: ', tablePipe);
            var tablePipeTr = tablePipe.getElementsByTagName('tr')

            this.tableDetailPipe.forEach((item, index) => {
                // console.log('index: ', index);
                // console.log('item: ', item);
                for (let i = 0; i < tablePipeTr.length; i++) {
                    let id = 'tablePipeTr' + i
                    let trObj = document.getElementById(id)
                    // console.log('trObj: ', trObj);
                    // console.log('trObj.name: ', trObj.getAttribute('name'));

                    let tdobj = document.createElement("td");
                    tdobj.innerText = item[trObj.getAttribute('name')]
                    tdobj.setAttribute('style', 'min-width: 140px !important;border-bottom: 0.2px solid #DDDDDD;border-left: 0.2px solid #DDDDDD;');

                    trObj.appendChild(tdobj);
                }
            })
        },

        // 报警管理表
        getTableAlarm() {
            let params = {
                "belongSystem": ["再生水", "供水"],
                "endTime": this.logInfo.logTime + " " + "23:59:59",
                "pageNo": 1,
                "pageSize": 99,
                "startTime": this.logInfo.logTime + " " + "00:00:00"
            }
            console.log('getTableAlarm-params: ', params);
            api.getTableAlarm(params).then((res) => {
                console.log('getTableAlarm-res: ', res);
                if (res.status) {
                    this.tableAlarms = res.data.list
                    //   this.totalAlarms = res.data.total
                }
            })
        },
        // 获取威派格工单事件（问题）
        async getWpgHeader() {
            // 获取header，查询工单用
            axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
                method: 'post',
                params: { token: this.accessToken, },
                headers: { Authorization: 'Basic b3V0d29yazp3cGcyMDIw', },
            }).then(async (res) => {
                if (res.status == 200) {
                    this.formToken = res.data.resultData.token
                    this.header = {
                        Authorization: 'Bearer ' + this.formToken,
                    }
                    let extParam = JSON.stringify(
                        {
                            createType: 'PC',
                        }
                    )
                    let extListParam = [
                        { keyList: ['deviceType'], valueList: ['recycle', 'supply', '供水', '再生水'] },//, '污水', '雨水', 'sewage', 'rain'
                    ]
                    let params = {
                        sysCode: 'outwork',
                        smallType: 'abnormal_inform',
                        startDate: this.logInfo.logTime,
                        endDate: this.logInfo.logTime,
                        extParam: extParam,
                        extListParam: extListParam, // 同时查再生水和供水
                        page: {
                            current: 1,
                            size: -1,
                        },
                    }
                    await this.getTableData(params) // 获取事件列表
                }
            })
        },
        // 获取事件列表
        async getTableData(params) {
            this.tableData = []
            console.log('获取事件列表参数', params)
            await axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
                method: 'post',
                data: params,
                headers: this.header,
            }).then((res) => {
                console.log('获取事件列表结果', res)
                if (res.status == 200 && res.data != null) {
                    this.tableData = res.data?.resultData?.records || []

                    this.tableData.forEach((td) => {
                        let item = {
                            id: td.id,
                            deviceName: td.formValue.deviceType,
                            ticketNo: td.ticketNo,
                            flawsName: td.formValue.faultTypes,
                            status: td.ticketStatus,
                            state: td.ticketStatusName,
                            content: td.formValue.questionDescribe,
                            people: td.createByName,
                            time: td.createTime.slice(0, 10),
                            flawsFrom: td.formValue.defectFrom,
                            lnglat: [td.appealLng, td.appealLat],
                        }
                        this.tableList.push(item)
                    })

                }
            })
        },
        //调度指令
        getTableCommand() {
            let params = {
                page: 1,
                size: 99,
                // realName: this.$store.state.user.userName,
                // sendTime: this.form.logTime,
            }
            this.logInfo.logTime ? params.startTime14 = this.logInfo.logTime + ' 00:00:00' : 1
            this.logInfo.logTime ? params.endTime14 = this.logInfo.logTime + ' 23:59:59' : 1
            api.getTableCommand(params).then(res => {
                console.log('getTableCommand-res: ', res);
                this.tableCommands = res.data.records;
            });
        },
        //导出
        readyToPic() {
            this.toPic = true
            setTimeout(() => {
                this.htmlToimg()
            }, 2000);
        },
        // html转换为img图片
        htmlToimg() {
            console.log('htmlToimg: ');
            // let dom = document.getElementsByClassName('bg-maskBox')[0];
            let dom = document.getElementById('html2pic')
            let scale = window.devicePixelRatio;
            html2canvas(dom, {
                useCORS: true,
                allowTaint: false,
                height: dom.offsetHeight, //画布高度
                width: dom.offsetWidth, //画布宽度
                scrollX: 0,
                scrollY: 0,
                // 页面下拉时会导致生成的图片整体偏移
                // scrollX: -scrollX,
                // scrollY: -scrollY,
                dpi: window.devicePixelRatio,
                scale: scale,
                backgroundColor: null, //去掉白边
            }).then((canvas) => {
                canvas.toBlob((blob) => {
                    var imgUrl = canvas.toDataURL("image/png", 1); // 获取生成的图片的url
                    console.log('imgUrl: ', imgUrl);
                    // document.getElementById("post").src = imgUrl;
                    // 创建隐藏的可下载链接
                    var eleLink = document.createElement("a");
                    eleLink.href = imgUrl; // 转换后的图片地址
                    eleLink.download = "pictureName";
                    // 触发点击
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    // 然后移除
                    document.body.removeChild(eleLink);
                    this.toPic = false
                });
            });
        },

    }
}
</script>

<style lang="scss" scoped>
.main {
    background: #F5F7F9;
    height: 100%;

    .bg-maskBox {
        overflow: overlay;
    }

    .bg-maskBox2 {
        overflow: overlay;
        height: 85%;
    }

    .main-content {
        overflow: overlay;
        height: 100%;
        overflow-y: overlay;
        overflow-x: hidden;
    }

    .title {
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 50px;
        border-bottom: 2px solid rgba(151, 151, 151, 0.1);
    }
}

.cardLog {
    width: 690px;
    height: 400px;
    background: #FFFFFF;
    border-radius: 16px;
    margin: 40px;

    .rowInfo {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid rgba(151, 151, 151, 0.1);

        .textLeft {
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 105px;
        }

        .textRight {
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #CCCCCC;
            line-height: 105px;
        }
    }
}

.cardDetail {
    width: 690px;
    height: auto;
    background: #FFFFFF;
    border-radius: 16px;
    margin: 40px;

    .table-container {
        margin-left: 68px;
        width: 690px;
        height: auto;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 45px;
        text-align: center;
        overflow: auto;


        #tablePipe {
            border-top: 0.5px solid #DDDDDD;
            border-right: 0.2px solid #DDDDDD;
            margin-bottom: 10px;

            tr {
                border: 2px solid #DDDDDD;
            }

            tr th {
                border-bottom: 0.2px solid #DDDDDD;
                border-left: 0.2px solid #DDDDDD;
                background: #EFF6FE;
                width: 160px;
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 45px;
            }
        }

        .tablePump {
            border-top: 0.5px solid #DDDDDD;
            border-right: 0.2px solid #DDDDDD;
            margin-bottom: 10px;

            tr {
                border: 2px solid #DDDDDD;
            }

            tr th {
                border-bottom: 0.2px solid #DDDDDD;
                border-left: 0.2px solid #DDDDDD;
                background: #EFF6FE;
                min-width: 220px;
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 45px;
            }
        }

        #tableWater {
            border-top: 0.5px solid #DDDDDD;
            border-right: 0.2px solid #DDDDDD;
            margin-bottom: 10px;

            tr {
                border: 2px solid #DDDDDD;
            }

            tr th {
                border-bottom: 0.2px solid #DDDDDD;
                border-left: 0.2px solid #DDDDDD;
                background: #EFF6FE;
                width: 160px;
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 45px;
            }
        }

        #tableWaterRecycle {
            border-top: 0.5px solid #DDDDDD;
            border-right: 0.2px solid #DDDDDD;

            tr {
                border: 2px solid #DDDDDD;
            }

            tr th {
                border-bottom: 0.2px solid #DDDDDD;
                border-left: 0.2px solid #DDDDDD;
                background: #EFF6FE;
                width: 160px;
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 45px;
            }
        }
    }
}


.cardAlarm {
    width: 690px;
    height: 744px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    margin: 40px;

    .cardAlarmContent {
        overflow: auto;
        height: 84%;
        margin-top: 20px;

        .rowCard {
            width: 690px;
            height: 287px;
            border-top: 2px solid rgba(151, 151, 151, 0.1);
            border-bottom: 2px solid rgba(151, 151, 151, 0.1);
            margin-top: 5px;

            .rowCardTitle {
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 45px;
                margin: 20px;
            }

            .row {
                display: flex;
                justify-content: flex-start;
                margin: 6px;

                .text1 {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 40px;
                }

                .text2 {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    line-height: 40px;
                }
            }
        }
    }
}

.cardEvent {
    width: 690px;
    height: 764px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    margin: 40px;

    .cardEventContent {
        overflow: auto;
        height: 91%;

        .con-div {
            margin-top: 25px;
            width: 680px;
            height: 270px;
            background: #ffffff;
            box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.08);
            border-radius: 16px;
            border-top: 2px solid rgba(151, 151, 151, 0.2);

            .top {
                width: 100%;
                height: 80px;
                line-height: 80px;
                overflow: auto;

                // display: inline;
                .name {
                    margin-left: 20px;
                    float: left;
                    width: auto;
                    font-size: 36px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #191919;
                }

                .img {
                    width: 30px;
                    height: 39px;
                    float: right;
                    margin-right: 20px;
                    margin-top: 15px;
                }

                .state {
                    float: left;
                    margin-left: 20px;
                    margin-top: 16px;
                    width: auto;
                    padding-left: 10px;
                    padding-right: 10px;
                    height: 42px;
                    line-height: 42px;
                    border-radius: 4px;
                }

                .c1 {
                    background: rgba(64, 187, 90, 0.1);
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #40bb5a;
                }

                .c2 {
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #027aff;
                    background: rgba(2, 122, 255, 0.1);
                }

                .c3 {
                    background: rgba(255, 148, 41, 0.1);
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ff9429;
                }

                .c4 {
                    background: rgba(255, 148, 41, 0.1);
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #6e6d6c;
                }
            }

            .content {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 96%;
                height: 60px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #555555;
                line-height: 60px;
                padding-left: 20px;

                span:first-child {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 36px;
                }

                span:last-child {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #333333;
                    line-height: 40px;
                }
            }

            .under {
                width: 100%;
                margin-left: -17px;
                display: flex;
                justify-content: space-between;
                height: 70px;
                line-height: 70px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #555555;

                .under-div {
                    margin-left: 30px;
                    float: left;
                }
            }
        }
    }

}

.cardOrder {
    width: 690px;
    height: 744px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    margin: 40px;

    // margin-top: 100px;
    .cardOrderContent {
        overflow: auto;
        height: 84%;
        margin-top: 20px;

        .rowCard {
            width: 690px;
            height: 540px;
            border-top: 2px solid rgba(151, 151, 151, 0.1);
            border-bottom: 2px solid rgba(151, 151, 151, 0.1);
            margin-top: 5px;

            .rowCardTitle {
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 45px;
                margin: 20px;
            }

            .row {
                display: flex;
                justify-content: flex-start;
                margin: 6px;

                .text1 {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 40px;
                }

                .text2 {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    line-height: 40px;
                    width: 66%;
                }
            }
        }
    }
}
</style>