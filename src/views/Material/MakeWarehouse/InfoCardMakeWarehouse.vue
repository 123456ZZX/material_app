<template>
  <div class="content">
    <div class="main-container">
      <template>
        <!-- 下拉刷新 -->
        <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="init">
          <!--          <fm-button @click='check'>扫码</fm-button>-->
          <!-- 无数据 -->
          <template v-if="makeWarehouseList.length == 0 && !loading">
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
            finished-text="无更多数据了"
            @load="getList"
            :offset="0"
          >
            <div>
              <div style='padding-top: 5px' v-for="(item, index) in makeWarehouseList" :key="index">
                <MakeWarehouseCardEle :makeWarehouseInfo="item"></MakeWarehouseCardEle>
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

import * as apis from './api'
import { Toast } from 'fawkes-mobile-lib'
import MakeWarehouseCardEle from './MakeWarehouseCardEle.vue'
export default {
  name : 'InfoCardMakeWarehouse',
  components: {
    [Toast.name]: Toast,
    MakeWarehouseCardEle
  },
  data(){
    return{
      makeWarehouseList: [],
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      toast: null,
      //权限控制
      currentUserInfo: [],
      warehouseList: ''
    }
  },
  created() {
    this.toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    })
    this.init();
  },
  methods: {
    init(){
      //获取当前登陆人的权限信息
      let params = {
        id: this.$storage.get('userId')
      }
      apis.selectUserInfoByUserId(params.id).then(res => {
        if (res.status) {
          this.currentUserInfo = res.data
          //判断返回结果数
          if (this.currentUserInfo.length == 0) {
            // 没有访问权限，显示提示信息
            // this.toast.close()
            this.toast = null
            return Toast('您没有访问权限，请联系管理员。')
          } else {
            //查询权限信息
            let adminCount = this.currentUserInfo.filter(res => res.type === 'admin')
            if (adminCount.length == 0) {
              //普通用户权限，获取全部可操作的水厂
              this.warehouseList = this.currentUserInfo.map(item => item.warehouseId).join(',');
            }
            //管理员权限，不需要设置
            this.onRefresh();
          }
        }
      }).finally(()=>{
        this.loading = false
        this.finished = true
        this.refreshing = false
      })
    },
    // 页面加载/下拉刷新
    onRefresh() {
      this.loading = true
      this.finished = false
      this.getList()
    },
    getList() {
      this.makeWarehouseList = []
      let params = {
        page:1,
        size:9999,
        //已下发状态盘库信息
        state: 'make_warehouse_issue',
        // warehouseNameId:'',//todo 根据登录人映射
        // makeWarehouseName:''
        ids :this.warehouseList
      }

      apis.queryMakeWarehouseList(params).then(res=>{
        if(res.status) {
          this.makeWarehouseList = res.data.records
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

