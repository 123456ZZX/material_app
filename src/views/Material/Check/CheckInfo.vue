<template>
  <div class="main">
    <fm-nav-bar title="验收" left-arrow  @click-left="goBack"/>
    <fm-form validate-first class="form-container">
      <fm-field
        v-model="checkInfoForm.orderId"
        name="id"
        label="订单编号"
        required
        disabled
        input-align="right"
        placeholder="订单编号"
      />
      <fm-field
        v-model="checkInfoForm.warehouseName"
        name="warehouseName"
        label="水厂名称"
        required
        disabled
        input-align="right"
        placeholder="水厂名称"
      />
      <fm-field
        v-model="checkInfoForm.suppilerName"
        name="suppilerName"
        label="供货商名称"
        required
        disabled
        input-align="right"
        placeholder="供货商名称"
      />
      <fm-field
        v-model="checkInfoForm.createDate"
        name="createDate"
        label="创建日期"
        type="dateTime"
        required
        disabled
        input-align="right"
        placeholder="创建日期"
      />
      <fm-field
        name="isBatches"
        required
        input-align="right"
        :rules="[{ required: true, message: '请选择是否分批交付' }]"
        label="是否分批交付"
      >
        <template #input>
          <fm-radio-group v-model="checkInfoForm.isBatches" direction="horizontal">
            <fm-radio name="0" @click="selectIsBatches('0')">是</fm-radio>
            <fm-radio name="1" @click="selectIsBatches('1')">否</fm-radio>
          </fm-radio-group>
        </template>
      </fm-field>

      <fm-field
        v-if='checkInfoForm.isBatches === "0"'
        name="lastBatches"
        required
        input-align="right"
        :rules="[{ required: true, message: '请选择是否最后一批' }]"
        label="是否最后一批"
      >
        <template #input>
          <fm-radio-group v-model="checkInfoForm.lastBatches" direction="horizontal">
            <fm-radio name="0" @click="selectLastBatches('0')">是</fm-radio>
            <fm-radio name="1" @click="selectLastBatches('1')">否</fm-radio>
          </fm-radio-group>
        </template>
      </fm-field>

      <fm-field
        name="examineResult"
        required
        input-align="right"
        :rules="[{ required: true, message: '检查结果' }]"
        label="检查结果"
      >
        <template #input>
          <fm-radio-group v-model="checkInfoForm.examineResult" direction="horizontal">
            <fm-radio name="抽样" @click="selectexamineResult('抽样')">抽样</fm-radio>
            <fm-radio name="全数" @click="selectexamineResult('全数')">全数</fm-radio>
          </fm-radio-group>
        </template>
      </fm-field>

      <fm-field
        v-if='this.checkInfoForm.examineResult=="抽样"'
        v-model="checkInfoForm.qualifiedCount"
        name="qualifiedCount"
        label="合格率"
        required
        input-align="right"
        placeholder="合格率"
      />
      <fm-field
        v-if='this.checkInfoForm.examineResult=="全数"'
        v-model="checkInfoForm.qualifiedCount"
        name="qualifiedCount"
        label="合格个数"
        required
        input-align="right"
        placeholder="合格个数"
      />

      <fm-field
        name="checkResult"
        required
        input-align="right"
        :rules="[{ required: true, message: '验收结果' }]"
        label="验收结果"
      >
        <template #input>
          <fm-radio-group v-model="checkInfoForm.checkResult" direction="horizontal">
            <fm-radio name="合格" @click="selectcheckResult('合格')">合格</fm-radio>
            <fm-radio name="不合格" @click="selectcheckResult('不合格')">不合格</fm-radio>
          </fm-radio-group>
        </template>
      </fm-field>
      <fm-field
        v-if='this.checkInfoForm.checkResult=="不合格"'
        v-model="checkInfoForm.checkNoQualified"
        name="checkNoQualified"
        label="不合格处理意见"
        required
        input-align="right"
        placeholder="不合格处理意见"
      />

      <fm-field
        v-model="checkInfoForm.contractCheckOpinion"
        name="contractCheckOpinion"
        label="合同名称验收意见"
        input-align="right"
        placeholder="合同名称验收意见"
      />
      <fm-field
        v-model="checkInfoForm.supplierCheckOpinion"
        name="supplierCheckOpinion"
        label="供应商成交结果验收意见"
        input-align="right"
        placeholder="供应商成交结果验收意见"
      />
      <fm-field
        v-model="checkInfoForm.orderCheckOpinion"
        name="orderCheckOpinion"
        label="送货单验收意见"
        input-align="right"
        placeholder="送货单验收意见"
      />
      <fm-field
        v-model="checkInfoForm.certificateCheckOpinion"
        name="certificateCheckOpinion"
        label="合格证验收意见"
        input-align="right"
        placeholder="合格证验收意见"
      />
      <fm-field
        v-model="checkInfoForm.specificationCheckOpinion"
        name="specificationCheckOpinion"
        label="说明书验收意见"
        input-align="right"
        placeholder="说明书验收意见"
      />

      <fm-field
        v-model="checkInfoForm.warrantyCheckOpinion"
        name="warrantyCheckOpinion"
        label="质保书验收意见"
        input-align="right"
        placeholder="质保书验收意见"
      />
      <fm-field
        v-model="checkInfoForm.remark"
        name="remark"
        label="备注"
        input-align="right"
        placeholder="备注"
      />
    </fm-form>
    <div class="btnContainer" >
      <div class="btnArea">
        <fm-button round class="dispatchBtn" @click="save">提交</fm-button>
        <fm-button round class="dispatchBtn" type="primary" @click="cancel">取消</fm-button>
      </div>
    </div>
  </div>
</template>

<script>
import CheckCardEle from './CheckCardEle.vue';
import * as apis from './api'
import dayjs from 'dayjs';
import {
  Toast,
} from 'fawkes-mobile-lib'
export default {
  name: 'checkInfo',
  components: {
    CheckCardEle,
    [Toast.name]: Toast,
  },
  data() {
    return{
      checkInfoForm: {
        orderId:'',
        warehouseName:'水厂',
        suppilerName:'',
        createDate:'',
        isBatches:'0',
        lastBatches: '0',
        examineResult: '合格',
        checkResult:"",
        contractCheckOpinion: '一致',
        supplierCheckOpinion: '一致',
        orderCheckOpinion: '一致',
        warrantyCheckOpinion: '齐全',
        certificateCheckOpinion: '齐全',
        specificationCheckOpinion: '齐全'
      },
    }
  },
  mounted() {
  },
  computed: {
    imageUrl() {
      return require(`../../../assets/img/blueBg.png`)
    },
  },
  created() {

    let params = {
      //验收单id
      id: this.$storage.get('checkInfo')
    };
    // 查询验收单信息
    apis.selectCheckInfo(params).then(res => {
      if (res.status) {
        this.checkInfoForm.examineResult = res.data.examineResult ||'合格';
        this.checkInfoForm.checkResult= res.data.checkResult ||'合格';
        this.checkInfoForm.contractCheckOpinion=res.data.contractCheckOpinion ||'一致';
        this.checkInfoForm.supplierCheckOpinion=res.data.supplierCheckOpinion||'一致';
        this.checkInfoForm.orderCheckOpinion=res.data.orderCheckOpinion||'一致';
        this.checkInfoForm.warrantyCheckOpinion=res.data.warrantyCheckOpinion||'齐全';
        this.checkInfoForm.certificateCheckOpinion=res.data.certificateCheckOpinion||'齐全';
        this.checkInfoForm.specificationCheckOpinion=res.data.specificationCheckOpinion||'齐全';

        this.checkInfoForm.id = res.data.id;
        this.checkInfoForm.orderId = res.data.orderId;
        this.checkInfoForm.warehouseName = res.data.warehouseName;
        this.checkInfoForm.suppilerName = res.data.suppilerName;
        this.checkInfoForm.createDate = res.data.createDate;
        this.checkInfoForm.qualifiedCount = res.data.qualifiedCount;
        this.checkInfoForm.checkNoQualified = res.data.checkNoQualified;

        this.checkInfoForm.isBatches=res.data.isBatches
        this.checkInfoForm.lastBatches=res.data.lastBatches
      }

    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  },
  methods:{
    goBack() {
      this.$router.go(-1)
    },
    selectIsBatches(val) {
      this.checkInfoForm.isBatches = val
    },
    selectLastBatches(val){
      this.checkInfoForm.lastBatches=val
    },
    selectexamineResult(val){
      this.checkInfoForm.examineResult=val
    },

    selectcheckResult(val){
      this.checkInfoForm.checkResult=val
    },

    cancel(){
      this.$router.go(-1)
    },
    save(){
      if (!this.checkInfoForm.isBatches) {
        return Toast('请选择是否分批')
      }
      if (this.checkInfoForm.isBatches==='0' && !this.checkInfoForm.lastBatches) {
        return Toast('请选择是否为最后一批')
      }
      if (!this.checkInfoForm.examineResult) {
        return Toast('请选择检查结果')
      }
      if (this.checkInfoForm.examineResult==='抽样' && !this.checkInfoForm.qualifiedCount) {
        return Toast('请输入合格率')
      }
      if (this.checkInfoForm.examineResult==='全数' && !this.checkInfoForm.qualifiedCount) {
        return Toast('请输入合格个数')
      }
      if (!this.checkInfoForm.checkResult) {
        return Toast('请选择验收结果')
      }
      if (this.checkInfoForm.checkResult==='不合格' && !this.checkInfoForm.checkNoQualified) {
        return Toast('请输入验收不合格处理意见')
      }
      //编辑验收信息
      apis.savaCheckInfo(this.checkInfoForm).then(res=>{
        if(res.status){
          Toast('保存成功')
          this.$router.go(-1)
        }
      })
    }
  },
}
</script>

<style scoped lang='less'>
.form-container {
  height: calc(100% - 240px);
  //height: 100%;
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
