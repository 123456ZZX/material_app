<!--
 * @Author: wei_sc
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:38:18
 * @FilePath: \mobile-template\src\components\select-user\index.vue
 * @Description: 选人组件
 *
-->
<template>
  <div class="select-container">
    <div class="select-box">
      <!-- 回填展示数据 -->
      <fm-cell :title="title" is-link @click="selectUser" :required="required">
        <template #default>
          <div v-if="displayData.length && displayData.length != 0">
            <fm-tag
              v-for="(item, index) in displayData"
              :key="index"
              :closeable="!disabled"
              size="medium"
              style="margin-right: 8px"
              @close="handleDelete(index)"
            >
              {{ item.userFullname }}
            </fm-tag>
          </div>
          <span v-else>
            {{ placeholder }}
          </span>
        </template>
        <template #right-icon>
          <i
            v-if="!(displayData.length && displayData.length != 0)"
            class="fm-icon fm-icon-arrow"
          ></i>
        </template>
      </fm-cell>
      <!-- 选择用户界面 -->
      <div class="select-popup">
        <fm-popup
          ref="userPopup"
          :visible.sync="show"
          position="bottom"
          :style="{ height: '100%', overflow: 'hidden' }"
        >
          <fm-nav-bar :title="navTitle" :border="true">
            <template #left>
              <i class="fm-icon fm-icon-arrow-left" @click="back"></i>
            </template>
          </fm-nav-bar>
          <div class="popup-container">
            <div
              :class="['address-box', treeShow ? 'address-box-with-org' : '']"
            >
              <div class="address-search-box">
                <fm-search
                  v-model="searchValue"
                  placeholder="搜索"
                  @search="onSearch"
                  @clear="onClear"
                >
                </fm-search>
              </div>
              <div class="address-tree">
                <fm-cell-group v-if="treeShow">
                  <fm-cell
                    v-for="item in treeList"
                    :key="item.id"
                    @click="handleClick(item)"
                  >
                    <template #title>
                      <fm-image
                        width="20"
                        height="20"
                        :src="require('@/assets/img/org-tree.png')"
                      />
                      <span class="cell-title">{{ item.content.name }}</span>
                    </template>
                  </fm-cell>
                </fm-cell-group>
                <fm-list
                  v-else
                  v-model="loading"
                  :finished="finished"
                  finished-text="我们是有底线的"
                  :immediate-check="false"
                  @load="onLoad"
                >
                  <!-- <fm-checkbox-group v-model="result"> -->
                  <fm-cell-group>
                    <fm-cell
                      v-for="item in userList"
                      :key="item.userName"
                      clickable
                    >
                      <template #title>
                        <img
                          class="head-photo"
                          v-if="item.photoToken"
                          :src="item.photoToken | lookHeadPhoto"
                        />
                        <div class="head-photo" v-else>
                          {{ item.userFullname | headPhotoSize }}
                        </div>
                        <span class="cell-title">{{ item.userFullname }}</span>
                      </template>
                      <template #right-icon>
                        <fm-checkbox
                          v-if="multiple"
                          :name="item"
                          v-model="item.checked"
                        />
                        <fm-radio
                          v-else
                          :name="item.userName"
                          :value="checkedName"
                          @click="handleRaidoCheck(item)"
                        />
                      </template>
                    </fm-cell>
                  </fm-cell-group>
                  <!-- </fm-checkbox-group> -->
                </fm-list>
              </div>
            </div>
            <div class="selected-user" v-if="!treeShow">
              <span class="select-text" @click="viewSelectedUser"
                >已选：{{ result.length }} 人</span
              >
              <div class="select-button">
                <fm-button type="primary" size="small" @click="confirm" native-type="button"
                  >确定</fm-button
                >
              </div>
            </div>
          </div>
        </fm-popup>
      </div>
      <!-- 查看已选择用户界面，可在此处删除，删除后点击确定才会变更result值 -->
      <div>
        <fm-popup
          :visible.sync="viewShow"
          position="bottom"
          :style="{ height: '100%' }"
          :safe-area-inset-bottom="true"
          @closed="afterClosed"
        >
          <fm-nav-bar
            :title="selectTitle"
            :border="true"
            right-text="确定"
            @click-right="saveUser"
          >
            <template #left>
              <i class="fm-icon fm-icon-arrow-left" @click="cancel"></i>
            </template>
          </fm-nav-bar>
          <div class="popup-container">
            <fm-cell-group>
              <fm-cell
                v-for="(item, index) in displayList"
                :key="item.username"
              >
                <template #title>
                  <img
                    class="head-photo"
                    v-if="item.photoToken"
                    :src="item.photoToken | lookHeadPhoto"
                  />
                  <div class="head-photo" v-else>
                    {{ item.userFullname | headPhotoSize }}
                  </div>
                  <span class="cell-title">{{ item.userFullname }}</span>
                </template>
                <template #right-icon>
                  <i
                    class="fm-icon fm-icon-close cus-icon"
                    @click="deleteUser(item, index)"
                  ></i>
                </template>
              </fm-cell>
            </fm-cell-group>
          </div>
        </fm-popup>
      </div>
    </div>
    <fm-notify :visible.sync="notifyShow" type="warning">
      <span>{{ notifyText }}</span>
    </fm-notify>
  </div>
</template>
<script>
import {
  NavBar,
  Search,
  Cell,
  CellGroup,
  Image,
  List,
  Popup,
  Button,
  RadioGroup,
  Radio,
  Tag,
  Checkbox,
  CheckboxGroup,
  Notify,
} from 'fawkes-mobile-lib'
import { STATUS_BAR_HEIGHT } from '@/store/State/stateTypes'
import { getDept } from './api'
import { searchUser } from '@/api/user'

export default {
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Image.name]: Image,
    [List.name]: List,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Tag.name]: Tag,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Notify.Component.name]: Notify.Component,
  },
  filters: {
    headPhotoSize: function (value) {
      return value.substr(0, 1)
    },
    lookHeadPhoto: function (val) {
      return `${process.env.VUE_APP_BASE_URL}/sys-storage/download_image?f8s=${val}`
    },
  },
  props: {
    userName: {
      type: String,
      required: true,
    },
    userFullname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '选择人员',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userList: [],
      userData: [],
      result: [], // 当前选中的用户数组
      displayList: [], // 已选界面展示的用户数组
      displayData: [], // 展示已选的、确认后的数据
      selectUserList: [], //选中的人员数组
      show: false, // 显示选人组件popup界面
      viewShow: false, // 显示已选人员界面
      navTitle: '组织架构',
      searchValue: '',
      treeList: [], //组织架构数据
      treeData: [], // 存放每一级页面部门列表
      treeShow: true, // 当前页面是否显示部门
      loading: false,
      finished: false,
      depId: [], //记录访问深度\修改navTitle, 默认第一级“组织架构”
      pageNo: 1,
      pageSize: 20,
      accountStatus: 1,
      notifyShow: false,
      notifyText: '',
      changePaged: false, // 是否切换部门
      searchInUserPage: false, // 是否在用户界面查询
      nodeItem: null, // 当前部门节点
    }
  },
  computed: {
    // 选中的结果集
    tempResult() {
      // 多选时，获取当前已选中的用户
      if (this.multiple) {
        return this.userList.filter((user) => user.checked)
      } else {
        return this.result
      }
    },
    // 是否在用户列表界面
    inUserPage() {
      // 用部门节点是否为叶子节点判断是在部门还是用户列表页面
      return this.depId.length != 0 && !this.depId.at(-1)?.hasChildren
    },
    selectTitle() {
      return `已选： ${this.displayList.length} 人`
    },
    // 单选的用户名
    checkedName() {
      return this.result[0]?.userName || ''
    },
  },
  watch: {
    //解决FormCenter打开表单时数据不回显问题
    userFullname() {
      this.init()
    },
    tempResult(newVal, oldVal) {
      // 多选
      if (this.multiple) {
        // newVal - oldVal - reuslt 待新增的
        const toAdd = newVal
          .filter(
            (user) => !oldVal.some((val) => user.userName == val.userName)
          )
          .filter(
            (add) => !this.result.some((val) => val.userName == add.userName)
          )

        if (toAdd.length > 0) {
          this.result = this.result.concat(toAdd)
        }

        let toRemove = []

        // 处理切换部门时意外清空选中记录问题
        if (this.changePaged) {
          this.changePaged = false
        } else {
          // 待删除 old-new
          toRemove = oldVal.filter(
            (user) => !newVal.some((val) => user.userName == val.userName)
          )
        }

        // 切换部门时不删除，避免已选中记录被清空
        if (toRemove.length > 0) {
          this.result = this.result.filter(
            (item) => !toRemove.some((val) => val.userName == item.userName)
          )
        }
      } else {
        // 单选
        this.result = newVal
      }
    },
    depId(newVal) {
      if (newVal.length > 0) {
        document.removeEventListener(
          'backbutton',
          this.$refs.userPopup.close,
          false
        )
        document.addEventListener('backbutton', this.back, false)
      } else {
        document.addEventListener(
          'backbutton',
          this.$refs.userPopup.close,
          false
        )
        document.removeEventListener('backbutton', this.back, false)
      }
    },
    viewShow(newVal) {
      if (newVal) {
        document.removeEventListener('backbutton', this.back, false)
        document.addEventListener('backbutton', this.cancel, false)
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    //更新父组件
    updateProps(val) {
      let usernameStr = ''
      let userfullnameStr = ''
      if (val.length == 0) {
        this.$emit('update:userName', '')
        this.$emit('update:userFullname', '')
        this.$emit('change', val) //暴露选人组件的change事件后续需要可以调用
      } else {
        val.forEach((item) => {
          usernameStr += item.userName + ','
          userfullnameStr += item.userFullname + ','
        })
        this.$emit(
          'update:userName',
          usernameStr.substring(0, usernameStr.length - 1)
        )
        this.$emit(
          'update:userFullname',
          userfullnameStr.substring(0, userfullnameStr.length - 1)
        )
        this.$emit('change', val)
      }
    },
    //删除
    handleDelete(index) {
      this.result.splice(index, 1)
      this.displayData = this.result
      this.updateProps(this.result)
    },
    //选择人员\打开弹出层
    selectUser() {
      if (this.disabled) {
        return
      } else {
        this.show = true
        this.treeShow = true
        //获取树形数据
        getDept({}).then((res) => {
          if (res.status) {
            this.treeList = res.data
            this.treeData.push(res.data)
            this.depId.push({
              title: '组织架构',
              id: '0',
              hasChildren: res.data.length > 0,
            })
          }
        })
      }
    },
    //查看已选人员名单
    viewSelectedUser() {
      this.viewShow = true
      this.displayList = Array.from(this.result)
    },
    // 已选择用户界面删除用户
    deleteUser(item, index) {
      this.displayList.splice(index, 1)
    },
    //保存的话会保存操作
    saveUser() {
      this.result = Array.from(this.displayList)
      if (this.multiple) {
        if (this.result.length == 0) {
          this.userList.forEach((user) => {
            this.$set(user, 'checked', false)
          })
        } else {
          this.result.forEach((item) => {
            this.userList.forEach((user) => {
              if (user.userName == item.userName) {
                this.$set(user, 'checked', true)
              } else {
                this.$set(user, 'checked', false)
              }
            })
          })
        }
      }

      this.viewShow = false
    },
    //取消则之前做的操作都取消
    cancel() {
      this.viewShow = false
    },
    //回退
    back() {
      // 清空搜索框
      this.searchValue = ''
      // 查询页面不要弹出标题，清空操作
      if (this.searchInUserPage || (!this.treeShow && !this.inUserPage)) {
        this.onClear()
        return
      } else {
        // 删除当前标题
        this.depId.pop()
      }

      if (this.depId.length > 0) {
        this.navTitle = this.depId[this.depId.length - 1]?.title
      } else {
        // 第一级页面时关闭弹窗且恢复已选值
        this.show = false
        this.result = Array.from(this.displayData)
        return
      }

      if (this.treeShow) {
        this.treeData.pop()
        // 获取上一级部门列表信息
        this.treeList = this.treeData.at(-1)
      } else {
        // 从用户列表页面返回
        this.treeShow = true
      }
    },
    //树形判断
    judgeChild(node, tree) {
      if (tree.length != 0) {
        for (let i = 0; i < tree.length; i++) {
          if (node == tree[i] && tree[i].children) {
            return tree[i].children
          } else if (tree[i].children) {
            this.judgeChild(node, tree[i].children)
          }
        }
      }
    },
    //树形点击后出现子级目录：下级组织机构或者下面的人员
    handleClick(item) {
      this.searchValue = ''
      if (this.treeShow) {
        this.nodeItem = item
      }
      // 跳转新部门前记录上一级
      this.depId.push({
        title: item.content.name,
        id: item.id,
        hasChildren: item?.children?.length > 0,
      })
      this.navTitle = item.content.name
      // 部门页面
      if (this.judgeChild(item, this.treeList)) {
        this.treeList = this.judgeChild(item, this.treeList)
        this.treeData.push(this.treeList)
      } else {
        // 人员列表页面
        this.pageNo = 1 //初始化进入时，页码必须为1，否则会被影响
        let data = {
          orgNo: item.content.orgNo,
          searchValue: this.searchValue,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          accountStatus: 1,
        }
        this.changePaged = true
        searchUser(data).then((res) => {
          this.userList = res.data.list
          this.finished = res.data.isLastPage
          this.treeShow = false
          // 多选
          if (this.multiple) {
            if (this.result.length && this.userList.length) {
              this.result.forEach((item) => {
                this.userList.forEach((user) => {
                  if (item.userName == user.userName) {
                    this.$set(user, 'checked', true)
                  }
                })
              })
            }
          }
        })
      }
    },
    //下拉加载数据
    onLoad() {
      this.pageNo += 1
      let data = {
        orgNo: this.nodeItem?.id,
        searchValue: this.searchValue,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        accountStatus: 1,
      }
      searchUser(data).then((res) => {
        this.userList.push(...res.data.list)
        this.treeShow = false
        if (this.userList.length == res.data.total) {
          this.finished = true
        }
      })
      this.loading = false
    },
    //确认选择
    confirm() {
      this.depId = []
      this.navTitle = '组织架构'
      this.show = false
      this.searchValue = ''
      this.treeList = []
      // 更新回填展示数据
      this.displayData = this.result
      this.updateProps(this.result)
    },
    // 初始化
    init() {
      const userfullnameArr = this.userFullname
        ? this.userFullname.split(',')
        : []
      const usernameArr = this.userName ? this.userName.split(',') : []
      const len = userfullnameArr.length
      const len2 = usernameArr.length

      if (this.userFullname && this.userName) {
        if (len !== len2) {
          this.controlNotifyShow('初始人员数值错误')
          return false
        } else {
          this.displayData = usernameArr.map((userName, index) => {
            return { userName: userName, userFullname: userfullnameArr[index] }
          })
          this.result = Array.from(this.displayData)
        }
      } else if (!this.userfullname && !this.username) {
        this.displayList = []
      } else {
        this.controlNotifyShow(
          '请输入正确的人员数据,人员id和人员名称需同时赋值'
        )
      }
    },
    onSearch(val) {
      // 空条件等同于清空
      if (val === '' || !val) {
        this.onClear()
      } else {
        if (this.inUserPage) {
          this.searchInUserPage = true
        }
        this.pageNo = 1
        let data = {
          searchValue: val,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          accountStatus: 1,
        }
        searchUser(data).then((res) => {
          this.userList = res.data.list
          this.treeShow = false
        })
      }
    },
    onClear() {
      this.searchValue = ''
      // 在用户列表页面清空查询时
      if (this.inUserPage) {
        this.searchInUserPage = false
        this.pageNo = 1
        let data = {
          orgNo: this.nodeItem?.id,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          accountStatus: 1,
        }
        searchUser(data).then((res) => {
          this.userList = res.data.list
          this.treeShow = false
        })
      } else {
        // 在部门列表页面
        this.userList = []
        this.treeShow = true
      }
    },
    controlNotifyShow(text) {
      this.notifyText = text
      this.notifyShow = true
      setTimeout(() => {
        this.notifyShow = false
      }, 1000)
    },
    handleRaidoCheck(item) {
      // this.checkedName = item.userName
      this.result = [item]
    },
    // 第二级弹窗（已选用户界面）关闭后
    afterClosed() {
      document.removeEventListener('backbutton', this.cancel, false)
      // 移除组件关闭时添加的默认事件
      document.removeEventListener('backbutton', this.$back, false)
      document.addEventListener('backbutton', this.back, false)
    },
  },
}
</script>
<style scoped lang="less">
.popup-container {
  // 减去标题栏的高度
  height: calc(100% - 92px);
  display: flex;
  flex-direction: column;
}
.address-search-box {
  margin-bottom: 10px;
}
.selected-user {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-size: 0.21333rem;
  box-sizing: border-box;
  .select-text {
    font-size: 32px;
    color: #027aff;
  }
}

.address-box {
  max-height: calc(100% - 104px);
  background: #f9f9f9;
  flex: 1;
}

// 没有显示选中人信息时
.address-box-with-org {
  max-height: calc(100%);
}

.address-tree {
  height: calc(100% - 124px);
  overflow: scroll;
  .fm-list {
    height: 100%;
  }
}
.cell-title {
  margin-left: 0.32rem;
}

.cus-icon {
  margin: auto 0;
}

/deep/ .fm-nav-bar .fm-icon {
  color: #ffffff;
}

.person-container {
  height: 100%;
  background: #eeeeee;
}
.person-box {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.person-photo {
  margin: 0.42667rem;
}

.person-photo-title {
  margin: 0.4rem 0.8rem;
  /deep/.fm-cell__value--alone {
    text-align: center;
  }
}

.person-photo-title1 {
  margin: 0.4rem 0.8rem;
  /deep/.fm-cell__value--alone {
    text-align: center;
    color: #ffffff;
  }
  /deep/.fm-cell {
    background: #027aff;
  }
}
.fm-cell__title {
  display: flex;
  align-items: center;
}
.head-photo {
  width: 80px;
  height: 80px;
  background: linear-gradient(138deg, #2f95f5 0%, #4088ff 100%);
  opacity: 0.92;
  border-radius: 50%;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 32px;
}
/deep/.fm-notify {
  padding-top: var(--height);
}
</style>
