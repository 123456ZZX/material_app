<template>
  <div class='main'>
    <fm-nav-bar title='设置实盘数量' left-arrow @click-left='goBack' />
    <fm-form validate-first class='form-container'>
<!--      <fm-button class='button-style' @click='scan'>yuanchu扫码</fm-button>-->
<!--      <fm-button class='button-style' @click='san2'>fawkes扫码</fm-button>-->
      <fm-field
        v-model='makeWarehouseInfoForm.materialName'
        name='materialName'
        label='物资名称'
        required
        disabled
        input-align='right'
        placeholder='物资名称'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.manageTypeName'
        name='manageTypeName'
        label='管理类别'
        required
        disabled
        input-align='right'
        placeholder='管理类别'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.materialTypeName'
        name='materialTypeName'
        label='物资类别'
        required
        disabled
        input-align='right'
        placeholder='物资类别'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.specifications'
        name='specifications'
        label='物资规格'
        required
        disabled
        input-align='right'
        placeholder='物资规格'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.settlementUnit'
        name='settlementUnit'
        label='单位'
        required
        disabled
        input-align='right'
        placeholder='单位'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.expirationDate'
        name='expirationDate'
        label='保质期'
        required
        disabled
        input-align='right'
        placeholder='保质期'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.totalNumber'
        name='buyNumber'
        label='账面数量'
        required
        disabled
        input-align='right'
        placeholder='账面数量'
      />
      <fm-field
        v-model='makeWarehouseInfoForm.practicalCount'
        name='inWarehouseCount'
        label='实盘数量'
        type='tel'
        required
        input-align='right'
        placeholder='请输入实盘数量'
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
// import CheckCardEle from './CheckCardEle.vue';
import * as apis from './api'
import {
  Toast
} from 'fawkes-mobile-lib'
import Select from '../../DispatchCenter/components/Select.vue'
import { savePracticalCount } from './api'

export default {
  name: 'checkInfo',
  components: {
    Select,
    // CheckCardEle,
    [Toast.name]: Toast
  },
  data() {
    return {
      makeWarehouseInfoForm: {},
    }
  },
  computed: {
    imageUrl() {
      return require(`../../../assets/img/blueBg.png`)
    }
  },
  created() {
    // 查询盘库的物资详情
    let params = {
      id: this.$storage.get('materialMakeWarehouseId'),
    }
    apis.selectMakeWarehouseMaterialInfo(params).then(res => {
      if (res.status) {
        this.makeWarehouseInfoForm = res.data
        this.makeWarehouseInfoForm.practicalCount=res.data.totalNumber
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
      if (!this.makeWarehouseInfoForm.practicalCount) {
        return Toast('请输入实盘数量')
      }
      let params= {
        makeWarehouseDetailId: this.makeWarehouseInfoForm.id,
        totalNumber: this.makeWarehouseInfoForm.totalNumber,
        practicalCount: this.makeWarehouseInfoForm.practicalCount,
        makeWarehouseId: this.$storage.get('makeWarehouseId')
      }

      apis.savePracticalCount(params).then(res=>{
        if(res.status){
          Toast('完成')
          this.$router.go(-1)
        }else{
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
      });
    },
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
