<template>
  <div class="address-container">
    <fm-nav-bar :title="navTitle" :border="true">
      <template #left v-if="disableBackArrow">
        <i class="fm-icon fm-icon-arrow-left" @click="back"></i>
      </template>
    </fm-nav-bar>
    <div class="address-box">
      <div>
        <fm-search v-model="searchValue" placeholder="搜索" @search="onSearch" @clear="onClear">
        </fm-search>
      </div>
      <div class="address-tree">
        <fm-cell-group v-if="treeShow">
          <fm-cell
            v-for="item in treeList"
            :key="item.id"
            v-debounce="[
              () => {
                handleClick(item)
              },
              500,
              true,
            ]"
          >
            <template #title>
              <fm-image width="20" height="20" :src="require('@/assets/img/org-tree.png')" />
              <span class="cell-title">{{ item.content.name }}</span>
            </template>
          </fm-cell>
        </fm-cell-group>
        <div class="user-list" v-else>
          <fm-list
            v-model="loading"
            :finished="finished"
            finished-text="我们是有底线的"
            :immediate-check="false"
            @load="onLoad"
            ><fm-cell v-for="item in userList" :key="item.username" @click="viewDetail(item)">
              <template #title>
                <!-- <fm-image width="20" height="20" :src="require('@/assets/img/avatar-list.png')" /> -->
                <img
                  class="head-photo"
                  v-if="item.photoToken"
                  :src="item.photoToken | lookHeadPhoto"
                />
                <div class="head-photo" v-else>{{ item.userFullname | headPhotoSize }}</div>
                <span class="cell-title">{{ item.userFullname }}</span>
              </template>
            </fm-cell>
          </fm-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Search, Cell, CellGroup, Image, List } from 'fawkes-mobile-lib'
import { getDept } from './api'
import { searchUser } from '@/api/user'
import { eventBackButton, exitApp } from '@/utils/app'

export default {
  name: 'Address',
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Image.name]: Image,
    [List.name]: List,
  },
  filters: {
    headPhotoSize: function (value) {
      return value?.substr(0, 1)
    },
    lookHeadPhoto: function (val) {
      return `${process.env.VUE_APP_BASE_URL}/sys-storage/download_image?f8s=${val}`
    },
  },
  data() {
    return {
      searchValue: '',
      treeData: [], // 存放每一级页面部门列表
      treeList: [], // 当前页面部门列表
      userList: [], // 当前页面用户列表
      disableBackArrow: true, // 返回按钮是否显示,默认不显示
      treeShow: true, // 当前页面是否显示部门
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 10,
      accountStatus: 1,
      user: {},
      navTitle: '通讯录',
      depId: [], //记录访问深度\修改navTitle
      nodeItem: null, //当前部门节点
      searchInUserPage: false, // 是否在用户界面查询
    }
  },
  watch: {
    treeList: {
      handler(newVal) {
        if (newVal && newVal.length != 0) {
          for (let i = 0; i < newVal.length; i++) {
            if (newVal[i].parentId == '0') {
              this.disableBackArrow = false
            } else {
              this.disableBackArrow = true
            }
          }
        }
      },
      deep: true,
    },
    depId(newVal) {
      if (newVal.length > 0) {
        document.removeEventListener('backbutton', eventBackButton, false)
        document.removeEventListener('backbutton', exitApp, false)
        document.removeEventListener('backbutton', this.$back, false)
        document.addEventListener('backbutton', this.back, false)
      } else {
        document.addEventListener('backbutton', eventBackButton, false)
        document.removeEventListener('backbutton', this.back, false)
      }
    },
  },
  computed: {
    // 是否在用户列表界面
    inUserPage() {
      // 用部门节点是否为叶子节点判断是在部门还是用户列表页面
      return this.depId.length != 0 && !this.depId.at(-1)?.hasChildren
    },
  },
  mounted() {
    getDept({}).then((res) => {
      if (res.status) {
        this.treeList = res.data
        this.treeData.push(res.data)
      }
    })
  },
  activated() {
    if (this.depId.length > 0) {
      document.addEventListener('backbutton', this.back, false)
      document.removeEventListener('backbutton', this.$back, false)
    } else {
      document.addEventListener('backbutton', eventBackButton, false)
      document.removeEventListener('backbutton', this.$back, false)
    }
  },
  deactivated() {
    if (this.depId.length > 0) {
      document.addEventListener('backbutton', this.$back, false)
      document.removeEventListener('backbutton', this.back, false)
    } else {
      document.removeEventListener('backbutton', eventBackButton, false)
      document.removeEventListener('backbutton', exitApp, false)
      document.addEventListener('backbutton', this.$back, false)
    }
  },
  methods: {
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
        // 人员信息页面
        this.pageNo = 1 //初始化进入时，页码必须为1，否则会被影响
        let data = {
          orgNo: item.content.orgNo,
          searchValue: this.searchValue,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          accountStatus: 1,
        }
        searchUser(data).then((res) => {
          this.userList = res.data.list
          this.treeShow = false
          this.finished = res.data.isLastPage
        })
      }
    },
    //查看用户详情
    viewDetail(item) {
      this.$router.push({
        path: '/address/detail',
        query: { username: item.userName },
      })
    },
    //返回上一级
    back() {
      // this.depId.splice(this.depId.length - 1, 1)
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
        this.navTitle = '通讯录'
        // this.treeData = [this.treeData.shift()]
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
  },
}
</script>
<style scoped lang="less">
.address-container {
  height: 100%;
  background: #eeeeee;
  .address-box {
    height: 100%;
    background: #ffffff;
    .address-tree {
      height: 78%;
      overflow: scroll;
    }
  }
}

.cell-title {
  margin-left: 24px;
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
</style>
