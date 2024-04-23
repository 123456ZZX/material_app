<template>
  <div class="add-container">
    <fm-nav-bar title="缺陷新增" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <div class="content">
      <fm-form class="bigForm-container" @submit="onSubmit" @failed="onFailed">
        <!-- @submit="onSubmit" -->
        <fm-field readonly clickable required name="picker" :value="commonForm.defectFrom" label="缺陷来源"
          placeholder="缺陷来源" suffix-icon="arrow" @click="choosePicker('缺陷来源')"
          :rules="[{ required: true, message: '请填写缺陷来源' }]" input-align="right" />
        <fm-field readonly clickable required name="picker" :value="commonForm.bigType" label="业务类型" placeholder="业务类型"
          suffix-icon="arrow" @click="choosePicker('业务类型')" :rules="[{ required: true, message: '请填写业务类型' }]"
          input-align="right" @change="commonForm.smallType = '';" />
        <fm-field readonly clickable required name="picker" :value="commonForm.smallType" label="设施类型"
          placeholder="设施类型" suffix-icon="arrow" @click="choosePicker('设施类型')"
          :rules="[{ required: true, message: '请填写设施类型' }]" input-align="right" />

        <fm-popup :visible.sync="showPicker" position="bottom">
          <fm-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
        </fm-popup>

        <fm-field clearable v-model="commonForm.smallCode" name="input" label="设施编号" placeholder="设施编号"
          input-align="right" />
        <fm-field v-model="commonForm.position" name="input" label="缺陷位置" placeholder="缺陷位置" input-align="right" />
        <!-- 新增一条缺陷 -->
        <div class="subtable" v-for="(item) in subForms" :key="item.id">
          <img src="./img/link.png" alt style="position: absolute;height: 34px;z-index: 2;top: -18px" />
          <img src="./img/link.png" alt
            style="position: absolute;height: 34px;z-index: 2;float: right;right: 5px; top: -18px" />
          <fm-form>
            <!-- :value="subForm.defectType"  :columns="defectTypeList"-->
            <fm-field v-model="item.defectType" readonly clickable name="picker" label="缺陷类型" suffix-icon="arrow"
              placeholder="缺陷类型" @click="showPickerDefect = true" input-align="right"></fm-field>
            <fm-popup :visible.sync="showPickerDefect" position="bottom">
              <fm-picker show-toolbar :columns="sEventsOptThird"
                @confirm="(val) => { item.defectType = val; showPickerDefect = false }"
                @cancel="showPickerDefect = false" />
            </fm-popup>

            <fm-field v-model="item.note" name="input" label="备注" placeholder="备注" input-align="right"></fm-field>

            <uploader :wpgHeader="wpgHeader" :token="token" label="照片" type="image" v-model="picUp" ref="picUp"
              @fileChange="(recall) => fileChange(recall, '', item.pic)" style="width: 100%;"></uploader>
          </fm-form>
        </div>
        <fm-button native-type="button" type="default" icon="plus" size="large" @click="addRow"
          style="margin-left: 8px;width:96%">新增缺陷</fm-button>
        <fm-field v-model="commonForm.describe" name="input" label="现场描述" placeholder="现场描述" type="textarea" rows="2"
          autosize maxlength="200" show-word-limit input-align="right" />

        <!--多媒体附件等  -->
        <uploader :wpgHeader="wpgHeader" :token="token" label="多媒体附件" v-model="attachment" ref="attachment"
          @fileChange="(recall) => fileChange(recall, '公共')" style="width: 100%;"></uploader>

        <fm-field readonly v-model="upPerson" name="input" label="上报人" placeholder="上报人" input-align="right" />
        <fm-field readonly v-model="upTime" name="input" label="上报时间" placeholder="上报时间" input-align="right" />
      </fm-form>
    </div>
    <!-- <div class="btnArea" style="margin-top:10px;display:flex;justify-content: space-around;">
      <fm-button type="default" @click="concle">取消</fm-button>
      <fm-button type="primary" :disabled="subForms.length < 1" @click="onSubmit">提交</fm-button>
    </div> -->
    <div class="bottom">
      <div class="bottom-div">
        <fm-button native-type="button" type="default" class="cancel" @click="concle">取消</fm-button>
      </div>
      <div class="bottom-div">
        <fm-button class="submit" type="primary" :disabled="subForms.length < 1" @click="onSubmit">提交</fm-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ENUM } from '@/store/State/stateTypes'
import Uploader from './upload/Uploader'
// import Uploader from '@/components/upload/Uploader.vue'
import fileUpload from '@/components/fileUpload/index.vue'
import { Toast } from 'fawkes-mobile-lib'
import axios from 'axios'
export default {
  name: 'addFlaws',
  components: { [Toast.name]: Toast, Uploader, fileUpload },
  data() {
    return {
      wpgHeader: {},
      token: '',
      picUp: '',
      attachment: '',
      fileList: [], // 图片多媒体
      // 选择器
      commonForm: {
        defectFrom: '巡检', //缺陷来源，移动端默认巡检
        bigType: '', //业务类型
        smallType: '', //设施类型
        smallCode: '', //设施编号
        position: '', //缺陷位置，xx路就好，经纬度需要但不用显示
        lng: '',
        lat: '',
        properties: {},
        describe: '', //现场描述
        media: [], //多媒体附件
      },
      upPerson: '',
      upTime: '',
      // value: '',
      columns: [],
      showPicker: false, //就一条次 选择器
      showPickerDefect: false, //新增缺陷 可多次 选择器
      whichPicker: '',
      subFormID: 1,
      subForms: [
        {
          id: 1,
          defectType: '',
          note: '', //备注
          pic: [],
        },
      ],
      bigTypeList: [],
      flawsManage: [],//业务对象事件类型
    }
  },
  computed: {
    smallTypeList() {
      let list = []
      if (this.flawsManage) {
        console.log("业务-对象", this.flawsManage.find(it => it.code == this.commonForm.bigType)?.child);
        this.flawsManage.find(it => it.code == this.commonForm.bigType)?.child.forEach(it => {
          list.push(it['zh-CN'])
        })
        return list
      } else {
        return []
      }

    },
    sEventsOpt() {
      console.log("业务-对象", this.flawsManage)
      if (this.flawsManage) {
        console.log("业务-对象", this.flawsManage.find(it => it.code == this.commonForm.bigType)?.child);
        return this.flawsManage.find(it => it.code == this.commonForm.bigType)?.child
      } else {
        return []
      }
    },
    sEventsOptThird() {
      if (this.commonForm.smallType != '' && this.sEventsOpt) {
        console.log("业务-对象-事件", this.sEventsOpt.find(it => it.code == this.commonForm.smallType)?.child);
        let list = []
        this.sEventsOpt.find(it => it.code == this.commonForm.smallType)?.child.forEach(dic => {
          list.push(dic['zh-CN'])
        })
        return list
      } else if (this.commonForm.smallType == '' && this.flawsManage) {
        let sEventsOptThird = []
        this.flawsManage.find(it => it.code == this.commonForm.bigType)?.child.forEach(it => {
          it.child.forEach(v => {
            sEventsOptThird.push(v)
          })
        });
        console.log('sEventsOptThird: ', sEventsOptThird);
        let list = []
        sEventsOptThird.forEach(it => {
          list.push(it.code)
        })
        return list
      } else {
        return []
      }
    },
    // 缺陷来源
    defectFromDic() {
      console.log(
        'this.$store.state[ENUM].defectFrom: ',
        this.$store.state[ENUM].defectFrom
      )
      return this.$store.state[ENUM].defectFrom
    },
    defectFromList() {
      let list = []
      if (this.defectFromDic) {
        this.defectFromDic.forEach((dic) => {
          list.push(dic['zh-CN'])
        })
      }
      return list
    },
    defectFromListDic() {
      let listDic = {}
      if (this.defectFromDic) {
        this.defectFromDic.forEach((dic) => {
          listDic[dic['zh-CN']] = dic.code
        })
      }
      return listDic
    },
    // 缺陷类型
    // faultTypesDic() {
    //   console.log(
    //     'this.$store.state[ENUM].pipeNetDefectTypes',
    //     this.$store.state[ENUM].pipeNetDefectTypes
    //   )
    //   return this.$store.state[ENUM].pipeNetDefectTypes
    // },
    // defectTypeList() {
    //   let list = []
    //   if (this.faultTypesDic) {
    //     if (
    //       this.faultTypesDic.filter((it) =>
    //         it['zh-CN'].includes(this.commonForm.smallType)
    //       ).length > 0
    //     ) {
    //       this.faultTypesDic
    //         .filter((it) => it['zh-CN'].includes(this.commonForm.smallType))[0]
    //         .child.forEach((dic) => {
    //           list.push(dic['zh-CN'])
    //         })
    //     }
    //   }
    //   return list
    // },
    // defectTypeListDic() {
    //   let listDic = {}
    //   if (this.faultTypesDic) {
    //     this.faultTypesDic.forEach((dic) => {
    //       listDic[dic['zh-CN']] = dic.code
    //     })
    //   }
    //   return listDic
    // },
    // 系统字典虽叫defectType，但实际二级为 业务类型/设施类型
    // 业务类型/设施类型
    // busDeviceTypeDic() {
    //   console.log(
    //     'this.$store.state[ENUM].defectType: ',
    //     this.$store.state[ENUM].defectType
    //   )
    //   return this.$store.state[ENUM].defectType
    // },
    // bigTypeList() {
    //   let list = []
    //   if (this.busDeviceTypeDic) {
    //     this.busDeviceTypeDic.forEach((dic) => {
    //       list.push(dic['zh-CN'])
    //     })
    //   }
    //   return list
    // },
    // bigTypeListDic() {
    //   let listDic = {}
    //   if (this.busDeviceTypeDic) {
    //     this.busDeviceTypeDic.forEach((dic) => {
    //       listDic[dic['zh-CN']] = dic.code
    //     })
    //   }
    //   return listDic
    // },
    // // 二级--设施类型
    // smallTypeObj() {
    //   let listDic = {}
    //   if (this.busDeviceTypeDic) {
    //     this.busDeviceTypeDic.forEach((dic) => {
    //       let list = []
    //       dic.child.forEach((second) => {
    //         list.push(second['zh-CN'])
    //       })
    //       listDic[dic['zh-CN']] = list
    //     })
    //   }
    //   return listDic
    // },
    // smallTypeDic() {
    //   let listDic = {}
    //   if (this.busDeviceTypeDic) {
    //     this.busDeviceTypeDic.forEach((dic) => {
    //       dic.child.forEach((second) => {
    //         listDic[second['zh-CN']] = second.code
    //       })
    //     })
    //   }
    //   return listDic
    // },
  },
  created() {
    this.flawsManage = this.$store.state[ENUM].flawsManage //业务对象事件类型
    console.log('this.flawsManage: ', this.flawsManage);
    this.flawsManage.forEach(it => {
      this.bigTypeList.push(it['zh-CN'])
    })
    // 路由过来，带着参数
    this.objInfo = this.$route.query.msg
    this.token = this.$route.query.token
    // 回填信息
    this.$nextTick(() => {
      this.commonForm.bigType = this.objInfo.bigType || ''
      this.commonForm.smallType = this.objInfo.smallType || ''
      this.commonForm.smallCode = this.objInfo.code || ''
      this.commonForm.position =
        this.objInfo.road_name || [this.objInfo.lng, this.objInfo.lat].toString()
      // 提交表单用的，不回填显示
      this.commonForm.lng = this.objInfo.lng
      this.commonForm.lat = this.objInfo.lat
      this.commonForm.properties = this.objInfo.properties
    })
  },
  methods: {
    // 图片多媒体
    fileChange(recall, mark, rowItem) {
      if (recall.res) {
        let formFile = {
          fileUrl: recall.res.resultData.url,
          fileType: recall.res.resultData.suffix,
          fileSize: recall.res.resultData.size,
          fileId: recall.res.resultData.id,
          name: recall.res.resultData.oldName,
          url:
            process.env.VUE_APP_THIRD_REQUEST_URL +
            '/main/userCenterApi/FileManager/download/' +
            recall.res.resultData.id,
          uid: recall.res.resultData.id,
        }
        if (mark == '公共') {
          // 公共的
          this.commonForm.media.push(formFile)
        } else {
          // 每条缺陷的
          rowItem.push(formFile)
        }
      }
    },
    // 新增相关
    // 新增缺陷 子表项
    addRow() {
      console.log('subForms前: ', this.subForms)
      this.subForms.push({
        id: (this.subFormID += 1),
        defectType: '',
        note: '', //备注
        pic: [],
      })
    },

    // 取消
    concle() {
      this.commonForm.media.forEach((m) => {
        this.$refs.attachment.removeFile(m)
      })
      this.attachment = ''
      this.picUp = ''
      this.subForms = [
      ]
      this.commonForm = {
        defectFrom: '巡检', //缺陷来源，移动端默认巡检
        bigType: '', //业务类型
        smallType: '', //设施类型
        smallCode: '', //设施编号
        position: '', //缺陷位置，xx路就好，经纬度需要但不用显示
        lng: '',
        lat: '',
        properties: {},
        describe: '', //现场描述
        media: [], //多媒体附件
      }
      let time = new Date()
      this.upTime = time.toLocaleString()
      this.$router.go(-1)
    },
    //提交前 校验未通过
    onFailed() {
      if (
        this.commonForm.defectFrom == '' ||
        this.commonForm.bigType == '' ||
        this.commonForm.smallType == ''
      ) {
        console.log('vcsdfghjngbc: ');
        Toast({
          message: '请检查必填信息',
          position: 'top',
        })
        return false
      }
    },
    // 提交
    onSubmit() {
      Toast({
        message: '提交中',
        position: 'top',
      })
      if (
        this.commonForm.defectFrom != '' &&
        this.commonForm.bigType != '' &&
        this.commonForm.smallType != ''
      ) {
        this.subForms.forEach((sf) => {
          let params = {
            templateCode: 'defect_template',
            title: '缺陷新增', //表单项无，但是接口必填字段
            sysSource: 'outwork',
            createType: 'APP',
            longitude: this.commonForm.lng,
            latitude: this.commonForm.lat,
            questionDescribe: this.commonForm.describe,
            address: this.commonForm.properties?.road_name || '',
            formJson: {
              task_id: this.$route.query.taskId, //巡检任务ID
              gridId: this.objInfo.gridId,
              gridName: this.objInfo.gridName,
              deviceId: this.objInfo.id,
              detail: {
                img: sf.pic,//每条记录的图片
                remark: sf.note,//每条记录的 备注
                defectType: sf.defectType
              },
              files: this.commonForm.media, //公共 附件
              defectFrom: this.defectFromListDic[this.commonForm.defectFrom],
              "deviceType": [this.commonForm.bigType, this.commonForm.smallType],
              deviceCode: this.commonForm.smallCode,
              // "deviceDetail": this.commonForm.properties,
              deviceDetail: {
                longitude: this.commonForm.lng,
                latitude: this.commonForm.lat,
                road_name: this.commonForm.properties?.road_name || '',
              },
            },
          }
          this.wpgHeader = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token,
          }
          // 提交
          let that = this
          axios({
            url:
              process.env.VUE_APP_THIRD_REQUEST_URL +
              '/main/outworkapi/ticketClient/create',
            method: 'post',
            data: params,
            headers: this.wpgHeader,
          }).then((res) => {
            if (res.status = 200 && res.data.success) {
              Toast.success({
                message: '提交成功',
                duration: 1000,
                onClose: () => {
                  that.subForms.shift()
                  that.$router.go(-1)
                }
              })
            } else {
              Toast.error({
                message: '提交失败，请稍后再试',
                duration: 2000
              })
            }
          })
        }) //forEach结束
      } else {
        Toast({
          message: '请检查必填信息',
          position: 'top',
        })
      }
    },
    // 弹出哪个选择器
    choosePicker(item) {
      this.columns = []
      switch (item) {
        case '缺陷来源':
          this.whichPicker = item
          this.columns = this.defectFromList
          break
        case '业务类型':
          this.whichPicker = item
          this.columns = this.bigTypeList
          break
        case '设施类型':
          this.whichPicker = item
          // this.columns = this.smallTypeObj[this.commonForm.bigType]
          this.columns = this.smallTypeList
          break
        // case '缺陷类型':
        //     this.whichPicker = item
        //     this.columns = this.defectTypeList
        //     break
      }
      this.showPicker = true
    },
    // 选择器选择
    onConfirm(value) {
      switch (this.whichPicker) {
        case '缺陷来源':
          this.commonForm.defectFrom = value
          break
        case '业务类型':
          this.commonForm.bigType = value
          break
        case '设施类型':
          this.commonForm.smallType = value
          break
        // case '缺陷类型':
        //     this.subForm.defectType = value
        //     break
      }
      this.showPicker = false
    },
  },
  mounted() {
    if (this.$route.query.from == 'insp') {
      this.commonForm.defectFrom = '巡检'
    } else if (this.$route.query.from == 'mainten') {
      this.commonForm.defectFrom = '养护'
    }
    this.upPerson = localStorage.getItem("cs_userFullname")
    let time = new Date()
    this.upTime = time.toLocaleString()
  },
}
</script>

<style lang="less" scoped>
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}

.add-container {
  width: 100%;
  height: 100%;

  .content {
    width: 100%;
    height: calc(100% - 250px);

    .bigForm-container {
      overflow: scroll;
      width: 100%;
      height: 100%;
      background: #ffffff;

      .subtable {
        position: relative;
        margin: 10px;
        padding: 13px;
        // background-color: aquamarine;
        border-radius: 16px;
        border: 1px solid #5195d0;
      }
    }
  }

  .bottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 136px;
    background: #ffffff;

    .bottom-div {
      margin-top: 20px;
      text-align: center;
      width: 370px;
      float: left;
      height: 88px;
      line-height: 88px;
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;

      .cancel {
        width: 90%;
        border-radius: 44px;
        border: 1px solid #1b67d8;
        color: #1b67d8;
      }

      .submit {
        width: 90%;
        border-radius: 44px;
        color: #ffffff;
        background: #1b67d8;
      }
    }
  }
}
</style>