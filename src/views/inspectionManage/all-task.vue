<!--
 * @Descripxion: 全部任务执行
 * @Author: wei_qx@hdec.com
 * @Date: 2021-04-19 18:37:46
 * @LastEditor: wei_qx@hdec.com
 * @LastEditTime: 2021-05-02 20:04:17
-->
<template>
  <view class="task-map full-width">
    <!-- 地图 -->
    <MapComp ref="mymap" :ifInspection="true" inspBusinessType="ALL" class="full-height"></MapComp>
    <!-- 上报事件底部弹框 -->
    <view v-if="reportFooterShow" class="footer">
      <view class="footer-content">
        {{ (feature.properties && feature.properties.pipetype + feature.properties.gjz) || "对象"}}
      </view>
      <button class="footer-btn" type="primary" plain @click="reportEvent(feature)">上报事件</button>
    </view>
    <!-- 进度 -->
    <view class="progress">
      <!-- 收起状态下的进度 -->
      <view class="progress-collapse" v-if="ifExpand">
        <view class="progress-collapse-box" v-for="item in taskList" :key="item.inspectionTask.taskId">
          <view class="pro-dot" :style="{'background-color': '#2a83e6'}"></view>
          <view class="pro-text">剩余: 
            <u-count-down :timestamp="item.taskRestTime" separator="zh" :show-minutes="false" :show-seconds="false"></u-count-down>
          </view>
          <progress class="gress" :percent="item.completion.toFixed(2)" show-info stroke-width="3"/>
        </view>
      </view>
      <!-- 展开状态下的进度 -->
      <view class="progress-expand" v-else>
        <view class="progress-expand-box"  v-for="item in taskList" :key="item.inspectionTask.taskId">
          <view class="pro-title">{{item.inspectionTask.taskName}}</view>
          <view class="pro-dot" :style="{'background-color': '#2a83e6'}"></view>
          <view class="pro-text">剩余: 
            <u-count-down :timestamp="item.taskRestTime" separator="zh" :show-minutes="false" :show-seconds="false"></u-count-down>
          </view>
          <progress class="gress" :percent="item.completion.toFixed(2)" show-info stroke-width="3"/>
        </view>
      </view>
      <!-- 进度展示信息的控制按钮 -->
      <view class="progress-control">
        <text class="expand" @click="ifExpand = !ifExpand">{{ifExpand ? "展开" : "收起"}}</text>
      </view>
    </view>
    <!-- 开始记录与结束记录 -->
    <view class="start-record">
      <button v-if="!ifRecording" class="start-button" type="primary" @click="startRecord">开始记录</button>
      <button v-else class="start-button" type="primary" @click="endRecord">结束记录</button>
    </view>
    <!-- 轨迹显示与定位功能 -->
    <view class="tool-box">
      <view class="route" @click="showRoute">
        <image class="route-image" src="@/static/img/inspection/route.png"></image>
      </view>
      <view class="location" @click="startLocation">
        <image class="location-image" src="@/static/img/inspection/location.png"></image>
      </view>
    </view>
    <!-- 提示结束巡检的对话框 -->
    <u-modal
      v-model="endRecordShow"
      title="提示"
      content="确定结束本次巡检？"
      :show-cancel-button="true"
      @confirm="endRecordConfirm"
      @cancel="endRecordCancel"
    ></u-modal>
    <!-- 签到框 -->
    <view v-if="signShow" class="popup-view">
      <view class="popup-container">
        <view class="head">
          <text @click="onCancel">取消</text>
          <text>{{ engInfoDTO.engNum || "对象"}}</text>
          <text class="on-confirm" @click="onConfirm">确定</text>
        </view>
        <u-line color="#EEEEEE"/>
        <scroll-view scroll-y="true" class="scroll">
          <u-form :model="signForm" ref="signForm" class="sign-form">
            <u-alert-tips v-if="isTaskReview && signForm.inspItemReview == 3" :show-icon="true" type="warning" :description="signForm.reviewOpinion"></u-alert-tips>
            <u-form-item label="运转情况" label-width="100px" required prop="inspItemResult">
              <u-radio-group v-if="!isTaskReview" v-model="signForm.inspItemResult">
                <u-radio v-for="(item, index) in isRunList" :key="index" :name="item.value">{{item.name}}</u-radio>
              </u-radio-group>
              <view v-else>{{signForm.inspItemResult == 'true' ? '正常' : '异常'}}</view>
            </u-form-item>
            <u-form-item v-if="signForm.inspItemResult === 'false'" label="事件类型" label-width="100px" required right-icon="arrow-right" prop="eventType">
              <view
                v-if="!isTaskReview"
                style="width: 95%; display: flex"
                @click="selectEventType = true"
              >
                <u-input
                  v-model="signForm.eventType"
                  @click="selectEventType = true" />
                <u-select
                  v-model="selectEventType"
                  :list="eventTypeList"
                  @confirm="eventTypeConfirm"
                  title="事件类型"
                  confirm-text="确定"
                  cancel-text="返回"
                ></u-select>
              </view>
              <view v-else>{{signForm.eventType}}</view>
            </u-form-item>
            <u-form-item v-if="signForm.inspItemResult === 'false'" label="现场描述" label-width="100px">
              <u-input :disabled="isTaskReview"
                v-model="signForm.remark.text" />
            </u-form-item>
            <u-form-item v-if="signForm.inspItemResult === 'false'" label="初步处理" label-width="100px">
              <u-input  :disabled="isTaskReview"
                v-model="signForm.inspTaskDetailDesc.text" />
            </u-form-item>
            <u-form-item label="多媒体附件" label-width="100px" label-position="top" required prop="photoLength">
              <view>
                <sunui-upimg
                  @change="getImageInfo(arguments)"
                  :upimgPreview="upimgPreview"
                  :uploadAuto="true"
                  ref="upimg"
                  :header="headers"
                  uploadCount="3"
                  :addedWatermark="false"
                  :ifInspection="true"
                  :url="url.uploadFile"
                  :previewURL="previewURL"
                ></sunui-upimg>
              </view>
              <u-input style="width: 10px;" v-model="signForm.photoLength"  placeholder="" disabled />
            </u-form-item>
          </u-form>
        </scroll-view>
      </view>
    </view>
    <!-- 应急任务填报框 -->
    <view v-if="signShowEme" class="popup-view">
      <view class="popup-container">
        <view class="head">
          <text @click="onCancelEme">取消</text>
          <text>{{ featureEme.properties ?
            featureEme.properties.taskDirectives ?
              featureEme.properties.taskDirectives.inspItemName + "，请核实"
             : "事件，请核实"
             : "事件，请核实"
          }}</text>
          <text class="on-confirm" @click="onConfirmEme">确定</text>
        </view>
        <u-line color="#EEEEEE"/>
        <scroll-view scroll-y="true" class="scroll">
          <u-form :model="signFormEme" ref="signFormEme" class="sign-form">
            <u-form-item label="巡检结果" label-width="100px" required prop="inspItemResult">
              <u-radio-group :disabled="!!signFormEme.inspItemResult" v-model="signFormEme.inspItemResult">
                <u-radio v-for="(item, index) in isRunList" :key="index" :name="item.value">{{item.name}}</u-radio>
              </u-radio-group>
            </u-form-item>
            <u-form-item v-if="signFormEme.inspItemResult === 'false'" label="事件类型" label-width="100px" required right-icon="arrow-right" prop="eventType">
              <view
                style="width: 95%; display: flex"
                @click="selectEventType = true"
              >
                <u-input
                  v-model="signFormEme.eventType"
                  @click="selectEventType = true" />
                <u-select
                  v-model="selectEventType"
                  :list="eventTypeList"
                  @confirm="eventTypeConfirmEme"
                  title="事件类型"
                  confirm-text="确定"
                  cancel-text="返回"
                ></u-select>
              </view>
            </u-form-item>
            <u-form-item label="设施对象" label-width="100px" required  prop="geoJson" right-icon="arrow-right">
              <view style="width: 95%;display: flex;"
                @click="selectInspObj = true"
              >
                <u-input
                  v-model="signFormEme.geoJson"
                  @click="selectInspObj = true"/>
                <u-select
                  v-model="selectInspObj"
                  :list="geoJsonList"
                  @confirm="inspObjConfirm"
                  title="设施对象"
                  confirm-text="确定"
                  cancel-text="返回"
                ></u-select>
              </view>
            </u-form-item>
            <u-form-item label="反馈描述" label-width="100px">
              <u-input
                v-model="signFormEme.remark.text" />
            </u-form-item>
            <u-form-item v-if="signFormEme.inspItemResult === 'false'" label="初步处理" label-width="100px">
              <u-input
                v-model="signFormEme.inspTaskDetailDesc.text" />
            </u-form-item>
            <u-form-item label="多媒体附件" label-width="100px" label-position="top" required prop="photoLength">
              <view>
                <sunui-upimg
                  @change="getImageInfoEme(arguments)"
                  :upimgPreview="upimgPreviewEme"
                  :uploadAuto="true"
                  ref="upimgEme"
                  :header="headers"
                  :addedWatermark="false"
                  :url="url.uploadFile"
                  :previewURL="previewURL"
                ></sunui-upimg>
              </view>
              <u-input style="width: 10px;visibility:hidden;" v-model="signFormEme.photoLength"  placeholder="" disabled />
            </u-form-item>
          </u-form>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
// import bus from "../../views/inspectMap/utils/Bus.js";
// import MapComp from "@map/index.vue";
import * as turf from '@turf/turf'
// import SunuiUpimg from '../../components/sunui-upimg/sunui-upimg.vue';
export default {
  name: "all-task",
  components: {
    MapComp,
    SunuiUpimg
  },
  data() {
    return {
      currentPosition: null,
      userInfo: {},
      taskList: [],
      // 控制进度信息展开与收起
      ifExpand: false,
      ifRecording: false,
      endRecordShow: false,
      selectEventType: false,
      selectInspObj: false,
      eventTypeList: [],
      // 日常
      signShow: false,
      signForm: {
        inspItemResult: "true",
        files: [],
        eventType: null,
        inspItemId: "",
        remark: "",
        inspTaskDetailDesc: ""
      },
      // 应急
      geoJsonList: [],
      signShowEme: false,
      signFormEme: {
        inspItemResult: "",
        files: [],
        eventType: null,
        geoJson: null,
        remark: {
          text: "",
          voice: {}
        },
        inspTaskDetailDesc: {
          text: "",
          voice: {}
        }
      },
      taskDetail: {},
      engInfoDTO: {},
      keyDetail: {},
      isTaskReview: false,
      reportFooterShow: false,
      feature: {},
      featureEme: {},
      rangeList: [],
      // 应急
      range: {},
      keyDetailList: [],
      isRunList: [
        {
          name: "正常",
          value: "true"
        }, {
          name: "异常",
          value: "false"
        }
      ],
      rules: {
        inspItemResult: [
          {
            required: true,
            message: "请选择运作情况",
            trigger: ["change", "blur"]
          }
        ],
        photoLength: [
          {
            required: true,
            message: "请上传附件",
            trigger: ["change", "blur"]
          }
        ]
      },
      // 应急
      rules2: {
        inspItemResult: [
          {
            required: true,
            message: "请选择巡检结果",
            trigger: ["change", "blur"]
          }
        ],
        photoLength: [
          {
            required: true,
            message: "请上传附件",
            trigger: ["change", "blur"]
          }
        ]
      },
      previewURL: "/sys-storage/download_image?f8s=",
      upimgPreview: [],
      // 应急
      upimgPreviewEme: [],
      headers: {},
      url: {
        // 本页面使用到的url
        uploadFile: "sys-storage/upload",
        // findFile: "ecidi-cmp/file/cmpFileGroup/findFilesByGroupId",
      },
    }
  },
  created() {
    this.headers = {
      "Fawkes-Auth": uni.getStorageSync("Fawkes-Auth"),
    };
  },
  activated() {
    const isReportEvent = uni.getStorageSync("isReportEvent");
    if (!isReportEvent) {
      this.ifRecording = false;
      this.endRecordShow = false;
      this.selectEventType = false;
      this.signShow = false;
      // 应急
      this.signShowEme = false;
      this.refreshMap();
      this.refreshTaskList();
    } else {
      uni.setStorageSync("isReportEvent", false);
    }
    // bus.$on("reportInspEvent", (feature, isShow) => {
    //   if (isShow) {
    //     this.feature = feature;
    //   }
    //   this.reportFooterShow = isShow;
    // })
  },
  mounted() {
    this.userInfo = uni.getStorageSync("userInfo");
    bus.$on("startSignIn", (feature) => {
      console.log("feature=>", feature);
      this.startSignIn(feature);
    });
    // bus.$on("reportInspEvent", (feature, isShow) => {
    //   if (isShow) {
    //     this.feature = feature;
    //   }
    //   this.reportFooterShow = isShow;
    // });
    // 应急
    bus.$on("startEmeSignIn", (feature) => {
      this.startEmeSignIn(feature);
    })
    const that = this;
    this.$nextTick(() => {
      // /ops-inspection/api/inspectionTasks 查询多个巡检任务详情 ids = []
      const ids = this.$route.query.idList;
      this.getTaskList(ids);
      this.getEventTypeList();
      //  监听事件
      document.addEventListener("positioning", function(event) {
        const position = event.detail.currentPosition;
        that.currentPosition = position;
        if (!that.currentPosition) return;
        const param = {
          inspBusinessType: "ALL",
          pipeLevel: {
            pipeMax: null,
            pipeMin: null
          },
          ...that.currentPosition
        }
        that.$refs.mymap.setInspUserPosition(param);
      }, false);
    });
  },
  methods: {
    // 重置整个地图，替代销毁地图
    refreshMap() {
      try {
        // 清空所有的popup
        let classNames = document.getElementsByClassName("mapboxgl-popup-anchor-bottom");
        for (let i = classNames.length - 1; i >= 0; i--) {
          if (classNames[i] != null) {
            classNames[i].parentNode.removeChild(classNames[i]);
          }
        }
        // 清空所有关键点marker
        let ids = [];
        this.keyDetailList.forEach(item => {
          if (item.engInfoDTO) {
            ids.push(item.engInfoDTO.engId);
          }
        })
        this.$refs.mymap.mapInstance && this.$refs.mymap.removeKeyPointMarker(ids);
        // 清空所有应急巡检标志
        this.$refs.mymap.mapInstance && this.$refs.mymap.removeInspEmeMarkers(this.rangeList)
        // 清空巡检范围图层
        this.$refs.mymap.mapInstance.setSourceData('rangeSource', {
          type: "FeatureCollection",
          features: []
        });
        // 清空巡检管线图层
        this.$refs.mymap.mapInstance.setSourceData('initInspLineSource', {
          type: "FeatureCollection",
          features: []
        });
        this.$refs.mymap.mapInstance.setSourceData('unInspLineSource', {
          type: "FeatureCollection",
          features: []
        });
        this.$refs.mymap.mapInstance.setSourceData('inspLineSource', {
          type: "FeatureCollection",
          features: []
        });
        this.$refs.mymap.mapInstance.setSourceData('curInspLineSource', {
          type: "FeatureCollection",
          features: []
        });
        this.$refs.mymap.mapInstance.setSourceData('inspUserLineSource', {
          type: "FeatureCollection",
          features: []
        });
        this.$refs.mymap.mapInstance.setSourceData('inspUser', {
          type: "FeatureCollection",
          features: []
        });
        // 如果存在事件图层，就移除该图层
        this.$refs.mymap.map.getLayer("eventPointsLayer") && this.$refs.mymap.map.removeLayer("eventPointsLayer");
        this.$refs.mymap.map.getSource("eventPoints") && this.$refs.mymap.map.removeSource("eventPoints");
        this.$refs.mymap.removeEventObjMarker();
      } catch (error) {
        console.log(error);
      }
    },
    // 刷新任务列表
    refreshTaskList() {
      console.log("刷新任务列表！");
      let ids = [];
      this.keyDetailList.forEach(item => {
        if (item.engInfoDTO) {
          ids.push(item.engInfoDTO.engId);
        }
      })
      this.$refs.mymap.mapInstance && this.$refs.mymap.removeKeyPointMarker(ids);
      this.$refs.mymap.mapInstance && this.$refs.mymap.removeInspEmeMarkers(this.rangeList)
      const that = this;
      this.$nextTick(() => {
        const ids = this.$route.query.idList;
        this.getTaskList(ids);
        //  监听事件
        document.addEventListener("positioning", function(event) {
          const position = event.detail.currentPosition;
          that.currentPosition = position;
          if (!that.currentPosition) return;
          const param = {
            inspBusinessType: "ALL",
            pipeLevel: {
              pipeMax: null,
              pipeMin: null
            },
            ...that.currentPosition
          }
          that.$refs.mymap.setInspUserPosition(param);
        }, false);
      })
    },
    // 根据任务id数组ids获取任务列表
    async getTaskList(ids) {
      this.reportFooterShow = false;
      const res = await this.$api.getAction(`/ops-inspection/api/inspectionTasks`, {ids: ids});
      if (res.status && res.data) {
        this.taskList = res.data.map(item => {
          return {
            taskRestTime: this.getTaskRestTime(new Date(), new Date(item.inspectionTask.planEndTime)),
            completion: item.inspectionTask.completion * 100 || 0,
            ...item
          }
        });
        // this.taskDetail 和this.isTaskReview再全部执行中暂时无法处理
        this.keyDetailList = [];
        this.rangeList = [];
        try {
          const that = this;
          var timer = setInterval(function() {
            console.log("that.$refs.mymap.mapInstance.isOnLoad",that.$refs.mymap.isOnLoaded());
            if (that.$refs.mymap.isOnLoaded()) {
              clearInterval(timer);
              that.taskList.forEach(item => {
                let keyDetailList = item.keyDetailList;
                that.keyDetailList = that.keyDetailList.concat(keyDetailList);
                if (item.inspectionTask.inspTaskType === "日常巡检") {
                  let rangeList = item.rangeList.map(range => {
                    return {
                      inspBusinessType: item.inspectionTask.inspBusinessType,
                      pipeLevel: {
                        pipeMax: item.inspectionTask.pipeLevelMax,
                        pipeMin: item.inspectionTask.pipeLevelMin
                      },
                      ...range
                    }
                  });
                  that.rangeList = that.rangeList.concat(rangeList);
                  that.$refs.mymap.addRangeList(rangeList);
                  that.$refs.mymap.addKeyPoints(keyDetailList);
                } else {
                  let rangeList = item.rangeList.map(it => {
                    return {
                      restTime: that.getTaskRestTime(new Date(), new Date(item.inspectionTask.planEndTime)) || 0,
                      inspBusinessType: item.inspectionTask.inspBusinessType,
                      pipeLevel: {
                        pipeMax: item.inspectionTask.pipeLevelMax,
                        pipeMin: item.inspectionTask.pipeLevelMin
                      },
                      ...it
                    }
                  });
                  that.rangeList = that.rangeList.concat(rangeList);
                  that.$refs.mymap.addRangeList(rangeList, true);
                }
                const params = {
                  taskId: item.inspectionTask.taskId
                }
                that.getEventAll(params);
              })
              if (!that.currentPosition) return;
              const param = {
                inspBusinessType: "ALL",
                pipeLevel: {
                  pipeMax: null,
                  pipeMin: null
                },
                ...that.currentPosition
              }
              that.$refs.mymap.setInspUserPosition(param);
            }
          }, 500);
        } catch (e) {
          console.log(e);
        }
      }
    },
    // 获取巡检事件
    async getEventAll(params) {
      const res = await this.$api.getAction(
        "/yhsw-inspection/inspectionEvent/all",
        params
      );
      if (res.status) {
        let features = [];
        res.data.forEach((item) => {
          if (item.eventItemText) {
            const geom = JSON.parse(item.eventItemText);
            let feature = {
              geometry: geom.type === "Feature" ? geom.geometry : geom,
              properties: {}
            };
            this.$set(feature, "geometry", this.computeCenter2(feature.geometry));
            this.$set(feature, "id", item.id);
            this.$set(feature.properties, "eventType", item.eventType)
            // this.$set(feature, "eventType", item.eventType);
            // this.$refs.mymap.addInspEventMarker(feature);
            features.push(feature);
          }
        });
        this.$refs.mymap.addInspEventLayer(features);
      }
    },
    // 获取事件类型
    async getEventTypeList() {
      const params = {
        page: 1,
        size: 9999
      }
      const res = await this.$api.getAction("/ops-inspection/api/inspectionItem", params);
      if (res.status) {
        this.eventTypeList = res.data.list.map(item => {
          return {
            label: item.inspItemName,
            value: item.inspItemId,
            ...item
          }
        });
      }
    },
    // 获取图片信息
    getImageInfo(val) {
      if (val && val[0].length > 0) {
        this.signForm.files = val[0];
        let photoList = [];
        val[0].forEach((item) => {
          photoList.push(item.fileToken);
        });
        let temp = photoList.length + "";
        this.$set(this.signForm, "photoLength", temp);
      } else {
        this.$set(this.signForm, "photoLength", "");
      }
    },
    // 获取图片信息(应急)
    getImageInfoEme(val) {
      if (val && val[0].length > 0) {
        this.signFormEme.files = val[0];
        let photoList = [];
        val[0].forEach((item) => {
          photoList.push(item.fileToken);
        });
        let temp = photoList.length + "";
        this.$set(this.signFormEme, "photoLength", temp);
      } else {
        this.$set(this.signFormEme, "photoLength", "");
      }
    },
    // 开始记录
    startRecord() {
      this.ifRecording = true;
      uni.showToast({
        title: '开始记录',
        duration: 3000
      });
      console.log("启用定位");
      uniWebView.postMessage({
        data: {
          action: "start",
        },
      });
    },
    // 结束记录
    endRecord() {
      this.endRecordShow = true;
    },
    // 结束记录取消
    endRecordCancel() {
      this.endRecordShow = false;
    },
    // 结束记录取消
    async endRecordConfirm() {
      console.log("结束定位");
      uniWebView.postMessage({
        data: {
          action: "end",
        },
      });
      // 批量记录轨迹，无需使用完成任务的接口
      // const res = await this.$api.putAction(`/ops-inspection/api/inspectionTask/`, {});
      // if (res.status) {
        this.endRecordShow = false;
        this.ifRecording = false;
        uni.showToast({
          title: "结束记录",
          duration: 3000
        })
      // }
    },
    // 开始定位
    startLocation() {
      const position = this.currentPosition;
      console.log("click location", position);
      if (!position) return;
      const coord = [parseFloat(position.xCode), parseFloat(position.yCode)];
      this.$refs.mymap.flyTo({ position: coord, zoom: 18});
    },
    // 确认
    onConfirm() {
      console.log("click confirm");
      this.$refs.signForm.validate(valid => {
        if (valid) {
          console.log("验证通过");
          let copySignForm = this.deepClone(this.signForm);
          if (this.signForm.inspItemResult === "true" && this.signForm.inspItemReview != 3) {
            // 正常签到且inspItemReview不等于待复核状态
            copySignForm.inspTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            copySignForm.remark = JSON.stringify(copySignForm.remark);
            copySignForm.inspTaskDetailDesc = JSON.stringify(copySignForm.inspTaskDetailDesc);

            delete copySignForm.files;
            console.log("this.signForm==>", copySignForm);
            let payload = {
              engInfoDTO: this.keyDetail.engInfoDTO,
              files: this.signForm.files,
              inspectionTaskDetail: copySignForm
            }
            console.log("payload==>", payload);
            this.$api.postAction("/ops-inspection/api/signin", payload).then(res => {
              if (res.status) {
                console.log("res===>", res);
                uni.showToast({
                  title: "此关键点签到成功",
                  duration: 3000
                })
              }
            });
          } else if (this.signForm.inspItemResult === "false" && this.signForm.inspItemReview != 3) {
            // 异常并且关键点不是待复核状态，即为第一次巡检，且inspItemReview不等于待复核状态
            // 签到异常还要新增巡检事件，yhsw-inspection/inspectionEvent/insert
            copySignForm.inspTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            copySignForm.remark = JSON.stringify(copySignForm.remark);
            copySignForm.inspTaskDetailDesc = JSON.stringify(copySignForm.inspTaskDetailDesc);
            delete copySignForm.files;
            console.log("this.signForm==>", copySignForm);
            let payload = {
              engInfoDTO: this.keyDetail.engInfoDTO,
              files: this.signForm.files,
              inspItemId: this.signForm.inspItemId,
              inspectionTaskDetail: copySignForm
            }
            console.log("payload==>", payload);
            this.$api.postAction("/ops-inspection/api/signin", payload).then(res => {
              if (res.status) {
                console.log("res===>", res);
                uni.showToast({
                  title: "此关键点签到成功",
                  duration: 3000
                })
              }
            });
            // 巡检事件上报
            // 事件描述文件json "{\"dir\":\"2021-04/\",\"extName\":\"amr\",\"fileName\":\"20210413_111722.amr\",\"fileToken\":\"21fe7e24367f434a1cf36658f95cd47f\",\"objectName\":\"2021-04/21fe7e24367f434a1cf36658f95cd47f.amr\",\"size\":\"11472\",\"version\":\"0\"}"
            const geom = this.engInfoDTO.engGeom;
            let uploadFiles = [];
            if (this.signForm.inspTaskDetailDesc.voice.fileName) {
              uploadFiles.push(this.signForm.inspTaskDetailDesc.voice);
            }
            uploadFiles = uploadFiles.concat(this.signForm.files);
            const preliminaryHandleFile = JSON.stringify(uploadFiles);
            const eventPayload = {
              conclusion: copySignForm.eventType,
              eventDescribe: this.signForm.remark.text,
              eventSource: "inspection_event_source_inspection",
              eventType: copySignForm.eventType,
              eventTypeId: copySignForm.inspItemId,
              inspBusinessType: this.taskDetail.inspBusinessType,
              officeId: this.taskDetail.inspOrgId,
              preliminaryHandle: this.signForm.inspTaskDetailDesc.text,
              preliminaryHandleFile: preliminaryHandleFile,
              eventDescribeFile: this.signForm.remark.voice.fileToken ? JSON.stringify(this.signForm.remark.voice) : "",
              regionItemText: this.keyDetail.engInfoDTO.engGeom,
              taskId: this.taskDetail.taskId,
              engId: this.keyDetail.engInfoDTO.engId,
              eventItemText: this.keyDetail.engInfoDTO.engGeom,
              lng: geom.coordinates[0],
              lat: geom.coordinates[1],
              reporterId: this.userInfo.id,
              reporterName: this.userInfo.userFullname
            }
            console.log("eventPayload==>", eventPayload);
            this.$api.postAction("/yhsw-inspection/inspectionEvent/insert", eventPayload).then(res => {
              if (res.status) {
                console.log("res.data event==>", res.data);
              }
            })
          } else if (this.signForm.inspItemReview == 3) {
            // 关键点处于待复核状态
            // 复核接口ops-inspection/api/updateInspectionDetail
            copySignForm.remark = JSON.stringify(copySignForm.remark);
            copySignForm.inspTaskDetailDesc = JSON.stringify(copySignForm.inspTaskDetailDesc);
            delete copySignForm.files;
            console.log("this.signForm==>", copySignForm);
            let payload = {
              engInfoDTO: this.keyDetail.engInfoDTO,
              files: this.signForm.files,
              inspItemId: this.signForm.inspItemId,
              inspectionTaskDetail: copySignForm
            }
            console.log("payload2==>", payload);
            this.$api.putAction("/ops-inspection/api/updateInspectionDetail", payload).then(res => {
              if (res.status) {
                console.log("res===>", res);
              }
            })
          }
          this.signShow = false;
          this.refreshTask();
        } else {
          console.log("验证失败");
        }
      })
    },
    // 取消
    onCancel() {
      console.log("click cancel");
      this.signShow = false;
    },
    // 取消(应急)
    onCancelEme() {
      this.signShowEme = false;
    },
    // 日常签到
    startSignIn(feature) {
      // 利用feature来判断是否处于25m范围内，如果处于，可以进行签到，否则不能进行签到
      // 
      const position = this.currentPosition;
      if (!position) return;
      const coord = [parseFloat(position.xCode), parseFloat(position.yCode)];
      const point = turf.point(coord);
      const engGeom = feature.engGeom;
      const buffered = turf.buffer(engGeom, 0.025, 'kilometers');
      const isInBuffer = turf.inside(point, buffered);
      if (!isInBuffer) {
        uni.showToast({
          title: "未处于该关键点范围内",
          duration: 3000
        })
        return;
      }
      console.log("feature==>", feature);
      this.engInfoDTO = feature;
      this.keyDetail = this.keyDetailList.find(item => item.engInfoDTO.engId === this.engInfoDTO.engId);
      console.log("signIn", this.keyDetail);
      this.signForm = {
        files: [],
        eventType: ""
      };
      this.signForm.files = this.keyDetail.inspectionTaskDetailDTO.files;
      this.upimgPreview = this.signForm.files.map((item) => {
        return {
          uploadFile: {
            savePath: item.fileToken,
          },
          ...item
        };
      });
      this.signForm = this.deepClone(Object.assign(this.signForm, this.keyDetail.inspectionTaskDetailDTO.inspectionTaskDetail));
      this.signForm.eventType = this.eventTypeList.find(item => item.value === this.signForm.inspItemId).label;
      if (this.signForm.remark) {
        this.signForm.remark = JSON.parse(this.signForm.remark);
      } else {
        this.signForm.remark = {
          text: "",
          voice: {}
        }
      }
      if (this.signForm.inspTaskDetailDesc) {
        this.signForm.inspTaskDetailDesc = JSON.parse(this.signForm.inspTaskDetailDesc);
      } else {
        this.signForm.inspTaskDetailDesc = {
          text: "",
          voice: {}
        }
      }

      console.log("signForm", this.signForm);
      // 如果当前的关键点属于待复核状态，可以显示弹框，否则不显示弹框
      if (!this.isTaskReview || (this.isTaskReview && this.signForm.inspItemReview == 3)) {
      // if (this.isTaskReview) {
        this.signShow = true;
        this.$nextTick(() => {
          this.$refs.signForm.setRules(this.rules);
        })
      } else {
        this.signShow = false;
      }

    },
    // 应急填报
    startEmeSignIn(feature) {
      console.log("feature==>", feature);
      this.featureEme = feature;
      const geom = this.computeCenter(this.featureEme);
      try {
        if (this.featureEme.geometry.type === "Polygon") {
          //如果是范围，定位当前巡检人员的位置附近的数据
          if (this.currentPosition) {
            const position = this.currentPosition;
            const coord = [parseFloat(position.xCode), parseFloat(position.yCode)];
            const point = turf.point(coord);
            this.getInspDataInRange(point);
          } else {
            this.geoJsonList = [];
          }
        } else {
          // 查询当前签到位置范围内的数据
          this.getInspDataInRange(geom);
        }

      } catch (e) {
        console.log(e);
      }
      console.log("geoJsonList==>", this.geoJsonList);
      // 第一种寻找当前range,根据taskRangerName来匹配
      // this.range = this.rangeList.find();
      // 第二种，根据feature.id来匹配
      this.rangeList.forEach(item => {
        if (item.taskRangerGeom) {
          const geom = JSON.parse(item.taskRangerGeom);
          if (geom.id === feature.id) {
            this.range = item;
          }
        }
      })
      console.log("this.range==>", this.range);
      
      this.signFormEme.inspTaskDetailDesc = {
        text: "",
        voice: {}
      }
      this.signFormEme.files = [];
      this.signFormEme = this.deepClone(Object.assign(this.signFormEme, this.range));
      this.signFormEme.remark = {
        text: "",
        voice: {}
      }
      console.log("this.signFormEme==>", this.signFormEme);
      this.signFormEme.taskRangerGeom = this.featureEme;
      this.signFormEme.eventType = this.eventTypeList.find(item => item.value === this.signFormEme.inspItemId).label;
      // 如果已经上报，且上报结果正常
      if (this.signFormEme.inspItemResult === "true") {
        uni.showToast({
          title: "结果已录入，无法再次提交",
          duration: 3000
        })
        return;
      }
      this.signShowEme = true;
      this.$nextTick(() => {
        this.$refs.signFormEme.setRules(this.rules2);
      })
    },
    // 事件类型选择确认
    eventTypeConfirm(event) {
      console.log("event==>", event);
      this.$set(this.signForm, "eventType", event[0].label);
      this.signForm.inspItemId = event[0].value;
    },
    // 事件类型选择确认(应急)
    eventTypeConfirmEme(event) {
      console.log("event==>", event);
      this.$set(this.signFormEme, "eventType", event[0].label);
      this.signFormEme.inspItemId = event[0].value;
    },
    // 巡检对象确定
    inspObjConfirm(obj) {
      console.log("obj==>", obj);
      this.$set(this.signFormEme, "geoJson", obj[0].label);
      this.$set(this.signFormEme, "gjz", obj[0].value);
      this.getEngPropertyVal(this.signFormEme.gjz);
    },
    // 深拷贝
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },
    // 计算中心点
    computeCenter(feature) {
      let position;
      if (feature.geometry.type === 'Polygon') {
        const center = turf.center(feature.geometry);
        position = center.geometry;
      } else if (feature.geometry.type === 'LineString') {
        const center = turf.center(feature.geometry);
        position = center.geometry;
      } else if (feature.geometry.type === 'Point') {
        position = feature.geometry;
      }
      return position;
    },
    // 计算中心点
    computeCenter2(feature) {
      let position;
      if (feature.type === 'Polygon') {
        const center = turf.center(feature);
        position = center.geometry;
      } else if (feature.type === 'LineString') {
        const center = turf.center(feature);
        position = center.geometry;
      } else if (feature.type === 'Point') {
        position = feature;
      }
      return position;
    },
    // 根据关键字查询
    async getEngPropertyVal(gjz) {
      const params = {
        value: gjz
      }
      const res = await this.$api.getAction("/ops-navigation/api/engPropertyValue", params);
      if (res.status) {
        console.log("res==>", res);
        if (!res.data) {
          uni.showToast({
            title: res.message,
            duration: 3000
          })
        }
        this.engInfoDTO = res.data;
      }
    },
    // 查询身边X米的工程对象
    getInspDataInRange(position) {
      this.$refs.mymap.getInspDataInRange(position).then(res => {
        console.log("====>res",res);
        if (res) {
          this.geoJsonList = res.map(item => {
            return {
              label: item.properties.pipetype + item.properties.gjz,
              value: item.properties.gjz,
              ...item
            }
          })
        }
      })
    },
    // 计算剩余时间
    getTaskRestTime(current, end) {
      let curTime = new Date(current);
      let endTime = new Date(end);
      let diff = endTime.getTime() - curTime.getTime();
      if (diff >= 0) {
        let sec = diff / 1000;
        return sec;
      } else {
        return 0;
      }
    },
    // 日常任务上报事件
    reportEvent(feature) {
      this.reportFooterShow = false;
      this.$router.push({
        path: "/pages/inspectionManage/add-event",
        query: {
          taskId: this.taskDetail.taskId,
          feature: feature,
          rangeList: this.rangeList,
          taskDetail: this.taskDetail
        }
      })
    }
  },
  beforeDestroy() {
    bus.$off("startSignIn");
    // bus.$off("reportInspEvent");
    bus.$off("startEmeSignIn");
  },
  // 返回到列表页面
  onBackPress() {
    this.$refs.mymap.mapInstance && this.$refs.mymap.mapInstance.destoryMap();
    this.$refs.mymap.mapInstance = null;
    uni.navigateTo("/pages/projectManagement/projectListPage");
    return true;
  },
  onNavigationBarButtonTap: function(e) {

  }
}
</script>
<style lang="scss" scoped>
.task-map {
  .progress {
    width: calc(100% - 30px);
    margin: 5px 15px;
    position: fixed;
    top: 40px;
    height: 200px;
    overflow-y: scroll;
    &-collapse {
      background-color: #ffffff;
      padding: 5px 10px;
      box-shadow: 0px 4px 11px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
      .progress-collapse-box {
        width: 100%;
        .pro-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .pro-text {
          line-height: 30px;
          float: left;
          margin-right: 10px;
          width: 120px;
        }
        .gress {
          line-height: 30px;
          margin-right: 0px !important;
        }
      }
    }
    &-expand {
      .progress-expand-box {
        box-shadow: 0px 4px 11px 0px rgba(0,0,0,0.2);
        border-radius: 5px;
        background-color: #ffffff;
        padding: 5px 10px;
        width: 100%;
        float: left;
        margin-bottom: 10px;
        .pro-title {
          font-weight: 600;
        }
        .pro-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .pro-text {
          line-height: 30px;
          float: left;
          margin-right: 10px;
          width: 120px;
        }
        .gress {
          line-height: 30px;
          margin-right: 0px !important;
        }
      }
    }

    &-control {
      width: 20%;
      position: relative;
      height: 25px;
      left: 48%;
      bottom: -15px;
      .expand {
        color: #2a83e6;
        background-color: #ffffff;
        padding: 2px 5px;
        border-radius: 5px;
      }
    }
  }
  .footer {
    width: inherit;
    padding: 20px 15px;
    color: #333333;
    background-color: #ffffff;
    height: 64px;
    z-index: 4;
    position: fixed;
    bottom: 0px;
    &-content {
      float: left;
    }
    &-btn {
      float: right;
      width: 100px;
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
  .start-record {
    width: inherit;
    height: 62px;
    background-color: #fff;
    z-index: 3;
    bottom: 0px;
    position: fixed;
    .start-button {
      height: 44px;
      margin: 10px 15px;
      border-radius: 22px;
      font-size: 16px
    }
  }
  .tool-box {
    position: fixed;
    width: 40px;
    height: 100px;
    right: 15px;
    bottom: 60px;
    .route {
      width: 40px;
      height: 40px;
      margin-bottom: 10px;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0px 4px 11px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
      &-image {
        margin: 8px;
        width: 24px;
        height: 24px;
      }
    }
    .location {
      width: 40px;
      height: 40px;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0px 4px 11px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
      &-image {
        margin: 8px;
        width: 24px;
        height: 24px;
      }
    }
  }
  .popup-view {
    height: 43%;
    width: 100%;
    position: fixed;
    bottom: 0px;
    z-index: 10;
    transition: bottom 3.0s ease-in;
    background-color: #fff;
    .popup-container {
      padding: 15px;
      .head {
        padding: 0px 5px;
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        .on-confirm {
          color: #2a83e6;
        }
        margin-bottom: 10px;
      }
      .scroll {
        height: 230px;
        .sign-form {
          margin: 8px;
        }
      }
    }
  }
  .confirm-pop {
    .title {
      border-left: 4px solid #2a83e6;
      margin: 5px;
      padding-left: 10px;
    }
    .content {
      border-top: 0.5px solid rgba(128, 128, 128, 0.322);
      width: 210px;
      padding: 24px;
      text-align: center;
      background-color: #fff;
      &-view {
        font-size: 16px;
      }
      .confirm-btn {
        margin-top: 40px;
        justify-items: center;
        .popup-btn {
          float: left;
          width: 60px;
          height: 32px;
          border-radius: 5px;
          &-l{
            margin-left: 10px;
            margin-right: 10px;
          }
          &-r{
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      }
    }
  }

}
</style>
