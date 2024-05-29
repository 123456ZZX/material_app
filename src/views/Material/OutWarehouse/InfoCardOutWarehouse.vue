<template>
  <div class='button-container'>
    <fm-button type='primary' :disabled = isLogin @click='scan'>扫码出库</fm-button>
    <div style='height: 100px'></div>
    <fm-button type='primary' :disabled = isLogin @click='changeOutWarehouse'>点选出库</fm-button>
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
      finished: false,
      //权限控制
      currentUserInfo: [],
      warehouseList: '',
      isLogin: false
    }
  },
  created() {

    this.toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })

    this.$storage.remove('selectedOptionShelf')
    this.$storage.remove('selectedOptionLocation')
    this.$storage.remove('selectedOptionWarehouse')
    this.$storage.remove('selectedOptionMaterial')
    this.$storage.remove('isMaterialScan')
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
            this.isLogin = true
            this.toast = null
            return Toast('您没有访问权限，请联系管理员。')
          } else {
            //查询权限信息
            let adminCount = this.currentUserInfo.filter(res => res.type === 'admin')
            if (adminCount.length == 0) {
              //普通用户权限，获取全部可操作的水厂
              this.warehouseList = this.currentUserInfo.map(item => item.warehouseId).join(',');
              this.$storage.set('userWarehouseIds',this.warehouseList)
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


    //扫码出库，判断扫描结果
    scan() {

      // let params = {
      //   id: '20230605001'
      // }
      // //判断是否为物资条码
      // apis.selectMaterialCount(params).then(res => {
      //   if (res.status && res.data != 0) {
      //     //跳转物资显示页面，显示订单入库记录表的物资数量
      //     this.$storage.set('isMaterialScan', 1)
      //     this.$storage.set('selectedOptionMaterial', params.id)
      //     // this.$storage.set('selectedOptionWarehouse', '1778601350805184514')
      //     this.$router.push({
      //       path: '/material/outWarehouseMaterialList'
      //     })
      //   } else {
      //     Toast('请扫描库房，库位或物资条码！')
      //   }
      // })

        if (typeof yuanchu != 'undefined') {
          yuanchu.scanner.openScanner((res) => {
            let params = {
              id: res
            }

            //查询是否为库房条码
            apis.selectCountByLocationId(params).then(res => {
              if (res.status && res.data != 0) {
                this.$storage.set('selectedOptionLocation', params.id)
                this.$storage.set('isMaterialScan', 0)
                // 跳转物资显示页面，显示库房的全部物资信息
                //查询库房信息
                apis.selectLocationInfo(params).then(res => {
                  if (res.status) {
                    //存储库房水厂id
                    this.$storage.set('selectedOptionWarehouse', res.data.warehouseId)
                    this.$router.push({
                      path: '/material/outWarehouseMaterialList'
                    })
                  }
                })
              } else {
                //判断是否为库位条码，库位条码存储库位和库房和水厂id
                apis.selectCountByshelfId(params).then(res => {
                  if (res.status && res.data != 0) {
                    this.$storage.set('isMaterialScan', 0)
                    this.$storage.set('selectedOptionShelf', params.id)
                    //查询出库位信息
                    apis.selectShelfInfo(params).then(res => {
                      if (res.status) {
                        //存储库房水厂信息
                        this.$storage.set('selectedOptionLocation', res.data.locationId)
                        this.$storage.set('selectedOptionWarehouse', res.data.warehouseId)

                        //跳转物资显示页面，显示货架的全部物资信息
                        // 跳转到物资设置出库数量页面
                        this.$router.push({
                          path: '/material/outWarehouseMaterialList'
                        })
                      }
                    })
                  } else {
                    //判断是否为物资条码
                    apis.selectMaterialCount(params).then(res => {
                      if (res.status && res.data != 0) {
                        //跳转物资显示页面，显示订单入库记录表的物资数量
                        this.$storage.set('isMaterialScan', 1)
                        this.$storage.set('selectedOptionMaterial', params.id)
                        // this.$storage.set('selectedOptionWarehouse', '1778601350805184514')
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

      let params = {
        ids: this.warehouseList
      }
      apis.getWarehouseThierarchy(params).then(res => {
        if (res.status) {
          this.options = res.data
        }
      })
    },

    //保存选择的位置，并跳转到物资列表页面
    onFinish({ selectedOptions }) {

      this.$storage.remove('selectedOptionShelf')
      this.$storage.remove('selectedOptionLocation')
      this.$storage.remove('selectedOptionWarehouse')
      this.$storage.remove('selectedOptionMaterial')
      this.$storage.remove('isMaterialScan')

      this.$storage.set('selectedOptionWarehouse', selectedOptions[0].value)
      this.$storage.set('selectedOptionLocation', selectedOptions[1].value)
      this.$storage.set('selectedOptionShelf', selectedOptions[2].value)
      this.$storage.set('isMaterialScan','0')

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
        ids: this.warehouseList
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

