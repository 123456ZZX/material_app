<template>
  <div id='DownloadPlan'>
    <fm-pull-refresh id='DownloadPlan' v-model='refreshing' success-text='刷新成功' @refresh='onRefresh'>
      <fm-nav-bar title='计划下载' left-arrow @click-left="$router.replace('/index')">
      </fm-nav-bar>
      <div class='plan-container'>
        <fm-list v-model='loading' @load='onLoad' :immediate-check='false'>
          <div v-for='(item, index) in planList' :key='index' class='list-item'>
            <img src='@/assets/svg/doc_books.svg'>
            <span class='ptitle'>{{ item.bookName }}</span>
            <span class='plink' @click='download(item.bookCode)'>下载表册</span>
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
import { NavBar, List, PullRefresh, Notify, Toast } from 'fawkes-mobile-lib'
import { getReadingBook, downloadPlan } from './api'

export default {
  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Notify.name]: Notify,
    [Toast.name]: Toast
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      inExecutionPage: 1,
      todoPage: 1,
      finishedPage: 1,
      planList: [],
      notStartList: [], //'未抄数组'
      notCommitList: [] //'未提交数组'
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
    download(bookCode) {
      let plans = localStorage.getItem('myDownloadPlan')
      let nsList = plans ? JSON.parse(plans) : []
      this.notStartList = nsList.filter((item) => {
        return item.bookCode == bookCode
      })
      let savedTasks = localStorage.getItem('savedTasks')
      let ncList = savedTasks ? JSON.parse(savedTasks) : []
      this.notCommitList = ncList.filter((item) => {
        return item.bookCode == bookCode
      })
      if (this.notCommitList.length !== 0 || this.notStartList.length !== 0) {
        Notify({ type: 'warning', message: '本月已下载此表册计划' })
        return
      }
      Toast.loading({
        message: '下载中...',
        forbidClick: true
      })
      let params = { bookCode }
      downloadPlan(params)
        .then((res) => {
          if (res.data) {
            let data = res.data
            let old = localStorage.getItem('myDownloadPlan')
            let oldAll = old ? JSON.parse(old) : []
            oldAll.push(...data)
            let newAll = JSON.stringify(oldAll)
            localStorage.removeItem('myDownloadPlan')
            localStorage.setItem('myDownloadPlan', newAll)
          }
          if (res.status) {
            Notify({ type: 'success', duration: 500, message: '下载成功' })
          } else {
            Notify({ type: 'error', duration: 500, message: res.message })
          }
        })
        .catch(() => {
          Notify({ type: 'error', duration: 500, message: '下载失败' })
        })
    }
  },
  mounted() {
    this.onRefresh()
  }
}
</script>

<style lang='less' scoped>
#DownloadPlan {
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
    font-size: 24px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;

    .ptitle {
      width: 80%;
      padding-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }

    .plink {
      width: 20%;
      padding-right: 8px;
      text-align: right;
      color: #0676fd;
    }
  }
}
</style>
