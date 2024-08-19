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


      <div>
        <div style="display: flex; margin-top: 10px">
          <div
            style="
          color: #646566;
          font-size: 14px;
          margin-left: 16px;
          margin-right: 50px;
        "
          >
            库管员签名：
          </div>
          <img
            v-if="imagesrc"
            style="width: 100px; height: 100px"
            :src="imagesrc"
          />
        </div>
        <div class="changeBtn" style="margin: 16px" @click="openSign('warehouse_keeper')">
          <fm-button size="large" type="info " native-type="submit"
          >签名</fm-button
          >
        </div>
      </div>
    </fm-form>

    <fm-popup :visible.sync='showSign' round position="top">
      <div class="page sign-page">
        <fm-form>
          <div class="content1">
            <div class="sign-wrap" id="signWrap">
              <canvas ref="canvas" id="myCanvas" width="100%" height="300"></canvas>
            </div>
          </div>
          <div class="con-btn">
            <span class="staging-btn" @click="clear()">清除</span>
            <span class="submit-btn" @click="confirm()">确认</span>
          </div>
        </fm-form>
      </div>
    </fm-popup>

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
import dayjs from 'dayjs';
import Handwriting from "../sign/signature.js";
import neilModal from "../sign/neil-modal.vue"

import {
  Toast,
} from 'fawkes-mobile-lib'
import * as apis from './api'
import {generateUUID} from "../../../../src/utils/util";
export default {
  name: 'checkInfo',
  components: {
    neilModal,
    CheckCardEle,
    [Toast.name]: Toast,
  },
  data() {
    return{
      checkInfoForm: {
        warehouseId:'',
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

      //签字
      image: "",
      mousePressed: false,
      c: "",
      ctx: "",
      lastX: 0,
      lastY: 0,
      showSign: false,
      signPeople:'',
      imagesrc: "",


      //上传签字
      formDialog: {
        form: {
          number: '',
          outStorageTime: '',
          warehouseName: '',
          locationAllName: '',
          description: '',
          remark: '',
          warehouseId: '',
          locationId: '',
          position: '',
          url: '',
          fileToken: '',
          uploadTime: '',
        }
      },
      srcUrl:'',
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
        this.checkInfoForm.warehouseId = res.data.warehouseId;
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
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    selectIsBatches(val) {
      this.checkInfoForm.isBatches = val
    },
    selectLastBatches(val) {
      this.checkInfoForm.lastBatches = val
    },
    selectexamineResult(val) {
      this.checkInfoForm.examineResult = val
    },

    selectcheckResult(val) {
      this.checkInfoForm.checkResult = val
    },

    cancel() {
      this.$router.go(-1)
    },
    save() {
      if (!this.checkInfoForm.isBatches) {
        return Toast('请选择是否分批')
      }
      if (this.checkInfoForm.isBatches === '0' && !this.checkInfoForm.lastBatches) {
        return Toast('请选择是否为最后一批')
      }
      if (!this.checkInfoForm.examineResult) {
        return Toast('请选择检查结果')
      }
      if (this.checkInfoForm.examineResult === '抽样' && !this.checkInfoForm.qualifiedCount) {
        return Toast('请输入合格率')
      }
      if (this.checkInfoForm.examineResult === '全数' && !this.checkInfoForm.qualifiedCount) {
        return Toast('请输入合格个数')
      }
      if (!this.checkInfoForm.checkResult) {
        return Toast('请选择验收结果')
      }
      if (this.checkInfoForm.checkResult === '不合格' && !this.checkInfoForm.checkNoQualified) {
        return Toast('请输入验收不合格处理意见')
      }
      this.checkInfoForm.materialApplyPeopleSign = this.imagesrc
      //编辑验收信息
      apis.savaCheckInfo(this.checkInfoForm).then(res => {
        if (res.status) {
          Toast('保存成功')
          this.$router.go(-1)
        }
      })

      //保存签字的内容
      //将base64转为文件流，pc端上传文件就是使用的这个
      // let test = this.getBase64URL(this.imagesrc);
      // console.log(test)
      // const formData = new FormData();
      // formData.append("file", test); // 获取上传图片信息
      // formData.append("g9s", 'voucher-' + apis.generateUUID)
      // //上传接口
      // apis.uploadFile(formData).then((res) => {
      //   if (res.status) {
      //     //将结果和凭证类型存储到数据库
      //     this.formDialog.form.url = res.data.objectName
      //     this.formDialog.form.fileToken = res.data.fileToken
      //     this.formDialog.form.locaitonId = this.checkInfoForm.id
      //     this.formDialog.form.voucherLocation = 'check_sign'
      //     // this.formDialog.form.remark = this.formDialog.form.remark
      //     this.formDialog.form.remark = test.name.replace(/\.[^/.]+$/, "")
      //     this.formDialog.form.warehouseId = this.checkInfoForm.warehouseId
      //     this.formDialog.form.position = this.signPeople;
      //     //文件上传结果保存数据库
      //     apis.insert(this.formDialog.form).then(response => {
      //       if (response.status) {
      //         return Toast('上传成功')
      //         this.showSign = false;
      //         // this.imagesrc = this.baseUrl + res.fileName;
      //         // this.$emit('change', res.fileName)
      //       } else {
      //         return Toast('上传失败')
      //       }
      //     })
      //   } else {
      //     return Toast("上传失败!")
      //   }
      // })
    },
    openSign(signPeople) {
      this.signPeople = signPeople
      this.showSign = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.InitThis();
        });
      }, 1000);
    },
    InitThis() {
      this.image = "";
      this.mousePressed = false;
      var lastX, lastY;
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d")
      // this.ctx = document.getElementById("myCanvas").getContext("2d");
      this.c = document.getElementById("myCanvas");
      var signWrap = document.getElementById("signWrap");
      this.c.width = signWrap.clientWidth; // 设置宽度
      this.c.height = signWrap.clientHeight; // 设置高度
      // 触摸屏
      var that = this;
      this.c.addEventListener(
        "touchstart",
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            this.mousePressed = true;
            that.Draw(
              touch.pageX - this.offsetLeft,
              touch.pageY - this.offsetTop,
              false
            );
          }
        },
        false
      );
      this.c.addEventListener(
        "touchmove",
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            if (this.mousePressed) {
              that.Draw(
                touch.pageX - this.offsetLeft,
                touch.pageY - this.offsetTop,
                true
              );
            }
          }
        },
        false
      );
      this.c.addEventListener(
        "touchend",
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
            this.mousePressed = false;
          }
        },
        false
      );
      // 鼠标
      this.c.onmousedown = function(event) {
        this.mousePressed = true;
        that.Draw(
          event.pageX - this.offsetLeft,
          event.pageY - this.offsetTop,
          false
        );
      };
      this.c.onmousemove = function(event) {
        if (this.mousePressed) {
          that.Draw(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop,
            true
          );
        }
      };
      this.c.onmouseup = function(event) {
        this.mousePressed = false;
      };
    },
    Draw(x, y, isDown) {
      if (isDown) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000"; // 颜色
        this.ctx.lineWidth = 3; // 线宽
        this.ctx.lineJoin = "round";
        this.ctx.lineMax = 10; // 设置画笔最大线宽
        this.ctx.lineMin = 3; // 设置画笔最小线宽
        this.ctx.linePressure = 1.2; // 设置画笔笔触压力
        this.ctx.smoothness = 30; // 设置画笔笔触大小变化的平滑度
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      this.lastX = x;
      this.lastY = y;
    },
    // 清空画板
    clear() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },
    // 提交签名
    confirm() {
      this.checkEmpty(); // 调用 表单非空验证
    },
    checkEmpty() {
      var c = document.getElementById("myCanvas"); // 获取html的canvas对象
      if (this.isCanvasBlank(c)) {
        return Toast('请在签名区域签名后再次确认')
      } else {
        var image = this.c.toDataURL("image/png"); // 得到生成后的签名base64位  (url 地址)
        console.log(image)
        this.imagesrc = image;
        this.showSign = false;
      }
    },
    getBase64URL(pic) {
      const blob = this.base64ImgtoFile(pic);
      return blob;
    },
    base64ImgtoFile(dataurl, filename = "file") {
      //将base64格式分割：['data:image/png;base64','XXXX']
      const arr = dataurl.split(",");
      // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
      // image/png
      const mime = arr[0].match(/:(.*?);/)[1]; //image/png
      //[image,png] 获取图片类型后缀
      const suffix = mime.split("/")[1]; //png
      const bstr = atob(arr[1]); //atob() 方法用于解码使用 base-64 编码的字符串
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
    // 验证canvas画布是否为空函数
    isCanvasBlank(canvas) {
      var blank = document.createElement("canvas"); // 系统获取一个空canvas对象
      blank.width = canvas.width;
      blank.height = canvas.height;
      return canvas.toDataURL() == blank.toDataURL(); // 比较值相等则为空
    },
  }
}
</script>

<style scoped lang='less'>
.form-container {
  height: calc(100% - 240px);
  //height: 100%;
  overflow-y: scroll;
  //margin-top: 40px; /* 增加顶部内边距 */
}
.page {
  width: 100%;

  .content {
    width: 90%;
    height: 50px;
    background-size: 100% 100%;
    background: url(../../../assets/img/material/material.png) no-repeat center center;

    .sign-wrap {
      width: 100%;
      height: 40%;
    }
  }

  .con-btn {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: space-between;
    opacity: 0.75;

    span {
      font-size: 50px;
      width: 100%;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .staging-btn {
      color: #4154ff;
      background: #fff;
    }

    .submit-btn {
      color: #fff;
      background: #4154ff;
    }
  }
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
  .signButton {
    width: 100px;
    height: 40px;
    background-color: #4154ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    margin-top: 10px; /* 根据需要调整边距 */
  }
}
</style>
