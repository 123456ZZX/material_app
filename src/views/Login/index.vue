<template>
  <div class="login-container">
    <!-- <change-lange></change-lange> -->
    <div class="logo-container">
      <!-- <div class="logo-pic"></div> -->
      <span class="logo-title">雄安水务</span>
    </div>
    <!-- 表单登录 -->
    <div class="form-container">
      <fm-tabs>
        <fm-tab label="账号登录">
          <fm-form class="form-content">
            <fm-field
              class="field-username"
              clearable
              v-model="username"
              name="用户名"
              placeholder="请输入用户名"
              :rules="userRules"
              @focus="checkedField = 'user'"
              @blur="checkedField = null"
              :class="checkedField == 'user' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <!-- <img
                  v-if="checkedField == 'user'"
                  class="news-img"
                  :src="require('@/assets/img/login/user-checked.png')"
                /> -->
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/user.png')"
                />
              </template>
            </fm-field>
            <fm-field
              class="field-pwd"
              clearable
              v-model="password"
              :type="passwordType"
              name="密码"
              placeholder="请输入密码"
              :rules="pwdRules"
              @click-suffix-icon="viewPassword"
              @focus="checkedField = 'pwd'"
              @blur="checkedField = null"
              :class="checkedField == 'pwd' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <!-- <img
                  v-if="checkedField == 'pwd'"
                  class="news-img"
                  :src="require('@/assets/img/login/pwd-checked.png')"
                /> -->
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/pwd.png')"
                />
              </template>
              <template #suffix-icon v-if="showIcon">
                <fm-image
                  v-if="passwordType == 'password'"
                  class="suffix-icon"
                  width="20"
                  height="20"
                  :src="require('@/assets/img/login/no-visible.png')"
                />
                <fm-image
                  v-else
                  class="suffix-icon"
                  width="20"
                  height="20"
                  :src="require('@/assets/img/login/visible.png')"
                />
                <!-- <i class="fm-icon fm-icon-eye-o suffix-icon" v-if="passwordType == 'text'"></i>
          <i class="fm-icon fm-icon-closed-eye suffix-icon" v-else></i> -->
              </template>
            </fm-field>
            <div class="sub-menu">
              <fm-checkbox v-model="rememberMe" shape="square">{{
                $t('login.RememberPassword')
              }}</fm-checkbox>
              <span @click="forgetPassword">{{
                $t('login.forgetPassword')
              }}</span>
            </div>
            <div class="login-btn-container">
              <fm-button
                class="login-btn"
                @click="onSubmit"
                block
                type="primary"
                native-type="submit"
                >{{ $t('login.login') }}</fm-button
              >
            </div>
          </fm-form>
        </fm-tab>
        <fm-tab label="手机登录">
          <fm-form class="form-content">
            <fm-field
              class="field-username"
              clearable
              v-model="phoneNumber"
              name="手机号码"
              placeholder="请输入手机号码"
              :rules="phoneRules"
              @focus="checkedField = 'phone'"
              @blur="checkedField = null"
              :class="checkedField == 'phone' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/user.png')"
                />
              </template>
            </fm-field>
            <fm-field
              class="field-pwd"
              clearable
              v-model="code"
              name="验证码"
              placeholder="请输入验证码"
              :rules="codeRules"
              @focus="checkedField = 'code'"
              @blur="checkedField = null"
              :class="checkedField == 'code' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/verification_code.png')"
                />
              </template>
              <template #button>
                <span class="send_code">获取验证码</span>
              </template>
            </fm-field>
            <div class="login-btn-container">
              <fm-button
                class="login-btn"
                @click="onSubmitPhone"
                block
                type="primary"
                native-type="submit"
                >{{ $t('login.login') }}</fm-button
              >
            </div>
          </fm-form>
        </fm-tab>
      </fm-tabs>
    </div>
  </div>
</template>
<script>
import {
  Button,
  NavBar,
  Form,
  Field,
  Image,
  Icon,
  Checkbox,
  Toast,
} from 'fawkes-mobile-lib'
import { encryptSM4 } from '@/utils/sm4'
import { GRANT_TYPE } from '@/settings'
import { mapGetters } from 'vuex'
import { SET_TEMP_USER, IS_LOGIN } from '@/store/Mutation/mutationTypes'
import { USER_LOGIN } from '@/store/Action/actionTypes'
import { loadLanguageAsync } from '@/utils/locale' //引入获取系统语言的方法
import { eventBackButton, exitApp } from '@/utils/app'
import md5 from 'js-md5'

export default {
  name: 'login',
  components: {
    // changeLange,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      username: '',
      password: '',
      phoneNumber: '',
      code: '',
      errorParams: {},
      rememberMe: false,
      showIcon: true,
      passwordType: 'password',
      checkedField: null,
      userRules: [
        {
          required: true,
          message: '用户名不能为空',
          trigger: 'onBlur',
        },
      ],
      pwdRules: [
        {
          required: true,
          message: '密码不能为空',
          trigger: 'onBlur',
        },
      ],
      phoneRules: [
        {
          required: true,
          message: '手机号码不能为空',
          trigger: 'onBlur',          
        }
      ],
      codeRules: [
        {
          required: true,
          message: '验证码不能为空',
          trigger: 'onBlur',          
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['tempUser']),
  },
  watch: {
    username(newUsername) {
      // 清空用户名时密码也清空
      if (!newUsername) {
        this.password = ''
        this.showIcon = true
      }
    },
    password(newPassword) {
      // 清空密码时显示查看密码按钮
      if (!newPassword) {
        this.showIcon = true
      }
    },
  },
  mounted() {
    this.rememberMe = this.$storage.get('rememberMe') === 'true'
    if (this.rememberMe) {
      this.username = this.$storage.get('username')
      this.password = this.$storage.get('password')
      this.showIcon = false
      this.passwordType = 'password'
    } else {
      this.username = this.tempUser?.username
      this.password = this.tempUser?.password
    }
    // 移除返回上一级路由事件，设置退出应用
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', eventBackButton, false)
  },
  beforeDestroy() {
    this.$store.commit(SET_TEMP_USER, {
      password: this.password,
      username: this.username,
    })
    // 恢复默认的返回上一级路由响应事件
    document.removeEventListener('backbutton', eventBackButton, false)
    document.removeEventListener('backbutton', exitApp, false)
    document.addEventListener('backbutton', this.$back, false)
  },
  methods: {
    onSubmitPhone() {},
    viewPassword() {
      if (this.passwordType == 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    onSubmit() {
      if (!this.username) {
        return Toast('用户名不能为空')
      }
      if (!this.password) {
        return Toast('密码不能为空')
      }
      const loginData = this.getLoginForm()
      console.log(loginData)

      if (loginData.password && loginData.username) {
        this.$loading.show({ title: '' })
        this.$store
          .dispatch(USER_LOGIN, loginData)
          .then(() => {
            this.$store.commit(IS_LOGIN, true)
            this.$router.push('/tabBar')
            if (!this.$storage.get('langList')) {
              let key = this.$storage.get('i18nLocale')
              let locale = this.$storage.get('i18nLocaleKey')
              // loadLanguageAsync(key, locale, this)
            }
            this.updataStorage()
          })
          .finally(() => {
            this.$loading.hide()
          })
      }
    },
    getLoginForm() {
      const form = {}
      form.grant_type = GRANT_TYPE.password.code
      form.username = this.username
      // if (this.showIcon) {
      form.password = encryptSM4(this.password)
      // form.password = md5(this.password)
      // } else {
      //   form.password = this.password
      // }
      return form
    },
    // 登录成功时更新缓存
    updataStorage() {
      this.$storage.set('username', this.username)
      this.$storage.set('rememberMe', this.rememberMe)
      if (this.rememberMe) {
        this.$storage.set('password', this.password)
      } else {
        this.$storage.remove('password')
      }
      // 记录错误次数
      this.errorParams[this.username] = 0
      this.$storage.set('errorParams', JSON.stringify(this.errorParams))
    },
    goToSignUp() {
      this.$router.push('/signup')
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push('/forget')
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.fm-field__error-message {
  position: absolute;
  top: 80px;
}
/deep/.fm-cell {
  overflow: visible;
  &::after {
    left: 0px;
  }
}
/deep/ .fm-tabs {
  padding-top: 31px;
}
.suffix-icon {
  margin-left: 10px;
}
/deep/.fm-field__prefix-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.fm-field__suffix-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fm-icon-closed-eye:before {
  width: 36px;
  height: auto;
}
.fm-icon-eye-o:before {
  width: 36px;
  height: auto;
}
.news-img {
  width: 32px;
  height: 32px;
  margin-right: 24px;
}
.send_code {
  font-size: 28px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #1bbdff;
  line-height: 40px;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 2px;
    height: 21px;
    background: #5bcbff;
    border-radius: 2px;
    margin-right: 32px;
  }
}
.fm-field {
  border-radius: 0;
}
.login-container {
  height: 100%;
  background: url('../../assets/img/login/login_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 164px;
  .logo-pic {
    width: 120px;
    height: 120px;
    background-image: url('../../assets/img/login/new-logo.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .logo-title {
    margin-top: 32px;
    font-size: 60px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #ffffff;
    line-height: 90px;
    letter-spacing: 8px;
    text-shadow: 0px 6px 8px rgba(1, 17, 50, 0.2);
    background-clip: text;
  }
}
.tip {
  margin-bottom: 44px;
  font-size: 36px;
  font-weight: 600;
}
.form-container {
  margin: 72px 50px 0 50px;
  background: url('../../assets/img/login/login_form_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 780px;
  /deep/ .fm-tabs__nav {
    background-color: transparent;
    margin: 0 147px;
    .fm-tab {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
    .fm-tab--active {
      color: #ffffff;
    }
    .fm-tabs__line {
      background: #ffffff;
      border-radius: 6px;
      width: 50px;
    }
  }
  .form-content {
    padding: 0 50px;
    margin-top: 68px;
    .sub-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 28px;
      margin-top: -13px;
      /deep/.fm-checkbox__label {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 33px;
        letter-spacing: 2px;
      }
    }
  }
}
/deep/.fm-checkbox__icon {
  background-color: #f5f5f5;
  height: 24px;
  border-radius: 3px;
}
/deep/.fm-icon {
  border: none;
  width: 24px;
  height: 24px;
}
/deep/ .fm-icon-success:before {
  height: 24px;
  font-size: 24px;
  position: absolute;
  left: -1px;
  top: -1px;
}
/deep/.fm-field__control {
  color: rgba(255, 255, 255, 0.4) !important;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4) !important;
  }
}
.field-username,
.field-pwd {
  padding-left: 0px;
  // background-color: #f5f5f5;
  // height: 75px;
  margin-bottom: 57px;
  border-radius: 12px;
  background: transparent;
  padding-top: 0;
  padding-bottom: 20px;
  /deep/ .fm-cell__value {
    .fm-field__body {
      .fm-icon-clear {
        &::before {
          font-size: 24px;
        }
      }
    }
  }  
}
.field-pwd {
  /deep/ .fm-cell__value {
    .fm-field__body {
      .fm-icon-clear {
        &::before {
          position: absolute;
          bottom: -10px;
        }
      }
    }
  }
}
.field-active {
  /deep/.fm-field__control {
    color: #ffffff !important;
  }
  &::after {
    border-bottom: 2px solid #06b7ee;
  }
}

.footer-container {
  padding-top: 260px;
  display: flex;
  justify-content: center;
  .logo-footer {
    width: 134px;
    height: 20px;
  }
}

.login-btn-container {
  margin: 0 auto;
  padding-top: 64px;
  height: 80px;
  .login-btn {
    width: 100%;
    height: 100%;
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 45px;
    border-radius: 44px;
    border: none;
    background: linear-gradient(270deg, #08aee9 0%, #02a1ff 100%);
  }
}
.fm-field--error ::placeholder {
  color: #999999;
}
/deep/ .fm-field--error .fm-field__control,
.fm-field--error .fm-field__control::placeholder {
  color: #999999;
}
.fm-field ::placeholder {
  color: #999999;
}
</style>
