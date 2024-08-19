<template>
  <div class='main'>
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="物资信息" left-arrow @click-left="goBack"></fm-nav-bar>
    <div class="content">

      <div class="main-container">
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">

            <!-- 无数据 -->
            <template v-if="checkMaterialList.length == 0 && !loading">
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
                <div style='padding-top: 5px'v-for="(item, index) in checkMaterialList" :key="index">
                  <CheckMaterialCardEle :checkMaterialInfo="item" @execute="execute(item)"></CheckMaterialCardEle>
                </div>
              </div>
            </fm-list>
          </fm-pull-refresh>
        </template>
      </div>
    </div>

    <div class="btnContainer" >
      <div class="btnArea">
        <fm-button round class="dispatchBtn" @click="batchCheck">全部验收</fm-button>
        <fm-button round class="dispatchBtn" type="primary" @click="goBack">取消</fm-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import * as apis from './api'
import CheckMaterialCardEle from './CheckMaterialCardEle.vue'
import { Dialog, Toast } from 'fawkes-mobile-lib'
export default {
  name : 'checkMaterialList',
  components: {
    [Toast.name]: Toast,
    CheckMaterialCardEle
  },
  data(){
    return{
      checkMaterialList: [],
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      toast: null
    }
  },
  // created() {
  //   this.onRefresh()
  // },
  mounted() {
    this.toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    })
    this.onRefresh()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },

    // 页面加载/下拉刷新
    onRefresh() {
      // this.loading = true
      this.finished = false
      this.getList()
    },


    //查询验收单物资信息
    getList() {
      this.checkMaterialList = []
      let params={
        checkId: this.$storage.get('checkInfo')
      }
      apis.getCheckMaterialList(params).then(res=>{
        if(res.status){
          this.checkMaterialList=res.data.filter(item => item.checkDetailState == 'wait_check')
          this.refreshing=false;
          this.finished=true
        }
      }).finally(()=>{
        this.toast.close()
        this.toast = null
        this.loading = false
      })
    },
    //执行
    execute(item) {
      // console.log(item)
      // this.$store.commit('setObjectQuery', {
      //   checkId: item.id,
      // })
    },

    //批量验收，提示是否按照订单数量全部验收
    batchCheck(){
      Dialog.confirm({
        title: '批量验收',
        message: '批量验收会按照订单的数量验收全部物资，您确定吗？'
      }).then(() => {
        let params={
          checkId: this.$storage.get('checkInfo')
        }
        apis.batchCheck(params).then(res=>{
          if(res.status){
            this.$router.go(-1)
            Toast('批量验收完成')
          }else {
            Toast(res.message)
          }
        })
      }).catch(() => {
        Toast('取消')
      });
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
.btnContainer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 136px;
  //position: fixed;
  //bottom: 0;
  //width: 100%;
  //height: 136px;
  background: #d4e8fc;
  box-shadow: 0px -2px 16px 0px rgba(104, 115, 127, 0.08);
  .btnArea {
    margin: 24px 30px;
    width: calc(100% - 60px);
    height: calc(100% - 48px);
    display: flex;
    justify-content: space-between;
    .dispatchBtn {
      width: 48%;
      height: 88px;
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
  height: 100%;
  overflow: auto;
  background-color: #d4e8fc;
}

/deep/.fm-tabs__nav--line {
  background-color: #d4e8fc;
  display: flex;
  align-items: flex-end;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
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
</style>
