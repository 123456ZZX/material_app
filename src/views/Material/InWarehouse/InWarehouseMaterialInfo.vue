<template>
  <div class='main'>
    <fm-nav-bar title='入库' left-arrow @click-left='goBack' />
    <fm-form validate-first class='form-container'>
<!--      <fm-button class='button-style' @click='scan'>扫码入库</fm-button>-->
<!--      <fm-field-->
<!--        v-model='checkInfoForm.orderId'-->
<!--        name='checkId'-->
<!--        label='订单编号'-->
<!--        required-->
<!--        disabled-->
<!--        input-align='right'-->
<!--        placeholder='订单编号'-->
<!--      />-->
      <fm-field
        v-model='checkInfoForm.materialName'
        name='materialName'
        label='物资名称'
        required
        disabled
        input-align='right'
        placeholder='物资名称'
      />
      <fm-field
        v-model='checkInfoForm.manageTypeName'
        name='manageTypeName'
        label='管理类别'
        required
        disabled
        input-align='right'
        placeholder='管理类别'
      />
      <fm-field
        v-model='checkInfoForm.materialTypeName'
        name='materialTypeName'
        label='物资类别'
        type='dateTime'
        required
        disabled
        input-align='right'
        placeholder='物资类别'
      />
      <fm-field
        v-model='checkInfoForm.specifications'
        name='specifications'
        label='物资规格'
        required
        disabled
        input-align='right'
        placeholder='物资规格'
      />
      <fm-field
        v-model='checkInfoForm.settlementUnit'
        name='settlementUnit'
        label='单位'
        required
        disabled
        input-align='right'
        placeholder='单位'
      />
      <fm-field
        v-model='checkInfoForm.expirationDate'
        name='expirationDate'
        label='保质期'
        required
        disabled
        input-align='right'
        placeholder='保质期'
      />
      <fm-field
        v-model='checkInfoForm.deliveryNumber'
        name='deliveryNumber'
        label='验收数量'
        required
        disabled
        input-align='right'
        placeholder='验收数量'
      />
      <fm-field
        v-model='checkInfoForm.inWarehouseFinalCount'
        name='inWarehouseFinalCount'
        label='已入库数量'
        required
        disabled
        input-align='right'
        placeholder='已入库数量'
      />
      <fm-field
        v-model='checkInfoForm.price'
        name='price'
        label='购买单价(元)'
        required
        disabled
        input-align='right'
        placeholder='购买单价'
      />
      <fm-field
        v-model='checkInfoForm.inWarehouseCount'
        name='inWarehouseCount'
        label='入库数量'
        required
        input-align='right'
        placeholder='请输入入库数量'
      />
      <fm-field
        readonly
        clickable
        :value='locationName'
        label="库房"
        placeholder="请选择库房"
        @click="chooseLocationVisit = true"
      />
      <fm-popup :visible.sync="chooseLocationVisit" round position="bottom">
        <fm-picker
          title="库房"
          show-toolbar
          :columns="warehouseLocationOptions2"
          @cancel="chooseLocationVisit = false"
          @confirm="changeWarehouseLocation"
        />
      </fm-popup>


      <fm-field
        readonly
        clickable
        :value='shelfName'
        label="库位"
        placeholder="请选择库位"
        @click="chooseShelfVisit = true"
      />
      <fm-popup :visible.sync="chooseShelfVisit" round position="bottom">
        <fm-picker
          title="库位"
          show-toolbar
          :columns="shelfOptions2"
          @cancel="chooseShelfVisit = false"
          @confirm="changeShelf"
        />
      </fm-popup>


    </fm-form>
    <div class='btnContainer'>
      <div class='btnArea'>
        <fm-button round class='dispatchBtn' @click='save'>入库</fm-button>
        <fm-button round class='dispatchBtn' type='primary' @click='cancel'>取消</fm-button>
      </div>
    </div>
  </div>

</template>

<script>
// import CheckCardEle from './CheckCardEle.vue';
import * as apis from './api'
import {
  Toast
} from 'fawkes-mobile-lib'
import Select from '../../DispatchCenter/components/Select.vue'

export default {
  name: 'checkInfo',
  components: {
    Select,
    // CheckCardEle,
    [Toast.name]: Toast
  },
  data() {
    return {
      locationName:'',
      shelfName:'',
      chooseLocationVisit: false,
      chooseShelfVisit: false,
      warehouseLocationOptions:[],
      //库房名列表
      warehouseLocationOptions2: [],
      checkInfoForm: {},
      shelfOptions: [],
      //库位名列表
      shelfOptions2:[],

      //物资入库信息
      materialInWarehouseInfo:{
        shelfId:'',
        warehouseLocationId:'',
        warehouseId:'',
        deliveryNumber:''
      }
    }
  },
  mounted() {

  },
  computed: {
    imageUrl() {
      return require(`../../../assets/img/blueBg.png`)
    }
  },
  created() {
    //获取库房列表
    let params2={
      warehouseId: this.$storage.get('warehouseId')
    }
    apis.getWarehouseLocationOptions(params2).then(res=>{
      if(res.status){
        this.warehouseLocationOptions = res.data
        //将库房名称取出单独存储
        this.warehouseLocationOptions2=this.warehouseLocationOptions.map(res=> res.locationName)
      }
    })
    // 查询验收单的物资详情
    let params = {
      id: this.$storage.get('materialInWarehouseId'),
    }
    apis.selectCheckMaterialInfo(params).then(res => {
      if (res.status) {
        this.checkInfoForm = res.data
        this.checkInfoForm.inWarehouseCount=res.data.deliveryNumber
      }
    }).catch(error => {
      console.error('Error fetching data:', error)
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
    save() {
      if (!this.checkInfoForm.inWarehouseCount) {
        return Toast('请输入入库数量')
      }
      if (!this.locationName) {
        return Toast('请选择库房')
      }
      if (!this.shelfName) {
        return Toast('请选择库位')
      }
      let params= {
        checkDetailId: this.materialInWarehouseInfo.checkMaterialId,
        inWarehouseFinalCount: this.materialInWarehouseInfo.inWarehouseFinalCount,
        deliveryNumber: this.materialInWarehouseInfo.deliveryNumber,
        materialId: this.materialInWarehouseInfo.materialId,
        shelfId: this.materialInWarehouseInfo.shelfId,
        warehouseLocationId: this.materialInWarehouseInfo.warehouseLocationId,
        warehouseId: this.materialInWarehouseInfo.warehouseId,
        inWarehouseCount: this.checkInfoForm.inWarehouseCount,
        checkId: this.materialInWarehouseInfo.checkId,
      }
      apis.materialInWarehouse(params).then(res => {
        if (res.status) {
          Toast('入库完成')
          this.$router.go(-1)
        } else {
          Toast(res.message)
        }
      })
    },
    //扫码
    // scan() {
    //   if (typeof yuanchu != 'undefined') {
    //     yuanchu.scanner.openScanner((res) => {
    //       //查询是否是具体的货架
    //       let params= {
    //         id: res
    //       }
    //       apis.selectCountByshelfId(params).then(res=>{
    //         if(res.status && res.data !=0 ){
    //           //跳转物资显示页面，显示货架的全部物资信息
    //           // 跳转到物资设置出库数量页面
    //           this.$storage.remove('selectedOptionShelf');
    //           this.$storage.remove('selectedOptionLocation');
    //           this.$storage.remove('selectedOptionWarehouse')
    //
    //           this.$storage.set('selectedOptionShelf',id)
    //           this.$router.push({
    //             path: '/material/outWarehouseMaterialInfo',
    //           })
    //         }
    //       })
    //     })
    //   } else {
    //     Toast('扫码异常')
    //   }
    // },
    //选择库房后查询库位信息
    changeWarehouseLocation(val,index){
      this.locationName=val
      let params= {
        locationId: this.warehouseLocationOptions[index].id,
        warehouseId: this.warehouseLocationOptions[index].warehouseId
      }
      apis.selectShelfList(params).then(res=>{
        if(res.status){
          this.shelfOptions=res.data
          //将货架名称单独存储
          this.shelfOptions2 = this.shelfOptions.map(res=>res.shelfName)
        }
      })
      this.chooseLocationVisit=false;
    },

    //选择库位信息
    changeShelf(val,index){
      this.materialInWarehouseInfo.warehouseId = this.shelfOptions[index].warehouseId;
      this.materialInWarehouseInfo.warehouseLocationId = this.shelfOptions[index].locationId;
      this.materialInWarehouseInfo.shelfId = this.shelfOptions[index].id;
      this.materialInWarehouseInfo.materialId = this.checkInfoForm.materialId;
      //验收单明细id
      this.materialInWarehouseInfo.checkMaterialId = this.checkInfoForm.id;
      this.materialInWarehouseInfo.inWarehouseFinalCount = this.checkInfoForm.inWarehouseFinalCount;
      this.materialInWarehouseInfo.deliveryNumber = this.checkInfoForm.deliveryNumber;
      this.materialInWarehouseInfo.materialId = this.checkInfoForm.materialId;
      this.materialInWarehouseInfo.checkId = this.checkInfoForm.checkId;

      this.shelfName=val
      this.chooseShelfVisit=false;
    }
  }
}
</script>

<style scoped lang='less'>
.form-container {
  height: calc(100% - 46px);
  overflow-y: scroll;
  //margin-top: 40px; /* 增加顶部内边距 */
}

.button-style {
  width: 100%;
}


.main {
  position: relative;
  //background-color: #055ffc !important;
  height: 100%;

  .main-bg {
    position: absolute;
    width: 100%;
  }

  .no-data-text-descripe {
    font-size: 32px;
    font-weight: 400;
    color: #999999;
  }

  .no-data-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-data-img {
    margin: 200px 95px 0 95px;
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
}
</style>
