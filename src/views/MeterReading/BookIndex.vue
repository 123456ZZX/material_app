<template>
  <div id='BookIndex'>
    <fm-pull-refresh id='BookIndex' v-model='refreshing' success-text='刷新成功' @refresh='onRefresh'>
      <fm-nav-bar title='我的表册' left-arrow @click-left="$router.replace('/index')">
      </fm-nav-bar>
      <div class='plan-container'>
        <fm-list v-model='loading' @load='onLoad' :immediate-check='false'>
          <div v-for='(item, index) in planList' :key='index' class='list-item' @click='toTask(item.bookCode)'>
            <img src='@/assets/svg/doc_books.svg'>
            <span class='ptitle'>{{ item.bookName }}</span>
          </div>
        </fm-list>
        <template v-if='planList && planList.length == 0'>
          <div class='no-data-img'>
            <fm-image fit='cover' :src="require('@/assets/img/no-data-img.png')" />
          </div>
          <div class='no-data-text'>
            <div class='no-data-text-descripe'>暂无表册数据</div>
          </div>
        </template>
      </div>
    </fm-pull-refresh>
  </div>
</template>
<script>
import { NavBar, List, PullRefresh, Toast } from 'fawkes-mobile-lib'
import { getReadingBook } from './api'

export default {
  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Toast.name]: Toast
  },
  props: {
    type: null
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      inExecutionPage: 1,
      todoPage: 1,
      finishedPage: 1,
      planList: []
    }
  },
  methods: {
    pageReset() {
      this.inExecutionPage = 1
      this.todoPage = 1
      this.finishedPage = 1
    },
    // 页面加载/下拉刷新
    onRefresh() {
      this.pageReset()
      this.firstRequestFinished = false
      this.loading = true
      this.getList()
    },
    // 列表加载更多
    onLoad() {
      this.getList()
    },
    getList() {
      this.loading = false
      let uid = localStorage.getItem('cs_userId')
      let params = {}
      params.chargePerson = uid
      params.type = this.type == 'survey' ? 'ZCBS' : 'SDCB'
      getReadingBook(params)
        .then((res) => {
          if (res.data) {
            this.planList = res.data
          }
        })
        .finally(() => {
          this.loading = false
          this.refreshing = false
          this.firstRequestFinished = true
        })
    },
    toTask(code) {
      localStorage.setItem('bookCode', code)
      localStorage.setItem('taskType', this.type)
      this.$router.push({
        name: 'TaskIndex'
      })
    }
  },
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    this.onRefresh()
  }
}
</script>

<style lang='less' scoped>
#BookIndex {
  height: 100%;
  overflow: auto;
  background-color: #ecf4ff !important;

  /deep/ .fm-nav-bar__content {
    background-color: #0676fd !important;
    height: 1.8rem;
  }

  /deep/ .fm-nav-bar__title {
    color: #ffffff !important;
  }

  /deep/ .fm-nav-bar .fm-icon {
    color: #ffffff !important;
  }

  /deep/ .fm-pull-refresh {
    overflow: visible;
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

  .list-item {
    width: 100%;
    height: 80px;
    // padding: 0 10px;
    line-height: 80px;
    border-bottom: 1px solid #fff;
    background-color: #ecf4ff;
    display: flex;
    justify-content: left;

    .ptitle {
      width: 80%;
      padding-left: 6px;
      font-size: 24px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
  }
}
</style>
