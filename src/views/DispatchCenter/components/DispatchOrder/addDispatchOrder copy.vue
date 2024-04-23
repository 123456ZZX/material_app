<template>
  <div class="main">
    <fm-nav-bar title="调度指令" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <fm-tabs v-model="activeTab">
      <fm-tab v-for="(item, idx) in tabList" :key="idx" :label="item">
        <div
          class="container"
          v-if="activeTab == 0"
          :style="{ 'height': $route.query.mode != 'add' ? 'calc(100% - 90px)' : '' }"
        >
          <fm-form @submit="submit" ref="form" style="display: flex; flex-direction: column;">
            <div class="eventInfo">
              <div class="title">
                <img
                  :src="require('@/assets/img/dispatchCenter/矩形.png')"
                  height="30"
                  style="margin: auto 0;"
                />
                <div class="name">事件信息</div>
              </div>
              <fm-field
                label="发送站点"
                v-model="form.sendDepartment"
                is-link
                readonly
                :disabled="mode != 'add'"
                :placeholder="mode != 'add' ? '' : '请选择发送站点'"
                input-align="right"
                @click="openPopup('sendStationShow')"
              />
              <fm-popup :visible.sync="sendStationShow" round position="bottom">
                <fm-cascader
                  title="请选择"
                  v-model="form.sendDepartment"
                  :disabled="mode != 'add'"
                  :options="sendDepartmentList"
                  @close="sendStationShow = false"
                  @finish="arg => onFinish(arg, 'sendStationShow')"
                />
              </fm-popup>
              <fm-field
                label="接收站点"
                :disabled="mode != 'add'"
                v-model="form.receiveDepartment"
                is-link
                readonly
                name="receiveDepartment"
                :placeholder="mode != 'add' ? '' : '请选择接收站点'"
                input-align="right"
                @click="openPopup('getStationShow')"
                :rules="[{ required: true, message: '请选择接收站点' }]"
              />
              <fm-popup :visible.sync="getStationShow" round position="bottom">
                <fm-cascader
                  title="请选择"
                  :disabled="mode != 'add'"
                  v-model="form.receiveDepartment"
                  :options="receiveDepartmentList"
                  @close="getStationShow = false"
                  @finish="arg => onFinish(arg, 'getStationShow')"
                />
              </fm-popup>
              <!-- <select-user
                title="接单人"
                :userFullname.sync="receiveFullName"
                :disabled="mode != 'add'"
                :userName.sync="receiveName"
                :multiple="false"
                required
                name="receiveName"
                :placeholder="mode != 'add' ? '' : '请选择接单人'"
                @change="selectReceive"
              /> -->
              <fm-field
                label="接单人"
                :disabled="mode != 'add'"
                :placeholder="mode != 'add' ? '' : '请选择接单人'"
                v-model="receiveFullName"
                :rules="[{ required: true, message: '请选择接单人' }]"
                name="receiveName"
                input-align="right"
              />
              <fm-field label="接单人联系方式" v-show="mode != 'add'" :disabled="mode != 'add'" v-model="form.receiveContact" input-align="right" />
              <fm-popup :visible.sync="getPersonShow" round position="bottom">
                <fm-cascader
                  title="请选择"
                  v-model="form.receiveName"
                  :options="stationOptions"
                  @close="getPersonShow = false"
                  @finish="arg => onFinish(arg, 'getPersonShow')"
                />
              </fm-popup>
              <!-- <select-user
                title="发单人"
                v-show="mode == 'view' || mode == 'deal'"
                disabled
                :userFullname.sync="sendFullName"
                :userName.sync="sendName"
                :multiple="false"
                :placeholder="(mode == 'view' || mode == 'deal') ? '' : '请选择接收站点'"
                @change="selectSend"
              /> -->
              <fm-field
                label="发单人"
                :disabled="mode != 'add'"
                v-show="mode == 'view' || mode == 'deal'"
                :placeholder="(mode == 'view' || mode == 'deal') ? '' : '请选择接收站点'"
                v-model="sendFullName"
                input-align="right"
              />
              <fm-popup :visible.sync="sendPersonShow" round position="bottom">
                <fm-cascader
                  title="请选择"
                  v-model="form.sendName"
                  :options="stationOptions"
                  @close="sendPersonShow = false"
                  @finish="arg => onFinish(arg, 'sendPersonShow')"
                />
              </fm-popup>
              <fm-field label="发单人联系方式" v-show="mode == 'view' || mode == 'deal'" :disabled="mode != 'add'" v-model="form.sendContact" input-align="right" />
              <fm-field
                label="发送时间"
                v-show="mode == 'view' || mode == 'deal'"
                v-model="form.sendTime"
                :disabled="mode != 'add'"
                is-link
                readonly
                :placeholder="mode != 'add' ? '' : '请选择发送时间'"
                input-align="right"
                @click="openPopup('sendTimeShow')"
              />
              <fm-popup :visible.sync="sendTimeShow" round position="bottom">
                <fm-datetime-picker v-model="sendTime" :disabled="mode != 'add'" type="datetime" @confirm="confirmTime" />
              </fm-popup>
              <fm-field
                label="抄送部门"
                :disabled="mode != 'add'"
                v-model="form.ccDepartment"
                is-link
                readonly
                :placeholder="mode != 'add' ? '' : '请选择抄送部门'"
                input-align="right"
                @click="openPopup('ccStationShow')"
              />
              <fm-popup :visible.sync="ccStationShow" round position="bottom">
                <fm-cascader
                  title="请选择"
                  :disabled="mode != 'add'"
                  v-model="form.ccDepartment"
                  :options="ccDepartmentList"
                  @close="ccStationShow = false"
                  @finish="arg => onFinish(arg, 'ccStationShow')"
                />
              </fm-popup>
            </div>
            <div class="dispatchInfo">
              <div class="title">
                <img
                  :src="require('@/assets/img/dispatchCenter/矩形.png')"
                  height="30"
                  style="margin: auto 0;"
                />
                <div class="name">调度信息</div>
              </div>
              <fm-field
                label="调令名称"
                :disabled="mode != 'add'"
                :placeholder="mode != 'add' ? '' : '请输入调令名称'"
                v-model="form.commandName"
                :rules="[{ required: true, message: '请输入调令名称' }]"
                name="commandName"
                input-align="right"
              />
              <fm-field
                v-model="form.detailedContent"
                label="调令内容"
                :disabled="mode != 'add'"
                :placeholder="mode != 'add' ? '' : '请输入调令内容'"
                :rules="[{ required: true, message: '请输入调令内容' }]"
                name="detailedContent"
                type="textarea"
                autosize
                maxlength="300"
                input-align="right"
                show-word-limit
              />
              <uploader
                label="附件"
                v-model="attachment"
                @fileChange="fileChange"
                :disabled="mode != 'add'"
                type="*"
                multiple
              />
              <fm-field name="stepper" label="接单时限(min)" input-align="right">
                <template #input>
                  <fm-stepper
                    v-model="form.receiveLimit"
                    :disabled="mode != 'add'"
                    integer
                    min="1"
                  />
                </template>
              </fm-field>
              <fm-field name="stepper" label="反馈时限(min)" input-align="right">
                <template #input>
                  <fm-stepper
                    v-model="form.feedbackLimit"
                    :disabled="mode != 'add'"
                    integer
                    min="1"
                  />
                </template>
              </fm-field>
            </div>
          </fm-form>
        </div>
        <div class="btnContainer" v-if="activeTab == 0 && mode == 'add'">
          <div class="btnArea">
            <fm-button round class="dispatchBtn" @click="tempSave">暂存</fm-button>
            <fm-button round class="dispatchBtn" type="primary" @click="submit">发起</fm-button>
          </div>
        </div>
        <div class="flowContainer" v-if="activeTab == 1">
          <fm-empty v-if="flowList.length == 0" />
          <fm-flow-comments v-else :flowList="flowList"></fm-flow-comments>
        </div>
        <div class="container" v-if="activeTab == 2" :style="{ 'height': $route.query.mode != 'deal' ? 'calc(100% - 90px)' : '' }">
          <fm-form ref="approveForm">
            <div class="eventInfo">
              <fm-field
                v-model="approveForm.approvalOpinion"
                label="审批意见"
                :placeholder="mode == 'view' ? '' : '请输入审批意见'"
                :disabled="mode == 'view'"
                :rules="[{ required: true, message: '请输入审批意见' }]"
                type="textarea"
                name="approvalOpinion"
                autosize
                maxlength="500"
                input-align="right"
                show-word-limit
              />
            </div>
          </fm-form>
        </div>
        <div class="btnContainer" v-if="activeTab == 2 && mode == 'deal'">
          <div class="btnArea">
            <fm-button round class="dispatchBtn" @click="reject">回退</fm-button>
            <fm-button round class="dispatchBtn" type="primary" @click="handle">提交</fm-button>
          </div>
        </div>
      </fm-tab>
    </fm-tabs>
  </div>
</template>

<script>
import {
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
import Uploader from '@/components/upload/Uploader.vue'
import selectUser from '@/components/select-user'
import * as apis from '../../api'
export default {
  name: 'addDispatchOrder',
  components: {
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
    Uploader,
    selectUser
  },
  data() {
    return {
      taskId: '',
      processInstanceId: '',
      taskNodeName: '',
      activeTab: 0,
      content: '',
      attachment: '',
      sendStationShow: false,
      getStationShow: false,
      getPersonShow: false,
      sendPersonShow: false,
      sendTimeShow: false,
      dispatchObjShow: false,
      dispatchOrderShow: false,
      ccStationShow: false,
      sendTime: new Date(),
      stationOptions: [
        {
          text: '调度中心',
          value: '调度中心',
        },
        {
          text: '1#供水厂',
          value: '1#供水厂',
        },
        {
          text: 'XXX供水厂',
          value: 'XXX供水厂',
        },
        {
          text: '1#泵站',
          value: '1#泵站',
        },
        {
          text: '2#泵站',
          value: '2#泵站',
        },
      ],
      sendDepartmentList: [],
      receiveDepartmentList: [],
      ccDepartmentList: [],
      form: {},
      approveForm: {},
      receiveFullName: '',
      sendFullName: '',
      flowList: [],
    }
  },
  computed: {
    mode() {
      return this.$route.query.mode
    },
    tabList() {
      let res = ''
      switch (this.mode) {
        case 'add':
          res = ['详情']
          break
        case 'deal':
        case 'view':
          res = ['详情', '流转', '审批']
          break
        // case 'add':
        //     res = ['详情', '流转', '审批']
        //     break
        default:
          res = ['详情']
      }
      return res
    },
  },
  created() {
    if (this.$route.query.mode == 'add') {
      this.getDepartment()
    } else if (this.$route.query.mode == 'view') {
      this.form = JSON.parse(this.$route.query.data)
      this.receiveFullName = this.form.receiveFullName || ''
      this.sendFullName = this.form.sendFullName || ''
      this.attachment = JSON.parse(this.form.fileAttachment)[0].groupToken
      if (this.form.commandStatus == '已接单' || this.form.commandStatus == '待处理' || this.form.commandStatus == '已完成') {
        this.approveForm.approvalOpinion = this.form.approvalOpinion
        this.initProcess(this.form.id)
      }
    } else if (this.$route.query.mode == 'deal') {
      this.form = JSON.parse(this.$route.query.data)
      this.receiveFullName = this.form.receiveFullName || ''
      this.sendFullName = this.form.sendFullName || ''
      this.attachment = JSON.parse(this.form.fileAttachment)[0].groupToken
      if (this.form.commandStatus == '已接单' || this.form.commandStatus == '待处理') {
        this.initProcess(this.form.id)
      }
    }
  },
  methods: {
    getDepartment() {
      this.sendDepartmentList = []
      this.receiveDepartmentList = []
      this.ccDepartmentList = []
      apis.getDepartment().then(res => {
        if (res.status) {
          res.data.records.filter(it => it.departType == '发送部门').forEach(item => {
            this.sendDepartmentList.push({
              value: item.departName,
              text: item.departName,
              ...item
            })
          })
          res.data.records.filter(it => it.departType == '接单部门').forEach(item => {
            this.receiveDepartmentList.push({
              value: item.departName,
              text: item.departName,
              ...item
            })
          })
          res.data.records.filter(it => it.departType == '抄送部门').forEach(item => {
            this.ccDepartmentList.push({
              value: item.departName,
              text: item.departName,
              ...item
            })
          })
        }
        console.log(this.sendDepartmentList)
      })
    },
    handleAdd(val) {
      let parmas = {};
      if (val == '已完成') {
        parmas = {
          entityName: 'DispatchingCommand',
          entityObject: {},
          formProcessParam: {
            formKey: 'CommandTask',
            taskId: this.taskId,
            modelKey: 'CommandTask',
            variable: {}
          }
        };
      } else {
        parmas = {
          entityName: 'DispatchingCommand',
          entityObject: {},
          formProcessParam: {
            formKey: 'CommandTask',
            processInstanceId: this.taskId,
            taskId: this.taskId,
            modelKey: 'CommandTask',
            variable: {}
          }
        };
      }
      if (val == '已接单') {
        this.form.receiveTime = new Date().getTime();
      }
      this.form.sendName = this.$store.state.userInfo.userName;
      this.form.commandStatus = val;
      if (val == '已退单') {
        this.form.ifback = '否';
      }
      if (val == '已完成') {
        this.form.ifback = '是';
        // this.finishTime = new Date().getTime();
      }
      parmas.entityObject = this.form;
      parmas.formProcessParam.variable = this.form;

      apis.getCommit(JSON.parse(JSON.stringify(parmas))).then(res => {
        if (res.message == '成功') {
          Toast.success({
            message: '操作成功！',
            duration: 2000
          });
          this.$router.go(-1)
          this.$emit('refreshList');
        } else {
          Toast.error('操作失败！');
        }
      });
    },
    //暂存新增
    handleTempSave(val) {
      let params = JSON.parse(JSON.stringify(this.form))
      if (val == '已发出') {
        params.sendTime = new Date().getTime();
      }
      params.commandStatus = val
      params.id = '';
      if (this.form.fileAttachment) {
        params.fileAttachment = JSON.stringify(this.form.fileAttachment);
      }
      apis.AddDispatchingCommand(params).then(res => {
        if (res.message == '成功') {
          Toast.success({
            message: '操作成功！',
            duration: 2000
          });
          this.$router.go(-1)
          this.$emit('refreshList');
        } else {
          Toast.error('操作失败！');
        }
      });
    },
    async initProcess(id) {
      let result = await apis.getUserTasks();
      let list = result.data.list.filter(item => item.formBizId == id);
      if (list.length > 0) {
        this.taskId = list[0].taskId;
        this.processInstanceId = list[0].processInstanceId;
      }
      //有taskId,获取流程图
      // if (this.taskId) {
      //   // 若有taskId则获取当前任务节点名称
      //   apis.getUserTaskDetail(this.taskId).then(res => {
      //     if (res.status && res.data.taskName) {
      //       this.taskNodeName = '—' + res.data.taskName;
      //     }
      //   });
      // }
      if (this.mode !== 'add') {
        apis.getProcessHistory({ taskId: this.taskId }).then(res => {
          if (res.status && res.data) {
            this.flowList = res.data;
          } else {
            this.flowList = []
          }
        });
      }
    //   apis.getModelXML({ processInstanceId: this.processInstanceId }).then(res => {
    //     this.flowInfo.xml = res.data.bpmnXml;
    //     if (res.data.customProcessJson) {
    //       this.customXML = false;
    //     } else {
    //       this.customXML = true;
    //     }
    //     apis.getHistoryNodes({ processInstanceId: this.processInstanceId }).then(resp => {
    //       this.flowInfo = Object.assign(this.flowInfo, resp.data);
    //     });
    //   });
    },
    handle() {
      this.$refs['approveForm'] && this.$refs['approveForm'][0].validate('approvalOpinion').then(() => {
        this.form.approvalOpinion = this.approveForm.approvalOpinion
        this.handleAdd('已完成')
      })
    },
    reject() {
      this.$refs['approveForm'] && this.$refs['approveForm'][0].validate('approvalOpinion').then(() => {
        this.form.approvalOpinion = this.approveForm.approvalOpinion
        this.handleAdd('已退单')
      })
    },
    tempSave() {
      this.$refs['form'][0].validate(['receiveName', 'commandName', 'detailedContent', 'receiveDepartment']).then(() => {
        this.handleTempSave('暂存')
      })
    },
    submit() {
      this.$refs['form'][0].validate(['receiveName', 'commandName', 'detailedContent', 'receiveDepartment']).then(() => {
        this.handleTempSave('已发出')
      })
    },
    openPopup(type) {
      if (this.mode != 'add') {
        return
      }
      this[type] = true
    },
    fileChange(file) {
      let fileList = []
      file.fileList.forEach((it) => {
        fileList.push({
          groupToken: it.response.groupToken,
          fileToken: it.response.fileToken,
          extName: it.response.extName,
          size: it.response.size,
          url: it.url,
        })
      })
      this.form.fileAttachment = fileList
    },
    onFinish({ selectedOptions }, type) {
      if (selectedOptions[0].departType == '接单部门') {
        this.form.receiveName = selectedOptions[0].userName
        this.receiveFullName = selectedOptions[0].userFullName
        this.form.receiveContact = selectedOptions[0].contact
      } else if (selectedOptions[0].departType == '发送部门') {
        this.form.sendName = selectedOptions[0].userName
        this.sendFullName = selectedOptions[0].userFullName
        this.form.sendContact = selectedOptions[0].contact
      }
      this[type] = false
    },
    confirmTime(val) {
      this.form.sendTime = this.$dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      this.sendTimeShow = false
    }
  },
}
</script>

<style scoped lang="less">
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
/deep/.fm-tabs {
  height: 100%;
}
/deep/.fm-tabs__content {
  height: 100%;
}
/deep/.fm-tab__pane,
.fm-tab__pane-wrapper {
  height: 100%;
}
.main {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: calc(100% - 316px);
    background: #f4f6f8;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    .eventInfo {
      width: calc(100% - 60px);
      height: auto;
      margin: 30px 30px 15px;
      background: #ffffff;
      border-radius: 16px;
      .title {
        width: 100%;
        height: 120px;
        border-bottom: 2px solid #f5f5f5;
        display: flex;
        .name {
          font-size: 36px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #191919;
          margin: auto 20px;
        }
      }
    }
    .dispatchInfo {
      width: calc(100% - 60px);
      height: auto;
      margin: 15px 30px 30px;
      background: #ffffff;
      border-radius: 16px;
      .title {
        width: 100%;
        height: 120px;
        border-bottom: 2px solid #f5f5f5;
        display: flex;
        .name {
          font-size: 36px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #191919;
          margin: auto 20px;
        }
      }
    }
  }
  .flowContainer {
    width: 100%;
    height: calc(100% - 180px);
    background: #f4f6f8;
    overflow: scroll;
    display: flex;
    flex-direction: column;
  }
  .btnContainer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 136px;
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