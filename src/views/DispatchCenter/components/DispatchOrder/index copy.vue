<template>
  <div class="main">
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="调度指令" left-arrow @click-left="$router.go(-1)" @click-right="addNew">
      <template #right>
        <fm-popover
          :visible.sync="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <i class="fm-icon fm-icon-plus"></i>
          </template>
        </fm-popover>
      </template>
    </fm-nav-bar>
    <div class="content">
      <div style="overflow-y: scroll;">
        <div class="classify">
          <div class="classify-item" :style="selected == 'all' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('all')">
            <div class="item">
              <span class="key" :style="selected == 'all' ? { 'color': '#1B67D8' } : {}">全部</span>
              <span class="value" :style="selected == 'all' ? { 'color': '#1B67D8' } : {}">{{ allLength }}</span>
            </div>
          </div>
          <div class="classify-item" :style="selected == 'stage' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('stage')">
            <div class="item">
              <span class="key" :style="selected == 'stage' ? { 'color': '#1B67D8' } : {}">暂存</span>
              <span class="value" :style="selected == 'stage' ? { 'color': '#1B67D8' } : {}">{{ stageLength }}</span>
            </div>
          </div>
          <!-- <div class="classify-item" :style="selected == 'waitAccept' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('waitAccept')">
            <div class="item">
              <span class="key" :style="selected == 'waitAccept' ? { 'color': '#1B67D8' } : {}">待接单</span>
              <span class="value" :style="selected == 'waitAccept' ? { 'color': '#1B67D8' } : {}">{{ waitAcceptLength }}</span>
            </div>
          </div>
          <div class="classify-item" :style="selected == 'waitDeal' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('waitDeal')">
            <div class="item">
              <span class="key" :style="selected == 'waitDeal' ? { 'color': '#1B67D8' } : {}">待处理</span>
              <span class="value" :style="selected == 'waitDeal' ? { 'color': '#1B67D8' } : {}">{{ waitDealLength }}</span>
            </div>
          </div> -->
          <div class="classify-item" :style="selected == 'hasSend' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('hasSend')">
            <div class="item">
              <span class="key" :style="selected == 'hasSend' ? { 'color': '#1B67D8' } : {}">已发出</span>
              <span class="value" :style="selected == 'hasSend' ? { 'color': '#1B67D8' } : {}">{{ hasSendLength }}</span>
            </div>
          </div>
          <div class="classify-item" :style="selected == 'hasReceive' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('hasReceive')">
            <div class="item">
              <span class="key" :style="selected == 'hasReceive' ? { 'color': '#1B67D8' } : {}">已接单</span>
              <span class="value" :style="selected == 'hasReceive' ? { 'color': '#1B67D8' } : {}">{{ hasReceiveLength }}</span>
            </div>
          </div>
          <div class="classify-item" :style="selected == 'done' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('done')">
            <div class="item">
              <span class="key" :style="selected == 'done' ? { 'color': '#1B67D8' } : {}">已完成</span>
              <span class="value" :style="selected == 'done' ? { 'color': '#1B67D8' } : {}">{{ doneLength }}</span>
            </div>
          </div>
          <div class="classify-item" :style="selected == 'hasBack' ? { 'background': '#DDE8F9' } : {}" @click="changeSelect('hasBack')">
            <div class="item">
              <span class="key" :style="selected == 'hasBack' ? { 'color': '#1B67D8' } : {}">已退单</span>
              <span class="value" :style="selected == 'hasBack' ? { 'color': '#1B67D8' } : {}">{{ hasBackLength }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择框 -->
      <div class="selectStyle">
        <Select :selectData="inspDateTypeList" :selValue="dateType" color="white" @getValue="getValue"></Select>
        <Select :selectData="stationList" :selValue="inspTaskType" color="white" @getValue="getValue"></Select>
      </div>
      <div class="main-container">
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <!-- 无数据 -->
            <template v-if="orderList.length == 0 && !loading">
              <div class="no-data-img">
                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
              </div>
              <div class="no-data-text">
                <div class="no-data-text-descripe">暂无数据</div>
              </div>
            </template>
            <!-- 列表 -->
            <fm-list  v-else v-model="loading" :finished="finished" finished-text="我们是有底线的" @load="onLoad" :offset="0">
              <div>
                <div v-for="(item, index) in orderList" :key="index">
                  <!-- 未巡检卡片 -->
                  <InfoCardNotAndDone :cardInfo="item" @refreshList="onRefresh" @dealOrder="goToDetail" @handleView="goToDetail"></InfoCardNotAndDone>
                </div>
              </div>
            </fm-list>
          </fm-pull-refresh>
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
// 执行中信息卡片
import InfoCardWorking from '../InfoCardWorking.vue'
// 未巡检、已完成信息卡片
import InfoCardNotAndDone from '../InfoCardNotAndDone.vue'
// 下拉选择框
import Select from '../Select.vue'
import * as api from '../../api'

export default {
  name: 'dispatchOrder',
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
    InfoCardWorking,
    InfoCardNotAndDone,
    Select,
  },
  data() {
    return {
      actions: [
        {
          text: '调度指令'
        }
      ],
      showPopover: false,
      waitAcceptLength: 0,
      waitDealLength: 0,
      stageLength: 0,
      hasBackLength: 0,
      hasReceiveLength: 0,
      hasSendLength: 0,
      doneLength: 0,
      allLength: 0,
      selected: 'all',
      orderList: [],
      pageSize: 10,
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      inspDateTypeList: [
        { type: 1, name: '全部时间', value: '全部时间' },
        { type: 1, name: '近一周', value: '近一周' },
        { type: 1, name: '近一月', value: '近一月' },
        { type: 1, name: '近三月', value: '近三月' },
      ],
      stationList: [
        { type: 2, name: '全部站点', value: '全部站点' },
        { type: 2, name: '人巡', value: '人巡' },
        { type: 2, name: '车辆巡检', value: '车巡' },
        { type: 2, name: '管廊巡检', value: '管廊巡' },
        { type: 2, name: '泵站巡检', value: '泵站巡检' },
      ],
      dateType: '全部时间',
      inspTaskType: '全部站点'
    }
  },
  created() {
    // 初始化下拉框
    this.dateType = this.inspDateTypeList[0].value
    this.inspTaskType = this.stationList[0].value
  },
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.onRefresh()
  },
  methods: {
    onSelect() {
      this.$router.push({
        name: 'addDispatchOrder',
        query: { mode: 'add' }
      })
    },
    goToDetail(item, type) {
      this.$router.push({
        name: 'addDispatchOrder',
        query: { mode: type, data: JSON.stringify(item) }
      })
    },
    changeSelect(type) {
      this.selected = type
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.onRefresh()
    },
    addNew() {
      this.showPopover = true
    },
    // select框选择回调
    getValue(type, name, value) {
      if (type === 1) {
        this.dateType = value
      } else if (type === 2) {
        this.inspTaskType = value
      }
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.onRefresh()
    },
    // 重置列表page,list值
    pageReset() {
      this.pageNum = 1
      this.orderList = []
    },
    // 页面加载/下拉刷新
    onRefresh() {
      this.pageReset()
      this.loading = true
      this.finished = false
      this.getList()
      this.getAllList()
    },
    // 列表加载更多
    onLoad() {
      this.pageNum = this.pageNum + 1
      this.getList()
    },
    // 获取列表数据
    getAllList() {
      let searchParams = {
        page: this.pageNum,
        size: 9999,
        realName: this.$store.state.userInfo.userName
      }
      api.getDispatchOrderList(searchParams)
        .then((res) => {
          if (res.data) {
            this.allLength = res.data.total
            this.doneLength = res.data.records.filter(it => it.commandStatus == '已完成').length
            this.hasSendLength = res.data.records.filter(it => it.commandStatus == '已发出').length
            this.hasReceiveLength = res.data.records.filter(it => it.commandStatus == '已接单').length
            this.hasBackLength = res.data.records.filter(it => it.commandStatus == '已退单').length
            this.waitAcceptLength = res.data.records.filter(it => it.commandStatus == '待接单').length
            this.waitDealLength = res.data.records.filter(it => it.commandStatus == '待处理').length
            this.stageLength = res.data.records.filter(it => it.commandStatus == '暂存').length
          }
        })
    },
    // 获取列表数据
    getList() {
      let startTime = ''
      switch (this.dateType) {
        case '近一周':
          startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '近一月':
          startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '近三月':
          startTime = this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
          break
        default:
          startTime = ''
          break
      }
      let searchParams = {
        page: this.pageNum,
        size: this.pageSize,
        realName: this.$store.state.userInfo.userName
        // taskStartTime: startTime,
        // taskEndTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // if (this.inspTaskType != '全部站点') {
      //   searchParams.taskType = this.inspTaskType
      // }
      switch (this.selected) {
        case 'all':
          // searchParams.status = '1'
          break
        case 'done':
          searchParams.status = '已完成'
          break
        case 'hasSend':
          searchParams.status = '已发出'
          break
        case 'hasReceive':
          searchParams.status = '已接单'
          break
        case 'hasBack':
          searchParams.status = '已退单'
          break
        case 'waitAccept':
          searchParams.status = '待接单'
          break
        case 'stage':
          searchParams.status = '暂存'
          break
        case 'waitDeal':
          searchParams.status = '待处理'
          break
        default: 
          // searchParams.status = '已完成'
          break
      }
      api.getDispatchOrderList(searchParams)
        .then((res) => {
          if (res.data) {
            this.orderList = [...this.orderList, ...res.data.records]
            if (res.data.current >= res.data.pages) {
              this.finished = true
            }
            this.refreshing = false
          }
        })
        .catch(err => {
          console.log(err)
          this.finished = true
        })
        .finally(() => {
          Toast.clear()
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
// ecf4ff
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.main {
  background-color: #055ffc!important;
  height: 100%;
  display: flex;
  flex-direction: column;
  .main-bg {
    position: absolute;
    width: 100%;
  }
  .content {
    position: relative;
    background: linear-gradient(180deg, #E5F2FF 0%, #F6F8FA 25%, #F5F7F9 100%);
    height: calc(100% - 46px);
    width: 100%;
    margin-top: 24px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    .classify {
      min-width: 143%;
      width: auto;
      height: 72px;
      margin: 24px 30px;
      display: flex;
      justify-content: space-between;
      .classify-item {
        width: auto;
        min-width: 100px;
        background: #FFFFFF;
        border-radius: 36px;
        box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
        padding: 16px 32px;
        .item {
          width: auto;
          display: flex;
          .key {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 38px;
          }
          .value {
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 38px;
            margin-left: 6px;
          }
        }
      }
    }
    .bgImg {
      position: absolute;
      height: 100px;
      z-index: 1;
      top: -20px;
    }
    .middle {
      left: 240px;
    }
    .right {
      right: 0;
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
/deep/.fm-nav-bar  {
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
  // background-color: #d4e8fc;
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
