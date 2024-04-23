<template>
  <div class="inspection">
    <fm-nav-bar :title="title" left-arrow @click-left="goToInspectionManage()">
      <template #right>
        <img
          src="@/assets/img/pump/inspection-icon-nfc.png"
          class="inspection-right"
          alt=""
          @click="handMovementNFC()"
        />
      </template>
    </fm-nav-bar>

    <!-- 状态栏 -->
    <inspection-status
      :PatrolData="PatrolData"
      @hiddenDangerClick="hiddenDangerShow"
      @setShowType="
        (showType) => {
          this.statusContentShow = showType
        }
      "
    />
    <!-- 巡检状态详情信息 -->
    <status-content :PatrolData="PatrolData" :show="statusContentShow" />

    <div class="inspection-tabs" v-if="modelType === 'list'">
      <div class="inspection-tabs-item" :class="{ active: activeIndex === 1 }" @click="activeIndex = 1">未巡检</div>
      <div class="inspection-tabs-item" :class="{ active: activeIndex === 2 }" @click="activeIndex = 2">已巡检</div>
    </div>
    <div class="inspection-model">
      <!-- 地图模块 -->
      <InspectionMap :PatrolData="PatrolData" v-if="modelType === 'map'" />

      <!-- 巡检点列表 -->
      <InspectionList
        ref="inspectionList"
        v-if="modelType === 'list'"
        :disabled="disabled"
        :patrolStatus="PatrolData && PatrolData.patrolStatus"
        :patrolPointResultList="patrolPointResultList"
        :activeIndex='activeIndex'
        @hiddenDangerClick="hiddenDangerShow"
      />
    </div>

    <!-- 底部按钮栏 -->
    <inspection-submit
      ref="inspectionSubmit"
      :PatrolData="PatrolData"
      :modelType="modelType"
      @isDisabled="isDisabled"
      @modelTypeChange="
        (newModelType) => {
          modelType = newModelType
        }
      "
    />

    <!-- 异常隐患列表弹框 -->
    <inspection-hidden-popup ref="inspectionHiddenPopup" :hiddenDangerList="hiddenDangerList" />
  </div>
</template>

<script>
import InspectionStatus from './components/InspectionStatus.vue'
import StatusContent from './components/StatusContent'
import InspectionSubmit from './components/InspectionSubmit.vue'
import InspectionList from './components/InspectionList.vue'
import InspectionMap from './components/InspectionMap.vue'
import InspectionHiddenPopup from './components/InspectionHiddenPopup.vue'

import { patrol, getToken, ticketList } from './api'
export default {
  components: {
    InspectionStatus,
    StatusContent,
    InspectionSubmit,
    InspectionList,
    InspectionMap,
    InspectionHiddenPopup,
  },
  data() {
    return {
      title: '',
      PatrolData: {},
      patrolPointResultList: [],
      disabled: true, //请先点击开始或继续按钮

      statusContentShow: false,

      createWorkUrl: '',

      hiddenDangerList: [],
      modelType: 'list', //list列表，map地图

      trackDTOS: [], //巡检图标

      // 当前巡检员所处位置
      currentPosition: null,

      activeIndex: 1,
    }
  },

  created() {
    this.getPatrol()
  },
  mounted() {},
  beforeDestroy() {
    this.savePatrolData()
  },

  //进入守卫:通过路由规则,进入该组件时被调用
  // async beforeRouteLeave(to, from, next) {
  //   if (to.path === '/pump/inspectionManage') {
  //     await this.$refs.inspectionSubmit.isUnsubmitted()
  //     next()
  //   } else {
  //     next() //放行
  //   }
  // },

  methods: {
    //返回巡检管理页面
    goToInspectionManage() {
      this.$router.push('/pump/inspectionManage')
    },

    //获取工单详情
    async createWork(data, type) {
      console.log(data, type)
      let workOrderIdList = []
      //单个巡检点工单
      if (type === 'item') {
        data?.patrolItemsResultList?.forEach((item) => {
          item.workOrderId && workOrderIdList.push(item.workOrderId)
        })
      } else {
        //所有巡检点工单
        data?.patrolPointResultList?.forEach((item) => {
          item?.patrolItemsResultList?.forEach((data) => {
            data.workOrderId && workOrderIdList.push(data.workOrderId)
          })
        })
      }

      const { accessToken } = await getToken(this.$storage.get('access_token'))

      const { resultData } = await ticketList(accessToken, workOrderIdList)
      this.hiddenDangerList = resultData
    },

    //是否禁止进入巡检项
    isDisabled(config) {
      this.disabled = config
    },

    //获取用户巡检点
    async getPatrol() {
      let { taskId } = this.$store.state.pump.urlQuery

      let PatrolData
      try {
        const { data } = await patrol(taskId)
        PatrolData = data
      } catch (error) {
        PatrolData = JSON.parse(this.$storage.get('PatrolData'))
      }

      let { patrolRouteName, patrolPointResultList } = PatrolData

      this.PatrolData = PatrolData
      this.patrolPointResultList = patrolPointResultList
      this.title = patrolRouteName

      this.isUnsubmitted()
    },

    //保存巡检详情信息
    savePatrolData() {
      this.$storage.set('PatrolData', JSON.stringify(this.PatrolData))
    },

    //弹出刷卡界面
    handMovementNFC() {
      if (this.disabled) return
      this.$refs.inspectionList.handMovementNFC()
    },

    //检查是否有未提交项
    isUnsubmitted() {
      let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))
      this.patrolPointResultList?.forEach((item, index) => {
        storageItemDataList?.forEach((data) => {
          item.id === data.id ? (this.patrolPointResultList[index].isUnsubmitted = true) : null
        })
      })
    },

    //隐患上报列表显示
    async hiddenDangerShow(item, type) {
      await this.createWork(item, type)

      if (this.hiddenDangerList.length === 0) return
      this.$refs.inspectionHiddenPopup.show()
    },
  },
}
</script>

<style scoped lang="less">
.inspection {
  position: relative;
  height: 100%;
  background: #f5f7f9;

  .inspection-right {
    width: 48px;
    height: 48px;
  }

  .box-time-img-time {
    width: 32px;
    height: 32px;
  }

  .inspection-model {
    overflow: scroll;
    height: calc(100% - 420px);
  }
}

.inspection-tabs {
  display: flex;
  font-size: 32px;
  font-weight: 600;

  .inspection-tabs-item {
    flex: 1;
    display: flex;
    justify-content: center;
    color: #000;
    align-items: center;
    padding: 10px;
  }

  .active {
    color: #fff;
    background-color: #1b67d8;
  }
}
</style>
