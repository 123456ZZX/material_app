<!--
 * @Author: gao_m3
 * @Date: 2022-05-17 20:57:05
 * @LastEditors: ye_xf
 * @LastEditTime: 2022-05-26 15:10:27
 * @Descripttion: 
-->
.<template>
  <div class="file-upload">
    <Uploader
      @fileChange="fileChange(arguments, -1)"
      v-model="value"
      class="img-upload"
      multiple
      label=""
      :prjName="prjName"
      @updateStatus="handleUpdate"
    />
    <Uploader
      v-if="file"
      type="file"
      @fileChange="fileChange(arguments, 0)"
      v-model="value0"
      class="img-upload"
      multiple
      label=""
      :prjName="prjName"
      @updateStatus="handleUpdate"
    />
  </div>
</template>

<script>
import { uuid } from '@/utils/param'
import { trans } from './api'
import Uploader from '@/components/upload/Uploader'
export default {
  components: {
    Uploader,
  },
  name: 'fileUpload',
  props: {
    file: {
      type: Boolean,
      default: true,
    },
    g9s: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    prjName: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      value: [],
      value0: [],
    }
  },
  methods: {
    handleUpdate(status) {
      this.$emit('update', status)
    },
    fileChange(args, index) {
      let temp = args[0].fileTokenList
      if (index == -1) {
        this.value = temp
      } else {
        this.value0 = temp
      }
      if (this.type == 'g9s') {
        this.handleG9s(this.value.concat(this.value0))
      } else {
        this.handleToken()
      }
    },
    //g9s输出
    handleG9s(tokenList) {
      const groupToken = uuid()

      this.$emit('update:g9s', groupToken)

      let data = {
        groupToken,
        list: tokenList,
      }

      trans(data)
        .then((res) => {
          return
        })
        .catch()
    },
    //token
    handleToken() {
      this.$emit('update:list', this.value.concat(this.value0))
    },
  },
}
</script>

<style lang='less' scoped>
.file-upload {
  overflow: hidden;
}
</style>