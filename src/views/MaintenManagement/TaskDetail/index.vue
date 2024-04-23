<template>
  <div class="task-map full-width">
    <!-- 导航栏 -->
    <div class="navbar-box">
      <fm-nav-bar
        :title="navbarTitle"
        left-arrow
        @click-left="clickBack"
        @click-right="openPopup"
      >
        <template #right>
          <fm-popover
            :visible.sync="showPopover"
            trigger="click"
            :actions="actions"
            @select="onSelect"
            placement="bottom-end"
          >
            <template #reference>
              <img style="width: 34px" :src="require('@/assets/img/inspection/增加.png')" />
            </template>
          </fm-popover>
        </template>
      </fm-nav-bar>
    </div>
    <!-- 地图 -->
    <xa-map ref="mymap" :create="mapLoaded" :legendConfig="legendConfig"></xa-map>
    <!-- 开始记录与结束记录 -->
    <div class="start-record">
    </div>
    <!-- 数据面板 -->
    <div class="controlCard" v-if="!ifStart">
      <div class="mainContent">
        <div class="contentList" v-for="item of objList" :key="item.name">
          <div class="obj">
            <div class="point"></div>
            <div class="name">{{ taskBizType + item.name }}:</div>
            <div class="num">{{ item.num }}</div>
            <div class="unit">{{ item.unit }}</div>
          </div>
        </div>
      </div>
      <div class="startBtn">
        <div class="btnContent" @click="startInspRecord">开始</div>
      </div>
    </div>
    <div v-else class="controlCard_start">
      <div class="progressControl">
        <img width="24" height="24" class="icon" src="@/assets/img/inspection/管线覆盖率.png" alt />
        <div class="title">进度</div>
        <div :style="styleVar" class="progressWidth">
          <!-- 第二层，计算得到的实际比率宽度 -->
          <div :style="styleVar" class="colorWidth">
            <!-- 第三层，动画 -->
            <div :style="styleVar" class="progressAnimate"></div>
          </div>
        </div>
        <div class="bluePercent">{{ hasMain }}</div>
        <div class="purPercent">{{ '/' + allMain }}</div>
      </div>
      <img
        class="controlBtn"
        :src="require('@/assets/img/maintenance/养护结束按钮.png')"
        @click="endRecord"
      />
    </div>
    <!-- 轨迹显示与定位功能 -->
    <div class="tool-box">
      <div class="location" @click="startLocation">
        <fm-image class="location-image" :src="require('@/assets/img/inspection/location.png')"></fm-image>
      </div>
    </div>
    <!-- 签到框 -->
    <fm-popup
      :visible.sync="signShow"
      :modal="false"
      round
      position="bottom"
      :style="{ height: '48%' }"
    >
      <div class="tab">
        <div
          class="dealName"
          :style="dealBefore ? { 'color': '#1B67D8', 'font-weight': '600' } : {}"
          @click="dealBefore=true"
        >处理前</div>
        <img
          :src="require('@/assets/img/maintenance/----箭头.png')"
          height="7"
          style="margin: auto 14px;"
        />
        <div
          class="dealName"
          :style="!dealBefore ? { 'color': '#1B67D8', 'font-weight': '600' } : {}"
          @click="dealBefore=false"
        >处理后</div>
      </div>
      <div class="popup-view">
        <fm-form ref="signForm" :mode="signForm">
          <div v-show="dealBefore">
            <uploader
              v-if="isShowUpLoader"
              label="处理前照片"
              v-model="attachment"
              @fileChange="fileChangeBefore"
              multiple
              :disabled="hasSignIn"
              :deletable="!hasSignIn"
              :maxImagesCount="2"
              type="image"
              :rules="[{ require: true, message: '请上传照片' }]"
            />
            <!-- <fm-field v-model="temp" name="积泥深度" label="积泥深度" placeholder="请输入" /> -->

            <fm-field label="备注" type="textarea" :disabled="hasSignIn" placehold="请输入" v-model="signForm.remarks"></fm-field>
          </div>
          <div v-show="!dealBefore">
            <fm-field label="请确认本次养护内容" />
            <fm-field name="checkboxGroup">
              <template #input>
                <fm-checkbox-group v-model="checkboxGroup" :disabled="hasSignIn" direction="vertical" @change="changeCheckBox">
                  <fm-checkbox :name="it.name" v-for="it of maintenContentsList" :key="it.code" shape="square">{{ it.name }}</fm-checkbox>
                </fm-checkbox-group>
              </template>
            </fm-field>
            <uploader
              v-if="isShowUpLoader"
              label="处理后照片"
              v-model="attachment1"
              @fileChange="fileChangeAfter"
              multiple
              :disabled="hasSignIn"
              :deletable="!hasSignIn"
              :maxImagesCount="2"
              type="image"
              :rules="[{ require: true, message: '请上传照片' }]"
            />

            <fm-field type="textarea" input-align="right" v-model="signForm.maintainType" :disabled="hasSignIn" name="养护方式" label="养护方式" autosize placeholder="请输入" />
            <fm-field type="number" input-align="right" v-if="signShow && currentSelectDev.properties.deviceType == '管线' && (currentSelectDev.properties.bizType == '污水' || currentSelectDev.properties.bizType == '雨水')" v-model="signForm.sedimentDepth" :disabled="hasSignIn" name="清理淤泥" label="清理淤泥(m3)" placeholder="请输入" />
          </div>
        </fm-form>
      </div>
      <div class="btnArea" v-show="!hasSignIn && dealBefore">
        <fm-button class="btn1" @click="onCancel" round type="default">取消</fm-button>
        <fm-button class="btn2" @click="dealBefore=false" round type="primary">下一步</fm-button>
      </div>
      <div class="btnArea" v-show="!hasSignIn && !dealBefore">
        <fm-button class="btn1" @click="dealBefore=true" round type="default">上一步</fm-button>
        <fm-button class="btn2" @click="onConfirm" round type="primary">提交</fm-button>
      </div>
      <div class="btnArea" v-show="hasSignIn">
        <fm-button class="btn" @click="onCancel" round type="default">关闭</fm-button>
      </div>
    </fm-popup>
    <!-- 养护列表 -->
    <div class="arrow-up" :style="mainListStyle">
      <i
        class="fm-icon"
        id="arrowUp"
        :class="mainListStyle['--top'] == (clientY - 24) ? 'fm-icon-arrow-up' : 'fm-icon-minus'"
      ></i>
      <div class="content">
        <fm-tabs v-model="active" swipeable style="height: 100%">
          <fm-tab :label="'未完成' + '(' + maintenObj.isNotMain.length + ')'">
            <div class="contentArea">
              <div style="overflow-x: scroll;">
                <div class="buttonArea" :style="buttonAreaStyle">
                  <fm-button
                    round
                    v-for="it of buttonList"
                    :key="it"
                    class="button"
                    :style="currentSeleIsNotMainType == it ? { 'color': '#1B67D8', 'background': '#DDE8F9' } : {}"
                    @click="filterIsNotMainList(it)"
                  >{{ it }}</fm-button>
                </div>
              </div>
              <div class="listArea">
                <fm-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <div v-for="(it, idx) of maintenObj.isNotMain" :key="it.id" class="list">
                    <div class="list_num">{{ idx + 1 }}</div>
                    <div class="list_type">{{ it.deviceType || '' }}</div>
                    <div class="list_id">{{ it.deviceId || '' }}</div>
                    <div class="list_deal" @click="goToDeal(it)">
                      去处理
                      <img
                        width="24"
                        height="24"
                        style="margin: auto 0 auto 4px;"
                        :src="require('@/assets/img/maintenance/deal.png')"
                      />
                    </div>
                  </div>
                </fm-list>
              </div>
            </div>
          </fm-tab>
          <fm-tab label="已完成">
            <div class="contentArea">
              <div style="overflow-x: scroll;">
                <div class="buttonArea" :style="buttonAreaStyle">
                  <fm-button
                    round
                    v-for="it of buttonList"
                    :key="it"
                    class="button"
                    :style="currentSeleIsMainType == it ? { 'color': '#1B67D8', 'background': '#DDE8F9' } : {}"
                    @click="filterIsMainList(it)"
                  >{{ it }}</fm-button>
                </div>
              </div>
              <div class="listArea">
                <fm-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <div v-for="(it, idx) of maintenObj.isMain" :key="it.id" class="list">
                    <div class="list_num">{{ idx + 1 }}</div>
                    <div class="list_type">{{ it.deviceType || '' }}</div>
                    <div class="list_id">{{ it.deviceId || '' }}</div>
                    <div class="list_deal" @click="goToDeal(it)">
                      定位
                      <!-- <img width="24" height="24" style="margin: auto 0 auto 4px;" :src="require('@/assets/img/maintenance/deal.png')" /> -->
                    </div>
                  </div>
                </fm-list>
              </div>
            </div>
          </fm-tab>
        </fm-tabs>
      </div>
    </div>
    <fm-popup
      :visible.sync="noticeShow"
      :close-on-click-modal="false"
      round
      position="bottom"
      :style="{ height: '68%' }"
    >
      <div class="noticeBody">
        <div class="noticeTitle">安全须知</div>
        <div class="noticeContent">
          <h5>第一节  有限空间作业</h5>
          <h6>(1) 作业标准</h6>
          <p>1、直径小于800mm的管线，高度小于800mm的方沟，以及截面积小于0.5M²的有限空间禁止人员进入。液面深度大于50cm，流速大于0.5m/s的有限空间内禁止人员作业。</p>
          <p>2、进入有害气体浓度超标及缺氧的有限空间作业，必须加强通风，符合要求后施工人员必须佩戴长管呼吸器。</p>
          <p>3、当可燃气（CH4）浓度超标时，必须采取强制通风措施，可燃气体浓度降至5%LEL以下时，方可作业。</p>
          <p>4、有限空间或内部井下空间作业均按照有限空间作业标准实施。</p>
          <h6>(2) 作业要求</h6>
          <p>1、使用气体检测仪，须在有限空间外的洁净气体中开机，并运行5 分钟进行自动标定后，方可进行检测。</p>
          <p>2、禁止在存在有害气体的设施5m 半径范围内，吸烟、动用明火、使用电气焊，禁止携带易燃易爆品进入有限空间。</p>
          <p>3、当有限空间内气体检测可燃气超标、存在燃烧、爆炸危险时，下井人员不得穿易产生静电的衣物，不得携带使用易产生火花的工具。并对下井作业的安全装备进行仔细检查。</p>
          <p>4、作业时，井口有人值守，队内安排安全员在井上，下井作业人员佩戴长管呼吸器，腰间系绳索以备万一。</p>
          <p>5、在整个施工过程中不间断地进行有毒有害气体检测工作，如发现异常情况立即通知井下作业人员撤离现场。为避免有毒有害气体对施工人员安全造成伤害，施工过程中风机排风处理不能间断。</p>
          <p>6、必须遵守有限空间作业的相关管理规定。</p>
          <h6>(3) 职责</h6>
          <p>1、作业负责人职责：应了解整个作业过程中存在的危险危害因素；确认作业环境、作业程序、防护设施、作业人员符合要求后，授权批准作业；及时掌握作业过程中可能发生的条件变化，当有限空间作业条件不符合安全要求时，终止作业。</p>
          <p>2、作业者职责：应接受有限空间作业安全生产培训；遵守有限空间作业安全操作规程，正确使用有限空间作业安全设施与个人防护用品；应与监护者进行有效的操作作业、报警、撤离等信息沟通。</p>
          <p>3、监护者职责：应接受有限空间作业安全生产培训；全过程掌握作业者作业期间情况，保证在有限空间外持续监护，能够与作业者进行有效的操作作业、报警、撤离等信息沟通；在紧急情况时向作业者发出撤离警告，必要时立即呼叫应急救援服务，并在有限空间外实施紧急救援工作；防止未经授权的人员进入。</p>
          <h6>(4) 作业防护设备与使用</h6>
          <p>1、从事有限空间危险作业现场必须配备“四合一”气体检测仪，在有限空间外对有限空间内的主要有害气体浓度进行实时监测。检测仪器须定期检定、维护，确保灵敏、有效。</p>
          <p>2、地下有限空间作业环境存在爆炸危险的，电气设备、照明用具等应满足防爆要求。</p>
          <p>3、地下有限空间临时用电应符合GB/T13869 的规定。</p>
          <p>4、手持照明电压应不大于24v，在积水、结露的地下有限空间作业，手持照明电压应不大于12v。</p>
          <p>5、从事有限空间危险作业的人员须佩戴安全帽、全身式安全带及安全绳。</p>
          <p>6、当有限空间作业时，作业人员必须佩戴长管呼吸器或正压隔绝式空气呼吸器。</p>
          <p>7、进入有限空间作业前，应先打开相邻的检查井井盖或通风口,自然通风不少于30 分钟，并使用“四合一”气体检测仪，在有限空间外对设施内的主要有害气体浓度进行检测，确定人员进入所需防护用品；人员进入后必须进行不间断气体监测。</p>
          <h5>第二节  占道作业</h5>
          <p>1、作业人员服装颜色应当符合国家相关标准要求，具备反光或部分反光性能；安全服反光部分最小宽度不应小于5 厘米。</p>
          <p>2、用于维护占道作业现场安全的保护车辆，应当喷涂符合国家相关标准的反光油漆，或粘贴规定颜色的工程级以上的反光膜并保持表面清洁；车辆顶部必须配置黄色爆闪警示灯，车辆护栏上应配置闪光箭头板，以上灯具占道作业时必须开启，保证各个方向至少100 米以外清晰可见。</p>
          <p>3、占道作业交通安全设施的种类及设置要求应符合现行行业标准《道路作业交通安全标志》GA182 及地方标准的规定。</p>
          <p>4、在道路上执行排水设施相关作业并可能影响道路交通安全、畅通地占用道路行为，由作业班组根据公安交通管理部门要求（参照《影响交通安全的占道施工许可工作规范》）编制占道审批材料，报公司相应业务管理人员，由业务管理人员审核后报公安交通管理部门审批，审批通过后返回作业班组，由作业班组报道路所属区交通支队备案。</p>
          <p>5、公司从事占道作业的人员必须接受公司安全监督管理人员组织的安全技术培训，掌握作业程序、人工急救和交通安全防护设施、警示灯具的操作方法。公司占道作业人员每年进行不少于4 学时的占道作业安全教育和专业技术培训，并建立安全培训档案。每次组织开展占道作业，作业人数应不少于三人，其中至少一人负责现场交通疏导工作。</p>
          <p>6、实施占道作业前，必须由负责该项作业的管理人员根据占道作业方案对作业人员进行书面交底，告知作业内容、安全注意事项及采取的安全措施，并由管理人员、班组长和作业人员签字确认。</p>
        </div>
        <div class="noticeBtnArea">
          <fm-button class="noticeBtn" :style="{ 'background': hasKnow ? '#1B67D8' : '#999999' }" round :disabled="!hasKnow" @click="startMainWork">{{ hasKnow ? '已了解' : '已了解' + '(' + continueTime + 's)' }}</fm-button>
        </div>
      </div>
    </fm-popup>

    <!-- 提示层 -->
    <div v-show="ifTips" class="tip-tools">
      <img :src="require('@/assets/img/tips.png')" class="tipImg" />
      <div class="context">请在地图上选择设施或者点位</div>
    </div>
    <fm-overlay :show="ifLeaveTask" z-index="4">
      <div class="confirm-tip">
        <div class="content">
          <div class="icon">
            <img :src="require('@/assets/img/inspection/终止.png')" width="60" style="margin: auto" />
          </div>
          <div class="info">
            <span>{{ '当前为养护状态，继续退出会暂停养护，请确定是否退出?' }}</span>
          </div>
        </div>
        <div class="confirm_btn">
          <div class="btn1 btn2" @click="cancelLeave">取消</div>
          <div class="btn1" @click="confirmLeave">退出</div>
        </div>
      </div>
    </fm-overlay>
  </div>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import MapComp from '@/views/inspectMap/index.vue'
import * as api from '../api'
import { Toast, Dialog } from 'fawkes-mobile-lib'
import * as turf from '@turf/turf'
import Uploader from '@/components/upload/Uploader.vue'
import addImgToMap from '../utils/setIcon.js'
import Vue from 'vue';
import Popup from '../../inspectMap/components/popup.vue'
const PopupItem = Vue.extend(Popup)
const mapObj = {
  map: null,
  mapInstance: null,
}
const currentMainPoint = {
  isMain: [],
  isNotMain: [],
  isMainBack: [], // 未整改的
}
export default {
  name: 'mainten-task',
  components: {
    MapComp,
    Uploader
  },
  data() {
    return {
      legendConfig: [],
      hasListen: false,
      ifLeaveTask: false,
      toast: null,
      maintenRangeList: [],
      taskData: null,
      progress: '',
      hasKnow: false,
      continueTime: 10,
      noticeShow: false,
      maintainBeforeImage: [],
      maintainAfterImage: [],
      currentSelectDev: null,
      maintenContentsList: [],
      currentSeleIsMainType: '全部',
      currentSeleIsNotMainType: '全部',
      maintenObj: {
        isMain: [],
        isNotMain: [],
        isMainBack: [], // 未整改的
      },
      loading: false,
      finished: false,
      // buttonList: ['全部', '雨水口'],
      mainListStyle: {
        '--top': document.body.clientHeight - 24 + 'px',
        '--heigth': '24px',
      },
      checkboxGroup: [],
      dealBefore: true,
      temp: '',
      mapLoad: false,
      hasMain: 0,
      allMain: 0,
      ifStart: false,
      styleVar: {
        '--totalWidth': '148px',
        '--barWidth': '100px',
        '--colorBlue': 'blue',
      },
      objList: [],
      taskBizType: '',
      ifTips: false,
      reportDataIsLoaded: false,
      // 巡检任务下所有巡检管线
      allTaskLines: [],
      isView: true,
      active: 0,
      deviceName: '',
      hasSignIn: false,
      showPopover: false,
      actions: [
        {
          text: '问题上报',
        },
        // {
        //   text: '设施缺陷',
        // },
      ],
      currentRate: 0,
      // 控制关键点列表显隐
      pointListShow: false,
      // 全局发声函数
      // 记录开始巡检的时间，用于判断是否在开始巡检的10s内
      startRecordTimer: '',
      recordButtonLoading: false,
      navbarTitle: '日常任务',
      // 上报失败的巡检轨迹点位数组
      reportFailTrackPoints: [],
      isShowRoute: true,
      inspBusinessType: '',
      recordData: [],
      // 当前巡检员所处位置
      currentPosition: null,
      lines: [],
      ifRecording: false,
      selectEventType: false,
      eventTypeList: [],
      signShow: false,
      attachment: '',
      attachment1: '',
      signForm: {
        maintainImagesList: [],
        remarks: '',
        maintainType: '',
        content: '',
        sedimentDepth: ''
      },
      taskDetail: {
        coverage: '0/0',
        reportRate: '0/0',
        planEndTime: '',
      },
      engInfoDTO: {},
      taskRestTime: 0,
      reportFooterShow: false,
      feature: {},
      taskData: {},
      // 用于地图中显示范围和关键点
      inspRangeList: [],
      rangeList: [],
      keyDetailList: [],
      isRunList: [
        {
          name: '正常',
          value: '1',
        },
        {
          name: '异常',
          value: '0',
        },
      ],
      reportChose: [
        {
          name: '问题上报',
          value: '问题上报',
        },
        {
          name: '新增缺陷',
          value: '新增缺陷',
        },
        {
          name: '无需上报',
          value: '无需上报',
        },
      ],
      rules: {},
      previewURL: '/sys-storage/download_image?f8s=',
      upimgPreview: [],
      headers: {},
      url: {
        // 本页面使用到的url
        uploadFile: 'sys-storage/upload',
        findFile: 'ecidi-cmp/file/cmpFileGroup/findFilesByGroupId',
      },
      pollingFlag: false,
      pollingGapTime: 3,
      trackPointList: [],
      trackPointTimeList: [],
      overSpeedTrackLineList: [],
      trackLocation_start: '',
      trackLocation_end: '',
      showVisible: false,
      isMask: false, //是否显示遮罩层
      reportShow: false, // 问题上报面板显示
      accessToken: this.$storage.get('access_token'),
      header: {},
      formToken: '',
      // 问题上报list
      problemDataList1: [],
      // 设施缺陷list
      problemDataList2: [],
      // 是否重新渲染图片上传组件
      isShowUpLoader: false,
    }
  },
  computed: {
    maintenContents() {
      console.log(this.$store.state.enum['mainContents'])
      return this.$store.state.enum['mainContents']
    },
    buttonList() {
      return ['全部'].concat(JSON.parse(this.$route.query.data).maintainContent.split(','))
    },
    buttonAreaStyle() {
      return {
        '--width': this.buttonList.length * (80 + 10) + 'px',
      }
    },
    clientY() {
      return document.body.clientHeight
    }
  },
  watch: {
    progress(val) {
      this.hasMain = val.split('/')[0]
      this.allMain = val.split('/')[1]
      this.styleVar['--barWidth'] = parseInt(148 * (this.hasMain / this.allMain)) + 'px'
    }
  },
  mounted() {
    this.toast = Toast.loading({
      message: '加载中',
      duration: 0,
      forbidClick: true,
      loadingType: 'spinner'
    })
    this.taskData = JSON.parse(this.$route.query.data)
    console.log("当前任务详情", JSON.parse(this.$route.query.data))
    this.isView = this.$route.query.isView
    this.progress = this.taskData.progress
    this.navbarTitle = '养护任务'
    this.getMainTaskObj()
    this.getMainDevPoint()
    this.getWpgToken()
    let that = this
    let elem = document.querySelector('#arrowUp')
    elem.addEventListener('touchstart', (e) => {
      let evt = e || window.event
      let touch = evt.targetTouches[0]
      let clientHeight = document.body.clientHeight
      let clientY = touch.clientY
      if (clientY >= clientHeight * 0.4 && clientY <= clientHeight - 24) {
        that.mainListStyle['--top'] = clientY + 'px'
        that.mainListStyle['--height'] = clientHeight - clientY - 24 + 'px'
      }
      // document.addEventListener('touchmove', e => { e.preventDefault() }, false)
    })
    elem.addEventListener('touchmove', (e) => {
      let evt = e || window.event
      let touch = evt.targetTouches[0]
      let clientHeight = document.body.clientHeight
      let clientY = touch.clientY
      if (clientY >= clientHeight * 0.4 && clientY <= clientHeight - 24) {
        that.mainListStyle['--top'] = clientY + 'px'
        that.mainListStyle['--height'] = clientHeight - clientY - 24 + 'px'
      }
    })
  },
  beforeDestroy() {
    Toast.clear()
  },
  methods: {
    getGridRange() {
      api.getGridRange({
        pageNum: 1,
        pageSize: 999
      }).then(res => {
        if (res.status) {
          let feats = []
          this.maintenRangeList = res.data.list.filter(it => it.inspGrid.id == this.taskData.gridId)
          let coordList = []
          this.maintenRangeList.length > 0 && this.maintenRangeList[0].detailList.forEach(it => {
            coordList.push(JSON.parse(it.gridGeom).coordinates)
          })
          this.toMainRange(coordList)
          this.maintenRangeList.length > 0 && this.maintenRangeList[0].detailList.forEach(it => {
            feats.push({
              type: 'Feature',
              geometry: JSON.parse(it.gridGeom)
            })
          })
          this.setSourceData('mainRangeSource', {
            type: 'FeatureCollection',
            features: feats
          })
        }
      })
    },
    getMainRangeById(ids) {
      this.maintenRangeList = []
      Promise.all(ids.split(',').map(id => api.getMainRangeById({ id }))).then(reses => {
        reses.forEach(res => {
          if (res.status) {
            this.maintenRangeList.push(...res.data.maintainRangeChildList)
          }
        })
        let coordList = []
        this.maintenRangeList.length > 0 && this.maintenRangeList.forEach(it => {
          coordList.push(JSON.parse(it.geom).coordinates)
        })
        this.toMainRange(coordList)
        let feats = []
        this.maintenRangeList.length > 0 && this.maintenRangeList.forEach(it => {
          feats.push({
            type: 'Feature',
            geometry: JSON.parse(it.geom)
          })
        })
        this.setSourceData('mainRangeSource', {
          type: 'FeatureCollection',
          features: feats
        })
      })
    },
    toMainRange(coordList) {
      let polygonList = coordList.map(it => turf.polygon(it))
      let bbox = turf.bbox({
        type:"FeatureCollection",
        features: polygonList
      });
      let timer = setInterval(() => {
        if (mapObj.map) {
          clearInterval(timer)
          mapObj.map.fitBounds(bbox, {
            padding: {top: 10, bottom:25, left: 15, right: 5}
          });
        }
      }, 500)
    },
    changeCheckBox(val) {
      this.signForm.content = val.join(',')
    },
    goToDeal(obj) {
      if (obj.startLongitude && obj.startLatitude) {
        this.mainListStyle['--top'] = document.body.clientHeight - 24 + 'px'
        this.mainListStyle['--height'] = '24px'
        if (obj.deviceType == '管线') {
          let point1 = turf.point([obj.startLongitude, obj.startLatitude])
          let point2 = turf.point([obj.endLongitude, obj.endLatitude])
          let midpoint = turf.midpoint(point1, point2)
          this.flyToPoint(midpoint.geometry.coordinates)
        } else {
          this.flyToPoint([obj.startLongitude, obj.startLatitude])
        }
      } else {
        Toast.warning({
          message: '当前设施无地理坐标信息',
          duration: 2000
        })
        return
      }
    },
    filterIsMainList(it) {
      this.currentSeleIsMainType = it
      if (it == '全部') {
        this.maintenObj.isMain = currentMainPoint.isMain
      } else {
        this.maintenObj.isMain = currentMainPoint.isMain.filter(
          (item) => item.deviceType == it
        )
      }
    },
    filterIsNotMainList(it) {
      this.currentSeleIsNotMainType = it
      if (it == '全部') {
        this.maintenObj.isNotMain = currentMainPoint.isNotMain
      } else {
        this.maintenObj.isNotMain = currentMainPoint.isNotMain.filter(
          (item) => item.deviceType == it
        )
      }
    },
    onLoad() {},
    addMainSourceLayer() {
      mapObj.map.addSource('mainRangeSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addSource('mainDevPointSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addSource('mainDevLineSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addSource('pickMainDevLineSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addSource('pickMainDevPointSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      // mapObj.map.addLayer({
      //   id: 'mainRangeFillLayer',
      //   type: 'fill',
      //   source: 'mainRangeSource',
      //   paint: {
      //     'fill-color': '#32C5FF',
      //     'fill-opacity': 0.3,
      //   },
      // })
      mapObj.map.addLayer({
        id: 'mainRangeLineLayer',
        type: 'line',
        source: 'mainRangeSource',
        paint: {
          'line-opacity': 1,
          'line-width': 1.5,
          'line-color': '#32C5FF',
          'line-dasharray': [4, 4],
        },
      })
      mapObj.map.addLayer(
        {
          id: 'mainDevPipeLayer',
          type: 'line',
          source: 'mainDevLineSource',
          paint: {
            'line-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              10,
              0.8,
              15.5,
              0.5,
              17,
              0.2,
            ],
            'line-width': 4,
            'line-color': [
              'match',
              ['get', 'isMain'],
              'true',
              '#2dc34d',
              'false',
              '#ffd141',
              'backMain',
              '#ff0000',
              '#ffd141'
            ]
          }
        },
        'rd_map_outfall'
      )
      mapObj.map.addLayer(
        {
          id: 'pickMainDevPipeLayer',
          type: 'line',
          source: 'pickMainDevLineSource',
          paint: {
            'line-opacity': 1,
            'line-width': 6,
            'line-color': [
              'match',
              ['get', 'isMain'],
              'true',
              '#2dc34d',
              'false',
              '#ffd141',
              'backMain',
              '#ff0000',
              '#ffd141'
            ]
          }
        },
        'rd_map_outfall'
      )
      mapObj.map.addLayer(
        {
          id: 'mainDevPointLayer',
          type: 'circle',
          source: 'mainDevPointSource',
          paint: {
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              15.3,
              0.8,
              16.4,
              0.7,
              17.5,
              0.5,
            ],
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12.5,
              5,
              17,
              10,
            ],
            'circle-color': [
              'match',
              ['get', 'isMain'],
              'true',
              '#2dc34d',
              'false',
              '#ffd141',
              'backMain',
              '#ff0000',
              '#ffd141'
            ]
          }
        },
        'map_supply_pump'
      )
      mapObj.map.addLayer(
        {
          id: 'pickMainDevPointLayer',
          type: 'circle',
          source: 'pickMainDevPointSource',
          paint: {
            'circle-opacity': 1,
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12.5,
              10,
              17,
              15,
            ],
            'circle-color': [
              'match',
              ['get', 'isMain'],
              'true',
              '#2dc34d',
              'false',
              '#ffd141',
              'backMain',
              '#ff0000',
              '#ffd141'
            ]
          }
        },
        'map_supply_pump'
      )
      mapObj.map.on('mouseover', 'mainDevPipeLayer', () => {
        mapObj.map.getCanvas().style.cursor = 'pointer'
      })
      mapObj.map.on('mouseover', 'mainDevPointLayer', () => {
        mapObj.map.getCanvas().style.cursor = 'pointer'
      })
      mapObj.map.on('mouseout', 'mainDevPipeLayer', () => {
        mapObj.map.getCanvas().style.cursor = ''
      })
      mapObj.map.on('mouseout', 'mainDevPointLayer', () => {
        mapObj.map.getCanvas().style.cursor = ''
      })
      mapObj.map.on('click', 'mainDevPipeLayer', this.mainDetailInfo)
      mapObj.map.on('click', 'mainDevPointLayer', this.mainDetailInfo)
    },
    addMainUserSourceLayer() {
      mapObj.map.addSource("mainUser", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      mapObj.map.addLayer({
        id: "mainUserLayer",
        type: "symbol",
        source: "mainUser",
        layout: {
          "icon-image": "userInsp",
          "icon-size": 0.2,
          "icon-allow-overlap": true, //自动避让属性
          "icon-ignore-placement": true
        }
      });
    },
    // 添加缓冲区的图层
    addBufferLayer() {
      mapObj.map.addSource('buffered', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addLayer(
        {
          id: 'bufferLayer',
          type: 'fill',
          source: 'buffered',
          paint: {
            'fill-color': '#FFB6C1',
            'fill-opacity': 0.5,
          },
        },
        'rd_map_drainpipe_ys_big_direction'
      )
    },
    // 画半径为radius的圆范围
    drawBuffer(point, radius = 0.035) {
      let buffered = turf.buffer(point, radius, { unit: 'kilometers' })
      this.setSourceData('buffered', {
        type: 'FeatureCollection',
        features: [buffered],
      })
    },
    mainDetailInfo(e) {
      this.signShow = false // 签到面板不显示
      // 照片上传组件不显示
      this.isShowUpLoader = false
      // 每一次点击时，都将养护面板的tab切换到养护前的状态
      this.dealBefore = true
      let feats = mapObj.map.queryRenderedFeatures(e.point, {
        layers: ['mainDevPipeLayer', 'mainDevPointLayer']
      })
      console.log('--------------------------------------', feats[0].properties);
      if (!this.ifStart && feats[0].properties.isMain == 'true') {
      } else if(!this.ifStart) { // 任务未开始
        Toast.warning({
          message: '任务未开始，无法养护',
          duration: 2000
        })
        // 未开始任务时，点击未养护点，不显示养护面板
        this.signShow = false
        return
      }
      // isMain != 'true'，表示点击的不是已养护（绿色）状态的点，而是未完成（黄色）、未整改（红色）的点
      if (this.ifStart && feats[0].properties.isMain != 'true') { // 任务已开始并且是未养护状态
        // 利用feature来判断是否处于35m范围内，如果处于，可以进行签到，否则不能进行签到
        const position = this.currentPosition
        if (!position) {
          Toast.warning({
            message: '获取不到巡检人位置',
            duration: 2000,
          })
          return
        }
        this.drawBuffer(feats[0].geometry)
        const coord = [
          parseFloat(position.longitude),
          parseFloat(position.latitude),
        ]
        console.log(feats[0])
        const point = turf.point(coord)
        const engGeom = feats[0].geometry
        const buffered = turf.buffer(engGeom, 0.035, { unit: 'kilometers' })
        const isInBuffer = turf.inside(point, buffered)
        if (!isInBuffer) {
          Toast({
            message: '未处于该关键点范围内',
            duration: 2000,
          })
          return
        }
      }
      this.maintenContentsList = []
      this.currentSelectDev = feats[0]
      if (feats[0].properties.deviceType == '检查井' && (feats[0].properties.bizType == '污水' || feats[0].properties.bizType == '雨水')) {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '污水检查井')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else if (feats[0].properties.deviceType == '管线' && (feats[0].properties.bizType == '污水' || feats[0].properties.bizType == '雨水')) {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '排水管道')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else if (feats[0].properties.deviceType == '雨水口') {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '雨水口')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else if (feats[0].properties.deviceType == '管线' && (feats[0].properties.bizType == '配水' || feats[0].properties.bizType == '原水' || feats[0].properties.bizType == '输水')) {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '供水管道')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else if (feats[0].properties.deviceType == '阀门') {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '阀门')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else if (feats[0].properties.deviceType == '消防栓') {
        let arr = this.maintenContents.filter(it => it['zh-CN'] == '消防栓')
        arr[0].child.forEach(item => {
          this.maintenContentsList.push({
            name: item['zh-CN'],
            value: item.code
          })
        })
      } else {
        this.maintenContentsList = []
      }
      // 已养护或者养护并通过的点
      if (feats[0].properties.isMain == 'true') {
        this.hasSignIn = true
        api.getMainDetailInfo({
          devType: feats[0].properties.deviceType,
          devId: feats[0].properties.id,
          taskId: this.$route.query.taskId
        }).then(res => {
          if (res.status && res.data.length > 0) {
            let lastRecord = res.data[res.data.length - 1] // 最后一条记录
            this.signForm.remarks = lastRecord.remarks
            this.signForm.maintainType = lastRecord.maintainType
            this.signForm.sedimentDepth = lastRecord.sedimentDepth
            this.signForm.content = lastRecord.content
            this.checkboxGroup = lastRecord.content.split(',')
            this.maintainBeforeImage = lastRecord.maintainImagesList.filter(it => it.stage == 0)
            this.attachment = this.maintainBeforeImage[0]?.imagesToken
            this.maintainAfterImage = lastRecord.maintainImagesList.filter(it => it.stage == 1)
            this.attachment1 = this.maintainAfterImage[0]?.imagesToken
            this.$nextTick(() => {
              this.signShow = true // 签到面板显示
              this.isShowUpLoader = true
            })
          }
        })
        // 未养护或者已退回的点
      } else {
        this.hasSignIn = false
        this.signForm.remarks = ''
        this.signForm.maintainType = ''
        this.signForm.sedimentDepth = ''
        this.signForm.content = ''
        this.checkboxGroup = []
        this.maintainBeforeImage = []
        this.attachment = ''
        this.maintainAfterImage = []
        this.attachment1 = ''
        this.$nextTick(() => {
          this.signShow = true // 签到面板显示
          this.isShowUpLoader = true
        })
      }
    },
    // 深拷贝
    deepClone(data) {
      return JSON.parse(JSON.stringify(data))
    },
    getMainDevPoint() {
      this.loading = true
      if (!this.toast) {
        this.toast = Toast.loading({
          message: '加载中',
          duration: 0,
          forbidClick: true,
          loadingType: 'spinner'
        })
      }
      api
        .getMainDevPoint({ taskId: this.$route.query.taskId })
        .then((res) => {
          if (res.status) {
            let mainPipeFeatures = []
            let mainDevFeatures = []

            // 养护状态（0:未完成,1:待审核,2:已通过,3:未整改,4:已整改,5:已审核）【未完成】-黄色、【待审核、已整改】-橙色、【已通过、已审核】-绿色、【未整改】-红色
            // res.data = {
            //   "unCheck": [], // 未完成 0
            //   "check": [], // 待审核 1
            //   "pass": [], // 已通过 2
            //   "notRectified": [], // 未整改 3
            //   "rectified": [], // 已整改 4
            //   "audited": [], // 已审核 5
            // }

            // 统一显示成已完成状态：待审核、已通过、已整改、已审核
            currentMainPoint.isMain = [...res.data.check, ...res.data.pass, ...res.data.rectified, ...res.data.audited]
            currentMainPoint.isNotMain = res.data.unCheck // 未完成的
            currentMainPoint.isMainBack = res.data.notRectified // 未整改的
            this.maintenObj = this.deepClone(currentMainPoint)
            // 已完成的
            currentMainPoint.isMain.forEach((it) => {
              if (it.deviceType == '管线') {
                mainPipeFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [it.startLongitude, it.startLatitude],
                      [it.endLongitude, it.endLatitude],
                    ],
                  },
                  properties: Object.assign({ isMain: 'true' }, it),
                })
              } else {
                mainDevFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [it.startLongitude, it.startLatitude],
                  },
                  properties: Object.assign({ isMain: 'true' }, it),
                })
              }
            })
            // 未完成的
            currentMainPoint.isNotMain.forEach((it) => {
              if (it.deviceType == '管线') {
                mainPipeFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [it.startLongitude, it.startLatitude],
                      [it.endLongitude, it.endLatitude],
                    ],
                  },
                  properties: Object.assign({ isMain: 'false' }, it),
                })
              } else {
                mainDevFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [it.startLongitude, it.startLatitude],
                  },
                  properties: Object.assign({ isMain: 'false' }, it),
                })
              }
            })
            // 未整改的
            currentMainPoint.isMainBack.forEach((it) => {
              if (it.deviceType == '管线') {
                mainPipeFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [it.startLongitude, it.startLatitude],
                      [it.endLongitude, it.endLatitude],
                    ],
                  },
                  properties: Object.assign({ isMain: 'backMain' }, it),
                })
              } else {
                mainDevFeatures.push({
                  id: it.id,
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [it.startLongitude, it.startLatitude],
                  },
                  properties: Object.assign({ isMain: 'backMain' }, it),
                })
              }
            })
            this.setMainDevLayerFeatures(mainDevFeatures, mainPipeFeatures)
          }
        })
        .finally(() => {
          this.loading = false
          this.toast && this.toast.clear()
          this.toast = null
          this.finished = true
        })
    },
    setMainRangeData(data) {
      let that = this
      let rangeData = []
      data.forEach((it) => {
        rangeData.push({
          type: 'Feature',
          geometry: JSON.parse(it.geom),
        })
      })
      let timer = setInterval(() => {
        if (that.mapLoad && mapObj.map.getSource('mainRangeSource')) {
          clearInterval(timer)
          that.setSourceData('mainRangeSource', {
            type: 'FeatureCollection',
            features: rangeData,
          })
        }
      }, 100)
    },
    setMainDevLayerFeatures(devFeats, pipeFeats) {
      let that = this
      let timer = setInterval(() => {
        if (that.mapLoad && mapObj.map.getSource('mainDevPointSource')) {
          clearInterval(timer)
          that.setSourceData('mainDevPointSource', {
            type: 'FeatureCollection',
            features: devFeats,
          })
        }
        if (that.mapLoad && mapObj.map.getSource('mainDevLineSource')) {
          clearInterval(timer)
          that.setSourceData('mainDevLineSource', {
            type: 'FeatureCollection',
            features: pipeFeats,
          })
        }
      }, 100)
    },
    setSourceData(sourceId, data) {
      if (mapObj.map.getSource(sourceId)) {
        mapObj.map.getSource(sourceId).setData(data)
      }
    },
    getMainTaskObj() {
      let that = this
      api
        .getMainTask({ id: that.$route.query.taskId })
        .then((res) => {
          if (res.status) {
            that.taskBizType = res.data.bizType
            res.data.maintainPlanContent.records.forEach((it) => {
              that.objList.push({
                name: it.deviceType,
                num: it.num || 0,
                unit: it.unit || '',
              })
            })
          }
        })
        .finally(() => {
          let timer = setInterval(() => {
            if (that.mapLoad) {
              that.legendConfig = [
                {
                  label: '污水',
                  clickFlag: this.taskBizType.includes('污水') ? true : false
                },
                {
                  label: '雨水',
                  clickFlag: this.taskBizType.includes('雨水') ? true : false
                },
                {
                  label: '供水',
                  clickFlag: this.taskBizType.includes('供水') ? true : false
                },
                {
                  label: '再生水',
                  clickFlag: this.taskBizType.includes('再生水') ? true : false
                }
              ];
              clearInterval(timer)
            }
          }, 500)
        })
    },
    // 获取问题上报和设施缺陷数据
    getWpgToken() {
      // 获取header，查询工单用
      axios({
        url: process.env.VUE_APP_WPG_URL + '/main/userCenterApi/sso/tokenByToken',
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
        }
      })
    },
    // 问题上报(smallType: 'abnormal_inform')、设施缺陷(smallType: "defect")使用同一接口
    async getProblemDataList(params) {
      this.problemDataList1 = []
      this.problemDataList2 = []

      let commonParams = Object.assign(
        {
          sysCode: 'outwork',
          token: this.accessToken,
          page: {
            current: 1,
            size: 99999, // 查全部
          },
        },
        params
      )
      // 问题上报
      let params1 = {
        ...commonParams,
        smallType: 'abnormal_inform',
      }
      // 设施缺陷
      let params2 = {
        ...commonParams,
        smallType: 'defect',
      }
      let problemPointFeatures = []
      // 问题上报
      await this.getAxiosData(params1, this.problemDataList1)
      // 设施缺陷
      await this.getAxiosData(params2, this.problemDataList2)
      let allProblem = this.problemDataList1.concat(this.problemDataList2)
      allProblem.forEach((it) => {
        problemPointFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: it.lnglat,
          },
          properties: {
            id: it.id,
            title: it.title,
          },
        })
      })
      this.$refs.mymap.addInspEventLayer(problemPointFeatures)
      this.reportDataIsLoaded = true
    },
    getAxiosData(params, problemDataList) {
      return new Promise((resolve, reject) => {
        axios({
          url:
            process.env.VUE_APP_THIRD_REQUEST_URL +
            '/main/outworkapi/ticketStatisticClient/getTicketList',
          method: 'post',
          data: params,
          headers: this.header,
        }).then((res) => {
          if (res.status == 200) {
            res.data.resultData.records.forEach((item) => {
              problemDataList.push({
                id: item.id, // 工单ID
                title: item.title, // 工单标题
                ticketStatusName: item.ticketStatusName,
                handleType: item.formValue.handleType, // 描述
                createByName: item.createByName, // 创建人
                createTime: item.createTime.substring(0, 10), // 创建时间
                defectFrom: item.formValue.defectFrom,
                faultTypes: item.formValue.faultTypes,
                fileUrl: item.formValue?.handleImgs?.[0]?.fileUrl,
                // 图片地址
                url: item.formValue?.handleImgs?.[0]?.url,
                // 发生经纬度
                lnglat: [item.appealLng, item.appealLat],
                device_type: item.formValue?.device_type || [],
                questionDescribe: item.formValue.questionDescribe,
              })
            })
            resolve()
          }
          // problemDataList.forEach((item) => {
          //   // console.log('图片地址', item.url)
          // })
        })
      })
    },
    // 问题上报点击标题、设施缺陷点击卡片进入详情页
    toDetailPanel(cardDetail) {
      // window.location.href =
      //   'http://172.20.79.70/outworkApp/#/pages/ticket/detail/index?id=' +
      //   cardDetail.id +
      //   '&sysCode=outwork' +
      //   '&token=' +
      //   this.formToken
      this.$router.push({
        name: 'detailProblemOrder',
        query: { id: cardDetail.id }
      })
    },
    // 卡片定位
    flyToPoint(lnglat) {
      mapObj.map.flyTo({ center: lnglat, zoom: 18.5 })
    },
    // 上报
    reportClick() {
      if (this.reportDataIsLoaded) {
        this.reportShow = true
        mapObj.map.setLayoutProperty(
          'eventPointsLayer',
          'visibility',
          'visible'
        )
      } else {
        Toast.loading({
          message: '数据加载中...',
          loadingType: 'spinner',
          duration: 1500,
        })
        return
      }
    },
    fileChangeAfter(file) {
      this.maintainAfterImage = []
      file.fileList.forEach((it) => {
        this.maintainAfterImage.push({
          imagesToken: it.response.groupToken,
          imagesName: it.url,
          stage: 1
        })
      })
      console.log('后后后后后后后后后后', this.maintainAfterImage)
    },
    fileChangeBefore(file) {
      this.maintainBeforeImage = []
      file.fileList.forEach((it) => {
        this.maintainBeforeImage.push({
          imagesToken: it.response.groupToken,
          imagesName: it.url,
          stage: 0
        })
      })
      console.log('前前前前前前前前前前', this.maintainBeforeImage)
    },
    openPopup() {
      this.showPopover = true
    },
    onSelect(val) {
      if (this.isView) {
        Toast.info({
          message: '该养护任务已结束',
          duration: '1500',
        })
        return
      }
      this.ifTips = true
      mapObj.map.off('click', 'mainDevPipeLayer', this.mainDetailInfo)
      mapObj.map.off('click', 'mainDevPointLayer', this.mainDetailInfo)
      val.text == '问题上报'
        ? mapObj.map.on('click', this.selectReportPoint)
        : mapObj.map.on('click', this.selectFlawPoint)
    },
    selectReportPoint(e) {
      if (this.ifTips) {
        this.ifTips = false
      }
      let features = mapObj.map.queryRenderedFeatures(e.point)
      if (features.length > 0 && features[0].layer.type != 'fill') {
        if (features[0].layer.id == 'mainDevPointLayer' || features[0].layer.id == 'mainDevPipeLayer') {
          this.addEventObjMarker(features[1], 'event', 'device', { gridId: this.taskData.gridId, gridName: this.taskData.gridName, gridManager: { fullName: this.taskData.gridManagerFullName, username: this.taskData.gridManager } })
        } else {
          this.addEventObjMarker(features[0], 'event', 'device', { gridId: this.taskData.gridId, gridName: this.taskData.gridName, gridManager: { fullName: this.taskData.gridManagerFullName, username: this.taskData.gridManager } })
        }
      } else if (features.length > 0 && features[0].layer.type == 'fill') {
        this.addEventObjMarker(e.lngLat, 'event', 'lnglat', { gridId: this.taskData.gridId, gridName: this.taskData.gridName, gridManager: { fullName: this.taskData.gridManagerFullName, username: this.taskData.gridManager } })
      }
      mapObj.map.on('click', 'mainDevPipeLayer', this.mainDetailInfo)
      mapObj.map.on('click', 'mainDevPointLayer', this.mainDetailInfo)
      mapObj.map.off('click', this.selectReportPoint)
    },
    selectFlawPoint(e) {
      if (this.ifTips) {
        this.ifTips = false
      }
      let features = mapObj.map.queryRenderedFeatures(e.point)
      if (features.length > 0) {
        if (
          features[0].source != 'eventPoints' &&
          features[0].source != 'mainUser' &&
          features[0].geometry.type === 'Point'
        ) {
          this.$refs.mymap.addEventObjMarker(features[0], 'flaw', 'device')
        } else if (
          features.length > 1 &&
          features[1].source != 'eventPoints' &&
          features[1].source != 'mainUser' &&
          features[1].geometry.type === 'Point'
        ) {
          this.$refs.mymap.addEventObjMarker(features[1], 'flaw', 'device')
        }
      } else {
        this.addEventObjMarker(e.lngLat, 'event', 'lnglat')
      }
      mapObj.map.on('click', 'keypointsLayer', this.$refs.mymap.signInBuffer)
      mapObj.map.off('click', this.selectFlawPoint)
    },
    // 添加上报对象的marker
    addEventObjMarker(feature, type, pointType, gridObj) {
      let position;
      let pop;
      let marker;
      if (pointType == 'device') {
        console.log(feature)
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          const center = turf.center(feature.geometry);
          position = center.geometry.coordinates;
        } else if (feature.geometry.type === 'LineString') {
          const center = turf.center(feature.geometry);
          position = center.geometry.coordinates;
        } else if (feature.geometry.type === 'Point') {
          position = feature.geometry.coordinates;
        }
        this.currentPoint = JSON.parse(JSON.stringify(feature))
        this.currentPoint.gridId = gridObj.gridId
        this.currentPoint.gridName = gridObj.gridName
        this.currentPoint.gridManager = gridObj.gridManager
        this.currentPoint.lng = feature.geometry.coordinates[0]
        this.currentPoint.lat = feature.geometry.coordinates[1]
        // 要素所在图层ID和属性信息
        this.currentPoint.layerID = feature.layer.id
        this.currentPoint.layerType = feature.layer.type
        this.currentPoint.properties = feature.properties
        // 底图要素name_local或设施要素road_name,id
        this.currentPoint.road_name = feature.properties.road_name
        this.currentPoint.id = feature.properties.id
        this.currentPoint.code = feature.properties.manhole_code || feature.properties.gate_code || feature.properties.outlet_code
          || feature.properties.comb_code || feature.properties.valve_code || feature.properties.pump_station_code
          || feature.properties.plant_code || feature.properties.pump_code || feature.properties.fire_cock_code
          || feature.properties.start_code + ',' + feature.properties.end_code || ''
        // 要素对象类型（业务类型/设施类型）
        switch (feature.layer.id) {
          // 雨水
          case "rd_map_comb"://comb一定是雨水口
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType ='雨水口'
            break
          case "rd_map_outfall"://排放口 1-雨水； 2-污水； 3-合流； 4-其他
            this.currentPoint.bigType = feature.properties.pipe_type
            this.currentPoint.smallType = '排放口'
            break
          case "rd_map_manhole"://检查井  1-雨水；2-污水
            this.currentPoint.bigType = feature.properties.manhole_type
            this.currentPoint.smallType = feature.properties.manhole_type + '检查井'
            break
          case "rd_map_gate"://闸门 1-雨水； 2-污水； 3-合流； 4-其他
            this.currentPoint.bigType = feature.properties.pipe_type
            this.currentPoint.smallType = '闸门'
            break
          case "rd_map_drainpipe_ys_big":
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType = '雨水管线'
            break
          case "rd_map_drainpipe_ys_small":
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType = '雨水管线'
            break
          // 污水
          case "rd_map_drainpipe_ws_big":
            this.currentPoint.bigType = '污水'
            this.currentPoint.smallType = '污水管线'
            break
          case "rd_map_drainpipe_ws_small":
            this.currentPoint.bigType = '污水'
            this.currentPoint.smallType = '污水管线'
            break
          // 给水
          case "map_supply_firehydrant"://消火栓一定是给水
            this.currentPoint.bigType = '供水'
            this.currentPoint.smallType = '消火栓'
            break
            case "map_recycle_valve"://阀门valve一定是给水
              this.currentPoint.bigType = '再生水'
              this.currentPoint.smallType = '阀门'
              break
          case "map_supply_valve"://阀门valve一定是给水
            this.currentPoint.bigType = '供水'
            this.currentPoint.smallType = '阀门'
            break
          case "map_supply_pipe_distribute"://配水管线
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '配水管线'
            break
          case "map_supply_pipe_delivery"://输水管线
            this.currentPoint.bigType = 'supply'
            this.currentPoint.smallType = '输水管线'
            break
          case "map_supply_pipe_circulating"://回水管线
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '回水管线'
            break
          case "map_waterwork"://供水厂
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '供水厂'
            break
          // 再生水
          case "map_recycle_pipe"://再生水管线
            this.currentPoint.bigType = '再生水'
            this.currentPoint.smallType = 'pipeline'
            break
          case "map_waterwork"://再生水厂
            this.currentPoint.bigType = '再生水'
            this.currentPoint.smallType = '再生水厂'
            break
        }
  
        const src = require(`@/assets/img/legend/事件上报.png`);
        // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
        let currentEle = document.getElementById("eventObj_one");
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
        let ele = document.createElement("div");
        ele.innerHTML = `
            <img id="eventObj_one" src="${src}" width="40" height="40">
          `
        marker = mapObj.mapInstance.newMarker({
          element: ele
        });
        marker
          .setLngLat(position)
          .setPopup(mapObj.mapInstance.popup
            .setHTML(`<div id="deviceDetail"></div>`))
          .addTo(mapObj.map);
        pop = new PopupItem({ propsData: { deviceCode: this.currentPoint.code, type: type, isDevice: true, fun: this.goToDetail } })
      } else if (pointType == 'lnglat') {
        this.currentPoint = feature
        this.currentPoint.taskId = this.$route.query.taskId
        this.currentPoint.gridId = gridObj.gridId
        this.currentPoint.gridName = gridObj.gridName
        this.currentPoint.gridManager = gridObj.gridManager
        position = [feature.lng, feature.lat]
  
        const src = require(`@/assets/img/legend/事件上报.png`);
        // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
        let currentEle = document.getElementById("eventObj_one");
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
        let ele = document.createElement("div");
        ele.innerHTML = `
            <img id="eventObj_one" src="${src}" width="40" height="40">
          `
        marker = mapObj.mapInstance.newMarker({
          element: ele
        });
        marker
          .setLngLat(position)
          .setPopup(mapObj.mapInstance.popup
            .setHTML(`<div id="deviceDetail"></div>`))
          .addTo(mapObj.map);
        pop = new PopupItem({ propsData: { lng: this.currentPoint.lng, lat: this.currentPoint.lat, type: type, isDevice: false, fun: this.goToDetail } })
      }
      this.$nextTick(() => {
        pop.$mount('#deviceDetail')
      })
      marker.togglePopup();

    },
    goToDetail(type) {
      if (type == 'event') {
        this.$router.push({
          name: 'addProblemIndex',
          query: { msg: this.currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'mainten' },
          params: { type: 'add' }
        })
      } else {
        this.$router.push({
          name: 'addFlaws',
          query: { msg: this.currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'mainten' },
          params: { type: 'add' }
        })
      }
    },
    mapLoaded() {
      let that = this
      mapObj.mapInstance = window.xaMapBuilder
      mapObj.map = window.xaMap
      that.mapLoad = true
      addImgToMap(mapObj.map)
      this.addMainSourceLayer()
      this.addBufferLayer()
      this.addMainUserSourceLayer()
      if (this.taskData.useChildRange == 0 || !this.taskData.rangeId) {
        this.getGridRange()
      } else if (this.taskData.useChildRange == 1 && this.taskData.rangeId) {
        this.getMainRangeById(this.taskData.rangeId)
      }

      // that.currentPosition = { longitude: 115.91010678529756, latitude: 39.06029211793472 }
      // console.log('that.currentPosition', that.currentPosition)
      // // 地图点击时，将当前点击的点的经纬度赋值给currentPoint的 longitude 和 latitude
      // mapObj.map.on('click', (e) => {
      //   that.currentPosition.longitude = e.lngLat.lng
      //   that.currentPosition.latitude = e.lngLat.lat
      //   console.log('that.currentPosition', that.currentPosition)
      //   const param = {
      //     ...that.currentPosition,
      //   }
      //   this.setMainUserPosition(param)
      // })

      (typeof yuanchu != 'undefined') && yuanchu.locationAMap.requestSingleLocation(
        ['1'],
        (res) => {
          that.currentPosition = JSON.parse(JSON.stringify(res))
          if (!that.currentPosition) {
            Toast.warning({
              message: '当前GPS信号弱',
              duration: 1500,
            })
            return
          }
          const param = {
            ...that.currentPosition,
          }
          this.setMainUserPosition(param)
        },
        (err) => {
          console.log('err=', err)
        }
      )
    },
    addMapImg() {
      let that = this
      mapObj.map.loadImage(
        require('@assets/img/inspection/white_arrow_right.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('arrowIcon')) {
            mapObj.map.addImage('arrowIcon', image, {})
          }
        }
      )
      mapObj.map.loadImage(
        require('@assets/img/inspection/icon_starting_point.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('start_point')) {
            mapObj.map.addImage('start_point', image, {})
          }
        }
      )
      mapObj.map.loadImage(
        require('@assets/img/inspection/icon_at_end.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('end_point')) {
            mapObj.map.addImage('end_point', image, {})
          }
        }
      )
    },
    startMainWork() {
      this.noticeShow = false
      this.startGetLocation()
    },
    startGetLocation() {
      let that = this;
      this.ifStart = true;
      Toast.info({
        message: '开始养护',
        duration: 1500
      })
      this.startRecordTimer = new Date();
        (typeof yuanchu != 'undefined') && yuanchu.locationAMap.requestLocations(
          ['5', '1', '10', '30', '0', true],
          (res) => {
            that.currentPosition = JSON.parse(JSON.stringify(res))
            that.currentPosition = Object.assign(that.currentPosition, {
              direction: 0
            })
            this.setMainUserPosition(that.currentPosition)
          },
          (err) => {
            // Toast.error({
            //   message: 'err' + err,
            //   duration: 2000,
            // })
          }
        )
    },
    getDirection() {
      window.addEventListener('deviceorientationabsolute', this.setRotate)
      this.hasListen = true
    },
    // 设置养护人员位置
    setMainUserPosition(position) {
      // xCode，yCode为经纬度
      const coord = [parseFloat(position.longitude), parseFloat(position.latitude)];
      const point = turf.point(coord);
      try {
        const that = this;
        // 定时器
        let timer = setInterval(function () {
          // 如果地图实例创建、巡检人员图层存在且加载完毕
          if (mapObj.map.getSource("mainUser")
            && mapObj.map.isSourceLoaded("mainUser")
          ) {
            // 清除定时器
            clearInterval(timer);
            // 巡检人员图标
            that.setSourceData("mainUser", {
              type: "FeatureCollection",
              features: [point]
            })
            !that.hasListen && that.getDirection()
            if (that.ifStart) {
              mapObj.map.setCenter(coord);
            }
          }
        }, 100)
      } catch (e) {
        console.log(e);
      }
    },
    setRotate(e) {
      let bearing = (e.alpha - 180) >= 0 ? (180 - e.alpha) : (180 - e.alpha)
      // 调整罗盘方向
      mapObj.map.setLayoutProperty("mainUserLayer", "icon-rotate", bearing);
    },
    startInspRecord() {
      if (this.isView) {
        Toast({
          message: '该养护任务已结束',
          duration: 1500,
        })
        return
      }
      if (!this.mapLoad) {
        Toast.info({
          message: '资源未加载完成，稍后尝试',
          duration: 1500
        })
        return
      }
      let that = this
      if (this.taskData.status == 0) {
        this.noticeShow = true
        let timer = setInterval(() => {
          if (that.continueTime <= 0) {
            that.hasKnow = true
            clearInterval(timer)
            return
          }
          that.continueTime--
        }, 1000)
        return
      }
      this.startGetLocation()
    },
    // 结束记录
    endRecord() {
      let diff = Math.floor((new Date() - this.startRecordTimer) / 1000)

      if (diff <= 10) {
        Toast({
          message: `结束太快了,请${10 - diff}秒后再试`,
          duration: 1000,
        })
        return
      }
      Dialog.confirm({
        title: '标题',
        message: '确定暂停本次养护？',
      })
        .then(() => {
          this.endRecordConfirm()
        })
        .catch(() => {
          this.endRecordCancel()
        })
    },
    // 结束记录取消
    endRecordCancel() {
    },
    // 结束记录确认
    async endRecordConfirm() {
      (typeof yuanchu != 'undefined') && yuanchu.locationAMap.stopRequestLocations()
      this.ifStart = false
      this.signShow = false
      this.updateProgress()
      this.getMainDevPoint()
      Toast.success({
        message: '暂停成功',
        duration: 2000
      })
    },
    // 开始定位
    startLocation() {
      let that = this
      yuanchu.locationAMap.requestSingleLocation(
        ['1'],
        (res) => {
          that.currentPosition = JSON.parse(JSON.stringify(res))
          const param = {
            ...that.currentPosition,
          }
          if (!that.currentPosition || !that.currentPosition.longitude || !that.currentPosition.latitude) {
            Toast.error({
              message: '获取位置失败!',
              duration: 2000
            })
            return
          } else {
            const coord = [parseFloat(that.currentPosition.longitude), parseFloat(that.currentPosition.latitude)]
            that.setMainUserPosition(param)
            that.flyToPoint(coord)
          }
        },
        (err) => {
          console.log('err=', err)
        }
      )
    },
    // 确认
    onConfirm() {
      if (true) {
        if (this.maintainBeforeImage.length == 0) {
          Toast({
            message: '请上传养护前照片',
            duration: 2000,
          })
          return
        }
        if (this.maintainAfterImage.length == 0) {
          Toast({
            message: '请上传养护后照片',
            duration: 2000,
          })
          return
        }
        let that = this
        let copySignForm = this.deepClone(this.signForm)
        copySignForm.maintainDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
        copySignForm.taskId = this.$route.query.taskId
        copySignForm.maintainImagesList = [...this.maintainBeforeImage, ...this.maintainAfterImage]
        copySignForm.isReturn = 0 // 退回次数
        copySignForm.reason = '' // 退回原因
        if (this.currentSelectDev.properties.deviceType == '管线') {
          copySignForm.pipeLength = this.currentSelectDev.properties['length']
          copySignForm.pipeId = this.currentSelectDev.properties.id
          copySignForm.pipeStatus = '1' // 管线状态: 0未养护，1待审核，2已通过，3已退回
          console.log(11111111111111111111111111111111111111111111111, copySignForm);
          api.uploadMainLineRecords(copySignForm).then((res) => {
            if (res && res.status) {
              Toast.success({
                message: '养护记录上传成功',
                duration: 1000,
                onClose: () => {
                  that.getMainDevPoint()
                  that.updateProgress()
                }
              })
            } else {
              Toast.error({
                message: '养护记录上传失败',
                duration: 2000,
              })
            }
          })
        } else {
          copySignForm.pointId = this.currentSelectDev.properties.id
          copySignForm.deviceStatus = '1' // 设备状态: 0未养护，1待审核，2已通过，3已退回
          console.log(22222222222222222222222222222222222222222222222, copySignForm);
          api.uploadMainPointRecords(copySignForm).then((res) => {
            if (res && res.status) {
              Toast.success({
                message: '养护记录上传成功',
                duration: 1000,
                onClose: () => {
                  that.getMainDevPoint()
                  that.updateProgress()
                }
              })
            } else {
              Toast.error({
                message: '养护记录上传失败',
                duration: 2000,
              })
            }
          })
        }
        this.signShow = false
        this.signForm.remarks = ''
        this.signForm.maintainType = ''
        this.signForm.sedimentDepth = ''
        this.attachment = ''
        this.attachment1 = ''
        this.maintainAfterImage = []
        this.maintainBeforeImage = []
        this.setSourceData('buffered', {
          type: 'FeatureCollection',
          features: [],
        })
        // this.refreshTask()
      } else {
        console.log('验证失败')
      }
    },
    updateProgress() {
      api.updateProgress({ taskId: this.$route.query.taskId }).then(res => {
        if (res.status) {
          this.progress = res.data
        }
      })
    },
    cancelLeave() {
      this.ifLeaveTask = false
      this.endRecordCancel()
    },
    confirmLeave() {
      this.ifLeaveTask = false;
      (typeof yuanchu != 'undefined') && yuanchu.locationAMap.stopRequestLocations();
      this.ifStart = false;
      this.signShow = false;
      this.$router.go(-1)
    },
    clickBack() {
      if (this.ifStart) {
        this.ifLeaveTask = true
      } else {
        this.$router.go(-1)
      }
    },
    // 取消
    onCancel() {
      this.signShow = false
      this.setSourceData('buffered', {
        type: 'FeatureCollection',
        features: [],
      })
      this.currentSelectDev = null
      this.attachment = ''
      this.maintainBeforeImage = []
      this.attachment1 = ''
      this.maintainAfterImage = []
    },
    cancelLeave() {
      this.ifLeaveTask = false
    },
    confirmLeave() {
      this.ifLeaveTask = false;
      (typeof yuanchu != 'undefined') && yuanchu.locationAMap.stopRequestLocations();
      this.ifStart = false;
      this.$router.go(-1)
    },
    clickBack() {
      if (this.ifStart) {
        this.ifLeaveTask = true
      } else {
        this.$router.go(-1)
      }
    }
  },
  beforeDestroy() {
    Toast.clear()
    this.ifStart = false
    this.hasListen = false
    if (typeof yuanchu != 'undefined') {
      yuanchu.locationAMap.stopRequestLocations()
    }
    window.removeEventListener('deviceorientationabsolute', this.setRotate)
  }
  // beforeRouteLeave(to, from, next) {
  //   if (to.name == 'MaintenManagement' && from.name == 'TaskDetail') {
  //     if (this.ifStart) {
  //       Dialog.confirm({
  //         title: '标题',
  //         message: '退出后会停止定位, 确定退出？',
  //       })
  //         .then(() => {
            
  //           next()
  //         })
  //         .catch(() => {
  //           this.endRecordCancel()
  //         })
  //     } else {
  //       next()
  //     }
  //   } else {
  //     next()
  //   }
  // }
}
</script>
<style lang="less" scoped>
/deep/.mapboxgl-popup-content {
  width: auto;
  min-width: 280px;
  height: 50px;
  padding: 24px 36px;
  border-radius: 18px;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
}
/deep/.fm-tabs--line {
  height: 100%;
}
/deep/.fm-tabs--line .fm-tabs__wrap {
  border-radius: 30px 30px 0 0;
}
/deep/.fm-tab--active {
  font-weight: 600;
  color: #191919;
}
/deep/.fm-tabs__content {
  height: 100%;
}
/deep/.fm-tab__pane {
  height: 100%;
}
/deep/.fm-button--default {
  color: #555555;
  font-weight: 400;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.task-map {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .tip-tools {
    position: fixed;
    display: flex;
    top: 15%;
    left: 200px;
    border-radius: 16px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 10px 18px 0px rgba(0, 0, 0, 0.06);
    border: 2px solid rgba(23, 144, 254, 0.6);
    .tipImg {
      width: 32px;
      height: 32px;
      margin-right: 16px;
    }
    .context {
      font-size: 24px;
      font-family: MicrosoftYaHei;
      color: #1b67d8;
      line-height: 31px;
    }
  }
  .confirm-tip {
    width: 80%;
    height: 44%;
    margin: auto;
    background: #FFFFFF;
    border-radius: 16px;
    margin: 50% auto;
    /deep/.content {
      height: calc(100% - 164px);
      padding: 32px;
      display: flex;
      flex-direction: column;
      .icon {
        width: 100%;
        height: 100px;
        display: flex;
        margin: 24px 0 28px;
      }
      .info {
        height: auto;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 40px;
        text-align: center;
      }
    }
    /deep/.confirm_btn {
      width: 100%;
      height: 100px;
      display: flex;
      .btn1 {
        width: 50%;
        height: 100%;
        border-top: 1px solid #DCDEE3;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 100px;
        text-align: center;
      }
      .btn2 {
        border-right: 1px solid #DCDEE3;
      }
    }
  }
  .arrow-up {
    position: fixed;
    top: var(--top);
    width: 100%;
    height: var(--height);
    // transition: 0.6s;
    .fm-icon {
      margin: 0 47%;
    }
    .content {
      width: 100%;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px -6px 12px 0px rgba(104, 115, 127, 0.1);
      border-radius: 30px 30px 0 0;
      .contentArea {
        width: 100%;
        height: 100%;
        background: #f5f7f9;
        .buttonArea {
          width: var(--width);
          padding: 30px 20px;
          display: flex;
          .button {
            min-width: 160px;
            margin: 0 10px;
            border: none;
            box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
          }
        }
        .listArea {
          margin: 0 4%;
          background: #ffffff;
          height: calc(100% - 74px);
          padding: 20px 36px 0;
          border-radius: 16px 16px 0 0;
          overflow-y: scroll;
          .list {
            height: 45px;
            display: flex;
            padding: 40px 0;
            border-bottom: 1px solid #eeeeee;
            .list_num {
              min-width: 60px;
              margin-right: 30px;
              margin-left: 10px;
              height: 43px;
              font-size: 36px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: bold;
              color: #1b67d8;
              line-height: 43px;
            }
            .list_type {
              min-width: 160px;
              height: 45px;
              font-size: 32px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 45px;
            }
            .list_id {
              min-width: 200px;
              height: 45px;
              font-size: 32px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 45px;
            }
            .list_deal {
              height: 45px;
              font-size: 32px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #1b67d8;
              line-height: 45px;
              display: flex;
            }
          }
        }
      }
    }
  }
  .noticeBody {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    .noticeTitle {
      width: 18%;
      padding: 36px 0;
      margin: 0 41%;
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1B67D8;
      line-height: 45px;
    }
    .noticeContent {
      width: 94%;
      padding: 0 3%;
      overflow-y: scroll;
      height: calc(100% - 254px);
      h5 {
        text-align: center;
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 40px;
      }
      p,
      h6 {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        line-height: 42px;
      }
    }
    .noticeBtnArea {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 136px;
      background: #ffffff;
      .noticeBtn {
        width: 94%;
        color: #FFFFFF;
        margin: 24px 3%;
      }
    }
  }

  .alert {
    top: 2.22rem;
    position: fixed;
    width: 100%;
    z-index: 4;
    background-color: #62707c;
    opacity: 0.5;
    font-size: 1rem;

    .u-alert-content {
      width: 100%;
    }
  }

  .progress {
    width: 80%;
    height: 1rem;
    background-color: #fff;
    box-shadow: 0 0.4rem 0.6rem 0 rgba(0, 0, 0, 0.2);
    border-radius: 0.1rem;
    margin: 0 0.3rem;
    padding: 0.1rem 0.15rem;
    position: fixed;
    top: 2.5rem;

    &-box {
      width: 100%;
      margin: 0.3rem 0;
      display: flex;

      .pro-dot {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        float: left;
        margin: auto 0.3rem;
      }

      .pro-text {
        line-height: 0.5rem;
        display: flex;
        font-size: 12px;
        float: left;
      }
    }
  }

  .pro-circle {
    position: fixed;
    width: 1rem;
    height: 1rem;
    right: 0.1rem;
    padding: 0.1rem;
    top: 2.5rem;
    // margin: 0.27rem 0rem;
    background-color: #fff;
    z-index: 3;
    box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.1rem;

    .progress-text-view {
      font-size: 0.4rem;
      z-index: 4;

      .progress-text-up {
        color: #306cc8;
      }

      .progress-text-down {
        border-top: 0.05rem solid #555555;
      }
    }
  }

  .point-list {
    position: fixed;
    width: 1.2rem;
    height: 1.2rem;
    left: 0.3rem;
    bottom: 2rem;
    background-color: #fff;
    z-index: 3;
    box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.27rem;

    .list-image {
      margin: 0.18rem;
      width: 0.82rem;
      height: 0.82rem;
    }
  }

  .footer {
    width: inherit;
    padding: 1.11rem 0.83rem;
    color: #333333;
    background-color: #ffffff;
    height: 3.55rem;
    z-index: 4;
    position: fixed;
    bottom: 0rem;

    &-content {
      float: left;
    }

    &-btn {
      float: right;
      width: 4.44rem;
      height: 1.77rem;
      line-height: 1.77rem;
      border-radius: 0.88rem;
    }
  }

  .start-record {
    position: absolute;
    z-index: 3;
    left: 50%;
    bottom: 235px;
    transform: translate(-50%, 0);

    img {
      width: 140px;
      height: 140px;
    }
  }

  .controlCard {
    width: 94%;
    height: 276px;
    margin: 0 3%;
    background: #ffffff;
    position: absolute;
    top: 200px;
    box-shadow: 0px 8px 20px 0px rgba(104, 115, 127, 0.2);
    border-radius: 16px;
    .mainContent {
      width: 94%;
      height: 180px;
      padding: 12px 16px 12px 24px;
      overflow-y: scroll;
      .contentList {
        display: flex;
        flex-direction: column;
        .obj {
          display: flex;
          margin: 8px 0;
          .point {
            width: 8px;
            height: 8px;
            background: #1b67d8;
            border-radius: 10px;
            margin: 18px;
          }
          .name {
            width: auto;
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 40px;
            margin-left: 18px;
            margin-right: 12px;
          }
          .num {
            width: auto;
            height: 38px;
            font-size: 32px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #1b67d8;
            line-height: 38px;
            margin: 0 12px;
          }
          .unit {
            width: auto;
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 40px;
          }
        }
      }
    }
    .startBtn {
      width: 100%;
      height: 72px;
      background: #1b67d8;
      border-radius: 0px 0px 16px 16px;
      .btnContent {
        font-size: 28px;
        padding: 20px 46% 0 46%;
        color: #ffffff;
      }
    }

    .controlContent {
      margin: 60px 30px 0;
      display: flex;
      flex-direction: column;

      .infoContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 24px;

        .block {
          text-align: center;
          width: 210px;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(27, 103, 216, 0.05);
          border-radius: 16px;
          // margin: 0 20px;

          .rate {
            width: 100%;
            height: 50%;
            display: flex;
            align-items: center;
            margin: auto;
            font-size: 48px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #306cc8;

            .centerStyle {
              margin: auto;
              display: flex;
              align-items: center;
              font-size: 38px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: bold;

              .inspKp {
                padding-bottom: 3px;
                padding-right: 3px;
                color: #306cc8;
              }

              .uninspKp {
                color: #191919;
                letter-spacing: 3px;
              }
            }
          }

          .name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            width: 100%;
            height: 33%;
          }
        }
      }

      .bottomSide {
        width: 100%;
        display: flex;
        margin-top: 24px;
        justify-content: space-around;
      }

      .endControl {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .leftText {
          width: 27%;
          display: flex;
          justify-content: space-around;
          align-items: center;

          img {
            width: 32px;
            height: 32px;
            margin: auto;
          }

          /deep/.fm-count-down {
            font-size: 24px;
            color: #306cc8;
          }
        }

        .rightButton {
          display: flex;

          .endBtn {
            font-size: 24px;
            width: 120px;
            height: 60px;
            background: #ffffff;
            color: #306cc8;
          }
        }
      }
    }
  }
  .controlCard_start {
    width: 86%;
    height: 139px;
    margin: 0 3%;
    background: #ffffff;
    position: absolute;
    display: flex;
    top: 16%;
    box-shadow: 0px 8px 20px 0px rgba(104, 115, 127, 0.2);
    border-radius: 16px;
    padding: 10px 30px;
    .progressControl {
      display: flex;
      height: 64px;
      margin: auto;
      .icon {
        margin: auto;
      }
      .title {
        width: 64px;
        height: 64px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 64px;
        margin: 0 12px;
      }
      .progressWidth {
        margin: auto;
        width: var(--totalWidth);
        height: 44px;
        border-radius: 6px;
        background: rgba(27, 103, 216, 0.08);
        box-shadow: inset 0px 0px 5px 0px rgba(39, 123, 214, 0.15);
        margin-right: 20px;

        // 第二层，计算得到的实际比率宽度
        .colorWidth {
          width: var(--barWidth);
          height: 44px;
          border-radius: 6px;
          box-shadow: 0px 4px 8px 0px rgba(50, 127, 211, 0.24);
          border-radius: 6px;
          background: linear-gradient(
            -45deg,
            #1b67d8 0%,
            rgba(58, 160, 238, 0.42) 100%
          );

          // 第三层，动画
          .progressAnimate {
            width: 0;
            height: 44px;
            border-radius: 6px;
            background: linear-gradient(
              270deg,
              #1b67d8 0%,
              rgba(58, 160, 238, 0.42) 100%
            );
            // background: linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
            animation: w 3s linear infinite;

            @keyframes w {
              0% {
                width: 0;
              }

              100% {
                width: var(--barWidth);
              }
            }
          }
        }
      }
      .bluePercent {
        height: 64px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1b67d8;
        line-height: 64px;
      }
      .purPercent {
        height: 64px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 64px;
      }
    }
    .controlBtn {
      width: 119px;
      height: 119px;
      margin: auto;
    }
  }

  .tool-box {
    position: fixed;
    width: 1.2rem;
    height: auto;
    right: 0.3rem;
    bottom: 0.3rem;

    .refresh {
      width: 1.2rem;
      height: 1.2rem;
      margin-bottom: 0.55rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 0.27rem;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }

    .route {
      width: 1.2rem;
      height: 1.2rem;
      margin-bottom: 0.55rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 0.27rem;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }

    .location {
      width: 1.2rem;
      height: 1.2rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 60px;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }
  }

  /deep/.fm-popup {
    background: #eaf4ff;
  }

  .tab {
    display: flex;
    margin: 28px 18%;
    width: auto;
    .dealName {
      height: 45px;
      width: 100px;
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      line-height: 45px;
    }
  }
  .popup-view {
    height: 540px;
    width: auto;
    margin: 0 32px 32px 32px;
    overflow: scroll;
    border-radius: 24px;
    background-color: #fff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);

    /deep/.fm-radio--horizontal {
      margin-right: 20px;
    }

    .title {
      display: flex;
      margin-top: 32px;
      padding-bottom: 32px;
      border-bottom: 1px #f5f5f5 solid;

      img {
        width: 6px;
        height: 40px;
      }

      .deviceId {
        margin-left: 32px;
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 50px;
      }
    }

    /deep/.fm-uploader__wrapper {
      margin-left: 16px;
    }

    .preview-cover {
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 4px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .btnArea {
    display: flex;

    .btn {
      width: 94%;
      margin: 0 auto;
    }

    .btn1 {
      width: 44%;
      margin: 0 12px 0 30px;
    }

    .btn2 {
      width: 44%;
      margin: 0 30px 0 12px;
    }
  }

  .confirm-pop {
    .title {
      border-left: 0.22rem solid #306cc8;
      margin: 0.27rem;
      padding-left: 0.55rem;
    }

    .content {
      border-top: 0.027rem solid rgba(128, 128, 128, 0.322);
      width: 11.66rem;
      padding: 1.33rem;
      text-align: center;
      background-color: #fff;

      &-view {
        font-size: 0.88rem;
      }

      .confirm-btn {
        margin-top: 2.22rem;
        justify-items: center;

        .popup-btn {
          float: left;
          width: 3.33rem;
          height: 1.77rem;
          border-radius: 0.27rem;

          &-l {
            margin-left: 0.55rem;
            margin-right: 0.55rem;
          }

          &-r {
            margin-left: 0.55rem;
            margin-right: 0.55rem;
          }
        }
      }
    }
  }
}
</style>
