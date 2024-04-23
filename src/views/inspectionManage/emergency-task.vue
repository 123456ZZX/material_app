<!--
 * @Description: 
 * @Author: wei_qx@hdec.com
 * @Date: 2021-04-23 08:49:00
 * @LastEditor: wei_qx@hdec.com
 * @LastEditTime: 2021-05-02 18:29:01
-->
<template>
  <div class="task-map full-width">
    <!-- 地图 -->
    <MapComp ref="mymap" :ifInspection="true" :inspBusinessType="inspBusinessType" class="full-height"></MapComp>
    <!-- 定位 -->
    <div class="tool-box">
      <div class="location" @click="startLocation">
        <fm-image class="location-image" src="@/static/img/inspection/location.png"></fm-image>
      </div>
    </div>
    <!-- 应急任务填报框 -->
    <div v-if="signShow" class="popup-view">
      <div class="popup-container">
        <div class="head">
          <text @click="onCancel">取消</text>
          <text>{{ feature.properties ?
            feature.properties.taskDirectives ?
             feature.properties.taskDirectives.inspItemName + "，请核实" 
             : "事件，请核实"
             : "事件，请核实"
            }}</text>
          <text class="on-confirm" @click="onConfirm">确定</text>
        </div>
        <!-- <u-line color="#EEEEEE"/> -->
        <fm-list class="scroll">
          <fm-form :model="signForm" ref="signForm" class="sign-form">
            <fm-field label="巡检结果" label-width="100px" v-model="signForm.inspItemResult" required />
            <fm-field v-if="signForm.inspItemResult === 'false'" v-model="signForm.eventType" label="事件类型" label-width="100px" required right-icon="arrow-right" prop="eventType" />
            <fm-field label="设施对象" v-model="signForm.geoJson" label-width="100px" required  prop="geoJson" right-icon="arrow-right" />
            <fm-field label="反馈描述" v-model="signForm.remark.text" label-width="100px" />
            <fm-field v-if="signForm.inspItemResult === 'false'" v-model="signForm.inspTaskDetailDesc.text" label="初步处理" label-width="100px" />
            <fm-uploader label="多媒体附件" label-width="100px" label-position="top" required prop="photoLength" />
          </fm-form>
        </fm-list>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../../views/inspectMap/utils/Bus.js";
import MapComp from "../../views/inspectMap/index.vue";
import request from '@/utils/request'
import { inspectionItem, inspectEvent, inspectionEventAll } from './api'
import * as turf from '@turf/turf'
export default {
  name: "emergency-task",
  components: {
    MapComp,
    // SunuiUpimg
  },
  data() {
    return {
      inspBusinessType: "",
      currentPosition: null,
      userInfo: {},
      engInfoDTO: null,
      ifRecording: false,
      selectEventType: false,
      selectInspObj: false,
      eventTypeList: [],
      geoJsonList: [],
      signShow: false,
      signForm: {
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
      feature: {},
      rangeList: [],
      range: {},
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
      headers: {},
      url: {
        // 本页面使用到的url
        uploadFile: "sys-storage/upload",
        // findFile: "ecidi-cmp/file/cmpFileGroup/findFilesByGroupId",
      },
    }
  },
  created() {
    this.headers = this.$storage.get('access_token')
  },
  activated() {
    this.selectEventType= false;
    this.signShow= false;
    this.userInfo = localStorage.getItem("userInfo");
    // this.$refs.mymap.mapInstance && this.$refs.mymap.mapInstance.destoryMap();
    // this.$refs.mymap.mapInstance = null;
    // this.$refs.mymap.initMap();
    this.refreshMap();
    const that = this;
    this.$nextTick(() => {
      const id = this.$route.query.taskId || "1382190161063841793" // 应急供水
      this.inspBusinessType = this.$route.query.inspBusinessType;
      this.$refs.mymap.changePipeTileLayerByBusiness(this.inspBusinessType);
      this.getTaskById(id);
      //  监听事件
      document.addEventListener("positioning", function(event) {
        const position = event.detail.currentPosition;
        that.currentPosition = position;
        if (!that.currentPosition) return;
        const param = {
          inspBusinessType: that.taskDetail.inspBusinessType,
          pipeLevel: {
            pipeMax: that.taskDetail.pipeLevelMax,
            pipeMin: that.taskDetail.pipeLevelMin
          },
          ...that.currentPosition
        }
        that.$refs.mymap.setInspUserPosition(param);
      }, false);
    })
    this.getEventTypeList();
  },
  mounted() {
    this.userInfo = localStorage.getItem("userInfo");
    bus.$on("startEmeSignIn", (feature) => {
      this.startEmeSignIn(feature);
    })
    bus.$on("reportInspEvent", (feature, isShow) => {
      // 从地图中选择设施对象
      if (isShow) {
        const feat = feature;
        const objLabel = feature.properties.pipetype+ feat.properties.gjz;
        const objVal = feature.properties.gjz;
        this.$set(this.signForm, "geoJson", objLabel);
        this.$set(this.signForm, "gjz", objVal);
        this.getEngPropertyVal(this.signForm.gjz);
      } else {
        this.$set(this.signForm, "geoJson", "");
        this.$set(this.signForm, "gjz", "");
        this.engInfoDTO = null;
      }
    })
    const that = this;
    this.$nextTick(() => {
      const id = this.$route.query.taskId || "1382190161063841793" // 应急供水
      this.inspBusinessType = this.$route.query.inspBusinessType;
      this.getTaskById(id);
      this.getEventTypeList();
      //  监听事件
      document.addEventListener("positioning", function(event) {
        const position = event.detail.currentPosition;
        that.currentPosition = position;
        if (!that.currentPosition) return;
        const param = {
          inspBusinessType: that.taskDetail.inspBusinessType,
          pipeLevel: {
            pipeMax: that.taskDetail.pipeLevelMax,
            pipeMin: that.taskDetail.pipeLevelMin
          },
          ...that.currentPosition
        }
        that.$refs.mymap.setInspUserPosition(param);
      }, false);
    })
  },
  methods: {
    // 刷新地图
    refreshMap() {
      try {
        // 清空所有的popup
        let classNames = document.getElementsByClassName("mapboxgl-popup-anchor-bottom");
        for (let i = classNames.length - 1; i >= 0; i--) {
          if (classNames[i] != null) {
            classNames[i].parentNode.removeChild(classNames[i]);
          }
        }
        this.$refs.mymap.mapInstance && this.$refs.mymap.removeInspEmeMarkers(this.rangeList);
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
    // 刷新任务
    refreshTask() {
      console.log("刷新应急任务！");
      this.$refs.mymap.mapInstance && this.$refs.mymap.removeInspEmeMarkers(this.rangeList);
      this.$nextTick(() => {
        const id = this.$route.query.taskId || "1382190161063841793";
        this.getTaskById(id);
      })
    },
    // 根据任务id获取任务
    async getTaskById(id) {
      const res = await request({
        url: `ops-inspection/api/inspectionTask/${id}`
      });
      if (res.status) {
        this.taskDetail = res.data.inspectionTask;
        this.rangeList = res.data.rangeList.map(item => {
          return {
            restTime: this.getTaskRestTime(new Date(), new Date(this.taskDetail.planEndTime)) || 0,
            inspBusinessType: this.taskDetail.inspBusinessType,
            pipeLevel: {
              pipeMax: this.taskDetail.pipeLevelMax,
              pipeMin: this.taskDetail.pipeLevelMin
            },
            ...item
          }
        })
        try {
          const that = this;
          var timer = setInterval(function() {
            // 30s后取消
            setTimeout(() => {
              clearInterval(timer);
            }, 30000);
            if (that.$refs.mymap && that.$refs.mymap.isOnLoaded()) {
              clearInterval(timer);
              that.$refs.mymap.addRangeList(that.rangeList, true);
              const params = {
                taskId: id
              }
              that.getEventAll(params);
              if (!that.currentPosition) return;
              const param = {
                inspBusinessType: that.taskDetail.inspBusinessType,
                pipeLevel: {
                  pipeMax: that.taskDetail.pipeLevelMax,
                  pipeMin: that.taskDetail.pipeLevelMin
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
      const res = await inspectionEventAll(params);
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
      const res = await inspectionItem(params);
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
        val[0].forEach((item, index) => {
          photoList.push(item.fileToken);
        });
        let temp = photoList.length + "";
        this.$set(this.signForm, "photoLength", temp);
      } else {
        this.$set(this.signForm, "photoLength", "");
      }
    },
    // 开始定位
    startLocation() {
      const position = this.currentPosition;
      if (!position) return;
      const coord = [parseFloat(position.xCode), parseFloat(position.yCode)];
      this.$refs.mymap.flyTo({ position: coord, zoom: 18});
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
    // 确认
    onConfirm() {
      this.$refs.signForm.validate(valid => {
        if (valid) {
          console.log("验证通过");
          if (!this.engInfoDTO)  {
            Toast({
              message: "设施对象数据不存在",
              duration: 3000
            });
            return;
          }
          // app端应急任务上报 /ops-inspection/api/inspectEvent
          let copySignForm = this.deepClone(this.signForm);
          if (this.signForm.inspItemResult === "true") {
            const geom = this.computeCenter(this.feature);
            copySignForm.inspTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            copySignForm.remark = JSON.stringify(copySignForm.remark);
            copySignForm.inspTaskDetailDesc = JSON.stringify(copySignForm.inspTaskDetailDesc);
            this.$set(copySignForm, "engId", this.engInfoDTO.engId);
            delete copySignForm.files;
            let payload = {
              engInfoDTO: this.engInfoDTO.infoDTO,
              geoJson: this.engInfoDTO.infoDTO.engGeom,
              files: this.signForm.files,
              inspectionTaskDetail: copySignForm
            }
            inspectEvent(payload).then(res => {
              if (res.status) {
                Toast({
                  message: "填报成功",
                  duration: 3000
                });
                this.signShow = false;
                this.refreshTask();
              }
            });
          } else if (this.signForm.inspItemResult === "false") {
            const geom = this.computeCenter(this.feature);
            copySignForm.inspTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            copySignForm.remark = JSON.stringify(copySignForm.remark);
            copySignForm.inspTaskDetailDesc = JSON.stringify(copySignForm.inspTaskDetailDesc);
            this.$set(copySignForm, "engId", this.engInfoDTO.engId);
            delete copySignForm.files;
            let payload = {
              engInfoDTO: this.engInfoDTO.infoDTO,
              geoJson: this.engInfoDTO.infoDTO.engGeom,
              files: this.signForm.files,
              inspectionTaskDetail: copySignForm
            }
            this.$api.postAction("/ops-inspection/api/inspectEvent", payload).then(res => {
              if (res.status) {
                Toast({
                  message: "填报成功",
                  duration: 3000
                });
              }
            });
            // 巡检事件上报
            // 事件描述文件json "{\"dir\":\"2021-04/\",\"extName\":\"amr\",\"fileName\":\"20210413_111722.amr\",\"fileToken\":\"21fe7e24367f434a1cf36658f95cd47f\",\"objectName\":\"2021-04/21fe7e24367f434a1cf36658f95cd47f.amr\",\"size\":\"11472\",\"version\":\"0\"}"
            // const geom = this.computeCenter(this.feature);
            // const geom = this.engInfoDTO.engGeom;
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
              eventDescribeFile: JSON.stringify(this.signForm.remark.voice),
              regionItemText: this.engInfoDTO.infoDTO.engGeom,
              // regionItemText: JSON.stringify(copySignForm.taskRangerGeom),
              taskId: this.taskDetail.taskId,
              engId: this.engInfoDTO ? this.engInfoDTO.engId : undefined, // 设施对象
              eventItemText: this.engInfoDTO.infoDTO.engGeom,
              // eventItemText: JSON.stringify(copySignForm.taskRangerGeom),
              lng: geom.coordinates[0], // 
              lat: geom.coordinates[1], // 可能为polygon范围
              reporterId: this.userInfo.id,
              reporterName: this.userInfo.userFullname
            }
            this.$api.postAction("/yhsw-inspection/inspectionEvent/insert", eventPayload).then(res => {
              if (res.status) {
                this.signShow = false;
                this.refreshTask();
              }
            })
          }
        } else {
          console.log("验证失败");
        }
      })
    },
    // 取消
    onCancel() {
      this.signShow = false;
    },
    // 签到
    startEmeSignIn(feature) {
      this.feature = feature;
      const geom = this.computeCenter(this.feature);
      try {
        if (this.feature.geometry.type === "Polygon") {
          //如果是范围，定位当前巡检人员的位置附近的数据
          if (this.currentPosition) {
            const position = this.currentPosition;
            const coord = [parseFloat(position.xCode), parseFloat(position.yCode)];
            const point = turf.point(coord);
            this.getInspDataInRange(point);
          } else {
            this.geoJsonList = [];
            Toast({
              message: "获取不到巡检员位置",
              duration: 3000
            })
          }
        } else {
          console.log("this.feature==>", this.feature);
          // 查询当前签到位置范围内的数据
          this.getInspDataInRange(geom);
        }
      } catch (e) {
        console.log(e);
      }
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
      this.signForm.inspTaskDetailDesc = {
        text: "",
        voice: {}
      }
      this.signForm.files = [];
      this.signForm = this.deepClone(Object.assign(this.signForm, this.range));
      this.signForm.remark = {
        text: "",
        voice: {}
      }
      this.signForm.taskRangerGeom = this.feature;
      this.signForm.eventType = this.eventTypeList.find(item => item.value === this.signForm.inspItemId).label;
      // 如果已经上报，且上报结果正常
      if (this.signForm.inspItemResult === "true") {
        this.signShow = false;
        Toast({
          message: "结果已录入，无法再次提交",
          duration: 3000
        })
        return;
      }
      this.signShow = true;
      this.$nextTick(() => {
        this.$refs.signForm.setRules(this.rules);
      })
    },
    // 事件类型选择确认
    eventTypeConfirm(event) {
      if (event && event.length > 0) {
        this.$set(this.signForm, "eventType", event[0].label);
        this.$set(this.signForm, "inspItemId", event[0].value);
      }
    },
    // 巡检对象确定
    inspObjConfirm(obj) {
      if (obj && obj.length > 0) {
        this.$set(this.signForm, "geoJson", obj[0].label);
        this.$set(this.signForm, "gjz", obj[0].value);
        this.getEngPropertyVal(this.signForm.gjz);
      } else {
        Toast({
          message: "暂无巡检对象",
          duration: 1500
        })
      }

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
      const res = await engPropertyValue(params);
      if (res.status) {
        console.log("res==>", res);
        if (!res.data) {
          Toast({
            message: res.message,
            duration: 3000
          })
        }
        this.engInfoDTO = res.data;
      }
    },
    // 查询身边X米的工程对象
    getInspDataInRange(position) {
      const params = {
        inspBusinessType: this.taskDetail.inspBusinessType,
        pipeLevel: {
          pipeMax: this.taskDetail.pipeLevelMax,
          pipeMin: this.taskDetail.pipeLevelMin
        },
        ...position
      }
      this.$refs.mymap.getInspDataInRange(params).then(res => {
        console.log("====>res",res);
        if (res) {
          this.geoJsonList = res.map(item => {
            return {
              label: item.properties.pipetype + item.properties.gjz,
              value: item.properties.gjz,
              ...item
            }
          })
          if (this.geoJsonList.length <= 0) {
            Toast({
              message: "周围未找到设施对象",
              duration: 3000
            })
          }
        }
      })
    }
  },
  beforeDestroy() {
    bus.$off("startEmeSignIn");
  },
  onNavigationBarButtonTap: function(e) {

  }
}
</script>
<style lang="scss" scoped>
.task-map {
  .tool-box {
    position: fixed;
    width: 40px;
    height: 100px;
    right: 15px;
    bottom: 10px;
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

}
</style>
