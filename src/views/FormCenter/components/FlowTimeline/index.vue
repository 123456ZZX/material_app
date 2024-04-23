<template>
  <div>
    <div v-if="flowList == null" class="noMore">暂无数据</div>
    <timeline v-else timeline-theme="#E8EAEB">
      <template v-for="(item, index2) in flowList">
        <timeline-item
          :hollow="true"
          :key="index2"
          :lineColor="circleColorChange(item.approveStateName)"
        >
          <div class="flow-box">
            <div class="flow-box-time">
              <div>{{ item.approveDate }}</div>
              <!-- <div>{{item.endTime.split(" ")[1]}}</div> -->
            </div>
            <div class="flow-box-title">{{ item.taskName }}</div>
            <div class="flow-box-state" :class="styleChange(item.approveStateName)">
              {{ item.approveStateName ? item.approveStateName : '待办' }}
            </div>
            <div class="flow-box-line"></div>
            <div class="flow-box-content">
              <div class="flow-box-point"></div>
              <span>处理人</span>
              <div class="name handle">{{ item.asigneeName }}</div>
            </div>
            <div class="flow-box-content">
              <div class="flow-box-point"></div>
              <span>审批意见</span>
              <!-- v-html="item.taskComment" -->
              <!-- <span v-html="item.taskComment"
                    class="handle"></span>-->
            </div>
            <div class="flow-box-task-comment">{{ item.comment }}</div>
          </div>
        </timeline-item>
      </template>
    </timeline>
  </div>
</template>
<script>
import { Timeline, TimelineItem } from 'vue-cute-timeline'
import { getApprovalList } from './api'
export default {
  components: {
    Timeline,
    TimelineItem,
  },
  props: {
    taskId: {
      type: String,
      default: '',
    },
    bizId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      flowList: [], // 流程列表
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getApprovalList()
  },
  methods: {
    // 获取流程记录
    getApprovalList() {
      const params = {}
      if (this.taskId) {
        params.taskId = this.taskId
      }
      if (this.bizId) {
        params.bizId = this.bizId
      }
      if (Object.keys(params).length > 0) {
        getApprovalList(params).then((res) => {
          this.flowList = res.data
        })
      }
    },

    styleChange(obj) {
      switch (obj) {
        case '提交':
          return 'progress-submit'
        // break
        case '同意':
          return 'progress-agree'
        // break
        case '退回':
          return 'progress-back'
        // break
        case '结束':
          return 'progress-finish'
        // break
        default:
          return 'progress-wait'
        // break
      }
    },
    circleColorChange(obj) {
      switch (obj) {
        case '提交':
          return '#FFCC00'
        // break
        case '同意':
          return '#4CD964'
        // break
        case '退回':
          return '#FF3B30'
        // break
        case '结束':
          return '#D1D1D6'
        // break
        default:
          return '#5AC8FA'
        // break
      }
    },
  },
}
</script>
<style scoped>
.noMore {
  color: #999;
  font-size: 32px;
  line-height: 100px;
  text-align: center;
}
.progress-wait {
  color: #5ac8fa !important;
  background: #cdeefd;
}
.progress-submit {
  color: #ff9500 !important;
  background: #ffefb2;
}
.progress-agree {
  color: #4cd964 !important;
  background: #c9f3d0;
}
.progress-back {
  color: #ff3b30 !important;
  background: #ffc4c0;
}
.progress-finish {
  color: #d1d1d6 !important;
  background: #f1f1f2;
}
.timeline-item {
  padding-bottom: 0px;
  margin: 76px 0 0 36px;
}
/deep/ .timeline-circle {
  left: -48px;
}
.flow-box-state {
  line-height: 44px;
}
.flow-box-title {
  margin-bottom: 0;
  position: relative;
  bottom: 22px;
}
.flow-box-content {
  line-height: 33px;
  display: flex;
  align-items: center;
}
.flow-box-content span {
  flex: 1;
}
.flow-box-content .name {
  margin-right: 20px;
}
.flow-box {
  margin-right: 0;
  padding-right: 18px;
  /* border-radius: 2px; */
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 9px 0px rgba(140, 158, 177, 0.18);
  border-radius: 3px;
  border: 1px solid rgba(238, 238, 238, 1);
}
.flow-box-task-comment {
  width: 92%;
  height: 140px;
  /*background: rgba(245, 246, 250, 1);*/
  border: solid 1px #f2f2f3;
  border-radius: 3px;
  opacity: 0.7;
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
  line-height: 30px;
  padding: 30px;
  word-break: break-all;
  overflow-y: auto;
  margin-top: 10px;
}
</style>
