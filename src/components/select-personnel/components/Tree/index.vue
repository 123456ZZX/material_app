<!--
 * @Description: 
 * @Author: ye_xf
 * @Date: 2022-06-07 15:30:05
 * @LastEditTime: 2022-06-10 09:36:45
 * @LastEditors: ye_xf
 * @Reference: 
-->

<template>
  <div class="tree-box">
    <div v-for="item in dataList" :key="item.content.id" class="item">
      <div class="top-level-box">
        <i class="fm-icon fm-icon-arrow-down"></i>
        <span class="name">{{ item.content.name }}</span>
      </div>
      <TreeNode
        v-if="item.children"
        :list="item.children"
        :activeId="activeId"
        @setActiveId="setActiveId"
        @treeClick="treeNodeClick"
      ></TreeNode>
    </div>
  </div>
</template>

<script>
import TreeNode from './TreeNode.vue'

export default {
  name: 'tree',
  components: {
    TreeNode,
  },
  props: {
    dataList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeId: '',
    }
  },
  methods: {
    setActiveId(id) {
      this.activeId = id
    },
    treeNodeClick(data) {
      this.$emit('treeClick', data)
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
.tree-box {
  .item {
    .top-level-box {
      display: flex;
      align-items: center;
      line-height: 64px;

      & > i {
        font-size: 28px;
        font-weight: bold;
        color: #999;
      }

      .name {
        flex: 1;
        margin-left: 16px;
        font-size: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>