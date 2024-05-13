<template>
  <div class="main">
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="物资管理" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <div class="content">

      <img :src="bgSrc" class="bgImg" :style="{ '--bgSrcLeft': bgSrcLeft }" />

      <fm-tabs v-model="selectedTab" @tab-click="changeType" line-width="60px">
        <fm-tab name="验收" :label="check"></fm-tab>
        <fm-tab name="入库" :label="inWarehouse"></fm-tab>
        <fm-tab name="出库" :label="outWarehouse"></fm-tab>
        <fm-tab name="盘库" :label="makeWarehouse"></fm-tab>
      </fm-tabs>

      <div class="main-container">
        <template>

            <fm-list :offset="0">
              <div>
                <div>
                  <InfoCardCheck  cardType="not" v-if="selectedTab == '验收'" ></InfoCardCheck>
                  <InfoCardInWarehouse  @execute="execute" v-if="selectedTab == '入库'"></InfoCardInWarehouse>
                  <InfoCardOutWarehouse  @execute="execute" v-if="selectedTab == '出库'"></InfoCardOutWarehouse>
                  <InfoCardMakeWarehouse  @execute="execute" v-if="selectedTab == '盘库'"></InfoCardMakeWarehouse>
                </div>
              </div>
            </fm-list>

        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Search,
  Toast,
  Cell,
  CellGroup,
  PullRefresh,
  List,
  Sidebar,
  SidebarItem,
  SwipeCell,
  Button,
  NoticeBar,
  Icon,
  Dialog,
} from 'fawkes-mobile-lib'


import InfoCardCheck from './Check/InfoCardCheck.vue'
import InfoCardInWarehouse from './InWarehouse/InfoCardInWarehouse.vue'
import InfoCardMakeWarehouse from './MakeWarehouse/InfoCardMakeWarehouse.vue'
import InfoCardOutWarehouse from './OutWarehouse/InfoCardOutWarehouse.vue'

export default {
  name: 'Inspection',
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Toast.name]: Toast,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    InfoCardCheck,
    InfoCardInWarehouse,
    InfoCardMakeWarehouse,
    InfoCardOutWarehouse,
  },
  data() {
    return {
      selectedTab: '验收',
      check: '验收',
      inWarehouse: '入库',
      outWarehouse: '出库',
      makeWarehouse: '盘库',
      toast: null
    }
  },

  computed: {
    bgSrcLeft() {
      let left = ''
      switch (this.selectedTab) {
        case '验收':
          left = '0px'
          break

        case '入库':
          left = '25%'
          break

        case '出库':
          left = '50%'
          break

        default:
          left = '75%'
          break
      }
      return left
    },
    bgSrc() {
      let src = ''
      switch (this.selectedTab) {
        case '验收':
          src = require('@/assets/img/pump/tab-left@2x.png')
          break

        case '盘库':
          src = require('@/assets/img/pump/tab-right@2x.png')
          break

        default:
          src = require('@/assets/img/pump/tab-center@2x.png')
          break
      }
      return src
    },
  },
  methods: {
    // tab切换回调
    changeType(name, title) {
      // this.toast = Toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      //   duration: 0
      // })
      this.selectedTab = name
      // this.onRefresh()
    },
    //执行
    execute(item, isNew = false) {
      // if (item.taskType === '人巡' || item.taskType === '车巡') {
      //   this.$router.push({
      //     name: 'InspectionManage',
      //     query: {
      //       name: '执行',
      //       taskId: item.id,
      //       isNew: isNew,
      //       taskType: item.taskType
      //     },
      //   })
      //   return
      // }
      // if (item.taskType === '管廊' || item.taskType === '管廊巡检') {
      //   // 任务数据存储在本地，避免数据缺失
      //   localStorage.setItem('galleryTaskData', null)
      //   localStorage.setItem('galleryTaskData', JSON.stringify(item))
      //   this.$router.push({
      //     name: 'GalleryInspection',
      //   })
      // }
    },

  },
}
</script>
<style lang="less" scoped>
// ecf4ff
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}

.main {
  background-color: #055ffc !important;
  height: 100%;
  .main-bg {
    position: absolute;
    width: 100%;
  }
  .content {
    margin-top: 40px;
    position: relative;
    background: #d4e8fc;
    height: calc(100% - 46px);
    width: 100%;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    .bgImg {
      position: absolute;
      height: 100px;
      z-index: 1;
      top: -20px;
      left: var(--bgSrcLeft);
    }

    .warn-icon {
      position: absolute;
      top: 20px;
      width: 20px;
      height: 20px;
      background-color: #ff4d4f;
      border-radius: 50%;
      z-index: 99;
    }
    .warnMyNotStart {
      left: 350px;
    }
    .warnWorking {
      left: 520px;
    }
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
  color: #FFFFFF !important;
}

// tab切换栏
// 更改背景色
/deep/.fm-tabs__nav--line {
  background-color: #d4e8fc;
  display: flex;
  align-items: flex-end;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

/deep/.fm-nav-bar {
  background: transparent;
}

/deep/ .fm-nav-bar .fm-icon {
  color: #FFFFFF !important;
}

// 每个tab高度变低
/deep/.fm-tab {
  line-height: 72px;
  // height: 80%;
  // border-radius: 20px 20px 0px 0px;
  // // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
  // background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

// 取消选中横条
/deep/.fm-tabs__line {
  width: 0 !important;
}

// 选中效果
/deep/.fm-tab--active {
  // 梯形样式
  // height: 0;
  // width: 100px;
  // border-width: 0 20px 90px 20px;
  // border-style: none solid solid;
  // border-color: transparent transparent rgb(141, 247, 155);

  // height: 100%;
  font-size: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #191919;
}

// 选中tab的文字样式
/deep/.fm-tab--active .fm-tab__text--ellipsis {
  // margin-top: 90px;
  z-index: 1;
}

// select选择框
.selectStyle {
  display: flex;
  justify-content: space-between;
  width: 690px;
  margin: 24px auto 12px;
}

.main-container {
  height: calc(100% - 208px);
  overflow: auto;
  background-color: #d4e8fc;
}

/* 暂无数据begin */
.no-data-img {
  margin: 200px 95px 0 95px;
}

.no-data-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-text-descripe {
  font-size: 32px;
  font-weight: 400;
  color: #999999;
}

/* 暂无数据end */
/* 解决下拉时，数据和全部加载的提示文案超出列表元素不显示的问题 */
/deep/ .fm-pull-refresh {
  overflow: visible;
}

.task-container /deep/ .fm-nav-bar__content {
  height: 88px;
}

.task-container /deep/ .fm-nav-bar__title {
  font-size: 36px;
  color: #FFFFFF !important;
  font-weight: 600;
}

.task-container /deep/ .fm-nav-bar .fm-icon {
  color: #027aff !important;
}

.task-container /deep/ .fm-nav-bar__arrow {
  font-size: 48px;
}

.fm-sidebar {
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: 2px solid #ebedf0;
}

.fm-cell::after {
  border: none;
}

.fm-cell-group {
  margin-top: 24px;
}

/deep/ .fm-swipe-cell__right {
  display: flex;
  align-items: center;
}

/deep/ .fm-button--square {
  border-radius: 50%;
  width: 106px;
  height: 106px;
  padding: 0;
  margin-right: 20px;
}

.bottom {
  position: fixed;
  bottom: 24px;
  right: 44px;
  background-color: #027aff;
  width: 102px;
  height: 102px;
  line-height: 102px;
  border-radius: 50%;
  color: #fff;
  z-index: 1000;
  text-align: center;
}
</style>
