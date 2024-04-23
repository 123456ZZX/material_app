<!--
 * @Author: li_kk
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-18 17:13:30
 * @FilePath: \mobile-template\src\components\tree\TreeRoot.vue
 * @Description: 选人组件使用的树形组件
 *
-->
<template>
  <div>
    <ul class="accordion" v-if="type == 'normal'">
      <!-- 企业列表 -->
      <li v-for="(item, index) in tree" :key="index">
        <div v-if="item.leaf" @click="checkbox ? check(item) : openPerson(item)">
          <div class="link">
            <i
              class="fm-icon fm-icon-user-o"
              :style="item.sex == '女' ? 'color:#FF6E04' : 'color:#347DF6'"
              style="margin-right: 0.5rem"
            ></i>
            {{ item.userFullname ? item.userFullname : '不详' }}
            <fm-checkbox :value="isCheck(item)" class="tree-checkbox" v-if="checkbox"></fm-checkbox>
            <tag
              class="state-icon"
              v-else-if="item.state"
              :color="setState(item.state)"
              :closable="false"
              :value="item.state"
            ></tag>
          </div>
        </div>
        <div v-else>
          <div class="link" @click="openAccordion(item)">
            <i class="fm-icon fm-icon-cluster-o" style="color: #347df6"></i>
            <div class="username">
              {{ item.content.name }}
            </div>
            <i
              class="fm-icon fm-icon-arrow-down"
              :class="['right-arrow', { openImg: item.open }]"
            ></i>
          </div>
          <div :class="'submenu ' + (item.open ? 'openChild' : '')">
            <tree-root
              v-if="item[children]"
              :list="item[children]"
              :checkbox="checkbox"
              :name="name"
              :children="children"
              :loadData="loadData"
              :type="type"
              :users="users"
              :multiple="multiple"
            ></tree-root>
          </div>
        </div>
      </li>
    </ul>
    <ul class="accordion" v-if="type == 'search'">
      <!-- 搜索结果 -->
      <li v-for="(item, index) in searchtree" :key="index" @click="openPerson(item)">
        <div class="link orgName" style="padding: 5px 15px 5px 15px; background: #eee">
          {{ item.orgList.length != 0 ? item.orgList[0].name : '--' }}
        </div>
        <div class="link noline">
          <i
            class="fm-icon fm-icon-user-o"
            :style="item.sex == '女' ? 'color:#FF6E04' : 'color:#347DF6'"
          ></i>
          {{ item[field] ? item[field] : '不详' }}
          <fm-checkbox
            @click="check(item)"
            :value="isCheck(item)"
            class="tree-checkbox"
            v-if="checkbox"
          ></fm-checkbox>
          <tag
            class="state-icon"
            v-else-if="item.state"
            :color="setState(item.state)"
            :closable="false"
            :value="item.state"
          ></tag>
        </div>
      </li>
    </ul>
    <ul class="accordion" v-if="type == 'normal'">
      <!-- 项目黄页列表 -->
      <li v-for="(item, index) in tree1" :key="index">
        <div v-if="item.leaf" @click="openPerson(item)">
          <div class="link">
            <i
              class="fm-icon fm-icon-user-o"
              :style="item.sex == '女' ? 'color:#FF6E04' : 'color:#347DF6'"
            ></i>
            {{ item[field] ? item[field] : '不详' }}
            <fm-checkbox
              @click="check(item)"
              :value="isCheck(item)"
              class="tree-checkbox"
              v-if="checkbox"
            ></fm-checkbox>
          </div>
        </div>
        <div v-else>
          <div class="link" @click="openAccordionPrj(item)">
            {{ item.prjName ? item.prjName : item.content.name }}
          </div>
          <div :class="'submenu ' + (item.open ? 'openChild' : '')">
            <tree-root
              v-if="item[children]"
              :datalist="item[children]"
              :checkbox="checkbox"
              :name="name"
              :children="children"
              :loadData="loadData"
              :type="type"
              :users="users"
              :multiple="multiple"
            ></tree-root>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Icon } from 'fawkes-mobile-lib'
import { getDeptUser1, getDeptUser2, getDeptUser } from './api'
export default {
  name: 'TreeRoot',
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Icon.name]: Icon,
  },
  props: {
    // 部门-人员数据
    list: {
      // required: true,
      type: Array,
      default() {
        return []
      },
    },
    // 项目黄页
    datalist: {
      // required: true,
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
    // 用户名
    nameData: {
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
    users: {
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
        return true
      },
    },
    type: {
      type: String,
      default() {
        return 'normal'
      },
    },
    // 多选的条件
    multiple: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  mounted() {},
  data() {
    return {
      tree: JSON.parse(JSON.stringify(this.list)),
      tree1: JSON.parse(JSON.stringify(this.datalist)),
      searchtree: JSON.parse(JSON.stringify(this.searchlist)),
    }
  },
  methods: {
    // 获取部门用户
    getPerson(item) {
      getDeptUser(item).then((res) => {
        if (res && res.data) {
          this.$set(
            item,
            this.children,
            res.data.list.map((obj) => {
              obj.leaf = true
              return obj
            })
          )
        }
      })
    },
    openAccordion(item) {
      if (this.loadData && !item.open && this.type != 'tel') {
        if (item.soncount > 0 && !item[this.children]) {
          this.$store.dispatch('getDept', {
            id: item.id,
            wait: true,
            callback: (data) => {
              this.$set(item, this.children, data)
            },
          })
        } else if (
          (!item.soncount || item.soncount == 0) &&
          (!item[this.children] || JSON.stringify(item[this.children]) == '[]')
        ) {
          this.getPerson(item)
        }
      } else if (this.loadData && this.type == 'tel' && item[this.children].length == 0) {
        this.getUsual(item)
      }
      this.$nextTick(() => {
        this.$set(item, 'open', !item.open)
      })
    },
    openAccordionPrj(item) {
      if (this.loadData && !item.open && this.type != 'tel') {
        if (item.flag === 1) {
          getDeptUser1(item.id).then((res) => {
            item.children = res.data.data
          })
        } else if (item.flag != 1) {
          getDeptUser2(item).then((res) => {
            if (res.data && res.data.data) {
              this.$set(
                item,
                this.children,
                res.data.data.list.map((obj) => {
                  obj.leaf = true
                  return obj
                })
              )
            }
          })
        }
      } else if (this.loadData && this.type == 'tel' && item[this.children].length == 0) {
        this.getUsual(item)
      }
      this.$nextTick(() => {
        this.$set(item, 'open', !item.open)
      })
    },
    openAccordionUsual(item) {
      if (item[this.children].length == 0) {
        this.getUsual(item)
      }
      this.$nextTick(() => {
        this.$set(item, 'open', !item.open)
      })
    },
    // 勾选
    check(val) {
      let ischd = this.isCheck(val)
      if (this.multiple) {
        if (!ischd) {
          if (this.users.length == 20) {
            this.$vux.toast.text('选择用户到达上限')
            return false
          }
          this.users.push(val)
        } else {
          this.users.splice(
            this.users.findIndex((item) => {
              return item.userName == val.userName
            }),
            1
          )
        }
      } else {
        if (!ischd) {
          this.users.splice(0, 1, val)
        } else {
          this.users.splice(
            this.users.findIndex((item) => {
              return item.userName == val.userName
            }),
            1
          )
        }
      }
    },
    isCheck(val) {
      let check = false
      this.users.forEach((e) => {
        if (e.userName == val.userName) {
          check = true
        }
      })
      return check
    },

    getUsual(item) {
      this.$http({
        method: 'get',
        url: this.getReqUrl(
          this.INTEGRATEDSUBSYS_URL,
          '_method=PHONENUM.getcommonphone&IsUseMiniUI=true&flag=' + item.flag
        ),
        wait: true,
      }).then((res) => {
        this.$set(
          item,
          'children',
          res.data.ResultData.map((item) => {
            const data = {}
            data.leaf = true
            data.pkid = item.PKID
            data.serde = item.SERDE
            return data
          })
        )
      })
    },
    openPerson(item) {
      if (!this.checkbox) {
        // this.$store.commit("SET_CURRENT_ROW", item);
        this.$router.push({
          name: 'personInfo',
          params: { item: item },
        })
      }
    },
    openUsual() {
      if (!this.checkbox) {
        // this.$store.commit("SET_CURRENT_ROW", item);
        this.$router.path('/addressBook/usualInfo')
      }
    },
    setState(val) {
      let cls = '#3C82F6'
      if (val == '在岗') cls = '#3C82F6'
      else if (val == '请假') cls = '#FF6E04'
      else if (val == '出差') cls = '#22AC38'
      return cls
    },
  },
  computed: {
    field() {
      return this.checkbox ? 'userFullname' : 'userFullname'
    },
  },
  watch: {
    list() {
      this.tree = JSON.parse(JSON.stringify(this.list))
    },
    datalist() {
      this.tree1 = JSON.parse(JSON.stringify(this.datalist))
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
.username {
  padding: 0.1rem 0.5rem;
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
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}

.orgName {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
</style>
