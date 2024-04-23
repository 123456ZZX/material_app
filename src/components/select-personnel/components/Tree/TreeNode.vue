<!--
 * @Description: 
 * @Author: ye_xf
 * @Date: 2021-09-10 09:18:17
 * @LastEditTime: 2022-06-10 09:37:14
 * @LastEditors: ye_xf
 * @Reference: 
-->

<template>
  <div v-show="!isHide" class="tree-node-box">
    <div v-for="(item, index) in list" :key="item.content.id" class="item">
      <div
        @click="nodeClick(item, index)"
        :class="{ active: item.content.id === activeId }"
      >
        <i
          v-if="item.children && item.children.length"
          class="fm-icon"
          :class="
            indexList.includes(index)
              ? 'fm-icon-arrow-up'
              : 'fm-icon-arrow-down'
          "
        ></i>
        <span
          class="name"
          :class="{ 'ml-24': !item.children || !item.children.length }"
        >
          {{ item.content.name }}
        </span>
      </div>
      <!-- 递归调用组件 -->
      <tree-node
        ref="treeNode"
        :list="item.children ? item.children : []"
        :activeId="activeId"
        @setActiveId="setNodeActiveId"
        @treeClick="treeNodeClick"
      ></tree-node>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeNode',
  props: {
    list: {
      type: Array,
      required: true,
    },
    activeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isHide: false,
      indexList: [], //保存收起状态的下标
      activeIndex: null,
    }
  },
  computed: {},
  watch: {},
  methods: {
    setNodeActiveId(id) {
      this.$emit('setActiveId', id)
    },
    treeNodeClick(data) {
      this.$emit('treeClick', data)
    },
    nodeClick(data, index) {
      this.setNodeActiveId(data.content.id) //递归设置activeId
      this.activeIndex = index

      //若存在，则移除
      if (this.indexList.includes(index)) {
        this.indexList.splice(this.indexList.indexOf(index), 1)
        this.$refs.treeNode[index].show()
      } else {
        this.indexList.push(index)
        this.$refs.treeNode[index].hide()
      }

      if (!data.children || !data.children.length) {
        this.treeNodeClick(data)
        return
      }
    },
    hide() {
      this.isHide = true
    },
    show() {
      this.isHide = false
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
.tree-node-box {
  .item {
    margin-left: 28px;
    line-height: 56px;

    & > div {
      display: flex;
      align-items: center;

      & > i {
        font-size: 28px;
        font-weight: bold;
      }
    }

    .active {
      font-weight: bold;
      color: #027aff;
    }

    .ml-24 {
      margin-left: 24px;
    }

    .name {
      flex: 1;
      margin-left: 16px;
      font-size: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>