<template>
  <div class='main'>
    <fm-nav-bar title='物资出库' left-arrow @click-left='goBack' />
    <fm-form validate-first class='form-container'>
      <fm-field
        v-model='outWarehouseInfoForm.materialName'
        name='materialName'
        label='物资名称'
        required
        disabled
        input-align='right'
        placeholder='物资名称'
      />
      <fm-field
        v-model='outWarehouseInfoForm.manageTypeName'
        name='manageTypeName'
        label='管理类别'
        required
        disabled
        input-align='right'
        placeholder='管理类别'
      />
      <fm-field
        v-model='outWarehouseInfoForm.materialTypeName'
        name='materialTypeName'
        label='物资类别'
        required
        disabled
        input-align='right'
        placeholder='物资类别'
      />
      <fm-field
        v-model='outWarehouseInfoForm.specifications'
        name='specifications'
        label='物资规格'
        required
        disabled
        input-align='right'
        placeholder='物资规格'
      />
      <fm-field
        v-model='outWarehouseInfoForm.settlementUnit'
        name='settlementUnit'
        label='单位'
        required
        disabled
        input-align='right'
        placeholder='单位'
      />
      <fm-field
        v-model='outWarehouseInfoForm.expirationDate'
        name='expirationDate'
        label='保质期'
        required
        disabled
        input-align='right'
        placeholder='保质期'
      />
      <fm-field
        v-model='outWarehouseInfoForm.totalNumber'
        name='buyNumber'
        label='物资库存'
        required
        disabled
        input-align='right'
        placeholder='物资库存'
      />
      <fm-field
        v-model='outWarehouseInfoForm.outCount'
        name='outCount'
        label='出库数量'
        type='tel'
        required
        input-align='right'
        placeholder='请输入出库数量'
      />
    </fm-form>
    <div class='btnContainer'>
      <div class='btnArea'>
        <fm-button round class='dispatchBtn' @click='save'>确定</fm-button>
        <fm-button round class='dispatchBtn' type='primary' @click='cancel'>取消</fm-button>
      </div>
    </div>
  </div>

</template>

<script>
import * as apis from './api'
import {
  Toast
} from 'fawkes-mobile-lib'
import Select from '../../DispatchCenter/components/Select.vue'

export default {
  name: 'OutWarehouseMaterialInfo',
  components: {
    Select,
    [Toast.name]: Toast
  },
  data() {
    return {
      outWarehouseInfoForm: {}
    }
  },
  computed: {
    imageUrl() {
      return require(`../../../assets/img/blueBg.png`)
    }
  },
  //查询库存物资详情
  //扫码库房的话，到这一步可以知道库房和物资id就能查询出物资的库存量
  //扫描的是货架的话，到这一步可以知道货架id和物资的id，同样能查询出来，每个货架只能绑定一个库房
  created() {
    let params = {
      shelfId: this.$storage.get('shelfOutWarehouseId'),
      locationId: this.$storage.get('locationOutWarehouseId'),
      warehouseId: this.$storage.get('warehouseOutWarehouseId'),
      materialId: this.$storage.get('materialOutWarehouseId')
    }
    apis.getOutWarehouseMaterialList(params).then(res => {
      if (res.status) {
        this.outWarehouseInfoForm = res.data[0]
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
      if (!this.outWarehouseInfoForm.outCount) {
        return Toast('请输入出库数量')
      }
      let params = {
        shelfId: this.outWarehouseInfoForm.shelfId,
        warehouseId: this.outWarehouseInfoForm.warehouseId,
        locationId: this.outWarehouseInfoForm.locationId,
        materialId: this.outWarehouseInfoForm.materialId,
        outCount: this.outWarehouseInfoForm.outCount,
        remark: 'app直接出库'
      }

      apis.saveOutCount(params).then(res => {
        if (res.status) {
          Toast('完成')
          this.$router.go(-1)
        } else {
          Toast(res.message)
        }
      })
    },
    //扫码
    scan() {
      if (typeof yuanchu != 'undefined') {
        yuanchu.scanner.openScanner((res) => {
          alert(res)
          alert(res === '111')
        })
      } else {

      }
    },
    san2() {
      fawkes.plugins.scanner.openScanner((res) => {
        alert(res)
        alert(res === '111')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.form-container {
  height: calc(100% - 46px);
  overflow-y: scroll;
  margin-top: 40px; /* 增加顶部内边距 */
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
