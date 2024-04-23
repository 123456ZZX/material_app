<!-- '压力监测详情面板（点击卡片）' -->
<template>
  <div class="task-map full-width">
    <!-- 导航栏 -->
    <fm-nav-bar
      :title="pressureDataSelf.monitorName"
      left-arrow
      @click-left="goto"
    >
      <template #right>
        <fm-popover
          :visible.sync="showPopover"
          trigger="click"
          placement="bottom-end"
        >
          <template #reference>
            <img
              @click="isCollection"
              style="height:25px;"
              :src="collection ? require('@/assets/img/map/collection.png') : require('@/assets/img/map/collectionNo.png')"
              alt=""
            />
          </template>
        </fm-popover>
      </template>
    </fm-nav-bar>
    <div class="line-c">
      <!-- <div class="beat" v-if="mainListStyle['--top'] == '77px'"><i class="fm-icon fm-icon-arrow-left" @click="closePopup_pressure"></i></div> -->
      <div class="PressureMonitorDetail">
        <div class="content" id="arrowUp">
          <div class="topLeft">
            <img
              style="height:16px; margin-right:10px"
              src="@/assets/img/map/title-small.png"
              alt=""
            />
            <div class="title">最新数据时间：<span>{{showFunctionData[0].time ? showFunctionData[0].time.substring(1, 20) : ''}}</span></div>
          </div>
        </div>
        <div class="centerSide">
          <div v-for="(item, index) in showFunctionData" :key="index" class="device" :class="item.id == functionId ? 'normalBgc' : ''" @click="changeFunctionHistoryData(item)">
            <!-- :class="pressureDataSelf.isWarn && pressureDataSelf.isWarn == 1? 'redNumber': ''" -->
            <div class="centerSide-key">{{ item.name }}：</div>
            <div class="value"> {{ item.val ? Number(item.val).toFixed(3) : '--' }}{{ item.desc }}</div>
          </div>
        </div>
        <div class="ea">
          <fm-tabs v-model="timeValue" @tab-click="tabClick" type="line">
            <fm-tab v-for="(item, index) in timeArr" :label="item.label" :name='item.name' :key="index">
            </fm-tab>
          </fm-tabs>
          <div class="maxmin">
            <div class="title">最高：<span>{{maxMpa}}</span></div>
            <div class="title">平均值：<span>{{averageMpa}}</span></div>
            <div class="title">最低：<span>{{minMpa}}</span></div>
          </div>
          <div class="change-true" @click="table = true"  v-if="!table">
              <img
                src="@/assets/img/map/noFill.png"
                alt=""
              />
            </div>
          <div class="ta-b" v-if="table">
            <div class="change" @click="table = false">
              <img
                src="@/assets/img/map/fill.png"
                alt=""
              />
            </div>
            <div class="con">
              <div class="v">
                <div style="display: flex; justify-content: center">时间</div>
                <div style="display: flex; justify-content: center" v-for="(item, index) in tableData.time" :key="index">
                  {{item}}
                </div>
              </div>
              <div class="va">
                <div style="display: flex; justify-content: center">数值</div>
                <div style="color: #1B67D8; display: flex; justify-content: center" v-for="(i, k) in tableData.value" :key="k">
                  {{i}}
                </div>
              </div>
            </div>
          </div>
          <div id="historyChart" style="width: 100%; height: 256px; margin-top: 10px;">

          </div>
        </div>
      </div>
      <div class="alarm">
        <div class="title">报警记录</div>
        <div class="status">
          <div class="status_item" :class="choose[0] == '1' ? 'choose' : ''" @click="statusChange([1])">告警中</div>
          <div class="status_item" :class="choose[0] == '2' ? 'choose' : ''" @click="statusChange([2])">已关闭</div>
        </div>
        <div class="emptyText" v-if="alarmDataArray.length == 0">暂无数据</div>
        <div class="card" v-for="(item,index) in alarmDataArray" :key="index">
          <img
            class="level"
            :src="item.warnLevel && require(`@/assets/img/map/${item.warnLevel}.png`)"
            alt=""
          />
          <div class="top">{{item.warnType}}</div>
          <div class="middle">{{item.warnDesc}}</div>
          <div class="bottom" v-if="choose[0] == '1'" style="margin-top: 6px">
            <div>{{item.startTime}}</div>
            <div class="r-b">
              <div class="r-i" @click="closeAlarm(item)">
                <img
                  :src="require(`@/assets/img/map/close.png`)"
                  alt=""
                />
                关闭
              </div>
              <div class="r-i" @click="dispatchAlarm(item)">
                <img
                  :src="require(`@/assets/img/map/dispatch.png`)"
                  alt=""
                />
                派单
              </div>
            </div>
          </div>
          <div v-if="choose[0] == '2'">
            <div class="bottom" style="margin-top: 6px">
              <div>{{ item.startTime || '---' }} 至 {{ item.endTime || '---' }}</div>
            </div>
            <div class="bottom" style="margin-top: 6px">
              <div>关闭原因：{{ item.ackReason || '---' }}</div>
            </div>
            <div class="bottom" style="margin-top: 6px">
              <div>关闭人：{{ item.handler || '---' }}</div>
            </div>
          </div>
        </div>
      </div>
      <fm-dialog :visible.sync="closePopup" title="提示" show-cancel-button @confirm="closeConfim">
        <fm-cell-group>
          <fm-field v-model="closeData.reason" rows="2" type="textarea" maxlength="100" show-word-limit autosize placeholder="请输入关闭原因"/>
        </fm-cell-group>
      </fm-dialog>
      <fm-dialog :visible.sync="dispatchPopup" title="提示" show-cancel-button :beforeClose="beforeClose">
        <fm-cell-group>
          <selectUser
            title="负责人"
            :userName="form.handlerUserName"
            :userFullname="form.handlerUserFullName"
            required
            :rules="[{ required: true, message: '请选择负责人' }]"
            @change="getChange"
            placeholder="请选择负责人"
          />
          <fm-field
            v-model="form.handle_time"
            clearable
            input-align="center"
            label="要求完成时间" 
            required
            :rules="[{ required: true, message: '请选择要求完成时间' }]"
            placeholder="请选择完成时间"
            @focus="showTime"
            readonly
          />
          <fm-field
            name="radio"
            required
            input-align="right"
            :rules="[{ required: true, message: '请选择紧急程度' }]"
            label="紧急程度"
          >
            <template #input>
              <fm-radio-group v-model="form.priority">
                <fm-radio name="2" style="margin-bottom:5px;">一般</fm-radio>
                <fm-radio name="1" style="margin-bottom:5px;">紧急</fm-radio>
                <fm-radio name="0" style="margin-bottom:5px;">优先</fm-radio>
              </fm-radio-group>
            </template>
          </fm-field>
        <fm-field v-model="form.remark" label="备注" placeholder="请输入备注"/>
        </fm-cell-group>
      </fm-dialog>
      <fm-popup :visible.sync="timeShow" position="bottom">
        <fm-datetime-picker
          v-model="time"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirm"
          @cancel="cancel"
          :formatter="formatter"
        />
      </fm-popup>
    </div>
  </div>
</template>
<script>
import { getHistoryData, getalarmData, closeAlarm, createForm } from "../api";
import * as echarts from "echarts";
import _cloneDeep from "lodash/cloneDeep";
import { chartOption } from "./chartOption.js";
import * as timeFormat from "@/utils/timezone.js";
import { formatDate } from './util'
import selectUser from '@/components/select-user/index.vue'
import storage from '@/utils/storage'
import {
  NavBar,
  Form,
  Field,
  Calendar,
  Button,
  Stepper,
  Popup,
  Picker,
  Checkbox,
  CheckboxGroup,
  Toast,
  CellGroup,
  Dialog,
  Notify
} from 'fawkes-mobile-lib'
export default {
  components: {
    selectUser,
  },
  props: {
  },
  data() {
    return {
      navbarTitle: '日常任务',
      showPopover: false,
      form: {
        handlerUserName: '',
        handlerUserFullName: '',
        handlerUserId: '',
        handle_time: '',
        priority: '',
        remark: ''
      },
      pressureDataSelf: {}, // 监测设备properties数据
      pressureDataDetail: {},
      showFunctionData: [], // 压力监测详情面板动态展示功能点数据
      tableData: {},
      chartOptionSelf: _cloneDeep(chartOption),
      maxMpa: 0,
      minMpa: 0,
      averageMpa: 0,
      myChartData: null,
      timeT: [],
      table: false,
      clientHeight: document.body.clientHeight,
      loading: false, // 压力监测详情面板loading状态
      timeDataArray: [], // 压力监测详情面板历史属性信息
      alarmDataArray: [],
      timeValue:'24小时',
      nowPressureID: "", // 点击当前压力检测设备获得的该设备的_id
      deviceId: "",
      functionName: "", // 当前功能点名称
      yAxisUnit: "", // 当前功能点单位
      functionId: "", // 压力监测详情面板有多个功能点需要展示时，默认展示第一个功能点id历史数据
      timeArr:[{label:'24小时', name:'24小时'},{label:'本周', name:'本周'}],
      choose: [1],
      collection: false,
      closePopup: false,
      closeData: {},
      dispatchPopup: false,
      dispatchData: {},
      timeShow:false,
      minDate: new Date(this.$dayjs().format("YYYY, MM, DD")),
      maxDate: new Date(2028, 10, 1),
      time: '',
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    // 基本信息赋值
    this.pressureDataSelf = JSON.parse(this.$route.query.data)
    console.log("点击卡片传递的详情数据---created", _cloneDeep(this.pressureDataSelf));
    this.nowPressureID = this.pressureDataSelf.iotId;
    this.deviceId = this.pressureDataSelf.deviceId;
    let realtimeData = this.pressureDataSelf.realtimeData;
    // 筛选出需要展示的功能点
    // 目前压力计有一个功能点，流量计有两个
    this.showFunctionData = realtimeData.filter((item) => {
      return item.isShow == 0;
    });
    this.functionId = this.showFunctionData[0].id;
    this.functionName = this.showFunctionData[0].name;
    this.yAxisUnit = this.showFunctionData[0].desc;
    this.historyData();
    this.alarmData();
    setInterval(()=>{this.historyData()}, 5 * 60 * 1000)
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    goto() {
      this.$router.push({
        name: 'OneMap',
        query: {
          data: '监测列表'
        }
      })
      return
    },
    changeFunctionHistoryData(item) {
      // 当前功能点id
      this.functionId = item.id;
      this.functionName = item.name;
      this.yAxisUnit = item.desc;
      this.historyData();
      this.$forceUpdate();
    },
    // tab切换回调
    tabClick(name, title) {
      this.timeValue = name
      this.historyData();
    },
    async historyData() {
      // 压力监测面板loading开启
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      // 24h 7day
      let params = {
        start:
          this.timeValue === "24小时"
            ? new Date().getTime() - 1000 * 60 * 60 * 24
            : new Date().getTime() - 1000 * 60 * 60 * 24 * 7,
        end: new Date().getTime() - 1000 * 60,
        index: this.functionId,
        iotId: this.nowPressureID,
      };
      let res = await getHistoryData(params);
      // 压力监测面板loading关闭
      this.loading = true;
      // console.log("设备历史数据", res.data);
      if (res?.data && res?.data.length > 0) {
        this.timeDataArray = res.data;
        // 图表接入历史数据
        this.ChartDataAdd();
      } else {
        this.timeDataArray = [];
      }
    },
    async alarmData() {
      let params = {
        "page": 1,
        "size": 10,
        "provider": "",
        "system": "",
        "warnLevel": null,
        "startTime": "2023-01-01 00:00:00",
        "endTime": this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        "warnType": "",
        "deviceName": this.pressureDataSelf.deviceName,
        "status": this.choose
      }
      let res = await getalarmData(params);
      if (res?.data?.list && res?.data?.list.length > 0) {
        this.alarmDataArray = res.data.list;
      } else {
        this.alarmDataArray = [];
      }
    },
     // 初始化图表
    initChartData() {
      if (
        this.myChartData != null &&
        this.myChartData != "" &&
        this.myChartData != undefined
      ) {
        this.myChartData.dispose();
      }
      let chartDom = document.getElementById("historyChart");
      this.myChartData = echarts.init(chartDom);
      let option = _cloneDeep(this.chartOptionSelf);
      option && this.myChartData.setOption(option, true);
    },
    // 图表接入历史数据
    ChartDataAdd() {
      this.$nextTick(() => {
        this.initChartData();
      });
      // 图表数据和最高低、平均值置空
      this.timeT=[]
      this.chartOptionSelf.xAxis[0].data = [];
      this.chartOptionSelf.series[0].data = [];
      this.chartOptionSelf.series[1].data = [];
      this.chartOptionSelf.series[2].data = [];
      this.maxMpa = 0;
      this.minMpa = 0;
      this.averageMpa = 0;
      // console.log("图表数据", this.timeDataArray);
      // 如果时间数据为空就退出
      if (this.timeDataArray.length === 0) return;
      // 数据顺序调换
      let selfTimeDataReverse = _cloneDeep(this.timeDataArray);
      selfTimeDataReverse = selfTimeDataReverse.reverse();

      // 最高值
      this.maxMpa = parseFloat(selfTimeDataReverse[0].value);
      // 最低值
      this.minMpa = parseFloat(selfTimeDataReverse[0].value);
      // 总值
      let totalValue = 0;

      selfTimeDataReverse.forEach((item) => {
        totalValue += parseFloat(item.value);
        this.maxMpa =
          parseFloat(this.maxMpa) < parseFloat(item.value)
            ? parseFloat(item.value)
            : parseFloat(this.maxMpa);
        this.minMpa =
          parseFloat(this.minMpa) > parseFloat(item.value)
            ? parseFloat(item.value)
            : parseFloat(this.minMpa);
        let timer = timeFormat.transDate(item.time, 1).slice(5);
        this.timeT.push(timer)
        timer = timer.split(" ");
        timer = timer.reverse();
        timer = timer.join("");
        // this.chartOptionSelf.xAxis.data.push(timer.format("YYYY-MM-DD HH:mm:ss"));

        // 图表X轴数据赋值
        this.chartOptionSelf.xAxis[0].data.push(timer);

        // 图表历史数据赋值，蓝线
        // 压力值需要单独处理
        // if (this.functionId == "36865") {
        //   this.chartOptionSelf.series[1].data.push(
        //     (item.value / 1000000).toFixed(3)
        //   );
        // } else {
        //   this.chartOptionSelf.series[1].data.push(item.value);
        // }
        this.chartOptionSelf.series[1].data.push(item.value);        
        this.chartOptionSelf.series[1].name = this.functionName;
      });
      // 图表y轴动态赋值
      this.chartOptionSelf.yAxis[0] = {
        name: this.yAxisUnit,
        type: "value",
      };
      selfTimeDataReverse.forEach((item) => {
        this.chartOptionSelf.series[0].data.push(this.maxMpa);
        // 图表最小值数据赋值，红线
        this.chartOptionSelf.series[2].data.push(this.minMpa);
      });
      // 平均值
      this.averageMpa =
        totalValue == 0
          ? 0
          : (totalValue / selfTimeDataReverse.length).toFixed(3);
      this.tableData = {time:this.timeT, value:this.chartOptionSelf.series[1].data}
    },
    statusChange(item) {
      this.choose = item
      this.alarmData();
    },
    isCollection() {
      this.collection = !this.collection
    },
    closeAlarm(item) {
      this.reason = ''
      this.closePopup = true
      this.closeData = item
    },
    closeConfim() {
      let param = {
        recordId: this.closeData.recordId,
        system: this.closeData.provider,
        deviceId: this.pressureDataSelf.deviceId,        
        method: 'ack',
          params: {
            reason: this.closeData.reason,
            desc: ''
          }
      }
      closeAlarm(param).then(res => {
        if (res.status) {
          Notify({ type: 'success', message: '成功关闭告警', duration: 1000 });
          this.alarmData();
        } else {
          Notify({ type: 'error', message: '关闭告警失败', duration: 1000 });
        }
      })
    },
    showTime() {
      this.timeShow = true
    },
    // 处理控件显示的时间格式
    formatter(type, value) {
      // 格式化选择器日期
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    // 确认开始日期
    confirm(date) {
      this.timeShow = false
      this.form.handle_time = formatDate(date)
    },
    cancel() {
      this.timeShow = false
    },
    dispatchAlarm(item) {
      this.dispatchData = item
      this.form = {
        handlerUserName: '',
        handlerUserFullName: '',
        handlerUserId: '',
        handle_time: '',
        priority: '',
        remark: ''
      }
      this.$forceUpdate()
      this.dispatchPopup = true
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (this.form.handlerUserId == '' || this.form.handle_time == '' || this.form.priority == '') {
          Notify({ type: 'error', message: '请检查必填信息', duration: 1000 });
          done(false)
        } else {
          this.dispatchConfim()
          setTimeout(done, 1000);
        }
      } else {
        done();
      }
    },
    dispatchConfim() {
      let warnLevel = this.dispatchData.warnLevel == 'slight' ? '轻微告警' : this.dispatchData.warnLevel == 'mild' ? '一般告警' : '严重告警'
      let title = this.dispatchData.deviceName + '站点发生' + warnLevel
      let params = {
        creatorId: storage.get('userId'),
        templateCode: 'dispatch_alarm_template',
        latitude: this.dispatchData.lat,
        longitude: this.dispatchData.lon,
        title: title,
        priority: this.form.priority,
        sysSource: 'outwork',
        createType: 'PC',
        questionDescribe: this.dispatchData.warnDesc,
        formJson: {
          alarm_levle: this.dispatchData.warnLevel,
          deviceIdList: [this.dispatchData.deviceKey],
          alarm_type: this.dispatchData.warnType || '',
          start_time: this.dispatchData.startTime,
          handle_time: this.$dayjs(this.form.handle_time).format('YYYY-MM-DD HH:mm'),
          deviceName: this.dispatchData.deviceName,
          deviceDetail: {},
          remark: this.form.remark,
          ticketDispatchUserIds: [
            {
              name: this.form.handlerUserName,
              id: this.form.handlerUserId,
              type: '99'
            }
          ]
        }
      }
      let urlParams = {
          deviceId: this.dispatchData.deviceId,
          provider: this.dispatchData.provider
      }      
      createForm(params, this.dispatchData.recordId, urlParams).then(res => {
        if (res.status) {
          Notify({ type: 'success', message: '成功派单', duration: 1000 });
          this.alarmData();
        } else {
          Notify({ type: 'error', message: '派单失败', duration: 1000 });
        }
      })
    },
    getChange(val) {
      this.form.handlerUserName = val[0].userName
      this.form.handlerUserFullName = val[0].userFullname
      this.form.handlerUserId = val[0].id
    },
    jump(id) {
      this.$router.push({
          name: 'detailFlawOrder',
          query: { id }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.task-map {
  width: 100%;
  height: 100%;
  background-color: #F5F7F9;
  position: relative;
  .line-c {
    // position: absolute;
    // bottom: 0;
    // left: 0;
    width: 100%;
    height: calc(100% - 98px);
    background-color: #F5F7F9;
    overflow-y: scroll;
    padding-bottom: 120px;
    box-sizing: border-box;
  }
  .alarm{
    width: calc(100% - 60px);
    margin: 30px;
    .title {
      height: 50px;
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
      line-height: 50px;
    }
    .status {
      width: 100%;
      margin: 24px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      .status_item {
        width: 216px;
        height: 72px;
        background: #FFFFFF;
        border-radius: 36px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .choose {
        background: #DDE8F9;
        color: #1B67D8;
      }
    }
    .emptyText {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    .card {
      width: calc(100% - 60px);
      position: relative;
      padding: 26px 30px;
      margin-bottom: 24px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px 0px rgba(104,115,127,0.06);
      border-radius: 16px;
      .level {
        height: 54px;
        position: absolute;
        top: 26px;
        right: -8px;
      }
      .top {
        height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .middle {
        // height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 40px;
        margin-bottom: 27px;
      }
      .bottom {
        // height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .r-b {
          display: flex;
          flex-direction: row;
        }
        .r-i {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-left: 30px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1B67D8;
          img {
            height: 32px;
            margin-right: 12px;
          }
        }
      }
    }
  }
  .pic {
    background: linear-gradient(180deg, #DFEDFF 0%, #EDF6FF 44%, rgba(243,248,255,0.81) 81%, rgba(255,255,255,0) 100%);
  }
  .beat {
    width: 100%;
    height: 88px;
    line-height: 88px;
    margin-bottom: 30px;
    font-size: 42px;
    transition: 1s;
  }
  .PressureMonitorDetail {
    width: calc(100% - 120px);
    margin: 30px;
    padding: 30px;
    background: #FFFFFF;
    box-shadow: 0px -6px 12px 0px rgba(104,115,127,0.1);
    border-radius: 12px;
    .close {
      height: 8px;
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .content {
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .topLeft {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        display: flex;
        align-items: center;
        width: 90%;
        .title {
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1B67D8;
          }
        }
      }

      .topRight {
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        align-items: center;
        font-size: 36px;
        img {
          width: 17px;
          height: 17px;
        }
      }
    }
    .centerSide {
      display: -webkit-box;
      width: 100%;
      overflow: scroll;
      &::-webkit-scrollbar{
        display: none;
      }
      .device {
        height: 40px;
        border: 1px solid transparent;
        padding: 30px;
        margin-right: 30px;
        background: rgba(27,103,216,0.05);
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        .centerSide-key{
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 40px;
        }
        .value {
          font-size: 32px;
          font-family: Helvetica-Bold, Helvetica;
          font-weight: bold;
          color: #1B67D8;
          line-height: 38px;
        }
        .redNumber {
          height: 46px;
          font-size: 38px;
          font-family: Helvetica-Bold, Helvetica;
          font-weight: bold;
          line-height: 46px;
          color: #f46263;
        }
      }
      .normalBgc {
        background: rgba(27,103,216,0.1);
        border: 1px solid #1B67D8;
      }
    }
    .ea {
      width: 100%;
      position: relative;
      .maxmin {
        width: 100%;
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 40px;
        margin: 30px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;        
        span {
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1B67D8;
        }
      }
      .change-true {
        position: absolute;
        right: 0px;
        height: 50px;
        width: 50px;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 35px;
        }
      }
      .ta-b {
        width: 280px;
        height: 446px;
        z-index: 1000;
        overflow-y: scroll;
        padding: 20px;
        background: #F1F3F6;
        border-radius: 16px;
        position: absolute;
        right: 0px;
        .change {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 10%;
          margin-bottom: 10px;
          img {
            height: 33px;
          }
        }
        .con {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 90%;
        }
        .v{
          width: 70%;
          height: 100%;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 50px;
        }
        .va {
          width: 30%;
          height: 100%;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 50px;
        }
      }
      /deep/ .fm-tab {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
      }
      /deep/ .fm-tab--active {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1B67D8;
      }
    }
  }
}
</style>
