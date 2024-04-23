<template>
  <div class="sign-up-container">
    <fm-nav-bar title="注册信息" left-arrow @click-left="goBack" />
    <fm-form validate-first @submit="handleRegister" class="form-container">
      <fm-field
        v-model="form.phone"
        name="手机号码"
        label="手机号码"
        type="tel"
        required
        input-align="right"
        placeholder="请输入手机号码"
        :rules="[{ required: true }, { validator: phoneValidator, message: '请输入正确手机格式' }]"
      />
      <fm-field
        v-model="form.validateCode"
        name="验证码"
        label="验证码"
        required
        input-align="right"
        :rules="[{ required: true }]"
        placeholder="请输入验证码"
      >
        <template #button>
          <fm-button
            size="small"
            type="primary"
            @click="getVericationCode"
            :disabled="sendDisabled"
            >{{ hint }}</fm-button
          >
        </template>
      </fm-field>
      <fm-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        required
        input-align="right"
        :rules="[{ required: true }]"
      />
      <!-- style="margin-bottom: 10px;" -->
      <fm-field
        v-model="form.email"
        name="邮箱"
        label="邮箱（非必填）"
        placeholder="请输入邮箱"
        input-align="right"
        :rules="[{ validator: emailValidator, message: '请输入正确的邮箱格式' }]"
      />
      <fm-field
        class="field-username"
        v-model="form.userFullname"
        name="姓名"
        label="姓名"
        input-align="right"
        placeholder="请输入姓名"
      />
      <fm-field
        class="field-username"
        v-model="form.userName"
        name="用户名"
        label="用户"
        required
        input-align="right"
        placeholder="请输入用户名"
        :rules="[{ required: true }]"
      />
      <fm-field
        class="field-username"
        v-model="form.idcardNumber"
        name="身份证号"
        label="身份证号"
        placeholder="请输入身份证号"
        input-align="right"
        :rules="[{ validator: idCardValidator, message: '请输入正确的身份证格式' }]"
      />
      <fm-cell title="上传个人信息头像" class="upload-title">
        <template #right-icon>
          <fm-uploader
            v-model="photoList"
            :show-upload="photoList.length === 0"
            :after-read="afterRead('photoToken')"
          />
        </template>
      </fm-cell>
      <fm-cell title="上传身份证正面照" class="upload-title">
        <template #right-icon>
          <fm-uploader
            v-model="idCardFontList"
            :show-upload="idCardFontList.length === 0"
            :after-read="afterRead('idCardFont')"
          />
        </template>
      </fm-cell>
      <fm-cell title="上传身份证反面照" class="upload-title">
        <template #right-icon>
          <fm-uploader
            v-model="idCardBackList"
            :show-upload="idCardBackList.length === 0"
            :after-read="afterRead('idCardBack')"
          />
        </template>
      </fm-cell>
      <!-- style="margin-bottom: 15px;" -->
      <fm-field
        class="field-username"
        v-model="code"
        name="邀请码"
        label="邀请码"
        placeholder="请输入邀请码"
        input-align="right"
      />
      <div class="btn-container">
        <fm-button round block type="info" native-type="submit">注册</fm-button>
      </div>
    </fm-form>
  </div>
</template>
<script>
/* eslint-disable no-param-reassign */
import { Button, NavBar, Form, Field, Image, Icon, Uploader, Cell } from 'fawkes-mobile-lib'
import { getCode, checkCode } from '@/api/message'
import { checkCode as getPortal, postUser } from './api'
import { encryptSM4 } from '@/utils/sm4'
import { upload } from '@/api/file'

const TOTAL = 60
const BTN_TITLE = '获取验证码'
const INTERVAL = 1 * 1000 // 定时器执行间隔

export default {
  name: 'SignUp',
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Uploader.name]: Uploader,
    [Cell.name]: Cell,
  },
  data: () => ({
    form: {
      phone: '',
      password: '',
      email: '',
      userName: '',
      userFullname: '',
      idcardNumber: '',
      validateCode: '', // 验证码
      idCardBack: '', // 身份证背面照
      idCardFont: '', // 身份证正面照
      photoToken: '', // 个人头像
    },
    code: '000002', // 邀请码
    photoList: [],
    idCardBackList: [],
    idCardFontList: [],
    sendDisabled: false,
    hint: BTN_TITLE,
  }),
  watch: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    phoneValidator(val) {
      if (val) {
        return /^[1][345789][0-9]{9}$/.test(val)
      }
      return true
    },
    idCardValidator(val) {
      if (val) {
        return /^.*([1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]).*$/.test(
          val
        )
      }
      return true
    },
    emailValidator(val) {
      if (val) {
        return /^[A-Za-z0-9_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g.test(val)
      }
      return true
    },
    getVericationCode() {
      if (this.phoneValidator(this.form.phone)) {
        getCode({ phone: this.form.phone }).then((res) => {
          if (res.status) {
            this.$toast(`已发送验证码至${this.form.phone}`)
            this.sendDisabled = true
            let timeLeft = TOTAL
            const timer = setInterval(() => {
              if (timeLeft <= 0) {
                this.hint = BTN_TITLE
                this.sendDisabled = false
                clearInterval(timer)
              } else {
                this.hint = `${timeLeft}秒后重新发送`
              }
              timeLeft -= 1
            }, INTERVAL)
          }
        })
      }
    },
    handleRegister() {
      this.$loading.show()
      checkCode({ phone: this.form.phone, code: this.form.validateCode })
        .then((res) => {
          if (res.status) {
            return getPortal({ code: this.code })
          }
          return Promise.reject(res.message)
        })
        .then((res) => {
          if (res.status && res.data) {
            const { childPortalId, portalId } = res.data
            const password = encryptSM4(this.form.password)
            postUser({
              portalId,
              projectProtalId: childPortalId,
              type: 1,
              ...this.form,
              ...{ password },
            }).then((response) => {
              if (response.status) {
                this.$toast('注册用户成功！跳转到登录页面')
                this.$router.push('/login')
              }
            })
          }
        })
        .finally(() => this.$loading.hide())
    },
    // 使用闭包给回调函数传参，设置图片token
    afterRead(tag) {
      return (file) => {
        file.status = 'uploading'
        file.message = '上传中'
        const formData = new FormData()
        formData.append('file', file.file)
        formData.append('e9y', 'cad1096aa2ce51f2f353ea98e7679edca')
        upload(formData)
          .then((res) => {
            if (res.status) {
              file.status = 'successful'
              file.message = '上传成功'
              this.$set(this.form, tag, res.data.fileToken)
            } else {
              file.status = 'failed'
              file.message = '上传失败'
            }
          })
          .catch(() => {
            file.status = 'failed'
            file.message = '上传失败'
          })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.sign-up-container {
  background-color: #e3e3e3;
  height: 100%;
  position: relative;
}
.title-container {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30px;
  .arrow-left {
    position: absolute;
    top: 8px;
    left: 10px;
  }
}
.upload-title {
  line-height: 88px;
  /deep/ .fm-uploader__upload {
    margin: 0;
  }
}
.form-container {
  height: calc(100% - 46px);
  overflow-y: scroll;
}
.btn-container {
  background-color: #fff;
  padding: 8px 10px;
  // position: absolute;
  // bottom: 0;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 40px;
}
</style>
