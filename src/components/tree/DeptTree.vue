<!--
 * @Author: li_kk
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 17:13:34
 * @FilePath: \mobile-template\src\components\tree\DeptTree.vue
 * @Description: 树形选组件，逻辑和样式都需优化
 *
-->
<template>
  <div class="dept-container">
    <fm-cell
      :title="title"
      @click="showTree"
      :is-link="!readonly"
      :required="isCheck"
      :value="readonly == true ? value : ''"
    >
      <div v-if="!readonly && depts[0]">
        <fm-tag
          v-for="(item, index) in depts"
          :key="index"
          color="#eeeeee"
          text-color="#323233"
          :closeable="closeable"
          :round="round"
          @close="deleteCheck(item)"
          type="info"
          >{{ item.name }}
        </fm-tag>
      </div>
    </fm-cell>
    <div>
      <fm-popup :visible.sync="show" @open="onShow" position="bottom" :style="{ height: '100%' }">
        <fm-nav-bar
          title="选择部门"
          left-text="取消"
          right-text="确定"
          background="#027aff"
          textColor="#ffffff"
          @click-left="cancel"
          @click-right="check"
        ></fm-nav-bar>
        <div style="position: relative; top: 10px">
          <fm-search
            style="position: fixed; width: 100%; z-index: 999; color: #000; top: 45px"
            v-model="searchVal"
            @clear="onClear"
            @search="onSearch"
            placeholder="请输入部门"
          ></fm-search>
          <div
            style="
              margin-top: 45px;
              height: calc(100% - 95px);
              overflow: auto;
              background-color: #fff;
            "
          >
            <div class="after-search">
              <div style="height: auto">
                <dept-tree-root
                  v-if="!isSearch"
                  :list="tree"
                  :value="checked"
                  :depts="depts"
                  :checkbox="true"
                  name="name"
                  children="children"
                  :loadData="true"
                  :multiple="multiple"
                  :deptCode="deptCode"
                ></dept-tree-root>
                <dept-tree-root
                  v-if="isSearch"
                  :searchlist.sync="result"
                  :value="checked"
                  :depts="depts"
                  :checkbox="true"
                  type="search"
                  :loadData="true"
                  :multiple="multiple"
                  :deptCode="deptCode"
                ></dept-tree-root>
              </div>
            </div>
          </div>
        </div>
      </fm-popup>
    </div>
  </div>
</template>

<script>
import deptTreeRoot from './DeptTreeRoot'
import { NavBar, Popup, Cell, CellGroup, Tag, Search } from 'fawkes-mobile-lib'
import 'fawkes-mobile-lib/lib/index.css'
import { getDept } from './api'
// import Tag from "../tag/tag"
export default {
  name: 'DeptTree',
  components: {
    deptTreeRoot,
    [NavBar.name]: NavBar,
    [Tag.name]: Tag,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Search.name]: Search,
  },
  props: {
    value: {
      type: String,
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
    // 是否带星号必填
    isCheck: {
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
    // 部门名称
    departmentName: {
      default() {
        return ''
      },
    },
    // 部门id
    departmentId: {
      default() {
        return ''
      },
    },
  },
  mounted() {
    this.$store.dispatch('getDept', {
      id: 0,
      wait: false,
    })
    getDept({}).then((res) => {
      this.tree = res.data
    })
    this.init()
  },
  data() {
    return {
      show: false,
      isSearch: false,
      searchVal: '',
      // list: [],
      checked: [],
      depts: [],
      deptCode: [],
      depCode: '',
      tree: [],
      result: [],
      // id: "",
      checkValue: this.value,
      departmentName1: this.departmentName,
      departmentId1: this.departmentId,
      flag: false,
    }
  },
  methods: {
    showTree() {
      if (this.readonly) {
        return false
      }
      this.show = true
      if (this.depts) {
        this.checkValue = this.checked
      } else {
        return this.checkValue != this.checked
      }
    },
    // 选择按钮
    check() {
      if (!this.checked.length) {
        this.show = false
        this.depts = []
        this.depCode = ''
        return
      }
      this.$emit('input', this.depts.join(','))
      this.show = false
      // console.log("打印 =》", this.depts);

      let arr1 = []
      let arr2 = []
      for (let i in this.depts) {
        arr1.push(this.depts[i].name)
        arr2.push(this.depts[i].orgNo)
        this.departmentName1 = arr1
        this.departmentId1 = arr2
      }
      this.$emit('update:departmentName', this.departmentName1.join(','))
      this.$emit('update:departmentId', this.departmentId1.join(','))
    },
    cancel() {
      if (!this.checked.length) {
        this.show = false
        this.depts = []
        this.depCode = ''
        return
      }
      this.show = false
    },
    // 删除回填的部门
    deleteCheck(val) {
      this.$store.commit('getDeptIdx', '')
      if (this.readonly) {
        return false
      }
      // this.checked = [];
      this.depts.splice(
        this.depts.findIndex((item) => {
          return item === val
        }),
        1
      )
      // this.$nextTick(() => {
      //   this.$emit("input", this.depts.join(","));
      // });
      // console.log(this.checked)
      this.$nextTick(() => {
        this.oldValue = [...this.depts]
        this.$emit('input', this.depts.join(','))
        if (this.multiple == false) {
          this.departmentName1 = ''
          this.$emit('update:departmentName', this.departmentName1)
          this.departmentId1 = ''
          this.$emit('update:departmentId', this.departmentId1)
        } else {
          let arr1 = []
          let arr2 = []
          this.departmentName1 = []
          this.departmentId1 = []
          for (let i in this.depts) {
            arr1.push(this.depts[i].userFullname)
            arr2.push(this.depts[i].userName)
            this.departmentName1 = arr1
            this.departmentId1 = arr2
          }
          this.$emit('update:departmentName', this.departmentName1.join(','))
          this.$emit('update:departmentId', this.departmentId1.join(','))
        }
      })
    },
    onClear() {
      this.isSearch = false
      this.result = []
      getDept({}).then((res) => {
        this.tree = res.data
      })
    },
    onSearch() {
      var val = this.searchVal
      // if (!val) {
      //   this.isSearch = false;
      //   return false;
      // }
      // if (val) {
      //   this.result = this.tree.filter(function (tree) {
      //     return Object.keys(tree).some(function (key) {
      //       return String(tree[key]).indexOf(val) > -1;
      //     });
      //   })
      //   return this.result
      // }
      // this.isSearch = true;
      this.result = []
      if (this.searchVal != '') {
        this.isSearch = true
        // 模糊查询
        this.tree.map((item) => {
          // console.log(item)
          // console.log(item.content.name.indexOf(val))
          if (item.content.name.indexOf(val) != -1) {
            this.result.unshift(item)
          }
        })
      } else {
        this.isSearch = true
        this.result = this.tree
      }
      // console.log(this.result)
    },
    onShow() {
      this.checked = this.value ? this.value.split(',') : []
      this.depts = this.depts ? this.value.split(',') : []
      // this.deptCode = this.deptCode ? this.value.split(",") : []
    },
    init() {
      let userFnames = []
      let userNames = []
      // let userNos = [];
      if (this.departmentName && typeof this.departmentName == 'string') {
        userFnames = this.departmentName.split(',')
      }
      if (this.departmentId && typeof this.departmentId == 'string') {
        userNames = this.departmentId.split(',')
      }
      // else if (this.userNames) {
      //   userNames = this.userNames.val.split(",");
      // }
      // if (this.userNo && typeof this.userNo == "string") {
      //   userNos = this.userNo.split(",");
      // } else if (this.userNo) {
      //   userNos = this.userNo.val.split(",");
      // }
      userFnames.forEach((e, i) => {
        let obj = {
          name: e,
          orgNo: userNames[i],
        }
        this.depts.push(obj)
      })
      this.oldValue = [...this.depts]
    },
  },
  computed: {
    // tree () {
    //   return this.$store.state.deptTree
    // }
  },
  watch: {
    '$store.state.defaultPop'() {
      if (!this.$store.state.defaultPop) {
        this.show = false
      }
    },
    depts() {
      this.checked = this.depts.map((e) => {
        return e.departmentName
      })
    },
    departmentName: {
      deep: true,
      handler: function (newVal) {
        this.value = newVal
        if (this.flag == false) {
          this.depts = []
          this.init()
        }
        this.flag = true
      },
    },
  },
}
</script>

<style scoped>
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
/deep/ .fm-field__control--right {
  text-align: left;
  box-sizing: border-box;
}
</style>
