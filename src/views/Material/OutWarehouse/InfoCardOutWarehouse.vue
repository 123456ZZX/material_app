<template>
  <div class='button-container'>
    <fm-button type='primary' @click='scan'>扫码出库</fm-button>
    <div style='height: 100px'></div>
    <fm-button type='primary' @click='changeOutWarehouse'>点选出库</fm-button>
    <fm-form>
      <fm-popup :visible.sync='show' round position='bottom'>
        <fm-cascader
          v-model='cascaderValue'
          title='请选择出库位置'
          :options='options'
          @close='show = false'
          @finish='onFinish'
        />
      </fm-popup>
    </fm-form>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { Button } from 'fawkes-mobile-lib'

Vue.use(Button)
import { Cascader } from 'fawkes-mobile-lib'

Vue.use(Cascader)

import * as apis from './api'
import { Toast } from 'fawkes-mobile-lib'
import { selectCountByshelfId } from './api'
// import MakeWarehouseCardEle from './MakeWarehouseCardEle.vue'
export default {
  name: 'InfoCardMakeWarehouse',
  components: {
    [Toast.name]: Toast
    // MakeWarehouseCardEle
  },
  //扫码和点选出库，点击扫码出库和点选出库
  data() {
    return {
      show: false,
      fieldValue: '',
      cascaderValue: '',
      options: [],
      makeWarehouseList: [],
      loading: false,
      finished: false
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
    //扫码出库，判断扫描结果：
    // 如果为库房，物资列表页面显示全部物资信息；
    // 如果为货架，物资列表页面显示货架中的全部物资信息；
    // 如果扫描物资信息，直接跳转物资详情页面，选择出库数量
    //扫码，扫码出库，如果扫描的是物资上的二维码，这个二维码中的数据其实是订单的明细id，新加了一个表为物资入库订单记录表，
    // 其中有订单的明细id，订单明细对应物资入库的位置，以及入库的数量，扫码就去这个表里查询订单明细id，得到物资的位置数量等信息，还加一个字段是出库数量，扫码后得到是所有的订单对应的入库的物资的位置以及剩余数量，
    //PC端在领料或出库时判断当前的信息是否存在于新表中，存在的话就将已出库数量新增
    //在物资进行入库时，将物资数量和信息存储到订单入库表中，
    scan() {

      // let params = {
      //   id: '1778608284316852226'
      // }
      //
      // this.$storage.remove('selectedOptionShelf')
      // this.$storage.remove('selectedOptionLocation')
      // this.$storage.remove('selectedOptionWarehouse')

      //判断是否为物资条码
      // apis.selectCountByOrderDetailId(params).then(res => {
      //   if (res.status && res.data != 0) {
      //     //跳转物资显示页面，显示订单入库记录表的物资数量
      //     this.$storage.set('isMaterialScan', 1)
      //
      //     this.$storage.set('selectedOptionShelf', params.id)
      //     this.$router.push({
      //       path: '/material/outWarehouseMaterialList'
      //     })
      //   }
      // })

      //
      // apis.selectCountByshelfId(params).then(res => {
      //   if (res.status && res.data != 0) {
      //     //查询出库位信息
      //     apis.selectShelfInfo(params).then(res => {
      //       if (res.status) {
      //         //存储库房水厂信息
      //         this.$storage.set('selectedOptionLocation', res.data.locationId)
      //         this.$storage.set('selectedOptionWarehouse', res.data.warehouseId)
      //       }
      //     })
      //
      //     //跳转物资显示页面，显示货架的全部物资信息
      //     // 跳转到物资设置出库数量页面
      //     this.$storage.set('isMaterialScan', 0)
      //     this.$storage.set('selectedOptionShelf', params.id)
      //     this.$router.push({
      //       path: '/material/outWarehouseMaterialList'
      //     })
      //   }
      // })


      if (typeof yuanchu != 'undefined') {
        yuanchu.scanner.openScanner((res) => {
          let params = {
            id: res
          }
          this.$storage.remove('selectedOptionShelf')
          this.$storage.remove('selectedOptionLocation')
          this.$storage.remove('selectedOptionWarehouse')

          //查询是否为库房条码
          apis.selectCountByLocationId(params).then(res => {
            if (res.status && res.data != 0) {
              // 跳转物资显示页面，显示库房的全部物资信息
              //查询库房信息
              apis.selectLocationInfo(params).then(res => {
                if (res.status) {
                  //存储库房水厂id
                  this.$storage.set('selectedOptionWarehouse', res.data.warehouseId)
                }
              })
              this.$storage.set('selectedOptionLocation', params.id)
              this.$storage.set('isMaterialScan', 0)

              this.$router.push({
                path: '/material/outWarehouseMaterialList'
              })
            } else {
              //判断是否为库位条码，库位条码存储库位和库房和水厂id
              apis.selectCountByshelfId(params).then(res => {
                if (res.status && res.data != 0) {
                  //查询出库位信息
                  apis.selectShelfInfo(params).then(res => {
                    if (res.status) {
                      //存储库房水厂信息
                      this.$storage.set('selectedOptionLocation', res.data.locationId)
                      this.$storage.set('selectedOptionWarehouse', res.data.warehouseId)
                    }
                  })
                  //跳转物资显示页面，显示货架的全部物资信息
                  // 跳转到物资设置出库数量页面
                  this.$storage.set('isMaterialScan', 0)
                  this.$storage.set('selectedOptionShelf', params.id)
                  this.$router.push({
                    path: '/material/outWarehouseMaterialList'
                  })
                } else {
                  //TODO 判断是否为物资条码
                  apis.selectCountByOrderDetailId(params).then(res => {
                    if (res.status && res.data != 0) {
                      //跳转物资显示页面，显示订单入库记录表的物资数量
                      this.$storage.set('isMaterialScan', 1)

                      this.$storage.set('selectedOptionShelf', params.id)
                      this.$router.push({
                        path: '/material/outWarehouseMaterialList'
                      })
                    } else {
                      Toast('请扫描库房，库位或物资条码！')
                    }
                  })
                }
              })
            }
          })
        })
      } else {
        Toast('扫码异常')
      }
    },
    //点选出库，选择到具体的货架，查询出物资列表库存信息
    changeOutWarehouse() {
      this.show = true
      //TODO 获取当前登录人所在的水厂，查询水厂下包含的库房列表
      let params = {
        warehouseId: '1778601350805184514'
      }
      apis.getWarehouseThierarchy(params).then(res => {
        if (res.status) {
          this.options = res.data
        }
      })
    },

    //保存选择的位置，并跳转到物资列表页面
    onFinish({ selectedOptions }) {
      this.$storage.set('selectedOptionShelf', selectedOptions[2].value)
      this.$storage.set('selectedOptionWarehouse', selectedOptions[0].value)
      this.$storage.set('selectedOptionLocation', selectedOptions[1].value)

      this.show = false
      this.fieldValue = selectedOptions.map((option) => option.text).join('/')
      this.$router.push({
        path: '/material/outWarehouseMaterialList'
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
        page: 1,
        size: 9999,
        //已下发状态盘库信息
        state: 'make_warehouse_issue',
        warehouseNameId: '',//todo 根据登录人映射
        makeWarehouseName: ''
      }

      apis.queryMakeWarehouseList(params).then(res => {
        if (res.status) {
          this.makeWarehouseList = res.data.records
          this.finished = true
          this.refreshing = false
        }
      }).catch(() => {
        this.finished = true
      }).finally(() => {
        this.toast.close()
        this.toast = null
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang='less'>
.button-container {
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around; /* 垂直方向上均匀分布 */
  align-items: center; /* 水平居中 */
  height: 100%; /* 设置容器高度为视口高度，使按钮垂直居中 */
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
</style>

