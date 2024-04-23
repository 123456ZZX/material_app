<template>
  <div class="my-page-container">
    <fm-nav-bar title="个人中心" />
    <div class="personal-top">
      <div class="personal-top-left">
        <fm-image
          width="65"
          height="65"
          fit="cover"
          :src="require('@/assets/img/avatar-person.png')"
        />
      </div>
      <div class="personal-top-info">
        <div class="username">{{ userFullName }}</div>
        <!-- <span class="light-font">{{ userDept }}</span> -->
        <span class="light-font">暂无介绍</span>
      </div>
      <div class="personal-top-right" @click="show = true">
        <fm-image
          width="20"
          height="20"
          fit="cover"
          :src="require('@/assets/img/person-qrcode.png')"
        />
      </div>
    </div>
    <fm-cell-group style="margin-top: 20px">
      <fm-cell title="手机" :value="phone"></fm-cell>
      <fm-cell title="邮箱" :value="email"></fm-cell>
      <fm-cell title="公司" :value="userDept"></fm-cell>
      <fm-cell title="部门" :value="userDept"></fm-cell>
      <fm-cell title="权限控制" @click="updateSetting"></fm-cell>
      <!-- <fm-cell title="二维码名片" @click="show = true">
        <template #right-icon>
          <i class="fm-icon fm-icon-qr" scale="3" style="height: 20px; width: 20px"></i>
        </template>
      </fm-cell>
      <fm-cell title="版本信息" value="1.1.0"></fm-cell> -->
    </fm-cell-group>
    <!-- <fm-cell-group style="margin-top: 14px"
      ><fm-cell @click="gotoChangePass" title="修改密码" is-link></fm-cell
    ></fm-cell-group> -->
    <div style="margin-top: 20px">
      <fm-button type="primary" block color="#ffffff" size="large" @click="logout"
        >退出登录</fm-button
      >
    </div>
    <!-- 版本信息 -->
    <div class="version-info">
      <div class="version-number">当前版本V1.0.0329</div>
    </div>
    <!-- 二维码展示遮罩层 -->
    <fm-overlay :show="show">
      <fm-nav-bar
        class="qrcode-header"
        title="我的二维码"
        background="#F2F3F4"
        left-arrow
        @click-left="show = false"
      />
      <div class="wrapper">
        <div class="block">
          <div class="block-top">
            <div class="block-top-left">
              <fm-image
                width="65"
                height="65"
                fit="cover"
                :src="require('@/assets/img/avatar-person.png')"
              />
            </div>
            <div class="personal-top-info">
              <div class="username">{{ userFullName }}</div>
              <span class="light-font">{{ email }}</span>
            </div>
          </div>
          <div class="block-bottom">
            <qrcode :value="qrCodeText" :size="200" />
            <div class="blockText">扫一扫，查看我的名片</div>
          </div>
        </div>
      </div>
    </fm-overlay>
  </div>
</template>
<script>
import { CellGroup, Cell, Button, NavBar, Overlay, Image, Dialog, Toast } from 'fawkes-mobile-lib'
import { logout } from '@/api/login'
import { getUser } from '@/api/user'
import Qrcode from '@/components/qrcode'
import { eventBackButton, exitApp } from '@/utils/app'
import { IS_LOGIN } from '@/store/Mutation/mutationTypes'
import request from '@/utils/request'

export default {
  name: 'PersonalCenter',
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Overlay.name]: Overlay,
    [Image.name]: Image,
    [Toast.name]: Toast,
    Qrcode,
  },
  data() {
    return {
      userFullName: '',
      userDept: '',
      phone: '',
      show: false,
      email: '',
      imageUrl: '',
      // qrcode: "https://fawkes.cybereng.com/",
      loading: false,
    }
  },
  computed: {
    // 可微信扫描查看具体展示的信息
    qrCodeText() {
      let QRText = `BEGIN:VCARD"
      FN: ${this.userFullName}
      TEL: ${this.phone}
      ADR;WORK:浙江省杭州市余杭区高教路201号
      EMAIL;INTERNET,HOME: ${this.email}
      ORG: ${this.userDept};
      END:VCARD`
      return QRText
    },
  },
  watch: {
    show(newVal) {
      // 处理overlay响应物理返回键
      if (newVal) {
        document.removeEventListener('backbutton', eventBackButton, false)
        document.removeEventListener('backbutton', exitApp, false)
        document.addEventListener('backbutton', this.closeOverlay, false)
      } else {
        document.removeEventListener('backbutton', this.closeOverlay, false)
        document.addEventListener('backbutton', eventBackButton, false)
      }
    },
  },
  created() {},
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
  },
  activated() {
    // 页面激活时移除默认的返回上一级路由处理事件，设置退出应用事件
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', eventBackButton, false)
    this.getUserInfo()
    this.userFullName = this.$storage.get('userFullname')
  },
  deactivated() {
    // 页面隐藏时移除退出应用事件，恢复默认的返回上一级路由的处理事件
    document.removeEventListener('backbutton', eventBackButton, false)
    document.removeEventListener('backbutton', exitApp, false)
    document.addEventListener('backbutton', this.$back, false)
  },
  methods: {
    updateSetting() {
      yuanchu.locationAMap.updateSettings()
    },
    logout() {
      document.removeEventListener('backbutton', eventBackButton, false)
      document.removeEventListener('backbutton', exitApp, false)
      Dialog.alert({
        title: '确认退出登录？',
        theme: 'default',
        confirmButtonColor: '#1691e0',
        cancelButtonColor: '#353535',
        showCancelButton: true,
      })
        .then(() => {
          console.log("try移除在线人员信息");
          // 移除在线人员信息
          request({
            url: '/xasw-pipe-operation/remove/onlineLocation',
            method: 'delete',
          }).then((res) => {
            console.log('stop-res: ', res)
          });
          logout()
            .then((res) => {
              if (res.status) {
                this.userFullName = ''
                this.phone = ''
                this.email = ''
                this.userDept = ''
                // 清除keep-alive缓存
                this.removeKeepAliveCache()
                this.$store.commit(IS_LOGIN, false)
                this.$storage.remove('access_token')
                this.$storage.remove('langList')
                this.$router.push('/login')
              }
            })
            .catch(() => {})
        })
        .catch(() => {
          console.log("failsss事实上");
          // 移除dialog绑定的回退事件
          document.removeEventListener('backbutton', this.$back, false)
          document.addEventListener('backbutton', eventBackButton, false)
        })
    },
    getUserInfo() {
      let name = this.$storage.get('username')
      getUser({
        userName: name,
      })
        .then((res) => {
          this.phone = res.data.phone
          this.email = res.data.email
          this.userDept = res.data.orgList[0]?.parentName || '暂无归属'
          // this.imageUrl =
          //    (process.env.NODE_ENV == "development" ? "/api" : "../api") +
          // "/sys-storage/download_image?f8s=" +
          // res.data.photoToken;
        })
        .finally(() => {
          Toast.clear()
        })
    },
    gotoChangePass() {
      this.$router.push('/change')
    },
    closeOverlay() {
      this.show = false
    },
    removeKeepAliveCache() {
      if (this.$vnode.parent) {
        let keys = this.$vnode.parent.componentInstance.keys
        let l = keys.length
        for (let i = 0; i < l; i++) {
          this.removeKeepAliveCacheForVueInstance(keys[0], keys)
        }
      }
    },
    removeKeepAliveCacheForVueInstance(item, keys) {
      let key = item
      if (this.$vnode.parent) {
        let cache = this.$vnode.parent.componentInstance.cache
        if (cache[key]) {
          cache[key].componentInstance.$destroy()
          delete cache[key]
          let index = keys.indexOf(key)
          if (index > -1) {
            keys.splice(index, 1)
          }
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.my-page-container {
  background-color: #f2f3f4;
  height: calc(100% - 50px);
}
.personal-top {
  padding: 0;
  width: 100%;
  height: 234px;
  background: rgba(255, 255, 255, 1);
  display: flex;
}
.personal-top-left {
  width: 130px;
  height: 130px;
  margin-top: 48px;
  margin-left: 30px;
}
.personal-top-info {
  // padding: 40px 0 40px 30px;
  margin-top: 61px;
  margin-left: 24px;
  flex: 1;
  .username {
    font-size: 40px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .light-font {
    font-size: 28px;
    font-weight: 400;
    color: #999999;
    margin-top: 20px;
  }
}
.personal-top-right {
  width: 40px;
  height: 40px;
  margin-top: 61px;
  margin-right: 30px;
}
/deep/ .fm-button--primary {
  color: #ff5454 !important;
  font-weight: 400;
  font-size: 32px;
  height: 110px;
}
/deep/ .fm-cell {
  font-size: 32px;
  font-weight: 400;
  color: #999999;
  padding: 26px 32px;
}
/deep/ .fm-cell__value {
  font-size: 32px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #555555;
}
.version-info {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.version-number {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}
/deep/ .fm-overlay {
  background-color: #f2f3f4;
}
.wrapper {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.qrcode-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.block {
  width: 686px;
  height: 800px;
  border-radius: 8px;
  background-color: #fff;
}
.block-top {
  display: flex;
}
.block-top-left {
  margin-top: 48px;
  margin-left: 56px;
}
.block-top-info {
  margin-top: 61px;
  margin-left: 24px;
}
.block-bottom {
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.blockText {
  margin-top: 26px;
  text-align: center;
  font-size: 28px;
  font-weight: 400;
  color: #999999;
}
.fm-icon-qr:before {
  font-size: 2em;
}
</style>
