<template>
  <div class='main'>
    <img :src="require('@/assets/img/blueBg.png')" class='main-bg' />
    <fm-nav-bar title='物资信息' left-arrow @click-left='goBack'></fm-nav-bar>
    <div class='content'>

      <div class='main-container'>
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model='refreshing' success-text='刷新成功' @refresh='onRefresh'>
            <!-- 无数据 -->
            <template v-if='OutWarehouseMaterialList.length == 0 && !loading'>
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
                <div style='padding-top: 25px' v-for='(item, index) in OutWarehouseMaterialList' :key='index'>
                  <OutWarehouseMaterialCardEle
                    :outWarehouseMaterialInfo='item'></OutWarehouseMaterialCardEle>
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
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import * as apis from './api'
import OutWarehouseMaterialCardEle from './OutWarehouseMaterialCardEle.vue'
import { Toast } from 'fawkes-mobile-lib'

export default {
  name: 'OutWarehouseMaterialList',
  components: {
    [Toast.name]: Toast,
    OutWarehouseMaterialCardEle
  },
  data() {
    return {
      OutWarehouseMaterialList: [],
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      toast: null
    }
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
    goBack() {
      // this.$router.push('/material/inWarehouseList')
      this.$router.go(-1)
    },

    // 页面加载/下拉刷新
    onRefresh() {

      // this.loading = true
      this.finished = false
      this.getList()
    },

    //查询库位下的物资库存信息，通过扫描二维码的不同，shelfId或locationId是否有值，保证查询的物资不同
    getList() {
      //扫描库房，库位的条码，查询内容如下
      if (this.$storage.get('isMaterialScan') == 0) {
        this.OutWarehouseMaterialList = []
        let params = {
          //扫库房：水厂id，库房id  扫库位：水厂，库房，库位
          shelfId: this.$storage.get('selectedOptionShelf'),
          locationId: this.$storage.get('selectedOptionLocation'),
          warehouseId: this.$storage.get('selectedOptionWarehouse'),
        }
        apis.getOutWarehouseMaterialList(params).then(res => {
          if (res.status) {
            this.OutWarehouseMaterialList = res.data
            this.refreshing = false
            this.finished = true
          }
        }).finally(() => {
          this.toast.close()
          this.toast = null
          this.loading = false
        })
      } else {
        console.log(this.$storage.get('userWarehouseIds'))
        //扫描物资条码执行查询，扫物资：物资id，水厂id
        let params={
          materialId: this.$storage.get('selectedOptionMaterial'),
          ids: this.$storage.get('userWarehouseIds')
        }
        apis.getOutWarehouseMaterialList(params).then(res => {
          if (res.status) {
            this.OutWarehouseMaterialList = res.data
            this.refreshing = false
            this.finished = true
          }
        }).finally(() => {
          this.toast.close()
          this.toast = null
          this.loading = false
        })
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
  margin-left: 40%;
  font-size: 32px;
  font-weight: 400;
  color: #999999;
}

.main-container {
  height: 100%;
  overflow: auto;
  background-color: #d4e8fc;
}

/deep/ .fm-tabs__nav--line {
  background-color: #d4e8fc;
  display: flex;
  align-items: flex-end;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}


// 顶部标题背景色
/deep/ .fm-nav-bar__content {
  background-color: transparent;
}

/deep/ .fm-hairline--bottom::after {
  border-bottom-width: 0;
}

/deep/ .fm-nav-bar__title {
  color: #FFFFFF !important;
}

// tab切换栏
// 更改背景色
/deep/ .fm-tabs__nav--line {
  background-color: #d4e8fc;
  display: flex;
  align-items: flex-end;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

/deep/ .fm-nav-bar {
  background: transparent;
}

/deep/ .fm-nav-bar .fm-icon {
  color: #FFFFFF !important;
}

// 每个tab高度变低
/deep/ .fm-tab {
  line-height: 72px;
  // height: 80%;
  // border-radius: 20px 20px 0px 0px;
  // // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
  // background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

// 取消选中横条
/deep/ .fm-tabs__line {
  width: 0 !important;
}

// 选中效果
/deep/ .fm-tab--active {
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
/deep/ .fm-tab--active .fm-tab__text--ellipsis {
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
