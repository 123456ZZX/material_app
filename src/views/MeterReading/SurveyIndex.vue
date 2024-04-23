<template>
  <div id='surveyIndex'>
    <book-index :type="'survey'"></book-index>
  </div>
</template>
<script>
import BookIndex from './BookIndex.vue'

export default {
  components: {
    'book-index': BookIndex
  }
}
</script>
<style lang='less' scoped>
#surveyIndex {
  height: 100%;
  background-color: #ecf4ff;
}
</style>
