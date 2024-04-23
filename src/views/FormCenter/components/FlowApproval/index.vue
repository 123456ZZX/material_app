<template>
  <div class="approve-textarea">
    <fm-cell-group label-width="100px" :gutter="0">
      <fm-cell title="当前环节" value-align="right" class="approve-textarea__cell">
        <div class="black">{{ row.taskName }}</div>
      </fm-cell>

      <div class="approve-title"><span class="label-before"></span>审批意见</div>
      <fm-field
        class="approve-textarea-entrust"
        type="textarea"
        placeholder="请输入审批意见"
        show-word-limit
        :maxlength="300"
        v-model="comment"
      ></fm-field>
      <div class="btn-area approve-btn-area">
        <fm-button
          class="btn"
          v-for="(item, index) in buttonList"
          :key="index"
          :disabled="isDisable"
          :type="buttonType(item)"
          @click="clickHandler(item)"
        >
          {{ item.text }}
        </fm-button>
      </div>
      <fm-dialog :visible.sync="show" title="选择退回节点" show-cancel-button @confirm="getNode()">
        <div v-for="(item, index) in rejectList" :key="index" class="reject-node-item">
          <div
            @click="getRejectNode(item)"
            :class="[rejectTaskKey == item.taskKey ? 'hover' : '', 'reject-node']"
          >
            {{ item.taskName }}
          </div>
        </div>
      </fm-dialog>
    </fm-cell-group>
  </div>
</template>
<script>
import { CURRENT_ROW, REJECT_TASK_KEY } from '@/store/State/stateTypes'
import { SET_REJECT_TASK_KEY } from '@/store/Mutation/mutationTypes'
import { Cell, Dialog, Toast, CellGroup, Field, Button } from 'fawkes-mobile-lib'
import { getButtonInfo, comfirm, backDlg, getTaskKey, processAbandon } from './api'
export default {
  name: 'FlowApproval',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
  },
  props: {
    submitURL: {
      type: String,
      default: '',
    },
    entityName: {
      type: String,
      default: '',
    },
    urlAndEntity: {
      type: Object,
      default() {},
    },
    formData: {
      type: Object,
      default() {},
    },
    detailParamList: {
      type: Array,
      default() {
        return []
      },
    },
    modelKey: {
      type: String,
      default() {
        return ''
      },
    },
    beforeSubmit: {
      type: Function,
      default: function () {},
    },
    // 校验规则，默认不检查
    checkRules: {
      type: Function,
      default: function () {
        return true
      },
    },
    afterSubmit: {
      type: Function,
      default: function () {},
    },
    aftereReject: {
      type: Function,
      default: function () {},
    },
    isBeforeSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      comment: '', // 审批意见
      isDisable: false,
      buttonList: [],
      show: false,
      rejectList: [], //流程退回的节点列表
      currentNode: '',
      currentKey: '',
      stageFlag: 0,
    }
  },
  computed: {
    row() {
      // 页面中使用row来指代当前记录
      return this.$store.state[CURRENT_ROW]
    },
    rejectTaskKey() {
      return this.$store.state[REJECT_TASK_KEY]
    },
  },
  watch: {},
  mounted() {
    if (this?.row?.taskId) {
      this.getButtonInfo()
    }

    this.$store.commit(SET_REJECT_TASK_KEY, '')
  },
  methods: {
    // 获取流程设计中的按钮信息
    getButtonInfo() {
      getButtonInfo({
        taskId: this.row.taskId,
      }).then((res) => {
        if (res.data) {
          let buttonInfo = JSON.parse(res.data.buttonList)
          if (buttonInfo?.taskButtonList?.length) {
            this.buttonList = buttonInfo.taskButtonList.sort(
              (a, b) => this.sortIcon(b) - this.sortIcon(a)
            )
          } else {
            this.buttonList = buttonInfo.sort((a, b) => this.sortIcon(b) - this.sortIcon(a))
          }
        }
      })
    },
    buttonType(item) {
      switch (item.type) {
        case 'submit':
          return 'primary'
        case 'saveDraft':
          return 'default'
        case 'reject':
          return 'default'
        default:
          return ''
      }
    },
    sortIcon(item) {
      switch (item.type) {
        case 'submit':
          return 1
        case 'saveDraft':
          return 2
        case 'reject':
          return 3
        case 'abandon':
          return 4
        case 'addCountersignee':
          return 5
        case 'edit':
          return 6
        case 'circulate':
          return 7
        default:
          return 8
      }
    },
    clickHandler(item) {
      if (item.type == 'submit') {
        this.confirmDlg()
      } else if (item.type == 'reject') {
        this.backDlg(item)
      } else if (item.type == 'abandon') {
        this.abandonTask()
      } else {
        this.draftDlg()
      }
    },
    // 流程的提交
    confirmDlg() {
      this.stageFlag = 0
      // 表单提交前校验
      if (this.checkRules()) {
        this.beforeSubmit()
        this.confirm()
      }
    },
    // 表单提交方法
    confirm() {
      this.isDisable = true
      let url = this.submitURL
      let formProcessParam = {
        taskId: this.row.taskId,
        bizId: this.row.formBizId,
        approval: '',
        comment: this.comment,
        stageFlag: this.stageFlag,
        formKey: this.row.formKey,
        modelKey: this.modelKey,
        processInstanceId: this.row.processInstanceId,
        variable: this.formData,
      }
      let data = {
        detailParamList: this.detailParamList,
        entityName: this.entityName,
        entityObject: this.formData,
        formProcessParam: formProcessParam,
      }
      comfirm(url, data).then((res) => {
        if (res.status) {
          if (this.stageFlag == 0) {
            this.afterSubmit()
            Toast('审批成功', 'middle')
          } else {
            Toast('暂存成功', 'middle')
          }
          setTimeout(() => {
            Toast.clear()
            this.$router.push('/todo?refresh=true')
          }, 1000)
        } else {
          Toast(res.message, 'middle')
        }
      })
    },
    // 流程退回
    backDlg(item) {
      // 只有一个退回节点时，直接退回
      if (item?.targetNode?.length == 1) {
        Dialog.confirm({
          // 组件除show外的属性
          title: '提示',
          message: '是否要执行退回操作?',
        })
          .then(() => {
            this.isDisable = true
            backDlg({
              taskId: this.row.taskId,
              bizId: '',
              targetKey: this.targetNode.toString(), //目前的流程没有做回退任意节点，回退数组中只取第一个人
              comment: this.comment || '退回',
            }).then((res) => {
              if (res.status) {
                this.aftereReject(this.targetNode)
                Toast('退回成功', 'middle')
                setTimeout(() => {
                  Toast.clear()
                  this.$router.push('/todo?refresh=true')
                }, 1000)
              } else {
                Toast.fail(res.message)
              }
              setTimeout(() => {}, 2000)
            })
          })
          .catch(() => {})
      } else if (item?.targetNode?.length > 1) {
        this.showRejectNodeList(item.targetNode)
        // 多个
        // this.show = true
      }
    },
    // 表单暂存
    draftDlg() {
      if (this.comment.replace(/\s+/g, '').length == 0) {
        this.comment = '暂存'
      }
      this.stageFlag = 1
      this.beforeSubmit()
      this.confirm()
    },
    abandonTask() {
      Dialog.confirm({
        // 组件除show外的属性
        title: '提示',
        message: '是否要执行废弃操作?',
      })
        .then(() => {
          const flowData = {
            taskId: this.row.taskId,
            bizId: this.bizId,
            comment: this.comment,
            formKey: this.formKey,
          }
          processAbandon(flowData)
            .then((res) => {
              if (res.status) {
                Toast('废弃成功', 'middle')
                setTimeout(() => {
                  Toast.clear()
                  this.$router.push('/todo?refresh=true')
                }, 1000)
              }
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch(() => {})
    },
    showRejectNodeList(rejectNode) {
      getTaskKey({
        taskId: this.row.taskId,
      })
        .then((res) => {
          if (res.status) {
            this.rejectList = res.data.filter((task) => rejectNode.includes(task.taskKey))
          }
        })
        .finally(() => {
          this.show = true
        })
    },
    getRejectNode(item) {
      this.currentKey = item.taskKey
      this.$store.commit(SET_REJECT_TASK_KEY, this.currentKey)
      this.currentNode = item.taskKey
    },
    getNode() {
      this.isDisable = true
      backDlg({
        taskId: this.row.taskId,
        bizId: '',
        targetKey: this.currentNode,
        comment: this.comment || '退回',
      }).then((res) => {
        if (res.status) {
          this.aftereReject(this.currentNode)
          Toast('退回成功', 'middle')
          setTimeout(() => {
            Toast.clear()
            this.$router.push('/todo?refresh=true')
          }, 1000)
        } else {
          Toast.fail(res.message)
        }
        setTimeout(() => {}, 2000)
      })
    },
  },
}
</script>
<style scoped lang="less">
.black {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  /*color: rgba(38, 42, 52, 1);*/
  color: #888;
  word-break: break-all;
}
.approve-title {
  font-size: 32px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
  line-height: 60px;
}
.approve-textarea {
  background-color: #fff;
}
.approve-textarea /deep/ .fm-cell {
  // margin-top: 60px !important;
  padding: 28px 16px !important;
}
.approve-textarea-entrust /deep/ .fm-cell__value {
  /*background: #eeeeee;*/
  border: 1px solid #bbbbbb;
  opacity: 0.5;
  padding: 20px 40px;
  overflow-y: scroll !important;
  max-height: 400px;
}
/deep/ .fm-field--min-height .fm-field__control {
  min-height: 360px;
}
.approve-textarea /deep/ .fm-field__word-limit {
  margin-top: 0px;
}
.btn-area {
  position: relative;
  width: 100%;
  margin-top: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn {
  float: left;
  font-size: 28px;
  height: 90px;
  line-height: 90px;
  width: 280px;
  text-align: center;
  margin: 16px;
}
.general-btn {
  font-size: 32px;
  color: #ffffff;
  background-color: #4d86ff;
  border-radius: 4px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  width: 100%;
}
.back-btn {
  font-size: 28px;
  border: 1px solid #fbc4c4;
  border-radius: 2px;
  color: #f56c6c;
  background: #fef0f0;
  width: 100%;
}
// ----- 退回节点对话框 start -----
.reject-node-item:last-child {
  margin-bottom: 32px;
}
.reject-node {
  text-align: center;
  padding-top: 48px;
}
.reject-node.hover {
  color: #4d86ff;
}
// ----- 退回节点对话框 end -----
</style>
