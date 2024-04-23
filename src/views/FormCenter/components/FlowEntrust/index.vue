<template>
  <div class="approve-textarea">
    <fm-cell-group label-width="100px" :gutter="0">
      <fm-cell title="当前环节" value-align="right" class="approve-textarea__cell">
        <div class="black">{{ row.taskName }}</div>
      </fm-cell>
      <fm-cell title="原执行人" value-align="right" class="approve-textarea__cell">
        <div class="black">{{ row.taskAsigneeName }}</div>
      </fm-cell>
      <select-user
        class="new-name"
        :userFullname.sync="newName"
        :userName.sync="userID"
        title="新执行人"
        :multiple="false"
        :required="true"
        ref="executeLeader"
      ></select-user>
      <div class="approve-title"><span class="label-before"></span>委托原因</div>
      <fm-field
        class="approve-textarea-entrust"
        type="textarea"
        placeholder="请输入委托原因"
        show-word-limit
        :maxlength="50"
        v-model="reason"
      ></fm-field>
      <div class="btn-area-entrust" @click="entrust">
        <div class="entrust-btn">确认委托</div>
      </div>
    </fm-cell-group>
  </div>
</template>
<script>
import { CURRENT_ROW } from '@/store/State/stateTypes'
import selectUser from '@/components/select-user'
import { doTrust } from './api'
import { Field, Cell, CellGroup, Toast } from 'fawkes-mobile-lib'
export default {
  components: {
    selectUser,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Toast.name]: Toast,
  },
  props: {
    urlAndEntity: {
      type: Object,
      default() {},
    },
    formData: {
      type: Object,
      default() {},
    },
    detailParam: {
      type: Array,
      default() {
        return []
      },
    },
    beforeSubmit: {
      type: Function,
      default: null,
    },
    formName: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      newName: '', // 委托人
      userID: '', //委托人用户名
      reason: '', // 委托原因
    }
  },
  computed: {
    row() {
      // 页面中使用row来指代当前记录
      return this.$store.state[CURRENT_ROW]
    },
  },
  mounted() {},
  methods: {
    entrust() {
      // 选人过来的员工号（也是“新执行人：的员工号）
      // let userID = this.$refs.executeLeader.getValues('userName')
      // let userID = "wei_jt";
      // 原执行人的员工号也是登陆人的员工号
      let user = this.row.taskAsignee
      if (this.userID == '') {
        // 显示文字
        Toast('请选择新执行人', 'middle')
        return false
      }
      if (user == this.userID) {
        Toast('不能委托给自己！', 'middle')
        return
      }

      if (!this.reason) {
        Toast('请输入委托原因', 'middle')
        return false
      }
      this.doTrust(this.userID)
    },
    // 委托
    doTrust(userID) {
      doTrust({
        taskId: this.row.taskId,
        comment: this.reason,
        userName: userID,
      }).then((res) => {
        if (res.status) {
          this.$toast('提交成功', 'middle')
          setTimeout(() => {
            this.$toast.clear()
            this.$router.push('/todo?refresh=true')
          }, 1000)
        } else {
          this.$toast(res.data.message, 'middle')
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.approve-textarea {
  // margin-top: 4%;
  &__cell {
    padding: 30px 12px;
    line-height: 40px;
  }

  // /deep/ .fm-cell__title {
  //   margin-left: 0px;
  // }

  /deep/ .fm-cell--required::before {
    left: -2px !important;
    top: 28px;
  }

  /deep/ .fm-field__word-limit {
    margin-top: 0px;
  }
}

// 覆盖选人组件原样式
.new-name /deep/ .fm-cell--clickable.fm-cell--required {
  padding-left: 10px;
  padding-right: 10px;
}

.black {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
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

.label-before {
  width: 8px;
  height: 22px;
  background: #4a8dff;
  margin-right: 7px;
  display: inline-block;
}

.approve-textarea-entrust /deep/ .fm-cell__value {
  border: 1px solid #bbbbbb;
  opacity: 0.5;
  padding: 20px;
  max-height: 400px;
}

/deep/ .fm-field--min-height .fm-field__control {
  min-height: 360px;
}
.btn-area-entrust {
  position: relative;
  width: 100%;
  margin-top: 60px;
}

.entrust-btn {
  text-align: center;
  font-size: 32px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  background-color: #4d86ff;
  border-radius: 2px;
  height: 90px;
  line-height: 90px;
  margin: 0 41px;
}
</style>
