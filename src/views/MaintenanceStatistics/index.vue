<template>
  <div class="mainContainer">
    <fm-nav-bar title="运维统计" left-arrow @click-left="$router.go(-1)" />
    <!-- 巡检、养护、事件切换按钮组件 -->
    <ChangeBizType @buttonChange="buttonChange" :buttonArray="buttonArray" />
    <div class="contentContainer">
      <InspectionComponent :nowCheckedBtn="nowCheckedBtn" ref="InspectionComponent" />
      <MaintenanceComponent :nowCheckedBtn="nowCheckedBtn" ref="MaintenanceComponent" />
      <EventComponent :nowCheckedBtn="nowCheckedBtn" ref="EventComponent" />
    </div>
  </div>
</template>

<script>
import ChangeBizType from './components/ChangeBizType.vue'
import InspectionComponent from './components/InspectionComponent.vue'
import MaintenanceComponent from './components/MaintenanceComponent.vue'
import EventComponent from './components/EventComponent.vue'
export default {
  name: 'maintenanceStatistics',
  components: {
    ChangeBizType,
    InspectionComponent,
    MaintenanceComponent,
    EventComponent,
  },
  data() {
    return {
      buttonArray: ['巡检', '养护', '事件'],
      nowCheckedBtn: '',
    }
  },
  mounted() {
    this.buttonChange(this.buttonArray[0])
  },
  methods: {
    buttonChange(btn) {
      this.nowCheckedBtn = btn
      this.$nextTick(() => {
        let InspectionComponent = this.$refs.InspectionComponent.$el // 获取巡检组件dom
        let MaintenanceComponent = this.$refs.MaintenanceComponent.$el // 获取养护组件dom
        let EventComponent = this.$refs.EventComponent.$el // 获取事件组件dom
        if (btn === '巡检') {
          InspectionComponent.style.left = '0'
          MaintenanceComponent.style.left = '100%'
          EventComponent.style.left = '200%'
        } else if (btn === '养护') {
          InspectionComponent.style.left = '-100%'
          MaintenanceComponent.style.left = '0'
          EventComponent.style.left = '100%'
        } else if (btn === '事件') {
          InspectionComponent.style.left = '-200%'
          MaintenanceComponent.style.left = '-100%'
          EventComponent.style.left = '0'
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.mainContainer {
  width: 100%;
  height: 100%;
  // background: url('~@/assets/img/maintenanceStatistics/bg.png') top no-repeat;
  background-color: #ffffff;

  .contentContainer {
    position: relative;
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: calc(100% - 235px);
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #f1f3f6;
    box-shadow: inset 0px -1px 0px 0px #e5e5e5;
  }
}

// 顶部标题背景色
/deep/.fm-nav-bar__content {
  background-color: transparent;
}

/deep/.fm-hairline--bottom::after {
  border-bottom-width: 0;
}

/deep/.fm-nav-bar__title {
  color: #191919 !important;
}

/deep/.fm-nav-bar {
  background: transparent;
}

/deep/ .fm-nav-bar .fm-icon {
  color: #191919 !important;
}
</style>
