<template>
  <div class="main-container">
    <fm-nav-bar :title="formName" left-text="" right-text="" left-arrow @click-left="goBack" />
    <fm-tabs line-width="80px" @tab-click="tabclick" v-if="type != 'add'">
      <fm-tab v-for="(item, index) in tabTitles" :label="item" :key="index"></fm-tab>
    </fm-tabs>
    <!-- 从业务模块发起时只显示表单详情和暂存、提交 -->
    <div v-if="type == 'add'" class="component">
      <!-- style="height: calc(100% - 108px); overflow: auto" -->
      <component
        class="cus-form"
        ref="formTemp"
        v-bind:is="dynamicForm"
        @setFormName="setFormName"
        @setModelKey="setModelKey"
        @setEntityName="setEntityName"
        @setService="setService"
        @setPreSaveValidateProps="setPreSaveValidateProps"
        @setFormData="setFormData"
        @setDetailParamList="setDetailParamList"
      ></component>
      <div class="buttons" v-if="type == 'add' || (type == 'execute' && flowList.length === 1)">
        <div class="button" v-for="item in buttonList" :key="item.type">
          <fm-button
            block
            type="primary"
            native-type="submit"
            @click="onAction(item)"
            :class="[item.type]"
            >{{ item.text }}</fm-button
          >
        </div>
      </div>
    </div>
    <!-- 任务待办打开时 -->
    <div v-else style="height: calc(100% - 88px); overflow: auto">
      <div v-show="tab == 0" class="content-container">
        <component
          ref="formTemp"
          v-bind:is="dynamicForm"
          @setFormName="setFormName"
          @setModelKey="setModelKey"
          @setEntityName="setEntityName"
          @setService="setService"
          @setPreSaveValidateProps="setPreSaveValidateProps"
          @setFormData="setFormData"
          @setDetailParamList="setDetailParamList"
          class="task-detail-form"
        ></component>
      </div>
      <div v-show="tab == 1" class="content-container">
        <flow-entrust v-if="type == 'flowView'" :formData="formData"></flow-entrust>
        <flow-timeline :taskId="taskId" :bizId="bizId" v-else></flow-timeline>
      </div>
      <div v-show="tab == 2" class="content-container">
        <flow-approval
          :submitURL="service.submit"
          :entityName="entityName"
          :formData="formData"
          :detailParamList="detailParamList"
          :modelKey="flowData.modelKey"
          :checkRules="checkRules"
          :beforeSubmit="beforeSubmit"
          :aftereReject="aftereReject"
          :afterSubmit="afterSubmit"
        >
        </flow-approval>
      </div>
      <div v-show="tab == 3" class="content-container">
        <flow-entrust :formData="formData"></flow-entrust>
      </div>
    </div>
  </div>
</template>
<script>
import { CURRENT_ROW } from '@/store/State/stateTypes'
import flowApproval from './components/FlowApproval'
import flowEntrust from './components/FlowEntrust'
import flowTimeline from './components/FlowTimeline'
import { submitForm } from './api'
import { Tab, Tabs, NavBar, Field, Button, Toast } from 'fawkes-mobile-lib'
export default {
  name: 'FormCenter',
  components: {
    flowApproval,
    flowEntrust,
    flowTimeline,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    return {
      type: this.$route.params.type,
      formKey: this.$route.params.formKey, // 表单键值
      bizId: this.$route.params.bizId,
      taskId: this.$route.params.taskId,
      taskKey: this.$route.params.taskKey,
      dynamicForm: '',
      isDisabled: false,
      tabTitles: [],
      detailParamList: [], // 需提交的明细表数据
      tab: 0,
      entityName: '', // 业务表的实体类名
      service: {}, //提交地址和初始化地址
      formName: '', //表单名称
      flowData: {
        modelKey: '', //流程键值
      },
      // 移动端发起时提供的按钮
      buttonList: [
        {
          type: 'saveDraft',
          text: '暂存',
          code: 'SAVEDRAFT',
          customCode: 'SAVEDRAFT',
        },
        {
          type: 'submit',
          text: '提交',
          code: 'SUBMIT',
          customCode: 'SUBMIT',
        },
      ],
      formData: {},
    }
  },
  watch: {},
  computed: {
    row() {
      // 页面中使用row来指代当前记录
      return this.$store.state[CURRENT_ROW]
    },
    lang() {
      if (this.$storage.get('i18nLocale') == 'zh') {
        return 'zh-CN'
      } else {
        return 'en'
      }
    },
  },
  created() {},
  mounted() {
    this.initForm()
    if (this.type == 'execute') {
      this.tabTitles = ['详情', '流转', '审批', '委托']
    } else if (this.type == 'view') {
      this.tabTitles = ['详情', '流转']
    } else {
      this.tabTitles = ['详情', '委托']
    }
    this.isDisabled = true
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 非空校验方法
    checkRules() {
      // 业务表单提供校验方法
      if (this.$refs.formTemp.validator) {
        return this.$refs.formTemp.validator()
      } else {
        return true
      }
    },
    // 提交流程前钩子函数
    beforeSubmit() {
      this.$refs.formTemp?.beforeSubmit()
    },
    // 提交流程后的操作
    afterSubmit() {},
    // 表单退回之后的操作
    aftereReject() {},
    tabclick(val) {
      this.tab = val
    },
    // 动态获取FormCenter下的对应的流程表单组件
    initForm() {
      const reqs = require.context('@/views/FormCenter', true, /index\.vue/, 'lazy')
      reqs.keys().forEach((key) => {
        // 此处检测模块的文件夹名和formkey匹配时忽略大小，创建formkey时最好使用帕斯卡命名法
        if (RegExp(`\\/${this.formKey}\\/`, 'i').test(key)) {
          reqs(key).then((res) => {
            this.dynamicForm = res.default
          })
        }
      })
    },
    setFormName(formName) {
      this.formName = formName
    },
    setModelKey(modelKey) {
      this.flowData.modelKey = modelKey
    },
    setEntityName(entityName) {
      this.entityName = entityName
    },
    setService(service) {
      this.service = service
    },
    setPreSaveValidateProps(props) {
      this.preSaveValidateProps = props
    },
    setFormData(formData) {
      this.formData = formData
    },
    setDetailParamList(detailParamList) {
      this.detailParamList = detailParamList
    },
    onAction(item) {
      // 暂存不需要校验，直接保存
      if (item.type == 'saveDraft') {
        this.handleAction(item)
      } else {
        // 表单统一使用form的ref值
        if (this.$refs.formTemp.$refs.form) {
          this.$refs.formTemp.$refs.form
            .validate()
            .then(() => {
              this.handleCustomValidator(item)
            })
            .catch(() => {
              Toast('表单校验未通过')
            })
        } else {
          //未定义form的引用值时
          this.handleCustomValidator()
        }
      }
    },
    handleCustomValidator(item) {
      if (typeof this.$refs.formTemp.validator === 'function') {
        if (this.$refs.formTemp.validator()) {
          this.handleAction(item)
        }
      } else {
        // 没有自定义的表单校验规则，直接提交
        this.handleAction(item)
      }
    },
    handleAction(item) {
      if (typeof this.$refs.formTemp.beforeSubmit === 'function') {
        this.$refs.formTemp.beforeSubmit()
      }
      let form = {
        entityName: this.entityName,
        entityObject: this.formData,
        formProcessParam: this.useProcess(item),
        detailParamList: this.detailParamList,
      }
      submitForm(this.service.submit, form).then((res) => {
        if (res.status) {
          Toast('提交成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        } else {
          Toast(res.message)
        }
      })
    },
    // 获取流程参数信息
    useProcess(buttonInfo) {
      return {
        modelKey: this.flowData.modelKey,
        bizId: this.bizId,
        processInstanceId: this.processInstanceId,
        formKey: this.formKey,
        stageFlag: buttonInfo.type === 'saveDraft' ? 1 : 0,
        variable: this.formData,
        taskId: this.taskId,
        approval: buttonInfo.type === 'saveDraft' ? 'stage' : '',
        comment: this.comment,
        targetKey: buttonInfo.targetKey,
      }
    },
  },
}
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}

.main-container {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component,
.cus-form {
  height: calc(100% - 122px - env(safe-area-inset-bottom));
  height: calc(100% - 122px - constant(safe-area-inset-bottom));
  overflow-y: auto;
  flex: 1;
}

// 表单底部安全区
.task-detail-form {
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
}

/deep/.fm-field--disabled .fm-field__label {
  color: #000;
}

/deep/ .fm-cell-group__title {
  color: #000;
}
.field-attachment {
  flex-direction: column;
  /deep/ .fm-field__control--right {
    justify-content: flex-start;
  }
}

.buttons {
  display: flex;
  padding: 18px 30px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(122px + constant(safe-area-inset-bottom));
  height: calc(122px + env(safe-area-inset-bottom));
}
.button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .saveDraft {
    border-radius: 10px;
    background: #ffffff;
    color: #027aff;
  }

  .submit {
    border-radius: 10px;
    background: #027aff;
    margin-left: 23px;
  }
}
</style>
