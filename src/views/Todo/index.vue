<template>
  <div class="task-container">
    <fm-nav-bar title="表单中心" left-text="" right-text="" />
    <fm-search
      v-model="searchValue"
      placeholder="请输入表单名称"
      @clear="onClear"
      @search="onSearch"
    />
    <fm-tabs @tab-click="changeType" line-width="60px">
      <fm-tab v-for="(item, index) in tabs" :label="item" :key="index" :name="item"> </fm-tab>
    </fm-tabs>
    <div class="card-container" v-if="displayList.length !== 0">
      <fm-pull-refresh
        ref="taskScroller"
        refresh-layer-color="#4b8bf4"
        v-model="refreshing"
        success-text="刷新成功"
        @refresh="onRefresh()"
      >
        <fm-list
          v-model="loading"
          :finished="finished"
          finished-text="我们是有底线的"
          :immediate-check="false"
          @load="onLoad"
        >
          <div class="v-task-item" v-for="(item, index) in displayList" :key="index">
            <div class="v-task-item__box">
              <div class="v-task-item__box-info" @click="handleContentClick(item)">
                <div class="box-info__top">
                  <!-- 标题和时间 -->
                  <div class="box-info__title">
                    <div class="box-info__title-bar"></div>
                    <div class="box-info__title-text">
                      <div>{{ item.formName }}</div>
                    </div>
                    <div v-if="currentTab != '任务待办'" class="box-info__task-state">
                      <div
                        class="task-text state-text-run"
                        v-if="item.taskState == 0 || item.taskState == 3"
                      >
                        流转中
                      </div>
                      <div class="task-text state-text-finish" v-else-if="item.taskState == 1">
                        已完成
                      </div>
                      <div class="task-text state-text-waste" v-else>废弃</div>
                    </div>
                  </div>
                </div>
                <div class="box-info__task-info">
                  <div class="box-info__task-name">
                    <div>任务名称</div>
                    <div class="task-text sub-text">{{ item.taskSubject }}</div>
                  </div>
                  <div class="box-info__task-starter">
                    <div>发起人</div>
                    <div class="task-text starter-text">
                      {{ item.taskCreatorName }}
                    </div>
                  </div>
                  <div class="box-info__task-time">
                    <div>开始时间</div>
                    <div class="task-text time-text">
                      {{ item.processCreateDate }}
                    </div>
                  </div>
                  <div class="box-info__task-stop" v-if="!checkTask(item)">
                    <div class="task-text stop-text">该阶段暂不支持移动端审批</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fm-list>
      </fm-pull-refresh>
    </div>
    <div class="card-container" v-else>
      <div class="no-data-img">
        <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
      </div>
      <div class="no-data-text">
        <div class="no-data-text-descripe">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Image, Search, NavBar, Tab, Tabs, PullRefresh, List, Toast } from 'fawkes-mobile-lib'
import { userTaskLists, relTaskLists, circulationLists } from './api'
import { FORM_KEY_NAME } from '@/common/constant'
import { eventBackButton, exitApp } from '@/utils/app'

export default {
  name: 'Todo',
  components: {
    [Image.name]: Image,
    [Search.name]: Search,
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Toast.name]: Toast,
  },

  data() {
    return {
      value: '',
      tabs: ['任务待办', '流程跟踪', '表单查询'],
      displayList: [],
      taskList: [],
      flowList: [],
      formList: [],
      taskPage: 1,
      flowPage: 1,
      formPage: 1,
      pageSize: 20,
      finished: false,
      refreshing: false,
      loading: false,
      loadingFinished: [false, false, false],
      searchValue: '',
      currentTab: '任务待办',
    }
  },
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
  },
  activated() {
    // 页面激活时移除默认的返回上一级路由处理事件，设置退出应用事件
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', eventBackButton, false)
    this.getList()
  },
  deactivated() {
    // 页面隐藏时移除退出应用事件，恢复默认的返回上一级路由的处理事件
    document.removeEventListener('backbutton', eventBackButton, false)
    document.removeEventListener('backbutton', exitApp, false)
    document.addEventListener('backbutton', this.$back, false)
    this.pageReset()
  },
  methods: {
    // 重置列表page,list值
    pageReset() {
      this.taskPage = 1
      this.flowPage = 1
      this.formPage = 1
      this.taskList = []
      this.flowList = []
      this.formList = []
    },
    changeType(name, title) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      this.currentTab = title
      // this.$store.commit('SET_CURRENT_TAB', this.currentTab)
      this.loading = false
      var index = this.search(this.tabs, name)
      this.finished = this.loadingFinished[index]
      this.pageReset()
      this.getList()
      if (this.currentTab == title) {
        return false
      }
    },
    search(arr, dst) {
      var i = arr.length
      while (i--) {
        if (arr[i] == dst) {
          return i
        }
      }
      return false
    },
    onRefresh() {
      this.pageReset()
      this.loading = false
      this.finished = false
      this.getList()
    },
    onLoad() {
      this.loading = true
      this.getList()
    },
    getList() {
      switch (this.currentTab) {
        case '任务待办':
          userTaskLists({
            page: this.taskPage++,
            size: this.pageSize,
            taskSubject: '',
            formName: this.searchValue,
            cloumn: '',
            order: '',
          })
            .then((res) => {
              if (res.status && res.data.total == 0) {
                this.loadingFinished[0] = true
                this.finished = this.loadingFinished[0]
                this.refreshing = false
              }
              if (res.status) {
                this.refreshing = false
                if (this.taskList.length === res.data.total) {
                  this.loadingFinished[0] = true
                  this.finished = this.loadingFinished[0]
                } else {
                  this.taskList = [...this.taskList, ...res.data.list]
                }
                this.displayList = this.taskList
              }
            })
            .catch(() => {
              this.finished = true
            })
            .finally(() => {
              Toast.clear()
              this.loading = false
            })
          break
        case '流程跟踪':
          relTaskLists({
            page: this.flowPage++,
            size: this.pageSize,
            taskSubject: '',
            formName: this.searchValue,
            cloumn: '',
            order: '',
          })
            .then((res) => {
              if (res.status && res.data.total == 0) {
                this.loadingFinished[1] = true
                this.finished = this.loadingFinished[1]
                this.refreshing = false
              }
              if (res.status) {
                this.refreshing = false
                if (this.flowList.length === res.data.total) {
                  this.loadingFinished[1] = true
                  this.finished = this.loadingFinished[1]
                } else {
                  this.flowList = [...this.flowList, ...res.data.list]
                }
                this.displayList = this.flowList
              }
            })
            .catch(() => {
              this.finished = true
            })
            .finally(() => {
              Toast.clear()
              this.loading = false
            })
          break
        case '表单查询':
          circulationLists({
            asignee: '',
            creator: '',
            startDate: '',
            endDate: '',
            taskState: '',
            taskSubject: '',
            formName: this.searchValue,
            page: this.formPage++,
            size: this.pageSize,
            order: '',
            column: '',
          })
            .then((res) => {
              if (res.status && res.data.total == 0) {
                this.loadingFinished[2] = true
                this.finished = this.loadingFinished[2]
                this.refreshing = false
              }
              if (res.status) {
                this.refreshing = false
                if (this.formList.length === res.data.total) {
                  this.loadingFinished[2] = true
                  this.finished = this.loadingFinished[2]
                } else {
                  this.formList = [...this.formList, ...res.data.list]
                }
                this.displayList = this.formList
                if (!this.searchValue) {
                  this.displayList = this.displayList.filter((item) => {
                    return item.taskState != 2
                  })
                }
              }
            })
            .catch(() => {
              this.finished = true
            })
            .finally(() => {
              Toast.clear()
              this.loading = false
            })
          break
      }
    },
    onSearch(val) {
      this.searchValue = val
      this.onRefresh()
    },
    onClear() {
      this.searchValue = ''
      this.onRefresh()
    },
    // 判断是否支持审批
    checkTask(item) {
      if (item.formKey in FORM_KEY_NAME) {
        // 显示所有在formKeyName数组中配置过的key值
        return true
      }
      return false
    },
    // 打开任务详情页面
    handleContentClick(item) {
      if (this.checkTask(item)) {
        this.$store.commit('SET_CURRENT_ROW', item)
        if (this.currentTab == '任务待办') {
          this.$router.push({
            name: 'FormCenter',
            params: {
              type: 'execute',
              formKey: item.formKey,
              taskKey: item.taskKey,
              taskId: item.taskId,
              bizId: item.formBizId,
            },
          })
        } else if (this.currentTab == '流程跟踪') {
          // 流程跟踪
          this.$router.push({
            name: 'FormCenter',
            params: {
              type: 'flowView',
              formKey: item.formKey,
              taskKey: item.taskKey,
              taskId: item.taskId,
              bizId: item.formBizId,
            },
          })
        } else {
          // 表单查询
          this.$router.push({
            name: 'FormCenter',
            params: {
              type: 'view',
              formKey: item.formKey,
              taskKey: item.taskKey,
              taskId: item.taskId,
              bizId: item.formBizId,
            },
          })
        }
      } else {
        Toast('该阶段暂不支持移动端审批', 'middle')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.task-container {
  height: 100%;
  overflow: hidden;
  background: #f1f2f3;
}
/deep/ .fm-pull-refresh {
  overflow: visible;
}

.card-container {
  height: calc(100% - 400px);
  overflow: auto;
  padding-left: 30px;
  padding-right: 30px;
}
.v-task-item {
  background-color: #fff;
  border-radius: 10px;
  margin-top: 30px;
  &__box {
    display: flex;
    flex-direction: column;

    &-thumbnail {
      width: 180px;
      height: 180px;
      margin-right: 30px;

      image {
        width: 100%;
        height: 100%;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;

      .box-info__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .v-task-item__box + .v-task-item__box {
    margin-top: 30px;
    padding-top: 30px;
  }

  //修改滑块背景颜色
  /deep/.u-swipe-content {
    background-color: #fff;
    border-radius: 16px;
  }
}

// 卡片标题栏
.box-info__top {
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: solid 1px #f2f2f3;
  padding-bottom: 32px;
}

// 标题
.box-info__title {
  font-weight: bold;
  font-size: 32px;
  /*display: block;*/
  padding-top: 32px;
  display: flex;
  align-items: center;
  // 指示块
  &-bar {
    width: 6px;
    height: 30px;
    background: #027aff;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
  }
  // 标题内容
  &-text {
    margin-left: 16px;
    color: #333333;
    display: inline-block;
    vertical-align: middle;
    flex: 1;
  }
}

.box-info__attr {
  color: #999;
  font-size: 20px;
  margin-top: 20px;
}

// 卡片任务内容栏
.box-info__task-info {
  padding-top: 32px;
  padding-left: 48px;
  padding-bottom: 32px;
}

// 任务名称
.box-info__task-name {
  font-size: 28px;
  color: #999999;
  display: flex;
}

.box-info__task-starter {
  font-size: 28px;
  color: #999999;
  display: flex;
  padding-top: 28px;

  .starter-text {
    margin-left: 64px;
  }
}

// 任务环节
.box-info__task-node {
  font-size: 28px;
  padding-top: 10px;
  color: #999999;
  display: flex;
}

.task-text {
  color: #333333;
  font-size: 28px;
  font-weight: 400;
  margin-left: 36px;
  flex: 1;
  white-space: nowrap; //不换行
  overflow: hidden; //超出隐藏
  text-overflow: ellipsis; // 超出部分省略表示
  padding-right: 20px;
}

/*.time-text {
  margin-bottom: 30px;
}*/
.state-text {
  margin-left: 92px;
}

.stop-text {
  color: #f32111;
}

// 任务时间
.box-info__task-time {
  padding-top: 28px;
  color: #999999;
  font-size: 28px;
  display: flex;
}
.box-info__task-state {
  /*padding-top: 10px;*/
  position: absolute;
  right: 32px;
  color: #999999;
  font-size: 28px;
  display: flex;
  display: inline-block;
  vertical-align: middle;
}
.state-text-finish {
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #ecf8ef;
  border: 1px solid #40bb5a;
  color: #40bb5a;
}
.state-text-run {
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #e8f4ff;
  border: 1px solid #1790fe;
  color: #1790fe;
}
.state-text-waste {
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #ffeded;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}
.box-info__task-time {
  padding-bottom: 10px;
}

.box-info__item-label {
  width: 140px;
}

.box-info-warn {
  display: inline-block;
  vertical-align: middle;
  float: right;
  color: #ff4b4b;
  font-size: 24px;
  background-color: #ffeded;
  // padding: 3px 10px;
}

.task-btn-group {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f2f2f2;
  .btn {
    border-radius: 0;
    border: none;
    height: 88px;
    width: 50%;
    white-space: nowrap;
    line-height: 88px;
    text-align: center;
    vertical-align: middle;
    padding: 0px;
    // color: #fff;
    &::after {
      display: none;
    }
  }
  .enter {
    color: #fdac42;
    background-color: #fff;
    border-right: 1px solid #f2f2f2;
    font-size: 32px;
    // background-color: #FDAC42;
  }
  .entrust {
    color: #0097d8;
    background-color: #fff;
    font-size: 32px;
    // background-color: #0097D8;
  }
  .active {
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
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
</style>
