<!--
 * @Description: 选人组件
 * @Author: ye_xf
 * @Date: 2022-06-06 10:33:38
 * @LastEditTime: 2022-06-10 09:39:15
 * @LastEditors: ye_xf
 * @Reference: 
-->

<template>
  <div class="select-personnel-box">
    <!-- 回显已选人员姓名：多选时仅显示第一个 -->
    <fm-cell :title="title" :required="required" is-link @click="openPopup1">
      <template #default>
        <div class="fullname-view">
          <div v-if="userList.length">
            <span v-if="!multiple">
              {{ userList[0].fullname }}
            </span>
            <span v-else>
              {{ userList[0].fullname }}
              <template v-if="userList.length > 1">
                +{{ userList.length }}
              </template>
            </span>
          </div>
          <span v-else>{{ placeholder }}</span>
        </div>
      </template>
      <template #right-icon>
        <i v-if="!userList.length" class="fm-icon fm-icon-arrow"></i>
      </template>
    </fm-cell>
    <!-- 初始弹框 -->
    <fm-popup
      :visible.sync="popupVisible1"
      position="bottom"
      class="popup1"
      round
      @click-modal="popup1ModalClick"
    >
      <div class="popup-center">
        <div class="top-box">
          <div class="search-box">
            <fm-search
              v-model="searchValue"
              placeholder="请输入待选人员的姓名"
              @search="searchUser1"
            ></fm-search>
          </div>
          <i class="fm-icon fm-icon-add-o" @click="openPopup2"></i>
        </div>
        <!-- 已选人员列表 -->
        <div v-if="userList.length" class="user-list">
          <fm-cell-group>
            <fm-cell
              v-for="user in userList"
              :key="user.name"
              clickable
              @click="deleteSelectedUser(user)"
            >
              <template #title>
                <div class="cell-title">
                  <div class="left-box">{{ user.fullname.substr(0, 1) }}</div>
                  <span class="name">{{ user.fullname }}</span>
                </div>
              </template>
              <template #right-icon>
                <i class="fm-icon fm-icon-close"></i>
              </template>
            </fm-cell>
          </fm-cell-group>
        </div>
        <div v-else class="no-data">暂未选择人员</div>
      </div>
    </fm-popup>
    <!-- 组织机构弹窗 -->
    <fm-popup
      :visible.sync="popupVisible2"
      position="bottom"
      class="popup2"
      round
      @click-modal="popup2ModalClick"
    >
      <div v-if="popupVisible2" class="popup-center">
        <Tree :dataList="orgTree" @treeClick="treeClick"></Tree>
      </div>
    </fm-popup>
    <!-- 人员选择弹框 -->
    <fm-popup
      :visible.sync="popupVisible3"
      position="bottom"
      class="popup3"
      round
      @click-modal="popup3ModalClick"
      @closed="popup3Closed"
    >
      <div class="popup-center">
        <div class="search-box">
          <fm-search
            v-model="searchValue"
            placeholder="请输入待选人员的姓名"
            @search="searchUser2"
            @clear="clearSearch"
          ></fm-search>
        </div>
        <fm-list
          v-model="listLoading"
          :finished="listFinished"
          :immediate-check="false"
          @load="listLoad"
        >
          <!-- 单选 -->
          <template v-if="!multiple">
            <fm-radio-group v-model="radioValue">
              <fm-cell-group>
                <fm-cell
                  v-for="user in targetUserList"
                  :key="user.userName"
                  clickable
                  @click="radioCellClick(user)"
                >
                  <template #title>
                    <div class="cell-title">
                      <div class="left-box">
                        {{ user.userFullname.substr(0, 1) }}
                      </div>
                      <span class="name">{{ user.userFullname }}</span>
                    </div>
                  </template>
                  <template #right-icon>
                    <fm-radio :name="user.userName" />
                  </template>
                </fm-cell>
              </fm-cell-group>
            </fm-radio-group>
          </template>
          <!-- 多选 -->
          <template v-else>
            <fm-checkbox-group v-model="checkboxValue">
              <fm-cell-group>
                <fm-cell
                  v-for="user in targetUserList"
                  :key="user.userName"
                  clickable
                  @click="checkboxCellClick(user)"
                >
                  <template #title>
                    <div class="cell-title">
                      <div class="left-box">
                        {{ user.userFullname.substr(0, 1) }}
                      </div>
                      <span class="name">{{ user.userFullname }}</span>
                    </div>
                  </template>
                  <template #right-icon>
                    <fm-checkbox :ref="user.userName" :name="user.userName" />
                  </template>
                </fm-cell>
              </fm-cell-group>
            </fm-checkbox-group>
          </template>
        </fm-list>
        <div class="confirm-box">
          <span v-if="!multiple">
            已选人员：{{ prepareUserList[0] && prepareUserList[0].fullname }}
          </span>
          <span v-else @click="openPopup4">
            已选人员：{{ prepareUserList[0] && prepareUserList[0].fullname }}
            <template v-if="prepareUserList.length > 1">
              +{{ prepareUserList.length }}
            </template>
          </span>
          <fm-button type="primary" size="small" @click="confirm">
            确定
          </fm-button>
        </div>
      </div>
    </fm-popup>
    <!-- 人员查看弹窗 -->
    <fm-popup
      :visible.sync="popupVisible4"
      position="bottom"
      class="popup4"
      round
      @click-modal="popup4ModalClick"
    >
      <div class="popup-center">
        <fm-cell
          v-for="user in prepareUserList"
          :key="user.name"
          clickable
          @click="deletePrepareUser(user)"
        >
          <template #title>
            <div class="cell-title">
              <div class="left-box">{{ user.fullname.substr(0, 1) }}</div>
              <span class="name">{{ user.fullname }}</span>
            </div>
          </template>
          <template #right-icon>
            <i class="fm-icon fm-icon-close"></i>
          </template>
        </fm-cell>
      </div>
    </fm-popup>
  </div>
</template>

<script>
import { Toast } from 'fawkes-mobile-lib'

import Tree from './components/Tree'

import { getOrgTree, getUserByFullname } from './api'

export default {
  name: 'selectPersonnel',
  components: {
    [Toast.name]: Toast,
    Tree,
  },
  props: {
    //已选人员的用户名数组.toString()
    userName: {
      type: String,
      required: true,
    },
    //已选人员的姓名数组.toString()
    userFullname: {
      type: String,
      required: true,
    },
    //fm-cell title="title" 标题
    title: {
      type: String,
      default: '选择人员',
    },
    //fm-cell required="required" 是否显示必填标识
    required: {
      type: Boolean,
      default: false,
    },
    //是否允许编辑
    disabled: {
      type: Boolean,
      default: false,
    },
    //未选择人员时的提示信息
    placeholder: {
      type: String,
      default: '',
    },
    //是否允许多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //组织机构树最顶级的id
    portalId: {
      type: String,
      default: '1302785644422082562',
    },
  },
  data() {
    return {
      orgTree: [], //组织机构树
      userList: [], //实际使用的已选人员数组
      prepareUserList: [], //操作过程中未确定的人员数组
      popupVisible1: false,
      popupVisible2: false,
      page: 1,
      size: 12,
      maxPage: null,
      orgNo: null,
      searchValue: '',
      targetUserList: [], //可选择的目标人员数组
      popupVisible3: false,
      listLoading: false, //是否正在加载数据
      listFinished: false, //数据是否已全部加载完成
      radioValue: '',
      checkboxValue: [],
      p1ToP3: false, //是否从popup1直接打开popup3
      popupVisible4: false,
    }
  },
  methods: {
    //初始化组件数据
    init() {
      //初始化组织机构树
      const data = {
        portalId: this.portalId,
        isAll: false,
      }

      getOrgTree(data).then((res) => {
        if (res.status) {
          this.orgTree = res.data
        }
      })

      //初始化 userList 和 prepareUserList
      if (!this.userName && !this.userFullname) {
        return
      }

      if (!!this.userName !== !!this.userFullname) {
        Toast('userName 和 userFullname 必须同时进行赋值')
        return
      }

      const userNameList = this.userName.split(',')
      const userFullnameList = this.userFullname.split(',')

      if (userNameList.length !== userFullnameList.length) {
        Toast('userName 和 userFullname 所关联的人员数量不相等')
      } else {
        userNameList.forEach((item, index) => {
          const user = {
            name: userNameList[index],
            fullname: userFullnameList[index],
          }

          this.userList.push(user)
          this.prepareUserList.push(user)
        })
      }
    },
    //打开初始弹窗
    openPopup1() {
      this.popupVisible1 = true
    },
    //打开组织结构弹窗
    openPopup2() {
      this.popupVisible1 = false
      this.popupVisible2 = true
    },
    //打开人员查看弹窗
    openPopup4() {
      this.popupVisible3 = false
      this.popupVisible4 = true
    },
    getTargetUserList() {
      const data = {
        accountStatus: 1,
        pageNo: this.page,
        pageSize: this.size,
        orgNo: this.orgNo,
        searchValue: this.searchValue,
      }

      getUserByFullname(data)
        .then((res) => {
          if (!res.status) {
            Toast('组织机构人员数据获取失败')
            return
          }

          this.targetUserList = [...this.targetUserList, ...res.data.list]
          this.maxPage = Math.ceil(res.data.total / this.size)

          this.maxPage === 1 && (this.listFinished = true)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    treeClick(val) {
      this.popupVisible2 = false
      this.popupVisible3 = true
      this.orgNo = val.content.orgNo

      this.getTargetUserList()
    },
    //人员单选
    radioCellClick(user) {
      this.radioValue = user.userName

      this.prepareUserList = [
        {
          name: user.userName,
          fullname: user.userFullname,
        },
      ]
    },
    //人员多选
    checkboxCellClick(user) {
      this.$refs[user.userName][0].toggle() //切换对应复选框的选中状态

      const result = this.prepareUserList.some((item, index) => {
        if (item.name === user.userName) {
          this.prepareUserList.splice(index, 1)
          return true
        }
      })

      if (!result) {
        this.prepareUserList.push({
          name: user.userName,
          fullname: user.userFullname,
        })
      }
    },
    listLoad() {
      if (!this.maxPage) {
        return
      }

      if (this.page < this.maxPage) {
        this.page += 1
        this.getTargetUserList()
      } else {
        this.listFinished = true
      }
    },
    popup1ModalClick() {
      this.prepareUserList = [...this.userList]

      if (!this.multiple) {
        this.radioValue = this.userList[0] ? this.userList[0].name : ''
      } else {
        let list = []

        this.userList.forEach((user) => {
          list.push(user.name)
        })

        this.checkboxValue = list
      }
    },
    popup2ModalClick() {
      this.popupVisible1 = true
    },
    popup3ModalClick() {
      if (this.p1ToP3) {
        this.p1ToP3 = false
        this.popupVisible1 = true
      } else {
        this.popupVisible2 = true
      }
    },
    popup4ModalClick() {
      this.popupVisible3 = true
    },
    popup3Closed() {
      if (this.popupVisible4) {
        return
      }

      this.page = 1
      this.maxPage = null
      this.orgNo = null
      this.searchValue = ''
      this.targetUserList = []

      this.listFinished = false
    },
    //选人确定
    confirm() {
      //同步数据
      this.userList = [...this.prepareUserList]

      this.uploadProp()

      this.popupVisible3 = false
    },
    //删除已选人员
    deleteSelectedUser(user) {
      if (!this.multiple) {
        //单选
        this.userList = []
        this.prepareUserList = []
        this.radioValue = ''
      } else {
        //多选
        this.userList.some((item, index) => {
          if (item.name === user.name) {
            this.userList.splice(index, 1)
            return true
          }
        })

        this.prepareUserList.some((item, index) => {
          if (item.name === user.name) {
            this.prepareUserList.splice(index, 1)
            return true
          }
        })

        this.checkboxValue.some((item, index) => {
          if (item === user.name) {
            this.checkboxValue.splice(index, 1)
            return true
          }
        })
      }

      this.uploadProp()
    },
    //初始弹框 - 搜索人员
    searchUser1() {
      this.p1ToP3 = true
      this.popupVisible1 = false
      this.popupVisible3 = true

      this.getTargetUserList()
    },
    //人员选择弹框 - 搜索人员
    searchUser2() {
      this.page = 1
      this.maxPage = null
      this.targetUserList = []

      this.listFinished = false

      this.getTargetUserList()
    },
    //人员选择弹框 - 清空搜索
    clearSearch() {
      this.searchUser2()
    },
    deletePrepareUser(user) {
      this.prepareUserList.some((item, index) => {
        if (item.name === user.name) {
          this.prepareUserList.splice(index, 1)
          return true
        }
      })

      this.checkboxValue.some((item, index) => {
        if (item === user.name) {
          this.checkboxValue.splice(index, 1)
          return true
        }
      })
    },
    //更新参数
    uploadProp() {
      let list1 = []
      let list2 = []

      this.userList.forEach((user) => {
        list1.push(user.name)
        list2.push(user.fullname)
      })

      this.$emit('update:userName', list1.toString())
      this.$emit('update:userFullname', list2.toString())
    },
  },
  created() {
    this.init()
  },
}
</script>

<style scoped lang="less">
.select-personnel-box {
  //回显
  .fullname-view {
    color: #333;
  }

  //统一的 cell title 样式
  .cell-title {
    display: flex;
    align-items: center;

    .left-box {
      width: 48px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      font-size: 28px;
      color: #fff;
      background-color: #027aff;
      border-radius: 50%;
    }

    .name {
      max-width: 500px;
      margin-left: 16px;
      font-size: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  //初始弹框
  .popup1 {
    height: 80%;

    .popup-center {
      display: flex;
      flex-direction: column;
      height: 100%;

      .top-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 32px 0;

        .search-box {
          flex: 1;

          .fm-search {
            padding-left: 0;
          }
        }

        & > i {
          font-size: 48px;
          font-weight: bold;
          color: #027aff;
        }
      }

      .user-list {
        flex: 1;

        i {
          font-size: 48px;
          font-weight: bold;
          color: #ff4d4f;
        }
      }

      .no-data {
        padding: 32px;
        text-align: center;
        font-size: 30px;
        color: #ccc;
      }
    }
  }

  //组织机构弹框
  .popup2 {
    height: 80%;
    padding: 32px 32px 0;
    box-sizing: border-box;

    .popup-center {
      max-height: 100%;
      overflow-y: auto;
      //隐藏滚动条
      scrollbar-width: none; //firefox
      -ms-overflow-style: none; //IE 10+

      //隐藏滚动条
      &::-webkit-scrollbar {
        display: none; //Chrome | Safari
      }
    }
  }

  //人员选择弹框
  .popup3 {
    height: 80%;

    .popup-center {
      display: flex;
      flex-direction: column;
      height: 100%;

      .search-box {
        padding-top: 12px;
      }

      .fm-list {
        flex: 1;
        overflow-y: auto;
        //隐藏滚动条
        scrollbar-width: none; //firefox
        -ms-overflow-style: none; //IE 10+

        //隐藏滚动条
        &::-webkit-scrollbar {
          display: none; //Chrome | Safari
        }
      }

      .confirm-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px;

        & > span {
          flex: 1;
          margin-right: 32px;
          font-size: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  //人员查看弹框
  .popup4 {
    height: 80%;

    .popup-center {
      height: 100%;
      padding-top: 12px;
      box-sizing: border-box;
      overflow-y: auto;

      i {
        font-size: 48px;
        font-weight: bold;
        color: #ff4d4f;
      }
    }
  }
}
</style>