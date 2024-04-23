<template>
    <div class="content">
      <div class="head">
        <!-- 分段 -->
        <!-- <u-subsection
          mode="subsection"
          :list="subSectionlist" 
          :current="current" 
          active-color="#2A83E6"
          @change="onChange"></u-subsection> -->
      </div>
      <div class="table">
        <fm-list
          style="height:70%; max-height: 20rem;"
        >
          <!-- <u-table border-color="#fff"> -->
            <!-- 表头 -->
            <!-- <u-tr>
              <u-th v-for="(item, index) in theaderList" :key="index" :width="index === 2 ? '30%' : '35%'">
                {{item}}
              </u-th>
            </u-tr> -->
            <!-- 表内容 -->
            <!-- <u-tr v-for="(item, index) in pointList" :key="index">
              <u-td>
                <view class="num">
                  {{item.num === 'no_equipment' ? '-' : item.num}}
                </view>
              </u-td>
              <u-td>
                <view class="num">
                  {{item.name}}
                </view>
              </u-td>
              <u-td class="fixed" width="30%">
                <view v-if="current === 0" :class="item.isInBuffer ? 'btn' : 'disabled'" @click="handleReport(item.engId, item.isInBuffer)">上报</view>
                <u-tag v-else class="tag" :text="item.result" :type=" item.result === '正常' ?'success' :'error'" :closeable="false"></u-tag>
              </u-td>
            </u-tr>
          </u-table> -->
          <fm-empty v-if="pointList.length <= 0" description="暂无数据" mode="list"></fm-empty>
        </fm-list>
      </div>
    </div>
  <!-- <PullupBar class="pull-bar" :initTop="initTop" :showClose="true" @close="$emit('close')">
  </PullupBar> -->
</template>
<script>
// import PullupBar from "@comp/pullup-bar/index2.vue";
import * as turf from '@turf/turf'
export default {
  name: 'keypoint-list',
  components: {
    // PullupBar
  },
  props: {
    keyPointList: {
      type: Array,
      default: () => []
    },
    position: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      initTop: '70%',
      subSectionlist: [
        {
          name: '未上报关键点'
        },{
          name: '已上报关键点'
        }
      ],
      current: 0,
      result: {
        'true': '正常',
        'false': '异常'
      }
    }
  },
  computed: {
    theaderList() {
      return this.current === 0 ?
        [
          "对象编号","对象名称","操作"
        ]
        :[
          "对象编号","对象名称","巡检结果"
        ];
    },
    pointList() {
      const { keyPointList, result } = this;
      const list = keyPointList.map(item => {
        return {
          engId: item?.engInfoDTO.engId,
          num: item?.engInfoDTO.engNum,
          name: item?.engInfoDTO.engName,
          result: item?.inspectionTaskDetailDTO?.inspectionTaskDetail?.inspItemResult,
          isInBuffer: this.isInKeyPointBuffer(item?.engInfoDTO?.engGeom),
          distance: this.getDistance(item?.engInfoDTO?.engGeom)
        }
      })
      const report = list.filter(item => item.result !== null).map(it => {
        return {
          ...it,
          result: result[it.result]
        }
      });
      const unreport = list.filter(item => item.result === null);
      const sortList = unreport.sort((a, b) => a.distance - b.distance)
      return this.current === 0 ? sortList : report;
    }
  },
  methods: {
    onChange(value) {
      this.current = value;
    },
    handleReport(id, isInBuffer) {
      if (isInBuffer) {
        this.$emit("report-keypoint", id)
      }
    },
    // 判断是否在关键点巡检范围内
    isInKeyPointBuffer(engGeom) {
      if (!engGeom) return false;
      const { position } = this;
      if (!position) {
        return false;
      }
      const coord = [ parseFloat(position.longitude), parseFloat(position.latitude)];
      const point = turf.point(coord);
      const geom = typeof engGeom === "string" ? JSON.parse(engGeom) : engGeom;
      const buffered = turf.buffer(geom, 0.030, "kilometers");
      const isInBuffer = turf.inside(point, buffered);
      return isInBuffer;
    },
    // 计算当前点位与所有关键点之间的距离
    getDistance(engGeom) {
      if (!engGeom) return Number.MAX_VALUE;
      const { position } = this;
      if (!position) {
        return Number.MAX_VALUE;
      }
      const coord = [ parseFloat(position.longitude), parseFloat(position.latitude)];
      const point = turf.point(coord);
      const geom = typeof engGeom === "string" ? JSON.parse(engGeom) : engGeom;
      const distance =  turf.distance(
        point, turf.point(geom.coordinates)
      ) * 1000;
      return distance;
    }
  }
}
</script>
<style lang="scss" scoped>

.pull-bar {
  .content {
    background-color: #fff;
    margin: 0.2rem 0.55rem;
    // box-sizing: content-box;
    .head {
      position: relative;
    }
    .table {
      margin-top: 1rem;
      .u-td {
        height: 2.7rem;
      }
      .num {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        display: block;
        overflow: hidden;
        // white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
      .fixed {
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          color: #2A83E6;
          margin: auto;
        }
        .disabled {
          color: grey;
          margin: auto;
        }
        .tag {
          box-sizing: content-box;
        }
      }
    }
  }
}

</style>


