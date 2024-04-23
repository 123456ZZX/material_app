<template>
  <div class="detail-table-container">
    <fm-cell :title="tableName" :required="required">
      <template v-if="readonly !== 'readonly'"
        ><span @click="addTableItem" class="title-cell-value">点击添加</span></template
      >
      <template #right-icon>
        <i
          :class="[collapsed ? 'fm-icon-arrow' : 'fm-icon-arrow-down']"
          @click="collapsed = !collapsed"
        />
      </template>
    </fm-cell>
    <!-- 子表新增、编辑界面 -->
    <fm-popup
      :visible.sync="showPop"
      position="bottom"
      close-icon-position="top-left"
      class="popup-container"
    >
      <fm-nav-bar :title="tableName" left-arrow @click-left="cancel" />
      <div class="add-item-container">
        <fm-form
          input-align="right"
          :class="['table-column-form', readonly != 'readonly' ? 'with-button' : 'without-button']"
        >
          <div
            v-for="(item, index) in tableColumnTemp"
            :key="index"
            :class="[item.editType == 'textarea' && item.required ? 'required-asterisk' : '']"
          >
            <!-- 输入框 -->
            <fm-field
              v-if="item.editType == 'input'"
              v-model="item.value"
              :label="item.label"
              :placeholder="item.placeholder"
              maxlength="50"
              required
              :readonly="readonly == 'readonly'"
            />
            <!-- 日期选择器 -->
            <div v-else-if="item.editType == 'datePicker'">
              <fm-field
                :is-link="readonly != 'readonly'"
                readonly
                clickable
                input-align="right"
                name="datePicker"
                :value="
                  item.value
                    ? $dayjs(item.value).format(item.format || 'YYYY-MM-DD hh:mm:ss')
                    : item.value
                "
                :label="item.label"
                :placeholder="item.placeholder"
                @click.stop.native="
                  item.disabled || readonly == 'readonly' ? '' : (showCalendar = true)
                "
                :required="item.required"
              />
              <!-- 选择范围默认为前后十年，可通过yearGap设置 -->
              <datetime-picker
                :disabled="item.disabled"
                :show.sync="showCalendar"
                v-model="item.value"
                type="date"
                :format="item.format"
                showFormatter
                :min-date="
                  $dayjs()
                    .subtract(item.yearGap || 10, 'year')
                    .dayOfYear(1)
                    .toDate()
                "
                :max-date="
                  $dayjs()
                    .add(item.yearGap || 10, 'year')
                    .dayOfYear(365)
                    .toDate()
                "
              />
            </div>
            <!-- 步进器 -->
            <fm-field
              :label="item.label"
              :required="item.required"
              v-else-if="item.editType == 'number'"
            >
              <template #input>
                <fm-stepper
                  @change="stepperChange"
                  input-width="50"
                  :disabled="item.disabled"
                  min="0"
                  v-model="item.value"
                />
              </template>
            </fm-field>
            <!-- 字典选择组件 -->
            <div v-else-if="item.editType == 'select'">
              <fm-field
                :is-link="readonly != 'readonly'"
                readonly
                clickable
                input-align="right"
                name="picker"
                :required="item.required"
                :label="item.label"
                :placeholder="item.placeholder"
                :value="item.value | transferEnum(item.dictCode)"
                @click.stop.native="
                  item.disabled || readonly == 'readonly' ? '' : (showPicker = true)
                "
              />
              <fm-popup :visible.sync="showPicker" position="bottom">
                <fm-picker
                  show-toolbar
                  :columns="pickerType(item.dictCode)"
                  :value-key="lang"
                  :title="item.label"
                  @confirm="onReimburseTypeConfirm"
                  @cancel="showPicker = false"
                />
              </fm-popup>
            </div>
            <!-- 附件 -->
            <uploader
              v-model="item.value"
              :deletable="true"
              :disabled="readonly == 'readonly'"
              :showUpload="true"
              :ref="`form-${item.prop}`"
              type="file"
              class="uploder-attachment-item"
              @fileChange="fileChange(arguments, item.prop)"
              v-else-if="item.editType == 'file'"
            />
            <!-- 文本输入框 -->
            <fm-cell-group v-else :title="item.label" class="textarea-type">
              <fm-field
                type="textarea"
                input-align="left"
                maxlength="50"
                :placeholder="item.placeholder"
                v-model="item.value"
                :readonly="readonly == 'readonly'"
                autosize
                show-word-limit
              >
              </fm-field>
            </fm-cell-group>
          </div>
        </fm-form>
        <div class="form-button" v-if="readonly != 'readonly'">
          <fm-button
            round
            block
            type="primary"
            native-type="submit"
            @click="onSubmitTable"
            class="save-btn"
            >保存</fm-button
          >
        </div>
      </div>
    </fm-popup>
    <!-- 子表预览界面 -->
    <div class="preview-detail-list" v-show="!collapsed">
      <fm-cell-group
        inset
        v-for="(item, index) in formDetail"
        :key="index"
        class="preview-detail-item"
      >
        <div
          v-for="(options, i) in tableColumnTemp"
          :key="i"
          @click="viewTableItem(item, index)"
          class="table-item-container"
        >
          <div
            class="table-item"
            v-if="options.editType == 'input' && options.prop != 'description'"
          >
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">{{ item[options.prop] }}</div>
          </div>
          <div class="table-item" v-else-if="options.editType == 'datePicker'">
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">{{ $dayjs(item[options.prop]).format('YYYY-MM-DD') }}</div>
          </div>
          <div class="table-item" v-else-if="options.editType == 'number'">
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">{{ item[options.prop] }}</div>
          </div>
          <div class="table-item" v-else-if="options.editType == 'select'">
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">
              {{ item[options.prop] | transferEnum(options.dictCode) }}
            </div>
          </div>
          <div class="table-item" v-else-if="options.editType == 'file'">
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">
              <uploader
                v-model="item[options.prop]"
                :previewLabel="''"
                :deletable="false"
                :disabled="true"
                :showUpload="false"
                :previewFullImage="readonly == 'readonly'"
                :ref="`list-${options.prop}`"
                type="file"
              >
                <template #upload-list="fileList">
                  <div
                    v-for="file in fileList"
                    :key="file.fileToken || file.fileId"
                    class="cus-preview-list-item"
                    @click="download($event, file, index, `list-${options.prop}`)"
                  >
                    <img :src="file.file.name | getFileIcon" class="file-icon" />
                    <div class="file-info">
                      <span>{{ file.file.name }}</span>
                    </div>
                  </div>
                </template>
              </uploader>
            </div>
          </div>
          <div class="table-item" v-else>
            <div class="table-text">{{ options.label }}</div>
            <div class="table-content">{{ item[options.prop] }}</div>
            <div class="delete-button" @click.stop="deleteItem(item, index)" v-if="!readonly">
              删除
            </div>
          </div>
        </div>
      </fm-cell-group>
    </div>
  </div>
</template>
<script>
import { ENUM } from '@/store/State/stateTypes'
import {
  NavBar,
  Form,
  Field,
  // Calendar,
  Button,
  Stepper,
  Popup,
  Picker,
  Checkbox,
  CheckboxGroup,
  Toast,
  CellGroup,
  Cell,
  Dialog,
} from 'fawkes-mobile-lib'
import Uploader from '@/components/upload/Uploader'
import DatetimePicker from '@/components/datetime-picker/DatetimePicker'
import dayOfYear from 'dayjs/plugin/dayOfYear'

export default {
  name: 'DetailTable',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    // [Calendar.name]: Calendar,
    [Button.name]: Button,
    [Stepper.name]: Stepper,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    Uploader,
    [Dialog.name]: Dialog,
    DatetimePicker,
  },
  props: {
    // 子表字段列表
    tableColumn: {
      type: Array,
      default: () => [],
    },
    // 子表数据
    formDetail: {
      type: Array,
      default: () => [],
    },
    tableName: {
      type: String,
      default: '',
    },
    // 只读状态，可选值为 readonly|modify readonly下无任何编辑，modify可编辑列表项
    readonly: {
      type: String,
      default: '',
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // 主表的编辑状态——add为新增，edit为编辑
    tableType: {
      type: String,
      default: 'add',
    },
    // 是否可在预览页面点击附件下载
    downloadable: {
      type: Boolean,
      default: false,
    },
    // 是否显示必填的*号
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCalendar: false, // 是否展示选择日期组件
      showPicker: false, // 是否展示选择报销类型组
      fileList: [],
      // 子表临时数据
      formDetailTemp: [],
      showPop: false,
      currentIndex: 0, // 子表第几项记录
      currentType: 'add', // 子表当前编辑状态
      show: false,
      tableList: [],
      tableColumnList: [],
      // 子表项是否折叠，默认为true
      collapsed: true,
      fileMap: new Map(),
    }
  },
  watch: {
    formDetail: {
      handler(val) {
        this.formDetailTemp = val.map((item) => {
          const obj = {}
          Object.keys(item).forEach((key) => {
            obj[key] = item[key]
          })
          // obj.deleteFlag || (obj.deleteFlag = '0')
          return obj
        })
      },
      deep: true,
    },
    tableType: {
      // 除新增外主动展开子表
      handler(newVal) {
        if (newVal == 'add') {
          this.collapsed = true
        } else {
          this.collapsed = false
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 选择器列表字段，返回一个参数为dictCode的函数
    pickerType() {
      return (dictCode) => this.$store.state[ENUM][this.toLine(dictCode)] || []
    },
    lang() {
      if (this.$storage.get('i18nLocale') == 'zh') {
        return 'zh-CN'
      } else {
        return 'en'
      }
    },
    // 子表各字段列表，过滤掉隐藏的
    tableColumnTemp() {
      return this.tableColumn.filter((item) => {
        return !item.hidden
      })
    },
  },
  created() {
    this.$dayjs.extend(dayOfYear)
  },
  mounted() {},
  methods: {
    // 限制步进器最多只能三位小数
    stepperChange(val) {
      // 当有值或为数字时判断
      if (val === '' || val == null || isNaN(val)) {
        return false
      }
      let reg = /^\d+\.?\d{0,3}$/
      let newVal = null
      if (!reg.test(val)) {
        Toast('限制正数或3位小数')
        val = val.toString()
        newVal = val.indexOf('.') > -1 ? val.slice(0, val.indexOf('.') + 4) : val
        setTimeout(() => {
          this.$set(this.formData, 'budget', newVal)
        }, 500)
      }
    },

    // 确认选择差旅类型组件
    onReimburseTypeConfirm(value) {
      for (let i = 0; i < this.tableColumnTemp.length; i++) {
        if (this.tableColumnTemp[i].editType == 'select') {
          this.tableColumnTemp[i].value = value.code
        }
      }
      this.showPicker = false
    },
    // checkbox(value) {
    //   this.formData.notification = value.toString();
    // },
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    fileChange(args, key) {
      this.fileMap.set(key, args[0].fileList)
    },
    // 子表保存方法
    async onSubmitTable() {
      let tempObj = {}
      // 默认不需要校验
      const validated = this.tableColumn.every((column) => {
        // 必填值为空时，校验失败
        if (column.required && !column.value) {
          Toast({ message: `${column.placeholder}${column.label}`, customClass: 'cus-toast' })
          return false
        } else {
          return true
        }
      })
      if (validated) {
        for (let i = 0; i < this.tableColumn.length; i++) {
          let column = this.tableColumn[i]
          if (column.editType == 'file') {
            if (this.fileMap.get(column.prop)?.length > 0) {
              const refName = `form-${column.prop}`
              this.$refs[refName][0].needToGetFile = false
              await this.$refs[refName][0].setG9s()
              // column.value = this.$refs[refName][0].value
            } else {
              column.value = ''
            }
          }
          if (column.editType == 'datePicker' && column.format) {
            column.value = this.$dayjs(column.value).format(column.format)
          }
          tempObj[column.prop] = column.value
        }

        if (this.currentType == 'add') {
          tempObj.deleteFlag = '0'
          this.formDetailTemp.push(tempObj)
        } else {
          this.formDetailTemp[this.currentIndex] = tempObj
          // this.$emit('update:tableIndex', this.currentIndex)
        }
        this.$emit('update:formDetail', this.formDetailTemp)
        this.showPop = false
        this.collapsed = false
        this.formDetailTemp = []
      }
    },
    // 打开弹窗
    addTableItem() {
      this.currentType = 'add'
      this.showPop = true
      for (let i = 0; i < this.tableColumnTemp.length; i++) {
        this.tableColumnTemp[i].value = ''
      }
    },
    cancel() {
      this.currentIndex = 0
      this.showPop = false
    },
    // 查看子表
    viewTableItem(item, index) {
      this.currentIndex = index
      for (let n in this.tableColumn) {
        for (let m in item) {
          if (this.tableColumn[n].prop == m) {
            this.tableColumn[n].value = item[m]
            if (this.tableColumn[n].editType == 'file') {
              const refName = `form-${this.tableColumn[n].prop}`
              this.$nextTick(() => {
                this.$refs[refName][0].needToGetFile = true
              })
            }
          }
        }
      }
      // 主表非查看状态时，点击子表项都为编辑子表状态
      this.currentType = this.tableType !== 'view' ? 'edit' : 'view'
      this.showPop = true
      this.$emit('update:tableColumn', this.tableColumn)
    },
    // 明细表删除
    deleteItem(item, index) {
      Dialog.confirm({
        title: '提示',
        message: '确认是否删除?',
      })
        .then(() => {
          this.formDetailTemp.splice(index, 1)
          this.$emit('update:formDetail', this.formDetailTemp)
        })
        .catch(() => {})
    },
    // 提供预览页面下载,，需开启downloadable
    download(event, file, index, refName) {
      if (this.downloadable) {
        event.stopPropagation()
        this.$refs[refName][index].download(file)
      }
    },
  },
}
</script>

<style scoped lang="less">
.detail-table-container {
  overflow: hidden;
  background-color: rgba(242, 243, 244, 1);
}

.title-cell-value {
  margin-right: 20px;
  color: #027aff;
}

.table-list-container {
  overflow: hidden;
  background: #f2f3f4;
}

.table-item {
  display: flex;
  align-items: center;
  padding-left: 28px;
  margin-top: 24px;
}
// 子表最后一项设置底部边距
.table-item-container:last-child {
  margin-bottom: 32px;
}

// ----- popup start -----
.popup-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  * {
    box-sizing: border-box;
  }
}
.add-item-container,
.table-column-form {
  // height: calc(100% - 92px);
  overflow: auto;
  flex: 1;
}

.with-button,
.table-column-form {
  height: calc(100% - 122px);
}

.without-button {
  height: calc(100% - 92px);
  .table-column-form {
    height: 100%;
  }
}

.uploder-attachment-item {
  padding: 26px 32px;
}

.form-button {
  display: flex;
  padding: 18px 30px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(0 + env(safe-area-inset-bottom));
  bottom: calc(0 + constant(safe-area-inset-bottom));
  height: 122px;

  .save-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// ----- popup end -----

// -----子表预览界面 start -----
.cus-preview-list-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  .file-icon {
    height: 53px;
    width: 44px;
  }
  .file-info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    margin-left: 12px;
  }
}
.table-text {
  width: 20%;
  font-size: 28px;
  color: #999999;
  text-align: right;
}
.table-content {
  width: 60%;
  font-size: 28px;
  color: #333333;
  margin-left: 32px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
}
.delete-button {
  width: 10%;
  color: #347df6;
  font-size: 28px;
  display: flex;
  justify-content: center;
}
// ----- 子表预览界面 end -----

/deep/.fm-field--disabled .fm-field__label {
  color: #000;
}

//TODO 后期可在fm-cell-group组件中添加必填属性
// 为必填的文本框设置必填*号
.required-asterisk {
  /deep/ .fm-cell-group__title {
    color: #000;
    position: relative;
  }
  /deep/ .fm-cell-group__title::before {
    position: absolute;
    left: 16px;
    color: #ff4d4f;
    font-size: 32px;
    content: '*';
  }
}

/deep/ .fm-cell__right-icon {
  color: #333;
}

.textarea-type /deep/ .fm-field__value {
  border: 1px solid #bbbbbb;
  opacity: 0.5;
}

.textarea-type /deep/ .fm-field__control {
  padding-left: 20px;
  padding-top: 20px;
}
.textarea-type /deep/ .fm-field__word-limit {
  margin-right: 20px;
  margin-bottom: 12px;
}

// 屏蔽附件组件默认的padding
/deep/ .field-attachment {
  padding: 0;
}

/deep/ .fm-cell__right-icon {
  color: #333;
}

.preview-detail-item {
  margin: 24px 30px;
}
</style>
