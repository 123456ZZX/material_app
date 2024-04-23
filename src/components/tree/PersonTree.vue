<!--
 * @Author: li_kk
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 16:42:25
 * @FilePath: \mobile-template\src\components\tree\PersonTree.vue
 * @Description: 树形选人组件，需优化
 *
-->
<template>
  <div style="height: 100%">
    <!-- 页面显示 -->
    <fm-cell
      :title="title"
      @click="showTree"
      :is-link="!readonly"
      :required="isCheck"
      :value="readonly == true ? userFullname : ''"
    >
      <div v-if="!readonly">
        <fm-tag
          v-for="(item, index) in users"
          :key="index"
          @close="deleteCheck(item)"
          type="info"
          color="#eeeeee"
          text-color="#323233"
          size="large"
          :closeable="closeable"
          :round="round"
        >
          {{ item.userFullname }}
        </fm-tag>
      </div>
    </fm-cell>
    <div>
      <fm-popup :visible.sync="show1" @open="onShow" position="bottom" :style="{ height: '100%' }">
        <fm-nav-bar
          title="选择人员"
          left-text="取消"
          right-text="确定"
          background="#027aff"
          textColor="#ffffff"
          @click-left="cancel"
          @click-right="check"
        ></fm-nav-bar>
        <fm-search
          class="search"
          style="top: 45px"
          v-model="value"
          @search="onSearch"
          @clear="onClear"
          placeholder="请输入姓名/电话号码"
        />
        <div class="main" style="">
          <div class="after-search">
            <div style="height: auto">
              <tree-root
                v-if="!isSearch"
                :list="tree"
                :checkbox="true"
                name="name"
                children="children"
                :users="users"
                :multiple="multiple"
              ></tree-root>
              <tree-root
                v-if="isSearch"
                :nameData="nameData"
                :searchlist="result"
                :checkbox="true"
                type="search"
                :loadData="false"
                :users="users"
                :multiple="multiple"
              ></tree-root>
            </div>
          </div>
        </div>
      </fm-popup>
    </div>
  </div>
</template>

<script>
import TreeRoot from './TreeRoot'
import { NavBar, Popup, Cell, CellGroup, Tag, Search } from 'fawkes-mobile-lib'
import 'fawkes-mobile-lib/lib/index.css'
import { getDeptSearch } from './api'
export default {
  name: 'personTree',
  components: {
    TreeRoot,
    [Tag.name]: Tag,
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Search.name]: Search,
  },
  props: {
    userCode: {
      type: String,
      default() {
        return ''
      },
    },
    userId: {
      type: String,
      default() {
        return ''
      },
    },
    userName: {
      default() {
        return ''
      },
    },
    // 是否带星号必填
    isCheck: {
      type: Boolean,
      default() {
        return false
      },
    },
    // 人员中文名
    userFullname: {
      default() {
        return ''
      },
    },
    // 人员英文名
    userNames: {
      default() {
        return ''
      },
    },
    // 人员所有相关信息
    userInfos: {
      type: Array,
      default() {
        return []
      },
    },
    userNo: {
      default() {
        return ''
      },
    },
    // person 人员/dept  部门
    type: {
      type: String,
      default() {
        return 'normal'
      },
    },
    title: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      },
    },
    readonly: {
      type: Boolean,
      default() {
        return false
      },
    },
    show: {
      type: Boolean,
      default() {
        return false
      },
    },
    //tag是否开启关闭按钮
    closeable: {
      type: Boolean,
      default() {
        return true
      },
    },
    //tag是否开启圆角
    round: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  mounted() {
    this.$store.dispatch('getDept', {
      id: 0,
      wait: false,
    })
    this.init()
  },
  computed: {
    tree() {
      return this.$store.state.addressBook.deptTree
    },
    usernames() {
      let text = ''
      this.oldValue.forEach((e) => {
        text += e.User_FullName + ','
      })
      return text.substr(0, text.length - 1)
    },
  },
  data() {
    return {
      value: '',
      show1: this.show,
      userCode1: this.userCode,
      userFullname1: this.userFullname,
      userNames1: this.userNames,
      userId1: this.userId,
      isSearch: false,
      checked: [],
      users: [],
      oldValue: [],
      nameData: [],
      result: [],
      flag: false,
      prjSearchId: '',
    }
  },
  methods: {
    showTree() {
      if (this.readonly) {
        return false
      }
      this.show1 = true
    },
    // 选择按钮
    check() {
      if (!this.checked.length) {
        this.show1 = false
        return
      }
      this.$emit('input', this.checked.join(','))
      this.oldValue = [...this.users]
      this.show1 = false
      this.userId1 = this.users[0].id
      this.$emit('userId', this.userId1)
      this.userCode1 = this.users[0].userName
      this.$emit('userCode', this.userCode1)

      let arr1 = []
      let arr2 = []
      for (let i in this.users) {
        arr1.push(this.users[i].userFullname)
        arr2.push(this.users[i].userName)
        this.userFullname1 = arr1
        this.userNames1 = arr2
      }
      this.$emit('update:userInfos', this.users)
      this.$emit('update:userFullname', this.userFullname1.join(','))
      this.$emit('update:userNames', this.userNames1.join(','))

      this.$emit('users', this.users)
    },
    cancel() {
      this.users = [...this.oldValue]
      this.show1 = false
    },
    deleteCheck(val) {
      if (this.readonly) {
        return false
      }
      this.users.splice(
        this.users.findIndex((item) => {
          return item === val
        }),
        1
      )
      this.$nextTick(() => {
        this.oldValue = [...this.users]
        this.$emit('input', this.checked.join(','))

        if (this.multiple == false) {
          this.userFullname1 = ''
          this.$emit('update:userFullname', this.userFullname1)
          this.userNames1 = ''
          this.$emit('update:userNames', this.userNames1)
        } else {
          let arr1 = []
          let arr2 = []
          this.userFullname1 = []
          this.userNames1 = []
          for (let i in this.users) {
            arr1.push(this.users[i].userFullname)
            arr2.push(this.users[i].userName)
            this.userFullname1 = arr1
            this.userNames1 = arr2
          }
          this.$emit('update:userFullname', this.userFullname1.join(','))
          this.$emit('update:userNames', this.userNames1.join(','))
        }
      })
    },
    onClear() {
      this.isSearch = false
    },
    onSearch() {
      var val = this.value
      if (!val.trim()) {
        this.isSearch = false
        this.result = []
        return false
      }
      for (let i in this.tree) {
        this.prjSearchId = this.tree[i].content.id
      }
      getDeptSearch(val).then((res) => {
        this.nameData = res.data.list
        this.result = res.data.list
        this.isSearch = true
      })
    },
    getValues(val) {
      return this.users
        .map((item) => {
          return item[val]
        })
        .join(',')
    },
    onShow() {
      this.checked = this.value ? this.value.split(',') : []
    },
    init() {
      let userFnames = []
      let userNames = []
      let userNos = []
      if (this.userFullname && typeof this.userFullname == 'string') {
        userFnames = this.userFullname.split(',')
      }
      if (this.userNames && typeof this.userNames == 'string') {
        userNames = this.userNames.split(',')
      } else if (this.userNames) {
        userNames = this.userNames.val.split(',')
      }
      if (this.userNo && typeof this.userNo == 'string') {
        userNos = this.userNo.split(',')
      } else if (this.userNo) {
        userNos = this.userNo.val.split(',')
      }
      userFnames.forEach((e, i) => {
        let obj = {
          userFullname: e,
          user_no: userNos[i],
          userName: userNames[i],
        }
        this.users.push(obj)
      })
      this.oldValue = [...this.users]
    },
  },
  watch: {
    '$store.state.defaultPop'() {
      if (!this.$store.state.defaultPop) {
        this.show1 = false
      }
    },
    users() {
      this.checked = this.users.map((e) => {
        return e.userFullname
      })
    },
    userFullname: {
      deep: true,
      handler: function (newVal) {
        this.value = newVal
        if (this.flag == false) {
          this.users = []
          this.init()
        }
        this.flag = true
      },
    },
  },
}
</script>

<style scoped lang="less">
.main {
  margin-top: 100px;
  height: calc(100% - 200px);
  overflow: auto;
  background-color: #fff;
}
/deep/ .fm-search__content {
  height: 60px !important;
  line-height: 60px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.search {
  position: fixed;
  width: 100%;
  z-index: 999;
  color: #000;
  text-align: left;
}
/deep/ .fm-field__control--right {
  text-align: left;
  box-sizing: border-box;
}
/deep/ .fm-field__control--right {
  text-align: left;
  box-sizing: border-box;
}
.fm-cell__title {
  margin-left: 5px;
}
._v-container {
  /* background-color: #fff; */
  position: relative;
}
.fm-tag--large {
  padding: 8px 8px !important;
  margin: 4px;
}
/deep/.fm-tag {
  font-size: 32px !important;
}
.fm-tag--info {
  color: #999999 !important;
  background-color: #f0f2f5 !important;
}
.fm-cell__right-icon {
  line-height: 40px;
}
</style>
