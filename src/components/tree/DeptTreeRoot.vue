<!--
 * @Author: yan_h
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 17:13:42
 * @FilePath: \mobile-template\src\components\tree\DeptTreeRoot.vue
 * @Description: 部门的树组件，需优化
 *
-->
<template>
  <div>
    <!--部门列表-->
    <ul class="accordion">
      <li v-for="(item, index) in tree" :key="index">
        <div
          class="link"
          @click="openAccordion(item)"
          :class="[$store.state.task.deptId == item.id ? 'hover' : '']"
        >
          <i class="fm-icon fm-icon-cluster-o" style="color: #347df6"></i>
          <div class="username">{{ item.content.name }}</div>
          <!-- <div v-if="item.parentId == '0'"> -->
          <i
            class="fm-icon fm-icon-arrow-down"
            :class="['right-arrow', { openImg: item.open }]"
          ></i>
          <!-- </div> -->
          <!-- <div v-else>
              <fm-checkbox  @click="check(item)" class="tree-checkbox"
              :value="checked.includes(item.content.id)" v-if="checkbox"></fm-checkbox>
            </div> -->
        </div>
        <div :class="'submenu ' + (item.open ? 'openChild' : '')">
          <dept-tree-root
            v-if="item[children]"
            :list="item[children]"
            :value="checked"
            :checkbox="checkbox"
            :name="name"
            :children="children"
            :loadData="loadData"
            :depts="depts"
            :deptCode="deptCode"
            :multiple="multiple"
          ></dept-tree-root>
        </div>
      </li>
    </ul>
    <!--搜索列表-->
    <ul class="accordion">
      <!-- 搜索结果 -->
      <li v-for="(item, index) in searchtree" :key="index">
        <div class="link" style="padding: 0.1rem 1.3rem">
          <fm-checkbox
            @click="check(item)"
            :value="isCheck(item)"
            class="tree-checkbox"
            v-if="checkbox"
          ></fm-checkbox>
          <span style="position: relative; right: 30px">{{ item.content.name }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Icon } from 'fawkes-mobile-lib'
export default {
  name: 'DeptTreeRoot',
  props: {
    // 部门-人员数据
    list: {
      type: Array,
      default() {
        return []
      },
    },
    // 搜索的接口数据
    searchlist: {
      type: Array,
      default() {
        return []
      },
    },
    // 已选列表
    value: {
      type: Array,
      default() {
        return []
      },
    },
    // 保存选择的对象
    depts: {
      type: Array,
      default() {
        return []
      },
    },
    deptCode: {
      type: Array,
      default() {
        return []
      },
    },
    checkbox: {
      type: Boolean,
      default() {
        return false
      },
    },
    children: {
      type: String,
      default: 'children',
    },
    name: {
      type: String,
      default: 'name',
    },
    loadData: {
      type: Boolean,
      default() {
        return false
      },
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Icon.name]: Icon,
  },
  created() {
    this.$store.commit('getDeptIdx', '')
  },
  data() {
    return {
      checked: this.value,
      tree: JSON.parse(JSON.stringify(this.list)),
      searchtree: JSON.parse(JSON.stringify(this.searchlist)),
      idx: '',
    }
  },
  methods: {
    openAccordion(item) {
      // console.log(item)
      // if (this.multiple) {

      // } else {
      this.idx = item.id
      this.$store.commit('getDeptIdx', this.idx)
      this.checked.splice(0, 1, item.content)
      this.depts.splice(0, 1, item.content)
      // }
      // if (this.loadData && !item.open) {
      //   if (item.soncount > 0 && !item[this.children]) {
      //     this.$store.dispatch("getDept", {
      //       id: item.id,
      //       callback: (data) => {
      //         this.$set(item, "children", data);
      //       },
      //     });
      //   }
      // }
      this.$nextTick(() => {
        this.$set(item, 'open', !item.open)
      })
    },
    // 勾选
    check(val) {
      // console.log(this.searchtree)
      let ischd = this.isCheck(val)
      if (this.multiple) {
        // if (!this.checked.includes(val.content.id)) {
        //   this.depts.push(val.content);
        //   // this.checked.push(val.content.id)
        //   this.checked.push(val.content);
        //   this.deptCode.push(val.content.orgNo);
        // } else {
        //   this.store.splice(
        //     this.depts.findIndex((item) => item === val.content),
        //     1
        //   );
        //   // this.checked.splice(this.checked.findIndex(item => item === val.content.id), 1)
        //   this.checked.splice(
        //     this.checked.findIndex((item) => item === val.content),
        //     1
        //   );
        //   this.store.splice(
        //     this.deptCode.findIndex((item) => item === val.content.orgNo),
        //     1
        //   );
        // }
        if (!ischd) {
          if (this.depts.length == 20) {
            this.$vux.toast.text('选择用户到达上限')
            return false
          }
          this.depts.push(val.content)
        } else {
          this.depts.splice(
            this.depts.findIndex((item) => {
              return item == val.content.id
            }),
            1
          )
        }
      } else {
        if (!ischd) {
          this.depts.splice(0, 1, val.content)
        } else {
          this.depts.splice(
            this.depts.findIndex((item) => {
              return item == val.content.id
            }),
            1
          )
        }
        // if (!this.checked.includes(val.content.id)) {
        //   this.depts.splice(0, 1, val.content);
        //   // this.checked.splice(0, 1, val.content.id)
        //   this.checked.splice(0, 1, val.content);
        //   this.deptCode.splice(0, 1, val.content.orgNo);
        // } else {
        //   this.depts.splice(
        //     this.depts.findIndex((item) => item === val.content),
        //     1
        //   );
        //   // this.checked.splice(this.checked.findIndex(item => item === val.content.id), 1)
        //   this.checked.splice(
        //     this.checked.findIndex((item) => item === val.content),
        //     1
        //   );
        //   this.deptCode.splice(
        //     this.deptCode.findIndex((item) => item === val.content.orgNo),
        //     1
        //   );
        // }
      }
      // console.log(this.deptCode)

      this.$emit('input', this.checked)
      this.$emit('input', this.depts)
    },
    isCheck(val) {
      let check = false
      this.depts.forEach((e) => {
        if (e.id == val.content.id) {
          check = true
        }
      })
      return check
    },
    getValues(val) {
      return this.depts
        .map((item) => {
          return item[val]
        })
        .join(',')
      // return this.deptCode.map(item => {
      //   return item[val]
      // }).join(',')
    },
    showarrow(item) {
      if (item.children) {
        if (item.children.length) {
          return true
        }
      }
      if (item.soncount) {
        return true
      }
      return false
    },
  },
  computed: {
    field() {
      return this.checkbox ? 'name' : 'name'
    },
  },
  watch: {
    value() {
      this.checked = this.value
    },
    list() {
      this.tree = JSON.parse(JSON.stringify(this.list))
    },
    searchlist() {
      this.searchtree = JSON.parse(JSON.stringify(this.searchlist))
    },
  },
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.accordion {
  width: 100%;
  margin: 0 auto;
  background: #fff;
  position: static;
}

.usual-tel {
  .submenu {
    padding-left: 0px;
  }
}

.accordion .link {
  display: flex;
  align-items: center;
  padding: 0.1rem 0.3rem;
  font-size: 0.4rem;
  position: relative;
  line-height: 1.5;
  color: #000;
}
.link:before {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: -5px;
  right: 0;
  height: 10px;
  border-bottom: 1px solid #f2f4f6;
  color: #f2f4f6;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.username {
  padding: 0.1rem 0.5rem;
}
.accordion .right-arrow {
  position: absolute;
  right: 0.3rem;
  left: auto;
}

.accordion li svg {
  position: absolute;
  top: 50%;
  left: 1rem;
  width: 1rem;
  height: auto;
  margin-top: -0.5rem;
  color: #999999;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.openImg {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

/**
   * Submenu
   -----------------------------*/
.submenu {
  overflow: hidden;
  padding-left: 1rem;
  opacity: 1;
  max-height: 0px;
  font-size: 0.93rem;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.openChild {
  max-height: 100000vh;
  opacity: 1;
  display: block;
}

li {
  list-style-type: none;
}

.accordion .noline::before {
  border-top: 0;
}
.tree-checkbox {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
}

.state-icon {
  font-size: 0.63rem;
  padding: 4px 0.63rem;
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}
.link.hover {
  color: #4d86ff;
}
</style>
