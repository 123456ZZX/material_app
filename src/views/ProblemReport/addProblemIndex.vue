<template>
  <div class="main">
    <fm-nav-bar title="问题上报" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <div class="main-container">
      <fm-form @submit="onFormSubmit" @failed="onFailed">
        <fm-field
          ref="formData"
          readonly
          clickable
          name="picker"
          suffix-icon="arrow"
          required
          :rules="[{ required: true, message: '请选择问题来源' }]"
          :value="defectFrom"
          label="问题来源"
          placeholder="点击选择"
          input-align="right"
          @click="sourceShowPicker = true"
        />
        <fm-popup :visible.sync="sourceShowPicker" position="bottom">
          <fm-picker
            show-toolbar
            :columns="sourceColumns"
            @confirm="sourceOnConfirm"
            @cancel="sourceShowPicker = false"
          />
        </fm-popup>
        <fm-field
          name="radio"
          required
          input-align="right"
          :rules="[{ required: true, message: '请选择紧急程度' }]"
          label="紧急程度"
        >
          <template #input>
            <fm-radio-group v-model="priority" direction="horizontal">
              <fm-radio name="0" @click="selectPriority('0')">紧急</fm-radio>
              <fm-radio name="1" @click="selectPriority('1')">高</fm-radio>
              <fm-radio name="2" @click="selectPriority('2')">中</fm-radio>
              <fm-radio name="3" @click="selectPriority('3')">低</fm-radio>
            </fm-radio-group>
          </template>
        </fm-field>
        <fm-field v-model="formData.position" name="问题位置" label="问题位置" placeholder="回填" />

        <fm-field
          v-model="formData.bigType"
          name="业务类型"
          readonly
          clickable
          label="业务类型"
          placeholder="回填"
          suffix-icon="arrow"
          @click="showPickerBt = true"
        />
        <fm-popup :visible.sync="showPickerBt" position="bottom">
          <fm-picker
            show-toolbar
            :columns="bigTypeList"
            @confirm="onConfirmBigType"
            @cancel="showPickerBt = false"
          />
        </fm-popup>

        <fm-field
          v-model="formData.smallType"
          name="对象类型"
          readonly
          clickable
          label="对象类型"
          placeholder="回填"
          suffix-icon="arrow"
          @click="showPickerSt = true"
        />
        <fm-popup :visible.sync="showPickerSt" position="bottom">
          <fm-picker
            show-toolbar
            :columns="smallTypeList"
            @confirm="onConfirmSmallType"
            @cancel="showPickerSt = false"
          />
        </fm-popup>

        <fm-field v-model="formData.code" name="设施编号" label="设施编号" placeholder="回填" />
        <fm-field
          readonly
          clickable
          name="picker"
          :value="faultTypes"
          label="问题类型"
          required
          placeholder="点击选择"
          suffix-icon="arrow"
          input-align="right"
          :rules="[{ required: true, message: '请选择问题类型' }]"
          @click="typeShowPicker = true"
        />
        <fm-popup :visible.sync="typeShowPicker" position="bottom">
          <fm-picker
            show-toolbar
            :columns="typeColumns"
            @confirm="typeOnConfirm"
            @cancel="typeShowPicker = false"
          />
        </fm-popup>
        <fm-field
          v-if="type"
          readonly
          clickable
          name="picker"
          :value="faultDetail"
          label="故障明细"
          placeholder="点击选择"
          @click="fixShowPicker = true"
        />
        <fm-popup :visible.sync="fixShowPicker" position="bottom">
          <fm-picker
            show-toolbar
            :columns="fixColumns"
            @confirm="fixOnConfirm"
            @cancel="fixShowPicker = false"
          />
        </fm-popup>
        <fm-field
          v-model="questionDescribe"
          rows="5"
          autosize
          label="现场描述"
          type="textarea"
          maxlength="300"
          placeholder="请输入现场描述"
          show-word-limit
        />
        <uploader
          :wpgHeader="wpgHeader"
          label="多媒体附件"
          v-model="attachment1"
          ref="files"
          @fileChange="(recall) => fileChange1(recall, '', files)"
          style="width: 100%"
        ></uploader>
        <fm-field
          name="radio"
          label="处理方式"
          required
          :rules="[{ required: true, message: '请选择处理方式' }]"
          input-align="right"
        >
          <template #input>
            <fm-radio-group v-model="handleType" direction="horizontal">
              <fm-radio name="上报负责人" @click="select('上报负责人')">上报负责人</fm-radio>
              <fm-radio name="派维修工单" @click="select('派维修工单')">派维修工单</fm-radio>
              <fm-radio name="上报客服中心" @click="select('上报客服中心')">上报客服中心</fm-radio>
              <fm-radio name="直接处理" @click="select('直接处理')">直接处理</fm-radio>
            </fm-radio-group>
          </template>
        </fm-field>
        <fm-field
          v-if="handle"
          v-model="handleRemark"
          rows="5"
          autosize
          label="处理措施"
          type="textarea"
          maxlength="300"
          placeholder="请输入处理措施"
          show-word-limit
        />

        <uploader
          v-if="handle"
          :wpgHeader="wpgHeader"
          label="处理后照片"
          v-model="attachment2"
          ref="handleImgs"
          @fileChange="(recall) => fileChange2(recall, '', handleImgs)"
          style="width: 100%"
        ></uploader>
        <!-- :disabled="handleType == '上报负责人'" -->
        <selectUser
          key="selectUser1"
          v-if="report"
          title="负责人"
          @change="getChange"
          :userName.sync="responPersonName"
          :userFullname.sync="responPersonFullName"
          :required="true"
          placeholder="请选择负责人"
        />
        <selectUser
          key="selectUser2"
          v-if="repair"
          title="维修负责人"
          @change="getChange"
          :userName.sync="responPersonName"
          :userFullname.sync="responPersonFullName"
          :required="true"
          placeholder="请选择维修负责人"
        />
        <selectUser
          key="selectUser3"
          v-if="serve"
          title="客服负责人"
          @change="getChange"
          :userName.sync="responPersonName"
          :userFullname.sync="responPersonFullName"
          :required="true"
          placeholder="请选择客服负责人"
        />

        <fm-field v-model="creatorfullName" name="上报人" label="上报人" placeholder="巡检信息回填" />
        <fm-field v-model="createDate" name="上报时间" label="上报时间" placeholder="回填" />
      </fm-form>
    </div>

    <div class="bottom">
      <div class="bottom-div">
        <fm-button native-type="button" class="cancel" @click="concal">取消</fm-button>
      </div>
      <div class="bottom-div">
        <fm-button class="submit" @click="onFormSubmit">提交</fm-button>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from './upload/Uploader'
import { ENUM } from '@/store/State/stateTypes'
import selectUser from '@/components/select-user/index.vue'
import axios from 'axios'
import {
  Form,
  Field,
  NavBar,
  Search,
  Toast,
  Cell,
  CellGroup,
  PullRefresh,
  List,
  Sidebar,
  SidebarItem,
  SwipeCell,
  Button,
  NoticeBar,
  Icon,
  Dialog,
} from 'fawkes-mobile-lib'

export default {
  name: 'Inspection',
  components: {
    Uploader,
    selectUser,
    [Form.name]: Form,
    [Field.name]: Field,
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Toast.name]: Toast,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
  },
  data() {
    return {
      creatorFullName: this.$store.state.userInfo.userFullname,
      responPersonName: '',
      responPersonFullName: '',
      attachment1: '',
      attachment2: '',
      files: [],
      handleImgs: [],
      handleRemark: '',
      wpgHeader: {}, //上传相关
      handleType: '',
      questionDescribe: '',
      defectFrom: '',
      priority: '',
      faultTypes: '',
      creatorName: '',
      creatorfullName: '',
      createDate: '',
      faultDetail: '',
      header: {},
      token: '',
      formData: {},
      upTime: '',
      upPerson: '',
      report: false,
      repair: false,
      serve: false,
      handle: false,
      type: false,
      uploader: [{ url: '/static/img/leaf.jpg' }],
      radio: '1',
      fixShowPicker: false,
      typeShowPicker: false,
      sourceShowPicker: false,
      sourceColumns: ['巡检', '客服投诉', '养护', '监护', '填报'],
      // typeColumns: [
      //   '违规排放',
      //   '管道周边施工监管',
      //   '管道破坏',
      //   '安全隐患',
      //   '设施故障',
      //   '漏水爆管',
      //   '其他',
      // ],
      name: '',
      userType: '',
      userName: '',
      fixColumns: [
        '水管鸣叫',
        '阀门破损',
        '水表丢失',
        '水表错位',
        '水表倒装',
        '水管滴漏',
      ],
      bigTypeList: [],
      flawsManage: [], //业务对象事件类型
      showPickerBt: false, //业务类型选项
      showPickerSt: false, //设施类型选项
    }
  },
  computed: {
    smallTypeList() {
      let list = []
      if (this.flawsManage) {
        console.log(
          '业务-对象',
          this.flawsManage.find((it) => it.code == this.formData.bigType)?.child
        )
        this.flawsManage
          .find((it) => it.code == this.formData.bigType)
          ?.child.forEach((it) => {
            list.push(it['zh-CN'])
          })
        return list
      } else {
        return []
      }
    },
    typeColumns() {
      let list = []
      this.$store.state[ENUM].faultTypes.forEach((it) => {
        list.push(it['zh-CN'])
      })
      return list
    },
    handleTypeDic() {
      return this.$store.state[ENUM].handleType
    },
    handleTypeDicListDic() {
      let listDic = {}
      if (this.handleTypeDic) {
        this.handleTypeDic.forEach((dic) => {
          listDic[dic['zh-CN']] = dic.code
        })
      }
      return listDic
    },
    defectFromDic() {
      return this.$store.state[ENUM].defectFrom
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
    // 系统字典虽叫defectType，但实际二级为 业务类型/设施类型
    // 业务类型/设施类型
    busDeviceTypeDic() {
      console.log(
        'this.$store.state[ENUM].defectType: ',
        this.$store.state[ENUM].defectType
      )
      return this.$store.state[ENUM].defectType
    },
    // bigTypeList() {
    //   let list = []
    //   if (this.busDeviceTypeDic) {
    //     this.busDeviceTypeDic.forEach((dic) => {
    //       list.push(dic['zh-CN'])
    //     })
    //   }
    //   return list
    // },
    bigTypeListDic() {
      let listDic = {}
      if (this.busDeviceTypeDic) {
        this.busDeviceTypeDic.forEach((dic) => {
          listDic[dic['zh-CN']] = dic.code
        })
      }
      return listDic
    },
    faultDetailDic() {
      return this.$store.state[ENUM].faultDetail
    },
    faultDetailDicListDic() {
      let listDic = {}
      if (this.faultDetailDic) {
        this.faultDetailDic.forEach((dic) => {
          listDic[dic['zh-CN']] = dic.code
        })
      }
      return listDic
    },
  },
  created() {
    this.formData = this.$route.query.msg
    if (this.$route.query.from == 'insp') {
      this.defectFrom = '巡检'
    } else if (this.$route.query.from == 'mainten') {
      this.defectFrom = '养护'
    }
    this.token = this.$route.query.token
    this.formData.position =
      this.formData.road_name ||
      [this.formData.lng, this.formData.lat].toString()
    this.wpgHeader = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    }
  },
  mounted() {
    this.flawsManage = this.$store.state[ENUM].flawsManage //业务对象事件类型
    console.log('this.flawsManage: ', this.flawsManage)
    this.flawsManage.forEach((it) => {
      this.bigTypeList.push(it['zh-CN'])
    })

    let time = new Date()
    this.createDate = time.toLocaleString()
    console.log('this.$store.state.userInfo: ', this.$store.state.userInfo)
    this.creatorName =
      this.$store.state.userInfo.userName ||
      localStorage.getItem('cs_userFullname')
    this.creatorfullName = this.$store.state.userInfo.userFullname || '' // localStorage.getItem('cs_userfullname')
  },
  methods: {
    onConfirmBigType(val) {
      this.formData.bigType = val
      this.showPickerBt = false
    },
    onConfirmSmallType(val) {
      this.formData.smallType = val
      this.showPickerSt = false
    },
    concal() {
      this.$router.go(-1)
    },
    // 处理后照片
    fileChange2(recall, mark, rowItem) {
      if (recall.res) {
        let formFile2 = {
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
        this.handleImgs.push(formFile2)
      }
    },
    fileChange1(recall, mark, rowItem) {
      if (recall.res) {
        let formFile1 = {
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
        this.files.push(formFile1)
      }
    },
    selectPriority(val) {
      this.priority = val
    },
    getChange(val) {
      console.log(this.responPersonName);
      console.log(this.responPersonFullName);
      console.log(val);
      // this.name = val[0]?.userFullname || ''
      // this.userName = val[0]?.userName || ''
      // this.userType = val[0]?.userType || ''
    },
    //提交前 校验未通过
    onFailed() {
      if (
        this.defectFrom == '' ||
        this.priority == '' ||
        this.faultTypes == '' ||
        this.handleType == '' ||
        this.responPersonFullName == ''
      ) {
        Toast({
          message: '请检查必填信息',
          position: 'top',
        })
        return
      }
    },
    // 提交
    onFormSubmit() {
      console.log('this.formData', this.formData)
      console.log('responPersonName: ', this.responPersonName)
      console.log('responPersonFullName: ', this.responPersonFullName)
      Toast({
        message: '提交中',
        position: 'top',
      })
      if (
        this.defectFrom != '' &&
        this.priority !== '' &&
        this.faultTypes != '' &&
        this.handleType != '' &&
        (this.handleType == '直接处理' || this.responPersonFullName != '')
      ) {
        // 提交按钮
        let params = {
          templateCode: 'abnormal_inform_template',
          title: '问题新增',
          sysSource: 'outwork',
          createType: 'APP',
          latitude: this.formData.lat,
          longitude: this.formData.lng,
          questionDescribe: this.questionDescribe, //现场描述
          address: this.formData.road_name || this.formData.position, //问题位置
          priority: this.priority, //紧急程度（优先级）
          formJson: {
            files: this.files, //多媒体
            gridId: this.formData.gridId,
            gridName: this.formData.gridName,
            deviceId: this.formData.id,
            // task_id: this.formData.taskId, //巡检任务ID
            task_id: this.$route.query.taskId, //巡检任务ID
            handleImgs: this.handleImgs, //处理后照片
            handleRemark: this.handleRemark, //处理措施
            deviceType: [
              this.formData.bigType || '',
              this.formData.smallType || '',
            ], //对象类型
            deviceCode: this.formData.code, //设施编号
            handleType: this.handleTypeDicListDic[this.handleType], //处理方式
            defectFrom: this.defectFromListDic[this.defectFrom], //问题来源
            priority: this.priority, //紧急程度
            faultTypes: this.faultTypes, //问题类型
            ticketDispatchUserIds: [
              {
                name: this.responPersonFullName, //处理人名称
                id: this.responPersonName, //处理人ID
                type: '99',
              },
            ], //负责人
            creatorName: this.creatorName, //上报人
            createDate: this.createDate, //上报时间
            faultDetail: this.faultDetailDicListDic[this.faultDetail], //故障明细
          },
        }
        // console.log(JSON.parse(JSON.stringify(params.longitude)), JSON.parse(JSON.stringify(params.latitude)))
        if (Array.isArray(params.longitude) || Array.isArray(params.latitude)) {
          params.longitude = params.longitude[0] // 经度
          params.latitude = params.latitude[1] // 纬度
        }
        console.log('params: ', JSON.parse(JSON.stringify(params)))
        this.createTicket(params)
      } else {
        Toast({
          message: '请检查必填信息',
          position: 'top',
        })
      }
    },
    createTicket(params) {
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/outworkapi/ticketClient/create',
          // url: 'https://xionganwater.cn/main/outworkapi/ticketClient/create',
        method: 'post',
        data: params,
        headers: this.wpgHeader,
      }).then((res) => {
        console.log('res: ', res)
        if (res.status == 200 && res.data.success) {
          Toast.success({
            message: '提交成功',
            duration: 1000,
            onClose: () => {
              this.formData = {}
              this.$router.go(-1)
            },
          })
        } else {
          Toast.error('提交失败, 请稍后再试')
        }
      })
    },
    select(val) {
      console.log('val: ', val)
      this.handle = true
      this.report = false
      this.repair = false
      this.serve = false
      this.name = ''
      this.responPersonFullName = ''
      this.userName = ''
      this.responPersonName = ''
      // 处理后照片置空，只有处理方式为 "直接处理" 时才有处理后照片
      this.attachment2 = ''
      this.handleImgs = []
      // 处理措施置空，只有处理方式为 "直接处理" 时才有处理措施
      this.handleRemark = ''

      if (val == '直接处理') {
        this.handle = true
      } else {
        this.handle = false
      }
      if (val == '派维修工单') {
        this.handle = false
        this.repair = true
      } else {
        this.repair = false
      }
      if (val == '上报客服中心') {
        this.handle = false
        this.serve = true
      } else {
        this.serve = false
      }
      if (val == '上报负责人') {
        this.handle = false
        // this.report = true // 负责人选择（隐藏）
        console.log(' this.$route.query.msg: ', this.$route.query.msg)
        this.name = this.$route.query.msg.gridManager?.fullName || ''
        this.responPersonFullName = this.$route.query.msg.gridManager?.fullName || ''
        this.userName = this.$route.query.msg.gridManager?.username || ''
        this.responPersonName = this.$route.query.msg.gridManager?.username || ''
        console.log(
          'allName:',
          this.name,
          this.responPersonFullName,
          this.userName,
          this.responPersonName
        )
      } else {
        this.report = false
      }
    },
    typeOnConfirm(value) {
      this.faultTypes = value
      this.typeShowPicker = false
      if (this.faultTypes == '设备故障') {
        this.type = true
      } else {
        this.type = false
      }
    },
    fixOnConfirm(value) {
      this.faultDetail = value
      this.fixShowPicker = false
    },
    sourceOnConfirm(value) {
      this.defectFrom = value
      this.sourceShowPicker = false
    },
  },
}
</script>

<style lang="less" scoped>
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}

// @import '/fks-mobile-lib/src/assets/fm-icon/fm-icon.css';
.main {
  background-color: #f2f3f4 !important;
  height: 100%;
}

.main-container {
  height: calc(100% - 260px);
  overflow: auto;
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

/deep/.fm-field__control {
  text-align: right !important;
}

/deep/.fm-fielld_error-message {
  text-align: right !important;
}
</style>
