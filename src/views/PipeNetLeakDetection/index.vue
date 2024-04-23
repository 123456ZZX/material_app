<template>
  <div class="main">
    <template>
      <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
      <fm-nav-bar title="检漏管理" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
      <div class="content">
        <img
          :src="bgSrc"
          class="bgImg"
          :class="selectedTab == '执行中' ? 'left' : selectedTab == '未开始' ? 'middle' : 'right'"
        />
        <fm-tabs v-model="selectedTab" @tab-click="changeType" line-width="60px">
          <fm-tab name="执行中" :label="working"></fm-tab>
          <fm-tab name="未开始" :label="notStart"></fm-tab>
          <fm-tab name="已完成" :label="workDone"></fm-tab>
        </fm-tabs>
        <!-- 选择框 -->
        <div class="selectStyle">
          <Select
            :selectData="inspDateTypeList"
            :selValue="dateType"
            color="white"
            @getValue="getValue"
          ></Select>
          <!-- <Select
          :selectData="inspTaskTypeList"
          :selValue="inspTaskType"
          color="white"
          @getValue="getValue"
        ></Select> -->
        </div>
        <div class="main-container">
          <template>
            <!-- 下拉刷新 -->
            <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
              <!-- 无数据 -->
              <template v-if="taskList.length == 0">
                <div class="no-data-img">
                  <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                </div>
                <div class="no-data-text">
                  <div class="no-data-text-descripe">暂无数据</div>
                </div>
              </template>
              <!-- 列表 -->
              <fm-list
                v-else
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="0"
              >
                <div>
                  <div v-for="(item, index) in taskList" :key="index">
                    <!-- 执行中卡片 -->
                    <InfoCardWorking
                      :cardInfo="item"
                      @executeWorking="executeWorking"
                      v-if="selectedTab == '执行中'"
                    ></InfoCardWorking>
                    <!-- 未巡检卡片 -->
                    <InfoCardNotAndDone
                      :cardInfo="item"
                      cardType="not"
                      @transmitEvent="transmitEvent"
                      v-else-if="selectedTab == '未开始'"
                      @startEvent="startEvent"
                    ></InfoCardNotAndDone>
                    <!-- 已完成卡片 -->
                    <InfoCardNotAndDone
                      :cardInfo="item"
                      cardType="done"
                      @executeDone="executeDone"
                      v-else
                    >
                    </InfoCardNotAndDone>
                  </div>
                </div>
              </fm-list>
            </fm-pull-refresh>
          </template>
        </div>
      </div>
    </template>
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
import InfoCardWorking from './InfoCardWorking.vue'
// 未巡检、已完成信息卡片
import InfoCardNotAndDone from './InfoCardNotAndDone.vue'
// 下拉选择框
import Select from '@/views/Inspection/Select.vue'
import { queryTaskList } from './api'

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
    InfoCardWorking,
    InfoCardNotAndDone,
    Select,
  },
  data() {
    return {
      taskList: [], // 任务列表
      activeKey: 0,
      searchValue: '', // 搜索文字
      tabs: ['执行中', '未开始', '已完成'],
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
      inspTaskTypeList: [
        { type: 2, name: '全部类型', value: '全部类型' },
        { type: 2, name: '人巡', value: '人巡' },
        { type: 2, name: '车辆巡检', value: '车巡' },
        { type: 2, name: '管廊巡检', value: '管廊巡检' },
        { type: 2, name: '泵站巡检', value: '泵站巡检' },
      ],
      dateType: '全部时间',
      inspTaskType: '全部类型',
      // tab切换标题
      selectedTab: '执行中',
      working: '执行中',
      notStart: '未开始',
      workDone: '已完成',
      nowClickTask: {}, // 当前点击的任务，传递给MapPage组件
    }
  },
  created() {},
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    })
    this.onRefresh()
  },
  computed: {
    bgSrc() {
      let src = ''
      switch (this.selectedTab) {
        case '执行中':
          src = require('@/assets/img/selectLeftBg.png')
          break

        case '已完成':
          src = require('@/assets/img/selectRightBg.png')
          break

        case '未开始':
          src = require('@/assets/img/selectBg.png')
          break

        default:
          src = require('@/assets/img/selectLeftBg.png')
          break
      }
      return src
    },
  },
  methods: {
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
        duration: 0,
      })
      this.onRefresh()
    },
    // tab切换回调
    changeType(name, title) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.selectedTab = name
      this.onRefresh()
    },
    // 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true
    onLoad() {
      this.pageNum = this.pageNum + 1
      this.getList()
    },
    // 页面加载、下拉刷新
    onRefresh() {
      // 重置列表page、list值
      this.pageNum = 1
      // 任务列表
      this.taskList = []

      this.loading = true
      this.finished = false

      this.getList()
    },
    // 获取列表数据
    getList() {
      let startTime = ''
      switch (this.dateType) {
        case '近一周':
          startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
          break
        case '近一月':
          startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
          break
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
        // 任务开始时间
        taskStartTime: startTime,
        // 任务结束时间
        taskEndTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      // 状态（0未开始 1执行中 2已完成）
      switch (this.selectedTab) {
        case '执行中':
          searchParams.taskStatus = '1'
          break
        case '未开始':
          searchParams.taskStatus = '0'
          break
        case '已完成':
          searchParams.taskStatus = '2'
          break
        default:
          searchParams.taskStatus = '1'
          break
      }
      // 固定为未开始
      // searchParams.taskStatus = '0'

      queryTaskList(searchParams)
        .then((res) => {
          if (res.data) {
            console.log('检漏任务', res)
            this.taskList = [...this.taskList, ...res.data.records]

            // 若数据已全部加载完毕，则直接将 finished 设置成 true，展示: 没有更多了
            if (res.data.current >= res.data.pages) {
              this.finished = true
            }
            // 下拉刷新状态
            this.refreshing = false
          }
        })
        .catch(() => {
          // 若数据已全部加载完毕，则直接将 finished 设置成 true，展示: 没有更多了
          this.finished = true
        })
        .finally(() => {
          Toast.clear()
          this.loading = false
        })
    },
    // 未开始-转发
    transmitEvent(item) {
      console.log('转发', item)
    },
    // 未开始-开始
    startEvent(item) {
      console.log('开始', item)
      // 当前点击的任务，传递给MapPage组件
      this.nowClickTask = item
      // 对于未巡检的任务第一次进入巡检任务需要更新任务状态
      this.executeWorking(item, true)
    },
    // 执行中-继续
    executeWorking(item, isNew = false) {
      item.taskType = '人巡'
      console.log('执行中-继续', item)
      // 当前点击的任务，传递给MapPage组件
      this.nowClickTask = item

      let queryData = {
        taskId: item.id,
        isNew: isNew,
        isView: false,
        taskType: item.taskType,
        nowClickTask: this.nowClickTask,
      }
      // 将该检漏任务数据存储在本地，避免进入工单页后再返回数据缺失
      localStorage.setItem('leakDetectionData', null)
      localStorage.setItem('leakDetectionData', JSON.stringify(queryData))

      this.$router.push({
        name: 'LeakDetectionMapPage',
      })
    },
    // 已完成-查看
    executeDone(item) {
      item.taskType = '人巡'
      console.log('已完成-查看', item)
      // 当前点击的任务，传递给MapPage组件
      this.nowClickTask = item

      let queryData = {
        taskId: item.id,
        isNew: false,
        isView: true,
        taskType: item.taskType,
        nowClickTask: this.nowClickTask,
      }
      // 将该检漏任务数据存储在本地，避免进入工单页后再返回数据缺失
      localStorage.setItem('leakDetectionData', null)
      localStorage.setItem('leakDetectionData', JSON.stringify(queryData))

      this.$router.push({
        name: 'LeakDetectionMapPage',
      })
    },
    // 新增
    add() {
      this.$router.push({
        name: 'CommonOneFormIndex',
        params: { type: 'add' },
      })
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        name: 'CommonOneFormIndex',
        params: {
          type: 'edit',
          id: row.id,
        },
      })
    },
    // 删除
    handleDelete(row) {
      Dialog.confirm({
        title: '提示',
        message: '确认是否删除?',
      })
        .then(() => {
          let idList = []
          idList.push(row.id)

          deleteCommonForm(idList).then((res) => {
            if (res.status) {
              Toast('删除成功')
              this.onRefresh()
            } else {
              Toast(res.message)
            }
          })
        })
        .catch(() => {})
    },
  },
}
</script>
<style lang="less" scoped>
// ecf4ff
// 隐藏滚动条
&::-webkit-scrollbar {
  display: none; // Chrome | Safari
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
  color: #ffffff !important;
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
  color: #ffffff !important;
}

// 每个tab高度变低
/deep/.fm-tab {
  line-height: 72px;
  // height: 80%;
  // border-radius: 20px 20px 0px 0px;
  // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
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
  color: #ffffff !important;
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
