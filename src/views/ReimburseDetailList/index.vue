<template>
  <div class="main">
    <fm-nav-bar title="流程主子表" left-arrow @click-left="$router.go(-1)"> </fm-nav-bar>
    <fm-search
      v-model="value"
      placeholder="请输入采购计划名称"
      @search="onSearch"
      clearable
      @clear="onClear"
    >
      <template #left-icon>
        <i class="fm-icon fm-icon-search"></i>
      </template>
    </fm-search>
    <div class="main-container">
      <!-- 下拉刷新 -->
      <fm-pull-refresh
        v-model="isRefresh"
        refresh-layer-color="#4b8bf4"
        success-text="刷新成功"
        @refresh="onRefresh()"
      >
        <!-- 上拉加载 -->
        <fm-list
          v-model="loading"
          :finished="finished"
          finished-text="我们是有底线的"
          @load="onLoad"
          :immediate-check="false"
        >
          <!-- 滑动 -->
          <fm-swipe-cell v-for="(item, i) in formList" :key="i" :disabled="true">
            <!-- 卡片 -->
            <fm-cell-group inset @click="handleView(item)">
              <fm-sidebar v-model="activeKey">
                <fm-sidebar-item :title="item.reimburseName" />
              </fm-sidebar>
              <fm-cell title="采购预算:" :value="item.budget" />
              <!-- <fm-cell
                title="采购类型:"
                :value="item.reimburseType | transferEnum('reimburse_type')"
              /> -->
              <fm-cell title="采购说明:" :value="item.description" />
              <fm-cell
                title="采购计划日期:"
                :value="item.planDate ? $dayjs(item.planDate).format('YYYY-MM-DD') : ''"
              />
            </fm-cell-group>
          </fm-swipe-cell>
        </fm-list>
      </fm-pull-refresh>
    </div>
    <!-- 增加按钮 -->
    <div class="bottom" @click="add">
      <i class="fm-icon fm-icon-plus"></i>
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
import { getDetailFlowList } from './api'

export default {
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
  },
  data() {
    return {
      activeKey: 0,
      value: '', //搜索文字
      formList: [],
      form: {
        size: 10,
        page: 1,
        reimburseName: '', //按采购计划名称搜索
        budget: '', //按采购预算搜索
      },
      isRefresh: false,
      finished: false,
      loading: false, // 下拉刷新时禁止无限加载
      bannerShow: true,
    }
  },
  created() {
    if (this.$storage.get('commonOneFormNotice')) {
      this.bannerShow = false
    }
  },
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
    this.onRefresh()
  },
  methods: {
    closeNotice() {
      this.bannerShow = false
      this.$storage.set('commonOneFormNotice', false)
    },
    onClear() {
      this.form.reimburseName = ''
      // 复用刷新接口
      this.onRefresh()
    },
    // 搜索
    onSearch(val) {
      this.form.reimburseName = val
      // 复用刷新接口
      this.onRefresh()
    },
    onRefresh() {
      this.finished = false
      this.loading = false
      this.form.page = 1
      getDetailFlowList(this.form)
        .then((res) => {
          if (res.status) {
            this.formList = res.data.list
            this.isRefresh = false
            if (res.data.isLastPage) {
              this.finished = true
              this.form.page = 1
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
    },
    onLoad() {
      this.loading = true
      this.form.page++
      getDetailFlowList(this.form)
        .then((res) => {
          if (res.status) {
            this.formList = [...this.formList, ...res.data.list]
            if (res.data.isLastPage) {
              this.finished = true
              this.form.page = 1
            }
          }
        })
        .catch(() => {
          this.finished = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    /*打开新增页面*/
    add() {
      this.$router.push({
        name: 'FormCenter',
        params: { type: 'add', formKey: 'reimburseDetail' },
      })
    },

    /*打开查看页面*/
    handleView(row) {
      this.$router.push({
        name: 'FormCenter',
        params: {
          type: 'view',
          bizId: row.id,
          formKey: 'reimburseDetail',
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.main-container {
  height: calc(100% - 208px);
  overflow: auto;
}

.main {
  background-color: #f2f3f4 !important;
  height: 100%;
}
.task-container /deep/ .fm-nav-bar__content {
  height: 88px;
}
.task-container /deep/ .fm-nav-bar__title {
  font-size: 36px;
  font-weight: 600;
}
.task-container /deep/ .fm-nav-bar .fm-icon {
  color: #333;
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
