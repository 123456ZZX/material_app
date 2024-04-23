<!--
 * @Author: wei_sc
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-10 15:34:13
 * @FilePath: \mobile-template\src\components\select-org\index.vue
 * @Description: 选部门组件
 *
-->
<template>
  <div class="select-container">
    <div class="select-box">
      <fm-cell :title="title" is-link @click="selectOrg" :required="required">
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
              {{ item.deptName || item.content.name }}
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
      <div>
        <fm-popup
          :visible.sync="show"
          position="bottom"
          :style="{ height: '100%' }"
          ref="deptPopup"
        >
          <fm-nav-bar :title="navTitle" :border="true">
            <template #left>
              <i class="fm-icon fm-icon-arrow-left" @click="back"></i>
            </template>
          </fm-nav-bar>
          <div class="popup-container">
            <div class="address-box">
              <div class="address-search-box">
                <fm-search v-model="searchValue" placeholder="搜索">
                </fm-search>
              </div>
              <div class="address-tree">
                <!-- <fm-checkbox-group v-model="result"> -->
                <fm-cell-group>
                  <fm-cell v-for="item in treeList" :key="item.id">
                    <template #title>
                      <div @click="handleClick(item)">
                        <fm-image
                          width="20"
                          height="20"
                          :src="require('@/assets/img/org-tree.png')"
                        />
                        <span class="cell-title">{{ item.content.name }}</span>
                      </div>
                    </template>
                    <template #right-icon>
                      <fm-checkbox
                        v-if="multiple"
                        :name="item"
                        v-model="item.checked"
                        label-disabled
                      />
                      <fm-radio
                        v-else
                        :name="item.id"
                        v-model="checkedName"
                        @click="handleRaidoCheck(item)"
                      />
                    </template>
                  </fm-cell>
                </fm-cell-group>
                <!-- </fm-checkbox-group> -->
              </div>
            </div>
            <div class="selected-user">
              <span
                class="select-text"
                v-if="result.length && result.length != 0"
                @click="viewSelectedOrg"
                >已选：{{ result.length }} 部门</span
              >
              <span class="select-text" v-else>已选：0 部门</span>
              <div class="select-button">
                <fm-button type="primary" size="small" @click="confirm"
                  >确定</fm-button
                >
              </div>
            </div>
          </div>
        </fm-popup>
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
              @click-right="saveOrg"
            >
              <template #left>
                <i class="fm-icon fm-icon-arrow-left" @click="cancel"></i>
              </template>
            </fm-nav-bar>
            <div class="popup-container">
              <fm-cell-group>
                <fm-cell v-for="(item, index) in displayList" :key="item.id">
                  <template #title>
                    <div>
                      <fm-image
                        width="20"
                        height="20"
                        :src="require('@/assets/img/org-tree.png')"
                      />
                      <span class="cell-title">{{
                        item.deptName || item.content.name
                      }}</span>
                    </div>
                  </template>
                  <template #right-icon>
                    <i
                      class="fm-icon fm-icon-close"
                      @click="deleteOrg(item, index)"
                    ></i>
                  </template>
                </fm-cell>
              </fm-cell-group>
            </div>
          </fm-popup>
        </div>
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
import { getDept } from '../select-user/api'
import { STATUS_BAR_HEIGHT } from '@/store/State/stateTypes'

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
  props: {
    deptId: {
      type: String,
      required: true,
    },
    deptName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '选择部门',
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
      treeList: [], //组织架构数据
      treeData: {},
      result: [], //部门选择结果
      deptList: ['组织架构'], //记录访问深度\修改navTitle
      displayList: [], // 展示已选部门数组
      displayData: [], // 展示已选的、确认后的数据
      selectList: [],
      index: 0,
      flag: false,
      searchValue: '',
      show: false,
      navTitle: '组织机构',
      viewShow: false,
      notifyShow: false,
      notifyText: '',
      checkedName: '',
      checkedNameRet: [], //单选结果
      changePaged: false,
    }
  },
  computed: {
    // 选中的结果集
    tempResult() {
      // 多选时，获取当前已选中的用户
      if (this.multiple) {
        return this.treeList?.filter((dept) => dept.checked)
      } else {
        return this.checkedNameRet
      }
    },
    selectTitle() {
      return `已选： ${this.displayList.length} 部门`
    },
  },
  watch: {
    navTitle: {
      handler(newVal) {
        if (!newVal || newVal == '') {
          this.navTitle = '组织架构'
        }
      },
    },
    // 解决FormCenter打开表单时数据不回显问题
    deptName: {
      handler() {
        this.init()
      },
    },
    tempResult(newVal, oldVal) {
      // 多选
      if (this.multiple) {
        const toAdd = newVal
          .filter((user) => !oldVal.some((val) => user.id == val.id))
          .filter((add) => !this.result.some((val) => val.id == add.id))

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
            (user) => !newVal.some((val) => user.id == val.id)
          )
        }
        // 切换部门时不删除，避免已选中记录被清空
        if (toRemove.length > 0) {
          this.result = this.result.filter(
            (item) => !toRemove.some((val) => val.id == item.id)
          )
        }
      } else {
        // 单选
        this.result = newVal
      }
    },
    deptList(newVal) {
      // always true
      if (newVal.length > 0) {
        document.removeEventListener(
          'backbutton',
          this.$refs.deptPopup.close,
          false
        )
        document.addEventListener('backbutton', this.back, false)
      }
    },
    viewShow(newVal) {
      // 覆盖第一级弹的返回事件
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
      let dptNameStr = ''
      let dptIdStr = ''
      if (val.length == 0) {
        this.$emit('update:deptId', '')
        this.$emit('update:deptName', '')
        this.$emit('change', val) //暴露选部门组件的change事件后续需要可以调用
      } else {
        val.forEach((item) => {
          dptNameStr += item.content.name + ','
          dptIdStr += item.id + ','
        })
        this.$emit('update:deptId', dptIdStr.substring(0, dptIdStr.length - 1))
        this.$emit(
          'update:deptName',
          dptNameStr.substring(0, dptNameStr.length - 1)
        )
        this.$emit('change', val)
      }
    },
    //处理数据
    init() {
      const dptNameArr = this.deptName ? this.deptName.split(',') : []
      const dptIdArr = this.deptId ? this.deptId.split(',') : []
      const len = dptNameArr.length
      const len2 = dptIdArr.length
      // 单选值处理
      if (!this.multiple) {
        this.checkedName = this.deptId
      }

      if (this.deptName && this.deptId) {
        if (len !== len2) {
          this.controlNotifyShow('初始部门数值错误')
          return false
        } else {
          this.displayData = dptIdArr.map((deptId, index) => {
            return { deptId: deptId, deptName: dptNameArr[index] }
          })
          this.result = Array.from(this.displayData)
        }
      } else if (!this.deptName && !this.deptId) {
        this.displayList = []
      } else {
        this.controlNotifyShow(
          '请输入正确的部门数据,部门id和部门名称需同时赋值'
        )
      }
    },
    //选择部门\打开弹出层
    selectOrg() {
      if (this.disabled) {
        return
      } else {
        this.show = true
        this.changePaged = true
        //获取树形数据
        getDept({}).then((res) => {
          if (res.status) {
            this.treeList = res.data
            this.treeData[this.index] = res.data
            this.index += 1
            if (this.multiple) {
              if (this.displayData.length && this.treeList.length) {
                this.displayData.forEach((item) => {
                  this.treeList.forEach((node) => {
                    if (item.deptId == node.id) {
                      this.$set(node, 'checked', true)
                    }
                  })
                })
              }
            } else {
              this.checkedNameRet = this.displayData
              this.checkedName = this.displayData[0]?.deptId
            }
          }
        })
      }
    },
    handleDelete(index) {
      this.result.splice(index, 1)
      this.displayData = this.result
      this.updateProps(this.result)
    },
    //树形点击后出现子级目录：下级组织机构,限制只有点击复选框才能更改选中状态
    handleClick(item) {
      // 叶子节点不变更页面标题
      if (item?.children?.length > 0) {
        this.navTitle = item.content.name
      }
      this.changePaged = true
      // 存在子部门
      if (this.judgeChild(item, this.treeList)) {
        this.deptList.push(item.content.name)
        this.treeList = this.judgeChild(item, this.treeList)
        this.result.forEach((item) => {
          this.treeList.forEach((node) => {
            if (item.deptId == node.id) {
              this.$set(node, 'checked', true)
            }
          })
        })
        if (this.multiple) {
          this.result = this.result.filter(
            (item) => !this.displayData.some((val) => val.deptId == item.deptId)
          )
        }
        this.treeData[this.index] = this.treeList
        // console.log(this.selectList, this.treeData[this.index], this.result)
        this.index += 1
      } else {
        return
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
    viewSelectedOrg() {
      this.viewShow = true
      this.displayList = Array.from(this.result)
    },
    back() {
      if (this.deptList.length == 1) {
        this.show = false
        this.result = Array.from(this.displayData)
        return
      }
      this.deptList.splice(this.deptList.length - 1, 1)
      this.navTitle = this.deptList[this.deptList.length - 1]
      this.treeList = this.treeData[this.index - 2]
      this.index -= 1
      this.changePaged = true
    },
    //确认选择
    confirm() {
      this.deptList = ['组织架构']
      this.show = false
      this.searchValue = ''
      this.navTitle = '组织架构'
      this.treeList = []
      // 更新回填展示数据
      this.displayData = this.result
      this.updateProps(this.result)
    },
    //删除部门
    deleteOrg(item, index) {
      this.displayList.splice(index, 1)
      // 取消勾选
      // this.treeList.forEach((dept) => {
      //   if (dept.id == item.id) {
      //     dept.checked = false
      //   }
      // })
    },
    //保存的话会保存操作
    saveOrg() {
      this.result = this.displayList
      if (this.multiple) {
        if (this.result.length == 0) {
          this.treeList.forEach((dept) => {
            this.$set(dept, 'checked', false)
          })
        } else {
          this.result.forEach((item) => {
            this.treeList.forEach((dept) => {
              if (dept.id == item.id) {
                this.$set(dept, 'checked', true)
              } else {
                this.$set(dept, 'checked', false)
              }
            })
          })
        }
      }
      this.viewShow = false
      this.$nextTick(() => {
        this.displayList = []
        // 单选清空时重置
        if (this.result.length == 0) {
          this.checkedName = ''
          this.checkedNameRet = []
        }
      })
    },
    //取消则之前做的操作都取消
    cancel() {
      this.viewShow = false
      // this.displayList = []
    },
    change(val) {
      if (val.length != 0) {
        val.length
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
      this.checkedName = item.id
      this.checkedNameRet = [item]
    },
    // 第二级弹窗（已选部门界面）关闭后
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
.fm-cell__title div {
  display: flex;
  align-items: center;
}

.popup-container {
  height: calc(100% - 92px);
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
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

.address-container {
  height: 100%;
  background: #eeeeee;
  .address-box {
    height: 100%;
    background: #f9f9f9;
    .address-tree {
      height: 100%;
      overflow: scroll;
    }
  }
}

.cell-title {
  margin-left: 0.32rem;
}

/deep/.fm-cell {
  font-size: 32px;
  line-height: 52px;
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

  /deep/.fm-checkbox {
    z-index: 999999;
  }
}
.address-box {
  height: calc(100% - 104px);
  background: #f9f9f9;
  flex: 1;
}

.address-tree {
  height: calc(100% - 96px);
  overflow: scroll;
  .fm-list {
    height: 100%;
  }
}
/deep/.fm-notify {
  padding-top: var(--height);
}
</style>
