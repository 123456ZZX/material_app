<template>
  <div class='content'>
    <div class='main-container'>
      <template>
        <!-- 下拉刷新 -->
        <fm-pull-refresh v-model='refreshing' success-text='刷新成功' @refresh='onRefresh'>
<!--          <fm-button @click='check'>扫码</fm-button>-->
          <!-- 无数据 -->
          <template v-if='checkList.length == 0 && !loading'>
            <div class='no-data-img'>
              <fm-image fit='cover' :src="require('@/assets/img/no-data-img.png')" />
            </div>
            <div class='no-data-text'>
              <div class='no-data-text-descripe'>暂无数据</div>
            </div>
          </template>
          <!-- 列表 -->
          <fm-list
            v-else
            v-model='loading'
            :finished='finished'
            finished-text='无更多数据了'
            @load='getList'
            :offset='0'
          >
            <div>
              <div v-for='(item, index) in checkList' :key='index'>
                <CheckCardEle :InfoCardInCheckInfo='item'></CheckCardEle>
              </div>
            </div>
          </fm-list>
        </fm-pull-refresh>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { queryCheckList } from './api'
import CheckCardEle from './CheckCardEle.vue'
import { Toast } from 'fawkes-mobile-lib'

export default {
  name: 'InfoCardCheck',
  components: {
    [Toast.name]: Toast,
    CheckCardEle
  },
  data() {
    return {
      checkList: [],
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      toast: null
    }
  },
  created() {
    // todo 权限获取当前登陆人 水厂
  },
  mounted() {
    this.toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.onRefresh()
  },
  methods: {
    // 页面加载/下拉刷新
    onRefresh() {
      this.loading = true
      this.finished = false
      this.getList()
    },
    getList() {
      this.checkList = []
      let params = {
        page: 1,
        size: 9999,
        //状态为in_warehouse_going,in_warehouse_unfinish的验收单
        // checkState: 'in_warehouse_unfinish',
        // warehouseNameId: ''//todo 根据登录人映射
      }
      queryCheckList(params).then(res => {
        if (res.status) {
          this.checkList = res.data.records.filter(item => item.checkState!= 'in_warehouse_finish')
          this.finished = true
          this.refreshing = false
        }

      }).catch(() => {
        this.finished = true
      })
        .finally(() => {
          this.toast.close()
          this.toast = null
          this.loading = false
        })

    },
    check() {
      if (typeof yuanchu != 'undefined') {
        yuanchu.scanner.openScanner((res) => {
          if (res) {
            alert(res);
          }
        })
      } else {
      }
    }

  }
}
</script>

<style scoped lang='less'>
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

/* 暂无数据begin */
.no-data-img {
  margin: 200px 95px 0 95px;
}

.no-data-text-descripe {
  margin-left:40%;
  font-size: 32px;
  font-weight: 400;
  color: #999999;
}

.main-container {
  height: calc(100% - 208px);
  overflow: auto;
  background-color: #d4e8fc;
}
</style>
