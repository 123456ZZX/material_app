<!--
 * @Description: 
 * @Author: wei_qx@hdec.com
 * @Date: 2021-04-23 10:49:01
 * @LastEditor: wei_qx@hdec.com
 * @LastEditTime: 2021-10-18 15:12:15
-->
<template>
  <view class="task-map full-width">
    <MapComp ref="mymap" :ifInspection="true" :inspBusinessType="inspBusinessType" :ifDetail="true" class="full-height"></MapComp>
    <!-- 日常任务详情 -->
    <PullupBar class="daily-pull-bar" :initTop="initTop" @close="closePullup">
      <view class="title">
        <view class="title-l">{{planStartTime}}</view>
        <view class="title-c">-</view>
        <view class="title-r">{{planEndTime}}</view>
      </view>
      <view class="content">
        <view>
          <view class="cir-progress">
            <u-circle-progress
              border-width="20"
              :percent="completion"
              :duration="1500"
              active-color="#40BB5A"
            >{{completion.toFixed(2)+'%'}}
            </u-circle-progress>
            <view class="cir-title">完成率</view>
          </view>
          <view class="cir-progress">
            <u-circle-progress
              border-width="20"
              :percent="keyPointUpRate"
              :duration="1500"
              active-color="#2A83E6"
            >{{keyPointUpRate.toFixed(2)+'%'}}
            </u-circle-progress>
            <view class="cir-title">关键点上报率</view>
          </view>
          <view class="cir-progress">
            <u-circle-progress
              border-width="20"
              :percent="100"
              :duration="1500"
              active-color="#FFF5E8"
            > {{eventNums}}
            </u-circle-progress>
            <view class="cir-title">上报事件</view>
          </view>
        </view>
      </view>
    </PullupBar>
    <!-- 应急任务详情 -->
    <PullupBar class="emergency-pull-bar" :initTop="initTop2" @close="closePullup2">
      <view class="content">
        <view class="content-time">
          <view class="content-time-header">派发时间</view>
          <view>{{planStartTime}}</view>
        </view>
        <view class="content-time">
          <view class="content-time-header">截止时间</view>
          <view>{{planEndTime}}</view>
        </view>
        <view class="content-time">
          <view class="content-time-header">完成时间</view> 
          <view :class="taskDetail.taskResult === '逾期' ? 'error' : ''" style="float:left;">{{taskEndTime}}</view>
          <u-tag style="float: right;" :text="taskDetail.taskResult" :type="taskDetail.taskResult === '逾期' ? 'error' : 'primary'"></u-tag>
        </view>
        <u-divider half-width="150" :use-slot="false"/>
        <view class="result">{{taskDetail.remark}}</view>
      </view>
    </PullupBar>
    <!-- 遮罩层 -->
    <view v-if="isMask" class="mask"></view>
  </view>
</template>
<script>
// import MapComp from "@map/index.vue";
import * as turf from '@turf/turf'
// import PullupBar from "@comp/pullup-bar/index2.vue";
export default {
  name: "task-detail",
  components: {
    MapComp,
    PullupBar
  },
  data() {
    return {
      initTop: "70%",
      initTop2: "70%",
      taskDetail: {},
      inspBusinessType: "",
      rangeList: [],
      planStartTime: "",
      planEndTime: "",
      taskStartTime: "",
      taskEndTime: "",
      completion: 0,
      keyPointUpRate: 0,
      eventNums: 0,
      eventList: [],
      isMask: false
    }
  },
  activated() {
    this.$refs.mymap.mapInstance && this.$refs.mymap.mapInstance.destoryMap();
    this.$refs.mymap.mapInstance = null;
    this.$refs.mymap.initMap();
    this.$nextTick(() => {
      const id = this.$route.query.taskId;
      this.inspBusinessType = this.$route.query.inspBusinessType;
      this.getTaskById(id);
    })
  },
  mounted() {
    this.$refs.mymap.mapInstance && this.$refs.mymap.mapInstance.destoryMap();
    this.$refs.mymap.mapInstance = null;
    this.$refs.mymap.initMap();
    this.$nextTick(() => {
      const id = this.$route.query.taskId; 
      this.inspBusinessType = this.$route.query.inspBusinessType;
      this.getTaskById(id);
    })
  },
  methods: {
    // 通过任务id获取任务
    async getTaskById(id) {
      uni.showLoading({
        title: "地图加载中..."
      })
      this.isMask = true;
      const res = await this.$api.getAction(`/ops-inspection/api/inspectionTask/${id}`, {});
      // 处理已巡检管线的接口
      const recordLines = await this.$api.getAction(
        "/ops-inspection/api/recordedPipeLine",
        {
          taskId: id,
        }
      );
      let lines = [];
      if (recordLines.status) {
        lines = recordLines.data.map((item) => {
          return {
            guid: item,
          };
        });
      }
      if (res.status) {
        console.log("res==>", res);
        this.taskDetail = res.data.inspectionTask;
        let calibers = undefined;
        let caliberVOS = undefined;
        if (JSON.parse(this.taskDetail.pipeLevel)[0].caliber) {
          calibers = JSON.parse(this.taskDetail.pipeLevel).map(item => {return item.caliber}).join(',');
        } else {
          caliberVOS = JSON.parse(this.taskDetail.pipeLevel).map(item => {return {pipMax:item.pipeMax, pipMin: item.pipeMin}});
        }
        this.rangeList = res.data.rangeList.map((range) => {
          return {
            taskId: id,
            inspBusinessType: this.taskDetail.inspBusinessType,
            pipeLevel: {
              pipeMax: this.taskDetail.pipeLevelMax,
              pipeMin: this.taskDetail.pipeLevelMin,
            },
            caliberVOS: caliberVOS ? caliberVOS : undefined,
            calibers: calibers ? calibers :undefined,
            endDate: this.$moment(res.data.inspectionPlan.updateTime).format('yyyy/MM/DD'),
            ...range,
          };
        });
        console.log("this.$refs", this.$refs.mymap);
        // if (this.taskDetail.inspTaskType === "日常巡检") {
          this.initTop2 = "100%";
          this.initTop = "70%";
          uni.setNavigationBarTitle({
            title: this.taskDetail.taskName || "日常任务详情"
          });
          this.planStartTime = this.taskDetail.planStartTime ? this.$moment(this.taskDetail.planStartTime).format("YYYY年MM月DD日 HH:mm") : "";
          this.planEndTime = this.taskDetail.planEndTime ? this.$moment(this.taskDetail.planEndTime).format("YYYY年MM月DD日 HH:mm") : "";
          console.log("time==>", this.planStartTime, this.planEndTime, this.taskDetail)
          this.$refs.mymap.mapOnLoad(() => {
            this.$refs.mymap.addRangeList(this.rangeList);
            this.$refs.mymap.addKeyPoints(res.data.keyDetailList, true);
            const params = {
              taskId: id
            }
            this.getEventNum(params);
            this.getEventAll(params);
            this.$refs.mymap.addInspRecordTileLineSource(lines, this.taskDetail.completion);
          })
          this.completion = this.taskDetail.completion * 100 || 0;
          this.keyPointUpRate = res.data.keyPointUpRate * 100 || 0;

        uni.hideLoading();
        if (this.isMask) {
          this.isMask = false;
        }
      } else {
        uni.hideLoading();
        if (this.isMask) {
          this.isMask = false;
        }
        uni.showToast({
          title: "网络状态较差，加载任务失败",
          icon: 'warn',
          duration: 3000
        })
      }
    },
    closePullup() {
      this.initTop = "100%";
    },
    closePullup2() {
      this.initTop2 = "100%";
    },
    // 计算中心点
    computeCenter(feature) {
      let position;
      if (feature.type === 'Polygon' || feature.type === 'MultiPolygon') {
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
            this.$set(feature, "geometry", this.computeCenter(feature.geometry));
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
    // 获取巡检事件数量
    async getEventNum(params) {
      const res = await this.$api.getAction("/yhsw-inspection/inspectionEvent/count", params);
      if (res.status) {
        this.eventNums = res.data;
      }   
    }
  }
}
</script>
<style lang="scss" scoped>
.task-map {
  // 遮罩层
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 950;
  }
  .daily-pull-bar {
    .title {
      width: inherit;
      margin: 0.55rem 0.83rem;
      &-l {
        float: left;
        color: #555555;
      }
      &-c {
        float: left;
        margin: 0rem 1.11rem;
        color: #555555;
      }
      &-r {
        color: #555555;
      }
    }
    .content {
      background-color: #ffffff;
      .cir-progress {
        float: left;
        width: 33%;
        text-align: center;
        .cir-title {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .emergency-pull-bar {
    .content {
      background-color: #ffffff;
      margin: 0.55rem 0.83rem;
      .content-time {
        width: inherit;
        margin: 0.55rem 0rem;
        .content-time-header {
          float: left;
          margin-right: 1.11rem;
        }
        .error {
          color: #FA3534;
        }
        .result {
          width: inherit;
        }
      }
    }
  }
}
</style>