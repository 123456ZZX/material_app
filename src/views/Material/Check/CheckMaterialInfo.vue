<template>
  <div class='main'>
    <fm-nav-bar title='验收' left-arrow @click-left='goBack' />
    <fm-form validate-first class='form-container'>
      <fm-field
        v-model='checkInfoForm.checkId'
        name='checkId'
        label='验收单编号'
        required
        disabled
        input-align='right'
        placeholder='验收单编号'
      />
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
        v-model='checkInfoForm.buyNumber'
        name='buyNumber'
        label='购买数量'
        required
        disabled
        input-align='right'
        placeholder='购买数量'
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
        name="lastBatches"
        required
        input-align="right"
        :rules="[{ required: true, message: '请选择规格，质量是否合格' }]"
        label="规格，质量是否合格"
      >
        <template #input>
          <fm-radio-group v-model="checkInfoForm.qualityExamine" direction="horizontal">
            <fm-radio name="0" @click="selectQualified('0')">是</fm-radio>
            <fm-radio name="1" @click="selectQualified('1')">否</fm-radio>
          </fm-radio-group>
        </template>
      </fm-field>

      <fm-field
        v-model='checkInfoForm.deliveryNumber'
        name='deliveryNumber'
        label='验收数量'
        required
        input-align='right'
        placeholder='请输入验收数量'
      />
    </fm-form>
    <div class='btnContainer'>
      <div class='btnArea'>
        <fm-button round class='dispatchBtn' @click='save'>提交</fm-button>
        <fm-button round class='dispatchBtn' type='primary' @click='cancel'>取消</fm-button>
      </div>
    </div>
  </div>

</template>

<script>
import CheckCardEle from './CheckCardEle.vue'
import * as apis from './api'
import dayjs from 'dayjs'
import {
  Toast
} from 'fawkes-mobile-lib'

export default {
  name: 'checkInfo',
  components: {
    CheckCardEle,
    [Toast.name]: Toast
  },
  data() {
    return {
      checkInfoForm: {
        // id: '',
        // warehouseName: '',
        // suppilerName: '',
        // createDate: '',
        // examineResult: '合格',
        // checkResult: '合格',
        // contractCheckOpinion: '一致',
        // supplierCheckOpinion: '一致',
        // orderCheckOpinion: '一致',
        // warrantyCheckOpinion: '齐全',
        // certificateCheckOpinion: '齐全',
        // specificationCheckOpinion: '齐全'
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
    let params = {
      id: this.$storage.get('checkMaterialId')
      // this.$storage.set('checkMaterialId')
    }
    // 查询验收单的物资详情
    apis.selectCheckMaterialInfo(params).then(res => {
      if (res.status) {
        this.checkInfoForm = res.data
        this.checkInfoForm.deliveryNumber= res.data.buyNumber
        this.checkInfoForm.qualityExamine= res.data.qualityExamine || 0
        // this.checkInfoForm.examineResult = '合格'
        // this.checkInfoForm.checkResult = '合格'
        // this.checkInfoForm.contractCheckOpinion = '一致'
        // this.checkInfoForm.supplierCheckOpinion = '一致'
        // this.checkInfoForm.orderCheckOpinion = '一致'
        // this.checkInfoForm.warrantyCheckOpinion = '齐全'
        // this.checkInfoForm.certificateCheckOpinion = '齐全'
        // this.checkInfoForm.specificationCheckOpinion = '齐全'
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
      if (!this.checkInfoForm.deliveryNumber) {
        return Toast('请输入验收数量')
      }
      if (!this.checkInfoForm.qualityExamine) {
        return Toast('请选择规格，质量是否合格')
      }
      let params = {
        checkMaterialId: this.$storage.get('checkMaterialId'),
        checkCount: this.checkInfoForm.deliveryNumber,
        buyNumber: this.checkInfoForm.buyNumber,
        checkId: this.checkInfoForm.checkId,
        qualityExamine: this.checkInfoForm.qualityExamine,
        price: this.checkInfoForm.price
      }
      apis.saveMaterialCheckResult(params).then(res => {
        if (res.status) {
          Toast('验收完成')
          this.$router.go(-1)
        } else {
          Toast(res.message)
        }
      })
    },

    //验收是否合格
    selectQualified(val){
      this.checkInfoForm.qualityExamine=val
    },
  }
}
</script>

<style scoped lang='less'>
.form-container {
  height: calc(100% - 46px);
  overflow-y: scroll;
  //margin-top: 40px; /* 增加顶部内边距 */
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
