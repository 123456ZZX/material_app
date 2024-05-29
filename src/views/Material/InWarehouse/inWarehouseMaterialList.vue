<template>
  <div class='main'>
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="物资信息" left-arrow @click-left="goBack"></fm-nav-bar>
    <div class="content">

      <div class="main-container">
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
<!--            <fm-button class='batchCheck-button' @click='scan'>扫码入库</fm-button>-->
            <div style='height: 20px'></div>
            <!-- 无数据 -->
            <template v-if="inWarehouseMaterialList.length == 0 && !loading">
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
              :offset="0">
              <div>
                <fm-checkbox-group v-model="changeMaterialOptions" >
                  <fm-cell-group v-for="it of inWarehouseMaterialList" >
                    <fm-checkbox :name="it.id" :key="it.id" shape="square" class='fm-checkbox-group-sty'>
                      <fm-cell is-link :key="it.id" @click="materialInWarehouse(it.id)">
                        <span class='span-text'>物资名称:{{it.materialName}} ,物资单位:{{it.settlementUnit}},</span>
                        <span>物资类别:{{ it.materialTypeName }},验收数量:{{it.deliveryNumber}} </span>
                      </fm-cell>
                    </fm-checkbox>
                  </fm-cell-group>
                </fm-checkbox-group>
              </div>
<!--              <div>-->
<!--                <div v-for="(item, index) in inWarehouseMaterialList" :key="index">-->
<!--                  <fm-checkbox-group v-model="changeMaterialOptions">-->
<!--                    <fm-checkbox name= "index">-->
<!--                      <InWarehouseMaterialCardEle :inWarehouseMaterialInfo="item"></InWarehouseMaterialCardEle>-->
<!--                    </fm-checkbox>-->
<!--                  </fm-checkbox-group>-->
<!--                </div>-->
<!--              </div>-->
            </fm-list>
          </fm-pull-refresh>
        </template>
      </div>
    </div>
    <div class='btnContainer'>
      <div class='btnArea'>
        <fm-button round class='dispatchBtn' @click='scan'>扫码入库</fm-button>
        <fm-button round class='dispatchBtn' type='primary' @click='changeInWarehouse'>选择入库</fm-button>
      </div>
    </div>
    <fm-form>
      <fm-popup :visible.sync="show" round position="bottom">
        <fm-cascader
          v-model="cascaderValue"
          title="请选择入库位置"
          :options="options"
          @close="show = false"
          @finish="onFinish"
        />
      </fm-popup>
    </fm-form>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import * as apis from './api'
import InWarehouseMaterialCardEle from './InWarehouseMaterialCardEle.vue'
import { Dialog, Toast } from 'fawkes-mobile-lib'
import { List } from 'fawkes-mobile-lib';
Vue.use(List);
import { Divider } from 'fawkes-mobile-lib';
Vue.use(Divider);
import { Checkbox, CheckboxGroup } from 'fawkes-mobile-lib';
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

export default {
  name : 'inWarehouseMaterialList',
  components: {
    [Toast.name]: Toast,
    InWarehouseMaterialCardEle
  },
  data(){
    return{
      show: false,
      fieldValue: '',
      cascaderValue: '',
      options: [],

      //复选框组
      changeMaterialOptions:[],
      inWarehouseMaterialList: [],
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
      // this.$router.push('/material/inWarehouseList')
      this.$router.go(-1)
    },

    // 页面加载/下拉刷新
    onRefresh() {
      // this.loading = true
      this.finished = false
      this.getList()
    },
    //查询入库的物资信息（验收单的物资信息）
    getList() {
      this.inWarehouseMaterialList = []
      let params={
        checkId: this.$storage.get('inWarehouseId')
      }
      apis.getCheckMaterialList(params).then(res=>{
        if(res.status){
          this.inWarehouseMaterialList = res.data.filter(item => item.checkDetailState !== 'in_warehouse' && item.checkDetailState !=='wait_check');
          this.refreshing=false;
          this.finished=true
        }
      }).finally(()=>{
        this.toast.close()
        this.toast = null
        this.loading = false
      })
    },
    materialInWarehouse(id){
      this.$storage.set('materialInWarehouseId',id)//存储的是验收单明细的id
      this.$router.push({
        path: '/material/InWarehouseMaterialInfo',
      })
    },

    //扫码
    scan() {
      if(this.changeMaterialOptions.length == 0){
        Toast('请选择物资之后再批量入库')
        return;
      }
      if (typeof yuanchu != 'undefined') {
        yuanchu.scanner.openScanner((res) => {
          //查询是否是具体的货架
          let params= {
            id: res
          }
          apis.selectByshelfId(params).then(res=>{
            if(res.status && res.data !==null){
              Dialog.confirm({
                title: '批量入库',
                message: '批量入库会按照验收的数量，对选中的物资批量入库，您确定吗？'
              }).then(() => {
                //将物资批量入库到当前库位中
                let params= {
                  checkDetailIds: this.changeMaterialOptions,
                  warehouseId: res.data.warehouseId,
                  warehouseLocationId: res.data.locationId,
                  shelfId: res.data.id
                }
                apis.batchInWarehouseMaterial(params).then(res=>{
                  if(res.status){
                    Toast('入库完成')
                    this.onRefresh()
                  }
                })
              })
            }else{
              Toast('请扫描货架码进行批量入库')
            }
          })
        })
      } else {
        Toast('扫码异常')
      }
    },
    //选择入库
    changeInWarehouse(){
      if(this.changeMaterialOptions.length == 0){
        Toast('请选择物资之后再批量入库')
        return;
      }
      this.show=true;
      //TODO 获取当前登录人所在的水厂查询水厂的存储结构
      let params= {
        ids: this.$storage.get('inWarehouseIds')
      }
      apis.getWarehouseThierarchy(params).then(res=>{
        if(res.status){
          this.options= res.data
        }
      })
    },
    //保存选择的位置，弹出提示框确定
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join('/');

      Dialog.confirm({
        title: '批量选择入库',
        message: '确定将选中的物资按照验收数量全部入库到选中的库位吗？'
      }).then(() => {
        //将选中的物资入库到当前选中的货架中
        let params= {
          checkDetailIds: this.changeMaterialOptions,
          warehouseId: selectedOptions[0].value,
          warehouseLocationId: selectedOptions[1].value,
          shelfId: selectedOptions[2].value
        }
        apis.batchInWarehouseMaterial(params).then(res=>{
          if(res.status){
            Toast('入库完成')
            this.onRefresh()
          }
        })
      }).catch(()=>{
        Toast('取消')
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
.fm-checkbox-group-sty {
  padding-left: 20px;
}
.list-item {
  background-color: #d4e8fc;
}

.span-text{
  height: 100%;
  padding-right: 10px
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
  background: #ffffff;
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
.batchCheck-button {
  height: 80px;
  width: 80%;
  margin: 20px auto 0; /* 设置左右外边距为auto，实现水平居中 */
  display: block; /* 确保按钮以块级元素显示 */
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
  background-color: #fdfcfc;
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
